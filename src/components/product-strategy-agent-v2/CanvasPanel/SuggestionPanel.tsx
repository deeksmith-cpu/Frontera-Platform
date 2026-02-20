'use client';

import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';

interface QuestionSuggestion {
  question_index: number;
  suggestion: string;
  core_competencies?: string[];
  core_differentiation?: string[];
  key_points: string[];
  sources_hint: string;
}

interface SuggestionPanelProps {
  suggestion: QuestionSuggestion;
  onApply?: (text: string) => void;
  onCopy?: () => void;
}

export function SuggestionPanel({ suggestion, onApply, onCopy }: SuggestionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    posthog.capture(newExpanded ? 'coach_suggestion_expanded' : 'coach_suggestion_collapsed', {
      question_index: suggestion.question_index,
    });
  };

  const buildFullText = () => {
    const sections: string[] = [];

    // Introduction
    if (suggestion.suggestion) {
      sections.push(suggestion.suggestion);
    }

    // Core Competencies
    if (suggestion.core_competencies && suggestion.core_competencies.length > 0) {
      sections.push('\nCore Competencies Proposals:');
      suggestion.core_competencies.forEach((p) => sections.push(`- ${p}`));
    }

    // Core Differentiation
    if (suggestion.core_differentiation && suggestion.core_differentiation.length > 0) {
      sections.push('\nCore Differentiation Capability:');
      suggestion.core_differentiation.forEach((p) => sections.push(`- ${p}`));
    }

    // Key Points
    if (suggestion.key_points.length > 0) {
      sections.push('\nKey Points:');
      suggestion.key_points.forEach((p) => sections.push(`- ${p}`));
    }

    return sections.join('\n');
  };

  const handleCopyKeyPoints = async () => {
    const text = buildFullText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      posthog.capture('coach_suggestion_copied', {
        question_index: suggestion.question_index,
        key_points_count: suggestion.key_points.length,
        core_competencies_count: suggestion.core_competencies?.length || 0,
        core_differentiation_count: suggestion.core_differentiation?.length || 0,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleApply = () => {
    const template = buildFullText() + '\n\n';
    onApply?.(template);
    posthog.capture('coach_suggestion_applied', {
      question_index: suggestion.question_index,
      key_points_count: suggestion.key_points.length,
      core_competencies_count: suggestion.core_competencies?.length || 0,
      core_differentiation_count: suggestion.core_differentiation?.length || 0,
    });
  };

  return (
    <div className="suggestion-panel mt-4 rounded-xl border border-slate-200 bg-[#f4f4f7]/50 overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={handleToggleExpand}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">&#10024;</span>
          <span className="text-sm font-semibold text-[#1a1f3a]">Coach Suggestion</span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Introduction Statement */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {suggestion.suggestion}
          </div>

          {/* Core Competencies Proposals */}
          {suggestion.core_competencies && suggestion.core_competencies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#1a1f3a] uppercase tracking-wider">
                Core Competencies Proposals:
              </h4>
              <ul className="space-y-1.5">
                {suggestion.core_competencies.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1f3a] mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Differentiation Capability */}
          {suggestion.core_differentiation && suggestion.core_differentiation.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Core Differentiation Capability:
              </h4>
              <ul className="space-y-1.5">
                {suggestion.core_differentiation.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Points */}
          {suggestion.key_points.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">
                Key Points:
              </h4>
              <ul className="space-y-1.5">
                {suggestion.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources Hint */}
          {suggestion.sources_hint && (
            <div className="text-xs text-slate-500 italic border-l-2 border-cyan-300 pl-3">
              <span className="font-medium">Where to look:</span> {suggestion.sources_hint}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyKeyPoints}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-cyan-300 transition-all"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Points
                </>
              )}
            </button>

            {onApply && (
              <button
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-[#fbbf24] rounded-lg hover:shadow-md transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Use as Starting Point
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Loading state component for when suggestions are being generated
 */
export function SuggestionPanelLoading() {
  return (
    <div className="suggestion-panel-loading mt-4 rounded-xl border border-slate-200 bg-[#f4f4f7]/50 p-4">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[#1a1f3a]">Generating suggestions...</span>
          <span className="text-xs text-slate-500">Analyzing your context and materials</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Error state component for when suggestion generation fails
 */
export function SuggestionPanelError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="suggestion-panel-error mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm text-amber-800">Unable to generate suggestions</span>
        </div>
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
