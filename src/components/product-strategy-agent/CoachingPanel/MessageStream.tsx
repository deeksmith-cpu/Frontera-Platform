'use client';

import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingMessage } from './StreamingMessage';
import { CardRenderer } from './cards';
import { parseCardMarkers, hasCardMarkers } from '@/lib/utils/card-parser';
import type { Database } from '@/types/database';
import type { CardAction, ExplanationCardData, RequestCardData, DebateIdeaCardData, QuestionCardData, ConfidenceLevel } from '@/types/coaching-cards';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageStreamProps {
  messages: MessageType[];
  isLoading: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  onStopGeneration?: () => void;
  currentPhase?: string;
  onSendFollowup?: (question: string) => void;
  onCaptureInsight?: (messageId: string, territory: string, content: string) => void;
  capturedInsights?: Set<string>;
  onCardAction?: (action: CardAction) => void;
  onNavigateToCanvas?: (target: { phase: string; section?: string }) => void;
  conversationId?: string;
  onQuestionSubmit?: (territory: string, researchArea: string, questionIndex: number, answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
}

export function MessageStream({
  messages,
  isLoading,
  isStreaming = false,
  streamingContent = '',
  onStopGeneration,
  currentPhase = 'discovery',
  onSendFollowup,
  onCaptureInsight,
  capturedInsights,
  onCardAction,
  onNavigateToCanvas,
  conversationId,
  onQuestionSubmit,
}: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom on new messages and during streaming
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming, streamingContent]);

  // Determine the last assistant message index
  const lastAssistantIndex = messages.map((m, i) => ({ m, i }))
    .filter(({ m }) => m.role === 'assistant')
    .pop()?.i ?? -1;

  // Parse cards from messages and memoize results
  const parsedMessages = useMemo(() => {
    return messages.map((message) => {
      if (message.role === 'assistant' && hasCardMarkers(message.content)) {
        const parsed = parseCardMarkers(message.content);
        return {
          message,
          textContent: parsed.textContent,
          cards: parsed.cards,
        };
      }
      return {
        message,
        textContent: message.content,
        cards: [] as Array<ExplanationCardData | RequestCardData | DebateIdeaCardData | QuestionCardData>,
      };
    });
  }, [messages]);

  // Handle card dismiss
  const handleCardDismiss = useCallback((cardId: string) => {
    setDismissedCards((prev) => new Set([...prev, cardId]));
  }, []);

  // Handle card actions
  const handleCardAction = useCallback((action: CardAction) => {
    onCardAction?.(action);
  }, [onCardAction]);

  return (
    <div ref={streamRef} className="message-stream h-full overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
      {messages.length === 0 && !isLoading && !isStreaming && (
        <div className="text-center text-slate-500 text-sm py-12">
          <p className="mb-2 font-semibold">Welcome to your strategy session.</p>
          <p>Let&apos;s begin by exploring your strategic context.</p>
        </div>
      )}

      {parsedMessages.map(({ message, textContent, cards }, index) => (
        <div key={message.id} className="message-with-cards">
          {/* Render cards first (above the message text) */}
          {cards.length > 0 && (
            <div className="cards-container flex flex-col gap-4 mb-4">
              {cards
                .filter((card) => !dismissedCards.has(card.id))
                .map((card) => (
                  <CardRenderer
                    key={card.id}
                    card={card}
                    conversationId={conversationId}
                    onAction={handleCardAction}
                    onDismiss={handleCardDismiss}
                    onNavigateToCanvas={onNavigateToCanvas}
                    onQuestionSubmit={onQuestionSubmit}
                  />
                ))}
            </div>
          )}

          {/* Render the text content (if any remains after card extraction) */}
          {textContent.trim() && (
            <Message
              message={{ ...message, content: textContent }}
              isLastMessage={index === lastAssistantIndex && !isStreaming && !isLoading}
              currentPhase={currentPhase}
              onSendFollowup={onSendFollowup}
              onCaptureInsight={onCaptureInsight}
              isCaptured={capturedInsights?.has(message.id) || false}
            />
          )}

          {/* If no text content but message is from user, still show it */}
          {!textContent.trim() && message.role === 'user' && (
            <Message
              message={message}
              isLastMessage={false}
              currentPhase={currentPhase}
              onSendFollowup={onSendFollowup}
              onCaptureInsight={onCaptureInsight}
              isCaptured={false}
            />
          )}
        </div>
      ))}

      {isLoading && <ThinkingIndicator />}
      {isStreaming && streamingContent && (
        <StreamingMessage content={streamingContent} onStop={onStopGeneration} />
      )}
    </div>
  );
}
