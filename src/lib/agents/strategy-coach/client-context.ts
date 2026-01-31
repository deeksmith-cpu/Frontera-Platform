import { createClient } from "@supabase/supabase-js";
import type { Database, Client, ClientOnboarding, StrategicFocus, ClientTier, PersonalProfileData } from "@/types/database";
import type { PersonaId } from "./personas";

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

  // Coaching persona (optional)
  persona: PersonaId | undefined;

  // Personal profile (from profiling conversation)
  personalProfile: PersonalProfileData | null;

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
export async function loadClientContext(clerkOrgId: string, clerkUserId?: string): Promise<ClientContext | null> {
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

  // Extract coaching persona from preferences if available
  // coaching_preferences is a JSONB column with { persona?: PersonaId }
  const coachingPreferences = (client as { coaching_preferences?: { persona?: string } }).coaching_preferences;
  const persona = coachingPreferences?.persona as PersonaId | undefined;

  // Load personal profile if userId provided
  let personalProfile: PersonalProfileData | null = null;
  if (clerkUserId) {
    personalProfile = await loadPersonalProfile(clerkUserId, clerkOrgId);
  }

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

    // Coaching persona
    persona,

    // Personal profile
    personalProfile,

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

/**
 * Load territory insights for a conversation to provide research context to the agent.
 */
export async function loadTerritoryInsights(conversationId: string): Promise<{
  company: Array<{ area: string; responses: Record<string, string> }>;
  customer: Array<{ area: string; responses: Record<string, string> }>;
  competitor: Array<{ area: string; responses: Record<string, string> }>;
}> {
  // Use raw client to avoid type issues
  const rawSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: insights } = await rawSupabase
    .from("territory_insights")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("status", "mapped");

  if (!insights || insights.length === 0) {
    return { company: [], customer: [], competitor: [] };
  }

  // Type the insights array
  type InsightRow = { territory: string; research_area: string; responses: unknown };
  const typedInsights = insights as InsightRow[];

  const company = typedInsights
    .filter((i) => i.territory === "company")
    .map((i) => ({
      area: i.research_area,
      responses: i.responses as Record<string, string>,
    }));

  const customer = typedInsights
    .filter((i) => i.territory === "customer")
    .map((i) => ({
      area: i.research_area,
      responses: i.responses as Record<string, string>,
    }));

  const competitor = typedInsights
    .filter((i) => i.territory === "competitor")
    .map((i) => ({
      area: i.research_area,
      responses: i.responses as Record<string, string>,
    }));

  return { company, customer, competitor };
}

/**
 * Structured synthesis output for the coach context.
 */
export interface SynthesisContext {
  executiveSummary: string;
  opportunities: Array<{
    title: string;
    description: string;
    quadrant: string;
    opportunityType: string;
    overallScore: number;
  }>;
  tensions: Array<{
    description: string;
    impact: string;
  }>;
  recommendations: string[];
  rawContent: string | null;
}

/**
 * Load synthesis output for a conversation to provide synthesis context to the agent.
 * Now returns structured data when available.
 */
export async function loadSynthesisOutput(conversationId: string): Promise<SynthesisContext | null> {
  // Use raw client to avoid type issues
  const rawSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: synthesis } = await rawSupabase
    .from("synthesis_outputs")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!synthesis) {
    return null;
  }

  // Type the synthesis data
  type SynthesisRow = {
    synthesis_content: string | null;
    executive_summary: string | null;
    opportunities: Array<{
      title: string;
      description: string;
      quadrant: string;
      opportunityType: string;
      scoring: { overallScore: number };
    }> | null;
    tensions: Array<{
      description: string;
      impact: string;
    }> | null;
    recommendations: string[] | null;
  };

  const typedSynthesis = synthesis as SynthesisRow;

  return {
    executiveSummary: typedSynthesis.executive_summary || '',
    opportunities: (typedSynthesis.opportunities || []).map((opp) => ({
      title: opp.title,
      description: opp.description,
      quadrant: opp.quadrant,
      opportunityType: opp.opportunityType,
      overallScore: opp.scoring?.overallScore || 0,
    })),
    tensions: (typedSynthesis.tensions || []).map((t) => ({
      description: t.description,
      impact: t.impact,
    })),
    recommendations: typedSynthesis.recommendations || [],
    rawContent: typedSynthesis.synthesis_content,
  };
}

/**
 * Format territory insights for the system prompt.
 */
export function formatTerritoryInsightsForPrompt(insights: {
  company: Array<{ area: string; responses: Record<string, string> }>;
  customer: Array<{ area: string; responses: Record<string, string> }>;
  competitor: Array<{ area: string; responses: Record<string, string> }>;
}): string {
  const sections: string[] = [];

  if (insights.company.length > 0) {
    sections.push("## Research Completed: Company Territory");
    insights.company.forEach((insight) => {
      sections.push(`\n### ${insight.area.replace(/_/g, " ").toUpperCase()}`);
      Object.entries(insight.responses).forEach(([question, answer]) => {
        sections.push(`**Q:** ${question}`);
        sections.push(`**A:** ${answer}`);
      });
    });
  }

  if (insights.customer.length > 0) {
    sections.push("\n## Research Completed: Customer Territory");
    insights.customer.forEach((insight) => {
      sections.push(`\n### ${insight.area.replace(/_/g, " ").toUpperCase()}`);
      Object.entries(insight.responses).forEach(([question, answer]) => {
        sections.push(`**Q:** ${question}`);
        sections.push(`**A:** ${answer}`);
      });
    });
  }

  if (insights.competitor.length > 0) {
    sections.push("\n## Research Completed: Market Context Territory");
    insights.competitor.forEach((insight) => {
      sections.push(`\n### ${insight.area.replace(/_/g, " ").toUpperCase()}`);
      Object.entries(insight.responses).forEach(([question, answer]) => {
        sections.push(`**Q:** ${question}`);
        sections.push(`**A:** ${answer}`);
      });
    });
  }

  return sections.join("\n");
}

