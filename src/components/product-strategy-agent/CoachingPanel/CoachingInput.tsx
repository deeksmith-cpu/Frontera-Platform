'use client';

import { useState, useRef, KeyboardEvent, useMemo } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface SmartPromptsContext {
  phase: string;
  materialsCount: number;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  synthesisAvailable: boolean;
}

interface SmartPrompt {
  text: string;
  category: 'discovery' | 'research' | 'synthesis' | 'bets' | 'general';
}

interface CoachingInputProps {
  onSendMessage: (content: string) => void;
  isDisabled: boolean;
  smartPromptsContext?: SmartPromptsContext;
}

// Generate smart prompts based on context
function getSmartPrompts(context?: SmartPromptsContext): SmartPrompt[] {
  if (!context) return [];

  const { phase, materialsCount, territoryProgress, synthesisAvailable } = context;
  const prompts: SmartPrompt[] = [];

  // Discovery phase prompts
  if (phase === 'discovery') {
    if (materialsCount === 0) {
      prompts.push({ text: "What documents should I upload to get started?", category: 'discovery' });
      prompts.push({ text: "Help me think through our strategic challenges", category: 'discovery' });
    } else {
      prompts.push({ text: "What insights can you share from my documents?", category: 'discovery' });
      prompts.push({ text: "Am I ready to start mapping strategic terrain?", category: 'discovery' });
    }
  }

  // Research phase prompts
  if (phase === 'research') {
    const { company, customer, competitor } = territoryProgress;

    if (company.mapped < company.total) {
      prompts.push({ text: "What should I focus on in Company territory?", category: 'research' });
    }
    if (customer.mapped < customer.total) {
      prompts.push({ text: "Help me understand our customer segments", category: 'research' });
    }
    if (competitor.mapped < competitor.total) {
      prompts.push({ text: "What competitive dynamics should I explore?", category: 'research' });
    }

    const totalMapped = company.mapped + customer.mapped + competitor.mapped;
    if (totalMapped >= 4 && !synthesisAvailable) {
      prompts.push({ text: "Am I ready to generate the strategic synthesis?", category: 'research' });
    }
  }

  // Synthesis phase prompts
  if (phase === 'synthesis') {
    prompts.push({ text: "Walk me through the strategic opportunities", category: 'synthesis' });
    prompts.push({ text: "What tensions exist in the synthesis?", category: 'synthesis' });
    prompts.push({ text: "Help me formulate Strategic Bets", category: 'synthesis' });
  }

  // Bets phase prompts
  if (phase === 'bets' || phase === 'planning') {
    prompts.push({ text: "How should I prioritize these Strategic Bets?", category: 'bets' });
    prompts.push({ text: "What success metrics should each bet have?", category: 'bets' });
    prompts.push({ text: "What are the key risks for each bet?", category: 'bets' });
  }

  // Add general fallback prompts if we have few phase-specific ones
  if (prompts.length < 2) {
    prompts.push({ text: "What should I focus on next?", category: 'general' });
    prompts.push({ text: "Help me understand my strategic position", category: 'general' });
  }

  return prompts.slice(0, 3); // Max 3 prompts
}

export function CoachingInput({ onSendMessage, isDisabled, smartPromptsContext }: CoachingInputProps) {
  const [value, setValue] = useState('');
  const [promptsExpanded, setPromptsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const smartPrompts = useMemo(
    () => getSmartPrompts(smartPromptsContext),
    [smartPromptsContext]
  );

  const handleSend = () => {
    if (value.trim() && !isDisabled) {
      onSendMessage(value);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handlePromptClick = (promptText: string) => {
    if (!isDisabled) {
      onSendMessage(promptText);
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
    <div className="coaching-input p-3 sm:p-4 border-t border-slate-100 bg-white">
      {/* Smart Prompts — collapsible */}
      {!isDisabled && smartPrompts.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setPromptsExpanded(!promptsExpanded)}
            className="flex items-center gap-1.5 mb-2 group"
          >
            <Sparkles className="w-3 h-3 text-[#fbbf24]" />
            <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
              Suggested prompts ({smartPrompts.length})
            </span>
            {promptsExpanded ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
          {promptsExpanded && (
            <div className="flex gap-2 overflow-x-auto flex-nowrap pb-1">
              {smartPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full border border-slate-200 transition-colors hover:border-slate-300 whitespace-nowrap flex-shrink-0"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="input-wrapper relative">
        <textarea
          ref={textareaRef}
          className="input-field w-full text-sm p-4 pr-14 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
          rows={2}
          placeholder="Share your insights or ask a question..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isDisabled}
          className="send-btn absolute right-2 bottom-2 w-10 h-10 bg-[#fbbf24] text-slate-900 hover:bg-[#f59e0b] border-0 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:shadow-lg hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 2L8 10M16 2L10.5 16L8 10M16 2L2 7.5L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
