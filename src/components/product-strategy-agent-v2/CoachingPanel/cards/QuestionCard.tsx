'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2, Check } from 'lucide-react';
import type { QuestionCardData, ConfidenceLevel, CoachReview, Territory } from '@/types/coaching-cards';
import { ConfidenceRating } from '../../CanvasPanel/ConfidenceRating';
import { InlineCoachBar } from '../../CanvasPanel/InlineCoachBar';
import { CoachReviewPanel } from './CoachReviewPanel';

interface QuestionCardProps {
  data: QuestionCardData;
  conversationId: string;
  onSubmit: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onRequestReview?: (draftAnswer: string) => Promise<CoachReview | null>;
  existingAnswer?: string;
  existingConfidence?: ConfidenceLevel | null;
  isEditMode?: boolean;
  onCancel?: () => void;
}

const TERRITORY_STYLES: Record<Territory, {
  badgeBg: string;
  badgeText: string;
  border: string;
  accentFrom: string;
  accentTo: string;
}> = {
  company: {
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    border: 'border-indigo-200',
    accentFrom: 'from-[#1a1f3a]',
    accentTo: 'to-[#2d3561]',
  },
  customer: {
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    border: 'border-amber-200',
    accentFrom: 'from-[#fbbf24]',
    accentTo: 'to-[#f59e0b]',
  },
  competitor: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-600',
    border: 'border-cyan-200',
    accentFrom: 'from-[#0891b2]',
    accentTo: 'to-[#0e7490]',
  },
};

/**
 * QuestionCard - Interactive form card for research questions
 *
 * Features:
 * - Question display with territory-specific styling
 * - Textarea for user's answer
 * - Confidence rating selector
 * - "Ask Coach for Suggestion" (InlineCoachBar)
 * - "Review My Draft Answer" for critical assessment
 * - Submit button with loading state
 */
export function QuestionCard({
  data,
  conversationId,
  onSubmit,
  onRequestReview,
  existingAnswer = '',
  existingConfidence = null,
  isEditMode = false,
  onCancel,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState(existingAnswer);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(existingConfidence);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [coachReview, setCoachReview] = useState<CoachReview | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = TERRITORY_STYLES[data.territory];

  // Handle suggestion application from InlineCoachBar
  const handleApplySuggestion = useCallback((_questionIndex: number, text: string) => {
    setAnswer((prev) => (prev ? `${prev}\n\n${text}` : text));
  }, []);

  // Handle review request
  const handleRequestReview = useCallback(async () => {
    if (!answer.trim() || !onRequestReview) {
      setError('Please write something before requesting a review');
      return;
    }

    setIsReviewing(true);
    setError(null);

    try {
      const review = await onRequestReview(answer);
      if (review) {
        setCoachReview(review);
      }
    } catch (err) {
      console.error('Error getting review:', err);
      setError('Failed to get coach review. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  }, [answer, onRequestReview]);

  // Apply revision from coach review
  const handleApplyRevision = useCallback(() => {
    if (coachReview?.suggestedRevision) {
      setAnswer(coachReview.suggestedRevision);
      setCoachReview(null);
    }
  }, [coachReview]);

  // Clear review
  const handleClearReview = useCallback(() => {
    setCoachReview(null);
  }, []);

  // Handle submit
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
        // Brief success animation before the card collapses
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 1000);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to save answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, confidence, onSubmit]);

  return (
    <div
      className={`
        question-card relative overflow-hidden
        rounded-2xl border-2 border-cyan-200 bg-white
        p-5 sm:p-6
        animate-entrance
        transition-all duration-300
        shadow-sm hover:shadow-md
      `}
    >
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg
            flex items-center justify-center
            ${styles.badgeBg} ${styles.badgeText}
            font-bold text-sm
          `}
        >
          {data.question_index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base text-slate-900 leading-relaxed">
            {data.question}
          </p>
          {data.research_area_title && (
            <p className="text-xs text-slate-500 mt-1">
              {data.research_area_title} - Question {data.question_index + 1} of {data.total_questions}
            </p>
          )}
        </div>
      </div>

      {/* Answer Textarea */}
      <div className="mb-4">
        <textarea
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(null);
          }}
          placeholder="Share your insights here..."
          rows={5}
          disabled={isSubmitting || submitSuccess}
          className={`
            w-full px-4 py-3
            border-2 border-slate-200 rounded-xl
            text-sm text-slate-900
            resize-none leading-relaxed
            transition-all duration-200
            placeholder:text-slate-400
            focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
          `}
        />
      </div>

      {/* Confidence Rating */}
      <ConfidenceRating
        value={confidence}
        onChange={setConfidence}
        disabled={isSubmitting || submitSuccess}
      />

      {/* InlineCoachBar - Get Suggestion */}
      <InlineCoachBar
        conversationId={conversationId}
        territory={data.territory}
        researchArea={data.research_area}
        researchAreaTitle={data.research_area_title || ''}
        question={data.question}
        questionIndex={data.question_index}
        existingResponse={answer}
        onApplySuggestion={handleApplySuggestion}
      />

      {/* Review My Draft Answer Button */}
      {onRequestReview && !coachReview && (
        <div className="mt-3">
          <button
            onClick={handleRequestReview}
            disabled={isReviewing || !answer.trim() || isSubmitting}
            className={`
              flex items-center gap-2 w-full
              px-4 py-2.5 rounded-xl
              border-2 border-[#1a1f3a]/20 bg-slate-50
              text-[#1a1f3a] text-sm font-semibold
              transition-all duration-200
              hover:bg-slate-100 hover:border-[#1a1f3a]/30
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isReviewing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Coach is reviewing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Review My Draft Answer</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Coach Review Panel */}
      {coachReview && (
        <div className="mt-4">
          <CoachReviewPanel
            review={coachReview}
            onApplyRevision={handleApplyRevision}
            onDismiss={handleClearReview}
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
        {isEditMode && onCancel && (
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !answer.trim() || submitSuccess}
          className={`
            inline-flex items-center gap-2
            px-6 py-2.5 rounded-lg
            text-sm font-semibold
            shadow-md
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2
            disabled:cursor-not-allowed
            ${submitSuccess
              ? 'bg-emerald-500 text-white'
              : 'bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg disabled:opacity-50'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : submitSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <span>{isEditMode ? 'Update Answer' : 'Submit Answer'}</span>
          )}
        </button>
      </div>
    </div>
  );
}
