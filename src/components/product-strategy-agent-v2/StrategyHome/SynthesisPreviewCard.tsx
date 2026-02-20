'use client';

import { useRouter } from 'next/navigation';

interface MicroSynthesisResult {
  keyFindings: Array<{ title: string; description: string }>;
  overallConfidence: string;
  strategicImplication: string;
}

interface SynthesisPreviewCardProps {
  microSynthesis: Record<string, MicroSynthesisResult> | null;
  synthesisPreview: string | null;
}

export function SynthesisPreviewCard({ microSynthesis, synthesisPreview }: SynthesisPreviewCardProps) {
  const router = useRouter();

  // Find the most recent micro-synthesis result
  const territories = microSynthesis ? Object.entries(microSynthesis) : [];
  const latestTerritory = territories.length > 0 ? territories[territories.length - 1] : null;

  if (!latestTerritory && !synthesisPreview) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Strategic Insights
        </span>
        <p className="text-sm text-slate-500 mt-2">
          Complete territory research to unlock micro-synthesis insights.
        </p>
      </div>
    );
  }

  // Full synthesis preview takes priority
  if (synthesisPreview) {
    return (
      <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
          Synthesis Preview
        </span>
        <p className="text-sm text-slate-700 mt-2 leading-relaxed line-clamp-4">
          {synthesisPreview}
        </p>
        <button
          onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
          className="mt-3 text-sm font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
        >
          View Full Synthesis →
        </button>
      </div>
    );
  }

  // Micro-synthesis preview
  const [territory, data] = latestTerritory!;
  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Latest Territorial Insight
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          {territory}
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-900 mt-2">
        {data.strategicImplication}
      </p>
      {data.keyFindings && data.keyFindings.length > 0 && (
        <ul className="mt-2 space-y-1">
          {data.keyFindings.slice(0, 2).map((f, i) => (
            <li key={i} className="text-[11px] text-slate-500 flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 flex-shrink-0" />
              {f.title}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
        className="mt-3 text-sm font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
      >
        View Full Insight →
      </button>
    </div>
  );
}
