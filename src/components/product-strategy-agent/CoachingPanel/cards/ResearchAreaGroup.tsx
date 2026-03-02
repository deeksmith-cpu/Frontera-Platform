'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Pencil,
  Database,
  Lightbulb,
  HelpCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type {
  ResearchAreaGroupData,
  ConfidenceLevel,
  CardAction,
  Territory,
  QuestionCardData,
} from '@/types/coaching-cards';
import { QuestionCard } from './QuestionCard';

// =============================================================================
// Types
// =============================================================================

interface ResearchAreaGroupProps {
  data: ResearchAreaGroupData;
  conversationId: string;
  onQuestionSubmit: (
    territory: string,
    researchArea: string,
    questionIndex: number,
    answer: string,
    confidence: ConfidenceLevel | null
  ) => Promise<boolean>;
  onAction?: (action: CardAction) => void;
}

interface AnsweredQuestion {
  answer: string;
  confidence: ConfidenceLevel | null;
}

// =============================================================================
// Constants
// =============================================================================

const TERRITORY_STYLES: Record<
  Territory,
  {
    badgeBg: string;
    badgeText: string;
    border: string;
    label: string;
    progressBg: string;
    progressFill: string;
    activeBorder: string;
  }
> = {
  company: {
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    border: 'border-indigo-200',
    label: 'Company',
    progressBg: 'bg-indigo-100',
    progressFill: 'bg-indigo-500',
    activeBorder: 'border-indigo-300',
  },
  customer: {
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Customer',
    progressBg: 'bg-amber-100',
    progressFill: 'bg-amber-500',
    activeBorder: 'border-amber-300',
  },
  competitor: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-600',
    border: 'border-cyan-200',
    label: 'Market Context',
    progressBg: 'bg-cyan-100',
    progressFill: 'bg-cyan-500',
    activeBorder: 'border-cyan-300',
  },
};

const CONFIDENCE_DISPLAY: Record<
  ConfidenceLevel,
  { icon: typeof Database; label: string; colorClass: string }
> = {
  data: { icon: Database, label: 'Data-backed', colorClass: 'text-emerald-600' },
  experience: { icon: Lightbulb, label: 'Experience', colorClass: 'text-amber-600' },
  guess: { icon: HelpCircle, label: 'Best guess', colorClass: 'text-slate-500' },
};

// =============================================================================
// Component
// =============================================================================

/**
 * ResearchAreaGroup -- Displays ALL questions for a research area in a single card.
 *
 * Features:
 * - Territory badge + research area title header
 * - Progress indicator with count and bar
 * - Accordion list of all questions (only one expanded at a time)
 * - Collapsed states: unanswered (tap to answer) or answered (checkmark + preview)
 * - Expanded state: Full QuestionCard form
 * - "Mark as Mapped" appearance when all questions are answered
 * - Fetches existing responses on mount
 */
