import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import type { StrategicOpportunity } from '@/types/synthesis';
import {
  formatTerritoryInsightsForPrompt,
  calculateOverallScore,
  calculateQuadrant,
  determineConfidence,
  validateTerritory,
  validateAssumptionCategory,
} from '@/lib/synthesis/helpers';
import { v4 as uuidv4 } from 'uuid';
import { trackEvent } from '@/lib/analytics/posthog-server';

function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/product-strategy-agent/synthesis/generate-one
 *
 * Generate one additional complementary strategic opportunity using AI.
 * Validates count < 5, fetches context, prompts Claude, appends result.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 });
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

    // Fetch current synthesis
    const { data: synthesisData, error: synthError } = await rawSupabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (synthError || !synthesisData) {
      return NextResponse.json({ error: 'Synthesis not found' }, { status: 404 });
    }

    const currentOpportunities = (synthesisData.opportunities || []) as StrategicOpportunity[];

    if (currentOpportunities.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum of 5 opportunities reached' },
        { status: 400 }
      );
    }

    // Fetch territory insights for context
    const { data: insights } = await rawSupabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conversation_id)
      .in('status', ['in_progress', 'mapped']);

    const insightsWithContent = (insights || []).filter(insight => {
      const responses = insight.responses as Record<string, string> | null;
      if (!responses) return false;
      return Object.values(responses).some(val => val && val.trim().length > 0);
    });

    const researchContext = formatTerritoryInsightsForPrompt(
      insightsWithContent as Array<{ territory: string; research_area: string; responses: Record<string, string> }>
    );

    // Summarize existing opportunities for Claude
    const existingSummary = currentOpportunities.map((opp, i) =>
      `${i + 1}. "${opp.title}" — WTP: ${opp.ptw.whereToPlay} | HTW: ${opp.ptw.howToWin}`
    ).join('\n');

    const prompt = `You are a strategic synthesis engine using the Playing to Win (PTW) framework.

# Research Data
${researchContext}

# Existing Strategic Hypotheses
${existingSummary}

# Task
Generate exactly ONE additional strategic hypothesis that COMPLEMENTS the existing ones above.
The new hypothesis should:
- Fill a gap not covered by existing hypotheses
- Target a different segment or use a different competitive advantage
- Be a coherent WTP+HTW pairing

Return ONLY a valid JSON object:
\`\`\`json
{
  "title": "[Value Proposition] for [Target Segment]",
  "description": "2-3 sentences explaining the paired WTP+HTW strategy",
  "scoring": {
    "marketAttractiveness": 1-10,
    "capabilityFit": 1-10,
    "competitiveAdvantage": 1-10
  },
  "evidence": [
    {
      "territory": "company|customer|competitor",
      "researchArea": "the research area",
      "quote": "Supporting quote from research"
    }
  ],
  "ptw": {
    "winningAspiration": "What winning looks like",
    "whereToPlay": "Specific market segment",
    "howToWin": "Competitive advantage",
    "capabilitiesRequired": ["capability 1", "capability 2"],
    "managementSystems": ["metric 1", "metric 2"]
  },
  "assumptions": [
    {
      "category": "customer|company|competitor|economics",
      "assumption": "Testable hypothesis",
      "testMethod": "How to validate",
      "riskIfFalse": "Risk if wrong"
    }
  ]
}
\`\`\`

Return ONLY the JSON object, no additional text.`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawResponse = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse response
    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        const objectMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          parsed = JSON.parse(objectMatch[0]);
        } else {
          return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }
      }
    }

    // Build StrategicOpportunity from parsed data
    const marketAttractiveness = Math.max(1, Math.min(10, parsed.scoring?.marketAttractiveness || 5));
    const capabilityFit = Math.max(1, Math.min(10, parsed.scoring?.capabilityFit || 5));
    const competitiveAdvantage = Math.max(1, Math.min(10, parsed.scoring?.competitiveAdvantage || 5));

    const evidence = (parsed.evidence || []).map((e: { territory?: string; researchArea?: string; quote?: string }) => ({
      territory: validateTerritory(e.territory || 'company'),
      researchArea: e.researchArea || 'unknown',
      question: (e.quote || '').substring(0, 50),
      quote: e.quote || '',
      insightId: '',
    }));

    const assumptions = (parsed.assumptions || []).map((a: { category?: string; assumption?: string; testMethod?: string; riskIfFalse?: string }) => ({
      category: validateAssumptionCategory(a.category || 'economics'),
      assumption: a.assumption || '',
      testMethod: a.testMethod || '',
      riskIfFalse: a.riskIfFalse || '',
    }));

    const newOpportunity: StrategicOpportunity = {
      id: uuidv4(),
      title: parsed.title || 'New Strategic Hypothesis',
      description: parsed.description || '',
      opportunityType: 'paired_strategy',
      scoring: {
        marketAttractiveness,
        capabilityFit,
        competitiveAdvantage,
        overallScore: calculateOverallScore(marketAttractiveness, capabilityFit, competitiveAdvantage),
      },
      quadrant: calculateQuadrant(marketAttractiveness, capabilityFit),
      confidence: determineConfidence(evidence.length, assumptions.length),
      ptw: {
        winningAspiration: parsed.ptw?.winningAspiration || '',
        whereToPlay: parsed.ptw?.whereToPlay || '',
        howToWin: parsed.ptw?.howToWin || '',
        capabilitiesRequired: parsed.ptw?.capabilitiesRequired || [],
        managementSystems: parsed.ptw?.managementSystems || [],
      },
      evidence,
      assumptions,
    };

    // Append to existing opportunities and save
    const updatedOpportunities = [...currentOpportunities, newOpportunity];

    const updatePayload: Record<string, unknown> = {
      opportunities: updatedOpportunities,
      user_edited: true,
      edited_at: new Date().toISOString(),
    };

    if (!synthesisData.original_opportunities) {
      updatePayload.original_opportunities = synthesisData.opportunities;
    }

    const { error: updateError } = await rawSupabase
      .from('synthesis_outputs')
      .update(updatePayload)
      .eq('id', synthesisData.id);

    if (updateError) {
      console.error('Error saving new opportunity:', updateError);
      return NextResponse.json({ error: 'Failed to save opportunity' }, { status: 500 });
    }

    trackEvent('psa_synthesis_generate_one', userId, {
      org_id: orgId,
      conversation_id,
      new_opportunity_title: newOpportunity.title,
      total_count: updatedOpportunities.length,
    });

    return NextResponse.json({
      success: true,
      opportunity: newOpportunity,
      totalCount: updatedOpportunities.length,
    });
  } catch (error) {
    console.error('Generate one opportunity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
