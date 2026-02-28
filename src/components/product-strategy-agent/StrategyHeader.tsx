'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Columns2, LayoutPanelLeft, ChevronRight } from 'lucide-react';
import { XPBar } from './Gamification/XPBar';
import { AchievementBadge } from './Gamification/AchievementBadge';
import type { Database } from '@/types/database';
import type { LayoutMode } from './ContextPanel/useContextPanelState';
import type { GamificationState } from '@/hooks/useGamification';

type Conversation = Database['public']['Tables']['conversations']['Row'];

const PHASE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  research: 'Research',
  synthesis: 'Synthesis',
  bets: 'Strategic Bets',
  planning: 'Strategic Bets',
  activation: 'Activation',
  review: 'Review',
};

const PHASE_COLORS: Record<string, string> = {
  discovery: 'bg-emerald-500',
  research: 'bg-amber-500',
  synthesis: 'bg-purple-500',
  bets: 'bg-cyan-500',
  planning: 'bg-cyan-500',
  activation: 'bg-[#fbbf24]',
  review: 'bg-slate-400',
};

interface StrategyHeaderProps {
  conversation: Conversation | null;
  layoutMode: LayoutMode;
  onToggleLayout: () => void;
  onPhaseChange?: () => void;
  gamification?: GamificationState;
}

export function StrategyHeader({
  conversation,
  layoutMode,
  onToggleLayout,
  onPhaseChange,
  gamification,
}: StrategyHeaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const currentPhase = (conversation?.framework_state as { currentPhase?: string } | null)?.currentPhase || 'discovery';
  const phaseLabel = PHASE_LABELS[currentPhase] || 'Discovery';
  const phaseColor = PHASE_COLORS[currentPhase] || 'bg-emerald-500';

  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleGenerateInsights = async () => {
    if (!conversation) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/product-strategy-agent/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversation.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate synthesis');
      }
      if (onPhaseChange) {
        onPhaseChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate insights.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <header className="py-3 px-4 sm:py-4 sm:px-6 md:py-4 md:px-8 border-b-2 border-[#fbbf24]/30 bg-gradient-to-b from-[#1e2440] to-[#151930] flex justify-between items-center flex-shrink-0 animate-entrance-down">
      {/* Left: Logo + Title + Phase */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <Link href="/dashboard" className="transition-transform duration-300 hover:scale-105">
          <Image
            src="/frontera-logo-white.jpg"
            alt="Frontera"
            width={120}
            height={40}
            className="h-8 sm:h-10 w-auto"
          />
        </Link>

        <div className="hidden sm:flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-white">
            Strategy Coach
          </h2>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${phaseColor}`} />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {phaseLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Centre: Gamification (hidden on small screens) */}
      {gamification && !gamification.isLoading && (
        <div className="hidden md:flex items-center gap-4">
          <XPBar
            level={gamification.level}
            levelTitle={gamification.levelTitle}
            currentXP={gamification.xpTotal}
            nextLevelXP={gamification.xpForNextLevel}
            streakDays={gamification.streakDays}
          />
          <div className="hidden lg:block h-5 w-px bg-white/20" />
          <div className="hidden lg:block">
            <AchievementBadge achievements={gamification.achievements} maxVisible={5} />
          </div>
        </div>
      )}

      {/* Right: Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Layout Toggle */}
        <button
          onClick={onToggleLayout}
          className="hidden md:inline-flex items-center gap-1.5 text-xs py-2 px-3 bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 font-medium"
          aria-label={`Switch to ${layoutMode === 'modern' ? 'classic' : 'modern'} layout`}
          title={layoutMode === 'modern' ? 'Classic View (25/75)' : 'Modern View (60/40)'}
        >
          {layoutMode === 'modern' ? (
            <LayoutPanelLeft className="w-3.5 h-3.5" />
          ) : (
            <Columns2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden lg:inline">
            {layoutMode === 'modern' ? 'Classic' : 'Modern'}
          </span>
        </button>

        <button
          onClick={handleExport}
          className="text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4 bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-300 hover:bg-white/20 hover:border-white/40 font-semibold"
        >
          Export
        </button>

        <button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          className="text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4 bg-[#fbbf24] border-0 rounded-lg text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:shadow-lg hover:scale-105 active:animate-spring font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="hidden sm:inline">Generating...</span>
            </span>
          ) : (
            <span>
              <span className="sm:hidden">Insights</span>
              <span className="hidden sm:inline">Generate Insights</span>
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
