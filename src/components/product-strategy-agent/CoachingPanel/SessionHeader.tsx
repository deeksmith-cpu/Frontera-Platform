'use client';

import { ChevronLeft, X } from 'lucide-react';
import { PersonaSelector } from './PersonaSelector';
import type { Database } from '@/types/database';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface SessionHeaderProps {
  conversation: Conversation;
  onClose?: () => void;
  onCollapse?: () => void;
  isPopup?: boolean;
  isSidepanel?: boolean;
  currentPersona?: PersonaId;
  onPersonaChange?: (persona: PersonaId | null) => void;
  isPersonaLoading?: boolean;
}

// Phase configuration with colors matching the progress stepper
const PHASE_CONFIG: Record<string, {
  label: string;
  sublabel: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
}> = {
  discovery: {
    label: 'Discovery',
    sublabel: 'Context Setting',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-600',
    dotClass: 'bg-emerald-600',
  },
  research: {
    label: 'Landscape',
    sublabel: 'Terrain Mapping',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-600',
    dotClass: 'bg-amber-600',
  },
  synthesis: {
    label: 'Synthesis',
    sublabel: 'Pattern Recognition',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-600',
    dotClass: 'bg-purple-600',
  },
  bets: {
    label: 'Strategic Bets',
    sublabel: 'Route Planning',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-600',
    dotClass: 'bg-cyan-600',
  },
  planning: {
    label: 'Planning',
    sublabel: 'Execution',
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-600',
    dotClass: 'bg-cyan-600',
  },
};

export function SessionHeader({
  conversation,
  onClose,
  onCollapse,
  isPopup = false,
  isSidepanel = false,
  currentPersona,
  onPersonaChange,
  isPersonaLoading = false,
}: SessionHeaderProps) {
  // Extract phase from framework_state
  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

  // Get phase configuration with fallback
  const phase = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.discovery;

  return (
    <header
      className={`coaching-header p-6 border-b border-slate-100 bg-white ${
        isPopup ? 'popup-drag-handle cursor-move select-none' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="session-meta text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
            Strategy Coach
          </div>
          <h1 className="session-title text-xl font-bold leading-tight text-slate-900 mb-3 truncate">
            {conversation.title || 'Strategic Context Analysis'}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Phase-aware badge with dynamic colors */}
            <div className={`phase-indicator inline-flex items-center gap-2 text-xs py-1.5 px-3 rounded-full tracking-wide font-semibold ${phase.bgClass}`}>
              <span className={`phase-dot w-1.5 h-1.5 rounded-full animate-pulse ${phase.dotClass}`} />
              <span className={phase.textClass}>{phase.label}</span>
              <span className={`${phase.textClass} opacity-70`}>· {phase.sublabel}</span>
            </div>

            {/* Persona Selector - only show in sidepanel mode */}
            {isSidepanel && onPersonaChange && (
              <PersonaSelector
                currentPersona={currentPersona}
                onSelect={onPersonaChange}
                isLoading={isPersonaLoading}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse button - only show when in sidepanel mode */}
          {isSidepanel && onCollapse && (
            <button
              onClick={onCollapse}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              aria-label="Collapse coach panel"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Close button - only show when in popup mode */}
          {isPopup && onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              aria-label="Close coach panel"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
