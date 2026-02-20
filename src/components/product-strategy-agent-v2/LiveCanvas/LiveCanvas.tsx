'use client';

import { ProgressRing } from '../ProgressRing';
import { SynthesisCanvasView } from './SynthesisCanvasView';
import { BetsCanvasView } from './BetsCanvasView';
import type { SynthesisResult } from '@/types/synthesis';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface LiveCanvasProps {
  currentPhase: string;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  activeTerritory: string | null;
  conversationId: string | null;
  synthesis?: SynthesisResult | null;
  bets?: {
    theses: Array<{
      id: string;
      title: string;
      description: string;
      ptwWinningAspiration: string;
      ptwWhereToPlay: string;
      ptwHowToWin: string;
      thesisType: 'offensive' | 'defensive' | 'capability';
      bets: Array<{
        id: string;
        bet: string;
        successMetric: string;
        status: string;
        scoring: { overallScore: number };
        priorityLevel: string;
        timeHorizon: string;
      }>;
    }>;
    portfolioSummary: {
      totalBets: number;
      totalTheses: number;
      byThesisType: { offensive: number; defensive: number; capability: number };
      avgScore: number;
    } | null;
  } | null;
  isLoading?: boolean;
}

const TERRITORY_CONFIG = [
  {
    id: 'company' as const,
    label: 'Company',
    color: '#818cf8',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    ringClass: 'ring-indigo-300/50',
    areas: ['Core Capabilities', 'Resource Reality', 'Product Portfolio'],
  },
  {
    id: 'customer' as const,
    label: 'Customer',
    color: '#22d3ee',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    ringClass: 'ring-cyan-300/50',
    areas: ['Segmentation', 'Unmet Needs', 'Market Dynamics'],
  },
  {
    id: 'competitor' as const,
    label: 'Market Context',
    color: '#c084fc',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    ringClass: 'ring-purple-300/50',
    areas: ['Direct Competitors', 'Substitute Threats', 'Market Forces'],
  },
] as const;

function TerritoryMapView({
  territoryProgress,
  activeTerritory,
}: {
  territoryProgress: LiveCanvasProps['territoryProgress'];
  activeTerritory: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Terrain</h3>
      </div>

      {TERRITORY_CONFIG.map((territory) => {
        const progress = territoryProgress[territory.id];
        const percentage = progress.total > 0 ? Math.round((progress.mapped / progress.total) * 100) : 0;
        const isActive = activeTerritory === territory.id;

        return (
          <div
            key={territory.id}
            className={`rounded-2xl border p-4 transition-all duration-300 ${
              isActive
                ? `${territory.bgColor} ${territory.borderColor} shadow-md ring-2 ${territory.ringClass}`
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-semibold ${isActive ? territory.textColor : 'text-slate-700'}`}>
                {territory.label}
              </h4>
              <ProgressRing
                percentage={percentage}
                size={28}
                strokeWidth={2.5}
                color={territory.color}
              />
            </div>

            <div className="space-y-1.5">
              {territory.areas.map((area, index) => {
                const isMapped = index < progress.mapped;
                return (
                  <div
                    key={area}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-500 ${
                      isMapped
                        ? `${territory.bgColor} ${territory.textColor} font-medium`
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isMapped ? 'bg-current' : 'bg-slate-300'
                    }`} />
                    <span className="truncate">{area}</span>
                    {isMapped && (
                      <svg className="w-3 h-3 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiscoveryView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discovery</h3>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Setting Context</p>
        <p className="text-xs text-slate-500">Upload materials and share your strategic context with the coach.</p>
      </div>
    </div>
  );
}

export function LiveCanvas({
  currentPhase,
  territoryProgress,
  activeTerritory,
  synthesis,
  bets,
  isLoading,
}: LiveCanvasProps) {
  return (
    <aside className="h-full bg-slate-50 border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategy Canvas</h2>
          {isLoading && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        {currentPhase === 'discovery' && <DiscoveryView />}

        {currentPhase === 'research' && (
          <TerritoryMapView
            territoryProgress={territoryProgress}
            activeTerritory={activeTerritory}
          />
        )}

        {currentPhase === 'synthesis' && (
          <SynthesisCanvasView
            opportunities={synthesis?.opportunities || []}
          />
        )}

        {(currentPhase === 'bets' || currentPhase === 'planning' || currentPhase === 'activation' || currentPhase === 'review') && (
          <BetsCanvasView
            theses={bets?.theses || []}
            portfolioSummary={bets?.portfolioSummary || null}
          />
        )}
      </div>
    </aside>
  );
}
