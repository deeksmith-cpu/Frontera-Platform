import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { loadClientContext, formatClientContextForPrompt } from '@/lib/agents/strategy-coach/client-context';
import { getPersonaSection } from '@/lib/agents/strategy-coach/personas';
import { trackEvent } from '@/lib/analytics/posthog-server';

/**
 * Coach Suggestion API Endpoint
 *
 * POST /api/product-strategy-agent-v2/coach-suggestion
 *
 * Generates AI-powered suggestions for research area questions based on:
 * - Client context (company, industry, strategic focus, pain points)
 * - Discovery phase materials (uploaded documents, AI research)
 * - Current territory and research area being explored
 * - Previously mapped territory insights
 * - User's existing responses
 *
 * Request Body:
 * {
 *   conversation_id: string;
 *   territory: 'company' | 'customer' | 'competitor';
 *   research_area: string;
 *   research_area_title: string;
 *   questions: string[];
 *   existing_responses?: Record<number, string>;
 * }
 *
 * Response:
 * {
 *   suggestions: Array<{
 *     question_index: number;
 *     suggestion: string;
 *     key_points: string[];
 *     sources_hint: string;
 *   }>;
 *   context_used: {
 *     has_client_context: boolean;
 *     has_discovery_materials: boolean;
 *     has_territory_insights: boolean;
 *     materials_count: number;
 *   };
 *   generated_at: string;
 * }
 */

interface CoachSuggestionRequest {
  conversation_id: string;
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  research_area_title: string;
  questions: string[];
  existing_responses?: Record<number, string>;
}

interface QuestionSuggestion {
  question_index: number;
  suggestion: string;
  core_competencies: string[];
  core_differentiation: string[];
  key_points: string[];
  sources_hint: string;
}

interface CoachSuggestionResponse {
  suggestions: QuestionSuggestion[];
  context_used: {
    has_client_context: boolean;
    has_discovery_materials: boolean;
    has_territory_insights: boolean;
    materials_count: number;
  };
  generated_at: string;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(url, key);
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Authentication
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request
    const body: CoachSuggestionRequest = await req.json();
    const {
      conversation_id,
      territory,
      research_area,
      research_area_title,
      questions,
      existing_responses = {},
    } = body;

    if (!conversation_id) {
      return Response.json({ error: 'conversation_id is required' }, { status: 400 });
    }

    if (!territory || !['company', 'customer', 'competitor'].includes(territory)) {
      return Response.json({ error: 'Valid territory is required' }, { status: 400 });
    }

    if (!research_area || !research_area_title) {
      return Response.json({ error: 'research_area and research_area_title are required' }, { status: 400 });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: 'questions array is required' }, { status: 400 });
    }

    // 3. Verify conversation ownership and get client info
    const supabase = getSupabaseAdmin();
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return Response.json({ error: 'Conversation not found or unauthorized' }, { status: 404 });
    }

    // 4. Gather all context for the AI
    const [clientContext, discoveryMaterials, territoryInsights] = await Promise.all([
      loadClientContext(orgId),
      loadDiscoveryMaterials(conversation_id),
      loadTerritoryInsights(conversation_id),
    ]);

    // Track suggestion request
    trackEvent('coach_suggestion_requested', userId, {
      conversation_id,
      territory,
      research_area,
      has_discovery_materials: discoveryMaterials.length > 0,
      materials_count: discoveryMaterials.length,
      existing_responses_count: Object.keys(existing_responses).length,
      questions_count: questions.length,
    });

    // 5. Build the AI prompt with all context
    const prompt = buildCoachSuggestionPrompt({
      clientContext,
      discoveryMaterials,
      territoryInsights,
      territory,
      researchArea: research_area,
      researchAreaTitle: research_area_title,
      questions,
      existingResponses: existing_responses,
    });

    // DEBUG: Log the full prompt being sent
    console.log('=== COACH SUGGESTION PROMPT ===');
    console.log(prompt);
    console.log('=== END PROMPT ===');

    // 6. Call Claude AI
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 7. Parse AI response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    // DEBUG: Log the raw response from Claude
    console.log('=== CLAUDE RAW RESPONSE ===');
    console.log(responseText);
    console.log('=== END RESPONSE ===');

    const suggestions = parseSuggestionsResponse(responseText, questions.length);

    // DEBUG: Log parsed suggestions
    console.log('=== PARSED SUGGESTIONS ===');
    console.log(JSON.stringify(suggestions, null, 2));
    console.log('=== END PARSED ===');

    // 8. Build response
    const response: CoachSuggestionResponse = {
      suggestions,
      context_used: {
        has_client_context: clientContext !== null,
        has_discovery_materials: discoveryMaterials.length > 0,
        has_territory_insights: territoryInsights.length > 0,
        materials_count: discoveryMaterials.length,
      },
      generated_at: new Date().toISOString(),
    };

    const generationTime = Date.now() - startTime;
    console.log(`Coach suggestion generated in ${generationTime}ms`);

    // Track successful suggestion generation
    trackEvent('coach_suggestion_displayed', userId, {
      conversation_id,
      territory,
      research_area,
      suggestions_count: suggestions.length,
      generation_time_ms: generationTime,
      has_client_context: clientContext !== null,
      has_discovery_materials: discoveryMaterials.length > 0,
    });

    return Response.json(response);
  } catch (error) {
    console.error('Coach suggestion error:', error);

    // Track error (best effort - may not have userId in all error cases)
    try {
      const { userId } = await auth();
      if (userId) {
        trackEvent('coach_suggestion_error', userId, {
          error_type: error instanceof Error ? error.name : 'Unknown',
          error_message: error instanceof Error ? error.message : String(error),
        });
      }
    } catch {
      // Ignore auth errors during error tracking
    }

    return Response.json(
      { error: 'Internal server error generating coach suggestions' },
      { status: 500 }
    );
  }
}

