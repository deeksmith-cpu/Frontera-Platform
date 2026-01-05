import Anthropic from "@anthropic-ai/sdk";
import { Anthropic as PostHogAnthropic } from "@posthog/ai";
import { getPostHogServer } from "@/lib/analytics/posthog-server";
import { ClientContext, loadClientContext } from "./client-context";
import { FrameworkState, initializeFrameworkState } from "./framework-state";
import { buildSystemPrompt, generateOpeningMessage } from "./system-prompt";
import type { ConversationMessage } from "@/types/database";

// Model configuration
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4096;

/**
 * Get Anthropic client wrapped with PostHog AI observability
 * This automatically tracks all LLM calls with token usage, latency, and cost
 */
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  // Create PostHog-wrapped Anthropic client for automatic tracking
  // This creates automatic 'ai_request' events with token usage and cost
  const posthog = getPostHogServer();
  const wrappedClient = new PostHogAnthropic({
    apiKey,
    posthog,
  });

  return wrappedClient as unknown as Anthropic;
}

/**
 * Message format for the conversation history sent to Claude.
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Configuration for creating a Strategy Coach session.
 */
export interface StrategyCoachConfig {
  clerkOrgId: string;
  clerkUserId: string;
  userName?: string;
  existingMessages?: ConversationMessage[];
  frameworkState?: FrameworkState;
}

/**
 * Response from a Strategy Coach message.
 */
export interface StrategyCoachResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string | null;
}

/**
 * Create a Strategy Coach session and get the opening message.
 */
export async function createCoachingSession(config: StrategyCoachConfig): Promise<{
  context: ClientContext;
  frameworkState: FrameworkState;
  openingMessage: string;
}> {
  // Load client context
  const context = await loadClientContext(config.clerkOrgId);
  if (!context) {
    throw new Error("Failed to load client context for organization");
  }

  // Initialize or use existing framework state
  const frameworkState = config.frameworkState || initializeFrameworkState();

  // Generate opening message
  const isResuming = (config.existingMessages?.length || 0) > 0;
  const openingMessage = generateOpeningMessage(
    context,
    frameworkState,
    config.userName,
    isResuming
  );

  return {
    context,
    frameworkState,
    openingMessage,
  };
}

/**
 * Send a message to the Strategy Coach and get a response (non-streaming).
 */
export async function sendMessage(
  context: ClientContext,
  frameworkState: FrameworkState,
  conversationHistory: ChatMessage[],
  userMessage: string
): Promise<StrategyCoachResponse> {
  const anthropic = getAnthropicClient();

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(context, frameworkState);

  // Prepare messages for Claude
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  // Call Claude
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages,
  });

  // Extract the response text
  const responseContent = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  return {
    content: responseContent,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason,
  };
}

/**
 * Stream a message response from the Strategy Coach.
 * Returns a ReadableStream that emits text chunks.
 */
export async function streamMessage(
  context: ClientContext,
  frameworkState: FrameworkState,
  conversationHistory: ChatMessage[],
  userMessage: string,
): Promise<{
  stream: ReadableStream<Uint8Array>;
  getUsage: () => Promise<{ inputTokens: number; outputTokens: number }>;
}> {
  const anthropic = getAnthropicClient();

  // Build the system prompt
  const systemPrompt = buildSystemPrompt(context, frameworkState);

  // Prepare messages for Claude
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  // Create streaming response
  const streamResponse = await anthropic.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages,
  });

  // Convert Anthropic stream to web ReadableStream
  // Note: Token usage is automatically tracked by PostHog AI SDK wrapper
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of streamResponse) {
          if (event.type === "content_block_delta") {
            const delta = event.delta;
            if ("text" in delta) {
              controller.enqueue(encoder.encode(delta.text));
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return {
    stream,
    getUsage: async () => {
      // Wait for stream to complete to get final usage
      await streamResponse.finalMessage();
      const finalMessage = await streamResponse.finalMessage();
      return {
        inputTokens: finalMessage.usage.input_tokens,
        outputTokens: finalMessage.usage.output_tokens,
      };
    },
  };
}

/**
 * Convert database messages to chat format.
 */
export function messagesToChatHistory(messages: ConversationMessage[]): ChatMessage[] {
  return messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));
}

/**
 * Estimate token count for a string (rough approximation).
 * Uses ~4 characters per token as a rule of thumb.
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

// Re-export types and functions for convenience
export { loadClientContext } from "./client-context";
export type { ClientContext } from "./client-context";
export { initializeFrameworkState, updateFrameworkState, calculateProgress } from "./framework-state";
export type { FrameworkState } from "./framework-state";
export { buildSystemPrompt, generateOpeningMessage } from "./system-prompt";
