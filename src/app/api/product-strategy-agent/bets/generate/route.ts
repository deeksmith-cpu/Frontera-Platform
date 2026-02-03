import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { calculateOverallScore } from '@/types/bets';
import { trackEvent } from '@/lib/analytics/posthog-server';
import type { StrategicOpportunity } from '@/types/synthesis';
import type { StrategicThesisRow, StrategicBetRow } from '@/types/database';

// =============================================================================
// Supabase & Anthropic Clients
// =============================================================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key);
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  return new Anthropic({ apiKey });
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Calculate quadrant based on market attractiveness and capability fit
 */
function calculateQuadrant(marketAttractiveness: number, capabilityFit: number): 'invest' | 'explore' | 'harvest' | 'divest' {
  const marketThreshold = 5.5;
  const capabilityThreshold = 5.5;

  if (marketAttractiveness >= marketThreshold && capabilityFit >= capabilityThreshold) {
    return 'invest';
  } else if (marketAttractiveness >= marketThreshold && capabilityFit < capabilityThreshold) {
    return 'explore';
  } else if (marketAttractiveness < marketThreshold && capabilityFit >= capabilityThreshold) {
    return 'harvest';
  } else {
    return 'divest';
  }
}

/**
 * Filter and sort opportunities to top 3-5 invest/explore candidates
 */
function selectTopOpportunities(opportunities: StrategicOpportunity[]): StrategicOpportunity[] {
  // Only include invest and explore quadrants
  const investExploreOpportunities = opportunities.filter(
    (opp) => opp.quadrant === 'invest' || opp.quadrant === 'explore'
  );

  // Sort by overall score descending
  const sorted = investExploreOpportunities.sort(
    (a, b) => b.scoring.overallScore - a.scoring.overallScore
  );

  // Return top 3-5
  return sorted.slice(0, Math.min(5, sorted.length));
}

/**
 * Format opportunities for Claude prompt
 */
function formatOpportunitiesForPrompt(opportunities: StrategicOpportunity[]): string {
  return opportunities.map((opp, idx) => {
    const evidenceStr = opp.evidence
      .map((e) => `  - [${e.territory}.${e.researchArea}] "${e.quote}"`)
      .join('\n');

    const assumptionsStr = opp.assumptions
      .map((a) => {
        return `  - [${a.category}] ${a.assumption}\n    Test: ${a.testMethod}\n    Risk: ${a.riskIfFalse}`;
      })
      .join('\n');

    return `
## Opportunity ${idx + 1}: ${opp.title}

**ID:** ${opp.id}
**Type:** ${opp.opportunityType}
**Quadrant:** ${opp.quadrant}
**Confidence:** ${opp.confidence}

**Description:**
${opp.description}

**Scoring:**
- Market Attractiveness: ${opp.scoring.marketAttractiveness}/10
- Capability Fit: ${opp.scoring.capabilityFit}/10
- Competitive Advantage: ${opp.scoring.competitiveAdvantage}/10
- Overall Score: ${opp.scoring.overallScore}/100

**Playing to Win Cascade:**
- Winning Aspiration: ${opp.ptw.winningAspiration}
- Where to Play: ${opp.ptw.whereToPlay}
- How to Win: ${opp.ptw.howToWin}
- Capabilities Required: ${opp.ptw.capabilitiesRequired.join(', ')}
- Management Systems: ${opp.ptw.managementSystems.join(', ')}

**Evidence:**
${evidenceStr}

**WWHBT Assumptions:**
${assumptionsStr}
`;
  }).join('\n---\n');
}

