'use client';

import { useCallback } from 'react';
import { PanelRightClose, PanelRightOpen, Pin, PinOff } from 'lucide-react';
import { CanvasPanel } from '../CanvasPanel/CanvasPanel';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface ContextPanelProps {
  conversation: Conversation | null;
  clientContext: Client | null | undefined;
  onClientContextUpdate: (client: Client | null | undefined) => void;
  onResearchContextChange: (ctx: ActiveResearchContext | null) => void;
  onConversationUpdate: (conversation: Conversation) => void;
  isCollapsed: boolean;
  isPinned: boolean;
  onCollapse: () => void;
  onExpand: () => void;
  onTogglePin: () => void;
}

export function ContextPanel({
  conversation,
  clientContext,
  onClientContextUpdate,
  onResearchContextChange,
  onConversationUpdate,
  isCollapsed,
  isPinned,
  onCollapse,
  onExpand,
  onTogglePin,
}: ContextPanelProps) {
  const handleCollapse = useCallback(() => {
    onCollapse();
  }, [onCollapse]);

  if (isCollapsed) {
    return (
      <div className="flex-shrink-0 w-10 bg-white border-l border-slate-200 flex flex-col items-center pt-4 gap-3">
        <button
          onClick={onExpand}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Expand context panel"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="context-panel bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden animate-entrance animate-delay-300">
      {/* Panel header with controls */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Context
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePin}
            className={`p-1 rounded-md transition-colors ${
              isPinned
                ? 'text-[#fbbf24] hover:text-amber-600 bg-amber-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={isPinned ? 'Unpin context panel' : 'Pin context panel'}
            title={isPinned ? 'Unpins so context follows coaching topic' : 'Pin to keep current view'}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Collapse context panel"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas content — reuses existing CanvasPanel */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <CanvasPanel
          conversation={conversation}
          clientContext={clientContext}
          onClientContextUpdate={onClientContextUpdate}
          onResearchContextChange={onResearchContextChange}
          onConversationUpdate={onConversationUpdate}
        />
      </div>
    </aside>
  );
}
