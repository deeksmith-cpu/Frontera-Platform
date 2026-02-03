/**
 * Synthesis Phase Types
 *
 * TypeScript interfaces for the Playing to Win (PTW) strategic synthesis system.
 * Based on PRD v2.2 Section 3 & 13 specifications.
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * Evidence linking an opportunity/tension back to source research
 */
export interface EvidenceLink {
  territory: 'company' | 'customer' | 'competitor';
  researchArea: string;
  question: string;
  quote: string;
  insightId: string;
}

/**
 * "What Would Have to Be True" assumption for validating strategic opportunities
 */
export interface WWHBTAssumption {
  category: 'customer' | 'company' | 'competitor' | 'economics';
  assumption: string;
  testMethod: string;
  riskIfFalse: string;
}

// =============================================================================
// Strategic Opportunity
// =============================================================================

/**
 * Scoring metrics for a strategic opportunity (1-10 scale)
 */
export interface OpportunityScoring {
  marketAttractiveness: number;  // Market size, growth, unmet need
  capabilityFit: number;         // Company's ability to execute
  competitiveAdvantage: number;  // Differentiation potential
  overallScore: number;          // Weighted average (0-100)
}

/**
 * Playing to Win cascade mapping for an opportunity
 */
export interface PTWMapping {
  winningAspiration: string;
  whereToPlay: string;
  howToWin: string;
  capabilitiesRequired: string[];
  managementSystems: string[];
}

/**
 * Quadrant placement based on Market Attractiveness x Capability Fit
 */
export type Quadrant = 'invest' | 'explore' | 'harvest' | 'divest';

/**
 * Confidence level based on evidence strength
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * Type of strategic opportunity
 *
 * @deprecated 'where_to_play', 'how_to_win', and 'capability_gap' are deprecated.
 * Use 'paired_strategy' for new opportunities. Legacy types kept for backward compatibility.
 */
export type OpportunityType =
  | 'where_to_play'      // DEPRECATED
  | 'how_to_win'         // DEPRECATED
  | 'capability_gap'     // DEPRECATED
  | 'paired_strategy';   // Integrated WTP+HTW strategic hypothesis

/**
 * A strategic opportunity identified through research triangulation
 *
 * Each opportunity represents a complete Playing to Win strategic hypothesis,
 * pairing a specific WHERE TO PLAY choice with a coherent HOW TO WIN advantage.
 */
export interface StrategicOpportunity {
  id: string;
  title: string;
  description: string;

  /**
   * @deprecated Use ptw.whereToPlay and ptw.howToWin instead for WTP/HTW pairing.
   * Kept for backward compatibility with existing synthesis outputs.
   * New opportunities should use 'paired_strategy' or omit this field.
   */
  opportunityType?: OpportunityType;

  // Scoring and placement
  scoring: OpportunityScoring;
  quadrant: Quadrant;
  confidence: ConfidenceLevel;

  // Playing to Win mapping
  ptw: PTWMapping;

  // Evidence trail (links back to source research)
  evidence: EvidenceLink[];

  // Testable assumptions
  assumptions: WWHBTAssumption[];
}

// =============================================================================
// Strategic Tensions
// =============================================================================

/**
 * Evidence item for tensions (simplified)
 */
export interface TensionEvidence {
  insight: string;
  source: string; // territory.research_area format
}

/**
 * Resolution option for a strategic tension
 */
export interface TensionResolution {
  option: string;
  tradeOff: string;
  recommended: boolean;
}

/**
 * Impact level of a strategic tension
 */
export type TensionImpact = 'blocking' | 'significant' | 'minor';

/**
 * A strategic tension where research insights conflict
 */
export interface StrategicTension {
  id: string;
  description: string;
  alignedEvidence: TensionEvidence[];
  conflictingEvidence: TensionEvidence[];
  resolutionOptions: TensionResolution[];
  impact: TensionImpact;
}

// =============================================================================
// Playing to Win Cascade (Full Detail)
// =============================================================================

/**
 * Winning aspiration section of PTW cascade
 */
export interface PTWWinningAspiration {
  statement: string;
  timeframe: string;
  metrics: string[];
}

/**
 * Where to Play section of PTW cascade
 */
export interface PTWWhereToPlay {
  segments: string[];
  geographies: string[];
  channels: string[];
  products: string[];
  tradeOffs: string[];  // What we're explicitly NOT doing
}

/**
 * How to Win section of PTW cascade
 */
export interface PTWHowToWin {
  strategy: 'cost_leadership' | 'differentiation';
  primaryAdvantage: string;
  supportingAdvantages: string[];
  valueProposition: string;
}

/**
 * Capabilities Required section of PTW cascade
 */
