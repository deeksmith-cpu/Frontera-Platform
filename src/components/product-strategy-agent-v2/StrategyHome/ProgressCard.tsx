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

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  discovery: { label: 'Discovery', color: 'emerald' },
  research: { label: 'Research', color: 'amber' },
  synthesis: { label: 'Synthesis', color: 'purple' },
  bets: { label: 'Strategic Bets', color: 'cyan' },
  activation: { label: 'Activation', color: 'emerald' },
  review: { label: 'Living Strategy', color: 'amber' },
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
  const phaseInfo = PHASE_LABELS[phase] || PHASE_LABELS.discovery;

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strategy Progress
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-${phaseInfo.color}-50 text-${phaseInfo.color}-700`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-${phaseInfo.color}-500`} />
              {phaseInfo.label}
            </span>
          </div>
        </div>
        <span className="text-2xl font-bold text-[#1a1f3a]">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-[#fbbf24] transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span>{mappedAreas}/{totalAreas} territories mapped</span>
        {opportunityCount > 0 && <span>{opportunityCount} opportunities</span>}
        {betCount > 0 && <span>{betCount} bets</span>}
      </div>

      <button
        onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
        className="w-full inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
      >
        Continue Session
      </button>
    </div>
  );
}
