/**
 * Stakeholder Communication Pack Generation Prompt
 *
 * Takes full strategy → generates audience-specific views.
 */

export type StakeholderAudience = 'cpo_ceo' | 'cto' | 'sales' | 'product_managers';

export interface StakeholderPackInput {
  strategyOnAPage?: string;
  bets: Array<{ bet: string; success_metric: string; job_to_be_done: string }>;
  guardrails?: Array<{ weWill: string; weWillNot: string }>;
  audience: StakeholderAudience;
  companyName: string;
}

const AUDIENCE_CONTEXT: Record<StakeholderAudience, { label: string; focus: string }> = {
  cpo_ceo: {
    label: 'CPO/CEO',
    focus: 'Strategic direction, resource allocation, competitive positioning, and board-level narrative.',
  },
  cto: {
    label: 'CTO/Engineering',
    focus: 'Technical implications, capability requirements, build vs buy decisions, and engineering investment.',
  },
  sales: {
    label: 'Sales & Customer Success',
    focus: 'Customer impact, competitive messaging, deal positioning, and retention implications.',
  },
  product_managers: {
    label: 'Product Managers',
    focus: 'Team-level objectives, prioritisation guidelines, success metrics, and execution guardrails.',
  },
};

export function buildStakeholderPackPrompt(input: StakeholderPackInput): string {
  const { bets, guardrails, audience, companyName, strategyOnAPage } = input;
  const ctx = AUDIENCE_CONTEXT[audience];

  return `You are a strategic communications expert generating a Stakeholder Brief for the **${ctx.label}** audience at ${companyName}.

**Audience Focus:** ${ctx.focus}

${strategyOnAPage ? `## Strategy on a Page\n${strategyOnAPage}` : ''}

## Strategic Bets
${bets.map((b, i) => `${i + 1}. **${b.bet}** (Metric: ${b.success_metric})`).join('\n')}

${guardrails && guardrails.length > 0 ? `## Guardrails
${guardrails.map((g) => `- We WILL: ${g.weWill} | We WILL NOT: ${g.weWillNot}`).join('\n')}` : ''}

## Generate a ${ctx.label} Stakeholder Brief

Tailor the strategic content for this specific audience. Include:
1. **Executive Summary** (3-4 sentences): What this strategy means for their function
2. **Key Implications** (3-5 bullets): Specific impacts on their area
3. **What Changes** (2-3 items): Concrete changes they should expect
4. **What Stays the Same** (1-2 items): Areas of continuity for comfort
5. **Questions to Address** (2-3 items): Likely concerns this audience will raise

Return as JSON:
{
  "audience": "${audience}",
  "audienceLabel": "${ctx.label}",
  "executiveSummary": "...",
  "keyImplications": ["..."],
  "whatChanges": ["..."],
  "whatStaysTheSame": ["..."],
  "questionsToAddress": ["..."]
}`;
}
