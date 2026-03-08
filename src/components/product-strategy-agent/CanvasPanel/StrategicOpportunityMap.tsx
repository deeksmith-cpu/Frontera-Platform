'use client';

import { useState, useMemo } from 'react';
import type { StrategicOpportunity, StrategicOpportunityMapProps } from '@/types/synthesis';
import { getQuadrantDisplay } from '@/lib/synthesis/helpers';

// Chart dimensions and margins
const CHART_W = 500;
const CHART_H = 400;
const MARGIN = { top: 24, right: 24, bottom: 48, left: 56 };
const PLOT_W = CHART_W - MARGIN.left - MARGIN.right;
const PLOT_H = CHART_H - MARGIN.top - MARGIN.bottom;

// Quadrant colours
const Q_COLORS = {
  invest:  { fill: '#ecfdf5', stroke: '#6ee7b7' },   // emerald
  explore: { fill: '#eff6ff', stroke: '#93c5fd' },    // blue
  harvest: { fill: '#fffbeb', stroke: '#fcd34d' },    // amber
  divest:  { fill: '#f8fafc', stroke: '#cbd5e1' },    // slate
} as const;

const DOT_COLORS: Record<string, string> = {
  invest:  '#10b981',
  explore: '#3b82f6',
  harvest: '#f59e0b',
  divest:  '#94a3b8',
};

/**
 * StrategicOpportunityMap
 *
 * Enhanced 2x2 matrix visualization for strategic opportunities.
 * SVG-based with gridlines, gradient quadrant fills, sized/coloured dots,
 * interactive tooltips, and quadrant summary cards.
 */
