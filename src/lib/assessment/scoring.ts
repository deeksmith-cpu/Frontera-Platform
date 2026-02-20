/**
 * Strategic Maturity Assessment Scoring Algorithm
 *
 * Maps 20 Likert responses + 3 situational choices → 5 dimension scores → archetype
 */

import type { AssessmentDimension } from './questions';
import { LIKERT_QUESTIONS, SITUATIONAL_QUESTIONS } from './questions';

// ============================================================================
// TYPES
// ============================================================================

export type ArchetypeId = 'operator' | 'visionary' | 'analyst' | 'diplomat';

export interface DimensionScore {
  dimension: AssessmentDimension;
  score: number; // 0-100 normalised
  raw: number; // Raw total
  maxPossible: number;
}

export interface ArchetypeResult {
  archetype: ArchetypeId;
  label: string;
  description: string;
  coachingStyle: string;
  strengths: AssessmentDimension[];
  growthAreas: AssessmentDimension[];
}

export interface AssessmentScoreResult {
  dimensions: Record<AssessmentDimension, DimensionScore>;
  archetype: ArchetypeResult;
  overallMaturity: number; // 0-100
}

// ============================================================================
// ARCHETYPE DEFINITIONS
// ============================================================================

const ARCHETYPES: Record<ArchetypeId, Omit<ArchetypeResult, 'strengths' | 'growthAreas'>> = {
  operator: {
    archetype: 'operator',
    label: 'The Operator',
    description:
      'You excel at turning plans into results. Your teams know what to do, metrics are tracked, and initiatives move with discipline. Your growth edge is stepping back to question whether you\'re executing on the right strategy.',
    coachingStyle:
      'Help this user zoom out from execution to strategic questions. Challenge them to question assumptions, not just optimise outcomes. Push for more market research and vision refinement.',
  },
  visionary: {
    archetype: 'visionary',
    label: 'The Visionary',
    description:
      'You see where the market is heading before others do. Your strategic intuition is strong, and you inspire others with a compelling future state. Your growth edge is translating that vision into disciplined execution frameworks.',
    coachingStyle:
      'Help this user ground their vision in execution frameworks. Push for measurable metrics, kill criteria, and structured research to validate assumptions. Challenge them to operationalise their ideas.',
  },
  analyst: {
    archetype: 'analyst',
    label: 'The Analyst',
    description:
      'You make decisions based on evidence, not gut feeling. Your competitive intelligence is sharp, and you rarely commit resources without data. Your growth edge is building stakeholder buy-in and moving faster from analysis to action.',
    coachingStyle:
      'Help this user move from analysis to action. Push for stakeholder communication, alignment activities, and time-bounded decisions. Challenge analysis paralysis by emphasising "good enough" decisions with kill criteria.',
  },
  diplomat: {
    archetype: 'diplomat',
    label: 'The Diplomat',
    description:
      'You build consensus and align diverse stakeholders around strategic direction. Your communication skills ensure everyone understands the rationale. Your growth edge is deepening research rigour and being willing to make bold, unpopular strategic bets.',
    coachingStyle:
      'Help this user strengthen their analytical foundation. Push for deeper customer research, competitive analysis, and willingness to challenge consensus with data. Encourage bold strategic bets even when alignment is incomplete.',
  },
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate dimension scores from Likert responses.
 * Likert responses are 1-5 (Strongly Disagree to Strongly Agree).
 */
function scoreLikertResponses(
  likertResponses: Record<string, number>
): Record<AssessmentDimension, { raw: number; maxPossible: number }> {
  const scores: Record<AssessmentDimension, { raw: number; maxPossible: number }> = {
    strategic_vision: { raw: 0, maxPossible: 0 },
    research_rigour: { raw: 0, maxPossible: 0 },
    execution_discipline: { raw: 0, maxPossible: 0 },
    stakeholder_alignment: { raw: 0, maxPossible: 0 },
    adaptive_capacity: { raw: 0, maxPossible: 0 },
  };

  for (const question of LIKERT_QUESTIONS) {
    const response = likertResponses[question.id];
    if (response !== undefined) {
      const value = question.reverseScored ? 6 - response : response;
      scores[question.dimension].raw += value;
      scores[question.dimension].maxPossible += 5;
    }
  }

  return scores;
}

/**
 * Calculate dimension boosts from situational responses.
 * Each situational answer boosts the selected dimension.
 */
function scoreSituationalResponses(
  situationalResponses: Record<string, string>
): Record<AssessmentDimension, { raw: number; maxPossible: number }> {
  const scores: Record<AssessmentDimension, { raw: number; maxPossible: number }> = {
    strategic_vision: { raw: 0, maxPossible: 0 },
    research_rigour: { raw: 0, maxPossible: 0 },
    execution_discipline: { raw: 0, maxPossible: 0 },
    stakeholder_alignment: { raw: 0, maxPossible: 0 },
    adaptive_capacity: { raw: 0, maxPossible: 0 },
  };

  for (const question of SITUATIONAL_QUESTIONS) {
    const selectedOptionId = situationalResponses[question.id];
    if (selectedOptionId) {
      const option = question.options.find((o) => o.id === selectedOptionId);
      if (option) {
        scores[option.dimension].raw += option.weight;
        scores[option.dimension].maxPossible += 5;
      }
    }
  }

  return scores;
}

/**
 * Classify archetype based on dimension scores.
 * Uses a quadrant model: highest vs lowest dimensions determine archetype.
 */
function classifyArchetype(
  dimensions: Record<AssessmentDimension, DimensionScore>
): ArchetypeResult {
  const entries = Object.entries(dimensions) as [AssessmentDimension, DimensionScore][];
  const sorted = [...entries].sort((a, b) => b[1].score - a[1].score);

  const strengths = sorted.slice(0, 2).map(([dim]) => dim);
  const growthAreas = sorted.slice(-2).map(([dim]) => dim);

  const topDimension = sorted[0][0];
  const secondDimension = sorted[1][0];

  // Archetype classification based on dominant dimensions
  let archetypeId: ArchetypeId;

  if (
    topDimension === 'execution_discipline' ||
    (topDimension === 'stakeholder_alignment' && secondDimension === 'execution_discipline')
  ) {
    archetypeId = 'operator';
  } else if (
    topDimension === 'strategic_vision' ||
    (topDimension === 'adaptive_capacity' && secondDimension === 'strategic_vision')
  ) {
    archetypeId = 'visionary';
  } else if (
    topDimension === 'research_rigour' ||
    (topDimension === 'adaptive_capacity' && secondDimension === 'research_rigour')
  ) {
    archetypeId = 'analyst';
  } else if (
    topDimension === 'stakeholder_alignment' ||
    (topDimension === 'adaptive_capacity' && secondDimension === 'stakeholder_alignment')
  ) {
    archetypeId = 'diplomat';
  } else {
    // Default fallback: use the top dimension's natural archetype
    const dimensionToArchetype: Record<AssessmentDimension, ArchetypeId> = {
      strategic_vision: 'visionary',
      research_rigour: 'analyst',
      execution_discipline: 'operator',
      stakeholder_alignment: 'diplomat',
      adaptive_capacity: 'visionary',
    };
    archetypeId = dimensionToArchetype[topDimension];
  }

  return {
    ...ARCHETYPES[archetypeId],
    strengths,
    growthAreas,
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Score a complete assessment.
 *
 * @param likertResponses - Record of questionId → 1-5 score
 * @param situationalResponses - Record of questionId → selectedOptionId
 */
export function scoreAssessment(
  likertResponses: Record<string, number>,
  situationalResponses: Record<string, string>
): AssessmentScoreResult {
  const likertScores = scoreLikertResponses(likertResponses);
  const situationalScores = scoreSituationalResponses(situationalResponses);

  const dimensions: Record<AssessmentDimension, DimensionScore> = {} as Record<
    AssessmentDimension,
    DimensionScore
  >;

  const allDimensions: AssessmentDimension[] = [
    'strategic_vision',
    'research_rigour',
    'execution_discipline',
    'stakeholder_alignment',
    'adaptive_capacity',
  ];

  let totalScore = 0;
  let totalMax = 0;

  for (const dim of allDimensions) {
    const raw = likertScores[dim].raw + situationalScores[dim].raw;
    const maxPossible = likertScores[dim].maxPossible + situationalScores[dim].maxPossible;
    const score = maxPossible > 0 ? Math.round((raw / maxPossible) * 100) : 0;

    dimensions[dim] = { dimension: dim, score, raw, maxPossible };
    totalScore += raw;
    totalMax += maxPossible;
  }

  const archetype = classifyArchetype(dimensions);
  const overallMaturity = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return { dimensions, archetype, overallMaturity };
}

/**
 * Get the archetype coaching instructions for the system prompt.
 */
export function getArchetypeCoachingInstructions(archetypeId: ArchetypeId): string {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return '';

  return `## Strategic Archetype: ${archetype.label}

${archetype.description}

### Coaching Adaptation
${archetype.coachingStyle}`;
}
