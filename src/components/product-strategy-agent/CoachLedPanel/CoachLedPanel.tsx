'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionHeader } from '../CoachingPanel/SessionHeader';
import { MessageStream } from '../CoachingPanel/MessageStream';
import { CoachingInput } from '../CoachingPanel/CoachingInput';
import { ProactiveCoachMessage } from '../CoachingPanel/ProactiveCoachMessage';
import { WhatsNextCard } from '../CoachingPanel/cards';
import { TerritoryNav } from './TerritoryNav';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { useProactiveCoach } from '@/hooks/useProactiveCoach';
import { useWhatsNextProgress } from '@/hooks/useWhatsNextProgress';
import type { Database } from '@/types/database';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';
import type { ActiveResearchContext } from '@/types/research-context';
import type { Phase } from '@/types/coaching-cards';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['conversation_messages']['Row'];

interface CoachLedPanelProps {
  conversation: Conversation;
  userId: string;
  orgId: string;
  activeResearchContext: ActiveResearchContext | null;
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

export function CoachLedPanel({ conversation, userId, orgId, activeResearchContext }: CoachLedPanelProps) {
  // ── Context handlers from CoachJourneyContext ──
  const context = useCoachJourney();

  // ── Local component state ──
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [smartPromptsContext, setSmartPromptsContext] = useState<SmartPromptsContext | undefined>(undefined);
  const [lastActivityAt, setLastActivityAt] = useState<number>(Date.now());
  const [currentPersona, setCurrentPersona] = useState<PersonaId | undefined>(undefined);
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);
  const [capturedInsights, setCapturedInsights] = useState<Set<string>>(new Set());
  const [currentResearchArea, setCurrentResearchArea] = useState<{ territory: string; areaId: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prevPhaseRef = useRef<string | null>(null);

  // Extract current phase from conversation
  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

  // What's Next progress tracking (always enabled — CoachLedPanel is always sidepanel)
  const whatsNextData = useWhatsNextProgress(
    conversation.id,
    currentPhase as Phase
  );

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
    isEnabled: true, // Always enabled — CoachLedPanel is always sidepanel mode
  });

  // ── Phase transition welcome message ──
  useEffect(() => {
    // On first mount, set the phase ref without sending a welcome
    if (prevPhaseRef.current === null) {
      prevPhaseRef.current = currentPhase;
      return;
    }

    // Only fire when the phase actually changes
    if (prevPhaseRef.current !== currentPhase) {
      prevPhaseRef.current = currentPhase;

      // Auto-send a phase welcome message to the coach
      const welcomeMessages: Record<string, string> = {
        research: "[RESEARCH_CONTEXT:company:company_foundation:0] I'm ready to start mapping my strategic terrain, beginning with Company Foundation.",
        synthesis: "I've completed my territory research. Help me synthesize the patterns and identify strategic opportunities.",
        bets: "Let's formulate strategic bets based on the synthesis insights.",
        activation: "I'm ready to build the activation plan for my strategic bets.",
        review: "Let's review the overall strategy and set up the living strategy system.",
      };

      const welcomeMsg = welcomeMessages[currentPhase];
      if (welcomeMsg && !isLoading && !isStreaming) {
        // Set the active research area for TerritoryNav highlighting
        if (currentPhase === 'research') {
          setCurrentResearchArea({ territory: 'company', areaId: 'company_foundation' });
        }
        // Small delay to let the UI settle after phase transition
        setTimeout(() => {
          void handleSendMessage(welcomeMsg);
        }, 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase]);

  // ── Fetch messages for active conversation ──
  useEffect(() => {
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

  // ── Fetch context awareness data for smart prompts ──
  useEffect(() => {
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

  // ── Fetch persona preference (always — CoachLedPanel is always sidepanel) ──
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

    fetchPersona();
  }, []);

  // ── Handle persona change ──
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

  // ── Stop generation handler ──
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // ── Capture insight handler ──
  const handleCaptureInsight = useCallback(async (messageId: string, territory: string, content: string) => {
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

  // ── Handle research area selection from territory picker ──
  const handleResearchAreaSelect = useCallback((territory: string, areaId: string, areaTitle: string) => {
    if (isLoading || isStreaming) return;

    // Update active area for TerritoryNav highlighting
    setCurrentResearchArea({ territory, areaId });

    // Send a message with the RESEARCH_CONTEXT marker that triggers the AI
    // to emit a QuestionCard for the first question in this area.
    // The marker is stripped from display by the Message component.
    const message = `[RESEARCH_CONTEXT:${territory}:${areaId}:0] I'd like to explore the ${areaTitle} area in the ${territory} territory.`;
    void handleSendMessage(message);
  }, [isLoading, isStreaming]);

  // ── Send message handler ──
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
        body: JSON.stringify({
          message: content,
          researchContext: activeResearchContext,
        }),
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

  return (
    <aside className="coaching-panel bg-white flex flex-col h-full overflow-hidden animate-entrance animate-delay-150 border-r border-slate-200">
      <div className="flex-shrink-0">
        <SessionHeader
          conversation={conversation}
          isSidepanel={true}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          isPersonaLoading={isPersonaLoading}
        />
      </div>
      {/* Territory Nav — compact horizontal switcher, visible in research phase */}
      {currentPhase === 'research' && (
        <div className="flex-shrink-0">
          <TerritoryNav
            conversationId={conversation.id}
            onSelectArea={handleResearchAreaSelect}
            currentArea={currentResearchArea}
          />
        </div>
      )}
      {/* Proactive Coach Message — hidden during research (question cards serve as guidance) */}
      {currentPhase !== 'research' && trigger && (
        <div className="flex-shrink-0">
          <ProactiveCoachMessage trigger={trigger} onDismiss={dismissTrigger} />
        </div>
      )}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Scrollable message area */}
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
            onCardAction={context.handleCardAction}
            onNavigateToCanvas={context.handleNavigateToCanvas}
            conversationId={conversation.id}
            onQuestionSubmit={context.handleQuestionSubmit}
          />
        </div>

        {/* What's Next Card - collapsible sticky at bottom */}
        {whatsNextData && (
          <div className="flex-shrink-0">
            <WhatsNextCard
              data={whatsNextData}
              onNavigateToPhase={context.handlePhaseTransition}
            />
          </div>
        )}
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
