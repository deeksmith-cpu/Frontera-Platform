/**
 * Synthesis Helper Functions
 *
 * Calculation and parsing utilities for the Playing to Win synthesis system.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Quadrant,
  ConfidenceLevel,
  OpportunityType,
  TensionImpact,
  StrategicOpportunity,
  StrategicTension,
  EvidenceLink,
  WWHBTAssumption,
  SynthesisResult,
  RawClaudeSynthesisResponse,
  RawClaudeOpportunity,
  RawClaudeTension,
} from '@/types/synthesis';

// =============================================================================
// Quadrant Calculation
// =============================================================================

/**
 * Calculate which quadrant an opportunity belongs to based on scores
 *
 * Quadrants:
 * - INVEST: High Market Attractiveness (>=6) + High Capability Fit (>=6)
 * - EXPLORE: High Market Attractiveness (>=6) + Low Capability Fit (<6)
 * - HARVEST: Low Market Attractiveness (<6) + High Capability Fit (>=6)
 * - DIVEST: Low Market Attractiveness (<6) + Low Capability Fit (<6)
 */
export function calculateQuadrant(
  marketAttractiveness: number,
  capabilityFit: number
): Quadrant {
  const highMarket = marketAttractiveness >= 6;
  const highCapability = capabilityFit >= 6;

  if (highMarket && highCapability) return 'invest';
  if (highMarket && !highCapability) return 'explore';
  if (!highMarket && highCapability) return 'harvest';
  return 'divest';
}

// =============================================================================
// Score Calculation
// =============================================================================

/**
 * Calculate overall opportunity score from individual scores
 *
 * Weighting:
 * - Market Attractiveness: 40%
 * - Capability Fit: 35%
 * - Competitive Advantage: 25%
 *
 * Returns score 0-100
 */
export function calculateOverallScore(
  marketAttractiveness: number,
  capabilityFit: number,
  competitiveAdvantage: number
): number {
  // Clamp inputs to 1-10 range
  const market = Math.max(1, Math.min(10, marketAttractiveness));
  const capability = Math.max(1, Math.min(10, capabilityFit));
  const competitive = Math.max(1, Math.min(10, competitiveAdvantage));

  // Weighted average scaled to 0-100
  const weightedScore =
    market * 4 +       // 40% weight (4 points per score point)
    capability * 3.5 + // 35% weight (3.5 points per score point)
    competitive * 2.5; // 25% weight (2.5 points per score point)

  return Math.round(weightedScore);
}

// =============================================================================
// Confidence Calculation
// =============================================================================

/**
 * Determine confidence level based on evidence and assumption strength
 *
 * Scoring:
 * - Each evidence item: 2 points
 * - Each assumption: 1 point
 *
 * Thresholds:
 * - High: 10+ points
 * - Medium: 5-9 points
 * - Low: <5 points
 */
