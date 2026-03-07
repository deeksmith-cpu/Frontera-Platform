'use client';

import { useState, useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Swords,
  Map,
} from 'lucide-react';
import { getResearchArea, getQuestionByIndex } from '@/lib/agents/strategy-coach/research-questions';
import type { ConfidenceLevel, Territory } from '@/types/coaching-cards';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';

export interface ResearchQuestionPanelHandle {
  replaceAnswer: (text: string) => void;
  appendAnswer: (text: string) => void;
  getCurrentAnswer: () => string;
}

interface ResearchQuestionPanelProps {
  territory: string;
  researchArea: string;
  researchAreaTitle: string;
  questionIndex: number;
  totalQuestions: number;
  existingAnswer: string;
  existingConfidence: ConfidenceLevel | null;
  onSubmit: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  answerRef?: Ref<ResearchQuestionPanelHandle>;
  researchReady?: boolean;
  onBeginSynthesis?: () => void;
  isTransitioning?: boolean;
  researchProgress: ResearchProgressData | null;
}

const TERRITORY_ICONS: Record<string, typeof Building2> = {
  company: Building2,
  customer: Users,
  competitor: Swords,
};

const TERRITORY_COLORS: Record<string, { bg: string; text: string; border: string; label: string; dotBg: string }> = {
  company: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Company', dotBg: 'bg-indigo-500' },
  customer: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Customer', dotBg: 'bg-cyan-500' },
  competitor: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Market', dotBg: 'bg-purple-500' },
};

const CONFIDENCE_OPTIONS: { value: ConfidenceLevel; label: string; description: string }[] = [
  { value: 'data', label: 'Data', description: 'Backed by data or research' },
  { value: 'experience', label: 'Experience', description: 'Based on professional experience' },
  { value: 'guess', label: 'Guess', description: 'Hypothesis or assumption' },
];