// =============================================================================
// POST /api/product-strategy-agent/bets/generate
// Generate strategic theses and bets from synthesis opportunities
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 3. Verify conversation belongs to orgId
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // 4. Fetch synthesis_outputs for this conversation
    const { data: synthesisData, error: synthesisError } = await supabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (synthesisError || !synthesisData) {
      return NextResponse.json(
        { error: 'No synthesis found. Please generate synthesis first.' },
        { status: 404 }
      );
    }

    // 5. Parse opportunities JSONB array
    const allOpportunities = (synthesisData.opportunities || []) as StrategicOpportunity[];

    if (allOpportunities.length === 0) {
      return NextResponse.json(
        { error: 'No opportunities found in synthesis.' },
        { status: 400 }
      );
    }

    // 6. Filter to top 3-5 by overallScore, only 'invest'/'explore' quadrants
    const topOpportunities = selectTopOpportunities(allOpportunities);

    if (topOpportunities.length === 0) {
      return NextResponse.json(
        { error: 'No invest or explore opportunities found.' },
        { status: 400 }
      );
    }

    // 7. Build Claude prompt
    const opportunitiesContext = formatOpportunitiesForPrompt(topOpportunities);

    const structuredPrompt = `You are a strategic planning engine using the Playing to Win (PTW) framework and the Desirability-Feasibility-Viability (DHM) model. Your task is to transform high-potential strategic opportunities into executable strategic theses and strategic bets.

# Context

You have been provided with the top strategic opportunities identified through cross-territory research synthesis. These opportunities represent areas where the organization should focus investment or exploration.

# Strategic Opportunities

${opportunitiesContext}

# Your Task

For each opportunity, generate:

1. **Strategic Thesis** - A testable strategic hypothesis that articulates the opportunity as a Playing to Win cascade and Desirability-Feasibility-Viability analysis.

2. **Strategic Bets** (1-3 per thesis) - Specific, testable initiatives that validate the thesis through experiments with clear success/kill criteria.

Return your analysis as a **valid JSON object** with the following structure:

\`\`\`json
{
  "theses": [
    {
      "title": "Concise thesis title (5-8 words)",
      "description": "2-3 sentence description of the strategic thesis",
      "opportunityId": "ID of the opportunity this thesis addresses",
      "ptwWinningAspiration": "What winning looks like",
      "ptwWhereToPlay": "Specific segment, market, or customer focus",
      "ptwHowToWin": "The competitive advantage or differentiation strategy",
      "dhmDelight": "How this creates customer delight (desirability)",
      "dhmHardToCopy": "What makes this defensible (feasibility)",
      "dhmMarginEnhancing": "How this improves business economics (viability)",
      "thesisType": "offensive|defensive|capability",
      "timeHorizon": "90d|6m|12m|18m"
    }
  ],
  "bets": [
    {
      "thesisTitle": "Exact thesis title this bet belongs to",
      "jobToBeDone": "User/customer job this bet addresses",
      "belief": "Core hypothesis being tested",
      "bet": "Specific initiative or experiment to run",
      "successMetric": "Quantitative metric that indicates success",
      "killCriteria": "Quantitative threshold to kill this bet",
      "killDate": "YYYY-MM-DD date to evaluate kill criteria",
      "opportunityId": "ID of the opportunity this bet addresses",
      "evidenceLinks": [
        {
          "territory": "company|customer|competitor",
          "researchArea": "research area name",
          "question": "specific question",
          "quote": "supporting evidence quote",
          "insightId": "insight UUID (use from opportunity evidence)"
        }
      ],
      "assumptionBeingTested": "Specific WWHBT assumption this bet tests",
      "ptwWhereToPlay": "Where to Play focus for this bet",
      "ptwHowToWin": "How to Win strategy for this bet",
      "expectedImpact": 1-10,
      "certaintyOfImpact": 1-10,
      "clarityOfLevers": 1-10,
      "uniquenessOfLevers": 1-10,
      "confidence": "low|medium|high",
      "timeHorizon": "90d|6m|12m|18m",
      "risks": {
        "market": "Market risk description",
        "positioning": "Positioning risk description",
        "execution": "Execution risk description",
        "economic": "Economic risk description"
      },
      "agentReasoning": "1-2 sentence explanation of why this bet is recommended"
    }
  ]
}
\`\`\`

## Thesis Type Guidelines

- **Offensive**: Capturing new growth, entering new markets, expanding share
- **Defensive**: Protecting current position, preventing disruption, maintaining advantages
- **Capability**: Building foundational capabilities needed for future optionality

## Time Horizon Guidelines

- **90d**: Quick wins, rapid experiments, tactical moves
- **6m**: Medium-term initiatives, capability building, market tests
- **12m**: Strategic positioning, major product launches, market expansion
- **18m**: Transformational bets, industry disruption, platform plays

## Strategic Scoring Guidelines (1-10 scale)

**Expected Impact:**
- 9-10: Transformational impact on revenue/market position
- 7-8: Significant measurable impact
- 5-6: Moderate improvement
- 3-4: Incremental benefit
- 1-2: Minimal impact

**Certainty of Impact:**
- 9-10: High confidence based on strong evidence
- 7-8: Good confidence with some validation
- 5-6: Moderate confidence, needs testing
- 3-4: Low confidence, high uncertainty
- 1-2: Very uncertain, speculative

**Clarity of Levers:**
- 9-10: Crystal clear how to execute, proven playbook
- 7-8: Clear execution path with minor unknowns
- 5-6: Some clarity, needs refinement
- 3-4: Unclear execution, needs discovery
- 1-2: Very unclear, exploratory

**Uniqueness of Levers:**
- 9-10: Proprietary advantages, impossible to copy
- 7-8: Strong differentiation, difficult to replicate
- 5-6: Some uniqueness, moderate barriers
- 3-4: Limited differentiation
- 1-2: Commoditized, no barriers

## Requirements

1. Generate **1 thesis per opportunity** (3-5 total theses)
2. Generate **1-3 bets per thesis** (aim for 8-12 total bets)
3. Each bet MUST link to the thesis via \`thesisTitle\` (exact match)
4. Each bet MUST include at least 2 evidence links from the opportunity
5. Each bet MUST test a specific WWHBT assumption from the opportunity
6. Kill dates must be realistic (90d = ~3 months from now, etc.)
7. All JSON must be valid and parseable

## Important Guidelines

- Be specific and actionable - avoid generic strategy speak
- Success metrics must be quantitative (numbers, percentages, dollar amounts)
- Kill criteria must be objective thresholds, not subjective
- Agent reasoning should explain the strategic logic, not repeat the bet
- Evidence links must come from the opportunity's evidence array
- Assumptions being tested must come from the opportunity's WWHBT list

Return ONLY the JSON object, no additional text before or after.`;

    // 8. Call Claude Sonnet 4
    const anthropic = getAnthropicClient();

    console.log('Generating strategic bets with Claude...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16384,
      messages: [
        {
          role: 'user',
          content: structuredPrompt,
        },
      ],
    });

    const rawResponse = message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('Claude response received, parsing...');

    // 9. Parse response as { theses: [...], bets: [...] }
    let parsedResponse: {
      theses: Array<{
        title: string;
        description: string;
        opportunityId: string;
        ptwWinningAspiration: string;
        ptwWhereToPlay: string;
        ptwHowToWin: string;
        dhmDelight: string;
        dhmHardToCopy: string;
        dhmMarginEnhancing: string;
        thesisType: 'offensive' | 'defensive' | 'capability';
        timeHorizon: '90d' | '6m' | '12m' | '18m';
      }>;
      bets: Array<{
        thesisTitle: string;
        jobToBeDone: string;
        belief: string;
        bet: string;
        successMetric: string;
        killCriteria: string;
        killDate: string;
        opportunityId: string;
        evidenceLinks: Array<{
          territory: 'company' | 'customer' | 'competitor';
          researchArea: string;
          question: string;
          quote: string;
          insightId: string;
        }>;
        assumptionBeingTested: string;
        ptwWhereToPlay: string;
        ptwHowToWin: string;
        expectedImpact: number;
        certaintyOfImpact: number;
        clarityOfLevers: number;
        uniquenessOfLevers: number;
        confidence: 'low' | 'medium' | 'high';
        timeHorizon: '90d' | '6m' | '12m' | '18m';
        risks: {
          market: string;
          positioning: string;
          execution: string;
          economic: string;
        };
        agentReasoning: string;
      }>;
    };

    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonString = rawResponse.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      parsedResponse = JSON.parse(jsonString);

      if (!parsedResponse.theses || !Array.isArray(parsedResponse.theses)) {
        throw new Error('Invalid response: missing theses array');
      }
      if (!parsedResponse.bets || !Array.isArray(parsedResponse.bets)) {
        throw new Error('Invalid response: missing bets array');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      console.error('Raw response (first 1000 chars):', rawResponse.substring(0, 1000));
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`Parsed ${parsedResponse.theses.length} theses and ${parsedResponse.bets.length} bets`);

    // 10. Insert theses into strategic_theses table, get IDs
    const thesisInserts: Array<Omit<StrategicThesisRow, 'id' | 'created_at' | 'updated_at'>> = parsedResponse.theses.map(
      (thesis) => ({
        conversation_id,
        title: thesis.title,
        description: thesis.description,
        opportunity_id: thesis.opportunityId,
        ptw_winning_aspiration: thesis.ptwWinningAspiration,
        ptw_where_to_play: thesis.ptwWhereToPlay,
        ptw_how_to_win: thesis.ptwHowToWin,
        dhm_delight: thesis.dhmDelight,
        dhm_hard_to_copy: thesis.dhmHardToCopy,
        dhm_margin_enhancing: thesis.dhmMarginEnhancing,
        thesis_type: thesis.thesisType,
        time_horizon: thesis.timeHorizon,
      })
    );

    const { data: insertedTheses, error: thesesError } = await supabase
      .from('strategic_theses')
      .insert(thesisInserts)
      .select();

    if (thesesError || !insertedTheses) {
      console.error('Error inserting theses:', thesesError);
      return NextResponse.json(
        { error: 'Failed to save strategic theses' },
        { status: 500 }
      );
    }

    console.log(`Inserted ${insertedTheses.length} theses`);

    // 11. Map thesis titles to IDs
    const thesisTitleToId = new Map<string, string>();
    insertedTheses.forEach((thesis) => {
      thesisTitleToId.set(thesis.title, thesis.id);
    });

    // 12. Insert bets into strategic_bets table with strategic_thesis_id linkage
    const betInserts: Array<Omit<StrategicBetRow, 'id' | 'created_at' | 'updated_at'>> = parsedResponse.bets.map(
      (bet) => {
        const thesisId = thesisTitleToId.get(bet.thesisTitle);
        const overallScore = calculateOverallScore({
          expectedImpact: bet.expectedImpact,
          certaintyOfImpact: bet.certaintyOfImpact,
          clarityOfLevers: bet.clarityOfLevers,
          uniquenessOfLevers: bet.uniquenessOfLevers,
        });

        // Determine priority level based on overall score
        let priorityLevel: 'high' | 'medium' | 'low' = 'medium';
        if (overallScore >= 75) priorityLevel = 'high';
        else if (overallScore < 50) priorityLevel = 'low';

        return {
          conversation_id,
          strategic_thesis_id: thesisId || null,
          job_to_be_done: bet.jobToBeDone,
          belief: bet.belief,
          bet: bet.bet,
          success_metric: bet.successMetric,
          kill_criteria: bet.killCriteria,
          kill_date: bet.killDate,
          status: 'draft' as const,
          opportunity_id: bet.opportunityId,
          evidence_links: bet.evidenceLinks,
          assumption_being_tested: bet.assumptionBeingTested,
          ptw_where_to_play: bet.ptwWhereToPlay,
          ptw_how_to_win: bet.ptwHowToWin,
          expected_impact: bet.expectedImpact,
          certainty_of_impact: bet.certaintyOfImpact,
          clarity_of_levers: bet.clarityOfLevers,
          uniqueness_of_levers: bet.uniquenessOfLevers,
          overall_score: overallScore,
          priority_level: priorityLevel,
          confidence: bet.confidence,
          time_horizon: bet.timeHorizon,
          risks: bet.risks,
          depends_on: [],
          agent_generated: true,
          agent_reasoning: bet.agentReasoning,
          user_modified: false,
        };
      }
    );

    const { data: insertedBets, error: betsError } = await supabase
      .from('strategic_bets')
      .insert(betInserts)
      .select();

    if (betsError || !insertedBets) {
      console.error('Error inserting bets:', betsError);
      return NextResponse.json(
        { error: 'Failed to save strategic bets' },
        { status: 500 }
      );
    }

    console.log(`Inserted ${insertedBets.length} bets`);

    // 13. Track analytics event
    trackEvent('psa_bets_generated', userId, {
      org_id: orgId,
      conversation_id,
      theses_count: insertedTheses.length,
      bets_count: insertedBets.length,
      opportunities_analyzed: topOpportunities.length,
    });

    // 14. Return { theses, bets }
    return NextResponse.json({
      success: true,
      theses: insertedTheses,
      bets: insertedBets,
    });
  } catch (error) {
    console.error('Bets generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
