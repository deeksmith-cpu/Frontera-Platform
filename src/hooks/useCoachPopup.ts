'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'frontera:coachPopup';

interface CoachPopupState {
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const DEFAULT_STATE: CoachPopupState = {
  isOpen: false,
  position: { x: 80, y: 80 },
  size: { width: 420, height: 600 },
};

const CONSTRAINTS = {
  minWidth: 360,
  minHeight: 400,
  maxWidth: 600,
  maxHeight: 800,
};

function loadSavedState(): Partial<CoachPopupState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveState(state: Omit<CoachPopupState, 'isOpen'>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      position: state.position,
      size: state.size,
    }));
  } catch {
    // Ignore storage errors
  }
}

function isValidPosition(pos: { x: number; y: number }): boolean {
  if (typeof window === 'undefined') return true;
  const { innerWidth, innerHeight } = window;
  return (
    pos.x >= 0 &&
    pos.x < innerWidth - 100 &&
    pos.y >= 0 &&
    pos.y < innerHeight - 100
  );
}

function isValidSize(size: { width: number; height: number }): boolean {
  return (
    size.width >= CONSTRAINTS.minWidth &&
    size.width <= CONSTRAINTS.maxWidth &&
    size.height >= CONSTRAINTS.minHeight &&
    size.height <= CONSTRAINTS.maxHeight
  );
}

export function useCoachPopup() {
  const [state, setState] = useState<CoachPopupState>(DEFAULT_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(prev => ({
        ...prev,
        position: saved.position && isValidPosition(saved.position)
          ? saved.position
          : prev.position,
        size: saved.size && isValidSize(saved.size)
          ? saved.size
          : prev.size,
        // Always start closed
        isOpen: false,
      }));
    }
  }, []);

  // Save to localStorage when position/size changes (debounced via callback)
  const persistState = useCallback((position: { x: number; y: number }, size: { width: number; height: number }) => {
    saveState({ position, size });
  }, []);

  const open = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const updatePosition = useCallback((x: number, y: number) => {
    setState(prev => {
      const newState = { ...prev, position: { x, y } };
      persistState(newState.position, newState.size);
      return newState;
    });
  }, [persistState]);

  const updateSize = useCallback((width: number, height: number) => {
    setState(prev => {
      const newState = { ...prev, size: { width, height } };
      persistState(newState.position, newState.size);
      return newState;
    });
  }, [persistState]);

  const resetToDefault = useCallback(() => {
    setState({
      ...DEFAULT_STATE,
      isOpen: state.isOpen,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.isOpen]);

  return {
    isOpen: state.isOpen,
    position: state.position,
    size: state.size,
    constraints: CONSTRAINTS,
    open,
    close,
    toggle,
    updatePosition,
    updateSize,
    resetToDefault,
  };
}

/**
 * Simple media query hook for responsive behavior
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
