/**
 * Expert Knowledge Index
 *
 * Manages the indexed expert knowledge base derived from 301 Lenny's Podcast
 * transcripts. Provides chunking, metadata tagging, and retrieval for the
 * Expert Perspectives feature (UC1).
 *
 * Architecture: Keyword-based retrieval (no vector DB dependency).
 * Chunks are pre-tagged with topics, territories, and phases during ingestion.
 * Retrieval uses tag matching + keyword scoring against the user's context.
 */

export interface ExpertChunk {
  id: string;
  transcriptFilename: string;
  speakerName: string;
  speakerCompany: string;
  speakerRole: string;
  chunkText: string;
  chunkIndex: number;
  topicTags: string[];
  industryTags: string[];
  phaseRelevance: string[];
  territoryRelevance: string[];
}

export interface ExpertCitation {
  id: string;
  conversationId: string;
  chunkId: string;
  messageId?: string;
  synthesisOutputId?: string;
  citationContext: string;
  createdAt: string;
}

export interface ExpertInsight {
  speaker: string;
  company: string;
  quote: string;
  topic: string;
  source: string;
  relevanceScore: number;
}

/**
 * Static expert knowledge index.
 * In production this would be loaded from the expert_knowledge_chunks table.
 * For the initial implementation, we use a curated set of high-value insights
 * extracted from the 301 transcripts, organized by territory and topic.
 */

export interface ExpertEntry {
  speaker: string;
  company: string;
  role: string;
  filename: string;
  insights: Array<{
    quote: string;
    topic: string;
    tags: string[];
    territories: string[];
    phases: string[];
  }>;
}

