'use client';

import { ChevronRight } from 'lucide-react';
import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import { CoachTriggerButton } from './CoachTriggerButton';
import { CoachingPopup } from './CoachingPopup';
import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { useCoachPopup, useMediaQuery } from '@/hooks/useCoachPopup';
import { useCoachPanel } from '@/hooks/useCoachPanel';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface ProductStrategyAgentInterfaceProps {
  conversation: Conversation | null;
  userId: string;
  orgId: string;
  clientContext?: Client | null;
}

export function ProductStrategyAgentInterface({
  conversation,
  userId,
  orgId,
  clientContext,
}: ProductStrategyAgentInterfaceProps) {
  const popup = useCoachPopup();
  const panel = useCoachPanel();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  // Mobile: Use the floating popup pattern
  if (isMobile) {
    return (
      <div className="product-strategy-agent h-screen overflow-hidden bg-slate-50">
        {/* Main Canvas - full width on mobile */}
        <div className="h-full flex flex-col">
          <CanvasPanel
            conversation={conversation}
            clientContext={clientContext}
          />
        </div>

        {/* Coach Trigger Button - floating action button */}
        <CoachTriggerButton onClick={popup.toggle} isOpen={popup.isOpen} />

        {/* Floating Coach Popup */}
        <CoachingPopup
          isOpen={popup.isOpen}
          onClose={popup.close}
          position={popup.position}
          size={popup.size}
          onPositionChange={popup.updatePosition}
          onSizeChange={popup.updateSize}
          conversation={conversation}
          userId={userId}
          orgId={orgId}
          constraints={popup.constraints}
        />
      </div>
    );
  }

  // Desktop: Persistent side panel layout
  return (
    <div className="product-strategy-agent h-screen flex overflow-hidden bg-slate-50">
      {/* Coaching Panel - Left Side (35% width) */}
      <aside
        className={`
          ${panel.isCollapsed ? 'w-0' : 'w-[35%] min-w-[360px] max-w-[480px]'}
          flex-shrink-0 border-r border-slate-200 bg-white
          transition-all duration-300 overflow-hidden
        `}
      >
        {conversation && (
          <CoachingPanel
            conversation={conversation}
            userId={userId}
            orgId={orgId}
            onCollapse={panel.collapse}
            mode="sidepanel"
          />
        )}
        {!conversation && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            <p>Loading conversation...</p>
          </div>
        )}
      </aside>

      {/* Canvas Panel - Right Side (fills remaining space) */}
      <main className="flex-1 overflow-hidden relative">
        {/* Expand button when collapsed */}
        {panel.isCollapsed && (
          <button
            onClick={panel.expand}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-200 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Expand coach panel"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        )}

        <div className="h-full flex flex-col">
          <CanvasPanel
            conversation={conversation}
            clientContext={clientContext}
          />
        </div>
      </main>
    </div>
  );
}
