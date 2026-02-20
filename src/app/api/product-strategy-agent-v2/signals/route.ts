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
 * GET /api/product-strategy-agent-v2/signals
 * List all signals for the current org.
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversationId');

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('strategy_signals')
    .select('*')
    .eq('clerk_org_id', orgId)
    .order('created_at', { ascending: false });

  if (conversationId) {
    query = query.eq('conversation_id', conversationId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ signals: data });
}

/**
 * POST /api/product-strategy-agent-v2/signals
 * Create a new signal with AI impact assessment.
 *
 * Body: { conversationId, signalType, title, description, linkedAssumptionIds? }
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversationId, signalType, title, description, linkedAssumptionIds } = body;

  if (!conversationId || !signalType || !title || !description) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Load current strategy context for AI impact assessment
  const [betsResult, assumptionsResult] = await Promise.all([
    supabase
      .from('strategic_bets')
      .select('bet, success_metric, job_to_be_done')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }),
    supabase
      .from('assumption_register')
      .select('id, assumption_text, status')
      .eq('conversation_id', conversationId),
  ]);

  const bets = betsResult.data || [];
  const assumptions = assumptionsResult.data || [];

  // Generate AI impact assessment
  let impactAssessment: string | null = null;
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const assessmentPrompt = `You are a strategic advisor. A new signal has been detected. Assess its strategic impact.

SIGNAL:
- Type: ${signalType}
- Title: ${title}
- Description: ${description}

CURRENT STRATEGIC BETS:
${bets.map((b: { bet: string; success_metric: string }, i: number) => `${i + 1}. ${b.bet} (Success: ${b.success_metric})`).join('\n') || 'No bets defined yet.'}

CURRENT ASSUMPTIONS:
${assumptions.map((a: { assumption_text: string; status: string }, i: number) => `${i + 1}. [${a.status.toUpperCase()}] ${a.assumption_text}`).join('\n') || 'No assumptions tracked yet.'}

Provide a brief impact assessment (2-3 sentences) covering:
1. Which strategic bets are most affected
2. Which assumptions should be re-evaluated
3. Recommended action (monitor, investigate, or pivot)

Keep the response concise and actionable. Do not use markdown formatting.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [{ role: 'user', content: assessmentPrompt }],
    });

    impactAssessment = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');
  } catch (err) {
    console.error('Failed to generate impact assessment:', err);
    // Continue without assessment — non-blocking
  }

  // Store signal
  const { data, error } = await supabase
    .from('strategy_signals')
    .insert({
      conversation_id: conversationId,
      clerk_org_id: orgId,
      signal_type: signalType,
      title,
      description,
      impact_assessment: impactAssessment,
      linked_assumption_ids: linkedAssumptionIds || [],
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ signal: data });
}

/**
 * PATCH /api/product-strategy-agent-v2/signals
 * Update a signal.
 *
 * Body: { signalId, linkedAssumptionIds?, impactAssessment? }
 */
export async function PATCH(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { signalId, linkedAssumptionIds, impactAssessment } = body;

  if (!signalId) {
    return Response.json({ error: 'Missing signalId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (linkedAssumptionIds) updates.linked_assumption_ids = linkedAssumptionIds;
  if (impactAssessment !== undefined) updates.impact_assessment = impactAssessment;

  const { data, error } = await supabase
    .from('strategy_signals')
    .update(updates)
    .eq('id', signalId)
    .eq('clerk_org_id', orgId)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ signal: data });
}

/**
 * DELETE /api/product-strategy-agent-v2/signals
 * Delete a signal.
 */
export async function DELETE(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { signalId } = body;

  if (!signalId) {
    return Response.json({ error: 'Missing signalId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('strategy_signals')
    .delete()
    .eq('id', signalId)
    .eq('clerk_org_id', orgId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
