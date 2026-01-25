'use client';

/**
 * StreamingMessage Component
 *
 * Displays an AI coach message with real-time character-by-character streaming.
 *
 * Features:
 * - Animated typing cursor during streaming
 * - Bold border when actively streaming
 * - Stop button to halt streaming
 * - Smooth fade-in animation
 * - Preserves formatting with whitespace-pre-wrap
 */

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  onStop?: () => void;
}

export function StreamingMessage({ content, isStreaming, onStop }: StreamingMessageProps) {
  return (
    <div
      className={`streaming-message flex items-start gap-3 bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 transition-all ${
        isStreaming ? 'border-2 border-indigo-200' : 'border border-slate-200'
      }`}
    >
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

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Label */}
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          Frontera Coach
        </div>

        {/* Streaming Content with Typing Cursor */}
        <div className="text-base text-slate-900 leading-relaxed whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-5 bg-gradient-to-b from-indigo-600 to-cyan-600 animate-pulse ml-1 align-text-bottom" />
          )}
        </div>

        {/* Stop Button - Only visible when streaming */}
        {isStreaming && onStop && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={onStop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-red-300 rounded-lg text-red-700 font-semibold hover:bg-red-50 hover:border-red-400 transition-all text-sm"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="6" width="8" height="8" rx="1" />
              </svg>
              Stop Generating
            </button>
            <span className="text-xs text-slate-500">ESC to stop</span>
          </div>
        )}
      </div>
    </div>
  );
}
