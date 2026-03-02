'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Loader2,
  Check,
  Database,
  Lightbulb,
  HelpCircle,
  Sparkles,
  MessageSquare,
  RotateCcw,
  Wand2,
} from 'lucide-react';
import type {
  BetQuestionCardData,
  BetFieldType,
  ConfidenceLevel,
  CardAction,
  CoachReview,
} from '@/types/coaching-cards';
import { CoachReviewPanel } from './CoachReviewPanel';

interface BetQuestionCardProps {
  data: BetQuestionCardData;
  conversationId: string;
  onSubmit: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onAction?: (action: CardAction) => void;
}

const BET_FIELD_STYLES: Record<BetFieldType, {
  badgeBg: string;
  badgeText: string;
  border: string;
  label: string;
}> = {
  belief: {
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-600',
    border: 'border-purple-200',
    label: 'Belief',
  },
  implication: {
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-600',
    border: 'border-amber-200',
    label: 'Implication',
  },
  exploration: {
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-600',
    border: 'border-emerald-200',
    label: 'Exploration',
  },
  successMetric: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-600',
    border: 'border-cyan-200',
    label: 'Success Metric',
  },
};

const CONFIDENCE_OPTIONS: Array<{
  value: ConfidenceLevel;
  label: string;
  icon: typeof Database;
  activeClass: string;
}> = [
  {
    value: 'data',
    label: 'Data-backed',
    icon: Database,
    activeClass: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  },
  {
    value: 'experience',
    label: 'Experience',
    icon: Lightbulb,
    activeClass: 'bg-amber-100 border-amber-300 text-amber-700',
  },
  {
    value: 'guess',
    label: 'Best guess',
    icon: HelpCircle,
    activeClass: 'bg-slate-100 border-slate-300 text-slate-600',
  },
];

/**
 * BetQuestionCard -- Prepopulated strategic bet question form
 *
 * Renders in the coaching chat stream during the Strategic Bets phase.
 * Unlike the standard QuestionCard, the textarea comes PRE-FILLED with a
 * coach suggestion derived from synthesis results. The user can edit the
 * suggestion before submitting.
 *
 * Features:
 * - Synthesis territory badge (always cyan)
 * - Bet field type badge (belief / implication / exploration / successMetric)
 * - Pre-populated textarea with distinct visual treatment
 * - "Reset to suggestion" button to restore original text
 * - Source attribution for the suggestion
 * - Confidence rating selector
 * - Coach review integration
 * - Submit button with loading/success states
 */
