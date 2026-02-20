'use client';

interface SignalAlertCardProps {
  data: {
    signalType?: string;
    title?: string;
    description?: string;
    impactAssessment?: string;
    affectedAssumptions?: string[];
  };
  onAction?: (action: string, payload?: unknown) => void;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  competitor: { icon: '↗', color: 'text-purple-600' },
  customer: { icon: '◎', color: 'text-cyan-600' },
  market: { icon: '◆', color: 'text-amber-600' },
  internal: { icon: '●', color: 'text-indigo-600' },
};

export function SignalAlertCard({ data, onAction }: SignalAlertCardProps) {
  const typeConfig = TYPE_CONFIG[data.signalType || ''] || { icon: '!', color: 'text-red-500' };

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/30 p-5 my-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center">
          <span className="text-white text-xs font-bold">{typeConfig.icon}</span>
        </span>
        <span className="text-sm font-bold text-slate-900">
          {data.title || 'Signal Detected'}
        </span>
        {data.signalType && (
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase">
            {data.signalType}
          </span>
        )}
      </div>

      {data.description && (
        <p className="text-xs text-slate-600 mb-3 leading-relaxed">{data.description}</p>
      )}

      {/* Impact assessment */}
      {data.impactAssessment && (
        <div className="bg-white rounded-xl p-3 border border-amber-200 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
            Strategic Impact
          </span>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">{data.impactAssessment}</p>
        </div>
      )}

      {/* Affected assumptions */}
      {data.affectedAssumptions && data.affectedAssumptions.length > 0 && (
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Affected Assumptions
          </span>
          <ul className="mt-1 space-y-0.5">
            {data.affectedAssumptions.map((a, i) => (
              <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('review-impact', { title: data.title, signalType: data.signalType })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          Review Impact
        </button>
        <button
          onClick={() => onAction?.('update-assumptions', { title: data.title })}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Update Assumptions
        </button>
      </div>
    </div>
  );
}
