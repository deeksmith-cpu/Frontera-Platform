import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/debate-decisions
 * Retrieve debate decisions for a conversation
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversation_id');
  if (!conversationId) {
    return Response.json({ error: 'conversation_id required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('framework_state')
    .eq('id', conversationId)
    .eq('clerk_org_id', orgId)
    .single();

  if (error || !conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const debateDecisions = (frameworkState?.debateDecisions as unknown[]) || [];

  return Response.json({ decisions: debateDecisions });
}

/**
 * POST /api/product-strategy-agent-v2/debate-decisions
 * Save a debate decision
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversation_id, decision } = body;

  if (!conversation_id || !decision) {
    return Response.json({ error: 'conversation_id and decision required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch current framework_state
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('framework_state')
    .eq('id', conversation_id)
    .eq('clerk_org_id', orgId)
    .single();

  if (fetchError || !conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
  const existing = (frameworkState.debateDecisions as Array<{ tensionId: string }>) || [];

  // Replace existing decision for same tension or add new
  const filtered = existing.filter((d) => d.tensionId !== decision.tensionId);
  filtered.push(decision);

  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      framework_state: { ...frameworkState, debateDecisions: filtered },
    })
    .eq('id', conversation_id)
    .eq('clerk_org_id', orgId);

  if (updateError) {
    return Response.json({ error: 'Failed to save decision' }, { status: 500 });
  }

  return Response.json({ success: true, decisions: filtered });
}
