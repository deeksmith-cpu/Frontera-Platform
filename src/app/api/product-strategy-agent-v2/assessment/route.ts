import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { scoreAssessment } from '@/lib/assessment/scoring';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/assessment
 * Retrieve the user's assessment for the current org.
 */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('strategic_assessments')
    .select('*')
    .eq('clerk_org_id', orgId)
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ assessment: data || null });
}

/**
 * POST /api/product-strategy-agent-v2/assessment
 * Save assessment responses and compute scores.
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { likertResponses, situationalResponses } = body;

  if (!likertResponses || !situationalResponses) {
    return Response.json({ error: 'Missing responses' }, { status: 400 });
  }

  // Score the assessment
  const result = scoreAssessment(likertResponses, situationalResponses);

  const supabase = getSupabaseAdmin();

  // Upsert assessment (one per user per org)
  const { data, error } = await supabase
    .from('strategic_assessments')
    .upsert(
      {
        clerk_user_id: userId,
        clerk_org_id: orgId,
        responses: { likert: likertResponses, situational: situationalResponses },
        dimension_scores: result.dimensions,
        archetype: result.archetype.archetype,
        strengths: result.archetype.strengths,
        growth_areas: result.archetype.growthAreas,
        overall_maturity: result.overallMaturity,
      },
      { onConflict: 'clerk_user_id,clerk_org_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving assessment:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Also update the latest conversation's framework_state with the archetype
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, framework_state')
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'strategy_coach')
    .order('created_at', { ascending: false })
    .limit(1);

  if (conversations && conversations.length > 0) {
    const conv = conversations[0];
    const frameworkState = (conv.framework_state as Record<string, unknown>) || {};
    await supabase
      .from('conversations')
      .update({
        framework_state: {
          ...frameworkState,
          archetype: result.archetype.archetype,
          archetypeLabel: result.archetype.label,
          overallMaturity: result.overallMaturity,
        },
      })
      .eq('id', conv.id);
  }

  return Response.json({ assessment: data, result });
}
