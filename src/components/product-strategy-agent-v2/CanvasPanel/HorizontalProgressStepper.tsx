'use client';

import { DiscoveryIcon, LandscapeIcon, SynthesisIcon, StrategicBetsIcon, CheckIcon } from '@/components/icons/TerritoryIcons';

interface Step {
  id: string;
  label: string;
  sublabel: string;
  phase: 'discovery' | 'research' | 'synthesis' | 'bets';
  color: string; // Phase-specific color from design system
  icon: React.ComponentType<{ className?: string; size?: number }>;
  timeEstimate: string;
}

const STEPS: Step[] = [
  {
    id: '1',
    label: 'Discovery',
    sublabel: 'Context Setting',
    phase: 'discovery',
    color: 'emerald',
    icon: DiscoveryIcon,
    timeEstimate: '~15 min',
  },
  {
    id: '2',
    label: 'Landscape',
    sublabel: 'Terrain Mapping',
    phase: 'research',
    color: 'amber',
    icon: LandscapeIcon,
    timeEstimate: '~25 min/territory',
  },
  {
    id: '3',
    label: 'Synthesis',
    sublabel: 'Strategy Formation',
    phase: 'synthesis',
    color: 'purple',
    icon: SynthesisIcon,
    timeEstimate: '~10 min',
  },
  {
    id: '4',
    label: 'Strategic Bets',
    sublabel: 'Route Planning',
    phase: 'bets',
    color: 'cyan',
    icon: StrategicBetsIcon,
    timeEstimate: '~30 min',
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
          return 'bg-[#1a1f3a] shadow-lg';
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
          return 'bg-[#1a1f3a] shadow-lg';
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
        return 'text-[#1a1f3a]';
    }
  };

  const getGroupHoverTextClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'group-hover:text-emerald-600';
      case 'amber':
        return 'group-hover:text-amber-600';
      case 'purple':
        return 'group-hover:text-purple-600';
      case 'cyan':
        return 'group-hover:text-cyan-600';
      default:
        return 'group-hover:text-[#1a1f3a]';
    }
  };

  const getConnectorGradient = (fromColor: string, toColor: string) => {
    return `bg-gradient-to-r from-${fromColor}-500 to-${toColor}-500`;
  };

  return (
    <div className="horizontal-stepper py-2 px-4 md:py-2.5 md:px-8 bg-white border-b border-slate-100">
      <div className="flex items-center justify-between max-w-5xl mx-auto overflow-x-auto">
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
              {/* Entire phase card is the hover/click target */}
              <button
                onClick={() => isClickable && onPhaseClick(step.phase)}
                disabled={isLocked || !onPhaseClick}
                className={`group flex flex-col items-center flex-1 py-1.5 px-1 md:px-2 rounded-xl transition-all duration-300 ${
                  isClickable
                    ? 'cursor-pointer hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md'
                    : isLocked
                    ? 'cursor-not-allowed opacity-60'
                    : ''
                }`}
                aria-label={`Go to ${step.label} phase`}
              >
                {/* Circle with Phase Color */}
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300 ${
                    isCurrent
                      ? `${getPhaseClasses(step.color, 'current')} text-white scale-110 shadow-lg`
                      : isVisited
                      ? `${getPhaseClasses(step.color, 'complete')} text-white shadow-md`
                      : 'bg-slate-200 text-slate-500'
                  } ${
                    isClickable
                      ? 'group-hover:scale-125 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-[#fbbf24]'
                      : ''
                  }`}
                >
                  {isVisited ? (
                    <CheckIcon className="text-white" size={16} />
                  ) : isCurrent ? (
                    <Icon className="text-white" size={16} />
                  ) : (
                    <span className="text-xs md:text-sm">{step.id}</span>
                  )}
                </div>

                {/* Labels - Only show title */}
                <div className="mt-1 text-center">
                  <div
                    className={`text-[10px] sm:text-xs md:text-sm font-bold transition-colors duration-300 ${
                      isCurrent || isVisited ? 'text-slate-900' : 'text-slate-500'
                    } ${isClickable ? getGroupHoverTextClass(step.color) : ''}`}
                  >
                    {step.label}
                  </div>
                  {/* Time estimate */}
                  <div className={`text-[10px] text-slate-400 ${isCurrent ? 'mt-0' : 'mt-0.5'}`}>
                    {step.timeEstimate}
                  </div>
                  {/* Current indicator - just a dot */}
                  {isCurrent && (
                    <div className="flex mt-0.5 justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                    </div>
                  )}
                </div>
              </button>

              {/* Connector Line with Phase-Specific Gradient */}
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 md:h-1 flex-1 mx-0.5 sm:mx-1 md:mx-3 mt-[-20px] transition-all duration-300 rounded-full ${
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
      {/* Overall journey progress bar */}
      <div className="max-w-5xl mx-auto mt-1">
        <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${((highestIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