export interface PTWCapabilities {
  mustHave: string[];
  shouldHave: string[];
  niceToHave: string[];
  buildVsBuy?: { capability: string; approach: 'build' | 'buy' | 'partner' }[];
}

/**
 * Management Systems section of PTW cascade
 */
export interface PTWManagementSystems {
  metrics: { name: string; target: string; frequency: string }[];
  governance: string;
  reviews: string;
}

/**
 * What Would Have to Be True assumptions organized by category
 */
export interface PTWAssumptions {
  customerAssumptions: string[];
  companyAssumptions: string[];
  competitorAssumptions: string[];
  economicAssumptions: string[];
}

/**
 * Full Playing to Win cascade for a strategic opportunity
 */
export interface PTWCascade {
  opportunityId: string;
  winningAspiration: PTWWinningAspiration;
  whereToPlay: PTWWhereToPlay;
  howToWin: PTWHowToWin;
  capabilitiesRequired: PTWCapabilities;
  managementSystems: PTWManagementSystems;
  wwhbt: PTWAssumptions;
}

// =============================================================================
// Synthesis Result (Complete Output)
// =============================================================================

/**
 * Metadata about the synthesis generation
 */
export interface SynthesisMetadata {
  modelUsed: string;
  territoriesIncluded: ('company' | 'customer' | 'competitor')[];
  researchAreasCount: number;
  generatedAt: string;
  confidenceLevel: ConfidenceLevel;
}

/**
 * Complete synthesis result from the API
 */
export interface SynthesisResult {
  id: string;
  conversationId: string;
  executiveSummary: string;
  opportunities: StrategicOpportunity[];
  tensions: StrategicTension[];
  ptwCascades?: PTWCascade[];  // Optional: generated for top opportunities
  recommendations: string[];
  metadata: SynthesisMetadata;
  userEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

// =============================================================================
// API Request/Response Types
// =============================================================================

/**
 * Request body for POST /api/product-strategy-agent/synthesis
 */
export interface GenerateSynthesisRequest {
  conversation_id: string;
}

/**
 * Response from POST /api/product-strategy-agent/synthesis
 */
export interface GenerateSynthesisResponse {
  success: boolean;
  synthesis?: SynthesisResult;
  error?: string;
}

/**
 * Response from GET /api/product-strategy-agent/synthesis
 */
export interface GetSynthesisResponse {
  success: boolean;
  synthesis?: SynthesisResult | null;
  error?: string;
}

// =============================================================================
// Claude API Response Types (for parsing)
// =============================================================================

/**
 * Raw opportunity structure from Claude response (before processing)
 */
export interface RawClaudeOpportunity {
  title: string;
  description: string;
  opportunityType: string;
  scoring: {
    marketAttractiveness: number;
    capabilityFit: number;
    competitiveAdvantage: number;
  };
  evidence: {
    territory: string;
    researchArea: string;
    quote: string;
  }[];
  ptw: {
    winningAspiration: string;
    whereToPlay: string;
    howToWin: string;
    capabilitiesRequired: string[];
    managementSystems: string[];
  };
  assumptions: {
    category: string;
    assumption: string;
    testMethod: string;
    riskIfFalse: string;
  }[];
}

/**
 * Raw tension structure from Claude response (before processing)
 */
export interface RawClaudeTension {
  description: string;
  alignedEvidence: { insight: string; source: string }[];
  conflictingEvidence: { insight: string; source: string }[];
  resolutionOptions: { option: string; tradeOff: string; recommended: boolean }[];
  impact: string;
}

/**
 * Full raw response from Claude synthesis prompt
 */
export interface RawClaudeSynthesisResponse {
  executiveSummary: string;
  opportunities: RawClaudeOpportunity[];
  tensions: RawClaudeTension[];
  recommendations: string[];
}

// =============================================================================
// Component Props Types
// =============================================================================

/**
 * Props for StrategicOpportunityMap component
 */
export interface StrategicOpportunityMapProps {
  opportunities: StrategicOpportunity[];
  onOpportunityClick?: (opportunityId: string) => void;
  selectedOpportunityId?: string;
}

/**
 * Props for OpportunityCard component
 */
export interface OpportunityCardProps {
  opportunity: StrategicOpportunity;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEvidenceClick?: (evidence: EvidenceLink) => void;
}

/**
 * Props for EvidenceTrail component
 */
export interface EvidenceTrailProps {
  evidence: EvidenceLink[];
  onNavigateToSource?: (evidence: EvidenceLink) => void;
}

/**
 * Props for TensionCard component
 */
export interface TensionCardProps {
  tension: StrategicTension;
}

/**
 * Props for RecommendationsPanel component
 */
export interface RecommendationsPanelProps {
  recommendations: string[];
}
