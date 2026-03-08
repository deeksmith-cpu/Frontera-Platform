import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { loadClientContext, formatClientContextForPrompt } from '@/lib/agents/strategy-coach/client-context';
import type { StrategicOpportunity } from '@/types/synthesis';

/**
 * POST /api/product-strategy-agent/synthesis/coach
 *
 * Ephemeral coach chat focused on a specific strategic opportunity.
 * Streams response via Anthropic SDK. Does NOT persist messages.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SynthesisCoachRequest {
  conversation_id: string;
  opportunity: StrategicOpportunity;
  user_draft?: Partial<StrategicOpportunity>;
  message: string;
  chat_history: ChatMessage[];
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

    const body: SynthesisCoachRequest = await req.json();
    const { conversation_id, opportunity, user_draft, message, chat_history } = body;

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

    // Load client context
    const clientContext = await loadClientContext(orgId);
    const companyName = clientContext?.companyName || 'this company';
    const industry = clientContext?.industry || 'technology';

    // Build system prompt
    const systemParts: string[] = [];

    systemParts.push(`You are a senior strategy coach helping ${companyName} in the ${industry} industry refine a strategic hypothesis using the Playing to Win (PTW) framework by Roger Martin and A.G. Lafley.`);

    systemParts.push(`
## CURRENT OPPORTUNITY BEING DISCUSSED

**Title:** ${opportunity.title}
**Description:** ${opportunity.description}

**Where to Play:** ${opportunity.ptw?.whereToPlay || 'Not defined'}
**How to Win:** ${opportunity.ptw?.howToWin || 'Not defined'}
**Winning Aspiration:** ${opportunity.ptw?.winningAspiration || 'Not defined'}

**Scoring:**
- Market Attractiveness: ${opportunity.scoring?.marketAttractiveness || '?'}/10
- Capability Fit: ${opportunity.scoring?.capabilityFit || '?'}/10
- Competitive Advantage: ${opportunity.scoring?.competitiveAdvantage || '?'}/10

**Capabilities Required:** ${opportunity.ptw?.capabilitiesRequired?.join(', ') || 'Not defined'}
**Management Systems:** ${opportunity.ptw?.managementSystems?.join(', ') || 'Not defined'}

**Assumptions:**
${opportunity.assumptions?.map(a => `- [${a.category}] ${a.assumption}`).join('\n') || 'None defined'}`);

    if (user_draft) {
      systemParts.push(`
## USER'S CURRENT EDITS (Draft Changes)

${user_draft.title ? `**Title:** ${user_draft.title}` : ''}
${user_draft.description ? `**Description:** ${user_draft.description}` : ''}
${user_draft.ptw?.whereToPlay ? `**Where to Play:** ${user_draft.ptw.whereToPlay}` : ''}
${user_draft.ptw?.howToWin ? `**How to Win:** ${user_draft.ptw.howToWin}` : ''}
${user_draft.ptw?.winningAspiration ? `**Winning Aspiration:** ${user_draft.ptw.winningAspiration}` : ''}`);
    }

    systemParts.push(`
## INSTRUCTIONS

Help the user refine this strategic hypothesis. You should:
- Provide specific, actionable guidance on improving the WTP+HTW pairing
- Challenge weak assumptions or vague descriptions
- Suggest concrete improvements based on the Playing to Win framework
- Help them think about capabilities needed and management systems
- Be concise and conversational — this is a focused coaching chat
- When suggesting changes, be specific about what to change and why
- Stay focused on this particular opportunity — don't drift to other topics`);

    if (clientContext) {
      systemParts.push('\n## COMPANY CONTEXT');
      systemParts.push(formatClientContextForPrompt(clientContext));
    }

    const systemPrompt = systemParts.join('\n');

    // Build messages
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    for (const msg of (chat_history || [])) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: 'user', content: message });

    // Stream response from Claude
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

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
          console.error('Synthesis coach stream error:', err);
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
    console.error('Synthesis coach error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
