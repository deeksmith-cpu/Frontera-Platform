import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/home
 * Aggregated data for the Strategy Home dashboard.
 */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Run all queries in parallel
  const [
    conversationResult,
    assessmentResult,
    territoryResult,
    synthesisResult,
    betsResult,
    signalsResult,
  ] = await Promise.all([
    // Latest conversation
    supabase
      .from('conversations')
      .select('id, framework_state, current_phase, updated_at, last_message_at')
      .eq('clerk_org_id', orgId)
      .eq('agent_type', 'strategy_coach')
      .order('created_at', { ascending: false })
      .limit(1),
    // Assessment
    supabase
      .from('strategic_assessments')
      .select('archetype, overall_maturity, strengths, growth_areas')
      .eq('clerk_org_id', orgId)
      .eq('clerk_user_id', userId)
      .limit(1)
      .single(),
    // Territory insights
    supabase
      .from('territory_insights')
      .select('territory, research_area, status')
      .eq('conversation_id', orgId) // Will be filtered below
      .order('updated_at', { ascending: false }),
    // Synthesis
    supabase
      .from('synthesis_outputs')
      .select('id, opportunities, executive_summary, created_at')
      .eq('conversation_id', orgId)
      .order('created_at', { ascending: false })
      .limit(1),
    // Strategic bets
    supabase
      .from('strategic_bets')
      .select('id, job_to_be_done, kill_date, status')
      .eq('conversation_id', orgId)
      .order('created_at', { ascending: false }),
    // Signals
    supabase
      .from('strategy_signals')
      .select('id, title, signal_type, created_at')
      .eq('clerk_org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const conversation = conversationResult.data?.[0] || null;
  const assessment = assessmentResult.data || null;
  const frameworkState = (conversation?.framework_state as Record<string, unknown>) || null;
  const microSynthesis = frameworkState?.microSynthesisResults || null;

  // Calculate territory progress
  let conversationTerritories = null;
  if (conversation) {
    const { data: territories } = await supabase
      .from('territory_insights')
      .select('territory, research_area, status')
      .eq('conversation_id', conversation.id);
    conversationTerritories = territories;
  }

  const mappedAreas = conversationTerritories?.filter((t: { status: string }) => t.status === 'mapped').length || 0;
  const totalAreas = 9; // 3 territories x 3 areas

  // Determine current phase
  const currentPhase = conversation?.current_phase || frameworkState?.currentPhase || 'discovery';

  // Calculate progress percentage
  let progressPct = 0;
  if (currentPhase === 'discovery') progressPct = 10;
  else if (currentPhase === 'research') progressPct = 15 + Math.round((mappedAreas / totalAreas) * 50);
  else if (currentPhase === 'synthesis') progressPct = 70;
  else if (currentPhase === 'bets') progressPct = 85;
  else progressPct = 95;

  // Find upcoming kill dates
  const upcomingKillDates = (betsResult.data || [])
    .filter((b: { kill_date: string | null }) => b.kill_date)
    .sort((a: { kill_date: string | null }, b: { kill_date: string | null }) =>
      new Date(a.kill_date!).getTime() - new Date(b.kill_date!).getTime()
    )
    .slice(0, 3);

  // Generate coaching topic suggestion based on state
  let coachingTopic = 'Start your strategy journey with a coaching conversation.';
  if (currentPhase === 'discovery') {
    coachingTopic = 'Let\'s set strategic context. Upload key documents and discuss your competitive landscape.';
  } else if (currentPhase === 'research' && mappedAreas < 3) {
    coachingTopic = 'Continue mapping your strategic terrain. Focus on areas you haven\'t explored yet.';
  } else if (currentPhase === 'research' && mappedAreas >= 3) {
    coachingTopic = 'You\'ve mapped enough territory. Let\'s discuss emerging patterns before synthesis.';
  } else if (currentPhase === 'synthesis') {
    coachingTopic = 'Review your synthesis insights. Which opportunities align best with your capabilities?';
  } else if (currentPhase === 'bets') {
    coachingTopic = 'Refine your strategic bets. Ensure each has measurable metrics and kill criteria.';
  }

  // Last activity timestamp
  const lastActivity = conversation?.last_message_at || conversation?.updated_at || null;

  return Response.json({
    conversation: conversation ? { id: conversation.id, currentPhase, lastActivity } : null,
    progress: {
      phase: currentPhase,
      percentage: progressPct,
      mappedAreas,
      totalAreas,
      opportunityCount: (synthesisResult.data?.[0] as Record<string, unknown[]> | undefined)?.opportunities?.length || 0,
      betCount: betsResult.data?.length || 0,
    },
    assessment,
    coachingTopic,
    latestSignals: signalsResult.data || [],
    upcomingReviews: upcomingKillDates,
    microSynthesis,
    synthesisPreview: (synthesisResult.data?.[0] as Record<string, unknown> | undefined)?.executive_summary as string || null,
    territoryResult: territoryResult.data || [],
  });
}
