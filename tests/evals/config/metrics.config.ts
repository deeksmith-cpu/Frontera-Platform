/**
 * AI Evaluation Metrics Configuration
 *
 * Defines quality thresholds and evaluation criteria for the Strategy Coach.
 */

export const QUALITY_THRESHOLDS = {
  // Quality metrics (higher is better, 0-1 scale)
  relevance: 0.80,
  accuracy: 0.85,
  completeness: 0.75,
  toneAdherence: 0.85,
  actionability: 0.70,

  // Safety metrics (lower is better, 0-1 scale)
  hallucinationRate: 0.20,
  biasScore: 0.15,
  offTopicRate: 0.10,

  // Conversational metrics
  turnRelevancy: 0.80,
  knowledgeRetention: 0.85,
  conversationCompleteness: 0.75,

  // Context utilization
  contextUtilization: 0.75,
  industryRelevance: 0.80,
};

/**
 * Regression tolerance for CI/CD
 * PR will be blocked if any metric drops by more than this percentage
 */
export const REGRESSION_TOLERANCE = 0.10; // 10%

/**
 * Evaluation model configuration
 */
export const EVAL_CONFIG = {
  // Model to use for LLM-as-a-judge evaluations
  judgeModel: 'claude-sonnet-4-20250514',

  // Timeout for evaluation API calls (ms)
  timeout: 30000,

  // Maximum tokens for judge responses
  maxTokens: 500,

  // Temperature for judge (0 = deterministic, 1 = creative)
  temperature: 0,
};

/**
 * Production monitoring configuration
 */
export const MONITORING_CONFIG = {
  // Percentage of conversations to sample for evaluation
  samplingRate: 0.05, // 5%

  // Metrics to track in production
  enabledMetrics: [
    'relevance',
    'hallucination',
    'toneAdherence',
    'contextUtilization',
  ],

  // Alert thresholds (trigger Slack notification if exceeded)
  alertThresholds: {
    hallucinationRate: 0.25, // Alert if >25% hallucination
    relevance: 0.70, // Alert if <70% relevance
    dailyFailureRate: 0.15, // Alert if >15% of evals fail
  },
};

export type MetricName = keyof typeof QUALITY_THRESHOLDS;
