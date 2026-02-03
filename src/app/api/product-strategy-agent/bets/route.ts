import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database, StrategicBetRow, StrategicThesisRow } from '@/types/database';
import type { EvidenceLink } from '@/types/synthesis';
import type {
  BetsResponse,
  CreateBetRequest,
  UpdateBetRequest,
  StrategicBet,
  StrategicThesis,
  StrategicScoring,
  StrategicRisks,
  PriorityLevel,
} from '@/types/bets';
import { calculateOverallScore } from '@/types/bets';
import { trackEvent } from '@/lib/analytics/posthog-server';

// =============================================================================
// Supabase Client
// =============================================================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(url, key);
}

function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =============================================================================
// Helper Functions
// =============================================================================

function determinePriorityLevel(overallScore: number): PriorityLevel {
  if (overallScore >= 75) return 'high';
  if (overallScore >= 50) return 'medium';
  return 'low';
}

function transformBetRow(row: StrategicBetRow): StrategicBet {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    strategicThesisId: row.strategic_thesis_id,
    jobToBeDone: row.job_to_be_done,
    belief: row.belief,
    bet: row.bet,
    successMetric: row.success_metric,
    killCriteria: row.kill_criteria || '',
    killDate: row.kill_date || '',
    status: row.status,
    opportunityId: row.opportunity_id,
    evidenceLinks: (row.evidence_links || []) as unknown as EvidenceLink[],
    assumptionBeingTested: row.assumption_being_tested || '',
    ptwWhereToPlay: row.ptw_where_to_play || '',
    ptwHowToWin: row.ptw_how_to_win || '',
    scoring: {
      expectedImpact: row.expected_impact || 0,
      certaintyOfImpact: row.certainty_of_impact || 0,
      clarityOfLevers: row.clarity_of_levers || 0,
      uniquenessOfLevers: row.uniqueness_of_levers || 0,
      overallScore: row.overall_score || 0,
    },
    priorityLevel: row.priority_level || 'medium',
    confidence: row.confidence || 'medium',
    timeHorizon: row.time_horizon || '6m',
    risks: (row.risks || { market: '', positioning: '', execution: '', economic: '' }) as unknown as StrategicRisks,
    dependsOn: row.depends_on || [],
    agentGenerated: row.agent_generated || false,
    agentReasoning: row.agent_reasoning || undefined,
    userModified: row.user_modified || false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function transformThesisRow(row: StrategicThesisRow): StrategicThesis {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    title: row.title,
    description: row.description,
    opportunityId: row.opportunity_id,
    ptwWinningAspiration: row.ptw_winning_aspiration || '',
    ptwWhereToPlay: row.ptw_where_to_play || '',
    ptwHowToWin: row.ptw_how_to_win || '',
    dhmDelight: row.dhm_delight || '',
    dhmHardToCopy: row.dhm_hard_to_copy || '',
    dhmMarginEnhancing: row.dhm_margin_enhancing || '',
    thesisType: row.thesis_type,
    timeHorizon: row.time_horizon || '6m',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// GET /api/product-strategy-agent/bets
// Fetch all theses and bets with portfolio summary
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversation_id query parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const rawSupabase = getRawSupabase();

    // Fetch all theses
    const { data: thesesData, error: thesesError } = await rawSupabase
      .from('strategic_theses')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (thesesError) {
      console.error('Error fetching theses:', thesesError);
      return NextResponse.json(
        { error: 'Failed to fetch theses' },
        { status: 500 }
      );
    }

    // Fetch all bets
    const { data: betsData, error: betsError } = await rawSupabase
      .from('strategic_bets')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('overall_score', { ascending: false, nullsFirst: false });

    if (betsError) {
      console.error('Error fetching bets:', betsError);
      return NextResponse.json(
        { error: 'Failed to fetch bets' },
        { status: 500 }
      );
    }

    // Transform rows to typed objects
    const theses = (thesesData || []).map(transformThesisRow);
    const bets = (betsData || []).map(transformBetRow);

    // Group bets by thesis
    const thesesWithBets = theses.map((thesis) => ({
      ...thesis,
      bets: bets.filter((bet) => bet.strategicThesisId === thesis.id),
    }));

    // Ungrouped bets (no thesis assigned)
    const ungroupedBets = bets.filter((bet) => !bet.strategicThesisId);

    // Calculate portfolio summary
    const totalBets = bets.length;
    const totalTheses = theses.length;

    const byThesisType = {
      offensive: theses.filter((t) => t.thesisType === 'offensive').length,
      defensive: theses.filter((t) => t.thesisType === 'defensive').length,
      capability: theses.filter((t) => t.thesisType === 'capability').length,
    };

    const avgScore =
      bets.length > 0
        ? Math.round(
            bets.reduce((sum, bet) => sum + bet.scoring.overallScore, 0) / bets.length
          )
        : 0;

    // Kill dates approaching (within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const killDatesApproaching = bets.filter((bet) => {
      if (!bet.killDate) return false;
      const killDate = new Date(bet.killDate);
      return killDate >= now && killDate <= thirtyDaysFromNow;
    }).length;

    const response: BetsResponse = {
      theses: thesesWithBets,
      ungroupedBets,
      portfolioSummary: {
        totalBets,
        totalTheses,
        byThesisType,
        avgScore,
        killDatesApproaching,
      },
    };

    trackEvent('psa_bets_viewed', userId, {
      org_id: orgId,
      conversation_id: conversationId,
      total_bets: totalBets,
      total_theses: totalTheses,
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error('Error fetching bets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/product-strategy-agent/bets
// Create a new strategic bet
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateBetRequest = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const rawSupabase = getRawSupabase();

    // Calculate overall score from dimensions if provided
    let overallScore = 0;
    let priorityLevel: PriorityLevel = 'medium';

    if (
      body.expected_impact !== undefined &&
      body.certainty_of_impact !== undefined &&
      body.clarity_of_levers !== undefined &&
      body.uniqueness_of_levers !== undefined
    ) {
      overallScore = calculateOverallScore({
        expectedImpact: body.expected_impact,
        certaintyOfImpact: body.certainty_of_impact,
        clarityOfLevers: body.clarity_of_levers,
        uniquenessOfLevers: body.uniqueness_of_levers,
      });
      priorityLevel = determinePriorityLevel(overallScore);
    }

    // Insert bet
    const { data: betData, error: insertError } = await rawSupabase
      .from('strategic_bets')
      .insert({
        conversation_id,
        strategic_thesis_id: body.strategic_thesis_id || null,
        job_to_be_done: body.job_to_be_done,
        belief: body.belief,
        bet: body.bet,
        success_metric: body.success_metric,
        kill_criteria: body.kill_criteria || null,
        kill_date: body.kill_date || null,
        status: 'draft',
        opportunity_id: body.opportunity_id,
        evidence_links: body.evidence_links || [],
        assumption_being_tested: body.assumption_being_tested || null,
        ptw_where_to_play: body.ptw_where_to_play || null,
        ptw_how_to_win: body.ptw_how_to_win || null,
        expected_impact: body.expected_impact || null,
        certainty_of_impact: body.certainty_of_impact || null,
        clarity_of_levers: body.clarity_of_levers || null,
        uniqueness_of_levers: body.uniqueness_of_levers || null,
        overall_score: overallScore || null,
        priority_level: priorityLevel,
        confidence: body.confidence || 'medium',
        time_horizon: body.time_horizon || '6m',
        risks: body.risks || { market: '', positioning: '', execution: '', economic: '' },
        depends_on: body.depends_on || [],
        agent_generated: false,
        user_modified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating bet:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to create bet',
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint,
        },
        { status: 500 }
      );
    }

    const bet = transformBetRow(betData);

    trackEvent('psa_bet_created', userId, {
      org_id: orgId,
      conversation_id,
      bet_id: bet.id,
      overall_score: overallScore,
      priority_level: priorityLevel,
    });

    return NextResponse.json({
      success: true,
      bet,
    });
  } catch (error) {
    console.error('Error creating bet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH /api/product-strategy-agent/bets
// Update an existing strategic bet
// =============================================================================

export async function PATCH(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateBetRequest = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const rawSupabase = getRawSupabase();

    // Fetch existing bet to verify ownership
    const { data: existingBet, error: fetchError } = await rawSupabase
      .from('strategic_bets')
      .select('*, conversations!inner(clerk_org_id)')
      .eq('id', id)
      .single();

    if (fetchError || !existingBet) {
      return NextResponse.json({ error: 'Bet not found' }, { status: 404 });
    }

    // Verify ownership via conversation
    const conversationOrgId = (existingBet.conversations as { clerk_org_id: string })?.clerk_org_id;
    if (conversationOrgId !== orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Recalculate overall score if scoring dimensions are being updated
    let overallScore = existingBet.overall_score;
    let priorityLevel = existingBet.priority_level;

    const hasNewScoringData =
      updates.expected_impact !== undefined ||
      updates.certainty_of_impact !== undefined ||
      updates.clarity_of_levers !== undefined ||
      updates.uniqueness_of_levers !== undefined;

    if (hasNewScoringData) {
      const scoringData = {
        expectedImpact: updates.expected_impact ?? existingBet.expected_impact ?? 0,
        certaintyOfImpact: updates.certainty_of_impact ?? existingBet.certainty_of_impact ?? 0,
        clarityOfLevers: updates.clarity_of_levers ?? existingBet.clarity_of_levers ?? 0,
        uniquenessOfLevers: updates.uniqueness_of_levers ?? existingBet.uniqueness_of_levers ?? 0,
      };

      overallScore = calculateOverallScore(scoringData);
      priorityLevel = determinePriorityLevel(overallScore);
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      ...updates,
      user_modified: true,
      updated_at: new Date().toISOString(),
    };

    if (hasNewScoringData) {
      updateData.overall_score = overallScore;
      updateData.priority_level = priorityLevel;
    }

    // Remove id from updates
    delete updateData.id;

    // Update bet
    const { data: updatedBet, error: updateError } = await rawSupabase
      .from('strategic_bets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating bet:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to update bet',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.hint,
        },
        { status: 500 }
      );
    }

    const bet = transformBetRow(updatedBet);

    trackEvent('psa_bet_updated', userId, {
      org_id: orgId,
      bet_id: bet.id,
      conversation_id: bet.conversationId,
      overall_score: overallScore,
      priority_level: priorityLevel,
    });

    return NextResponse.json({
      success: true,
      bet,
    });
  } catch (error) {
    console.error('Error updating bet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/product-strategy-agent/bets
// Delete a strategic bet
// =============================================================================

export async function DELETE(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id query parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const rawSupabase = getRawSupabase();

    // Fetch existing bet to verify ownership
    const { data: existingBet, error: fetchError } = await rawSupabase
      .from('strategic_bets')
      .select('*, conversations!inner(clerk_org_id)')
      .eq('id', id)
      .single();

    if (fetchError || !existingBet) {
      return NextResponse.json({ error: 'Bet not found' }, { status: 404 });
    }

    // Verify ownership via conversation
    const conversationOrgId = (existingBet.conversations as { clerk_org_id: string })?.clerk_org_id;
    if (conversationOrgId !== orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete bet
    const { error: deleteError } = await rawSupabase
      .from('strategic_bets')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting bet:', deleteError);
      return NextResponse.json(
        {
          error: 'Failed to delete bet',
          details: deleteError.message,
          code: deleteError.code,
          hint: deleteError.hint,
        },
        { status: 500 }
      );
    }

    trackEvent('psa_bet_deleted', userId, {
      org_id: orgId,
      bet_id: id,
      conversation_id: existingBet.conversation_id,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting bet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
