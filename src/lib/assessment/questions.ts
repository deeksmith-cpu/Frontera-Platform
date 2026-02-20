/**
 * Strategic Maturity Assessment Question Bank
 *
 * 20 Likert questions (5-point scale) across 5 dimensions
 * + 3 situational choice questions
 */

export type AssessmentDimension =
  | 'strategic_vision'
  | 'research_rigour'
  | 'execution_discipline'
  | 'stakeholder_alignment'
  | 'adaptive_capacity';

export interface LikertQuestion {
  id: string;
  dimension: AssessmentDimension;
  text: string;
  reverseScored?: boolean;
}

export interface SituationalOption {
  id: string;
  text: string;
  /** Which dimension this option primarily maps to */
  dimension: AssessmentDimension;
  /** Score weight for this option (1-5) */
  weight: number;
}

export interface SituationalQuestion {
  id: string;
  scenario: string;
  options: SituationalOption[];
}

// ============================================================================
// LIKERT QUESTIONS (20 total, 4 per dimension)
// ============================================================================

export const LIKERT_QUESTIONS: LikertQuestion[] = [
  // Strategic Vision (4 questions)
  {
    id: 'sv_1',
    dimension: 'strategic_vision',
    text: 'I can clearly articulate our product strategy in two sentences or fewer.',
  },
  {
    id: 'sv_2',
    dimension: 'strategic_vision',
    text: 'Our team understands which markets we compete in and why.',
  },
  {
    id: 'sv_3',
    dimension: 'strategic_vision',
    text: 'We have explicitly defined what we will NOT do as part of our strategy.',
  },
  {
    id: 'sv_4',
    dimension: 'strategic_vision',
    text: 'Our strategic direction is informed by a clear view of the next 2-3 years.',
  },

  // Research Rigour (4 questions)
  {
    id: 'rr_1',
    dimension: 'research_rigour',
    text: 'We regularly gather structured customer feedback before making strategic decisions.',
  },
  {
    id: 'rr_2',
    dimension: 'research_rigour',
    text: 'Our competitive intelligence is systematic, not anecdotal.',
  },
  {
    id: 'rr_3',
    dimension: 'research_rigour',
    text: 'We validate strategic assumptions with data before committing resources.',
  },
  {
    id: 'rr_4',
    dimension: 'research_rigour',
    text: 'We actively track and analyse market trends that could disrupt our business.',
  },

  // Execution Discipline (4 questions)
  {
    id: 'ed_1',
    dimension: 'execution_discipline',
    text: 'Our strategic priorities translate directly into team-level objectives and key results.',
  },
  {
    id: 'ed_2',
    dimension: 'execution_discipline',
    text: 'We have clear metrics to measure whether our strategy is working.',
  },
  {
    id: 'ed_3',
    dimension: 'execution_discipline',
    text: 'Teams can make autonomous decisions guided by our strategic guardrails.',
  },
  {
    id: 'ed_4',
    dimension: 'execution_discipline',
    text: 'We kill initiatives that are not delivering against strategic goals within defined timeframes.',
  },

  // Stakeholder Alignment (4 questions)
  {
    id: 'sa_1',
    dimension: 'stakeholder_alignment',
    text: 'Key stakeholders across the business agree on our strategic direction.',
  },
  {
    id: 'sa_2',
    dimension: 'stakeholder_alignment',
    text: 'We can communicate our strategy effectively to different audiences (board, teams, customers).',
  },
  {
    id: 'sa_3',
    dimension: 'stakeholder_alignment',
    text: 'Strategic decisions involve input from multiple functions, not just leadership.',
  },
  {
    id: 'sa_4',
    dimension: 'stakeholder_alignment',
    text: 'When strategy changes, all affected teams understand the rationale and their new priorities.',
  },

  // Adaptive Capacity (4 questions)
  {
    id: 'ac_1',
    dimension: 'adaptive_capacity',
    text: 'We review and adapt our strategy at least quarterly based on new information.',
  },
  {
    id: 'ac_2',
    dimension: 'adaptive_capacity',
    text: 'When market conditions shift, we can pivot our strategic bets within weeks.',
  },
  {
    id: 'ac_3',
    dimension: 'adaptive_capacity',
    text: 'We run strategic experiments to test assumptions before full commitment.',
  },
  {
    id: 'ac_4',
    dimension: 'adaptive_capacity',
    text: 'Our organisation treats strategic failure as learning, not blame.',
  },
];