/**
 * Get a raw Supabase client without Database generic for queries with type issues
 */
function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Load Discovery phase materials for context
 */
async function loadDiscoveryMaterials(
  conversationId: string
): Promise<Array<{ filename: string; content: string; source: string }>> {
  const rawSupabase = getRawSupabase();
  const { data: materials } = await rawSupabase
    .from('uploaded_materials')
    .select('filename, extracted_context')
    .eq('conversation_id', conversationId)
    .eq('processing_status', 'completed');

  if (!materials || materials.length === 0) {
    return [];
  }

  return materials
    .filter((m: { extracted_context: unknown }) => m.extracted_context && typeof m.extracted_context === 'object')
    .map((m: { filename: string; extracted_context: unknown }) => {
      const context = m.extracted_context as Record<string, unknown>;
      return {
        filename: m.filename,
        content: (context.text as string) || '',
        source: (context.source as string) || 'Uploaded document',
      };
    })
    .filter((m: { content: string }) => m.content.length > 0);
}

/**
 * Load previously mapped territory insights
 */
async function loadTerritoryInsights(
  conversationId: string
): Promise<Array<{ territory: string; area: string; responses: Record<string, string> }>> {
  const rawSupabase = getRawSupabase();
  const { data: insights } = await rawSupabase
    .from('territory_insights')
    .select('territory, research_area, responses')
    .eq('conversation_id', conversationId)
    .in('status', ['in_progress', 'mapped']);

  if (!insights || insights.length === 0) {
    return [];
  }

  return insights.map((i: { territory: string; research_area: string; responses: unknown }) => ({
    territory: i.territory,
    area: i.research_area,
    responses: (i.responses as Record<string, string>) || {},
  }));
}

interface PromptContext {
  clientContext: Awaited<ReturnType<typeof loadClientContext>>;
  discoveryMaterials: Array<{ filename: string; content: string; source: string }>;
  territoryInsights: Array<{ territory: string; area: string; responses: Record<string, string> }>;
  territory: string;
  researchArea: string;
  researchAreaTitle: string;
  questions: string[];
  existingResponses: Record<number, string>;
}

/**
 * Build focused prompt for coach suggestions - opinionated expert recommendations
 */
