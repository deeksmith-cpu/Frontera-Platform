'use client';

import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import type { RequestCardData, CardAction } from '@/types/coaching-cards';

interface RequestCardProps {
  data: RequestCardData;
  onAction?: (action: CardAction) => void;
  onNavigateToCanvas?: (target: { phase: string; section?: string }) => void;
}

const ICON_MAP = {
  upload: Upload,
  document: FileText,
  check: CheckCircle2,
  arrow: ArrowRight,
  sparkles: Sparkles,
};

const URGENCY_STYLES = {
  required: {
    container: 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-50/50',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeIcon: 'text-amber-600',
    progressBg: 'bg-amber-100',
    progressFill: 'bg-amber-500',
    button: 'bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] shadow-amber-200/50',
  },
  recommended: {
    container: 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-50/50',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    badgeIcon: 'text-cyan-600',
    progressBg: 'bg-cyan-100',
    progressFill: 'bg-cyan-500',
    button: 'bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-slate-200/50',
  },
  optional: {
    container: 'border-slate-200 bg-gradient-to-br from-slate-50 to-white',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    badgeIcon: 'text-slate-500',
    progressBg: 'bg-slate-100',
    progressFill: 'bg-slate-400',
    button: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-slate-100/50',
  },
};

/**
 * RequestCard - Action requests with CTA and progress tracking
 *
 * Premium design with:
 * - Urgency-based color coding (amber=required, cyan=recommended, slate=optional)
 * - Animated progress bar
 * - Links to CanvasPanel actions
 * - Clear call-to-action
 */
export function RequestCard({ data, onAction, onNavigateToCanvas }: RequestCardProps) {
  const styles = URGENCY_STYLES[data.urgency] || URGENCY_STYLES.recommended;
  const Icon = data.icon ? ICON_MAP[data.icon] : Upload;
  const progress = data.progress;
  const progressPercent = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  const handleAction = () => {
    // Navigate to canvas panel if target specified
    if (data.canvasPanelTarget && onNavigateToCanvas) {
      onNavigateToCanvas({
        phase: data.canvasPanelTarget.phase,
        section: data.canvasPanelTarget.section,
      });
    }

    onAction?.({
      cardId: data.id,
      action: data.actionType,
      payload: { canvasPanelTarget: data.canvasPanelTarget },
    });
  };

  return (
    <div
      className={`
        request-card relative overflow-hidden
        rounded-2xl border-2 ${styles.container}
        p-5 sm:p-6
        animate-entrance
        transition-all duration-300
        hover:shadow-lg
      `}
    >
      {/* Decorative corner accent */}
      <div
        className={`
          absolute -top-8 -right-8 w-24 h-24 rounded-full
          ${data.urgency === 'required' ? 'bg-amber-200/30' : 'bg-cyan-200/30'}
          blur-2xl
        `}
      />

      {/* Urgency badge */}
      <div className="relative flex items-center gap-2 mb-4">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles.badge}`}>
          {data.urgency === 'required' ? (
            <AlertCircle className={`w-3.5 h-3.5 ${styles.badgeIcon}`} />
          ) : data.urgency === 'recommended' ? (
            <Sparkles className={`w-3.5 h-3.5 ${styles.badgeIcon}`} />
          ) : (
            <Clock className={`w-3.5 h-3.5 ${styles.badgeIcon}`} />
          )}
          {data.urgency}
        </div>

        {data.deadline && (
          <span className="text-xs text-slate-500">
            Due: {data.deadline}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex gap-4">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-11 h-11 rounded-xl
            flex items-center justify-center
            ${data.urgency === 'required'
              ? 'bg-amber-100 border border-amber-200'
              : 'bg-[#1a1f3a]'
            }
            transition-transform duration-300 hover:scale-110
          `}
        >
          <Icon
            className={`w-5 h-5 ${data.urgency === 'required' ? 'text-amber-700' : 'text-[#fbbf24]'}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-base font-bold text-[#1a1f3a] leading-tight mb-1">
            {data.title}
          </h3>

          {/* Description */}
          {data.description && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {data.description}
            </p>
          )}

          {/* Progress bar */}
          {progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-500">
                  Progress
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {progress.current} / {progress.total} {progress.unit}
                </span>
              </div>
              <div className={`h-2 rounded-full ${styles.progressBg} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${styles.progressFill} transition-all duration-500 ease-out`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA button */}
          <button
            onClick={handleAction}
            className={`
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-lg
              text-sm font-semibold
              shadow-md ${styles.button}
              transition-all duration-300
              hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${data.urgency === 'required'
                ? 'focus:ring-amber-400'
                : data.urgency === 'recommended'
                  ? 'focus:ring-cyan-400'
                  : 'focus:ring-slate-400'
              }
            `}
          >
            {data.actionLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
