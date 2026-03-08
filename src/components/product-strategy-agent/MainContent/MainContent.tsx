'use client';

import { useCallback, useState, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { OrientationView } from '../OrientationView/OrientationView';
import { ResearchSideBySide } from '../ResearchSideBySide/ResearchSideBySide';
import { CelebrationOverlay } from '../CelebrationOverlay/CelebrationOverlay';
import { CoachLedPanel } from '../CoachLedPanel/CoachLedPanel';
import { SynthesisView } from '../SynthesisView/SynthesisView';
import { BetsView } from '../BetsView/BetsView';
import { ActivationView } from '../ActivationView/ActivationView';
import { ReviewView } from '../ReviewView/ReviewView';
import { PhaseTabBar } from '../PhaseTabBar/PhaseTabBar';
import { CompletedPhaseSummary } from '../CompletedPhaseSummary/CompletedPhaseSummary';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import { RESEARCH_AREAS } from '@/hooks/useResearchProgress';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';
import type { GamificationState } from '@/hooks/useGamification';
import type { ConfidenceLevel, Territory } from '@/types/coaching-cards';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface MainContentProps {
  conversation: Conversation;
  userId: string;
  orgId: string;
  activeResearchContext: ActiveResearchContext | null;
  researchProgress: ResearchProgressData | null;
  isCoachDrawerOpen: boolean;
  onToggleCoachDrawer: (open: boolean) => void;
  onTerritoryClickRef?: MutableRefObject<((territory: string) => void) | null>;
  highestPhaseReached: string;
  onPhaseClick: (phase: string) => void;
  coachName?: string;
  coachPersonaId?: string | null;
  gamification?: GamificationState;
  /** When set, user is viewing a different phase than the active one (e.g. clicked Discovery from Research) */
  viewingPhase?: string | null;
}

export function MainContent({
  conversation,
  userId,
  orgId,
  activeResearchContext,
  researchProgress,
  isCoachDrawerOpen,
  onToggleCoachDrawer,
  onTerritoryClickRef,
  highestPhaseReached,
  onPhaseClick,
  coachName: coachNameProp,
  coachPersonaId,
  gamification,
  viewingPhase,
}: MainContentProps) {
  const {
    currentPhase,
    pinnedQuestion,
    setPinnedQuestion,
    orientationDismissed,
    dismissOrientation,
    celebrationState,
    setCelebrationState,
    handleQuestionSubmit,
    handlePhaseTransition,
  } = useCoachJourney();

  const prevProgressRef = useRef<ResearchProgressData | null>(null);

  const coachName = coachNameProp || 'Strategy Coach';

  // The phase to display — either the one the user clicked to view, or the active phase
  const displayPhase = viewingPhase || currentPhase;
  const isViewingOtherPhase = !!viewingPhase && viewingPhase !== currentPhase;

  // Detect if the viewed phase is completed (user has progressed past it)
  const PHASE_ORDER = ['discovery', 'research', 'synthesis', 'bets', 'activation', 'review'];
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  const displayIdx = PHASE_ORDER.indexOf(displayPhase);
  const isCompletedPhase = isViewingOtherPhase && displayIdx < currentIdx;

  // Determine what to show in the main area
  // Phases with dedicated views render directly (no orientation gate needed)
  const showBets = !isCompletedPhase && displayPhase === 'bets';
  const showActivation = !isCompletedPhase && displayPhase === 'activation';
  const showReview = !isCompletedPhase && displayPhase === 'review';
  const showSynthesis = !isCompletedPhase && displayPhase === 'synthesis';
  const hasDedicatedView = showBets || showActivation || showReview || showSynthesis;
  // Only phases without dedicated views get orientation (discovery, research)
  const hasOrientation = !isCompletedPhase && ['discovery', 'research'].includes(displayPhase);
  // When viewing another phase, show orientation unless user dismissed it
  const showOrientation = hasOrientation && (isViewingOtherPhase
    ? !orientationDismissed[displayPhase]
    : !orientationDismissed[currentPhase] && !pinnedQuestion);
  const showPinnedQuestion = !isCompletedPhase && displayPhase === 'research' && pinnedQuestion !== null;
  const showChat = !isCompletedPhase && !hasDedicatedView && !showOrientation && !showPinnedQuestion;

  // Discovery orientation is now shown to users (not auto-dismissed)
  // Users dismiss it by clicking Upload Materials, AI Research, or Start Chat

  // Track research progress changes for celebration triggers
  useEffect(() => {
    if (!researchProgress || !prevProgressRef.current) {
      prevProgressRef.current = researchProgress;
      return;
    }

    const prev = prevProgressRef.current;
    const curr = researchProgress;

    // Check for newly completed areas
    for (const territory of curr.territories) {
      const prevTerritory = prev.territories.find(t => t.territory === territory.territory);
      if (!prevTerritory) continue;

      for (const area of territory.areas) {
        const prevArea = prevTerritory.areas.find(a => a.id === area.id);
        if (prevArea && prevArea.status !== 'mapped' && area.status === 'mapped') {
          // Area just completed!
          setCelebrationState({
            type: 'area_complete',
            territory: territory.territory,
            areaTitle: area.title,
            xpAwarded: 25,
          });
          break;
        }
      }

      // Check for territory completion
      if (prevTerritory.completedAreas < 3 && territory.completedAreas === 3) {
        setCelebrationState({
          type: 'territory_complete',
          territory: territory.territory,
          xpAwarded: 75,
        });
        break;
      }
    }

    prevProgressRef.current = curr;
  }, [researchProgress, setCelebrationState]);

  // Handle territory click from orientation → set first unanswered question
  const handleTerritoryClick = useCallback((territory: string) => {
    const areas = RESEARCH_AREAS[territory as keyof typeof RESEARCH_AREAS];
    if (!areas) return;

    // Find first area with unanswered questions
    const tp = researchProgress?.territories.find(t => t.territory === territory);
    let targetAreaId: string = areas[0].id;
    let targetQuestionIndex = 0;

    if (tp) {
      for (const area of tp.areas) {
        if (area.status !== 'mapped') {
          targetAreaId = area.id;
          const unanswered = area.questions.find(q => !q.answered);
          targetQuestionIndex = unanswered?.index ?? 0;
          break;
        }
      }
    }

    const areaData = getResearchArea(territory as Territory, targetAreaId);

    setPinnedQuestion({
      territory,
      researchArea: targetAreaId,
      researchAreaTitle: areaData?.title || targetAreaId,
      questionIndex: targetQuestionIndex,
      totalQuestions: areaData?.questions.length || 4,
    });

    dismissOrientation('research');
  }, [researchProgress, setPinnedQuestion, dismissOrientation]);

  // Register territory click handler on ref for sidebar forwarding
  useEffect(() => {
    if (onTerritoryClickRef) {
      onTerritoryClickRef.current = handleTerritoryClick;
    }
    return () => {
      if (onTerritoryClickRef) {
        onTerritoryClickRef.current = null;
      }
    };
  }, [onTerritoryClickRef, handleTerritoryClick]);

  // Handle phase transition from orientation
  const handleBeginTerrainMapping = useCallback(() => {
    void handlePhaseTransition('research');
  }, [handlePhaseTransition]);

  // Compute research readiness for synthesis CTA
  const researchReadiness = useMemo(() => {
    if (currentPhase !== 'research' || !researchProgress) return null;
    const territories = researchProgress.territories;
    const perTerritory = {
      company: territories.find(t => t.territory === 'company')?.completedAreas ?? 0,
      customer: territories.find(t => t.territory === 'customer')?.completedAreas ?? 0,
      competitor: territories.find(t => t.territory === 'competitor')?.completedAreas ?? 0,
    };
    const totalMapped = perTerritory.company + perTerritory.customer + perTerritory.competitor;
    const ready = perTerritory.company >= 1 && perTerritory.customer >= 1 && perTerritory.competitor >= 1 && totalMapped >= 4;
    return { ready, totalMapped };
  }, [currentPhase, researchProgress]);

  // Handle research → synthesis transition with celebration
  const [isTransitioning, setIsTransitioning] = useState(false);
  const handleBeginSynthesis = useCallback(async () => {
    setIsTransitioning(true);
    try {
      // Clear research-specific state so synthesis shows its orientation view
      setPinnedQuestion(null);
      await handlePhaseTransition('synthesis');
      setCelebrationState({
        type: 'phase_complete',
        territory: undefined,
        areaTitle: 'Research Phase',
        xpAwarded: 100,
      });
    } finally {
      setIsTransitioning(false);
    }
  }, [handlePhaseTransition, setCelebrationState, setPinnedQuestion]);

  // Handle question submit with celebration detection
  const handleQuestionSubmitWrapped = useCallback(async (
    answer: string,
    confidence: ConfidenceLevel | null,
  ): Promise<boolean> => {
    if (!pinnedQuestion) return false;
    return handleQuestionSubmit(
      pinnedQuestion.territory,
      pinnedQuestion.researchArea,
      pinnedQuestion.questionIndex,
      answer,
      confidence,
    );
  }, [pinnedQuestion, handleQuestionSubmit]);

  // Get existing answer for pinned question
  const getExistingAnswer = useCallback((): { answer: string; confidence: ConfidenceLevel | null } => {
    if (!pinnedQuestion || !researchProgress) return { answer: '', confidence: null };

    const tp = researchProgress.territories.find(t => t.territory === pinnedQuestion.territory);
    if (!tp) return { answer: '', confidence: null };

    const area = tp.areas.find(a => a.id === pinnedQuestion.researchArea);
    if (!area) return { answer: '', confidence: null };

    const q = area.questions[pinnedQuestion.questionIndex];
    return {
      answer: q?.answer || '',
      confidence: (q?.confidence as ConfidenceLevel) || null,
    };
  }, [pinnedQuestion, researchProgress]);

  // Navigate between questions
  const TERRITORY_ORDER: string[] = ['company', 'customer', 'competitor'];

  const handleNextQuestion = useCallback(() => {
    if (!pinnedQuestion) return;
    const { territory, researchArea, questionIndex, totalQuestions } = pinnedQuestion;

    if (questionIndex < totalQuestions - 1) {
      // Next question in same area
      setPinnedQuestion({ ...pinnedQuestion, questionIndex: questionIndex + 1 });
    } else {
      // Move to next area in same territory
      const areas = RESEARCH_AREAS[territory as keyof typeof RESEARCH_AREAS];
      if (!areas) return;
      const currentAreaIndex = areas.findIndex(a => a.id === researchArea);
      if (currentAreaIndex < areas.length - 1) {
        const nextArea = areas[currentAreaIndex + 1];
        const areaData = getResearchArea(territory as Territory, nextArea.id);
        setPinnedQuestion({
          territory,
          researchArea: nextArea.id,
          researchAreaTitle: areaData?.title || nextArea.id,
          questionIndex: 0,
          totalQuestions: areaData?.questions.length || 4,
        });
      } else {
        // Last area in territory — move to next territory
        const currentTerritoryIndex = TERRITORY_ORDER.indexOf(territory);
        if (currentTerritoryIndex < TERRITORY_ORDER.length - 1) {
          const nextTerritory = TERRITORY_ORDER[currentTerritoryIndex + 1];
          const nextAreas = RESEARCH_AREAS[nextTerritory as keyof typeof RESEARCH_AREAS];
          if (nextAreas && nextAreas.length > 0) {
            const firstArea = nextAreas[0];
            const areaData = getResearchArea(nextTerritory as Territory, firstArea.id);
            setPinnedQuestion({
              territory: nextTerritory,
              researchArea: firstArea.id,
              researchAreaTitle: areaData?.title || firstArea.id,
              questionIndex: 0,
              totalQuestions: areaData?.questions.length || 4,
            });
          }
        }
      }
    }
  }, [pinnedQuestion, setPinnedQuestion]);

  const handlePrevQuestion = useCallback(() => {
    if (!pinnedQuestion) return;
    const { territory, researchArea, questionIndex } = pinnedQuestion;

    if (questionIndex > 0) {
      setPinnedQuestion({ ...pinnedQuestion, questionIndex: questionIndex - 1 });
    } else {
      // Move to previous area
      const areas = RESEARCH_AREAS[territory as keyof typeof RESEARCH_AREAS];
      if (!areas) return;
      const currentAreaIndex = areas.findIndex(a => a.id === researchArea);
      if (currentAreaIndex > 0) {
        const prevArea = areas[currentAreaIndex - 1];
        const areaData = getResearchArea(territory as Territory, prevArea.id);
        setPinnedQuestion({
          territory,
          researchArea: prevArea.id,
          researchAreaTitle: areaData?.title || prevArea.id,
          questionIndex: (areaData?.questions.length || 4) - 1,
          totalQuestions: areaData?.questions.length || 4,
        });
      }
    }
  }, [pinnedQuestion, setPinnedQuestion]);

  const existing = getExistingAnswer();

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 min-w-0">
      {/* Phase Tab Bar */}
      <PhaseTabBar
        currentPhase={displayPhase}
        highestPhaseReached={highestPhaseReached}
        onPhaseClick={onPhaseClick}
        gamification={gamification}
      />

      {/* Completed phase summary — shown when viewing a phase the user has moved past */}
      {isCompletedPhase && (
        <CompletedPhaseSummary
          phase={displayPhase}
          conversationId={conversation.id}
          currentPhase={currentPhase}
          onReturnToActive={() => onPhaseClick(currentPhase)}
          researchProgress={researchProgress}
        />
      )}

      {/* Main content area */}
      {!isCompletedPhase && showOrientation && (
        <OrientationView
          phase={displayPhase}
          conversationId={conversation.id}
          researchProgress={researchProgress}
          onDismiss={() => {
            if (isViewingOtherPhase) {
              // Clicking dismiss on a viewed phase returns to the active phase
              onPhaseClick(currentPhase);
            } else {
              dismissOrientation(currentPhase);
            }
          }}
          onBeginTerrainMapping={handleBeginTerrainMapping}
          onTerritoryClick={handleTerritoryClick}
          researchReady={researchReadiness?.ready ?? false}
          onBeginSynthesis={handleBeginSynthesis}
          isTransitioning={isTransitioning}
        />
      )}

      {showPinnedQuestion && pinnedQuestion && (
        <ResearchSideBySide
          pinnedQuestion={pinnedQuestion}
          existingAnswer={existing.answer}
          existingConfidence={existing.confidence}
          onSubmit={handleQuestionSubmitWrapped}
          onNextQuestion={handleNextQuestion}
          onPrevQuestion={handlePrevQuestion}
          conversationId={conversation.id}
          coachName={coachName}
          coachPersonaId={coachPersonaId}
          researchProgress={researchProgress}
          researchReady={researchReadiness?.ready ?? false}
          onBeginSynthesis={() => void handleBeginSynthesis()}
          isTransitioning={isTransitioning}
        />
      )}

      {showSynthesis && (
        <SynthesisView
          conversationId={conversation.id}
          onPhaseTransition={handlePhaseTransition}
        />
      )}

      {showBets && (
        <BetsView
          conversation={conversation}
          onPhaseTransition={handlePhaseTransition}
        />
      )}

      {showActivation && (
        <ActivationView
          conversation={conversation}
          onPhaseTransition={handlePhaseTransition}
        />
      )}

      {showReview && (
        <ReviewView conversation={conversation} />
      )}

      {showChat && (
        <>
          {/* Research Complete banner — shown above chat when ready for synthesis */}
          {researchReadiness?.ready && (
            <div className="flex-shrink-0 px-6 pt-4">
              <div className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-4 animate-entrance">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-slate-900">Research complete — </span>
                    <span className="text-sm text-slate-600">{researchReadiness.totalMapped} areas mapped</span>
                  </div>
                  <button
                    onClick={() => void handleBeginSynthesis()}
                    disabled={isTransitioning}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-50 flex-shrink-0"
                  >
                    {isTransitioning ? 'Transitioning...' : 'Begin Synthesis'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <CoachLedPanel
            conversation={conversation}
            userId={userId}
            orgId={orgId}
            activeResearchContext={activeResearchContext}
          />
        </>
      )}

      {/* Celebration overlay */}
      {celebrationState && (
        <CelebrationOverlay
          type={celebrationState.type}
          territory={celebrationState.territory}
          areaTitle={celebrationState.areaTitle}
          xpAwarded={celebrationState.xpAwarded}
          microSynthesisPreview={celebrationState.microSynthesisPreview}
          onContinue={() => {
            setCelebrationState(null);
            // Auto-advance to next question/area
            if (celebrationState.type === 'area_complete') {
              handleNextQuestion();
            }
          }}
        />
      )}
    </main>
  );
}
