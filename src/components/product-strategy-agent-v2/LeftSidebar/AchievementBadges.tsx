'use client';

interface Achievement {
  id: string;
  label: string;
  earned: boolean;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
  isIconOnly?: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_insight', label: 'First Insight', earned: false },
  { id: 'territory_explorer', label: 'Territory Explorer', earned: false },
  { id: 'deep_thinker', label: 'Deep Thinker', earned: false },
  { id: 'synthesis_master', label: 'Synthesis Master', earned: false },
];

// SVG icons for each achievement
function AchievementIcon({ id, className }: { id: string; className?: string }) {
  const cls = className || 'w-4 h-4';

  switch (id) {
    case 'first_insight':
      // Lightning bolt
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'territory_explorer':
      // Target / crosshair
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'deep_thinker':
      // Star
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'synthesis_master':
      // Trophy
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-4.5-9.5A6.5 6.5 0 0112 5a6.5 6.5 0 014.5 6.5M5 7a2 2 0 01-2-2V4h4m12 1a2 2 0 002-2V4h-4" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
  }
}

export function AchievementBadges({ achievements, isIconOnly = false }: AchievementBadgesProps) {
  const badges = achievements.length > 0 ? achievements : DEFAULT_ACHIEVEMENTS;

  if (isIconOnly) {
    return (
      <div className="flex flex-col items-center gap-1.5 py-2">
        {badges.slice(0, 4).map((badge) => (
          <div
            key={badge.id}
            className="relative"
            title={badge.label}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                badge.earned
                  ? 'bg-[#fbbf24]/20 text-[#fbbf24]'
                  : 'bg-white/5 text-white/20'
              }`}
            >
              <AchievementIcon id={badge.id} className="w-3.5 h-3.5" />
            </div>
            {badge.earned && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">Achievements</p>
      <div className="flex items-center gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="relative group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                badge.earned
                  ? 'bg-[#fbbf24]/20 text-[#fbbf24] hover:scale-110'
                  : 'bg-white/5 text-white/20'
              }`}
            >
              <AchievementIcon id={badge.id} className="w-5 h-5" />
            </div>
            {badge.earned && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1a1f3a]" />
            )}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-800 text-white text-[9px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              {badge.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
