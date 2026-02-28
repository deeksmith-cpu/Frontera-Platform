'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Clock,
  Lightbulb,
  FileText,
  Flame,
} from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';
import { InsightsSummary } from './InsightsSummary';
import { MicroRewardCard } from './MicroRewardCard';
import type { Phase, SectionSummaryData, Achievement } from '@/types/coaching-cards';

interface SectionSummaryPanelProps {
  data: SectionSummaryData;
  latestAchievement?: Achievement | null;
  onDismissAchievement?: (achievementId: string) => void;
  defaultCollapsed?: boolean;
}

const PHASE_LABELS: Record<Phase, string> = {
  discovery: 'Discovery',
  research: 'Landscape',
  synthesis: 'Synthesis',
  bets: 'Strategic Bets',
};

interface StatBadgeProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

function StatBadge({ icon, value, label }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800 font-[family-name:var(--font-code)]">{value}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

/**
 * SectionSummaryPanel - Collapsible progress panel for CanvasPanel
 *
 * Premium design showing:
 * - Phase progress ring
 * - Time spent, insights count, evidence count
 * - Territory insights breakdown
 * - Latest achievement celebration
 * - Streak indicator
 */
export function SectionSummaryPanel({
  data,
  latestAchievement,
  onDismissAchievement,
  defaultCollapsed = false,
}: SectionSummaryPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="section-summary-panel mb-6 animate-entrance">
      {/* Collapsible header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`
          w-full flex items-center justify-between
          p-4 bg-white rounded-2xl
          border-2 border-slate-200
          hover:border-cyan-300 hover:shadow-md
          transition-all duration-300
          ${!isCollapsed ? 'rounded-b-none border-b-0' : ''}
        `}
      >
        <div className="flex items-center gap-4">
          <StatusIndicator
            phase={data.currentPhase}
            progress={data.phaseProgress}
            size="md"
          />
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900">
              {PHASE_LABELS[data.currentPhase]} Progress
            </h3>
            <p className="text-xs text-slate-500">
              {data.phaseProgress}% complete
              {data.currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 ml-2 text-orange-600">
                  <Flame className="w-3 h-3" />
                  {data.currentStreak} day streak
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick stats (visible when collapsed) */}
          {isCollapsed && (
            <div className="hidden sm:flex items-center gap-4 mr-2">
              <span className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">{data.insightsCount}</span> insights
              </span>
              <span className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">{data.evidenceCount}</span> evidence
              </span>
            </div>
          )}

          <div className={`
            p-1.5 rounded-lg bg-slate-100
            transition-transform duration-300
            ${isCollapsed ? '' : 'rotate-180'}
          `}>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {!isCollapsed && (
        <div
          className={`
            p-5 bg-slate-50
            border-2 border-t-0 border-slate-200
            rounded-b-2xl
            animate-fade-in
          `}
        >
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 mb-5">
            <StatBadge
              icon={<Clock className="w-4 h-4 text-slate-500" />}
              value={formatTime(data.timeSpentMinutes)}
              label="Time"
            />
            <StatBadge
              icon={<Lightbulb className="w-4 h-4 text-amber-500" />}
              value={data.insightsCount}
              label="Insights"
            />
            <StatBadge
              icon={<FileText className="w-4 h-4 text-cyan-500" />}
              value={data.evidenceCount}
              label="Evidence"
            />
          </div>

          {/* Territory insights breakdown (for research phase) */}
          {(data.currentPhase === 'research' || data.currentPhase === 'synthesis') && (
            <div className="mb-5">
              <InsightsSummary
                territories={data.insightsByTerritory}
                totalInsights={data.insightsCount}
              />
            </div>
          )}

          {/* Latest achievement */}
          {latestAchievement && !latestAchievement.celebrated && (
            <MicroRewardCard
              achievement={latestAchievement}
              onDismiss={onDismissAchievement}
              autoHide={false}
            />
          )}

          {/* No achievements yet encouragement */}
          {!latestAchievement && data.insightsCount === 0 && (
            <div className="p-4 rounded-xl bg-white border border-dashed border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                Start exploring to unlock achievements and track your progress.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
