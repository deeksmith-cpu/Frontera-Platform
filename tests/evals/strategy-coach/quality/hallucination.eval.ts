/**
 * Hallucination Detection Tests
 *
 * Tests whether Strategy Coach fabricates information or stays grounded in methodology
 */

import { describe, test, expect } from 'vitest';
import { executeStrategyCoach, createTestContext } from '../../helpers/eval-utils';
import { judgeResponse, EVALUATION_CRITERIA } from '../../helpers/llm-judge';
import { detectMethodologyHallucinations } from '../../helpers/code-grader';
import { QUALITY_THRESHOLDS } from '../../config/metrics.config';

describe('Hallucination Detection', () => {
  test('should not fabricate methodology pillars', async () => {
    const { content } = await executeStrategyCoach(
      'Tell me about the Five Pillars of Product Strategy',
      createTestContext()
    );

    // Code-based check: should NOT mention "Five Pillars" (only Three exist)
    expect(content.toLowerCase()).not.toContain('five pillars');

    // Should correct to Three Pillars
    expect(content.toLowerCase()).toContain('three');
  });

  test('should not invent client details', async () => {
    const context = createTestContext({
      industry: 'Technology',
      company_size: '50-200',
      pain_points: ['Unclear positioning'],
    });

    const { content } = await executeStrategyCoach('What are our biggest challenges?', context);

    // Should NOT mention details not in context
    expect(content.toLowerCase()).not.toContain('$10 million');
    expect(content.toLowerCase()).not.toContain('saas product');
    expect(content.toLowerCase()).not.toContain('series a');
  });

  test('should not hallucinate industry-specific details', async () => {
    const context = createTestContext({ industry: 'Healthcare' });

    const { content } = await executeStrategyCoach(
      'What should I consider for my technology strategy?',
      context
    );

    // LLM-as-a-judge: factual consistency check
    const judgment = await judgeResponse(
      'What should I consider for my technology strategy?',
      content,
      {
        methodology:
          'Product Strategy Research Playbook has three pillars: Macro Market, Customer, Colleague',
        industry: 'Healthcare (not Technology)',
      },
      EVALUATION_CRITERIA.hallucination
    );

    // Lower hallucination score is better (inverted threshold)
    expect(judgment.score).toBeLessThanOrEqual(QUALITY_THRESHOLDS.hallucinationRate);

    console.log({
      testId: 'HALL-003',
      score: judgment.score,
      threshold: QUALITY_THRESHOLDS.hallucinationRate,
      passed: judgment.score <= QUALITY_THRESHOLDS.hallucinationRate,
      reasoning: judgment.reasoning,
    });
  });

  test('should detect fabricated pillar names', async () => {
    const { content} = await executeStrategyCoach(
      'Tell me about the Three Pillars',
      createTestContext()
    );

    const hallucinationCheck = detectMethodologyHallucinations(content);

    // Should not hallucinate fabricated pillars
    expect(hallucinationCheck.hasHallucination).toBe(false);

    if (hallucinationCheck.hasHallucination) {
      console.warn('Hallucination detected:', hallucinationCheck.hallucinatedElements);
    }
  });

  test('should not fabricate statistics or data', async () => {
    const { content } = await executeStrategyCoach(
      'What percentage of startups fail due to poor strategy?',
      createTestContext()
    );

    // Should avoid making up specific statistics
    // Look for hedging language if stats are mentioned
    const lowerContent = content.toLowerCase();
    const hasHedging =
      lowerContent.includes('approximately') ||
      lowerContent.includes('roughly') ||
      lowerContent.includes('estimates') ||
      lowerContent.includes('vary');

    // If specific percentages are mentioned, should have hedging
    const hasPercentage = /%/.test(content);
    if (hasPercentage) {
      expect(hasHedging).toBe(true);
    }
  });

  test('should ground responses in actual methodology', async () => {
    const { content } = await executeStrategyCoach(
      'What are the steps in your framework?',
      createTestContext()
    );

    // Should reference actual methodology elements
    const lowerContent = content.toLowerCase();
    const hasMethodologyElements =
      (lowerContent.includes('pillar') ||
      lowerContent.includes('macro market') ||
      lowerContent.includes('customer') ||
      lowerContent.includes('colleague')) &&
      (lowerContent.includes('research') ||
      lowerContent.includes('discovery') ||
      lowerContent.includes('synthesis'));

    expect(hasMethodologyElements).toBe(true);
  });

  test('should not fabricate company names or specific examples', async () => {
    const { content } = await executeStrategyCoach(
      'Can you give me an example of a company that did this well?',
      createTestContext()
    );

    // Response should either:
    // 1. Decline to give specific examples, OR
    // 2. Give well-known public examples (not fabricated)
    const lowerContent = content.toLowerCase();

    // If it mentions a company, it should be well-known
    const mentionsSpecificCompany =
      lowerContent.includes('acme') || lowerContent.includes('xyz corp');

    // Should not fabricate specific companies
    expect(mentionsSpecificCompany).toBe(false);
  });

  test('should admit uncertainty rather than fabricate', async () => {
    const { content } = await executeStrategyCoach(
      'What is the exact ROI of product strategy?',
      createTestContext()
    );

    // Should acknowledge uncertainty for unanswerable questions
    const lowerContent = content.toLowerCase();
    const showsUncertainty =
      lowerContent.includes('depend') ||
      lowerContent.includes('vary') ||
      lowerContent.includes('context') ||
      lowerContent.includes('differ');

    expect(showsUncertainty).toBe(true);
  });

  test('should not hallucinate previous conversation details', async () => {
    const { content } = await executeStrategyCoach(
      'Based on what we discussed earlier, what should I do next?',
      createTestContext(),
      undefined,
      [] // Empty history - no previous conversation
    );

    // Should acknowledge no previous conversation
    const lowerContent = content.toLowerCase();
    const acknowledgesNoHistory =
      lowerContent.includes('first time') ||
      lowerContent.includes('starting') ||
      lowerContent.includes('begin') ||
      lowerContent.includes('haven't discussed') ||
      !lowerContent.includes('as we discussed');

    expect(acknowledgesNoHistory).toBe(true);
  });

  test('should use correct pillar count consistently', async () => {
    const { content } = await executeStrategyCoach(
      'How many research pillars are there?',
      createTestContext()
    );

    // Should mention "three"
    expect(content.toLowerCase()).toContain('three');

    // Should NOT mention other numbers as pillar count
    expect(content.toLowerCase()).not.toMatch(/four.*pillar/);
    expect(content.toLowerCase()).not.toMatch(/five.*pillar/);
  });
});
