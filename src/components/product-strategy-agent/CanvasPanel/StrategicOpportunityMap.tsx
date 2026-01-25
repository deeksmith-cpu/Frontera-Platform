'use client';

import { useState } from 'react';
import type { StrategicOpportunity, StrategicOpportunityMapProps } from '@/types/synthesis';
import { getQuadrantDisplay } from '@/lib/synthesis/helpers';

/**
 * StrategicOpportunityMap
 *
 * A 2×2 matrix visualization for strategic opportunities based on the
 * Playing to Win framework. Plots opportunities by:
 * - X-axis: Capability Fit (1-10)
 * - Y-axis: Market Attractiveness (1-10)
 *
 * Quadrants:
 * - INVEST (top-right): High Market + High Capability
 * - EXPLORE (top-left): High Market + Low Capability
 * - HARVEST (bottom-right): Low Market + High Capability
 * - DIVEST (bottom-left): Low Market + Low Capability
 */
export function StrategicOpportunityMap({
  opportunities,
  onOpportunityClick,
  selectedOpportunityId,
}: StrategicOpportunityMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Calculate position for an opportunity dot
  // X: capabilityFit (1-10) -> 5-95% (leave margin for dots)
  // Y: marketAttractiveness (1-10) -> 95-5% (inverted: high values at top)
  const calculatePosition = (opp: StrategicOpportunity) => {
    const x = 5 + (opp.scoring.capabilityFit - 1) * 10; // 5% to 95%
    const y = 95 - (opp.scoring.marketAttractiveness - 1) * 10; // 95% to 5%
    return { x, y };
  };

  // Get color based on opportunity type and selection state
  const getDotColor = (opp: StrategicOpportunity) => {
    const isSelected = opp.id === selectedOpportunityId;
    const isHovered = opp.id === hoveredId;

    if (isSelected || isHovered) {
      return 'bg-gradient-to-br from-indigo-600 to-cyan-600';
    }

    switch (opp.opportunityType) {
      case 'where_to_play':
        return 'bg-indigo-500';
      case 'how_to_win':
        return 'bg-cyan-500';
      case 'capability_gap':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  // Get dot size based on overall score
  const getDotSize = (opp: StrategicOpportunity) => {
    const score = opp.scoring.overallScore;
    if (score >= 80) return 'w-5 h-5';
    if (score >= 60) return 'w-4 h-4';
    return 'w-3 h-3';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Strategic Opportunity Map</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-600">Where to Play</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-slate-600">How to Win</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">Capability Gap</span>
          </div>
        </div>
      </div>

      {/* Matrix Container */}
      <div className="relative aspect-square max-h-80 w-full">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* EXPLORE Quadrant (top-left) */}
          <div className="bg-blue-50/50 border-r border-b border-slate-200 flex items-start justify-start p-3">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Explore
            </span>
          </div>
          {/* INVEST Quadrant (top-right) */}
          <div className="bg-emerald-50/50 border-b border-slate-200 flex items-start justify-end p-3">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Invest
            </span>
          </div>
          {/* DIVEST Quadrant (bottom-left) */}
          <div className="bg-slate-50/50 border-r border-slate-200 flex items-end justify-start p-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Divest
            </span>
          </div>
          {/* HARVEST Quadrant (bottom-right) */}
          <div className="bg-amber-50/50 flex items-end justify-end p-3">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Harvest
            </span>
          </div>
        </div>

        {/* Axis Labels */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Market Attractiveness
          </span>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 whitespace-nowrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Capability Fit
          </span>
        </div>

        {/* Axis Scale Markers */}
        <div className="absolute left-0 top-0 text-[10px] text-slate-400 -translate-x-4">10</div>
        <div className="absolute left-0 bottom-0 text-[10px] text-slate-400 -translate-x-4">1</div>
        <div className="absolute right-0 bottom-0 text-[10px] text-slate-400 translate-y-4">10</div>
        <div className="absolute left-0 bottom-0 text-[10px] text-slate-400 translate-y-4">1</div>

        {/* Opportunity Dots */}
        {opportunities.map((opp) => {
          const pos = calculatePosition(opp);
          const isSelected = opp.id === selectedOpportunityId;
          const isHovered = opp.id === hoveredId;

          return (
            <div
              key={opp.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Tooltip */}
              {(isHovered || isSelected) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20">
                  <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="font-semibold">{opp.title}</div>
                    <div className="text-slate-300 mt-0.5">
                      Score: {opp.scoring.overallScore}
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              )}

              {/* Dot */}
              <button
                onClick={() => onOpportunityClick?.(opp.id)}
                onMouseEnter={() => setHoveredId(opp.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  ${getDotSize(opp)}
                  ${getDotColor(opp)}
                  rounded-full cursor-pointer
                  transition-all duration-300
                  ${isSelected ? 'ring-2 ring-offset-2 ring-cyan-400 scale-125' : ''}
                  ${isHovered && !isSelected ? 'scale-110' : ''}
                  hover:shadow-lg
                `}
                aria-label={`${opp.title} - Score: ${opp.scoring.overallScore}`}
              />
            </div>
          );
        })}

        {/* Empty State */}
        {opportunities.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="text-sm font-medium">No opportunities yet</div>
              <div className="text-xs mt-1">Generate synthesis to see opportunities</div>
            </div>
          </div>
        )}
      </div>

      {/* Quadrant Summary */}
      <div className="mt-6 grid grid-cols-4 gap-3">
        {(['invest', 'explore', 'harvest', 'divest'] as const).map((quadrant) => {
          const display = getQuadrantDisplay(quadrant);
          const count = opportunities.filter((o) => o.quadrant === quadrant).length;

          return (
            <div
              key={quadrant}
              className={`
                ${display.bgColor} ${display.borderColor}
                border rounded-xl p-3 text-center
              `}
            >
              <div className={`text-2xl font-bold ${display.color}`}>{count}</div>
              <div className={`text-xs font-semibold ${display.color} uppercase tracking-wider`}>
                {display.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StrategicOpportunityMap;
