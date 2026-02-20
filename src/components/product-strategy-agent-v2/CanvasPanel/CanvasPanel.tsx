'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { HorizontalProgressStepper } from './HorizontalProgressStepper';
import { DiscoverySection } from './DiscoverySection';
import { ResearchSection } from './ResearchSection';
import { SynthesisSection } from './SynthesisSection';
import { BetsSection } from './BetsSection';
import { CaseLibrary } from './CaseLibrary';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface CanvasPanelProps {
  conversation: Conversation | null | undefined;
  clientContext?: Client | null;
  onClientContextUpdate?: (client: Client | null | undefined) => void;
  onResearchContextChange?: (context: ActiveResearchContext | null) => void;
}

export function CanvasPanel({ conversation, clientContext, onClientContextUpdate, onResearchContextChange }: CanvasPanelProps) {
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
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);

  // Bubble research context changes to parent
  useEffect(() => {
    onResearchContextChange?.(activeResearchContext);
  }, [activeResearchContext, onResearchContextChange]);

  // Handle phase navigation via stepper clicks (must be before any early returns)
  const handlePhaseClick = useCallback(async (targetPhase: 'discovery' | 'research' | 'synthesis' | 'bets') => {
    // Don't do anything if clicking the current phase or no conversation
    if (!conversation || targetPhase === currentPhase) return;
    posthog.capture('stepper_phase_clicked', { from_phase: currentPhase, to_phase: targetPhase });

    try {
      const response = await fetch('/api/product-strategy-agent-v2/phase', {
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

  // Swipe gesture for phase navigation (touch devices only)
  const phaseOrder: ('discovery' | 'research' | 'synthesis' | 'bets')[] = useMemo(
    () => ['discovery', 'research', 'synthesis', 'bets'],
    []
  );

  const handleSwipeLeft = useCallback(() => {
    const idx = phaseOrder.indexOf(currentPhase);
    const highIdx = phaseOrder.indexOf(highestPhaseReached);
    if (idx < phaseOrder.length - 1 && idx + 1 <= highIdx) {
      handlePhaseClick(phaseOrder[idx + 1]);
    }
  }, [currentPhase, highestPhaseReached, handlePhaseClick, phaseOrder]);

  const handleSwipeRight = useCallback(() => {
    const idx = phaseOrder.indexOf(currentPhase);
    if (idx > 0) {
      handlePhaseClick(phaseOrder[idx - 1]);
    }
  }, [currentPhase, handlePhaseClick, phaseOrder]);

  const swipeRef = useSwipeGesture({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

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
      <HorizontalProgressStepper currentPhase={currentPhase} highestPhaseReached={highestPhaseReached} onPhaseClick={handlePhaseClick} />

      {/* Canvas tab bar */}
      <div className="flex items-center gap-1 px-4 sm:px-6 md:px-8 pt-3 pb-0">
        <button
          onClick={() => { setActiveTab('phase'); posthog.capture('canvas_tab_switched', { tab: 'phase', phase: currentPhase }); }}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all duration-300 ${
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
          onClick={() => { setActiveTab('cases'); posthog.capture('canvas_tab_switched', { tab: 'cases' }); }}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all duration-300 ${
            activeTab === 'cases'
              ? 'bg-white text-slate-900 border border-b-0 border-slate-200'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          Case Library
        </button>
      </div>

      <div ref={swipeRef} className="canvas-content flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-4 md:pt-6">
        {activeTab === 'cases' ? (
          <CaseLibrary conversation={conversation} />
        ) : (
          <>
            {currentPhase === 'discovery' && <DiscoverySection conversation={conversation} clientContext={clientContext} onClientContextUpdate={onClientContextUpdate} />}
            {currentPhase === 'research' && (
              <ResearchSection conversation={conversation} onResearchContextChange={setActiveResearchContext} />
            )}
            {currentPhase === 'synthesis' && (
              <SynthesisSection conversation={conversation} />
            )}
            {currentPhase === 'bets' && (
              <BetsSection conversation={conversation} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
