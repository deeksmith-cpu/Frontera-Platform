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
