'use client';

import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  MapPin,
  Building2,
  Users,
  TrendingUp,
} from 'lucide-react';
import type { Territory } from '@/types/coaching-cards';
import type { ResearchAreaProgress, TerritoryProgress } from '@/hooks/useResearchProgress';

interface ResearchProgressCardProps {
  /** Current research area being worked on */
  currentArea: ResearchAreaProgress | null;
  /** Overall territory progress */
  territoryProgress: TerritoryProgress | null;
  /** Whether the current area is complete */
  isAreaComplete: boolean;
  /** Callback when user clicks "Continue" */
  onContinue?: () => void;
  /** Callback when user clicks "Start Next Area" */
  onStartNextArea?: () => void;
}

const TERRITORY_STYLES: Record<Territory, {
  icon: typeof Building2;
  containerBg: string;
  border: string;
  progressBg: string;
  progressFill: string;
  badge: string;
  buttonBg: string;
  buttonHover: string;
}> = {
  company: {
    icon: Building2,
    containerBg: 'bg-gradient-to-br from-indigo-50 via-indigo-50/80 to-white',
    border: 'border-indigo-200',
    progressBg: 'bg-indigo-100',
    progressFill: 'bg-gradient-to-r from-indigo-400 to-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    buttonBg: 'bg-indigo-600',
    buttonHover: 'hover:bg-indigo-700',
  },
  customer: {
    icon: Users,
    containerBg: 'bg-gradient-to-br from-amber-50 via-amber-50/80 to-white',
    border: 'border-amber-200',
    progressBg: 'bg-amber-100',
    progressFill: 'bg-gradient-to-r from-amber-400 to-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    buttonBg: 'bg-amber-500',
    buttonHover: 'hover:bg-amber-600',
  },
  competitor: {
    icon: TrendingUp,
    containerBg: 'bg-gradient-to-br from-cyan-50 via-cyan-50/80 to-white',
    border: 'border-cyan-200',
    progressBg: 'bg-cyan-100',
    progressFill: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    buttonBg: 'bg-cyan-600',
    buttonHover: 'hover:bg-cyan-700',
  },
};

const TERRITORY_TITLES: Record<Territory, string> = {
  company: 'Company Territory',
  customer: 'Customer Territory',
  competitor: 'Market Context',
};

/**
 * ResearchProgressCard - Sticky progress tracker for research phase
 *
 * Shows:
 * - Current research area title
 * - Progress bar (questions completed / total)
 * - Question checklist with status icons
 * - "Continue" or "Start Next Area" CTA
 */
export function ResearchProgressCard({
  currentArea,
  territoryProgress,
  isAreaComplete,
  onContinue,
  onStartNextArea,
}: ResearchProgressCardProps) {
  // If no area, show completion state
  if (!currentArea || !territoryProgress) {
    return (
      <div className="research-progress-card border-t-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a1f3a]">Research Complete!</p>
            <p className="text-xs text-slate-500">All territories have been mapped</p>
          </div>
        </div>
      </div>
    );
  }

  const territory = currentArea.territory;
  const styles = TERRITORY_STYLES[territory];
  const TerritoryIcon = styles.icon;

  const progressPercent = Math.round(
    (currentArea.answeredQuestions / currentArea.totalQuestions) * 100
  );

  // Get next unanswered question index
  const nextQuestionIndex = currentArea.questions.findIndex((q) => !q.answered);
  const hasMoreQuestions = nextQuestionIndex !== -1;

  return (
    <div
      className={`
        research-progress-card
        border-t-2 ${styles.border} ${styles.containerBg}
        p-4 sm:p-5
        transition-all duration-500
      `}
    >
      {/* Area complete celebration effect */}
      {isAreaComplete && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/0 via-emerald-200/30 to-emerald-200/0 animate-pulse pointer-events-none rounded-t-xl" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isAreaComplete ? 'bg-emerald-100' : styles.progressBg}`}>
              {isAreaComplete ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <TerritoryIcon className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {TERRITORY_TITLES[territory]}
              </p>
              <h4 className="text-sm font-bold text-[#1a1f3a]">
                {currentArea.title}
              </h4>
            </div>
          </div>

          {/* Progress badge */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${
            isAreaComplete ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : styles.badge
          }`}>
            {currentArea.answeredQuestions}/{currentArea.totalQuestions}
            {isAreaComplete ? ' ✓' : ' questions'}
          </div>
        </div>

        {/* Question Checklist */}
        <div className="flex items-center gap-3 mb-4">
          {currentArea.questions.map((q, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {q.answered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <Circle className={`w-4 h-4 ${
                  idx === nextQuestionIndex ? 'text-amber-500' : 'text-slate-300'
                }`} />
              )}
              <span className={`text-xs ${
                q.answered
                  ? 'text-slate-500 line-through'
                  : idx === nextQuestionIndex
                    ? 'text-slate-700 font-medium'
                    : 'text-slate-400'
              }`}>
                Q{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className={`h-2 rounded-full ${styles.progressBg} overflow-hidden`}>
            <div
              className={`h-full rounded-full ${isAreaComplete ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : styles.progressFill} transition-all duration-700 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        {isAreaComplete ? (
          <button
            onClick={onStartNextArea}
            className={`
              w-full flex items-center justify-center gap-2
              px-5 py-3 rounded-xl
              text-sm font-bold text-white
              bg-[#fbbf24] text-[#1a1f3a]
              shadow-lg shadow-[#fbbf24]/30
              hover:bg-[#f59e0b] hover:scale-[1.02]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2
            `}
          >
            <MapPin className="w-4 h-4" />
            Start Next Research Area
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : hasMoreQuestions ? (
          <button
            onClick={onContinue}
            className={`
              w-full flex items-center justify-center gap-2
              px-5 py-3 rounded-xl
              text-sm font-bold text-white
              ${styles.buttonBg} ${styles.buttonHover}
              shadow-md
              hover:scale-[1.02]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
          >
            Continue to Question {nextQuestionIndex + 1}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
