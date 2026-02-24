'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Territory } from '@/types/coaching-cards';

// Research area definitions for each territory
export const RESEARCH_AREAS = {
  company: [
    { id: 'company_foundation', title: 'Company Foundation', questions: 3 },
    { id: 'strategic_position', title: 'Strategic Position', questions: 3 },
    { id: 'competitive_advantages', title: 'Competitive Advantages', questions: 3 },
  ],
  customer: [
    { id: 'customer_segmentation', title: 'Customer Segmentation & Behaviors', questions: 3 },
    { id: 'unmet_needs', title: 'Unmet Needs & Pain Points', questions: 3 },
    { id: 'market_dynamics', title: 'Market Dynamics & Customer Evolution', questions: 3 },
  ],
  competitor: [
    { id: 'direct_competitors', title: 'Direct Competitor Landscape', questions: 3 },
    { id: 'substitute_threats', title: 'Substitute & Adjacent Threats', questions: 3 },
    { id: 'market_forces', title: 'Market Forces & Dynamics', questions: 3 },
  ],
} as const;

export interface QuestionProgress {
  index: number;
  answered: boolean;
  answer?: string;
  confidence?: string;
}

export interface ResearchAreaProgress {
  id: string;
  title: string;
  territory: Territory;
  totalQuestions: number;
  answeredQuestions: number;
  questions: QuestionProgress[];
  status: 'unexplored' | 'in_progress' | 'mapped';
}

export interface TerritoryProgress {
  territory: Territory;
  title: string;
  totalAreas: number;
  completedAreas: number;
  totalQuestions: number;
  answeredQuestions: number;
  areas: ResearchAreaProgress[];
}

export interface ResearchProgressData {
  territories: TerritoryProgress[];
  currentTerritory: Territory | null;
  currentArea: ResearchAreaProgress | null;
  currentQuestionIndex: number | null;
  totalQuestions: number;
  totalAnswered: number;
  overallProgress: number; // 0-100
}

const POLL_INTERVAL = 10_000; // 10 seconds

const TERRITORY_TITLES: Record<Territory, string> = {
  company: 'Company Territory',
  customer: 'Customer Territory',
  competitor: 'Market Context',
};

/**
 * Hook to track detailed research progress at the question level
 * Used for WhatsNextCard and progress indicators
 */
export function useResearchProgress(conversationId: string | null): {
  progress: ResearchProgressData | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
} {
  const [progress, setProgress] = useState<ResearchProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/product-strategy-agent-v2/territories?conversation_id=${conversationId}`
      );

      if (!response.ok) {
        console.warn('Failed to fetch territory insights');
        return;
      }

      const insights = await response.json();

      // Build progress data from insights
      const territories: TerritoryProgress[] = (
        ['company', 'customer', 'competitor'] as Territory[]
      ).map((territory) => {
        const areas = RESEARCH_AREAS[territory].map((areaDef) => {
          // Find matching insight
          const insight = insights.find(
            (i: { territory: string; research_area: string }) =>
              i.territory === territory && i.research_area === areaDef.id
          );

          const responses = (insight?.responses as Record<string, string>) || {};
          const confidence = (insight?.confidence as Record<string, string>) || {};

          // Build question progress
          const questions: QuestionProgress[] = Array.from(
            { length: areaDef.questions },
            (_, index) => ({
              index,
              answered: !!responses[index]?.trim(),
              answer: responses[index],
              confidence: confidence[index],
            })
          );

          const answeredCount = questions.filter((q) => q.answered).length;
          let status: 'unexplored' | 'in_progress' | 'mapped' = 'unexplored';
          if (answeredCount === areaDef.questions) {
            status = 'mapped';
          } else if (answeredCount > 0) {
            status = 'in_progress';
          }

          return {
            id: areaDef.id,
            title: areaDef.title,
            territory,
            totalQuestions: areaDef.questions,
            answeredQuestions: answeredCount,
            questions,
            status,
          };
        });

        const completedAreas = areas.filter((a) => a.status === 'mapped').length;
        const totalQuestions = areas.reduce((sum, a) => sum + a.totalQuestions, 0);
        const answeredQuestions = areas.reduce((sum, a) => sum + a.answeredQuestions, 0);

        return {
          territory,
          title: TERRITORY_TITLES[territory],
          totalAreas: areas.length,
          completedAreas,
          totalQuestions,
          answeredQuestions,
          areas,
        };
      });

      // Calculate overall totals
      const totalQuestions = territories.reduce((sum, t) => sum + t.totalQuestions, 0);
      const totalAnswered = territories.reduce((sum, t) => sum + t.answeredQuestions, 0);
      const overallProgress = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

      // Determine current territory/area/question (first unanswered)
      let currentTerritory: Territory | null = null;
      let currentArea: ResearchAreaProgress | null = null;
      let currentQuestionIndex: number | null = null;

      for (const t of territories) {
        for (const a of t.areas) {
          if (a.status !== 'mapped') {
            currentTerritory = t.territory;
            currentArea = a;
            // Find first unanswered question
            const unansweredQ = a.questions.find((q) => !q.answered);
            currentQuestionIndex = unansweredQ?.index ?? null;
            break;
          }
        }
        if (currentArea) break;
      }

      setProgress({
        territories,
        currentTerritory,
        currentArea,
        currentQuestionIndex,
        totalQuestions,
        totalAnswered,
        overallProgress,
      });
    } catch (error) {
      console.error('Error fetching research progress:', error);
    }
  }, [conversationId]);

  // Refresh function for manual refreshes
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchProgress();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProgress]);

  // Initial fetch - use refresh which handles loading state
  useEffect(() => {
    if (conversationId) {
      // Use void to explicitly mark as intentionally not awaiting
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Polling
  useEffect(() => {
    if (!conversationId) return;

    intervalRef.current = setInterval(fetchProgress, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversationId, fetchProgress]);

  return { progress, isLoading, refresh };
}

/**
 * Get progress for a specific research area
 */
export function useResearchAreaProgress(
  conversationId: string | null,
  territory: Territory,
  researchAreaId: string
): {
  areaProgress: ResearchAreaProgress | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
} {
  const { progress, isLoading, refresh } = useResearchProgress(conversationId);

  const areaProgress = useMemo(() => {
    if (!progress) return null;

    const territoryData = progress.territories.find((t) => t.territory === territory);
    if (!territoryData) return null;

    return territoryData.areas.find((a) => a.id === researchAreaId) || null;
  }, [progress, territory, researchAreaId]);

  return { areaProgress, isLoading, refresh };
}
