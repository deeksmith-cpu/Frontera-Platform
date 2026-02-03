'use client';

import { useCallback, useState } from 'react';
import posthog from 'posthog-js';
import { ChevronRight } from 'lucide-react';
import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import { CanvasHeader } from './CanvasPanel/CanvasHeader';
import { CoachTriggerButton } from './CoachTriggerButton';
import { CoachingPopup } from './CoachingPopup';
import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { useCoachPopup, useMediaQuery } from '@/hooks/useCoachPopup';
import { useCoachPanel } from '@/hooks/useCoachPanel';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

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
  clientContext: initialClientContext,
}: ProductStrategyAgentInterfaceProps) {
  const [clientContext, setClientContext] = useState(initialClientContext);
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);
  const popup = useCoachPopup();
  const panel = useCoachPanel();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const handleCoachToggle = useCallback(() => {
    posthog.capture('coach_popup_toggled', { action: popup.isOpen ? 'close' : 'open', device: isMobile ? 'mobile' : 'desktop' });
    popup.toggle();
  }, [popup, isMobile]);

  const handlePanelCollapse = useCallback(() => {
    posthog.capture('coach_panel_collapsed');
    panel.collapse();
  }, [panel]);

  const handlePanelExpand = useCallback(() => {
    posthog.capture('coach_panel_expanded');
    panel.expand();
  }, [panel]);

  return (
    <div className="product-strategy-agent h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* Full-width header */}
      {conversation && <CanvasHeader conversation={conversation} />}

      {/* Content area: chat + canvas side by side */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Coaching Panel - hidden on mobile, side panel on tablet/desktop */}
      <aside
        className={`
          hidden md:flex flex-shrink-0 border-r border-slate-200 bg-white
          transition-all duration-300 overflow-hidden
          ${panel.isCollapsed ? 'md:w-0' : 'md:w-[25%] md:min-w-[280px] lg:w-[25%] lg:min-w-[320px] lg:max-w-[420px]'}
        `}
      >
        {conversation && (
          <CoachingPanel
            conversation={conversation}
            userId={userId}
            orgId={orgId}
            onCollapse={handlePanelCollapse}
            mode="sidepanel"
            activeResearchContext={activeResearchContext}
          />
        )}
        {!conversation && (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            <p>Loading conversation...</p>
          </div>
        )}
      </aside>

      {/* Canvas Panel - full width on mobile, fills remaining on tablet/desktop */}
      <main className="flex-1 overflow-hidden relative">
        {/* Expand button when collapsed (tablet/desktop only) */}
        {panel.isCollapsed && (
          <button
            onClick={handlePanelExpand}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-200 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Expand coach panel"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        )}

        <div className="h-full flex flex-col">
          <CanvasPanel
            conversation={conversation}
            clientContext={clientContext}
            onClientContextUpdate={setClientContext}
            onResearchContextChange={setActiveResearchContext}
          />
        </div>
      </main>
      </div>

      {/* Coach Trigger Button - mobile only */}
      <div className="md:hidden">
        <CoachTriggerButton onClick={handleCoachToggle} isOpen={popup.isOpen} />
      </div>

      {/* Floating Coach Popup - mobile only */}
      {isMobile && (
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
          activeResearchContext={activeResearchContext}
        />
      )}
    </div>
  );
}
