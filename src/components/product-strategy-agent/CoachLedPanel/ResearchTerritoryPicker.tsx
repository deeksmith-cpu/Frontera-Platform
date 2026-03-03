'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Globe,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
} from 'lucide-react';

interface TerritoryProgress {
  mapped: number;
  total: number;
  areas: Array<{
    id: string;
    title: string;
    status: 'unexplored' | 'in_progress' | 'mapped';
  }>;
}

interface ResearchTerritoryPickerProps {
  conversationId: string;
  onSelectArea: (territory: string, areaId: string, areaTitle: string) => void;
}

const TERRITORIES = [
  {
    id: 'company',
    label: 'Company',
    icon: Building2,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
    progressColor: 'bg-indigo-400',
    areas: [
      { id: 'company_foundation', title: 'Company Foundation' },
      { id: 'strategic_position', title: 'Strategic Position' },
      { id: 'competitive_advantages', title: 'Competitive Advantages' },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    icon: Users,
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    hoverBorder: 'hover:border-amber-300',
    progressColor: 'bg-amber-400',
    areas: [
      { id: 'customer_segmentation', title: 'Segmentation & Behaviors' },
      { id: 'unmet_needs', title: 'Unmet Needs & Pain Points' },
      { id: 'market_dynamics', title: 'Market Dynamics' },
    ],
  },
  {
    id: 'competitor',
    label: 'Market Context',
    icon: Globe,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
    progressColor: 'bg-purple-400',
    areas: [
      { id: 'direct_competitors', title: 'Direct Competitors' },
      { id: 'substitute_threats', title: 'Substitute & Adjacent Threats' },
      { id: 'market_forces', title: 'Market Forces & Dynamics' },
    ],
  },
] as const;

export function ResearchTerritoryPicker({ conversationId, onSelectArea }: ResearchTerritoryPickerProps) {
  const [expandedTerritory, setExpandedTerritory] = useState<string | null>(null);
  const [areaStatuses, setAreaStatuses] = useState<Record<string, 'unexplored' | 'in_progress' | 'mapped'>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch territory progress
  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/territories?conversation_id=${conversationId}`
        );
        if (response.ok) {
          const insights = await response.json();
          const statuses: Record<string, string> = {};
          for (const insight of insights) {
            const key = `${insight.territory}:${insight.research_area}`;
            statuses[key] = insight.status || 'unexplored';
          }
          setAreaStatuses(statuses as Record<string, 'unexplored' | 'in_progress' | 'mapped'>);
        }
      } catch (error) {
        console.error('Error fetching territory progress:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, [conversationId]);

  const getAreaStatus = (territoryId: string, areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    return areaStatuses[`${territoryId}:${areaId}`] || 'unexplored';
  };

  const getMappedCount = (territoryId: string, areas: ReadonlyArray<{ id: string }>) => {
    return areas.filter(a => getAreaStatus(territoryId, a.id) === 'mapped').length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        <span className="ml-2 text-xs text-slate-400">Loading territories...</span>
      </div>
    );
  }

  return (
    <div className="research-territory-picker px-4 py-3 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        Select a Research Area
      </p>

      <div className="space-y-2">
        {TERRITORIES.map((territory) => {
          const Icon = territory.icon;
          const isExpanded = expandedTerritory === territory.id;
          const mappedCount = getMappedCount(territory.id, territory.areas);
          const isComplete = mappedCount === territory.areas.length;

          return (
            <div key={territory.id} className="rounded-xl overflow-hidden">
              {/* Territory header */}
              <button
                onClick={() => setExpandedTerritory(isExpanded ? null : territory.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                  isExpanded
                    ? `${territory.bgColor} ${territory.borderColor}`
                    : `bg-white border-slate-200 ${territory.hoverBorder} hover:bg-slate-50`
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${territory.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${territory.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-semibold text-slate-800">{territory.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                      {mappedCount}/{territory.areas.length}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded area list */}
              {isExpanded && (
                <div className="mt-1 ml-4 space-y-1 animate-card-group-entrance">
                  {territory.areas.map((area) => {
                    const status = getAreaStatus(territory.id, area.id);
                    const isMapped = status === 'mapped';
                    const isInProgress = status === 'in_progress';

                    return (
                      <button
                        key={area.id}
                        onClick={() => onSelectArea(territory.id, area.id, area.title)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                          isMapped
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : isInProgress
                              ? `${territory.bgColor} border ${territory.borderColor} text-slate-700`
                              : 'bg-white border border-slate-150 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {isMapped ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        ) : isInProgress ? (
                          <Circle className={`w-3.5 h-3.5 ${territory.iconColor} flex-shrink-0`} />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        )}
                        <span className="text-xs font-medium flex-1">{area.title}</span>
                        {!isMapped && (
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
