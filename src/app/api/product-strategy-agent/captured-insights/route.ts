import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key);
}

interface CapturedInsight {
  messageId: string;
  territory: string;
  content: string;
  capturedAt: string;
}

/**
 * GET /api/product-strategy-agent/captured-insights?conversation_id=...&territory=...
 * Retrieve captured insights for a conversation.
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversation_id');
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 });
  }

  const territory = searchParams.get('territory') || undefined;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('conversations')
      .select('framework_state')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const state = data.framework_state as Record<string, unknown> | null;
    const insights = (state?.capturedInsights as CapturedInsight[]) || [];

    const filtered = territory
      ? insights.filter(i => i.territory === territory)
      : insights;

    return NextResponse.json({ insights: filtered });
  } catch (error) {
    console.error('Error fetching captured insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/product-strategy-agent/captured-insights
 * Capture an insight from a coach message.
 */
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { conversation_id, message_id, territory, content } = body;

    if (!conversation_id || !message_id || !territory || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validTerritories = ['company', 'customer', 'competitor', 'general'];
    if (!validTerritories.includes(territory)) {
      return NextResponse.json({ error: 'Invalid territory' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch current framework_state
    const { data, error: fetchError } = await supabase
      .from('conversations')
      .select('framework_state')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const state = (data.framework_state as Record<string, unknown>) || {};
    const existing = (state.capturedInsights as CapturedInsight[]) || [];

    // Prevent duplicate captures
    if (existing.some(i => i.messageId === message_id)) {
      return NextResponse.json({ success: true, already_captured: true });
    }

    const newInsight: CapturedInsight = {
      messageId: message_id,
      territory,
      content: content.slice(0, 500), // Limit length
      capturedAt: new Date().toISOString(),
    };

    const updatedState = {
      ...state,
      capturedInsights: [...existing, newInsight],
    };

    const { error: updateError } = await supabase
      .from('conversations')
      .update({ framework_state: updatedState })
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId);

    if (updateError) {
      console.error('Error saving insight:', updateError);
      return NextResponse.json({ error: 'Failed to save insight' }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: newInsight });
  } catch (error) {
    console.error('Error capturing insight:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
