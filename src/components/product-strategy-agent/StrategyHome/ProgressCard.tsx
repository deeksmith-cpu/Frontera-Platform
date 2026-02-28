'use client';

import { useRouter } from 'next/navigation';

interface ProgressCardProps {
  phase: string;
  percentage: number;
  mappedAreas: number;
  totalAreas: number;
  opportunityCount: number;
  betCount: number;
}

const PHASE_LABELS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  discovery: { label: 'Discovery', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  research: { label: 'Research', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  synthesis: { label: 'Synthesis', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  bets: { label: 'Strategic Bets', bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  planning: { label: 'Strategic Bets', bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  activation: { label: 'Activation', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  review: { label: 'Living Strategy', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

export function ProgressCard({
  phase,
  percentage,
  mappedAreas,
  totalAreas,
  opportunityCount,
  betCount,
}: ProgressCardProps) {
  const router = useRouter();
  const info = PHASE_LABELS[phase] || PHASE_LABELS.discovery;

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strategy Progress
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${info.bg} ${info.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
              {info.label}
            </span>
          </div>
        </div>
        <span className="text-2xl font-bold text-[#1a1f3a]">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-[#fbbf24] transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span>{mappedAreas}/{totalAreas} territories mapped</span>
        {opportunityCount > 0 && <span>{opportunityCount} opportunities</span>}
        {betCount > 0 && <span>{betCount} bets</span>}
      </div>

      <button
        onClick={() => router.push('/dashboard/product-strategy-agent')}
        className="w-full inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
      >
        Continue Session
      </button>
    </div>
  );
}
