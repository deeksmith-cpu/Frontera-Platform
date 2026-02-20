'use client';

import { useState } from 'react';

interface StrategyDocumentPreviewProps {
  documentContent: {
    executiveSummary: {
      companyOverview: string;
      strategicIntent: string;
      keyFindings: string[];
      topOpportunities: string[];
      recommendedBets: string;
    };
    ptwCascade: {
      winningAspiration: string;
      whereToPlay: string[];
      howToWin: string[];
      capabilities: string[];
      managementSystems: string[];
    };
    selectedBets: Array<{
      thesisTitle: string;
      hypothesis: {
        job: string;
        belief: string;
        bet: string;
        success: string;
        kill: { criteria: string; date: string };
      };
    }>;
    portfolioView: {
      coherenceAnalysis: string;
      balance: { offensive: number; defensive: number; capability: number };
      dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
    };
    nextSteps: {
      validationTimeline: string;
      governance: string;
      trackingPlan: string;
      killCriteriaReview: string;
      nextTopics: string[];
    };
  };
  documentId: string;
  conversationId: string;
  onExportPDF: () => void;
  onClose: () => void;
  isExporting: boolean;
}

export function StrategyDocumentPreview({
  documentContent,
  documentId,
  conversationId,
  onExportPDF,
  onClose,
  isExporting,
}: StrategyDocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Product Strategy Draft</h2>
            <p className="text-sm text-slate-600 mt-1">6-page strategic document ready for export</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-center gap-2 p-4 border-b border-slate-200">
          {([1, 2, 3, 4, 5, 6] as const).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                currentPage === pageNum
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Executive Summary</h3>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Company Overview</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.executiveSummary.companyOverview}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Strategic Intent</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.executiveSummary.strategicIntent}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Key Findings</h4>
                <ul className="space-y-2">
                  {documentContent.executiveSummary.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Top Opportunities</h4>
                <ul className="space-y-2">
                  {documentContent.executiveSummary.topOpportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Playing to Win Cascade</h3>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Winning Aspiration</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.ptwCascade.winningAspiration}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Where to Play</h4>
                <ul className="space-y-2">
                  {documentContent.ptwCascade.whereToPlay.map((wtp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{wtp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">How to Win</h4>
                <ul className="space-y-2">
                  {documentContent.ptwCascade.howToWin.map((htw, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{htw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {(currentPage === 3 || currentPage === 4) && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Selected Strategic Bets</h3>
              {documentContent.selectedBets.map((bet, idx) => (
                <div key={idx} className="border border-cyan-200 rounded-xl p-4 bg-cyan-50">
                  <h4 className="text-sm font-bold text-[#1a1f3a] mb-3">{bet.thesisTitle}</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div><span className="font-semibold">Job:</span> {bet.hypothesis.job}</div>
                    <div><span className="font-semibold">Belief:</span> {bet.hypothesis.belief}</div>
                    <div><span className="font-semibold">Bet:</span> {bet.hypothesis.bet}</div>
                    <div><span className="font-semibold">Success:</span> {bet.hypothesis.success}</div>
                    <div><span className="font-semibold">Kill:</span> {bet.hypothesis.kill.criteria} by {bet.hypothesis.kill.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentPage === 5 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Portfolio View</h3>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Strategic Coherence</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.portfolioView.coherenceAnalysis}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Portfolio Balance</h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#fbbf24]">{documentContent.portfolioView.balance.offensive}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Offensive</div>
                  </div>
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-600">{documentContent.portfolioView.balance.defensive}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Defensive</div>
                  </div>
                  <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{documentContent.portfolioView.balance.capability}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Capability</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 6 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Next Steps & Governance</h3>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Validation Timeline</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.nextSteps.validationTimeline}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Governance Structure</h4>
                <p className="text-slate-700 leading-relaxed">{documentContent.nextSteps.governance}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Next Topics</h4>
                <ul className="space-y-2">
                  {documentContent.nextSteps.nextTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Exporting PDF...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
