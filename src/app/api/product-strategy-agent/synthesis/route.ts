import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import type { Database } from '@/types/database';
import type { SynthesisResult, StrategicOpportunity, StrategicTension } from '@/types/synthesis';
import {
  parseClaudeSynthesisResponse,
  formatTerritoryInsightsForPrompt,
  matchEvidenceToInsights,
} from '@/lib/synthesis/helpers';
import { trackEvent } from '@/lib/analytics/posthog-server';

// =============================================================================
// Supabase & Anthropic Clients
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

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  return new Anthropic({ apiKey });
}

// =============================================================================
// Type Definitions
// =============================================================================

type InsightRow = {
  id: string;
  territory: string;
  research_area: string;
  responses: Record<string, string>;
};

// =============================================================================
// GET /api/product-strategy-agent/synthesis
// Fetch existing synthesis for a conversation
// =============================================================================

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
        { error: 'conversation_id query parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch latest synthesis for this conversation
    const rawSupabase = getRawSupabase();
    const { data: synthesisData, error: fetchError } = await rawSupabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is OK
      console.error('Error fetching synthesis:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch synthesis' },
        { status: 500 }
      );
    }

    if (!synthesisData) {
      return NextResponse.json({
        success: true,
        synthesis: null,
      });
    }

    // Transform database row to SynthesisResult
    const synthesis: SynthesisResult = {
      id: synthesisData.id,
      conversationId: synthesisData.conversation_id,
      executiveSummary: synthesisData.executive_summary || synthesisData.synthesis_content || '',
      opportunities: (synthesisData.opportunities || []) as StrategicOpportunity[],
      tensions: (synthesisData.tensions || []) as StrategicTension[],
      recommendations: synthesisData.recommendations || [],
      metadata: {
        modelUsed: synthesisData.metadata?.model_used || 'unknown',
        territoriesIncluded: (synthesisData.metadata?.territories_included || []) as ('company' | 'customer' | 'competitor')[],
        researchAreasCount: synthesisData.metadata?.research_areas_count || 0,
        generatedAt: synthesisData.metadata?.generated_at || synthesisData.created_at,
        confidenceLevel: synthesisData.metadata?.confidence_level || 'medium',
      },
      userEdited: synthesisData.user_edited || false,
      editedAt: synthesisData.edited_at || undefined,
      createdAt: synthesisData.created_at,
    };

    trackEvent('psa_synthesis_viewed', userId, {
      org_id: orgId,
      conversation_id: conversationId,
      has_synthesis: !!synthesisData,
    });
    return NextResponse.json({
      success: true,
      synthesis,
    });
  } catch (error) {
    console.error('Error fetching synthesis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/product-strategy-agent/synthesis
// Generate AI-powered synthesis from territory insights
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id } = body;

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
      .select('*')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const rawSupabase = getRawSupabase();

    // Fetch territory insights - count both in_progress and mapped as completed
    // Users may have saved content without explicitly marking as mapped
    const { data: insights, error: insightsError } = await rawSupabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conversation_id)
      .in('status', ['in_progress', 'mapped']);

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
      return NextResponse.json(
        { error: 'Failed to fetch territory insights' },
        { status: 500 }
      );
    }

    // Filter to only include insights that have actual responses (not just empty objects)
    const insightsWithContent = insights?.filter(insight => {
      const responses = insight.responses as Record<string, string> | null;
      if (!responses) return false;
      // Check if at least one response has meaningful content
      return Object.values(responses).some(val => val && val.trim().length > 0);
    }) || [];

    if (insightsWithContent.length < 4) {
      return NextResponse.json(
        { error: `Insufficient research completed. Please complete at least 4 research areas. You have ${insightsWithContent.length} area(s) with content.` },
        { status: 400 }
      );
    }

    const typedInsights = insightsWithContent as InsightRow[];

    // Determine which territories have data
    const territoriesWithData: ('company' | 'customer' | 'competitor')[] = [];
    if (typedInsights.some((i) => i.territory === 'company')) territoriesWithData.push('company');
    if (typedInsights.some((i) => i.territory === 'customer')) territoriesWithData.push('customer');
    if (typedInsights.some((i) => i.territory === 'competitor')) territoriesWithData.push('competitor');

    // Build the structured synthesis prompt
    const researchContext = formatTerritoryInsightsForPrompt(typedInsights);

    const structuredPrompt = `You are a strategic synthesis engine using the Playing to Win (PTW) framework by Roger Martin and A.G. Lafley.

# Research Data

${researchContext}

# Playing to Win Framework Principles

**CRITICAL:** Where to Play and How to Win are INTERDEPENDENT strategic choices, not separate categories.

Each opportunity must represent a COMPLETE strategic hypothesis where:
- **WHERE to play** = Specific market segment, customer type, geography, or channel
- **HOW to win** = The competitive advantage that makes sense GIVEN your where to play choice

The pairing must be coherent: your choice of WHERE constrains and enables HOW you compete.

**Good Pairing Example:**
- WHERE: "Small-to-medium retail businesses (10-500 employees) without dedicated data teams"
- HOW: "Automated AI analytics requiring zero technical expertise, 10x faster setup than enterprise tools"
- WHY IT WORKS: SMB retailers lack data science resources, so easy automation is the key advantage

**Bad Pairing Example:**
- WHERE: "Enterprise healthcare organizations"
- HOW: "Low-cost, self-service deployment model"
- WHY IT FAILS: Enterprise healthcare expects high-touch service and compliance support, so self-service conflicts with segment needs

Think: "If we focus on [THIS specific market], we can win by [THIS specific differentiation that makes sense for THAT market]"

# Your Task

Analyze this research to generate a strategic synthesis. Return your analysis as a **valid JSON object** with the following structure:

\`\`\`json
{
  "executiveSummary": "2-3 sentence strategic summary of the key findings and recommended direction",
  "opportunities": [
    {
      "title": "[Value Proposition] for [Target Segment]",
      "description": "2-3 sentences explaining the PAIRED WTP+HTW strategy and why this combination creates competitive advantage",
      "opportunityType": "paired_strategy",
      "scoring": {
        "marketAttractiveness": 1-10,
        "capabilityFit": 1-10,
        "competitiveAdvantage": 1-10
      },
      "evidence": [
        {
          "territory": "company|customer|competitor",
          "researchArea": "the research area this came from",
          "quote": "Exact or near-exact quote from the research that supports this opportunity"
        }
      ],
      "ptw": {
        "winningAspiration": "What winning looks like for THIS paired strategy",
        "whereToPlay": "Specific market segment, customer type, geography, or channel (REQUIRED - be specific)",
        "howToWin": "The competitive advantage or differentiation that makes sense GIVEN the whereToPlay choice (REQUIRED - explain the fit)",
        "capabilitiesRequired": ["Capabilities needed to execute BOTH the WTP and HTW together"],
        "managementSystems": ["Metrics to track progress on THIS integrated strategy"]
      },
      "assumptions": [
        {
          "category": "customer|company|competitor|economics",
          "assumption": "A testable hypothesis about the WTP/HTW pairing that must be true for success",
          "testMethod": "How to validate this assumption",
          "riskIfFalse": "What happens if this assumption is wrong"
        }
      ]
    }
  ],
  "tensions": [
    {
      "description": "Description of a strategic tension or conflict in the research",
      "alignedEvidence": [
        {"insight": "Evidence that supports one side", "source": "territory.research_area"}
      ],
      "conflictingEvidence": [
        {"insight": "Evidence that conflicts", "source": "territory.research_area"}
      ],
      "resolutionOptions": [
        {"option": "A way to resolve this tension", "tradeOff": "What you give up", "recommended": true}
      ],
      "impact": "blocking|significant|minor"
    }
  ],
  "recommendations": [
    "Priority recommendation 1 - most important strategic action",
    "Priority recommendation 2 - second most important",
    "Priority recommendation 3 - third most important"
  ]
}
\`\`\`

## Title Guidelines

Format: "[Value Proposition] for [Target Segment]" (4-6 words)

Examples:
- "AI-Powered Analytics for SMB Retailers"
- "Enterprise Identity Platform for FinTech"
- "Personalized Learning for Community Colleges"
- "Automated Compliance for Mid-Market Banks"

Capture BOTH where to play (segment) AND how to win (value proposition) in the title.

## Scoring Guidelines

**Market Attractiveness (1-10):**
- 9-10: Large, fast-growing market with significant unmet needs
- 7-8: Good-sized market with clear opportunities
- 5-6: Moderate market with some opportunities
- 3-4: Small or declining market
- 1-2: Very limited market potential

**Capability Fit (1-10):**
- 9-10: Strong existing capabilities, can execute immediately
- 7-8: Good capabilities with minor gaps
- 5-6: Moderate capabilities, some investment needed
- 3-4: Significant capability gaps
- 1-2: Would require major capability development

**Competitive Advantage (1-10):**
- 9-10: Unique, defensible differentiation
- 7-8: Clear differentiation, some competition
- 5-6: Moderate differentiation
- 3-4: Limited differentiation
- 1-2: Commoditized, no clear advantage

## Requirements

1. Generate **3-5 integrated strategic hypotheses** (NOT separate where_to_play/how_to_win/capability_gap types)
2. Each opportunity MUST have coherent WTP+HTW pairing (explain why they fit together in the description)
3. Generate **2-3 strategic tensions** where research insights conflict
4. Provide **exactly 3 priority recommendations** as actionable next steps
5. Include **at least 2 evidence quotes** per opportunity, citing the exact research
6. Include **at least 2 WWHBT assumptions** per opportunity that test the WTP/HTW pairing
7. All JSON must be valid and parseable

Return ONLY the JSON object, no additional text before or after.`;

    // Generate synthesis using Claude
    const anthropic = getAnthropicClient();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: structuredPrompt,
        },
      ],
    });

    const rawResponse = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the structured response
    const parsedSynthesis = parseClaudeSynthesisResponse(
      rawResponse,
      conversation_id,
      {
        modelUsed: 'claude-sonnet-4-20250514',
        territoriesIncluded: territoriesWithData,
        researchAreasCount: insights.length,
      }
    );

    if (!parsedSynthesis) {
      // Fallback: save raw response if parsing fails
      console.error('Failed to parse structured synthesis, saving raw response');
      console.error('Raw response (first 500 chars):', rawResponse.substring(0, 500));

      const { data: fallbackOutput, error: fallbackError } = await rawSupabase
        .from('synthesis_outputs')
        .insert({
          conversation_id,
          synthesis_content: rawResponse,
          synthesis_type: 'ai_generated',
          executive_summary: 'Synthesis generated but could not be parsed into structured format.',
          opportunities: [],
          tensions: [],
          recommendations: [],
          metadata: {
            model_used: 'claude-sonnet-4-20250514',
            territories_included: territoriesWithData,
            research_areas_count: insights.length,
            generated_at: new Date().toISOString(),
            confidence_level: 'low',
            parse_error: true,
          },
        })
        .select()
        .single();

      if (fallbackError) {
        console.error('Error saving fallback synthesis:', fallbackError);
        return NextResponse.json(
          {
            error: 'Failed to save synthesis',
            details: fallbackError.message,
            code: fallbackError.code,
            hint: fallbackError.hint
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        synthesis: fallbackOutput,
        warning: 'Synthesis could not be fully parsed into structured format',
      });
    }

    console.log('Synthesis parsed successfully');
    console.log('Opportunities count:', parsedSynthesis.opportunities.length);
    console.log('Tensions count:', parsedSynthesis.tensions.length);

    // Match evidence to actual insight IDs
    const opportunitiesWithInsightIds = matchEvidenceToInsights(
      parsedSynthesis.opportunities,
      typedInsights
    );

    // Save structured synthesis to database
    const { data: synthesisOutput, error: saveError } = await rawSupabase
      .from('synthesis_outputs')
      .insert({
        conversation_id,
        synthesis_content: rawResponse,
        synthesis_type: 'ai_generated',
        executive_summary: parsedSynthesis.executiveSummary,
        opportunities: opportunitiesWithInsightIds,
        tensions: parsedSynthesis.tensions,
        recommendations: parsedSynthesis.recommendations,
        metadata: {
          model_used: parsedSynthesis.metadata.modelUsed,
          territories_included: parsedSynthesis.metadata.territoriesIncluded,
          research_areas_count: parsedSynthesis.metadata.researchAreasCount,
          generated_at: parsedSynthesis.metadata.generatedAt,
          confidence_level: parsedSynthesis.metadata.confidenceLevel,
        },
        user_edited: false,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving synthesis:', saveError);
      return NextResponse.json(
        {
          error: 'Failed to save synthesis',
          details: saveError.message,
          code: saveError.code,
          hint: saveError.hint
        },
        { status: 500 }
      );
    }

    // Update conversation phase to synthesis and unlock bets phase
    // Fetch current framework_state to update it
    const { data: currentConv } = await rawSupabase
      .from('conversations')
      .select('framework_state')
      .eq('id', conversation_id)
      .single();

    const existingFrameworkState = (currentConv?.framework_state as Record<string, unknown>) || {};
    const updatedFrameworkState = {
      ...existingFrameworkState,
      currentPhase: 'synthesis',
      highestPhaseReached: 'bets', // Unlock bets phase after synthesis
    };

    await rawSupabase
      .from('conversations')
      .update({
        current_phase: 'synthesis',
        framework_state: updatedFrameworkState,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversation_id);

    // Build response object
    const responseSynthesis: SynthesisResult = {
      id: synthesisOutput.id,
      conversationId: synthesisOutput.conversation_id,
      executiveSummary: synthesisOutput.executive_summary || '',
      opportunities: opportunitiesWithInsightIds,
      tensions: parsedSynthesis.tensions,
      recommendations: parsedSynthesis.recommendations,
      metadata: {
        modelUsed: parsedSynthesis.metadata.modelUsed,
        territoriesIncluded: parsedSynthesis.metadata.territoriesIncluded,
        researchAreasCount: parsedSynthesis.metadata.researchAreasCount,
        generatedAt: parsedSynthesis.metadata.generatedAt,
        confidenceLevel: parsedSynthesis.metadata.confidenceLevel,
      },
      userEdited: false,
      createdAt: synthesisOutput.created_at,
    };

    trackEvent('psa_synthesis_generated', userId, {
      org_id: orgId,
      conversation_id,
      opportunities_count: opportunitiesWithInsightIds.length,
      tensions_count: parsedSynthesis.tensions.length,
      territories_included: territoriesWithData,
      research_areas_count: insights.length,
    });
    return NextResponse.json({
      success: true,
      synthesis: responseSynthesis,
    });
  } catch (error) {
    console.error('Synthesis generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
