'use client';

import { useState } from 'react';
import type { StrategicOpportunity } from '@/types/synthesis';
import { getQuadrantDisplay } from '@/lib/synthesis/helpers';

interface SynthesisCanvasViewProps {
  opportunities: StrategicOpportunity[];
}

/**
 * Compact synthesis view for the 30% live canvas panel.
 * Shows a small 2x2 opportunity map + top 3 opportunity cards.
 */
export function SynthesisCanvasView({ opportunities }: SynthesisCanvasViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (opportunities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Synthesis</h3>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 text-center">
          <p className="text-sm font-semibold text-purple-700 mb-1">Pattern Recognition</p>
          <p className="text-xs text-purple-600/70">Complete research to unlock synthesis and see opportunities here.</p>
        </div>
      </div>
    );
  }

  const sorted = [...opportunities].sort(
    (a, b) => (b.scoring?.overallScore || 0) - (a.scoring?.overallScore || 0)
  );
  const top3 = sorted.slice(0, 3);

  // Position helper: maps scoring to percentage coordinates
  const pos = (opp: StrategicOpportunity) => ({
    x: 5 + ((opp.scoring?.capabilityFit || 5) - 1) * 10,
    y: 95 - ((opp.scoring?.marketAttractiveness || 5) - 1) * 10,
  });

  const dotColor: Record<string, string> = {
    invest: 'bg-emerald-500',
    explore: 'bg-blue-500',
    harvest: 'bg-amber-500',
    divest: 'bg-slate-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Synthesis</h3>
      </div>

      {/* Compact 2x2 Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="relative aspect-square w-full max-h-48">
          {/* Grid quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden">
            <div className="bg-blue-50/40 border-r border-b border-slate-100" />
            <div className="bg-emerald-50/40 border-b border-slate-100" />
            <div className="bg-slate-50/40 border-r border-slate-100" />
            <div className="bg-amber-50/40" />
          </div>

          {/* Quadrant labels */}
          <span className="absolute top-1 left-1.5 text-[8px] font-semibold text-blue-500 uppercase">Explore</span>
          <span className="absolute top-1 right-1.5 text-[8px] font-semibold text-emerald-500 uppercase">Invest</span>
          <span className="absolute bottom-1 left-1.5 text-[8px] font-semibold text-slate-400 uppercase">Divest</span>
          <span className="absolute bottom-1 right-1.5 text-[8px] font-semibold text-amber-500 uppercase">Harvest</span>

          {/* Dots */}
          {opportunities.map((opp) => {
            const p = pos(opp);
            const isHovered = opp.id === hoveredId;
            return (
              <div
                key={opp.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onMouseEnter={() => setHoveredId(opp.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20">
                    <div className="bg-slate-900 text-white text-[10px] rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                      {opp.title} ({opp.scoring?.overallScore || 0})
                    </div>
                  </div>
                )}
                <div
                  className={`w-3 h-3 rounded-full ${dotColor[opp.quadrant] || 'bg-slate-500'} ${
                    isHovered ? 'ring-2 ring-offset-1 ring-slate-900 scale-125' : ''
                  } transition-all duration-200 cursor-default`}
                />
              </div>
            );
          })}
        </div>

        {/* Axis labels */}
        <div className="flex justify-between mt-1.5 px-1">
          <span className="text-[8px] text-slate-400 uppercase tracking-wider">Capability Fit</span>
          <span className="text-[8px] text-slate-400">{opportunities.length} opportunities</span>
        </div>
      </div>

      {/* Top Opportunities List */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">Top Opportunities</h4>
        {top3.map((opp, i) => {
          const display = getQuadrantDisplay(opp.quadrant);
          return (
            <div
              key={opp.id}
              className="rounded-xl border border-slate-200 bg-white p-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-slate-400 mt-0.5">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{opp.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold uppercase ${display.color} ${display.bgColor} px-1.5 py-0.5 rounded`}>
                      {display.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Score: {opp.scoring?.overallScore || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
