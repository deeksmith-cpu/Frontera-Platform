'use client';

import { CanvasHeader } from './CanvasHeader';
import { JourneyIndicator } from './JourneyIndicator';
import { ThreeCsCanvas } from './ThreeCsCanvas';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CanvasPanelProps {
  conversation: Conversation | undefined;
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
  const frameworkState = conversation.framework_state as any;
  const currentPhase = frameworkState?.currentPhase || 'discovery';

  return (
    <main className="canvas-panel bg-slate-50 flex flex-col overflow-hidden">
      <CanvasHeader conversation={conversation} />
      <JourneyIndicator currentPhase={currentPhase} />
      <div className="canvas-content flex-1 overflow-y-auto p-10">
        <ThreeCsCanvas conversation={conversation} userId={userId} orgId={orgId} />
      </div>
    </main>
  );
}
