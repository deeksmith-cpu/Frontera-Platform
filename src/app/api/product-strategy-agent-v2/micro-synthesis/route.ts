import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { buildMicroSynthesisPrompt, type MicroSynthesisResult } from '@/lib/agents/strategy-coach/micro-synthesis-prompt';

function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/product-strategy-agent-v2/micro-synthesis
 *
 * Generate a micro-synthesis for a single territory after all 3 areas are mapped.
 * Stores result in conversations.framework_state.microSynthesisResults.{territory}
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, territory } = body;

    if (!conversation_id || !territory) {
      return NextResponse.json(
        { error: 'conversation_id and territory required' },
        { status: 400 }
      );
    }

    if (!['company', 'customer', 'competitor'].includes(territory)) {
      return NextResponse.json({ error: 'Invalid territory' }, { status: 400 });
    }

    const supabase = getRawSupabase();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, clerk_org_id, framework_state')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Load territory insights (all 3 areas must be mapped)
    const { data: insights, error: insightsError } = await supabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conversation_id)
      .eq('territory', territory)
      .eq('status', 'mapped');

    if (insightsError) {
      return NextResponse.json({ error: 'Failed to load insights' }, { status: 500 });
    }

    if (!insights || insights.length < 3) {
      return NextResponse.json(
        { error: 'All 3 research areas must be mapped before micro-synthesis' },
        { status: 400 }
      );
    }

    // Format insights for the prompt
    type InsightRow = {
      research_area: string;
      responses: Record<string, string>;
      confidence: Record<string, string> | null;
    };
    const typedInsights = insights as InsightRow[];
    const formattedInsights = typedInsights.map((i) => ({
      area: i.research_area,
      responses: i.responses,
      confidence: i.confidence || undefined,
    }));

    // Build prompt and call Claude
    const prompt = buildMicroSynthesisPrompt(territory, formattedInsights);

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    // Parse the response
    const responseText = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    let parsed: { keyFindings: MicroSynthesisResult['keyFindings']; overallConfidence: string; strategicImplication: string };
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        return NextResponse.json({ error: 'Failed to parse synthesis response' }, { status: 500 });
      }
    }

    const result: MicroSynthesisResult = {
      territory: territory as MicroSynthesisResult['territory'],
      keyFindings: parsed.keyFindings.slice(0, 3),
      overallConfidence: parsed.overallConfidence as 'high' | 'medium' | 'low',
      strategicImplication: parsed.strategicImplication,
      generatedAt: new Date().toISOString(),
    };

    // Store in framework_state
    const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
    const microSynthesisResults = (frameworkState.microSynthesisResults as Record<string, unknown>) || {};
    microSynthesisResults[territory] = result;

    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        framework_state: { ...frameworkState, microSynthesisResults },
      })
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId);

    if (updateError) {
      console.error('Error saving micro-synthesis:', updateError);
      return NextResponse.json({ error: 'Failed to save synthesis' }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Micro-synthesis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
