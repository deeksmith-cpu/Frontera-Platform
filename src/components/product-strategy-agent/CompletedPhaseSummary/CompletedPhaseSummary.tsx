'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CompletedPhaseBanner } from './CompletedPhaseBanner';
import { DiscoverySummary } from './DiscoverySummary';
import { ResearchSummary } from './ResearchSummary';
import { SynthesisSummary } from './SynthesisSummary';
import { BetsSummary } from './BetsSummary';
import { ActivationSummary } from './ActivationSummary';
import { SynthesisView } from '../SynthesisView/SynthesisView';
import { BetsView } from '../BetsView/BetsView';
import { ActivationView } from '../ActivationView/ActivationView';
import { ResearchReviewView } from './ResearchReviewView';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';

// No-op phase transition handler for read-only drill-in views
const noopPhaseTransition = async () => {};

interface CompletedPhaseSummaryProps {
  phase: string;
  conversationId: string;
  currentPhase: string;
  onReturnToActive: () => void;
  researchProgress: ResearchProgressData | null;
}

export function CompletedPhaseSummary({
  phase,
  conversationId,
  currentPhase,
  onReturnToActive,
  researchProgress,
}: CompletedPhaseSummaryProps) {
  const [isDrilledIn, setIsDrilledIn] = useState(false);

  const handleDrillIn = () => setIsDrilledIn(true);
  const handleBackToSummary = () => setIsDrilledIn(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Banner always visible */}
      <CompletedPhaseBanner
        phase={phase}
        currentPhase={currentPhase}
        onReturnToActive={onReturnToActive}
      />

      {/* Back to summary button when drilled in */}
      {isDrilledIn && (
        <div className="flex-shrink-0 px-6 pt-3 animate-entrance">
          <button
            onClick={handleBackToSummary}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Summary
          </button>
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {!isDrilledIn && phase === 'discovery' && (
          <DiscoverySummary conversationId={conversationId} onDrillIn={handleDrillIn} />
        )}
        {!isDrilledIn && phase === 'research' && (
          <ResearchSummary researchProgress={researchProgress} onDrillIn={handleDrillIn} />
        )}
        {!isDrilledIn && phase === 'synthesis' && (
          <SynthesisSummary conversationId={conversationId} onDrillIn={handleDrillIn} />
        )}
        {!isDrilledIn && phase === 'bets' && (
          <BetsSummary conversationId={conversationId} onDrillIn={handleDrillIn} />
        )}
        {!isDrilledIn && phase === 'activation' && (
          <ActivationSummary conversationId={conversationId} onDrillIn={handleDrillIn} />
        )}

        {/* Drill-in: render the actual phase editing component */}
        {isDrilledIn && (
          <DrillInView phase={phase} conversationId={conversationId} />
        )}
      </div>
    </div>
  );
}

/** Drill-in renders the actual editing components inline */
function DrillInView({ phase, conversationId }: { phase: string; conversationId: string }) {
  if (phase === 'synthesis') {
    return <SynthesisView conversationId={conversationId} onPhaseTransition={noopPhaseTransition} />;
  }

  if (phase === 'bets') {
    return (
      <BetsView
        conversation={{ id: conversationId } as never}
        onPhaseTransition={noopPhaseTransition}
      />
    );
  }

  if (phase === 'activation') {
    return (
      <ActivationView
        conversation={{ id: conversationId } as never}
        onPhaseTransition={noopPhaseTransition}
      />
    );
  }

  if (phase === 'research') {
    return <ResearchReviewView conversationId={conversationId} />;
  }

  // For discovery, show a guidance card since it uses orientation + chat
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-entrance">
      <div className="bg-white border border-cyan-200 rounded-2xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 mb-2">
          Review Mode
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your discovery materials and coaching conversations are preserved. Use the Strategy Canvas panel on the right to browse uploaded documents and AI research.
        </p>
      </div>
    </div>
  );
}
