'use client';

import { useState } from 'react';
import type { StrategyDocumentContent, LegacyStrategyDocumentContent } from '@/types/bets';
import { isLegacyDocument } from '@/types/bets';
import { NarrativePage } from './StrategyDocument/NarrativePage';
import { AppendixPage } from './StrategyDocument/AppendixPage';

type PageKey = 'vision' | 'market' | 'choices' | 'roadmap' | 'operating' | 'execution' | 'appendix';

const PAGE_TABS: { key: PageKey; label: string; short: string }[] = [
  { key: 'vision', label: 'Vision & Context', short: '1' },
  { key: 'market', label: 'Market & Opportunities', short: '2' },
  { key: 'choices', label: 'Where & How to Win', short: '3' },
  { key: 'roadmap', label: 'Roadmap', short: '4' },
  { key: 'operating', label: 'Operating Model', short: '5' },
  { key: 'execution', label: 'Execution', short: '6' },
  { key: 'appendix', label: 'Appendix', short: 'A' },
];

interface StrategyDocumentPreviewProps {
  documentContent: StrategyDocumentContent | LegacyStrategyDocumentContent;
  documentId: string;
  conversationId: string;
  onExportPDF: () => void;
  onClose: () => void;
  isExporting: boolean;
}

export function StrategyDocumentPreview({
  documentContent,
  onExportPDF,
  onClose,
  isExporting,
}: StrategyDocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState<PageKey>('vision');

  // Legacy document fallback
  if (isLegacyDocument(documentContent)) {
    return (
      <LegacyPreview
        doc={documentContent}
        onExportPDF={onExportPDF}
        onClose={onClose}
        isExporting={isExporting}
      />
    );
  }

  const doc = documentContent as StrategyDocumentContent;

  // Compute word count for current page
  const getPageWordCount = (page: PageKey): number | null => {
    const textMap: Record<PageKey, string | undefined> = {
      vision: doc.productVision?.narrative,
      market: doc.marketInsights?.narrative,
      choices: doc.strategicChoices?.narrative,
      roadmap: doc.roadmap?.narrative,
      operating: doc.operatingModel?.narrative,
      execution: doc.executionPlan?.narrative,
      appendix: undefined,
    };
    const text = textMap[page];
    if (!text) return null;
    return text.split(/\s+/).filter(Boolean).length;
  };

  const currentWordCount = getPageWordCount(currentPage);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-[#1a1f3a]">Product Strategy 6-Pager</h2>
            <p className="text-sm text-slate-500 mt-0.5">Narrative strategy memo</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-slate-100 overflow-x-auto">
          {currentWordCount !== null && (
            <span className="text-xs text-slate-400 font-code mr-2 flex-shrink-0">
              {currentWordCount} words
            </span>
          )}
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCurrentPage(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                currentPage === tab.key
                  ? 'bg-[#1a1f3a] text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentPage === tab.key
                  ? 'bg-[#fbbf24] text-[#1a1f3a]'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.short}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div key={currentPage} className="flex-1 min-h-0 overflow-y-auto px-6 py-8 animate-entrance" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfeff 100%)' }}>
          {currentPage === 'vision' && (
            <NarrativePage
              title="Product Vision & Strategic Context"
              pageNumber={1}
              narrative={doc.productVision.narrative}
              secondaryTitle="State of the Business"
              secondaryNarrative={doc.productVision.stateOfBusiness}
            />
          )}
          {currentPage === 'market' && (
            <NarrativePage
              title="Market Trends, Customer Problems & Opportunities"
              pageNumber={2}
              narrative={doc.marketInsights.narrative}
            />
          )}
          {currentPage === 'choices' && (
            <NarrativePage
              title="Where We Play & How We Win"
              pageNumber={3}
              narrative={doc.strategicChoices.narrative}
            />
          )}
          {currentPage === 'roadmap' && (
            <NarrativePage
              title="Product Strategy & Roadmap Themes"
              pageNumber={4}
              narrative={doc.roadmap.narrative}
            />
          )}
          {currentPage === 'operating' && (
            <NarrativePage
              title="Operating Model & Capability Build"
              pageNumber={5}
              narrative={doc.operatingModel.narrative}
            />
          )}
          {currentPage === 'execution' && (
            <NarrativePage
              title="Strategic Priorities & Execution"
              pageNumber={6}
              narrative={doc.executionPlan.narrative}
            />
          )}
          {currentPage === 'appendix' && (
            <AppendixPage appendix={doc.appendix} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
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

// =============================================================================
// Legacy Preview (backward compatibility for old documents)
// =============================================================================

function LegacyPreview({
  doc,
  onExportPDF,
  onClose,
  isExporting,
}: {
  doc: LegacyStrategyDocumentContent;
  onExportPDF: () => void;
  onClose: () => void;
  isExporting: boolean;
}) {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Product Strategy Draft</h2>
            <p className="text-sm text-slate-600 mt-1">Legacy format — 6-page strategic document</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 p-4 border-b border-slate-200">
          {([1, 2, 3, 4, 5, 6] as const).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                currentPage === pageNum ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentPage === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Executive Summary</h3>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Company Overview</h4>
                <p className="text-slate-700 leading-relaxed">{doc.executiveSummary.companyOverview}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Strategic Intent</h4>
                <p className="text-slate-700 leading-relaxed">{doc.executiveSummary.strategicIntent}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Key Findings</h4>
                <ul className="space-y-2">
                  {doc.executiveSummary.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{finding}</span>
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
                <p className="text-slate-700 leading-relaxed">{doc.ptwCascade.winningAspiration}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Where to Play</h4>
                <ul className="space-y-2">
                  {doc.ptwCascade.whereToPlay.map((wtp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-600 mt-1">•</span>
                      <span className="text-slate-700">{wtp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {(currentPage === 3 || currentPage === 4) && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#1a1f3a]">Selected Strategic Bets</h3>
              {doc.selectedBets.map((bet, idx) => (
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
                <p className="text-slate-700 leading-relaxed">{doc.portfolioView.coherenceAnalysis}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Portfolio Balance</h4>
                <div className="flex gap-4">
                  <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#fbbf24]">{doc.portfolioView.balance.offensive}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Offensive</div>
                  </div>
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-600">{doc.portfolioView.balance.defensive}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">Defensive</div>
                  </div>
                  <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{doc.portfolioView.balance.capability}</div>
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
                <p className="text-slate-700 leading-relaxed">{doc.nextSteps.validationTimeline}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Governance Structure</h4>
                <p className="text-slate-700 leading-relaxed">{doc.nextSteps.governance}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Next Topics</h4>
                <ul className="space-y-2">
                  {doc.nextSteps.nextTopics.map((topic, idx) => (
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

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
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
              'Export PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