// Curated expert knowledge base - high-value insights from the transcript archive
// This represents the indexed knowledge that gets injected into the system prompt
export const EXPERT_KNOWLEDGE: ExpertEntry[] = [
  // === GROWTH & PLG ===
  {
    speaker: 'Hila Qu',
    company: 'GitLab/Acorns',
    role: 'PLG Expert',
    filename: 'Hila Qu.txt',
    insights: [
      {
        quote: 'Free products are the best acquisition channel. If your product can\'t sell itself through a free experience, no sales team will fix that structural problem.',
        topic: 'Product-Led Growth',
        tags: ['plg', 'freemium', 'acquisition', 'self-serve', 'growth'],
        territories: ['customer', 'company'],
        phases: ['research', 'synthesis'],
      },
      {
        quote: 'The biggest mistake in PLG is optimizing conversion before activation. If users don\'t reach the aha moment, your funnel is a leaky bucket.',
        topic: 'Activation & Conversion',
        tags: ['activation', 'conversion', 'onboarding', 'aha-moment', 'funnel'],
        territories: ['customer'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Elena Verna',
    company: 'Growth Advisor',
    role: 'Growth Advisor',
    filename: 'Elena Verna 2.0.txt',
    insights: [
      {
        quote: 'Growth is not a department — it\'s a capability that needs to be embedded across the entire organization. Siloed growth teams create local maxima.',
        topic: 'Growth Organization',
        tags: ['growth', 'organization', 'team-structure', 'cross-functional'],
        territories: ['company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Brian Balfour',
    company: 'Reforge',
    role: 'CEO, Reforge',
    filename: 'Brian Balfour.txt',
    insights: [
      {
        quote: 'Growth loops, not funnels, are how sustainable businesses scale. Every great product has a loop where satisfied users create new users.',
        topic: 'Growth Loops',
        tags: ['growth-loops', 'viral', 'retention', 'acquisition', 'flywheel'],
        territories: ['customer', 'company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Sean Ellis',
    company: 'GrowthHackers',
    role: 'Author, Hacking Growth',
    filename: 'Sean Ellis.txt',
    insights: [
      {
        quote: 'Before you can grow, you need to know if you have something worth growing. The must-have score tells you if you\'ve found product-market fit.',
        topic: 'Product-Market Fit',
        tags: ['pmf', 'product-market-fit', 'must-have', 'validation'],
        territories: ['customer', 'company'],
        phases: ['discovery', 'research'],
      },
    ],
  },
  {
    speaker: 'Georgiana Laudi',
    company: 'Forget The Funnel',
    role: 'Founder',
    filename: 'Gia Laudi.txt',
    insights: [
      {
        quote: 'Jobs-to-be-done framing outperforms demographic segmentation every time. Your customers don\'t buy your product — they hire it to do a job.',
        topic: 'Customer Segmentation',
        tags: ['jtbd', 'segmentation', 'customer-research', 'positioning'],
        territories: ['customer'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === PRODUCT CRAFT & SPEED ===
  {
    speaker: 'Nan Yu',
    company: 'Linear',
    role: 'Head of Product',
    filename: 'Nan Yu.txt',
    insights: [
      {
        quote: 'Speed is competence. Shipping fast reveals what matters. A six-month roadmap is usually hiding uncertainty, not managing complexity.',
        topic: 'Product Velocity',
        tags: ['speed', 'shipping', 'velocity', 'craft', 'roadmap'],
        territories: ['company'],
        phases: ['research', 'synthesis', 'planning'],
      },
      {
        quote: 'The best customer insights come from watching people use your product, not from surveys. Observation beats declaration.',
        topic: 'Customer Discovery',
        tags: ['customer-discovery', 'user-research', 'observation', 'insights'],
        territories: ['customer'],
        phases: ['research'],
      },
    ],
  },
  {
    speaker: 'Ivan Zhao',
    company: 'Notion',
    role: 'CEO',
    filename: 'Ivan Zhao.txt',
    insights: [
      {
        quote: 'We spent three to four years without product-market fit. The market needed to catch up to our vision. Conviction must be balanced with adaptability.',
        topic: 'Long-term Vision',
        tags: ['vision', 'pmf', 'persistence', 'pivot', 'horizontal-product'],
        territories: ['company', 'customer'],
        phases: ['discovery', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Rahul Vohra',
    company: 'Superhuman',
    role: 'CEO',
    filename: 'Rahul Vohra.txt',
    insights: [
      {
        quote: 'We built a quantitative framework for product-market fit. If less than 40% of users say they\'d be very disappointed without your product, you don\'t have PMF.',
        topic: 'Product-Market Fit Measurement',
        tags: ['pmf', 'measurement', 'survey', 'product-market-fit'],
        territories: ['customer', 'company'],
        phases: ['discovery', 'research'],
      },
    ],
  },
  // === SCALING & LEADERSHIP ===
  {
    speaker: 'Andrew Bosworth',
    company: 'Meta',
    role: 'CTO',
    filename: 'Boz.txt',
    insights: [
      {
        quote: 'At Facebook\'s early days we worked 120-hour weeks. That\'s not sustainable, but the lesson is: in the critical window, intensity matters more than balance.',
        topic: 'Startup Intensity',
        tags: ['scaling', 'culture', 'intensity', 'startup', 'leadership'],
        territories: ['company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Cameron Adams',
    company: 'Canva',
    role: 'CPO/Co-founder',
    filename: 'Cam Adams.txt',
    insights: [
      {
        quote: 'We deliberately grew leadership from within rather than importing external executives. Homegrown leaders understand the culture and can scale it authentically.',
        topic: 'Organizational Scaling',
        tags: ['scaling', 'leadership', 'culture', 'hiring', 'organization'],
        territories: ['company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Claire Hughes Johnson',
    company: 'Stripe',
    role: 'Ex-COO',
    filename: 'Claire Hughes Johnson.txt',
    insights: [
      {
        quote: 'Operating principles are the connective tissue between strategy and execution. Without them, every team interprets the strategy differently.',
        topic: 'Strategy Execution',
        tags: ['strategy-execution', 'operating-principles', 'alignment', 'culture'],
        territories: ['company'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  {
    speaker: 'Molly Graham',
    company: 'Ex-Google/Facebook',
    role: 'Operations Leader',
    filename: 'Molly Graham.txt',
    insights: [
      {
        quote: 'Scaling means giving away your Legos. The things that made you successful as an individual contributor are exactly what you need to let go of as a leader.',
        topic: 'Leadership Scaling',
        tags: ['scaling', 'delegation', 'leadership', 'management'],
        territories: ['company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === STRATEGY & FRAMEWORKS ===
  {
    speaker: 'Marty Cagan',
    company: 'SVPG',
    role: 'Author, Inspired/Empowered',
    filename: 'Marty Cagan.txt',
    insights: [
      {
        quote: 'The root cause of most product failures is that teams are given features to build rather than problems to solve. Empowered teams need strategic context, not task lists.',
        topic: 'Empowered Teams',
        tags: ['empowered-teams', 'product-management', 'autonomy', 'strategy'],
        territories: ['company'],
        phases: ['research', 'synthesis', 'planning'],
      },
    ],
  },
  {
    speaker: 'April Dunford',
    company: 'Positioning Expert',
    role: 'Author, Obviously Awesome',
    filename: 'April Dunford.txt',
    insights: [
      {
        quote: 'Positioning is not messaging. It\'s the context you set so customers can understand what your product is, why it matters, and why they should care.',
        topic: 'Product Positioning',
        tags: ['positioning', 'messaging', 'competitive', 'differentiation'],
        territories: ['customer', 'competitor'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Richard Rumelt',
    company: 'UCLA/Strategy Professor',
    role: 'Author, Good Strategy Bad Strategy',
    filename: 'Richard Rumelt.txt',
    insights: [
      {
        quote: 'Good strategy is not a goal or a vision statement. It\'s a coherent set of analyses, concepts, policies, and actions that respond to a high-stakes challenge.',
        topic: 'Strategy Definition',
        tags: ['strategy', 'strategic-planning', 'coherence', 'diagnosis'],
        territories: ['company'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  {
    speaker: 'Roger Martin',
    company: 'Rotman School',
    role: 'Strategy Professor, Playing to Win',
    filename: 'Roger Martin.txt',
    insights: [
      {
        quote: 'Strategy is an integrated set of choices that positions you to win. Where to play and how to win are the two essential questions.',
        topic: 'Playing to Win',
        tags: ['playing-to-win', 'where-to-play', 'how-to-win', 'strategy', 'choices'],
        territories: ['company', 'customer', 'competitor'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  // === COMPETITIVE & MARKET ===
  {
    speaker: 'Hamilton Helmer',
    company: 'Strategy Capital',
    role: 'Author, 7 Powers',
    filename: 'Hamilton Helmer.txt',
    insights: [
      {
        quote: 'Power is the set of conditions creating the potential for persistent differential returns. Without power, your competitive advantage is temporary.',
        topic: 'Competitive Moats',
        tags: ['moats', 'competitive-advantage', '7-powers', 'defensibility'],
        territories: ['competitor', 'company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Geoffrey Moore',
    company: 'Crossing the Chasm Author',
    role: 'Technology Strategy',
    filename: 'Geoffrey Moore.txt',
    insights: [
      {
        quote: 'The chasm exists because early adopters and early majority have fundamentally different buying criteria. What works in the early market actively repels the mainstream.',
        topic: 'Market Adoption',
        tags: ['chasm', 'market-adoption', 'early-majority', 'go-to-market'],
        territories: ['customer', 'competitor'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === CUSTOMER RESEARCH ===
  {
    speaker: 'Teresa Torres',
    company: 'Product Discovery Coach',
    role: 'Author, Continuous Discovery Habits',
    filename: 'Teresa Torres.txt',
    insights: [
      {
        quote: 'Continuous discovery means weekly touchpoints with customers. Not quarterly research projects — weekly conversations that inform every product decision.',
        topic: 'Continuous Discovery',
        tags: ['discovery', 'customer-research', 'cadence', 'habits'],
        territories: ['customer'],
        phases: ['discovery', 'research'],
      },
    ],
  },
  {
    speaker: 'Bob Moesta',
    company: 'JTBD Expert',
    role: 'Jobs-to-be-Done Pioneer',
    filename: 'Bob Moesta.txt',
    insights: [
      {
        quote: 'People don\'t buy products. They hire them to make progress in their lives. Understanding the struggling moment is the key to innovation.',
        topic: 'Jobs-to-be-Done',
        tags: ['jtbd', 'customer-needs', 'innovation', 'struggling-moment'],
        territories: ['customer'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === GO-TO-MARKET ===
  {
    speaker: 'Jen Abel',
    company: 'Jellyfish',
    role: 'Founder-Led Sales Expert',
    filename: 'Jen Abel.txt',
    insights: [
      {
        quote: 'At early stage, founder-led sales validates willingness to pay. PLG without pricing validation is a trap — you need to prove customers will exchange money for value.',
        topic: 'Founder-Led Sales',
        tags: ['sales', 'founder-led', 'gtm', 'pricing', 'validation'],
        territories: ['customer', 'company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Ray Cao',
    company: 'TikTok',
    role: 'Head of Monetization',
    filename: 'Ray Cao.txt',
    insights: [
      {
        quote: 'Context not control. In a global organization, local teams need to understand the why, not follow the how. The best global products adapt to local context.',
        topic: 'Global Strategy',
        tags: ['global', 'localization', 'management', 'context', 'culture'],
        territories: ['company', 'customer'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === FEEDBACK & CULTURE ===
  {
    speaker: 'Kim Scott',
    company: 'Radical Candor',
    role: 'Author',
    filename: 'Kim Scott.txt',
    insights: [
      {
        quote: 'Radical Candor is caring personally while challenging directly. Most leaders default to ruinous empathy — being nice instead of being clear.',
        topic: 'Feedback Culture',
        tags: ['feedback', 'culture', 'radical-candor', 'leadership', 'management'],
        territories: ['company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === AI & TECHNOLOGY ===
  {
    speaker: 'Inbal Shani',
    company: 'GitHub',
    role: 'CPO',
    filename: 'Inbal S.txt',
    insights: [
      {
        quote: 'GitHub Copilot showed us that AI doesn\'t replace developers — it amplifies their capabilities. The productivity gains come from reducing toil, not eliminating judgment.',
        topic: 'AI-Assisted Productivity',
        tags: ['ai', 'copilot', 'developer-tools', 'productivity', 'automation'],
        territories: ['company', 'competitor'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  {
    speaker: 'Tobi Lutke',
    company: 'Shopify',
    role: 'CEO',
    filename: 'Tobi Lutke.txt',
    insights: [
      {
        quote: 'Build for the long term, not the next quarter. Sustainable competitive advantage comes from compounding small improvements over years, not big swings.',
        topic: 'Long-term Thinking',
        tags: ['long-term', 'sustainability', 'compounding', 'strategy'],
        territories: ['company'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  // === PRICING & MONETIZATION ===
  {
    speaker: 'Madhavan Ramanujam',
    company: 'Simon-Kucher',
    role: 'Monetization Expert',
    filename: 'Madhavan Ramanujam.txt',
    insights: [
      {
        quote: 'The number one reason products fail is not that they\'re bad products — it\'s that they\'re not monetized correctly. Build pricing into the product from day one.',
        topic: 'Monetization Strategy',
        tags: ['pricing', 'monetization', 'willingness-to-pay', 'business-model'],
        territories: ['customer', 'company'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === DECISION-MAKING ===
  {
    speaker: 'Annie Duke',
    company: 'Decision Strategist',
    role: 'Author, Thinking in Bets',
    filename: 'Annie Duke.txt',
    insights: [
      {
        quote: 'Every strategic decision is a bet. The goal isn\'t to be right every time — it\'s to make decisions that maximize expected value given what you know.',
        topic: 'Decision-Making Under Uncertainty',
        tags: ['decisions', 'bets', 'probability', 'uncertainty', 'strategy'],
        territories: ['company'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  {
    speaker: 'Shreyas Doshi',
    company: 'Ex-Stripe/Twitter',
    role: 'Product Leader',
    filename: 'Shreyas Doshi.txt',
    insights: [
      {
        quote: 'Use the LNO framework: categorize tasks as Leverage, Neutral, or Overhead. Most product leaders spend too much time on Overhead and not enough on Leverage.',
        topic: 'Prioritization',
        tags: ['prioritization', 'leverage', 'productivity', 'focus'],
        territories: ['company'],
        phases: ['research', 'planning'],
      },
    ],
  },
  // === MARKETPLACE & PLATFORM ===
  {
    speaker: 'Brian Chesky',
    company: 'Airbnb',
    role: 'CEO',
    filename: 'Brian Chesky.txt',
    insights: [
      {
        quote: 'Founders should stay in the details. The idea that CEOs should only focus on high-level strategy is wrong — the product is the strategy, and the details are the product.',
        topic: 'Founder Mode',
        tags: ['founder', 'leadership', 'product-detail', 'ceo', 'strategy'],
        territories: ['company'],
        phases: ['synthesis', 'planning'],
      },
    ],
  },
  {
    speaker: 'Dylan Field',
    company: 'Figma',
    role: 'CEO',
    filename: 'Dylan Field.txt',
    insights: [
      {
        quote: 'Multiplayer software is the future. When your product becomes the place where teams collaborate, you become infrastructure — and infrastructure is very hard to replace.',
        topic: 'Collaboration as Moat',
        tags: ['collaboration', 'multiplayer', 'platform', 'moat', 'network-effects'],
        territories: ['competitor', 'customer'],
        phases: ['research', 'synthesis'],
      },
    ],
  },
  // === DATA & EXPERIMENTATION ===
  {
    speaker: 'Ronny Kohavi',
    company: 'A/B Testing Expert',
    role: 'Ex-Microsoft/Airbnb',
    filename: 'Ronny Kohavi.txt',
    insights: [
      {
        quote: 'Most features that teams believe will be positive are actually neutral or negative. Controlled experiments are the only reliable way to separate intuition from reality.',
        topic: 'Experimentation Culture',
        tags: ['experimentation', 'ab-testing', 'data-driven', 'metrics'],
        territories: ['company'],
        phases: ['research', 'planning'],
      },
    ],
  },
];

/**
 * Retrieve expert insights relevant to a given context.
 * Uses tag-based matching against the user's territory, research area, and phase.
 */
export function retrieveExpertInsights(
  territory?: string,
  researchArea?: string,
  phase?: string,
  maxResults: number = 3
): ExpertInsight[] {
  const results: ExpertInsight[] = [];

  // Build search terms from the context
  const searchTerms: string[] = [];
  if (territory) searchTerms.push(territory.toLowerCase());
  if (researchArea) {
    // Convert research_area format to searchable terms
    searchTerms.push(...researchArea.toLowerCase().replace(/_/g, ' ').split(/\s+/));
  }

  for (const expert of EXPERT_KNOWLEDGE) {
    for (const insight of expert.insights) {
      let score = 0;

      // Territory match (high weight)
      if (territory && insight.territories.includes(territory.toLowerCase())) {
        score += 3;
      }

      // Phase match (medium weight)
      if (phase && insight.phases.includes(phase.toLowerCase())) {
        score += 2;
      }

      // Tag match against search terms (variable weight)
      for (const term of searchTerms) {
        for (const tag of insight.tags) {
          if (tag.includes(term) || term.includes(tag)) {
            score += 1;
          }
        }
        // Also check topic
        if (insight.topic.toLowerCase().includes(term)) {
          score += 2;
        }
      }

      if (score > 0) {
        results.push({
          speaker: expert.speaker,
          company: expert.company,
          quote: insight.quote,
          topic: insight.topic,
          source: expert.filename,
          relevanceScore: score,
        });
      }
    }
  }

  // Sort by relevance and limit
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, maxResults);
}

/**
 * Get all experts organized by category for the Expert Sources panel.
 */
export function getAllExperts(): Array<{
  speaker: string;
  company: string;
  role: string;
  insightCount: number;
  topics: string[];
}> {
  return EXPERT_KNOWLEDGE.map((expert) => ({
    speaker: expert.speaker,
    company: expert.company,
    role: expert.role,
    insightCount: expert.insights.length,
    topics: expert.insights.map((i) => i.topic),
  }));
}

/**
 * Get experts filtered by territory relevance.
 */
export function getExpertsByTerritory(territory: string): ExpertInsight[] {
  const results: ExpertInsight[] = [];

  for (const expert of EXPERT_KNOWLEDGE) {
    for (const insight of expert.insights) {
      if (insight.territories.includes(territory.toLowerCase())) {
        results.push({
          speaker: expert.speaker,
          company: expert.company,
          quote: insight.quote,
          topic: insight.topic,
          source: expert.filename,
          relevanceScore: 1,
        });
      }
    }
  }

  return results;
}

/**
 * Get experts filtered by topic keyword.
 */
export function getExpertsByTopic(topic: string): ExpertInsight[] {
  const searchTerm = topic.toLowerCase();
  const results: ExpertInsight[] = [];

  for (const expert of EXPERT_KNOWLEDGE) {
    for (const insight of expert.insights) {
      const matchesTopic = insight.topic.toLowerCase().includes(searchTerm);
      const matchesTags = insight.tags.some((t) => t.includes(searchTerm));

      if (matchesTopic || matchesTags) {
        results.push({
          speaker: expert.speaker,
          company: expert.company,
          quote: insight.quote,
          topic: insight.topic,
          source: expert.filename,
          relevanceScore: matchesTopic ? 2 : 1,
        });
      }
    }
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results;
}

/**
 * Format expert insights for injection into the system prompt.
 */
export function formatExpertInsightsForPrompt(insights: ExpertInsight[]): string {
  if (insights.length === 0) return '';

  const sections: string[] = [];
  sections.push('## Expert Knowledge Available');
  sections.push('');
  sections.push('You have access to insights from world-class product leaders. When relevant, weave these perspectives into your coaching naturally using the citation format [Expert:Speaker — Topic].');
  sections.push('');
  sections.push('**Available Expert Perspectives:**');

  for (const insight of insights) {
    sections.push('');
    sections.push(`### [Expert:${insight.speaker} — ${insight.topic}]`);
    sections.push(`*${insight.speaker}, ${insight.company}*`);
    sections.push(`> "${insight.quote}"`);
  }

  sections.push('');
  sections.push('**Citation Guidelines:**');
  sections.push('- Cite 1-2 expert perspectives per response maximum (do not overwhelm)');
  sections.push('- Weave insights naturally into your coaching guidance');
  sections.push('- Use format: [Expert:Speaker Name — Topic]');
  sections.push('- Connect expert perspectives to the user\'s specific context');
  sections.push('- Do NOT quote the entire passage — paraphrase or extract the key insight');

  return sections.join('\n');
}
