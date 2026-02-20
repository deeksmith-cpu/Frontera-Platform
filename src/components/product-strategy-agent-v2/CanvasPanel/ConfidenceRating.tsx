'use client';

type ConfidenceLevel = 'data' | 'experience' | 'guess';

interface ConfidenceRatingProps {
  value: ConfidenceLevel | null;
  onChange: (level: ConfidenceLevel) => void;
  disabled?: boolean;
}

const OPTIONS: { level: ConfidenceLevel; label: string; activeClass: string; hoverClass: string }[] = [
  {
    level: 'data',
    label: 'Based on Data',
    activeClass: 'bg-emerald-100 border-emerald-400 text-emerald-800',
    hoverClass: 'hover:bg-emerald-50 hover:border-emerald-300',
  },
  {
    level: 'experience',
    label: 'Based on Experience',
    activeClass: 'bg-amber-100 border-amber-400 text-amber-800',
    hoverClass: 'hover:bg-amber-50 hover:border-amber-300',
  },
  {
    level: 'guess',
    label: 'This is a Guess',
    activeClass: 'bg-slate-200 border-slate-400 text-slate-700',
    hoverClass: 'hover:bg-slate-100 hover:border-slate-300',
  },
];

export function ConfidenceRating({ value, onChange, disabled }: ConfidenceRatingProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Confidence:</span>
      <div className="flex gap-1.5">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.level;
          return (
            <button
              key={opt.level}
              type="button"
              onClick={() => onChange(opt.level)}
              disabled={disabled}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
                isActive
                  ? opt.activeClass
                  : `bg-white border-slate-200 text-slate-500 ${opt.hoverClass}`
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
