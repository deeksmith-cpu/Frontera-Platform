import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database, StrategicThesisRow } from '@/types/database';
import type { CreateThesisRequest, StrategicThesis } from '@/types/bets';
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
// POST /api/product-strategy-agent-v2/bets/theses
// Create a new strategic thesis
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateThesisRequest = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.description || !body.opportunity_id) {
      return NextResponse.json(
        { error: 'title, description, and opportunity_id are required' },
        { status: 400 }
      );
    }

    if (!body.ptw_winning_aspiration || !body.ptw_where_to_play || !body.ptw_how_to_win) {
      return NextResponse.json(
        { error: 'PTW fields (winning_aspiration, where_to_play, how_to_win) are required' },
        { status: 400 }
      );
    }

    if (!body.thesis_type || !['offensive', 'defensive', 'capability'].includes(body.thesis_type)) {
      return NextResponse.json(
        { error: 'thesis_type must be one of: offensive, defensive, capability' },
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

    // Insert thesis
    const { data: thesisData, error: insertError } = await rawSupabase
      .from('strategic_theses')
      .insert({
        conversation_id,
        title: body.title,
        description: body.description,
        opportunity_id: body.opportunity_id,
        ptw_winning_aspiration: body.ptw_winning_aspiration,
        ptw_where_to_play: body.ptw_where_to_play,
        ptw_how_to_win: body.ptw_how_to_win,
        dhm_delight: body.dhm_delight || null,
        dhm_hard_to_copy: body.dhm_hard_to_copy || null,
        dhm_margin_enhancing: body.dhm_margin_enhancing || null,
        thesis_type: body.thesis_type,
        time_horizon: body.time_horizon || '6m',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating thesis:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to create thesis',
          details: insertError.message,
          code: insertError.code,
          hint: insertError.hint,
        },
        { status: 500 }
      );
    }

    const thesis = transformThesisRow(thesisData);

    trackEvent('psa_thesis_created', userId, {
      org_id: orgId,
      conversation_id,
      thesis_id: thesis.id,
      thesis_type: thesis.thesisType,
    });

    return NextResponse.json({
      success: true,
      thesis,
    });
  } catch (error) {
    console.error('Error creating thesis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
