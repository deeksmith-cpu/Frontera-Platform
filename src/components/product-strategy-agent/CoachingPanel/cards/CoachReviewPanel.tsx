'use client';

import { AlertTriangle, Lightbulb, ArrowRight, X } from 'lucide-react';
import type { CoachReview } from '@/types/coaching-cards';
import { ResourceCard } from './ResourceCard';

interface CoachReviewPanelProps {
  review: CoachReview;
  onApplySuggestion: () => void;
  onDismiss: () => void;
}

/**
 * CoachReviewPanel — Structured display of coach feedback on a draft answer.
 *
 * Sections:
 * - Summary assessment
 * - Strengths (if present)
 * - Challenges (probing questions)
 * - Enhancement ideas
 * - Resources
 * - "Apply Suggested Revision" / "Continue Without Changes" actions
 */
export function CoachReviewPanel({
  review,
  onApplySuggestion,
  onDismiss,
}: CoachReviewPanelProps) {
  return (
    <div className="coach-review-panel rounded-xl border-2 border-cyan-200 bg-white overflow-hidden animate-entrance">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-50 to-white border-b border-cyan-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1a1f3a] flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-[#fbbf24]" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Coach Review</span>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Dismiss review"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary */}
        <p className="text-sm text-slate-700 leading-relaxed">
          {review.summary}
        </p>

        {/* Strengths */}
        {review.strengths && review.strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              Strengths
            </h4>
            <ul className="space-y-1.5">
              {review.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {review.challenges.length > 0 && (
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Challenges
            </h4>
            <div className="space-y-2">
              {review.challenges.map((challenge, i) => (
                <div key={i} className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <p className="text-sm font-medium text-slate-800">
                    {challenge.question}
                  </p>
                  {challenge.rationale && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {challenge.rationale}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhancements */}
        {review.enhancements.length > 0 && (
          <div>
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-2">
              <Lightbulb className="w-3.5 h-3.5" />
              Enhancement Ideas
            </h4>
            <div className="space-y-2">
              {review.enhancements.map((enhancement, i) => (
                <div key={i} className="rounded-lg bg-cyan-50 border border-cyan-100 p-3">
                  <p className="text-sm text-slate-700">
                    {enhancement.suggestion}
                  </p>
                  {enhancement.example && (
                    <p className="text-xs text-slate-500 mt-1.5 italic">
                      e.g. {enhancement.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {review.resources.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Recommended Resources
            </h4>
            <div className="space-y-2">
              {review.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          {review.suggestedRevision && (
            <button
              onClick={onApplySuggestion}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fbbf24] text-[#1a1f3a] text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Apply Suggested Revision
            </button>
          )}
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Continue Without Changes
          </button>
        </div>
      </div>
    </div>
  );
}
