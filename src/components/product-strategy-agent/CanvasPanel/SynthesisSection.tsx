'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Database } from '@/types/database';
import type { SynthesisResult, EvidenceLink, StrategicTension as SynthesisTensionType } from '@/types/synthesis';
import { StrategicOpportunityMap } from './StrategicOpportunityMap';
import { OpportunityCard } from './OpportunityCard';
import { TensionCard } from './TensionCard';
import { RecommendationsPanel } from './RecommendationsPanel';
import { DebateCard } from './DebateCard';
import { DebateHistory } from './DebateHistory';
import { matchTensionToSynthesis } from '@/lib/knowledge/tension-map';
import type { StrategicTension as ExpertTension, DebateDecision } from '@/lib/knowledge/tension-map';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface SynthesisSectionProps {
  conversation: Conversation;
}

/**
 * SynthesisSection
 *
 * Main component for the Synthesis phase displaying:
 * 1. Research progress overview
 * 2. Strategic Opportunity Map (2x2 matrix)
 * 3. Opportunity cards with evidence trails
 * 4. Strategic tensions and recommendations
 *
 * Based on Playing to Win (PTW) framework by Roger Martin & A.G. Lafley.
 */
export function SynthesisSection({ conversation }: SynthesisSectionProps) {
  // State for territory insights (research data)
  const [territoryInsights, setTerritoryInsights] = useState<TerritoryInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  // State for synthesis results
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState(true);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // State for generating synthesis
  const [isGenerating, setIsGenerating] = useState(false);

  // State for exporting PDF
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Offline state
  const [isOffline, setIsOffline] = useState(false);

  // State for UI interactions
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);

  // Debate Mode state
  const [activeDebate, setActiveDebate] = useState<{ synthesisTension: SynthesisTensionType; expertTension: ExpertTension } | null>(null);
  const [debateDecisions, setDebateDecisions] = useState<DebateDecision[]>([]);
  const debateCardRef = useRef<HTMLDivElement>(null);

  // Fetch territory insights on mount
  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/territories?conversation_id=${conversation.id}`
        );
        if (response.ok) {
          const insights: TerritoryInsight[] = await response.json();
          setTerritoryInsights(insights);
        }
      } catch (error) {
        console.error('Error fetching territory insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    }

    fetchInsights();
  }, [conversation.id]);

  // Fetch existing synthesis on mount
  useEffect(() => {
    async function fetchSynthesis() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/synthesis?conversation_id=${conversation.id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.synthesis) {
            setSynthesis(data.synthesis);
            // Cache for offline access
            try {
              localStorage.setItem(`synthesis_${conversation.id}`, JSON.stringify(data.synthesis));
            } catch { /* quota exceeded */ }
          }
        }
      } catch (error) {
        console.error('Error fetching synthesis:', error);
        // Offline fallback: try localStorage
        try {
          const cached = localStorage.getItem(`synthesis_${conversation.id}`);
          if (cached) {
            setSynthesis(JSON.parse(cached));
            setIsOffline(true);
          }
        } catch { /* parse error */ }
      } finally {
        setIsLoadingSynthesis(false);
      }
    }

    fetchSynthesis();
  }, [conversation.id]);

  // Fetch debate decisions
  useEffect(() => {
    async function fetchDebateDecisions() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/debate-decisions?conversation_id=${conversation.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setDebateDecisions(data.decisions || []);
        }
      } catch (error) {
        console.error('Error fetching debate decisions:', error);
      }
    }
    fetchDebateDecisions();
  }, [conversation.id]);

  // Auto-scroll to debate card when it appears
  useEffect(() => {
    if (activeDebate && debateCardRef.current) {
      debateCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeDebate]);

  // Enter debate mode for a tension
  const handleEnterDebate = useCallback((tensionDescription: string) => {
    console.log('[DebateMode] handleEnterDebate called with:', tensionDescription);
    if (!synthesis) {
      console.log('[DebateMode] No synthesis available, aborting');
      return;
    }
    const synthTension = synthesis.tensions.find(t => t.description === tensionDescription);
    console.log('[DebateMode] Found synthesis tension:', !!synthTension);
    if (!synthTension) return;

    const matched = matchTensionToSynthesis(tensionDescription);
    console.log('[DebateMode] Matched expert tension:', matched?.id, matched?.title);
    if (matched) {
      setActiveDebate({ synthesisTension: synthTension, expertTension: matched });
    }
  }, [synthesis]);

  // Save debate decision
  const handleDebateDecision = useCallback(async (decision: DebateDecision) => {
    try {
      const response = await fetch('/api/product-strategy-agent/debate-decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversation.id, decision }),
      });
      if (response.ok) {
        const data = await response.json();
        setDebateDecisions(data.decisions || []);
        setActiveDebate(null);
      }
    } catch (error) {
      console.error('Error saving debate decision:', error);
    }
  }, [conversation.id]);

  // Generate synthesis
  const handleGenerateSynthesis = useCallback(async () => {
    setIsGenerating(true);
    setSynthesisError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversation.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to generate synthesis';
        setSynthesisError(errorMsg);
        return;
      }

      if (data.success && data.synthesis) {
        console.log('Generated synthesis data:', data);
        console.log('Generated opportunities:', data.synthesis.opportunities);
        setSynthesis(data.synthesis);
      }
    } catch (error) {
      console.error('Error generating synthesis:', error);
      setSynthesisError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [conversation.id]);

  // Handle opportunity click from map
  const handleOpportunityClick = useCallback((opportunityId: string) => {
    setSelectedOpportunityId(opportunityId);
    setExpandedOpportunityId(opportunityId);

    // Scroll to the opportunity card
    const element = document.getElementById(`opportunity-${opportunityId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Handle evidence navigation
  const handleEvidenceClick = useCallback((evidence: EvidenceLink) => {
    // TODO: Navigate to source research area
    console.log('Navigate to evidence:', evidence);
  }, []);

  // Handle PDF export
  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch(
        `/api/product-strategy-agent/synthesis/export?conversation_id=${conversation.id}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.details || data.error || 'Export failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Strategic-Synthesis-${new Date().toISOString().split('T')[0]}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [conversation.id]);

  // Calculate research progress
  const totalMapped = territoryInsights.filter((i) => i.status === 'mapped').length;
  const totalAreas = 9; // 3 per territory (company, customer, competitor)
  const overallProgress = Math.round((totalMapped / totalAreas) * 100);
  const canGenerateSynthesis = totalMapped >= 4;

  // Loading state
  const isLoading = isLoadingInsights || isLoadingSynthesis;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading synthesis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="synthesis-section space-y-6">
      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Viewing cached data — you&apos;re offline
        </div>
      )}

      {/* Section Header with Purpose & Context */}
      <div className="bg-gradient-to-br from-purple-50 to-cyan-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Strategic Synthesis</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              This is where your research transforms into strategic clarity. The AI synthesizes insights from all three territories
              (Company, Customer, Competitor) to identify strategic opportunities using the <strong>Playing to Win</strong> framework.
            </p>

            {/* Purpose Box */}
            <div className="bg-white/70 border border-purple-100 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider mb-2">Purpose</h3>
              <p className="text-sm text-slate-700">
                Generate a prioritised portfolio of strategic opportunities, each with a clear &quot;Where to Play&quot; and &quot;How to Win&quot;
                hypothesis, scored by market attractiveness and your capability fit.
              </p>
            </div>

            {/* What to Do Box */}
            <div className="bg-white/70 border border-cyan-100 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-cyan-700 uppercase tracking-wider mb-2">What To Do</h3>
              <ol className="text-sm text-slate-700 space-y-1.5 list-decimal list-inside">
                <li>Review your research completion status below — aim for at least 4 areas mapped</li>
                <li>Click <strong>&quot;Generate Strategic Insights&quot;</strong> to run the AI synthesis</li>
                <li>Explore the Strategic Opportunity Map to see how opportunities compare</li>
                <li>Review each opportunity card, its evidence trails, and strategic tensions</li>
                <li>When satisfied, proceed to <strong>Strategic Bets</strong> to turn insights into testable hypotheses</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Research Progress Bar */}
      <div className="bg-[#f4f4f7] rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Research Completion</span>
            {canGenerateSynthesis && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Ready for synthesis
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-slate-900">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a1f3a] transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>{totalMapped} of {totalAreas} research areas completed</span>
          <span>Minimum 4 required for synthesis</span>
        </div>
      </div>

      {/* No Synthesis Yet - Generate CTA */}
      {!synthesis && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
          {canGenerateSynthesis ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f4f4f7] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a1f3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Generate Strategic Synthesis</h3>
              <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
                Your research is ready for analysis. Generate AI-powered strategic opportunities
                using the Playing to Win framework.
              </p>
              {synthesisError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {synthesisError}
                </div>
              )}
              <button
                onClick={handleGenerateSynthesis}
                disabled={isGenerating}
                className="px-6 py-3 bg-[#fbbf24] text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Insights...
                  </span>
                ) : (
                  'Generate Strategic Insights'
                )}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">More Research Needed</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Complete at least 4 research areas across your territories to unlock strategic synthesis.
                You have {totalMapped} of 4 required areas completed.
              </p>
            </>
          )}
        </div>
      )}

      {/* Synthesis Results */}
      {synthesis && (
        <>
          {/* Executive Summary */}
          {synthesis.executiveSummary && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Executive Summary
              </h3>
              <p className="text-slate-700 leading-relaxed">{synthesis.executiveSummary}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span>Model: {synthesis.metadata.modelUsed}</span>
                <span>•</span>
                <span>Territories: {synthesis.metadata.territoriesIncluded.join(', ')}</span>
                <span>•</span>
                <span>Areas analyzed: {synthesis.metadata.researchAreasCount}</span>
              </div>
            </div>
          )}

          {/* Strategic Opportunity Map */}
          <StrategicOpportunityMap
            opportunities={synthesis.opportunities}
            onOpportunityClick={handleOpportunityClick}
            selectedOpportunityId={selectedOpportunityId || undefined}
          />

          {/* Opportunity Cards */}
          {synthesis.opportunities.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Strategic Hypotheses ({synthesis.opportunities.length})
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Each hypothesis pairs a Where to Play choice with a How to Win advantage
                </p>
              </div>
              <div className="space-y-4">
                {synthesis.opportunities.map((opportunity) => (
                  <div key={opportunity.id} id={`opportunity-${opportunity.id}`}>
                    <OpportunityCard
                      opportunity={opportunity}
                      isExpanded={expandedOpportunityId === opportunity.id}
                      onToggleExpand={() =>
                        setExpandedOpportunityId(
                          expandedOpportunityId === opportunity.id ? null : opportunity.id
                        )
                      }
                      onEvidenceClick={handleEvidenceClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Debate */}
          {activeDebate && (
            <div ref={debateCardRef}>
              <DebateCard
                synthesyisTension={activeDebate.synthesisTension}
                expertTension={activeDebate.expertTension}
                onDecision={handleDebateDecision}
                existingDecision={debateDecisions.find(d => d.tensionId === activeDebate.expertTension.id)}
              />
            </div>
          )}

          {/* Strategic Tensions */}
          {synthesis.tensions && synthesis.tensions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Strategic Tensions ({synthesis.tensions.length})
              </h3>
              <div className="space-y-3">
                {synthesis.tensions.map((tension) => (
                  <TensionCard key={tension.id} tension={tension} onEnterDebate={handleEnterDebate} />
                ))}
              </div>
            </div>
          )}

          {/* Debate History */}
          {debateDecisions.length > 0 && (
            <DebateHistory decisions={debateDecisions} />
          )}

          {/* Priority Recommendations */}
          {synthesis.recommendations && synthesis.recommendations.length > 0 && (
            <RecommendationsPanel recommendations={synthesis.recommendations} />
          )}

          {/* Action Buttons */}
          <div className="space-y-6 pt-6">
            {/* Proceed to Strategic Bets CTA */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-slate-900">Strategic Synthesis Complete</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4 max-w-md mx-auto">
                Your strategic opportunities are mapped and ready. Now translate these insights into testable strategic bets with clear hypotheses and success criteria.
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/product-strategy-agent/phase', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        conversation_id: conversation.id,
                        phase: 'bets',
                      }),
                    });
                    if (response.ok) {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error('Failed to navigate to Strategic Bets:', error);
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Proceed to Strategic Bets</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center justify-center gap-4">
              {/* Export PDF Button */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#fbbf24] text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export PDF</span>
                  </>
                )}
              </button>

              {/* Regenerate Button */}
              <button
                onClick={handleGenerateSynthesis}
                disabled={isGenerating}
                className="text-sm text-slate-500 hover:text-[#1a1f3a] font-medium transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate Synthesis'}
              </button>
            </div>
          </div>

          {/* Export Error */}
          {exportError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
              {exportError}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SynthesisSection;
