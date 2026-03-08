import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { loadClientContext, formatClientContextForPrompt } from '@/lib/agents/strategy-coach/client-context';
import { getPersonaSection } from '@/lib/agents/strategy-coach/personas';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import type { Territory } from '@/types/coaching-cards';

/**
 * Coach Chat API Endpoint
 *
 * POST /api/product-strategy-agent/coach-chat
 *
 * Handles follow-up conversation within the coach drawer.
 * The user can debate, ask follow-ups, or challenge the coach's suggestion/review.
 * Streams the response back. Does NOT save to conversation_messages.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface CoachChatRequest {
  conversation_id: string;
  territory: string;
  research_area: string;
  question_index: number;
  user_draft: string;
  coach_initial_content: string;
  mode: 'suggestion' | 'debate' | 'chat';
  chat_history: ChatMessage[];
  message: string;
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CoachChatRequest = await req.json();
    const {
      conversation_id,
      territory,
      research_area,
      question_index,
      user_draft,
      coach_initial_content,
      mode,
      chat_history,
      message,
    } = body;

    if (!conversation_id || !message?.trim()) {
      return Response.json({ error: 'conversation_id and message are required' }, { status: 400 });
    }

    // Verify conversation ownership
    const supabase = getSupabaseAdmin();
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, clerk_org_id')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Load context
    const clientContext = await loadClientContext(orgId);
    const area = getResearchArea(territory as Territory, research_area);
    const questionText = area?.questions[question_index]?.text || 'This strategic question';

    const industry = clientContext?.industry || 'technology';
    const companyName = clientContext?.companyName || 'this company';

    // Build system prompt for the coach chat
    const systemParts: string[] = [];

    // Persona
    if (clientContext?.persona) {
      const personaSection = getPersonaSection(clientContext.persona);
      if (personaSection) {
        systemParts.push(personaSection);
      }
    }

    if (systemParts.length === 0) {
      systemParts.push(`You are a senior strategy coach helping ${companyName} in the ${industry} industry.`);
    }

    systemParts.push(`
## CURRENT CONTEXT

You are in a focused coaching conversation about a specific research question.

**Territory:** ${territory}
**Research Area:** ${area?.title || research_area}
**Question:** ${questionText}

${user_draft ? `**User's Current Draft Answer:**\n"${user_draft}"` : '**User has not written a draft yet.**'}

## YOUR INITIAL ${mode === 'suggestion' ? 'SUGGESTION' : mode === 'debate' ? 'REVIEW/CHALLENGE' : 'GUIDANCE'}

${coach_initial_content || '(No initial content provided)'}

## INSTRUCTIONS

The user is now responding to your ${mode === 'suggestion' ? 'suggestion' : mode === 'debate' ? 'challenge/review' : 'guidance'}. They may:
- Disagree with your assessment and provide additional context or domain expertise
- Ask for clarification or examples
- Request you to update your suggestion based on new information they provide
- Want to debate a specific point

**Your approach:**
- LISTEN carefully to what the user is telling you — they have domain expertise you don't
- When the user provides new information or corrects you, ACKNOWLEDGE it and UPDATE your thinking
- If they disagree, engage constructively — ask WHY they see it differently, then incorporate their perspective
- If they provide new facts, integrate them into an UPDATED recommendation
- Be concise and conversational — this is a back-and-forth discussion, not a formal report
- When updating your suggestion, clearly state what changed and why
- If the user asks you to update your suggestion, provide a revised version they can use
- Stay focused on the specific research question — don't drift to other topics`);

    if (clientContext) {
      systemParts.push('\n## COMPANY CONTEXT');
      systemParts.push(formatClientContextForPrompt(clientContext));
    }

    const systemPrompt = systemParts.join('\n');

    // Build messages array: initial exchange + chat history + new message
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // Add prior chat history
    for (const msg of chat_history) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add the new user message
    messages.push({ role: 'user', content: message });

    // Stream response from Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

    // Create a ReadableStream from the Anthropic stream
    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Coach chat stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Coach chat error:', error);
    return Response.json(
      { error: 'Internal server error in coach chat' },
      { status: 500 }
    );
  }
}
