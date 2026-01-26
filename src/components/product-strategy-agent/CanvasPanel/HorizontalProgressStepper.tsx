'use client';

import { DiscoveryIcon, LandscapeIcon, SynthesisIcon, StrategicBetsIcon, CheckIcon } from '@/components/icons/TerritoryIcons';

interface Step {
  id: string;
  label: string;
  sublabel: string;
  phase: 'discovery' | 'research' | 'synthesis' | 'bets';
  color: string; // Phase-specific color from design system
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const STEPS: Step[] = [
  {
    id: '1',
    label: 'Discovery',
    sublabel: 'Context Setting',
    phase: 'discovery',
    color: 'emerald', // Emerald for discovery phase
    icon: DiscoveryIcon,
  },
  {
    id: '2',
    label: 'Landscape',
    sublabel: 'Terrain Mapping',
    phase: 'research',
    color: 'amber', // Amber for research phase
    icon: LandscapeIcon,
  },
  {
    id: '3',
    label: 'Synthesis',
    sublabel: 'Strategy Formation',
    phase: 'synthesis',
    color: 'purple', // Purple for synthesis phase
    icon: SynthesisIcon,
  },
  {
    id: '4',
    label: 'Strategic Bets',
    sublabel: 'Route Planning',
    phase: 'bets',
    color: 'cyan', // Cyan for planning phase
    icon: StrategicBetsIcon,
  },
];

interface HorizontalProgressStepperProps {
  currentPhase: 'discovery' | 'research' | 'synthesis' | 'bets';
  highestPhaseReached?: 'discovery' | 'research' | 'synthesis' | 'bets';
  onPhaseClick?: (phase: 'discovery' | 'research' | 'synthesis' | 'bets') => void;
}

export function HorizontalProgressStepper({ currentPhase, highestPhaseReached, onPhaseClick }: HorizontalProgressStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.phase === currentPhase);
  // Use highestPhaseReached if provided, otherwise fall back to current phase
  const effectiveHighest = highestPhaseReached || currentPhase;
  const highestIndex = STEPS.findIndex((s) => s.phase === effectiveHighest);

  // Helper function to get phase-specific classes
  const getPhaseClasses = (color: string, state: 'current' | 'complete') => {
    if (state === 'current') {
      switch (color) {
        case 'emerald':
          return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-xl';
        case 'amber':
          return 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-xl';
        case 'purple':
          return 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-purple-xl';
        case 'cyan':
          return 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-xl';
        default:
          return 'bg-gradient-to-br from-indigo-600 to-cyan-600 shadow-indigo-xl';
      }
    } else {
      // Complete state
      switch (color) {
        case 'emerald':
          return 'bg-emerald-500 shadow-emerald-lg';
        case 'amber':
          return 'bg-amber-500 shadow-amber-lg';
        case 'purple':
          return 'bg-purple-600 shadow-purple-lg';
        case 'cyan':
          return 'bg-cyan-500 shadow-cyan-lg';
        default:
          return 'bg-indigo-600 shadow-indigo-lg';
      }
    }
  };

  const getTextColorClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'text-emerald-600';
      case 'amber':
        return 'text-amber-600';
      case 'purple':
        return 'text-purple-600';
      case 'cyan':
        return 'text-cyan-600';
      default:
        return 'text-indigo-600';
    }
  };

  const getConnectorGradient = (fromColor: string, toColor: string) => {
    return `bg-gradient-to-r from-${fromColor}-500 to-${toColor}-500`;
  };

  return (
    <div className="horizontal-stepper py-3 px-4 md:py-4 md:px-8 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isVisited = index <= highestIndex && !isCurrent; // Any phase reached before (not current)
          const isLocked = index > highestIndex; // Only lock phases beyond highest reached
          const Icon = step.icon;
          const nextStep = STEPS[index + 1];

          // Clickable if visited or current (up to highest phase reached)
          const isClickable = (isVisited || isCurrent) && onPhaseClick;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Compact Circle with Phase Color - Raised effect on hover */}
                <button
                  onClick={() => isClickable && onPhaseClick(step.phase)}
                  disabled={isLocked || !onPhaseClick}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 ${
                    isCurrent
                      ? `${getPhaseClasses(step.color, 'current')} text-white scale-110 shadow-lg`
                      : isVisited
                      ? `${getPhaseClasses(step.color, 'complete')} text-white shadow-md`
                      : 'bg-slate-200 text-slate-500'
                  } ${
                    isClickable
                      ? 'cursor-pointer hover:scale-125 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-offset-2 hover:ring-cyan-400'
                      : isLocked
                      ? 'cursor-not-allowed opacity-60'
                      : ''
                  }`}
                  aria-label={`Go to ${step.label} phase`}
                >
                  {isVisited ? (
                    <CheckIcon className="text-white" size={16} />
                  ) : isCurrent ? (
                    <Icon className="text-white" size={16} />
                  ) : (
                    <span className="text-xs md:text-sm">{step.id}</span>
                  )}
                </button>

                {/* Compact Labels */}
                <div className="mt-1.5 md:mt-2 text-center">
                  <div
                    className={`text-xs md:text-sm font-bold ${
                      isCurrent || isVisited ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </div>
                  {/* Sublabel - hidden on mobile */}
                  <div
                    className={`hidden md:block text-[10px] uppercase tracking-wider font-semibold mt-0.5 ${
                      isCurrent
                        ? getTextColorClass(step.color)
                        : isVisited
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.sublabel}
                  </div>
                  {/* "You Are Here" indicator - only on desktop */}
                  {isCurrent && (
                    <div className="hidden md:flex mt-1 items-center justify-center gap-1 text-[9px] uppercase tracking-wide text-cyan-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                      You Are Here
                    </div>
                  )}
                  {/* Mobile current indicator - just a dot */}
                  {isCurrent && (
                    <div className="flex md:hidden mt-1 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line with Phase-Specific Gradient */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 md:h-1 flex-1 mx-1 md:mx-3 mt-[-24px] md:mt-[-32px] transition-all duration-300 rounded-full ${
                    index < highestIndex
                      ? getConnectorGradient(step.color, nextStep.color)
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
