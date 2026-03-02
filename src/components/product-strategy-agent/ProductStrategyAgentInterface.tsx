'use client';

import { Component, useCallback, useRef, useState, type ReactNode } from 'react';
import posthog from 'posthog-js';
import { ChevronRight } from 'lucide-react';
import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import { ContextPreviewPanel } from './ContextPreviewPanel/ContextPreviewPanel';
import { ResizeDivider } from './ContextPanel/ResizeDivider';
import { StrategyHeader } from './StrategyHeader';
import { CoachTriggerButton } from './CoachTriggerButton';
import { CoachingPopup } from './CoachingPopup';
import { CoachLedPanel } from './CoachLedPanel/CoachLedPanel';
import { LevelUpCelebration } from './Gamification/LevelUpCelebration';
import { CoachJourneyProvider } from '@/contexts/CoachJourneyContext';
import { useCoachPopup, useMediaQuery } from '@/hooks/useCoachPopup';
import { useContextPanelState } from './ContextPanel/useContextPanelState';
import { useGamification } from '@/hooks/useGamification';
import { useXPNotification } from './Gamification/XPNotification';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

/**
 * Top-level error boundary for the Product Strategy Agent page.
 * Catches any undefined-component or render errors and shows a recovery UI
 * instead of crashing the whole page with React error #130.
 */
class AgentErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('[ProductStrategyAgent] Render error caught by boundary:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-4">
              The Strategy Coach encountered a rendering error. This is usually caused by stale data from a previous session.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

type Conversation = Database['public']['Tables']['conversations']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface ProductStrategyAgentInterfaceProps {
  conversation: Conversation | null;
  userId: string;
  orgId: string;
  clientContext?: Client | null;
  hasAssessment?: boolean;
}

export function ProductStrategyAgentInterface({
  conversation: initialConversation,
  userId,
  orgId,
  clientContext: initialClientContext,
  hasAssessment = false,
}: ProductStrategyAgentInterfaceProps) {
  const [conversation, setConversation] = useState(initialConversation);
  const [clientContext, setClientContext] = useState(initialClientContext);
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);
  const [assessmentDismissed, setAssessmentDismissed] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  // Gamification
  const { showNotification, NotificationRenderer } = useXPNotification();
  const gamification = useGamification((result) => {
    showNotification(result);
    if (result.levelUp) {
      setLevelUpLevel(result.levelUp.newLevel);
    }
  });

  // Layout state
  const layout = useContextPanelState();
  const contentRef = useRef<HTMLDivElement>(null);

  // Update conversation when a phase transition occurs (avoids full page reload)
  const handleConversationUpdate = useCallback((updated: Conversation) => {
    setConversation(updated);
  }, []);

  // Mobile popup state
  const popup = useCoachPopup();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleCoachToggle = useCallback(() => {
    posthog.capture('coach_popup_toggled', { action: popup.isOpen ? 'close' : 'open', device: isMobile ? 'mobile' : 'desktop' });
    popup.toggle();
  }, [popup, isMobile]);

  const handleContextCollapse = useCallback(() => {
    posthog.capture('context_panel_collapsed');
    layout.collapseContext();
  }, [layout]);

  const handleContextExpand = useCallback(() => {
    posthog.capture('context_panel_expanded');
    layout.expandContext();
  }, [layout]);

  // ── Coach-Led Layout (67/33) — Option A ──
  const renderCoachLedLayout = () => (
    <CoachJourneyProvider
      conversation={conversation}
      onConversationUpdate={handleConversationUpdate}
      activeResearchContext={activeResearchContext}
      onResearchContextChange={setActiveResearchContext}
      contextPreviewCollapsed={layout.contextCollapsed}
      onContextCollapse={handleContextCollapse}
      onContextExpand={handleContextExpand}
    >
      <div ref={contentRef} className="flex-1 flex overflow-hidden">
        {/* Coaching Centre — primary (67%), drives the journey */}
        <main
          className="hidden md:flex flex-col overflow-hidden bg-white"
          style={{ width: layout.contextCollapsed ? 'calc(100% - 48px)' : `${layout.coachWidthPct}%` }}
        >
          {conversation ? (
            <CoachLedPanel
              conversation={conversation}
              userId={userId}
              orgId={orgId}
              activeResearchContext={activeResearchContext}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              <p>Loading conversation...</p>
            </div>
          )}
        </main>

        {/* Resizable Divider (desktop only, visible when expanded) */}
        {!layout.contextCollapsed && (
          <ResizeDivider
            onResize={layout.setCoachWidth}
            containerRef={contentRef}
          />
        )}

        {/* Context Preview Panel — secondary (33%), collapsible to 48px rail */}
        <div
          className="hidden md:flex flex-col overflow-hidden"
          style={{ width: layout.contextCollapsed ? '48px' : `${layout.contextWidthPct}%`, flexShrink: layout.contextCollapsed ? 0 : undefined }}
        >
          <ContextPreviewPanel
            conversation={conversation}
            isCollapsed={layout.contextCollapsed}
            onCollapse={handleContextCollapse}
            onExpand={handleContextExpand}
          />
        </div>

        {/* Mobile: Full-width canvas with coach popup overlay */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
          <CanvasPanel
            conversation={conversation}
            clientContext={clientContext}
            onClientContextUpdate={setClientContext}
            onResearchContextChange={setActiveResearchContext}
            onConversationUpdate={handleConversationUpdate}
          />
        </div>
      </div>
    </CoachJourneyProvider>
  );

  return (
    <AgentErrorBoundary>
      <div className="product-strategy-agent h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfeff 100%)' }}>
        {/* Strategy Header */}
        <StrategyHeader
          conversation={conversation}
          gamification={gamification}
        />

        {/* Assessment CTA - shown when user hasn't taken the assessment */}
        {!hasAssessment && !assessmentDismissed && (
          <div className="flex-shrink-0 bg-gradient-to-r from-[#1a1f3a] to-[#2d3561] px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#fbbf24] text-xs font-bold uppercase tracking-wider">New</span>
              <span className="text-white text-sm">
                Discover your Strategic Archetype — personalise your coaching experience
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard/product-strategy-agent/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#fbbf24] text-[#1a1f3a] text-xs font-semibold transition-all hover:bg-[#f59e0b] hover:scale-105"
              >
                Take Assessment
                <ChevronRight className="w-3 h-3" />
              </a>
              <button
                onClick={() => setAssessmentDismissed(true)}
                className="text-slate-400 hover:text-white text-xs transition-colors"
                aria-label="Dismiss assessment prompt"
              >
                Later
              </button>
            </div>
          </div>
        )}

        {/* Content area: Coach-Led Layout (Option A) */}
        {renderCoachLedLayout()}

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

        {/* XP Notifications */}
        <NotificationRenderer />

        {/* Level-up celebration overlay */}
        {levelUpLevel !== null && (
          <LevelUpCelebration
            newLevel={levelUpLevel}
            onDismiss={() => setLevelUpLevel(null)}
          />
        )}
      </div>
    </AgentErrorBoundary>
  );
}
