'use client';

import { useState, useCallback } from 'react';
import type { ConfidenceLevel, CoachReview } from '@/types/coaching-cards';

interface QuestionCardState {
  /** Current answer text */
  answer: string;
  /** Confidence level */
  confidence: ConfidenceLevel | null;
  /** Is the form being submitted */
  isSubmitting: boolean;
  /** Is the coach reviewing the draft */
  isReviewing: boolean;
  /** Is the suggestion loading */
  isLoadingSuggestion: boolean;
  /** Coach review result */
  coachReview: CoachReview | null;
  /** Error message */
  error: string | null;
  /** Is in edit mode (for AnsweredCard) */
  isEditing: boolean;
}

interface UseQuestionCardStateOptions {
  conversationId: string;
  territory: string;
  researchArea: string;
  questionIndex: number;
  initialAnswer?: string;
  initialConfidence?: ConfidenceLevel | null;
}

interface UseQuestionCardStateReturn extends QuestionCardState {
  /** Update the answer text */
  setAnswer: (answer: string) => void;
  /** Update confidence level */
  setConfidence: (confidence: ConfidenceLevel | null) => void;
  /** Submit the answer */
  submitAnswer: () => Promise<boolean>;
  /** Request coach review of draft */
  requestReview: () => Promise<void>;
  /** Request coach suggestion (starting point) */
  requestSuggestion: () => Promise<string | null>;
  /** Apply coach suggestion to answer */
  applySuggestion: (text: string) => void;
  /** Apply coach review revision */
  applyReviewRevision: () => void;
  /** Clear coach review */
  clearReview: () => void;
  /** Toggle edit mode */
  setEditing: (editing: boolean) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook to manage QuestionCard form state
 * Handles answer drafting, submissions, coach suggestions, and reviews
 */
export function useQuestionCardState({
  conversationId,
  territory,
  researchArea,
  questionIndex,
  initialAnswer = '',
  initialConfidence = null,
}: UseQuestionCardStateOptions): UseQuestionCardStateReturn {
  const [answer, setAnswer] = useState(initialAnswer);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(initialConfidence);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [coachReview, setCoachReview] = useState<CoachReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setEditing] = useState(false);

  // Submit answer to API
  const submitAnswer = useCallback(async (): Promise<boolean> => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Build responses object for the research area
      // We need to fetch existing responses first, then update the specific question
      const getResponse = await fetch(
        `/api/product-strategy-agent-v2/territories?conversation_id=${conversationId}`
      );

      let existingResponses: Record<string, string> = {};
      let existingConfidence: Record<string, string> = {};

      if (getResponse.ok) {
        const insights = await getResponse.json();
        const existing = insights.find(
          (i: { territory: string; research_area: string }) =>
            i.territory === territory && i.research_area === researchArea
        );
        if (existing?.responses) {
          existingResponses = existing.responses as Record<string, string>;
        }
        if (existing?.confidence) {
          existingConfidence = existing.confidence as Record<string, string>;
        }
      }

      // Update with new answer
      const responses: Record<string, string> = {
        ...existingResponses,
        [questionIndex]: answer,
      };

      const confidenceMap: Record<string, string> = {
        ...existingConfidence,
        ...(confidence ? { [questionIndex]: confidence } : {}),
      };

      // Determine status based on how many questions are answered
      const answeredCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
      const status = answeredCount >= 3 ? 'mapped' : 'in_progress';

      const response = await fetch('/api/product-strategy-agent-v2/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: researchArea,
          responses,
          confidence: confidenceMap,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save answer');
      }

      setCoachReview(null);
      return true;
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to save answer. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, confidence, conversationId, territory, researchArea, questionIndex]);

  // Request coach review of draft
  const requestReview = useCallback(async (): Promise<void> => {
    if (!answer.trim()) {
      setError('Please write something before requesting a review');
      return;
    }

    setIsReviewing(true);
    setError(null);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/coach-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: researchArea,
          question_index: questionIndex,
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
  }, [answer, conversationId, territory, researchArea, questionIndex]);

  // Request coach suggestion (starting point for empty answer)
  const requestSuggestion = useCallback(async (): Promise<string | null> => {
    setIsLoadingSuggestion(true);
    setError(null);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/coach-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: researchArea,
          question_index: questionIndex,
          existing_response: answer,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestion');
      }

      const data = await response.json();
      return data.suggestion || null;
    } catch (err) {
      console.error('Error getting suggestion:', err);
      setError('Failed to get suggestion. Please try again.');
      return null;
    } finally {
      setIsLoadingSuggestion(false);
    }
  }, [conversationId, territory, researchArea, questionIndex, answer]);

  // Apply suggestion to answer
  const applySuggestion = useCallback((text: string) => {
    setAnswer((prev) => (prev ? `${prev}\n\n${text}` : text));
  }, []);

  // Apply coach review revision
  const applyReviewRevision = useCallback(() => {
    if (coachReview?.suggestedRevision) {
      setAnswer(coachReview.suggestedRevision);
      setCoachReview(null);
    }
  }, [coachReview]);

  // Clear coach review
  const clearReview = useCallback(() => {
    setCoachReview(null);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setAnswer(initialAnswer);
    setConfidence(initialConfidence);
    setIsSubmitting(false);
    setIsReviewing(false);
    setIsLoadingSuggestion(false);
    setCoachReview(null);
    setError(null);
    setEditing(false);
  }, [initialAnswer, initialConfidence]);

  return {
    // State
    answer,
    confidence,
    isSubmitting,
    isReviewing,
    isLoadingSuggestion,
    coachReview,
    error,
    isEditing,
    // Actions
    setAnswer,
    setConfidence,
    submitAnswer,
    requestReview,
    requestSuggestion,
    applySuggestion,
    applyReviewRevision,
    clearReview,
    setEditing,
    reset,
  };
}
