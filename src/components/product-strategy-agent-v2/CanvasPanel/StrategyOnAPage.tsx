'use client';

import { useState } from 'react';
import type { SynthesisResult } from '@/types/synthesis';

interface StrategyOnAPageProps {
  synthesis: SynthesisResult;
  conversationId: string;
}

export function StrategyOnAPage({ synthesis, conversationId }: StrategyOnAPageProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Aggregate PTW data across all opportunities
  const topOpportunities = synthesis.opportunities
    .sort((a, b) => (b.scoring?.overallScore || 0) - (a.scoring?.overallScore || 0))
    .slice(0, 5);

  // Collect winning aspirations (deduplicated)
  const aspirations = [...new Set(
    topOpportunities
      .map((o) => o.ptw?.winningAspiration)
      .filter(Boolean) as string[]
  )];

  // Collect where to play choices
  const whereToPlay = [...new Set(
    topOpportunities
      .map((o) => o.ptw?.whereToPlay)
      .filter(Boolean) as string[]
  )];

  // Collect how to win strategies
  const howToWin = [...new Set(
    topOpportunities
      .map((o) => o.ptw?.howToWin)
      .filter(Boolean) as string[]
  )];

  // Collect key capabilities
  const capabilities = [...new Set(
    topOpportunities
      .flatMap((o) => o.ptw?.capabilitiesRequired || [])
      .filter(Boolean)
  )];

  // Collect management systems
  const managementSystems = [...new Set(
    topOpportunities
      .flatMap((o) => o.ptw?.managementSystems || [])
      .filter(Boolean)
  )];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/product-strategy-agent-v2/strategy-page/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `strategy-on-a-page-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="strategy-on-a-page bg-white border-2 border-[#1a1f3a]/20 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1f3a] to-[#2d3561] px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Strategy on a Page</h2>
          <p className="text-xs text-white/60 uppercase tracking-wider">Playing to Win Framework</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#fbbf24] text-slate-900 text-sm font-semibold rounded-lg hover:bg-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </>
          )}
        </button>
      </div>

      {/* PTW Cascade */}
      <div className="p-6 space-y-4">
        {/* Winning Aspiration */}
        <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-[#b45309] uppercase tracking-wider mb-2">Winning Aspiration</h3>
          {aspirations.length > 0 ? (
            <ul className="space-y-1">
              {aspirations.map((a, i) => (
                <li key={i} className="text-sm text-slate-800 font-medium">{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">Generated from synthesis opportunities</p>
          )}
        </div>

        {/* Where to Play + How to Win (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Where to Play */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Where to Play</h3>
            {whereToPlay.length > 0 ? (
              <ul className="space-y-1.5">
                {whereToPlay.map((w, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No segments defined yet</p>
            )}
          </div>

          {/* How to Win */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">How to Win</h3>
            {howToWin.length > 0 ? (
              <ul className="space-y-1.5">
                {howToWin.map((h, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No strategies defined yet</p>
            )}
          </div>
        </div>

        {/* Key Capabilities */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-2">Key Capabilities Required</h3>
          {capabilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {capabilities.slice(0, 8).map((c, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 bg-white border border-cyan-200 rounded-full text-xs font-medium text-slate-700">
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No capabilities identified yet</p>
          )}
        </div>

        {/* Management Systems */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Management Systems</h3>
          {managementSystems.length > 0 ? (
            <ul className="space-y-1.5">
              {managementSystems.slice(0, 6).map((m, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No management systems defined yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
