'use client';

import { Component, type ReactNode } from 'react';
import type {
  ExplanationCardData,
  RequestCardData,
  DebateIdeaCardData,
  QuestionCardData,
  ResearchAreaGroupData,
  BetQuestionCardData,
  CardAction,
} from '@/types/coaching-cards';
import { ExplanationCard } from './ExplanationCard';
import { RequestCard } from './RequestCard';
import { DebateCard } from './DebateCard';
import { QuestionCard } from './QuestionCard';
import { ResearchAreaGroup } from './ResearchAreaGroup';
import { BetQuestionCard } from './BetQuestionCard';

type RenderableCard = ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData | ResearchAreaGroupData | BetQuestionCardData;

interface CardRendererProps {
  card: RenderableCard;
  conversationId?: string;
  onAction?: (action: CardAction) => void;
  onDismiss?: (cardId: string) => void;
  onNavigateToCanvas?: (target: { phase: string; section?: string }) => void;
  onQuestionSubmit?: (territory: string, researchArea: string, questionIndex: number, answer: string, confidence: import('@/types/coaching-cards').ConfidenceLevel | null) => Promise<boolean>;
}

/**
 * Error boundary that catches card render failures and shows a silent fallback.
 */
class CardErrorBoundary extends Component<
  { cardType: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { cardType: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`CardRenderer: "${this.props.cardType}" card failed to render:`, error.message);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/**
 * CardRenderer - Dispatches card data to the appropriate card component
 *
 * Renders rich multimedia cards within the coaching chat stream.
 * Each card type has its own component with specialized rendering.
 * Wrapped in an error boundary so a malformed card never crashes the page.
 */
export function CardRenderer({
  card,
  conversationId,
  onAction,
  onDismiss,
  onNavigateToCanvas,
  onQuestionSubmit,
}: CardRendererProps) {
  if (!card || typeof card !== 'object' || !card.type) {
    return null;
  }

  let content: ReactNode;

  switch (card.type) {
    case 'explanation':
      content = (
        <ExplanationCard
          data={card}
          onDismiss={onDismiss}
          onAction={onAction}
        />
      );
      break;

    case 'request':
      content = (
        <RequestCard
          data={card}
          onAction={onAction}
          onNavigateToCanvas={onNavigateToCanvas}
        />
      );
      break;

    case 'debate':
      content = (
        <DebateCard
          data={card}
          onAction={onAction}
        />
      );
      break;

    case 'question':
      content = (
        <QuestionCard
          data={card}
          conversationId={conversationId || ''}
          onSubmit={async (answer, confidence) => {
            if (onQuestionSubmit) {
              return onQuestionSubmit(
                card.territory,
                card.research_area,
                card.question_index,
                answer,
                confidence
              );
            }
            return false;
          }}
          onAction={onAction}
        />
      );
      break;

    case 'research_area_group':
      content = (
        <ResearchAreaGroup
          data={card as ResearchAreaGroupData}
          conversationId={conversationId || ''}
          onQuestionSubmit={onQuestionSubmit!}
          onAction={onAction}
        />
      );
      break;

    case 'bet_question':
      content = (
        <BetQuestionCard
          data={card as BetQuestionCardData}
          conversationId={conversationId || ''}
          onSubmit={async (answer, confidence) => {
            if (onQuestionSubmit) {
              return onQuestionSubmit(
                (card as BetQuestionCardData).territory,
                (card as BetQuestionCardData).research_area,
                (card as BetQuestionCardData).question_index,
                answer,
                confidence
              );
            }
            return false;
          }}
          onAction={onAction}
        />
      );
      break;

    default:
      return null;
  }

  return (
    <CardErrorBoundary cardType={card.type}>
      {content}
    </CardErrorBoundary>
  );
}
