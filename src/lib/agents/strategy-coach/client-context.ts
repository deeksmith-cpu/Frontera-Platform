import { createClient } from "@supabase/supabase-js";
import type { Database, Client, ClientOnboarding, StrategicFocus, ClientTier } from "@/types/database";

/**
 * Client context loaded from the database for the Strategy Coach.
 * This provides the agent with full knowledge of the organization's
 * transformation journey, goals, and challenges.
 */
export interface ClientContext {
  // Organization identity
  companyName: string;
  industry: string | null;
  companySize: string | null;
  tier: ClientTier;

  // Strategic focus and transformation context
  strategicFocus: StrategicFocus | null;
  strategicFocusDescription: string;
  painPoints: string | null;
  previousAttempts: string | null;
  targetOutcomes: string | null;

  // Additional context from onboarding
  additionalContext: string | null;
  successMetrics: string[];
  timelineExpectations: string | null;

  // Metadata
  clerkOrgId: string;
  clientId: string;
}

// Map strategic focus to human-readable descriptions
const STRATEGIC_FOCUS_DESCRIPTIONS: Record<StrategicFocus, string> = {
  strategy_to_execution: "bridging the gap between strategic vision and operational reality",
  product_model: "transforming into a product-centric operating model",
  team_empowerment: "enabling autonomous, high-performing teams",
  mixed: "a comprehensive approach combining multiple focus areas",
  other: "a custom transformation focus",
};

/**
 * Get Supabase admin client for server-side operations.
 * Uses service role to bypass RLS for loading client context.
 */
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient<Database>(url, key);
}

/**
 * Load the full client context for the Strategy Coach.
 * Combines data from both the clients table and original onboarding record.
 */
export async function loadClientContext(clerkOrgId: string): Promise<ClientContext | null> {
  const supabase = getSupabaseAdmin();

  // Load the client record
  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("clerk_org_id", clerkOrgId)
    .single();

  if (clientError || !clientData) {
    console.error("Failed to load client:", clientError);
    return null;
  }

  const client = clientData as Client;

  // Load the original onboarding record if available
  let onboarding: ClientOnboarding | null = null;
  if (client.onboarding_id) {
    const { data: onboardingData, error: onboardingError } = await supabase
      .from("client_onboarding")
      .select("*")
      .eq("id", client.onboarding_id)
      .single();

    if (!onboardingError && onboardingData) {
      onboarding = onboardingData as ClientOnboarding;
    }
  }

  // Determine strategic focus - prefer client record, fall back to onboarding
  const strategicFocus = (client.strategic_focus as StrategicFocus) || onboarding?.strategic_focus || null;

  // Build the context object, merging data from both sources
  return {
    // Organization identity
    companyName: client.company_name,
    industry: client.industry || onboarding?.industry || null,
    companySize: client.company_size || onboarding?.company_size || null,
    tier: client.tier,

    // Strategic focus
    strategicFocus,
    strategicFocusDescription: strategicFocus
      ? STRATEGIC_FOCUS_DESCRIPTIONS[strategicFocus]
      : "product strategy transformation",

    // Transformation context - prefer client record, fall back to onboarding
    painPoints: client.pain_points || onboarding?.pain_points || null,
    previousAttempts: onboarding?.previous_attempts || null,
    targetOutcomes: client.target_outcomes || onboarding?.target_outcomes || null,

    // Additional onboarding context
    additionalContext: onboarding?.additional_context || null,
    successMetrics: onboarding?.success_metrics || [],
    timelineExpectations: onboarding?.timeline_expectations || null,

    // Metadata
    clerkOrgId,
    clientId: client.id,
  };
}

/**
 * Format client context for display in the system prompt.
 * Creates a structured summary that helps the agent understand the client.
 */
export function formatClientContextForPrompt(context: ClientContext): string {
  const sections: string[] = [];

  // Company overview
  sections.push(`## Your Client: ${context.companyName}`);

  const companyDetails: string[] = [];
  if (context.industry) companyDetails.push(`Industry: ${context.industry}`);
  if (context.companySize) companyDetails.push(`Size: ${context.companySize}`);
  companyDetails.push(`Tier: ${context.tier}`);
  sections.push(companyDetails.join(" | "));

  // Strategic focus
  if (context.strategicFocus) {
    sections.push(`\n### Strategic Focus`);
    sections.push(`Their primary focus is ${context.strategicFocusDescription}.`);
  }

  // Pain points
  if (context.painPoints) {
    sections.push(`\n### Key Challenges`);
    sections.push(context.painPoints);
  }

  // Previous attempts
  if (context.previousAttempts) {
    sections.push(`\n### Previous Transformation Attempts`);
    sections.push(context.previousAttempts);
  }

  // Target outcomes
  if (context.targetOutcomes) {
    sections.push(`\n### Target Outcomes`);
    sections.push(context.targetOutcomes);
  }

  // Success metrics
  if (context.successMetrics.length > 0) {
    sections.push(`\n### Success Metrics`);
    sections.push(`They measure success through: ${context.successMetrics.join(", ")}`);
  }

  // Timeline
  if (context.timelineExpectations) {
    sections.push(`\n### Timeline Expectations`);
    sections.push(context.timelineExpectations);
  }

  // Additional context
  if (context.additionalContext) {
    sections.push(`\n### Additional Context`);
    sections.push(context.additionalContext);
  }

  return sections.join("\n");
}

/**
 * Get a brief summary of the client for the opening message.
 */
export function getClientSummary(context: ClientContext): {
  painPointsSummary: string;
  outcomesSummary: string;
  focusSummary: string;
} {
  return {
    painPointsSummary: context.painPoints
      ? truncateText(context.painPoints, 100)
      : "improving product transformation outcomes",
    outcomesSummary: context.targetOutcomes
      ? truncateText(context.targetOutcomes, 100)
      : "achieving sustainable product-led growth",
    focusSummary: context.strategicFocusDescription,
  };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
