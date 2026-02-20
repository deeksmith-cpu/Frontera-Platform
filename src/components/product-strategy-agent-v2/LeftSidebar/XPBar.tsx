'use client';

interface XPBarProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  isIconOnly?: boolean;
}

export function XPBar({ level, currentXP, nextLevelXP, isIconOnly = false }: XPBarProps) {
  const percentage = nextLevelXP > 0 ? Math.min((currentXP / nextLevelXP) * 100, 100) : 0;

  if (isIconOnly) {
    return (
      <div className="flex flex-col items-center py-2 px-1">
        <div className="w-7 h-7 rounded-full bg-[#fbbf24] flex items-center justify-center">
          <span className="text-[10px] font-bold text-slate-900">{level}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#fbbf24] flex items-center justify-center">
            <span className="text-[9px] font-bold text-slate-900">{level}</span>
          </div>
          <span className="text-xs font-semibold text-white">Level {level}</span>
        </div>
        <span className="text-[10px] text-white/40 font-semibold">{currentXP}/{nextLevelXP} XP</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#fbbf24] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* XP hints */}
      <div className="flex items-center gap-3 mt-1.5">
        <span className="text-[9px] text-[#fbbf24]/50">+25 per answer</span>
        <span className="text-[9px] text-[#fbbf24]/50">+50 per challenge</span>
      </div>
    </div>
  );
}
