'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'frontera:coachPanel';

interface CoachPanelState {
  isCollapsed: boolean;
}

const DEFAULT_STATE: CoachPanelState = {
  isCollapsed: false,
};

function loadSavedState(): CoachPanelState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    const parsed = JSON.parse(saved);
    return {
      isCollapsed: parsed.isCollapsed ?? DEFAULT_STATE.isCollapsed,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: CoachPanelState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for managing the coach side panel state.
 * Persists collapsed state to localStorage.
 */
export function useCoachPanel() {
  // Use lazy initialization to load from localStorage
  const [state, setState] = useState<CoachPanelState>(() => loadSavedState());

  const collapse = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isCollapsed: true };
      saveState(newState);
      return newState;
    });
  }, []);

  const expand = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isCollapsed: false };
      saveState(newState);
      return newState;
    });
  }, []);

  const toggle = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isCollapsed: !prev.isCollapsed };
      saveState(newState);
      return newState;
    });
  }, []);

  return {
    isCollapsed: state.isCollapsed,
    collapse,
    expand,
    toggle,
  };
}
