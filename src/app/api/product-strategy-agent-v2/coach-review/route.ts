import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { loadClientContext, formatClientContextForPrompt } from '@/lib/agents/strategy-coach/client-context';
import { getPersonaSection } from '@/lib/agents/strategy-coach/personas';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import { trackEvent } from '@/lib/analytics/posthog-server';
import type { CoachReview, CoachChallenge, CoachEnhancement, ResourceLink } from '@/types/coaching-cards';
import type { Territory } from '@/types/coaching-cards';

/**
 * Coach Review API Endpoint
 *
 * POST /api/product-strategy-agent-v2/coach-review
 *
 * Provides critical assessment of a user's draft answer, including:
 * - Summary assessment
 * - Strengths identified
 * - Challenges to prompt deeper thinking
 * - Enhancement suggestions
 * - Relevant resource links
 * - Suggested improved revision
 *
 * Request Body:
 * {
 *   conversation_id: string;
 *   territory: 'company' | 'customer' | 'competitor';
 *   research_area: string;
 *   question_index: number;
 *   draft_answer: string;
 * }
 *
 * Response: CoachReview
 */

interface CoachReviewRequest {
  conversation_id: string;
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  question_index: number;
  draft_answer: string;
}


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

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Authentication
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request
    const body: CoachReviewRequest = await req.json();
    const {
      conversation_id,
      territory,
      research_area,
      question_index,
      draft_answer,
    } = body;

    if (!conversation_id) {
      return Response.json({ error: 'conversation_id is required' }, { status: 400 });
    }

    if (!territory || !['company', 'customer', 'competitor'].includes(territory)) {
      return Response.json({ error: 'Valid territory is required' }, { status: 400 });
    }

    if (!research_area) {
      return Response.json({ error: 'research_area is required' }, { status: 400 });
    }

    if (typeof question_index !== 'number' || question_index < 0) {
      return Response.json({ error: 'Valid question_index is required' }, { status: 400 });
    }

    if (!draft_answer || draft_answer.trim().length === 0) {
      return Response.json({ error: 'draft_answer is required' }, { status: 400 });
    }

    // 3. Verify conversation ownership
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

    // 4. Get question text from single source of truth
    const area = getResearchArea(territory as Territory, research_area);
    const questionText = area?.questions[question_index]?.text || 'This strategic question';

    // 5. Gather context for AI
    const [clientContext, discoveryMaterials, territoryInsights] = await Promise.all([
      loadClientContext(orgId),
      loadDiscoveryMaterials(conversation_id),
      loadTerritoryInsights(conversation_id),
    ]);

    // Track review request
    trackEvent('coach_review_requested', userId, {
      conversation_id,
      territory,
      research_area,
      question_index,
      draft_length: draft_answer.length,
      has_discovery_materials: discoveryMaterials.length > 0,
    });

    // 6. Build the AI prompt
    const prompt = buildCoachReviewPrompt({
      clientContext,
      discoveryMaterials,
      territoryInsights,
      territory,
      researchArea: research_area,
      questionText,
      questionIndex: question_index,
      draftAnswer: draft_answer,
    });

    // 7. Call Claude AI
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 8. Parse AI response
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    const review = parseReviewResponse(responseText);

    const generationTime = Date.now() - startTime;
    console.log(`Coach review generated in ${generationTime}ms`);

    // Track successful review generation
    trackEvent('coach_review_displayed', userId, {
      conversation_id,
      territory,
      research_area,
      question_index,
      challenges_count: review.challenges.length,
      enhancements_count: review.enhancements.length,
      resources_count: review.resources.length,
      has_revision: !!review.suggestedRevision,
      generation_time_ms: generationTime,
    });

    return Response.json(review);
  } catch (error) {
    console.error('Coach review error:', error);

    // Track error
    try {
      const { userId } = await auth();
      if (userId) {
        trackEvent('coach_review_error', userId, {
          error_type: error instanceof Error ? error.name : 'Unknown',
          error_message: error instanceof Error ? error.message : String(error),
        });
      }
    } catch {
      // Ignore auth errors during error tracking
    }

    return Response.json(
      { error: 'Internal server error generating coach review' },
      { status: 500 }
    );
  }
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

