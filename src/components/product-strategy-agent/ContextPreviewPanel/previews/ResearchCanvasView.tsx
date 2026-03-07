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
}> = {
  company: { label: 'Company', icon: Building2, progressColor: '#6366f1', progressBg: '#eef2ff' },
  customer: { label: 'Customer', icon: Users, progressColor: '#0891b2', progressBg: '#ecfeff' },
  competitor: { label: 'Market', icon: Swords, progressColor: '#9333ea', progressBg: '#faf5ff' },
};

const AREA_DOT_STYLES: Record<string, string> = {
  mapped: 'bg-emerald-500 border-emerald-500',
  in_progress: 'bg-[#fbbf24] border-[#fbbf24]',
  unexplored: 'bg-transparent border-slate-300',
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
  const ringSize = 90;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overallPct / 100) * circumference;

  return (
    <div className="space-y-3">
      {/* SVG Circular Progress Ring */}
      <div className="flex flex-col items-center py-2">
        <svg width={ringSize} height={ringSize} className="mb-1.5">
          {/* Track */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
            className="transition-all duration-500"
          />
          {/* Center text */}
          <text
            x={ringSize / 2}
            y={ringSize / 2 - 4}
            textAnchor="middle"
            className="fill-[#1a1f3a] text-xl font-bold"
            style={{ fontSize: '20px', fontWeight: 700 }}
          >
            {overallPct}%
          </text>
          <text
            x={ringSize / 2}
            y={ringSize / 2 + 12}
            textAnchor="middle"
            className="fill-slate-500"
            style={{ fontSize: '9px' }}
          >
            mapped
          </text>
        </svg>
        <span className="text-[10px] font-semibold text-slate-700">
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

        return (
          <div key={tp.territory} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3 h-3 text-slate-600" />
                <span className="text-[10px] font-semibold text-slate-700">{config.label}</span>
              </div>
              <span className="text-[9px] text-slate-400 font-[family-name:var(--font-code)]">
                {tp.completedAreas}/{tp.totalAreas} areas
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: config.progressColor }}
              />
            </div>

            {/* Area dots */}
            <div className="space-y-1">
              {tp.areas.map((areaProgress) => {
                const areaConfig = areas?.find(a => a.id === areaProgress.id);
                const isCurrent = pinnedQuestion?.territory === tp.territory && pinnedQuestion?.researchArea === areaProgress.id;
                const dotStyle = AREA_DOT_STYLES[areaProgress.status] || AREA_DOT_STYLES.unexplored;

                return (
                  <div key={areaProgress.id} className="flex items-center gap-1.5 py-0.5">
                    <span
                      className={`w-[5px] h-[5px] rounded-full border-[1.5px] flex-shrink-0 ${dotStyle} ${
                        isCurrent ? 'ring-2 ring-indigo-400/30 border-indigo-500' : ''
                      }`}
                    />
                    <span className={`flex-1 text-[9px] ${isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                      {areaConfig?.title || areaProgress.id.replace(/_/g, ' ')}
                    </span>
                    {areaProgress.status !== 'unexplored' && (
                      <span className="text-[8px] text-slate-400 uppercase tracking-wide">
                        {areaProgress.status === 'mapped' ? 'Done' : `${areaProgress.answeredQuestions}/${areaProgress.totalQuestions}`}
                      </span>
                    )}
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
