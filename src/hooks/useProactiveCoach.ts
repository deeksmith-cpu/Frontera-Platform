'use client';

/* eslint-disable react-hooks/set-state-in-effect */
// This hook intentionally sets state in response to timer callbacks,
// which is a legitimate pattern for time-based triggers.

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface ProactiveTrigger {
  id: string;
  type: 'idle' | 'progress' | 'return' | 'phase_ready';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface UseProactiveCoachOptions {
  phase: string;
  lastActivityAt: number;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  synthesisAvailable: boolean;
  onSendMessage: (message: string) => void;
  onNavigateToSynthesis?: () => void;
  isEnabled?: boolean;
}

// Storage key for dismissed triggers
const DISMISSED_STORAGE_KEY = 'frontera:dismissedTriggers';

function loadDismissedTriggers(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const saved = localStorage.getItem(DISMISSED_STORAGE_KEY);
    if (!saved) return new Set();
    return new Set(JSON.parse(saved));
  } catch {
    return new Set();
  }
}

function saveDismissedTriggers(triggers: Set<string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify([...triggers]));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for managing proactive coach triggers.
 * Monitors user progress and suggests actions based on context.
 */
export function useProactiveCoach({
  phase,
  lastActivityAt,
  territoryProgress,
  synthesisAvailable,
  onSendMessage,
  onNavigateToSynthesis,
  isEnabled = true,
}: UseProactiveCoachOptions) {
  const [dismissedTriggers, setDismissedTriggers] = useState<Set<string>>(() => loadDismissedTriggers());
  const [idleTriggerActive, setIdleTriggerActive] = useState(false);

  // Calculate total mapped areas
  const totalMapped = territoryProgress.company.mapped +
                      territoryProgress.customer.mapped +
                      territoryProgress.competitor.mapped;

  // Idle trigger: User hasn't interacted in 60s during research
  // Use timer effect but only set a boolean flag, not the full trigger
  useEffect(() => {
    if (!isEnabled) return;
    if (phase !== 'research') return;
    if (dismissedTriggers.has('idle')) return;

    // Reset idle trigger when deps change (new activity)
    setIdleTriggerActive(false);

    const idleTimer = setTimeout(() => {
      const timeSinceActivity = Date.now() - lastActivityAt;
      if (timeSinceActivity >= 60000) {
        setIdleTriggerActive(true);
      }
    }, 60000);

    return () => clearTimeout(idleTimer);
  }, [isEnabled, phase, lastActivityAt, dismissedTriggers]);

  // Compute the current trigger based on state (not in useEffect)
  const trigger = useMemo((): ProactiveTrigger | null => {
    if (!isEnabled) return null;

    // All 9 areas mapped trigger (highest priority)
    if (phase === 'research' && !synthesisAvailable && !dismissedTriggers.has('all_areas_mapped') && totalMapped >= 9) {
      return {
        id: 'all_areas_mapped',
        type: 'progress',
        message: "Excellent work! You've mapped all 9 research areas. Your synthesis will be comprehensive.",
        action: onNavigateToSynthesis ? {
          label: "Generate synthesis",
          onClick: onNavigateToSynthesis,
        } : undefined,
      };
    }

    // 4+ areas mapped trigger
    if (phase === 'research' && !synthesisAvailable && !dismissedTriggers.has('synthesis_ready') && totalMapped >= 4) {
      return {
        id: 'synthesis_ready',
        type: 'progress',
        message: "Great progress! You've mapped enough territory to generate your strategic synthesis.",
        action: onNavigateToSynthesis ? {
          label: "Generate synthesis",
          onClick: onNavigateToSynthesis,
        } : undefined,
      };
    }

    // Idle trigger
    if (phase === 'research' && !dismissedTriggers.has('idle') && idleTriggerActive) {
      return {
        id: 'idle',
        type: 'idle',
        message: "Need help with this research area? I can suggest questions to explore.",
        action: {
          label: "Get suggestions",
          onClick: () => onSendMessage("Can you help me with questions for this research area?"),
        },
      };
    }

    return null;
  }, [isEnabled, phase, totalMapped, synthesisAvailable, dismissedTriggers, onNavigateToSynthesis, onSendMessage, idleTriggerActive]);

  // Dismiss a trigger and persist it
  const dismissTrigger = useCallback((id: string) => {
    setDismissedTriggers(prev => {
      const next = new Set([...prev, id]);
      saveDismissedTriggers(next);
      return next;
    });
    // Reset idle trigger state if dismissing idle
    if (id === 'idle') {
      setIdleTriggerActive(false);
    }
  }, []);

  // Clear all dismissed triggers (for testing/reset)
  const clearDismissedTriggers = useCallback(() => {
    setDismissedTriggers(new Set());
    setIdleTriggerActive(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DISMISSED_STORAGE_KEY);
    }
  }, []);

  return {
    trigger,
    dismissTrigger,
    clearDismissedTriggers,
  };
}
