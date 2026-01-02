/**
 * PostHog Analytics for Strategy Coach
 *
 * Tracks the complete user journey through the coaching experience,
 * including conversation lifecycle, AI performance, and coaching progress.
 */

import posthog from "posthog-js";
import type { FrameworkState } from "@/lib/agents/strategy-coach/framework-state";
import type { ClientTier } from "@/types/database";

// ============================================================================
// TYPES
// ============================================================================

interface BaseAnalyticsProps {
  conversationId: string;
  orgId: string;
  userId: string;
  industry?: string | null;
  companySize?: string | null;
  strategicFocus?: string | null;
  clientTier: ClientTier;
}

interface MessageAnalyticsProps extends BaseAnalyticsProps {
  messageLength: number;
  frameworkPhase: FrameworkState["currentPhase"];
}

interface ResponseAnalyticsProps extends BaseAnalyticsProps {
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  frameworkPhase: FrameworkState["currentPhase"];
}

interface ProgressAnalyticsProps extends BaseAnalyticsProps {
  pillar?: "macroMarket" | "customer" | "colleague";
  action: "started" | "completed";
  insightCount?: number;
}

interface OutputAnalyticsProps extends BaseAnalyticsProps {
  outputType: string;
  outputId: string;
}

// ============================================================================
// CONVERSATION LIFECYCLE EVENTS
// ============================================================================

/**
 * Track when a new coaching conversation is started.
 */
export function trackConversationStarted(props: BaseAnalyticsProps): void {
  posthog.capture("strategy_coach_conversation_started", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    industry: props.industry,
    company_size: props.companySize,
    strategic_focus: props.strategicFocus,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a user resumes an existing conversation.
 */
export function trackConversationResumed(
  props: BaseAnalyticsProps & { messageCount: number; lastActivityDaysAgo: number }
): void {
  posthog.capture("strategy_coach_conversation_resumed", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    message_count: props.messageCount,
    last_activity_days_ago: props.lastActivityDaysAgo,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a conversation is marked as completed.
 */
export function trackConversationCompleted(
  props: BaseAnalyticsProps & {
    totalMessages: number;
    durationMinutes: number;
    strategicBetsCreated: number;
    outputsGenerated: number;
  }
): void {
  posthog.capture("strategy_coach_conversation_completed", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    total_messages: props.totalMessages,
    duration_minutes: props.durationMinutes,
    strategic_bets_created: props.strategicBetsCreated,
    outputs_generated: props.outputsGenerated,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// MESSAGE EXCHANGE EVENTS
// ============================================================================

/**
 * Track when a user sends a message to the coach.
 */
export function trackMessageSent(props: MessageAnalyticsProps): void {
  posthog.capture("strategy_coach_message_sent", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    message_length: props.messageLength,
    framework_phase: props.frameworkPhase,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a response is received from the coach.
 */
export function trackResponseReceived(props: ResponseAnalyticsProps): void {
  posthog.capture("strategy_coach_response_received", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    latency_ms: props.latencyMs,
    input_tokens: props.inputTokens,
    output_tokens: props.outputTokens,
    total_tokens: props.totalTokens,
    framework_phase: props.frameworkPhase,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when an LLM error occurs.
 */
export function trackLLMError(
  props: BaseAnalyticsProps & { errorType: string; errorMessage: string }
): void {
  posthog.capture("strategy_coach_llm_error", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    error_type: props.errorType,
    error_message: props.errorMessage,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// COACHING JOURNEY EVENTS
// ============================================================================

/**
 * Track when a research pillar is started or completed.
 */
export function trackResearchPillarProgress(props: ProgressAnalyticsProps): void {
  posthog.capture("strategy_coach_pillar_progress", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    pillar: props.pillar,
    action: props.action,
    insight_count: props.insightCount,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a strategic bet is created.
 */
export function trackStrategicBetCreated(
  props: BaseAnalyticsProps & { betId: string; pillarSource?: string }
): void {
  posthog.capture("strategy_coach_strategic_bet_created", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    bet_id: props.betId,
    pillar_source: props.pillarSource,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a strategic output/document is generated.
 */
export function trackOutputGenerated(props: OutputAnalyticsProps): void {
  posthog.capture("strategy_coach_output_generated", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    output_type: props.outputType,
    output_id: props.outputId,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track framework phase transitions.
 */
export function trackPhaseTransition(
  props: BaseAnalyticsProps & {
    fromPhase: FrameworkState["currentPhase"];
    toPhase: FrameworkState["currentPhase"];
  }
): void {
  posthog.capture("strategy_coach_phase_transition", {
    conversation_id: props.conversationId,
    agent_type: "strategy_coach",
    org_id: props.orgId,
    user_id: props.userId,
    from_phase: props.fromPhase,
    to_phase: props.toPhase,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// UI INTERACTION EVENTS
// ============================================================================

/**
 * Track when the sidebar is toggled.
 */
export function trackSidebarToggled(
  props: Pick<BaseAnalyticsProps, "conversationId" | "orgId" | "userId"> & {
    expanded: boolean;
  }
): void {
  posthog.capture("strategy_coach_sidebar_toggled", {
    conversation_id: props.conversationId,
    org_id: props.orgId,
    user_id: props.userId,
    expanded: props.expanded,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a document is exported.
 */
export function trackDocumentExported(
  props: Pick<BaseAnalyticsProps, "conversationId" | "orgId" | "userId"> & {
    outputId: string;
    format: "pdf" | "markdown" | "docx";
  }
): void {
  posthog.capture("strategy_coach_document_exported", {
    conversation_id: props.conversationId,
    org_id: props.orgId,
    user_id: props.userId,
    output_id: props.outputId,
    format: props.format,
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// SERVER-SIDE TRACKING (for API routes)
// ============================================================================

/**
 * Server-side analytics helper.
 * Use this in API routes where posthog-js isn't available.
 */
export async function trackServerEvent(
  eventName: string,
  distinctId: string,
  properties: Record<string, unknown>
): Promise<void> {
  // Import posthog-node for server-side tracking
  const { PostHog } = await import("posthog-node");

  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  });

  client.capture({
    distinctId,
    event: eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
    },
  });

  // Flush to ensure event is sent
  await client.shutdown();
}
