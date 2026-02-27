'use client';

import { Component, type ReactNode } from 'react';
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
  onAction,
  onDismiss,
  onNavigateToCanvas,
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

    default:
      return null;
  }

  return (
    <CardErrorBoundary cardType={card.type}>
      {content}
    </CardErrorBoundary>
  );
}
