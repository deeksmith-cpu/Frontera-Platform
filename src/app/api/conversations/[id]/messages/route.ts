import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { Conversation, ConversationMessage } from "@/types/database";
import {
  loadClientContext,
  streamMessage,
  messagesToChatHistory,
  type FrameworkState,
} from "@/lib/agents/strategy-coach";
import { generateOpeningMessage } from "@/lib/agents/strategy-coach/system-prompt";
import { trackEvent } from "@/lib/analytics/posthog-server";

// Supabase client with service role
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

/**
 * POST /api/conversations/[id]/messages
 * Send a message and stream the AI response.
 *
 * If the message is empty/null and there are no existing messages,
 * returns the opening message from the coach.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();

  try {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !orgId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id: conversationId } = await params;
    const body = await req.json();
    const { message } = body;

    const supabase = getSupabaseAdmin();

    // Fetch conversation
    const { data: conversationData, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("clerk_org_id", orgId)
      .single();

    if (convError || !conversationData) {
      return new Response(JSON.stringify({ error: "Conversation not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const conversation = conversationData as Conversation;

    // Load client context
    const clientContext = await loadClientContext(orgId);
    if (!clientContext) {
      return new Response(
        JSON.stringify({ error: "Failed to load client context" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch existing messages
    const { data: existingMessages } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    const messages = (existingMessages || []) as ConversationMessage[];
    const frameworkState = conversation.framework_state as unknown as FrameworkState;
    const userName = user?.firstName || undefined;

    // Handle opening message request (no user message provided)
    if (!message || (typeof message === "string" && message.trim().length === 0)) {
      // If there are already messages, return them (no new message needed)
      if (messages.length > 0) {
        return new Response(
          JSON.stringify({
            content: null,
            existingMessages: messages.length,
            message: "Conversation already has messages"
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generate opening message for new conversation
      const openingMessage = generateOpeningMessage(
        clientContext,
        frameworkState,
        userName,
        false
      );

      // Save the opening message as an assistant message
      await supabase.from("conversation_messages").insert({
        conversation_id: conversationId,
        clerk_org_id: orgId,
        role: "assistant",
        content: openingMessage,
        metadata: { type: "opening" },
        token_count: Math.ceil(openingMessage.length / 4),
      });

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      return new Response(JSON.stringify({ content: openingMessage }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save the user message
    const { data: userMessageData, error: insertError } = await supabase
      .from("conversation_messages")
      .insert({
        conversation_id: conversationId,
        clerk_org_id: orgId,
        role: "user",
        content: message,
        metadata: {},
        token_count: Math.ceil(message.length / 4),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save user message:", insertError);
    }

    // Track message sent
    if (userMessageData) {
      await trackEvent("strategy_coach_message_sent", userId, {
        org_id: orgId,
        conversation_id: conversationId,
        message_id: userMessageData.id,
        message_length: message.length,
        framework_phase: frameworkState.currentPhase,
        pillar_context: frameworkState.currentPillar,
      });
    }

    // Convert messages to chat history format
    const chatHistory = messagesToChatHistory(messages);

    // Stream the response
    const { stream, getUsage } = await streamMessage(
      clientContext,
      frameworkState,
      chatHistory,
      message,
      userName
    );

    // Create a transform stream to collect the full response
    let fullResponse = "";
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        fullResponse += text;
        controller.enqueue(chunk);
      },
      async flush() {
        // Save the assistant message after streaming completes
        try {
          const usage = await getUsage();
          const streamDuration = Date.now() - startTime;

          const { data: assistantMessageData } = await supabase
            .from("conversation_messages")
            .insert({
              conversation_id: conversationId,
              clerk_org_id: orgId,
              role: "assistant",
              content: fullResponse,
              metadata: {
                input_tokens: usage.inputTokens,
                output_tokens: usage.outputTokens,
              },
              token_count: usage.outputTokens,
            })
            .select()
            .single();

          // Update conversation last_message_at and increment message count
          const previousPhase = frameworkState.currentPhase;
          const previousPillar = frameworkState.currentPillar;

          const updatedState = {
            ...frameworkState,
            totalMessageCount: (frameworkState.totalMessageCount || 0) + 2,
            lastActivityAt: new Date().toISOString(),
          };

          await supabase
            .from("conversations")
            .update({
              last_message_at: new Date().toISOString(),
              framework_state: updatedState,
            })
            .eq("id", conversationId);

          // Track message received
          if (assistantMessageData) {
            await trackEvent("strategy_coach_message_received", userId, {
              org_id: orgId,
              conversation_id: conversationId,
              message_id: assistantMessageData.id,
              response_length: fullResponse.length,
              streaming_duration_ms: streamDuration,
              framework_phase: updatedState.currentPhase,
              phase_changed: updatedState.currentPhase !== previousPhase,
            });
          }

          // Track phase transition
          if (updatedState.currentPhase !== previousPhase) {
            await trackEvent("strategy_coach_phase_transitioned", userId, {
              org_id: orgId,
              conversation_id: conversationId,
              from_phase: previousPhase,
              to_phase: updatedState.currentPhase,
              message_count_in_phase: updatedState.totalMessageCount || 0,
            });
          }

          // Track pillar activation
          if (updatedState.currentPillar !== previousPillar) {
            await trackEvent("strategy_coach_pillar_activated", userId, {
              org_id: orgId,
              conversation_id: conversationId,
              pillar: updatedState.currentPillar,
              progress: updatedState.researchProgress?.[updatedState.currentPillar || "macroMarket"] || 0,
            });
          }

          // Track canvas updates
          if (updatedState.strategicFlowCanvas) {
            const canvasSectionsFilled = Object.keys(updatedState.strategicFlowCanvas).filter(
              (k) => (updatedState.strategicFlowCanvas as any)[k]
            ).length;

            await trackEvent("strategy_coach_canvas_updated", userId, {
              org_id: orgId,
              conversation_id: conversationId,
              canvas_sections_filled: canvasSectionsFilled,
              total_canvas_sections: 6,
            });
          }

          // Track strategic bet creation
          const previousBetCount = frameworkState.strategicBets?.length || 0;
          const newBetCount = updatedState.strategicBets?.length || 0;
          if (newBetCount > previousBetCount && updatedState.strategicBets) {
            await trackEvent("strategy_coach_bet_created", userId, {
              org_id: orgId,
              conversation_id: conversationId,
              bet_count: newBetCount,
              bet_name: updatedState.strategicBets[newBetCount - 1]?.name || "Unknown",
            });
          }
        } catch (err) {
          console.error("Error saving assistant message:", err);
        }
      },
    });

    // Pipe the stream through the transform
    const responseStream = stream.pipeThrough(transformStream);

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Error in message handler:", err);

    // Track streaming error
    const { userId, orgId } = await auth();
    const { id: conversationId } = await params;

    if (userId) {
      const { data: conversationData } = await getSupabaseAdmin()
        .from("conversations")
        .select("framework_state")
        .eq("id", conversationId)
        .single();

      const frameworkState = conversationData?.framework_state as any;

      await trackEvent("strategy_coach_streaming_error", userId, {
        org_id: orgId || "unknown",
        conversation_id: conversationId,
        error_type: err instanceof Error ? err.name : "Unknown",
        error_message: err instanceof Error ? err.message : String(err),
        framework_phase: frameworkState?.currentPhase || "unknown",
      });
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process message",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
