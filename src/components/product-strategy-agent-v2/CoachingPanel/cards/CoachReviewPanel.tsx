'use client';

import { useState } from 'react';
import {
  Lightbulb,
  HelpCircle,
  Sparkles,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Mic,
  FileText,
  Video,
  Layers,
} from 'lucide-react';
import type { CoachReview, ResourceLink, ResourceType } from '@/types/coaching-cards';

interface CoachReviewPanelProps {
  review: CoachReview;
  onApplyRevision?: () => void;
  onDismiss: () => void;
}

const RESOURCE_ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  podcast: Mic,
  book: BookOpen,
  article: FileText,
  framework: Layers,
  video: Video,
};

const RESOURCE_COLORS: Record<ResourceType, { bg: string; text: string; border: string }> = {
  podcast: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  book: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  article: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  framework: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  video: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

function ResourceCard({ resource }: { resource: ResourceLink }) {
  const Icon = RESOURCE_ICONS[resource.type];
  const colors = RESOURCE_COLORS[resource.type];

  return (
    <div
      className={`
        p-3 rounded-xl border ${colors.border} ${colors.bg}
        transition-all duration-200 hover:shadow-sm
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
              {resource.type}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{resource.source}</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 mt-0.5 line-clamp-1">
            {resource.title}
          </h4>
          {resource.author && (
            <p className="text-xs text-slate-500 mt-0.5">by {resource.author}</p>
          )}
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            {resource.relevance}
          </p>
          {resource.keyInsight && (
            <p className="text-xs text-slate-700 mt-2 italic border-l-2 border-slate-300 pl-2">
              &ldquo;{resource.keyInsight}&rdquo;
            </p>
          )}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-1 mt-2
                text-xs font-medium ${colors.text}
                hover:underline
              `}
            >
              <ExternalLink className="w-3 h-3" />
              <span>View resource</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * CoachReviewPanel - Displays the coach's critical assessment of a draft answer
 *
 * Features:
 * - Summary of assessment
 * - Strengths identified (collapsible)
 * - Challenges to prompt deeper thinking
 * - Enhancement suggestions
 * - Relevant resource links
 * - Apply/Dismiss actions
 */
export function CoachReviewPanel({
  review,
  onApplyRevision,
  onDismiss,
}: CoachReviewPanelProps) {
  const [showStrengths, setShowStrengths] = useState(false);
  const [showResources, setShowResources] = useState(true);

  const hasStrengths = review.strengths && review.strengths.length > 0;
  const hasResources = review.resources && review.resources.length > 0;
  const hasSuggestedRevision = !!review.suggestedRevision;

  return (
    <div
      className={`
        coach-review-panel
        rounded-2xl border-2 border-[#1a1f3a]/20 bg-gradient-to-br from-slate-50 to-cyan-50/30
        overflow-hidden
        animate-entrance
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#1a1f3a] text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#fbbf24] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#1a1f3a]" />
          </div>
          <span className="text-sm font-semibold">Coach Review</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary */}
        <div>
          <p className="text-sm text-slate-700 leading-relaxed">{review.summary}</p>
        </div>

        {/* Strengths (Collapsible) */}
        {hasStrengths && (
          <div className="border border-emerald-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowStrengths(!showStrengths)}
              className="w-full px-4 py-2.5 bg-emerald-50 flex items-center justify-between hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">
                  Strengths ({review.strengths!.length})
                </span>
              </div>
              {showStrengths ? (
                <ChevronUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-600" />
              )}
            </button>
            {showStrengths && (
              <div className="p-3 space-y-2">
                {review.strengths!.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700">{strength}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Challenges */}
        {review.challenges.length > 0 && (
          <div className="border border-amber-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-amber-50 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                Questions to Consider
              </span>
            </div>
            <div className="p-3 space-y-3">
              {review.challenges.map((challenge, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">
                    {idx + 1}. {challenge.question}
                  </p>
                  {challenge.rationale && (
                    <p className="text-xs text-slate-500 ml-4">{challenge.rationale}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhancements */}
        {review.enhancements.length > 0 && (
          <div className="border border-cyan-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-cyan-50 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-700">
                Enhancement Ideas
              </span>
            </div>
            <div className="p-3 space-y-3">
              {review.enhancements.map((enhancement, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-sm text-slate-700">{enhancement.suggestion}</p>
                  {enhancement.example && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 px-3 py-1.5 rounded-lg">
                      Example: {enhancement.example}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {hasResources && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowResources(!showResources)}
              className="w-full px-4 py-2.5 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">
                  Related Resources ({review.resources.length})
                </span>
              </div>
              {showResources ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
            {showResources && (
              <div className="p-3 space-y-2">
                {review.resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onDismiss}
            className={`
              inline-flex items-center gap-1.5
              px-4 py-2 rounded-lg
              text-sm font-medium text-slate-600
              border border-slate-200
              hover:bg-slate-50 hover:border-slate-300
              transition-all duration-200
            `}
          >
            <X className="w-4 h-4" />
            <span>Dismiss</span>
          </button>

          {hasSuggestedRevision && onApplyRevision && (
            <button
              onClick={onApplyRevision}
              className={`
                inline-flex items-center gap-1.5
                px-5 py-2 rounded-lg
                text-sm font-semibold text-[#1a1f3a]
                bg-[#fbbf24]
                shadow-md
                hover:bg-[#f59e0b] hover:scale-105 hover:shadow-lg
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2
              `}
            >
              <Check className="w-4 h-4" />
              <span>Apply Suggested Revision</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
