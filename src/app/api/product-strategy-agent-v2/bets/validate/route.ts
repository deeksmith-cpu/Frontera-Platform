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

// POST /api/product-strategy-agent-v2/bets/validate
// Coach validates edited bet and provides feedback
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bet_id, updated_fields, conversation_id } = body;

    if (!bet_id || !updated_fields || !conversation_id) {
      return NextResponse.json(
        { error: 'bet_id, updated_fields, and conversation_id are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Fetch existing bet
    const { data: bet, error: betError } = await supabase
      .from('strategic_bets')
      .select('*')
      .eq('id', bet_id)
      .single();

    if (betError || !bet) {
      return NextResponse.json({ error: 'Bet not found' }, { status: 404 });
    }

    // 2. Fetch company context
    const { data: client } = await supabase
      .from('clients')
      .select('company_name, industry, company_size, strategic_focus, pain_points')
      .eq('clerk_org_id', orgId)
      .single();

    // 3. Fetch Lenny research materials
    const { data: lennyDocs } = await supabase
      .from('uploaded_materials')
      .select('filename, extracted_context')
      .eq('conversation_id', conversation_id)
      .ilike('filename', '%lenny%');

    // 4. Fetch synthesis context
    const { data: synthesis } = await supabase
      .from('synthesis_outputs')
      .select('opportunities, key_insights')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // 5. Build validation prompt
    const companyContext = client
      ? `Company: ${client.company_name}
Industry: ${client.industry}
Size: ${client.company_size}
Strategic Focus: ${client.strategic_focus}
Pain Points: ${client.pain_points?.join(', ') || 'N/A'}`
      : 'Company context not available';

    const lennyContext = lennyDocs && lennyDocs.length > 0
      ? lennyDocs
          .map((doc: { filename: string; extracted_context: { text?: string } }) =>
            `[${doc.filename}] ${doc.extracted_context?.text?.substring(0, 500) || ''}...`
          )
          .join('\n\n')
      : 'Lenny research not available';

    const originalBetText = `Original Bet:
- Job to Be Done: ${bet.job_to_be_done}
- Belief: ${bet.belief}
- Bet: ${bet.bet}
- Success Metric: ${bet.success_metric}
- Kill Criteria: ${bet.kill_criteria || 'Not defined'}
- Kill Date: ${bet.kill_date || 'Not defined'}
- Expected Impact: ${bet.expected_impact || 'N/A'}/10
- Certainty of Impact: ${bet.certainty_of_impact || 'N/A'}/10
- Clarity of Levers: ${bet.clarity_of_levers || 'N/A'}/10
- Uniqueness of Levers: ${bet.uniqueness_of_levers || 'N/A'}/10`;

    const updatedFieldsText = Object.entries(updated_fields)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');

    const validationPrompt = `You are a strategic product coach validating edits to a strategic bet. The user has edited the bet below. Your job is to:

1. Analyze the edits in the context of the company's situation and research
2. Identify potential issues or improvements
3. Provide constructive feedback with specific suggested edits
4. Explain your reasoning using frameworks (Playing to Win, Jobs to Be Done, Annie Duke's kill criteria, etc.)

# Company Context
${companyContext}

# Research Context (Lenny's Podcast Insights)
${lennyContext}

# Strategic Synthesis Context
${synthesis ? JSON.stringify(synthesis, null, 2).substring(0, 1000) : 'Not available'}

# ${originalBetText}

# User's Edits
${updatedFieldsText}

# Your Task

Analyze the user's edits and provide:

1. **Validation Assessment**: Is this improvement, regression, or neutral?
2. **Specific Concerns**: Any strategic issues, weak evidence, vague metrics, missing kill criteria?
3. **Suggested Edits**: Concrete recommendations to improve the bet
4. **Reasoning**: Why your suggestions are better, citing frameworks and company context

Return a JSON object:

\`\`\`json
{
  "validation": "improvement|regression|neutral",
  "concerns": [
    "Concern 1...",
    "Concern 2..."
  ],
  "suggested_edits": {
    "field_name": "suggested value with explanation",
    "another_field": "another suggestion"
  },
  "reasoning": "2-3 sentences explaining your feedback, citing frameworks and company-specific insights from research"
}
\`\`\`

Important:
- Be constructive and specific
- Reference company context and Lenny research when relevant
- Suggest measurable success metrics if missing
- Ensure kill criteria are quantitative and time-bound
- Validate PTW alignment (does this test a Where to Play or How to Win choice?)
- Check JTBD framing (is this a real customer struggling moment?)
- Only suggest edits if genuinely needed - don't nitpick

Return ONLY the JSON object, no other text.`;

    // 6. Call Claude
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: validationPrompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // 7. Parse JSON response
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      console.error('Failed to parse validation response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse validation response' },
        { status: 500 }
      );
    }

    const validationResult = JSON.parse(jsonMatch[0].replace(/```json|```/g, ''));

    return NextResponse.json({
      validation: validationResult.validation,
      concerns: validationResult.concerns || [],
      suggested_edits: validationResult.suggested_edits || {},
      reasoning: validationResult.reasoning || '',
    });
  } catch (error) {
    console.error('POST /api/product-strategy-agent-v2/bets/validate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
