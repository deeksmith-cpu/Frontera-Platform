'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  CoachContext,
  CoachContextMessage,
  CoachContextMaterial,
  AnsweredCardData,
  QuestionCardData,
  Phase,
} from '@/types/coaching-cards';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Message = Database['public']['Tables']['conversation_messages']['Row'];
type Material = Database['public']['Tables']['uploaded_materials']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface UseCoachContextOptions {
  conversation: Conversation | null;
  messages: Message[];
  currentQuestion?: QuestionCardData;
  draftAnswer?: string;
}

interface ClientInfo {
  companyName: string;
  industry?: string;
  companySize?: string;
  strategicFocus?: string[];
}

const MAX_RECENT_MESSAGES = 15;

/**
 * Hook to assemble full context for the Coach API
 * Aggregates chat history, uploads, territory insights, and company info
 */
export function useCoachContext({
  conversation,
  messages,
  currentQuestion,
  draftAnswer,
}: UseCoachContextOptions): CoachContext | null {
  const [materials, setMaterials] = useState<CoachContextMaterial[]>([]);
  const [territoryInsights, setTerritoryInsights] = useState<AnsweredCardData[]>([]);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch uploaded materials
  const fetchMaterials = useCallback(async () => {
    if (!conversation?.id) return;

    try {
      const response = await fetch(
        `/api/product-strategy-agent-v2/materials?conversation_id=${conversation.id}`
      );
      if (response.ok) {
        const data: Material[] = await response.json();
        setMaterials(
          data.map((m) => ({
            id: m.id,
            filename: m.filename,
            file_type: m.file_type || 'unknown',
            extractedContext:
              typeof m.extracted_context === 'object' && m.extracted_context !== null
                ? (m.extracted_context as { text?: string }).text || ''
                : '',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching materials for context:', error);
    }
  }, [conversation?.id]);

  // Fetch territory insights (all answered questions)
  const fetchTerritoryInsights = useCallback(async () => {
    if (!conversation?.id) return;

    try {
      const response = await fetch(
        `/api/product-strategy-agent-v2/territories?conversation_id=${conversation.id}`
      );
      if (response.ok) {
        const data: TerritoryInsight[] = await response.json();
        // Convert to AnsweredCardData format
        const insights: AnsweredCardData[] = [];
        data.forEach((insight) => {
          const responses = insight.responses as Record<string, string> | null;
          const confidence = insight.confidence as Record<string, string> | null;
          if (responses) {
            // Each insight has multiple questions (0, 1, 2)
            Object.entries(responses).forEach(([indexStr, answer]) => {
              const index = parseInt(indexStr, 10);
              if (!isNaN(index) && answer) {
                insights.push({
                  territory: insight.territory as 'company' | 'customer' | 'competitor',
                  research_area: insight.research_area,
                  question_index: index,
                  question: '', // We don't store the question text, but it's available from constants
                  answer,
                  confidence: (confidence?.[indexStr] as 'data' | 'experience' | 'guess') || null,
                  submitted_at: insight.updated_at || undefined,
                });
              }
            });
          }
        });
        setTerritoryInsights(insights);
      }
    } catch (error) {
      console.error('Error fetching territory insights for context:', error);
    }
  }, [conversation?.id]);

  // Fetch client info
  const fetchClientInfo = useCallback(async () => {
    if (!conversation?.clerk_org_id) return;

    try {
      const response = await fetch(`/api/organizations/current`);
      if (response.ok) {
        const data = await response.json();
        if (data.client) {
          setClientInfo({
            companyName: data.client.company_name || 'Unknown Company',
            industry: data.client.industry || undefined,
            companySize: data.client.company_size || undefined,
            strategicFocus: data.client.strategic_focus || undefined,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching client info for context:', error);
    }
  }, [conversation?.clerk_org_id]);

  // Load all context data
  useEffect(() => {
    if (!conversation?.id) return;

    let isMounted = true;

    const loadData = async () => {
      if (isMounted) setIsLoading(true);
      try {
        await Promise.all([fetchMaterials(), fetchTerritoryInsights(), fetchClientInfo()]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  // Convert messages to CoachContextMessage format
  const recentMessages = useMemo((): CoachContextMessage[] => {
    return messages
      .slice(-MAX_RECENT_MESSAGES)
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.created_at || undefined,
      }));
  }, [messages]);

  // Get current phase from conversation
  const currentPhase = useMemo((): Phase => {
    return (conversation?.current_phase as Phase) || 'discovery';
  }, [conversation?.current_phase]);

  // Assemble full context
  const context = useMemo((): CoachContext | null => {
    if (!conversation || isLoading) return null;

    return {
      // Company info
      companyName: clientInfo?.companyName || 'Your Company',
      industry: clientInfo?.industry,
      companySize: clientInfo?.companySize,
      strategicFocus: clientInfo?.strategicFocus,

      // Conversation context
      conversationId: conversation.id,
      currentPhase,
      recentMessages,

      // Research context
      allTerritoryInsights: territoryInsights,
      currentQuestion,
      draftAnswer,

      // Materials
      uploadedMaterials: materials,

      // Framework state
      frameworkState: conversation.framework_state as Record<string, unknown> | undefined,
    };
  }, [
    conversation,
    isLoading,
    clientInfo,
    currentPhase,
    recentMessages,
    territoryInsights,
    currentQuestion,
    draftAnswer,
    materials,
  ]);

  return context;
}

/**
 * Lightweight version for components that only need basic context
 */
export function useBasicCoachContext(
  conversation: Conversation | null,
  messages: Message[]
): Pick<CoachContext, 'conversationId' | 'currentPhase' | 'recentMessages' | 'companyName'> | null {
  const recentMessages = useMemo((): CoachContextMessage[] => {
    return messages.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  }, [messages]);

  if (!conversation) return null;

  return {
    conversationId: conversation.id,
    currentPhase: (conversation.current_phase as Phase) || 'discovery',
    recentMessages,
    companyName: 'Your Company', // Lightweight version doesn't fetch client info
  };
}
