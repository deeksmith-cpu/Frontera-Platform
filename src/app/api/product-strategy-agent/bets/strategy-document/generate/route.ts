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

// POST /api/product-strategy-agent/bets/strategy-document/generate
// Generate 6-page Product Strategy Draft from selected bets
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

    // 5. Fetch selected bets with their theses
    const { data: selectedBets } = await supabase
      .from('strategic_bets')
      .select(`
        *,
        strategic_theses (*)
      `)
      .in('id', selected_bet_ids);

    if (!selectedBets || selectedBets.length === 0) {
      return NextResponse.json({ error: 'No bets found with provided IDs' }, { status: 404 });
    }

    // 6. Fetch conversation messages for coaching context
    const { data: messages } = await supabase
      .from('conversation_messages')
      .select('role, content')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: true })
      .limit(50);

    // 7. Build context for Claude
    const clientContext = `Company: ${client.company_name}
Industry: ${client.industry}
Size: ${client.company_size}
Strategic Focus: ${client.strategic_focus}
Pain Points: ${client.pain_points?.join(', ') || 'N/A'}`;

    const discoveryContext = discoveryMaterials
      ?.map((doc: { filename: string; extracted_context: { text?: string } }) =>
        `[${doc.filename}] ${doc.extracted_context?.text?.substring(0, 300) || ''}...`
      )
      .join('\n\n')
      .substring(0, 2000) || 'No discovery materials';

    const territoryContext = territoryInsights
      ?.map((insight: { territory: string; research_area: string; responses: Record<string, string> }) =>
        `[${insight.territory} - ${insight.research_area}]\n${JSON.stringify(insight.responses).substring(0, 200)}...`
      )
      .join('\n\n')
      .substring(0, 2000) || 'No territory insights';

    const synthesisContext = synthesis
      ? `Opportunities: ${synthesis.opportunities?.length || 0}
Key Insights: ${synthesis.key_insights?.length || 0}
Top Opportunity: ${synthesis.opportunities?.[0]?.title || 'N/A'}`
      : 'No synthesis';

    const betsContext = selectedBets.map((bet, idx) => {
      const thesis = Array.isArray(bet.strategic_theses) ? bet.strategic_theses[0] : bet.strategic_theses;
      return `Bet ${idx + 1}:
Thesis: ${thesis?.title || 'No thesis'}
Job: ${bet.job_to_be_done}
Belief: ${bet.belief}
Bet: ${bet.bet}
Success: ${bet.success_metric}
Kill: ${bet.kill_criteria} by ${bet.kill_date}
Scoring: Impact=${bet.expected_impact}, Certainty=${bet.certainty_of_impact}, Clarity=${bet.clarity_of_levers}, Uniqueness=${bet.uniqueness_of_levers}`;
    }).join('\n\n');

    // 8. Generate narrative sections with Claude
    const narrativePrompt = `You are generating a professional 6-page Product Strategy Draft document. Generate the narrative sections (executive summary, coherence analysis, next steps) based on the context below.

# Client Context
${clientContext}

# Discovery Context
${discoveryContext}

# Territory Research
${territoryContext}

# Strategic Synthesis
${synthesisContext}

# Selected Strategic Bets
${betsContext}

# Your Task

Generate these narrative sections as a JSON object:

\`\`\`json
{
  "executiveSummary": {
    "companyOverview": "2-3 sentences about the company and its strategic context",
    "strategicIntent": "1-2 sentences about what the organization aspires to achieve",
    "keyFindings": [
      "Key finding from 3Cs research 1",
      "Key finding from 3Cs research 2",
      "Key finding from 3Cs research 3"
    ],
    "topOpportunities": [
      "Top opportunity 1 (from synthesis)",
      "Top opportunity 2",
      "Top opportunity 3"
    ],
    "recommendedBets": "${selectedBets.length} strategic bets recommended for immediate pursuit"
  },
  "coherenceAnalysis": "3-4 sentences analyzing how the selected bets form a coherent strategic portfolio that tests the WTP/HTW combination",
  "nextSteps": {
    "validationTimeline": "Recommended timeline for validating bets (e.g., '90-day sprints with monthly reviews')",
    "governance": "Governance structure recommendation (e.g., 'Weekly bet reviews with CPO, monthly board updates')",
    "trackingPlan": "How to track success metrics (e.g., 'OKR framework with leading indicators dashboard')",
    "killCriteriaReview": "Kill criteria review process (e.g., 'Monthly kill criteria checks, quarterly go/no-go decisions')",
    "nextTopics": [
      "Suggested next conversation topic 1",
      "Suggested next conversation topic 2",
      "Suggested next conversation topic 3"
    ]
  }
}
\`\`\`

Be specific, actionable, and grounded in the company's context. Return ONLY the JSON object.`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3072,
      messages: [{ role: 'user', content: narrativePrompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      console.error('Failed to parse narrative response:', responseText);
      return NextResponse.json({ error: 'Failed to generate narrative sections' }, { status: 500 });
    }

    const narrativeSections = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));

    // 9. Assemble PTW cascade from selected bets' theses
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

    // 10. Assemble selected bets details
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

    // 11. Assemble portfolio view
    const portfolioView = {
      coherenceAnalysis: narrativeSections.coherenceAnalysis,
      balance: {
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
      },
      sequencing: selectedBets
        .filter(bet => bet.depends_on && bet.depends_on.length > 0)
        .map(bet => ({
          betId: bet.id,
          dependsOn: bet.depends_on,
        })),
      resourceAllocation: [
        { allocation: 'High priority', betCount: selectedBets.filter(b => b.priority_level === 'high').length },
        { allocation: 'Medium priority', betCount: selectedBets.filter(b => b.priority_level === 'medium').length },
        { allocation: 'Low priority', betCount: selectedBets.filter(b => b.priority_level === 'low').length },
      ],
      dhmCoverage: {
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
      },
    };

    // 12. Assemble full document
    const documentContent = {
      executiveSummary: narrativeSections.executiveSummary,
      ptwCascade,
      selectedBets: selectedBetsDetails,
      portfolioView,
      nextSteps: narrativeSections.nextSteps,
    };

    // 13. Insert strategy_documents record
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
      return NextResponse.json({ error: 'Failed to save strategy document' }, { status: 500 });
    }

    return NextResponse.json({
      document_id: strategyDoc.id,
      document_content: documentContent,
    });
  } catch (error) {
    console.error('POST /api/product-strategy-agent/bets/strategy-document/generate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
