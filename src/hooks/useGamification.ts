'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface GamificationState {
  xpTotal: number;
  level: number;
  levelTitle: string;
  xpForNextLevel: number;
  progressInLevel: number;
  streakDays: number;
  achievements: string[];
  isLoading: boolean;
}

export interface XPAwardResult {
  xpAwarded: number;
  levelUp: { newLevel: number } | null;
  newAchievements: string[];
}

type XPNotificationCallback = (result: XPAwardResult) => void;

const DEFAULT_STATE: GamificationState = {
  xpTotal: 0,
  level: 1,
  levelTitle: 'Strategist Apprentice',
  xpForNextLevel: 100,
  progressInLevel: 0,
  streakDays: 0,
  achievements: [],
  isLoading: true,
};

export function useGamification(onXPAwarded?: XPNotificationCallback) {
  const [state, setState] = useState<GamificationState>(DEFAULT_STATE);
  const callbackRef = useRef(onXPAwarded);
  useEffect(() => {
    callbackRef.current = onXPAwarded;
  }, [onXPAwarded]);

  // Fetch initial state
  useEffect(() => {
    let cancelled = false;

    const fetchState = async () => {
      try {
        const res = await fetch('/api/product-strategy-agent-v2/gamification');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setState({
              xpTotal: data.xpTotal,
              level: data.level,
              levelTitle: data.levelTitle,
              xpForNextLevel: data.xpForNextLevel,
              progressInLevel: data.progressInLevel,
              streakDays: data.streakDays,
              achievements: data.achievements || [],
              isLoading: false,
            });
          }
        } else {
          if (!cancelled) setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch {
        if (!cancelled) setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchState();
    return () => { cancelled = true; };
  }, []);

  // Award XP with optimistic update
  const awardXP = useCallback(async (
    eventType: string,
    metadata?: Record<string, unknown>,
  ): Promise<XPAwardResult | null> => {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, metadata }),
      });

      if (!res.ok) return null;

      const data = await res.json();

      // Update state from server response
      setState(prev => ({
        ...prev,
        xpTotal: data.xpTotal,
        level: data.level,
        levelTitle: data.levelTitle,
        xpForNextLevel: data.xpForNextLevel,
        progressInLevel: data.progressInLevel,
        streakDays: data.streakDays,
        achievements: data.allAchievements || prev.achievements,
      }));

      const result: XPAwardResult = {
        xpAwarded: data.xpAwarded,
        levelUp: data.levelUp,
        newAchievements: data.newAchievements || [],
      };

      // Notify via callback
      callbackRef.current?.(result);

      return result;
    } catch (err) {
      console.error('Failed to award XP:', err);
      return null;
    }
  }, []);

  return { ...state, awardXP };
}
