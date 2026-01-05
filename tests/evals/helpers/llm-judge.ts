/**
 * LLM-as-a-Judge Evaluation
 *
 * Use Claude to evaluate the quality of Strategy Coach responses
 */

import Anthropic from '@anthropic-ai/sdk';
import { EVAL_CONFIG } from '../config/metrics.config';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface JudgmentCriteria {
  dimension: string;
  description: string;
  scoringRubric: {
    excellent: string; // Score 0.9-1.0
    good: string; // Score 0.7-0.89
    acceptable: string; // Score 0.5-0.69
    poor: string; // Score 0-0.49
  };
}

export interface JudgmentResult {
  score: number; // 0-1
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Use Claude as LLM-as-a-judge to evaluate response quality
 */
export async function judgeResponse(
  input: string,
  output: string,
  context: Record<string, unknown>,
  criteria: JudgmentCriteria
): Promise<JudgmentResult> {
  const prompt = `You are an expert evaluator assessing the quality of an AI coaching response.

**Evaluation Dimension:** ${criteria.dimension}
${criteria.description}

**Scoring Rubric:**
- Excellent (0.9-1.0): ${criteria.scoringRubric.excellent}
- Good (0.7-0.89): ${criteria.scoringRubric.good}
- Acceptable (0.5-0.69): ${criteria.scoringRubric.acceptable}
- Poor (0-0.49): ${criteria.scoringRubric.poor}

**Context:**
${JSON.stringify(context, null, 2)}

**User Input:**
"${input}"

**AI Response:**
"${output}"

**Instructions:**
1. First, provide your chain-of-thought reasoning (2-3 sentences analyzing the response)
2. Then, assign a score from 0 to 1 based on the rubric
3. State your confidence level (high/medium/low)

**Output Format (JSON):**
{
  "reasoning": "Your analysis here",
  "score": 0.85,
  "confidence": "high"
}`;

  try {
    const response = await client.messages.create({
      model: EVAL_CONFIG.judgeModel,
      max_tokens: EVAL_CONFIG.maxTokens,
      temperature: EVAL_CONFIG.temperature,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('LLM judge did not return valid JSON');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate score range
    if (result.score < 0 || result.score > 1) {
      throw new Error(`Invalid score: ${result.score}. Must be between 0 and 1.`);
    }

    return {
      score: result.score,
      reasoning: result.reasoning,
      confidence: result.confidence,
    };
  } catch (error) {
    console.error('Error in LLM judge evaluation:', error);
    throw error;
  }
}

/**
 * Predefined evaluation criteria for common metrics
 */
export const EVALUATION_CRITERIA: Record<string, JudgmentCriteria> = {
  relevance: {
    dimension: 'Relevance',
    description: 'Does the response directly address the user's question or input?',
    scoringRubric: {
      excellent: 'Directly answers the question with relevant, on-point guidance',
      good: 'Addresses the question but includes some tangential information',
      acceptable: 'Partially addresses the question but lacks focus',
      poor: 'Does not address the user's question or is off-topic',
    },
  },

  hallucination: {
    dimension: 'Hallucination (Factual Consistency)',
    description:
      'Does the response contain fabricated information not grounded in the methodology or context? (Lower score is better)',
    scoringRubric: {
      excellent: 'All information is factually accurate and grounded in methodology',
      good: 'Minor embellishments but core facts are accurate',
      acceptable: 'Some speculative claims but clearly marked as such',
      poor: 'Contains fabricated methodology, false claims, or ungrounded assertions',
    },
  },

  toneAdherence: {
    dimension: 'Tone Adherence',
    description:
      'Does the response maintain the Frontera coaching voice: confident, professional, warm but not patronizing?',
    scoringRubric: {
      excellent: 'Perfect coaching tone: confident, warm, respectful, empowering',
      good: 'Generally good tone with minor slips (slightly generic or overly formal)',
      acceptable: 'Inconsistent tone (mix of good coaching and generic corporate speak)',
      poor: 'Patronizing, overly generic, robotic, or unprofessional tone',
    },
  },

  completeness: {
    dimension: 'Completeness',
    description: 'Does the response provide sufficient detail and actionable guidance?',
    scoringRubric: {
      excellent: 'Comprehensive guidance with clear next steps and rationale',
      good: 'Adequate detail with some actionable guidance',
      acceptable: 'Surface-level information, limited actionability',
      poor: 'Vague, incomplete, or lacks any actionable guidance',
    },
  },

  accuracy: {
    dimension: 'Accuracy',
    description: 'Is the information methodologically correct and factually sound?',
    scoringRubric: {
      excellent: 'All methodology references are accurate and properly explained',
      good: 'Mostly accurate with minor imprecisions',
      acceptable: 'Generally correct but some details are unclear or simplified',
      poor: 'Contains methodological errors or misrepresents the framework',
    },
  },

  contextUtilization: {
    dimension: 'Context Utilization',
    description:
      'Does the response effectively incorporate client-specific context (industry, pain points, strategic focus)?',
    scoringRubric: {
      excellent: 'Deeply personalized with multiple context references and tailored guidance',
      good: 'References context meaningfully in 1-2 places',
      acceptable: 'Generic response with token context mention',
      poor: 'Ignores context entirely, could apply to any client',
    },
  },

  actionability: {
    dimension: 'Actionability',
    description: 'Does the response provide clear, specific next steps the user can take?',
    scoringRubric: {
      excellent: 'Multiple specific, actionable next steps with clear guidance',
      good: 'Some actionable suggestions, reasonably specific',
      acceptable: 'Vague suggestions, unclear how to apply',
      poor: 'No actionable guidance, purely theoretical or abstract',
    },
  },
};

/**
 * Run multiple evaluations in parallel
 */
export async function judgeMultipleDimensions(
  input: string,
  output: string,
  context: Record<string, unknown>,
  criteriaKeys: string[]
): Promise<Record<string, JudgmentResult>> {
  const results: Record<string, JudgmentResult> = {};

  const judgments = await Promise.all(
    criteriaKeys.map(async (key) => {
      const criteria = EVALUATION_CRITERIA[key];
      if (!criteria) {
        throw new Error(`Unknown evaluation criteria: ${key}`);
      }
      const result = await judgeResponse(input, output, context, criteria);
      return { key, result };
    })
  );

  for (const { key, result } of judgments) {
    results[key] = result;
  }

  return results;
}