function buildCoachSuggestionPrompt(ctx: PromptContext): string {
  const sections: string[] = [];

  const industry = ctx.clientContext?.industry || 'technology';
  const companyName = ctx.clientContext?.companyName || 'this company';

  // Use selected persona if available, otherwise use supportive coach default
  if (ctx.clientContext?.persona) {
    const personaSection = getPersonaSection(ctx.clientContext.persona);
    if (personaSection) {
      sections.push(personaSection);
    }
  } else {
    // Default supportive expert coach persona (fallback when no persona selected)
    sections.push(`You are a trusted strategy coach and ${industry} expert supporting ${companyName} in their strategic journey.

**Your role:**
You have reviewed all available data about ${companyName}, their market position, and their strategic inputs. Now help them by synthesizing this with your knowledge of:
- Current ${industry} market dynamics and competitive landscape
- Leading analyst perspectives (Gartner, Forrester, McKinsey, BCG)
- Recent market trends and news affecting this sector
- Best practices from successful companies in similar positions

**Your coaching approach:**
- Be OPINIONATED about strategy - give clear, confident recommendations
- Provide SPECIFIC ANSWERS they can build on, not vague suggestions
- Be SUPPORTIVE and ENCOURAGING - you're helping them succeed
- Build on their thinking - acknowledge what's working, then add value
- Share your expertise generously to help them see opportunities they might miss`);
  }

  // Client context
  if (ctx.clientContext) {
    sections.push('\n## COMPANY DATA');
    sections.push(formatClientContextForPrompt(ctx.clientContext));
  }

  // Discovery materials
  if (ctx.discoveryMaterials.length > 0) {
    sections.push('\n## STRATEGIC MATERIALS REVIEWED');
    ctx.discoveryMaterials.slice(0, 3).forEach((m) => {
      const briefContent = m.content.length > 1000
        ? m.content.substring(0, 1000) + '...'
        : m.content;
      sections.push(`**${m.filename}:** ${briefContent}\n`);
    });
  }

  // All prior research - important for building on previous answers
  if (ctx.territoryInsights.length > 0) {
    sections.push('\n## USER\'S RESEARCH TO DATE');
    ctx.territoryInsights.forEach((insight) => {
      const responses = Object.entries(insight.responses).filter(([, r]) => r && r.trim());
      if (responses.length > 0) {
        sections.push(`\n**${insight.territory.toUpperCase()} - ${insight.area.replace(/_/g, ' ')}:**`);
        responses.forEach(([key, value]) => {
          sections.push(`Q${parseInt(key) + 1}: ${value.substring(0, 300)}${value.length > 300 ? '...' : ''}`);
        });
      }
    });
  }

  // Current question - THE FOCUS
  sections.push('\n## SPECIFIC QUESTIONS REQUIRING DISTINCT EXPERT RECOMMENDATIONS');
  sections.push(`**Research Area Context:** ${ctx.researchAreaTitle}`);
  sections.push(`\n**CRITICAL:** Each question below addresses a DIFFERENT ASPECT of this research area. Your recommendations MUST be unique and question-specific. DO NOT provide similar answers across questions.`);

  ctx.questions.forEach((q, i) => {
    const existingResponse = ctx.existingResponses[i];
    sections.push(`\n**Question ${i + 1} (UNIQUE FOCUS):** ${q}`);
    if (existingResponse && existingResponse.trim()) {
      sections.push(`*User's current draft:* "${existingResponse}"`);
      sections.push(`*Your task:* Build on their thinking with insights SPECIFIC TO THIS QUESTION. Acknowledge what's strong, then add targeted recommendations that directly answer THIS question's unique focus.`);
    } else {
      sections.push(`*Your task:* Provide a recommended answer SPECIFIC TO THIS QUESTION, not generic territory advice. Focus on what makes THIS question different from the others.`);
    }
  });

  // Supportive but opinionated output format with clear structure
  sections.push(`\n## RESPONSE FORMAT

CRITICAL INSTRUCTIONS:
1. Your response MUST be specific to ${companyName} and their ${industry} context
2. Each question requires a DISTINCT, UNIQUE answer - DO NOT repeat similar insights across questions
3. Focus on what makes EACH question different from the others
4. Reference specific company data and materials for EACH question's unique focus

For EACH question, provide your expert recommendation using this EXACT format:

QUESTION [N]

Suggestion: [A 1-2 sentence introduction that directly addresses ${companyName}'s specific situation based on the company data and materials provided above. Reference specific details from their documents.]

Core Competencies Proposals:
- [Specific competency for ${companyName} based on their stated strengths, team capabilities, or technology advantages mentioned in their materials]
- [Another competency derived from ${companyName}'s unique position in the ${industry} market]
- [A third competency that builds on ${companyName}'s existing assets or strategic focus areas]

Core Differentiation Capability:
- [How ${companyName} specifically differentiates from competitors based on their strategic materials]
- [A competitive advantage unique to ${companyName}'s market position and offerings]
- [Strategic positioning insight specific to ${companyName}'s target customers and value proposition]

Key Points:
- [Actionable recommendation tailored to ${companyName}'s current strategic priorities]
- [Market intelligence specific to ${companyName}'s ${industry} segment and competitive landscape]
- [Concrete next step ${companyName} should take given their resources and goals]

Sources Hint: [Data sources relevant to ${companyName}'s specific situation]

---

**CRITICAL REQUIREMENTS:**
- Every bullet point MUST reference ${companyName}'s specific situation, not generic advice
- Pull specific details from the COMPANY DATA and STRATEGIC MATERIALS sections above
- Each question's answer MUST be DISTINCT - avoid repeating similar insights across questions
- Focus on the UNIQUE aspect that each question is asking about
- If you don't have specific information, make reasonable inferences based on their ${industry} context
- Be CONFIDENT and SPECIFIC - vague suggestions are not helpful
- Reference actual company details: their products, customers, challenges, or strategic goals
- Ensure your answers to Question 1, 2, 3, etc. are clearly different from each other
- Maximum 250 words per recommendation`);

  return sections.join('\n');
}

