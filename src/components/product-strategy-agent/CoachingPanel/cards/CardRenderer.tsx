'use client';

import type {
  ExplanationCardData,
  RequestCardData,
  DebateIdeaCardData,
  QuestionCardData,
  CardAction,
} from '@/types/coaching-cards';
import { ExplanationCard } from './ExplanationCard';
import { RequestCard } from './RequestCard';
import { DebateCard } from './DebateCard';

// Note: QuestionCardData is included for type compatibility but not rendered in v1
type RenderableCard = ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData;

interface CardRendererProps {
  card: RenderableCard;
  onAction?: (action: CardAction) => void;
  onDismiss?: (cardId: string) => void;
  onNavigateToCanvas?: (target: { phase: string; section?: string }) => void;
}

/**
 * CardRenderer - Dispatches card data to the appropriate card component
 *
 * Renders rich multimedia cards within the coaching chat stream.
 * Each card type has its own component with specialized rendering.
 */
export function CardRenderer({
  card,
  onAction,
  onDismiss,
  onNavigateToCanvas,
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

    default:
      console.warn('Unknown card type:', (card as { type: string }).type);
      return null;
  }
}
