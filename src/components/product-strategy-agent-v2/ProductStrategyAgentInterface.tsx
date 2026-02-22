'use client';

import { useCallback, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import posthog from 'posthog-js';
import { LeftSidebar } from './LeftSidebar/LeftSidebar';
import { PhaseIndicator } from './LeftSidebar/PhaseIndicator';
import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { LiveCanvas } from './LiveCanvas/LiveCanvas';
import { useStrategyLayout } from '@/hooks/useStrategyLayout';
import { useLiveCanvasData } from '@/hooks/useLiveCanvasData';
import { useGamification } from '@/hooks/useGamification';
import type { XPAwardResult } from '@/hooks/useGamification';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';
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

// Default territory progress when no data loaded yet
const DEFAULT_TERRITORY_PROGRESS = {
  company: { mapped: 0, total: 3 },
  customer: { mapped: 0, total: 3 },
  competitor: { mapped: 0, total: 3 },
};

export function ProductStrategyAgentInterface({
  conversation,
  userId,
  orgId,
  clientContext: initialClientContext,
}: ProductStrategyAgentInterfaceProps) {
  const [clientContext, setClientContext] = useState(initialClientContext);
  const [activeResearchContext, setActiveResearchContext] = useState<ActiveResearchContext | null>(null);
  const [territoryProgress, setTerritoryProgress] = useState(DEFAULT_TERRITORY_PROGRESS);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(null);
  const [xpNotifications, setXpNotifications] = useState<XPAwardResult[]>([]);

  const layout = useStrategyLayout();
  const canvasData = useLiveCanvasData(conversation?.id || null);
  const gamification = useGamification((result) => {
    setXpNotifications(prev => [...prev, result]);
    // Auto-dismiss after 3s
    setTimeout(() => setXpNotifications(prev => prev.slice(1)), 3000);
  });

  // Fetch active persona
  useEffect(() => {
    async function fetchPersona() {
      try {
        const res = await fetch('/api/product-strategy-agent-v2/persona');
        if (res.ok) {
          const data = await res.json();
          if (data.persona) {
            setActivePersonaId(data.persona as PersonaId);
          }
        }
      } catch (err) {
        console.error('Failed to fetch persona:', err);
      }
    }
    fetchPersona();
  }, []);

  // Extract current phase from conversation framework_state
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const phase = frameworkState?.currentPhase as string | undefined;
  const VALID_PHASES = ['research', 'synthesis', 'bets', 'planning', 'activation', 'review'];
  const currentPhase: string = phase && VALID_PHASES.includes(phase) ? phase : 'discovery';

  // Fetch territory progress
  useEffect(() => {
    if (!conversation?.id) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `/api/product-strategy-agent-v2/context-awareness?conversation_id=${conversation.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.territoryProgress) {
            const tp = data.territoryProgress;
            setTerritoryProgress({
              company: {
                mapped: (tp.company?.mapped || 0) + (tp.company?.inProgress || 0),
                total: tp.company?.total || 3,
              },
              customer: {
                mapped: (tp.customer?.mapped || 0) + (tp.customer?.inProgress || 0),
                total: tp.customer?.total || 3,
              },
              competitor: {
                mapped: (tp.competitor?.mapped || 0) + (tp.competitor?.inProgress || 0),
                total: tp.competitor?.total || 3,
              },
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch territory progress:', err);
      }
    };

    fetchProgress();
    // Poll for updates
    const interval = setInterval(fetchProgress, 15000);
    return () => clearInterval(interval);
  }, [conversation?.id]);

  // Handle territory click from sidebar
  const handleTerritoryClick = useCallback((territory: 'company' | 'customer' | 'competitor') => {
    posthog.capture('sidebar_territory_clicked', { territory });
    setActiveResearchContext({
      territory,
      researchAreaId: null,
      researchAreaTitle: null,
      focusedQuestionIndex: null,
      currentQuestion: null,
      draftResponse: null,
      currentResponses: {},
      updatedAt: Date.now(),
    });
  }, []);

  // Handle phase navigation click — no useCallback needed since it triggers a full page reload
  const handlePhaseClick = async (phaseId: string) => {
    if (!conversation?.id || phaseId === currentPhase) return;
    posthog.capture('phase_nav_clicked', { phase: phaseId });
    try {
      const res = await fetch('/api/product-strategy-agent-v2/phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversation.id, phase: phaseId }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to change phase:', err);
    }
  };

  // Active territory derived from research context
  const activeTerritory = activeResearchContext?.territory || null;

  return (
    <div className="product-strategy-agent h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfeff 100%)' }}>
      {/* FULL-WIDTH TITLE BAR */}
      <header className="flex items-center justify-between px-4 md:px-6 py-2 text-white flex-shrink-0 border-b-2 border-[#fbbf24]/30 animate-entrance-down" style={{ background: 'linear-gradient(180deg, #1e2440 0%, #151930 100%)' }}>
        {/* Left: hamburger (mobile) + F icon + stacked title */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          {!layout.isSidebarOpen && (
            <button
              onClick={layout.toggleMobileDrawer}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Open navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}

          <Link href="/dashboard" className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <Image
              src="/frontera-logo-white.jpg"
              alt="Frontera"
              width={120}
              height={40}
              className="h-7 sm:h-8 w-auto"
            />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-[300px] leading-tight">
              {(conversation?.title as string) || 'New Strategy Session'}
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-semibold leading-tight">
              Strategy Coach V2
            </p>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          {/* Canvas toggle (desktop) */}
          {layout.breakpoint === 'desktop' && (
            <button
              onClick={layout.toggleCanvas}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                layout.isCanvasVisible
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={layout.isCanvasVisible ? 'Hide canvas' : 'Show canvas'}
              title={layout.isCanvasVisible ? 'Hide canvas' : 'Show canvas'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
          )}

          {/* Mobile canvas trigger */}
          {layout.breakpoint !== 'desktop' && (
            <button
              onClick={layout.toggleMobileCanvas}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Open strategy canvas"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </button>
          )}

          {/* Bookmark */}
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Bookmark"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Settings */}
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* CONTENT AREA: 3-panel below title bar */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT SIDEBAR (~20%) - Hidden on mobile, icon-only on tablet */}
        {layout.isSidebarOpen && (
          <LeftSidebar
            currentPhase={currentPhase}
            personaId={activePersonaId}
            territoryProgress={territoryProgress}
            activeTerritory={activeTerritory}
            onTerritoryClick={handleTerritoryClick}
            isIconOnly={layout.isSidebarIconOnly}
            gamification={{
              level: gamification.level,
              xpTotal: gamification.xpTotal,
              xpForNextLevel: gamification.xpForNextLevel,
              progressInLevel: gamification.progressInLevel,
              achievements: gamification.achievements,
            }}
          />
        )}

        {/* CENTRE COACHING PANEL (~50%) - Always visible */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white min-w-0 animate-entrance animate-delay-150">
          {/* Phase navigation bar */}
          <PhaseIndicator currentPhase={currentPhase} variant="topbar" onPhaseClick={handlePhaseClick} />

          {/* Coaching chat */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {conversation ? (
              <CoachingPanel
                conversation={conversation}
                userId={userId}
                orgId={orgId}
                mode="sidepanel"
                variant="centre"
                activeResearchContext={activeResearchContext}
                onResearchCapture={canvasData.refresh}
                onAwardXP={gamification.awardXP}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                <p>Loading conversation...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT LIVE CANVAS (~30%) - Desktop only */}
        {layout.isCanvasVisible && (
          <div className="w-[30%] flex-shrink-0 hidden lg:flex animate-entrance animate-delay-300">
            <LiveCanvas
              currentPhase={currentPhase}
              territoryProgress={territoryProgress}
              activeTerritory={activeTerritory}
              conversationId={conversation?.id || null}
              synthesis={canvasData.synthesis}
              bets={canvasData.bets}
              isLoading={canvasData.isLoading}
            />
          </div>
        )}
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {layout.isMobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={layout.closeOverlays}
          />
          <div className="fixed top-0 left-0 bottom-0 w-64 z-50 lg:hidden shadow-2xl animate-slide-in-left">
            <div className="h-full flex flex-col">
              {/* Close button overlaid on sidebar */}
              <button
                onClick={layout.toggleMobileDrawer}
                className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close navigation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <LeftSidebar
                currentPhase={currentPhase}
                personaId={activePersonaId}
                territoryProgress={territoryProgress}
                activeTerritory={activeTerritory}
                onTerritoryClick={(territory) => {
                  handleTerritoryClick(territory);
                  layout.closeOverlays();
                }}
                isIconOnly={false}
                gamification={{
                  level: gamification.level,
                  xpTotal: gamification.xpTotal,
                  xpForNextLevel: gamification.xpForNextLevel,
                  progressInLevel: gamification.progressInLevel,
                  achievements: gamification.achievements,
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* MOBILE CANVAS OVERLAY */}
      {layout.isMobileCanvasOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={layout.closeOverlays}
          />
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] z-50 lg:hidden shadow-2xl animate-slide-in-right">
            <div className="h-full flex flex-col">
              {/* Close button */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 flex-shrink-0">
                <span className="text-sm font-semibold text-slate-700">Strategy Canvas</span>
                <button
                  onClick={layout.toggleMobileCanvas}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close canvas"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <LiveCanvas
                  currentPhase={currentPhase}
                  territoryProgress={territoryProgress}
                  activeTerritory={activeTerritory}
                  conversationId={conversation?.id || null}
                  synthesis={canvasData.synthesis}
                  bets={canvasData.bets}
                  isLoading={canvasData.isLoading}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* XP Notifications */}
      {xpNotifications.length > 0 && (
        <div className="fixed top-16 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
          {xpNotifications.map((n, i) => (
            <div key={i} className="pointer-events-auto animate-[slideInRight_0.3s_ease-out]">
              <div className="flex items-center gap-2 bg-[#1a1f3a] text-white rounded-xl px-4 py-2.5 shadow-lg border border-[#fbbf24]/30">
                <span className="text-[#fbbf24] font-bold text-sm">+{n.xpAwarded} XP</span>
                {n.levelUp && (
                  <span className="text-xs bg-[#fbbf24] text-slate-900 font-bold px-2 py-0.5 rounded-full">
                    Level {n.levelUp.newLevel}!
                  </span>
                )}
                {n.newAchievements.map(id => (
                  <span key={id} className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                    {id.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
