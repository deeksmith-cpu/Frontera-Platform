'use client';

import { useState } from 'react';

interface ValidationResult {
  validation: 'improvement' | 'regression' | 'neutral';
  concerns: string[];
  suggested_edits: Record<string, string>;
  reasoning: string;
}

interface CoachValidationPanelProps {
  validationResult: ValidationResult;
  onAccept: (suggested_edits: Record<string, string>) => void;
  onDebate: () => void;
  onReject: () => void;
  onClose: () => void;
}

export function CoachValidationPanel({
  validationResult,
  onAccept,
  onDebate,
  onReject,
  onClose,
}: CoachValidationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const validationColor =
    validationResult.validation === 'improvement'
      ? 'emerald'
      : validationResult.validation === 'regression'
        ? 'red'
        : 'amber';

  const validationBg =
    validationResult.validation === 'improvement'
      ? 'bg-emerald-50'
      : validationResult.validation === 'regression'
        ? 'bg-red-50'
        : 'bg-amber-50';

  const validationBorder =
    validationResult.validation === 'improvement'
      ? 'border-emerald-200'
      : validationResult.validation === 'regression'
        ? 'border-red-200'
        : 'border-amber-200';

  const validationText =
    validationResult.validation === 'improvement'
      ? 'text-emerald-700'
      : validationResult.validation === 'regression'
        ? 'text-red-700'
        : 'text-amber-700';

  return (
    <div className={`mt-4 border ${validationBorder} ${validationBg} rounded-lg`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1a1f3a] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Coach Feedback</div>
            <div className={`text-xs font-medium ${validationText} uppercase tracking-wider`}>
              {validationResult.validation}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <svg
              className={`w-5 h-5 text-slate-600 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Reasoning */}
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Reasoning
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{validationResult.reasoning}</p>
          </div>

          {/* Concerns */}
          {validationResult.concerns && validationResult.concerns.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Concerns
              </div>
              <ul className="space-y-1">
                {validationResult.concerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-amber-600 mt-0.5">⚠</span>
                    <span className="leading-relaxed">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Edits */}
          {validationResult.suggested_edits && Object.keys(validationResult.suggested_edits).length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Suggested Edits
              </div>
              <div className="space-y-2">
                {Object.entries(validationResult.suggested_edits).map(([field, suggestion]) => (
                  <div key={field} className="border border-slate-200 bg-white rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                      {field.replace(/_/g, ' ')}
                    </div>
                    <p className="text-sm text-slate-900 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onAccept(validationResult.suggested_edits)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1a1f3a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d3561]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept Edits
            </button>
            <button
              onClick={onDebate}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Debate
            </button>
            <button
              onClick={onReject}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