interface ReviewPromptContext {
  clientContext: Awaited<ReturnType<typeof loadClientContext>>;
  discoveryMaterials: Array<{ filename: string; content: string; source: string }>;
  territoryInsights: Array<{ territory: string; area: string; responses: Record<string, string> }>;
  territory: string;
  researchArea: string;
  questionText: string;
  questionIndex: number;
  draftAnswer: string;
}

/**
 * Build the prompt for coach review
 */
function buildCoachReviewPrompt(ctx: ReviewPromptContext): string {
  const sections: string[] = [];

  const industry = ctx.clientContext?.industry || 'technology';
  const companyName = ctx.clientContext?.companyName || 'this company';

  // Persona section
  if (ctx.clientContext?.persona) {
    const personaSection = getPersonaSection(ctx.clientContext.persona);
    if (personaSection) {
      sections.push(personaSection);
    }
  } else {
    sections.push(`You are a senior strategy consultant reviewing a client's strategic research work in the ${industry} industry.

**Your role:** Provide a CRITICAL but CONSTRUCTIVE review of their draft answer. You're helping ${companyName} develop stronger strategic thinking by:
- Identifying what's working in their answer (strengths)
- Asking probing questions that push deeper thinking (challenges)
- Suggesting specific improvements (enhancements)
- Recommending relevant frameworks and resources
- Offering an improved version they can adopt (suggested revision)

**Your approach:**
- Be DIRECT and HONEST - diplomatic but not sugar-coated
- Push for SPECIFICITY over generalities
- Challenge ASSUMPTIONS and ask "how do you know?"
- Encourage EVIDENCE-BASED thinking
- Build on their thinking - don't tear it down
- Consider ${industry}-specific dynamics and best practices`);
  }

  // Company context
  if (ctx.clientContext) {
    sections.push('\n## COMPANY CONTEXT');
    sections.push(formatClientContextForPrompt(ctx.clientContext));
  }

  // Discovery materials (brief)
  if (ctx.discoveryMaterials.length > 0) {
    sections.push('\n## AVAILABLE STRATEGIC MATERIALS');
    ctx.discoveryMaterials.slice(0, 2).forEach((m) => {
      const briefContent = m.content.length > 500
        ? m.content.substring(0, 500) + '...'
        : m.content;
      sections.push(`**${m.filename}:** ${briefContent}`);
    });
  }

  // Prior research for context
  if (ctx.territoryInsights.length > 0) {
    sections.push('\n## USER\'S PRIOR RESEARCH');
    ctx.territoryInsights.slice(0, 3).forEach((insight) => {
      const responses = Object.entries(insight.responses).filter(([, r]) => r && r.trim());
      if (responses.length > 0) {
        sections.push(`**${insight.territory.toUpperCase()} - ${insight.area.replace(/_/g, ' ')}:**`);
        responses.forEach(([key, value]) => {
          sections.push(`Q${parseInt(key) + 1}: ${value.substring(0, 200)}...`);
        });
      }
    });
  }

  // The draft to review
  sections.push('\n## DRAFT ANSWER TO REVIEW');
  sections.push(`**Territory:** ${ctx.territory.toUpperCase()}`);
  sections.push(`**Research Area:** ${ctx.researchArea.replace(/_/g, ' ')}`);
  sections.push(`**Question ${ctx.questionIndex + 1}:** ${ctx.questionText}`);
  sections.push(`\n**User's Draft Answer:**\n"${ctx.draftAnswer}"`);

  // Output format
  sections.push(`\n## RESPONSE FORMAT

Provide your review using this EXACT JSON format (valid JSON only, no markdown):

{
  "summary": "A 2-3 sentence overall assessment of the answer quality and strategic thinking",
  "strengths": [
    "First strength identified in the draft",
    "Second strength identified"
  ],
  "challenges": [
    {
      "question": "A probing question that pushes deeper thinking",
      "rationale": "Why this question matters for their strategy"
    },
    {
      "question": "Another challenge question",
      "rationale": "The strategic importance of exploring this"
    }
  ],
  "enhancements": [
    {
      "suggestion": "A specific way to improve the answer",
      "example": "A concrete example of how to apply this"
    },
    {
      "suggestion": "Another enhancement suggestion",
      "example": "Example application"
    }
  ],
  "resources": [
    {
      "id": "resource-1",
      "type": "podcast",
      "title": "Relevant podcast episode title",
      "author": "Host name",
      "source": "Lenny's Podcast",
      "relevance": "Why this resource is relevant to their question",
      "keyInsight": "A key quote or insight from this resource"
    },
    {
      "id": "resource-2",
      "type": "framework",
      "title": "Relevant strategic framework",
      "source": "Strategy literature",
      "relevance": "How this framework applies to their situation"
    }
  ],
  "suggestedRevision": "An improved version of their answer that incorporates your feedback and is ready for them to use. This should be 2-3 paragraphs that they could directly adopt or build from."
}

**Resource types available:** podcast, book, article, framework, video
**Resource sources to reference:** Lenny's Podcast, HBR, McKinsey Insights, Stratechery, First Round Review, Reforge, Product-led Growth literature

IMPORTANT: Return ONLY valid JSON. No markdown formatting, no code blocks, just the JSON object.`);

  return sections.join('\n');
}

