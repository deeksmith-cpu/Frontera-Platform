'use client';

import { useState, useEffect } from 'react';

interface TerritoryEvidence {
  territory: string;
  areas: Array<{
    name: string;
    responses: Array<{
      question: string;
      answer: string;
      confidence?: 'data' | 'experience' | 'guess';
    }>;
  }>;
}

interface EvidenceSummaryCardProps {
  conversationId: string;
}

const CONFIDENCE_BADGE: Record<string, { label: string; color: string }> = {
  data: { label: 'Data', color: 'bg-emerald-100 text-emerald-700' },
  experience: { label: 'Experience', color: 'bg-amber-100 text-amber-700' },
  guess: { label: 'Guess', color: 'bg-slate-100 text-slate-500' },
};

const TERRITORY_COLORS: Record<string, { accent: string; bg: string }> = {
  company: { accent: 'text-indigo-600', bg: 'bg-indigo-50' },
  customer: { accent: 'text-cyan-600', bg: 'bg-cyan-50' },
  competitor: { accent: 'text-purple-600', bg: 'bg-purple-50' },
};

export function EvidenceSummaryCard({ conversationId }: EvidenceSummaryCardProps) {
  const [evidence, setEvidence] = useState<TerritoryEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTerritory, setExpandedTerritory] = useState<string | null>(null);

  useEffect(() => {
    loadEvidence();
  }, [conversationId]);

  async function loadEvidence() {
    try {
      const res = await fetch(`/api/product-strategy-agent-v2/territories?conversationId=${conversationId}`);
      if (!res.ok) return;
      const data = await res.json();
      const insights = data.insights || [];

      // Group by territory and structure evidence
      const grouped: Record<string, TerritoryEvidence> = {};

      for (const insight of insights) {
        const territory = insight.territory_type;
        if (!grouped[territory]) {
          grouped[territory] = { territory, areas: [] };
        }

        const responses = (insight.responses || []) as Array<{ question: string; answer: string }>;
        const confidence = (insight.confidence || {}) as Record<string, string>;

        const area = {
          name: insight.research_area || 'Unknown Area',
          responses: responses.map((r: { question: string; answer: string }, idx: number) => ({
            question: r.question,
            answer: r.answer,
            confidence: confidence[String(idx)] as 'data' | 'experience' | 'guess' | undefined,
          })).filter((r: { answer: string }) => r.answer && r.answer.trim().length > 0),
        };

        if (area.responses.length > 0) {
          grouped[territory].areas.push(area);
        }
      }

      setEvidence(Object.values(grouped));
    } catch (err) {
      console.error('Failed to load evidence:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
        <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-xs uppercase tracking-wide font-semibold">Loading evidence summary...</span>
      </div>
    );
  }

  if (evidence.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-500">No territory research completed yet.</p>
        <p className="text-xs text-slate-400 mt-1">Complete territory mapping to see your evidence base.</p>
      </div>
    );
  }

  const totalResponses = evidence.reduce(
    (sum, t) => sum + t.areas.reduce((aSum, a) => aSum + a.responses.length, 0),
    0
  );
  const dataBasedCount = evidence.reduce(
    (sum, t) => sum + t.areas.reduce((aSum, a) => aSum + a.responses.filter((r) => r.confidence === 'data').length, 0),
    0
  );
  const guessCount = evidence.reduce(
    (sum, t) => sum + t.areas.reduce((aSum, a) => aSum + a.responses.filter((r) => r.confidence === 'guess').length, 0),
    0
  );

  return (
    <div className="space-y-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Evidence Summary
      </span>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-cyan-200 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-[#1a1f3a]">{totalResponses}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Evidence Points</div>
        </div>
        <div className="bg-white border border-cyan-200 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-emerald-600">{dataBasedCount}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Data-Backed</div>
        </div>
        <div className="bg-white border border-cyan-200 rounded-xl p-3 text-center">
          <div className="text-lg font-bold text-slate-400">{guessCount}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Assumptions</div>
        </div>
      </div>

      {/* Territory breakdown */}
      {evidence.map((territory) => {
        const colors = TERRITORY_COLORS[territory.territory] || { accent: 'text-slate-600', bg: 'bg-slate-50' };
        const isExpanded = expandedTerritory === territory.territory;
        const territoryLabel = territory.territory.charAt(0).toUpperCase() + territory.territory.slice(1);

        return (
          <div key={territory.territory} className="bg-white border border-cyan-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedTerritory(isExpanded ? null : territory.territory)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <span className={`text-xs font-bold ${colors.accent}`}>
                    {territoryLabel.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-slate-900">{territoryLabel} Territory</h3>
                  <p className="text-[10px] text-slate-400">
                    {territory.areas.length} areas &bull;{' '}
                    {territory.areas.reduce((s, a) => s + a.responses.length, 0)} evidence points
                  </p>
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                {territory.areas.map((area, aIdx) => (
                  <div key={aIdx} className="mt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {area.name}
                    </span>
                    <div className="space-y-2 mt-2">
                      {area.responses.map((r, rIdx) => (
                        <div key={rIdx} className="bg-slate-50 rounded-xl p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs text-slate-500 italic">{r.question}</p>
                            {r.confidence && CONFIDENCE_BADGE[r.confidence] && (
                              <span className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${CONFIDENCE_BADGE[r.confidence].color}`}>
                                {CONFIDENCE_BADGE[r.confidence].label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700 mt-1 leading-relaxed">{r.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
