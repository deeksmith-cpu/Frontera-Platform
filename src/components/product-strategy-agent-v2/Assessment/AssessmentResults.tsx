'use client';

import { useRouter } from 'next/navigation';
import type { AssessmentScoreResult } from '@/lib/assessment/scoring';
import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from '@/lib/assessment/questions';
import type { AssessmentDimension } from '@/lib/assessment/questions';

interface AssessmentResultsProps {
  result: AssessmentScoreResult;
}

const ARCHETYPE_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  operator: { bg: 'bg-emerald-50', text: 'text-emerald-700', accent: 'border-emerald-300' },
  visionary: { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'border-purple-300' },
  analyst: { bg: 'bg-cyan-50', text: 'text-cyan-700', accent: 'border-cyan-300' },
  diplomat: { bg: 'bg-amber-50', text: 'text-amber-700', accent: 'border-amber-300' },
};

function RadarChart({ dimensions }: { dimensions: Record<AssessmentDimension, { score: number }> }) {
  const labels: AssessmentDimension[] = [
    'strategic_vision',
    'research_rigour',
    'execution_discipline',
    'stakeholder_alignment',
    'adaptive_capacity',
  ];
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 80;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Grid circles
  const gridCircles = [25, 50, 75, 100];

  // Data points
  const points = labels.map((dim, i) => getPoint(i, dimensions[dim].score));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[240px] mx-auto">
      {/* Grid */}
      {gridCircles.map((pct) => {
        const gridPoints = labels.map((_, i) => getPoint(i, pct));
        const gridPath =
          gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
        return (
          <path key={pct} d={gridPath} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        );
      })}

      {/* Axes */}
      {labels.map((_, i) => {
        const end = getPoint(i, 100);
        return (
          <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#cbd5e1" strokeWidth="0.5" />
        );
      })}

      {/* Data shape */}
      <path d={pathD} fill="rgba(251, 191, 36, 0.2)" stroke="#fbbf24" strokeWidth="2" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#1a1f3a" stroke="#fbbf24" strokeWidth="2" />
      ))}

      {/* Labels */}
      {labels.map((dim, i) => {
        const labelPoint = getPoint(i, 120);
        const shortLabels: Record<string, string> = {
          strategic_vision: 'Vision',
          research_rigour: 'Research',
          execution_discipline: 'Execution',
          stakeholder_alignment: 'Alignment',
          adaptive_capacity: 'Adaptivity',
        };
        return (
          <text
            key={dim}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 text-[8px] font-semibold"
          >
            {shortLabels[dim]}
          </text>
        );
      })}
    </svg>
  );
}

export function AssessmentResults({ result }: AssessmentResultsProps) {
  const router = useRouter();
  const { archetype, dimensions, overallMaturity } = result;
  const colors = ARCHETYPE_COLORS[archetype.archetype] || ARCHETYPE_COLORS.operator;

  return (
    <div className="space-y-8">
      {/* Archetype Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-8 text-white shadow-lg">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#fbbf24]/20 blur-2xl" />
        <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-cyan-400/10 blur-xl" />
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
              Your Strategic Archetype
            </span>
            <span className="text-xs text-slate-400">
              Overall Maturity: {overallMaturity}%
            </span>
          </div>
          <h2 className="text-3xl font-bold">{archetype.label}</h2>
          <p className="text-slate-300 leading-relaxed text-sm max-w-xl">
            {archetype.description}
          </p>
        </div>
      </div>

      {/* Radar Chart + Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-cyan-200 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Strategic Profile</h3>
          <RadarChart dimensions={dimensions} />
        </div>

        <div className="space-y-3">
          {(Object.keys(dimensions) as AssessmentDimension[]).map((dim) => {
            const score = dimensions[dim];
            const isStrength = archetype.strengths.includes(dim);
            const isGrowth = archetype.growthAreas.includes(dim);
            return (
              <div
                key={dim}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isStrength
                    ? `${colors.bg} ${colors.accent}`
                    : isGrowth
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-900">
                    {DIMENSION_LABELS[dim]}
                  </span>
                  <div className="flex items-center gap-2">
                    {isStrength && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Strength
                      </span>
                    )}
                    {isGrowth && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        Growth Area
                      </span>
                    )}
                    <span className="text-sm font-bold text-slate-900">{score.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1a1f3a] transition-all duration-700"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">{DIMENSION_DESCRIPTIONS[dim]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
        >
          Begin Your Strategy Journey
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center justify-center rounded-lg border border-cyan-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
