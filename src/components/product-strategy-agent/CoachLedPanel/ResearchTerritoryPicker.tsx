'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  Globe,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Loader2,
  Map,
} from 'lucide-react';

interface ResearchTerritoryPickerProps {
  conversationId: string;
  onSelectArea: (territory: string, areaId: string, areaTitle: string) => void;
}

const TERRITORIES = [
  {
    id: 'company',
    label: 'Company',
    icon: Building2,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
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
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    hoverBorder: 'hover:border-amber-300',
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
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
    areas: [
      { id: 'direct_competitors', title: 'Direct Competitors' },
      { id: 'substitute_threats', title: 'Substitute & Adjacent Threats' },
      { id: 'market_forces', title: 'Market Forces & Dynamics' },
    ],
  },
] as const;

function findTerritoryAndArea(territoryId: string, areaId: string) {
  const territory = TERRITORIES.find(t => t.id === territoryId);
  const area = territory?.areas.find(a => a.id === areaId);
  return { territory, area };
}

export function ResearchTerritoryPicker({ conversationId, onSelectArea }: ResearchTerritoryPickerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedTerritory, setExpandedTerritory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<{ territory: string; areaId: string; areaTitle: string } | null>(null);
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

  const totalMapped = TERRITORIES.reduce((sum, t) => sum + getMappedCount(t.id, t.areas), 0);

  const handleSelectArea = useCallback((territory: string, areaId: string, areaTitle: string) => {
    setSelectedArea({ territory, areaId, areaTitle });
    setIsExpanded(false); // Auto-collapse after selection
    onSelectArea(territory, areaId, areaTitle);
  }, [onSelectArea]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3 border-b border-slate-100">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
        <span className="ml-2 text-xs text-slate-400">Loading territories...</span>
      </div>
    );
  }

  // ── Collapsed state: compact bar ──
  if (!isExpanded) {
    const sel = selectedArea ? findTerritoryAndArea(selectedArea.territory, selectedArea.areaId) : null;
    const SelIcon = sel?.territory?.icon || Map;

    return (
      <div className="flex-shrink-0 border-b border-slate-100">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-200"
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${sel?.territory?.bgColor || 'bg-slate-100'}`}>
            <SelIcon className={`w-3 h-3 ${sel?.territory?.iconColor || 'text-slate-500'}`} />
          </div>
          <div className="flex-1 text-left min-w-0">
            {selectedArea ? (
              <span className="text-xs font-semibold text-slate-700 truncate block">
                {sel?.territory?.label}: {selectedArea.areaTitle}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500">Select a research area</span>
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            {totalMapped}/9
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  // ── Expanded state: full picker ──
  return (
    <div className="flex-shrink-0 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
      {/* Header with collapse control */}
      <button
        onClick={() => setIsExpanded(false)}
        className="w-full flex items-center justify-between px-4 pt-3 pb-1"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Select a Research Area
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400">{totalMapped}/9 mapped</span>
          <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
        </div>
      </button>

      <div className="px-4 pb-3 space-y-1.5">
        {TERRITORIES.map((territory) => {
          const Icon = territory.icon;
          const isTerritoryExpanded = expandedTerritory === territory.id;
          const mappedCount = getMappedCount(territory.id, territory.areas);
          const isComplete = mappedCount === territory.areas.length;

          return (
            <div key={territory.id}>
              {/* Territory header — compact */}
              <button
                onClick={() => setExpandedTerritory(isTerritoryExpanded ? null : territory.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-200 ${
                  isTerritoryExpanded
                    ? `${territory.bgColor} ${territory.borderColor}`
                    : `bg-white border-slate-200 ${territory.hoverBorder} hover:bg-slate-50`
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${territory.bgColor}`}>
                  <Icon className={`w-3 h-3 ${territory.iconColor}`} />
                </div>
                <span className="text-xs font-semibold text-slate-800 flex-1 text-left">{territory.label}</span>
                <div className="flex items-center gap-1">
                  {isComplete ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">{mappedCount}/{territory.areas.length}</span>
                  )}
                  <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isTerritoryExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Area list */}
              {isTerritoryExpanded && (
                <div className="mt-1 ml-3 space-y-0.5">
                  {territory.areas.map((area) => {
                    const status = getAreaStatus(territory.id, area.id);
                    const isMapped = status === 'mapped';
                    const isInProgress = status === 'in_progress';
                    const isSelected = selectedArea?.territory === territory.id && selectedArea?.areaId === area.id;

                    return (
                      <button
                        key={area.id}
                        onClick={() => handleSelectArea(territory.id, area.id, area.title)}
                        className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-left transition-all duration-200 ${
                          isSelected
                            ? `${territory.bgColor} ${territory.borderColor} border font-semibold`
                            : isMapped
                              ? 'bg-emerald-50 text-emerald-700'
                              : isInProgress
                                ? `${territory.bgColor} text-slate-700`
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isMapped ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className={`w-3 h-3 ${isInProgress ? territory.iconColor : 'text-slate-300'} flex-shrink-0`} />
                        )}
                        <span className="text-[11px] flex-1">{area.title}</span>
                        {!isMapped && <ChevronRight className="w-2.5 h-2.5 text-slate-300" />}
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
