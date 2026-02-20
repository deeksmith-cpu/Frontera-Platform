/**
 * Message Classifier
 *
 * Classifies assistant messages into types for visual badges.
 * Uses [MessageType:...] markers emitted by the LLM, with keyword
 * heuristics as fallback.
 */

export type MessageClassification =
  | 'insight'
  | 'research-question'
  | 'challenge'
  | 'framework'
  | 'general';

export interface ClassificationResult {
  type: MessageClassification;
  /** Message content with [MessageType:...] marker stripped */
  cleanContent: string;
}

const MESSAGE_TYPE_REGEX = /\[MessageType:([\w-]+)\]/g;

const VALID_TYPES = new Set<MessageClassification>([
  'insight',
  'research-question',
  'challenge',
  'framework',
  'general',
]);

/**
 * Classify a message from markers or heuristics.
 */
export function classifyMessage(content: string): ClassificationResult {
  // Try marker-based classification first
  const markerMatch = MESSAGE_TYPE_REGEX.exec(content);
  if (markerMatch) {
    const type = markerMatch[1] as MessageClassification;
    const cleanContent = content.replace(MESSAGE_TYPE_REGEX, '').trim();
    if (VALID_TYPES.has(type)) {
      return { type, cleanContent };
    }
    return { type: 'general', cleanContent };
  }

  // Keyword heuristics fallback
  const lower = content.toLowerCase();

  // Research question: asks the user about their business context
  if (
    (lower.includes('what') || lower.includes('how') || lower.includes('who') || lower.includes('tell me about')) &&
    (lower.includes('your') || lower.includes('the company') || lower.includes('customers') || lower.includes('competitors')) &&
    content.includes('?')
  ) {
    return { type: 'research-question', cleanContent: content };
  }

  // Challenge: pushes back on assumptions
  if (
    lower.includes('have you considered') ||
    lower.includes('what if') ||
    lower.includes('push back') ||
    lower.includes('challenge') ||
    lower.includes("devil's advocate") ||
    lower.includes('what evidence supports') ||
    lower.includes('how would you defend')
  ) {
    return { type: 'challenge', cleanContent: content };
  }

  // Framework: references strategic frameworks
  if (
    lower.includes('playing to win') ||
    lower.includes('jobs to be done') ||
    lower.includes('jtbd') ||
    lower.includes('porter') ||
    lower.includes('framework') ||
    lower.includes('3cs') ||
    lower.includes('distinctive capabilities') ||
    lower.includes('where to play') ||
    lower.includes('how to win')
  ) {
    return { type: 'framework', cleanContent: content };
  }

  // Insight: surfaces a key finding
  if (
    lower.includes('[insight:') ||
    lower.includes('key insight') ||
    lower.includes('this suggests') ||
    lower.includes('the pattern') ||
    lower.includes('strategic implication')
  ) {
    return { type: 'insight', cleanContent: content };
  }

  return { type: 'general', cleanContent: content };
}
