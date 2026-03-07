'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Send,
  ClipboardPaste,
  Plus,
  Zap,
  BookOpen,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import { getCoachAvatarPath } from '@/lib/agents/strategy-coach/personas';
import type { Territory } from '@/types/coaching-cards';
import type { ResearchQuestionPanelHandle } from './ResearchQuestionPanel';

interface ReviewData {
  summary: string;
  strengths?: string[];
  challenges: Array<{ question: string; rationale?: string }>;
  enhancements: Array<{ suggestion: string; example?: string }>;
  resources?: Array<{ id: string; type: string; title: string; source?: string; relevance?: string }>;
  suggestedRevision?: string;
}

type CoachMode = 'suggestion' | 'debate' | 'chat';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ResearchCoachPanelProps {
  territory: string;
  researchArea: string;
  questionIndex: number;
  existingAnswer: string;
  conversationId: string | null;
  coachName?: string;
  coachPersonaId?: string | null;
  questionPanelRef: React.RefObject<ResearchQuestionPanelHandle | null>;
  onInsertToAnswer: (text: string, mode: 'replace' | 'append') => void;
}

const TERRITORY_LABELS: Record<string, string> = {
  company: 'Company',
  customer: 'Customer',
  competitor: 'Market',
};

const MODE_TABS: { id: CoachMode; label: string; icon: typeof Sparkles }[] = [
  { id: 'suggestion', label: 'Suggest', icon: Sparkles },
  { id: 'debate', label: 'Challenge', icon: MessageSquare },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
];

function generateQuickReplies(mode: CoachMode): string[] {
  if (mode === 'suggestion') {
    return ['Challenge me on this', 'Give me an example', 'How do I find data?'];
  }
  if (mode === 'debate') {
    return ['Defend my position', 'What am I missing?', 'Suggest alternatives'];
  }
  return ['Help me think deeper', 'What frameworks apply?', 'Review my answer'];
}

