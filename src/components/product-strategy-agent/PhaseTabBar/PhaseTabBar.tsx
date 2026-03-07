'use client';

import { Check, Lock } from 'lucide-react';
import type { GamificationState } from '@/hooks/useGamification';

const PHASES = [
  { id: 'discovery', label: 'Discovery', color: 'emerald' },
  { id: 'research', label: 'Research', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', color: 'purple' },
  { id: 'bets', label: 'Strategic Bets', color: 'cyan' },
  { id: 'activation', label: 'Activation', color: 'amber' },
  { id: 'review', label: 'Review', color: 'slate' },
] as const;

const PHASE_ORDER: string[] = PHASES.map((p) => p.id);

const COLOR_MAP: Record<string, { activeBg: string; activeText: string; dot: string }> = {
  emerald: { activeBg: 'bg-emerald-600', activeText: 'text-white', dot: 'bg-emerald-400' },
  amber: { activeBg: 'bg-amber-600', activeText: 'text-white', dot: 'bg-amber-300' },
  purple: { activeBg: 'bg-purple-600', activeText: 'text-white', dot: 'bg-purple-400' },
  cyan: { activeBg: 'bg-cyan-600', activeText: 'text-white', dot: 'bg-cyan-300' },
  slate: { activeBg: 'bg-slate-600', activeText: 'text-white', dot: 'bg-slate-400' },
};

interface PhaseTabBarProps {
  currentPhase: string;
  highestPhaseReached: string;
  onPhaseClick: (phase: string) => void;
  gamification?: GamificationState;
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

export function PhaseTabBar({ currentPhase, highestPhaseReached, onPhaseClick, gamification }: PhaseTabBarProps) {
  // Calculate progress percentage
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  const progressPercent = Math.round(((currentIdx + 1) / PHASES.length) * 100);

  // XP progress
  const showXP = gamification && !gamification.isLoading;
  const xpPercent = showXP && gamification.xpForNextLevel > 0
    ? Math.min((gamification.xpTotal / gamification.xpForNextLevel) * 100, 100)
    : 0;

  return (
    <nav
      className="flex-shrink-0 bg-slate-200 border-b border-slate-300"
      aria-label="Phase navigation"
    >
      {/* Phase tabs */}
      <div className="flex items-center gap-0.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
        {PHASES.map((phase, index) => {
          const state = getPhaseState(phase.id, currentPhase, highestPhaseReached);
          const colors = COLOR_MAP[phase.color];
          const isClickable = state !== 'locked';

          return (
            <div key={phase.id} className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => isClickable && onPhaseClick(phase.id)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-300 whitespace-nowrap
                  ${state === 'active'
                    ? `${colors.activeBg} ${colors.activeText} shadow-md`
                    : state === 'completed'
                    ? 'bg-white text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-slate-300'
                    : 'bg-transparent text-slate-400 cursor-not-allowed'
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
                <div className={`w-4 h-px mx-0.5 ${
                  state === 'completed' || state === 'active'
                    ? 'bg-slate-400'
                    : 'bg-slate-300'
                }`} />
              )}
            </div>
          );
        })}

        {/* Right-aligned: XP progress + phase progress */}
        <div className="ml-auto flex items-center gap-4 pl-4 flex-shrink-0">
          {showXP && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-sm">
                <span className="text-[9px] font-bold text-slate-900">{gamification.level}</span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-[80px]">
                <div className="h-1.5 bg-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fbbf24] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-semibold font-[family-name:var(--font-code)]">
                  {gamification.xpTotal}/{gamification.xpForNextLevel} XP
                </span>
              </div>
              {gamification.streakDays > 0 && (
                <div className="flex items-center gap-0.5 text-[10px] text-orange-500 font-semibold">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {gamification.streakDays}d
                </div>
              )}
            </div>
          )}

          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-300">
        <div
          className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </nav>
  );
}
