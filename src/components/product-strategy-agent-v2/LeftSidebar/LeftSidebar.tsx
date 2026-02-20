'use client';

import Link from 'next/link';
import { CoachProfile } from './CoachProfile';
import { TerritoryNav } from './TerritoryNav';
import { XPBar } from './XPBar';
import { AchievementBadges } from './AchievementBadges';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

const TERRITORY_LABELS: Record<string, string> = {
  company: 'Company Territory',
  customer: 'Customer Territory',
  competitor: 'Market Context',
};

interface GamificationData {
  level: number;
  xpTotal: number;
  xpForNextLevel: number;
  progressInLevel: number;
  achievements: string[];
}

interface LeftSidebarProps {
  currentPhase: string;
  personaId: PersonaId | null;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  activeTerritory: string | null;
  onTerritoryClick: (territory: 'company' | 'customer' | 'competitor') => void;
  isIconOnly?: boolean;
  gamification?: GamificationData;
}

export function LeftSidebar({
  currentPhase,
  personaId,
  territoryProgress,
  activeTerritory,
  onTerritoryClick,
  isIconOnly = false,
  gamification,
}: LeftSidebarProps) {
  const level = gamification?.level ?? 1;
  const xpTotal = gamification?.xpTotal ?? 0;
  const xpForNextLevel = gamification?.xpForNextLevel ?? 100;
  const earnedAchievements = gamification?.achievements ?? [];

  // Map achievement IDs to the shape expected by AchievementBadges
  const achievementBadges = [
    { id: 'first_insight', label: 'First Insight', earned: earnedAchievements.includes('first_insight') },
    { id: 'territory_explorer', label: 'Territory Explorer', earned: earnedAchievements.includes('territory_explorer') },
    { id: 'deep_thinker', label: 'Deep Thinker', earned: earnedAchievements.includes('deep_thinker') },
    { id: 'synthesis_master', label: 'Synthesis Master', earned: earnedAchievements.includes('synthesis_master') },
  ];

  if (isIconOnly) {
    return (
      <aside className="h-full bg-[#1a1f3a] flex flex-col flex-shrink-0 transition-all duration-300 w-[60px]">
        {/* Icon-only: compact layout */}
        <div className="flex-shrink-0 py-2">
          <XPBar level={level} currentXP={xpTotal} nextLevelXP={xpForNextLevel} isIconOnly />
        </div>
        <div className="mx-2 border-t border-white/10" />
        <div className="flex-shrink-0">
          <CoachProfile personaId={personaId} isIconOnly />
        </div>
        <div className="mx-2 border-t border-white/10" />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <TerritoryNav
            territoryProgress={territoryProgress}
            activeTerritory={activeTerritory}
            onTerritoryClick={onTerritoryClick}
            isIconOnly
          />
        </div>
        <div className="flex-shrink-0 border-t border-white/10">
          <AchievementBadges achievements={achievementBadges} isIconOnly />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full bg-[#1a1f3a] flex flex-col flex-shrink-0 transition-all duration-300 w-64">
      {/* Back to Landscape */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Landscape
        </Link>
      </div>

      {/* Active territory name */}
      <div className="flex-shrink-0 px-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-white truncate">
            {activeTerritory ? TERRITORY_LABELS[activeTerritory] || 'Territory' : 'Strategy Session'}
          </h2>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* XP Bar */}
      <XPBar level={level} currentXP={xpTotal} nextLevelXP={xpForNextLevel} isIconOnly={false} />

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Coach Profile */}
      <CoachProfile personaId={personaId} />

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Territory Navigation - scrollable area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <TerritoryNav
          territoryProgress={territoryProgress}
          activeTerritory={activeTerritory}
          onTerritoryClick={onTerritoryClick}
          isIconOnly={false}
        />
      </div>

      {/* Achievements - pinned to bottom */}
      <div className="flex-shrink-0 border-t border-white/10">
        <AchievementBadges achievements={achievementBadges} isIconOnly={false} />
      </div>
    </aside>
  );
}
