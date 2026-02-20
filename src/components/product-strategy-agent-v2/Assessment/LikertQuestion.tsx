'use client';

interface LikertQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SCALE_LABELS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export function LikertQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  value,
  onChange,
  disabled,
}: LikertQuestionProps) {
  return (
    <div className="space-y-5">
      {/* Question number and text */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <p className="text-lg font-semibold text-slate-900 leading-relaxed">
          {questionText}
        </p>
      </div>

      {/* Scale buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {SCALE_LABELS.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            disabled={disabled}
            className={`
              flex-1 py-3 px-4 rounded-lg text-sm font-semibold
              transition-all duration-300
              ${value === item.value
                ? 'bg-[#1a1f3a] text-white shadow-lg scale-105'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="block text-base font-bold">{item.value}</span>
            <span className="block text-[10px] mt-0.5 opacity-80">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
