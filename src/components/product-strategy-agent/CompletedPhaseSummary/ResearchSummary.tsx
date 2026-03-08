'use client';

import { Building2, Users, Swords, ArrowRight } from 'lucide-react';
import { RESEARCH_AREAS } from '@/hooks/useResearchProgress';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';

const TERRITORY_CONFIG: Record<string, {
  label: string;
  icon: typeof Building2;
  progressColor: string;
  progressBg: string;
  accentLight: string;
  border: string;
}> = {
  company: { label: 'Company', icon: Building2, progressColor: '#6366f1', progressBg: '#eef2ff', accentLight: '#c7d2fe', border: 'border-indigo-200' },
  customer: { label: 'Customer', icon: Users, progressColor: '#0891b2', progressBg: '#ecfeff', accentLight: '#a5f3fc', border: 'border-cyan-200' },
  competitor: { label: 'Market', icon: Swords, progressColor: '#9333ea', progressBg: '#faf5ff', accentLight: '#d8b4fe', border: 'border-purple-200' },
};

interface ResearchSummaryProps {
  researchProgress: ResearchProgressData | null;
  onDrillIn: () => void;
}

export function ResearchSummary({ researchProgress, onDrillIn }: ResearchSummaryProps) {
  if (!researchProgress) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-48 bg-slate-50 rounded-2xl" />
          <div className="h-48 bg-slate-50 rounded-2xl" />
          <div className="h-48 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalQuestions = researchProgress.totalQuestions;
  const totalAnswered = researchProgress.totalAnswered;
  const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  const isComplete = overallPct === 100;

  // SVG progress ring
  const ringSize = 120;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overallPct / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5 animate-entrance">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Research Summary
        </h3>
        <button
          onClick={onDrillIn}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
        >
          Review Research
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress ring + overall stats */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Ring */}
          <div className="flex-shrink-0 relative">
            {isComplete && (
              <div className="absolute inset-0 rounded-full bg-emerald-400/15 blur-lg animate-pulse" style={{ animationDuration: '3s' }} />
            )}
            <svg width={ringSize} height={ringSize} className="relative drop-shadow-sm">
              <defs>
                <linearGradient id="summaryRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isComplete ? '#059669' : '#fbbf24'} />
                  <stop offset="100%" stopColor={isComplete ? '#34d399' : '#f59e0b'} />
                </linearGradient>
              </defs>
              <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                fill="none" stroke="url(#summaryRingGradient)"
                strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                className="transition-all duration-700"
              />
              <text
                x={ringSize / 2} y={ringSize / 2 - 6}
                textAnchor="middle" className="fill-[#1a1f3a]"
                style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-jakarta), system-ui' }}
              >
                {overallPct}%
              </text>
              <text
                x={ringSize / 2} y={ringSize / 2 + 12}
                textAnchor="middle" className={isComplete ? 'fill-emerald-600' : 'fill-slate-500'}
                style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                mapped
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Strategic Terrain Mapping</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {totalAnswered} of {totalQuestions} research questions answered across 3 territories
              </p>
            </div>
            <div className="flex gap-3">
              {researchProgress.territories.map(tp => {
                const config = TERRITORY_CONFIG[tp.territory];
                if (!config) return null;
                return (
                  <div key={tp.territory} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.progressColor }} />
                    <span className="text-xs text-slate-600">{config.label}: {tp.completedAreas}/{tp.totalAreas}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3-column territory grid */}
      <div className="grid grid-cols-3 gap-4">
        {researchProgress.territories.map(tp => {
          const config = TERRITORY_CONFIG[tp.territory];
          if (!config) return null;
          const Icon = config.icon;
          const areas = RESEARCH_AREAS[tp.territory as keyof typeof RESEARCH_AREAS];
          const pct = tp.totalQuestions > 0 ? Math.round((tp.answeredQuestions / tp.totalQuestions) * 100) : 0;
          const isTerritoryComplete = tp.completedAreas === tp.totalAreas;

          return (
            <div key={tp.territory} className={`bg-white border ${config.border} rounded-2xl p-4 shadow-sm`}>
              {/* Territory header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.progressBg }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: config.progressColor }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{config.label}</p>
                  <p className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
                    {tp.completedAreas}/{tp.totalAreas} areas
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: isTerritoryComplete
                      ? 'linear-gradient(90deg, #059669, #34d399)'
                      : `linear-gradient(90deg, ${config.progressColor}, ${config.accentLight})`,
                  }}
                />
              </div>

              {/* Area list */}
              <div className="space-y-1.5">
                {tp.areas.map(areaProgress => {
                  const areaConfig = areas?.find(a => a.id === areaProgress.id);
                  const isMapped = areaProgress.status === 'mapped';
                  const isInProgress = areaProgress.status === 'in_progress';

                  return (
                    <div key={areaProgress.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-slate-50/50">
                      {/* Status dot */}
                      {isMapped ? (
                        <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 8 8">
                            <path d="M2 4l1.2 1.2 2.3-2.5" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ) : isInProgress ? (
                        <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-slate-200 flex-shrink-0" />
                      )}

                      <span className={`text-[11px] leading-tight flex-1 ${
                        isMapped ? 'text-slate-700 font-medium' : 'text-slate-500'
                      }`}>
                        {areaConfig?.title || areaProgress.id.replace(/_/g, ' ')}
                      </span>

                      {isMapped && (
                        <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 uppercase tracking-wider">
                          Done
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[9px] font-semibold text-amber-600 font-[family-name:var(--font-code)]">
                          {areaProgress.answeredQuestions}/{areaProgress.totalQuestions}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
