/**
 * Code-Based Grading Functions
 *
 * Fast, deterministic validation using code instead of LLM judging
 */

/**
 * Check if response contains required keywords (threshold-based)
 */
export function hasRequiredKeywords(
  response: string,
  keywords: string[],
  threshold: number = 0.5
): { passed: boolean; foundCount: number; totalCount: number; foundKeywords: string[] } {
  const lowerResponse = response.toLowerCase();
  const foundKeywords = keywords.filter((kw) => lowerResponse.includes(kw.toLowerCase()));

  return {
    passed: foundKeywords.length / keywords.length >= threshold,
    foundCount: foundKeywords.length,
    totalCount: keywords.length,
    foundKeywords,
  };
}

/**
 * Check if response mentions a specific pillar
 */
export function checkPillarMention(response: string): { mentioned: boolean; pillar?: string } {
  const lowerResponse = response.toLowerCase();

  if (lowerResponse.includes('macro market') || lowerResponse.includes('macromarket')) {
    return { mentioned: true, pillar: 'macroMarket' };
  }
  if (
    lowerResponse.includes('customer pillar') ||
    lowerResponse.includes('customer research') ||
    (lowerResponse.includes('customer') && lowerResponse.includes('pillar'))
  ) {
    return { mentioned: true, pillar: 'customer' };
  }
  if (
    lowerResponse.includes('colleague pillar') ||
    lowerResponse.includes('internal research') ||
    (lowerResponse.includes('colleague') && lowerResponse.includes('pillar'))
  ) {
    return { mentioned: true, pillar: 'colleague' };
  }

  return { mentioned: false };
}

/**
 * Check if response contains follow-up questions
 */
export function hasFollowUpQuestions(response: string): {
  hasQuestions: boolean;
  questionCount: number;
} {
  const questionMatches = response.match(/\?/g);
  const questionCount = questionMatches ? questionMatches.length : 0;

  return {
    hasQuestions: questionCount > 0,
    questionCount,
  };
}

/**
 * Validate response length (word count)
 */
export function checkResponseLength(
  response: string,
  minWords: number = 50,
  maxWords: number = 500
): { valid: boolean; wordCount: number; withinRange: boolean } {
  const wordCount = response.trim().split(/\s+/).length;
  const withinRange = wordCount >= minWords && wordCount <= maxWords;

  return {
    valid: withinRange,
    wordCount,
    withinRange,
  };
}

/**
 * Extract industry mentions from response
 */
export function extractIndustryMentions(
  response: string,
  expectedIndustry: string
): { mentioned: boolean; count: number } {
  const lowerResponse = response.toLowerCase();
  const lowerIndustry = expectedIndustry.toLowerCase();

  const matches = lowerResponse.match(new RegExp(lowerIndustry, 'gi')) || [];

  return {
    mentioned: matches.length > 0,
    count: matches.length,
  };
}

/**
 * Check for prohibited phrases (e.g., patronizing language)
 */
export function checkProhibitedPhrases(
  response: string,
  prohibitedPhrases: string[]
): { clean: boolean; foundPhrases: string[] } {
  const lowerResponse = response.toLowerCase();
  const foundPhrases = prohibitedPhrases.filter((phrase) =>
    lowerResponse.includes(phrase.toLowerCase())
  );

  return {
    clean: foundPhrases.length === 0,
    foundPhrases,
  };
}

/**
 * Detect hallucination indicators (fabricated pillar names, methodology elements)
 */
export function detectMethodologyHallucinations(response: string): {
  hasHallucination: boolean;
  hallucinatedElements: string[];
} {
  const lowerResponse = response.toLowerCase();
  const hallucinatedElements: string[] = [];

  // Check for incorrect pillar count
  if (lowerResponse.includes('four pillars') || lowerResponse.includes('five pillars')) {
    hallucinatedElements.push('Incorrect pillar count (should be three)');
  }

  // Check for fabricated pillar names
  const fabricatedPillars = [
    'technology pillar',
    'innovation pillar',
    'execution pillar',
    'strategy pillar',
  ];
  for (const fabricated of fabricatedPillars) {
    if (lowerResponse.includes(fabricated)) {
      hallucinatedElements.push(`Fabricated pillar: "${fabricated}"`);
    }
  }

  // Check for non-existent methodology elements
  if (lowerResponse.includes('ten-step process') || lowerResponse.includes('12-week program')) {
    hallucinatedElements.push('Fabricated process timeline');
  }

  return {
    hasHallucination: hallucinatedElements.length > 0,
    hallucinatedElements,
  };
}

