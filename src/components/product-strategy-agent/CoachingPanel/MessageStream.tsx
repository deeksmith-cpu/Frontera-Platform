'use client';

import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingMessage } from './StreamingMessage';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageStreamProps {
  messages: MessageType[];
  isLoading: boolean;
  isStreaming?: boolean;
  streamingContent?: string;
  onStopGeneration?: () => void;
  currentPhase?: string;
  onSendFollowup?: (question: string) => void;
}

export function MessageStream({
  messages,
  isLoading,
  isStreaming = false,
  streamingContent = '',
  onStopGeneration,
  currentPhase = 'discovery',
  onSendFollowup,
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
      {messages.length === 0 && !isLoading && !isStreaming && (
        <div className="text-center text-slate-500 text-sm py-12">
          <p className="mb-2 font-semibold">Welcome to your strategy session.</p>
          <p>Let&apos;s begin by exploring your strategic context.</p>
        </div>
      )}
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          isLastMessage={index === lastAssistantIndex && !isStreaming && !isLoading}
          currentPhase={currentPhase}
          onSendFollowup={onSendFollowup}
        />
      ))}
      {isLoading && <ThinkingIndicator />}
      {isStreaming && streamingContent && (
        <StreamingMessage content={streamingContent} onStop={onStopGeneration} />
      )}
    </div>
  );
}
