'use client';

import type {
  ExplanationCardData,
  RequestCardData,
  DebateIdeaCardData,
  QuestionCardData,
  ResearchAreaGroupData,
  BetQuestionCardData,
  ConfidenceLevel,
  CoachReview,
  CardAction,
} from '@/types/coaching-cards';
import { ExplanationCard } from './ExplanationCard';
import { RequestCard } from './RequestCard';
import { DebateCard } from './DebateCard';
import { QuestionCard } from './QuestionCard';

type RenderableCard = ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData | ResearchAreaGroupData | BetQuestionCardData;

interface CardRendererProps {
  card: RenderableCard;
  conversationId?: string;
  onAction?: (action: CardAction) => void;
  onDismiss?: (cardId: string) => void;
  onNavigateToCanvas?: (target: { phase: string; section?: string }) => void;
  onQuestionSubmit?: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onQuestionReview?: (draftAnswer: string) => Promise<CoachReview | null>;
  existingAnswer?: string;
  existingConfidence?: ConfidenceLevel | null;
}

/**
 * CardRenderer - Dispatches card data to the appropriate card component
 *
 * Renders rich multimedia cards within the coaching chat stream.
 * Each card type has its own component with specialized rendering.
 */
export function CardRenderer({
  card,
  conversationId,
  onAction,
  onDismiss,
  onNavigateToCanvas,
  onQuestionSubmit,
  onQuestionReview,
  existingAnswer,
  existingConfidence,
}: CardRendererProps) {
  switch (card.type) {
    case 'explanation':
      return (
        <ExplanationCard
          data={card}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      );

    case 'request':
      return (
        <RequestCard
          data={card}
          onAction={onAction}
          onNavigateToCanvas={onNavigateToCanvas}
        />
      );

    case 'debate':
      return (
        <DebateCard
          data={card}
          onAction={onAction}
        />
      );

    case 'question':
      if (!conversationId || !onQuestionSubmit) {
        console.warn('QuestionCard requires conversationId and onQuestionSubmit');
        return null;
      }
      return (
        <QuestionCard
          data={card}
          conversationId={conversationId}
          onSubmit={onQuestionSubmit}
          onRequestReview={onQuestionReview}
          existingAnswer={existingAnswer}
          existingConfidence={existingConfidence}
        />
      );

    case 'research_area_group':
      // research_area_group cards are handled by the v1 CardRenderer;
      // v2 can safely ignore them until a v2-specific component is built.
      console.warn('ResearchAreaGroup card received in v2 CardRenderer — not yet supported');
      return null;

    case 'bet_question':
      // bet_question cards are handled by the v1 CardRenderer;
      // v2 can safely ignore them until a v2-specific component is built.
      console.warn('BetQuestionCard received in v2 CardRenderer — not yet supported');
      return null;

    default:
      console.warn('Unknown card type:', (card as { type: string }).type);
      return null;
  }
}
