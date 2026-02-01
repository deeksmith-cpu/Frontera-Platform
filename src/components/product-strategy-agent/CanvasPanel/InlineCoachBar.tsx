'use client';

import { useState } from 'react';
import posthog from 'posthog-js';

interface QuestionSuggestion {
  question_index: number;
  suggestion: string;
  core_competencies?: string[];
  core_differentiation?: string[];
  key_points: string[];
  sources_hint: string;
}

interface InlineCoachBarProps {
  conversationId: string;
  territory: 'company' | 'customer' | 'competitor';
  researchArea: string;
  researchAreaTitle: string;
  question: string;
  questionIndex: number;
  existingResponse: string;
  onApplySuggestion: (questionIndex: number, text: string) => void;
}

export function InlineCoachBar({
  conversationId,
  territory,
  researchArea,
  researchAreaTitle,
  question,
  questionIndex,
  existingResponse,
  onApplySuggestion,
}: InlineCoachBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<QuestionSuggestion | null>(null);
  const [error, setError] = useState(false);

  const handleGetSuggestion = async () => {
    posthog.capture('inline_coach_suggestion_requested', { territory, research_area: researchArea, question_index: questionIndex });
    setIsLoading(true);
    setError(false);
    setSuggestion(null);

    try {
      const response = await fetch('/api/product-strategy-agent/coach-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: researchArea,
          research_area_title: researchAreaTitle,
          questions: [question],
          existing_responses: {
            0: existingResponse,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestion');
      }

      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestion({
          ...data.suggestions[0],
          question_index: questionIndex,
        });
      }
    } catch (err) {
      console.error('Error getting suggestion:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!suggestion) return;
    posthog.capture('inline_coach_suggestion_applied', { territory, research_area: researchArea, question_index: questionIndex });

    const sections: string[] = [];
    if (suggestion.suggestion) sections.push(suggestion.suggestion);
    if (suggestion.core_competencies?.length) {
      sections.push('\nCore Competencies:');
      suggestion.core_competencies.forEach(p => sections.push(`- ${p}`));
    }
    if (suggestion.core_differentiation?.length) {
      sections.push('\nCore Differentiation:');
      suggestion.core_differentiation.forEach(p => sections.push(`- ${p}`));
    }
    if (suggestion.key_points?.length) {
      sections.push('\nKey Points:');
      suggestion.key_points.forEach(p => sections.push(`- ${p}`));
    }

    onApplySuggestion(questionIndex, sections.join('\n') + '\n\n');
    setSuggestion(null);
  };

  const handleDismiss = () => {
    setSuggestion(null);
    setError(false);
  };

  const territoryColors = {
    company: {
      bg: 'from-[#1a1f3a]/5 to-[#1a1f3a]/10',
      border: 'border-[#1a1f3a]/20',
      text: 'text-[#1a1f3a]',
      button: 'from-[#1a1f3a] to-[#2d3561]',
      accent: 'bg-[#1a1f3a]',
    },
    customer: {
      bg: 'from-[#fbbf24]/10 to-[#fbbf24]/20',
      border: 'border-[#fbbf24]/30',
      text: 'text-[#b45309]',
      button: 'from-[#fbbf24] to-[#f59e0b]',
      accent: 'bg-[#fbbf24]',
    },
    competitor: {
      bg: 'from-cyan-50 to-cyan-100',
      border: 'border-cyan-200',
      text: 'text-[#0891b2]',
      button: 'from-[#0891b2] to-[#0e7490]',
      accent: 'bg-[#0891b2]',
    },
  };

  const colors = territoryColors[territory];

  return (
    <div className="inline-coach-bar mt-3">
      {/* Compact trigger bar */}
      {!suggestion && !error && (
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border ${colors.border} bg-gradient-to-r ${colors.bg} transition-all duration-200`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">&#10024;</span>
            <span className={`text-xs sm:text-sm font-semibold ${colors.text}`}>
              Need help with this question?
            </span>
          </div>
          <button
            onClick={handleGetSuggestion}
            disabled={isLoading}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 bg-gradient-to-r ${colors.button} text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Get AI Suggestion</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-amber-800">Unable to generate suggestion</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGetSuggestion}
              className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Expanded suggestion panel */}
      {suggestion && (
        <div className={`rounded-xl border ${colors.border} bg-white shadow-md overflow-hidden`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${colors.bg}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">&#10024;</span>
              <span className={`text-sm font-semibold ${colors.text}`}>AI Coach Suggestion</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-slate-700 leading-relaxed">{suggestion.suggestion}</p>

            {suggestion.core_competencies && suggestion.core_competencies.length > 0 && (
              <div className="space-y-2">
                <h4 className={`text-xs font-semibold ${colors.text} uppercase tracking-wider`}>
                  Core Competencies:
                </h4>
                <ul className="space-y-1">
                  {suggestion.core_competencies.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.accent} mt-2 flex-shrink-0`} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestion.core_differentiation && suggestion.core_differentiation.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  Core Differentiation:
                </h4>
                <ul className="space-y-1">
                  {suggestion.core_differentiation.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestion.key_points && suggestion.key_points.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">
                  Key Points:
                </h4>
                <ul className="space-y-1">
                  {suggestion.key_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestion.sources_hint && (
              <div className={`text-xs text-slate-500 italic border-l-2 ${colors.border} pl-3`}>
                <span className="font-medium">Where to look:</span> {suggestion.sources_hint}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colors.button} text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Use as Starting Point
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
