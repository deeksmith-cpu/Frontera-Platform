/**
 * OKR Cascade Generation Prompt
 *
 * Takes strategic bets + success metrics → generates
 * Objectives + Key Results per bet.
 */

export interface OKRInput {
  bets: Array<{
    bet: string;
    success_metric: string;
    job_to_be_done: string;
  }>;
  companyName: string;
  timeHorizon?: string;
}

export function buildOKRPrompt(input: OKRInput): string {
  const { bets, companyName, timeHorizon } = input;

  return `You are a strategic planning expert generating OKR Cascades for ${companyName}.

## Strategic Bets
${bets.map((b, i) => `${i + 1}. **${b.bet}**
   - Success Metric: ${b.success_metric}
   - JTBD: ${b.job_to_be_done}`).join('\n')}

${timeHorizon ? `**Time Horizon:** ${timeHorizon}` : '**Time Horizon:** 90 days'}

## Generate OKR Cascade

For each strategic bet, create:
- 1 Objective (outcome-oriented, qualitative, inspiring)
- 3 Key Results (measurable, with specific numbers and timeframes)
- Key Results should be LEADING indicators, not trailing metrics

Return as JSON:
{
  "okrs": [
    {
      "betIndex": 0,
      "objective": "...",
      "keyResults": [
        { "kr": "...", "target": "...", "timeframe": "..." }
      ]
    }
  ]
}`;
}
