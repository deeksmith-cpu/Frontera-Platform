'use client';

import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import { CoachTriggerButton } from './CoachTriggerButton';
import { CoachingPopup } from './CoachingPopup';
import { useCoachPopup } from '@/hooks/useCoachPopup';
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

  return (
    <div className="product-strategy-agent h-screen overflow-hidden bg-slate-50">
      {/* Main Canvas - now full width */}
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
