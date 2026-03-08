'use client';

import { Building2, Users, Swords } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { useResearchProgress, RESEARCH_AREAS } from '@/hooks/useResearchProgress';
import type { Territory } from '@/types/coaching-cards';

interface ResearchCanvasViewProps {
  conversationId: string | null;
}

const TERRITORY_CONFIG: Record<string, {
  label: string;
  icon: typeof Building2;
  progressColor: string;
  progressBg: string;
  accentLight: string;
}> = {
  company: { label: 'Company', icon: Building2, progressColor: '#6366f1', progressBg: '#eef2ff', accentLight: '#c7d2fe' },
  customer: { label: 'Customer', icon: Users, progressColor: '#0891b2', progressBg: '#ecfeff', accentLight: '#a5f3fc' },
  competitor: { label: 'Market', icon: Swords, progressColor: '#9333ea', progressBg: '#faf5ff', accentLight: '#d8b4fe' },
};

export function ResearchCanvasView({ conversationId }: ResearchCanvasViewProps) {
  const { pinnedQuestion } = useCoachJourney();
  const { progress, isLoading } = useResearchProgress(conversationId);

  if (isLoading || !progress) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="flex justify-center py-6">
          <div className="w-20 h-20 rounded-full bg-slate-100" />
        </div>
        <div className="h-20 bg-slate-50 rounded-xl" />
        <div className="h-20 bg-slate-50 rounded-xl" />
        <div className="h-20 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  const totalQuestions = progress.totalQuestions;
  const totalAnswered = progress.totalAnswered;
  const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  // SVG progress ring parameters
  const ringSize = 110;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overallPct / 100) * circumference;
  const isComplete = overallPct === 100;

  return (
    <div className="space-y-3">
      {/* SVG Circular Progress Ring */}
      <div className="flex flex-col items-center py-3">
        <div className="relative">
          {/* Glow effect for complete state */}
          {isComplete && (
            <div className="absolute inset-0 rounded-full bg-emerald-400/15 blur-lg animate-pulse" style={{ animationDuration: '3s' }} />
          )}
          <svg width={ringSize} height={ringSize} className="relative mb-1.5 drop-shadow-sm">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isComplete ? '#059669' : '#fbbf24'} />
                <stop offset="50%" stopColor={isComplete ? '#10b981' : '#f59e0b'} />
                <stop offset="100%" stopColor={isComplete ? '#34d399' : '#fbbf24'} />
              </linearGradient>
              <filter id="ringDropShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={isComplete ? '#059669' : '#fbbf24'} floodOpacity="0.25" />
              </filter>
            </defs>
            {/* Outer decorative ring */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius + 3}
              fill="none"
              stroke={isComplete ? '#d1fae5' : '#fef3c7'}
              strokeWidth="1"
            />
            {/* Track */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {/* Fill with gradient */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
              className="transition-all duration-700"
              filter="url(#ringDropShadow)"
            />
            {/* Inner circle background */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius - strokeWidth - 2}
              fill={isComplete ? '#f0fdf4' : '#fffbeb'}
              opacity="0.5"
            />
            {/* Center text */}
            <text
              x={ringSize / 2}
              y={ringSize / 2 - 6}
              textAnchor="middle"
              className="fill-[#1a1f3a]"
              style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-jakarta), system-ui' }}
            >
              {overallPct}%
            </text>
            <text
              x={ringSize / 2}
              y={ringSize / 2 + 10}
              textAnchor="middle"
              className={isComplete ? 'fill-emerald-600' : 'fill-slate-500'}
              style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              mapped
            </text>
            {/* Completion checkmark */}
            {isComplete && (
              <g transform={`translate(${ringSize / 2 + 18}, ${ringSize / 2 + 18})`}>
                <circle cx="0" cy="0" r="9" fill="#059669" />
                <path d="M-3.5 0l2.5 2.5 4.5-5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
          {totalAnswered} of {totalQuestions} questions
        </span>
      </div>

      {/* Territory Progress Cards */}
      {progress.territories.map((tp) => {
        const config = TERRITORY_CONFIG[tp.territory];
        if (!config) return null;
        const Icon = config.icon;
        const areas = RESEARCH_AREAS[tp.territory as keyof typeof RESEARCH_AREAS];
        const pct = tp.totalQuestions > 0 ? Math.round((tp.answeredQuestions / tp.totalQuestions) * 100) : 0;
        const isTerritoryComplete = tp.completedAreas === tp.totalAreas;

        return (
          <div key={tp.territory} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: config.progressBg }}
                >
                  <Icon className="w-3 h-3" style={{ color: config.progressColor }} />
                </div>
                <span className="text-xs font-bold text-slate-800">{config.label}</span>
              </div>
              <span className="text-[9px] text-slate-400 font-[family-name:var(--font-code)]">
                {tp.completedAreas}/{tp.totalAreas} areas
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-2.5">
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

            {/* Area items */}
            <div className="space-y-1">
              {tp.areas.map((areaProgress) => {
                const areaConfig = areas?.find(a => a.id === areaProgress.id);
                const isCurrent = pinnedQuestion?.territory === tp.territory && pinnedQuestion?.researchArea === areaProgress.id;
                const isMapped = areaProgress.status === 'mapped';
                const isInProgress = areaProgress.status === 'in_progress';

                return (
                  <div
                    key={areaProgress.id}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded-md transition-colors ${
                      isCurrent ? 'bg-indigo-50' : ''
                    }`}
                  >
                    {/* Status indicator */}
                    {isMapped ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                        <circle cx="7" cy="7" r="6" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
                        <circle cx="7" cy="7" r="3.5" fill="#059669" />
                        <path d="M5 7l1.2 1.2 2.3-2.5" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isInProgress ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                        <circle cx="7" cy="7" r="6" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
                        <path
                          d="M7 1a6 6 0 0 1 6 6"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="animate-spin origin-center"
                          style={{ animationDuration: '3s' }}
                        />
                        <circle cx="7" cy="7" r="2" fill="#d97706" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" className="flex-shrink-0">
                        <circle cx="7" cy="7" r="5.5" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2.5 2" />
                      </svg>
                    )}

                    {/* Area title */}
                    <span className={`flex-1 text-[10px] leading-tight ${
                      isCurrent ? 'text-slate-900 font-semibold'
                      : isMapped ? 'text-slate-700 font-medium'
                      : 'text-slate-500'
                    }`}>
                      {areaConfig?.title || areaProgress.id.replace(/_/g, ' ')}
                    </span>

                    {/* Status label */}
                    {isMapped ? (
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 uppercase tracking-wider">
                        Done
                      </span>
                    ) : isInProgress ? (
                      <span className="text-[8px] font-semibold text-amber-600 font-[family-name:var(--font-code)]">
                        {areaProgress.answeredQuestions}/{areaProgress.totalQuestions}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Readiness hint */}
      {overallPct < 100 && (
        <p className="text-[10px] text-slate-400 text-center py-1">
          Map territories to unlock synthesis
        </p>
      )}
    </div>
  );
}
