'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SectionSummaryData,
  Achievement,
  Phase,
} from '@/types/coaching-cards';

const POLL_INTERVAL = 30_000; // 30 seconds

export function useSectionSummary(
  conversationId: string | null
): { data: SectionSummaryData | null; latestAchievement: Achievement | null; dismissAchievement: (id: string) => void } {
  const [data, setData] = useState<SectionSummaryData | null>(null);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const [dismissedAchievements, setDismissedAchievements] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/product-strategy-agent/progress?conversation_id=${conversationId}`
      );

      if (!response.ok) {
        console.warn('Failed to fetch summary data');
        return;
      }

      const progressData = await response.json();

      // Calculate phase progress based on current phase
      const phase = progressData.currentPhase as Phase;
      let phaseProgress = 0;

      switch (phase) {
        case 'discovery':
          // Progress based on materials uploaded and conversations
          phaseProgress = Math.min(100, (progressData.materialsCount * 50) + (progressData.hasConversations ? 50 : 0));
          break;
        case 'research': {
          // Progress based on territory mapping
          const totalMapped =
            progressData.territoryProgress.company.mapped +
            progressData.territoryProgress.customer.mapped +
            progressData.territoryProgress.competitor.mapped;
          const totalAreas =
            progressData.territoryProgress.company.total +
            progressData.territoryProgress.customer.total +
            progressData.territoryProgress.competitor.total;
          phaseProgress = Math.round((totalMapped / totalAreas) * 100);
          break;
        }
        case 'synthesis':
          phaseProgress = progressData.synthesisGenerated ? 100 : 0;
          break;
        case 'bets':
          phaseProgress = Math.min(100, Math.round((progressData.betsCount / 3) * 100));
          break;
      }

      // Generate achievements based on progress
      const achievements: Achievement[] = [];

      if (progressData.materialsCount >= 1) {
        achievements.push({
          id: 'first_document',
          type: 'first_document',
          title: 'First Steps',
          description: 'You uploaded your first strategic document',
          unlockedAt: new Date().toISOString(),
          icon: 'file',
          celebrated: dismissedAchievements.has('first_document'),
        });
      }

      if (progressData.insightsCount >= 1) {
        achievements.push({
          id: 'first_insight',
          type: 'first_insight',
          title: 'Insight Hunter',
          description: 'You captured your first strategic insight',
          unlockedAt: new Date().toISOString(),
          icon: 'lightbulb',
          celebrated: dismissedAchievements.has('first_insight'),
        });
      }

      // Check for territory completion
      const territories = ['company', 'customer', 'competitor'] as const;
      for (const territory of territories) {
        if (progressData.territoryProgress[territory].mapped >= 1) {
          const achievementId = `territory_${territory}`;
          achievements.push({
            id: achievementId,
            type: 'territory_complete',
            title: 'Territory Pioneer',
            description: `You completed a ${territory} research area`,
            unlockedAt: new Date().toISOString(),
            icon: 'map',
            celebrated: dismissedAchievements.has(achievementId),
          });
        }
      }

      if (progressData.synthesisGenerated) {
        achievements.push({
          id: 'synthesis_ready',
          type: 'synthesis_ready',
          title: 'Pattern Spotter',
          description: 'You generated your strategic synthesis',
          unlockedAt: new Date().toISOString(),
          icon: 'sparkles',
          celebrated: dismissedAchievements.has('synthesis_ready'),
        });
      }

      if (progressData.betsCount >= 1) {
        achievements.push({
          id: 'first_bet',
          type: 'bet_created',
          title: 'Strategic Thinker',
          description: 'You created your first strategic bet',
          unlockedAt: new Date().toISOString(),
          icon: 'target',
          celebrated: dismissedAchievements.has('first_bet'),
        });
      }

      // Find the latest uncelebrated achievement
      const uncelebrated = achievements.filter((a) => !a.celebrated);
      const latest = uncelebrated.length > 0 ? uncelebrated[uncelebrated.length - 1] : null;

      setData({
        currentPhase: phase,
        phaseProgress,
        timeSpentMinutes: progressData.timeSpentMinutes,
        insightsCount: progressData.insightsCount,
        insightsByTerritory: {
          company: progressData.territoryProgress?.company?.mapped || 0,
          customer: progressData.territoryProgress?.customer?.mapped || 0,
          competitor: progressData.territoryProgress?.competitor?.mapped || 0,
        },
        evidenceCount: progressData.materialsCount,
        achievements,
        currentStreak: 0, // Would need to track this separately
        lastActivityAt: new Date().toISOString(),
      });

      setLatestAchievement(latest);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [conversationId, dismissedAchievements]);

  const dismissAchievement = useCallback((achievementId: string) => {
    setDismissedAchievements((prev) => new Set([...prev, achievementId]));
    setLatestAchievement(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSummary();
  }, [fetchSummary]);

  // Polling
  useEffect(() => {
    if (!conversationId) return;

    intervalRef.current = setInterval(fetchSummary, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversationId, fetchSummary]);

  return { data, latestAchievement, dismissAchievement };
}
