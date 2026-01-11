'use client';

interface Step {
  id: string;
  label: string;
  sublabel: string;
  phase: 'discovery' | 'research' | 'synthesis' | 'bets';
  color: string; // Phase-specific color from design system
}

const STEPS: Step[] = [
  {
    id: '1',
    label: 'Discovery',
    sublabel: 'Context Setting',
    phase: 'discovery',
    color: 'emerald', // Emerald for discovery phase
  },
  {
    id: '2',
    label: '3Cs Research',
    sublabel: 'Terrain Mapping',
    phase: 'research',
    color: 'amber', // Amber for research phase
  },
  {
    id: '3',
    label: 'Synthesis',
    sublabel: 'Strategy Formation',
    phase: 'synthesis',
    color: 'purple', // Purple for synthesis phase
  },
  {
    id: '4',
    label: 'Strategic Bets',
    sublabel: 'Route Planning',
    phase: 'bets',
    color: 'cyan', // Cyan for planning phase
  },
];

interface HorizontalProgressStepperProps {
  currentPhase: 'discovery' | 'research' | 'synthesis' | 'bets';
}

export function HorizontalProgressStepper({ currentPhase }: HorizontalProgressStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.phase === currentPhase);

  return (
    <div className="horizontal-stepper py-8 px-10 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLocked = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg scale-110'
                      : isComplete
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>

                {/* Labels */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-semibold ${
                      isCurrent || isComplete ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div
                    className={`text-xs uppercase tracking-wider font-medium mt-0.5 ${
                      isCurrent
                        ? `text-${step.color}-600`
                        : isComplete
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.sublabel}
                  </div>
                  {isCurrent && (
                    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wide text-cyan-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                      You Are Here
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 mt-[-40px] transition-all duration-300 ${
                    index < currentIndex
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600'
                      : 'bg-slate-200'
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
