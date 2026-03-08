'use client';

import { CheckCircle2, ArrowRight, Compass, Map, Lightbulb, Target, Rocket } from 'lucide-react';

const PHASE_META: Record<string, { label: string; icon: typeof Compass; color: string; bg: string }> = {
  discovery: { label: 'Discovery', icon: Compass, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  research: { label: 'Research', icon: Map, color: 'text-amber-600', bg: 'bg-amber-50' },
  synthesis: { label: 'Synthesis', icon: Lightbulb, color: 'text-purple-600', bg: 'bg-purple-50' },
  bets: { label: 'Strategic Bets', icon: Target, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  activation: { label: 'Activation', icon: Rocket, color: 'text-cyan-600', bg: 'bg-cyan-50' },
};

const PHASE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  research: 'Research',
  synthesis: 'Synthesis',
  bets: 'Strategic Bets',
  activation: 'Activation',
  review: 'Review',
};

interface CompletedPhaseBannerProps {
  phase: string;
  currentPhase: string;
  onReturnToActive: () => void;
}

export function CompletedPhaseBanner({ phase, currentPhase, onReturnToActive }: CompletedPhaseBannerProps) {
  const meta = PHASE_META[phase] || PHASE_META.discovery;
  const PhaseIcon = meta.icon;
  const activeLabel = PHASE_LABELS[currentPhase] || currentPhase;

  return (
    <div className="flex-shrink-0 px-6 pt-4 animate-entrance">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg} flex-shrink-0`}>
            <PhaseIcon className={`w-4 h-4 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{meta.label}</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2 py-0.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reviewing completed work — read-only summary
            </p>
          </div>
          <button
            onClick={onReturnToActive}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 flex-shrink-0"
          >
            Return to {activeLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
