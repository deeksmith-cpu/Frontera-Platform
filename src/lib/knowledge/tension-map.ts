/**
 * Strategic Tension Map (UC4)
 *
 * Maps common strategic tensions to opposing expert positions from 301
 * Lenny's Podcast transcripts. Used by Debate Mode in the Synthesis phase.
 */

export interface ExpertPosition {
  expert: string;
  company: string;
  argument: string;
  quote: string;
  transcriptRef: string;
}

export interface StrategicTension {
  id: string;
  title: string;
  description: string;
  positionA: ExpertPosition;
  positionB: ExpertPosition;
  neutralQuestion: string;
  phaseRelevance: string[];
  topicTags: string[];
}

export interface DebateDecision {
  tensionId: string;
  tensionTitle: string;
  positionA: ExpertPosition;
  positionB: ExpertPosition;
  userChoice: 'position_a' | 'position_b' | 'nuanced';
  userReasoning: string;
  userResearchEvidence: string[];
  decidedAt: string;
}

const TENSION_MAP: StrategicTension[] = [
  {
    id: 'tension-001',
    title: 'Speed vs. Quality',
    description: 'Should you ship fast and iterate, or invest in quality upfront?',
    positionA: {
      expert: 'Nan Yu',
      company: 'Linear',
      argument: 'Speed is competence. Fast products feel better, convert better, and signal a team that knows what it is doing. Shipping quickly creates feedback loops that improve quality faster than deliberation.',
      quote: 'Speed is not about cutting corners. Speed is a feature. When your product is fast, everything about the experience improves.',
      transcriptRef: 'nan-yu-karri-saarinen-linear.txt',
    },
    positionB: {
      expert: 'Kim Scott',
      company: 'Author (Radical Candor)',
      argument: 'Moving fast without caring deeply about the people using your product leads to technical debt, cultural debt, and trust erosion. Quality comes from genuine care.',
      quote: 'Care personally, challenge directly. Rushing past quality is a failure to care about the people who depend on what you build.',
      transcriptRef: 'kim-scott-radical-candor.txt',
    },
    neutralQuestion: 'Given your competitive context and team capability, which approach would create more strategic advantage right now?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['product-craft', 'execution', 'engineering-culture'],
  },
  {
    id: 'tension-002',
    title: 'PLG vs. Sales-Led GTM',
    description: 'Should you grow through product-led self-serve or founder/sales-led motion?',
    positionA: {
      expert: 'Elena Verna',
      company: 'Growth Advisor',
      argument: 'Product-led growth creates compounding loops. Free products are the best acquisition channel. Let users experience value before asking them to pay.',
      quote: 'Build growth loops, not funnels. Funnels leak. Loops compound. Self-serve is not just a pricing model — it is a distribution strategy.',
      transcriptRef: 'elena-verna-growth.txt',
    },
    positionB: {
      expert: 'Jen Abel',
      company: 'JJELLYFISH',
      argument: 'Founder-led sales validates willingness to pay and teaches you what customers actually need. Premature PLG means giving away value before you understand it.',
      quote: 'Every founder should do their first 10-20 sales calls. You learn what resonates, what the objections are, and whether people will actually pay.',
      transcriptRef: 'jen-abel-founder-sales.txt',
    },
    neutralQuestion: 'Does your current product deliver enough standalone value for self-serve, or do you need human guidance to close the value gap?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['go-to-market', 'growth', 'sales'],
  },
  {
    id: 'tension-003',
    title: 'Focus vs. Expand',
    description: 'Should you double down on your core product or expand into adjacent products?',
    positionA: {
      expert: 'Vijay Iyengar',
      company: 'Mixpanel',
      argument: 'When your core is suffering, adding products amplifies the problem. Kill adjacent initiatives and redirect everything to your core strength.',
      quote: 'Expansion without core strength is a trap. We killed adjacent products and redirected the entire team to core analytics. That saved the company.',
      transcriptRef: 'vijay-iyengar-mixpanel.txt',
    },
    positionB: {
      expert: 'Cameron Adams',
      company: 'Canva',
      argument: 'The biggest opportunities come from expanding your TAM. Serve new segments, new use cases, and new markets. Platform expansion compounds.',
      quote: 'We went from designers to everyone who needs to create visual content. That expanded our market from millions to billions of potential users.',
      transcriptRef: 'cameron-adams-canva.txt',
    },
    neutralQuestion: 'Is your core product winning in its primary market? If not, expansion may be premature. If so, where is the natural expansion boundary?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['product-strategy', 'portfolio', 'focus'],
  },
  {
    id: 'tension-004',
    title: 'Hire External vs. Grow Internal',
    description: 'Should you bring in experienced external leaders or develop internal talent?',
    positionA: {
      expert: 'Claire Hughes Johnson',
      company: 'Stripe (former COO)',
      argument: 'Experienced leaders bring pattern recognition that accelerates your trajectory. They have seen the scaling playbook before and can apply it to your context.',
      quote: 'Writing forces clarity of thought. Experienced leaders bring frameworks for decision-making that take years to develop organically.',
      transcriptRef: 'claire-hughes-johnson-stripe.txt',
    },
    positionB: {
      expert: 'Molly Graham',
      company: 'Lambda School (former COO)',
      argument: 'Homegrown leaders understand your culture and customers deeply. External hires often fail because they try to import playbooks that do not fit.',
      quote: 'At each growth stage, leaders must give away responsibilities they previously owned. Growing leaders internally preserves culture and institutional knowledge.',
      transcriptRef: 'molly-graham-scaling.txt',
    },
    neutralQuestion: 'What is your organization\'s biggest gap — cultural continuity or experienced leadership patterns?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['leadership', 'hiring', 'org-design', 'culture'],
  },
  {
    id: 'tension-005',
    title: 'Move Fast vs. Move Right',
    description: 'Should you prioritize speed of execution or depth of understanding?',
    positionA: {
      expert: 'Andrew Bosworth',
      company: 'Meta (CTO)',
      argument: 'Speed wins markets. Decision-making speed degrades with headcount unless you actively fight it. Push decisions down, reduce review layers, ship now.',
      quote: 'Clarity of ownership matters more than hierarchy. Wide spans of control force managers to delegate rather than micromanage.',
      transcriptRef: 'boz-andrew-bosworth-meta.txt',
    },
    positionB: {
      expert: 'Ami Vora',
      company: 'Faire',
      argument: 'Curiosity over ego. Think deeply before acting. Moving fast in the wrong direction is worse than moving deliberately in the right one.',
      quote: 'The best product decisions come from genuine curiosity about the problem, not rushing to the first solution that feels right.',
      transcriptRef: 'ami-vora-faire.txt',
    },
    neutralQuestion: 'Are you in a market where first-mover advantage matters more than getting it right, or vice versa?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['execution', 'decision-making', 'culture'],
  },
  {
    id: 'tension-006',
    title: 'Freemium vs. Premium',
    description: 'Should you offer a generous free tier or charge from day one?',
    positionA: {
      expert: 'Brian Balfour',
      company: 'Reforge',
      argument: 'Free tiers create distribution flywheels. Users who experience value become advocates. Freemium is a growth strategy, not a pricing strategy.',
      quote: 'Growth loops, not funnels. Free products that deliver real value create the strongest growth loops because every user becomes a potential distribution channel.',
      transcriptRef: 'brian-balfour-reforge.txt',
    },
    positionB: {
      expert: 'Grant Lee',
      company: 'Gamma',
      argument: 'Profitability is a strategic advantage. Charging from day one validates value and creates discipline. Free tiers attract users who may never convert.',
      quote: 'Profitability is not a constraint — it is a strategic advantage. When you are profitable, you answer to your customers, not your investors.',
      transcriptRef: 'grant-lee-gamma.txt',
    },
    neutralQuestion: 'Does your product have natural viral mechanics that benefit from a free tier, or is the value proposition clear enough to charge upfront?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['pricing', 'growth', 'business-model'],
  },
  {
    id: 'tension-007',
    title: 'Global vs. Local Focus',
    description: 'Should you build one product for the world or adapt to local markets?',
    positionA: {
      expert: 'Ivan Zhao',
      company: 'Notion',
      argument: 'One product for the world. Localization adds complexity that dilutes the core experience. Great products transcend markets.',
      quote: 'We built Notion as a universal tool for thought. The core interaction model works the same whether you are in Tokyo or San Francisco.',
      transcriptRef: 'ivan-zhao-notion.txt',
    },
    positionB: {
      expert: 'Kevin Aluwi',
      company: 'GoJek',
      argument: 'Local markets have unique needs that global products cannot serve. Deep localization creates defensible moats.',
      quote: 'You cannot apply a Silicon Valley playbook to Southeast Asia. Each market has different infrastructure, regulations, and cultural expectations.',
      transcriptRef: 'kevin-aluwi-gojek.txt',
    },
    neutralQuestion: 'Is your product solving a universal human problem or a culturally specific one?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['market-expansion', 'localization', 'strategy'],
  },
  {
    id: 'tension-008',
    title: 'Founder-Led vs. Professional Management',
    description: 'Should founders stay in the details or delegate to professional managers?',
    positionA: {
      expert: 'Brian Chesky',
      company: 'Airbnb',
      argument: 'Founders should stay close to the product. Professional managers optimize but rarely innovate. Founder-led, design-driven product development wins.',
      quote: 'I reorganized Airbnb so I could be the chief product officer. The best products come from founders who stay in the details.',
      transcriptRef: 'brian-chesky-airbnb.txt',
    },
    positionB: {
      expert: 'Marty Cagan',
      company: 'SVPG',
      argument: 'Empowered product teams outperform founder-dependent organizations. Scalable organizations need distributed decision-making.',
      quote: 'The best companies build empowered teams that own outcomes, not just output. Founder dependency is a single point of failure.',
      transcriptRef: 'marty-cagan-empowered.txt',
    },
    neutralQuestion: 'What stage is your company? Early-stage often benefits from founder control. Scale often requires empowerment.',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['leadership', 'org-design', 'founder-mode'],
  },
  {
    id: 'tension-009',
    title: 'Data-Driven vs. Intuition',
    description: 'Should every decision be backed by data, or is product intuition essential?',
    positionA: {
      expert: 'Ronny Kohavi',
      company: 'Airbnb/Microsoft (former)',
      argument: 'A/B test everything. Most intuitions are wrong. Data removes bias and ego from decisions. Trustworthy online experiments are the gold standard.',
      quote: 'Most product ideas fail. The only way to know which ones work is to test them rigorously. Intuition is not a strategy.',
      transcriptRef: 'ronny-kohavi-experimentation.txt',
    },
    positionB: {
      expert: 'Shreyas Doshi',
      company: 'Independent (ex-Stripe/Twitter)',
      argument: 'Data tells you what happened, not what should happen. Product judgment — honed through experience — is irreplaceable for breakthrough innovation.',
      quote: 'The LNO framework: not everything deserves the same level of effort. Some decisions need deep analysis, others need fast intuition. Knowing the difference is the skill.',
      transcriptRef: 'shreyas-doshi-product.txt',
    },
    neutralQuestion: 'Are you optimizing an existing product (data wins) or creating something new (intuition matters more)?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['decision-making', 'experimentation', 'product-judgment'],
  },
  {
    id: 'tension-010',
    title: 'Bottom-Up vs. Top-Down Strategy',
    description: 'Should strategy emerge from teams or be set by leadership?',
    positionA: {
      expert: 'Roger Martin',
      company: 'Rotman School',
      argument: 'Strategy is a top-down choice about where to play and how to win. Without clear choices from leadership, teams optimize locally and the company lacks coherence.',
      quote: 'Strategy is an integrative set of choices that positions you to win. It must come from the top because only leadership has the full picture.',
      transcriptRef: 'roger-martin-playing-to-win.txt',
    },
    positionB: {
      expert: 'Teresa Torres',
      company: 'Product Talk',
      argument: 'Continuous discovery from the ground reveals opportunities that top-down strategy misses. The people closest to customers have the best signal.',
      quote: 'Continuous discovery habits mean every team member is connected to customer reality. Strategy should emerge from this rich understanding.',
      transcriptRef: 'teresa-torres-discovery.txt',
    },
    neutralQuestion: 'Does your organization have strong customer proximity at the leadership level, or is that knowledge concentrated in frontline teams?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['strategy', 'org-design', 'decision-making'],
  },
  {
    id: 'tension-011',
    title: 'Platform vs. Point Solution',
    description: 'Should you build a comprehensive platform or do one thing exceptionally well?',
    positionA: {
      expert: 'Shishir Mehrotra',
      company: 'Coda',
      argument: 'Platforms create ecosystem value that point solutions cannot match. When products share a data substrate, each new capability makes all others better.',
      quote: 'Horizontal tools need vertical entry points. The path from point solution to platform is through identifying your best use cases.',
      transcriptRef: 'shishir-mehrotra-coda.txt',
    },
    positionB: {
      expert: 'Jason Fried',
      company: 'Basecamp',
      argument: 'Do one thing well. Platforms add complexity that bloats the product and the organization. Simplicity and focus create loyal customers.',
      quote: 'Not every company needs to be a platform. Saying no to most things — the features you refuse to build define your product.',
      transcriptRef: 'jason-fried-basecamp.txt',
    },
    neutralQuestion: 'Do your customers need an ecosystem of integrated tools, or are they looking for one tool that does its job perfectly?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['product-strategy', 'platform', 'focus'],
  },
  {
    id: 'tension-012',
    title: 'Venture-Scale vs. Sustainable Growth',
    description: 'Should you pursue hypergrowth with external funding or build profitably?',
    positionA: {
      expert: 'Marc Andreessen',
      company: 'a16z',
      argument: 'Software markets are winner-take-most. Aggressive investment in growth captures category leadership before competitors can react. Speed and scale matter.',
      quote: 'Software is eating the world. In these markets, the biggest companies are built by moving fast and capturing market share aggressively.',
      transcriptRef: 'marc-andreessen-a16z.txt',
    },
    positionB: {
      expert: 'Jason Fried',
      company: 'Basecamp',
      argument: 'Profitability gives you freedom. External funding creates obligations that distort product decisions. Build for customers, not investors.',
      quote: 'Profitability is freedom. When you are profitable, you make decisions for your customers, not your board. That is a competitive advantage.',
      transcriptRef: 'jason-fried-basecamp.txt',
    },
    neutralQuestion: 'Is your market winner-take-most (where speed matters) or can multiple players coexist (where sustainability matters)?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['business-model', 'funding', 'growth'],
  },
  {
    id: 'tension-013',
    title: 'Category Creation vs. Category Entry',
    description: 'Should you create a new category or position within an existing one?',
    positionA: {
      expert: 'Christopher Lochhead',
      company: 'Category Pirates',
      argument: 'Category creators capture 76% of the economics. If you play in someone else\'s category, you play by their rules. Create the game.',
      quote: 'Category is the new strategy. The company that defines the category wins the category. Do not compete — create.',
      transcriptRef: 'christopher-lochhead-category.txt',
    },
    positionB: {
      expert: 'April Dunford',
      company: 'Ambient Strategy',
      argument: 'Most products are better positioned within existing categories that buyers already understand. Category creation is expensive and risky.',
      quote: 'Positioning is not about what you say about your product. It is about how buyers make sense of what you offer in the context of alternatives they already know.',
      transcriptRef: 'april-dunford-positioning.txt',
    },
    neutralQuestion: 'Can buyers easily understand your product through existing categories, or does the existing framing fundamentally misrepresent your value?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['positioning', 'marketing', 'strategy'],
  },
  {
    id: 'tension-014',
    title: 'Customer Obsession vs. Vision-Led',
    description: 'Should you work backwards from customer needs or lead with a creative vision?',
    positionA: {
      expert: 'Jeff Weinstein',
      company: 'Stripe',
      argument: 'Work backwards from the customer. Talk to users obsessively. The best products are built by people who deeply understand the problems they solve.',
      quote: 'I talk to 5-10 customers per week. Not because I have to, but because that is where the best product insights come from.',
      transcriptRef: 'jeff-weinstein-stripe.txt',
    },
    positionB: {
      expert: 'Scott Belsky',
      company: 'Adobe CPO',
      argument: 'Customers can tell you about today\'s problems, not tomorrow\'s possibilities. Creative vision — leading with conviction — creates products people did not know they needed.',
      quote: 'The best product leaders have taste — an opinionated view of how the world should work. That is not something customers can articulate for you.',
      transcriptRef: 'scott-belsky-adobe.txt',
    },
    neutralQuestion: 'Is your market well-understood (customer-led wins) or are you creating something genuinely new (vision-led wins)?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['product-strategy', 'customer-research', 'vision'],
  },
  {
    id: 'tension-015',
    title: 'Radical Transparency vs. Selective Sharing',
    description: 'Should you default to organizational openness or keep strategic information selective?',
    positionA: {
      expert: 'Claire Hughes Johnson',
      company: 'Stripe (former COO)',
      argument: 'Default to openness. Transparent organizations make better decisions because everyone has the context. Information asymmetry creates dysfunction.',
      quote: 'Writing forces clarity of thought. When decisions and reasoning are shared openly, the quality of organizational decision-making improves dramatically.',
      transcriptRef: 'claire-hughes-johnson-stripe.txt',
    },
    positionB: {
      expert: 'Ben Horowitz',
      company: 'a16z',
      argument: 'Leaders carry burdens that cannot be shared without creating panic. Selective sharing protects focus and prevents anxiety from cascading through the organization.',
      quote: 'As CEO, you will face moments where transparency would create more harm than secrecy. The hard thing about hard things is knowing which is which.',
      transcriptRef: 'ben-horowitz-hard-things.txt',
    },
    neutralQuestion: 'Is your organization mature enough to handle full transparency, or would certain information create more anxiety than alignment?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['culture', 'leadership', 'communication'],
  },
  {
    id: 'tension-016',
    title: 'Technical Excellence vs. Ship It',
    description: 'Should you invest in engineering excellence or ship fast and iterate?',
    positionA: {
      expert: 'Will Larson',
      company: 'Carta (CTO)',
      argument: 'Investing in engineering excellence — infrastructure, developer experience, technical debt reduction — compounds over time and accelerates all future work.',
      quote: 'Staff engineers create leverage by making everyone around them more effective. Investing in engineering infrastructure is investing in all future shipping.',
      transcriptRef: 'will-larson-carta.txt',
    },
    positionB: {
      expert: 'Guillermo Rauch',
      company: 'Vercel',
      argument: 'Ship, learn, iterate. Perfectionism is the enemy of progress. Real user feedback is worth more than any internal quality bar.',
      quote: 'Ship something. Get feedback. Improve. The iteration cycle is the most valuable process in product development.',
      transcriptRef: 'guillermo-rauch-vercel.txt',
    },
    neutralQuestion: 'Is your current technical debt actively slowing you down, or are you using quality concerns as an excuse to avoid shipping?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['engineering', 'execution', 'technical-debt'],
  },
  {
    id: 'tension-017',
    title: 'Jobs-to-Be-Done vs. Feature Roadmap',
    description: 'Should you organize around customer jobs or feature delivery?',
    positionA: {
      expert: 'Bob Moesta',
      company: 'The ReWired Group',
      argument: 'Understand the job the customer is hiring your product to do. Features are solutions — jobs are the problems. Start with the job.',
      quote: 'People do not buy products. They hire them to make progress in their lives. If you do not understand the job, you are guessing.',
      transcriptRef: 'bob-moesta-jtbd.txt',
    },
    positionB: {
      expert: 'Gibson Biddle',
      company: 'Netflix (former VP Product)',
      argument: 'Feature-driven strategies with clear metrics are actionable and measurable. Jobs frameworks can be too abstract for execution.',
      quote: 'The DHM model — Delight, Hard-to-Copy, Margin-Enhancing — gives teams concrete guidance for which features to build and why.',
      transcriptRef: 'gibson-biddle-netflix.txt',
    },
    neutralQuestion: 'Does your team struggle with building the wrong things (JTBD helps) or struggle with executing on known priorities (feature roadmap helps)?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['product-strategy', 'customer-research', 'execution'],
  },
  {
    id: 'tension-018',
    title: 'Pricing Power vs. Market Penetration',
    description: 'Should you monetize aggressively or prioritize market share?',
    positionA: {
      expert: 'Madhavan Ramanujam',
      company: 'Simon-Kucher',
      argument: 'Monetize from day one. Willingness to pay is the strongest signal of product-market fit. Pricing is a product feature, not an afterthought.',
      quote: 'If you build the product first and figure out pricing later, you have already failed. Monetization should be baked into your product strategy.',
      transcriptRef: 'madhavan-ramanujam-pricing.txt',
    },
    positionB: {
      expert: 'Gustaf Alstromer',
      company: 'Y Combinator (Partner)',
      argument: 'Growth first, monetize later. In winner-take-most markets, capturing users is more important than capturing revenue. You can always raise prices.',
      quote: 'The biggest startup mistake is optimizing for revenue before optimizing for growth. Market share compounds; early revenue does not.',
      transcriptRef: 'gustaf-alstromer-yc.txt',
    },
    neutralQuestion: 'Is your market winner-take-most (penetration matters) or can you sustain a premium position (pricing power matters)?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['pricing', 'growth', 'monetization'],
  },
  {
    id: 'tension-019',
    title: 'Individual Genius vs. Team Process',
    description: 'Should you rely on exceptional individuals or build scalable team processes?',
    positionA: {
      expert: 'Nikita Bier',
      company: 'TBH/Gas (Founder)',
      argument: 'Small teams with singular vision build the best products. Process kills creativity. A few exceptional people outperform large organized teams.',
      quote: 'My best products were built by tiny teams with no process. When you add process, you lose the magic. Keep the team small and trust the vision.',
      transcriptRef: 'nikita-bier-consumer.txt',
    },
    positionB: {
      expert: 'Nicole Forsgren',
      company: 'Microsoft Research',
      argument: 'Engineering process scales. DORA metrics prove that high-performing teams combine speed and stability through good practices, not individual heroics.',
      quote: 'The data is clear: the best teams have both high velocity and high stability. That comes from process and culture, not individual heroics.',
      transcriptRef: 'nicole-forsgren-dora.txt',
    },
    neutralQuestion: 'Is your team small enough that individual talent is the bottleneck, or large enough that coordination is the bottleneck?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['team', 'process', 'engineering-culture'],
  },
  {
    id: 'tension-020',
    title: 'Build AI vs. Stay Human',
    description: 'Should you aggressively integrate AI or maintain human-centered workflows?',
    positionA: {
      expert: 'Scott Wu',
      company: 'Cognition (Devin)',
      argument: 'AI augments everything. Products that do not integrate AI will be disrupted by those that do. The window to build AI-native is now.',
      quote: 'AI is not a feature — it is a platform shift. Every product category will be rebuilt around AI capabilities. Move now or be left behind.',
      transcriptRef: 'scott-wu-cognition.txt',
    },
    positionB: {
      expert: 'Teresa Torres',
      company: 'Product Talk',
      argument: 'Technology should serve human needs, not replace human judgment. AI adds value when it enhances human capability, not when it removes human agency.',
      quote: 'Continuous discovery is fundamentally about human connection — understanding real people with real problems. No AI can replace that empathy.',
      transcriptRef: 'teresa-torres-discovery.txt',
    },
    neutralQuestion: 'Where in your product would AI genuinely improve the user experience, versus where is AI just a trend you feel pressured to follow?',
    phaseRelevance: ['synthesis', 'bets'],
    topicTags: ['AI', 'technology', 'product-strategy'],
  },
];

