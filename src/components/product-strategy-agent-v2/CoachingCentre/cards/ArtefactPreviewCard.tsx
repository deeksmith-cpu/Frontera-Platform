'use client';

interface ArtefactPreviewCardProps {
  data: {
    title?: string;
    type?: string;
    summary?: string;
    previewUrl?: string;
  };
  onAction?: (action: string, payload?: unknown) => void;
}

export function ArtefactPreviewCard({ data, onAction }: ArtefactPreviewCardProps) {
  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/30 p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-[#1a1f3a] rounded-md flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        <span className="text-sm font-bold text-[#1a1f3a]">{data.title || 'Artefact'}</span>
        {data.type && (
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#fbbf24]/20 text-[#b45309] rounded-full uppercase">
            {data.type}
          </span>
        )}
      </div>

      {data.summary && (
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">{data.summary}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('view-full', { title: data.title })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          View Full
        </button>
        <button
          onClick={() => onAction?.('export', { title: data.title })}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Export
        </button>
      </div>
    </div>
  );
}
