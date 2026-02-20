'use client';

interface Artefact {
  id: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface OKRCascadeCardProps {
  okrs: Artefact[];
  onGenerate: () => void;
  generating: boolean;
}

interface OKRItem {
  betIndex: number;
  objective: string;
  keyResults: Array<{ kr: string; target: string; timeframe: string }>;
}

export function OKRCascadeCard({ okrs, onGenerate, generating }: OKRCascadeCardProps) {
  if (okrs.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-sm text-slate-500">No OKR cascade generated yet.</p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate OKR Cascade'}
        </button>
      </div>
    );
  }

  const latest = okrs[0];
  const items = (latest.content.okrs as OKRItem[]) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          OKR Cascade
        </span>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors disabled:opacity-50"
        >
          {generating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {items.map((item, idx) => (
        <div key={idx} className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">
              Objective {idx + 1}
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{item.objective}</p>
          </div>

          <div className="space-y-2">
            {item.keyResults.map((kr, krIdx) => (
              <div key={krIdx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#1a1f3a] text-white text-[10px] font-bold flex items-center justify-center">
                  KR{krIdx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-700 font-medium">{kr.kr}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#fbbf24] font-semibold">Target: {kr.target}</span>
                    <span className="text-[10px] text-slate-400">{kr.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