// ============================================================================
// RETRIEVAL
// ============================================================================

/**
 * Get all tensions.
 */
export function getAllTensions(): StrategicTension[] {
  return [...TENSION_MAP];
}

/**
 * Get a tension by ID.
 */
export function getTensionById(id: string): StrategicTension | null {
  return TENSION_MAP.find(t => t.id === id) || null;
}

/**
 * Find tensions relevant to a given topic or synthesis tension description.
 */
export function matchTensionToSynthesis(tensionDescription: string): StrategicTension | null {
  const lower = tensionDescription.toLowerCase();

  // Score each tension by keyword overlap across all text fields
  let bestMatch: StrategicTension | null = null;
  let bestScore = 0;

  for (const tension of TENSION_MAP) {
    let score = 0;
    const keywords = [
      tension.title.toLowerCase(),
      tension.description.toLowerCase(),
      tension.positionA.argument.toLowerCase(),
      tension.positionB.argument.toLowerCase(),
      tension.neutralQuestion.toLowerCase(),
      ...tension.topicTags.map(t => t.replace(/-/g, ' ').toLowerCase()),
    ].join(' ');

    // Word overlap scoring
    const words = lower.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && keywords.includes(word)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = tension;
    }
  }

  // Always return a match — the user explicitly clicked "Enter Debate Mode"
  // so they expect a debate to open. If keyword scoring found nothing
  // (bestScore === 0), fall back to the first tension in the map.
  return bestMatch || TENSION_MAP[0] || null;
}

/**
 * Format a tension for injection into the system prompt.
 */
export function formatTensionForPrompt(tension: StrategicTension): string {
  return `**Debate Available: ${tension.title}**
Position A (${tension.positionA.expert}, ${tension.positionA.company}): ${tension.positionA.argument}
Position B (${tension.positionB.expert}, ${tension.positionB.company}): ${tension.positionB.argument}
Framing question: ${tension.neutralQuestion}

When this tension surfaces, offer Debate Mode: "This tension has strong expert perspectives on both sides. Would you like to explore an Expert Debate between ${tension.positionA.expert} and ${tension.positionB.expert}?"`;
}
