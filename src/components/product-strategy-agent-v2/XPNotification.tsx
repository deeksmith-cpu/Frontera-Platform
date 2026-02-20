'use client';

import { useState, useEffect, useCallback } from 'react';
import type { XPAwardResult } from '@/hooks/useGamification';

// Note: This standalone component isn't currently used — notifications are
// inlined in ProductStrategyAgentInterface. Kept for potential reuse.

interface Notification {
  id: number;
  xpAwarded: number;
  levelUp: { newLevel: number } | null;
  newAchievements: string[];
}

const ACHIEVEMENT_LABELS: Record<string, string> = {
  first_insight: 'First Insight',
  territory_explorer: 'Territory Explorer',
  deep_thinker: 'Deep Thinker',
  synthesis_master: 'Synthesis Master',
};

export function XPNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Auto-dismiss after 3s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <>
      {/* Notification container - fixed top-right */}
      <div className="fixed top-16 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="animate-slide-in-right pointer-events-auto"
          >
            {/* XP awarded */}
            <div className="flex items-center gap-2 bg-[#1a1f3a] text-white rounded-xl px-4 py-2.5 shadow-lg border border-[#fbbf24]/30">
              <span className="text-[#fbbf24] font-bold text-sm">+{n.xpAwarded} XP</span>

              {/* Level up */}
              {n.levelUp && (
                <span className="text-xs bg-[#fbbf24] text-slate-900 font-bold px-2 py-0.5 rounded-full ml-1">
                  Level {n.levelUp.newLevel}!
                </span>
              )}

              {/* New achievements */}
              {n.newAchievements.map(id => (
                <span
                  key={id}
                  className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full"
                >
                  {ACHIEVEMENT_LABELS[id] || id}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Inline style for the slide-in animation */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

/** Imperative handle for showing notifications from parent */
export function useXPNotification() {
  const [showFn, setShowFn] = useState<((result: XPAwardResult) => void) | null>(null);

  const register = useCallback((fn: (result: XPAwardResult) => void) => {
    setShowFn(() => fn);
  }, []);

  const notify = useCallback((result: XPAwardResult) => {
    showFn?.(result);
  }, [showFn]);

  return { register, notify };
}
