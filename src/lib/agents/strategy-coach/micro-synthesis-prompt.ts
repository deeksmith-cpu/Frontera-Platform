/**
 * Micro-Synthesis Engine
 *
 * Generates a quick territory-level synthesis (~3 key findings) when all 3
 * research areas within a single territory are marked as "mapped".
 * This is shown immediately as a reward/momentum signal — NOT the full
 * cross-territory synthesis that happens in the Synthesis phase.
 */

export interface MicroSynthesisResult {
  territory: 'company' | 'customer' | 'competitor';
  keyFindings: Array<{
    title: string;
    description: string;
    evidenceBase: string;
    confidence: 'high' | 'medium' | 'low';
  }>;
  overallConfidence: 'high' | 'medium' | 'low';
  strategicImplication: string;
  generatedAt: string;
}

/**
 * Build the Claude prompt for micro-synthesis of a single territory.
 */
export function buildMicroSynthesisPrompt(
  territory: 'company' | 'customer' | 'competitor',
  insights: Array<{
    area: string;
    responses: Record<string, string>;
    confidence?: Record<string, string>;
  }>
): string {
  const territoryLabel =
    territory === 'company' ? 'Company' :
    territory === 'customer' ? 'Customer' :
    'Market Context';

  const confidenceLabel = (conf?: string) => {
    if (conf === 'data') return ' [data-backed]';
    if (conf === 'experience') return ' [experience-based]';
    if (conf === 'guess') return ' [unverified guess]';
    return '';
  };

  // Format the research data
  const researchData = insights.map((insight) => {
    const areaName = insight.area.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const qaPairs = Object.entries(insight.responses)
      .map(([qIndex, answer]) => {
        const conf = insight.confidence?.[qIndex];
        return `Q${Number(qIndex) + 1}: ${answer}${confidenceLabel(conf)}`;
      })
      .join('\n');
    return `### ${areaName}\n${qaPairs}`;
  }).join('\n\n');

  return `You are a strategic analyst performing a micro-synthesis of ${territoryLabel} Territory research.

## Research Data
${researchData}

## Instructions

Analyze the research above and produce exactly 3 key findings that capture the most strategically significant insights from this territory. Each finding should:
1. Synthesize across multiple research areas (not just restate one answer)
2. Identify a pattern, tension, or implication
3. Note the confidence level based on the evidence quality

Also provide one overarching strategic implication — the single most important thing this territory research reveals for strategic decision-making.

## Required JSON Output Format

Return ONLY valid JSON with no markdown formatting:

{
  "keyFindings": [
    {
      "title": "Short finding title (5-8 words)",
      "description": "2-3 sentence finding description connecting multiple research areas",
      "evidenceBase": "Brief note on which research areas support this finding",
      "confidence": "high|medium|low"
    }
  ],
  "overallConfidence": "high|medium|low",
  "strategicImplication": "One sentence: the most important strategic implication from this territory"
}`;
}
