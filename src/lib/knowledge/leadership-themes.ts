/**
 * Leadership Theme Library (UC5)
 *
 * 12 leadership development themes derived from 301 Lenny's Podcast transcripts.
 * Used by the Leadership Playbook Generator to create personalized development plans.
 */

export interface ExpertQuote {
  speaker: string;
  company: string;
  quote: string;
  context: string;
  transcriptRef: string;
}

export interface ActionablePractice {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

export interface RecommendedListening {
  episodeTitle: string;
  speaker: string;
  topic: string;
}

export interface LeadershipTheme {
  id: string;
  title: string;
  description: string;
  relevanceKeywords: string[];
  expertQuotes: ExpertQuote[];
  actionablePractices: ActionablePractice[];
  recommendedListening: RecommendedListening[];
}

const LEADERSHIP_THEMES: LeadershipTheme[] = [
  {
    id: 'theme-team-alignment',
    title: 'Team Alignment',
    description: 'Building shared purpose and direction across teams through clear communication, metaphor-based alignment, and operating principles.',
    relevanceKeywords: ['alignment', 'team', 'communication', 'culture', 'collaboration', 'cross-functional', 'silos'],
    expertQuotes: [
      {
        speaker: 'Kim Scott',
        company: 'Author (Radical Candor)',
        quote: 'Care personally, challenge directly. That is the essence of Radical Candor — and it is the foundation of team alignment.',
        context: 'On building trust as the prerequisite to alignment',
        transcriptRef: 'kim-scott-radical-candor.txt',
      },
      {
        speaker: 'Ami Vora',
        company: 'Faire',
        quote: 'Strategy is not about the plan. It is about shared understanding. When the team deeply understands the why, they can navigate the how independently.',
        context: 'On strategic alignment enabling autonomy',
        transcriptRef: 'ami-vora-strategic-thinking.txt',
      },
      {
        speaker: 'Claire Hughes Johnson',
        company: 'Stripe',
        quote: 'Write down your operating principles. Make them specific enough to actually guide decisions. Then revisit them regularly.',
        context: 'On Stripe\'s approach to organizational alignment',
        transcriptRef: 'claire-hughes-johnson-stripe.txt',
      },
    ],
    actionablePractices: [
      { title: 'Weekly alignment check-in', description: 'Start each week by asking "What is the most important thing we need to accomplish this week, and why?"', frequency: 'weekly' },
      { title: 'Operating principles review', description: 'Document your team\'s decision-making principles and revisit quarterly', frequency: 'quarterly' },
      { title: 'Cross-team storytelling', description: 'Share customer stories across teams to build shared empathy and purpose', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Kim Scott on Radical Candor', speaker: 'Kim Scott', topic: 'Feedback and team trust' },
      { episodeTitle: 'Ami Vora on Strategic Thinking', speaker: 'Ami Vora', topic: 'Strategy as shared understanding' },
      { episodeTitle: 'Claire Hughes Johnson on Scaling Teams', speaker: 'Claire Hughes Johnson', topic: 'Operating principles at Stripe' },
    ],
  },
  {
    id: 'theme-feedback-culture',
    title: 'Feedback Culture',
    description: 'Creating an environment where candid feedback flows freely — up, down, and across the organization.',
    relevanceKeywords: ['feedback', 'candor', 'communication', 'trust', 'psychological safety', 'culture'],
    expertQuotes: [
      {
        speaker: 'Kim Scott',
        company: 'Author (Radical Candor)',
        quote: 'It is not mean, it is clear. The worst thing you can do is be so worried about being nice that you fail to be honest.',
        context: 'On the importance of direct feedback',
        transcriptRef: 'kim-scott-radical-candor.txt',
      },
      {
        speaker: 'Wes Kao',
        company: 'Maven',
        quote: 'Managing up is not political — it is professional. Learn to communicate your ideas in ways that resonate with decision-makers.',
        context: 'On upward feedback and influence',
        transcriptRef: 'wes-kao-managing-up.txt',
      },
      {
        speaker: 'Matt Abrahams',
        company: 'Stanford GSB',
        quote: 'The best communicators are not born — they practice. Structure your message, manage your anxiety, and connect with your audience.',
        context: 'On communication skills as learnable',
        transcriptRef: 'matt-abrahams-communication.txt',
      },
    ],
    actionablePractices: [
      { title: 'Radical Candor practice', description: 'Give one piece of direct feedback each day that is both caring and challenging', frequency: 'daily' },
      { title: 'Feedback retrospective', description: 'Ask your team monthly: "What feedback are we not giving each other?"', frequency: 'monthly' },
      { title: 'Skip-level 1:1s', description: 'Hold skip-level meetings to get unfiltered perspective from your organization', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Kim Scott on Radical Candor', speaker: 'Kim Scott', topic: 'Caring personally while challenging directly' },
      { episodeTitle: 'Wes Kao on Managing Up', speaker: 'Wes Kao', topic: 'Influence without authority' },
    ],
  },
  {
    id: 'theme-scaling-organizations',
    title: 'Scaling Organizations',
    description: 'Navigating hypergrowth, maintaining culture during scaling, and evolving organizational structures.',
    relevanceKeywords: ['scaling', 'growth', 'hiring', 'organization', 'culture', 'hypergrowth', 'process'],
    expertQuotes: [
      {
        speaker: 'Boz (Andrew Bosworth)',
        company: 'Meta',
        quote: 'At scale, the primary job of leadership shifts from making decisions to creating systems that make good decisions.',
        context: 'On leadership evolution during hypergrowth',
        transcriptRef: 'boz-meta-leadership.txt',
      },
      {
        speaker: 'Molly Graham',
        company: 'Lambda School / Facebook',
        quote: 'Give away your Legos. The hardest part of scaling is letting go of the things you used to do well so others can grow.',
        context: 'On delegation and organizational scaling',
        transcriptRef: 'molly-graham-scaling.txt',
      },
      {
        speaker: 'Cameron Adams',
        company: 'Canva',
        quote: 'We grew from 50 to 4000 people. The key was promoting from within — people who understood our culture could scale it better than outsiders.',
        context: 'On homegrown leadership at Canva',
        transcriptRef: 'cameron-adams-canva.txt',
      },
    ],
    actionablePractices: [
      { title: 'Delegation audit', description: 'List everything you do weekly. Identify 3 things someone else should own.', frequency: 'monthly' },
      { title: 'Culture documentation', description: 'Write down the unwritten rules of your team and share them with new hires', frequency: 'quarterly' },
      { title: 'Scaling readiness check', description: 'Ask: "Would this process break if we 3x our team?"', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Boz on Meta Leadership', speaker: 'Andrew Bosworth', topic: 'Leadership at massive scale' },
      { episodeTitle: 'Molly Graham on Giving Away Your Legos', speaker: 'Molly Graham', topic: 'Delegation and growth' },
      { episodeTitle: 'Cameron Adams on Canva', speaker: 'Cameron Adams', topic: 'Scaling culture from 50 to 4000' },
    ],
  },
  {
    id: 'theme-career-navigation',
    title: 'Career Navigation',
    description: 'Building a career in product leadership — managing up, lateral moves, and navigating organizational politics.',
    relevanceKeywords: ['career', 'promotion', 'leadership', 'managing up', 'mentorship', 'growth'],
    expertQuotes: [
      {
        speaker: 'Nikhyl Singhal',
        company: 'Meta / Google',
        quote: 'Your career is not a ladder — it is a jungle gym. Sometimes the best move is sideways, not up.',
        context: 'On non-linear career progression in tech',
        transcriptRef: 'nikhyl-singhal-career.txt',
      },
      {
        speaker: 'Deb Liu',
        company: 'Ancestry',
        quote: 'Build your career at the intersection of what you are great at, what the company needs, and what energizes you.',
        context: 'On strategic career positioning',
        transcriptRef: 'deb-liu-career.txt',
      },
      {
        speaker: 'Julie Zhuo',
        company: 'Meta (former VP Design)',
        quote: 'The transition from manager to senior leader is about moving from managing execution to managing strategy and people systems.',
        context: 'On the shift to senior leadership',
        transcriptRef: 'julie-zhuo-management.txt',
      },
    ],
    actionablePractices: [
      { title: 'Career strategy review', description: 'Map your skills, interests, and organizational needs. Where do they overlap?', frequency: 'quarterly' },
      { title: 'Sponsor identification', description: 'Identify 2-3 senior leaders who can advocate for your work in rooms you are not in', frequency: 'quarterly' },
      { title: 'Learning investment', description: 'Dedicate 2 hours weekly to developing a capability outside your current role', frequency: 'weekly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Nikhyl Singhal on Career Strategy', speaker: 'Nikhyl Singhal', topic: 'Career as a jungle gym' },
      { episodeTitle: 'Deb Liu on Leadership', speaker: 'Deb Liu', topic: 'Building a lasting career' },
    ],
  },
  {
    id: 'theme-product-culture',
    title: 'Product Culture',
    description: 'Building a product-led organization with empowered teams, design thinking, and customer obsession.',
    relevanceKeywords: ['product', 'culture', 'empowerment', 'design', 'innovation', 'product-led'],
    expertQuotes: [
      {
        speaker: 'Marty Cagan',
        company: 'Silicon Valley Product Group',
        quote: 'The best product teams are empowered to solve problems, not just deliver features. There is a massive difference.',
        context: 'On empowered product teams',
        transcriptRef: 'marty-cagan-empowered.txt',
      },
      {
        speaker: 'Ivan Zhao',
        company: 'Notion',
        quote: 'We build tools to augment human intellect. That mission attracts people who care deeply about craft.',
        context: 'On mission-driven product culture',
        transcriptRef: 'ivan-zhao-notion.txt',
      },
      {
        speaker: 'Dylan Field',
        company: 'Figma',
        quote: 'Design is not just how it looks. Design is how the entire organization thinks about solving problems for users.',
        context: 'On design-led culture',
        transcriptRef: 'dylan-field-figma.txt',
      },
    ],
    actionablePractices: [
      { title: 'Problem framing exercise', description: 'Before every initiative, ask: "What problem are we solving and for whom?"', frequency: 'weekly' },
      { title: 'Customer exposure', description: 'Every team member should talk to at least one customer per month', frequency: 'monthly' },
      { title: 'Craft review', description: 'Hold monthly sessions where teams present their work and get peer feedback on craft quality', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Marty Cagan on Empowered Teams', speaker: 'Marty Cagan', topic: 'Empowered vs. feature teams' },
      { episodeTitle: 'Ivan Zhao on Building Notion', speaker: 'Ivan Zhao', topic: 'Augmenting human intellect' },
    ],
  },
  {
    id: 'theme-decision-making',
    title: 'Decision-Making',
    description: 'Making better strategic decisions through frameworks, probabilistic thinking, and structured analysis.',
    relevanceKeywords: ['decision', 'strategy', 'framework', 'analysis', 'prioritization', 'tradeoff'],
    expertQuotes: [
      {
        speaker: 'Annie Duke',
        company: 'Author (Thinking in Bets)',
        quote: 'The quality of your decisions is not determined by the outcome. Focus on the process, not the result.',
        context: 'On decision quality vs. outcome quality',
        transcriptRef: 'annie-duke-decisions.txt',
      },
      {
        speaker: 'Shreyas Doshi',
        company: 'Stripe / Twitter / Yahoo',
        quote: 'Use the LNO framework: categorize tasks as Leverage, Neutral, or Overhead. Spend 80% of energy on Leverage tasks.',
        context: 'On prioritization frameworks',
        transcriptRef: 'shreyas-doshi-frameworks.txt',
      },
      {
        speaker: 'Roger Martin',
        company: 'Author (Playing to Win)',
        quote: 'Strategy is an integrated set of choices that uniquely positions you to create value. It is not a plan — it is a choice.',
        context: 'On strategy as choice-making',
        transcriptRef: 'roger-martin-strategy.txt',
      },
    ],
    actionablePractices: [
      { title: 'Decision journal', description: 'Record key decisions, your reasoning, and expected outcomes. Review quarterly.', frequency: 'weekly' },
      { title: 'Pre-mortem analysis', description: 'Before major decisions, ask: "Imagine this failed — what went wrong?"', frequency: 'monthly' },
      { title: 'LNO categorization', description: 'Start each week by categorizing your tasks as Leverage, Neutral, or Overhead', frequency: 'weekly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Annie Duke on Decision-Making', speaker: 'Annie Duke', topic: 'Thinking in bets' },
      { episodeTitle: 'Shreyas Doshi on Product Frameworks', speaker: 'Shreyas Doshi', topic: 'LNO framework' },
      { episodeTitle: 'Roger Martin on Strategy', speaker: 'Roger Martin', topic: 'Playing to Win' },
    ],
  },
  {
    id: 'theme-growth-mindset',
    title: 'Growth Mindset',
    description: 'Developing a growth-oriented mindset for product strategy — PLG, growth loops, and scaling profitably.',
    relevanceKeywords: ['growth', 'PLG', 'product-led', 'scaling', 'acquisition', 'retention', 'loops'],
    expertQuotes: [
      {
        speaker: 'Elena Verna',
        company: 'Growth Advisor',
        quote: 'Build growth loops, not funnels. Funnels leak. Loops compound. That is the fundamental insight of product-led growth.',
        context: 'On growth loops vs. funnels',
        transcriptRef: 'elena-verna-growth.txt',
      },
      {
        speaker: 'Nan Yu',
        company: 'Linear',
        quote: 'Speed is not about cutting corners — speed is a feature. When your product is fast, everything about the experience improves.',
        context: 'On speed as a growth lever',
        transcriptRef: 'nan-yu-karri-saarinen-linear.txt',
      },
      {
        speaker: 'Grant Lee',
        company: 'Gamma',
        quote: 'We were profitable from day one. Not because we were cheap, but because we built a product people would pay for before we scaled.',
        context: 'On profitable growth',
        transcriptRef: 'grant-lee-gamma.txt',
      },
    ],
    actionablePractices: [
      { title: 'Growth loop mapping', description: 'Map your product\'s primary growth loops and identify where they break down', frequency: 'monthly' },
      { title: 'Activation metric review', description: 'Define and track the moment users first experience your product\'s core value', frequency: 'weekly' },
      { title: 'Unit economics check', description: 'Review CAC, LTV, and payback period monthly to ensure sustainable growth', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Elena Verna on Growth', speaker: 'Elena Verna', topic: 'Growth loops and PLG' },
      { episodeTitle: 'Nan Yu and Karri Saarinen on Linear', speaker: 'Nan Yu', topic: 'Speed as a feature' },
    ],
  },
  {
    id: 'theme-founder-leadership',
    title: 'Founder Leadership',
    description: 'The unique challenges and superpowers of founder-led organizations — staying in the details vs. scaling yourself.',
    relevanceKeywords: ['founder', 'startup', 'leadership', 'vision', 'execution', 'early-stage'],
    expertQuotes: [
      {
        speaker: 'Brian Chesky',
        company: 'Airbnb',
        quote: 'I went back to being in the details. Not micromanaging — but being close enough to the work that I could make better decisions.',
        context: 'On "founder mode" and staying hands-on',
        transcriptRef: 'brian-chesky-airbnb.txt',
      },
      {
        speaker: 'Jen Abel',
        company: 'JJELLYFISH',
        quote: 'Every founder should do their first 10-20 sales calls. You learn what resonates, what objections exist, and whether people will actually pay.',
        context: 'On founder-led sales',
        transcriptRef: 'jen-abel-founder-sales.txt',
      },
      {
        speaker: 'Alisa Cohn',
        company: 'Executive Coach',
        quote: 'The hardest transition for founders is from doing to leading. Your identity was the builder. Now it must become the leader of builders.',
        context: 'On the founder identity transition',
        transcriptRef: 'alisa-cohn-coaching.txt',
      },
    ],
    actionablePractices: [
      { title: 'Founder time audit', description: 'Track where you spend time. Are you on the highest-leverage activities only a founder can do?', frequency: 'weekly' },
      { title: 'Customer immersion', description: 'Spend half a day each month using your product as a customer would', frequency: 'monthly' },
      { title: 'Leadership journal', description: 'Reflect weekly on one moment where you chose to lead vs. do', frequency: 'weekly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Brian Chesky on Founder Mode', speaker: 'Brian Chesky', topic: 'Going back to the details' },
      { episodeTitle: 'Jen Abel on Founder-Led Sales', speaker: 'Jen Abel', topic: 'First 20 sales calls' },
    ],
  },
  {
    id: 'theme-organizational-design',
    title: 'Organizational Design',
    description: 'Structuring engineering and product organizations for effectiveness — team topology, management layers, and DORA metrics.',
    relevanceKeywords: ['organization', 'structure', 'engineering', 'teams', 'process', 'management', 'DORA'],
    expertQuotes: [
      {
        speaker: 'Camille Fournier',
        company: 'Author (The Manager\'s Path)',
        quote: 'Management is not about control — it is about creating the conditions for people to do their best work.',
        context: 'On the purpose of management',
        transcriptRef: 'camille-fournier-management.txt',
      },
      {
        speaker: 'Will Larson',
        company: 'Carta',
        quote: 'Invest in engineering excellence. The teams that move fastest are not the ones that skip quality — they are the ones with the best foundations.',
        context: 'On technical investment',
        transcriptRef: 'will-larson-staff-eng.txt',
      },
      {
        speaker: 'Nicole Forsgren',
        company: 'Author (Accelerate)',
        quote: 'DORA metrics work because they measure capability, not activity. Deployment frequency, lead time, failure rate, recovery time.',
        context: 'On measuring engineering effectiveness',
        transcriptRef: 'nicole-forsgren-dora.txt',
      },
    ],
    actionablePractices: [
      { title: 'Team topology review', description: 'Map your team structures against the work. Are the boundaries in the right places?', frequency: 'quarterly' },
      { title: 'DORA metrics tracking', description: 'Measure and track deployment frequency, lead time, change failure rate, and mean time to recovery', frequency: 'monthly' },
      { title: 'Manager effectiveness survey', description: 'Ask teams: "What does your manager do that helps you most? Least?"', frequency: 'quarterly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Camille Fournier on Management', speaker: 'Camille Fournier', topic: 'The Manager\'s Path' },
      { episodeTitle: 'Will Larson on Staff Engineering', speaker: 'Will Larson', topic: 'Engineering excellence' },
    ],
  },
  {
    id: 'theme-executive-presence',
    title: 'Executive Presence',
    description: 'Developing gravitas, influence, and authority as a senior leader — power dynamics, coaching, and strategic narrative.',
    relevanceKeywords: ['executive', 'presence', 'influence', 'authority', 'power', 'stakeholder', 'board'],
    expertQuotes: [
      {
        speaker: 'Jeffrey Pfeffer',
        company: 'Stanford GSB',
        quote: 'Power is not dirty. Understanding power dynamics is essential for getting things done in organizations.',
        context: 'On organizational power',
        transcriptRef: 'jeffrey-pfeffer-power.txt',
      },
      {
        speaker: 'Graham Weaver',
        company: 'Alpine Investors',
        quote: 'The CEO who asks the best questions wins. Not the one who has all the answers.',
        context: 'On executive leadership through inquiry',
        transcriptRef: 'graham-weaver-ceo.txt',
      },
      {
        speaker: 'Nancy Duarte',
        company: 'Duarte Inc.',
        quote: 'Every great leader is a great storyteller. Your strategy is only as strong as your ability to communicate it.',
        context: 'On strategic communication',
        transcriptRef: 'nancy-duarte-storytelling.txt',
      },
    ],
    actionablePractices: [
      { title: 'Strategic narrative crafting', description: 'Write a 2-minute version of your strategy story. Practice it until it is effortless.', frequency: 'monthly' },
      { title: 'Stakeholder mapping', description: 'Map key stakeholders by influence and interest. Plan engagement for each quadrant.', frequency: 'quarterly' },
      { title: 'Question-first leadership', description: 'In your next 3 meetings, lead with questions instead of answers', frequency: 'weekly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Jeffrey Pfeffer on Power', speaker: 'Jeffrey Pfeffer', topic: 'Power dynamics in organizations' },
      { episodeTitle: 'Graham Weaver on CEO Leadership', speaker: 'Graham Weaver', topic: 'Leadership through inquiry' },
    ],
  },
  {
    id: 'theme-resilience-failure',
    title: 'Resilience & Failure',
    description: 'Building resilience, learning from failure, and developing emotional intelligence as a leader.',
    relevanceKeywords: ['resilience', 'failure', 'emotional', 'burnout', 'stress', 'recovery', 'learning'],
    expertQuotes: [
      {
        speaker: 'Jerry Colonna',
        company: 'Reboot (Executive Coach)',
        quote: 'The inner game of leadership is the most neglected dimension. Your relationship with yourself determines your relationship with everyone else.',
        context: 'On inner work for leaders',
        transcriptRef: 'jerry-colonna-reboot.txt',
      },
      {
        speaker: 'Katie Dill',
        company: 'Stripe (VP Design)',
        quote: 'The best teams I have been on are not the ones that never fail. They are the ones that learn fastest from failure.',
        context: 'On learning from failure',
        transcriptRef: 'katie-dill-design.txt',
      },
    ],
    actionablePractices: [
      { title: 'Failure retrospective', description: 'After setbacks, ask: "What did we learn? What will we do differently?"', frequency: 'monthly' },
      { title: 'Energy management', description: 'Track your energy levels across the week. Protect high-energy time for high-leverage work.', frequency: 'weekly' },
      { title: 'Inner voice check-in', description: 'Spend 10 minutes reflecting: "What am I avoiding? What am I afraid of?"', frequency: 'weekly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Jerry Colonna on Leadership Inner Game', speaker: 'Jerry Colonna', topic: 'The CEO\'s inner voice' },
      { episodeTitle: 'Katie Dill on Design Leadership', speaker: 'Katie Dill', topic: 'Learning from failure' },
    ],
  },
  {
    id: 'theme-customer-obsession',
    title: 'Customer Obsession',
    description: 'Deep customer understanding through Jobs-to-be-Done, continuous discovery, and positioning mastery.',
    relevanceKeywords: ['customer', 'user', 'research', 'discovery', 'JTBD', 'positioning', 'empathy'],
    expertQuotes: [
      {
        speaker: 'Bob Moesta',
        company: 'Author (Demand-Side Sales)',
        quote: 'People do not buy products. They hire them to make progress in their lives. Understand the job, and the product designs itself.',
        context: 'On Jobs-to-be-Done framework',
        transcriptRef: 'bob-moesta-jtbd.txt',
      },
      {
        speaker: 'Teresa Torres',
        company: 'Author (Continuous Discovery Habits)',
        quote: 'Talk to customers every week. Not occasionally, not when you remember — every single week. Make it a habit.',
        context: 'On continuous discovery',
        transcriptRef: 'teresa-torres-discovery.txt',
      },
      {
        speaker: 'April Dunford',
        company: 'Author (Obviously Awesome)',
        quote: 'Positioning is not about what you say about your product. It is about the context you set so customers can understand your value.',
        context: 'On product positioning',
        transcriptRef: 'april-dunford-positioning.txt',
      },
    ],
    actionablePractices: [
      { title: 'Weekly customer interview', description: 'Talk to at least one customer or prospect every week using JTBD questions', frequency: 'weekly' },
      { title: 'Positioning statement review', description: 'Review your positioning: competitive alternatives, unique attributes, value, target customer, market category', frequency: 'quarterly' },
      { title: 'Customer journey audit', description: 'Walk through your product as a new customer. Document every friction point.', frequency: 'monthly' },
    ],
    recommendedListening: [
      { episodeTitle: 'Bob Moesta on Jobs-to-be-Done', speaker: 'Bob Moesta', topic: 'Understanding the job' },
      { episodeTitle: 'Teresa Torres on Continuous Discovery', speaker: 'Teresa Torres', topic: 'Weekly customer habits' },
      { episodeTitle: 'April Dunford on Positioning', speaker: 'April Dunford', topic: 'Obviously Awesome' },
    ],
  },
];

// ============================================================================
// Accessor Functions
// ============================================================================

export function getAllThemes(): LeadershipTheme[] {
  return LEADERSHIP_THEMES;
}

export function getThemeById(id: string): LeadershipTheme | undefined {
  return LEADERSHIP_THEMES.find(t => t.id === id);
}

/**
 * Match themes to user context based on keyword overlap scoring.
 */
export function matchThemesToContext(context: {
  challenges?: string[];
  painPoints?: string;
  industry?: string;
  strategicFocus?: string;
}): LeadershipTheme[] {
  const searchTerms: string[] = [];

  if (context.challenges) searchTerms.push(...context.challenges.map(c => c.toLowerCase()));
  if (context.painPoints) searchTerms.push(...context.painPoints.toLowerCase().split(/\s+/));
  if (context.industry) searchTerms.push(context.industry.toLowerCase());
  if (context.strategicFocus) searchTerms.push(context.strategicFocus.toLowerCase());

  if (searchTerms.length === 0) {
    // Return top 5 general themes
    return LEADERSHIP_THEMES.slice(0, 5);
  }

  const scored = LEADERSHIP_THEMES.map(theme => {
    let score = 0;
    const keywords = theme.relevanceKeywords.map(k => k.toLowerCase());
    for (const term of searchTerms) {
      for (const keyword of keywords) {
        if (term.includes(keyword) || keyword.includes(term)) {
          score += 1;
        }
      }
    }
    return { theme, score };
  });

  scored.sort((a, b) => b.score - a.score);
  // Return top 5, but at least include themes with score > 0
  const relevant = scored.filter(s => s.score > 0).slice(0, 5);
  if (relevant.length < 3) {
    // Pad with top themes
    const ids = new Set(relevant.map(r => r.theme.id));
    for (const s of scored) {
      if (!ids.has(s.theme.id)) {
        relevant.push(s);
        if (relevant.length >= 5) break;
      }
    }
  }
  return relevant.map(s => s.theme);
}

/**
 * Format themes for system prompt injection.
 */
export function formatThemesForPrompt(themes: LeadershipTheme[]): string {
  const lines = ['## Leadership Development Themes\n'];
  for (const theme of themes) {
    lines.push(`### ${theme.title}`);
    lines.push(theme.description);
    lines.push('');
    for (const q of theme.expertQuotes.slice(0, 2)) {
      lines.push(`- **${q.speaker}** (${q.company}): "${q.quote}"`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
