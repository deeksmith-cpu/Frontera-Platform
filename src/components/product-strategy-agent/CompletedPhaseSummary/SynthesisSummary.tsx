'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Zap, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  score?: number;
  category?: string;
}

interface Tension {
  id: string;
  title: string;
  description: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority?: string;
}

interface SynthesisData {
  id: string;
  executiveSummary?: string;
  opportunities: Opportunity[];
  tensions: Tension[];
  recommendations: Recommendation[];
  metadata?: { confidenceLevel?: string };
}

interface SynthesisSummaryProps {
  conversationId: string;
  onDrillIn: () => void;
}

export function SynthesisSummary({ conversationId, onDrillIn }: SynthesisSummaryProps) {
  const [synthesis, setSynthesis] = useState<SynthesisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="h-32 bg-slate-50 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!synthesis) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-6 animate-entrance">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
          <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No synthesis data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5 animate-entrance">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Synthesis Summary
        </h3>
        <button
          onClick={onDrillIn}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
        >
          View Full Synthesis
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opportunities</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {synthesis.opportunities.length}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tensions</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {synthesis.tensions.length}
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recommendations</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {synthesis.recommendations.length}
          </p>
        </div>
      </div>

      {/* Executive summary */}
      {synthesis.executiveSummary && (
        <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-2">
            Executive Summary
          </p>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
            {synthesis.executiveSummary}
          </p>
        </div>
      )}

      {/* Top opportunities */}
      {synthesis.opportunities.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Top Opportunities
          </p>
          <div className="space-y-2.5">
            {synthesis.opportunities.slice(0, 4).map((opp, i) => (
              <div key={opp.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-purple-50/40 border border-purple-100/60">
                <span className="text-xs font-bold text-purple-600 bg-purple-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{opp.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{opp.description}</p>
                </div>
                {opp.score != null && (
                  <span className="text-xs font-bold text-purple-700 bg-purple-100 rounded-lg px-2 py-1 flex-shrink-0 font-[family-name:var(--font-code)]">
                    {opp.score}
                  </span>
                )}
              </div>
            ))}
            {synthesis.opportunities.length > 4 && (
              <p className="text-[10px] text-slate-400 text-center pt-1">
                +{synthesis.opportunities.length - 4} more opportunities
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key tensions */}
      {synthesis.tensions.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Strategic Tensions
          </p>
          <div className="space-y-2">
            {synthesis.tensions.slice(0, 3).map(tension => (
              <div key={tension.id} className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-100/60">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{tension.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tension.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
