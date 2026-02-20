'use client';

import { useState, useEffect } from 'react';
import { SignalLog } from './SignalLog';
import { AssumptionTracker } from './AssumptionTracker';
import { StrategyDiff } from './StrategyDiff';
import type { Database } from '@/types/database';
import { calculateReviewTriggers, type ReviewTrigger } from '@/lib/agents/strategy-coach/review-cadence';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface StrategyReviewSectionProps {
  conversation: Conversation;
}

type ReviewTab = 'assumptions' | 'signals' | 'versions' | 'triggers';

const TABS: { id: ReviewTab; label: string }[] = [
  { id: 'triggers', label: 'Review' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'signals', label: 'Signals' },
  { id: 'versions', label: 'Versions' },
];

export function StrategyReviewSection({ conversation }: StrategyReviewSectionProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('triggers');
  const [triggers, setTriggers] = useState<ReviewTrigger[]>([]);
  const [loadingTriggers, setLoadingTriggers] = useState(true);

  useEffect(() => {
    loadReviewContext();
  }, [conversation.id]);

  async function loadReviewContext() {
    try {
      const [betsRes, assumptionsRes] = await Promise.all([
        fetch(`/api/product-strategy-agent-v2/bets?conversation_id=${conversation.id}`),
        fetch(`/api/product-strategy-agent-v2/assumptions?conversationId=${conversation.id}`),
      ]);

      const betsData = betsRes.ok ? await betsRes.json() : { theses: [], ungroupedBets: [] };
      const assumptionsData = assumptionsRes.ok ? await assumptionsRes.json() : { assumptions: [] };

      // Flatten bets from theses + ungrouped
      const allBets: Record<string, unknown>[] = [];
      for (const thesis of (betsData.theses || [])) {
        for (const bet of (thesis.bets || [])) {
          allBets.push(bet);
        }
      }
      for (const bet of (betsData.ungroupedBets || [])) {
        allBets.push(bet);
      }

      const frameworkState = conversation.framework_state as Record<string, unknown> | null;

      const reviewTriggers = calculateReviewTriggers({
        lastReviewDate: frameworkState?.lastActivityAt as string | undefined,
        strategySetDate: conversation.created_at,
        bets: allBets.map((b) => ({
          id: (b.id || b.betId) as string,
          bet: (b.bet || b.belief) as string,
          kill_date: (b.kill_date || b.killDate) as string | undefined,
          status: b.status as string | undefined,
        })),
        assumptions: (assumptionsData.assumptions || []).map((a: Record<string, unknown>) => ({
          id: a.id as string,
          assumption_text: a.assumption_text as string,
          status: a.status as string,
          updated_at: a.updated_at as string,
        })),
      });

      setTriggers(reviewTriggers);
    } catch (err) {
      console.error('Failed to load review context:', err);
    } finally {
      setLoadingTriggers(false);
    }
  }

  const urgencyColors: Record<string, { bg: string; text: string; border: string }> = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    low: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border-b border-slate-100 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1a1f3a] text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
            {tab.id === 'triggers' && triggers.length > 0 && (
              <span className="ml-1 w-4 h-4 inline-flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
                {triggers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {activeTab === 'triggers' && (
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Strategy Review
            </span>

            {loadingTriggers ? (
              <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
                <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                <span className="text-xs uppercase tracking-wide font-semibold">Checking review triggers...</span>
              </div>
            ) : triggers.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-emerald-800">Strategy is on Track</h3>
                <p className="text-xs text-emerald-600 mt-1">
                  No urgent reviews needed. Continue monitoring signals and validating assumptions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {triggers.map((trigger, idx) => {
                  const colors = urgencyColors[trigger.urgency];
                  return (
                    <div key={idx} className={`${colors.bg} border ${colors.border} rounded-2xl p-4`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                              {trigger.urgency.toUpperCase()}
                            </span>
                            <h3 className="text-sm font-semibold text-slate-900">{trigger.title}</h3>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{trigger.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400">
                        Due: {new Date(trigger.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick stats */}
            <div className="bg-white border border-cyan-200 rounded-2xl p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Quick Actions
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setActiveTab('assumptions')}
                  className="px-3 py-1.5 bg-white border border-cyan-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  Review Assumptions
                </button>
                <button
                  onClick={() => setActiveTab('signals')}
                  className="px-3 py-1.5 bg-white border border-cyan-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  Log Signal
                </button>
                <button
                  onClick={() => setActiveTab('versions')}
                  className="px-3 py-1.5 bg-white border border-cyan-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assumptions' && (
          <AssumptionTracker conversationId={conversation.id} />
        )}

        {activeTab === 'signals' && (
          <SignalLog conversationId={conversation.id} />
        )}

        {activeTab === 'versions' && (
          <StrategyDiff conversationId={conversation.id} />
        )}
      </div>
    </div>
  );
}