export function ResearchAreaGroup({
  data,
  conversationId,
  onQuestionSubmit,
  onAction,
}: ResearchAreaGroupProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnsweredQuestion>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [recentlySubmitted, setRecentlySubmitted] = useState<number | null>(null);
  const [isGroupComplete, setIsGroupComplete] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const styles = TERRITORY_STYLES[data.territory];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = data.total_questions;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const allAnswered = answeredCount >= totalQuestions;

  // ── Fetch existing responses on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchExisting() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/territories?conversation_id=${conversationId}&territory=${data.territory}&research_area=${data.research_area}`
        );

        if (!response.ok) {
          // No existing data is fine -- user hasn't answered yet
          setIsLoading(false);
          return;
        }

        const result = await response.json();

        if (cancelled) return;

        // Parse existing responses into our answers state
        const existingAnswers: Record<number, AnsweredQuestion> = {};

        if (result.responses && typeof result.responses === 'object') {
          for (const [key, value] of Object.entries(result.responses)) {
            const idx = parseInt(key, 10);
            if (!isNaN(idx) && value && typeof value === 'object') {
              const resp = value as { answer?: string; confidence?: ConfidenceLevel | null };
              if (resp.answer) {
                existingAnswers[idx] = {
                  answer: resp.answer,
                  confidence: resp.confidence ?? null,
                };
              }
            }
          }
        }

        // Also handle array-style responses
        if (Array.isArray(result.responses)) {
          for (const item of result.responses) {
            if (item && typeof item === 'object' && 'question_index' in item && item.answer) {
              existingAnswers[item.question_index] = {
                answer: item.answer,
                confidence: item.confidence ?? null,
              };
            }
          }
        }

        setAnswers(existingAnswers);

        // Check if already fully complete
        if (Object.keys(existingAnswers).length >= totalQuestions) {
          setIsGroupComplete(true);
          setIsCompactMode(true);
        }
      } catch {
        // Silently fail -- user can still answer questions
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchExisting();

    return () => {
      cancelled = true;
    };
  }, [conversationId, data.territory, data.research_area, totalQuestions]);

  // ── Handle question submission ─────────────────────────────────────
  const handleQuestionSubmit = useCallback(
    async (
      questionIndex: number,
      answer: string,
      confidence: ConfidenceLevel | null
    ): Promise<boolean> => {
      const success = await onQuestionSubmit(
        data.territory,
        data.research_area,
        questionIndex,
        answer,
        confidence
      );

      if (success) {
        // Update local answers state
        setAnswers((prev) => {
          const updated = {
            ...prev,
            [questionIndex]: { answer, confidence },
          };

          // Check if all questions are now answered
          const newAnsweredCount = Object.keys(updated).length;
          if (newAnsweredCount >= totalQuestions) {
            setIsGroupComplete(true);
          }

          return updated;
        });

        // Show brief success animation
        setRecentlySubmitted(questionIndex);
        setTimeout(() => setRecentlySubmitted(null), 1500);

        // Collapse the question
        setExpandedIndex(null);
      }

      return success;
    },
    [data.territory, data.research_area, totalQuestions, onQuestionSubmit]
  );

  // ── Toggle question expansion ──────────────────────────────────────
  const handleToggle = useCallback(
    (questionIndex: number) => {
      setExpandedIndex((prev) => (prev === questionIndex ? null : questionIndex));
    },
    []
  );

  // ── Handle edit of answered question ───────────────────────────────
  const handleEdit = useCallback(
    (e: React.MouseEvent, questionIndex: number) => {
      e.stopPropagation();
      setExpandedIndex(questionIndex);
      // If in compact mode, expand the group
      if (isCompactMode) {
        setIsCompactMode(false);
      }
    },
    [isCompactMode]
  );

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-2xl border-2 border-cyan-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-600 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[#fbbf24]" />
          <span className="text-xs uppercase tracking-wide font-semibold">
            Loading research area...
          </span>
        </div>
      </div>
    );
  }

  // ── Compact mode (all complete) ────────────────────────────────────
  if (isCompactMode && isGroupComplete) {
    return (
      <div
        className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md hover:border-emerald-300"
        onClick={() => setIsCompactMode(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCompactMode(false);
          }
        }}
        aria-label={`${data.research_area_title} - ${answeredCount}/${totalQuestions} Answered. Click to expand.`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.badgeBg} ${styles.badgeText} ${styles.border}`}
              >
                {styles.label}
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {data.research_area_title}
              </span>
              <span className="text-sm text-slate-400">&mdash;</span>
              <span className="font-code text-sm font-semibold text-emerald-600">
                {answeredCount}/{totalQuestions} Answered
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    );
  }

  // ── Full expanded card ─────────────────────────────────────────────
  return (
    <div
      className={`
        research-area-group
        rounded-2xl border-2 bg-white
        p-5 shadow-sm
        transition-all duration-300
        ${isGroupComplete ? 'border-emerald-200' : 'border-cyan-200'}
      `}
    >
      {/* Header: Territory Badge + Research Area Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.badgeBg} ${styles.badgeText} ${styles.border}`}
          >
            {styles.label}
          </span>
          <span className="text-xs text-slate-400">{data.research_area_title}</span>
        </div>
        {isGroupComplete && (
          <button
            onClick={() => setIsCompactMode(true)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Collapse group"
          >
            Collapse
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-code text-xs font-semibold text-slate-700">
          {answeredCount} of {totalQuestions}
        </span>
        <span className="text-xs text-slate-400">questions answered</span>
        <div className="flex-1" />
        {allAnswered && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            Complete
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`h-1.5 rounded-full ${styles.progressBg} mb-5`}>
        <div
          className={`h-1.5 rounded-full ${allAnswered ? 'bg-emerald-500' : styles.progressFill} transition-all duration-500 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question List */}
      <div className="space-y-2">
        {data.questions.map((question, idx) => {
          const isAnswered = answers[question.index] !== undefined;
          const isExpanded = expandedIndex === question.index;
          const wasJustSubmitted = recentlySubmitted === question.index;
          const answeredData = answers[question.index];
          const isEven = idx % 2 === 0;

          return (
            <div
              key={question.index}
              className={`
                rounded-lg overflow-hidden
                transition-all duration-300
                ${isExpanded ? `border-2 ${styles.activeBorder}` : 'border border-slate-100'}
                ${!isExpanded && isEven ? 'bg-slate-50/50' : 'bg-white'}
                ${wasJustSubmitted ? 'ring-2 ring-emerald-300 ring-opacity-60' : ''}
              `}
            >
              {/* Collapsed state */}
              {!isExpanded && (
                <div
                  className={`
                    flex items-center gap-3 p-3 cursor-pointer
                    transition-all duration-200
                    hover:bg-slate-50
                  `}
                  onClick={() => handleToggle(question.index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(question.index);
                    }
                  }}
                  aria-expanded={false}
                  aria-label={
                    isAnswered
                      ? `Question ${question.index + 1}: Answered. Click to expand.`
                      : `Question ${question.index + 1}: ${question.text.substring(0, 80)}. Click to answer.`
                  }
                >
                  {/* Status icon */}
                  {isAnswered ? (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1a1f3a] flex items-center justify-center">
                      <span className="text-[#fbbf24] text-xs font-bold">
                        {question.index + 1}
                      </span>
                    </div>
                  )}

                  {/* Question text / answer preview */}
                  <div className="flex-1 min-w-0">
                    {isAnswered ? (
                      <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Q{question.index + 1}
                        </span>
                        <p className="text-sm text-slate-700 truncate mt-0.5">
                          {answeredData.answer.length > 80
                            ? answeredData.answer.substring(0, 80) + '...'
                            : answeredData.answer}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 truncate">
                        {question.text.length > 80
                          ? question.text.substring(0, 80) + '...'
                          : question.text}
                      </p>
                    )}
                  </div>

                  {/* Right side: confidence badge or tap indicator */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isAnswered && answeredData.confidence && (
                      <ConfidenceBadge confidence={answeredData.confidence} />
                    )}

                    {isAnswered ? (
                      <button
                        onClick={(e) => handleEdit(e, question.index)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 transition-all duration-200"
                        aria-label={`Edit answer for question ${question.index + 1}`}
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Answer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expanded state: QuestionCard form */}
              {isExpanded && (
                <div className="p-3">
                  <QuestionCard
                    data={
                      {
                        id: `${data.id}-q${question.index}`,
                        type: 'question' as const,
                        territory: data.territory,
                        research_area: data.research_area,
                        research_area_title: data.research_area_title,
                        question_index: question.index,
                        question: question.text,
                        total_questions: data.total_questions,
                      } satisfies QuestionCardData
                    }
                    conversationId={conversationId}
                    onSubmit={async (answer, confidence) => {
                      return handleQuestionSubmit(question.index, answer, confidence);
                    }}
                    onAction={onAction}
                    existingAnswer={isAnswered ? answeredData.answer : ''}
                    existingConfidence={isAnswered ? answeredData.confidence : null}
                    isEditMode={isAnswered}
                    onCancel={() => setExpandedIndex(null)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* "Mark as Mapped" footer when all answered */}
      {allAnswered && !isGroupComplete && (
        <div className="mt-5 pt-4 border-t border-emerald-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-emerald-700 font-medium">
              All questions answered. This research area is complete.
            </p>
            <button
              onClick={() => {
                setIsGroupComplete(true);
                setIsCompactMode(true);
                onAction?.({
                  cardId: data.id,
                  action: 'mark_area_mapped',
                  payload: {
                    territory: data.territory,
                    research_area: data.research_area,
                  },
                });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fbbf24] text-sm font-semibold text-[#1a1f3a] shadow-md transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Mapped
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Inline sub-components
// =============================================================================

function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  const info = CONFIDENCE_DISPLAY[confidence];
  const Icon = info.icon;

  return (
    <div className={`inline-flex items-center gap-1 ${info.colorClass}`}>
      <Icon className="w-3 h-3" />
      <span className="text-[10px] font-medium">{info.label}</span>
    </div>
  );
}
