'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, Users, Swords, ChevronDown, ChevronUp } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';

interface TerritoryInsight {
  id: string;
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  responses: Record<string, string>;
  status: 'unexplored' | 'in_progress' | 'mapped';
}

interface ResearchPreviewProps {
  conversationId: string | null;
}

const TERRITORY_CONFIG = {
  company: {
    label: 'Company',
    icon: Building2,
    color: 'indigo',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-700',
    dotClass: 'bg-indigo-500',
    progressBarClass: 'bg-indigo-500',
    totalAreas: 3,
  },
  customer: {
    label: 'Customer',
    icon: Users,
    color: 'cyan',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
    textClass: 'text-cyan-700',
    dotClass: 'bg-cyan-500',
    progressBarClass: 'bg-cyan-500',
    totalAreas: 3,
  },
  competitor: {
    label: 'Competitor',
    icon: Swords,
    color: 'purple',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-700',
    dotClass: 'bg-purple-500',
    progressBarClass: 'bg-purple-500',
    totalAreas: 3,
  },
} as const;

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  unexplored: { label: 'Unexplored', className: 'bg-slate-100 text-slate-500' },
  in_progress: { label: 'In Progress', className: 'bg-amber-50 text-amber-700' },
  mapped: { label: 'Mapped', className: 'bg-emerald-50 text-emerald-700' },
};

export function ResearchPreview({ conversationId }: ResearchPreviewProps) {
  const { lastQuestionSubmitAt } = useCoachJourney();
  const [insights, setInsights] = useState<TerritoryInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTerritory, setExpandedTerritory] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const prevSubmitAt = useRef(lastQuestionSubmitAt);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchInsights() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/territories?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setInsights(Array.isArray(data) ? data : []);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInsights();
    return () => { cancelled = true; };
  }, [conversationId]);

  // Refetch when questions are submitted
  useEffect(() => {
    if (lastQuestionSubmitAt > prevSubmitAt.current && conversationId) {
      prevSubmitAt.current = lastQuestionSubmitAt;
      setPulseKey((k) => k + 1);

      async function refetch() {
        try {
          const res = await fetch(
            `/api/product-strategy-agent/territories?conversation_id=${conversationId}`
          );
          if (!res.ok) return;
          const data = await res.json();
          setInsights(Array.isArray(data) ? data : []);
        } catch {
          // Silently handle fetch errors
        }
      }

      refetch();
    }
  }, [lastQuestionSubmitAt, conversationId]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
        <div className="h-24 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  // Group insights by territory
  const grouped: Record<string, TerritoryInsight[]> = {
    company: [],
    customer: [],
    competitor: [],
  };
  for (const insight of insights) {
    if (grouped[insight.territory]) {
      grouped[insight.territory].push(insight);
    }
  }

  const territories = (['company', 'customer', 'competitor'] as const);

  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No research data yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Begin territory mapping in the coaching panel
        </p>
      </div>
    );
  }

  return (
    <div
      key={pulseKey}
      className="space-y-3"
    >
      {territories.map((t) => {
        const config = TERRITORY_CONFIG[t];
        const items = grouped[t];
        const mappedCount = items.filter((i) => i.status === 'mapped').length;
        const inProgressCount = items.filter((i) => i.status === 'in_progress').length;
        const activeCount = mappedCount + inProgressCount;
        const isExpanded = expandedTerritory === t;
        const Icon = config.icon;

        // Determine overall territory status
        let overallStatus: 'unexplored' | 'in_progress' | 'mapped' = 'unexplored';
        if (mappedCount === config.totalAreas) overallStatus = 'mapped';
        else if (activeCount > 0) overallStatus = 'in_progress';

        const badge = STATUS_BADGES[overallStatus];

        return (
          <div
            key={t}
            className={`bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
              pulseKey > 0 ? 'animate-[border-pulse_1s_ease-out]' : ''
            } ${config.borderClass}`}
          >
            <button
              onClick={() => setExpandedTerritory(isExpanded ? null : t)}
              className="w-full flex items-center gap-3 p-4"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgClass}`}>
                <Icon className={`w-4 h-4 ${config.textClass}`} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {config.label}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.progressBarClass}`}
                      style={{ width: `${(activeCount / config.totalAreas) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-code flex-shrink-0">
                    {activeCount}/{config.totalAreas}
                  </span>
                </div>
              </div>
              {items.length > 0 && (
                isExpanded
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {/* Expandable area list */}
            {isExpanded && items.length > 0 && (
              <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3">
                {items.map((insight) => {
                  const answeredQuestions = Object.entries(insight.responses || {}).filter(
                    ([, v]) => v && v.trim().length > 0
                  );
                  return (
                    <div
                      key={insight.id}
                      className="rounded-lg bg-slate-50/80 px-3 py-2 border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700 capitalize">
                          {insight.research_area.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${STATUS_BADGES[insight.status].className}`}>
                          {STATUS_BADGES[insight.status].label}
                        </span>
                      </div>
                      {answeredQuestions.length > 0 && (
                        <div className="space-y-1 mt-1.5">
                          {answeredQuestions.slice(0, 3).map(([key, val]) => (
                            <p key={key} className="text-[11px] text-slate-500 truncate leading-relaxed">
                              {val.substring(0, 80)}{val.length > 80 ? '...' : ''}
                            </p>
                          ))}
                          {answeredQuestions.length > 3 && (
                            <p className="text-[10px] text-slate-400">
                              +{answeredQuestions.length - 3} more answer{answeredQuestions.length - 3 !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