/**
 * Check if response provides actionable guidance
 */
export function hasActionableGuidance(response: string): {
  hasGuidance: boolean;
  guidanceIndicators: string[];
} {
  const lowerResponse = response.toLowerCase();

  const guidanceKeywords = [
    'recommend',
    'suggest',
    'consider',
    'start with',
    'focus on',
    'next step',
    'first,',
    'approach',
    'strategy',
    'you could',
    'you should',
  ];

  const foundIndicators = guidanceKeywords.filter((keyword) =>
    lowerResponse.includes(keyword)
  );

  return {
    hasGuidance: foundIndicators.length > 0,
    guidanceIndicators: foundIndicators,
  };
}

/**
 * Analyze tone for patronizing language
 */
export function detectPatronizingTone(response: string): {
  isPatronizing: boolean;
  patronizingPhrases: string[];
} {
  const patronizingIndicators = [
    'don't worry',
    'it's easy',
    'it's simple',
    'just do this',
    'simply',
    'obviously',
    'clearly you',
    'you just need to',
    'all you have to do',
  ];

  const result = checkProhibitedPhrases(response, patronizingIndicators);

  return {
    isPatronizing: !result.clean,
    patronizingPhrases: result.foundPhrases,
  };
}

/**
 * Check for corporate buzzwords (overuse indicates generic response)
 */
export function detectBuzzwordOveruse(
  response: string,
  threshold: number = 3
): { overused: boolean; buzzwordCount: number; foundBuzzwords: string[] } {
  const buzzwords = [
    'synergy',
    'leverage',
    'disrupt',
    'paradigm shift',
    'best-in-class',
    'world-class',
    'cutting-edge',
    'innovative solution',
    'game-changer',
    'low-hanging fruit',
  ];

  const lowerResponse = response.toLowerCase();
  const foundBuzzwords = buzzwords.filter((buzzword) => lowerResponse.includes(buzzword));

  return {
    overused: foundBuzzwords.length > threshold,
    buzzwordCount: foundBuzzwords.length,
    foundBuzzwords,
  };
}

/**
 * Calculate a composite code-based quality score (0-1)
 */
export function calculateCodeBasedQualityScore(response: string, context: {
  expectedPillar?: string;
  expectedIndustry?: string;
  minWords?: number;
  maxWords?: number;
}): {
  score: number;
  breakdown: Record<string, number>;
} {
  const breakdown: Record<string, number> = {};

  // Length check (0.2 weight)
  const lengthCheck = checkResponseLength(response, context.minWords || 50, context.maxWords || 500);
  breakdown.length = lengthCheck.valid ? 1 : 0;

  // Guidance check (0.2 weight)
  const guidanceCheck = hasActionableGuidance(response);
  breakdown.guidance = guidanceCheck.hasGuidance ? 1 : 0;

  // Hallucination check (0.3 weight, inverted)
  const hallucinationCheck = detectMethodologyHallucinations(response);
  breakdown.hallucination = hallucinationCheck.hasHallucination ? 0 : 1;

  // Tone check (0.15 weight, inverted)
  const toneCheck = detectPatronizingTone(response);
  breakdown.tone = toneCheck.isPatronizing ? 0 : 1;

  // Buzzword check (0.15 weight, inverted)
  const buzzwordCheck = detectBuzzwordOveruse(response, 2);
  breakdown.buzzword = buzzwordCheck.overused ? 0 : 1;

  // Calculate weighted score
  const score =
    breakdown.length * 0.2 +
    breakdown.guidance * 0.2 +
    breakdown.hallucination * 0.3 +
    breakdown.tone * 0.15 +
    breakdown.buzzword * 0.15;

  return { score, breakdown };
}
