'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function AssessmentBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 mb-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#1a1f3a] to-[#2d3561] px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider">New</span>
          <span className="text-white text-sm">
            Discover your Strategic Archetype — personalise your coaching experience
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/dashboard/product-strategy-agent/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#fbbf24] text-[#1a1f3a] text-xs font-semibold transition-all hover:bg-[#f59e0b] hover:scale-105"
          >
            Take Assessment
            <ChevronRight className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white text-xs transition-colors"
            aria-label="Dismiss assessment prompt"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
