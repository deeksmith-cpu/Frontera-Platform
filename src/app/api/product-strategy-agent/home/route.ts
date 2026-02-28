import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent/home
 * Aggregated data for the Strategy Home dashboard.
 */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Run initial queries in parallel
  const [
    conversationResult,
    assessmentResult,
  ] = await Promise.all([
    supabase
      .from('conversations')
      .select('id, framework_state, current_phase, updated_at, last_message_at')
      .eq('clerk_org_id', orgId)
      .eq('agent_type', 'strategy_coach')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('strategic_assessments')
      .select('archetype, overall_maturity, strengths, growth_areas')
      .eq('clerk_org_id', orgId)
      .eq('clerk_user_id', userId)
      .limit(1)
      .single(),
  ]);

  // Signals table may not exist yet — query defensively
  let latestSignals: Array<{ id: string; title: string; signal_type: string; created_at: string }> = [];
  try {
    const signalsResult = await supabase
      .from('strategy_signals')
      .select('id, title, signal_type, created_at')
      .eq('clerk_org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(3);
    if (signalsResult.data) latestSignals = signalsResult.data as typeof latestSignals;
  } catch {
    // Table may not exist yet — signals feature is future
  }

  const conversation = conversationResult.data?.[0] || null;
  const assessment = assessmentResult.data || null;
  const frameworkState = (conversation?.framework_state as Record<string, unknown>) || null;
  const microSynthesis = frameworkState?.microSynthesisResults || null;

  // Conversation-dependent queries
  let territoryData: Array<{ territory: string; research_area: string; status: string }> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let synthesisData: Record<string, any> | null = null;
  let betsData: Array<{ id: string; job_to_be_done: string; kill_date: string | null; status: string }> = [];

  if (conversation) {
    const [territories, synthesis] = await Promise.all([
      supabase
        .from('territory_insights')
        .select('territory, research_area, status')
        .eq('conversation_id', conversation.id),
      supabase
        .from('synthesis_outputs')
        .select('id, opportunities, executive_summary, created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    territoryData = (territories.data || []) as typeof territoryData;
    synthesisData = (synthesis.data?.[0] as Record<string, unknown>) || null;

    // Bets table may not exist yet — query defensively
    try {
      const bets = await supabase
        .from('strategic_bets')
        .select('id, job_to_be_done, kill_date, status')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: false });
      if (bets.data) betsData = bets.data as typeof betsData;
    } catch {
      // Table may not exist yet — bets feature is future
    }
  }

  const mappedAreas = territoryData.filter((t) => t.status === 'mapped').length;
  const totalAreas = 9;

  // Determine current phase
  const currentPhase = (frameworkState?.currentPhase as string) || conversation?.current_phase || 'discovery';

  // Calculate progress percentage
  let progressPct = 0;
  if (currentPhase === 'discovery') progressPct = 10;
  else if (currentPhase === 'research') progressPct = 15 + Math.round((mappedAreas / totalAreas) * 50);
  else if (currentPhase === 'synthesis') progressPct = 70;
  else if (currentPhase === 'bets' || currentPhase === 'planning') progressPct = 85;
  else progressPct = 95;

  // Upcoming kill dates
  const upcomingKillDates = betsData
    .filter((b) => b.kill_date)
    .sort((a, b) => new Date(a.kill_date!).getTime() - new Date(b.kill_date!).getTime())
    .slice(0, 3);

  // Coaching topic suggestion
  let coachingTopic = 'Start your strategy journey with a coaching conversation.';
  if (currentPhase === 'discovery') {
    coachingTopic = 'Let\'s set strategic context. Upload key documents and discuss your competitive landscape.';
  } else if (currentPhase === 'research' && mappedAreas < 3) {
    coachingTopic = 'Continue mapping your strategic terrain. Focus on areas you haven\'t explored yet.';
  } else if (currentPhase === 'research' && mappedAreas >= 3) {
    coachingTopic = 'You\'ve mapped enough territory. Let\'s discuss emerging patterns before synthesis.';
  } else if (currentPhase === 'synthesis') {
    coachingTopic = 'Review your synthesis insights. Which opportunities align best with your capabilities?';
  } else if (currentPhase === 'bets' || currentPhase === 'planning') {
    coachingTopic = 'Refine your strategic bets. Ensure each has measurable metrics and kill criteria.';
  }

  const lastActivity = conversation?.last_message_at || conversation?.updated_at || null;

  return Response.json({
    conversation: conversation ? { id: conversation.id, currentPhase, lastActivity } : null,
    progress: {
      phase: currentPhase,
      percentage: progressPct,
      mappedAreas,
      totalAreas,
      opportunityCount: Array.isArray(synthesisData?.opportunities) ? synthesisData.opportunities.length : 0,
      betCount: betsData.length,
    },
    assessment,
    coachingTopic,
    latestSignals,
    upcomingReviews: upcomingKillDates,
    microSynthesis,
    synthesisPreview: (synthesisData?.executive_summary as string) || null,
  });
}
