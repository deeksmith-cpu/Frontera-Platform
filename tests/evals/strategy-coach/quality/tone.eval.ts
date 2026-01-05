/**
 * Tone Adherence Tests
 *
 * Tests whether Strategy Coach maintains confident, professional, non-patronizing tone
 */

import { describe, test, expect } from 'vitest';
import { executeStrategyCoach, createTestContext } from '../../helpers/eval-utils';
import { judgeResponse, EVALUATION_CRITERIA } from '../../helpers/llm-judge';
import { detectPatronizingTone, detectBuzzwordOveruse } from '../../helpers/code-grader';
import { QUALITY_THRESHOLDS } from '../../config/metrics.config';
import { allTestCases } from '../../fixtures/test-conversations';

describe('Tone Adherence', () => {
  // Use a sample of test cases for tone evaluation (20 cases)
  const toneTestCases = [
    ...allTestCases.filter((tc) => tc.category === 'discovery').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'research').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'synthesis').slice(0, 5),
    ...allTestCases.filter((tc) => tc.category === 'planning').slice(0, 5),
  ];

  test.each(toneTestCases)(
    'should maintain appropriate coaching tone for: $id',
    async (testCase) => {
      const { content } = await executeStrategyCoach(testCase.userMessage, testCase.context);

      // LLM-as-a-judge for nuanced tone evaluation
      const judgment = await judgeResponse(
        testCase.userMessage,
        content,
        { expectedTone: 'Confident, professional, warm but not patronizing' },
        EVALUATION_CRITERIA.toneAdherence
      );

      console.log({
        testId: testCase.id,
        score: judgment.score,
        threshold: QUALITY_THRESHOLDS.toneAdherence,
        passed: judgment.score >= QUALITY_THRESHOLDS.toneAdherence,
        reasoning: judgment.reasoning,
      });

      expect(judgment.score).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS.toneAdherence);
    },
    {
      timeout: 60000,
      retry: 1,
    }
  );

  test('should avoid patronizing language', async () => {
    const { content } = await executeStrategyCoach(
      'I'm struggling with my product strategy',
      createTestContext()
    );

    // Code-based check: detect patronizing phrases
    const toneCheck = detectPatronizingTone(content);

    expect(toneCheck.isPatronizing).toBe(false);

    if (toneCheck.isPatronizing) {
      console.warn('Patronizing phrases found:', toneCheck.patronizingPhrases);
    }
  });

  test('should avoid overly corporate jargon', async () => {
    const { content } = await executeStrategyCoach(
      'How do I align stakeholders?',
      createTestContext()
    );

    // Should use clear language, not excessive buzzwords
    const buzzwordCheck = detectBuzzwordOveruse(content, 2);

    expect(buzzwordCheck.overused).toBe(false);

    if (buzzwordCheck.overused) {
      console.warn('Buzzword overuse detected:', buzzwordCheck.foundBuzzwords);
    }
  });

  test('should maintain confident tone', async () => {
    const { content } = await executeStrategyCoach(
      'I need help with strategy',
      createTestContext()
    );

    // Should not use overly tentative language
    const lowerContent = content.toLowerCase();
    const hasConfidence =
      lowerContent.includes('recommend') ||
      lowerContent.includes('suggest') ||
      lowerContent.includes('approach') ||
      lowerContent.includes('focus on');

    expect(hasConfidence).toBe(true);

    // Should not be overly tentative
    const tooTentative =
      (lowerContent.match(/maybe|perhaps|possibly/g) || []).length > 3;

    expect(tooTentative).toBe(false);
  });

  test('should be professional yet approachable', async () => {
    const { content } = await executeStrategyCoach(
      'I'm new to product strategy',
      createTestContext()
    );

    // Should acknowledge user situation warmly
    const lowerContent = content.toLowerCase();
    const isWarm =
      lowerContent.includes('appreciate') ||
      lowerContent.includes('understand') ||
      lowerContent.includes('help') ||
      lowerContent.includes('glad');

    expect(isWarm).toBe(true);

    // But should NOT be overly casual
    const tooCasual =
      lowerContent.includes('hey') ||
      lowerContent.includes('no worries') ||
      lowerContent.includes('totally');

    expect(tooCasual).toBe(false);
  });

  test('should avoid condescension when user makes mistakes', async () => {
    const { content } = await executeStrategyCoach(
      'I thought there were Five Pillars?',
      createTestContext()
    );

    // Should correct gracefully without condescension
    const lowerContent = content.toLowerCase();

    // Should NOT use condescending phrases
    const isCondescending =
      lowerContent.includes('actually') && lowerContent.includes('wrong') ||
      lowerContent.includes('incorrect assumption') ||
      lowerContent.includes('you're mistaken');

    expect(isCondescending).toBe(false);

    // Should provide clarification
    expect(lowerContent).toContain('three');
  });

  test('should maintain empathy for user challenges', async () => {
    const { content } = await executeStrategyCoach(
      'We've failed at strategy multiple times',
      createTestContext({
        previous_attempts: 'Multiple failed strategic planning initiatives',
      })
    );

    // Should acknowledge challenges empathetically
    const lowerContent = content.toLowerCase();
    const isEmpathetic =
      lowerContent.includes('understand') ||
      lowerContent.includes('recognize') ||
      lowerContent.includes('challenge') ||
      lowerContent.includes('difficult');

    expect(isEmpathetic).toBe(true);
  });

  test('should use active, direct language', async () => {
    const { content } = await executeStrategyCoach(
      'What should I do first?',
      createTestContext()
    );

    // Should use active verbs
    const lowerContent = content.toLowerCase();
    const hasActiveLanguage =
      lowerContent.includes('start') ||
      lowerContent.includes('begin') ||
      lowerContent.includes('focus') ||
      lowerContent.includes('explore');

    expect(hasActiveLanguage).toBe(true);
  });

  test('should avoid overly academic or theoretical tone', async () => {
    const { content } = await executeStrategyCoach(
      'How do I improve my strategy?',
      createTestContext()
    );

    // Should be practical, not overly academic
    const lowerContent = content.toLowerCase();
    const hasPracticalFocus =
      lowerContent.includes('practical') ||
      lowerContent.includes('actionable') ||
      lowerContent.includes('apply') ||
      lowerContent.includes('use');

    // Academic jargon check
    const academicJargonCount = (
      lowerContent.match(/theoretical framework|empirical evidence|meta-analysis/g) || []
    ).length;

    expect(hasPracticalFocus || academicJargonCount === 0).toBe(true);
  });
});
