'use client';

import { useState } from 'react';
import type { TensionCardProps } from '@/types/synthesis';
import { getTensionImpactDisplay } from '@/lib/synthesis/helpers';

/**
 * TensionCard
 *
 * Displays a strategic tension where research insights conflict.
 * Shows aligned vs conflicting evidence side-by-side with
 * resolution options.
 */
export function TensionCard({ tension }: TensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const impactDisplay = getTensionImpactDisplay(tension.impact);

  return (
    <div
      className={`
        bg-white border rounded-2xl transition-all duration-300
        ${tension.impact === 'blocking' ? 'border-red-200' :
          tension.impact === 'significant' ? 'border-amber-200' :
            'border-slate-200'}
      `}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Warning Icon */}
          <div
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${tension.impact === 'blocking' ? 'bg-red-100' :
                tension.impact === 'significant' ? 'bg-amber-100' :
                  'bg-slate-100'}
            `}
          >
            <svg
              className={`
                w-5 h-5
                ${tension.impact === 'blocking' ? 'text-red-600' :
                  tension.impact === 'significant' ? 'text-amber-600' :
                    'text-slate-500'}
              `}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Impact Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`
                  text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full
                  ${impactDisplay.bgColor} ${impactDisplay.color}
                `}
              >
                {impactDisplay.label} Impact
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {tension.description}
            </p>

            {/* Evidence Count */}
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
              <span>{tension.alignedEvidence.length} supporting insights</span>
              <span>•</span>
              <span>{tension.conflictingEvidence.length} conflicting insights</span>
            </div>
          </div>

          {/* Expand Indicator */}
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {/* Side-by-Side Evidence */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Aligned Evidence */}
            <div>
              <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-3">
                Supporting Evidence
              </h4>
              <div className="space-y-2">
                {tension.alignedEvidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {ev.insight}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">
                      Source: {ev.source}
                    </p>
                  </div>
                ))}
                {tension.alignedEvidence.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No supporting evidence</p>
                )}
              </div>
            </div>

            {/* Conflicting Evidence */}
            <div>
              <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">
                Conflicting Evidence
              </h4>
              <div className="space-y-2">
                {tension.conflictingEvidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {ev.insight}
                    </p>
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      Source: {ev.source}
                    </p>
                  </div>
                ))}
                {tension.conflictingEvidence.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No conflicting evidence</p>
                )}
              </div>
            </div>
          </div>

          {/* Resolution Options */}
          {tension.resolutionOptions && tension.resolutionOptions.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Resolution Options
              </h4>
              <div className="space-y-2">
                {tension.resolutionOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className={`
                      p-4 rounded-xl border transition-all duration-300
                      ${option.recommended
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Recommendation Indicator */}
                      {option.recommended && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {option.recommended && (
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 font-medium">
                          {option.option}
                        </p>
                        {option.tradeOff && (
                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-semibold">Trade-off:</span> {option.tradeOff}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TensionCard;