export function StrategicOpportunityMap({
  opportunities,
  onOpportunityClick,
  selectedOpportunityId,
}: StrategicOpportunityMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Scale helpers: score 1-10 -> pixel position within plot area
  const xScale = (v: number) => MARGIN.left + ((v - 1) / 9) * PLOT_W;
  const yScale = (v: number) => MARGIN.top + PLOT_H - ((v - 1) / 9) * PLOT_H;

  // Midpoints for quadrant dividers (score 5.5 boundary)
  const midX = xScale(5.5);
  const midY = yScale(5.5);

  // Dot radius based on overall score
  const getRadius = (score: number) => {
    if (score >= 80) return 14;
    if (score >= 60) return 11;
    return 8;
  };

  // Sort so selected/hovered dots render on top
  const sortedOpps = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      if (a.id === selectedOpportunityId) return 1;
      if (b.id === selectedOpportunityId) return -1;
      if (a.id === hoveredId) return 1;
      if (b.id === hoveredId) return -1;
      return 0;
    });
  }, [opportunities, selectedOpportunityId, hoveredId]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Strategic Opportunity Map</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Market Attractiveness vs Capability Fit
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {(['invest', 'explore', 'harvest'] as const).map((q) => (
            <div key={q} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: DOT_COLORS[q] }}
              />
              <span className="text-slate-500 capitalize">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="px-3 pb-2">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="w-full"
          style={{ maxHeight: '420px' }}
        >
          <defs>
            {/* Subtle quadrant gradient fills */}
            {Object.entries(Q_COLORS).map(([key, colors]) => (
              <radialGradient key={key} id={`grad-${key}`} cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor={colors.fill} stopOpacity="0.9" />
                <stop offset="100%" stopColor={colors.fill} stopOpacity="0.3" />
              </radialGradient>
            ))}

            {/* Glow filter for selected dots */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop shadow for dots */}
            <filter id="dot-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#1a1f3a" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Quadrant background fills */}
          {/* Explore (top-left) */}
          <rect x={MARGIN.left} y={MARGIN.top} width={midX - MARGIN.left} height={midY - MARGIN.top}
            fill={`url(#grad-explore)`} />
          {/* Invest (top-right) */}
          <rect x={midX} y={MARGIN.top} width={MARGIN.left + PLOT_W - midX} height={midY - MARGIN.top}
            fill={`url(#grad-invest)`} />
          {/* Divest (bottom-left) */}
          <rect x={MARGIN.left} y={midY} width={midX - MARGIN.left} height={MARGIN.top + PLOT_H - midY}
            fill={`url(#grad-divest)`} />
          {/* Harvest (bottom-right) */}
          <rect x={midX} y={midY} width={MARGIN.left + PLOT_W - midX} height={MARGIN.top + PLOT_H - midY}
            fill={`url(#grad-harvest)`} />

          {/* Plot area border */}
          <rect x={MARGIN.left} y={MARGIN.top} width={PLOT_W} height={PLOT_H}
            fill="none" stroke="#e2e8f0" strokeWidth="1" />

          {/* Grid lines */}
          {[2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
            <g key={v}>
              {/* Vertical */}
              <line x1={xScale(v)} y1={MARGIN.top} x2={xScale(v)} y2={MARGIN.top + PLOT_H}
                stroke={v === 5 ? 'transparent' : '#e2e8f0'} strokeWidth="0.5" strokeDasharray={v % 2 === 0 ? 'none' : '2,3'} />
              {/* Horizontal */}
              <line x1={MARGIN.left} y1={yScale(v)} x2={MARGIN.left + PLOT_W} y2={yScale(v)}
                stroke={v === 5 ? 'transparent' : '#e2e8f0'} strokeWidth="0.5" strokeDasharray={v % 2 === 0 ? 'none' : '2,3'} />
            </g>
          ))}

          {/* Quadrant divider lines (thicker, at 5.5 boundary) */}
          <line x1={midX} y1={MARGIN.top} x2={midX} y2={MARGIN.top + PLOT_H}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1={MARGIN.left} y1={midY} x2={MARGIN.left + PLOT_W} y2={midY}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,4" />

          {/* Quadrant labels */}
          <text x={MARGIN.left + 10} y={MARGIN.top + 18}
            className="text-[11px] font-semibold" fill="#3b82f6" opacity="0.7">
            EXPLORE
          </text>
          <text x={MARGIN.left + PLOT_W - 10} y={MARGIN.top + 18}
            className="text-[11px] font-semibold" fill="#10b981" opacity="0.7" textAnchor="end">
            INVEST
          </text>
          <text x={MARGIN.left + 10} y={MARGIN.top + PLOT_H - 8}
            className="text-[11px] font-semibold" fill="#94a3b8" opacity="0.7">
            DIVEST
          </text>
          <text x={MARGIN.left + PLOT_W - 10} y={MARGIN.top + PLOT_H - 8}
            className="text-[11px] font-semibold" fill="#f59e0b" opacity="0.7" textAnchor="end">
            HARVEST
          </text>

          {/* X-axis tick labels */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
            <text key={`x-${v}`} x={xScale(v)} y={MARGIN.top + PLOT_H + 18}
              textAnchor="middle" className="text-[10px]" fill="#94a3b8">
              {v}
            </text>
          ))}

          {/* Y-axis tick labels */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
            <text key={`y-${v}`} x={MARGIN.left - 10} y={yScale(v) + 4}
              textAnchor="end" className="text-[10px]" fill="#94a3b8">
              {v}
            </text>
          ))}

          {/* Axis labels */}
          <text x={MARGIN.left + PLOT_W / 2} y={CHART_H - 4}
            textAnchor="middle" className="text-[11px] font-semibold" fill="#64748b">
            Capability Fit
          </text>
          <text
            x={14} y={MARGIN.top + PLOT_H / 2}
            textAnchor="middle" className="text-[11px] font-semibold" fill="#64748b"
            transform={`rotate(-90, 14, ${MARGIN.top + PLOT_H / 2})`}
          >
            Market Attractiveness
          </text>

          {/* Opportunity dots */}
          {sortedOpps.map((opp) => {
            const cx = xScale(opp.scoring.capabilityFit);
            const cy = yScale(opp.scoring.marketAttractiveness);
            const r = getRadius(opp.scoring.overallScore);
            const isSelected = opp.id === selectedOpportunityId;
            const isHovered = opp.id === hoveredId;
            const color = isSelected ? '#fbbf24' : DOT_COLORS[opp.quadrant] || '#94a3b8';

            return (
              <g key={opp.id}>
                {/* Selection ring */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r={r + 6}
                    fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`}
                      dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.2;0.5"
                      dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Hover halo */}
                {isHovered && !isSelected && (
                  <circle cx={cx} cy={cy} r={r + 4}
                    fill={color} opacity="0.15" />
                )}

                {/* Main dot */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={color}
                  stroke="white" strokeWidth="2"
                  filter="url(#dot-shadow)"
                  className="cursor-pointer transition-all duration-200"
                  style={{ transform: isHovered || isSelected ? 'scale(1.15)' : 'scale(1)', transformOrigin: `${cx}px ${cy}px` }}
                  onClick={() => onOpportunityClick?.(opp.id)}
                  onMouseEnter={() => setHoveredId(opp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />

                {/* Score label inside dot (for larger dots) */}
                {r >= 11 && (
                  <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                    className="text-[9px] font-bold pointer-events-none" fill="white">
                    {opp.scoring.overallScore}
                  </text>
                )}

                {/* Truncated name label */}
                {(isHovered || isSelected) && (
                  <g>
                    <rect
                      x={cx - 60} y={cy - r - 28}
                      width="120" height="22" rx="6"
                      fill="#1a1f3a" opacity="0.92"
                    />
                    <text x={cx} y={cy - r - 14}
                      textAnchor="middle" dominantBaseline="middle"
                      className="text-[10px] font-semibold" fill="white">
                      {opp.title.length > 22 ? opp.title.substring(0, 20) + '...' : opp.title}
                    </text>
                    {/* Arrow */}
                    <polygon
                      points={`${cx - 4},${cy - r - 6} ${cx + 4},${cy - r - 6} ${cx},${cy - r - 1}`}
                      fill="#1a1f3a" opacity="0.92"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Empty state */}
          {opportunities.length === 0 && (
            <text x={MARGIN.left + PLOT_W / 2} y={MARGIN.top + PLOT_H / 2}
              textAnchor="middle" className="text-sm" fill="#94a3b8">
              Generate synthesis to plot opportunities
            </text>
          )}
        </svg>
      </div>

      {/* Quadrant Summary Cards */}
      <div className="px-5 pb-5 pt-1">
        <div className="grid grid-cols-4 gap-2.5">
          {(['invest', 'explore', 'harvest', 'divest'] as const).map((quadrant) => {
            const display = getQuadrantDisplay(quadrant);
            const count = opportunities.filter((o) => o.quadrant === quadrant).length;
            const dotColor = DOT_COLORS[quadrant];

            return (
              <div
                key={quadrant}
                className="relative overflow-hidden rounded-xl border p-3 text-center transition-all duration-300 hover:shadow-md"
                style={{
                  borderColor: Q_COLORS[quadrant].stroke,
                  background: `linear-gradient(135deg, ${Q_COLORS[quadrant].fill} 0%, white 100%)`,
                }}
              >
                {/* Decorative corner accent */}
                <div
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full opacity-20"
                  style={{ backgroundColor: dotColor }}
                />
                <div className="relative">
                  <div className="text-2xl font-bold" style={{ color: dotColor }}>
                    {count}
                  </div>
                  <div className={`text-[10px] font-semibold uppercase tracking-wider ${display.color}`}>
                    {display.label}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                    {display.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StrategicOpportunityMap;
