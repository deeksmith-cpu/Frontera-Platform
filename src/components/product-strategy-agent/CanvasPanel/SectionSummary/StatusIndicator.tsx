'use client';

import type { Phase } from '@/types/coaching-cards';

interface StatusIndicatorProps {
  phase: Phase;
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

const PHASE_COLORS: Record<Phase, { stroke: string; bg: string }> = {
  discovery: { stroke: '#10b981', bg: '#d1fae5' }, // emerald
  research: { stroke: '#f59e0b', bg: '#fef3c7' }, // amber
  synthesis: { stroke: '#a855f7', bg: '#f3e8ff' }, // purple
  bets: { stroke: '#06b6d4', bg: '#cffafe' }, // cyan
};

const SIZE_CONFIG = {
  sm: { size: 32, strokeWidth: 3, fontSize: 'text-[8px]' },
  md: { size: 44, strokeWidth: 4, fontSize: 'text-xs' },
  lg: { size: 56, strokeWidth: 5, fontSize: 'text-sm' },
};

/**
 * StatusIndicator - Circular progress ring showing phase completion
 *
 * Animated SVG progress ring with:
 * - Phase-specific colors
 * - Percentage display in center
 * - Smooth animation on progress change
 */
export function StatusIndicator({ phase, progress, size = 'md' }: StatusIndicatorProps) {
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.discovery;
  const config = SIZE_CONFIG[size];

  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const center = config.size / 2;

  return (
    <div className="status-indicator relative" style={{ width: config.size, height: config.size }}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={config.strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-slate-700 ${config.fontSize}`}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
