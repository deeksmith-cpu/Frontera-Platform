'use client';

interface BetsCanvasViewProps {
  theses: Array<{
    id: string;
    title: string;
    description: string;
    ptwWinningAspiration: string;
    ptwWhereToPlay: string;
    ptwHowToWin: string;
    thesisType: 'offensive' | 'defensive' | 'capability';
    bets: Array<{
      id: string;
      bet: string;
      successMetric: string;
      status: string;
      scoring: { overallScore: number };
      priorityLevel: string;
      timeHorizon: string;
    }>;
  }>;
  portfolioSummary: {
    totalBets: number;
    totalTheses: number;
    byThesisType: { offensive: number; defensive: number; capability: number };
    avgScore: number;
  } | null;
}

const THESIS_TYPE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  offensive: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Offensive' },
  defensive: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Defensive' },
  capability: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', label: 'Capability' },
};

/**
 * Compact bets/PTW cascade view for the 30% live canvas panel.
 */
export function BetsCanvasView({ theses, portfolioSummary }: BetsCanvasViewProps) {
  if (theses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Bets</h3>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6 text-center">
          <p className="text-sm font-semibold text-cyan-700 mb-1">Route Planning</p>
          <p className="text-xs text-cyan-600/70">Strategic bets and Playing to Win cascade will build here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Bets</h3>
      </div>

      {/* Portfolio Summary */}
      {portfolioSummary && (
        <div className="grid grid-cols-3 gap-2">
          {(['offensive', 'defensive', 'capability'] as const).map((type) => {
            const style = THESIS_TYPE_STYLES[type];
            const count = portfolioSummary.byThesisType[type] || 0;
            return (
              <div key={type} className={`${style.bg} ${style.border} border rounded-xl p-2 text-center`}>
                <div className={`text-lg font-bold ${style.text}`}>{count}</div>
                <div className={`text-[9px] font-semibold ${style.text} uppercase tracking-wider`}>{style.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* PTW Cascade per Thesis */}
      {theses.slice(0, 3).map((thesis) => {
        const style = THESIS_TYPE_STYLES[thesis.thesisType] || THESIS_TYPE_STYLES.offensive;
        return (
          <div key={thesis.id} className={`rounded-xl border ${style.border} overflow-hidden`}>
            {/* Thesis Header */}
            <div className={`${style.bg} px-3 py-2`}>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-semibold uppercase ${style.text}`}>{style.label}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 line-clamp-2">{thesis.title}</p>
            </div>

            {/* PTW Mini-Cascade */}
            <div className="px-3 py-2 space-y-1.5 bg-white">
              {thesis.ptwWhereToPlay && (
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-indigo-600">Where to Play</span>
                  <p className="text-[11px] text-slate-700 line-clamp-2">{thesis.ptwWhereToPlay}</p>
                </div>
              )}
              {thesis.ptwHowToWin && (
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600">How to Win</span>
                  <p className="text-[11px] text-slate-700 line-clamp-2">{thesis.ptwHowToWin}</p>
                </div>
              )}
            </div>

            {/* Bets count */}
            <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-medium">
                {thesis.bets.length} bet{thesis.bets.length !== 1 ? 's' : ''}
                {thesis.bets.length > 0 && ` | avg score ${Math.round(thesis.bets.reduce((s, b) => s + (b.scoring?.overallScore || 0), 0) / thesis.bets.length)}`}
              </span>
            </div>
          </div>
        );
      })}

      {theses.length > 3 && (
        <p className="text-[10px] text-slate-400 text-center">+{theses.length - 3} more theses</p>
      )}
    </div>
  );
}
