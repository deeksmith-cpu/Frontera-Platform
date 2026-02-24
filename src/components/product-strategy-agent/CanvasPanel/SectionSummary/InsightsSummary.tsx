'use client';

import { Building2, Users, TrendingUp } from 'lucide-react';
import type { TerritoryInsightCounts } from '@/types/coaching-cards';

interface InsightsSummaryProps {
  territories: TerritoryInsightCounts;
  totalInsights: number;
}

const TERRITORY_CONFIG = [
  {
    id: 'company',
    label: 'Company',
    Icon: Building2,
    bgClass: 'bg-[#1a1f3a]/5',
    textClass: 'text-[#1a1f3a]',
    borderClass: 'border-[#1a1f3a]/20',
  },
  {
    id: 'customer',
    label: 'Customer',
    Icon: Users,
    bgClass: 'bg-[#fbbf24]/10',
    textClass: 'text-amber-700',
    borderClass: 'border-[#fbbf24]/30',
  },
  {
    id: 'competitor',
    label: 'Market',
    Icon: TrendingUp,
    bgClass: 'bg-cyan-50',
    textClass: 'text-cyan-700',
    borderClass: 'border-cyan-200',
  },
];

/**
 * InsightsSummary - Territory breakdown of captured insights
 *
 * Shows insights count by territory with:
 * - Territory-specific colors and icons
 * - Compact badge layout
 * - Total insights indicator
 */
export function InsightsSummary({ territories, totalInsights }: InsightsSummaryProps) {
  if (totalInsights === 0) {
    return (
      <div className="insights-summary-empty p-3 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          No insights captured yet. Explore the territories to discover strategic insights.
        </p>
      </div>
    );
  }

  return (
    <div className="insights-summary">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Insights by Territory
        </span>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
          {totalInsights} total
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {TERRITORY_CONFIG.map(({ id, label, Icon, bgClass, textClass, borderClass }) => {
          const count = territories[id as keyof TerritoryInsightCounts] || 0;

          return (
            <div
              key={id}
              className={`
                inline-flex items-center gap-1.5
                px-2.5 py-1.5 rounded-lg
                border ${borderClass} ${bgClass}
                transition-all duration-200 hover:scale-105
              `}
            >
              <Icon className={`w-3.5 h-3.5 ${textClass}`} />
              <span className={`text-xs font-medium ${textClass}`}>
                {label}
              </span>
              <span className={`text-xs font-bold ${textClass} ml-0.5`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
