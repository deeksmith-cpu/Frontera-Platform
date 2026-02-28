'use client';

import { useState, useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, Pencil, Database, Lightbulb, HelpCircle } from 'lucide-react';
import type { AnsweredCardData, ConfidenceLevel, CardAction, Territory, CoachReview } from '@/types/coaching-cards';
import { QuestionCard } from './QuestionCard';

interface AnsweredCardProps {
  data: AnsweredCardData;
  conversationId: string;
  onUpdate: (answer: string, confidence: ConfidenceLevel | null) => Promise<boolean>;
  onAction?: (action: CardAction) => void;
}

const TERRITORY_STYLES: Record<Territory, {
  badgeBg: string;
  badgeText: string;
  border: string;
}> = {
  company: {
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  customer: {
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    border: 'border-amber-200',
  },
  competitor: {
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-600',
    border: 'border-cyan-200',
  },
};

const CONFIDENCE_DISPLAY: Record<ConfidenceLevel, { icon: typeof Database; label: string; color: string }> = {
  data: {
    icon: Database,
    label: 'Data-backed',
    color: 'text-emerald-600',
  },
  experience: {
    icon: Lightbulb,
    label: 'Experience-based',
    color: 'text-amber-600',
  },
  guess: {
    icon: HelpCircle,
    label: 'Best guess',
    color: 'text-slate-500',
  },
};

/**
 * AnsweredCard — Collapsed view of a submitted research answer
 *
 * Features:
 * - Compact display with emerald checkmark
 * - Question label with truncated answer preview
 * - Confidence badge
 * - Expand to see full answer
 * - Edit button to re-enter QuestionCard form
 */
export function AnsweredCard({
  data,
  conversationId,
  onUpdate,
  onAction,
}: AnsweredCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const styles = TERRITORY_STYLES[data.territory];
  const confidenceInfo = data.confidence ? CONFIDENCE_DISPLAY[data.confidence] : null;
  const ConfidenceIcon = confidenceInfo?.icon;

  const toggleExpand = useCallback(() => {
    if (!isEditing) {
      setIsExpanded((prev) => !prev);
    }
  }, [isEditing]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setIsExpanded(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setIsExpanded(false);
  }, []);

  const handleSubmit = useCallback(
    async (answer: string, confidence: ConfidenceLevel | null): Promise<boolean> => {
      const success = await onUpdate(answer, confidence);
      if (success) {
        setIsEditing(false);
        setIsExpanded(false);
      }
      return success;
    },
    [onUpdate]
  );

  const truncatedAnswer = data.answer.length > 150
    ? data.answer.substring(0, 150) + '...'
    : data.answer;

  // If editing, show QuestionCard in edit mode
  if (isEditing) {
    return (
      <QuestionCard
        data={{
          id: `edit-${data.territory}-${data.research_area}-${data.question_index}`,
          type: 'question',
          territory: data.territory,
          research_area: data.research_area,
          question_index: data.question_index,
          question: data.question,
          total_questions: 4,
        }}
        conversationId={conversationId}
        onSubmit={handleSubmit}
        onAction={onAction}
        existingAnswer={data.answer}
        existingConfidence={data.confidence}
        isEditMode={true}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div
      className={`
        answered-card
        rounded-2xl border ${styles.border} bg-emerald-50/50
        overflow-hidden
        transition-all duration-300
        cursor-pointer hover:shadow-sm hover:border-emerald-300
      `}
      onClick={toggleExpand}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkmark Badge */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Question Label */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Q{data.question_index + 1}
              </span>
              <span className="text-xs text-slate-400">&middot;</span>
              <span className="text-xs text-emerald-600 font-medium">Answered</span>
            </div>
            <p className="text-sm font-medium text-slate-800 mt-1 line-clamp-1">
              {data.question}
            </p>

            {/* Answer Preview (Collapsed) */}
            {!isExpanded && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {truncatedAnswer}
              </p>
            )}

            {/* Full Answer (Expanded) */}
            {isExpanded && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {data.answer}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              {/* Confidence Badge */}
              {confidenceInfo && ConfidenceIcon ? (
                <div className={`flex items-center gap-1.5 ${confidenceInfo.color}`}>
                  <ConfidenceIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{confidenceInfo.label}</span>
                </div>
              ) : (
                <div />
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300 transition-all duration-200"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
