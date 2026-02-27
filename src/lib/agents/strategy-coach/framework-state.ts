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
  currentPhase: "discovery" | "research" | "synthesis" | "planning" | "activation" | "review";

  // Highest phase the user has reached (for stepper navigation)
  highestPhaseReached?: "discovery" | "research" | "synthesis" | "planning" | "activation" | "review";

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

  // Micro-synthesis results per territory (generated when all 3 areas are mapped)
  microSynthesisResults?: {
    company?: {
      keyFindings: Array<{ title: string; description: string; evidenceBase: string; confidence: string }>;
      overallConfidence: string;
      strategicImplication: string;
      generatedAt: string;
    };
    customer?: {
      keyFindings: Array<{ title: string; description: string; evidenceBase: string; confidence: string }>;
      overallConfidence: string;
      strategicImplication: string;
      generatedAt: string;
    };
    competitor?: {
      keyFindings: Array<{ title: string; description: string; evidenceBase: string; confidence: string }>;
      overallConfidence: string;
      strategicImplication: string;
      generatedAt: string;
    };
  };

  // Key insights captured during coaching
  keyInsights: string[];

  // Strategic Maturity Assessment archetype
  archetype?: 'operator' | 'visionary' | 'analyst' | 'diplomat';
  archetypeLabel?: string;
  overallMaturity?: number;

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
    highestPhaseReached: "discovery",

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
 * Territory insight data structure for computing real progress
 * from the territory_insights table (bypasses dead researchPillars model).
 */
export interface TerritoryInsightSummary {
  territory: string;
  research_area: string;
  status: string;
}

/**
 * Calculate research progress from actual territory_insights data.
 * 9 total research areas (3 per territory). Each mapped area = 1/9.
 * Each in_progress area = 0.5/9.
 */
export function calculateResearchProgressFromInsights(
  insights: TerritoryInsightSummary[]
): {
  overall: number;
  byTerritory: Record<string, { mapped: number; inProgress: number; total: number }>;
} {
  const territories = ['company', 'customer', 'competitor'];
  const areasPerTerritory = 3;
  const totalAreas = territories.length * areasPerTerritory;

  const byTerritory: Record<string, { mapped: number; inProgress: number; total: number }> = {};
  let totalScore = 0;

  for (const t of territories) {
    const territoryInsights = insights.filter((i) => i.territory === t);
    const mapped = territoryInsights.filter((i) => i.status === 'mapped').length;
    const inProgress = territoryInsights.filter((i) => i.status === 'in_progress').length;

    byTerritory[t] = { mapped, inProgress, total: areasPerTerritory };
    totalScore += mapped + inProgress * 0.5;
  }

  return {
    overall: Math.round((totalScore / totalAreas) * 100),
    byTerritory,
  };
}

/**
 * Calculate overall progress percentage through the methodology.
 * When territoryInsights are provided, uses real data instead of the dead researchPillars model.
 */
export function calculateProgress(state: FrameworkState, territoryInsights?: TerritoryInsightSummary[]): {
  overall: number;
  researchProgress: number;
  canvasProgress: number;
} {
  let researchProgress: number;

  if (territoryInsights && territoryInsights.length > 0) {
    // Use real territory insights data
    const insightProgress = calculateResearchProgressFromInsights(territoryInsights);
    researchProgress = insightProgress.overall;
  } else {
    // Fallback to legacy researchPillars model
    const defaultPillar = { started: false, completed: false, insights: [] };
    const pillars = state.researchPillars || {
      macroMarket: defaultPillar,
      customer: defaultPillar,
      colleague: defaultPillar,
    };
    const pillarScores = [
      pillars.macroMarket?.completed ? 1 : pillars.macroMarket?.started ? 0.5 : 0,
      pillars.customer?.completed ? 1 : pillars.customer?.started ? 0.5 : 0,
      pillars.colleague?.completed ? 1 : pillars.colleague?.started ? 0.5 : 0,
    ];
    researchProgress = Math.round((pillarScores.reduce((a, b) => a + b, 0) / 3) * 100);
  }

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
  const canvasProgressValue = Math.round((canvasSections.filter(Boolean).length / 5) * 100);

  // Overall: 50% research, 50% canvas
  const overall = Math.round(researchProgress * 0.5 + canvasProgressValue * 0.5);

  return {
    overall,
    researchProgress,
    canvasProgress: canvasProgressValue,
  };
}

