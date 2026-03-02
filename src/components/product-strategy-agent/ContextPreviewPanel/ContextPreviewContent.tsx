'use client';

import { forwardRef } from 'react';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { DiscoveryPreview } from './previews/DiscoveryPreview';
import { ResearchPreview } from './previews/ResearchPreview';
import { SynthesisPreview } from './previews/SynthesisPreview';
import { BetsPreview } from './previews/BetsPreview';
import { ActivationPreview } from './previews/ActivationPreview';
import { ReviewPreview } from './previews/ReviewPreview';

interface ContextPreviewContentProps {
  conversationId: string | null;
}

export const ContextPreviewContent = forwardRef<HTMLDivElement, ContextPreviewContentProps>(
  function ContextPreviewContent({ conversationId }, ref) {
    const { currentPhase } = useCoachJourney();

    return (
      <div ref={ref} className="flex-1 min-h-0 overflow-y-auto p-4">
        {currentPhase === 'discovery' && (
          <DiscoveryPreview conversationId={conversationId} />
        )}
        {currentPhase === 'research' && (
          <ResearchPreview conversationId={conversationId} />
        )}
        {currentPhase === 'synthesis' && (
          <SynthesisPreview conversationId={conversationId} />
        )}
        {currentPhase === 'bets' && (
          <BetsPreview conversationId={conversationId} />
        )}
        {currentPhase === 'activation' && (
          <ActivationPreview conversationId={conversationId} />
        )}
        {currentPhase === 'review' && (
          <ReviewPreview />
        )}
      </div>
    );
  }
);