export function ResearchCoachPanel({
  territory,
  researchArea,
  questionIndex,
  existingAnswer,
  conversationId,
  coachName = 'Strategy Coach',
  coachPersonaId,
  questionPanelRef,
  onInsertToAnswer,
}: ResearchCoachPanelProps) {
  const [mode, setMode] = useState<CoachMode>('suggestion');
  const [content, setContent] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  const area = useMemo(() => {
    return getResearchArea(territory as Territory, researchArea);
  }, [territory, researchArea]);

  const areaTitle = area?.title || researchArea || '';
  const territoryLabel = TERRITORY_LABELS[territory] || '';
  const contextLabel = [territoryLabel, areaTitle].filter(Boolean).join(' > ');

  const quickReplies = useMemo(() => generateQuickReplies(mode), [mode]);

  // Track fetched state per context
  const hasFetchedRef = useRef(false);
  const lastFetchedDraftRef = useRef<string>('');

  // Reset when question changes
  useEffect(() => {
    hasFetchedRef.current = false;
    lastFetchedDraftRef.current = '';
    setContent('');
    setReviewData(null);
    setChatMessages([]);
    setChatInput('');
  }, [territory, researchArea, questionIndex]);

  // Handle mode tab click — capture current draft and trigger fetch
  const handleModeSwitch = useCallback((newMode: CoachMode) => {
    if (newMode === mode && content) return; // Already showing this mode's content
    setMode(newMode);
    setContent('');
    setReviewData(null);
    setChatMessages([]);
    setChatInput('');
    hasFetchedRef.current = false;
    // Capture current draft at click time
    const currentDraft = questionPanelRef.current?.getCurrentAnswer() || existingAnswer;
    lastFetchedDraftRef.current = currentDraft;
  }, [mode, content, questionPanelRef, existingAnswer]);

  // Auto-fetch when mode changes (for suggest/debate)
  useEffect(() => {
    if (mode === 'chat') return;
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const currentDraft = lastFetchedDraftRef.current || questionPanelRef.current?.getCurrentAnswer() || existingAnswer;
    const abortController = new AbortController();

    const fetchCoachContent = async () => {
      setIsLoading(true);
      try {
        if (mode === 'suggestion') {
          if (!area) {
            setContent('Could not load research area questions. Please try again.');
            setIsLoading(false);
            return;
          }

          const questions = area.questions.map(q => q.text);
          const existingResponses: Record<number, string> = {};
          if (currentDraft) {
            existingResponses[questionIndex] = currentDraft;
          }

          const res = await fetch('/api/product-strategy-agent/coach-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: conversationId,
              territory,
              research_area: researchArea,
              research_area_title: area.title,
              questions,
              existing_responses: existingResponses,
            }),
            signal: abortController.signal,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.suggestions && Array.isArray(data.suggestions)) {
              const focused = data.suggestions.find(
                (s: { question_index: number }) => s.question_index === questionIndex
              ) || data.suggestions[0];
              if (focused) {
                const parts: string[] = [];
                if (focused.suggestion) parts.push(focused.suggestion);
                if (focused.key_points?.length > 0) {
                  parts.push('\n**Key Points:**');
                  focused.key_points.forEach((p: string) => parts.push(`- ${p}`));
                }
                if (focused.sources_hint) {
                  parts.push(`\n**Sources:** ${focused.sources_hint}`);
                }
                setContent(parts.join('\n'));
              } else {
                setContent('No suggestion available for this question.');
              }
            } else {
              setContent(data.suggestion || data.content || 'Suggestion generated.');
            }
          } else {
            setContent('Unable to get a suggestion right now. Try again in a moment.');
          }
        } else {
          // debate mode
          if (!currentDraft?.trim()) {
            setContent('Write your answer first, then I can challenge your thinking. The debate mode works best when I have something to push back on.');
            setIsLoading(false);
            return;
          }

          const res = await fetch('/api/product-strategy-agent/coach-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: conversationId,
              territory,
              research_area: researchArea,
              question_index: questionIndex,
              draft_answer: currentDraft,
            }),
            signal: abortController.signal,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.summary && (data.challenges || data.enhancements)) {
              setReviewData(data as ReviewData);
              setContent(data.summary);
            } else {
              setContent(data.review || data.content || data.summary || 'Review completed.');
            }
          } else {
            setContent('Unable to get a challenge right now. Try again in a moment.');
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setContent('Network error. Please check your connection.');
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCoachContent();
    return () => abortController.abort();
  }, [mode, territory, researchArea, questionIndex, conversationId, area, questionPanelRef, existingAnswer]);

  // Send chat message
  const handleSendChat = useCallback(async (messageOverride?: string) => {
    const messageText = (messageOverride || chatInput).trim();
    if (!messageText || !conversationId || isLoading) return;

    const currentDraft = questionPanelRef.current?.getCurrentAnswer() || existingAnswer;
    setChatInput('');
    const updatedHistory: ChatMessage[] = [...chatMessages, { role: 'user', content: messageText }];
    setChatMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch('/api/product-strategy-agent/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: researchArea,
          question_index: questionIndex,
          user_draft: currentDraft || '',
          coach_initial_content: content || '',
          mode,
          chat_history: chatMessages,
          message: messageText,
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
  }, [chatInput, conversationId, territory, researchArea, questionIndex, isLoading, chatMessages, content, mode, questionPanelRef, existingAnswer]);

  // Quick reply
  const handleQuickReply = useCallback((text: string) => {
    handleSendChat(text);
  }, [handleSendChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, content]);

  // Extract plain text for inserting into answer
  const getPlainTextContent = useCallback(() => {
    if (reviewData) {
      if (reviewData.suggestedRevision) return reviewData.suggestedRevision;
      const parts = [reviewData.summary];
      reviewData.enhancements.forEach(e => {
        parts.push(e.suggestion);
        if (e.example) parts.push(e.example);
      });
      return parts.join('\n\n');
    }
    if (!content) return '';
    const mainText = content.split('\n**Key Points:**')[0].trim();
    const keyPointsMatch = content.match(/\*\*Key Points:\*\*\n([\s\S]*?)(?:\n\*\*Sources:|$)/);
    const parts = [mainText];
    if (keyPointsMatch) {
      const points = keyPointsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(p => p.trim());
      if (points.length) parts.push('\n' + points.join('\n'));
    }
    return parts.join('\n');
  }, [content, reviewData]);

  // Insert action buttons
  const renderInsertActions = () => {
    if (!content) return null;
    return (
      <div className="flex items-center gap-1.5 px-3.5 pb-2 mt-1">
        <button
          onClick={() => onInsertToAnswer(getPlainTextContent(), 'replace')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] active:scale-95 transition-all shadow-sm"
        >
          <ClipboardPaste className="w-3 h-3" />
          Use This
        </button>
        <button
          onClick={() => onInsertToAnswer(getPlainTextContent(), 'append')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
        >
          <Plus className="w-3 h-3" />
          Append
        </button>
      </div>
    );
  };

  // Suggestion content
  const renderSuggestionContent = () => {
    if (!content) return null;
    const keyPointsMatch = content.match(/\*\*Key Points:\*\*\n([\s\S]*?)(?:\n\*\*Sources:|$)/);
    const sourcesMatch = content.match(/\*\*Sources:\*\*\s*(.*)/);
    const mainText = content.split('\n**Key Points:**')[0].trim();

    return (
      <div className="border-l-4 border-[#fbbf24] bg-[#fbbf24]/5 px-3.5 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] text-[#b8860b] bg-[#fbbf24]/15 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Coach Suggestion
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-2">{mainText}</p>
        {keyPointsMatch && (
          <div className="bg-white/80 rounded-xl p-2.5 mb-2 border border-[#fbbf24]/20">
            <ul className="text-[11px] text-slate-700 space-y-1 leading-relaxed">
              {keyPointsMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map((point, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="text-[#fbbf24] flex-shrink-0">&#10003;</span>
                  <span>{point.replace(/^-\s*/, '')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sourcesMatch && (
          <p className="text-[10px] text-slate-500 mt-1.5">
            <span className="font-semibold">Sources:</span> {sourcesMatch[1]}
          </p>
        )}
      </div>
    );
  };

  // Debate content
  const renderDebateContent = () => {
    if (!content) return null;

    if (reviewData) {
      return (
        <div className="border-l-4 border-cyan-400 bg-cyan-50/30 px-3.5 py-3 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Challenge Mode
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{reviewData.summary}</p>

          {reviewData.strengths && reviewData.strengths.length > 0 && (
            <div className="bg-emerald-50/60 rounded-lg p-2 border border-emerald-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1">Strengths</p>
              <ul className="text-[11px] text-slate-700 space-y-1">
                {reviewData.strengths.map((s, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-emerald-500 flex-shrink-0">&#10003;</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviewData.challenges.length > 0 && (
            <div className="bg-white/80 rounded-lg p-2 border border-cyan-200/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700 mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Challenges
              </p>
              <div className="space-y-1.5">
                {reviewData.challenges.map((c, i) => (
                  <div key={i} className="text-[11px]">
                    <p className="text-slate-800 font-medium leading-relaxed">{c.question}</p>
                    {c.rationale && (
                      <p className="text-slate-500 mt-0.5 italic">{c.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviewData.enhancements.length > 0 && (
            <div className="bg-white/80 rounded-lg p-2 border border-[#fbbf24]/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b8860b] mb-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Suggestions
              </p>
              <div className="space-y-1.5">
                {reviewData.enhancements.map((e, i) => (
                  <div key={i} className="text-[11px]">
                    <p className="text-slate-700 leading-relaxed">{e.suggestion}</p>
                    {e.example && (
                      <p className="text-slate-500 mt-0.5 bg-slate-50 rounded px-2 py-1 border border-slate-100 italic">{e.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviewData.resources && reviewData.resources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {reviewData.resources.map((r) => (
                <span
                  key={r.id}
                  className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5"
                  title={r.relevance}
                >
                  <BookOpen className="w-2.5 h-2.5" />
                  {r.title}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Fallback: plain text
    return (
      <div className="border-l-4 border-cyan-400 bg-cyan-50/50 px-3.5 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Challenge Mode
          </span>
        </div>
        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>
    );
  };

  const avatarPath = getCoachAvatarPath(coachPersonaId ?? undefined);

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Navy gradient header */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2"
        style={{ background: 'linear-gradient(180deg, #1e2440, #151930)' }}
      >
        {avatarPath ? (
          <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={avatarPath} alt={coachName} width={24} height={24} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-lg bg-[#2d3561] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3 h-3 text-[#fbbf24]" />
          </div>
        )}
        <span className="text-[11px] font-semibold text-white">{coachName}</span>
        {contextLabel && (
          <span className="text-[9px] text-slate-400">&middot; {contextLabel}</span>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex-shrink-0 flex gap-1 px-2.5 py-1.5 bg-slate-50 border-b border-slate-100">
        {MODE_TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleModeSwitch(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#1a1f3a] shadow-sm'
                  : 'text-slate-500 hover:bg-white hover:text-slate-700'
              }`}
            >
              <TabIcon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        {/* Suggestion / Debate content */}
        {mode !== 'chat' && (
          <>
            {isLoading && !content ? (
              <div className="px-3.5 py-4 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                <span className="text-xs text-slate-500">
                  {mode === 'suggestion' ? 'Generating suggestion...' : 'Preparing challenge...'}
                </span>
              </div>
            ) : (
              <>
                {mode === 'suggestion' ? renderSuggestionContent() : renderDebateContent()}
                {renderInsertActions()}
              </>
            )}
          </>
        )}

        {/* Chat messages */}
        <div className="px-3.5 py-2.5 space-y-2.5">
          {mode === 'chat' && chatMessages.length === 0 && !isLoading && (
            <p className="text-xs text-slate-400 text-center py-3">
              Ask your Strategy Coach anything about this question or your research.
            </p>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'}`}>
              {msg.role === 'assistant' && (
                avatarPath ? (
                  <div className="w-5 h-5 rounded-md overflow-hidden flex-shrink-0 mt-0.5">
                    <Image src={avatarPath} alt={coachName} width={20} height={20} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-md bg-[#2d3561] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#fbbf24]" />
                  </div>
                )
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
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
        </div>

        {/* Quick reply pills */}
        {content && chatMessages.length === 0 && !isLoading && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3.5 pb-2.5 ml-7">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat input — always visible */}
      <div className="flex-shrink-0 px-3.5 py-2.5 border-t border-slate-100 bg-slate-50">
        <div className="relative">
          <textarea
            ref={chatTextareaRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendChat();
              }
            }}
            placeholder="Ask coach about this question..."
            className="w-full min-h-[60px] text-[11px] py-2 pl-3 pr-10 border border-slate-200 rounded-lg bg-white text-slate-900 resize-vertical leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
            rows={2}
          />
          <button
            onClick={() => handleSendChat()}
            disabled={!chatInput.trim() || isLoading}
            className="absolute right-2 bottom-2 w-7 h-7 rounded-lg bg-[#fbbf24] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f59e0b] transition-all shadow-sm"
          >
            <Send className="w-3 h-3 text-[#1a1f3a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
