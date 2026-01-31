'use client';

/**
 * TerritoryDeepDiveSidebar Component
 *
 * Persistent sidebar navigation (25% width) for territory research areas.
 * Replaces full-screen modal approach with side-by-side layout.
 *
 * Features:
 * - 25% fixed width sidebar with bold styling
 * - Research area navigation with progress indicators
 * - Prominent back button
 * - Sticky positioning
 * - Phase-specific colored accents
 */

import { ArrowRightIcon, CheckIcon } from '@/components/icons/TerritoryIcons';

interface ResearchArea {
  id: string;
  title: string;
  status: 'unexplored' | 'in_progress' | 'mapped';
}

interface TerritoryDeepDiveSidebarProps {
  territory: 'company' | 'customer' | 'competitor';
  territoryTitle: string;
  researchAreas: ResearchArea[];
  activeAreaId: string | null;
  onSelectArea: (areaId: string) => void;
  onBack: () => void;
}

export function TerritoryDeepDiveSidebar({
  territory,
  territoryTitle,
  researchAreas,
  activeAreaId,
  onSelectArea,
  onBack,
}: TerritoryDeepDiveSidebarProps) {
  // Territory-specific colors using Frontera brand palette
  const territoryColors = {
    company: {
      bg: 'from-[#1a1f3a] to-[#2d3561]',
      border: 'border-[#1a1f3a]/30',
      text: 'text-[#1a1f3a]',
      badge: 'bg-[#1a1f3a]/10 text-[#1a1f3a]',
      active: 'bg-[#1a1f3a]/5 border-[#1a1f3a]/30',
    },
    customer: {
      bg: 'from-[#fbbf24] to-[#f59e0b]',
      border: 'border-[#fbbf24]/40',
      text: 'text-[#b45309]',
      badge: 'bg-[#fbbf24]/10 text-[#b45309]',
      active: 'bg-[#fbbf24]/10 border-[#fbbf24]/40',
    },
    competitor: {
      bg: 'from-[#0891b2] to-[#0e7490]',
      border: 'border-cyan-300',
      text: 'text-[#0891b2]',
      badge: 'bg-cyan-50 text-[#0891b2]',
      active: 'bg-cyan-50 border-cyan-300',
    },
  };

  const colors = territoryColors[territory];

  // Calculate progress
  const totalAreas = researchAreas.length;
  const mappedCount = researchAreas.filter((a) => a.status === 'mapped').length;
  const progressPercent = totalAreas > 0 ? (mappedCount / totalAreas) * 100 : 0;

  return (
    <div className="territory-sidebar flex flex-col h-full bg-white border-r-2 border-slate-200 w-1/4">
      {/* Header */}
      <div className={`p-6 bg-gradient-to-br ${colors.bg} text-white`}>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold text-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Overview
        </button>

        {/* Territory Title */}
        <h2 className="text-2xl font-bold mb-2">{territoryTitle}</h2>
        <p className="text-sm text-white/90">Deep Dive Research</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xs font-bold">
              {mappedCount}/{totalAreas}
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Research Areas Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 px-2">
          Research Areas
        </h3>
        <div className="space-y-2">
          {researchAreas.map((area, index) => {
            const isActive = area.id === activeAreaId;
            const isMapped = area.status === 'mapped';
            const isInProgress = area.status === 'in_progress';

            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                  isActive
                    ? `${colors.active} ${colors.border} shadow-md`
                    : isMapped
                    ? 'bg-green-50 border-green-200 hover:border-green-300'
                    : isInProgress
                    ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Area Number and Title */}
                <div className="flex items-start gap-3">
                  {/* Number Badge */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isMapped
                        ? 'bg-green-500 text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isMapped ? <CheckIcon size={16} /> : index + 1}
                  </div>

                  {/* Title and Status */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-900 mb-1">{area.title}</div>
                    <div
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        isMapped
                          ? 'text-green-700'
                          : isInProgress
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {isMapped ? 'Mapped' : isInProgress ? 'In Progress' : 'Unexplored'}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <ArrowRightIcon className={colors.text} size={16} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-600 mb-2">
          Complete all {totalAreas} research areas to unlock synthesis insights
        </p>
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-2 rounded-full bg-slate-200 overflow-hidden`}>
            <div
              className={`h-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700">{Math.round(progressPercent)}%</span>
        </div>
      </div>
    </div>
  );
}