/**
 * Parse bullet points from a text section
 * Handles markdown bold markers (**text**) and various bullet formats
 */
function parseBulletPoints(text: string): string[] {
  const points: string[] = [];
  // Match lines starting with - or • (bullet points)
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
      // Remove bullet marker and clean up bold markers
      let cleaned = trimmed.replace(/^[-•]\s*/, '').trim();
      // Remove leading/trailing ** bold markers
      cleaned = cleaned.replace(/^\*\*/, '').replace(/\*\*$/, '');
      // Remove inline bold markers like **text** -> text
      cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
      if (cleaned) points.push(cleaned);
    }
  }
  return points;
}

/**
 * Parse the AI response into structured suggestions
 */
function parseSuggestionsResponse(responseText: string, questionCount: number): QuestionSuggestion[] {
  const suggestions: QuestionSuggestion[] = [];

  // Split by question separator
  const questionSections = responseText.split(/---/).filter((s) => s.trim());

  for (let i = 0; i < questionCount; i++) {
    const section = questionSections[i] || '';

    let suggestion = '';
    const coreCompetencies: string[] = [];
    const coreDifferentiation: string[] = [];
    const keyPoints: string[] = [];
    let sourcesHint = '';

    // Parse Suggestion (introduction statement) - handle optional ** bold markers
    const suggestionMatch = section.match(/\*?\*?Suggestion:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Core Competencies Proposals:?\*?\*?|\*?\*?Key Points:?\*?\*?|$)/i);
    if (suggestionMatch) {
      suggestion = suggestionMatch[1].trim().replace(/^\*\*|\*\*$/g, '');
    }

    // Parse Core Competencies Proposals - handle optional ** bold markers
    const competenciesMatch = section.match(/\*?\*?Core Competencies Proposals:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Core Differentiation Capability:?\*?\*?|\*?\*?Key Points:?\*?\*?|\*?\*?Sources Hint:?\*?\*?|$)/i);
    if (competenciesMatch) {
      coreCompetencies.push(...parseBulletPoints(competenciesMatch[1]));
    }

    // Parse Core Differentiation Capability - handle optional ** bold markers
    const differentiationMatch = section.match(/\*?\*?Core Differentiation Capability:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Key Points:?\*?\*?|\*?\*?Sources Hint:?\*?\*?|$)/i);
    if (differentiationMatch) {
      coreDifferentiation.push(...parseBulletPoints(differentiationMatch[1]));
    }

    // Parse Key Points - handle optional ** bold markers
    const keyPointsMatch = section.match(/\*?\*?Key Points:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Sources Hint:?\*?\*?|$)/i);
    if (keyPointsMatch) {
      keyPoints.push(...parseBulletPoints(keyPointsMatch[1]));
    }

    // Parse Sources Hint - handle optional ** bold markers
    const sourcesMatch = section.match(/\*?\*?Sources Hint:?\*?\*?\s*([\s\S]*?)$/i);
    if (sourcesMatch) {
      sourcesHint = sourcesMatch[1].trim().replace(/^\*\*|\*\*$/g, '');
    }

    // Fallback if parsing failed
    if (!suggestion && section.trim()) {
      suggestion = section.trim().substring(0, 500);
      keyPoints.push('Review your strategic documents for relevant information');
      keyPoints.push('Consider perspectives from different stakeholders');
      keyPoints.push('Look for data and evidence to support your analysis');
      sourcesHint = 'Review your uploaded materials and consult with your team';
    }

    suggestions.push({
      question_index: i,
      suggestion: suggestion || 'Consider the strategic implications of this question for your specific situation.',
      core_competencies: coreCompetencies.length > 0 ? coreCompetencies : [
        'Identify your unique organizational strengths',
        'Consider your team\'s expertise and capabilities',
        'Evaluate your technology and process advantages',
      ],
      core_differentiation: coreDifferentiation.length > 0 ? coreDifferentiation : [
        'What sets you apart from competitors',
        'Your unique value proposition',
        'Sustainable competitive advantages',
      ],
      key_points: keyPoints.length > 0 ? keyPoints : [
        'Analyze this in the context of your company',
        'Consider both internal and external factors',
        'Look for supporting evidence',
      ],
      sources_hint: sourcesHint || 'Review your strategic materials and team knowledge',
    });
  }

  return suggestions;
}
