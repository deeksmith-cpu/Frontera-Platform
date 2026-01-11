'use client';

import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface CustomerTerritoryDeepDiveProps {
  conversation: Conversation;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onUpdate: (insights: TerritoryInsight[]) => void;
}

export function CustomerTerritoryDeepDive({
  onBack,
}: CustomerTerritoryDeepDiveProps) {
  return (
    <div className="customer-territory-deep-dive max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-800 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Territories
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customer Territory</h1>
            <p className="text-sm text-slate-600">Customer & Market Context</p>
          </div>
        </div>

        <p className="text-lg text-slate-600 leading-relaxed mb-8">
          Explore your customer landscape to identify unmet needs and strategic opportunities.
        </p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="bg-white rounded-2xl border-2 border-cyan-200 p-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Customer Territory Research</h3>
        <p className="text-slate-600 mb-6">
          This section will include customer segmentation, behavioral analysis, and unmet needs research.
        </p>
        <p className="text-sm text-slate-500">
          Implementation continues in next iteration...
        </p>
      </div>
    </div>
  );
}
