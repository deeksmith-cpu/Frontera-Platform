'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';

interface SynthesisOpportunity {
  title: string;
  description: string;
  scoring?: {
    marketAttractiveness?: number;
    capabilityFit?: number;
    competitiveAdvantage?: number;
  };
}

interface SynthesisTension {
  description: string;
  impact?: string;
}

interface SynthesisData {
  id: string;
  executiveSummary: string;
  opportunities: SynthesisOpportunity[];
  tensions: SynthesisTension[];
  recommendations: string[];
  metadata?: {
    confidenceLevel?: string;
  };
}

interface SynthesisPreviewProps {
  conversationId: string | null;
}

export function SynthesisPreview({ conversationId }: SynthesisPreviewProps) {
  const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSynthesis() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/synthesis?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.synthesis) {
          setSynthesis(data.synthesis);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSynthesis();
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

  if (!synthesis) {
    return (
      <div className="text-center py-8">
        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No synthesis generated yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Complete territory research to generate your strategic synthesis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Executive Summary */}
      {synthesis.executiveSummary && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Executive Summary
          </span>
          <p className="text-sm text-slate-700 mt-2 leading-relaxed line-clamp-4">
            {synthesis.executiveSummary}
          </p>
        </div>
      )}

      {/* Opportunities */}
      {synthesis.opportunities.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Lightbulb className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Opportunities ({synthesis.opportunities.length})
            </span>
          </div>
          {synthesis.opportunities.map((opp, i) => {
            const avgScore = opp.scoring
              ? Math.round(
                  ((opp.scoring.marketAttractiveness || 0) +
                    (opp.scoring.capabilityFit || 0) +
                    (opp.scoring.competitiveAdvantage || 0)) /
                    3
                )
              : null;

            return (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {opp.title}
                  </h4>
                  {avgScore !== null && (
                    <span className="text-[10px] font-code font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      {avgScore}/10
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {opp.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tensions */}
      {synthesis.tensions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Tensions ({synthesis.tensions.length})
            </span>
          </div>
          {synthesis.tensions.map((tension, i) => (
            <div
              key={i}
              className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm"
            >
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                {tension.description}
              </p>
              {tension.impact && (
                <span className={`text-[10px] font-semibold uppercase tracking-wider mt-2 inline-block px-2 py-0.5 rounded-full ${
                  tension.impact === 'blocking'
                    ? 'bg-red-50 text-red-600'
                    : tension.impact === 'significant'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {tension.impact}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
