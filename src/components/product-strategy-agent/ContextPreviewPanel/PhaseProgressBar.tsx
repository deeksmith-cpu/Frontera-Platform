'use client';

import { CheckCircle2 } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';

const PHASES = [
  { id: 'discovery', label: 'Discovery', color: 'emerald' },
  { id: 'research', label: 'Research', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', color: 'purple' },
  { id: 'bets', label: 'Bets', color: 'cyan' },
  { id: 'activation', label: 'Activation', color: 'cyan' },
  { id: 'review', label: 'Review', color: 'slate' },
] as const;

const PHASE_DOT_COLORS: Record<string, { active: string; completed: string; inactive: string }> = {
  emerald: {
    active: 'bg-emerald-500',
    completed: 'text-emerald-500',
    inactive: 'bg-slate-300',
  },
  amber: {
    active: 'bg-amber-500',
    completed: 'text-amber-500',
    inactive: 'bg-slate-300',
  },
  purple: {
    active: 'bg-purple-500',
    completed: 'text-purple-500',
    inactive: 'bg-slate-300',
  },
  cyan: {
    active: 'bg-cyan-500',
    completed: 'text-cyan-500',
    inactive: 'bg-slate-300',
  },
  slate: {
    active: 'bg-slate-500',
    completed: 'text-slate-500',
    inactive: 'bg-slate-300',
  },
};

function getPhaseIndex(phaseId: string): number {
  return PHASES.findIndex((p) => p.id === phaseId);
}

export function PhaseProgressBar() {
  const { currentPhase, conversation, handlePhaseTransition } = useCoachJourney();

  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const highestPhaseReached = (frameworkState?.highestPhaseReached as string) || currentPhase;

  const currentIndex = getPhaseIndex(currentPhase);
  const highestIndex = getPhaseIndex(highestPhaseReached);

  return (
    <div className="flex-shrink-0 px-4 py-3 border-b border-slate-100">
      <div className="flex items-center justify-between">
        {PHASES.map((phase, i) => {
          const colors = PHASE_DOT_COLORS[phase.color];
          const isActive = phase.id === currentPhase;
          const isCompleted = i < currentIndex;
          const isReachable = i <= highestIndex;

          return (
            <div key={phase.id} className="flex items-center">
              {/* Phase dot */}
              <button
                onClick={() => {
                  if (isReachable && !isActive) {
                    void handlePhaseTransition(phase.id);
                  }
                }}
                disabled={!isReachable || isActive}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isReachable && !isActive ? 'cursor-pointer hover:scale-125' : ''
                } ${!isReachable ? 'cursor-not-allowed opacity-50' : ''}`}
                aria-label={`${phase.label} phase${isActive ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}`}
                title={phase.label}
              >
                {isCompleted ? (
                  <CheckCircle2
                    className={`w-4 h-4 ${colors.completed}`}
                  />
                ) : (
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? `${colors.active} animate-ring-pulse`
                        : colors.inactive
                    }`}
                  />
                )}

                {/* Label below for active phase */}
                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                    {phase.label}
                  </span>
                )}
              </button>

              {/* Connecting line */}
              {i < PHASES.length - 1 && (
                <div
                  className={`w-4 h-0.5 mx-0.5 rounded-full transition-all duration-300 ${
                    i < currentIndex ? 'bg-slate-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
