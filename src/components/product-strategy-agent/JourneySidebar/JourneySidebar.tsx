'use client';

import Image from 'next/image';
import {
  Compass,
  Map,
  Lightbulb,
  Target,
  Rocket,
  RefreshCw,
  Building2,
  Users,
  Swords,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { XPBar } from '../Gamification/XPBar';
import { AchievementBadge } from '../Gamification/AchievementBadge';
import { getCoachAvatarPath, PERSONA_OPTIONS } from '@/lib/agents/strategy-coach/personas';
import type { GamificationState } from '@/hooks/useGamification';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

// Phase definitions matching research-questions.ts
const PHASES = [
  { id: 'discovery', label: 'Discovery', icon: Compass, color: 'emerald' },
  { id: 'research', label: 'Research', icon: Map, color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', icon: Lightbulb, color: 'purple' },
  { id: 'bets', label: 'Strategic Bets', icon: Target, color: 'cyan' },
  { id: 'activation', label: 'Activation', icon: Rocket, color: 'amber' },
  { id: 'review', label: 'Review', icon: RefreshCw, color: 'slate' },
] as const;

const PHASE_ORDER: string[] = PHASES.map((p) => p.id);

const TERRITORY_CONFIG = [
  { id: 'company' as const, label: 'Company', icon: Building2, color: 'indigo' },
  { id: 'customer' as const, label: 'Customer', icon: Users, color: 'cyan' },
  { id: 'competitor' as const, label: 'Market', icon: Swords, color: 'purple' },
];

interface JourneySidebarProps {
  conversation: Conversation | null;
  gamification: GamificationState;
  currentPhase: string;
  highestPhaseReached: string;
  researchProgress: ResearchProgressData | null;
  iconOnly?: boolean;
  onTerritoryClick: (territory: string, areaId?: string) => void;
  onPhaseClick?: (phase: string) => void;
  onMenuClick?: () => void;
  className?: string;
  coachName?: string;
  coachPersonaId?: string | null;
}

export function JourneySidebar({
  conversation,
  gamification,
  currentPhase,
  highestPhaseReached,
  researchProgress,
  iconOnly = false,
  onTerritoryClick,
  onPhaseClick,
  onMenuClick,
  className = '',
  coachName = 'Strategy Coach',
  coachPersonaId,
}: JourneySidebarProps) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  const highestIdx = PHASE_ORDER.indexOf(highestPhaseReached);

  // Icon-only mode (tablet)
  if (iconOnly) {
    return (
      <aside
        className={`w-12 flex-shrink-0 flex flex-col items-center py-3 gap-3 border-r border-white/10 ${className}`}
        style={{ background: 'linear-gradient(180deg, #1e2440 0%, #151930 100%)' }}
      >
        {/* Menu toggle */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* XP level badge */}
        {!gamification.isLoading && (
          <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-sm" title={`Level ${gamification.level}`}>
            <span className="text-[10px] font-bold text-slate-900">{gamification.level}</span>
          </div>
        )}

        {/* Phase dots */}
        <div className="flex flex-col gap-2 mt-2">
          {PHASES.map((phase) => {
            const phaseIdx = PHASE_ORDER.indexOf(phase.id);
            const isActive = phase.id === currentPhase;
            const isCompleted = phaseIdx < currentIdx || phaseIdx <= highestIdx;
            const Icon = phase.icon;

            return (
              <button
                key={phase.id}
                onClick={() => (isActive || isCompleted) && onPhaseClick?.(phase.id)}
                disabled={!isActive && !isCompleted}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : isCompleted
                    ? 'text-white/40 hover:text-white/70 hover:bg-white/10'
                    : 'text-white/15 cursor-not-allowed'
                }`}
                title={phase.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  // Full sidebar (desktop)
  return (
    <aside
      className={`w-[220px] flex-shrink-0 flex flex-col border-r border-white/10 overflow-hidden animate-entrance-left ${className}`}
      style={{
        background: 'linear-gradient(180deg, #1e2440 0%, #151930 100%)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 80Q60 40 100 80T180 80' fill='none' stroke='rgba(255,255,255,.04)' stroke-width='1'/%3E%3Cpath d='M10 120Q50 80 100 120T190 120' fill='none' stroke='rgba(255,255,255,.04)' stroke-width='1'/%3E%3Cpath d='M30 50Q70 20 110 50T190 50' fill='none' stroke='rgba(255,255,255,.04)' stroke-width='1'/%3E%3C/svg%3E"), linear-gradient(180deg, #1e2440 0%, #151930 100%)`,
        backgroundRepeat: 'repeat, no-repeat',
        backgroundSize: 'auto, 100% 100%',
      }}
    >
      {/* Brand logo */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fbbf24] flex items-center justify-center flex-shrink-0">
            <span className="text-[#1a1f3a] text-xs font-bold">F</span>
          </div>
          <span className="text-white text-sm font-semibold">Frontera</span>
        </div>
        {conversation && (
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed truncate">
            {(conversation.framework_state as Record<string, unknown> | null)?.companyName as string || 'Strategy Coach'}
          </p>
        )}
      </div>

      {/* XP Bar */}
      {!gamification.isLoading && (
        <div className="px-4 py-3 border-b border-white/10">
          <XPBar
            level={gamification.level}
            levelTitle={gamification.levelTitle}
            currentXP={gamification.xpTotal}
            nextLevelXP={gamification.xpForNextLevel}
            streakDays={gamification.streakDays}
          />
        </div>
      )}

      {/* Coach Persona */}
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
          {PERSONA_OPTIONS.find(p => p.id === coachPersonaId)?.title || 'Strategy Advisor'}
        </p>
        <div className="flex items-center gap-2.5">
          {(() => {
            const avatarPath = getCoachAvatarPath(coachPersonaId ?? undefined);
            return avatarPath ? (
              <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 hover:scale-110 shadow-md">
                <Image src={avatarPath} alt={coachName} width={44} height={44} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-[#2d3561] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 4h14l-2 16H7L5 4z" fill="#fbbf24" />
                </svg>
              </div>
            );
          })()}
          <div className="min-w-0">
            <p className="text-xs text-white font-semibold">{coachName}</p>
          </div>
        </div>
      </div>

      {/* Phase Journey */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 px-1 mb-2">
          Journey
        </p>
        <div className="space-y-0.5">
          {PHASES.map((phase, index) => {
            const phaseIdx = PHASE_ORDER.indexOf(phase.id);
            const isActive = phase.id === currentPhase;
            const isCompleted = phaseIdx < currentIdx || (phaseIdx <= highestIdx && !isActive);
            const isLocked = !isActive && !isCompleted && phaseIdx > highestIdx;
            const Icon = phase.icon;

            return (
              <div key={phase.id}>
                <button
                  onClick={() => !isLocked && onPhaseClick?.(phase.id)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : isCompleted
                      ? 'text-white/60 hover:bg-white/5 hover:text-white/80'
                      : 'text-white/20 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-white/15' : isCompleted ? 'bg-white/5' : ''
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-medium truncate">{phase.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse flex-shrink-0" />
                  )}
                </button>

                {/* Territory progress under Research phase */}
                {phase.id === 'research' && isActive && researchProgress && (
                  <div className="ml-5 mt-1 mb-1 space-y-1 border-l border-white/10 pl-3">
                    {TERRITORY_CONFIG.map((territory) => {
                      const tp = researchProgress.territories.find(
                        (t) => t.territory === territory.id
                      );
                      const answered = tp?.answeredQuestions ?? 0;
                      const total = tp?.totalQuestions ?? 9;
                      const TIcon = territory.icon;

                      return (
                        <button
                          key={territory.id}
                          onClick={() => onTerritoryClick(territory.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-300"
                        >
                          <TIcon className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[11px] font-medium flex-1 text-left truncate">
                            {territory.label}
                          </span>
                          {/* Progress dots */}
                          <div className="flex gap-0.5 flex-shrink-0">
                            {tp?.areas.map((area) => (
                              <span
                                key={area.id}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  area.status === 'mapped'
                                    ? 'bg-emerald-400'
                                    : area.status === 'in_progress'
                                    ? 'bg-amber-400'
                                    : 'bg-white/20'
                                }`}
                                title={`${area.title}: ${area.status}`}
                              />
                            )) ?? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* Overall progress */}
                    <div className="flex items-center gap-2 px-2 pt-1">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#fbbf24] rounded-full transition-all duration-500"
                          style={{ width: `${researchProgress.overallProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-white/30 font-[family-name:var(--font-code)]">
                        {researchProgress.overallProgress}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Connector line between phases */}
                {index < PHASES.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className={`w-px h-2 ${
                      isCompleted || isActive ? 'bg-white/15' : 'bg-white/5'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      {!gamification.isLoading && gamification.achievements.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
            Achievements
          </p>
          <AchievementBadge achievements={gamification.achievements} maxVisible={5} />
        </div>
      )}
    </aside>
  );
}
