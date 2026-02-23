'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  WhatsNextCardData,
  WhatsNextRequirement,
  ReadinessState,
  Phase,
} from '@/types/coaching-cards';

interface ProgressResponse {
  currentPhase: Phase;
  materialsCount: number;
  hasConversations: boolean;
  territoryProgress: {
    company: { mapped: number; total: number };
    customer: { mapped: number; total: number };
    competitor: { mapped: number; total: number };
  };
  synthesisGenerated: boolean;
  betsCount: number;
  insightsCount: number;
  timeSpentMinutes: number;
}

const PHASE_MILESTONES: Record<Phase, { current: string; next: string; nextPhase: Phase }> = {
  discovery: {
    current: 'Context Setting',
    next: 'Terrain Mapping',
    nextPhase: 'research',
  },
  research: {
    current: 'Terrain Mapping',
    next: 'Pattern Recognition',
    nextPhase: 'synthesis',
  },
  synthesis: {
    current: 'Pattern Recognition',
    next: 'Strategic Bets',
    nextPhase: 'bets',
  },
  bets: {
    current: 'Strategic Bets',
    next: 'Strategy Complete',
    nextPhase: 'bets', // Final phase
  },
};

const POLL_INTERVAL = 30_000; // 30 seconds

function calculateRequirements(phase: Phase, data: ProgressResponse): WhatsNextRequirement[] {
  switch (phase) {
    case 'discovery':
      return [
        {
          id: 'context',
          label: 'Company strategic context provided',
          completed: true, // Always completed from onboarding
          required: true,
        },
        {
          id: 'materials',
          label: `Upload strategic materials (${data.materialsCount} uploaded)`,
          completed: data.materialsCount >= 1,
          required: true,
        },
        {
          id: 'conversations',
          label: 'Engage in coaching conversations',
          completed: data.hasConversations,
          required: false,
        },
      ];

    case 'research':
      const totalMapped =
        data.territoryProgress.company.mapped +
        data.territoryProgress.customer.mapped +
        data.territoryProgress.competitor.mapped;
      return [
        {
          id: 'company',
          label: `Company territory (${data.territoryProgress.company.mapped}/${data.territoryProgress.company.total} areas)`,
          completed: data.territoryProgress.company.mapped >= 1,
          required: true,
        },
        {
          id: 'customer',
          label: `Customer territory (${data.territoryProgress.customer.mapped}/${data.territoryProgress.customer.total} areas)`,
          completed: data.territoryProgress.customer.mapped >= 1,
          required: true,
        },
        {
          id: 'competitor',
          label: `Market context (${data.territoryProgress.competitor.mapped}/${data.territoryProgress.competitor.total} areas)`,
          completed: data.territoryProgress.competitor.mapped >= 1,
          required: true,
        },
        {
          id: 'minimum',
          label: `Map at least 4 research areas (${totalMapped} mapped)`,
          completed: totalMapped >= 4,
          required: true,
        },
      ];

    case 'synthesis':
      return [
        {
          id: 'synthesis',
          label: 'Generate strategic synthesis',
          completed: data.synthesisGenerated,
          required: true,
        },
        {
          id: 'review',
          label: 'Review opportunities and tensions',
          completed: data.synthesisGenerated, // Assumed reviewed if generated
          required: false,
        },
      ];

    case 'bets':
      return [
        {
          id: 'bets',
          label: `Create strategic bets (${data.betsCount} created)`,
          completed: data.betsCount >= 3,
          required: true,
        },
        {
          id: 'killcriteria',
          label: 'Define kill criteria for all bets',
          completed: data.betsCount >= 3, // Simplified - assume kill criteria set
          required: true,
        },
      ];

    default:
      return [];
  }
}

function calculateReadiness(requirements: WhatsNextRequirement[]): ReadinessState {
  const requiredItems = requirements.filter((r) => r.required);
  const completedRequired = requiredItems.filter((r) => r.completed);

  if (completedRequired.length === requiredItems.length) {
    return 'ready';
  }

  const progress = completedRequired.length / requiredItems.length;
  if (progress >= 0.5) {
    return 'almost_ready';
  }

  return 'not_ready';
}

function calculateProgress(requirements: WhatsNextRequirement[]): number {
  const total = requirements.length;
  if (total === 0) return 0;

  const completed = requirements.filter((r) => r.completed).length;
  return Math.round((completed / total) * 100);
}

function getTeaser(phase: Phase, readiness: ReadinessState): string {
  if (readiness === 'ready') {
    switch (phase) {
      case 'discovery':
        return "You're ready to explore the strategic terrain. Let's map your competitive landscape.";
      case 'research':
        return "Excellent research! Time to synthesize patterns and identify opportunities.";
      case 'synthesis':
        return "Clear patterns emerging. Ready to formulate strategic bets.";
      case 'bets':
        return "Your strategic portfolio is taking shape. Keep refining your bets.";
      default:
        return "Great progress! Keep going.";
    }
  }

  switch (phase) {
    case 'discovery':
      return "Upload strategic materials to unlock terrain mapping. The more context, the better insights.";
    case 'research':
      return "Continue mapping territories to build a complete strategic picture.";
    case 'synthesis':
      return "Generate synthesis to reveal strategic opportunities and tensions.";
    case 'bets':
      return "Create at least 3 strategic bets with clear success metrics and kill criteria.";
    default:
      return "Continue exploring to unlock the next phase.";
  }
}

export function useWhatsNextProgress(
  conversationId: string | null,
  currentPhase: Phase
): WhatsNextCardData | null {
  const [progressData, setProgressData] = useState<WhatsNextCardData | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/product-strategy-agent/progress?conversation_id=${conversationId}`
      );

      if (!response.ok) {
        console.warn('Failed to fetch progress data');
        return;
      }

      const data: ProgressResponse = await response.json();
      const requirements = calculateRequirements(currentPhase, data);
      const readiness = calculateReadiness(requirements);
      const progress = calculateProgress(requirements);
      const milestone = PHASE_MILESTONES[currentPhase];

      setProgressData({
        type: 'whats_next',
        id: `whats-next-${currentPhase}-${conversationId}`,
        timestamp: new Date().toISOString(),
        currentMilestone: milestone.current,
        currentPhase,
        nextMilestone: milestone.next,
        nextPhase: milestone.nextPhase,
        requirements,
        progressPercentage: progress,
        readiness,
        teaserText: getTeaser(currentPhase, readiness),
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, [conversationId, currentPhase]);

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProgress();
  }, [fetchProgress]);

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

  return progressData;
}
