import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { trackEvent } from '@/lib/analytics/posthog-server';

// Initialize Supabase Admin Client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(url, key);
}

/**
 * Check if Strategic Bets phase quality gate is met
 * Requirements:
 * - ≥3 bets created
 * - ≥1 strategic thesis grouping bets
 * - All bets have kill criteria defined
 */
async function checkBetsQualityGate(
  supabase: ReturnType<typeof createClient<Database>>,
  conversationId: string
): Promise<{ passed: boolean; message?: string }> {
  // Check thesis count
  const { data: theses, error: thesesError } = await supabase
    .from('strategic_theses')
    .select('id')
    .eq('conversation_id', conversationId);

  if (thesesError) {
    return { passed: false, message: 'Failed to check strategic theses' };
  }

  const thesisCount = theses?.length || 0;
  if (thesisCount < 1) {
    return {
      passed: false,
      message: 'Quality gate not met: At least 1 strategic thesis required. Strategic bets should be grouped under coherent strategic themes.',
    };
  }

  // Check bet count and kill criteria
  const { data: bets, error: betsError } = await supabase
    .from('strategic_bets')
    .select('id, kill_criteria')
    .eq('conversation_id', conversationId);

  if (betsError) {
    return { passed: false, message: 'Failed to check strategic bets' };
  }

  const betCount = bets?.length || 0;
  if (betCount < 3) {
    return {
      passed: false,
      message: `Quality gate not met: At least 3 bets required (currently ${betCount}). A strategic portfolio needs minimum breadth to test key hypotheses.`,
    };
  }

  // Check all bets have kill criteria (using type assertion for partial select)
  const betsWithoutKillCriteria = (bets as Array<{ id: string; kill_criteria: string | null }>)?.filter(
    (bet) => !bet.kill_criteria || bet.kill_criteria.trim() === ''
  );

  if (betsWithoutKillCriteria && betsWithoutKillCriteria.length > 0) {
    return {
      passed: false,
      message: `Quality gate not met: ${betsWithoutKillCriteria.length} bet(s) missing kill criteria. All bets must have pre-committed abandonment conditions to prevent sunk cost fallacy.`,
    };
  }

  return { passed: true };
}

// POST /api/product-strategy-agent/phase
// Update conversation phase (TEMPORARY - for MVP testing only)
// TODO: REMOVE THIS AFTER MVP TESTING - This should be driven by agent logic, not manual navigation
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, phase } = body;

    if (!conversation_id || !phase) {
      return NextResponse.json(
        { error: 'conversation_id and phase are required' },
        { status: 400 }
      );
    }

    // Validate phase
    if (!['discovery', 'research', 'synthesis', 'bets'].includes(phase)) {
      return NextResponse.json(
        { error: 'Invalid phase. Must be discovery, research, synthesis, or bets' },
        { status: 400 }
      );
    }

    // Use raw client to avoid type issues
    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // If transitioning to 'bets' phase, verify synthesis exists
    if (phase === 'bets') {
      const { data: synthesisData } = await rawSupabase
        .from('synthesis_outputs')
        .select('id')
        .eq('conversation_id', conversation_id)
        .limit(1)
        .single();

      if (!synthesisData) {
        return NextResponse.json(
          { error: 'Cannot transition to bets phase without completing synthesis first. Please generate strategic synthesis.' },
          { status: 400 }
        );
      }
    }

    // Verify conversation belongs to user's org
    const { data: convData, error: convError } = await rawSupabase
      .from('conversations')
      .select('id, clerk_org_id, framework_state')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !convData) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Phase order for comparison
    const PHASE_ORDER: Record<string, number> = {
      discovery: 0,
      research: 1,
      synthesis: 2,
      bets: 3,
    };

    // Extract and update framework_state with new phase
    const existingState = ((convData as { framework_state: unknown }).framework_state as Record<string, unknown>) || {};
    const currentHighest = existingState.highestPhaseReached as string | undefined;

    // Only update highestPhaseReached if moving to a higher phase than ever before
    const newHighest = currentHighest && PHASE_ORDER[currentHighest] >= PHASE_ORDER[phase]
      ? currentHighest
      : phase;

    const frameworkState = {
      ...existingState,
      currentPhase: phase,
      highestPhaseReached: newHighest,
    };

    const { data: updated, error: updateError } = await rawSupabase
      .from('conversations')
      .update({
        framework_state: frameworkState,
        current_phase: phase,
      })
      .eq('id', conversation_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating phase:', updateError);
      return NextResponse.json(
        { error: 'Failed to update phase' },
        { status: 500 }
      );
    }

    const previousPhase = existingState.currentPhase as string | undefined;
    trackEvent('psa_phase_changed', userId, {
      org_id: orgId,
      conversation_id,
      from_phase: previousPhase || 'none',
      to_phase: phase,
      highest_phase: newHighest,
    });
    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.error('Phase update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/product-strategy-agent/phase/quality-gate?conversation_id={id}&phase={phase}
// Check if quality gate is met for a specific phase
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');
    const phase = searchParams.get('phase');

    if (!conversationId || !phase) {
      return NextResponse.json(
        { error: 'conversation_id and phase are required' },
        { status: 400 }
      );
    }

    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify conversation belongs to user's org
    const { data: convData, error: convError } = await rawSupabase
      .from('conversations')
      .select('id, clerk_org_id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !convData) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Check quality gate for bets phase
    if (phase === 'bets') {
      const qualityGate = await checkBetsQualityGate(rawSupabase, conversationId);
      return NextResponse.json({
        success: true,
        passed: qualityGate.passed,
        message: qualityGate.message,
      });
    }

    // For other phases, assume passed (no quality gates defined yet)
    return NextResponse.json({
      success: true,
      passed: true,
    });
  } catch (error) {
    console.error('Quality gate check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
