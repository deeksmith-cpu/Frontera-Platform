/**
 * Relevance Evaluation Tests
 *
 * Tests whether Strategy Coach responses are relevant to user input
 */

import { describe, test, expect } from 'vitest';
import { executeStrategyCoach, createTestContext } from '../../helpers/eval-utils';
import { judgeResponse, EVALUATION_CRITERIA } from '../../helpers/llm-judge';
import { allTestCases } from '../../fixtures/test-conversations';
import { QUALITY_THRESHOLDS } from '../../config/metrics.config';

describe('Relevance Evaluation', () => {
  // Use first 30 test cases for relevance evaluation
  const relevanceTestCases = allTestCases.slice(0, 30);

  test.each(relevanceTestCases)(
    'should provide relevant response to: $id - "$userMessage"',
    async (testCase) => {
      // Execute Strategy Coach
      const { content } = await executeStrategyCoach(testCase.userMessage, testCase.context);

      // LLM-as-a-judge evaluation
      const judgment = await judgeResponse(
        testCase.userMessage,
        content,
        testCase.context,
        EVALUATION_CRITERIA.relevance
      );

      // Log detailed results for analysis
      console.log({
        testId: testCase.id,
        category: testCase.category,
        score: judgment.score,
        threshold: QUALITY_THRESHOLDS.relevance,
        passed: judgment.score >= QUALITY_THRESHOLDS.relevance,
        reasoning: judgment.reasoning,
        confidence: judgment.confidence,
      });

      // Assert against threshold
      expect(judgment.score).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS.relevance);
    },
    {
      timeout: 60000, // 60s per test case (includes LLM calls)
      retry: 1, // Retry once if fails (LLM judging can be variable)
    }
  );

  // Additional targeted relevance tests
  test('should stay on topic for product strategy', async () => {
    const { content } = await executeStrategyCoach(
      'What should I focus on for my product strategy?',
      createTestContext()
    );

    // Should mention strategy-related concepts
    const lowerContent = content.toLowerCase();
    const hasStrategyFocus =
      lowerContent.includes('strategy') ||
      lowerContent.includes('product') ||
      lowerContent.includes('research') ||
      lowerContent.includes('pillar');

    expect(hasStrategyFocus).toBe(true);
  });

  test('should not go off-topic into unrelated domains', async () => {
    const { content } = await executeStrategyCoach(
      'How do I conduct customer research?',
      createTestContext({ industry: 'Healthcare' })
    );

    // Should NOT discuss unrelated topics
    const lowerContent = content.toLowerCase();
    expect(lowerContent).not.toContain('weather');
    expect(lowerContent).not.toContain('recipe');
    expect(lowerContent).not.toContain('sports');
  });
});
