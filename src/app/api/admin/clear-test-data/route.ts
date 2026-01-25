import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/admin/clear-test-data
 *
 * Clears all conversation data for the current organization:
 * - Conversation messages
 * - Territory insights
 * - Synthesis outputs
 * - Strategic materials
 * - Resets conversation framework state
 *
 * This is useful for UAT testing to start fresh.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all conversations for this organization
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, title')
      .eq('clerk_org_id', orgId);

    if (convError) {
      console.error('Error fetching conversations:', convError);
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: convError.message },
        { status: 500 }
      );
    }

    const results = {
      conversationsProcessed: 0,
      messagesDeleted: 0,
      insightsDeleted: 0,
      synthesisDeleted: 0,
      materialsDeleted: 0,
      conversationsReset: 0,
      errors: [] as string[],
    };

    // Process each conversation
    for (const conv of conversations || []) {
      results.conversationsProcessed++;

      // Delete conversation messages
      const { error: msgError, count: msgCount } = await supabase
        .from('conversation_messages')
        .delete({ count: 'exact' })
        .eq('conversation_id', conv.id);

      if (msgError) {
        results.errors.push(`Messages for ${conv.id}: ${msgError.message}`);
      } else {
        results.messagesDeleted += msgCount || 0;
      }

      // Delete territory insights
      const { error: insightError, count: insightCount } = await supabase
        .from('territory_insights')
        .delete({ count: 'exact' })
        .eq('conversation_id', conv.id);

      if (insightError) {
        results.errors.push(`Insights for ${conv.id}: ${insightError.message}`);
      } else {
        results.insightsDeleted += insightCount || 0;
      }

      // Delete synthesis outputs
      const { error: synthesisError, count: synthesisCount } = await supabase
        .from('synthesis_outputs')
        .delete({ count: 'exact' })
        .eq('conversation_id', conv.id);

      if (synthesisError) {
        results.errors.push(`Synthesis for ${conv.id}: ${synthesisError.message}`);
      } else {
        results.synthesisDeleted += synthesisCount || 0;
      }

      // Delete strategic materials
      const { error: materialsError, count: materialsCount } = await supabase
        .from('strategic_materials')
        .delete({ count: 'exact' })
        .eq('conversation_id', conv.id);

      if (materialsError) {
        results.errors.push(`Materials for ${conv.id}: ${materialsError.message}`);
      } else {
        results.materialsDeleted += materialsCount || 0;
      }

      // Reset conversation framework state
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          framework_state: {
            version: 1,
            currentPhase: 'discovery',
            sessionCount: 1,
            totalMessageCount: 0,
            strategicBets: [],
            keyInsights: [],
            researchPillars: {
              macroMarket: { started: false, completed: false, insights: [] },
              customer: { started: false, completed: false, insights: [] },
              colleague: { started: false, completed: false, insights: [] },
            },
            lastActivityAt: new Date().toISOString(),
          },
          last_message_at: null,
        })
        .eq('id', conv.id);

      if (updateError) {
        results.errors.push(`Reset for ${conv.id}: ${updateError.message}`);
      } else {
        results.conversationsReset++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test data cleared successfully',
      results,
    });

  } catch (error) {
    console.error('Error clearing test data:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear test data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
