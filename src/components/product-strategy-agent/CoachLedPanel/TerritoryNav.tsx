'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Building2, Users, Globe, ChevronDown, CheckCircle2 } from 'lucide-react';
import { TERRITORY_RESEARCH } from '@/lib/agents/strategy-coach/research-questions';

interface TerritoryNavProps {
  conversationId: string;
  onSelectArea: (territory: string, areaId: string, areaTitle: string) => void;
  currentArea: { territory: string; areaId: string } | null;
}

const TERRITORY_META: Record<string, {
  icon: typeof Building2;
  label: string;
  activeClasses: string;
  dotColor: string;
}> = {
  company: {
    icon: Building2,
    label: 'Company',
    activeClasses: 'bg-indigo-50 border-indigo-300 text-indigo-700',
    dotColor: 'bg-indigo-500',
  },
  customer: {
    icon: Users,
    label: 'Customer',
    activeClasses: 'bg-amber-50 border-amber-300 text-amber-700',
    dotColor: 'bg-amber-500',
  },
  competitor: {
    icon: Globe,
    label: 'Market',
    activeClasses: 'bg-purple-50 border-purple-300 text-purple-700',
    dotColor: 'bg-purple-500',
  },
};

export function TerritoryNav({ conversationId, onSelectArea, currentArea }: TerritoryNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [areaStatuses, setAreaStatuses] = useState<Record<string, 'unexplored' | 'in_progress' | 'mapped'>>({});
  const navRef = useRef<HTMLDivElement>(null);

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
      }
    }
    fetchProgress();
  }, [conversationId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  const getAreaStatus = useCallback((territoryId: string, areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    return areaStatuses[`${territoryId}:${areaId}`] || 'unexplored';
  }, [areaStatuses]);

  const totalMapped = TERRITORY_RESEARCH.reduce(
    (sum, t) => sum + t.areas.filter(a => getAreaStatus(t.territory, a.id) === 'mapped').length,
    0
  );

  const handleAreaClick = useCallback((territory: string, areaId: string, areaTitle: string) => {
    setOpenDropdown(null);
    onSelectArea(territory, areaId, areaTitle);
  }, [onSelectArea]);

  return (
    <div ref={navRef} className="flex-shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex items-center gap-1.5 px-3 py-1.5">
        {TERRITORY_RESEARCH.map((t) => {
          const meta = TERRITORY_META[t.territory];
          const Icon = meta.icon;
          const isOpen = openDropdown === t.territory;
          const isActive = currentArea?.territory === t.territory;
          const mappedCount = t.areas.filter(a => getAreaStatus(t.territory, a.id) === 'mapped').length;
          const isComplete = mappedCount === t.areas.length;

          return (
            <div key={t.territory} className="relative">
              <button
                onClick={() => setOpenDropdown(isOpen ? null : t.territory)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? meta.activeClasses
                    : isOpen
                      ? 'bg-slate-100 border-slate-300 text-slate-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.label}</span>
                {isComplete ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                ) : (
                  <span className="text-[9px] font-bold text-slate-400">{mappedCount}/3</span>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg border border-slate-200 shadow-lg z-50 py-1">
                  {t.areas.map((area) => {
                    const status = getAreaStatus(t.territory, area.id);
                    const isCurrent = currentArea?.territory === t.territory && currentArea?.areaId === area.id;

                    return (
                      <button
                        key={area.id}
                        onClick={() => handleAreaClick(t.territory, area.id, area.title)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 ${
                          isCurrent
                            ? 'bg-slate-50 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Status dot */}
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          status === 'mapped'
                            ? 'bg-emerald-500'
                            : status === 'in_progress'
                              ? 'bg-amber-400'
                              : 'bg-slate-300'
                        }`} />
                        <span className="text-xs text-slate-700 flex-1">{area.title}</span>
                        {status === 'mapped' && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Overall progress counter */}
        <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider font-code">
          {totalMapped}/9
        </span>
      </div>
    </div>
  );
}