export function determineConfidence(
  evidenceCount: number,
  assumptionsCount: number
): ConfidenceLevel {
  const score = evidenceCount * 2 + assumptionsCount;

  if (score >= 10) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

// =============================================================================
// Type Validation
// =============================================================================

/**
 * Validate and normalize opportunity type
 *
 * @deprecated Legacy type validation. New opportunities should use 'paired_strategy'.
 */
export function validateOpportunityType(type: string): OpportunityType {
  const validTypes: OpportunityType[] = [
    'where_to_play',      // deprecated
    'how_to_win',         // deprecated
    'capability_gap',     // deprecated
    'paired_strategy',    // new default
  ];

  const normalized = type.toLowerCase().replace(/\s+/g, '_') as OpportunityType;

  if (validTypes.includes(normalized)) {
    return normalized;
  }

  // Default to paired_strategy for new opportunities
  return 'paired_strategy';
}

/**
 * Validate and normalize tension impact
 */
export function validateTensionImpact(impact: string): TensionImpact {
  const validImpacts: TensionImpact[] = ['blocking', 'significant', 'minor'];

  const normalized = impact.toLowerCase() as TensionImpact;

  if (validImpacts.includes(normalized)) {
    return normalized;
  }

  // Default to significant if invalid
  return 'significant';
}

/**
 * Validate territory type
 */
export function validateTerritory(
  territory: string
): 'company' | 'customer' | 'competitor' {
  const validTerritories = ['company', 'customer', 'competitor'];
  const normalized = territory.toLowerCase();

  if (validTerritories.includes(normalized)) {
    return normalized as 'company' | 'customer' | 'competitor';
  }

  // Default to company if invalid
  return 'company';
}

/**
 * Validate WWHBT assumption category
 */
export function validateAssumptionCategory(
  category: string
): 'customer' | 'company' | 'competitor' | 'economics' {
  const validCategories = ['customer', 'company', 'competitor', 'economics'];
  const normalized = category.toLowerCase();

  if (validCategories.includes(normalized)) {
    return normalized as 'customer' | 'company' | 'competitor' | 'economics';
  }

  // Default to economics if invalid
  return 'economics';
}

// =============================================================================
// Claude Response Parsing
// =============================================================================

/**
 * Parse raw Claude opportunity into structured StrategicOpportunity
 */
function parseOpportunity(raw: RawClaudeOpportunity): StrategicOpportunity {
  const id = uuidv4();

  // Parse and validate scores
  const marketAttractiveness = Math.max(1, Math.min(10, raw.scoring?.marketAttractiveness || 5));
  const capabilityFit = Math.max(1, Math.min(10, raw.scoring?.capabilityFit || 5));
  const competitiveAdvantage = Math.max(1, Math.min(10, raw.scoring?.competitiveAdvantage || 5));

  // Parse evidence
  const evidence: EvidenceLink[] = (raw.evidence || []).map((e) => ({
    territory: validateTerritory(e.territory || 'company'),
    researchArea: e.researchArea || 'unknown',
    question: e.quote?.substring(0, 50) || '', // Use quote start as question hint
    quote: e.quote || '',
    insightId: '', // Will be filled in by API when matching to actual insights
  }));

  // Parse assumptions
  const assumptions: WWHBTAssumption[] = (raw.assumptions || []).map((a) => ({
    category: validateAssumptionCategory(a.category || 'economics'),
    assumption: a.assumption || '',
    testMethod: a.testMethod || '',
    riskIfFalse: a.riskIfFalse || '',
  }));

  // Validate WTP and HTW pairing (core of Playing to Win framework)
  const whereToPlay = raw.ptw?.whereToPlay?.trim() || '';
  const howToWin = raw.ptw?.howToWin?.trim() || '';

  // Warn if WTP or HTW is missing (violates PTW framework)
  if (!whereToPlay || !howToWin) {
    console.warn(
      `Opportunity "${raw.title}" missing WTP or HTW pairing - this violates Playing to Win framework`,
      { whereToPlay: !!whereToPlay, howToWin: !!howToWin }
    );
  }

  return {
    id,
    title: raw.title || 'Untitled Opportunity',
    description: raw.description || '',
    // opportunityType is now optional - default to 'paired_strategy' for new opportunities
    opportunityType: raw.opportunityType
      ? validateOpportunityType(raw.opportunityType)
      : 'paired_strategy',
    scoring: {
      marketAttractiveness,
      capabilityFit,
      competitiveAdvantage,
      overallScore: calculateOverallScore(marketAttractiveness, capabilityFit, competitiveAdvantage),
    },
    quadrant: calculateQuadrant(marketAttractiveness, capabilityFit),
    confidence: determineConfidence(evidence.length, assumptions.length),
    ptw: {
      winningAspiration: raw.ptw?.winningAspiration || '',
      whereToPlay,
      howToWin,
      capabilitiesRequired: raw.ptw?.capabilitiesRequired || [],
      managementSystems: raw.ptw?.managementSystems || [],
    },
    evidence,
    assumptions,
  };
}

/**
 * Parse raw Claude tension into structured StrategicTension
 */
function parseTension(raw: RawClaudeTension): StrategicTension {
  return {
    id: uuidv4(),
    description: raw.description || '',
    alignedEvidence: (raw.alignedEvidence || []).map((e) => ({
      insight: e.insight || '',
      source: e.source || '',
    })),
    conflictingEvidence: (raw.conflictingEvidence || []).map((e) => ({
      insight: e.insight || '',
      source: e.source || '',
    })),
    resolutionOptions: (raw.resolutionOptions || []).map((r) => ({
      option: r.option || '',
      tradeOff: r.tradeOff || '',
      recommended: r.recommended || false,
    })),
    impact: validateTensionImpact(raw.impact || 'significant'),
  };
}

/**
 * Parse and validate Claude synthesis response
 *
 * Returns null if parsing fails completely
 */
export function parseClaudeSynthesisResponse(
  rawJson: string,
  conversationId: string,
  metadata: {
    modelUsed: string;
    territoriesIncluded: ('company' | 'customer' | 'competitor')[];
    researchAreasCount: number;
  }
): SynthesisResult | null {
  try {
    // Attempt to parse JSON
    let parsed: RawClaudeSynthesisResponse;

    try {
      parsed = JSON.parse(rawJson);
    } catch {
      // Try to extract JSON from markdown code block
      const jsonMatch = rawJson.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try to find JSON object in the response
        const objectMatch = rawJson.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          parsed = JSON.parse(objectMatch[0]);
        } else {
          console.error('Could not extract JSON from Claude response');
          return null;
        }
      }
    }

    // Parse opportunities
    const opportunities = (parsed.opportunities || []).map(parseOpportunity);

    // Parse tensions
    const tensions = (parsed.tensions || []).map(parseTension);

    // Calculate overall confidence based on all evidence
    const totalEvidence = opportunities.reduce((sum, o) => sum + o.evidence.length, 0);
    const totalAssumptions = opportunities.reduce((sum, o) => sum + o.assumptions.length, 0);
    const overallConfidence = determineConfidence(totalEvidence, totalAssumptions);

    const result: SynthesisResult = {
      id: uuidv4(),
      conversationId,
      executiveSummary: parsed.executiveSummary || '',
      opportunities,
      tensions,
      recommendations: parsed.recommendations || [],
      metadata: {
        modelUsed: metadata.modelUsed,
        territoriesIncluded: metadata.territoriesIncluded,
        researchAreasCount: metadata.researchAreasCount,
        generatedAt: new Date().toISOString(),
        confidenceLevel: overallConfidence,
      },
      userEdited: false,
      createdAt: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    console.error('Error parsing Claude synthesis response:', error);
    return null;
  }
}

