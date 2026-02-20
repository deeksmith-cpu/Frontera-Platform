'use client';

interface MicroSynthesisCardProps {
  data: {
    territory?: string;
    findings?: Array<{ title: string; description: string; confidence: string }>;
    strategicImplication?: string;
  };
  onAction?: (action: string, payload?: unknown) => void;
}

export function MicroSynthesisCard({ data, onAction }: MicroSynthesisCardProps) {
  const territoryLabel =
    data.territory === 'company' ? 'Company' :
    data.territory === 'customer' ? 'Customer' :
    'Market Context';

  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50/30 p-5 my-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-bold text-[#1a1f3a]">{territoryLabel} Territory Synthesis</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Ready</span>
      </div>

      {data.findings && data.findings.length > 0 && (
        <div className="space-y-2 mb-3">
          {data.findings.slice(0, 3).map((finding, i) => (
            <div key={i} className="bg-white rounded-lg p-2.5 border border-cyan-100">
              <p className="text-xs font-semibold text-slate-800">{finding.title}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{finding.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.strategicImplication && (
        <p className="text-xs text-slate-600 italic mb-3">{data.strategicImplication}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAction?.('explore-details', { territory: data.territory })}
          className="flex-1 px-3 py-1.5 bg-[#fbbf24] text-slate-900 text-xs font-semibold rounded-lg hover:bg-[#f59e0b] transition-colors"
        >
          Explore Details
        </button>
        <button
          onClick={() => onAction?.('continue', { territory: data.territory })}
          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
