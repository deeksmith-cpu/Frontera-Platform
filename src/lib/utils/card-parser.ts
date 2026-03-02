/**
 * Card Parser Utility
 * Parses [CARD:type]...[/CARD] markers from AI responses
 */

import type {
  ParsedMessageContent,
  ExplanationCardData,
  RequestCardData,
  DebateIdeaCardData,
  QuestionCardData,
  ResearchAreaGroupData,
  BetQuestionCardData,
  CardType,
} from '@/types/coaching-cards';

// Card marker pattern: [CARD:type]{ json }[/CARD]
const CARD_PATTERN = /\[CARD:(explanation|request|debate|question|research_area_group|bet_question)\]([\s\S]*?)\[\/CARD\]/g;

/**
 * Generate a deterministic card ID based on type and index
 * Uses content hash to ensure server/client consistency (avoids hydration errors)
 */
function generateCardId(type: string, index: number, content: string): string {
  // Simple hash of content for deterministic ID
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `card-${type}-${index}-${Math.abs(hash).toString(36)}`;
}

/**
 * Validate and enhance card data based on type
 */
function validateAndEnhanceCard(
  type: CardType,
  rawData: Record<string, unknown>,
  index: number,
  rawJson: string
): ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData | ResearchAreaGroupData | BetQuestionCardData | null {
  const baseCard = {
    id: generateCardId(type, index, rawJson),
    dismissible: true,
  };

  switch (type) {
    case 'explanation': {
      if (!rawData.title || !rawData.body) {
        console.warn('Explanation card missing required fields (title, body)');
        return null;
      }
      return {
        ...baseCard,
        type: 'explanation',
        title: String(rawData.title),
        body: String(rawData.body),
        icon: (rawData.icon as ExplanationCardData['icon']) || 'compass',
        phase: rawData.phase as ExplanationCardData['phase'],
        showPhaseDiagram: Boolean(rawData.showPhaseDiagram),
        phaseSteps: rawData.phaseSteps as ExplanationCardData['phaseSteps'],
        ctaLabel: rawData.ctaLabel as string | undefined,
        ctaAction: rawData.ctaAction as ExplanationCardData['ctaAction'],
        accentColor: rawData.accentColor as ExplanationCardData['accentColor'],
      } satisfies ExplanationCardData;
    }

    case 'request': {
      if (!rawData.title || !rawData.actionType || !rawData.actionLabel) {
        console.warn('Request card missing required fields');
        return null;
      }
      return {
        ...baseCard,
        type: 'request',
        title: String(rawData.title),
        description: String(rawData.description || ''),
        actionType: rawData.actionType as RequestCardData['actionType'],
        actionLabel: String(rawData.actionLabel),
        progress: rawData.progress as RequestCardData['progress'],
        canvasPanelTarget: rawData.canvasPanelTarget as RequestCardData['canvasPanelTarget'],
        urgency: (rawData.urgency as RequestCardData['urgency']) || 'recommended',
        deadline: rawData.deadline as string | undefined,
        icon: rawData.icon as RequestCardData['icon'],
      } satisfies RequestCardData;
    }

    case 'debate': {
      if (!rawData.title || !rawData.perspectiveA || !rawData.perspectiveB) {
        console.warn('Debate card missing required fields');
        return null;
      }
      return {
        ...baseCard,
        type: 'debate',
        trigger: (rawData.trigger as DebateIdeaCardData['trigger']) || 'coach_initiated',
        title: String(rawData.title),
        context: String(rawData.context || ''),
        perspectiveA: rawData.perspectiveA as DebateIdeaCardData['perspectiveA'],
        perspectiveB: rawData.perspectiveB as DebateIdeaCardData['perspectiveB'],
        tensionId: rawData.tensionId as string | undefined,
        userPosition: null,
        resolved: false,
      } satisfies DebateIdeaCardData;
    }

    case 'question': {
      if (!rawData.territory || !rawData.research_area || rawData.question_index === undefined || !rawData.question) {
        console.warn('Question card missing required fields (territory, research_area, question_index, question)');
        return null;
      }
      return {
        ...baseCard,
        type: 'question',
        territory: rawData.territory as QuestionCardData['territory'],
        research_area: String(rawData.research_area),
        research_area_title: rawData.research_area_title as string | undefined,
        question_index: Number(rawData.question_index),
        question: String(rawData.question),
        total_questions: Number(rawData.total_questions) || 3,
      } satisfies QuestionCardData;
    }

    case 'research_area_group': {
      if (!rawData.territory || !rawData.research_area || !rawData.questions || !Array.isArray(rawData.questions)) {
        console.warn('Research area group card missing required fields');
        return null;
      }
      return {
        ...baseCard,
        type: 'research_area_group',
        territory: rawData.territory as ResearchAreaGroupData['territory'],
        research_area: String(rawData.research_area),
        research_area_title: String(rawData.research_area_title || rawData.research_area),
        questions: (rawData.questions as Array<{ index: number; text: string }>).map(q => ({
          index: Number(q.index),
          text: String(q.text),
        })),
        total_questions: Number(rawData.total_questions) || (rawData.questions as Array<unknown>).length,
      } satisfies ResearchAreaGroupData;
    }

    case 'bet_question': {
      if (!rawData.question || !rawData.prepopulated_answer) {
        console.warn('Bet question card missing required fields');
        return null;
      }
      return {
        ...baseCard,
        type: 'bet_question',
        territory: (rawData.territory as BetQuestionCardData['territory']) || 'company',
        research_area: String(rawData.research_area || 'strategic_bets'),
        question_index: Number(rawData.question_index) || 0,
        question: String(rawData.question),
        total_questions: Number(rawData.total_questions) || 4,
        prepopulated_answer: String(rawData.prepopulated_answer),
        prepopulated_source: rawData.prepopulated_source ? String(rawData.prepopulated_source) : undefined,
        bet_field: (rawData.bet_field as BetQuestionCardData['bet_field']) || 'belief',
      } satisfies BetQuestionCardData;
    }

    default:
      return null;
  }
}

