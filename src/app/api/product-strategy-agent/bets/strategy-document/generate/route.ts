import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key);
}

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');
  return new Anthropic({ apiKey });
}

// =============================================================================
// Post-generation narrative quality validation
// =============================================================================

interface NarrativePages {
  productVision: { narrative: string; stateOfBusiness?: string };
  marketInsights: { narrative: string };
  strategicChoices: { narrative: string };
  roadmap: { narrative: string };
  operatingModel: { narrative: string };
  executionPlan: { narrative: string };
}

// =============================================================================
// Defensive paragraph break post-processing
// =============================================================================

function ensureParagraphBreaks(text: string): string {
  // If already has paragraph breaks, return as-is
  if (text.includes('\n\n')) return text;

  // Split on sentence boundaries (period/exclamation/question followed by space and uppercase)
  const sentences = text.match(/[^.!?]*[.!?]+(?:\s|$)/g);
  if (!sentences || sentences.length <= 4) return text;

  // Group every 3-4 sentences into a paragraph
  const paragraphs: string[] = [];
  const groupSize = Math.max(3, Math.ceil(sentences.length / 5));

  for (let i = 0; i < sentences.length; i += groupSize) {
    const group = sentences.slice(i, i + groupSize).map(s => s.trim()).join(' ');
    if (group) paragraphs.push(group);
  }

  return paragraphs.join('\n\n');
}

const HEDGING_WORDS = ['arguably', 'potentially', 'it could be said that', 'to some extent', 'it is possible that'];
const PASSIVE_PATTERN = /\b(?:is|are|was|were|been|be|being)\s+(?:\w+ed|known|seen|made|given|taken|done|found|shown)\b/gi;

function validateNarrativeQuality(sections: NarrativePages, companyName: string): string[] {
  const warnings: string[] = [];

  const pages: { key: string; label: string; text: string }[] = [
    { key: 'productVision', label: 'Page 1 (Vision)', text: sections.productVision?.narrative || '' },
    { key: 'marketInsights', label: 'Page 2 (Market)', text: sections.marketInsights?.narrative || '' },
    { key: 'strategicChoices', label: 'Page 3 (Choices)', text: sections.strategicChoices?.narrative || '' },
    { key: 'roadmap', label: 'Page 4 (Roadmap)', text: sections.roadmap?.narrative || '' },
    { key: 'operatingModel', label: 'Page 5 (Operating)', text: sections.operatingModel?.narrative || '' },
    { key: 'executionPlan', label: 'Page 6 (Execution)', text: sections.executionPlan?.narrative || '' },
  ];

  for (const page of pages) {
    if (!page.text) continue;

    // Word count check (350-700)
    const wordCount = page.text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 350) {
      warnings.push(`${page.label}: Only ${wordCount} words (target: 350-700). Content may be thin.`);
    } else if (wordCount > 700) {
      warnings.push(`${page.label}: ${wordCount} words (target: 350-700). Consider tightening.`);
    }

    // Consecutive paragraph opener check
    const paragraphs = page.text.split('\n\n').filter(p => p.trim());
    for (let i = 1; i < paragraphs.length; i++) {
      const prevStart = paragraphs[i - 1].trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
      const currStart = paragraphs[i].trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
      if (prevStart === currStart && prevStart.length > 5) {
        warnings.push(`${page.label}: Consecutive paragraphs start with "${prevStart}..."`);
        break;
      }
    }

    // Hedging language check
    const lowerText = page.text.toLowerCase();
    let hedgingCount = 0;
    for (const hedge of HEDGING_WORDS) {
      const regex = new RegExp(hedge, 'gi');
      const matches = lowerText.match(regex);
      if (matches) hedgingCount += matches.length;
    }
    if (hedgingCount > 2) {
      warnings.push(`${page.label}: ${hedgingCount} hedging phrases detected (max 2).`);
    }

    // Passive voice check
    const sentences = page.text.split(/[.!?]+/).filter(s => s.trim());
    const passiveCount = sentences.filter(s => PASSIVE_PATTERN.test(s)).length;
    PASSIVE_PATTERN.lastIndex = 0;
    const passiveRatio = sentences.length > 0 ? passiveCount / sentences.length : 0;
    if (passiveRatio > 0.3) {
      warnings.push(`${page.label}: ${Math.round(passiveRatio * 100)}% passive voice (target: <30%).`);
    }

    // Company name usage check
    const nameRegex = new RegExp(companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const nameMatches = page.text.match(nameRegex);
    const nameCount = nameMatches ? nameMatches.length : 0;
    if (nameCount < 2) {
      warnings.push(`${page.label}: Company name "${companyName}" appears ${nameCount} time(s) (target: 2+).`);
    }
  }

  return warnings;
}

