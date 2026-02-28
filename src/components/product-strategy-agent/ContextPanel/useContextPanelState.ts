'use client';

import { useState, useCallback, useEffect } from 'react';

export type LayoutMode = 'modern' | 'classic';

interface ContextPanelLayoutState {
  layoutMode: LayoutMode;
  coachWidthPct: number;
  contextCollapsed: boolean;
}

const STORAGE_KEY = 'frontera:strategyLayout';

const DEFAULT_STATE: ContextPanelLayoutState = {
  layoutMode: 'modern',
  coachWidthPct: 60,
  contextCollapsed: false,
};

const CLASSIC_COACH_WIDTH = 25;

const CONSTRAINTS = {
  minCoachWidth: 35,
  maxCoachWidth: 75,
  minContextWidth: 25,
};

function loadSavedState(): ContextPanelLayoutState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      layoutMode: parsed.layoutMode === 'classic' ? 'classic' : 'modern',
      coachWidthPct: typeof parsed.coachWidthPct === 'number'
        ? Math.min(CONSTRAINTS.maxCoachWidth, Math.max(CONSTRAINTS.minCoachWidth, parsed.coachWidthPct))
        : DEFAULT_STATE.coachWidthPct,
      contextCollapsed: typeof parsed.contextCollapsed === 'boolean'
        ? parsed.contextCollapsed
        : DEFAULT_STATE.contextCollapsed,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: ContextPanelLayoutState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function useContextPanelState() {
  const [state, setState] = useState<ContextPanelLayoutState>(loadSavedState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setState((prev) => ({
      ...prev,
      layoutMode: mode,
      coachWidthPct: mode === 'classic' ? CLASSIC_COACH_WIDTH : 60,
      contextCollapsed: false,
    }));
  }, []);

  const toggleLayoutMode = useCallback(() => {
    setState((prev) => {
      const newMode = prev.layoutMode === 'modern' ? 'classic' : 'modern';
      return {
        ...prev,
        layoutMode: newMode,
        coachWidthPct: newMode === 'classic' ? CLASSIC_COACH_WIDTH : 60,
        contextCollapsed: false,
      };
    });
  }, []);

  const setCoachWidth = useCallback((pct: number) => {
    setState((prev) => ({
      ...prev,
      coachWidthPct: Math.min(CONSTRAINTS.maxCoachWidth, Math.max(CONSTRAINTS.minCoachWidth, pct)),
    }));
  }, []);

  const collapseContext = useCallback(() => {
    setState((prev) => ({ ...prev, contextCollapsed: true }));
  }, []);

  const expandContext = useCallback(() => {
    setState((prev) => ({ ...prev, contextCollapsed: false }));
  }, []);

  const toggleContext = useCallback(() => {
    setState((prev) => ({ ...prev, contextCollapsed: !prev.contextCollapsed }));
  }, []);

  const isModern = state.layoutMode === 'modern';
  const contextWidthPct = state.contextCollapsed ? 0 : (100 - state.coachWidthPct);

  return {
    layoutMode: state.layoutMode,
    isModern,
    coachWidthPct: state.coachWidthPct,
    contextWidthPct,
    contextCollapsed: state.contextCollapsed,
    constraints: CONSTRAINTS,
    setLayoutMode,
    toggleLayoutMode,
    setCoachWidth,
    collapseContext,
    expandContext,
    toggleContext,
  };
}
