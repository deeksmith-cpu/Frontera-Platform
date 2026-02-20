'use client';

interface DebateInvitationCardProps {
  data: {
    tensionTitle?: string;
    positionA?: { expert: string; argument: string };
    positionB?: { expert: string; argument: string };
  };
  onAction?: (action: string, payload?: unknown) => void;
}

export function DebateInvitationCard({ data, onAction }: DebateInvitationCardProps) {
  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/30 p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-[#1a1f3a] rounded-md flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </span>
        <span className="text-sm font-bold text-[#1a1f3a]">Strategic Debate</span>
      </div>

      {data.tensionTitle && (
        <p className="text-sm font-semibold text-slate-900 mb-3">{data.tensionTitle}</p>
      )}

      {data.positionA && data.positionB && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-2.5">
            <p className="text-[10px] font-semibold text-indigo-600 uppercase mb-1">{data.positionA.expert}</p>
            <p className="text-[11px] text-slate-700 line-clamp-2">{data.positionA.argument}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5">
            <p className="text-[10px] font-semibold text-rose-600 uppercase mb-1">{data.positionB.expert}</p>
            <p className="text-[11px] text-slate-700 line-clamp-2">{data.positionB.argument}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('enter-debate', { tensionTitle: data.tensionTitle })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          Enter Debate Mode
        </button>
        <button
          onClick={() => onAction?.('skip-debate', { tensionTitle: data.tensionTitle })}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
