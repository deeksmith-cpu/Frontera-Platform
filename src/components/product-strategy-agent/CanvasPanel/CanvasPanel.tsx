'use client';

import { useCallback, useState } from 'react';
import { CanvasHeader } from './CanvasHeader';
import { HorizontalProgressStepper } from './HorizontalProgressStepper';
import { DiscoverySection } from './DiscoverySection';
import { ResearchSection } from './ResearchSection';
import { SynthesisSection } from './SynthesisSection';
import { CaseLibrary } from './CaseLibrary';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface CanvasPanelProps {
  conversation: Conversation | null | undefined;
  clientContext?: Client | null;
}

export function CanvasPanel({ conversation, clientContext }: CanvasPanelProps) {
  // Extract current phase and highest phase reached from framework_state (must be before any early returns for hooks)
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const phase = frameworkState?.currentPhase as string | undefined;
  const highest = frameworkState?.highestPhaseReached as string | undefined;
  const currentPhase: 'discovery' | 'research' | 'synthesis' | 'bets' =
    (phase === 'research' || phase === 'synthesis' || phase === 'bets') ? phase : 'discovery';
  const highestPhaseReached: 'discovery' | 'research' | 'synthesis' | 'bets' =
    (highest === 'research' || highest === 'synthesis' || highest === 'bets') ? highest : currentPhase;

  // Canvas tab state: 'phase' shows the phase-specific content, 'cases' shows Case Library
  const [activeTab, setActiveTab] = useState<'phase' | 'cases'>('phase');

  // Handle phase navigation via stepper clicks (must be before any early returns)
  const handlePhaseClick = useCallback(async (targetPhase: 'discovery' | 'research' | 'synthesis' | 'bets') => {
    // Don't do anything if clicking the current phase or no conversation
    if (!conversation || targetPhase === currentPhase) return;

    try {
      const response = await fetch('/api/product-strategy-agent/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          phase: targetPhase,
        }),
      });

      if (response.ok) {
        // Reload to show the new phase
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to navigate to phase:', error);
    }
  }, [conversation, currentPhase]);

  // Early return after all hooks are called
  if (!conversation) {
    return (
      <main className="canvas-panel bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">No conversation selected</p>
      </main>
    );
  }

  return (
    <main className="canvas-panel bg-slate-50 flex flex-col overflow-hidden h-full">
      <CanvasHeader conversation={conversation} />
      <HorizontalProgressStepper currentPhase={currentPhase} highestPhaseReached={highestPhaseReached} onPhaseClick={handlePhaseClick} />

      {/* Canvas tab bar */}
      <div className="flex items-center gap-1 px-10 pt-4 pb-0">
        <button
          onClick={() => setActiveTab('phase')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'phase'
              ? 'bg-white text-slate-900 border border-b-0 border-slate-200'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          {currentPhase === 'discovery' ? 'Discovery' :
           currentPhase === 'research' ? 'Research' :
           currentPhase === 'synthesis' ? 'Synthesis' : 'Strategic Bets'}
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'cases'
              ? 'bg-white text-slate-900 border border-b-0 border-slate-200'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          Case Library
        </button>
      </div>

      <div className="canvas-content flex-1 overflow-y-auto p-10 pt-6">
        {activeTab === 'cases' ? (
          <CaseLibrary conversation={conversation} />
        ) : (
          <>
            {currentPhase === 'discovery' && <DiscoverySection conversation={conversation} clientContext={clientContext} />}
            {currentPhase === 'research' && (
              <ResearchSection conversation={conversation} />
            )}
            {currentPhase === 'synthesis' && (
              <SynthesisSection conversation={conversation} />
            )}
            {currentPhase === 'bets' && (
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Strategic Bets Phase</h1>
                <p className="text-lg text-slate-600 mb-8">
                  Formulate hypothesis-driven strategic bets
                </p>
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                  <p className="text-slate-600">Strategic bets framework coming soon...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
