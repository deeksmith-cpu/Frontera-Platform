'use client';

import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface SessionHeaderProps {
  conversation: Conversation;
  onClose?: () => void;
  isPopup?: boolean;
}

export function SessionHeader({ conversation, onClose, isPopup = false }: SessionHeaderProps) {
  // Extract phase from framework_state
  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

  // Map phases to display labels
  const phaseLabels: Record<string, string> = {
    discovery: 'Discovery Phase',
    research: 'Research Phase',
    synthesis: 'Synthesis Phase',
    planning: 'Planning Phase',
  };

  return (
    <header
      className={`coaching-header p-6 border-b border-slate-100 bg-white ${
        isPopup ? 'popup-drag-handle cursor-move select-none' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="session-meta text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
            Session · {phaseLabels[currentPhase]}
          </div>
          <h1 className="session-title text-xl font-bold leading-tight text-slate-900 mb-3 truncate">
            {conversation.title || 'Strategic Context Analysis'}
          </h1>
          <div className="phase-indicator inline-flex items-center gap-2 text-xs text-cyan-600 py-1.5 px-3 bg-cyan-50 rounded-full tracking-wide font-semibold">
            <span className="phase-dot w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
            <span>Strategic Terrain Mapping</span>
          </div>
        </div>

        {/* Close button - only show when in popup mode */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            aria-label="Close coach panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
