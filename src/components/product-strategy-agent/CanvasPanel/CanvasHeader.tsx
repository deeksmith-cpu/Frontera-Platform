'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CanvasHeaderProps {
  conversation: Conversation;
  onPhaseChange?: () => void;
}

export function CanvasHeader({ conversation, onPhaseChange }: CanvasHeaderProps) {
  const [isChangingPhase, setIsChangingPhase] = useState(false);

  const handleExport = () => {
    console.log('Export clicked');
    // TODO: Implement export modal (deferred to post-MVP)
  };

  const handleShare = () => {
    console.log('Share clicked');
    // TODO: Implement share functionality (deferred to post-MVP)
  };

  const handleGenerateInsights = () => {
    console.log('Generate insights clicked');
    // TODO: Implement synthesis generation
  };

  // TODO: REMOVE THIS AFTER MVP TESTING - Temporary phase navigation for testing
  const handleNextPhase = async () => {
    setIsChangingPhase(true);

    const frameworkState = conversation.framework_state as Record<string, unknown> | null;
    const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

    // Cycle through phases: discovery → research → synthesis → bets → discovery
    const phaseOrder: Array<'discovery' | 'research' | 'synthesis' | 'bets'> = ['discovery', 'research', 'synthesis', 'bets'];
    const currentIndex = phaseOrder.indexOf(currentPhase as 'discovery' | 'research' | 'synthesis' | 'bets');
    const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];

    try {
      const response = await fetch('/api/product-strategy-agent/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          phase: nextPhase,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update phase');
      }

      // Reload the page to show new phase
      if (onPhaseChange) {
        onPhaseChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating phase:', error);
      alert('Failed to change phase. Please try again.');
    } finally {
      setIsChangingPhase(false);
    }
  };

  return (
    <header className="canvas-header py-5 px-10 border-b border-slate-100 bg-white flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-6">
        <Image
          src="/frontera-logo-white.jpg"
          alt="Frontera"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <div>
          <h2 className="canvas-title text-xl font-bold text-slate-900">
            Product Strategy Coach
          </h2>
        </div>
      </div>

      <div className="canvas-controls flex gap-3">
        {/* TODO: REMOVE THIS AFTER MVP TESTING - Temporary phase navigation */}
        <button
          onClick={handleNextPhase}
          disabled={isChangingPhase}
          className="canvas-btn text-sm py-2.5 px-5 bg-amber-500 border border-amber-600 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-amber-600 hover:shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          title="Temporary: Cycle through phases for testing"
        >
          {isChangingPhase ? 'Switching...' : '🔄 Next Phase (TEST)'}
        </button>

        <button
          onClick={handleExport}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-cyan-300 hover:shadow-md font-semibold"
        >
          Export
        </button>
        <button
          onClick={handleShare}
          className="canvas-btn text-sm py-2.5 px-5 bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer transition-all duration-300 hover:bg-slate-50 hover:border-cyan-300 hover:shadow-md font-semibold"
        >
          Share
        </button>
        <button
          onClick={handleGenerateInsights}
          className="canvas-btn primary text-sm py-2.5 px-5 bg-gradient-to-r from-indigo-600 to-cyan-600 border-0 rounded-xl text-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold"
        >
          Generate Insights
        </button>
      </div>
    </header>
  );
}
