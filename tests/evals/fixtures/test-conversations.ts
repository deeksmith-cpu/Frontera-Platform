/**
 * Test Conversation Fixtures
 *
 * Comprehensive test cases covering all methodology phases and scenarios
 */

import type { ClientContext } from '@/lib/agents/strategy-coach/client-context';

export interface TestCase {
  id: string;
  category: 'discovery' | 'research' | 'synthesis' | 'planning';
  userMessage: string;
  context: ClientContext;
  expectedBehavior: {
    shouldMentionPillar?: 'macroMarket' | 'customer' | 'colleague';
    shouldProgressFramework?: boolean;
    shouldAskFollowUp?: boolean;
    shouldProvideGuidance?: boolean;
    shouldReferenceContext?: boolean;
  };
}

// Discovery Phase Test Cases (15 cases)
export const discoveryTestCases: TestCase[] = [
  {
    id: 'DISC-001',
    category: 'discovery',
    userMessage: 'What should I focus on for my product strategy?',
    context: {
      industry: 'Technology',
      company_size: '50-200',
      strategic_focus: 'Market expansion',
      pain_points: ['Unclear competitive positioning', 'Product-market fit validation'],
      previous_attempts: 'Hired consultants but recommendations were too generic',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldAskFollowUp: true,
      shouldProvideGuidance: true,
      shouldReferenceContext: true,
    },
  },
  {
    id: 'DISC-002',
    category: 'discovery',
    userMessage: 'How do I understand my customers better?',
    context: {
      industry: 'Financial Services',
      company_size: '200-1000',
      strategic_focus: 'Customer retention',
      pain_points: ['High churn rate', 'Limited customer insights'],
      previous_attempts: 'Basic surveys with low response rates',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'DISC-003',
    category: 'discovery',
    userMessage: 'My team is misaligned on product direction. Where do I start?',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Digital transformation',
      pain_points: ['Internal misalignment', 'Legacy mindset resistance'],
      previous_attempts: 'Multiple failed alignment workshops',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-004',
    category: 'discovery',
    userMessage: 'I need help building a product strategy from scratch',
    context: {
      industry: 'Retail',
      company_size: '10-50',
      strategic_focus: 'Product-market fit',
      pain_points: ['No formal strategy process', 'Ad-hoc decision making'],
      previous_attempts: 'None',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'DISC-005',
    category: 'discovery',
    userMessage: 'What competitive forces should I analyze?',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Market differentiation',
      pain_points: ['Intense competition', 'Commoditization risk'],
      previous_attempts: 'Competitive analysis but no actionable insights',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-006',
    category: 'discovery',
    userMessage: 'How do I validate my product assumptions?',
    context: {
      industry: 'Healthcare',
      company_size: '50-200',
      strategic_focus: 'Product innovation',
      pain_points: ['Unvalidated assumptions', 'Risk of building wrong features'],
      previous_attempts: 'Some customer interviews but inconclusive',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-007',
    category: 'discovery',
    userMessage: 'Our roadmap keeps changing. How do we build strategic clarity?',
    context: {
      industry: 'Financial Services',
      company_size: '1000+',
      strategic_focus: 'Strategic alignment',
      pain_points: ['Reactive planning', 'Stakeholder whiplash'],
      previous_attempts: 'OKRs but no strategic foundation',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'DISC-008',
    category: 'discovery',
    userMessage: 'What role does industry regulation play in product strategy?',
    context: {
      industry: 'Healthcare',
      company_size: '200-1000',
      strategic_focus: 'Compliance-driven innovation',
      pain_points: ['HIPAA constraints', 'Slow approval processes'],
      previous_attempts: 'Compliance-first approach stifling innovation',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldReferenceContext: true,
    },
  },
  {
    id: 'DISC-009',
    category: 'discovery',
    userMessage: 'How do I balance short-term revenue with long-term vision?',
    context: {
      industry: 'Retail',
      company_size: '50-200',
      strategic_focus: 'Sustainable growth',
      pain_points: ['Pressure for quick wins', 'Lack of long-term thinking'],
      previous_attempts: 'Prioritize urgent over important',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'DISC-010',
    category: 'discovery',
    userMessage: 'What makes a good product strategy different from a roadmap?',
    context: {
      industry: 'Technology',
      company_size: '10-50',
      strategic_focus: 'Strategic foundation',
      pain_points: ['Confusing strategy with execution', 'Feature factory mentality'],
      previous_attempts: 'Roadmap-driven but no strategy',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-011',
    category: 'discovery',
    userMessage: 'How do I get executive buy-in for a strategic shift?',
    context: {
      industry: 'Financial Services',
      company_size: '1000+',
      strategic_focus: 'Organizational change',
      pain_points: ['Executive resistance', 'Politics and turf wars'],
      previous_attempts: 'Multiple failed pitches',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-012',
    category: 'discovery',
    userMessage: 'Should I focus on new customer acquisition or retention?',
    context: {
      industry: 'Retail',
      company_size: '200-1000',
      strategic_focus: 'Growth strategy',
      pain_points: ['Leaky bucket (high churn)', 'Expensive acquisition'],
      previous_attempts: 'Tried both but lacked strategic rationale',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'DISC-013',
    category: 'discovery',
    userMessage: 'What are the biggest mistakes companies make in product strategy?',
    context: {
      industry: 'Technology',
      company_size: '50-200',
      strategic_focus: 'Avoiding pitfalls',
      pain_points: ['Learning from failures', 'Risk mitigation'],
      previous_attempts: 'Trial and error approach',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-014',
    category: 'discovery',
    userMessage: 'How long should developing a product strategy take?',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Process efficiency',
      pain_points: ['Slow decision making', 'Analysis paralysis'],
      previous_attempts: 'Year-long strategy projects with minimal impact',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'DISC-015',
    category: 'discovery',
    userMessage: 'I'm new to product strategy. Where should I learn more?',
    context: {
      industry: 'Retail',
      company_size: '10-50',
      strategic_focus: 'Capability building',
      pain_points: ['No PM expertise', 'Limited resources'],
      previous_attempts: 'Read a few books but need practical guidance',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
];

// Research Phase Test Cases (20 cases)
export const researchTestCases: TestCase[] = [
  {
    id: 'RES-001',
    category: 'research',
    userMessage: 'Tell me about competitive dynamics in my industry',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Digital transformation',
      pain_points: ['Legacy systems', 'Regulatory compliance'],
      previous_attempts: 'Multiple failed digital initiatives',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
      shouldReferenceContext: true,
    },
  },
  {
    id: 'RES-002',
    category: 'research',
    userMessage: 'How do I conduct effective customer research?',
    context: {
      industry: 'Technology',
      company_size: '50-200',
      strategic_focus: 'Customer understanding',
      pain_points: ['Biased feedback', 'Low response rates'],
      previous_attempts: 'NPS surveys only',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-003',
    category: 'research',
    userMessage: 'What questions should I ask my internal stakeholders?',
    context: {
      industry: 'Financial Services',
      company_size: '200-1000',
      strategic_focus: 'Internal alignment',
      pain_points: ['Siloed departments', 'Competing priorities'],
      previous_attempts: 'Stakeholder surveys but surface-level',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-004',
    category: 'research',
    userMessage: 'How do I analyze market trends and emerging technologies?',
    context: {
      industry: 'Technology',
      company_size: '10-50',
      strategic_focus: 'Innovation positioning',
      pain_points: ['Fast-moving tech landscape', 'Fear of missing out'],
      previous_attempts: 'Read tech blogs but no structured analysis',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-005',
    category: 'research',
    userMessage: 'What are the best practices for customer segmentation?',
    context: {
      industry: 'Retail',
      company_size: '200-1000',
      strategic_focus: 'Targeted offerings',
      pain_points: ['Broad, unfocused product', 'One-size-fits-all approach'],
      previous_attempts: 'Basic demographic segmentation',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-006',
    category: 'research',
    userMessage: 'How do I assess our internal capabilities and constraints?',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Realistic planning',
      pain_points: ['Overcommitment', 'Underestimating constraints'],
      previous_attempts: 'Optimistic plans rarely delivered',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-007',
    category: 'research',
    userMessage: 'What economic forces should I consider?',
    context: {
      industry: 'Financial Services',
      company_size: '200-1000',
      strategic_focus: 'Risk management',
      pain_points: ['Economic uncertainty', 'Interest rate volatility'],
      previous_attempts: 'Reactive to macro changes',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-008',
    category: 'research',
    userMessage: 'How do I discover unmet customer needs?',
    context: {
      industry: 'Technology',
      company_size: '50-200',
      strategic_focus: 'Innovation opportunities',
      pain_points: ['Incremental improvements only', 'Missing breakthrough ideas'],
      previous_attempts: 'Customer feedback reactive, not proactive',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-009',
    category: 'research',
    userMessage: 'What are common sources of resistance to change internally?',
    context: {
      industry: 'Retail',
      company_size: '1000+',
      strategic_focus: 'Change management',
      pain_points: ['Legacy culture', 'Fear of change'],
      previous_attempts: 'Top-down mandates failed',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-010',
    category: 'research',
    userMessage: 'How do I identify our true competitive advantages?',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Differentiation',
      pain_points: ['Unclear value prop', 'Commoditization pressure'],
      previous_attempts: 'SWOT analysis but too generic',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-011',
    category: 'research',
    userMessage: 'What data should I collect about customer behavior?',
    context: {
      industry: 'Healthcare',
      company_size: '50-200',
      strategic_focus: 'Data-driven decisions',
      pain_points: ['Limited analytics', 'Privacy constraints (HIPAA)'],
      previous_attempts: 'Basic usage metrics only',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
      shouldReferenceContext: true,
    },
  },
  {
    id: 'RES-012',
    category: 'research',
    userMessage: 'How do I map our internal processes and workflows?',
    context: {
      industry: 'Financial Services',
      company_size: '1000+',
      strategic_focus: 'Operational efficiency',
      pain_points: ['Undocumented processes', 'Inefficiency'],
      previous_attempts: 'Informal knowledge, nothing written down',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-013',
    category: 'research',
    userMessage: 'What role does regulatory environment play in strategy?',
    context: {
      industry: 'Healthcare',
      company_size: '200-1000',
      strategic_focus: 'Regulatory navigation',
      pain_points: ['Complex regulations', 'Compliance costs'],
      previous_attempts: 'Reactive compliance approach',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
      shouldReferenceContext: true,
    },
  },
  {
    id: 'RES-014',
    category: 'research',
    userMessage: 'How do I understand customer willingness to pay?',
    context: {
      industry: 'Retail',
      company_size: '10-50',
      strategic_focus: 'Pricing strategy',
      pain_points: ['Price sensitivity unknown', 'Competitive pricing pressure'],
      previous_attempts: 'Cost-plus pricing without customer input',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-015',
    category: 'research',
    userMessage: 'Tell me about the Three Pillars of strategy research',
    context: {
      industry: 'Technology',
      company_size: '50-200',
      strategic_focus: 'Methodology learning',
      pain_points: ['New to framework', 'Need structure'],
      previous_attempts: 'None',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldMentionPillar: 'macroMarket',
    },
  },
  {
    id: 'RES-016',
    category: 'research',
    userMessage: 'How do I research competitors without access to their data?',
    context: {
      industry: 'Financial Services',
      company_size: '200-1000',
      strategic_focus: 'Competitive intelligence',
      pain_points: ['Limited public information', 'Private companies'],
      previous_attempts: 'Basic web searches only',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-017',
    category: 'research',
    userMessage: 'What are effective ways to engage with customers for research?',
    context: {
      industry: 'Technology',
      company_size: '10-50',
      strategic_focus: 'Customer engagement',
      pain_points: ['Low response rates', 'Biased sample'],
      previous_attempts: 'Email surveys (5% response)',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-018',
    category: 'research',
    userMessage: 'How do I assess technical debt and its strategic impact?',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Technical foundation',
      pain_points: ['Legacy systems', 'Mounting technical debt'],
      previous_attempts: 'Engineering complaints but no strategic view',
    },
    expectedBehavior: {
      shouldMentionPillar: 'colleague',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-019',
    category: 'research',
    userMessage: 'What market sizing techniques should I use?',
    context: {
      industry: 'Retail',
      company_size: '50-200',
      strategic_focus: 'Market opportunity',
      pain_points: ['Unclear TAM/SAM/SOM', 'Unreliable market estimates'],
      previous_attempts: 'Analyst reports but not specific enough',
    },
    expectedBehavior: {
      shouldMentionPillar: 'macroMarket',
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'RES-020',
    category: 'research',
    userMessage: 'How do I research customer jobs-to-be-done?',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Customer needs understanding',
      pain_points: ['Feature-focused, not outcome-focused'],
      previous_attempts: 'Feature requests but no JTBD thinking',
    },
    expectedBehavior: {
      shouldMentionPillar: 'customer',
      shouldProvideGuidance: true,
    },
  },
];

// Synthesis Phase Test Cases (10 cases)
export const synthesisTestCases: TestCase[] = [
  {
    id: 'SYNTH-001',
    category: 'synthesis',
    userMessage: 'How do I connect my research insights to strategy?',
    context: {
      industry: 'Retail',
      company_size: '50-200',
      strategic_focus: 'Omnichannel strategy',
      pain_points: ['Disconnected online/offline experiences'],
      previous_attempts: 'Piecemeal improvements without holistic strategy',
    },
    expectedBehavior: {
      shouldProgressFramework: true,
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-002',
    category: 'synthesis',
    userMessage: 'I have lots of research data. How do I make sense of it all?',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Data synthesis',
      pain_points: ['Information overload', 'Paralysis by analysis'],
      previous_attempts: 'Collected data but unclear next steps',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-003',
    category: 'synthesis',
    userMessage: 'What patterns should I look for in my research?',
    context: {
      industry: 'Financial Services',
      company_size: '1000+',
      strategic_focus: 'Insight generation',
      pain_points: ['Buried insights', 'Can't see the forest for the trees'],
      previous_attempts: 'Descriptive summaries but no synthesis',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-004',
    category: 'synthesis',
    userMessage: 'How do I prioritize conflicting research findings?',
    context: {
      industry: 'Healthcare',
      company_size: '50-200',
      strategic_focus: 'Decision making',
      pain_points: ['Contradictory signals', 'Stakeholder disagreement'],
      previous_attempts: 'Avoided hard choices, tried to do everything',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'SYNTH-005',
    category: 'synthesis',
    userMessage: 'What is the Strategic Flow Canvas and how do I use it?',
    context: {
      industry: 'Retail',
      company_size: '10-50',
      strategic_focus: 'Framework application',
      pain_points: ['Need structure', 'Unclear how to organize thinking'],
      previous_attempts: 'None',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldProgressFramework: true,
    },
  },
  {
    id: 'SYNTH-006',
    category: 'synthesis',
    userMessage: 'How do I articulate our strategic position?',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Positioning clarity',
      pain_points: ['Fuzzy positioning', 'Can't explain what makes us different'],
      previous_attempts: 'Generic value propositions',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-007',
    category: 'synthesis',
    userMessage: 'What strategic choices do I need to make?',
    context: {
      industry: 'Financial Services',
      company_size: '200-1000',
      strategic_focus: 'Strategic clarity',
      pain_points: ['Trying to be everything to everyone', 'No clear tradeoffs'],
      previous_attempts: 'Avoided saying no',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'SYNTH-008',
    category: 'synthesis',
    userMessage: 'How do I validate my strategic hypotheses?',
    context: {
      industry: 'Healthcare',
      company_size: '1000+',
      strategic_focus: 'Risk mitigation',
      pain_points: ['Untested assumptions', 'Big strategic bets'],
      previous_attempts: 'Leap-of-faith decisions',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-009',
    category: 'synthesis',
    userMessage: 'How do I communicate strategy to my team?',
    context: {
      industry: 'Retail',
      company_size: '50-200',
      strategic_focus: 'Communication',
      pain_points: ['Strategy not understood', 'Execution misaligned'],
      previous_attempts: 'PowerPoint presentations that didn't land',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'SYNTH-010',
    category: 'synthesis',
    userMessage: 'What's the difference between strategic intent and strategic bets?',
    context: {
      industry: 'Technology',
      company_size: '10-50',
      strategic_focus: 'Concept clarity',
      pain_points: ['Confusing terminology', 'Need framework understanding'],
      previous_attempts: 'None',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
];

// Planning Phase Test Cases (5 cases)
export const planningTestCases: TestCase[] = [
  {
    id: 'PLAN-001',
    category: 'planning',
    userMessage: 'Help me write a strategic bet',
    context: {
      industry: 'Technology',
      company_size: '200-1000',
      strategic_focus: 'Product innovation',
      pain_points: ['Slow time-to-market', 'Risk aversion culture'],
      previous_attempts: 'Traditional roadmaps without strategic clarity',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'PLAN-002',
    category: 'planning',
    userMessage: 'How do I turn strategy into an executable roadmap?',
    context: {
      industry: 'Financial Services',
      company_size: '1000+',
      strategic_focus: 'Execution planning',
      pain_points: ['Strategy-execution gap', 'Roadmaps disconnected from strategy'],
      previous_attempts: 'Strategy docs gathering dust',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'PLAN-003',
    category: 'planning',
    userMessage: 'What success metrics should I define for my strategy?',
    context: {
      industry: 'Healthcare',
      company_size: '50-200',
      strategic_focus: 'Measurement',
      pain_points: ['Unclear success criteria', 'Lagging indicators only'],
      previous_attempts: 'Revenue metrics but no leading indicators',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
  {
    id: 'PLAN-004',
    category: 'planning',
    userMessage: 'How do I prioritize strategic initiatives?',
    context: {
      industry: 'Retail',
      company_size: '200-1000',
      strategic_focus: 'Prioritization',
      pain_points: ['Too many priorities', 'Everything is high priority'],
      previous_attempts: 'RICE scoring but didn't account for strategy',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
      shouldAskFollowUp: true,
    },
  },
  {
    id: 'PLAN-005',
    category: 'planning',
    userMessage: 'How often should I review and update my product strategy?',
    context: {
      industry: 'Technology',
      company_size: '10-50',
      strategic_focus: 'Strategy maintenance',
      pain_points: ['Set-and-forget strategies', 'Market changes faster than we adapt'],
      previous_attempts: 'Annual planning cycles, too slow',
    },
    expectedBehavior: {
      shouldProvideGuidance: true,
    },
  },
];

// Export all test cases
export const allTestCases: TestCase[] = [
  ...discoveryTestCases,
  ...researchTestCases,
  ...synthesisTestCases,
  ...planningTestCases,
];

// Export by category for selective testing
export const testCasesByCategory = {
  discovery: discoveryTestCases,
  research: researchTestCases,
  synthesis: synthesisTestCases,
  planning: planningTestCases,
};

// Total count: 15 + 20 + 10 + 5 = 50 test cases
console.log(`Loaded ${allTestCases.length} test cases`);
