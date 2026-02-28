'use client';

interface KeyResult {
  key_result?: string;
  target?: string;
  timeframe?: string;
}

interface OKRItem {
  objective?: string;
  bet_reference?: string;
  key_results?: KeyResult[];
}

interface OKRContent {
  okrs?: OKRItem[];
  time_horizon?: string;
  raw?: string;
}

interface OKRCardProps {
  artefact: {
    id: string;
    title: string;
    content: OKRContent;
    created_at: string;
  };
}

export function OKRCard({ artefact }: OKRCardProps) {
  const c = artefact.content;

  if (c.raw) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{artefact.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.raw}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-bold text-slate-900">{artefact.title}</h3>
        <div className="flex items-center gap-2">
          {c.time_horizon && (
            <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              {c.time_horizon}
            </span>
          )}
          <span suppressHydrationWarning className="text-[10px] text-slate-400">
            {new Date(artefact.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {c.okrs && c.okrs.map((okr, i) => (
        <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#1a1f3a] text-white text-[10px] font-bold flex items-center justify-center">
              O{i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{okr.objective}</p>
              {okr.bet_reference && (
                <p className="text-[10px] text-slate-400 mt-0.5">Bet: {okr.bet_reference}</p>
              )}
            </div>
          </div>

          {okr.key_results && okr.key_results.map((kr, j) => (
            <div key={j} className="ml-8 flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                KR{j + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-slate-700">{kr.key_result}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {kr.target && (
                    <span className="text-[10px] text-emerald-600 font-medium">Target: {kr.target}</span>
                  )}
                  {kr.timeframe && (
                    <span className="text-[10px] text-slate-400">{kr.timeframe}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