/**
 * Parse card markers from Claude's response content
 *
 * @example
 * Input: "Here's some guidance [CARD:explanation]{"title":"Welcome",...}[/CARD] More text"
 * Output: { textContent: "Here's some guidance  More text", cards: [...] }
 */
export function parseCardMarkers(content: string): ParsedMessageContent {
  const cards: Array<ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData | ResearchAreaGroupData | BetQuestionCardData> = [];
  let textContent = content;

  // Reset regex lastIndex for fresh matching
  CARD_PATTERN.lastIndex = 0;

  let match;
  let cardIndex = 0;
  const matchesToReplace: Array<{ fullMatch: string; replacement: string }> = [];

  while ((match = CARD_PATTERN.exec(content)) !== null) {
    const [fullMatch, cardType, jsonData] = match;

    try {
      // Trim and parse the JSON data
      const trimmedJson = jsonData.trim();
      const cardData = JSON.parse(trimmedJson);

      // Validate and enhance the card with deterministic ID
      const card = validateAndEnhanceCard(cardType as CardType, cardData, cardIndex, trimmedJson);

      if (card) {
        cards.push(card);
        cardIndex++;
        // Mark this match for removal from text content
        matchesToReplace.push({ fullMatch, replacement: '' });
      }
    } catch (e) {
      console.error('Failed to parse card JSON:', e, '\nRaw data:', jsonData);
      // Keep the malformed marker in the text for debugging
    }
  }

  // Remove matched cards from text content
  for (const { fullMatch, replacement } of matchesToReplace) {
    textContent = textContent.replace(fullMatch, replacement);
  }

  // Clean up extra whitespace
  textContent = textContent
    .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
    .trim();

  return {
    textContent,
    cards,
  };
}

/**
 * Check if a message contains any card markers
 */
export function hasCardMarkers(content: string): boolean {
  CARD_PATTERN.lastIndex = 0;
  return CARD_PATTERN.test(content);
}

/**
 * Extract card count from content without full parsing
 */
export function countCards(content: string): number {
  CARD_PATTERN.lastIndex = 0;
  const matches = content.match(CARD_PATTERN);
  return matches?.length ?? 0;
}
