'use client';

import {
  createContext,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';
import type { CardAction, ConfidenceLevel } from '@/types/coaching-cards';

type Conversation = Database['public']['Tables']['conversations']['Row'];

// =============================================================================
// Context Value Interface
// =============================================================================

export interface CoachJourneyContextValue {
  // Conversation state
  conversation: Conversation | null;
  currentPhase: string;

  // Research state
  activeResearchContext: ActiveResearchContext | null;
  setActiveResearchContext: (ctx: ActiveResearchContext | null) => void;

  // Card action handlers (wired, not stubs)
  handleCardAction: (action: CardAction) => void;
  handleNavigateToCanvas: (target: { phase: string; section?: string }) => void;
  handleQuestionSubmit: (
    territory: string,
    researchArea: string,
    questionIndex: number,
    answer: string,
    confidence: ConfidenceLevel | null,
  ) => Promise<boolean>;

  // Context preview state
  contextPreviewCollapsed: boolean;
  setContextPreviewCollapsed: (collapsed: boolean) => void;
  contextPreviewScrollTarget: { phase: string; section?: string } | null;
  setContextPreviewScrollTarget: (target: { phase: string; section?: string } | null) => void;

  // Phase transitions
  handlePhaseTransition: (targetPhase: string) => Promise<void>;
  handleConversationUpdate: (updated: Conversation) => void;

  // Research progress (optimistic updates)
  lastQuestionSubmitAt: number;
}

// =============================================================================
// Context Creation
// =============================================================================

export const CoachJourneyContext = createContext<CoachJourneyContextValue | null>(null);

// =============================================================================
// Provider Props
// =============================================================================

interface CoachJourneyProviderProps {
  children: ReactNode;
  conversation: Conversation | null;
  onConversationUpdate: (updated: Conversation) => void;
  activeResearchContext: ActiveResearchContext | null;
  onResearchContextChange: (ctx: ActiveResearchContext | null) => void;
  contextPreviewCollapsed: boolean;
  onContextCollapse: () => void;
  onContextExpand: () => void;
}

// =============================================================================
// Provider Component
// =============================================================================

export function CoachJourneyProvider({
  children,
  conversation,
  onConversationUpdate,
  activeResearchContext,
  onResearchContextChange,
  contextPreviewCollapsed,
  onContextCollapse,
  onContextExpand,
}: CoachJourneyProviderProps) {
  const [contextPreviewScrollTarget, setContextPreviewScrollTarget] = useState<
    { phase: string; section?: string } | null
  >(null);
  const [lastQuestionSubmitAt, setLastQuestionSubmitAt] = useState(0);

  // Extract current phase from conversation
  const currentPhase = useMemo(() => {
    const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
    return (frameworkState?.currentPhase as string) || 'discovery';
  }, [conversation?.framework_state]);

  // --------------------------------------------------------------------------
  // Card Action Handler (wired — replaces console.log stubs)
  // --------------------------------------------------------------------------
  const handleCardAction = useCallback((action: CardAction) => {
    switch (action.action) {
      case 'navigate':
      case 'navigate_to_canvas': {
        const payload = action.payload as { phase?: string; section?: string } | undefined;
        if (payload?.phase) {
          setContextPreviewScrollTarget({
            phase: payload.phase,
            section: payload.section,
          });
          // Auto-expand context preview if collapsed
          if (contextPreviewCollapsed) {
            onContextExpand();
          }
        }
        break;
      }
      case 'start_phase': {
        const payload = action.payload as { phase?: string } | undefined;
        if (payload?.phase) {
          void handlePhaseTransition(payload.phase);
        }
        break;
      }
      case 'dismiss':
        // Card dismissal is handled locally in MessageStream via dismissedCards Set
        break;
      default:
        // Log unhandled actions for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('[CoachJourney] Unhandled card action:', action);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextPreviewCollapsed, onContextExpand]);

  // --------------------------------------------------------------------------
  // Navigate to Canvas (wired — replaces console.log stub)
  // --------------------------------------------------------------------------
  const handleNavigateToCanvas = useCallback((target: { phase: string; section?: string }) => {
    setContextPreviewScrollTarget(target);
    // Auto-expand context preview if collapsed
    if (contextPreviewCollapsed) {
      onContextExpand();
    }
  }, [contextPreviewCollapsed, onContextExpand]);

  // --------------------------------------------------------------------------
  // Question Submit (lifted from CoachingPanel lines 86-150)
  // --------------------------------------------------------------------------
  const handleQuestionSubmit = useCallback(async (
    territory: string,
    researchArea: string,
    questionIndex: number,
    answer: string,
    confidence: ConfidenceLevel | null,
  ): Promise<boolean> => {
    if (!conversation) return false;

    try {
      // Fetch existing responses for this research area
      const getResponse = await fetch(
        `/api/product-strategy-agent/territories?conversation_id=${conversation.id}`
      );

      let existingResponses: Record<string, string> = {};
      let existingConfidence: Record<string, string> = {};

      if (getResponse.ok) {
        const insights = await getResponse.json();
        const existing = insights.find(
          (i: { territory: string; research_area: string }) =>
            i.territory === territory && i.research_area === researchArea
        );
        if (existing?.responses) {
          existingResponses = existing.responses as Record<string, string>;
        }
        if (existing?.confidence) {
          existingConfidence = existing.confidence as Record<string, string>;
        }
      }

      // Merge new answer
      const responses: Record<string, string> = {
        ...existingResponses,
        [questionIndex]: answer,
      };

      const confidenceMap: Record<string, string> = {
        ...existingConfidence,
        ...(confidence ? { [questionIndex]: confidence } : {}),
      };

      const answeredCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
      const status = answeredCount >= 3 ? 'mapped' : 'in_progress';

      const response = await fetch('/api/product-strategy-agent/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory,
          research_area: researchArea,
          responses,
          confidence: confidenceMap,
          status,
        }),
      });

      if (response.ok) {
        // Signal optimistic update to context preview
        setLastQuestionSubmitAt(Date.now());
      }

      return response.ok;
    } catch (err) {
      console.error('Error submitting question answer:', err);
      return false;
    }
  }, [conversation]);

  // --------------------------------------------------------------------------
  // Phase Transition
  // --------------------------------------------------------------------------
  const handlePhaseTransition = useCallback(async (targetPhase: string) => {
    if (!conversation) return;

    try {
      const response = await fetch('/api/product-strategy-agent/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          phase: targetPhase,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.conversation) {
          onConversationUpdate(data.conversation);
        }
      }
    } catch (error) {
      console.error('Error transitioning phase:', error);
    }
  }, [conversation, onConversationUpdate]);

  // --------------------------------------------------------------------------
  // Context Preview Collapse Toggle
  // --------------------------------------------------------------------------
  const setContextPreviewCollapsedWrapper = useCallback((collapsed: boolean) => {
    if (collapsed) {
      onContextCollapse();
    } else {
      onContextExpand();
    }
  }, [onContextCollapse, onContextExpand]);

  // --------------------------------------------------------------------------
  // Memoized Context Value
  // --------------------------------------------------------------------------
  const value = useMemo<CoachJourneyContextValue>(() => ({
    conversation,
    currentPhase,
    activeResearchContext,
    setActiveResearchContext: onResearchContextChange,
    handleCardAction,
    handleNavigateToCanvas,
    handleQuestionSubmit,
    contextPreviewCollapsed,
    setContextPreviewCollapsed: setContextPreviewCollapsedWrapper,
    contextPreviewScrollTarget,
    setContextPreviewScrollTarget,
    handlePhaseTransition,
    handleConversationUpdate: onConversationUpdate,
    lastQuestionSubmitAt,
  }), [
    conversation,
    currentPhase,
    activeResearchContext,
    onResearchContextChange,
    handleCardAction,
    handleNavigateToCanvas,
    handleQuestionSubmit,
    contextPreviewCollapsed,
    setContextPreviewCollapsedWrapper,
    contextPreviewScrollTarget,
    handlePhaseTransition,
    onConversationUpdate,
    lastQuestionSubmitAt,
  ]);

  return (
    <CoachJourneyContext.Provider value={value}>
      {children}
    </CoachJourneyContext.Provider>
  );
}
