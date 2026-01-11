'use client';

import { useState, useEffect } from 'react';
import { SessionHeader } from './SessionHeader';
import { MessageStream } from './MessageStream';
import { CoachingInput } from './CoachingInput';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['conversation_messages']['Row'];

interface CoachingPanelProps {
  conversation: Conversation | undefined;
  userId: string;
  orgId: string;
}

export function CoachingPanel({ conversation, userId, orgId }: CoachingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!conversation) return;

    async function fetchMessages() {
      const response = await fetch(`/api/conversations/${conversation.id}`);
      if (response.ok) {
        const data = await response.json();
        const fetchedMessages = data.messages || [];
        setMessages(fetchedMessages);

        // If no messages exist, request the opening message
        if (fetchedMessages.length === 0) {
          try {
            const openingResponse = await fetch(`/api/conversations/${conversation.id}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: '' }),
            });

            if (openingResponse.ok) {
              const openingData = await openingResponse.json();
              if (openingData.content) {
                const openingMessage: Message = {
                  id: `opening-${Date.now()}`,
                  conversation_id: conversation.id,
                  clerk_org_id: orgId,
                  role: 'assistant',
                  content: openingData.content,
                  metadata: { type: 'opening' },
                  token_count: null,
                  created_at: new Date().toISOString(),
                };
                setMessages([openingMessage]);
              }
            }
          } catch (error) {
            console.error('Error fetching opening message:', error);
          }
        }
      }
    }

    fetchMessages();
  }, [conversation?.id, orgId]);

  if (!conversation) {
    return (
      <aside className="coaching-panel bg-white border-r border-slate-200 flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm">No conversation selected</p>
      </aside>
    );
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    // Optimistically add user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversation.id,
      clerk_org_id: orgId,
      role: 'user',
      content,
      metadata: {},
      token_count: null,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to API
      const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // For streaming responses, we'd use ReadableStream here
      // For now, just wait for response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value);
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: `temp-assistant-${Date.now()}`,
        conversation_id: conversation.id,
        clerk_org_id: orgId,
        role: 'assistant',
        content: assistantContent,
        metadata: {},
        token_count: null,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="coaching-panel bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <SessionHeader conversation={conversation} />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageStream messages={messages} isLoading={isLoading} />
      </div>
      <div className="flex-shrink-0">
        <CoachingInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
      </div>
    </aside>
  );
}