// POST /api/product-strategy-agent/bets/strategy-document/generate
// Generate narrative 6-pager Product Strategy document (Amazon Working Backwards style)
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, selected_bet_ids } = body;

    if (!conversation_id || !selected_bet_ids || !Array.isArray(selected_bet_ids) || selected_bet_ids.length < 3) {
      return NextResponse.json(
        { error: 'conversation_id and selected_bet_ids (minimum 3) are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Fetch client context
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('clerk_org_id', orgId)
      .single();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 2. Fetch discovery materials
    const { data: discoveryMaterials } = await supabase
      .from('uploaded_materials')
      .select('filename, extracted_context')
      .eq('conversation_id', conversation_id)
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: true });

    // 3. Fetch territory insights
    const { data: territoryInsights } = await supabase
      .from('territory_insights')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true });

    // 4. Fetch synthesis
    const { data: synthesis } = await supabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 5. Fetch selected bets
    const { data: selectedBetsRaw, error: betsError } = await supabase
      .from('strategic_bets')
      .select('*')
      .in('id', selected_bet_ids);

    if (betsError) {
      console.error('Error fetching bets:', betsError);
      return NextResponse.json({ error: 'Failed to fetch selected bets', details: betsError.message }, { status: 500 });
    }

    if (!selectedBetsRaw || selectedBetsRaw.length === 0) {
      return NextResponse.json({ error: 'No bets found with provided IDs' }, { status: 404 });
    }

    // 5b. Fetch theses for the selected bets
    const thesisIds = [...new Set(selectedBetsRaw.map(b => b.strategic_thesis_id).filter(Boolean))];
    let thesesMap: Record<string, Record<string, unknown>> = {};

    if (thesisIds.length > 0) {
      const { data: thesesData, error: thesesError } = await supabase
        .from('strategic_theses')
        .select('*')
        .in('id', thesisIds);

      if (thesesError) {
        console.error('Error fetching theses:', thesesError);
      } else if (thesesData) {
        thesesMap = Object.fromEntries(thesesData.map(t => [t.id, t]));
      }
    }

    // 5c. Combine bets with their theses
    const selectedBets = selectedBetsRaw.map(bet => ({
      ...bet,
      strategic_theses: bet.strategic_thesis_id ? thesesMap[bet.strategic_thesis_id] || null : null,
    }));

    // 6. Fetch conversation messages for coaching context
    const { data: messages } = await supabase
      .from('conversation_messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(50);

    // =========================================================================
    // Build rich context for Claude (expanded from old truncated version)
    // =========================================================================

    const clientContext = `Company: ${client.company_name}
Industry: ${client.industry}
Size: ${client.company_size}
Strategic Focus: ${client.strategic_focus}
Pain Points: ${Array.isArray(client.pain_points) ? client.pain_points.join(', ') : (client.pain_points || 'N/A')}
Target Outcomes: ${Array.isArray(client.target_outcomes) ? client.target_outcomes.join(', ') : (client.target_outcomes || 'N/A')}
Success Metrics: ${Array.isArray(client.success_metrics) ? client.success_metrics.join(', ') : (client.success_metrics || 'N/A')}`;

    // Expanded discovery context — summarize each document rather than truncating
    const discoveryContext = discoveryMaterials
      ?.map((doc: { filename: string; extracted_context: { text?: string; source?: string; topics?: string[] } }) => {
        const text = doc.extracted_context?.text || '';
        const source = doc.extracted_context?.source || '';
        const topics = doc.extracted_context?.topics?.join(', ') || '';
        return `[${doc.filename}]${source ? ` (Source: ${source})` : ''}${topics ? ` Topics: ${topics}` : ''}\n${text.substring(0, 800)}`;
      })
      .join('\n\n')
      .substring(0, 6000) || 'No discovery materials available.';

    // Expanded territory context — group by territory type with full responses
    const groupedTerritories: Record<string, string[]> = { company: [], customer: [], competitor: [] };
    territoryInsights?.forEach((insight: { territory: string; research_area: string; responses: Record<string, string> }) => {
      const key = insight.territory as string;
      const responseSummary = Object.entries(insight.responses || {})
        .map(([q, a]) => `  Q: ${q}\n  A: ${String(a).substring(0, 400)}`)
        .join('\n');
      const entry = `[${insight.research_area}]\n${responseSummary}`;
      if (groupedTerritories[key]) {
        groupedTerritories[key].push(entry);
      }
    });

    const territoryContext = Object.entries(groupedTerritories)
      .map(([territory, entries]) => `=== ${territory.toUpperCase()} TERRITORY ===\n${entries.join('\n\n')}`)
      .join('\n\n');

    // Synthesis context — include opportunities and key insights
    const synthesisContext = synthesis
      ? `Opportunities:\n${(synthesis.opportunities || []).map((o: { title: string; description: string }, i: number) =>
          `${i + 1}. ${o.title}: ${o.description}`
        ).join('\n')}

Key Insights:\n${(synthesis.key_insights || []).map((ins: { insight: string }, i: number) =>
          `${i + 1}. ${ins.insight}`
        ).join('\n')}`
      : 'No synthesis available.';

    // Full bets context with thesis details
    const betsContext = selectedBets.map((bet, idx) => {
      const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
      return `Bet ${idx + 1}: "${thesis?.title || 'Untitled'}"
Type: ${thesis?.thesis_type || 'N/A'}
PTW - Winning Aspiration: ${thesis?.ptw_winning_aspiration || 'N/A'}
PTW - Where to Play: ${thesis?.ptw_where_to_play || 'N/A'}
PTW - How to Win: ${thesis?.ptw_how_to_win || 'N/A'}
DHM - Delight: ${thesis?.dhm_delight || 'N/A'}
DHM - Hard to Copy: ${thesis?.dhm_hard_to_copy || 'N/A'}
DHM - Margin Enhancing: ${thesis?.dhm_margin_enhancing || 'N/A'}
Job to Be Done: ${bet.job_to_be_done}
Belief: ${bet.belief}
Bet: ${bet.bet}
Success Metric: ${bet.success_metric}
Kill Criteria: ${bet.kill_criteria} by ${bet.kill_date}
Scoring: Impact=${bet.expected_impact}/10, Certainty=${bet.certainty_of_impact}/10, Clarity=${bet.clarity_of_levers}/10, Uniqueness=${bet.uniqueness_of_levers}/10, Overall=${bet.overall_score}%
Priority: ${bet.priority_level}
Time Horizon: ${bet.time_horizon}
Risks: ${JSON.stringify(bet.risks || {})}
Depends On: ${(bet.depends_on || []).length > 0 ? bet.depends_on.join(', ') : 'None'}`;
    }).join('\n\n');

    // Coaching conversation highlights
    const coachingContext = messages
      ?.filter((m: { role: string }) => m.role === 'assistant')
      .slice(-10)
      .map((m: { content: string }) => m.content.substring(0, 300))
      .join('\n---\n')
      .substring(0, 3000) || 'No coaching conversations.';

    // =========================================================================
    // Generate narrative 6-pager with Claude
    // =========================================================================

    const narrativePrompt = `You are generating a professional Product Strategy 6-Pager document in the Amazon Working Backwards narrative memo style for ${client.company_name}.

CRITICAL STYLE RULES:
- Write in flowing narrative prose — full sentences and paragraphs. NO bullet points in the main narrative pages.
- Each page should be 400-600 words of connected, purposeful prose.
- The document tells a cohesive strategic story — each page builds on the previous.
- Use the company name and specific details throughout. Never write generic strategy advice.
- Be selective and clear — don't overwhelm with data. The appendix holds supporting details.
- Write with confidence and authority, as if presenting to a senior leadership team.
- Reference specific findings from the research journey (e.g., "Our customer territory research revealed that...", "Analysis of competitive dynamics shows...").
- Structure each narrative into 4-6 distinct paragraphs separated by double newlines (\\n\\n) in the JSON string. Each paragraph should cover one idea.

WRITING PRINCIPLES:
- Every paragraph starts with a clear topic sentence stating its controlling idea.
- Vary sentence length: alternate short declarative sentences (8-12 words) with longer complex ones (20-30 words). This creates rhythm.
- Apply the "given-new contract": begin sentences with familiar context, end with new information.
- Use active voice ("We will capture market share" not "Market share will be captured").
- Be concrete: replace vague modifiers ("significant growth") with specific figures or timeframes drawn from the research data provided above.
- Use em dashes for emphasis or clarifying asides — they add punch to key points.
- Use semicolons to join related independent clauses when the relationship is obvious.
- Each page reads as a self-contained argument that also advances the overall document arc.

ANTI-PATTERNS TO AVOID:
- NEVER begin consecutive paragraphs with the same sentence structure or opening words.
- NEVER use any of these phrases more than once in the entire document: "In order to", "It is important to note", "It should be noted", "Moving forward", "Going forward", "Leveraging", "In today's rapidly changing".
- NEVER use hedging language: "arguably", "potentially", "it could be said that", "to some extent". State points directly.
- NEVER use weak filler transitions: "Furthermore", "Moreover", "Additionally". Instead use transitions that show logical relationships: "Despite this...", "This constraint shapes...", "The same dynamic drives...", "Yet the data tells a different story...".
- NEVER repeat the same adjective more than once per page.
- Avoid noun clusters longer than 3 words (e.g., "customer engagement optimization strategy" is too dense).
- Do not use rhetorical questions — state the point directly.

CROSS-PAGE NARRATIVE THREADING:
- Page 1 must end with tension or a forward-looking statement that Page 2 picks up.
- Each page opens by briefly referencing the conclusion of the previous page, creating continuity.
- The final paragraph of each page should be the strongest — it is the last thing the reader sees before turning the page.
- Use ${client.company_name} at least 3 times per page but never in consecutive sentences.

# FULL COACHING JOURNEY CONTEXT

## Company Profile
${clientContext}

## Discovery Materials (uploaded strategic documents)
${discoveryContext}

## Territory Research (3Cs — Company, Customer, Competitor)
${territoryContext || 'No territory research completed.'}

## Strategic Synthesis (cross-pillar insights & opportunities)
${synthesisContext}

## Selected Strategic Bets (${selectedBets.length} bets chosen for pursuit)
${betsContext}

## Coaching Conversation Highlights
${coachingContext}

# YOUR TASK

Generate a JSON object with 6 narrative pages. Each page has a "narrative" field containing 400-600 words of prose.

IMPORTANT FORMATTING: Within each "narrative" string, separate paragraphs using \\n\\n (two newline characters). Each narrative should contain 4-6 paragraphs. Do NOT write one continuous block of text.

PAGE-BY-PAGE INSTRUCTIONS:

**Page 1 — Product Vision & Strategic Context** (key: "productVision")
- "narrative": Write about the winning aspiration, macro trends affecting the industry, and how the company's strategic ambition aligns with market reality. Draw from client profile, discovery materials, and PTW winning aspiration from theses.
- "stateOfBusiness": Write about performance snapshot, what has worked, what hasn't, and lessons learned. Draw from discovery materials and coaching conversations.

**Page 2 — Market Trends, Customer Problems & Opportunities** (key: "marketInsights")
- "narrative": Synthesize the 3Cs territory research into a cohesive market narrative. Cover market trends, customer pain points, competitive landscape, and product opportunities. Draw from territory insights and synthesis outputs.

**Page 3 — Where We Play & How We Win** (key: "strategicChoices")
- "narrative": Articulate the PTW choices, key bet themes, capabilities alignment, key assumptions, risks, and validation approach. Draw from theses PTW fields, bets, and synthesis tensions.

**Page 4 — Product Strategy & Roadmap Themes** (key: "roadmap")
- "narrative": Define the North Star (derived from winning aspiration), OKRs (from success metrics), strategic tenets/principles, sequencing logic (from bet dependencies and time horizons), and explicitly state what the company won't do.

**Page 5 — Operating Model & Capability Build** (key: "operatingModel")
- "narrative": Cover team structure implications, critical capability gaps, governance cadence, and measurement approach. Draw from company territory research (capabilities/constraints) and DHM fields.

**Page 6 — Strategic Priorities & Execution** (key: "executionPlan")
- "narrative": Provide a concrete execution plan covering each bet, timelines (from kill dates), responsibilities, and validation milestones. This is the action-oriented conclusion.

Return ONLY valid JSON in this exact format:

\`\`\`json
{
  "productVision": {
    "narrative": "...",
    "stateOfBusiness": "..."
  },
  "marketInsights": {
    "narrative": "..."
  },
  "strategicChoices": {
    "narrative": "..."
  },
  "roadmap": {
    "narrative": "..."
  },
  "operatingModel": {
    "narrative": "..."
  },
  "executionPlan": {
    "narrative": "..."
  }
}
\`\`\``;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 12000,
      messages: [{ role: 'user', content: narrativePrompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('Failed to parse narrative response:', responseText);
      return NextResponse.json({ error: 'Failed to generate narrative sections' }, { status: 500 });
    }

    const narrativeSections = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());

    // =========================================================================
    // Ensure paragraph breaks in all narrative fields (defensive fallback)
    // =========================================================================
    const narrativeKeys = ['productVision', 'marketInsights', 'strategicChoices', 'roadmap', 'operatingModel', 'executionPlan'] as const;
    for (const key of narrativeKeys) {
      if (narrativeSections[key]?.narrative) {
        narrativeSections[key].narrative = ensureParagraphBreaks(narrativeSections[key].narrative);
      }
    }
    if (narrativeSections.productVision?.stateOfBusiness) {
      narrativeSections.productVision.stateOfBusiness = ensureParagraphBreaks(narrativeSections.productVision.stateOfBusiness);
    }

    // =========================================================================
    // Post-generation quality validation
    // =========================================================================
    const qualityWarnings = validateNarrativeQuality(narrativeSections, client.company_name);

    // =========================================================================
    // Assemble appendix from DB (not Claude-generated)
    // =========================================================================

    const uniqueTheses = Array.from(
      new Map(
        selectedBets
          .map(bet => (Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses))
          .filter(Boolean)
          .map(thesis => [thesis.id, thesis])
      ).values()
    );

    const ptwCascade = {
      winningAspiration: uniqueTheses[0]?.ptw_winning_aspiration || 'To be defined',
      whereToPlay: uniqueTheses.map(thesis => thesis.ptw_where_to_play || 'To be defined'),
      howToWin: uniqueTheses.map(thesis => thesis.ptw_how_to_win || 'To be defined'),
      capabilities: uniqueTheses.flatMap(thesis =>
        [thesis.dhm_delight, thesis.dhm_hard_to_copy, thesis.dhm_margin_enhancing].filter(Boolean)
      ),
      managementSystems: ['OKR framework', 'Quarterly strategy reviews', 'Bet validation dashboard'],
    };

    const selectedBetsDetails = selectedBets.map(bet => {
      const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
      return {
        id: bet.id,
        thesisTitle: thesis?.title || 'No thesis',
        thesisType: thesis?.thesis_type || 'offensive',
        hypothesis: {
          job: bet.job_to_be_done,
          belief: bet.belief,
          bet: bet.bet,
          success: bet.success_metric,
          kill: {
            criteria: bet.kill_criteria,
            date: bet.kill_date,
          },
        },
        scoring: {
          expectedImpact: bet.expected_impact,
          certaintyOfImpact: bet.certainty_of_impact,
          clarityOfLevers: bet.clarity_of_levers,
          uniquenessOfLevers: bet.uniqueness_of_levers,
          overallScore: bet.overall_score,
        },
        risks: bet.risks || {},
        evidence: bet.evidence_links || [],
      };
    });

    const portfolioBalance = {
      offensive: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.thesis_type === 'offensive';
      }).length,
      defensive: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.thesis_type === 'defensive';
      }).length,
      capability: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.thesis_type === 'capability';
      }).length,
    };

    const dhmCoverage = {
      delight: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.dhm_delight;
      }).length,
      hardToCopy: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.dhm_hard_to_copy;
      }).length,
      marginEnhancing: selectedBets.filter(bet => {
        const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
        return thesis?.dhm_margin_enhancing;
      }).length,
    };

    // =========================================================================
    // Assemble full document
    // =========================================================================

    const documentContent = {
      productVision: narrativeSections.productVision,
      marketInsights: narrativeSections.marketInsights,
      strategicChoices: narrativeSections.strategicChoices,
      roadmap: narrativeSections.roadmap,
      operatingModel: narrativeSections.operatingModel,
      executionPlan: narrativeSections.executionPlan,
      appendix: {
        selectedBets: selectedBetsDetails,
        portfolioBalance,
        dhmCoverage,
        ptwCascade,
      },
    };

    // Insert strategy_documents record
    const { data: strategyDoc, error: insertError } = await supabase
      .from('strategy_documents')
      .insert({
        conversation_id,
        selected_bet_ids,
        document_content: documentContent,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting strategy document:', insertError);
      return NextResponse.json({
        error: 'Failed to save strategy document',
        details: insertError.message,
        code: insertError.code,
      }, { status: 500 });
    }

    return NextResponse.json({
      document_id: strategyDoc.id,
      document_content: documentContent,
      ...(qualityWarnings.length > 0 ? { quality_warnings: qualityWarnings } : {}),
    });
  } catch (error) {
    console.error('POST /api/product-strategy-agent/bets/strategy-document/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Internal server error',
      details: errorMessage,
    }, { status: 500 });
  }
}
