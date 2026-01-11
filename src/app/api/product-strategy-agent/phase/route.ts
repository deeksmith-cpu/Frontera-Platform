import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

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

    const supabase = getSupabaseAdmin();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, clerk_org_id, framework_state')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Update framework_state with new phase
    const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
    frameworkState.currentPhase = phase;

    const { data: updated, error: updateError } = await supabase
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

    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.error('Phase update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
