'use client';

import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ProductStrategyAgentInterfaceProps {
  conversation: Conversation | null;
  userId: string;
  orgId: string;
}

export function ProductStrategyAgentInterface({
  conversation,
  userId,
  orgId,
}: ProductStrategyAgentInterfaceProps) {
  return (
    <div className="product-strategy-agent h-screen flex overflow-hidden bg-slate-50">
      {/* Coach Sidebar - 25% width, fixed */}
      <div className="w-1/4 min-w-[320px] max-w-[400px] flex-shrink-0">
        <CoachingPanel conversation={conversation} userId={userId} orgId={orgId} />
      </div>

      {/* Main Canvas - 75% width, scrollable */}
      <div className="flex-1 flex flex-col min-w-0">
        <CanvasPanel conversation={conversation} userId={userId} orgId={orgId} />
      </div>
    </div>
  );
}
