/**
 * Strategic Guardrails Generation Prompt
 *
 * Takes synthesis tensions + bet decisions → generates
 * "We Will / We Will Not" statements.
 */

export interface GuardrailsInput {
  bets: Array<{
    bet: string;
    job_to_be_done: string;
  }>;
  tensions?: Array<{
    title?: string;
    description: string;
  }>;
  synthesisHighlights?: string;
  companyName: string;
}

export function buildGuardrailsPrompt(input: GuardrailsInput): string {
  const { bets, tensions, synthesisHighlights, companyName } = input;

  return `You are a strategic planning expert generating Strategic Guardrails for ${companyName}.

## Strategic Bets
${bets.map((b, i) => `${i + 1}. **${b.bet}** (JTBD: ${b.job_to_be_done})`).join('\n')}

${tensions && tensions.length > 0 ? `## Strategic Tensions
${tensions.map((t) => `- ${t.description}`).join('\n')}` : ''}

${synthesisHighlights ? `## Synthesis Context\n${synthesisHighlights}` : ''}

## Generate Strategic Guardrails

Create 6-8 "We Will / We Will Not" paired statements that:
1. Protect strategic focus and prevent scope creep
2. Resolve key tensions by committing to trade-offs
3. Give teams clear decision-making boundaries
4. Are specific enough to be actionable (not generic platitudes)

Return as JSON:
{
  "guardrails": [
    { "weWill": "...", "weWillNot": "...", "rationale": "..." }
  ]
}`;
}
