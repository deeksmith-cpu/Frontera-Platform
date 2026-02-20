'use client';

interface PhaseIndicatorProps {
  currentPhase: string;
  isIconOnly?: boolean;
  /** 'sidebar' renders on navy bg, 'topbar' renders on white bg as horizontal nav */
  variant?: 'sidebar' | 'topbar';
  /** Called when user clicks a phase. Receives the phase id. */
  onPhaseClick?: (phaseId: string) => void;
}

const PHASES = [
  { id: 'discovery', label: 'Discovery', dotActive: 'bg-emerald-500', dotComplete: 'bg-emerald-400', pillBg: 'bg-emerald-50', pillText: 'text-emerald-700', pillDot: 'bg-emerald-500' },
  { id: 'research', label: 'Research', dotActive: 'bg-amber-500', dotComplete: 'bg-amber-400', pillBg: 'bg-amber-50', pillText: 'text-amber-700', pillDot: 'bg-amber-500' },
  { id: 'synthesis', label: 'Synthesis', dotActive: 'bg-purple-500', dotComplete: 'bg-purple-400', pillBg: 'bg-purple-50', pillText: 'text-purple-700', pillDot: 'bg-purple-500' },
  { id: 'bets', label: 'Bets', dotActive: 'bg-cyan-500', dotComplete: 'bg-cyan-400', pillBg: 'bg-cyan-50', pillText: 'text-cyan-700', pillDot: 'bg-cyan-500' },
  { id: 'activation', label: 'Activate', dotActive: 'bg-emerald-500', dotComplete: 'bg-emerald-400', pillBg: 'bg-emerald-50', pillText: 'text-emerald-700', pillDot: 'bg-emerald-500' },
  { id: 'review', label: 'Review', dotActive: 'bg-amber-500', dotComplete: 'bg-amber-400', pillBg: 'bg-amber-50', pillText: 'text-amber-700', pillDot: 'bg-amber-500' },
] as const;

export function PhaseIndicator({ currentPhase, isIconOnly = false, variant = 'sidebar', onPhaseClick }: PhaseIndicatorProps) {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  // Top bar variant: horizontal nav on white background (centre panel)
  if (variant === 'topbar') {
    return (
      <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-2">
        <div className="flex items-center gap-1">
          {PHASES.map((phase, index) => {
            const isActive = index === currentIndex;
            const isComplete = index < currentIndex;
            const isClickable = !!onPhaseClick;
            return (
              <div key={phase.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onPhaseClick?.(phase.id)}
                  disabled={!isClickable}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? `${phase.pillBg} ${phase.pillText}`
                      : ''
                  } ${isClickable && !isActive ? 'hover:bg-slate-50 cursor-pointer' : ''} ${!isClickable ? 'cursor-default' : ''}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? `${phase.pillDot} animate-pulse`
                        : isComplete
                          ? phase.dotComplete
                          : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold transition-colors duration-300 ${
                      isActive
                        ? phase.pillText
                        : isComplete
                          ? 'text-slate-600'
                          : 'text-slate-400'
                    }`}
                  >
                    {phase.label}
                  </span>
                </button>
                {index < PHASES.length - 1 && (
                  <div className={`w-3 h-px ${index < currentIndex ? 'bg-slate-300' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Icon-only sidebar variant
  if (isIconOnly) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-3 px-1">
        {PHASES.map((phase, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div
              key={phase.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? `${phase.dotActive} animate-pulse`
                  : isComplete
                    ? phase.dotComplete
                    : 'bg-white/20'
              }`}
              title={phase.label}
            />
          );
        })}
      </div>
    );
  }

  // Full sidebar variant (navy background) - kept for reference but no longer used by default
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">Journey</p>
      <div className="flex items-center gap-1">
        {PHASES.map((phase, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div key={phase.id} className="flex items-center gap-1">
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-white/15' : ''
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? `${phase.dotActive} animate-pulse`
                      : isComplete
                        ? phase.dotComplete
                        : 'bg-white/20'
                  }`}
                />
                <span
                  className={`text-[9px] font-semibold transition-colors duration-300 ${
                    isActive ? 'text-white' : isComplete ? 'text-white/60' : 'text-white/25'
                  }`}
                >
                  {phase.label}
                </span>
              </div>
              {index < PHASES.length - 1 && (
                <div className={`w-2 h-px ${index < currentIndex ? 'bg-white/30' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
