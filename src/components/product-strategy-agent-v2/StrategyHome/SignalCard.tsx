'use client';

interface Signal {
  id: string;
  title: string;
  signal_type: string;
  created_at: string;
}

interface SignalCardProps {
  signals: Signal[];
}

const SIGNAL_ICONS: Record<string, string> = {
  competitor: 'C',
  customer: 'U',
  market: 'M',
  internal: 'I',
};

const SIGNAL_COLORS: Record<string, string> = {
  competitor: 'bg-red-50 text-red-700 border-red-200',
  customer: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  market: 'bg-amber-50 text-amber-700 border-amber-200',
  internal: 'bg-purple-50 text-purple-700 border-purple-200',
};

export function SignalCard({ signals }: SignalCardProps) {
  if (signals.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Strategic Signals
        </span>
        <p className="text-sm text-slate-500 mt-2">No signals logged yet. Signals will appear here as you track market changes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Latest Signals
      </span>
      <div className="mt-3 space-y-2.5">
        {signals.map((signal) => (
          <div key={signal.id} className="flex items-center gap-3">
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border ${SIGNAL_COLORS[signal.signal_type] || 'bg-slate-50 text-slate-500 border-slate-200'}`}
            >
              {SIGNAL_ICONS[signal.signal_type] || '?'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">{signal.title}</p>
              <p className="text-[11px] text-slate-400">
                {new Date(signal.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