// ============================================================================
// SITUATIONAL QUESTIONS (3 total)
// ============================================================================

export const SITUATIONAL_QUESTIONS: SituationalQuestion[] = [
  {
    id: 'sit_1',
    scenario: 'Your largest competitor just launched a product that directly overlaps with your roadmap. What is your first response?',
    options: [
      {
        id: 'sit_1_a',
        text: 'Convene a cross-functional war room to analyse the threat and adjust strategy',
        dimension: 'adaptive_capacity',
        weight: 5,
      },
      {
        id: 'sit_1_b',
        text: 'Review our competitive intelligence to understand if this was predictable',
        dimension: 'research_rigour',
        weight: 5,
      },
      {
        id: 'sit_1_c',
        text: 'Accelerate execution on our differentiated capabilities',
        dimension: 'execution_discipline',
        weight: 5,
      },
      {
        id: 'sit_1_d',
        text: 'Brief the board and key stakeholders on implications and proposed response',
        dimension: 'stakeholder_alignment',
        weight: 5,
      },
    ],
  },
  {
    id: 'sit_2',
    scenario: 'You have budget to pursue one major strategic initiative this year. How do you decide which one?',
    options: [
      {
        id: 'sit_2_a',
        text: 'Choose the initiative that best tests our strategic hypotheses about where to play',
        dimension: 'strategic_vision',
        weight: 5,
      },
      {
        id: 'sit_2_b',
        text: 'Run a structured analysis of market data, customer demand, and competitive gaps',
        dimension: 'research_rigour',
        weight: 5,
      },
      {
        id: 'sit_2_c',
        text: 'Select the one with clearest success metrics and fastest path to measurable outcomes',
        dimension: 'execution_discipline',
        weight: 5,
      },
      {
        id: 'sit_2_d',
        text: 'Build consensus across leadership, ensuring all functions are aligned before committing',
        dimension: 'stakeholder_alignment',
        weight: 5,
      },
    ],
  },
  {
    id: 'sit_3',
    scenario: 'Your strategic plan from 6 months ago is underperforming against key metrics. What do you do?',
    options: [
      {
        id: 'sit_3_a',
        text: 'Re-examine our strategic assumptions to see which were wrong',
        dimension: 'strategic_vision',
        weight: 5,
      },
      {
        id: 'sit_3_b',
        text: 'Gather fresh customer and market data to understand what changed',
        dimension: 'research_rigour',
        weight: 5,
      },
      {
        id: 'sit_3_c',
        text: 'Double down on execution focus — tighten metrics, increase review cadence',
        dimension: 'execution_discipline',
        weight: 5,
      },
      {
        id: 'sit_3_d',
        text: 'Pivot quickly — reallocate resources to the next-best opportunity',
        dimension: 'adaptive_capacity',
        weight: 5,
      },
    ],
  },
];

// ============================================================================
// DIMENSION METADATA
// ============================================================================

export const DIMENSION_LABELS: Record<AssessmentDimension, string> = {
  strategic_vision: 'Strategic Vision',
  research_rigour: 'Research Rigour',
  execution_discipline: 'Execution Discipline',
  stakeholder_alignment: 'Stakeholder Alignment',
  adaptive_capacity: 'Adaptive Capacity',
};

export const DIMENSION_DESCRIPTIONS: Record<AssessmentDimension, string> = {
  strategic_vision: 'Ability to define clear, differentiated strategic direction with explicit trade-offs',
  research_rigour: 'Systematic use of data, customer insights, and competitive intelligence to inform decisions',
  execution_discipline: 'Translating strategy into measurable objectives, guardrails, and team-level accountability',
  stakeholder_alignment: 'Ensuring strategic buy-in and effective communication across functions and levels',
  adaptive_capacity: 'Ability to sense change, test assumptions, and pivot strategy based on new information',
};

export const TOTAL_QUESTIONS = LIKERT_QUESTIONS.length + SITUATIONAL_QUESTIONS.length;
