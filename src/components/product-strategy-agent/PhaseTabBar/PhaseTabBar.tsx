'use client';

import { Check, Lock } from 'lucide-react';

const PHASES = [
  { id: 'discovery', label: 'Discovery', color: 'emerald' },
  { id: 'research', label: 'Research', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', color: 'purple' },
  { id: 'bets', label: 'Strategic Bets', color: 'cyan' },
  { id: 'activation', label: 'Activation', color: 'amber' },
  { id: 'review', label: 'Review', color: 'slate' },
] as const;

const PHASE_ORDER: string[] = PHASES.map((p) => p.id);

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-300', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-300', dot: 'bg-amber-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-300', dot: 'bg-purple-500' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-300', dot: 'bg-cyan-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-300', dot: 'bg-slate-400' },
};

interface PhaseTabBarProps {
  currentPhase: string;
  highestPhaseReached: string;
  onPhaseClick: (phase: string) => void;
}

function getPhaseState(
  phaseId: string,
  currentPhase: string,
  highestPhaseReached: string,
): 'active' | 'completed' | 'locked' {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  const highestIdx = PHASE_ORDER.indexOf(highestPhaseReached);
  const phaseIdx = PHASE_ORDER.indexOf(phaseId);

  if (phaseId === currentPhase) return 'active';
  if (phaseIdx < currentIdx || phaseIdx <= highestIdx) return 'completed';
  return 'locked';
}

export function PhaseTabBar({ currentPhase, highestPhaseReached, onPhaseClick }: PhaseTabBarProps) {
  return (
    <nav
      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide"
      aria-label="Phase navigation"
    >
      {PHASES.map((phase, index) => {
        const state = getPhaseState(phase.id, currentPhase, highestPhaseReached);
        const colors = COLOR_MAP[phase.color];
        const isClickable = state !== 'locked';

        return (
          <div key={phase.id} className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => isClickable && onPhaseClick(phase.id)}
              disabled={!isClickable}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all duration-300 whitespace-nowrap
                ${state === 'active'
                  ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}`
                  : state === 'completed'
                  ? `bg-white text-slate-600 hover:bg-slate-50 border border-slate-200`
                  : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                }
              `}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              {state === 'active' && (
                <span className={`w-2 h-2 rounded-full ${colors.dot} animate-ring-pulse`} />
              )}
              {state === 'completed' && (
                <Check className="w-3 h-3 text-emerald-500" />
              )}
              {state === 'locked' && (
                <Lock className="w-3 h-3" />
              )}
              {phase.label}
            </button>
            {index < PHASES.length - 1 && (
              <span className="text-slate-300 text-[10px]">→</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
