/**
 * Client Context Variations
 *
 * Different client contexts for testing personalization and context utilization
 */

import type { ClientContext } from '@/lib/agents/strategy-coach/client-context';

// Industry variations
export const contextVariations: Record<string, ClientContext> = {
  technology_startup: {
    industry: 'Technology',
    company_size: '10-50',
    strategic_focus: 'Product-market fit',
    pain_points: ['Limited resources', 'Fast-moving competition'],
    previous_attempts: 'Pivoted twice, still searching for PMF',
  },

  technology_growth: {
    industry: 'Technology',
    company_size: '50-200',
    strategic_focus: 'Market expansion',
    pain_points: ['Scaling challenges', 'Competitive positioning'],
    previous_attempts: 'Hired consultants but recommendations too generic',
  },

  technology_enterprise: {
    industry: 'Technology',
    company_size: '1000+',
    strategic_focus: 'Innovation at scale',
    pain_points: ['Bureaucracy', 'Legacy systems', 'Slow decision making'],
    previous_attempts: 'Innovation labs with limited impact',
  },

  healthcare_startup: {
    industry: 'Healthcare',
    company_size: '10-50',
    strategic_focus: 'Regulatory navigation',
    pain_points: ['FDA approval timeline', 'HIPAA compliance', 'Capital intensive'],
    previous_attempts: 'Struggled with regulatory pathway',
  },

  healthcare_mid: {
    industry: 'Healthcare',
    company_size: '50-200',
    strategic_focus: 'Digital health adoption',
    pain_points: ['Provider resistance', 'Integration with EHR', 'Reimbursement uncertainty'],
    previous_attempts: 'Built product but low provider adoption',
  },

  healthcare_enterprise: {
    industry: 'Healthcare',
    company_size: '1000+',
    strategic_focus: 'Digital transformation',
    pain_points: ['Legacy systems', 'Regulatory compliance', 'Change management'],
    previous_attempts: 'Multiple failed EHR implementations',
  },

  financial_services_startup: {
    industry: 'Financial Services',
    company_size: '10-50',
    strategic_focus: 'Fintech disruption',
    pain_points: ['Regulatory compliance (SEC, FINRA)', 'Trust barriers', 'Capital requirements'],
    previous_attempts: 'Compliance-first approach stifling innovation',
  },

  financial_services_mid: {
    industry: 'Financial Services',
    company_size: '200-1000',
    strategic_focus: 'Customer experience',
    pain_points: ['Outdated tech stack', 'Compliance overhead', 'Fintech disruption'],
    previous_attempts: 'Hired consultants but lacked internal buy-in',
  },

  financial_services_enterprise: {
    industry: 'Financial Services',
    company_size: '1000+',
    strategic_focus: 'Modernization',
    pain_points: ['Legacy core banking systems', 'Risk aversion', 'Regulatory constraints'],
    previous_attempts: 'Long transformation programs with minimal progress',
  },

  retail_startup: {
    industry: 'Retail',
    company_size: '10-50',
    strategic_focus: 'Omnichannel differentiation',
    pain_points: ['Amazon competition', 'Thin margins', 'Customer acquisition cost'],
    previous_attempts: 'E-commerce site but low traffic',
  },

  retail_mid: {
    industry: 'Retail',
    company_size: '50-200',
    strategic_focus: 'Omnichannel strategy',
    pain_points: ['Siloed online/offline data', 'Inventory management', 'Customer loyalty'],
    previous_attempts: 'Built mobile app but low adoption',
  },

  retail_enterprise: {
    industry: 'Retail',
    company_size: '1000+',
    strategic_focus: 'Digital transformation',
    pain_points: ['Legacy point-of-sale systems', 'Supply chain complexity', 'Omnichannel integration'],
    previous_attempts: 'Multiple failed digital initiatives',
  },
};

// Strategic focus variations
export const strategicFocusVariations: string[] = [
  'Market expansion',
  'Product-market fit',
  'Customer retention',
  'Digital transformation',
  'Product innovation',
  'Strategic alignment',
  'Competitive differentiation',
  'Operational efficiency',
  'Customer experience',
  'Omnichannel strategy',
];

// Pain point categories
export const commonPainPoints = {
  strategic: [
    'Unclear competitive positioning',
    'Product-market fit validation',
    'No formal strategy process',
    'Reactive planning',
  ],
  execution: [
    'Strategy-execution gap',
    'Slow time-to-market',
    'Resource constraints',
    'Competing priorities',
  ],
  organizational: [
    'Internal misalignment',
    'Siloed departments',
    'Change resistance',
    'Stakeholder whiplash',
  ],
  customer: [
    'High customer churn',
    'Limited customer insights',
    'Unclear value proposition',
    'Low product adoption',
  ],
  technical: [
    'Legacy systems',
    'Technical debt',
    'Integration challenges',
    'Scalability issues',
  ],
  market: [
    'Intense competition',
    'Market commoditization',
    'Disruption threats',
    'Regulatory constraints',
  ],
};

// Previous attempt patterns
export const previousAttemptPatterns: string[] = [
  'Hired consultants but recommendations were too generic',
  'Multiple failed digital initiatives',
  'Strategy docs gathering dust',
  'Piecemeal improvements without holistic strategy',
  'Annual planning cycles, too slow',
  'OKRs but no strategic foundation',
  'Tried various frameworks but none stuck',
  'Leadership workshops but no follow-through',
  'Roadmap-driven but no strategy',
  'Reactive to market changes',
];

/**
 * Generate a random client context for testing
 */
export function generateRandomContext(): ClientContext {
  const industries = ['Technology', 'Healthcare', 'Financial Services', 'Retail'];
  const sizes = ['10-50', '50-200', '200-1000', '1000+'];

  const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomFocus =
    strategicFocusVariations[Math.floor(Math.random() * strategicFocusVariations.length)];

  const allPainPoints = Object.values(commonPainPoints).flat();
  const selectedPainPoints = allPainPoints
    .sort(() => Math.random() - 0.5)
    .slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 pain points

  const randomAttempt =
    previousAttemptPatterns[Math.floor(Math.random() * previousAttemptPatterns.length)];

  return {
    industry: randomIndustry,
    company_size: randomSize,
    strategic_focus: randomFocus,
    pain_points: selectedPainPoints,
    previous_attempts: randomAttempt,
  };
}
