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

// GET /api/product-strategy-agent/territories?conversation_id=xxx
// Fetches territory insights for a conversation
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversation_id = searchParams.get('conversation_id');

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
      .select('id, clerk_org_id')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch territory insights
    const { data: insights, error: insightsError } = await supabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
      return NextResponse.json(
        { error: 'Failed to fetch insights' },
        { status: 500 }
      );
    }

    trackEvent('psa_territories_viewed', userId, {
      org_id: orgId,
      conversation_id,
      insight_count: insights?.length || 0,
    });
    return NextResponse.json(insights || []);
  } catch (error) {
    console.error('Territories fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/product-strategy-agent/territories
// Save or update territory insight
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, territory, research_area, responses, status } = body;

    if (!conversation_id || !territory || !research_area || !responses || !status) {
      return NextResponse.json(
        { error: 'conversation_id, territory, research_area, responses, and status are required' },
        { status: 400 }
      );
    }

    // Validate territory
    if (!['company', 'customer', 'competitor'].includes(territory)) {
      return NextResponse.json(
        { error: 'Invalid territory. Must be company, customer, or competitor' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['unexplored', 'in_progress', 'mapped'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be unexplored, in_progress, or mapped' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Use raw client to avoid type issues
    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await rawSupabase
      .from('conversations')
      .select('id, clerk_org_id')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Upsert territory insight
    const { data: insight, error: insightError } = await rawSupabase
      .from('territory_insights')
      .upsert(
        {
          conversation_id,
          territory,
          research_area,
          responses,
          status,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'conversation_id,territory,research_area',
        }
      )
      .select()
      .single();

    if (insightError) {
      console.error('Error saving insight:', insightError);
      return NextResponse.json(
        { error: 'Failed to save insight' },
        { status: 500 }
      );
    }

    trackEvent('psa_territory_saved', userId, {
      org_id: orgId,
      conversation_id,
      territory,
      research_area,
      status,
    });
    return NextResponse.json(insight);
  } catch (error) {
    console.error('Territory save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
