import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface ProgressResponse {
  currentPhase: string;
  materialsCount: number;
  hasConversations: boolean;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  synthesisGenerated: boolean;
  betsCount: number;
  insightsCount: number;
  timeSpentMinutes: number;
}

// Research areas per territory
const TERRITORY_AREAS = {
  company: 3,
  customer: 3,
  competitor: 3,
};

export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversationId = req.nextUrl.searchParams.get('conversation_id');
  if (!conversationId) {
    return NextResponse.json({ error: 'conversation_id required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    // Fetch all data in parallel
    const [
      conversationRes,
      materialsRes,
      messagesRes,
      territoriesRes,
      synthesisRes,
      betsRes,
    ] = await Promise.all([
      // Get conversation to check phase
      supabase
        .from('conversations')
        .select('current_phase, framework_state, created_at')
        .eq('id', conversationId)
        .eq('clerk_org_id', orgId)
        .single(),

      // Count uploaded materials
      supabase
        .from('uploaded_materials')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId),

      // Check if there are coaching conversations (messages)
      supabase
        .from('conversation_messages')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .eq('role', 'user'),

      // Get territory insights
      supabase
        .from('territory_insights')
        .select('territory, status')
        .eq('conversation_id', conversationId),

      // Check if synthesis exists
      supabase
        .from('synthesis_outputs')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId),

      // Count bets
      supabase
        .from('strategic_bets')
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conversationId),
    ]);

    // Check conversation exists and belongs to org
    if (conversationRes.error || !conversationRes.data) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conversation = conversationRes.data;
    const currentPhase = conversation.current_phase || 'discovery';

    // Calculate territory progress
    // Count both 'mapped' AND 'in_progress' statuses as progress (to match AI coach logic)
    const territories = territoriesRes.data || [];
    const countProgress = (territory: string) =>
      territories.filter(
        (t) => t.territory === territory && (t.status === 'mapped' || t.status === 'in_progress')
      ).length;

    const territoryProgress = {
      company: {
        mapped: countProgress('company'),
        total: TERRITORY_AREAS.company,
      },
      customer: {
        mapped: countProgress('customer'),
        total: TERRITORY_AREAS.customer,
      },
      competitor: {
        mapped: countProgress('competitor'),
        total: TERRITORY_AREAS.competitor,
      },
    };

    // Calculate time spent (minutes since creation)
    const createdAt = new Date(conversation.created_at);
    const now = new Date();
    const timeSpentMinutes = Math.round(
      (now.getTime() - createdAt.getTime()) / (1000 * 60)
    );

    // Count captured insights from framework_state
    const frameworkState = conversation.framework_state as Record<string, unknown> || {};
    const capturedInsights = (frameworkState.capturedInsights as unknown[]) || [];
    const insightsCount = capturedInsights.length;

    const response: ProgressResponse = {
      currentPhase,
      materialsCount: materialsRes.count || 0,
      hasConversations: (messagesRes.count || 0) > 0,
      territoryProgress,
      synthesisGenerated: (synthesisRes.count || 0) > 0,
      betsCount: betsRes.count || 0,
      insightsCount,
      timeSpentMinutes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
