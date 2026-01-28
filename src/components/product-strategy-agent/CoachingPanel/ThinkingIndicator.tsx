'use client';

import { Square } from 'lucide-react';

/**
 * ThinkingIndicator Component
 *
 * Displays a bold, animated indicator when the AI coach is processing
 * user input before streaming a response.
 *
 * Features:
 * - Gradient animated dots
 * - Bold typography with uppercase
 * - Subtle background with border
 * - Smooth fade-in animation
 * - Optional stop button during generation
 */

interface ThinkingIndicatorProps {
  onStop?: () => void;
}

export function ThinkingIndicator({ onStop }: ThinkingIndicatorProps) {
  return (
    <div className="thinking-indicator flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-slate-200 animate-fade-in-up">
      {/* Coach Avatar */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Thinking Animation */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Gradient Dots */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse"
                style={{ animationDelay: '0s' }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </div>

            {/* Thinking Text */}
            <span className="text-sm font-bold uppercase tracking-wider text-indigo-600">
              Thinking...
            </span>
          </div>

          {/* Stop Button */}
          {onStop && (
            <button
              onClick={onStop}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Stop generation"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop</span>
            </button>
          )}
        </div>

        {/* Optional subtitle */}
        <p className="text-xs text-slate-500 mt-2">
          Analyzing your question and formulating strategic guidance
        </p>
      </div>
    </div>
  );
}
