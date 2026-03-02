'use client';

import { RefreshCw, Shield, Radio } from 'lucide-react';

export function ReviewPreview() {
  return (
    <div className="space-y-4">
      {/* Living Strategy placeholder */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
          <RefreshCw className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900 mb-1">
          Living Strategy
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Track assumptions, monitor signals, and evolve your strategy over time.
        </p>
        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-slate-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Preview cards for upcoming features */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-slate-600">Assumption Tracker</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Track and validate strategic assumptions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50/80 border border-slate-100">
          <Radio className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-slate-600">Signal Log</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Monitor market signals and assess impact
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
