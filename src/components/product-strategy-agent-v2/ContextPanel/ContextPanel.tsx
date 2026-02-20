'use client';

import { DiscoverySection } from '../CanvasPanel/DiscoverySection';
import { ResearchSection } from '../CanvasPanel/ResearchSection';
import { SynthesisSection } from '../CanvasPanel/SynthesisSection';
import { BetsSection } from '../CanvasPanel/BetsSection';
import { ActivationSection } from './ActivationSection';
import { StrategyReviewSection } from './StrategyReviewSection';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';
import type { ContextPanelView } from '@/hooks/useContextPanel';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface ContextPanelProps {
  conversation: Conversation;
  activeView: ContextPanelView;
  isCollapsed: boolean;
  isExpanded: boolean;
  isPinned: boolean;
  clientContext?: Client | null;
  onClientContextUpdate?: (client: Client | null | undefined) => void;
  onViewChange: (view: ContextPanelView) => void;
  onCollapse: () => void;
  onExpand: () => void;
  onTogglePin: () => void;
  onResearchContextChange?: (context: ActiveResearchContext | null) => void;
}

const VIEW_TABS: { id: ContextPanelView; label: string; color: string }[] = [
  { id: 'discovery', label: 'Discovery', color: 'emerald' },
  { id: 'research', label: 'Research', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', color: 'purple' },
  { id: 'bets', label: 'Bets', color: 'cyan' },
  { id: 'activation', label: 'Activate', color: 'emerald' },
  { id: 'review', label: 'Review', color: 'amber' },
];

export function ContextPanel({
  conversation,
  activeView,
  isCollapsed,
  isExpanded,
  isPinned,
  clientContext,
  onClientContextUpdate,
  onViewChange,
  onCollapse,
  onExpand,
  onTogglePin,
  onResearchContextChange,
}: ContextPanelProps) {
  if (isCollapsed) {
    return (
      <div className="w-10 h-full bg-slate-50 border-l border-slate-200 flex flex-col items-center pt-3 gap-2">
        <button
          onClick={onCollapse}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Expand context panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { onViewChange(tab.id); onCollapse(); }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold transition-colors ${
              activeView === tab.id ? 'bg-[#1a1f3a] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            aria-label={tab.label}
          >
            {tab.label[0]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="context-panel h-full flex flex-col bg-slate-50 border-l border-slate-200 overflow-hidden">
      {/* Control Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-white border-b border-slate-100">
        {/* Phase Tabs */}
        <div className="flex items-center gap-1">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                activeView === tab.id
                  ? 'bg-[#1a1f3a] text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePin}
            className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
              isPinned ? 'bg-[#fbbf24]/20 text-[#b45309]' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label={isPinned ? 'Unpin view' : 'Pin view'}
          >
            <svg className="w-3.5 h-3.5" fill={isPinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            onClick={onExpand}
            className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={isExpanded ? 'Shrink panel' : 'Expand panel'}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>
          <button
            onClick={onCollapse}
            className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Collapse panel"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeView === 'discovery' && (
          <DiscoverySection conversation={conversation} clientContext={clientContext} onClientContextUpdate={onClientContextUpdate} />
        )}
        {activeView === 'research' && (
          <ResearchSection
            conversation={conversation}
            onResearchContextChange={onResearchContextChange}
          />
        )}
        {activeView === 'synthesis' && (
          <SynthesisSection conversation={conversation} />
        )}
        {activeView === 'bets' && (
          <BetsSection conversation={conversation} />
        )}
        {activeView === 'activation' && (
          <ActivationSection conversation={conversation} />
        )}
        {activeView === 'review' && (
          <StrategyReviewSection conversation={conversation} />
        )}
      </div>
    </div>
  );
}
