import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/versions
 * List all strategy versions for a conversation.
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversationId');
  if (!conversationId) {
    return Response.json({ error: 'Missing conversationId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('strategy_versions')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('clerk_org_id', orgId)
    .order('version_number', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ versions: data });
}

/**
 * POST /api/product-strategy-agent-v2/versions
 * Create a strategy version snapshot.
 *
 * Body: { conversationId, trigger }
 * trigger: 'phase_completion' | 'manual' | 'signal_triggered' | 'review'
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversationId, trigger } = body;

  if (!conversationId) {
    return Response.json({ error: 'Missing conversationId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Load current state for snapshot
  const [conversationResult, synthesisResult, betsResult, assumptionsResult, previousVersionResult] =
    await Promise.all([
      supabase
        .from('conversations')
        .select('framework_state, current_phase')
        .eq('id', conversationId)
        .eq('clerk_org_id', orgId)
        .single(),
      supabase
        .from('synthesis_outputs')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('strategic_bets')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true }),
      supabase
        .from('assumption_register')
        .select('*')
        .eq('conversation_id', conversationId),
      supabase
        .from('strategy_versions')
        .select('version_number, snapshot')
        .eq('conversation_id', conversationId)
        .eq('clerk_org_id', orgId)
        .order('version_number', { ascending: false })
        .limit(1),
    ]);

  if (conversationResult.error || !conversationResult.data) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const frameworkState = conversationResult.data.framework_state;
  const currentPhase = conversationResult.data.current_phase;
  const synthesis = synthesisResult.data?.[0] || null;
  const bets = betsResult.data || [];
  const assumptions = assumptionsResult.data || [];
  const previousVersion = previousVersionResult.data?.[0] || null;
  const nextVersionNumber = (previousVersion?.version_number || 0) + 1;

  const snapshot = {
    frameworkState,
    currentPhase,
    synthesis: synthesis
      ? {
          executive_summary: synthesis.executive_summary,
          opportunities: synthesis.opportunities,
          tensions: synthesis.tensions,
        }
      : null,
    bets: bets.map((b: Record<string, unknown>) => ({
      id: b.id,
      bet: b.bet,
      success_metric: b.success_metric,
      job_to_be_done: b.job_to_be_done,
      kill_date: b.kill_date,
      status: b.status,
    })),
    assumptions: assumptions.map((a: Record<string, unknown>) => ({
      id: a.id,
      assumption_text: a.assumption_text,
      status: a.status,
      evidence: a.evidence,
    })),
    snapshotDate: new Date().toISOString(),
  };

  // Generate change narrative if we have a previous version
  let changeNarrative: string | null = null;
  if (previousVersion?.snapshot) {
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const prevSnapshot = previousVersion.snapshot as Record<string, unknown>;

      const narrativePrompt = `You are a strategic advisor. Compare two snapshots of a strategy and generate a brief change narrative.

PREVIOUS STRATEGY (Version ${previousVersion.version_number}):
Phase: ${(prevSnapshot.currentPhase as string) || 'unknown'}
Bets: ${JSON.stringify((prevSnapshot.bets as unknown[]) || [], null, 1).substring(0, 800)}
Assumptions: ${JSON.stringify((prevSnapshot.assumptions as unknown[]) || [], null, 1).substring(0, 800)}

CURRENT STRATEGY (Version ${nextVersionNumber}):
Phase: ${currentPhase}
Bets: ${JSON.stringify(snapshot.bets, null, 1).substring(0, 800)}
Assumptions: ${JSON.stringify(snapshot.assumptions, null, 1).substring(0, 800)}

Trigger for this snapshot: ${trigger || 'manual'}

Generate a concise change narrative (2-4 sentences) covering:
1. What changed between versions
2. Why it likely changed (inferred from trigger and data)
3. Strategic significance

Keep it concise and actionable. Do not use markdown formatting.`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: narrativePrompt }],
      });

      changeNarrative = message.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('');
    } catch (err) {
      console.error('Failed to generate change narrative:', err);
    }
  }

  // Store version
  const { data, error } = await supabase
    .from('strategy_versions')
    .insert({
      conversation_id: conversationId,
      clerk_org_id: orgId,
      version_number: nextVersionNumber,
      snapshot,
      change_narrative: changeNarrative,
      trigger: trigger || 'manual',
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ version: data });
}
