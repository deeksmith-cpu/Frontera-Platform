'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import type { StrategicOpportunity } from '@/types/synthesis';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface OpportunityCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: StrategicOpportunity;
  userDraft?: StrategicOpportunity;
  conversationId: string;
}

const QUICK_REPLIES = [
  'Is my WTP/HTW pairing coherent?',
  'How can I strengthen this hypothesis?',
  'What assumptions am I missing?',
  'Suggest a better title',
];

export function OpportunityCoachDrawer({
  isOpen,
  onClose,
  opportunity,
  userDraft,
  conversationId,
}: OpportunityCoachDrawerProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when opportunity changes
  useEffect(() => {
    setChatMessages([]);
    setChatInput('');
  }, [opportunity.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = useCallback(async (messageOverride?: string) => {
    const messageText = (messageOverride || chatInput).trim();
    if (!messageText || isLoading) return;

    setChatInput('');
    const updatedHistory: ChatMessage[] = [...chatMessages, { role: 'user', content: messageText }];
    setChatMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/product-strategy-agent/synthesis/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          opportunity,
          user_draft: userDraft,
          message: messageText,
          chat_history: chatMessages,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setChatMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: accumulated };
            return updated;
          });
        }
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, conversationId, opportunity, userDraft, isLoading, chatMessages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-entrance-left">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-slate-200"
        style={{ background: 'linear-gradient(180deg, #1e2440, #151930)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#2d3561] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3 h-3 text-[#fbbf24]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-white block">Strategy Coach</span>
            <span className="text-[10px] text-slate-400 block truncate" title={opportunity.title}>
              {opportunity.title}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
          aria-label="Close coach drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
        {chatMessages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">Coach this Hypothesis</p>
            <p className="text-xs text-slate-500 max-w-[280px] mx-auto leading-relaxed">
              Ask for feedback on your strategic hypothesis, challenge your WTP/HTW pairing, or get suggestions for improvement.
            </p>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'}`}>
            {msg.role === 'assistant' && (
              <div className="w-5 h-5 rounded-md bg-[#2d3561] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-[#fbbf24]" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1a1f3a] text-white rounded-tr-sm'
                  : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm'
              }`}
            >
              {msg.content || (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
                  <span className="text-slate-400">Thinking...</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Quick replies - show only when no messages yet */}
        {chatMessages.length === 0 && !isLoading && (
          <div className="flex flex-wrap gap-1.5 justify-center pt-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => handleSendChat(reply)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
            placeholder="Ask about this hypothesis..."
            className="flex-1 text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={!chatInput.trim() || isLoading}
            className="w-7 h-7 rounded-lg bg-[#fbbf24] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f59e0b] transition-all"
          >
            <Send className="w-3 h-3 text-[#1a1f3a]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCoachDrawer;
