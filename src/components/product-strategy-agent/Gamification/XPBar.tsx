'use client';

interface XPBarProps {
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
}

export function XPBar({ level, levelTitle, currentXP, nextLevelXP, streakDays }: XPBarProps) {
  const percentage = nextLevelXP > 0 ? Math.min((currentXP / nextLevelXP) * 100, 100) : 100;

  return (
    <div className="flex items-center gap-3">
      {/* Level badge */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-slate-900">{level}</span>
        </div>
        <div className="hidden lg:block">
          <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">{levelTitle}</span>
        </div>
      </div>

      {/* XP progress bar */}
      <div className="hidden md:flex flex-col gap-0.5 min-w-[80px] lg:min-w-[120px]">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#fbbf24] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[9px] text-white/40 font-semibold font-[family-name:var(--font-code)]">{currentXP}/{nextLevelXP} XP</span>
      </div>

      {/* Streak indicator */}
      {streakDays > 0 && (
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-orange-400 font-semibold">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          {streakDays}d
        </div>
      )}
    </div>
  );
}
