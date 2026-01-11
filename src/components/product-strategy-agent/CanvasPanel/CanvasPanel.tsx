'use client';

import { CanvasHeader } from './CanvasHeader';
import { HorizontalProgressStepper } from './HorizontalProgressStepper';
import { DiscoverySection } from './DiscoverySection';
import { ResearchSection } from './ResearchSection';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CanvasPanelProps {
  conversation: Conversation | null | undefined;
  userId: string;
  orgId: string;
}

export function CanvasPanel({ conversation, userId, orgId }: CanvasPanelProps) {
  if (!conversation) {
    return (
      <main className="canvas-panel bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">No conversation selected</p>
      </main>
    );
  }

  // Extract current phase from framework_state
  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const phase = frameworkState?.currentPhase as string | undefined;
  const currentPhase: 'discovery' | 'research' | 'synthesis' | 'bets' =
    (phase === 'research' || phase === 'synthesis' || phase === 'bets') ? phase : 'discovery';

  return (
    <main className="canvas-panel bg-slate-50 flex flex-col overflow-hidden h-full">
      <CanvasHeader />
      <HorizontalProgressStepper currentPhase={currentPhase} />
      <div className="canvas-content flex-1 overflow-y-auto p-10">
        {/* Render phase-specific content */}
        {currentPhase === 'discovery' && <DiscoverySection conversation={conversation} />}
        {currentPhase === 'research' && <ResearchSection conversation={conversation} />}
        {currentPhase === 'synthesis' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Synthesis Phase</h1>
            <p className="text-lg text-slate-600 mb-8">
              Triangulate insights and identify strategic opportunities
            </p>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <p className="text-slate-600">Synthesis engine coming soon...</p>
            </div>
          </div>
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
      </div>
    </main>
  );
}
