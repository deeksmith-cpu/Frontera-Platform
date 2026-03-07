'use client';

import { useCallback, useState, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCoachJourney } from '@/hooks/useCoachJourney';
import { OrientationView } from '../OrientationView/OrientationView';
import { PinnedQuestionCard, type PinnedQuestionCardHandle } from '../PinnedQuestionCard/PinnedQuestionCard';
import { CoachDrawer } from '../CoachDrawer/CoachDrawer';
import { CelebrationOverlay } from '../CelebrationOverlay/CelebrationOverlay';
import { CoachLedPanel } from '../CoachLedPanel/CoachLedPanel';
import { PhaseTabBar } from '../PhaseTabBar/PhaseTabBar';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import { getCoachAvatarPath } from '@/lib/agents/strategy-coach/personas';
import { RESEARCH_AREAS } from '@/hooks/useResearchProgress';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';
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

  const [coachDrawerMode, setCoachDrawerMode] = useState<'suggestion' | 'debate' | 'chat'>('suggestion');
  const [liveDraft, setLiveDraft] = useState<string>('');
  const prevProgressRef = useRef<ResearchProgressData | null>(null);
  const pinnedQuestionRef = useRef<PinnedQuestionCardHandle>(null);

  const coachName = coachNameProp || 'Strategy Coach';

  // Handle coach content insertion into the answer textarea
  const handleInsertToAnswer = useCallback((text: string, insertMode: 'replace' | 'append') => {
    if (!pinnedQuestionRef.current) return;
    if (insertMode === 'replace') {
      pinnedQuestionRef.current.replaceAnswer(text);
    } else {
      pinnedQuestionRef.current.appendAnswer(text);
    }
  }, []);

  // The phase to display — either the one the user clicked to view, or the active phase
  const displayPhase = viewingPhase || currentPhase;
  const isViewingOtherPhase = !!viewingPhase && viewingPhase !== currentPhase;

  // Determine what to show in the main area
  // When viewing another phase, show orientation unless user dismissed it (e.g. clicked Upload/AI Research)
  const showOrientation = isViewingOtherPhase
    ? !orientationDismissed[displayPhase]
    : !orientationDismissed[currentPhase] && !pinnedQuestion;
  const showPinnedQuestion = !isViewingOtherPhase && currentPhase === 'research' && pinnedQuestion !== null;
  const showChat = !showOrientation && !showPinnedQuestion;

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

  // Coach drawer handlers — capture live draft from PinnedQuestionCard ref
  const handleCoachSuggestion = useCallback(() => {
    const currentAnswer = pinnedQuestionRef.current?.getCurrentAnswer() || existing.answer;
    setLiveDraft(currentAnswer);
    setCoachDrawerMode('suggestion');
    onToggleCoachDrawer(true);
  }, [onToggleCoachDrawer, existing.answer]);

  const handleCoachDebate = useCallback(() => {
    const currentAnswer = pinnedQuestionRef.current?.getCurrentAnswer() || existing.answer;
    setLiveDraft(currentAnswer);
    setCoachDrawerMode('debate');
    onToggleCoachDrawer(true);
  }, [onToggleCoachDrawer, existing.answer]);

  // Memoize questionContext to prevent new object reference every render
  // which would cause CoachDrawer's useEffect to re-fire and abort requests
  // liveDraft is captured at button-click time (not on every keystroke) to avoid re-triggers
  const questionContext = useMemo(() => {
    if (!pinnedQuestion) return null;
    return {
      territory: pinnedQuestion.territory,
      researchArea: pinnedQuestion.researchArea,
      questionIndex: pinnedQuestion.questionIndex,
      currentDraft: liveDraft || existing.answer,
    };
  }, [pinnedQuestion?.territory, pinnedQuestion?.researchArea, pinnedQuestion?.questionIndex, liveDraft, existing.answer, pinnedQuestion]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 min-w-0">
      {/* Phase Tab Bar */}
      <PhaseTabBar
        currentPhase={displayPhase}
        highestPhaseReached={highestPhaseReached}
        onPhaseClick={onPhaseClick}
      />

      {/* Main content area */}
      {showOrientation && (
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
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <PinnedQuestionCard
              territory={pinnedQuestion.territory}
              researchArea={pinnedQuestion.researchArea}
              researchAreaTitle={pinnedQuestion.researchAreaTitle}
              questionIndex={pinnedQuestion.questionIndex}
              totalQuestions={pinnedQuestion.totalQuestions}
              existingAnswer={existing.answer}
              existingConfidence={existing.confidence}
              onSubmit={handleQuestionSubmitWrapped}
              onCoachSuggestion={handleCoachSuggestion}
              onCoachDebate={handleCoachDebate}
              onNextQuestion={handleNextQuestion}
              onPrevQuestion={handlePrevQuestion}
              onSaveDraft={() => {}}
              answerRef={pinnedQuestionRef}
              researchReady={researchReadiness?.ready ?? false}
              onBeginSynthesis={() => void handleBeginSynthesis()}
              isTransitioning={isTransitioning}
            />

            {/* Coach Drawer — inline card below question */}
            <CoachDrawer
              isOpen={isCoachDrawerOpen}
              mode={coachDrawerMode}
              onClose={() => onToggleCoachDrawer(false)}
              questionContext={questionContext}
              conversationId={conversation.id}
              coachName={coachName}
              coachPersonaId={coachPersonaId}
              onInsertToAnswer={handleInsertToAnswer}
            />

            {/* Minimized coach bar — shown when drawer is closed */}
            {!isCoachDrawerOpen && (
              <button
                onClick={() => {
                  setCoachDrawerMode('chat');
                  onToggleCoachDrawer(true);
                }}
                className="mt-4 w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const avatarPath = getCoachAvatarPath(coachPersonaId ?? undefined);
                    return avatarPath ? (
                      <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={avatarPath} alt={coachName} width={28} height={28} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-[#2d3561] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-[#fbbf24]" />
                      </div>
                    );
                  })()}
                  <div className="text-left">
                    <span className="text-xs font-semibold text-[#1a1f3a]">{coachName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">ready to help</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Ctrl+Shift+K</span>
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            )}
          </div>
        </div>
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
