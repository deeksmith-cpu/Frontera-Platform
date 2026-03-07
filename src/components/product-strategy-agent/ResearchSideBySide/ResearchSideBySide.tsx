'use client';

import { useCallback, useRef } from 'react';
import { ResearchQuestionPanel, type ResearchQuestionPanelHandle } from './ResearchQuestionPanel';
import { ResearchCoachPanel } from './ResearchCoachPanel';
import type { ConfidenceLevel } from '@/types/coaching-cards';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';

interface PinnedQuestion {
  territory: string;
  researchArea: string;
  researchAreaTitle: string;
  questionIndex: number;
  totalQuestions: number;
}

interface ResearchSideBySideProps {
  pinnedQuestion: PinnedQuestion;
  existingAnswer: string;
  existingConfidence: ConfidenceLevel | null;
  onSubmit: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  conversationId: string | null;
  coachName: string;
  coachPersonaId?: string | null;
  researchProgress: ResearchProgressData | null;
  researchReady: boolean;
  onBeginSynthesis: () => void;
  isTransitioning: boolean;
}

export function ResearchSideBySide({
  pinnedQuestion,
  existingAnswer,
  existingConfidence,
  onSubmit,
  onNextQuestion,
  onPrevQuestion,
  conversationId,
  coachName,
  coachPersonaId,
  researchProgress,
  researchReady,
  onBeginSynthesis,
  isTransitioning,
}: ResearchSideBySideProps) {
  const questionPanelRef = useRef<ResearchQuestionPanelHandle>(null);

  // Handle coach content insertion into the answer textarea
  const handleInsertToAnswer = useCallback((text: string, insertMode: 'replace' | 'append') => {
    if (!questionPanelRef.current) return;
    if (insertMode === 'replace') {
      questionPanelRef.current.replaceAnswer(text);
    } else {
      questionPanelRef.current.appendAnswer(text);
    }
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 p-3 overflow-hidden animate-entrance">
      {/* Question Panel (left) */}
      <ResearchQuestionPanel
        territory={pinnedQuestion.territory}
        researchArea={pinnedQuestion.researchArea}
        researchAreaTitle={pinnedQuestion.researchAreaTitle}
        questionIndex={pinnedQuestion.questionIndex}
        totalQuestions={pinnedQuestion.totalQuestions}
        existingAnswer={existingAnswer}
        existingConfidence={existingConfidence}
        onSubmit={onSubmit}
        onNextQuestion={onNextQuestion}
        onPrevQuestion={onPrevQuestion}
        answerRef={questionPanelRef}
        researchReady={researchReady}
        onBeginSynthesis={onBeginSynthesis}
        isTransitioning={isTransitioning}
        researchProgress={researchProgress}
      />

      {/* Coach Panel (right) */}
      <ResearchCoachPanel
        territory={pinnedQuestion.territory}
        researchArea={pinnedQuestion.researchArea}
        questionIndex={pinnedQuestion.questionIndex}
        existingAnswer={existingAnswer}
        conversationId={conversationId}
        coachName={coachName}
        coachPersonaId={coachPersonaId}
        questionPanelRef={questionPanelRef}
        onInsertToAnswer={handleInsertToAnswer}
      />
    </div>
  );
}
