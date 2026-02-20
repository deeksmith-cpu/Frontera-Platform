'use client';

import type { RecommendationsPanelProps } from '@/types/synthesis';

/**
 * RecommendationsPanel
 *
 * Displays priority recommendations from the strategic synthesis.
 * Shows top 3 action items in a visually prominent format.
 */
export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#f4f4f7] border border-slate-200 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#1a1f3a] flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Priority Recommendations</h3>
          <p className="text-xs text-slate-500">Strategic actions to pursue first</p>
        </div>
      </div>

      {/* Recommendations List */}
      <ol className="space-y-4">
        {recommendations.map((recommendation, idx) => (
          <li key={idx} className="flex items-start gap-4">
            {/* Number Badge */}
            <div className="w-8 h-8 rounded-xl bg-[#1a1f3a] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-sm font-bold text-white">{idx + 1}</span>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm text-slate-700 leading-relaxed">{recommendation}</p>

              {/* Priority Indicator */}
              {idx === 0 && (
                <span className="inline-block mt-2 text-xs font-semibold text-[#1a1f3a] bg-[#f4f4f7] px-2 py-0.5 rounded-full">
                  Highest Priority
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Action Guidance */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 leading-relaxed">
          These recommendations are prioritized based on strategic impact and alignment
          with your identified opportunities. Consider validating key assumptions before
          full execution.
        </p>
      </div>
    </div>
  );
}

/**
 * Compact Recommendations List
 *
 * A smaller version showing just the recommendations without the
 * decorative styling. Useful for embedded contexts.
 */
export function RecommendationsList({
  recommendations,
  maxItems = 3,
}: {
  recommendations: string[];
  maxItems?: number;
}) {
  const displayItems = recommendations.slice(0, maxItems);

  return (
    <ul className="space-y-2">
      {displayItems.map((rec, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm">
          <span className="text-[#1a1f3a] font-bold">{idx + 1}.</span>
          <span className="text-slate-700">{rec}</span>
        </li>
      ))}
      {recommendations.length > maxItems && (
        <li className="text-xs text-slate-400 pl-5">
          +{recommendations.length - maxItems} more recommendations
        </li>
      )}
    </ul>
  );
}

export default RecommendationsPanel;
