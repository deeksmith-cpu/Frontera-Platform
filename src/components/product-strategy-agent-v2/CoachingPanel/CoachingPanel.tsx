'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionHeader } from './SessionHeader';
import { CoachContextAwareness } from './CoachContextAwareness';
import { MessageStream } from './MessageStream';
import { CoachingInput } from './CoachingInput';
import { ProactiveCoachMessage } from './ProactiveCoachMessage';
import { WhatsNextCard, ResearchProgressCard } from './cards';
import { useProactiveCoach } from '@/hooks/useProactiveCoach';
import { useWhatsNextProgress } from '@/hooks/useWhatsNextProgress';
import { useResearchProgress } from '@/hooks/useResearchProgress';
import { extractResearchMarkers } from '@/lib/agents/strategy-coach/research-extractor';
import type { Database } from '@/types/database';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';
import type { ActiveResearchContext } from '@/types/research-context';
import type { Phase, QuestionCardData, ConfidenceLevel, CoachReview } from '@/types/coaching-cards';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['conversation_messages']['Row'];

interface CoachingPanelProps {
  conversation: Conversation | undefined;
  userId: string;
  orgId: string;
  onClose?: () => void;
  onCollapse?: () => void;
  mode?: 'popup' | 'sidepanel';
  variant?: 'sidebar' | 'centre';
  activeResearchContext?: ActiveResearchContext | null;
  onResearchCapture?: () => void;
  onAwardXP?: (eventType: string, metadata?: Record<string, unknown>) => Promise<unknown>;
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

export function CoachingPanel({ conversation, orgId, onClose, onCollapse, mode = 'popup', variant = 'sidebar', activeResearchContext, onResearchCapture, onAwardXP }: CoachingPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [smartPromptsContext, setSmartPromptsContext] = useState<SmartPromptsContext | undefined>(undefined);
  const [lastActivityAt, setLastActivityAt] = useState<number>(0);
  const [currentPersona, setCurrentPersona] = useState<PersonaId | undefined>(undefined);
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);
  const [capturedInsights, setCapturedInsights] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sessionStartRef = useRef<number>(0);
  const prevTerritoryRef = useRef<string | null | undefined>(undefined);

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

  // What's Next progress tracking for sticky card
  const whatsNextData = useWhatsNextProgress(
    conversation?.id || null,
    currentPhase as Phase
  );

  // Research progress tracking for question cards
  const { progress: researchProgress, refresh: refreshResearchProgress } = useResearchProgress(
    conversation?.id || null
  );

  // Track answered questions for QuestionCard rendering
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<string, { answer: string; confidence: ConfidenceLevel | null }>>(new Map());

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

        // Set session boundary — hide all historical messages from display
        sessionStartRef.current = fetchedMessages.length;

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

  // Reset session boundary when active territory changes
  useEffect(() => {
    const newTerritory = activeResearchContext?.territory || null;
    // Skip the initial render (prevTerritoryRef starts as undefined)
    if (prevTerritoryRef.current !== undefined && newTerritory !== prevTerritoryRef.current) {
      sessionStartRef.current = messages.length;
      setShowHistory(false);
    }
    prevTerritoryRef.current = newTerritory;
  }, [activeResearchContext?.territory, messages.length]);

