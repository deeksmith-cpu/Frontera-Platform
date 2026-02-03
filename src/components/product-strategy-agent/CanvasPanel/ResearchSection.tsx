'use client';

import { useState, useEffect } from 'react';
import { TerritoryCard } from './TerritoryCard';
import { CompanyTerritoryDeepDive } from './CompanyTerritoryDeepDive';
import { CustomerTerritoryDeepDive } from './CustomerTerritoryDeepDive';
import { CompetitorTerritoryDeepDive } from './CompetitorTerritoryDeepDive';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface ResearchSectionProps {
  conversation: Conversation;
  onResearchContextChange?: (context: ActiveResearchContext | null) => void;
}

export function ResearchSection({ conversation, onResearchContextChange }: ResearchSectionProps) {
  const [territoryInsights, setTerritoryInsights] = useState<TerritoryInsight[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<'company' | 'customer' | 'competitor' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);

  // Fetch territory insights on mount
  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch(`/api/product-strategy-agent/territories?conversation_id=${conversation.id}`);
        if (response.ok) {
          const insights: TerritoryInsight[] = await response.json();
          setTerritoryInsights(insights);
        }
      } catch (error) {
        console.error('Error fetching territory insights:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInsights();
  }, [conversation.id]);

  // Clear context when returning to overview (no territory selected)
  useEffect(() => {
    if (!selectedTerritory) {
      setActiveResearchContext(null);
    }
  }, [selectedTerritory]);

  // Bubble context changes to parent
  useEffect(() => {
    onResearchContextChange?.(activeResearchContext);
  }, [activeResearchContext, onResearchContextChange]);

  // Calculate territory status based on research areas
  const getTerritoryStatus = (territory: 'company' | 'customer' | 'competitor'): 'unexplored' | 'in_progress' | 'mapped' => {
    const territoryAreas = territoryInsights.filter((t) => t.territory === territory);

    if (territoryAreas.length === 0) return 'unexplored';

    const mappedCount = territoryAreas.filter((t) => t.status === 'mapped').length;
    const expectedCount = territory === 'competitor' ? 3 : 3; // MVP: 3 areas per territory

    if (mappedCount === expectedCount) return 'mapped';
    if (mappedCount > 0 || territoryAreas.some((t) => t.status === 'in_progress')) return 'in_progress';

    return 'unexplored';
  };

  const handleTerritoryClick = (territory: 'company' | 'customer' | 'competitor') => {
    setSelectedTerritory(territory);
  };

  const handleBackToOverview = () => {
    setSelectedTerritory(null);
  };

  // Navigate to synthesis phase
  const handleProceedToSynthesis = async () => {
    setIsNavigating(true);
    try {
      const response = await fetch('/api/product-strategy-agent/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          phase: 'synthesis',
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to navigate to synthesis phase');
        setIsNavigating(false);
      }
    } catch (error) {
      console.error('Error navigating to synthesis:', error);
      setIsNavigating(false);
    }
  };

  // Check if all territories are fully mapped
  const mappedAreasCount = territoryInsights.filter((t) => t.status === 'mapped').length;
  const allTerritoriesMapped = mappedAreasCount >= 9;

  // Deep dive view
  if (selectedTerritory === 'company') {
    return (
      <CompanyTerritoryDeepDive
        conversation={conversation}
        territoryInsights={territoryInsights}
        onBack={handleBackToOverview}
        onUpdate={(insights) => setTerritoryInsights(insights)}
        onResearchContextChange={setActiveResearchContext}
      />
    );
  }

  if (selectedTerritory === 'customer') {
    return (
      <CustomerTerritoryDeepDive
        conversation={conversation}
        territoryInsights={territoryInsights}
        onBack={handleBackToOverview}
        onUpdate={(insights) => setTerritoryInsights(insights)}
        onResearchContextChange={setActiveResearchContext}
      />
    );
  }

  if (selectedTerritory === 'competitor') {
    return (
      <CompetitorTerritoryDeepDive
        conversation={conversation}
        territoryInsights={territoryInsights}
        onBack={handleBackToOverview}
        onUpdate={(insights) => setTerritoryInsights(insights)}
        onResearchContextChange={setActiveResearchContext}
      />
    );
  }

  // Territory overview
  return (
    <div className="research-section max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Landscape</h1>
        <p className="text-sm text-slate-600 uppercase tracking-wider font-semibold mb-4">Terrain Mapping</p>
        <p className="text-lg text-slate-600 leading-relaxed">
          Map your strategic terrain across three critical territories: Company, Customer, and Market Context.
          Each territory offers deep insights into your strategic context, and starts to identify key potential themes for your future strategy.
        </p>
      </div>

      {/* Territory Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-[#1a1f3a] font-semibold">
            <div className="w-5 h-5 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
            Loading territories...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Company Territory */}
          <TerritoryCard
            territory="company"
            title="Company Territory"
            description="Explore your organizational capabilities, resources, and product portfolio to understand internal strengths and constraints."
            status={getTerritoryStatus('company')}
            onClick={() => handleTerritoryClick('company')}
          />

          {/* Customer Territory */}
          <TerritoryCard
            territory="customer"
            title="Customer Territory"
            description="Investigate customer needs, behaviors, and market segments to identify unmet needs and opportunities."
            status={getTerritoryStatus('customer')}
            onClick={() => handleTerritoryClick('customer')}
          />

          {/* Market Context Territory */}
          <TerritoryCard
            territory="competitor"
            title="Market Context"
            description="Analyze competitive landscape, market forces, and emerging threats to inform strategic positioning."
            status={getTerritoryStatus('competitor')}
            onClick={() => handleTerritoryClick('competitor')}
          />
        </div>
      )}

      {/* Progress Indicator or Proceed to Synthesis CTA */}
      {allTerritoriesMapped ? (
        <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border-2 border-emerald-300 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">All Territories Mapped!</h3>
              <p className="text-sm text-slate-600">
                Your strategic terrain is fully explored. Proceed to synthesis to uncover strategic opportunities and insights.
              </p>
            </div>
            <button
              onClick={handleProceedToSynthesis}
              disabled={isNavigating}
              className="flex items-center gap-2 px-6 py-3 bg-[#fbbf24] text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              {isNavigating ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Synthesis</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-12 p-6 bg-[#f4f4f7] rounded-2xl border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-[#1a1f3a] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Research Progress</h3>
              <p className="text-sm text-slate-600">
                Complete all territories to unlock synthesis and strategic insights.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1a1f3a]">
                {mappedAreasCount}
                <span className="text-lg text-slate-400">/9</span>
              </div>
              <p className="text-xs text-slate-500">Areas Mapped</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
