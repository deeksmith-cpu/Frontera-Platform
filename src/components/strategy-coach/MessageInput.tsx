"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  disabled,
  placeholder = "Type your message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={`
                w-full resize-none rounded-xl border border-slate-300
                px-4 py-3 pr-12
                text-slate-800 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:border-[#fbbf24]
                disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
                transition-all duration-200
              `}
            />

            {/* Character count (optional, shows when > 500 chars) */}
            {message.length > 500 && (
              <span className="absolute right-3 bottom-3 text-xs text-slate-400">
                {message.length}
              </span>
            )}
          </div>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className={`
              flex-shrink-0 w-12 h-12 rounded-xl
              flex items-center justify-center
              transition-all duration-200
              ${
                disabled || !message.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-[#fbbf24] text-slate-900 hover:bg-[#f59e0b] active:scale-95"
              }
            `}
            aria-label="Send message"
          >
            {disabled ? (
              // Loading spinner
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              // Send icon
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Hint text */}
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Enter</kbd> to send,{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
