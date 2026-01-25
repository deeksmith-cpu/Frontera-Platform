'use client';

import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageStreamProps {
  messages: MessageType[];
  isLoading: boolean;
}

export function MessageStream({ messages, isLoading }: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={streamRef} className="message-stream h-full overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-slate-500 text-sm py-12">
          <p className="mb-2 font-semibold">Welcome to your strategy session.</p>
          <p>Let&apos;s begin by exploring your strategic context.</p>
        </div>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isLoading && <ThinkingIndicator />}
    </div>
  );
}
