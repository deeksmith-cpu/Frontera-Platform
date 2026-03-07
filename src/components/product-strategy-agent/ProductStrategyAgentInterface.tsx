'use client';

import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import posthog from 'posthog-js';
import { Menu } from 'lucide-react';
import { SlimHeader } from './SlimHeader';
import { JourneySidebar } from './JourneySidebar/JourneySidebar';
import { StrategyCanvas } from './StrategyCanvas/StrategyCanvas';
import { MainContent } from './MainContent/MainContent';
import { LevelUpCelebration } from './Gamification/LevelUpCelebration';
import { CoachJourneyProvider } from '@/contexts/CoachJourneyContext';
import { useStrategyLayout } from '@/hooks/useStrategyLayout';
import { useGamification } from '@/hooks/useGamification';
import { useResearchProgress } from '@/hooks/useResearchProgress';
import { useXPNotification } from './Gamification/XPNotification';
import { PERSONA_OPTIONS } from '@/lib/agents/strategy-coach/personas';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

/**
 * Top-level error boundary for the Product Strategy Agent page.
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
}

export function ProductStrategyAgentInterface({
  conversation: initialConversation,
  userId,
  orgId,
}: ProductStrategyAgentInterfaceProps) {
  const [conversation, setConversation] = useState(initialConversation);
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);

  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [canvasViewPhase, setCanvasViewPhase] = useState<string | null>(null);
  const [coachName, setCoachName] = useState('Strategy Coach');
  const [coachPersonaId, setCoachPersonaId] = useState<string | null>(null);

  // Fetch allocated coach persona name
  useEffect(() => {
    fetch('/api/product-strategy-agent/persona')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.persona) {
          setCoachPersonaId(data.persona);
          const option = PERSONA_OPTIONS.find(p => p.id === (data.persona as PersonaId));
          if (option) setCoachName(`Coach ${option.name}`);
        }
      })
      .catch(() => {});
  }, []);

  // Gamification
  const { showNotification, NotificationRenderer } = useXPNotification();
  const gamification = useGamification((result) => {
    showNotification(result);
    if (result.levelUp) {
      setLevelUpLevel(result.levelUp.newLevel);
    }
  });

  // Layout state (extended with focus mode + coach drawer)
  const layout = useStrategyLayout();

  // Ref for territory click forwarding from sidebar to MainContent
  const territoryClickRef = useRef<((territory: string) => void) | null>(null);

  // Research progress (for sidebar territory dots)
  const researchProgress = useResearchProgress(conversation?.id ?? null);

  // Derive phase state from conversation
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';
  const highestPhaseReached = (frameworkState?.highestPhaseReached as string) || currentPhase;

  // Breadcrumb for focus mode — includes territory context when in research
  const breadcrumb = useMemo(() => {
    const phaseLabels: Record<string, string> = {
      discovery: 'Discovery',
      research: 'Research',
      synthesis: 'Synthesis',
      bets: 'Strategic Bets',
      activation: 'Activation',
      review: 'Review',
    };
    const phaseLabel = phaseLabels[currentPhase] || 'Strategy Coach';
    if (currentPhase === 'research' && activeResearchContext?.territory) {
      const territoryLabels: Record<string, string> = {
        company: 'Company Territory',
        customer: 'Customer Territory',
        competitor: 'Market Context',
      };
      const territoryLabel = territoryLabels[activeResearchContext.territory] || activeResearchContext.territory;
      return `Strategy Coach > ${phaseLabel} > ${territoryLabel}`;
    }
    return `Strategy Coach > ${phaseLabel}`;
  }, [currentPhase, activeResearchContext]);

  // Update conversation when a phase transition occurs
  const handleConversationUpdate = useCallback((updated: Conversation) => {
    setConversation(updated);
    // Clear phase view override so UI shows the new active phase
    setCanvasViewPhase(null);
  }, []);

  // Phase click from sidebar or tab bar — show that phase's canvas preview
  const handlePhaseClick = useCallback((phase: string) => {
    posthog.capture('phase_tab_clicked', { phase });
    // If clicking the current phase, reset to default; otherwise show that phase's canvas
    setCanvasViewPhase(prev => prev === phase || phase === currentPhase ? null : phase);
  }, [currentPhase]);

  // Territory click from sidebar — forwarded to MainContent
  const handleTerritoryClick = useCallback((territory: string) => {
    posthog.capture('territory_clicked', { territory, source: 'sidebar' });
    territoryClickRef.current?.(territory);
  }, []);

  // Context collapse/expand (kept for CoachJourneyProvider compatibility)
  const handleContextCollapse = useCallback(() => {
    posthog.capture('context_panel_collapsed');
  }, []);

  const handleContextExpand = useCallback(() => {
    posthog.capture('context_panel_expanded');
  }, []);

  return (
    <AgentErrorBoundary>
      <div
        className="product-strategy-agent h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfeff 100%)' }}
      >
        {/* Slim Header (56px) */}
        <SlimHeader
          conversation={conversation}
          isFocusMode={layout.isFocusMode}
          onToggleFocusMode={layout.toggleFocusMode}
          compactXP={layout.isFocusMode ? { level: gamification.level, xpTotal: gamification.xpTotal } : undefined}
          breadcrumb={layout.isFocusMode ? breadcrumb : undefined}
        />

        {/* Three-column layout */}
        <CoachJourneyProvider
          conversation={conversation}
          onConversationUpdate={handleConversationUpdate}
          activeResearchContext={activeResearchContext}
          onResearchContextChange={setActiveResearchContext}
          contextPreviewCollapsed={false}
          onContextCollapse={handleContextCollapse}
          onContextExpand={handleContextExpand}
        >
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* LEFT: Journey Sidebar (220px desktop, 48px tablet, hidden mobile) */}
            {layout.isSidebarOpen && (
              <JourneySidebar
                conversation={conversation}
                gamification={gamification}
                currentPhase={currentPhase}
                highestPhaseReached={highestPhaseReached}
                researchProgress={researchProgress.progress}
                iconOnly={layout.isSidebarIconOnly}
                onTerritoryClick={handleTerritoryClick}
                onPhaseClick={handlePhaseClick}
                onMenuClick={layout.isSidebarIconOnly ? layout.toggleSidebarExpand : undefined}
                coachName={coachName}
                coachPersonaId={coachPersonaId}
              />
            )}

            {/* Mobile: hamburger menu button */}
            {layout.breakpoint === 'mobile' && !layout.isMobileDrawerOpen && (
              <button
                onClick={layout.toggleMobileDrawer}
                className="fixed top-16 left-2 z-30 w-8 h-8 rounded-lg bg-[#1a1f3a] text-white flex items-center justify-center shadow-lg"
                aria-label="Open sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {/* Mobile sidebar overlay */}
            {layout.breakpoint === 'mobile' && layout.isMobileDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-40"
                  onClick={layout.closeOverlays}
                />
                <div className="fixed left-0 top-0 bottom-0 z-50 w-[260px]">
                  <JourneySidebar
                    conversation={conversation}
                    gamification={gamification}
                    currentPhase={currentPhase}
                    highestPhaseReached={highestPhaseReached}
                    researchProgress={researchProgress.progress}
                    onTerritoryClick={(territory) => {
                      handleTerritoryClick(territory);
                      layout.closeOverlays();
                    }}
                    onPhaseClick={handlePhaseClick}
                    className="h-full"
                    coachName={coachName}
                    coachPersonaId={coachPersonaId}
                  />
                </div>
              </>
            )}

            {/* CENTER: Main Content (fluid) — routes between Orientation, PinnedQuestion, Chat */}
            {conversation ? (
              <MainContent
                conversation={conversation}
                userId={userId}
                orgId={orgId}
                activeResearchContext={activeResearchContext}
                researchProgress={researchProgress.progress}
                isCoachDrawerOpen={layout.isCoachDrawerOpen}
                onToggleCoachDrawer={layout.setCoachDrawerOpen}
                onTerritoryClickRef={territoryClickRef}
                highestPhaseReached={highestPhaseReached}
                onPhaseClick={handlePhaseClick}
                coachName={coachName}
                coachPersonaId={coachPersonaId}
                viewingPhase={canvasViewPhase}
              />
            ) : (
              <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 min-w-0">
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  <p>Loading conversation...</p>
                </div>
              </main>
            )}

            {/* RIGHT: Strategy Canvas (260px desktop, hidden tablet/mobile) */}
            {layout.isCanvasVisible && (
              <StrategyCanvas
                conversationId={conversation?.id ?? null}
                currentPhase={canvasViewPhase || currentPhase}
              />
            )}

            {/* Tablet: Canvas bottom drawer toggle */}
            {layout.breakpoint === 'tablet' && (
              <button
                onClick={layout.toggleMobileCanvas}
                className="fixed bottom-4 right-4 z-30 px-3 py-2 rounded-lg bg-white border border-cyan-200 text-xs font-semibold text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {layout.isMobileCanvasOpen ? 'Close Canvas' : 'Strategy Canvas'}
              </button>
            )}

            {/* Tablet: Canvas bottom drawer */}
            {layout.breakpoint === 'tablet' && layout.isMobileCanvasOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={layout.closeOverlays}
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 h-[300px] bg-white border-t border-slate-200 shadow-2xl rounded-t-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Strategy Canvas
                    </h3>
                    <button
                      onClick={layout.closeOverlays}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(300px - 40px)' }}>
                    <StrategyCanvas
                      conversationId={conversation?.id ?? null}
                      currentPhase={canvasViewPhase || currentPhase}
                      className="w-full !border-0"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CoachJourneyProvider>

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
