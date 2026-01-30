'use client';

import { useState } from 'react';
import type { OpportunityCardProps } from '@/types/synthesis';
import {
  getQuadrantDisplay,
  getConfidenceDisplay,
  getTerritoryDisplay,
} from '@/lib/synthesis/helpers';

/**
 * Score bar component for displaying numeric scores
 */
function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

/**
 * OpportunityCard
 *
 * Displays a strategic opportunity with full details including:
 * - Header with title, quadrant badge, confidence indicator
 * - Description
 * - Score indicators (3 horizontal progress bars)
 * - PTW Summary (collapsible)
 * - Evidence Trail (linked quotes with territory badges)
 * - WWHBT Assumptions
 */
export function OpportunityCard({
  opportunity,
  isExpanded = false,
  onToggleExpand,
  onEvidenceClick,
}: OpportunityCardProps) {
  const [showPTW, setShowPTW] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const quadrantDisplay = getQuadrantDisplay(opportunity.quadrant);
  const confidenceDisplay = getConfidenceDisplay(opportunity.confidence);

  // Format opportunity type for display
  const formatOpportunityType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div
      className={`
        bg-white border rounded-2xl transition-all duration-300
        ${isExpanded ? 'border-[#fbbf24] shadow-lg' : 'border-slate-200 hover:border-[#fbbf24]/50 hover:shadow-md'}
      `}
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {formatOpportunityType(opportunity.opportunityType)}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {opportunity.title}
            </h4>

            {/* Badges Row */}
            <div className="flex items-center gap-2 mt-2">
              {/* Quadrant Badge */}
              <span
                className={`
                  inline-flex items-center text-xs font-semibold py-1 px-2.5 rounded-full
                  ${quadrantDisplay.bgColor} ${quadrantDisplay.color}
                `}
              >
                {quadrantDisplay.label}
              </span>

              {/* Confidence Badge */}
              <span
                className={`
                  inline-flex items-center text-xs font-semibold py-1 px-2.5 rounded-full
                  ${confidenceDisplay.bgColor} ${confidenceDisplay.color}
                `}
              >
                {confidenceDisplay.label}
              </span>
            </div>
          </div>

          {/* Score Circle */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-[#1a1f3a] flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {opportunity.scoring.overallScore}
              </span>
            </div>
          </div>
        </div>

        {/* Description (always visible) */}
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Expand/Collapse Indicator */}
        <div className="mt-3 flex items-center justify-center">
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {/* Score Indicators */}
          <div className="py-4 space-y-3">
            <ScoreBar
              label="Market Attractiveness"
              value={opportunity.scoring.marketAttractiveness}
              color="bg-indigo-500"
            />
            <ScoreBar
              label="Capability Fit"
              value={opportunity.scoring.capabilityFit}
              color="bg-cyan-500"
            />
            <ScoreBar
              label="Competitive Advantage"
              value={opportunity.scoring.competitiveAdvantage}
              color="bg-emerald-500"
            />
          </div>

          {/* PTW Summary Section */}
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPTW(!showPTW);
              }}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-slate-900">
                Playing to Win Mapping
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showPTW ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPTW && (
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-[#1a1f3a]">Winning Aspiration:</span>
                  <p className="text-slate-600 mt-0.5">{opportunity.ptw.winningAspiration || 'Not defined'}</p>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1f3a]">Where to Play:</span>
                  <p className="text-slate-600 mt-0.5">{opportunity.ptw.whereToPlay || 'Not defined'}</p>
                </div>
                <div>
                  <span className="font-semibold text-[#1a1f3a]">How to Win:</span>
                  <p className="text-slate-600 mt-0.5">{opportunity.ptw.howToWin || 'Not defined'}</p>
                </div>
                {opportunity.ptw.capabilitiesRequired.length > 0 && (
                  <div>
                    <span className="font-semibold text-[#1a1f3a]">Capabilities Required:</span>
                    <ul className="mt-1 space-y-1">
                      {opportunity.ptw.capabilitiesRequired.map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <span className="text-cyan-500 mt-0.5">•</span>
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {opportunity.ptw.managementSystems.length > 0 && (
                  <div>
                    <span className="font-semibold text-[#1a1f3a]">Management Systems:</span>
                    <ul className="mt-1 space-y-1">
                      {opportunity.ptw.managementSystems.map((sys, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <span className="text-cyan-500 mt-0.5">•</span>
                          {sys}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Evidence Trail Section */}
          {opportunity.evidence.length > 0 && (
            <div className="border-t border-slate-100 pt-4 mt-4">
              <h5 className="text-sm font-semibold text-slate-900 mb-3">
                Supporting Evidence ({opportunity.evidence.length})
              </h5>
              <div className="space-y-2">
                {opportunity.evidence.map((ev, idx) => {
                  const territoryDisplay = getTerritoryDisplay(ev.territory);
                  return (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEvidenceClick?.(ev);
                      }}
                      className={`
                        w-full text-left p-3 rounded-xl border transition-all duration-300
                        ${territoryDisplay.bgColor} ${territoryDisplay.borderColor}
                        hover:shadow-md
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`
                            text-xs font-semibold uppercase tracking-wider
                            ${territoryDisplay.color}
                          `}
                        >
                          {ev.territory}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {ev.researchArea.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 italic">
                        &ldquo;{ev.quote}&rdquo;
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* WWHBT Assumptions Section */}
          {opportunity.assumptions.length > 0 && (
            <div className="border-t border-slate-100 pt-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAssumptions(!showAssumptions);
                }}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-900">
                  What Would Have to Be True ({opportunity.assumptions.length})
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showAssumptions ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAssumptions && (
                <div className="mt-3 space-y-3">
                  {opportunity.assumptions.map((assumption, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {assumption.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900">
                        {assumption.assumption}
                      </p>
                      {assumption.testMethod && (
                        <div className="mt-2 text-xs text-slate-600">
                          <span className="font-semibold">Test:</span> {assumption.testMethod}
                        </div>
                      )}
                      {assumption.riskIfFalse && (
                        <div className="mt-1 text-xs text-amber-600">
                          <span className="font-semibold">Risk:</span> {assumption.riskIfFalse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OpportunityCard;
