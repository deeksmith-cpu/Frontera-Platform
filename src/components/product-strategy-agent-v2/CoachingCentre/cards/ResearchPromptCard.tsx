'use client';

interface ResearchPromptCardProps {
  data: {
    question?: string;
    territory?: string;
    researchArea?: string;
    context?: string;
  };
  onAction?: (action: string, payload?: unknown) => void;
}

export function ResearchPromptCard({ data, onAction }: ResearchPromptCardProps) {
  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/30 p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-[#1a1f3a] rounded-md flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <span className="text-sm font-bold text-[#1a1f3a]">Research Question</span>
        {data.territory && (
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase">
            {data.territory}
          </span>
        )}
      </div>

      {data.question && (
        <p className="text-sm text-slate-800 font-medium mb-2">{data.question}</p>
      )}

      {data.context && (
        <p className="text-xs text-slate-500 mb-3">{data.context}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('answer-in-chat', { question: data.question })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          Answer in Chat
        </button>
        <button
          onClick={() => onAction?.('open-in-panel', { territory: data.territory, area: data.researchArea })}
          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Open in Panel
        </button>
      </div>
    </div>
  );
}
