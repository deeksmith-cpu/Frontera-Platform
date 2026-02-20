'use client';

import { useState, useCallback } from 'react';

export type ContextPanelView = 'discovery' | 'research' | 'synthesis' | 'bets' | 'activation' | 'review';

interface UseContextPanelReturn {
  activeView: ContextPanelView;
  isCollapsed: boolean;
  isExpanded: boolean;
  isPinned: boolean;
  setActiveView: (view: ContextPanelView) => void;
  collapse: () => void;
  expand: () => void;
  toggleCollapse: () => void;
  toggleExpand: () => void;
  togglePin: () => void;
  syncWithPhase: (phase: string) => void;
}

export function useContextPanel(initialPhase: string = 'discovery'): UseContextPanelReturn {
  const phaseToView = (phase: string): ContextPanelView => {
    switch (phase) {
      case 'discovery': return 'discovery';
      case 'research': return 'research';
      case 'synthesis': return 'synthesis';
      case 'bets':
      case 'planning': return 'bets';
      case 'activation': return 'activation';
      case 'review': return 'review';
      default: return 'discovery';
    }
  };

  const [activeView, setActiveView] = useState<ContextPanelView>(phaseToView(initialPhase));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
    setIsExpanded(false);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
    setIsCollapsed(false);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
    if (!isCollapsed) setIsExpanded(false);
  }, [isCollapsed]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) setIsCollapsed(false);
  }, [isExpanded]);

  const togglePin = useCallback(() => {
    setIsPinned((prev) => !prev);
  }, []);

  const syncWithPhase = useCallback((phase: string) => {
    if (!isPinned) {
      setActiveView(phaseToView(phase));
    }
  }, [isPinned]);

  return {
    activeView,
    isCollapsed,
    isExpanded,
    isPinned,
    setActiveView,
    collapse,
    expand,
    toggleCollapse,
    toggleExpand,
    togglePin,
    syncWithPhase,
  };
}