/**
 * Format synthesis output for the system prompt.
 * Now accepts structured SynthesisContext.
 */
/**
 * Load personal profile for a user from their profiling conversation.
 */
export async function loadPersonalProfile(
  clerkUserId: string,
  clerkOrgId: string
): Promise<PersonalProfileData | null> {
  const rawSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: conversation } = await rawSupabase
    .from('conversations')
    .select('framework_state')
    .eq('clerk_user_id', clerkUserId)
    .eq('clerk_org_id', clerkOrgId)
    .eq('agent_type', 'profiling')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!conversation) return null;

  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  if (!frameworkState || frameworkState.status !== 'completed') return null;

  return (frameworkState.profileData as PersonalProfileData) || null;
}

/**
 * Format personal profile for inclusion in the system prompt.
 */
export function formatPersonalProfileForPrompt(profile: PersonalProfileData): string {
  const sections: string[] = [];

  sections.push('## Your User (Personal Profile)');
  sections.push('');

  sections.push(`**Role**: ${profile.role.title}${profile.role.department ? ` (${profile.role.department})` : ''}`);
  if (profile.role.yearsInRole) sections.push(`**Experience in role**: ${profile.role.yearsInRole}`);
  if (profile.role.teamSize) sections.push(`**Team size**: ${profile.role.teamSize}`);

  sections.push('');
  sections.push(`**Primary objective**: ${profile.objectives.primaryGoal}`);
  if (profile.objectives.timeHorizon) sections.push(`**Time horizon**: ${profile.objectives.timeHorizon}`);

  sections.push('');
  sections.push(`**Decision-making style**: ${profile.leadershipStyle.decisionMaking}`);
  sections.push(`**Communication preference**: ${profile.leadershipStyle.communicationPreference}`);
  sections.push(`**Feedback preference**: ${profile.workingStyle.feedbackPreference}`);

  sections.push('');
  sections.push(`**Strategic experience**: ${profile.experience.strategicExperience}`);
  if (profile.experience.biggestChallenge) {
    sections.push(`**Current challenge**: ${profile.experience.biggestChallenge}`);
  }

  sections.push('');
  sections.push(`**Preferred pace**: ${profile.workingStyle.preferredPace}`);
  sections.push(`**Detail orientation**: ${profile.workingStyle.detailVsBigPicture}`);

  sections.push('');
  sections.push('**Adapt your coaching to this profile**: Match the depth, pace, tone, and framing to their preferences. Reference their specific goals and challenges. Adjust formality and directness based on their feedback preference.');

  return sections.join('\n');
}

export function formatSynthesisForPrompt(synthesis: SynthesisContext): string {
  const sections: string[] = [];

  sections.push("## Strategic Synthesis Generated");
  sections.push("");

  // Executive Summary
  if (synthesis.executiveSummary) {
    sections.push("### Executive Summary");
    sections.push(synthesis.executiveSummary);
    sections.push("");
  }

  // Strategic Opportunities
  if (synthesis.opportunities.length > 0) {
    sections.push("### Strategic Opportunities Identified");
    synthesis.opportunities.forEach((opp, idx) => {
      const quadrantLabel = opp.quadrant.toUpperCase();
      const typeLabel = opp.opportunityType.replace(/_/g, " ");
      sections.push(`**${idx + 1}. ${opp.title}** (${quadrantLabel} quadrant, ${typeLabel})`);
      sections.push(`   Score: ${opp.overallScore}/100`);
      sections.push(`   ${opp.description}`);
      sections.push("");
    });
  }

  // Strategic Tensions
  if (synthesis.tensions.length > 0) {
    sections.push("### Strategic Tensions to Address");
    synthesis.tensions.forEach((tension, idx) => {
      sections.push(`**${idx + 1}.** [${tension.impact.toUpperCase()} impact] ${tension.description}`);
    });
    sections.push("");
  }

  // Priority Recommendations
  if (synthesis.recommendations.length > 0) {
    sections.push("### Priority Recommendations");
    synthesis.recommendations.forEach((rec, idx) => {
      sections.push(`${idx + 1}. ${rec}`);
    });
    sections.push("");
  }

  // Coach Guidance
  sections.push("**Your Role as Coach:**");
  sections.push("- Reference specific opportunities by name when guiding strategic discussions");
  sections.push("- Help the client understand quadrant placements (INVEST, EXPLORE, HARVEST, DIVEST)");
  sections.push("- Challenge or validate findings through coaching dialogue");
  sections.push("- Guide the client to test key assumptions (What Would Have to Be True)");
  sections.push("- Facilitate development of Strategic Bets based on top opportunities");

  return sections.join("\n");
}
