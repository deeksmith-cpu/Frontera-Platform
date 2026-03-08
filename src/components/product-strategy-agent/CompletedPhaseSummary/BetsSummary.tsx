'use client';

import { useState, useEffect } from 'react';
import { Target, Sword, Shield, Wrench, ArrowRight, FileText } from 'lucide-react';

interface Bet {
  id: string;
  bet: string;
  status?: string;
  priorityLevel?: string;
  scoring?: { overallScore?: number };
}

interface Thesis {
  id: string;
  title: string;
  thesisType?: string;
  bets: Bet[];
}

interface PortfolioSummary {
  totalBets: number;
  totalTheses: number;
  avgScore: number;
}

interface BetsSummaryProps {
  conversationId: string;
  onDrillIn: () => void;
}

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Sword; color: string; bg: string; border: string }> = {
  offensive: { label: 'Offensive', icon: Sword, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  defensive: { label: 'Defensive', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  capability: { label: 'Capability', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  proposed: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  prioritized: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function BetsSummary({ conversationId, onDrillIn }: BetsSummaryProps) {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [ungroupedBets, setUngroupedBets] = useState<Bet[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setPortfolio(data.portfolioSummary || null);
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
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
        </div>
        <div className="h-40 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  // Count bets by type
  const allBets = [...theses.flatMap(t => t.bets), ...ungroupedBets];
  const typeCounts = { offensive: 0, defensive: 0, capability: 0 };
  for (const t of theses) {
    const type = (t.thesisType || 'offensive') as keyof typeof typeCounts;
    if (type in typeCounts) typeCounts[type] += t.bets.length;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5 animate-entrance">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Strategic Bets Summary
        </h3>
        <button
          onClick={onDrillIn}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
        >
          View Strategic Bets Detail
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Portfolio stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          const count = typeCounts[type as keyof typeof typeCounts] || 0;
          return (
            <div key={type} className={`bg-white border ${config.border} rounded-2xl p-5 shadow-sm`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
                {count}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                {count === 1 ? 'bet' : 'bets'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Overall portfolio card */}
      {portfolio && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Portfolio Overview</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {portfolio.totalBets} bets across {portfolio.totalTheses} strategic theses
              </p>
            </div>
            {portfolio.avgScore > 0 && (
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Score</p>
                <p className="text-lg font-bold text-[#1a1f3a] font-[family-name:var(--font-code)]">
                  {portfolio.avgScore.toFixed(1)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Theses list */}
      {theses.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Strategic Theses
          </p>
          <div className="space-y-2.5">
            {theses.slice(0, 5).map(thesis => {
              const type = thesis.thesisType || 'offensive';
              const config = TYPE_CONFIG[type] || TYPE_CONFIG.offensive;
              const Icon = config.icon;

              return (
                <div key={thesis.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                  <div className={`w-6 h-6 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{thesis.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {thesis.bets.length} {thesis.bets.length === 1 ? 'bet' : 'bets'}
                    </p>
                  </div>
                  <span className={`text-[9px] font-semibold rounded-full px-2 py-0.5 uppercase tracking-wider border ${config.bg} ${config.color} ${config.border}`}>
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top bets */}
      {allBets.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Top Bets
          </p>
          <div className="space-y-2">
            {allBets.slice(0, 4).map(bet => (
              <div key={bet.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-cyan-50/30 border border-cyan-100/60">
                <Target className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 flex-1 truncate">{bet.bet}</span>
                {bet.status && (
                  <span className={`text-[8px] font-semibold rounded-full px-2 py-0.5 uppercase tracking-wider border ${STATUS_COLORS[bet.status] || STATUS_COLORS.draft}`}>
                    {bet.status}
                  </span>
                )}
                {bet.scoring?.overallScore != null && bet.scoring.overallScore > 0 && (
                  <span className="text-xs font-bold text-slate-600 font-[family-name:var(--font-code)]">
                    {bet.scoring.overallScore}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {allBets.length === 0 && theses.length === 0 && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
          <Target className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No strategic bets recorded</p>
        </div>
      )}
    </div>
  );
}
