'use client';

import type { MicroSynthesisResult } from '@/lib/agents/strategy-coach/micro-synthesis-prompt';

interface TerritorialInsightSummaryProps {
  territory: 'company' | 'customer' | 'competitor';
  findings: MicroSynthesisResult;
  onViewDetails?: () => void;
}

const TERRITORY_CONFIG = {
  company: {
    label: 'Company Territory',
    gradient: 'from-[#1a1f3a] to-[#2d3561]',
  },
  customer: {
    label: 'Customer Territory',
    gradient: 'from-[#fbbf24] to-[#f59e0b]',
  },
  competitor: {
    label: 'Market Context',
    gradient: 'from-[#0891b2] to-[#0e7490]',
  },
};

const CONFIDENCE_BADGE: Record<string, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-emerald-100 text-emerald-700' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low', className: 'bg-red-100 text-red-700' },
};

export function TerritorialInsightSummary({
  territory,
  findings,
  onViewDetails,
}: TerritorialInsightSummaryProps) {
  const config = TERRITORY_CONFIG[territory];

  return (
    <div className="bg-white border-2 border-cyan-200 rounded-2xl overflow-hidden shadow-md">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} px-5 py-3 flex items-center justify-between`}>
        <div>
          <h3 className="text-sm font-bold text-white">{config.label} Synthesis</h3>
          <p className="text-[10px] text-white/70 uppercase tracking-wider">Key Findings</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CONFIDENCE_BADGE[findings.overallConfidence]?.className || 'bg-slate-100 text-slate-600'}`}>
          {CONFIDENCE_BADGE[findings.overallConfidence]?.label || 'N/A'} Confidence
        </span>
      </div>

      {/* Findings */}
      <div className="p-4 space-y-3">
        {findings.keyFindings.map((finding, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-[#1a1f3a] text-white rounded-md text-[10px] font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{finding.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{finding.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400">{finding.evidenceBase}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${CONFIDENCE_BADGE[finding.confidence]?.className || ''}`}>
                    {finding.confidence}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Implication */}
      <div className="px-4 pb-4">
        <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#b45309] mb-1">Strategic Implication</p>
          <p className="text-sm text-slate-800 font-medium">{findings.strategicImplication}</p>
        </div>
      </div>

      {/* Action */}
      {onViewDetails && (
        <div className="px-4 pb-4">
          <button
            onClick={onViewDetails}
            className="w-full px-4 py-2 text-xs font-semibold text-[#1a1f3a] bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            View Territory Details
          </button>
        </div>
      )}
    </div>
  );
}
