'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionHeader } from './SessionHeader';
import { CoachContextAwareness } from './CoachContextAwareness';
import { MessageStream } from './MessageStream';
import { CoachingInput } from './CoachingInput';
import { ProactiveCoachMessage } from './ProactiveCoachMessage';
import { useProactiveCoach } from '@/hooks/useProactiveCoach';
import type { Database } from '@/types/database';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['conversation_messages']['Row'];

interface CoachingPanelProps {
  conversation: Conversation | undefined;
  userId: string;
  orgId: string;
  onClose?: () => void;
  onCollapse?: () => void;
  mode?: 'popup' | 'sidepanel';
}

// Type for context awareness data used by smart prompts
interface SmartPromptsContext {
  phase: string;
  materialsCount: number;
  territoryProgress: {
    company: { mapped: number; total: number };
    customer: { mapped: number; total: number };
    competitor: { mapped: number; total: number };
  };
  synthesisAvailable: boolean;
}

export function CoachingPanel({ conversation, orgId, onClose, onCollapse, mode = 'popup' }: CoachingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [smartPromptsContext, setSmartPromptsContext] = useState<SmartPromptsContext | undefined>(undefined);
  const [lastActivityAt, setLastActivityAt] = useState<number>(Date.now());
  const [currentPersona, setCurrentPersona] = useState<PersonaId | undefined>(undefined);
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);
  const [capturedInsights, setCapturedInsights] = useState<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Extract current phase from conversation
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

  // Proactive coach triggers
  const territoryProgress = smartPromptsContext?.territoryProgress ?? {
    company: { mapped: 0, total: 3 },
    customer: { mapped: 0, total: 3 },
    competitor: { mapped: 0, total: 3 },
  };

  const { trigger, dismissTrigger } = useProactiveCoach({
    phase: currentPhase,
    lastActivityAt,
    territoryProgress,
    synthesisAvailable: smartPromptsContext?.synthesisAvailable ?? false,
    onSendMessage: (msg) => handleSendMessage(msg),
    isEnabled: mode === 'sidepanel', // Only enable proactive triggers in sidepanel mode
  });

  // Fetch messages for active conversation
  useEffect(() => {
    if (!conversation) return;

    // Capture conversation in a const to avoid TS18048 errors in async closure
    const currentConversation = conversation;

    async function fetchMessages() {
      const response = await fetch(`/api/conversations/${currentConversation.id}`);
      if (response.ok) {
        const data = await response.json();
        const fetchedMessages = data.messages || [];
        setMessages(fetchedMessages);

        // If no messages exist, request the opening message
        if (fetchedMessages.length === 0) {
          try {
            const openingResponse = await fetch(`/api/conversations/${currentConversation.id}/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: '' }),
            });

            if (openingResponse.ok) {
              const openingData = await openingResponse.json();
              if (openingData.content) {
                const openingMessage: Message = {
                  id: `opening-${Date.now()}`,
                  conversation_id: currentConversation.id,
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
  }, [conversation, orgId]);

  // Fetch context awareness data for smart prompts
  useEffect(() => {
    if (!conversation) return;

    const conversationId = conversation.id;

    async function fetchContextData() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/context-awareness?conversation_id=${conversationId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSmartPromptsContext({
            phase: currentPhase,
            materialsCount: data.materialsCount ?? 0,
            territoryProgress: data.territoryProgress ?? {
              company: { mapped: 0, total: 3 },
              customer: { mapped: 0, total: 3 },
              competitor: { mapped: 0, total: 3 },
            },
            synthesisAvailable: data.synthesisAvailable ?? false,
          });
        }
      } catch (error) {
        console.error('Error fetching context data for smart prompts:', error);
      }
    }

    fetchContextData();
  }, [conversation, currentPhase]);

  // Fetch persona preference
  useEffect(() => {
    async function fetchPersona() {
      try {
        const response = await fetch('/api/product-strategy-agent/persona');
        if (response.ok) {
          const data = await response.json();
          setCurrentPersona(data.persona || undefined);
        }
      } catch (error) {
        console.error('Error fetching persona:', error);
      }
    }

    if (mode === 'sidepanel') {
      fetchPersona();
    }
  }, [mode]);

  // Handle persona change
  const handlePersonaChange = useCallback(async (persona: PersonaId | null) => {
    setIsPersonaLoading(true);
    try {
      const response = await fetch('/api/product-strategy-agent/persona', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });

      if (response.ok) {
        setCurrentPersona(persona || undefined);
      } else {
        console.error('Failed to update persona');
      }
    } catch (error) {
      console.error('Error updating persona:', error);
    } finally {
      setIsPersonaLoading(false);
    }
  }, []);

  // Stop generation handler - must be before early return to comply with rules of hooks
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Capture insight handler
  const handleCaptureInsight = useCallback(async (messageId: string, territory: string, content: string) => {
    if (!conversation) return;
    try {
      const response = await fetch('/api/product-strategy-agent/captured-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          message_id: messageId,
          territory,
          content,
        }),
      });
      if (response.ok) {
        setCapturedInsights(prev => new Set([...prev, messageId]));
      }
    } catch (error) {
      console.error('Error capturing insight:', error);
    }
  }, [conversation]);

  if (!conversation) {
    return (
      <aside className="coaching-panel bg-white border-r border-slate-200 flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm">No conversation selected</p>
      </aside>
    );
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return;

    // Track user activity for proactive coach
    setLastActivityAt(Date.now());

    setIsLoading(true);
    setIsStreaming(false);
    setStreamingContent('');

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

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
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Start streaming
      setIsLoading(false);
      setIsStreaming(true);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            assistantContent += chunk;
            // Real-time update of streaming content
            setStreamingContent(assistantContent);
          }
        } catch (readError) {
          // Handle abort or read errors
          if (readError instanceof Error && readError.name === 'AbortError') {
            // User stopped generation - keep partial content
            if (assistantContent) {
              assistantContent += '\n\n*[Response stopped]*';
            }
          } else {
            throw readError;
          }
        }
      }

      // Add completed assistant message
      if (assistantContent) {
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
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted - check if we have partial content
        if (streamingContent) {
          const assistantMessage: Message = {
            id: `temp-assistant-${Date.now()}`,
            conversation_id: conversation.id,
            clerk_org_id: orgId,
            role: 'assistant',
            content: streamingContent + '\n\n*[Response stopped]*',
            metadata: {},
            token_count: null,
            created_at: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      } else {
        console.error('Error sending message:', error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
      abortControllerRef.current = null;
    }
  };

  // Determine if we're in popup mode (when onClose is provided)
  const isPopup = mode === 'popup' || !!onClose;
  const isSidepanel = mode === 'sidepanel';

  return (
    <aside className={`coaching-panel bg-white flex flex-col h-full overflow-hidden ${!isPopup ? 'border-r border-slate-200' : ''}`}>
      <div className="flex-shrink-0">
        <SessionHeader
          conversation={conversation}
          onClose={onClose}
          onCollapse={onCollapse}
          isPopup={isPopup}
          isSidepanel={isSidepanel}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          isPersonaLoading={isPersonaLoading}
        />
      </div>
      {/* Context Awareness Panel - only show in sidepanel mode */}
      {isSidepanel && (
        <div className="flex-shrink-0">
          <CoachContextAwareness conversation={conversation} />
        </div>
      )}
      {/* Proactive Coach Message - only show in sidepanel mode */}
      {isSidepanel && trigger && (
        <div className="flex-shrink-0">
          <ProactiveCoachMessage trigger={trigger} onDismiss={dismissTrigger} />
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageStream
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onStopGeneration={handleStopGeneration}
          currentPhase={currentPhase}
          onSendFollowup={handleSendMessage}
          onCaptureInsight={handleCaptureInsight}
          capturedInsights={capturedInsights}
        />
      </div>
      <div className="flex-shrink-0">
        <CoachingInput
          onSendMessage={handleSendMessage}
          isDisabled={isLoading || isStreaming}
          smartPromptsContext={smartPromptsContext}
        />
      </div>
    </aside>
  );
}