export function ResearchQuestionPanel({
  territory,
  researchArea,
  researchAreaTitle,
  questionIndex,
  totalQuestions,
  existingAnswer,
  existingConfidence,
  onSubmit,
  onNextQuestion,
  onPrevQuestion,
  answerRef,
  researchReady = false,
  onBeginSynthesis,
  isTransitioning = false,
  researchProgress,
}: ResearchQuestionPanelProps) {
  const [answer, setAnswer] = useState(existingAnswer);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(existingConfidence);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(answerRef, () => ({
    replaceAnswer: (text: string) => setAnswer(text),
    appendAnswer: (text: string) => setAnswer(prev => {
      if (!prev.trim()) return text;
      return prev.trimEnd() + '\n\n' + text;
    }),
    getCurrentAnswer: () => answer,
  }), [answer]);

  useEffect(() => {
    setAnswer(existingAnswer);
    setConfidence(existingConfidence);
    setJustSaved(false);
  }, [existingAnswer, existingConfidence, territory, researchArea, questionIndex]);

  const question = getQuestionByIndex(
    territory as 'company' | 'customer' | 'competitor',
    researchArea,
    questionIndex,
  );
  const area = getResearchArea(
    territory as 'company' | 'customer' | 'competitor',
    researchArea,
  );

  const tColors = TERRITORY_COLORS[territory] || TERRITORY_COLORS.company;
  const TIcon = TERRITORY_ICONS[territory] || Building2;

  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const success = await onSubmit(answer, confidence);
      if (success) {
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, confidence, isSubmitting, onSubmit]);

  const hasChanges = answer !== existingAnswer || confidence !== existingConfidence;
  const isAnswered = !!answer.trim();
  const isLastQuestion = questionIndex >= totalQuestions - 1;
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  // Build mini progress bars for the title bar
  const progressBars = (() => {
    if (!researchProgress) return [];
    const tp = researchProgress.territories.find(t => t.territory === territory);
    if (!tp) return [];
    const currentArea = tp.areas.find(a => a.id === researchArea);
    if (!currentArea) return [];
    return currentArea.questions.map((q, i) => ({
      index: i,
      status: i === questionIndex ? 'current' : q.answered ? 'filled' : 'empty',
    }));
  })();

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Cyan gradient title bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-3.5 py-2"
        style={{ background: 'linear-gradient(180deg, #0e7490, #0891b2)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center">
            <Map className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-semibold text-white">Strategic Research</span>
          <span className="text-[9px] text-white/60">{tColors.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mini progress bars */}
          <div className="flex gap-0.5">
            {progressBars.map((bar) => (
              <span
                key={bar.index}
                className={`w-3.5 h-[3px] rounded-full ${
                  bar.status === 'current' ? 'bg-[#fbbf24]' :
                  bar.status === 'filled' ? 'bg-emerald-400' :
                  'bg-white/25'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-white/60 font-[family-name:var(--font-code)]">
            Q{questionIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Question header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2.5 border-b border-slate-100">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2">
          <span>Research</span>
          <span>&rsaquo;</span>
          <span className={`${tColors.text} font-medium`}>{tColors.label}</span>
          <span>&rsaquo;</span>
          <span className="text-slate-900 font-semibold">{area?.title || researchArea}</span>
        </div>

        {/* Area badge + counter */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold ${tColors.text} ${tColors.bg} px-2.5 py-1 rounded-full border ${tColors.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tColors.dotBg}`} />
            {area?.title || researchArea}
          </span>
          <span className="text-[10px] font-[family-name:var(--font-code)] text-slate-400">
            Q{questionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-[15px] font-semibold text-slate-900 leading-snug">
          {question?.text || 'Loading question...'}
        </h2>
      </div>

      {/* Think about hint */}
      {area?.description && (
        <div className="flex-shrink-0 mx-4 mt-2.5 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-2.5">
          <p className="text-[11px] text-slate-500">
            <strong className="text-slate-600">Think about:</strong> {area.description}
          </p>
        </div>
      )}

      {/* Answer body — flex-1 to fill remaining space */}
      <div className="flex-1 min-h-0 flex flex-col px-4 py-2.5 overflow-y-auto">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Share your thinking here... Be as specific as possible with examples, data, and context."
          className="flex-1 min-h-[120px] w-full text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
        />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
        </div>

        {/* Confidence selector */}
        <div className="mt-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Confidence Level
          </p>
          <div className="flex gap-2">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfidence(confidence === opt.value ? null : opt.value)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-300 ${
                  confidence === opt.value
                    ? 'bg-[#1a1f3a] text-white'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title={opt.description}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Area complete CTA */}
        {isLastQuestion && isAnswered && !hasChanges && (
          <div className={`mt-3 p-3 border rounded-xl animate-entrance ${
            researchReady
              ? 'bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                {researchReady ? 'Research Complete!' : `${area?.title || 'Area'} Complete!`}
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 mb-2">
              {researchReady
                ? 'All territories mapped. Ready for pattern recognition.'
                : `All ${totalQuestions} questions answered. Great work mapping this area.`
              }
            </p>
            {researchReady && onBeginSynthesis ? (
              <button
                onClick={onBeginSynthesis}
                disabled={isTransitioning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-[#1a1f3a] transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? 'Transitioning...' : 'Begin Pattern Recognition'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onNextQuestion}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-[#1a1f3a] transition-all hover:bg-[#f59e0b] shadow-sm hover:shadow-md"
              >
                Continue to Next Area
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer — nav + submit */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevQuestion}
            disabled={questionIndex === 0}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
            {questionIndex + 1} of {totalQuestions}
          </span>
          <button
            onClick={onNextQuestion}
            disabled={isLastQuestion}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {justSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium animate-entrance">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isAnswered || isSubmitting || !hasChanges}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              isAnswered && hasChanges
                ? 'bg-[#1a1f3a] text-white hover:bg-[#2d3561] shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                {existingAnswer ? 'Update' : 'Submit'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
