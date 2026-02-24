'use client';

import { useState } from 'react';
import {
  Compass,
  Map,
  Lightbulb,
  Target,
  Rocket,
  Layers,
  Telescope,
  ChevronRight,
  X,
} from 'lucide-react';
import type { ExplanationCardData, CardAction } from '@/types/coaching-cards';

interface ExplanationCardProps {
  data: ExplanationCardData;
  onDismiss?: (cardId: string) => void;
  onAction?: (action: CardAction) => void;
}

const ICON_MAP = {
  compass: Compass,
  map: Map,
  lightbulb: Lightbulb,
  target: Target,
  rocket: Rocket,
  layers: Layers,
  telescope: Telescope,
};

const PHASE_STYLES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  discovery: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  research: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  synthesis: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  bets: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-cyan-500',
  },
};

const DEFAULT_PHASE_STEPS: Array<{ id: string; label: string; sublabel: string; completed?: boolean }> = [
  { id: 'discovery', label: 'Discovery', sublabel: 'Context Setting' },
  { id: 'research', label: 'Landscape', sublabel: 'Terrain Mapping' },
  { id: 'synthesis', label: 'Synthesis', sublabel: 'Pattern Recognition' },
  { id: 'bets', label: 'Strategic Bets', sublabel: 'Route Planning' },
];

/**
 * ExplanationCard - Guides users through phases/sections
 *
 * Premium "strategic briefing" aesthetic with:
 * - Phase-specific accent colors
 * - Optional journey diagram showing 4-phase progression
 * - Subtle topographic texture hint
 * - Purposeful entrance animation
 */
export function ExplanationCard({ data, onDismiss, onAction }: ExplanationCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const Icon = data.icon ? ICON_MAP[data.icon] : Compass;
  const phase = data.phase || 'discovery';
  const styles = PHASE_STYLES[phase] || PHASE_STYLES.discovery;
  const phaseSteps = data.phaseSteps || DEFAULT_PHASE_STEPS;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(data.id);
  };

  const handleCta = () => {
    if (data.ctaAction === 'dismiss') {
      handleDismiss();
    } else {
      onAction?.({
        cardId: data.id,
        action: data.ctaAction || 'navigate',
        payload: { phase },
      });
    }
  };

  return (
    <div
      className={`
        explanation-card relative overflow-hidden
        rounded-2xl border-2 ${styles.border} ${styles.bg}
        p-5 sm:p-6
        animate-entrance
        transition-all duration-300
        hover:shadow-lg hover:shadow-cyan-100/50
      `}
    >
      {/* Subtle topographic pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C15 5 5 20 5 30s10 25 25 25 25-10 25-25S45 5 30 5zm0 5c12 0 20 8 20 20s-8 20-20 20S10 42 10 30s8-20 20-20z' fill='%231a1f3a' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Dismiss button */}
      {data.dismissible !== false && (
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all duration-200"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header with icon */}
      <div className="relative flex items-start gap-4 mb-4">
        <div
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl
            flex items-center justify-center
            bg-gradient-to-br from-[#1a1f3a] to-[#2d3561]
            shadow-lg shadow-[#1a1f3a]/20
            transition-transform duration-300 hover:scale-110
          `}
        >
          <Icon className="w-6 h-6 text-[#fbbf24]" />
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-lg font-bold text-[#1a1f3a] leading-tight mb-1">
            {data.title}
          </h3>
          {data.phase && (
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${styles.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
              <span>{PHASE_STYLES[phase] ? `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}` : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body text */}
      <p className="relative text-sm text-slate-700 leading-relaxed mb-5 pl-0 sm:pl-16">
        {data.body}
      </p>

      {/* Phase journey diagram */}
      {data.showPhaseDiagram && (
        <div className="relative mb-5 pl-0 sm:pl-16">
          <div className="flex items-center justify-between gap-2 p-4 bg-white/60 rounded-xl border border-slate-200/50">
            {phaseSteps.map((step, index) => {
              const stepStyles = PHASE_STYLES[step.id] || PHASE_STYLES.discovery;
              const isActive = step.id === phase;
              const isCompleted = step.completed;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        transition-all duration-300
                        ${isActive
                          ? `${stepStyles.bg} ${stepStyles.border} border-2 shadow-md`
                          : isCompleted
                            ? 'bg-emerald-100 border-2 border-emerald-300'
                            : 'bg-slate-100 border border-slate-200'
                        }
                      `}
                    >
                      <span
                        className={`
                          text-xs font-bold
                          ${isActive
                            ? stepStyles.text
                            : isCompleted
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                          }
                        `}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <span
                      className={`
                        mt-1.5 text-[10px] font-semibold uppercase tracking-wide
                        ${isActive ? stepStyles.text : 'text-slate-400'}
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < phaseSteps.length - 1 && (
                    <div
                      className={`
                        hidden sm:block w-6 h-0.5 mx-1
                        ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA button */}
      {data.ctaLabel && (
        <div className="relative flex justify-end pl-0 sm:pl-16">
          <button
            onClick={handleCta}
            className={`
              inline-flex items-center gap-2
              px-5 py-2.5 rounded-lg
              bg-[#fbbf24] text-[#1a1f3a]
              text-sm font-semibold
              shadow-md shadow-[#fbbf24]/20
              transition-all duration-300
              hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2
            `}
          >
            {data.ctaLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