/**
 * Get a human-readable summary of the current state for the system prompt.
 * When territoryInsights are provided, reports real research progress instead of dead pillar model.
 */
export function getProgressSummary(state: FrameworkState, territoryInsights?: TerritoryInsightSummary[]): string {
  const progress = calculateProgress(state, territoryInsights);
  const sections: string[] = [];

  // Phase
  const phaseDescriptions: Record<FrameworkState["currentPhase"], string> = {
    discovery: "Initial Discovery - understanding context and goals",
    research: "Strategic Research - mapping Company, Customer, and Market Context territories",
    synthesis: "Strategic Synthesis - developing Where to Play and How to Win hypotheses",
    planning: "Action Planning - creating actionable strategic outputs",
    activation: "Strategic Activation - generating team briefs, guardrails, OKRs, and stakeholder packs",
    review: "Living Strategy - tracking assumptions, signals, and strategy evolution",
  };
  sections.push(`Current Phase: ${phaseDescriptions[state.currentPhase]}`);

  // Territory research progress (from real data when available)
  if (territoryInsights && territoryInsights.length > 0) {
    const insightProgress = calculateResearchProgressFromInsights(territoryInsights);
    sections.push("\nTerritory Research Progress:");

    const territoryLabels: Record<string, string> = {
      company: "Company Territory",
      customer: "Customer Territory",
      competitor: "Market Context",
    };

    for (const [t, label] of Object.entries(territoryLabels)) {
      const tp = insightProgress.byTerritory[t];
      if (tp) {
        const statusParts: string[] = [];
        if (tp.mapped > 0) statusParts.push(`${tp.mapped} mapped`);
        if (tp.inProgress > 0) statusParts.push(`${tp.inProgress} in progress`);
        const remaining = tp.total - tp.mapped - tp.inProgress;
        if (remaining > 0) statusParts.push(`${remaining} unexplored`);
        sections.push(`- ${label}: ${statusParts.join(", ")} (${tp.total} areas)`);
      }
    }
    sections.push(`Research Progress: ${insightProgress.overall}%`);
  } else {
    // Fallback to legacy pillar model
    sections.push("\nResearch Playbook Progress:");
    const pillarStatus = (p?: PillarProgress) =>
      p?.completed ? "Complete" : p?.started ? "In Progress" : "Not Started";
    const pillars = state.researchPillars;
    sections.push(`- Company Territory: ${pillarStatus(pillars?.macroMarket)}`);
    sections.push(`- Customer Territory: ${pillarStatus(pillars?.customer)}`);
    sections.push(`- Market Context: ${pillarStatus(pillars?.colleague)}`);
  }

  // Canvas progress
  if (progress.canvasProgress > 0 && state.canvasProgress) {
    sections.push("\nStrategic Flow Canvas:");
    if (state.canvasProgress.marketReality) sections.push("- Market Reality: Complete");
    if (state.canvasProgress.customerInsights) sections.push("- Customer Insights: Complete");
    if (state.canvasProgress.organizationalContext) sections.push("- Organizational Context: Complete");
    if (state.canvasProgress.strategicSynthesis) sections.push("- Strategic Synthesis: Complete");
    if (state.canvasProgress.teamContext) sections.push("- Team Context: Complete");
  }

  // Strategic bets
  if (state.strategicBets?.length > 0) {
    sections.push(`\nStrategic Bets Captured: ${state.strategicBets.length}`);
  }

  // Key insights
  if (state.keyInsights?.length > 0) {
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
 * When territoryInsights are provided, uses real data instead of dead researchPillars model.
 */
export function suggestNextFocus(state: FrameworkState, territoryInsights?: TerritoryInsightSummary[]): string {
  // Use real territory insights when available
  if (territoryInsights && territoryInsights.length >= 0) {
    const insightProgress = calculateResearchProgressFromInsights(territoryInsights);
    const { byTerritory } = insightProgress;

    // Discovery phase - suggest starting research
    if (state.currentPhase === "discovery") {
      return "Upload strategic materials and explore your organization's context. When ready, proceed to Map Your Strategic Terrain.";
    }

    // Research phase - guide through territories
    if (state.currentPhase === "research") {
      const company = byTerritory.company;
      const customer = byTerritory.customer;
      const competitor = byTerritory.competitor;

      // Check if no research done yet
      const totalMapped = (company?.mapped || 0) + (customer?.mapped || 0) + (competitor?.mapped || 0);
      const totalInProgress = (company?.inProgress || 0) + (customer?.inProgress || 0) + (competitor?.inProgress || 0);

      if (totalMapped === 0 && totalInProgress === 0) {
        return "Start mapping your strategic terrain. Pick a territory card below — Company is a great starting point since you know your organization best.";
      }

      // Suggest completing in-progress areas first
      if (company && company.inProgress > 0) {
        return "Continue mapping the Company Territory — you have research areas in progress. Complete them to build your strategic foundation.";
      }
      if (customer && customer.inProgress > 0) {
        return "Continue mapping the Customer Territory — finish your in-progress research areas to deepen customer understanding.";
      }
      if (competitor && competitor.inProgress > 0) {
        return "Continue mapping Market Context — complete your in-progress research areas to understand the competitive landscape.";
      }

      // Suggest starting unexplored territories
      if (company && company.mapped < company.total) {
        return `Company Territory has ${company.total - company.mapped} unexplored areas. Map them to strengthen your strategic foundation.`;
      }
      if (customer && customer.mapped < customer.total) {
        return `Customer Territory has ${customer.total - customer.mapped} unexplored areas. Understanding customer needs is critical for synthesis.`;
      }
      if (competitor && competitor.mapped < competitor.total) {
        return `Market Context has ${competitor.total - competitor.mapped} unexplored areas. Complete the competitive picture before synthesis.`;
      }

      // All territories mapped - suggest synthesis
      if (totalMapped >= 4) {
        return "You've mapped enough territory to generate strategic insights. Consider proceeding to Synthesis, or continue mapping for richer results.";
      }
    }

    // Synthesis/Planning phases
    if (state.currentPhase === "synthesis" || state.currentPhase === "planning") {
      const canvas = state.canvasProgress;
      if (!canvas?.marketReality) return "Define Market Reality section of the Strategic Flow Canvas.";
      if (!canvas?.customerInsights) return "Define Customer Insights section of the Strategic Flow Canvas.";
      if (!canvas?.organizationalContext) return "Define Organizational Context section.";
      if (!canvas?.strategicSynthesis) return "Develop Strategic Synthesis — Where to Play and How to Win.";
      if (!canvas?.teamContext) return "Create Strategic Context for Teams.";
    }

    return "Review and refine your strategic outputs, or explore additional areas of interest.";
  }

  // Legacy fallback using researchPillars
  const pillars = state.researchPillars;

  if (!pillars || (!pillars.macroMarket?.started && !pillars.customer?.started && !pillars.colleague?.started)) {
    return "Start mapping your strategic terrain. Pick a territory — Company is a great starting point.";
  }

  if (pillars.macroMarket?.started && !pillars.macroMarket?.completed) {
    return "Continue exploring Company Territory to develop a complete picture of your organizational capabilities.";
  }

  if (!pillars.customer?.started) {
    return "Move to Customer Territory — explore segmentation, unmet needs, and market dynamics.";
  }

  if (pillars.customer?.started && !pillars.customer?.completed) {
    return "Continue Customer Territory research to fully understand customer segments and their needs.";
  }

  if (!pillars.colleague?.started) {
    return "Explore Market Context — analyze competitors, substitutes, and market forces.";
  }

  if (pillars.colleague?.started && !pillars.colleague?.completed) {
    return "Complete Market Context research by exploring remaining competitive dynamics.";
  }

  if (pillars.macroMarket?.completed && pillars.customer?.completed && pillars.colleague?.completed) {
    if (!state.canvasProgress?.strategicSynthesis) {
      return "All territories mapped. Ready to synthesize findings into Where to Play and How to Win hypotheses.";
    }
  }

  if (state.currentPhase === "synthesis" || state.currentPhase === "planning") {
    const canvas = state.canvasProgress;
    if (!canvas.marketReality) return "Define Market Reality section of the Strategic Flow Canvas.";
    if (!canvas.customerInsights) return "Define Customer Insights section of the Strategic Flow Canvas.";
    if (!canvas.organizationalContext) return "Define Organizational Context section.";
    if (!canvas.strategicSynthesis) return "Develop Strategic Synthesis — Where to Play and How to Win.";
    if (!canvas.teamContext) return "Create Strategic Context for Teams.";
  }

  return "Review and refine your strategic outputs, or explore additional areas of interest.";
}
