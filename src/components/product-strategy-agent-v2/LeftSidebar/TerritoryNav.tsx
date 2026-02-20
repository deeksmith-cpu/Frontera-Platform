'use client';

import { ProgressRing } from '../ProgressRing';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface TerritoryNavProps {
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  activeTerritory: string | null;
  onTerritoryClick: (territory: 'company' | 'customer' | 'competitor') => void;
  isIconOnly?: boolean;
}

const TERRITORIES = [
  {
    id: 'company' as const,
    label: 'Company Territory',
    color: '#818cf8', // indigo-400
    areas: ['Core Capabilities', 'Resource Reality', 'Product Portfolio'],
  },
  {
    id: 'customer' as const,
    label: 'Customer Territory',
    color: '#22d3ee', // cyan-400
    areas: ['Segmentation', 'Unmet Needs', 'Market Dynamics'],
  },
  {
    id: 'competitor' as const,
    label: 'Market Context',
    color: '#c084fc', // purple-400
    areas: ['Direct Competitors', 'Substitute Threats', 'Market Forces'],
  },
] as const;

const DARK_TRACK = 'rgba(255,255,255,0.12)';

export function TerritoryNav({
  territoryProgress,
  activeTerritory,
  onTerritoryClick,
  isIconOnly = false,
}: TerritoryNavProps) {
  const getProgress = (id: 'company' | 'customer' | 'competitor') => {
    const p = territoryProgress[id];
    return p.total > 0 ? Math.round((p.mapped / p.total) * 100) : 0;
  };

  if (isIconOnly) {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        {TERRITORIES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTerritoryClick(t.id)}
            className={`p-1 rounded-lg transition-all duration-300 ${
              activeTerritory === t.id ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
            title={t.label}
          >
            <ProgressRing
              percentage={getProgress(t.id)}
              size={28}
              strokeWidth={2.5}
              color={t.color}
              trackColor={DARK_TRACK}
              showCheck
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-3">Territories</p>
      <div className="space-y-1">
        {TERRITORIES.map((t) => {
          const progress = territoryProgress[t.id];
          const isActive = activeTerritory === t.id;
          const percentage = getProgress(t.id);

          return (
            <div key={t.id}>
              <button
                onClick={() => onTerritoryClick(t.id)}
                className={`w-full text-left rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {/* Collapsed: summary ring + label */}
                <div className={`flex items-center gap-2.5 px-3 ${isActive ? 'pt-2.5 pb-1' : 'py-2.5'}`}>
                  <ProgressRing
                    percentage={percentage}
                    size={isActive ? 28 : 32}
                    strokeWidth={2.5}
                    color={t.color}
                    trackColor={DARK_TRACK}
                    showCheck
                  />
                  <div className="min-w-0 flex-1">
                    <span className={`text-xs font-semibold transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {t.label}
                    </span>
                    {!isActive && (
                      <p className="text-[10px] text-white/30">{progress.mapped}/{progress.total} areas</p>
                    )}
                  </div>
                </div>

                {/* Expanded: individual research area rings (active only) */}
                {isActive && (
                  <div className="px-3 pb-2.5 space-y-1.5">
                    {t.areas.map((area, index) => {
                      const isMapped = index < progress.mapped;
                      const areaPercentage = isMapped ? 100 : 0;

                      return (
                        <div
                          key={area}
                          className="flex items-center gap-2.5 py-1"
                        >
                          <ProgressRing
                            percentage={areaPercentage}
                            size={24}
                            strokeWidth={2}
                            color={t.color}
                            trackColor={DARK_TRACK}
                            showCheck
                          />
                          <span className={`text-[11px] flex-1 truncate transition-colors duration-300 ${
                            isMapped ? 'text-white/90 font-medium' : 'text-white/40'
                          }`}>
                            {area}
                          </span>
                          {isMapped ? (
                            <span className="text-[9px] font-semibold text-emerald-400">Done</span>
                          ) : (
                            <span className="text-[9px] font-semibold text-[#fbbf24]/60">+100 XP</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
