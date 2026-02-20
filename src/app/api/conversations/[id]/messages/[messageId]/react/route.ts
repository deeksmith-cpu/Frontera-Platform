import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/** PATCH — update message reactions (liked, bookmarked) in metadata */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; messageId: string }> }
) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: conversationId, messageId } = await params;
  const body = await req.json();
  const { liked, bookmarked } = body as { liked?: boolean; bookmarked?: boolean };

  const supabase = getSupabaseAdmin();

  // Verify conversation belongs to this org
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('clerk_org_id', orgId)
    .single();

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Get current message metadata
  const { data: message } = await supabase
    .from('conversation_messages')
    .select('metadata')
    .eq('id', messageId)
    .eq('conversation_id', conversationId)
    .single();

  if (!message) {
    return Response.json({ error: 'Message not found' }, { status: 404 });
  }

  const currentMetadata = (message.metadata || {}) as Record<string, unknown>;
  const updatedMetadata = { ...currentMetadata };

  if (liked !== undefined) updatedMetadata.liked = liked;
  if (bookmarked !== undefined) updatedMetadata.bookmarked = bookmarked;

  const { error } = await supabase
    .from('conversation_messages')
    .update({ metadata: updatedMetadata })
    .eq('id', messageId)
    .eq('conversation_id', conversationId);

  if (error) {
    return Response.json({ error: 'Failed to update reaction' }, { status: 500 });
  }

  return Response.json({ ok: true, metadata: updatedMetadata });
}
