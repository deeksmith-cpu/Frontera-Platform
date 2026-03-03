'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { WhatsNextCardData, WhatsNextRequirement, ReadinessState } from '@/types/coaching-cards';

interface WhatsNextCardProps {
  data: WhatsNextCardData;
  onNavigateToPhase?: (phase: string) => void;
}

const READINESS_STYLES: Record<ReadinessState, {
  container: string;
  badge: string;
  progress: string;
  progressFill: string;
  button: string;
  buttonDisabled: string;
  icon: string;
}> = {
  not_ready: {
    container: 'border-amber-200 bg-gradient-to-br from-amber-50 via-amber-50/80 to-white',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    progress: 'bg-amber-100',
    progressFill: 'bg-amber-400',
    button: 'bg-amber-200 text-amber-700 cursor-not-allowed',
    buttonDisabled: 'opacity-60',
    icon: 'text-amber-500',
  },
  almost_ready: {
    container: 'border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-white',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    progress: 'bg-amber-100',
    progressFill: 'bg-gradient-to-r from-amber-400 to-yellow-400',
    button: 'bg-amber-400 text-amber-900 cursor-not-allowed',
    buttonDisabled: 'opacity-70',
    icon: 'text-amber-600',
  },
  ready: {
    container: 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-white',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    progress: 'bg-emerald-100',
    progressFill: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    button: 'bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] hover:scale-105 shadow-lg shadow-[#fbbf24]/30',
    buttonDisabled: '',
    icon: 'text-emerald-500',
  },
};

function RequirementItem({ req }: { req: WhatsNextRequirement }) {
  const Icon = req.completed ? CheckCircle2 : req.required ? AlertCircle : Circle;
  const colorClass = req.completed
    ? 'text-emerald-500'
    : req.required
      ? 'text-amber-500'
      : 'text-slate-300';

  return (
    <div className="flex items-center gap-2.5">
      <Icon className={`w-4 h-4 flex-shrink-0 ${colorClass}`} />
      <span
        className={`text-sm ${
          req.completed
            ? 'text-slate-600 line-through'
            : req.required
              ? 'text-slate-800 font-medium'
              : 'text-slate-500'
        }`}
      >
        {req.label}
        {req.required && !req.completed && (
          <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
            Required
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * WhatsNextCard - Sticky progress tracker at chat bottom
 *
 * Premium design showing:
 * - Current → Next milestone progression
 * - Requirements checklist with completion states
 * - Animated progress bar
 * - Color transitions (amber → emerald when ready)
 */
export function WhatsNextCard({ data, onNavigateToPhase }: WhatsNextCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const styles = READINESS_STYLES[data.readiness];
  const isReady = data.readiness === 'ready';

  const handleNavigate = () => {
    if (isReady && onNavigateToPhase) {
      onNavigateToPhase(data.nextPhase);
    }
  };

  return (
    <div
      className={`
        whats-next-card relative
        border-t-2 ${styles.container}
        transition-all duration-500
        ${isCollapsed ? 'px-4 py-2' : 'p-4 sm:p-5'}
      `}
    >
      {/* Ready celebration glow effect */}
      {isReady && !isCollapsed && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/0 via-emerald-200/30 to-emerald-200/0 animate-pulse pointer-events-none" />
      )}

      <div className="relative">
        {/* Header row — always visible, acts as collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isReady ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              {isReady ? (
                <Sparkles className="w-3 h-3 text-emerald-600" />
              ) : (
                <Target className={`w-3 h-3 ${styles.icon}`} />
              )}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                What&apos;s Next
              </p>
              {isCollapsed && (
                <span className="text-xs font-semibold text-[#1a1f3a]">
                  {data.nextMilestone} — {data.progressPercentage}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Readiness badge */}
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${styles.badge}`}>
              {data.readiness === 'ready' ? 'Ready!' : data.readiness === 'almost_ready' ? 'Almost' : `${data.progressPercentage}%`}
            </div>
            {isCollapsed ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {/* Expandable content */}
        {!isCollapsed && (
          <>
            <h4 className="text-sm font-bold text-[#1a1f3a] mt-3 mb-3">
              {data.nextMilestone}
            </h4>

            {/* Requirements checklist */}
            <div className="space-y-2 mb-4">
              {data.requirements.map((req) => (
                <RequirementItem key={req.id} req={req} />
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-500">Progress</span>
                <span className="text-xs font-bold text-slate-700">{data.progressPercentage}%</span>
              </div>
              <div className={`h-2 rounded-full ${styles.progress} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${styles.progressFill} transition-all duration-700 ease-out`}
                  style={{ width: `${data.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Teaser text */}
            <p className="text-xs text-slate-500 italic mb-4">
              {data.teaserText}
            </p>

            {/* CTA button */}
            <button
              onClick={handleNavigate}
              disabled={!isReady}
              className={`
                w-full flex items-center justify-center gap-2
                px-5 py-3 rounded-xl
                text-sm font-bold
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${styles.button} ${!isReady ? styles.buttonDisabled : ''}
                ${isReady ? 'focus:ring-[#fbbf24]' : ''}
              `}
            >
              {isReady ? (
                <>
                  Begin {data.nextMilestone}
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Complete requirements to continue
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
