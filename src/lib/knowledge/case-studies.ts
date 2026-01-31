/**
 * Case Study Engine — Interactive Strategy Playbooks (UC3)
 *
 * Curated case studies extracted from 301 Lenny's Podcast transcripts.
 * Each follows: Context → Decision Point → What They Did → Outcome → Lessons
 * Tagged by industry, company stage, challenge type, and phase relevance.
 *
 * Architecture: Static curated data with keyword-based retrieval (no vector DB).
 */

export interface CaseStudy {
  id: string;
  title: string;
  sourceTranscript: string;
  speakerName: string;
  speakerCompany: string;
  speakerRole: string;
  context: string;
  decisionPoint: string;
  actionTaken: string;
  outcome: string;
  lessonsLearned: string;
  fullExcerpt?: string;
  topicTags: string[];
  industryTags: string[];
  companyStageTags: string[];
  challengeTypeTags: string[];
  phaseRelevance: string[];
}

/**
 * Curated case studies from 301 Lenny's Podcast transcripts.
 */
const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-001',
    title: "Mixpanel's Portfolio Refocus",
    sourceTranscript: 'vijay-iyengar-mixpanel.txt',
    speakerName: 'Vijay Iyengar',
    speakerCompany: 'Mixpanel',
    speakerRole: 'Head of Product',
    context: 'Mixpanel had expanded into multiple product lines while their core analytics product was losing market share to competitors like Amplitude.',
    decisionPoint: 'Continue diversifying or refocus on the core product?',
    actionTaken: 'Killed adjacent product initiatives, redirected entire engineering team to core analytics, invested in design-driven rebuild with opinionated defaults.',
    outcome: 'Core product quality improved significantly, churn decreased, competitive position stabilized. Net revenue retention improved markedly.',
    lessonsLearned: 'Expansion without core strength is a trap. When your core is suffering, adding products amplifies the problem rather than solving it. Focus is a strategic weapon.',
    topicTags: ['product-focus', 'portfolio-management', 'competitive-positioning', 'turnaround'],
    industryTags: ['Technology', 'SaaS', 'Analytics'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Product Focus', 'Competitive Response', 'Portfolio Prioritization'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-002',
    title: "Notion's 3-Year Pivot to Product-Market Fit",
    sourceTranscript: 'ivan-zhao-notion.txt',
    speakerName: 'Ivan Zhao',
    speakerCompany: 'Notion',
    speakerRole: 'CEO & Co-founder',
    context: 'Notion spent 3-4 years without clear product-market fit, rebuilding the product multiple times while running out of money.',
    decisionPoint: 'Shut down or keep iterating on the vision of augmenting human intellect?',
    actionTaken: 'Persisted with the horizontal tool-for-thought vision, moved the team to Japan to reduce costs, rebuilt the product from scratch with a focus on flexibility and user empowerment.',
    outcome: 'Eventually found PMF, grew to millions of users and billions in valuation. Became a category-defining tool.',
    lessonsLearned: 'Long-term vision requires financial discipline. Sometimes the market needs to catch up to the product. Conviction must be balanced with adaptability.',
    topicTags: ['product-market-fit', 'persistence', 'vision', 'cost-management', 'product-craft'],
    industryTags: ['Technology', 'SaaS', 'Productivity'],
    companyStageTags: ['Startup', 'Early-Stage'],
    challengeTypeTags: ['Product-Market Fit', 'Survival', 'Vision Persistence'],
    phaseRelevance: ['discovery', 'research', 'bets'],
  },
  {
    id: 'cs-003',
    title: "Gamma's Profitable AI-First Growth",
    sourceTranscript: 'grant-lee-gamma.txt',
    speakerName: 'Grant Lee',
    speakerCompany: 'Gamma',
    speakerRole: 'CEO & Co-founder',
    context: 'Gamma launched as an AI-powered presentation tool in a market dominated by established players, with limited funding.',
    decisionPoint: 'Pursue VC-funded growth or build profitably from day one?',
    actionTaken: 'Focused on onboarding magic (immediate value in first session), used micro-influencer distribution instead of paid acquisition, maintained profitability throughout.',
    outcome: 'Grew rapidly with sustainable unit economics, avoided the "AI wrapper" stigma. Reached millions of users profitably.',
    lessonsLearned: 'Profitability is a strategic advantage, not a constraint. Onboarding experience is the highest-leverage investment for PLG companies. Let the product do the selling.',
    topicTags: ['PLG', 'profitability', 'onboarding', 'AI-native', 'distribution'],
    industryTags: ['Technology', 'SaaS', 'AI'],
    companyStageTags: ['Startup', 'Growth'],
    challengeTypeTags: ['Go-to-Market', 'Growth Strategy', 'Unit Economics'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-004',
    title: "Linear's Opinionated Product Design",
    sourceTranscript: 'nan-yu-karri-saarinen-linear.txt',
    speakerName: 'Nan Yu',
    speakerCompany: 'Linear',
    speakerRole: 'Head of Product',
    context: 'Linear entered a crowded project management space dominated by Jira. They had to differentiate without more features.',
    decisionPoint: 'Build a flexible tool like competitors or take an opinionated, speed-first approach?',
    actionTaken: 'Built an extremely fast, keyboard-first tool with opinionated workflows. Refused feature requests that would add complexity. Small team, high craft.',
    outcome: 'Became the default tool for high-performing engineering teams. Premium positioning with strong word-of-mouth growth.',
    lessonsLearned: 'Speed is a feature. Opinionated design beats flexible design when targeting power users. Say no to most things — what you refuse to build defines your product.',
    topicTags: ['product-craft', 'speed', 'opinionated-design', 'differentiation', 'focus'],
    industryTags: ['Technology', 'SaaS', 'Developer Tools'],
    companyStageTags: ['Startup', 'Growth'],
    challengeTypeTags: ['Competitive Differentiation', 'Product Craft', 'Focus'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-005',
    title: "Superhuman's PMF Engine",
    sourceTranscript: 'rahul-vohra-superhuman.txt',
    speakerName: 'Rahul Vohra',
    speakerCompany: 'Superhuman',
    speakerRole: 'CEO & Founder',
    context: 'Superhuman needed a systematic way to measure and improve product-market fit before scaling.',
    decisionPoint: 'How do you know when you have PMF, and how do you systematically improve it?',
    actionTaken: 'Developed the PMF survey method: "How would you feel if you could no longer use the product?" Segmented users, focused on the "very disappointed" group, built only for them.',
    outcome: 'Created a repeatable PMF measurement framework. Reached strong PMF before scaling, avoiding premature growth.',
    lessonsLearned: 'PMF is measurable, not just a feeling. Focus on your most passionate users, not the average. Segmentation is the key to finding your beachhead.',
    topicTags: ['product-market-fit', 'measurement', 'segmentation', 'focus', 'PMF-survey'],
    industryTags: ['Technology', 'SaaS', 'Email'],
    companyStageTags: ['Startup', 'Early-Stage'],
    challengeTypeTags: ['Product-Market Fit', 'Measurement', 'User Segmentation'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-006',
    title: "Figma's Bottom-Up Enterprise Strategy",
    sourceTranscript: 'dylan-field-figma.txt',
    speakerName: 'Dylan Field',
    speakerCompany: 'Figma',
    speakerRole: 'CEO & Co-founder',
    context: 'Figma was a browser-based design tool competing against the incumbent Sketch (native Mac app) and eventually Adobe.',
    decisionPoint: 'Pursue top-down enterprise sales or bottom-up adoption?',
    actionTaken: 'Built for collaboration first (multiplayer editing), offered generous free tier, let designers pull Figma into organizations. Product virality through shared links.',
    outcome: 'Dominated the design tool market. $20B acquisition offer from Adobe. Became the collaboration standard.',
    lessonsLearned: 'Collaboration is the ultimate distribution strategy. Free tiers that demonstrate value create unstoppable bottom-up adoption. The browser is the platform.',
    topicTags: ['PLG', 'collaboration', 'bottom-up-adoption', 'freemium', 'platform'],
    industryTags: ['Technology', 'SaaS', 'Design Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Go-to-Market', 'Competitive Differentiation', 'Distribution'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-007',
    title: "Airbnb's Design-Led Recovery",
    sourceTranscript: 'brian-chesky-airbnb.txt',
    speakerName: 'Brian Chesky',
    speakerCompany: 'Airbnb',
    speakerRole: 'CEO & Co-founder',
    context: 'During COVID-19, Airbnb lost 80% of revenue in 8 weeks. The business was existentially threatened.',
    decisionPoint: 'Cut everything and survive, or use the crisis to fundamentally rethink the product and organization?',
    actionTaken: 'Laid off 25% of staff with extreme care and generosity. Reorganized from a divisional structure to a functional one with CEO as chief product officer. Returned to founder-led, design-driven product development.',
    outcome: 'Launched the most successful product release in company history. Stock price recovered and exceeded pre-COVID levels. Became profitable.',
    lessonsLearned: 'Crisis creates permission to make changes that would be politically impossible in normal times. Functional organization with strong creative leadership can outperform divisional structures. Founders should stay close to the product.',
    topicTags: ['turnaround', 'org-design', 'founder-led', 'design-thinking', 'crisis-management'],
    industryTags: ['Technology', 'Marketplace', 'Travel'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Turnaround', 'Organizational Design', 'Crisis Response'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-008',
    title: "Stripe's API-First Platform Play",
    sourceTranscript: 'patrick-collison-stripe.txt',
    speakerName: 'Patrick Collison',
    speakerCompany: 'Stripe',
    speakerRole: 'CEO & Co-founder',
    context: 'Online payments were dominated by PayPal and traditional processors. Developer experience was terrible across the board.',
    decisionPoint: 'Build another payment processor or fundamentally rethink the developer experience of accepting payments?',
    actionTaken: 'Made the API so simple that developers could integrate payments in minutes. Invested heavily in documentation. Built for developers first, businesses second.',
    outcome: 'Became the default payments infrastructure for the internet. Valued at $95B+. Expanded into lending, treasury, and identity.',
    lessonsLearned: 'Developer experience is a defensible moat. Making hard things simple creates enormous value. Platform companies win by reducing friction for their ecosystem.',
    topicTags: ['developer-experience', 'platform', 'API-first', 'simplicity', 'ecosystem'],
    industryTags: ['Technology', 'Fintech', 'Payments'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Platform Strategy', 'Developer Experience', 'Competitive Differentiation'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-009',
    title: "Canva's Democratization Strategy",
    sourceTranscript: 'cameron-adams-canva.txt',
    speakerName: 'Cameron Adams',
    speakerCompany: 'Canva',
    speakerRole: 'Co-founder & CPO',
    context: 'Design tools were complex and expensive, accessible only to trained designers. Canva wanted to make design accessible to everyone.',
    decisionPoint: 'Build for professional designers (small market, high competition) or non-designers (huge market, different expectations)?',
    actionTaken: 'Built a browser-based tool with templates, drag-and-drop, and AI-assisted design. Focused on the 99% of people who need to create visual content but are not designers.',
    outcome: 'Grew to 170M+ monthly active users. Became profitable. Expanded into enterprise with Canva for Teams.',
    lessonsLearned: 'The biggest opportunities are often in democratizing tools previously reserved for specialists. Templates and constraints enable creativity more than blank canvases. Scale requires serving multiple segments simultaneously.',
    topicTags: ['democratization', 'templates', 'PLG', 'market-expansion', 'simplicity'],
    industryTags: ['Technology', 'SaaS', 'Design Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Market Expansion', 'Product Strategy', 'Democratization'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-010',
    title: "Shopify's Merchant-First Evolution",
    sourceTranscript: 'tobi-lutke-shopify.txt',
    speakerName: 'Tobi Lütke',
    speakerCompany: 'Shopify',
    speakerRole: 'CEO & Founder',
    context: 'Shopify started as a simple e-commerce tool and needed to evolve into a comprehensive platform without losing its simplicity.',
    decisionPoint: 'Build everything merchants need in-house, or create a platform for third-party developers?',
    actionTaken: 'Built the Shopify App Store and partner ecosystem. Kept the core simple while enabling infinite extensibility through apps and themes. Invested in developer tools.',
    outcome: 'Created a $1B+ app ecosystem. Merchants can customize endlessly while the core remains accessible to beginners.',
    lessonsLearned: 'Platform economics beat product economics at scale. Keep the core simple and let the ecosystem handle complexity. Invest in your partners — their success is your success.',
    topicTags: ['platform', 'ecosystem', 'simplicity', 'partner-strategy', 'extensibility'],
    industryTags: ['Technology', 'E-commerce', 'SaaS'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Platform Strategy', 'Ecosystem Development', 'Scaling'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-011',
    title: "Spotify's Squad Model and Beyond",
    sourceTranscript: 'gustav-soderstrom-spotify.txt',
    speakerName: 'Gustav Söderström',
    speakerCompany: 'Spotify',
    speakerRole: 'Co-President & CPO',
    context: 'Spotify popularized the "squad model" for autonomous team organization but found it created coordination problems at scale.',
    decisionPoint: 'Double down on full autonomy or introduce more structure and alignment mechanisms?',
    actionTaken: 'Evolved beyond pure squads to include "bets" — larger strategic initiatives that require cross-team coordination. Introduced deliberate planning rhythms and shared metrics.',
    outcome: 'Better strategic alignment while preserving team autonomy. Shipped larger, more impactful features. Improved time-to-market for strategic initiatives.',
    lessonsLearned: 'Full autonomy does not scale. Teams need both autonomy AND alignment. The squad model was a starting point, not a destination. Strategic bets require deliberate coordination.',
    topicTags: ['org-design', 'autonomy', 'alignment', 'squad-model', 'scaling'],
    industryTags: ['Technology', 'Media', 'Entertainment'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Organizational Design', 'Team Structure', 'Scaling'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-012',
    title: "Loom's Pivot from Live to Async Video",
    sourceTranscript: 'joe-thomas-loom.txt',
    speakerName: 'Joe Thomas',
    speakerCompany: 'Loom',
    speakerRole: 'CEO & Co-founder',
    context: 'Loom initially tried to build a live video collaboration tool but struggled to find traction in a crowded market.',
    decisionPoint: 'Persist with live video or pivot to asynchronous video messaging?',
    actionTaken: 'Pivoted to async video — simple screen recording with instant sharing. Removed complexity, focused on the "quick video message" use case.',
    outcome: 'Found strong PMF in async video. Grew rapidly during COVID remote work shift. Acquired by Atlassian for $975M.',
    lessonsLearned: 'Pivots work when you listen to how users actually use your product vs. how you intended. Async beats sync for many workflows. Simplicity in a complex space is a superpower.',
    topicTags: ['pivot', 'async-communication', 'simplicity', 'PMF', 'remote-work'],
    industryTags: ['Technology', 'SaaS', 'Communication'],
    companyStageTags: ['Startup', 'Growth'],
    challengeTypeTags: ['Pivot', 'Product-Market Fit', 'Focus'],
    phaseRelevance: ['discovery', 'research', 'bets'],
  },
  {
    id: 'cs-013',
    title: "Vercel's Developer-First Cloud Platform",
    sourceTranscript: 'guillermo-rauch-vercel.txt',
    speakerName: 'Guillermo Rauch',
    speakerCompany: 'Vercel',
    speakerRole: 'CEO & Founder',
    context: 'Cloud deployment was complex, slow, and developer-hostile. Vercel (formerly ZEIT) wanted to make deploying web applications instant.',
    decisionPoint: 'Build a general-purpose cloud or focus exclusively on frontend developer experience?',
    actionTaken: 'Created Next.js as the open-source framework and Vercel as the optimized hosting platform. Invested in the framework first, then monetized the deployment layer.',
    outcome: 'Next.js became the most popular React framework. Vercel grew to $2.5B+ valuation. Created a powerful open-source-to-commercial pipeline.',
    lessonsLearned: 'Open source creates distribution and trust. Framework + platform is a powerful combination. Developer experience compounds — once developers learn your tools, switching costs are high.',
    topicTags: ['open-source', 'developer-experience', 'platform', 'framework', 'distribution'],
    industryTags: ['Technology', 'Cloud', 'Developer Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Platform Strategy', 'Open Source', 'Go-to-Market'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-014',
    title: "Duolingo's Gamification Mastery",
    sourceTranscript: 'jorge-mazal-duolingo.txt',
    speakerName: 'Jorge Mazal',
    speakerCompany: 'Duolingo',
    speakerRole: 'Former Head of Product',
    context: 'Language learning apps had high initial downloads but terrible retention. Most users quit within the first week.',
    decisionPoint: 'Focus on educational quality or engagement mechanics?',
    actionTaken: 'Invested heavily in gamification: streaks, leaderboards, hearts system, notifications tuned to re-engage at the right moment. Treated retention as the #1 metric.',
    outcome: 'Became the most downloaded education app globally. DAU/MAU ratio rivals social media apps. Successful IPO.',
    lessonsLearned: 'Retention is the only metric that matters for consumer products. Gamification works when it serves the core value proposition. Streaks are the most powerful retention mechanic ever invented.',
    topicTags: ['retention', 'gamification', 'engagement', 'consumer', 'growth-loops'],
    industryTags: ['Technology', 'Education', 'Consumer'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Retention', 'Growth Strategy', 'Engagement'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-015',
    title: "Slack's Enterprise Transformation",
    sourceTranscript: 'noah-desai-weiss-slack.txt',
    speakerName: 'Noah Desai Weiss',
    speakerCompany: 'Slack',
    speakerRole: 'Chief Product Officer',
    context: 'Slack grew rapidly through bottom-up adoption but needed to become enterprise-ready to compete with Microsoft Teams.',
    decisionPoint: 'Stay focused on the beloved SMB/startup product or invest in enterprise features that might dilute the experience?',
    actionTaken: 'Built enterprise features (admin controls, compliance, SSO) while maintaining the consumer-grade UX. Created Slack Connect for cross-organization messaging. Invested in platform ecosystem.',
    outcome: 'Successfully moved upmarket. Enterprise revenue grew significantly. Acquired by Salesforce for $27.7B.',
    lessonsLearned: 'Moving upmarket requires adding enterprise features without losing the soul of the product. Cross-org connectivity (Slack Connect) created a new growth vector. Platform ecosystem is critical for enterprise stickiness.',
    topicTags: ['enterprise', 'upmarket', 'PLG-to-sales', 'platform', 'compliance'],
    industryTags: ['Technology', 'SaaS', 'Communication'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Market Expansion', 'Enterprise Transformation', 'Platform Strategy'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-016',
    title: "Reforge's Unbundled Education Model",
    sourceTranscript: 'brian-balfour-reforge.txt',
    speakerName: 'Brian Balfour',
    speakerCompany: 'Reforge',
    speakerRole: 'CEO & Co-founder',
    context: 'Traditional business education (MBA) was expensive, slow, and disconnected from real practitioner knowledge.',
    decisionPoint: 'Build a traditional course platform or create something fundamentally different?',
    actionTaken: 'Built cohort-based programs taught by active practitioners. Created frameworks (growth loops, retention curves) that became industry standard. Focused on peer learning.',
    outcome: 'Became the go-to professional development platform for growth and product professionals. Strong retention and word-of-mouth.',
    lessonsLearned: 'Practitioner knowledge > academic knowledge for applied fields. Cohort-based learning creates accountability and network effects. Frameworks that practitioners actually use become distribution channels.',
    topicTags: ['education', 'growth-loops', 'cohort-learning', 'frameworks', 'practitioner-knowledge'],
    industryTags: ['Technology', 'Education', 'Professional Development'],
    companyStageTags: ['Startup', 'Growth'],
    challengeTypeTags: ['Business Model', 'Product Strategy', 'Community'],
    phaseRelevance: ['discovery', 'research', 'bets'],
  },
  {
    id: 'cs-017',
    title: "TikTok's Algorithm-First Distribution",
    sourceTranscript: 'eugene-wei-tiktok.txt',
    speakerName: 'Eugene Wei',
    speakerCompany: 'Independent',
    speakerRole: 'Former Amazon/Oculus Product Leader',
    context: 'Social media was dominated by social graph-based distribution (Facebook, Instagram, Twitter). New entrants struggled to compete.',
    decisionPoint: 'Build another social graph or invent a new distribution mechanism?',
    actionTaken: 'TikTok used an interest graph instead of social graph. The For You Page algorithm surfaces content based on what you engage with, not who you follow. Removed the cold-start problem for creators.',
    outcome: 'Fastest-growing app in history. Disrupted incumbent social networks. Forced Instagram and YouTube to copy the format.',
    lessonsLearned: 'Interest graphs > social graphs for content discovery. Removing the follower requirement democratizes creation. Algorithm-first distribution enables newcomers to go viral immediately.',
    topicTags: ['algorithm', 'distribution', 'content-discovery', 'social-media', 'growth'],
    industryTags: ['Technology', 'Social Media', 'Consumer'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Competitive Disruption', 'Distribution', 'Growth Strategy'],
    phaseRelevance: ['research', 'synthesis'],
  },
  {
    id: 'cs-018',
    title: "Basecamp's Intentional Smallness",
    sourceTranscript: 'jason-fried-basecamp.txt',
    speakerName: 'Jason Fried',
    speakerCompany: 'Basecamp',
    speakerRole: 'CEO & Co-founder',
    context: 'Basecamp competed in project management against well-funded, fast-growing competitors like Asana, Monday, and Notion.',
    decisionPoint: 'Raise venture capital and scale aggressively, or stay small, profitable, and opinionated?',
    actionTaken: 'Stayed bootstrapped and profitable. Kept the team under 80 people. Refused to build features that would bloat the product. Launched HEY email as a second product.',
    outcome: 'Remained profitable for 20+ years. Built a loyal user base. Became a thought leader for calm, profitable software companies.',
    lessonsLearned: 'Not every company needs to be a unicorn. Profitability gives you freedom from external pressure. Small teams can build remarkable products by saying no.',
    topicTags: ['bootstrapping', 'profitability', 'focus', 'calm-company', 'intentional-growth'],
    industryTags: ['Technology', 'SaaS', 'Productivity'],
    companyStageTags: ['Growth', 'Mature'],
    challengeTypeTags: ['Business Model', 'Company Culture', 'Focus'],
    phaseRelevance: ['discovery', 'synthesis', 'bets'],
  },
  {
    id: 'cs-019',
    title: "Stripe's Culture of Writing",
    sourceTranscript: 'claire-hughes-johnson-stripe.txt',
    speakerName: 'Claire Hughes Johnson',
    speakerCompany: 'Stripe',
    speakerRole: 'Former COO',
    context: 'As Stripe scaled from hundreds to thousands of employees, decision-making quality and speed started to degrade.',
    decisionPoint: 'Add more meetings and review layers, or invest in asynchronous decision-making processes?',
    actionTaken: 'Institutionalized a writing culture — major decisions required written memos. Created operating principles and decision-making frameworks. Invested in onboarding to transmit culture.',
    outcome: 'Maintained high decision-making quality at scale. New hires onboarded faster. Reduced meeting overhead while improving strategic alignment.',
    lessonsLearned: 'Writing forces clarity of thought. Culture must be actively transmitted, not passively absorbed. Onboarding is the highest-leverage cultural investment at scale.',
    topicTags: ['culture', 'writing', 'decision-making', 'scaling', 'onboarding'],
    industryTags: ['Technology', 'Fintech', 'SaaS'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Organizational Design', 'Culture', 'Scaling'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-020',
    title: "Amplitude's Product-Led Sales Motion",
    sourceTranscript: 'spenser-skates-amplitude.txt',
    speakerName: 'Spenser Skates',
    speakerCompany: 'Amplitude',
    speakerRole: 'CEO & Co-founder',
    context: 'Amplitude grew through PLG but needed to close larger enterprise deals to compete with Adobe Analytics and Mixpanel.',
    decisionPoint: 'Add a top-down sales team or enhance the product to sell itself?',
    actionTaken: 'Built product-led sales: used product usage data to identify expansion opportunities, created in-app upgrade prompts, and trained sales reps to reference product data in conversations.',
    outcome: 'Successfully combined PLG and sales-led motions. Enterprise ACV increased significantly. IPO with strong growth metrics.',
    lessonsLearned: 'PLG and sales are not opposing motions — they compound each other. Product usage data is the best sales intelligence. Enterprise deals still need human relationships but should start with product value.',
    topicTags: ['PLG', 'product-led-sales', 'enterprise', 'growth-motion', 'expansion'],
    industryTags: ['Technology', 'SaaS', 'Analytics'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Go-to-Market', 'Sales Strategy', 'Market Expansion'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-021',
    title: "Meta's Organizational Flattening",
    sourceTranscript: 'boz-andrew-bosworth-meta.txt',
    speakerName: 'Andrew Bosworth',
    speakerCompany: 'Meta',
    speakerRole: 'CTO',
    context: 'Meta had grown to tens of thousands of employees with deep management hierarchies that slowed decision-making.',
    decisionPoint: 'Accept organizational complexity as inevitable, or actively flatten the structure?',
    actionTaken: 'Removed management layers, increased span of control for remaining managers, pushed decision-making authority down. Created clear ownership models for product areas.',
    outcome: 'Faster decision-making. Reduced coordination overhead. Individual contributors had more direct impact.',
    lessonsLearned: 'Management layers are a tax on decision speed. Wide spans of control force managers to delegate rather than micromanage. Clarity of ownership matters more than hierarchy.',
    topicTags: ['org-design', 'flattening', 'decision-speed', 'management', 'ownership'],
    industryTags: ['Technology', 'Social Media', 'Consumer'],
    companyStageTags: ['Enterprise'],
    challengeTypeTags: ['Organizational Design', 'Decision Speed', 'Scaling'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-022',
    title: "Elena Verna's Growth Framework",
    sourceTranscript: 'elena-verna-growth.txt',
    speakerName: 'Elena Verna',
    speakerCompany: 'Independent (Advisor)',
    speakerRole: 'Growth Advisor',
    context: 'Many B2B SaaS companies struggle to grow beyond their initial customer base because they treat growth as a marketing function rather than a product function.',
    decisionPoint: 'Build a traditional marketing-led growth engine or embed growth into the product?',
    actionTaken: 'Advocated and implemented product-led growth across multiple companies. Created frameworks for self-serve onboarding, activation metrics, and growth loops that compound.',
    outcome: 'Companies that adopted PLG frameworks saw 2-3x improvement in activation rates and lower CAC.',
    lessonsLearned: 'Growth is a product discipline, not a marketing discipline. Activation is the most underinvested metric. Build growth loops, not funnels — loops compound while funnels leak.',
    topicTags: ['PLG', 'activation', 'growth-loops', 'self-serve', 'metrics'],
    industryTags: ['Technology', 'SaaS'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Growth Strategy', 'Activation', 'Product-Led Growth'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-023',
    title: "Hila Qu's Activation Playbook",
    sourceTranscript: 'hila-qu-growth.txt',
    speakerName: 'Hila Qu',
    speakerCompany: 'GitLab (former)',
    speakerRole: 'VP of Growth',
    context: 'B2B products often lose 60-80% of signups before they reach the "aha moment." Traditional onboarding tutorials were not solving the problem.',
    decisionPoint: 'Invest in more onboarding content or redesign the activation experience entirely?',
    actionTaken: 'Mapped the "aha moment" for each user segment. Reduced time-to-value by removing unnecessary steps. Created personalized onboarding paths based on user intent signals.',
    outcome: 'Significantly improved activation rates. Reduced time-to-value by 40%. Higher downstream retention and conversion.',
    lessonsLearned: 'The "aha moment" is different for each user segment. Remove steps instead of adding tutorials. Personalization in onboarding is the highest-ROI growth investment.',
    topicTags: ['activation', 'onboarding', 'time-to-value', 'personalization', 'retention'],
    industryTags: ['Technology', 'SaaS', 'Developer Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Activation', 'Onboarding', 'Growth Strategy'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-024',
    title: "Ramp's Speed-to-Value Advantage",
    sourceTranscript: 'karim-atiyeh-ramp.txt',
    speakerName: 'Karim Atiyeh',
    speakerCompany: 'Ramp',
    speakerRole: 'CTO & Co-founder',
    context: 'Corporate expense management was slow, painful, and dominated by Brex and legacy players. Implementation took weeks.',
    decisionPoint: 'Match competitors feature-for-feature, or compete on speed and simplicity?',
    actionTaken: 'Built for instant setup — customers could start using Ramp the same day. Focused on automatic expense categorization and spend visibility. Speed was the primary competitive differentiator.',
    outcome: 'Fastest-growing corporate card company. Overtook Brex in market share. Valued at $8B+.',
    lessonsLearned: 'Implementation speed is an underestimated competitive advantage. When switching costs are high, reducing them is a strategy. Automation beats configuration.',
    topicTags: ['speed', 'implementation', 'simplicity', 'competitive-advantage', 'automation'],
    industryTags: ['Fintech', 'SaaS', 'Enterprise'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Competitive Differentiation', 'Speed', 'Product Strategy'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-025',
    title: "Notion's Template Ecosystem",
    sourceTranscript: 'ivan-zhao-notion-templates.txt',
    speakerName: 'Ivan Zhao',
    speakerCompany: 'Notion',
    speakerRole: 'CEO & Co-founder',
    context: 'Notion was powerful but had a steep learning curve. New users often stared at a blank page and gave up.',
    decisionPoint: 'Simplify the product (reduce power) or create scaffolding to help users get started?',
    actionTaken: 'Built a template gallery with thousands of community-created templates. Templates served as both onboarding and distribution (shared templates brought new users).',
    outcome: 'Templates became the primary activation mechanism. Template creators became evangelists. Reduced time-to-value significantly.',
    lessonsLearned: 'Templates solve the blank page problem without reducing product power. User-generated templates are both activation tools and distribution channels. Community-created content scales better than company-created content.',
    topicTags: ['templates', 'activation', 'community', 'distribution', 'user-generated-content'],
    industryTags: ['Technology', 'SaaS', 'Productivity'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Activation', 'Distribution', 'Community'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-026',
    title: "Molly Graham's Scaling Leadership",
    sourceTranscript: 'molly-graham-scaling.txt',
    speakerName: 'Molly Graham',
    speakerCompany: 'Lambda School (former)',
    speakerRole: 'COO (ex-Google, ex-Facebook)',
    context: 'High-growth startups frequently promote top performers into management roles they are not prepared for, creating organizational dysfunction.',
    decisionPoint: 'Keep promoting top ICs into management, or build deliberate leadership development?',
    actionTaken: 'Created the "give away your Legos" framework — at each growth stage, leaders must give away responsibilities they previously owned. Built management training into the scaling process.',
    outcome: 'Teams scaled more effectively. Reduced management burnout. Created a culture where delegation was expected, not resisted.',
    lessonsLearned: 'What got you here will not get you there. Leaders must continually give away responsibilities to grow. The emotional difficulty of letting go is the biggest barrier to scaling.',
    topicTags: ['leadership', 'scaling', 'delegation', 'management', 'culture'],
    industryTags: ['Technology', 'Education'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Leadership Development', 'Scaling', 'Organizational Design'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-027',
    title: "Wiz's Rapid Enterprise Growth",
    sourceTranscript: 'assaf-rappaport-wiz.txt',
    speakerName: 'Assaf Rappaport',
    speakerCompany: 'Wiz',
    speakerRole: 'CEO & Co-founder',
    context: 'Cloud security was fragmented across dozens of point solutions. Enterprises were overwhelmed with tool sprawl.',
    decisionPoint: 'Build another point solution or create a unified cloud security platform?',
    actionTaken: 'Built an agentless platform that connected to cloud environments in minutes. Focused on immediate time-to-value and a graph-based approach to visualize security posture.',
    outcome: 'Fastest SaaS company to $100M ARR. Rejected Google acquisition offer. Reached $1B ARR in record time.',
    lessonsLearned: 'Platform consolidation plays win when tool sprawl causes pain. Agentless deployment removes the biggest barrier to enterprise adoption. Speed to value beats feature completeness.',
    topicTags: ['enterprise', 'platform-consolidation', 'speed', 'cloud-security', 'time-to-value'],
    industryTags: ['Technology', 'Security', 'Cloud'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Go-to-Market', 'Platform Strategy', 'Enterprise'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-028',
    title: "Coda's Horizontal-to-Vertical Shift",
    sourceTranscript: 'shishir-mehrotra-coda.txt',
    speakerName: 'Shishir Mehrotra',
    speakerCompany: 'Coda',
    speakerRole: 'CEO & Co-founder',
    context: 'Coda started as a horizontal document/spreadsheet tool competing with Google Docs and Notion. Growth was steady but not explosive.',
    decisionPoint: 'Continue as a horizontal tool or focus on specific vertical use cases?',
    actionTaken: 'Identified that the most successful Coda docs solved specific workflow problems (OKR tracking, meeting notes, project management). Created "packs" and vertical solutions targeting these use cases.',
    outcome: 'Improved activation rates in targeted verticals. Created clearer value proposition for specific buyer personas.',
    lessonsLearned: 'Horizontal tools need vertical entry points. Users do not buy flexibility — they buy solutions to specific problems. The path from horizontal to vertical is through identifying your best use cases.',
    topicTags: ['horizontal-to-vertical', 'use-cases', 'positioning', 'activation', 'focus'],
    industryTags: ['Technology', 'SaaS', 'Productivity'],
    companyStageTags: ['Growth'],
    challengeTypeTags: ['Product Strategy', 'Positioning', 'Focus'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-029',
    title: "dbt Labs' Community-Led Growth",
    sourceTranscript: 'tristan-handy-dbt.txt',
    speakerName: 'Tristan Handy',
    speakerCompany: 'dbt Labs',
    speakerRole: 'CEO & Founder',
    context: 'dbt was an open-source tool for data transformation. The company needed to build a commercial business around the open-source community.',
    decisionPoint: 'Gate features behind a paywall or keep the core free and monetize cloud hosting?',
    actionTaken: 'Kept dbt Core fully open source. Built dbt Cloud as the commercial product with collaboration, scheduling, and IDE features. Invested heavily in community (40K+ Slack members).',
    outcome: 'Community became the primary distribution channel. dbt Cloud grew to $100M+ ARR. Category-defining brand.',
    lessonsLearned: 'Open source communities are the most powerful distribution moat. Monetize the workflow, not the tool. Community investment has compounding returns.',
    topicTags: ['open-source', 'community', 'monetization', 'developer-tools', 'distribution'],
    industryTags: ['Technology', 'Data', 'Developer Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Business Model', 'Community', 'Open Source'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-030',
    title: "Miro's Whiteboard Category Creation",
    sourceTranscript: 'andrey-khusid-miro.txt',
    speakerName: 'Andrey Khusid',
    speakerCompany: 'Miro',
    speakerRole: 'CEO & Co-founder',
    context: 'Before COVID, digital whiteboards were a niche tool. Miro needed to convince teams they needed a collaboration surface they did not know they needed.',
    decisionPoint: 'Target a specific use case (design sprints) or build a general-purpose collaboration canvas?',
    actionTaken: 'Started with design sprint templates to establish a beachhead. Then expanded to general collaboration. COVID accelerated adoption as remote teams needed shared visual spaces.',
    outcome: 'Grew from 5M to 60M+ users. Became the default visual collaboration tool for distributed teams.',
    lessonsLearned: 'Category creation requires a beachhead use case. Templates lower adoption barriers. External shocks (COVID) can accelerate category adoption by years. Timing matters.',
    topicTags: ['category-creation', 'collaboration', 'templates', 'beachhead', 'timing'],
    industryTags: ['Technology', 'SaaS', 'Collaboration'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Category Creation', 'Go-to-Market', 'Distribution'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-031',
    title: "Datadog's Multi-Product Expansion",
    sourceTranscript: 'olivier-pomel-datadog.txt',
    speakerName: 'Olivier Pomel',
    speakerCompany: 'Datadog',
    speakerRole: 'CEO & Co-founder',
    context: 'Datadog dominated infrastructure monitoring but faced pressure from point solutions in logging, APM, and security.',
    decisionPoint: 'Stay focused on infrastructure monitoring or expand into an observability platform?',
    actionTaken: 'Systematically expanded into logging, APM, security, and CI/CD — all on a unified platform. Each new product cross-sold to the existing customer base.',
    outcome: 'Revenue grew from $100M to $2B+. Net revenue retention exceeded 130%. Became the observability standard.',
    lessonsLearned: 'Multi-product expansion works when products share the same buyer and data substrate. Cross-sell into existing customers is more efficient than new customer acquisition. Unified platforms beat best-of-breed over time.',
    topicTags: ['multi-product', 'platform', 'cross-sell', 'expansion', 'NRR'],
    industryTags: ['Technology', 'Cloud', 'DevOps'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Platform Strategy', 'Product Expansion', 'Revenue Growth'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-032',
    title: "Plaid's API Marketplace Evolution",
    sourceTranscript: 'zach-perret-plaid.txt',
    speakerName: 'Zach Perret',
    speakerCompany: 'Plaid',
    speakerRole: 'CEO & Co-founder',
    context: 'Plaid started as a simple bank account linking API. The fintech ecosystem was growing rapidly and needed more than basic connectivity.',
    decisionPoint: 'Stay as a linking API or evolve into a financial data platform?',
    actionTaken: 'Expanded from account linking to identity verification, transactions enrichment, and payment initiation. Built products that served the fintech ecosystem end-to-end.',
    outcome: 'Connected to 12,000+ financial institutions. Powered virtually every major fintech app. Platform revenue diversified beyond linking.',
    lessonsLearned: 'Infrastructure companies grow by expanding the surface area of their API. Once you own the connection, you can add layers of value. Network effects in infrastructure are winner-take-most.',
    topicTags: ['API', 'infrastructure', 'platform', 'fintech', 'network-effects'],
    industryTags: ['Fintech', 'Technology', 'Financial Services'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Platform Strategy', 'Product Expansion', 'Infrastructure'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-033',
    title: "Calm's Category Expansion",
    sourceTranscript: 'alex-tew-calm.txt',
    speakerName: 'Alex Tew',
    speakerCompany: 'Calm',
    speakerRole: 'Co-founder',
    context: 'Calm started as a meditation app competing with Headspace. The meditation market was becoming commoditized.',
    decisionPoint: 'Double down on meditation or expand into the broader mental wellness category?',
    actionTaken: 'Expanded into sleep stories, music, fitness, and corporate wellness. Positioned as "mental fitness" rather than just meditation. Launched Calm Business for enterprises.',
    outcome: 'Became the highest-grossing health and fitness app. Expanded TAM from meditation ($2B) to mental wellness ($120B+). Diversified revenue streams.',
    lessonsLearned: 'Category expansion multiplies your TAM. Positioning matters — "mental fitness" resonates more broadly than "meditation." Enterprise (B2B2C) creates more predictable revenue than consumer subscriptions.',
    topicTags: ['category-expansion', 'positioning', 'B2B2C', 'wellness', 'TAM-expansion'],
    industryTags: ['Consumer', 'Health', 'Wellness'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Market Expansion', 'Positioning', 'Business Model'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-034',
    title: "Rippling's Compound Startup Strategy",
    sourceTranscript: 'parker-conrad-rippling.txt',
    speakerName: 'Parker Conrad',
    speakerCompany: 'Rippling',
    speakerRole: 'CEO & Founder',
    context: 'HR software was fragmented — payroll, benefits, IT, and identity were all separate systems that did not talk to each other.',
    decisionPoint: 'Build another point solution (learned from Zenefits mistakes) or build a unified employee system?',
    actionTaken: 'Built a unified employee graph — every product (payroll, IT, benefits, spend management) shares the same data layer. Each new product makes all other products better.',
    outcome: 'Fastest growth in the category. Each new product launch accelerated overall company growth rather than diluting it.',
    lessonsLearned: 'Compound startups win by building on a shared data substrate. More products = more value when they are genuinely integrated. The second product should make the first product better.',
    topicTags: ['compound-startup', 'integration', 'multi-product', 'shared-data', 'platform'],
    industryTags: ['Technology', 'SaaS', 'HR Tech'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Product Strategy', 'Platform Strategy', 'Multi-Product'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-035',
    title: "Hubspot's Freemium Transformation",
    sourceTranscript: 'kieran-flanagan-hubspot.txt',
    speakerName: 'Kieran Flanagan',
    speakerCompany: 'HubSpot',
    speakerRole: 'SVP Marketing (former)',
    context: 'HubSpot was a sales-led company charging $800+/month. Growth was slowing as they maxed out their target market at that price point.',
    decisionPoint: 'Continue with sales-led motion or introduce a freemium tier?',
    actionTaken: 'Launched free CRM and free tiers for all products. Created a PLG funnel that fed the sales team with product-qualified leads. Invested in self-serve onboarding.',
    outcome: 'Customer base grew dramatically. Free users converted to paid at predictable rates. Enabled expansion into the SMB market.',
    lessonsLearned: 'Freemium can work for previously sales-led companies if the free product delivers genuine value. The free tier is not charity — it is a distribution strategy. PLG and sales-led motions can coexist.',
    topicTags: ['freemium', 'PLG', 'go-to-market', 'sales-led-to-PLG', 'distribution'],
    industryTags: ['Technology', 'SaaS', 'Marketing Tech'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Go-to-Market', 'Growth Strategy', 'Business Model'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-036',
    title: "Whimsical's AI-Native Product Design",
    sourceTranscript: 'kaspars-dancis-whimsical.txt',
    speakerName: 'Kaspars Dancis',
    speakerCompany: 'Whimsical',
    speakerRole: 'CEO & Co-founder',
    context: 'Whimsical was a niche diagramming tool competing against Miro and FigJam. AI was transforming product expectations.',
    decisionPoint: 'Add AI as a feature on top, or rebuild the product around AI as a core interaction model?',
    actionTaken: 'Rebuilt the product to be AI-native — AI generates diagrams from text descriptions, suggests improvements, and assists with brainstorming. AI is the primary creation method, not an add-on.',
    outcome: 'Differentiated from competitors who bolt on AI features. Attracted a new user segment who think in words, not shapes.',
    lessonsLearned: 'AI-native products beat AI-augmented products. Starting over with AI at the core is more powerful than adding AI to an existing product. New interaction paradigms attract new user segments.',
    topicTags: ['AI-native', 'product-redesign', 'interaction-design', 'differentiation'],
    industryTags: ['Technology', 'SaaS', 'Design Tools'],
    companyStageTags: ['Growth'],
    challengeTypeTags: ['Product Strategy', 'AI Integration', 'Competitive Differentiation'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-037',
    title: "Lattice's People Strategy Platform",
    sourceTranscript: 'jack-altman-lattice.txt',
    speakerName: 'Jack Altman',
    speakerCompany: 'Lattice',
    speakerRole: 'CEO & Co-founder',
    context: 'Performance management tools were hated by employees and HR alike. Annual reviews were universally despised.',
    decisionPoint: 'Build another traditional HR tool or reimagine how companies develop their people?',
    actionTaken: 'Started with lightweight continuous feedback. Expanded into goals, engagement surveys, and compensation — all connected. Built for both managers and employees, not just HR.',
    outcome: 'Grew to $100M+ ARR. Expanded from performance management into a people strategy platform. High customer retention.',
    lessonsLearned: 'Products that serve multiple stakeholders (managers + employees + HR) create more value than single-stakeholder tools. Continuous beats annual for people processes. Land with one product, expand into the category.',
    topicTags: ['multi-stakeholder', 'continuous-feedback', 'product-expansion', 'HR-tech', 'category'],
    industryTags: ['Technology', 'SaaS', 'HR Tech'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Product Strategy', 'Category Creation', 'Market Expansion'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-038',
    title: "Retool's Internal Tools Platform",
    sourceTranscript: 'david-hsu-retool.txt',
    speakerName: 'David Hsu',
    speakerCompany: 'Retool',
    speakerRole: 'CEO & Founder',
    context: 'Every company builds internal tools (admin panels, dashboards, workflows) but they are always deprioritized versus customer-facing features.',
    decisionPoint: 'Build for external-facing use cases (more glamorous) or specialize in internal tools (less glamorous but universal)?',
    actionTaken: 'Specialized entirely in internal tools. Made it possible to build internal apps 10x faster with drag-and-drop components connected to any data source. Targeted developers, not business users.',
    outcome: 'Found a massive, underserved market. Strong enterprise adoption. Became the default internal tools platform.',
    lessonsLearned: 'Boring problems can be massive markets. Every company has internal tool needs — it is a universal pain point. Building for developers rather than end users creates stronger distribution and stickiness.',
    topicTags: ['internal-tools', 'developer-tools', 'low-code', 'market-discovery', 'niche'],
    industryTags: ['Technology', 'SaaS', 'Developer Tools'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Market Discovery', 'Product Strategy', 'Positioning'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
  {
    id: 'cs-039',
    title: "Vanta's Compliance Automation",
    sourceTranscript: 'christina-cacioppo-vanta.txt',
    speakerName: 'Christina Cacioppo',
    speakerCompany: 'Vanta',
    speakerRole: 'CEO & Co-founder',
    context: 'SOC 2 and security compliance was a manual, expensive, months-long process that every B2B SaaS company had to go through.',
    decisionPoint: 'Build a consulting practice (high margin per customer) or automate the entire compliance process (scalable but harder)?',
    actionTaken: 'Automated continuous compliance monitoring. Connected to cloud providers and SaaS tools to automatically verify controls. Reduced SOC 2 from months to weeks.',
    outcome: 'Fastest-growing security company. 7,000+ customers. Expanded from SOC 2 to HIPAA, ISO 27001, GDPR, and more.',
    lessonsLearned: 'Automate painful manual processes that every company faces. Compliance is a "pull" market — customers come to you because they have to. Expanding to adjacent compliance standards is natural land-and-expand.',
    topicTags: ['automation', 'compliance', 'platform', 'land-and-expand', 'pull-market'],
    industryTags: ['Technology', 'Security', 'SaaS'],
    companyStageTags: ['Growth', 'Scale'],
    challengeTypeTags: ['Market Discovery', 'Automation', 'Product Strategy'],
    phaseRelevance: ['research', 'synthesis', 'bets'],
  },
  {
    id: 'cs-040',
    title: "Camille Fournier's Engineering Org Scaling",
    sourceTranscript: 'camille-fournier-engineering.txt',
    speakerName: 'Camille Fournier',
    speakerCompany: 'JPMorgan Chase (current)',
    speakerRole: 'MD of Engineering (Author: The Manager\'s Path)',
    context: 'Engineering organizations frequently struggle when scaling from 50 to 500+ engineers. Communication breaks down, velocity drops, and culture shifts.',
    decisionPoint: 'Add more process and control, or invest in engineering management capability?',
    actionTaken: 'Advocated for investing in engineering management as a distinct skill. Created structured career ladders for both IC and management tracks. Emphasized skip-level 1:1s and organizational health metrics.',
    outcome: 'Organizations that invested in management quality saw faster shipping velocity, lower attrition, and better cross-team collaboration.',
    lessonsLearned: 'Engineering management is a skill that requires deliberate development. Dual career ladders (IC + management) prevent talent flight. Skip-level 1:1s are the best signal for organizational health.',
    topicTags: ['engineering-management', 'career-ladders', 'org-scaling', 'culture', 'velocity'],
    industryTags: ['Technology', 'Financial Services'],
    companyStageTags: ['Scale', 'Enterprise'],
    challengeTypeTags: ['Organizational Design', 'Engineering Culture', 'Scaling'],
    phaseRelevance: ['discovery', 'research', 'synthesis'],
  },
];

// ============================================================================
// RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Retrieve all case studies, optionally filtered.
 */
export function getCaseStudies(filters?: {
  industry?: string;
  companyStage?: string;
  challengeType?: string;
  phase?: string;
  speaker?: string;
  search?: string;
}): CaseStudy[] {
  let results = [...CASE_STUDIES];

  if (filters?.industry) {
    const q = filters.industry.toLowerCase();
    results = results.filter(cs =>
      cs.industryTags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters?.companyStage) {
    const q = filters.companyStage.toLowerCase();
    results = results.filter(cs =>
      cs.companyStageTags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters?.challengeType) {
    const q = filters.challengeType.toLowerCase();
    results = results.filter(cs =>
      cs.challengeTypeTags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters?.phase) {
    results = results.filter(cs =>
      cs.phaseRelevance.includes(filters.phase!)
    );
  }

  if (filters?.speaker) {
    const q = filters.speaker.toLowerCase();
    results = results.filter(cs =>
      cs.speakerName.toLowerCase().includes(q) ||
      cs.speakerCompany.toLowerCase().includes(q)
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(cs =>
      cs.title.toLowerCase().includes(q) ||
      cs.context.toLowerCase().includes(q) ||
      cs.decisionPoint.toLowerCase().includes(q) ||
      cs.actionTaken.toLowerCase().includes(q) ||
      cs.outcome.toLowerCase().includes(q) ||
      cs.lessonsLearned.toLowerCase().includes(q) ||
      cs.topicTags.some(t => t.toLowerCase().includes(q)) ||
      cs.speakerName.toLowerCase().includes(q) ||
      cs.speakerCompany.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Get a single case study by ID.
 */
export function getCaseStudyById(id: string): CaseStudy | null {
  return CASE_STUDIES.find(cs => cs.id === id) || null;
}

/**
 * Retrieve case studies relevant to a user's context, scored by relevance.
 */
export function getRelevantCaseStudies(
  userContext: {
    industry?: string;
    companyStage?: string;
    challenges?: string[];
    phase?: string;
    topics?: string[];
  },
  limit: number = 10
): Array<CaseStudy & { relevanceScore: number }> {
  const scored = CASE_STUDIES.map(cs => {
    let score = 0;

    // Industry match
    if (userContext.industry) {
      const q = userContext.industry.toLowerCase();
      if (cs.industryTags.some(t => t.toLowerCase().includes(q))) score += 3;
    }

    // Company stage match
    if (userContext.companyStage) {
      const q = userContext.companyStage.toLowerCase();
      if (cs.companyStageTags.some(t => t.toLowerCase().includes(q))) score += 2;
    }

    // Challenge match
    if (userContext.challenges) {
      for (const challenge of userContext.challenges) {
        const q = challenge.toLowerCase();
        if (cs.challengeTypeTags.some(t => t.toLowerCase().includes(q))) score += 2;
        if (cs.topicTags.some(t => t.toLowerCase().includes(q))) score += 1;
      }
    }

    // Phase relevance
    if (userContext.phase && cs.phaseRelevance.includes(userContext.phase)) {
      score += 1;
    }

    // Topic match
    if (userContext.topics) {
      for (const topic of userContext.topics) {
        const q = topic.toLowerCase();
        if (cs.topicTags.some(t => t.toLowerCase().includes(q))) score += 1;
      }
    }

    return { ...cs, relevanceScore: score };
  });

  return scored
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

/**
 * Format case studies for injection into the system prompt.
 */
export function formatCaseStudiesForPrompt(
  cases: CaseStudy[],
  limit: number = 3
): string {
  const selected = cases.slice(0, limit);
  if (selected.length === 0) return '';

  const formatted = selected.map(cs =>
    `**${cs.title}** (${cs.speakerName}, ${cs.speakerCompany})
- Context: ${cs.context}
- Decision: ${cs.decisionPoint}
- Action: ${cs.actionTaken}
- Outcome: ${cs.outcome}
- Lesson: ${cs.lessonsLearned}`
  ).join('\n\n');

  return `## Relevant Case Studies from Practitioner Interviews

The following real-world case studies are relevant to this user's situation. Reference them naturally when the user faces a similar decision. Use the citation format [Case:Title — Speaker].

**Suggestion format**: "Your situation mirrors [Case Title]. Want to explore how [Speaker] at [Company] handled this?"

**Important**: Suggest a case study at most once every 5 messages. Do not be pushy.

${formatted}`;
}

/**
 * Get all unique filter values for UI dropdowns.
 */
export function getCaseStudyFilterOptions() {
  const industries = new Set<string>();
  const stages = new Set<string>();
  const challenges = new Set<string>();

  for (const cs of CASE_STUDIES) {
    cs.industryTags.forEach(t => industries.add(t));
    cs.companyStageTags.forEach(t => stages.add(t));
    cs.challengeTypeTags.forEach(t => challenges.add(t));
  }

  return {
    industries: Array.from(industries).sort(),
    stages: Array.from(stages).sort(),
    challenges: Array.from(challenges).sort(),
  };
}
