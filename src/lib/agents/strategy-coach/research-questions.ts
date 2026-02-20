/**
 * Research Questions — Single Source of Truth
 *
 * All 9 research areas × 4 questions = 36 questions.
 * Used by:
 *  - System prompt (research coaching mode)
 *  - Research extractor (capture validation)
 *  - TerritoryNav (area labels)
 *  - LiveCanvas (area status)
 */

export interface ResearchQuestion {
  index: number;
  text: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  questions: ResearchQuestion[];
}

export interface TerritoryResearch {
  territory: 'company' | 'customer' | 'competitor';
  label: string;
  areas: ResearchArea[];
}

// ── Company Territory ───────────────────────────────────────────────

const COMPANY_AREAS: ResearchArea[] = [
  {
    id: 'core_capabilities',
    title: 'Core Capabilities & Constraints',
    description:
      "What are your organization's unique strengths, and what fundamental constraints shape your strategic options?",
    questions: [
      { index: 0, text: "What are your organization's core competencies and differentiating capabilities?" },
      { index: 1, text: "What key resources (technical, human, IP) do you control that competitors don't?" },
      { index: 2, text: 'What structural constraints limit your strategic freedom (legacy systems, contracts, regulations)?' },
      { index: 3, text: 'Which capabilities are table stakes vs. truly differentiated in your market?' },
    ],
  },
  {
    id: 'resource_reality',
    title: 'Resource Reality',
    description:
      'What team, technology, and funding realities will enable or constrain your strategy execution?',
    questions: [
      { index: 0, text: 'What is the current composition and skill distribution of your team?' },
      { index: 1, text: 'What technology stack and infrastructure do you have in place?' },
      { index: 2, text: 'What funding runway and burn rate define your strategic timeline?' },
      { index: 3, text: 'What hiring constraints or talent gaps could impact execution?' },
    ],
  },
  {
    id: 'product_portfolio',
    title: 'Product Portfolio & Market Position',
    description:
      'How do your current products perform in the market, and what does your portfolio reveal about strategic direction?',
    questions: [
      { index: 0, text: 'What products/services comprise your current portfolio and how do they perform?' },
      { index: 1, text: 'Which products are growth drivers vs. legacy offerings?' },
      { index: 2, text: 'What is your current market position and competitive standing?' },
      { index: 3, text: 'What gaps exist between your current portfolio and market opportunities?' },
    ],
  },
];

// ── Customer Territory ──────────────────────────────────────────────

const CUSTOMER_AREAS: ResearchArea[] = [
  {
    id: 'customer_segmentation',
    title: 'Customer Segmentation & Behaviors',
    description:
      'Who are your customers, how do they behave, and what drives their decisions?',
    questions: [
      { index: 0, text: 'What are your primary customer segments, and how do they differ in needs, behaviors, and value?' },
      { index: 1, text: 'How do customers currently discover, evaluate, and purchase solutions in your category?' },
      { index: 2, text: 'What decision-making criteria matter most to each segment (price, features, trust, speed, etc.)?' },
      { index: 3, text: 'Which customer segments are growing, declining, or emerging in your market?' },
    ],
  },
  {
    id: 'unmet_needs',
    title: 'Unmet Needs & Pain Points',
    description:
      'What problems do customers face that current solutions fail to address adequately?',
    questions: [
      { index: 0, text: 'What are the most significant pain points customers experience with existing solutions (including yours)?' },
      { index: 1, text: 'What jobs-to-be-done are customers hiring products for, and where do current solutions fall short?' },
      { index: 2, text: 'What workarounds, hacks, or compromises do customers make to get their jobs done?' },
      { index: 3, text: 'What emerging needs or latent desires are customers beginning to express?' },
    ],
  },
  {
    id: 'market_dynamics',
    title: 'Market Dynamics & Customer Evolution',
    description:
      'How are customer expectations, behaviors, and the competitive landscape changing over time?',
    questions: [
      { index: 0, text: 'How have customer expectations evolved in the past 2-3 years, and what trends are accelerating?' },
      { index: 1, text: "What new alternatives or substitutes are customers considering that didn't exist before?" },
      { index: 2, text: 'How are customer acquisition costs, retention rates, and lifetime value trending in your category?' },
      { index: 3, text: 'What external forces (technology, regulation, economics, culture) are reshaping customer needs?' },
    ],
  },
];

// ── Competitor / Market Context Territory ────────────────────────────

