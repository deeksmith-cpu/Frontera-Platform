'use client';

import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingMessage } from './StreamingMessage';
import { SessionWelcome } from './SessionWelcome';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface WelcomeProps {
  currentPhase: string;
  activeTerritory: 'company' | 'customer' | 'competitor' | null;
  territoryProgress: {
    company: { mapped: number; total: number };
    customer: { mapped: number; total: number };
    competitor: { mapped: number; total: number };
  };
  synthesisAvailable: boolean;
  hasHistory: boolean;
  onShowHistory: () => void;
  hasUserEngaged: boolean;
  materialsCount: number;
}

interface MessageStreamProps {
  messages: MessageType[];
  conversationId?: string;
  isLoading: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  onStopGeneration?: () => void;
  currentPhase?: string;
  onSendFollowup?: (question: string) => void;
  onCaptureInsight?: (messageId: string, territory: string, content: string) => void;
  capturedInsights?: Set<string>;
  welcomeProps?: WelcomeProps;
}

export function MessageStream({
  messages,
  conversationId,
  isLoading,
  isStreaming = false,
  streamingContent = '',
  onStopGeneration,
  currentPhase = 'discovery',
  onSendFollowup,
  onCaptureInsight,
  capturedInsights,
  welcomeProps,
}: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={streamRef} className="message-stream h-full overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
      {/* Session welcome card */}
      {welcomeProps && (
        <SessionWelcome
          currentPhase={welcomeProps.currentPhase}
          activeTerritory={welcomeProps.activeTerritory}
          territoryProgress={welcomeProps.territoryProgress}
          synthesisAvailable={welcomeProps.synthesisAvailable}
          onSendPrompt={onSendFollowup || (() => {})}
          hasHistory={welcomeProps.hasHistory}
          onShowHistory={welcomeProps.onShowHistory}
          hasUserEngaged={welcomeProps.hasUserEngaged}
          materialsCount={welcomeProps.materialsCount}
        />
      )}
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          conversationId={conversationId}
          isLastMessage={index === lastAssistantIndex && !isStreaming && !isLoading}
          currentPhase={currentPhase}
          onSendFollowup={onSendFollowup}
          onCaptureInsight={onCaptureInsight}
          isCaptured={capturedInsights?.has(message.id) || false}
        />
      ))}
      {isLoading && <ThinkingIndicator />}
      {isStreaming && streamingContent && (
        <StreamingMessage content={streamingContent} onStop={onStopGeneration} />
      )}
    </div>
  );
}
