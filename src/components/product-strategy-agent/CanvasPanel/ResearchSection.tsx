'use client';

import { useState, useEffect } from 'react';
import { TerritoryCard } from './TerritoryCard';
import { CompanyTerritoryDeepDive } from './CompanyTerritoryDeepDive';
import { CustomerTerritoryDeepDive } from './CustomerTerritoryDeepDive';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface ResearchSectionProps {
  conversation: Conversation;
}

export function ResearchSection({ conversation }: ResearchSectionProps) {
  const [territoryInsights, setTerritoryInsights] = useState<TerritoryInsight[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<'company' | 'customer' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    if (territory === 'competitor') {
      // Competitor territory deferred in MVP
      return;
    }
    setSelectedTerritory(territory as 'company' | 'customer');
  };

  const handleBackToOverview = () => {
    setSelectedTerritory(null);
  };

  // Deep dive view
  if (selectedTerritory === 'company') {
    return (
      <CompanyTerritoryDeepDive
        conversation={conversation}
        territoryInsights={territoryInsights}
        onBack={handleBackToOverview}
        onUpdate={(insights) => setTerritoryInsights(insights)}
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
      />
    );
  }

  // Territory overview
  return (
    <div className="research-section max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">3Cs Research Phase</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Map your strategic terrain across three critical territories: Company, Customer, and Competitor.
          Each territory offers deep insights into your strategic context.
        </p>
      </div>

      {/* Territory Cards Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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

          {/* Competitor Territory - Deferred in MVP */}
          <div className="relative">
            <TerritoryCard
              territory="competitor"
              title="Competitor Territory"
              description="Analyze competitive landscape, positioning, and market dynamics to inform strategic differentiation."
              status="unexplored"
              onClick={() => handleTerritoryClick('competitor')}
            />
            {/* Enhanced Preview Overlay */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Coming Soon Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-300">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-purple-700">Coming in Full Release</span>
                  </div>
                </div>

                {/* Overview */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2">What You&apos;ll Unlock:</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Map the competitive battlefield to identify white space opportunities, understand positioning dynamics, and craft differentiation strategies that win.
                  </p>
                </div>

                {/* Research Areas Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">3 Research Areas:</h4>

                  {/* Area 1 */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">1</span>
                      <h5 className="text-xs font-bold text-slate-700">Competitive Landscape</h5>
                    </div>
                    <p className="text-xs text-slate-500 ml-7">Who are your direct and indirect competitors, and how are they positioned?</p>
                  </div>

                  {/* Area 2 */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">2</span>
                      <h5 className="text-xs font-bold text-slate-700">Competitive Dynamics</h5>
                    </div>
                    <p className="text-xs text-slate-500 ml-7">How do competitors compete, and what strategies are winning or failing?</p>
                  </div>

                  {/* Area 3 */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
                      <h5 className="text-xs font-bold text-slate-700">White Space & Opportunities</h5>
                    </div>
                    <p className="text-xs text-slate-500 ml-7">Where are the gaps in the market that you can exploit for differentiation?</p>
                  </div>
                </div>

                {/* Strategic Value */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div>
                      <h5 className="text-xs font-bold text-purple-800 mb-1">Why This Matters</h5>
                      <p className="text-xs text-purple-700">
                        Complete the 3Cs (Company + Customer + Competitor) to triangulate strategic insights and identify high-leverage opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500 italic">Available after MVP validation with early users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-200">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center">
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
            <div className="text-2xl font-bold text-indigo-600">
              {territoryInsights.filter((t) => t.status === 'mapped').length}
              <span className="text-lg text-slate-400">/6</span>
            </div>
            <p className="text-xs text-slate-500">Areas Mapped</p>
          </div>
        </div>
      </div>
    </div>
  );
}