  // Fetch context awareness data for smart prompts
  const refreshContextData = useCallback(async () => {
    if (!conversation) return;
    try {
      const response = await fetch(
        `/api/product-strategy-agent-v2/context-awareness?conversation_id=${conversation.id}`
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
  }, [conversation, currentPhase]);

  useEffect(() => {
    refreshContextData();
  }, [refreshContextData]);

  // Fetch persona preference
  useEffect(() => {
    async function fetchPersona() {
      try {
        const response = await fetch('/api/product-strategy-agent-v2/persona');
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
      const response = await fetch('/api/product-strategy-agent-v2/persona', {
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

  // Build answered questions map from research progress
  useEffect(() => {
    if (!researchProgress) return;

    const newAnsweredQuestions = new Map<string, { answer: string; confidence: ConfidenceLevel | null }>();

    researchProgress.territories.forEach((territory) => {
      territory.areas.forEach((area) => {
        area.questions.forEach((question) => {
          if (question.answered && question.answer) {
            const key = `${territory.territory}:${area.id}:${question.index}`;
            newAnsweredQuestions.set(key, {
              answer: question.answer,
              confidence: (question.confidence as ConfidenceLevel) || null,
            });
          }
        });
      });
    });

    setAnsweredQuestions(newAnsweredQuestions);
  }, [researchProgress]);

  // Handle QuestionCard submission
  const handleQuestionSubmit = useCallback(async (
    card: QuestionCardData,
    answer: string,
    confidence: ConfidenceLevel | null
  ): Promise<boolean> => {
    if (!conversation) return false;

    try {
      // Fetch existing responses for this research area
      const getResponse = await fetch(
        `/api/product-strategy-agent-v2/territories?conversation_id=${conversation.id}`
      );

      let existingResponses: Record<string, string> = {};
      let existingConfidence: Record<string, string> = {};

      if (getResponse.ok) {
        const insights = await getResponse.json();
        const existing = insights.find(
          (i: { territory: string; research_area: string }) =>
            i.territory === card.territory && i.research_area === card.research_area
        );
        if (existing?.responses) {
          existingResponses = existing.responses as Record<string, string>;
        }
        if (existing?.confidence) {
          existingConfidence = existing.confidence as Record<string, string>;
        }
      }

      // Update with new answer
      const responses: Record<string, string> = {
        ...existingResponses,
        [card.question_index]: answer,
      };

      const confidenceMap: Record<string, string> = {
        ...existingConfidence,
        ...(confidence ? { [card.question_index]: confidence } : {}),
      };

      // Determine status based on how many questions are answered
      const answeredCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
      const status = answeredCount >= card.total_questions ? 'mapped' : 'in_progress';

      // Save to API
      const response = await fetch('/api/product-strategy-agent-v2/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: card.territory,
          research_area: card.research_area,
          responses,
          confidence: confidenceMap,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save answer');
      }

      // Update local state
      const key = `${card.territory}:${card.research_area}:${card.question_index}`;
      setAnsweredQuestions(prev => new Map(prev).set(key, { answer, confidence }));

      // Refresh research progress
      await refreshResearchProgress();

      // Award XP for answering a research question
      onAwardXP?.('research_captured', {
        territory: card.territory,
        area: card.research_area,
        questionIndex: card.question_index,
      });

      // Notify parent to refresh canvas data
      onResearchCapture?.();

      return true;
    } catch (error) {
      console.error('Error submitting question answer:', error);
      return false;
    }
  }, [conversation, refreshResearchProgress, onAwardXP, onResearchCapture]);

  // Handle QuestionCard review request
  const handleQuestionReview = useCallback(async (
    card: QuestionCardData,
    draftAnswer: string
  ): Promise<CoachReview | null> => {
    if (!conversation) return null;

    try {
      const response = await fetch('/api/product-strategy-agent-v2/coach-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: card.territory,
          research_area: card.research_area,
          question_index: card.question_index,
          draft_answer: draftAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting coach review:', error);
      return null;
    }
  }, [conversation]);

  // Capture insight handler
  const handleCaptureInsight = useCallback(async (messageId: string, territory: string, content: string) => {
    if (!conversation) return;
    try {
      const response = await fetch('/api/product-strategy-agent-v2/captured-insights', {
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
        // Award XP for capturing an insight
        onAwardXP?.('insight_captured', { territory, messageId });
      }
    } catch (error) {
      console.error('Error capturing insight:', error);
    }
  }, [conversation, onAwardXP]);

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

    // Award XP for sending a message
    onAwardXP?.('message_sent');

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

      // Extract research captures before adding to messages
      const extraction = extractResearchMarkers(assistantContent);

      // Add completed assistant message (with markers stripped)
      if (assistantContent) {
        const assistantMessage: Message = {
          id: `temp-assistant-${Date.now()}`,
          conversation_id: conversation.id,
          clerk_org_id: orgId,
          role: 'assistant',
          content: extraction.cleanContent,
          metadata: extraction.hasExtractions ? { researchCaptured: true } : {},
          token_count: null,
          created_at: new Date().toISOString(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

      // Process research captures — save to territory_insights
      if (extraction.hasExtractions && conversation.id) {
        for (const capture of extraction.captures) {
          try {
            await fetch('/api/product-strategy-agent-v2/territories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversation_id: conversation.id,
                territory: capture.territory,
                research_area: capture.areaId,
                responses: { [capture.questionIndex]: capture.answer },
                status: 'in_progress',
              }),
            });
            // Award XP for each research capture
            onAwardXP?.('research_captured', { territory: capture.territory, area: capture.areaId });
          } catch (err) {
            console.error('Failed to save research capture:', err);
          }
        }

        // Mark areas as mapped
        for (const completion of extraction.areaCompletions) {
          try {
            await fetch('/api/product-strategy-agent-v2/territories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                conversation_id: conversation.id,
                territory: completion.territory,
                research_area: completion.areaId,
                responses: {},
                status: 'mapped',
              }),
            });
            // Award XP for completing a research area
            onAwardXP?.('area_mapped', { territory: completion.territory, area: completion.areaId });
          } catch (err) {
            console.error('Failed to mark area complete:', err);
          }
        }

        // Notify parent to refresh canvas data
        onResearchCapture?.();
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
  const isCentre = variant === 'centre';

  return (
    <aside className={`coaching-panel bg-white flex flex-col h-full overflow-hidden ${
      isCentre ? '' : !isPopup ? 'border-r border-slate-200' : ''
    }`}>
      <div className="flex-shrink-0">
        <SessionHeader
          conversation={conversation}
          onClose={isCentre ? undefined : onClose}
          onCollapse={isCentre ? undefined : onCollapse}
          isPopup={isCentre ? false : isPopup}
          isSidepanel={isCentre ? true : isSidepanel}
          currentPersona={currentPersona}
          onPersonaChange={handlePersonaChange}
          isPersonaLoading={isPersonaLoading}
        />
      </div>
      {/* Context Awareness Panel - only show in sidebar mode */}
      {isSidepanel && !isCentre && (
        <div className="flex-shrink-0">
          <CoachContextAwareness conversation={conversation} />
        </div>
      )}
      {/* Proactive Coach Message - only show in sidebar mode */}
      {isSidepanel && !isCentre && trigger && (
        <div className="flex-shrink-0">
          <ProactiveCoachMessage trigger={trigger} onDismiss={dismissTrigger} />
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageStream
          messages={showHistory ? messages : messages.slice(sessionStartRef.current)}
          conversationId={conversation?.id}
          isLoading={isLoading}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          onStopGeneration={handleStopGeneration}
          currentPhase={currentPhase}
          onSendFollowup={handleSendMessage}
          onCaptureInsight={handleCaptureInsight}
          capturedInsights={capturedInsights}
          welcomeProps={{
            currentPhase,
            activeTerritory: activeResearchContext?.territory || null,
            territoryProgress,
            synthesisAvailable: smartPromptsContext?.synthesisAvailable ?? false,
            hasHistory: sessionStartRef.current > 0 && !showHistory,
            onShowHistory: () => setShowHistory(true),
            hasUserEngaged: (showHistory ? messages : messages.slice(sessionStartRef.current)).some(m => m.role === 'user'),
            materialsCount: smartPromptsContext?.materialsCount ?? 0,
          }}
          onQuestionSubmit={handleQuestionSubmit}
          onQuestionReview={handleQuestionReview}
          answeredQuestions={answeredQuestions}
        />
      </div>
      {/* Research Progress Card - sticky tracker during research phase */}
      {isSidepanel && currentPhase === 'research' && researchProgress && (
        <div className="flex-shrink-0">
          <ResearchProgressCard
            currentArea={researchProgress.currentArea}
            territoryProgress={researchProgress.territories.find(
              t => t.territory === researchProgress.currentTerritory
            ) || null}
            isAreaComplete={researchProgress.currentArea?.status === 'mapped'}
            onContinue={() => {
              // Send message to coach to continue with next question
              const areaName = researchProgress.currentArea?.title || 'current research area';
              handleSendMessage(`Let's continue with the next question for ${areaName}.`);
            }}
            onStartNextArea={() => {
              // Send message to coach to move to next research area
              handleSendMessage("I'm ready to move on to the next research area.");
            }}
          />
        </div>
      )}
      {/* What's Next Card - sticky progress tracker for non-research phases */}
      {isSidepanel && currentPhase !== 'research' && whatsNextData && (
        <div className="flex-shrink-0">
          <WhatsNextCard
            data={whatsNextData}
            onNavigateToPhase={async (phase) => {
              try {
                const response = await fetch('/api/product-strategy-agent-v2/phase', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    conversation_id: conversation?.id,
                    phase,
                  }),
                });

                if (response.ok) {
                  window.location.reload();
                } else {
                  const errorData = await response.json().catch(() => ({}));
                  console.error('Phase navigation failed:', errorData);
                  alert(`Failed to navigate: ${errorData.error || 'Unknown error'}`);
                }
              } catch (err) {
                console.error('Phase navigation error:', err);
                alert('Network error. Please try again.');
              }
            }}
          />
        </div>
      )}
      <div className="flex-shrink-0">
        <CoachingInput
          onSendMessage={handleSendMessage}
          isDisabled={isLoading || isStreaming}
          smartPromptsContext={smartPromptsContext}
          conversationId={conversation?.id}
          onMaterialsChanged={refreshContextData}
        />
      </div>
    </aside>
  );
}
