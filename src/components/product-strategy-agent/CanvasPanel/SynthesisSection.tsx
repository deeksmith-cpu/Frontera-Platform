'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Database } from '@/types/database';
import type { SynthesisResult, EvidenceLink } from '@/types/synthesis';
import { StrategicOpportunityMap } from './StrategicOpportunityMap';
import { OpportunityCard } from './OpportunityCard';
import { TensionCard } from './TensionCard';
import { RecommendationsPanel } from './RecommendationsPanel';

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

  // State for UI interactions
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [expandedOpportunityId, setExpandedOpportunityId] = useState<string | null>(null);

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
          }
        }
      } catch (error) {
        console.error('Error fetching synthesis:', error);
      } finally {
        setIsLoadingSynthesis(false);
      }
    }

    fetchSynthesis();
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
        setSynthesisError(data.error || 'Failed to generate synthesis');
        return;
      }

      if (data.success && data.synthesis) {
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
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading synthesis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="synthesis-section space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Strategic Synthesis</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          AI-powered analysis of your research using the Playing to Win framework.
          Opportunities are mapped by market attractiveness and capability fit.
        </p>
      </div>

      {/* Research Progress Bar */}
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-100 p-4">
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
            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all duration-500"
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              <h3 className="text-lg font-bold text-slate-900">
                Strategic Opportunities ({synthesis.opportunities.length})
              </h3>
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

          {/* Strategic Tensions */}
          {synthesis.tensions && synthesis.tensions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Strategic Tensions ({synthesis.tensions.length})
              </h3>
              <div className="space-y-3">
                {synthesis.tensions.map((tension) => (
                  <TensionCard key={tension.id} tension={tension} />
                ))}
              </div>
            </div>
          )}

          {/* Priority Recommendations */}
          {synthesis.recommendations && synthesis.recommendations.length > 0 && (
            <RecommendationsPanel recommendations={synthesis.recommendations} />
          )}

          {/* Regenerate Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleGenerateSynthesis}
              disabled={isGenerating}
              className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Regenerating...' : 'Regenerate Synthesis'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SynthesisSection;
