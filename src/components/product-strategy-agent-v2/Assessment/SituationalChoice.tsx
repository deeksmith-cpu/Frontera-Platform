'use client';

interface SituationalOption {
  id: string;
  text: string;
}

interface SituationalChoiceProps {
  questionNumber: number;
  totalQuestions: number;
  scenario: string;
  options: SituationalOption[];
  selectedId: string | null;
  onChange: (optionId: string) => void;
  disabled?: boolean;
}

export function SituationalChoice({
  questionNumber,
  totalQuestions,
  scenario,
  options,
  selectedId,
  onChange,
  disabled,
}: SituationalChoiceProps) {
  return (
    <div className="space-y-5">
      {/* Scenario */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Scenario {questionNumber} of {totalQuestions}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Situational
          </span>
        </div>
        <p className="text-lg font-semibold text-slate-900 leading-relaxed">
          {scenario}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            disabled={disabled}
            className={`
              w-full text-left p-4 rounded-xl transition-all duration-300
              ${selectedId === option.id
                ? 'bg-[#1a1f3a] text-white shadow-lg border-2 border-[#fbbf24]'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                  ${selectedId === option.id
                    ? 'bg-[#fbbf24] text-slate-900'
                    : 'bg-slate-100 text-slate-500'
                  }
                `}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm font-medium leading-relaxed">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
