'use client';

import { useState, useCallback, useEffect } from 'react';

export type LayoutPanel = 'sidebar' | 'coach' | 'canvas';

interface UseStrategyLayoutReturn {
  /** Whether the left sidebar is visible (full or icon-only) */
  isSidebarOpen: boolean;
  /** Whether the sidebar shows icons only (tablet) vs full (desktop) */
  isSidebarIconOnly: boolean;
  /** Whether the right canvas panel is visible */
  isCanvasVisible: boolean;
  /** Whether the mobile sidebar drawer is open */
  isMobileDrawerOpen: boolean;
  /** Whether the mobile canvas overlay is open */
  isMobileCanvasOpen: boolean;
  /** Current breakpoint */
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  /** Toggle mobile sidebar drawer */
  toggleMobileDrawer: () => void;
  /** Toggle mobile canvas overlay */
  toggleMobileCanvas: () => void;
  /** Close all overlays */
  closeOverlays: () => void;
  /** Toggle canvas panel visibility on desktop */
  toggleCanvas: () => void;
}

function getBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function useStrategyLayout(): UseStrategyLayoutReturn {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileCanvasOpen, setIsMobileCanvasOpen] = useState(false);
  const [isCanvasHidden, setIsCanvasHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const bp = getBreakpoint();
      setBreakpoint(bp);
      // Close mobile overlays when resizing to desktop
      if (bp === 'desktop') {
        setIsMobileDrawerOpen(false);
        setIsMobileCanvasOpen(false);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen(prev => !prev);
    setIsMobileCanvasOpen(false);
  }, []);

  const toggleMobileCanvas = useCallback(() => {
    setIsMobileCanvasOpen(prev => !prev);
    setIsMobileDrawerOpen(false);
  }, []);

  const closeOverlays = useCallback(() => {
    setIsMobileDrawerOpen(false);
    setIsMobileCanvasOpen(false);
  }, []);

  const toggleCanvas = useCallback(() => {
    setIsCanvasHidden(prev => !prev);
  }, []);

  const isSidebarOpen = breakpoint === 'desktop' || breakpoint === 'tablet';
  const isSidebarIconOnly = breakpoint === 'tablet';
  const isCanvasVisible = breakpoint === 'desktop' && !isCanvasHidden;

  return {
    isSidebarOpen,
    isSidebarIconOnly,
    isCanvasVisible,
    isMobileDrawerOpen,
    isMobileCanvasOpen,
    breakpoint,
    toggleMobileDrawer,
    toggleMobileCanvas,
    closeOverlays,
    toggleCanvas,
  };
}
