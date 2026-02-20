'use client';

import Image from 'next/image';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface StrategyHeaderProps {
  conversation: Conversation;
  currentPhase: string;
  onExport?: () => void;
  onSettings?: () => void;
}

const PHASE_DOTS: { phase: string; label: string; color: string }[] = [
  { phase: 'discovery', label: 'Discovery', color: 'bg-emerald-500' },
  { phase: 'research', label: 'Research', color: 'bg-amber-500' },
  { phase: 'synthesis', label: 'Synthesis', color: 'bg-purple-500' },
  { phase: 'bets', label: 'Bets', color: 'bg-cyan-500' },
];

export function StrategyHeader({ conversation, currentPhase, onExport, onSettings }: StrategyHeaderProps) {
  const currentIndex = PHASE_DOTS.findIndex((p) => p.phase === currentPhase);
  const title = (conversation.title as string) || 'Strategy Session';

  return (
    <header className="strategy-header flex items-center justify-between px-4 md:px-6 py-2.5 bg-[#1a1f3a] text-white">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <Image src="/frontera-logo-F.jpg" alt="Frontera" width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[300px]">{title}</h1>
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Strategy Coach</p>
        </div>
      </div>

      {/* Centre: Phase Indicator (compact pills) */}
      <div className="hidden md:flex items-center gap-1.5">
        {PHASE_DOTS.map((dot, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;
          return (
            <div key={dot.phase} className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all ${
                isActive ? 'bg-white/20' : isComplete ? 'bg-white/10' : 'bg-white/5'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isActive ? `${dot.color} animate-pulse` : isComplete ? dot.color : 'bg-white/20'
                }`} />
                <span className={`text-[10px] font-semibold ${
                  isActive ? 'text-white' : isComplete ? 'text-white/70' : 'text-white/30'
                }`}>
                  {dot.label}
                </span>
              </div>
              {index < PHASE_DOTS.length - 1 && (
                <div className={`w-3 h-px ${index < currentIndex ? 'bg-white/30' : 'bg-white/10'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Export"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
        {onSettings && (
          <button
            onClick={onSettings}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
