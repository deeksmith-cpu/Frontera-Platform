'use client';

import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface SessionHeaderProps {
  conversation: Conversation;
}

export function SessionHeader({ conversation }: SessionHeaderProps) {
  // Extract phase from framework_state
  const frameworkState = conversation.framework_state as any;
  const currentPhase = frameworkState?.currentPhase || 'discovery';

  // Map phases to display labels
  const phaseLabels: Record<string, string> = {
    discovery: 'Discovery Phase',
    research: 'Research Phase',
    synthesis: 'Synthesis Phase',
    planning: 'Planning Phase',
  };

  return (
    <header className="coaching-header p-6 border-b border-slate-100 bg-white">
      <div className="session-meta text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
        Session · {phaseLabels[currentPhase]}
      </div>
      <h1 className="session-title text-2xl font-bold leading-tight text-slate-900 mb-3">
        {conversation.title || 'Strategic Context Analysis'}
      </h1>
      <div className="phase-indicator inline-flex items-center gap-2 text-xs text-cyan-600 py-1.5 px-3 bg-cyan-50 rounded-full tracking-wide font-semibold">
        <span className="phase-dot w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
        <span>3Cs Analysis</span>
      </div>
    </header>
  );
}
