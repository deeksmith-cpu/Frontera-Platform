'use client';

import { useState, useEffect } from 'react';
import { X, Star, Sparkles, Flame, Trophy, Target, Map, Lightbulb, FileText } from 'lucide-react';
import type { Achievement, AchievementType } from '@/types/coaching-cards';

interface MicroRewardCardProps {
  achievement: Achievement;
  onDismiss?: (achievementId: string) => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const ACHIEVEMENT_ICONS: Record<AchievementType, React.ComponentType<{ className?: string }>> = {
  phase_started: Sparkles,
  territory_complete: Map,
  first_insight: Lightbulb,
  synthesis_ready: Star,
  bet_created: Target,
  streak_milestone: Flame,
  first_document: FileText,
};

const ACHIEVEMENT_COLORS: Record<AchievementType, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
}> = {
  phase_started: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  territory_complete: {
    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  first_insight: {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  synthesis_ready: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  bet_created: {
    bg: 'bg-gradient-to-br from-[#fbbf24]/10 to-[#fbbf24]/20',
    border: 'border-[#fbbf24]/30',
    iconBg: 'bg-[#fbbf24]/20',
    iconColor: 'text-[#b45309]',
  },
  streak_milestone: {
    bg: 'bg-gradient-to-br from-orange-50 to-red-50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  first_document: {
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100/50',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
};

/**
 * MicroRewardCard - Achievement celebration card
 *
 * Duolingo-style micro-reward with:
 * - Bounce entrance animation
 * - Achievement-specific icons and colors
 * - Optional auto-hide functionality
 * - Confetti-style celebration effect
 */
export function MicroRewardCard({
  achievement,
  onDismiss,
  autoHide = false,
  autoHideDelay = 5000,
}: MicroRewardCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  const Icon = ACHIEVEMENT_ICONS[achievement.type] || Trophy;
  const colors = ACHIEVEMENT_COLORS[achievement.type] || ACHIEVEMENT_COLORS.phase_started;

  useEffect(() => {
    // Start animation
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAnimating(true);
    const animTimer = setTimeout(() => setIsAnimating(false), 600);

    // Auto-hide if enabled
    let hideTimer: NodeJS.Timeout | undefined;
    if (autoHide) {
      hideTimer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.(achievement.id);
      }, autoHideDelay);
    }

    return () => {
      clearTimeout(animTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [achievement.id, autoHide, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.(achievement.id);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        micro-reward-card relative overflow-hidden
        rounded-xl border-2 ${colors.border} ${colors.bg}
        p-4
        ${isAnimating ? 'animate-bounce-in' : ''}
        transition-all duration-300
        hover:shadow-lg
      `}
    >
      {/* Celebration sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1 left-4 w-1.5 h-1.5 rounded-full bg-[#fbbf24] opacity-60 animate-ping" style={{ animationDelay: '0ms' }} />
        <div className="absolute top-3 right-8 w-1 h-1 rounded-full bg-[#fbbf24] opacity-40 animate-ping" style={{ animationDelay: '200ms' }} />
        <div className="absolute bottom-2 left-8 w-1 h-1 rounded-full bg-[#fbbf24] opacity-50 animate-ping" style={{ animationDelay: '400ms' }} />
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all duration-200"
        aria-label="Dismiss achievement"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-xl ${colors.iconBg}
            flex items-center justify-center
            shadow-sm
            ${isAnimating ? 'animate-pulse' : ''}
          `}
        >
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Star className="w-3 h-3 text-[#fbbf24]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#fbbf24]">
              Achievement Unlocked
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 leading-tight">
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Progress streak indicator (for streak achievements) */}
      {achievement.type === 'streak_milestone' && (
        <div className="mt-3 flex items-center gap-1.5">
          {[1, 2, 3].map((day) => (
            <div
              key={day}
              className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            </div>
          ))}
          <span className="text-xs font-medium text-orange-600 ml-1">
            Keep it up!
          </span>
        </div>
      )}
    </div>
  );
}
