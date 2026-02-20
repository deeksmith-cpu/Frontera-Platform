'use client';

import Image from 'next/image';
import { Square } from 'lucide-react';

/**
 * StreamingMessage Component
 *
 * Displays an AI coach message with real-time character-by-character streaming.
 *
 * Features:
 * - Animated typing cursor during streaming
 * - Stop button to halt generation
 * - Matches Message component styling for consistency
 * - Smooth animations with Frontera design system
 */

interface StreamingMessageProps {
  content: string;
  onStop?: () => void;
}

export function StreamingMessage({ content, onStop }: StreamingMessageProps) {
  return (
    <div className="message flex flex-col gap-3 agent animate-fade-in">
      <div className="message-header flex items-center gap-2.5">
        <div className="message-avatar w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 bg-[#1a1f3a] shadow-md">
          <Image
            src="/avatars/marcus.jpg"
            alt="Marcus — Strategy Coach"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="message-role text-xs uppercase tracking-wider text-slate-600 font-semibold">
          Marcus
        </span>
        <div className="flex items-center gap-2 ml-auto">
          {/* Streaming indicator */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
            <span className="text-xs text-[#fbbf24] font-semibold">Streaming</span>
          </div>
          {/* Stop button */}
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
      </div>
      <div className="message-content pl-10 text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
        {content}
        {/* Typing cursor */}
        <span className="inline-block w-0.5 h-4 ml-0.5 bg-[#fbbf24] animate-pulse rounded-sm align-text-bottom" />
      </div>
    </div>
  );
}
