import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildTeamBriefPrompt } from '@/lib/agents/strategy-coach/team-brief-prompt';
import { buildGuardrailsPrompt } from '@/lib/agents/strategy-coach/guardrails-prompt';
import { buildOKRPrompt } from '@/lib/agents/strategy-coach/okr-prompt';
import { buildDecisionFrameworkPrompt } from '@/lib/agents/strategy-coach/decision-framework-prompt';
import { buildStakeholderPackPrompt } from '@/lib/agents/strategy-coach/stakeholder-pack-prompt';
import type { StakeholderAudience } from '@/lib/agents/strategy-coach/stakeholder-pack-prompt';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/activation
 * List all activation artefacts for the current org's latest conversation.
 */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('strategic_artefacts')
    .select('*')
    .eq('clerk_org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ artefacts: data });
}

/**
 * POST /api/product-strategy-agent-v2/activation
 * Generate an activation artefact.
 *
 * Body: { type, conversationId, betId?, audience? }
 * Types: team_brief, guardrails, okr_cascade, decision_framework, stakeholder_pack
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { type, conversationId, betId, audience } = body;

  if (!type || !conversationId) {
    return Response.json({ error: 'Missing type or conversationId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Load context
  const [betsResult, synthesisResult, clientResult] = await Promise.all([
    supabase
      .from('strategic_bets')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }),
    supabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('clients')
      .select('company_name')
      .eq('clerk_org_id', orgId)
      .single(),
  ]);

  const bets = betsResult.data || [];
  const synthesis = synthesisResult.data?.[0] || null;
  const companyName = clientResult.data?.company_name || 'Your Company';

  let prompt: string;
  let artefactTitle: string;

  switch (type) {
    case 'team_brief': {
      const bet = betId ? bets.find((b: { id: string }) => b.id === betId) : bets[0];
      if (!bet) return Response.json({ error: 'No bet found' }, { status: 400 });

      // Load thesis if linked
      let thesis = null;
      if (bet.strategic_thesis_id) {
        const { data: thesisData } = await supabase
          .from('strategic_theses')
          .select('*')
          .eq('id', bet.strategic_thesis_id)
          .single();
        thesis = thesisData;
      }

      prompt = buildTeamBriefPrompt({
        bet,
        thesis,
        synthesisContext: synthesis?.executive_summary || undefined,
        companyName,
      });
      artefactTitle = `Team Brief: ${bet.bet?.substring(0, 60) || 'Strategic Bet'}`;
      break;
    }
    case 'guardrails': {
      const tensions = synthesis?.tensions as Array<{ title?: string; description: string }> || [];
      prompt = buildGuardrailsPrompt({
        bets: bets.map((b: { bet: string; job_to_be_done: string }) => ({ bet: b.bet, job_to_be_done: b.job_to_be_done })),
        tensions,
        synthesisHighlights: synthesis?.executive_summary || undefined,
        companyName,
      });
      artefactTitle = 'Strategic Guardrails';
      break;
    }
    case 'okr_cascade': {
      prompt = buildOKRPrompt({
        bets: bets.map((b: { bet: string; success_metric: string; job_to_be_done: string }) => ({
          bet: b.bet,
          success_metric: b.success_metric,
          job_to_be_done: b.job_to_be_done,
        })),
        companyName,
      });
      artefactTitle = 'OKR Cascade';
      break;
    }
    case 'decision_framework': {
      // Load existing guardrails artefact
      const { data: guardrailsArtefact } = await supabase
        .from('strategic_artefacts')
        .select('content')
        .eq('conversation_id', conversationId)
        .eq('artefact_type', 'guardrails')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const guardrails = (guardrailsArtefact?.content as Record<string, unknown>)?.guardrails as Array<{ weWill: string; weWillNot: string }> || [];
      prompt = buildDecisionFrameworkPrompt({
        guardrails,
        bets: bets.map((b: { bet: string }) => ({ bet: b.bet })),
        companyName,
      });
      artefactTitle = 'Decision Framework';
      break;
    }
    case 'stakeholder_pack': {
      if (!audience) return Response.json({ error: 'Missing audience' }, { status: 400 });

      // Load existing guardrails
      const { data: guardrailsData } = await supabase
        .from('strategic_artefacts')
        .select('content')
        .eq('conversation_id', conversationId)
        .eq('artefact_type', 'guardrails')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const existingGuardrails = (guardrailsData?.content as Record<string, unknown>)?.guardrails as Array<{ weWill: string; weWillNot: string }> || [];
      prompt = buildStakeholderPackPrompt({
        bets: bets.map((b: { bet: string; success_metric: string; job_to_be_done: string }) => ({
          bet: b.bet,
          success_metric: b.success_metric,
          job_to_be_done: b.job_to_be_done,
        })),
        guardrails: existingGuardrails,
        audience: audience as StakeholderAudience,
        companyName,
      });
      artefactTitle = `Stakeholder Brief: ${audience}`;
      break;
    }
    default:
      return Response.json({ error: `Unknown artefact type: ${type}` }, { status: 400 });
  }

  // Call Claude
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Parse JSON from response
    let content: Record<string, unknown>;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      content = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: responseText };
    } catch {
      content = { raw: responseText };
    }

    // Store artefact
    const { data: artefact, error: insertError } = await supabase
      .from('strategic_artefacts')
      .insert({
        conversation_id: conversationId,
        clerk_org_id: orgId,
        artefact_type: type,
        title: artefactTitle,
        content,
        audience: audience || null,
        share_token: crypto.randomUUID(),
        is_living: true,
        source_bet_id: betId || null,
      })
      .select()
      .single();

    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }

    return Response.json({ artefact });
  } catch (err) {
    console.error('Error generating artefact:', err);
    return Response.json({ error: 'Failed to generate artefact' }, { status: 500 });
  }
}
