'use client';

import { useState, useCallback, useEffect, useImperativeHandle, type Ref } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Save,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Swords,
} from 'lucide-react';
import { getResearchArea, getQuestionByIndex } from '@/lib/agents/strategy-coach/research-questions';
import type { ConfidenceLevel } from '@/types/coaching-cards';

export interface PinnedQuestionCardHandle {
  replaceAnswer: (text: string) => void;
  appendAnswer: (text: string) => void;
  getCurrentAnswer: () => string;
}

interface PinnedQuestionCardProps {
  territory: string;
  researchArea: string;
  researchAreaTitle: string;
  questionIndex: number;
  totalQuestions: number;
  existingAnswer: string;
  existingConfidence: ConfidenceLevel | null;
  onSubmit: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onCoachSuggestion: () => void;
  onCoachDebate: () => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onSaveDraft: () => void;
  answerRef?: Ref<PinnedQuestionCardHandle>;
}

const TERRITORY_ICONS: Record<string, typeof Building2> = {
  company: Building2,
  customer: Users,
  competitor: Swords,
};

const TERRITORY_COLORS: Record<string, { bg: string; text: string; border: string; borderAccent: string; label: string }> = {
  company: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', borderAccent: 'border-l-indigo-400', label: 'Company' },
  customer: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', borderAccent: 'border-l-cyan-400', label: 'Customer' },
  competitor: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', borderAccent: 'border-l-purple-400', label: 'Market' },
};

const CONFIDENCE_OPTIONS: { value: ConfidenceLevel; label: string; description: string }[] = [
  { value: 'data', label: 'Data', description: 'Backed by data or research' },
  { value: 'experience', label: 'Experience', description: 'Based on professional experience' },
  { value: 'guess', label: 'Guess', description: 'Hypothesis or assumption' },
];

export function PinnedQuestionCard({
  territory,
  researchArea,
  questionIndex,
  totalQuestions,
  existingAnswer,
  existingConfidence,
  onSubmit,
  onCoachSuggestion,
  onCoachDebate,
  onNextQuestion,
  onPrevQuestion,
  answerRef,
}: PinnedQuestionCardProps) {
  const [answer, setAnswer] = useState(existingAnswer);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(existingConfidence);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Expose answer manipulation to parent via ref
  useImperativeHandle(answerRef, () => ({
    replaceAnswer: (text: string) => setAnswer(text),
    appendAnswer: (text: string) => setAnswer(prev => {
      if (!prev.trim()) return text;
      return prev.trimEnd() + '\n\n' + text;
    }),
    getCurrentAnswer: () => answer,
  }), [answer]);

  // Sync when navigating between questions
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

  return (
    <div className={`animate-entrance`}>
      {/* Question card */}
      <div className={`bg-white border-2 ${tColors.border} rounded-2xl p-6 shadow-md`}>
        {/* Breadcrumb trail */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4">
          <span className="hover:text-slate-600 cursor-pointer">Research</span>
          <span>&rsaquo;</span>
          <span className={`${tColors.text} font-medium`}>{tColors.label}</span>
          <span>&rsaquo;</span>
          <span className="text-slate-900 font-semibold">{area?.title || researchArea}</span>
        </div>

        {/* Question card header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold ${tColors.text} ${tColors.bg} px-2.5 py-1 rounded-full border ${tColors.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tColors.text === 'text-indigo-700' ? 'bg-indigo-500' : tColors.text === 'text-cyan-700' ? 'bg-cyan-500' : 'bg-purple-500'}`} />
            {area?.title || researchArea}
          </span>
          <span className="text-[10px] font-[family-name:var(--font-code)] text-slate-400">
            Q{questionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-lg font-semibold text-slate-900 leading-snug mb-3">
          {question?.text || 'Loading question...'}
        </h2>

        {/* Think about hint box */}
        {area?.description && (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mb-5">
            <p className="text-[11px] text-slate-500">
              <strong className="text-slate-600">Think about:</strong> {area.description}
            </p>
          </div>
        )}

        {/* Answer textarea */}
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Share your thinking here... Be as specific as possible with examples, data, and context."
            className="w-full min-h-[180px] text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-y transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
            rows={8}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </div>
        </div>

        {/* Confidence selector */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Confidence Level
          </p>
          <div className="flex gap-2">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfidence(confidence === opt.value ? null : opt.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
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

        {/* Coach assistance buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCoachSuggestion}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#fbbf24] text-xs font-semibold text-[#1a1f3a] transition-all hover:bg-[#f59e0b] shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Coach Suggestion
          </button>
          <button
            onClick={onCoachDebate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-300 bg-white text-xs font-semibold text-cyan-700 transition-all hover:bg-cyan-50 hover:border-cyan-400"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            Challenge Me
          </button>
        </div>

      {/* Bottom action bar — inside card */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevQuestion}
            disabled={questionIndex === 0}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
            {questionIndex + 1} of {totalQuestions}
          </span>
          <button
            onClick={onNextQuestion}
            disabled={questionIndex >= totalQuestions - 1}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next question"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Submit */}
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
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
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
                {existingAnswer ? 'Update Answer' : 'Submit Answer'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Area complete CTA — shown when on last question and it's been answered */}
      {isLastQuestion && isAnswered && !hasChanges && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-entrance">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              {area?.title || 'Area'} Complete!
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 mb-3">
            All {totalQuestions} questions answered. Great work mapping this area.
          </p>
          <button
            onClick={onNextQuestion}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fbbf24] text-xs font-semibold text-[#1a1f3a] transition-all hover:bg-[#f59e0b] shadow-sm hover:shadow-md"
          >
            Continue to Next Area
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

