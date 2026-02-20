'use client';

import type { MessageClassification } from '@/lib/agents/strategy-coach/message-classifier';

interface MessageTypeBadgeProps {
  type: MessageClassification;
}

const BADGE_CONFIG: Record<MessageClassification, { label: string; bg: string; text: string; dot: string } | null> = {
  insight: {
    label: 'Insight',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  'research-question': {
    label: 'Research',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  challenge: {
    label: 'Challenge',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
  framework: {
    label: 'Framework',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  general: null, // No badge for general messages
};

export function MessageTypeBadge({ type }: MessageTypeBadgeProps) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${config.bg} ${config.text} px-1.5 py-0.5 rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
