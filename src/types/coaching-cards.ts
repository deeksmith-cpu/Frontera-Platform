/**
 * Coaching Cards Type Definitions
 * Rich multimedia cards for the Strategy Coach chat interface
 */

// =============================================================================
// Card Base Types
// =============================================================================

export type CardType = 'explanation' | 'request' | 'debate' | 'whats_next';

export type Phase = 'discovery' | 'research' | 'synthesis' | 'bets';

/**
 * Base card structure that all cards extend
 */
export interface BaseCard {
  id: string;
  type: CardType;
  timestamp?: string; // Optional to avoid hydration issues
  dismissible?: boolean;
}

// =============================================================================
// Explanation Card
// =============================================================================

export type ExplanationIcon = 'compass' | 'map' | 'lightbulb' | 'target' | 'rocket' | 'layers' | 'telescope';

export interface PhaseStep {
  id: Phase;
  label: string;
  sublabel: string;
  active?: boolean;
  completed?: boolean;
}

export interface ExplanationCardData extends BaseCard {
  type: 'explanation';
  title: string;
  body: string;
  icon?: ExplanationIcon;
  phase?: Phase;
  /** Optional phase journey diagram */
  showPhaseDiagram?: boolean;
  phaseSteps?: PhaseStep[];
  /** Optional call-to-action */
  ctaLabel?: string;
  ctaAction?: 'dismiss' | 'navigate' | 'start_phase';
  /** Highlight color theme override */
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'purple';
}

// =============================================================================
// Request Card
// =============================================================================

export type RequestActionType =
  | 'upload_materials'
  | 'complete_territory'
  | 'generate_synthesis'
  | 'create_bet'
  | 'review_tensions'
  | 'start_research'
  | 'custom';

export interface RequestProgress {
  current: number;
  total: number;
  unit: string; // e.g., "documents", "areas", "bets"
}

export interface CanvasPanelTarget {
  phase: Phase;
  section?: string;
  highlight?: string;
}

export interface RequestCardData extends BaseCard {
  type: 'request';
  title: string;
  description: string;
  actionType: RequestActionType;
  actionLabel: string;
  /** Progress tracking */
  progress?: RequestProgress;
  /** Link to canvas panel action */
  canvasPanelTarget?: CanvasPanelTarget;
  /** Urgency level affects styling */
  urgency: 'required' | 'recommended' | 'optional';
  /** Optional deadline */
  deadline?: string;
  /** Icon override */
  icon?: 'upload' | 'document' | 'check' | 'arrow' | 'sparkles';
}

// =============================================================================
// Debate/Idea Card
// =============================================================================

export interface DebatePerspective {
  label: string;
  position: string;
  evidence?: string;
  source?: string;
}

export type UserPosition = 'a' | 'b' | 'nuanced' | null;

export interface DebateIdeaCardData extends BaseCard {
  type: 'debate';
  trigger: 'coach_initiated' | 'user_requested';
  title: string;
  context: string;
  perspectiveA: DebatePerspective;
  perspectiveB: DebatePerspective;
  /** Optional: Link to existing tension */
  tensionId?: string;
  /** User interaction state */
  userPosition?: UserPosition;
  userReasoning?: string;
  resolved?: boolean;
}

// =============================================================================
// What's Next Card (Sticky)
// =============================================================================

export type ReadinessState = 'not_ready' | 'almost_ready' | 'ready';

export interface WhatsNextRequirement {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface WhatsNextCardData extends BaseCard {
  type: 'whats_next';
  /** Current milestone info */
  currentMilestone: string;
  currentPhase: Phase;
  /** Next milestone info */
  nextMilestone: string;
  nextPhase: Phase;
  /** Requirements and progress */
  requirements: WhatsNextRequirement[];
  progressPercentage: number;
  readiness: ReadinessState;
  /** Encouragement/teaser text */
  teaserText: string;
}

// =============================================================================
// Union Types
// =============================================================================

export type CoachingCard =
  | ExplanationCardData
  | RequestCardData
  | DebateIdeaCardData
  | WhatsNextCardData;

// =============================================================================
// Parsing Types
// =============================================================================

export interface ParsedMessageContent {
  textContent: string;
  cards: Array<ExplanationCardData | RequestCardData | DebateIdeaCardData>;
}

// =============================================================================
// Card Action Types
// =============================================================================

export interface CardAction {
  cardId: string;
  action: string;
  payload?: Record<string, unknown>;
}

// =============================================================================
// Section Summary Types (CanvasPanel)
// =============================================================================

export interface TerritoryInsightCounts {
  company: number;
  customer: number;
  competitor: number;
}

export interface SectionSummaryData {
  currentPhase: Phase;
  phaseProgress: number; // 0-100
  timeSpentMinutes: number;
  insightsCount: number;
  insightsByTerritory: TerritoryInsightCounts;
  evidenceCount: number;
  achievements: Achievement[];
  currentStreak: number;
  lastActivityAt: string;
}

// =============================================================================
// Achievement Types
// =============================================================================

export type AchievementType =
  | 'phase_started'
  | 'territory_complete'
  | 'first_insight'
  | 'synthesis_ready'
  | 'bet_created'
  | 'streak_milestone'
  | 'first_document';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
  celebrated: boolean;
}

// =============================================================================
// Phase Configuration
// =============================================================================

export const PHASE_CONFIG: Record<Phase, {
  label: string;
  sublabel: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  discovery: {
    label: 'Discovery',
    sublabel: 'Context Setting',
    color: 'emerald',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  research: {
    label: 'Landscape',
    sublabel: 'Terrain Mapping',
    color: 'amber',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-300',
  },
  synthesis: {
    label: 'Synthesis',
    sublabel: 'Pattern Recognition',
    color: 'purple',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200',
  },
  bets: {
    label: 'Strategic Bets',
    sublabel: 'Route Planning',
    color: 'cyan',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-200',
  },
};

export const PHASE_ORDER: Phase[] = ['discovery', 'research', 'synthesis', 'bets'];
