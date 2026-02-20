'use client';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showCheck?: boolean;
}

export function ProgressRing({
  percentage,
  size = 40,
  strokeWidth = 3,
  color = '#fbbf24',
  trackColor,
  label,
  showCheck = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isComplete = percentage >= 100;

  return (
    <div className="inline-flex flex-col items-center gap-0.5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor || '#e2e8f0'}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Centre check icon for complete rings */}
        {showCheck && isComplete && (
          <svg
            className="absolute inset-0 m-auto"
            width={size * 0.4}
            height={size * 0.4}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && (
        <span className="text-[10px] font-semibold text-slate-500">{label}</span>
      )}
    </div>
  );
}
