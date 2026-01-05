/**
 * Completeness Evaluation Tests
 *
 * Tests whether Strategy Coach provides sufficient, actionable guidance
 */

import { describe, test, expect } from 'vitest';
import { executeStrategyCoach, calculateResponseMetrics } from '../../helpers/eval-utils';
import { judgeResponse, EVALUATION_CRITERIA } from '../../helpers/llm-judge';
import { checkResponseLength, hasActionableGuidance } from '../../helpers/code-grader';
import { QUALITY_THRESHOLDS } from '../../config/metrics.config';
import { allTestCases } from '../../fixtures/test-conversations';

describe('Completeness Evaluation', () => {
  // Use a diverse sample of test cases (20 cases)
  const completenessTestCases = [
    ...allTestCases.filter((tc) => tc.category === 'discovery').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'research').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'synthesis').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'planning').slice(0, 5),
  ];

  test.each(completenessTestCases)(
    'should provide complete guidance for: $id',
    async (testCase) => {
      const { content } = await executeStrategyCoach(testCase.userMessage, testCase.context);

      // Code-based: check response length (50-500 words is reasonable)
      const lengthCheck = checkResponseLength(content, 50, 500);
      expect(lengthCheck.valid).toBe(true);

      // LLM-as-a-judge: evaluate completeness
      const judgment = await judgeResponse(
        testCase.userMessage,
        content,
        testCase.context,
        EVALUATION_CRITERIA.completeness
      );

      console.log({
        testId: testCase.id,
        wordCount: lengthCheck.wordCount,
        score: judgment.score,
        threshold: QUALITY_THRESHOLDS.completeness,
        passed: judgment.score >= QUALITY_THRESHOLDS.completeness,
        reasoning: judgment.reasoning,
      });

      expect(judgment.score).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS.completeness);
    },
    {
      timeout: 60000,
      retry: 1,
    }
  );

  test('should provide sufficient detail (not too brief)', async () => {
    const { content } = await executeStrategyCoach(
      'How do I conduct customer research?',
      createTestContext()
    );

    const lengthCheck = checkResponseLength(content, 100, 500);

    // Should be at least 100 words for a substantive question
    expect(lengthCheck.wordCount).toBeGreaterThanOrEqual(100);
  });

  test('should not be overly verbose (concise)', async () => {
    const { content } = await executeStrategyCoach(
      'What is the Macro Market Pillar?',
      createTestContext()
    );

    const lengthCheck = checkResponseLength(content, 50, 400);

    // Should not exceed 400 words for a straightforward question
    expect(lengthCheck.wordCount).toBeLessThanOrEqual(400);
  });

  test('should include actionable guidance', async () => {
    const { content } = await executeStrategyCoach(
      'I want to improve my product strategy',
      createTestContext()
    );

    const guidanceCheck = hasActionableGuidance(content);

    expect(guidanceCheck.hasGuidance).toBe(true);
    expect(guidanceCheck.guidanceIndicators.length).toBeGreaterThan(0);

    console.log('Guidance indicators found:', guidanceCheck.guidanceIndicators);
  });

  test('should provide concrete next steps', async () => {
    const { content } = await executeStrategyCoach(
      'What should I do first?',
      createTestContext()
    );

    const lowerContent = content.toLowerCase();

    // Should include sequencing language
    const hasNextSteps =
      lowerContent.includes('first') ||
      lowerContent.includes('start') ||
      lowerContent.includes('begin') ||
      lowerContent.includes('next step');

    expect(hasNextSteps).toBe(true);
  });

  test('should balance breadth and depth', async () => {
    const { content } = await executeStrategyCoach(
      'Tell me about the research pillars',
      createTestContext()
    );

    // Should cover all three pillars
    const lowerContent = content.toLowerCase();
    const coversMacroMarket =
      lowerContent.includes('macro market') || lowerContent.includes('macromarket');
    const coversCustomer = lowerContent.includes('customer');
    const coversColleague = lowerContent.includes('colleague');

    const pillarsCovered = [coversMacroMarket, coversCustomer, coversColleague].filter(Boolean).length;

    // Should mention at least 2 of the 3 pillars for completeness
    expect(pillarsCovered).toBeGreaterThanOrEqual(2);
  });

  test('should include rationale, not just instructions', async () => {
    const { content } = await executeStrategyCoach(
      'Why should I do customer research?',
      createTestContext()
    );

    const lowerContent = content.toLowerCase();

    // Should explain "why" not just "what"
    const hasRationale =
      lowerContent.includes('because') ||
      lowerContent.includes('reason') ||
      lowerContent.includes('why') ||
      lowerContent.includes('help') ||
      lowerContent.includes('enable');

    expect(hasRationale).toBe(true);
  });

  test('should provide context-aware completeness', async () => {
    const { content } = await executeStrategyCoach(
      'What should I focus on?',
      createTestContext({
        strategic_focus: 'Market expansion',
        pain_points: ['Unclear competitive positioning'],
      })
    );

    // Should reference the context to provide complete, tailored guidance
    const lowerContent = content.toLowerCase();
    const referencesContext =
      lowerContent.includes('expansion') ||
      lowerContent.includes('market') ||
      lowerContent.includes('competitive') ||
      lowerContent.includes('positioning');

    expect(referencesContext).toBe(true);
  });

  test('should have appropriate sentence structure', async () => {
    const { content } = await executeStrategyCoach(
      'How do I create a strategic bet?',
      createTestContext()
    );

    const metrics = calculateResponseMetrics(content);

    // Sentences should be readable (not too long or too short)
    expect(metrics.avgWordsPerSentence).toBeGreaterThan(8);
    expect(metrics.avgWordsPerSentence).toBeLessThan(30);

    console.log('Response metrics:', metrics);
  });

  test('should provide examples when helpful', async () => {
    const { content } = await executeStrategyCoach(
      'What questions should I ask customers?',
      createTestContext()
    );

    const lowerContent = content.toLowerCase();

    // Should include example questions or approaches
    const hasExamples =
      lowerContent.includes('for example') ||
      lowerContent.includes('such as') ||
      lowerContent.includes('like') ||
      content.includes('?'); // Question marks suggest example questions

    expect(hasExamples).toBe(true);
  });

  test('should address multi-part questions completely', async () => {
    const { content } = await executeStrategyCoach(
      'How do I research customers and what are the best practices?',
      createTestContext()
    );

    const lowerContent = content.toLowerCase();

    // Should address "how" part
    const addressesHow =
      lowerContent.includes('approach') ||
      lowerContent.includes('method') ||
      lowerContent.includes('process');

    // Should address "best practices" part
    const addressesBestPractices =
      lowerContent.includes('practice') ||
      lowerContent.includes('recommend') ||
      lowerContent.includes('effective');

    expect(addressesHow && addressesBestPractices).toBe(true);
  });
});
