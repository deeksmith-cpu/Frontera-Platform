/**
 * Decision Framework Generation Prompt
 *
 * Takes strategy + guardrails → generates prioritisation rules.
 */

export interface DecisionFrameworkInput {
  guardrails: Array<{ weWill: string; weWillNot: string }>;
  bets: Array<{ bet: string }>;
  companyName: string;
}

export function buildDecisionFrameworkPrompt(input: DecisionFrameworkInput): string {
  const { guardrails, bets, companyName } = input;

  return `You are a strategic planning expert generating a Decision Framework for ${companyName}.

## Strategic Guardrails
${guardrails.map((g, i) => `${i + 1}. We WILL: ${g.weWill} | We WILL NOT: ${g.weWillNot}`).join('\n')}

## Strategic Bets
${bets.map((b, i) => `${i + 1}. ${b.bet}`).join('\n')}

## Generate a Decision Framework

Create a set of prioritisation rules that teams can use for day-to-day decisions:

1. **Prioritise** (3-4 items): Things to always choose when in conflict
2. **Consider** (3-4 items): Things to evaluate case-by-case
3. **Deprioritise** (3-4 items): Things to deliberately move down the list

Each rule should be specific enough to resolve a real decision tension (e.g., "When choosing between market expansion and product depth, prioritise depth for existing segments").

Return as JSON:
{
  "framework": {
    "prioritise": [{ "rule": "...", "context": "..." }],
    "consider": [{ "rule": "...", "context": "..." }],
    "deprioritise": [{ "rule": "...", "context": "..." }]
  }
}`;
}