// =============================================================================
// Evidence Matching
// =============================================================================

/**
 * Match evidence quotes to actual territory insight IDs
 *
 * Uses fuzzy matching to find the best matching insight for each evidence quote
 */
export function matchEvidenceToInsights(
  opportunities: StrategicOpportunity[],
  territoryInsights: Array<{
    id: string;
    territory: string;
    research_area: string;
    responses: Record<string, string>;
  }>
): StrategicOpportunity[] {
  return opportunities.map((opp) => ({
    ...opp,
    evidence: opp.evidence.map((ev) => {
      // Find matching insight
      const matchingInsight = territoryInsights.find((insight) => {
        // Match by territory
        if (insight.territory !== ev.territory) return false;

        // Check if any response contains similar text
        const responses = Object.values(insight.responses);
        return responses.some((response) => {
          if (!response || !ev.quote) return false;
          // Simple contains check (could be improved with fuzzy matching)
          const normalizedResponse = response.toLowerCase();
          const normalizedQuote = ev.quote.toLowerCase().substring(0, 50);
          return normalizedResponse.includes(normalizedQuote);
        });
      });

      return {
        ...ev,
        insightId: matchingInsight?.id || '',
        researchArea: matchingInsight?.research_area || ev.researchArea,
      };
    }),
  }));
}

// =============================================================================
// Formatting Utilities
// =============================================================================

/**
 * Format territory insights for Claude synthesis prompt
 */
export function formatTerritoryInsightsForPrompt(
  insights: Array<{
    territory: string;
    research_area: string;
    responses: Record<string, string>;
  }>
): string {
  // Group by territory
  const byTerritory = insights.reduce(
    (acc, insight) => {
      if (!acc[insight.territory]) {
        acc[insight.territory] = [];
      }
      acc[insight.territory].push(insight);
      return acc;
    },
    {} as Record<string, typeof insights>
  );

  // Format each territory section
  const sections: string[] = [];

  for (const [territory, territoryInsights] of Object.entries(byTerritory)) {
    const territoryName = territory.charAt(0).toUpperCase() + territory.slice(1);
    sections.push(`# ${territoryName} Territory Insights\n`);

    for (const insight of territoryInsights) {
      const areaName = insight.research_area
        .replace(/_/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      sections.push(`## ${areaName}\n`);

      // Add each response
      const responses = Object.entries(insight.responses);
      for (const [, value] of responses) {
        if (value) {
          sections.push(`- ${value}\n`);
        }
      }
      sections.push('');
    }
  }

  return sections.join('\n');
}

/**
 * Get quadrant display properties
 */
export function getQuadrantDisplay(quadrant: Quadrant): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
} {
  switch (quadrant) {
    case 'invest':
      return {
        label: 'INVEST',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
        borderColor: 'border-emerald-300',
        description: 'High potential, execute now',
      };
    case 'explore':
      return {
        label: 'EXPLORE',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300',
        description: 'High potential, build capability',
      };
    case 'harvest':
      return {
        label: 'HARVEST',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-300',
        description: 'Maintain, don\'t over-invest',
      };
    case 'divest':
      return {
        label: 'DIVEST',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-300',
        description: 'Low priority, avoid investment',
      };
  }
}

/**
 * Get confidence display properties
 */
export function getConfidenceDisplay(confidence: ConfidenceLevel): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (confidence) {
    case 'high':
      return {
        label: 'High Confidence',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100',
      };
    case 'medium':
      return {
        label: 'Medium Confidence',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
      };
    case 'low':
      return {
        label: 'Low Confidence',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
      };
  }
}

/**
 * Get territory display properties
 */
export function getTerritoryDisplay(territory: 'company' | 'customer' | 'competitor'): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (territory) {
    case 'company':
      return {
        label: 'Company',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
        borderColor: 'border-indigo-300',
      };
    case 'customer':
      return {
        label: 'Customer',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-100',
        borderColor: 'border-cyan-300',
      };
    case 'competitor':
      return {
        label: 'Competitor',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-300',
      };
  }
}

/**
 * Get tension impact display properties
 */
export function getTensionImpactDisplay(impact: TensionImpact): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (impact) {
    case 'blocking':
      return {
        label: 'Blocking',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
      };
    case 'significant':
      return {
        label: 'Significant',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
      };
    case 'minor':
      return {
        label: 'Minor',
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
      };
  }
}
