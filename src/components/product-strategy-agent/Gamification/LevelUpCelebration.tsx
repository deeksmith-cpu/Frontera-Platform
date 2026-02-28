'use client';

import { useState, useEffect } from 'react';
import { getLevelInfo } from '@/lib/gamification/levels';

interface LevelUpCelebrationProps {
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpCelebration({ newLevel, onDismiss }: LevelUpCelebrationProps) {
  const [visible, setVisible] = useState(true);
  const levelInfo = getLevelInfo(newLevel === 1 ? 0 : (newLevel - 1) * 200); // approximate for display
  const newLevelInfo = getLevelInfo(newLevel * 200);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop glow */}
      <div className="absolute inset-0 bg-[#1a1f3a]/40 backdrop-blur-sm" />

      {/* Celebration card */}
      <div
        className={`relative pointer-events-auto bg-gradient-to-br from-[#1a1f3a] to-[#2d3561] rounded-2xl p-8 shadow-2xl border border-[#fbbf24]/30 max-w-sm mx-4 text-center transition-transform duration-500 ${
          visible ? 'scale-100' : 'scale-95'
        }`}
        onClick={onDismiss}
      >
        {/* Decorative glow */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />

        {/* Level badge */}
        <div className="relative mx-auto w-16 h-16 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-lg mb-4">
          <span className="text-2xl font-bold text-slate-900">{newLevel}</span>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#fbbf24] animate-ping opacity-30" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-1">Level Up!</h2>
        <p className="text-[#fbbf24] font-semibold text-sm mb-3">
          {newLevelInfo.title}
        </p>

        {/* Description */}
        <p className="text-white/60 text-xs mb-4">
          Your strategic journey continues. Keep building insights to reach the next level.
        </p>

        {/* Dismiss hint */}
        <p className="text-white/30 text-[10px] uppercase tracking-wider">
          Tap to continue
        </p>
      </div>
    </div>
  );
}
