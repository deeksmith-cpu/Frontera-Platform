'use client';

import { X, Sparkles } from 'lucide-react';
import type { ProactiveTrigger } from '@/hooks/useProactiveCoach';

interface ProactiveCoachMessageProps {
  trigger: ProactiveTrigger | null;
  onDismiss: (id: string) => void;
}

export function ProactiveCoachMessage({ trigger, onDismiss }: ProactiveCoachMessageProps) {
  if (!trigger) return null;

  return (
    <div className="mx-4 my-2 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#1a1f3a] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700">{trigger.message}</p>
          {trigger.action && (
            <button
              onClick={trigger.action.onClick}
              className="mt-2 text-xs font-semibold text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
            >
              {trigger.action.label} →
            </button>
          )}
        </div>
        <button
          onClick={() => onDismiss(trigger.id)}
          className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
