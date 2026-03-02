'use client';

import { useState, useEffect } from 'react';
import { Target, TrendingUp } from 'lucide-react';

interface StrategicBet {
  id: string;
  bet: string;
  jobToBeDone: string;
  status: 'draft' | 'proposed' | 'accepted' | 'prioritized';
  scoring: {
    overallScore: number;
  };
  priorityLevel: 'high' | 'medium' | 'low' | null;
  timeHorizon: string | null;
}

interface StrategicThesis {
  id: string;
  title: string;
  thesisType: 'offensive' | 'defensive' | 'capability';
  bets: StrategicBet[];
}

interface BetsPreviewProps {
  conversationId: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-500',
  proposed: 'bg-blue-50 text-blue-600',
  accepted: 'bg-emerald-50 text-emerald-700',
  prioritized: 'bg-cyan-50 text-cyan-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-500',
};

const THESIS_TYPE_COLORS: Record<string, string> = {
  offensive: 'bg-emerald-50 text-emerald-700',
  defensive: 'bg-blue-50 text-blue-700',
  capability: 'bg-purple-50 text-purple-700',
};

export function BetsPreview({ conversationId }: BetsPreviewProps) {
  const [theses, setTheses] = useState<StrategicThesis[]>([]);
  const [ungroupedBets, setUngroupedBets] = useState<StrategicBet[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<{
    totalBets: number;
    totalTheses: number;
    avgScore: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchBets() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/bets?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.success) {
          setTheses(data.theses || []);
          setUngroupedBets(data.ungroupedBets || []);
          setPortfolioSummary(data.portfolioSummary || null);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBets();
    return () => { cancelled = true; };
  }, [conversationId]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-28" />
        <div className="h-20 bg-slate-50 rounded-2xl" />
        <div className="h-16 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const totalBets = portfolioSummary?.totalBets || 0;

  if (totalBets === 0 && theses.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No strategic bets yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Generate bets from your synthesis opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Portfolio summary */}
      {portfolioSummary && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Portfolio Summary
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-lg font-bold text-slate-900 font-code">
                {portfolioSummary.totalTheses}
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Theses</p>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 font-code">
                {portfolioSummary.totalBets}
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Bets</p>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 font-code">
                {portfolioSummary.avgScore}
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Theses with bets */}
      {theses.map((thesis) => (
        <div
          key={thesis.id}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-2 mb-2">
            <h4 className="text-sm font-semibold text-slate-900 flex-1 leading-snug">
              {thesis.title}
            </h4>
            <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0 ${THESIS_TYPE_COLORS[thesis.thesisType] || ''}`}>
              {thesis.thesisType}
            </span>
          </div>
          {thesis.bets.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {thesis.bets.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50/80 border border-slate-100"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 truncate">{bet.bet}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {bet.priorityLevel && (
                      <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[bet.priorityLevel] || ''}`}>
                        {bet.priorityLevel}
                      </span>
                    )}
                    <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${STATUS_COLORS[bet.status] || ''}`}>
                      {bet.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Ungrouped bets */}
      {ungroupedBets.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
            Unassigned Bets
          </span>
          {ungroupedBets.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 truncate">{bet.bet}</p>
              </div>
              <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${STATUS_COLORS[bet.status] || ''}`}>
                {bet.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
