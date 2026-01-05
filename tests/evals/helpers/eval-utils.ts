/**
 * Evaluation Utilities
 *
 * Helper functions for executing Strategy Coach and capturing responses for evaluation
 */

import { streamMessage } from '@/lib/agents/strategy-coach';
import type { ClientContext } from '@/lib/agents/strategy-coach/client-context';
import type { FrameworkState } from '@/lib/agents/strategy-coach/framework-state';
import { initializeFrameworkState } from '@/lib/agents/strategy-coach/framework-state';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface EvalExecutionResult {
  content: string;
  updatedState: FrameworkState;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  latencyMs: number;
}

/**
 * Execute Strategy Coach and capture full response
 */
export async function executeStrategyCoach(
  userMessage: string,
  context: ClientContext,
  state?: FrameworkState,
  history: Message[] = []
): Promise<EvalExecutionResult> {
  const startTime = Date.now();
  const initialState = state || initializeFrameworkState();

  try {
    const { stream, getUsage } = await streamMessage(
      context,
      initialState,
      history,
      userMessage
    );

    // Collect streaming response
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let content = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      content += decoder.decode(value, { stream: true });
    }

    const usage = getUsage();
    const latencyMs = Date.now() - startTime;

    return {
      content,
      updatedState: initialState, // Note: State updates would need to be parsed from response
      usage,
      latencyMs,
    };
  } catch (error) {
    console.error('Error executing Strategy Coach:', error);
    throw error;
  }
}

/**
 * Create test client context with defaults
 */
export function createTestContext(overrides: Partial<ClientContext> = {}): ClientContext {
  return {
    industry: 'Technology',
    company_size: '50-200',
    strategic_focus: 'Market expansion',
    pain_points: ['Unclear competitive positioning'],
    previous_attempts: 'None',
    ...overrides,
  };
}

/**
 * Create test conversation history
 */
export function createConversationHistory(
  turns: Array<{ role: 'user' | 'assistant'; content: string }>
): Message[] {
  return turns.map((turn, index) => ({
    id: `msg-${index}`,
    role: turn.role,
    content: turn.content,
    created_at: new Date(Date.now() - (turns.length - index) * 60000).toISOString(),
  }));
}

/**
 * Extract specific sections from response (for code-based grading)
 */
export function extractSections(response: string): {
  hasPillarMention: boolean;
  hasFollowUpQuestions: boolean;
  hasGuidance: boolean;
  mentionedPillar?: string;
  questionCount: number;
} {
  const lowerResponse = response.toLowerCase();

  // Check for pillar mentions
  let mentionedPillar: string | undefined;
  if (lowerResponse.includes('macro market') || lowerResponse.includes('macromarket')) {
    mentionedPillar = 'macroMarket';
  } else if (lowerResponse.includes('customer pillar') || lowerResponse.includes('customer research')) {
    mentionedPillar = 'customer';
  } else if (lowerResponse.includes('colleague pillar') || lowerResponse.includes('internal research')) {
    mentionedPillar = 'colleague';
  }

  // Count questions
  const questionMatches = response.match(/\?/g);
  const questionCount = questionMatches ? questionMatches.length : 0;

  // Check for guidance indicators
  const guidanceKeywords = [
    'recommend',
    'suggest',
    'consider',
    'approach',
    'strategy',
    'start with',
    'focus on',
  ];
  const hasGuidance = guidanceKeywords.some((keyword) => lowerResponse.includes(keyword));

  return {
    hasPillarMention: mentionedPillar !== undefined,
    hasFollowUpQuestions: questionCount > 0,
    hasGuidance,
    mentionedPillar,
    questionCount,
  };
}

/**
 * Calculate response metrics
 */
export function calculateResponseMetrics(response: string): {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  readabilityScore: number;
} {
  const words = response.trim().split(/\s+/);
  const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Simple readability score (Flesch-Kincaid-like)
  // Lower score = easier to read
  const readabilityScore = avgWordsPerSentence * 0.39 + wordCount / 10;

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    readabilityScore,
  };
}

/**
 * Wait for a specified time (useful for rate limiting)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delayMs}ms...`);
        await wait(delayMs);
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