/**
 * Parse the AI response into CoachReview structure
 */
function parseReviewResponse(responseText: string): CoachReview {
  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and structure the response
    const review: CoachReview = {
      summary: parsed.summary || 'Your answer demonstrates good strategic thinking. Here are some ways to strengthen it further.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : undefined,
      challenges: (Array.isArray(parsed.challenges) ? parsed.challenges : []).map((c: Partial<CoachChallenge>) => ({
        question: c.question || 'Consider exploring this area more deeply.',
        rationale: c.rationale,
      })),
      enhancements: (Array.isArray(parsed.enhancements) ? parsed.enhancements : []).map((e: Partial<CoachEnhancement>) => ({
        suggestion: e.suggestion || 'Add more specific details.',
        example: e.example,
      })),
      resources: (Array.isArray(parsed.resources) ? parsed.resources : []).map((r: Partial<ResourceLink>, idx: number) => ({
        id: r.id || `resource-${idx + 1}`,
        type: (['podcast', 'book', 'article', 'framework', 'video'].includes(r.type as string) ? r.type : 'article') as ResourceLink['type'],
        title: r.title || 'Recommended Resource',
        author: r.author,
        source: r.source || 'Strategy Literature',
        relevance: r.relevance || 'This resource provides relevant insights.',
        url: r.url,
        episodeInfo: r.episodeInfo,
        keyInsight: r.keyInsight,
      })),
      suggestedRevision: parsed.suggestedRevision || undefined,
    };

    // Ensure we have at least some challenges and enhancements
    if (review.challenges.length === 0) {
      review.challenges = [
        {
          question: 'What specific evidence supports this answer?',
          rationale: 'Grounding strategic claims in data strengthens your position.',
        },
        {
          question: 'How might this change in the next 2-3 years?',
          rationale: 'Anticipating change is essential for robust strategy.',
        },
      ];
    }

    if (review.enhancements.length === 0) {
      review.enhancements = [
        {
          suggestion: 'Add specific examples or data points to support your claims.',
          example: 'For instance, cite customer feedback, market research, or competitive analysis.',
        },
      ];
    }

    return review;
  } catch (error) {
    console.error('Error parsing coach review response:', error);

    // Return a fallback review
    return {
      summary: 'Your answer provides a good starting point. Here are some suggestions to strengthen your strategic thinking.',
      strengths: ['You\'ve addressed the core question', 'The answer shows understanding of the topic'],
      challenges: [
        {
          question: 'What specific evidence or data supports your answer?',
          rationale: 'Grounding claims in evidence strengthens strategic decisions.',
        },
        {
          question: 'How might competitors or market changes affect this?',
          rationale: 'Considering external factors creates more robust strategy.',
        },
      ],
      enhancements: [
        {
          suggestion: 'Add more specific examples to illustrate your points.',
          example: 'Reference particular customers, products, or situations.',
        },
        {
          suggestion: 'Consider the time horizon - what\'s true now vs. in 2 years?',
        },
      ],
      resources: [
        {
          id: 'resource-1',
          type: 'podcast',
          title: 'How to Think About Strategy',
          source: "Lenny's Podcast",
          relevance: 'Provides frameworks for strategic thinking',
        },
      ],
    };
  }
}