const COMPETITOR_AREAS: ResearchArea[] = [
  {
    id: 'direct_competitors',
    title: 'Direct Competitor Landscape',
    description:
      'Who are your primary competitors, and how do they compete for the same customers?',
    questions: [
      { index: 0, text: 'Who are your top 3-5 direct competitors, and what makes them your primary competition?' },
      { index: 1, text: 'What are each competitor\'s core value propositions, and how do they differentiate?' },
      { index: 2, text: 'Where do competitors have clear advantages over your current offering?' },
      { index: 3, text: 'What competitive moves or announcements have you observed in the past 12 months?' },
    ],
  },
  {
    id: 'substitute_threats',
    title: 'Substitute & Adjacent Threats',
    description:
      "What alternative solutions or emerging players could capture your customers' attention?",
    questions: [
      { index: 0, text: 'What non-traditional solutions do customers use to solve the same problems you address?' },
      { index: 1, text: 'What adjacent products or services are expanding into your market space?' },
      { index: 2, text: 'What emerging startups or disruptors are gaining traction with your target customers?' },
      { index: 3, text: 'How might technology shifts (AI, automation, platforms) create new competitive threats?' },
    ],
  },
  {
    id: 'market_forces',
    title: 'Market Forces & Dynamics',
    description:
      'What broader market trends and forces are reshaping the competitive landscape?',
    questions: [
      { index: 0, text: 'What macroeconomic, regulatory, or industry trends are most impacting your market?' },
      { index: 1, text: 'How is the overall market size and growth trajectory evolving?' },
      { index: 2, text: 'What barriers to entry exist, and are they strengthening or weakening?' },
      { index: 3, text: 'What emerging customer expectations or behaviors are changing competitive dynamics?' },
    ],
  },
];

// ── Exports ─────────────────────────────────────────────────────────

export const TERRITORY_RESEARCH: TerritoryResearch[] = [
  { territory: 'company', label: 'Company Territory', areas: COMPANY_AREAS },
  { territory: 'customer', label: 'Customer Territory', areas: CUSTOMER_AREAS },
  { territory: 'competitor', label: 'Market Context', areas: COMPETITOR_AREAS },
];

/** Flat lookup: territory → area_id → ResearchArea */
export function getResearchArea(
  territory: 'company' | 'customer' | 'competitor',
  areaId: string
): ResearchArea | null {
  const t = TERRITORY_RESEARCH.find((tr) => tr.territory === territory);
  return t?.areas.find((a) => a.id === areaId) ?? null;
}

/** Get all area IDs for a territory */
export function getAreaIds(territory: 'company' | 'customer' | 'competitor'): string[] {
  const t = TERRITORY_RESEARCH.find((tr) => tr.territory === territory);
  return t?.areas.map((a) => a.id) ?? [];
}

/** Format research context for system prompt injection */
export function formatResearchContextForPrompt(
  territory: 'company' | 'customer' | 'competitor',
  areaId: string,
  answeredQuestions: Record<number, string>
): string {
  const area = getResearchArea(territory, areaId);
  if (!area) return '';

  const territoryLabel =
    TERRITORY_RESEARCH.find((t) => t.territory === territory)?.label ?? territory;

  const questionLines = area.questions.map((q) => {
    const status = answeredQuestions[q.index] ? 'ANSWERED' : 'UNANSWERED';
    const answer = answeredQuestions[q.index]
      ? `\n   Previous answer: "${answeredQuestions[q.index]}"`
      : '';
    return `${q.index + 1}. [${status}] ${q.text}${answer}`;
  });

  return `## ACTIVE RESEARCH COACHING MODE

**Territory**: ${territoryLabel}
**Research Area**: ${area.title}
**Description**: ${area.description}

### Questions to Cover (ONE at a time — probe deeply before moving on)
${questionLines.join('\n')}

### Instructions
- Focus on the NEXT UNANSWERED question. Ask it conversationally, adapting to the user's context.
- Probe for depth: ask follow-up questions if the answer is vague or surface-level.
- When the user provides a sufficiently detailed answer, distill it into a concise summary and emit:
  [ResearchCapture:${territory}:${areaId}:{questionIndex}:{Distilled answer text}]
- This marker is parsed by the system — the user does NOT see it. Do NOT reference it.
- After capturing, acknowledge the answer briefly and transition to the next unanswered question.
- When ALL questions in this area are answered, emit:
  [AreaComplete:${territory}:${areaId}]
- Then suggest moving to the next research area or territory.
`;
}
