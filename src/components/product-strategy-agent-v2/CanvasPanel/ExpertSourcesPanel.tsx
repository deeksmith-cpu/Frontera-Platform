'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ExpertInsight {
  speaker: string;
  company: string;
  quote: string;
  topic: string;
  source: string;
  relevanceScore: number;
}

interface TerritoryInsights {
  company: ExpertInsight[];
  customer: ExpertInsight[];
  competitor: ExpertInsight[];
}

interface ExpertSourcesPanelProps {
  conversation: Conversation;
}

const PAGE_SIZE = 3;

const TABS = [
  { key: 'company' as const, label: 'Company', color: 'indigo' },
  { key: 'customer' as const, label: 'Customer', color: 'cyan' },
  { key: 'competitor' as const, label: 'Market', color: 'purple' },
] as const;

type TabKey = typeof TABS[number]['key'];

/**
 * ExpertSourcesPanel
 *
 * Displays expert perspectives from 301 podcast transcripts relevant to the
 * user's current research context. Part of UC1: Expert Perspectives.
 *
 * Shows top 3 ranked insights per territory tab (Company, Customer, Market)
 * with a "Show More" button to load the next 3.
 */
export function ExpertSourcesPanel({ conversation }: ExpertSourcesPanelProps) {
  const [allInsights, setAllInsights] = useState<TerritoryInsights>({
    company: [],
    customer: [],
    competitor: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('company');
  const [visibleCount, setVisibleCount] = useState<Record<TabKey, number>>({
    company: PAGE_SIZE,
    customer: PAGE_SIZE,
    competitor: PAGE_SIZE,
  });
  const [topicFilter, setTopicFilter] = useState('');

  const phase = conversation.current_phase || 'research';

  // Fetch all three territories in parallel on mount
  const fetchAllInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const territories: TabKey[] = ['company', 'customer', 'competitor'];
      const results = await Promise.all(
        territories.map(async (territory) => {
          const params = new URLSearchParams({
            mode: 'insights',
            phase,
            limit: '30',
            territory,
          });
          const response = await fetch(`/api/product-strategy-agent-v2/expert-knowledge?${params}`);
          if (response.ok) {
            const data = await response.json();
            return { territory, insights: (data.insights || []) as ExpertInsight[] };
          }
          return { territory, insights: [] as ExpertInsight[] };
        })
      );

      const grouped: TerritoryInsights = { company: [], customer: [], competitor: [] };
      for (const r of results) {
        grouped[r.territory] = r.insights;
      }
      setAllInsights(grouped);
    } catch (error) {
      console.error('Error fetching expert knowledge:', error);
    } finally {
      setIsLoading(false);
    }
  }, [phase]);

  useEffect(() => {
    fetchAllInsights();
  }, [fetchAllInsights]);

  // Reset visible count when switching tabs
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setTopicFilter('');
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + PAGE_SIZE,
    }));
  };

  // Filter and slice insights for current tab
  const currentInsights = allInsights[activeTab].filter((insight) => {
    if (!topicFilter) return true;
    const q = topicFilter.toLowerCase();
    return (
      insight.topic.toLowerCase().includes(q) ||
      insight.speaker.toLowerCase().includes(q) ||
      insight.company.toLowerCase().includes(q)
    );
  });
  const visible = currentInsights.slice(0, visibleCount[activeTab]);
  const hasMore = currentInsights.length > visibleCount[activeTab];
  const totalForTab = currentInsights.length;

  // Tab colors
  const tabColors: Record<TabKey, { active: string; badge: string; border: string }> = {
    company: { active: 'bg-[#1a1f3a] text-white', badge: 'bg-[#1a1f3a]/10 text-[#1a1f3a]', border: 'border-[#1a1f3a]/20 hover:border-[#1a1f3a]/40' },
    customer: { active: 'bg-[#fbbf24] text-slate-900', badge: 'bg-[#fbbf24]/10 text-[#b45309]', border: 'border-[#fbbf24]/30 hover:border-[#fbbf24]/50' },
    competitor: { active: 'bg-[#0891b2] text-white', badge: 'bg-cyan-50 text-[#0891b2]', border: 'border-cyan-200 hover:border-cyan-300' },
  };

  return (
    <div className="expert-sources-panel space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Expert Sources
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Top insights from 280+ leaders across 301 episodes
        </p>
      </div>

      {/* Territory Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all duration-300 ${
              activeTab === tab.key
                ? tabColors[tab.key].active
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {!isLoading && (
              <span className="ml-1 opacity-70">({allInsights[tab.key].length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Topic Search */}
      <input
        type="text"
        placeholder="Search by topic, speaker, or company..."
        value={topicFilter}
        onChange={(e) => setTopicFilter(e.target.value)}
        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 transition-all focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2.5 text-slate-600 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
            <span className="text-xs uppercase tracking-wide font-semibold">Loading experts...</span>
          </div>
        </div>
      )}

      {/* Insights List */}
      {!isLoading && (
        <div className="space-y-3">
          {visible.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-500">
              No expert insights found{topicFilter ? ` for "${topicFilter}"` : ''}.
            </div>
          ) : (
            <>
              {/* Showing count */}
              <div className="text-xs text-slate-400 font-medium">
                Showing {Math.min(visibleCount[activeTab], totalForTab)} of {totalForTab} insights
              </div>

              {visible.map((insight, idx) => (
                <div
                  key={`${activeTab}-${idx}`}
                  className={`bg-white border ${tabColors[activeTab].border} rounded-2xl p-4 transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="flex items-start gap-3">
                    {/* Rank badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      idx < 3 ? tabColors[activeTab].badge : 'bg-slate-100 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{insight.speaker}</span>
                        <span className="text-xs text-slate-500">{insight.company}</span>
                      </div>
                      <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${tabColors[activeTab].badge}`}>
                        {insight.topic}
                      </span>
                      {/* Always show quote — no expand/collapse */}
                      <blockquote className="mt-3 text-sm text-slate-700 leading-relaxed border-l-2 border-[#fbbf24] pl-3 italic">
                        &ldquo;{insight.quote}&rdquo;
                      </blockquote>
                      <div className="mt-2 text-xs text-slate-400">
                        Source: {insight.source}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show More Button */}
              {hasMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all duration-300"
                >
                  Show {Math.min(PAGE_SIZE, totalForTab - visibleCount[activeTab])} more insights
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Powered by 301 Lenny&apos;s Podcast transcripts
        </p>
      </div>
    </div>
  );
}

export default ExpertSourcesPanel;
