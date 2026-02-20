import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, key);
}

// PATCH /api/product-strategy-agent-v2/bets/[id] - Update bet
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const updates = await req.json();

    // Remove fields that shouldn't be updated directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at, updated_at, conversation_id, ...validUpdates } = updates;

    // Mark as user-modified
    validUpdates.user_modified = true;
    validUpdates.updated_at = new Date().toISOString();

    const supabase = getSupabaseAdmin();

    // Update bet
    const { data, error } = await supabase
      .from('strategic_bets')
      .update(validUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating bet:', error);
      return NextResponse.json({ error: 'Failed to update bet' }, { status: 500 });
    }

    return NextResponse.json({ bet: data });
  } catch (error) {
    console.error('PATCH /api/product-strategy-agent-v2/bets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/product-strategy-agent-v2/bets/[id] - Delete bet
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('strategic_bets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting bet:', error);
      return NextResponse.json({ error: 'Failed to delete bet' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/product-strategy-agent-v2/bets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
