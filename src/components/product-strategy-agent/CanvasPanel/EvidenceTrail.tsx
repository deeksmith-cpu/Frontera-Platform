'use client';

import type { EvidenceTrailProps, EvidenceLink } from '@/types/synthesis';
import { getTerritoryDisplay } from '@/lib/synthesis/helpers';

/**
 * EvidenceTrail
 *
 * Displays evidence quotes linked to their source research.
 * Color-coded by territory:
 * - Indigo: Company
 * - Cyan: Customer
 * - Purple: Competitor
 */
export function EvidenceTrail({
  evidence,
  onNavigateToSource,
}: EvidenceTrailProps) {
  if (evidence.length === 0) {
    return (
      <div className="text-sm text-slate-500 italic text-center py-4">
        No evidence links available
      </div>
    );
  }

  // Group evidence by territory for organized display
  const groupedEvidence = evidence.reduce(
    (acc, ev) => {
      if (!acc[ev.territory]) {
        acc[ev.territory] = [];
      }
      acc[ev.territory].push(ev);
      return acc;
    },
    {} as Record<string, EvidenceLink[]>
  );

  return (
    <div className="space-y-4">
      {(['company', 'customer', 'competitor'] as const).map((territory) => {
        const items = groupedEvidence[territory];
        if (!items || items.length === 0) return null;

        const territoryDisplay = getTerritoryDisplay(territory);

        return (
          <div key={territory}>
            {/* Territory Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${territoryDisplay.bgColor.replace('bg-', 'bg-').replace('100', '500')}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${territoryDisplay.color}`}>
                {territoryDisplay.label} Territory ({items.length})
              </span>
            </div>

            {/* Evidence Items */}
            <div className="space-y-2 ml-4">
              {items.map((ev, idx) => (
                <button
                  key={`${territory}-${idx}`}
                  onClick={() => onNavigateToSource?.(ev)}
                  className={`
                    w-full text-left p-3 rounded-xl border transition-all duration-300
                    ${territoryDisplay.bgColor} ${territoryDisplay.borderColor}
                    hover:shadow-md hover:scale-[1.01]
                    ${onNavigateToSource ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {/* Research Area */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-slate-500 font-medium">
                      {ev.researchArea
                        .replace(/_/g, ' ')
                        .split(' ')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </span>
                    {onNavigateToSource && (
                      <svg
                        className="w-3 h-3 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="text-slate-400">&ldquo;</span>
                    {ev.quote}
                    <span className="text-slate-400">&rdquo;</span>
                  </p>

                  {/* Question Context (if available) */}
                  {ev.question && (
                    <div className="mt-2 text-xs text-slate-400">
                      Re: {ev.question}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact Evidence Badge
 *
 * A smaller version showing just territory badge and truncated quote.
 * Useful for inline evidence references.
 */
export function EvidenceBadge({
  evidence,
  onClick,
}: {
  evidence: EvidenceLink;
  onClick?: () => void;
}) {
  const territoryDisplay = getTerritoryDisplay(evidence.territory);

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 text-xs py-1 px-2 rounded-lg
        ${territoryDisplay.bgColor} ${territoryDisplay.borderColor} border
        hover:shadow-sm transition-all duration-200
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <span className={`font-semibold uppercase ${territoryDisplay.color}`}>
        {evidence.territory.charAt(0).toUpperCase()}
      </span>
      <span className="text-slate-600 truncate max-w-[150px]">
        {evidence.quote.substring(0, 40)}...
      </span>
    </button>
  );
}

export default EvidenceTrail;
