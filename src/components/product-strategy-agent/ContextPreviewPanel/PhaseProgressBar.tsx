'use client';

import { CheckCircle2, Lock } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';

const PHASES = [
  { id: 'discovery', label: 'Discovery', color: 'emerald' },
  { id: 'research', label: 'Research', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', color: 'purple' },
  { id: 'bets', label: 'Bets', color: 'cyan' },
  { id: 'activation', label: 'Activation', color: 'cyan' },
  { id: 'review', label: 'Review', color: 'slate' },
] as const;

const PHASE_COLORS: Record<string, {
  dot: string;
  ring: string;
  label: string;
  line: string;
  bg: string;
}> = {
  emerald: {
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    label: 'text-emerald-700',
    line: 'bg-emerald-300',
    bg: 'bg-emerald-50',
  },
  amber: {
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
    label: 'text-amber-700',
    line: 'bg-amber-300',
    bg: 'bg-amber-50',
  },
  purple: {
    dot: 'bg-purple-500',
    ring: 'ring-purple-200',
    label: 'text-purple-700',
    line: 'bg-purple-300',
    bg: 'bg-purple-50',
  },
  cyan: {
    dot: 'bg-cyan-500',
    ring: 'ring-cyan-200',
    label: 'text-cyan-700',
    line: 'bg-cyan-300',
    bg: 'bg-cyan-50',
  },
  slate: {
    dot: 'bg-slate-500',
    ring: 'ring-slate-200',
    label: 'text-slate-700',
    line: 'bg-slate-300',
    bg: 'bg-slate-50',
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
    <div className="flex-shrink-0 px-3 py-3 border-b border-slate-100 bg-white">
      {/* Progress line background */}
      <div className="relative">
        <div className="flex items-start justify-between">
          {PHASES.map((phase, i) => {
            const colors = PHASE_COLORS[phase.color];
            const isActive = phase.id === currentPhase;
            const isCompleted = i < currentIndex;
            const isReachable = i <= highestIndex;
            const isLocked = !isReachable;

            return (
              <div
                key={phase.id}
                className="flex flex-col items-center relative"
                style={{ flex: '1 1 0%' }}
              >
                {/* Connecting line (drawn before each dot except first) */}
                {i > 0 && (
                  <div
                    className={`absolute top-3 right-1/2 h-0.5 transition-all duration-300 ${
                      i <= currentIndex
                        ? PHASE_COLORS[PHASES[i - 1].color].line
                        : 'bg-slate-200'
                    }`}
                    style={{ width: '100%' }}
                  />
                )}

                {/* Phase dot + label */}
                <button
                  onClick={() => {
                    if (isReachable && !isActive) {
                      void handlePhaseTransition(phase.id);
                    }
                  }}
                  disabled={isLocked || isActive}
                  className={`relative z-10 flex flex-col items-center gap-1.5 transition-all duration-300 ${
                    isReachable && !isActive ? 'cursor-pointer group' : ''
                  } ${isLocked ? 'cursor-not-allowed' : ''}`}
                  aria-label={`${phase.label} phase${isActive ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}`}
                  title={isLocked ? `${phase.label} — Complete previous phases to unlock` : phase.label}
                >
                  {/* Dot */}
                  <div className={`flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `w-6 h-6 rounded-full ${colors.dot} ring-4 ${colors.ring} shadow-sm`
                      : isCompleted
                        ? 'w-6 h-6'
                        : isReachable
                          ? `w-5 h-5 rounded-full ${colors.dot} opacity-60 group-hover:opacity-100 group-hover:scale-110`
                          : 'w-5 h-5 rounded-full bg-slate-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className={`w-6 h-6 ${colors.label}`} />
                    ) : isActive ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    ) : isLocked ? (
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                    ) : null}
                  </div>

                  {/* Label — always visible */}
                  <span className={`text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? colors.label
                      : isCompleted
                        ? 'text-slate-500'
                        : isReachable
                          ? 'text-slate-400 group-hover:text-slate-600'
                          : 'text-slate-300'
                  }`}>
                    {phase.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
