'use client';

import { useState, useEffect, useCallback } from 'react';
import type { XPAwardResult } from '@/hooks/useGamification';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';

interface Notification {
  id: number;
  xpAwarded: number;
  levelUp: { newLevel: number } | null;
  newAchievements: string[];
}

function getAchievementLabel(id: string): string {
  const def = ACHIEVEMENTS.find(a => a.id === id);
  return def?.label || id;
}

let notificationId = 0;

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
      <div className="fixed top-16 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto animate-[slideInRight_0.3s_ease-out_forwards]"
          >
            <div className="flex items-center gap-2 bg-[#1a1f3a] text-white rounded-xl px-4 py-2.5 shadow-lg border border-[#fbbf24]/30">
              <span className="text-[#fbbf24] font-bold text-sm">+{n.xpAwarded} XP</span>

              {n.levelUp && (
                <span className="text-xs bg-[#fbbf24] text-slate-900 font-bold px-2 py-0.5 rounded-full ml-1">
                  Level {n.levelUp.newLevel}!
                </span>
              )}

              {n.newAchievements.map(id => (
                <span
                  key={id}
                  className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full"
                >
                  {getAchievementLabel(id)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Keyframe animation */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

/** Hook that returns a function to show XP notifications */
export function useXPNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((result: XPAwardResult) => {
    if (result.xpAwarded <= 0) return;
    const id = ++notificationId;
    setNotifications(prev => [...prev, {
      id,
      xpAwarded: result.xpAwarded,
      levelUp: result.levelUp,
      newAchievements: result.newAchievements,
    }]);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const NotificationRenderer = useCallback(() => (
    <div className="fixed top-16 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto"
          style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
        >
          <div className="flex items-center gap-2 bg-[#1a1f3a] text-white rounded-xl px-4 py-2.5 shadow-lg border border-[#fbbf24]/30">
            <span className="text-[#fbbf24] font-bold text-sm">+{n.xpAwarded} XP</span>
            {n.levelUp && (
              <span className="text-xs bg-[#fbbf24] text-slate-900 font-bold px-2 py-0.5 rounded-full ml-1">
                Level {n.levelUp.newLevel}!
              </span>
            )}
            {n.newAchievements.map(id => (
              <span
                key={id}
                className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full"
              >
                {getAchievementLabel(id)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  ), [notifications]);

  return { showNotification, NotificationRenderer };
}
