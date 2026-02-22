'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PersonalProfileData } from '@/types/database';

interface ProfileConversationProps {
  conversationId: string;
  onProfileComplete: (profile: PersonalProfileData) => void;
  onSkip: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ProfileConversation({ conversationId, onProfileComplete, onSkip }: ProfileConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isLoadingOpening, setIsLoadingOpening] = useState(true);
  const [isProfileDone, setIsProfileDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estimate dimension progress from message count
  const exchangeCount = messages.filter(m => m.role === 'user').length;
  const estimatedDimension = Math.min(5, Math.floor(exchangeCount / 2) + 1);
  const showCompleteButton = estimatedDimension >= 5 && !isProfileDone && !isStreaming;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Fetch opening message or load existing messages
  useEffect(() => {
    async function fetchOpening() {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: '' }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            setMessages([{ role: 'assistant', content: data.content }]);
          } else if (data.existingMessages && data.existingMessages > 0) {
            // Conversation already has messages — load them
            const convRes = await fetch(`/api/conversations/${conversationId}`);
            if (convRes.ok) {
              const convData = await convRes.json();
              if (convData.messages && Array.isArray(convData.messages)) {
                const loaded: ChatMessage[] = convData.messages
                  .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
                  .map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                  }));
                setMessages(loaded);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch opening message:', err);
      } finally {
        setIsLoadingOpening(false);
      }
    }
    fetchOpening();
  }, [conversationId]);

  // Parse profile from assistant message
  const extractProfile = useCallback((text: string): PersonalProfileData | null => {
    const match = text.match(/\[PROFILE_SUMMARY\]([\s\S]*?)\[\/PROFILE_SUMMARY\]/);
    if (!match) return null;
    try {
      return JSON.parse(match[1].trim());
    } catch {
      return null;
    }
  }, []);

  // Strip the marker from display text
  const cleanDisplayText = (text: string): string => {
    return text.replace(/\[PROFILE_SUMMARY\][\s\S]*?\[\/PROFILE_SUMMARY\]/, '').trim();
  };

  // Handle profile completion — save and notify parent
  const completeProfile = useCallback(async (profile: PersonalProfileData) => {
    setIsProfileDone(true);
    await fetch('/api/product-strategy-agent-v2/personal-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: conversationId, profileData: profile }),
    });
    onProfileComplete(profile);
  }, [conversationId, onProfileComplete]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isStreaming || isProfileDone) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText.trim() }]);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText.trim() }),
      });

      if (!res.ok || !res.body) throw new Error('Stream failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingContent(fullText);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
      setStreamingContent('');

      // Check for profile extraction
      const profile = extractProfile(fullText);
      if (profile) {
        await completeProfile(profile);
      }
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, isProfileDone, conversationId, extractProfile, completeProfile]);

  const handleSend = useCallback(() => {
    sendMessage(input);
  }, [input, sendMessage]);

  // "Complete My Profile" fallback — sends a trigger message to force the summary
  const handleCompleteProfile = useCallback(() => {
    sendMessage("That covers everything — please complete my profile and recommend a coach.");
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const inputDisabled = isStreaming || isProfileDone;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#1a1f3a]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-[#1a1f3a] shadow-md transition-transform duration-300 hover:scale-110">
            <Image src="/frontera-logo-F.jpg" alt="Frontera" width={32} height={32} className="w-full h-full object-cover" />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-white">Personal Profile</h2>
            <p className="text-xs text-slate-400">
              {isProfileDone ? 'Profile complete!' : 'Getting to know you as a leader'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(dim => (
              <div
                key={dim}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isProfileDone
                    ? 'bg-emerald-400'
                    : dim <= estimatedDimension ? 'bg-[#fbbf24]' : 'bg-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-1">
              {isProfileDone ? (
                <svg className="w-3.5 h-3.5 text-emerald-400 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                `${estimatedDimension}/5`
              )}
            </span>
          </div>
          {!isProfileDone && (
            <button
              onClick={onSkip}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
        {isLoadingOpening && (
          <div className="flex items-center gap-2.5 text-slate-600 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
            <span className="text-xs uppercase tracking-wide font-semibold">Preparing your intake...</span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1a1f3a] text-white'
                  : 'bg-[#f4f4f7] text-slate-700'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.role === 'assistant' ? cleanDisplayText(msg.content) : msg.content}</p>
            </div>
          </div>
        ))}

        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-[#f4f4f7] text-slate-700">
              <p className="whitespace-pre-wrap">{cleanDisplayText(streamingContent)}</p>
            </div>
          </div>
        )}

        {isStreaming && !streamingContent && (
          <div className="flex items-center gap-2.5 text-slate-600 text-sm">
            <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
            <span className="text-xs uppercase tracking-wide font-semibold">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Complete Profile fallback button — appears when all dimensions covered */}
      {showCompleteButton && (
        <div className="px-6 py-3 border-t border-emerald-100 bg-emerald-50/50">
          <button
            onClick={handleCompleteProfile}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Complete My Profile
          </button>
          <p className="text-xs text-slate-500 text-center mt-1.5">
            All dimensions covered — ready to generate your coaching profile
          </p>
        </div>
      )}

      {/* Input — disabled after profile completion */}
      <div className="px-6 py-4 border-t border-slate-100">
        {isProfileDone ? (
          <div className="flex items-center justify-center gap-2 py-2 text-emerald-700 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile complete — loading your summary...
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts..."
              rows={1}
              disabled={inputDisabled}
              className="flex-1 text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || inputDisabled}
              className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
