'use client';

import { useState } from 'react';

interface BetSelectionPanelProps {
  selectedBetIds: string[];
  onCreateStrategy: () => void;
  isCreating: boolean;
}

export function BetSelectionPanel({
  selectedBetIds,
  onCreateStrategy,
  isCreating,
}: BetSelectionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedCount = selectedBetIds.length;
  const qualityGatePassed = selectedCount >= 3;

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 bg-white border-t border-cyan-200 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">{selectedCount}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {selectedCount} {selectedCount === 1 ? 'Bet' : 'Bets'} Selected
              </div>
              <div className="text-xs text-slate-600">
                {qualityGatePassed
                  ? 'Ready to create Product Strategy'
                  : `Select ${3 - selectedCount} more ${3 - selectedCount === 1 ? 'bet' : 'bets'} to proceed`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-50 rounded transition-colors"
          >
            <svg
              className={`w-5 h-5 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {/* Quality Gate */}
            {!qualityGatePassed && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs text-amber-800">
                  <div className="font-semibold mb-1">Minimum Requirement Not Met</div>
                  <div>Select at least 3 strategic bets to create your Product Strategy Draft. Quality over quantity - choose the bets that best represent your strategic direction.</div>
                </div>
              </div>
            )}

            {/* Create Strategy Button */}
            <button
              onClick={onCreateStrategy}
              disabled={!qualityGatePassed || isCreating}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                qualityGatePassed && !isCreating
                  ? 'bg-[#fbbf24] text-slate-900 hover:bg-[#f59e0b] hover:scale-105'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  Generating Strategy Document...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Create Product Strategy Draft
                </>
              )}
            </button>

            {qualityGatePassed && !isCreating && (
              <p className="text-xs text-slate-600 text-center">
                This will generate a 6-page strategy document synthesizing your entire coaching journey
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
