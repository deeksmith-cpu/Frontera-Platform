'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface CoachingInputProps {
  onSendMessage: (content: string) => void;
  isDisabled: boolean;
}

export function CoachingInput({ onSendMessage, isDisabled }: CoachingInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() && !isDisabled) {
      onSendMessage(value);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="coaching-input p-6 border-t border-slate-100 bg-white">
      <div className="input-wrapper relative">
        <textarea
          ref={textareaRef}
          className="input-field w-full text-sm p-4 pr-14 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
          rows={3}
          placeholder="Share your insights or ask a question..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isDisabled}
          className="send-btn absolute right-2 bottom-2 w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 border-0 rounded-xl flex items-center justify-center text-white cursor-pointer transition-all hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 2L8 10M16 2L10.5 16L8 10M16 2L2 7.5L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
