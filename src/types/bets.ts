import type { EvidenceLink, ConfidenceLevel } from './synthesis';

export type ThesisType = 'offensive' | 'defensive' | 'capability';
export type TimeHorizon = '90d' | '6m' | '12m' | '18m';
export type BetStatus = 'draft' | 'proposed' | 'accepted' | 'prioritized';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface StrategicThesis {
  id: string;
  conversationId: string;
  title: string;
  description: string;
  opportunityId: string;
  ptwWinningAspiration: string;
  ptwWhereToPlay: string;
  ptwHowToWin: string;
  dhmDelight: string;
  dhmHardToCopy: string;
  dhmMarginEnhancing: string;
  thesisType: ThesisType;
  timeHorizon: TimeHorizon;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicScoring {
  expectedImpact: number;
  certaintyOfImpact: number;
  clarityOfLevers: number;
  uniquenessOfLevers: number;
  overallScore: number;
}

export function calculateOverallScore(
  scoring: Omit<StrategicScoring, 'overallScore'>
): number {
  const { expectedImpact, certaintyOfImpact, clarityOfLevers, uniquenessOfLevers } = scoring;
  return Math.round(
    ((expectedImpact + certaintyOfImpact + clarityOfLevers + uniquenessOfLevers) / 40) * 100
  );
}

export interface StrategicRisks {
  market: string;
  positioning: string;
  execution: string;
  economic: string;
}

export interface StrategicBet {
  id: string;
  conversationId: string;
  strategicThesisId: string | null;
  jobToBeDone: string;
  belief: string;
  bet: string;
  successMetric: string;
  killCriteria: string;
  killDate: string;
  status: BetStatus;
  opportunityId: string;
  evidenceLinks: EvidenceLink[];
  assumptionBeingTested: string;
  ptwWhereToPlay: string;
  ptwHowToWin: string;
  scoring: StrategicScoring;
  priorityLevel: PriorityLevel;
  confidence: ConfidenceLevel;
  timeHorizon: TimeHorizon;
  risks: StrategicRisks;
  dependsOn: string[];
  agentGenerated: boolean;
  agentReasoning?: string;
  userModified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThesisRequest {
  conversation_id: string;
  title: string;
  description: string;
  opportunity_id: string;
  ptw_winning_aspiration: string;
  ptw_where_to_play: string;
  ptw_how_to_win: string;
  dhm_delight?: string;
  dhm_hard_to_copy?: string;
  dhm_margin_enhancing?: string;
  thesis_type: ThesisType;
  time_horizon?: TimeHorizon;
}

export interface CreateBetRequest {
  conversation_id: string;
  strategic_thesis_id: string;
  job_to_be_done: string;
  belief: string;
  bet: string;
  success_metric: string;
  kill_criteria?: string;
  kill_date?: string;
  opportunity_id: string;
  evidence_links?: EvidenceLink[];
  assumption_being_tested?: string;
  ptw_where_to_play?: string;
  ptw_how_to_win?: string;
  expected_impact?: number;
  certainty_of_impact?: number;
  clarity_of_levers?: number;
  uniqueness_of_levers?: number;
  confidence?: ConfidenceLevel;
  time_horizon?: TimeHorizon;
  risks?: StrategicRisks;
  depends_on?: string[];
}

export interface UpdateBetRequest {
  id: string;
  [key: string]: unknown;
}

export interface BetsResponse {
  theses: (StrategicThesis & { bets: StrategicBet[] })[];
  ungroupedBets: StrategicBet[];
  portfolioSummary: {
    totalBets: number;
    totalTheses: number;
    byThesisType: { offensive: number; defensive: number; capability: number };
    avgScore: number;
    killDatesApproaching: number;
  };
}

export interface GenerateBetsResponse {
  theses: StrategicThesis[];
  bets: StrategicBet[];
}

export interface StrategyDocumentContent {
  // Page 1: Product Vision & Strategic Context
  productVision: {
    narrative: string;
    stateOfBusiness: string;
  };
  // Page 2: Market Trends, Customer Problems & Opportunities
  marketInsights: {
    narrative: string;
  };
  // Page 3: Where We Play & How We Win
  strategicChoices: {
    narrative: string;
  };
  // Page 4: Product Strategy & Roadmap Themes
  roadmap: {
    narrative: string;
  };
  // Page 5: Operating Model & Capability Build
  operatingModel: {
    narrative: string;
  };
  // Page 6: Strategic Priorities & Execution
  executionPlan: {
    narrative: string;
  };
  // Appendix: Supporting Data (structured, not narrative)
  appendix: {
    selectedBets: Array<{
      id: string;
      thesisTitle: string;
      thesisType: string;
      hypothesis: {
        job: string;
        belief: string;
        bet: string;
        success: string;
        kill: { criteria: string; date: string };
      };
      scoring: StrategicScoring;
      risks: StrategicRisks;
      evidence: EvidenceLink[];
    }>;
    portfolioBalance: { offensive: number; defensive: number; capability: number };
    dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
    ptwCascade: {
      winningAspiration: string;
      whereToPlay: string[];
      howToWin: string[];
      capabilities: string[];
      managementSystems: string[];
    };
  };
}

// Legacy format detection — old documents use this shape
export interface LegacyStrategyDocumentContent {
  executiveSummary: {
    companyOverview: string;
    strategicIntent: string;
    keyFindings: string[];
    topOpportunities: string[];
    recommendedBets: string;
  };
  ptwCascade: {
    winningAspiration: string;
    whereToPlay: string[];
    howToWin: string[];
    capabilities: string[];
    managementSystems: string[];
  };
  selectedBets: Array<{
    id: string;
    thesisTitle: string;
    thesisType: ThesisType;
    hypothesis: {
      job: string;
      belief: string;
      bet: string;
      success: string;
      kill: { criteria: string; date: string };
    };
    scoring: StrategicScoring;
    risks: StrategicRisks;
    evidence: EvidenceLink[];
  }>;
  portfolioView: {
    coherenceAnalysis: string;
    balance: { offensive: number; defensive: number; capability: number };
    sequencing: Array<{ betId: string; dependsOn: string[] }>;
    resourceAllocation: Array<{ allocation: string; betCount: number }>;
    dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
  };
  nextSteps: {
    validationTimeline: string;
    governance: string;
    trackingPlan: string;
    killCriteriaReview: string;
    nextTopics: string[];
  };
}

export function isLegacyDocument(doc: unknown): doc is LegacyStrategyDocumentContent {
  return typeof doc === 'object' && doc !== null && 'executiveSummary' in doc && !('productVision' in doc);
}
