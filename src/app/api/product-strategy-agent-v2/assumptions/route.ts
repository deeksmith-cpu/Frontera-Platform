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
 * GET /api/product-strategy-agent-v2/assumptions
 * List all assumptions for the current org.
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversationId');

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('assumption_register')
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

  return Response.json({ assumptions: data });
}

/**
 * POST /api/product-strategy-agent-v2/assumptions
 * Create a new assumption.
 *
 * Body: { conversationId, assumptionText, source, linkedBetIds?, linkedSignalIds? }
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversationId, assumptionText, source, linkedBetIds, linkedSignalIds } = body;

  if (!conversationId || !assumptionText) {
    return Response.json({ error: 'Missing conversationId or assumptionText' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('assumption_register')
    .insert({
      conversation_id: conversationId,
      clerk_org_id: orgId,
      assumption_text: assumptionText,
      source: source || 'manual',
      status: 'untested',
      evidence: null,
      linked_bet_ids: linkedBetIds || [],
      linked_signal_ids: linkedSignalIds || [],
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ assumption: data });
}

/**
 * PATCH /api/product-strategy-agent-v2/assumptions
 * Update an assumption's status or evidence.
 *
 * Body: { assumptionId, status?, evidence?, linkedBetIds?, linkedSignalIds? }
 */
export async function PATCH(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { assumptionId, status, evidence, linkedBetIds, linkedSignalIds } = body;

  if (!assumptionId) {
    return Response.json({ error: 'Missing assumptionId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) updates.status = status;
  if (evidence !== undefined) updates.evidence = evidence;
  if (linkedBetIds) updates.linked_bet_ids = linkedBetIds;
  if (linkedSignalIds) updates.linked_signal_ids = linkedSignalIds;

  const { data, error } = await supabase
    .from('assumption_register')
    .update(updates)
    .eq('id', assumptionId)
    .eq('clerk_org_id', orgId)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ assumption: data });
}

/**
 * DELETE /api/product-strategy-agent-v2/assumptions
 * Delete an assumption.
 *
 * Body: { assumptionId }
 */
export async function DELETE(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { assumptionId } = body;

  if (!assumptionId) {
    return Response.json({ error: 'Missing assumptionId' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('assumption_register')
    .delete()
    .eq('id', assumptionId)
    .eq('clerk_org_id', orgId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
