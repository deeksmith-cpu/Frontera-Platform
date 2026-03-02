'use client';

import { useEffect, useRef } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { PhaseProgressBar } from './PhaseProgressBar';
import { ContextPreviewContent } from './ContextPreviewContent';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

// Phase dot colors for the collapsed rail
const PHASE_RAIL_COLORS: Record<string, string> = {
  discovery: 'bg-emerald-500',
  research: 'bg-amber-500',
  synthesis: 'bg-purple-500',
  bets: 'bg-cyan-500',
  activation: 'bg-cyan-500',
  review: 'bg-slate-500',
};

const PHASE_ORDER = ['discovery', 'research', 'synthesis', 'bets', 'activation', 'review'] as const;

interface ContextPreviewPanelProps {
  conversation: Conversation | null;
  isCollapsed: boolean;
  onCollapse: () => void;
  onExpand: () => void;
}

export function ContextPreviewPanel({
  conversation,
  isCollapsed,
  onCollapse,
  onExpand,
}: ContextPreviewPanelProps) {
  const { currentPhase, contextPreviewScrollTarget, setContextPreviewScrollTarget } = useCoachJourney();
  const contentRef = useRef<HTMLDivElement>(null);

  // Listen to scroll target from context and scroll to relevant section
  useEffect(() => {
    if (contextPreviewScrollTarget && contentRef.current) {
      // Scroll to top of content area when target changes
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear the target after scrolling
      setContextPreviewScrollTarget(null);
    }
  }, [contextPreviewScrollTarget, setContextPreviewScrollTarget]);

  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const highestPhaseReached = (frameworkState?.highestPhaseReached as string) || currentPhase;
  const currentIndex = PHASE_ORDER.indexOf(currentPhase as typeof PHASE_ORDER[number]);
  const highestIndex = PHASE_ORDER.indexOf(highestPhaseReached as typeof PHASE_ORDER[number]);

  // Collapsed rail view (48px)
  if (isCollapsed) {
    return (
      <div className="flex-shrink-0 w-full h-full bg-white border-l border-slate-200 flex flex-col items-center pt-4 gap-4">
        <button
          onClick={onExpand}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Expand context panel"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>

        {/* Compact phase dots */}
        <div className="flex flex-col items-center gap-2 mt-2">
          {PHASE_ORDER.map((phase, i) => {
            const isActive = phase === currentPhase;
            const isReachable = i <= highestIndex;

            return (
              <div
                key={phase}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? `w-2.5 h-2.5 ${PHASE_RAIL_COLORS[phase]} animate-ring-pulse`
                    : isReachable && i < currentIndex
                    ? `w-2 h-2 ${PHASE_RAIL_COLORS[phase]} opacity-60`
                    : 'w-1.5 h-1.5 bg-slate-300'
                }`}
                title={phase.charAt(0).toUpperCase() + phase.slice(1)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <aside className="context-preview-panel bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden animate-entrance animate-delay-300">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Context
        </span>
        <button
          onClick={onCollapse}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Collapse context panel"
        >
          <PanelRightClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Phase progress bar */}
      <PhaseProgressBar />

      {/* Phase-specific content */}
      <ContextPreviewContent
        ref={contentRef}
        conversationId={conversation?.id ?? null}
      />
    </aside>
  );
}