export function BetQuestionCard({
  data,
  conversationId,
  onSubmit,
  onAction,
}: BetQuestionCardProps) {
  const originalAnswer = useRef(data.prepopulated_answer);
  const [answer, setAnswer] = useState(data.prepopulated_answer);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [coachReview, setCoachReview] = useState<CoachReview | null>(null);

  const betFieldStyles = BET_FIELD_STYLES[data.bet_field];
  const isModified = answer !== originalAnswer.current;

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onSubmit(answer, confidence);
      if (success) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error('Error submitting bet answer:', err);
      setError('Failed to save answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, confidence, onSubmit]);

  const handleResetToSuggestion = useCallback(() => {
    setAnswer(originalAnswer.current);
    setError(null);
  }, []);

  // Request coach review of current draft
  const handleRequestReview = useCallback(async () => {
    if (!answer.trim()) {
      setError('Please write something before requesting a review');
      return;
    }

    setIsReviewing(true);
    setError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/coach-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory: data.territory,
          research_area: data.research_area,
          question_index: data.question_index,
          draft_answer: answer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get coach review');
      }

      const review: CoachReview = await response.json();
      setCoachReview(review);
    } catch (err) {
      console.error('Error getting coach review:', err);
      setError('Failed to get coach review. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  }, [answer, conversationId, data.territory, data.research_area, data.question_index]);

  // Apply the coach's suggested revision to the textarea
  const handleApplyRevision = useCallback(() => {
    if (coachReview?.suggestedRevision) {
      setAnswer(coachReview.suggestedRevision);
      setCoachReview(null);
    }
  }, [coachReview]);

  // Dismiss the review panel
  const handleDismissReview = useCallback(() => {
    setCoachReview(null);
  }, []);

  // Ask coach for help via a card action
  const handleAskCoach = useCallback(() => {
    onAction?.({
      cardId: data.id,
      action: 'ask_coach_suggestion',
      payload: {
        territory: data.territory,
        research_area: data.research_area,
        question_index: data.question_index,
        question: data.question,
        bet_field: data.bet_field,
        conversationId,
      },
    });
  }, [data, conversationId, onAction]);

  // Success state
  if (submitSuccess) {
    return (
      <div className="question-card-success rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 animate-entrance">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Answer Submitted</p>
            <p className="text-xs text-emerald-600">
              {betFieldStyles.label} -- Q{data.question_index + 1} of {data.total_questions}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bet-question-card relative overflow-hidden
        rounded-2xl border-2 border-cyan-200 bg-white
        p-5 sm:p-6
        animate-entrance
        transition-all duration-300
        shadow-sm hover:shadow-md
      `}
    >
      {/* Territory + Bet Field Badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-cyan-50 text-cyan-600 border-cyan-200">
          Synthesis
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${betFieldStyles.badgeBg} ${betFieldStyles.badgeText} ${betFieldStyles.border}`}>
          {betFieldStyles.label}
        </span>
      </div>

      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg
            flex items-center justify-center
            bg-[#1a1f3a] text-[#fbbf24]
            font-bold text-sm
          `}
        >
          {data.question_index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-slate-900 leading-relaxed">
            {data.question}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Question {data.question_index + 1} of {data.total_questions}
          </p>
        </div>
      </div>

      {/* Pre-populated Answer Textarea */}
      <div className="mb-4">
        {/* Suggestion label */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-xs text-cyan-600 italic">
              Coach suggestion -- edit as needed
            </span>
          </div>
          {isModified && (
            <button
              onClick={handleResetToSuggestion}
              disabled={isSubmitting}
              className="
                flex items-center gap-1 px-2 py-1
                rounded-md text-xs font-medium
                text-slate-500 hover:text-slate-700
                hover:bg-slate-100
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <RotateCcw className="w-3 h-3" />
              Reset to suggestion
            </button>
          )}
        </div>

        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(null);
          }}
          placeholder="Edit the suggestion or write your own..."
          rows={5}
          disabled={isSubmitting}
          className={`
            w-full px-4 py-3
            border-2 border-slate-200 rounded-xl
            border-l-4 border-l-cyan-300
            bg-cyan-50
            text-sm text-slate-900
            resize-none leading-relaxed
            transition-all duration-200
            placeholder:text-slate-400
            focus:outline-none focus:border-[#fbbf24] focus:border-l-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 focus:bg-white
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
          `}
        />

        {/* Source attribution */}
        {data.prepopulated_source && (
          <p className="mt-1.5 text-xs text-slate-400">
            Based on: {data.prepopulated_source}
          </p>
        )}
      </div>

      {/* Confidence Rating */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Confidence Level
        </label>
        <div className="flex gap-2">
          {CONFIDENCE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isActive = confidence === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setConfidence(isActive ? null : opt.value)}
                disabled={isSubmitting}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5
                  rounded-lg border text-xs font-medium
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isActive
                    ? opt.activeClass
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Coach Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAskCoach}
          disabled={isSubmitting || isReviewing}
          className={`
            flex items-center gap-2 flex-1
            px-4 py-2.5 rounded-xl
            border border-cyan-200 bg-cyan-50
            text-cyan-700 text-sm font-medium
            transition-all duration-200
            hover:bg-cyan-100 hover:border-cyan-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Coach</span>
        </button>

        <button
          onClick={handleRequestReview}
          disabled={isSubmitting || isReviewing || !answer.trim()}
          className={`
            flex items-center gap-2 flex-1
            px-4 py-2.5 rounded-xl
            border border-indigo-200 bg-indigo-50
            text-indigo-700 text-sm font-medium
            transition-all duration-200
            hover:bg-indigo-100 hover:border-indigo-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isReviewing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Reviewing...</span>
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              <span>Review My Draft</span>
            </>
          )}
        </button>
      </div>

      {/* Coach Review Panel */}
      {coachReview && (
        <div className="mt-4">
          <CoachReviewPanel
            review={coachReview}
            onApplySuggestion={handleApplyRevision}
            onDismiss={handleDismissReview}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !answer.trim()}
          className={`
            inline-flex items-center gap-2
            px-6 py-2.5 rounded-lg
            text-sm font-semibold
            shadow-md
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2
            disabled:cursor-not-allowed
            bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg disabled:opacity-50
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Submit Answer</span>
          )}
        </button>
      </div>
    </div>
  );
}
