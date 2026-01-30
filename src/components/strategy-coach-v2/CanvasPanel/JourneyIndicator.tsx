'use client';

interface JourneyIndicatorProps {
  currentPhase: 'discovery' | 'research' | 'synthesis' | 'planning';
}

export function JourneyIndicator({ currentPhase }: JourneyIndicatorProps) {
  const phases = [
    { id: 'discovery', label: 'Discovery', sublabel: 'Context Setting' },
    { id: 'research', label: '3Cs Research', sublabel: 'Terrain Mapping' },
    { id: 'synthesis', label: 'Synthesis', sublabel: 'Strategy Formation' },
    { id: 'planning', label: 'Strategic Bets', sublabel: 'Route Planning' },
  ];

  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="journey-indicator flex items-center justify-center py-6 px-6 bg-white border-b border-slate-100">
      <div className="flex items-center gap-4">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={phase.id} className="flex items-center">
              {/* Phase Node */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-emerald-400 shadow-md'
                      : isActive
                      ? 'w-12 h-12 bg-[#1a1f3a] border-2 border-[#fbbf24] shadow-lg'
                      : 'w-10 h-10 bg-slate-100 border-2 border-slate-200'
                  } rounded-full`}
                >
                  {isCompleted && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  )}
                  {isPending && (
                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                  )}
                </div>

                {/* Phase Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? 'text-emerald-600'
                        : isActive
                        ? 'text-[#fbbf24]'
                        : 'text-slate-400'
                    }`}
                  >
                    {phase.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {phase.sublabel}
                  </div>
                </div>

                {/* "You Are Here" indicator for active phase */}
                {isActive && (
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1f3a] text-white rounded-full text-[10px] font-semibold shadow-md">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      You Are Here
                    </div>
                  </div>
                )}
              </div>

              {/* Arrow between phases */}
              {index < phases.length - 1 && (
                <div className="flex items-center mx-4 mb-6">
                  <svg
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isCompleted ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
