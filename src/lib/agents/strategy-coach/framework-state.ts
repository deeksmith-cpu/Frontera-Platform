/**
 * Framework State Management for the Strategy Coach
 *
 * Tracks the user's progress through the Product Strategy Research Playbook
 * and Strategic Flow Canvas methodology.
 */

/**
 * A strategic bet captured during the coaching process.
 * Format: "We believe [X] → Which means [Y] → So we will explore [Z] → Success looks like [metric]"
 */
export interface StrategicBet {
  id: string;
  belief: string; // "We believe [trend/customer need]"
  implication: string; // "Which means [opportunity/problem space]"
  exploration: string; // "So we will explore [hypothesis/initiative direction]"
  successMetric: string; // "Success looks like [leading indicator metric]"
  createdAt: string;
  pillarSource?: "macro" | "customer" | "colleague" | "synthesis";
}

/**
 * Progress through a research pillar.
 */
export interface PillarProgress {
  started: boolean;
  completed: boolean;
  insights: string[];
  lastExploredAt?: string;
}

/**
 * The coaching framework state stored in the conversation's framework_state JSONB field.
 */
export interface FrameworkState {
  version: number; // Schema version for future migrations

  // Current phase of the coaching journey
  currentPhase: "discovery" | "research" | "synthesis" | "planning";

  // Research Playbook progress (Phase 1)
  researchPillars: {
    macroMarket: PillarProgress; // Competitive, economic, tech, regulatory forces
    customer: PillarProgress; // Segmentation, JTBD, unmet needs
    colleague: PillarProgress; // Leadership, sales, support insights
  };

  // Strategic Flow Canvas progress (Phase 2)
  canvasProgress: {
    marketReality: boolean;
    customerInsights: boolean;
    organizationalContext: boolean;
    strategicSynthesis: boolean;
    teamContext: boolean;
  };

  // Captured strategic bets
  strategicBets: StrategicBet[];

  // Key insights captured during coaching
  keyInsights: string[];

  // Session metadata
  sessionCount: number;
  totalMessageCount: number;
  lastActivityAt: string;
}

/**
 * Initialize a new framework state for a fresh conversation.
 */
export function initializeFrameworkState(): FrameworkState {
  return {
    version: 1,
    currentPhase: "discovery",

    researchPillars: {
      macroMarket: { started: false, completed: false, insights: [] },
      customer: { started: false, completed: false, insights: [] },
      colleague: { started: false, completed: false, insights: [] },
    },

    canvasProgress: {
      marketReality: false,
      customerInsights: false,
      organizationalContext: false,
      strategicSynthesis: false,
      teamContext: false,
    },

    strategicBets: [],
    keyInsights: [],
    sessionCount: 1,
    totalMessageCount: 0,
    lastActivityAt: new Date().toISOString(),
  };
}

/**
 * Calculate overall progress percentage through the methodology.
 */
export function calculateProgress(state: FrameworkState): {
  overall: number;
  researchProgress: number;
  canvasProgress: number;
} {
  // Research pillars (3 pillars, each worth 1/3)
  const pillars = state.researchPillars;
  const pillarScores = [
    pillars.macroMarket.completed ? 1 : pillars.macroMarket.started ? 0.5 : 0,
    pillars.customer.completed ? 1 : pillars.customer.started ? 0.5 : 0,
    pillars.colleague.completed ? 1 : pillars.colleague.started ? 0.5 : 0,
  ];
  const researchProgress = (pillarScores.reduce((a, b) => a + b, 0) / 3) * 100;

  // Canvas sections (5 sections, each worth 1/5)
  const canvas = state.canvasProgress || {
    marketReality: false,
    customerInsights: false,
    organizationalContext: false,
    strategicSynthesis: false,
    teamContext: false,
  };
  const canvasSections = [
    canvas.marketReality,
    canvas.customerInsights,
    canvas.organizationalContext,
    canvas.strategicSynthesis,
    canvas.teamContext,
  ];
  const canvasProgressValue = (canvasSections.filter(Boolean).length / 5) * 100;

  // Overall: 50% research, 50% canvas
  const overall = researchProgress * 0.5 + canvasProgressValue * 0.5;

  return {
    overall: Math.round(overall),
    researchProgress: Math.round(researchProgress),
    canvasProgress: Math.round(canvasProgressValue),
  };
}

/**
 * Get a human-readable summary of the current state for the system prompt.
 */
export function getProgressSummary(state: FrameworkState): string {
  const progress = calculateProgress(state);
  const sections: string[] = [];

  // Phase
  const phaseDescriptions: Record<FrameworkState["currentPhase"], string> = {
    discovery: "Initial Discovery - understanding context and goals",
    research: "Strategic Research - exploring market, customer, and colleague insights",
    synthesis: "Strategic Synthesis - developing Where to Play and How to Win hypotheses",
    planning: "Action Planning - creating actionable strategic outputs",
  };
  sections.push(`Current Phase: ${phaseDescriptions[state.currentPhase]}`);

  // Research pillars status
  sections.push("\nResearch Playbook Progress:");
  const pillarStatus = (p: PillarProgress) =>
    p.completed ? "Complete" : p.started ? "In Progress" : "Not Started";
  sections.push(`- Macro Market Forces: ${pillarStatus(state.researchPillars.macroMarket)}`);
  sections.push(`- Customer Research: ${pillarStatus(state.researchPillars.customer)}`);
  sections.push(`- Colleague Research: ${pillarStatus(state.researchPillars.colleague)}`);

  // Canvas progress
  if (progress.canvasProgress > 0) {
    sections.push("\nStrategic Flow Canvas:");
    if (state.canvasProgress.marketReality) sections.push("- Market Reality: Complete");
    if (state.canvasProgress.customerInsights) sections.push("- Customer Insights: Complete");
    if (state.canvasProgress.organizationalContext) sections.push("- Organizational Context: Complete");
    if (state.canvasProgress.strategicSynthesis) sections.push("- Strategic Synthesis: Complete");
    if (state.canvasProgress.teamContext) sections.push("- Team Context: Complete");
  }

  // Strategic bets
  if (state.strategicBets.length > 0) {
    sections.push(`\nStrategic Bets Captured: ${state.strategicBets.length}`);
  }

  // Key insights
  if (state.keyInsights.length > 0) {
    sections.push(`\nKey Insights Captured: ${state.keyInsights.length}`);
  }

  sections.push(`\nOverall Progress: ${progress.overall}%`);

  return sections.join("\n");
}

