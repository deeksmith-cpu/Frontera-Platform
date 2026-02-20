'use client';

interface ArtefactChange {
  field: string;
  previous?: string;
  current: string;
}

interface ArtefactEvolutionCardProps {
  data: {
    artefactType?: string;
    artefactTitle?: string;
    changes?: ArtefactChange[];
    updatedAt?: string;
    shareUrl?: string;
  };
  onAction?: (action: string, payload?: unknown) => void;
}

const TYPE_LABELS: Record<string, string> = {
  team_brief: 'Team Brief',
  guardrails: 'Strategic Guardrails',
  okr_cascade: 'OKR Cascade',
  decision_framework: 'Decision Framework',
  stakeholder_pack: 'Stakeholder Brief',
  strategy_on_a_page: 'Strategy on a Page',
};

export function ArtefactEvolutionCard({ data, onAction }: ArtefactEvolutionCardProps) {
  const changes = data.changes || [];
  const typeLabel = TYPE_LABELS[data.artefactType || ''] || 'Strategic Artefact';

  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/30 p-5 my-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-[#1a1f3a] rounded-md flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </span>
        <div>
          <span className="text-sm font-bold text-[#1a1f3a]">
            {data.artefactTitle || typeLabel}
          </span>
          <span className="text-[10px] font-semibold ml-2 px-2 py-0.5 bg-[#fbbf24]/20 text-[#b45309] rounded-full uppercase">
            Updated
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        Your <span className="font-semibold">{typeLabel}</span> has evolved based on new inputs.
        {data.updatedAt && (
          <span className="text-slate-400"> &bull; {new Date(data.updatedAt).toLocaleDateString()}</span>
        )}
      </p>

      {/* Changes list */}
      {changes.length > 0 && (
        <div className="space-y-2 mb-4">
          {changes.map((change, idx) => (
            <div key={idx} className="bg-white rounded-xl p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {change.field}
              </span>
              {change.previous && (
                <div className="flex items-start gap-2 mt-1">
                  <span className="flex-shrink-0 text-[10px] font-bold text-red-400 mt-0.5">-</span>
                  <p className="text-[11px] text-slate-400 line-through">{change.previous}</p>
                </div>
              )}
              <div className="flex items-start gap-2 mt-0.5">
                <span className="flex-shrink-0 text-[10px] font-bold text-emerald-500 mt-0.5">+</span>
                <p className="text-[11px] text-slate-700">{change.current}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {changes.length === 0 && (
        <p className="text-xs text-slate-400 italic mb-3">
          This artefact has been regenerated with your latest strategic inputs.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('view-artefact', { type: data.artefactType, title: data.artefactTitle })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          View Updated Version
        </button>
        {data.shareUrl && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(data.shareUrl || '');
              onAction?.('copied-share-link', { url: data.shareUrl });
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
}
