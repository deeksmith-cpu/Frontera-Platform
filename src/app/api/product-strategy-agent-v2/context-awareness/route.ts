import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize raw Supabase Admin Client (without strict typing to handle dynamic tables)
function getRawSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key);
}

// Type for territory insight rows
interface TerritoryInsight {
  territory: string;
  research_area: string;
  responses: Record<string, unknown> | null;
}

// Type for client rows
interface ClientRow {
  id: string;
  company_name: string | null;
  industry: string | null;
}

// GET /api/product-strategy-agent-v2/context-awareness
// Returns context awareness data for the coaching panel
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getRawSupabaseAdmin();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, clerk_org_id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get uploaded materials count
    const { count: materialsCount } = await supabase
      .from('uploaded_materials')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);

    // Get territory insights to calculate progress
    const { data: insightsData } = await supabase
      .from('territory_insights')
      .select('territory, research_area, responses, status')
      .eq('conversation_id', conversationId);

    const insights = insightsData as TerritoryInsight[] | null;

    // Calculate territory progress
    // Each territory has 3 research areas
    const territoryProgress = {
      company: { mapped: 0, inProgress: 0, total: 3 },
      customer: { mapped: 0, inProgress: 0, total: 3 },
      competitor: { mapped: 0, inProgress: 0, total: 3 },
    };

    if (insights) {
      for (const insight of insights) {
        const territory = insight.territory as keyof typeof territoryProgress;
        if (territoryProgress[territory]) {
          const status = (insight as unknown as Record<string, unknown>).status as string | undefined;
          const hasResponses = insight.responses &&
            typeof insight.responses === 'object' &&
            Object.keys(insight.responses).length > 0;

          if (status === 'mapped' || (hasResponses && status !== 'in_progress')) {
            territoryProgress[territory].mapped++;
          } else if (status === 'in_progress' || hasResponses) {
            territoryProgress[territory].inProgress++;
          }
        }
      }
    }

    // Check if synthesis is available
    const { count: synthesisCount } = await supabase
      .from('synthesis_outputs')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId);

    // Check if client has onboarding context
    const { data: clientData } = await supabase
      .from('clients')
      .select('id, company_name, industry')
      .eq('clerk_org_id', orgId)
      .single();

    const client = clientData as ClientRow | null;
    const hasOnboardingContext = !!(client?.company_name && client?.industry);

    return NextResponse.json({
      materialsCount: materialsCount ?? 0,
      territoryProgress,
      synthesisAvailable: (synthesisCount ?? 0) > 0,
      hasOnboardingContext,
    });
  } catch (error) {
    console.error('Context awareness error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