/**
 * Update the framework state based on conversation analysis.
 * This is called after each message exchange to track progress.
 */
export function updateFrameworkState(
  currentState: FrameworkState,
  updates: Partial<{
    currentPhase: FrameworkState["currentPhase"];
    pillarStarted: "macroMarket" | "customer" | "colleague";
    pillarCompleted: "macroMarket" | "customer" | "colleague";
    pillarInsight: { pillar: "macroMarket" | "customer" | "colleague"; insight: string };
    canvasSection: keyof FrameworkState["canvasProgress"];
    strategicBet: Omit<StrategicBet, "id" | "createdAt">;
    keyInsight: string;
    incrementMessages: boolean;
  }>
): FrameworkState {
  const newState: FrameworkState = JSON.parse(JSON.stringify(currentState));
  const now = new Date().toISOString();

  // Update phase
  if (updates.currentPhase) {
    newState.currentPhase = updates.currentPhase;
  }

  // Mark pillar as started
  if (updates.pillarStarted) {
    newState.researchPillars[updates.pillarStarted].started = true;
    newState.researchPillars[updates.pillarStarted].lastExploredAt = now;
  }

  // Mark pillar as completed
  if (updates.pillarCompleted) {
    newState.researchPillars[updates.pillarCompleted].completed = true;
    newState.researchPillars[updates.pillarCompleted].lastExploredAt = now;
  }

  // Add pillar insight
  if (updates.pillarInsight) {
    newState.researchPillars[updates.pillarInsight.pillar].insights.push(
      updates.pillarInsight.insight
    );
  }

  // Mark canvas section complete
  if (updates.canvasSection) {
    newState.canvasProgress[updates.canvasSection] = true;
  }

  // Add strategic bet
  if (updates.strategicBet) {
    newState.strategicBets.push({
      id: crypto.randomUUID(),
      ...updates.strategicBet,
      createdAt: now,
    });
  }

  // Add key insight
  if (updates.keyInsight) {
    newState.keyInsights.push(updates.keyInsight);
  }

  // Increment message count
  if (updates.incrementMessages) {
    newState.totalMessageCount += 1;
  }

  newState.lastActivityAt = now;

  return newState;
}

/**
 * Suggest the next coaching focus based on current state.
 */
export function suggestNextFocus(state: FrameworkState): string {
  const pillars = state.researchPillars;

  // If no pillars started, suggest starting with macro market
  if (!pillars.macroMarket.started && !pillars.customer.started && !pillars.colleague.started) {
    return "Start with exploring Macro Market Forces - competitive landscape, technology dynamics, and market trends.";
  }

  // If macro started but not complete, continue there
  if (pillars.macroMarket.started && !pillars.macroMarket.completed) {
    return "Continue exploring Macro Market Forces to develop a complete picture of the competitive and market landscape.";
  }

  // If customer not started, suggest that
  if (!pillars.customer.started) {
    return "Move to Customer Research - explore segmentation, jobs-to-be-done, and unmet needs.";
  }

  // If customer started but not complete
  if (pillars.customer.started && !pillars.customer.completed) {
    return "Continue Customer Research to fully understand customer segments and their needs.";
  }

  // If colleague not started
  if (!pillars.colleague.started) {
    return "Explore Colleague Research - gather insights from leadership, sales, support, and engineering teams.";
  }

  // If colleague started but not complete
  if (pillars.colleague.started && !pillars.colleague.completed) {
    return "Complete Colleague Research by exploring remaining internal perspectives.";
  }

  // All pillars complete - move to synthesis
  if (pillars.macroMarket.completed && pillars.customer.completed && pillars.colleague.completed) {
    if (!state.canvasProgress.strategicSynthesis) {
      return "All research pillars complete. Ready to synthesize findings into Where to Play and How to Win hypotheses.";
    }
  }

  // Canvas in progress
  if (state.currentPhase === "synthesis" || state.currentPhase === "planning") {
    const canvas = state.canvasProgress;
    if (!canvas.marketReality) return "Define Market Reality section of the Strategic Flow Canvas.";
    if (!canvas.customerInsights) return "Define Customer Insights section of the Strategic Flow Canvas.";
    if (!canvas.organizationalContext) return "Define Organizational Context section.";
    if (!canvas.strategicSynthesis) return "Develop Strategic Synthesis - Where to Play and How to Win.";
    if (!canvas.teamContext) return "Create Strategic Context for Teams.";
  }

  return "Review and refine your strategic outputs, or explore additional areas of interest.";
}
