'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Send,
  ChevronDown,
  ClipboardPaste,
  Plus,
  Zap,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { getResearchArea } from '@/lib/agents/strategy-coach/research-questions';
import type { Territory } from '@/types/coaching-cards';

interface ReviewData {
  summary: string;
  strengths?: string[];
  challenges: Array<{ question: string; rationale?: string }>;
  enhancements: Array<{ suggestion: string; example?: string }>;
  resources?: Array<{ id: string; type: string; title: string; source?: string; relevance?: string }>;
  suggestedRevision?: string;
}

type CoachMode = 'suggestion' | 'debate' | 'chat';

interface QuestionContext {
  territory: string;
  researchArea: string;
  questionIndex: number;
  currentDraft: string;
}

interface CoachDrawerProps {
  isOpen: boolean;
  mode: CoachMode;
  onClose: () => void;
  questionContext: QuestionContext | null;
  conversationId: string | null;
  coachName?: string;
  onInsertToAnswer?: (text: string, mode: 'replace' | 'append') => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TERRITORY_LABELS: Record<string, string> = {
  company: 'Company',
  customer: 'Customer',
  competitor: 'Market',
};

function generateQuickReplies(mode: CoachMode, questionContext: QuestionContext | null): string[] {
  if (!questionContext) return [];
  if (mode === 'suggestion') {
    return ['Challenge me on this', 'Give me an example', 'How do I find data?'];
  }
  if (mode === 'debate') {
    return ['Defend my position', 'What am I missing?', 'Suggest alternatives'];
  }
  return ['Help me think deeper', 'What frameworks apply?', 'Review my answer'];
}

export function CoachDrawer({
  isOpen,
  mode,
  onClose,
  questionContext,
  conversationId,
  coachName = 'Strategy Coach',
  onInsertToAnswer,
}: CoachDrawerProps) {
  const [content, setContent] = useState('');
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const area = useMemo(() => {
    if (!questionContext) return null;
    return getResearchArea(questionContext.territory as Territory, questionContext.researchArea);
  }, [questionContext]);

  const areaTitle = area?.title || questionContext?.researchArea || '';
  const territoryLabel = TERRITORY_LABELS[questionContext?.territory || ''] || '';
  const contextLabel = [territoryLabel, areaTitle].filter(Boolean).join(' > ');

  const quickReplies = useMemo(
    () => generateQuickReplies(mode, questionContext),
    [mode, questionContext],
  );

  // Reset when mode or question changes
  useEffect(() => {
    setContent('');
    setReviewData(null);
    setChatMessages([]);
    setChatInput('');
  }, [mode, questionContext?.territory, questionContext?.researchArea, questionContext?.questionIndex]);

  // Auto-fetch suggestion/debate on open
  // Use a ref to track whether content has been fetched for the current context
  // to avoid including `content` in the dependency array (which causes re-trigger loops)
  const hasFetchedRef = useRef(false);
  // Track the draft that was used for the last fetch, so re-opening with a new draft triggers a new fetch
  const lastFetchedDraftRef = useRef<string>('');

  // Reset hasFetched when context changes
  useEffect(() => {
    hasFetchedRef.current = false;
    lastFetchedDraftRef.current = '';
  }, [mode, questionContext?.territory, questionContext?.researchArea, questionContext?.questionIndex]);

  useEffect(() => {
    if (!isOpen || !questionContext || mode === 'chat') return;
    // Allow re-fetch if the draft changed (e.g. user edited answer, closed drawer, re-opened)
    const draftChanged = questionContext.currentDraft !== lastFetchedDraftRef.current;
    if (hasFetchedRef.current && !draftChanged) return;
    hasFetchedRef.current = true;
    lastFetchedDraftRef.current = questionContext.currentDraft || '';
    // Clear previous content when re-fetching with new draft
    if (draftChanged && content) {
      setContent('');
      setReviewData(null);
    }

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
          if (questionContext.currentDraft) {
            existingResponses[questionContext.questionIndex] = questionContext.currentDraft;
          }

          const res = await fetch('/api/product-strategy-agent/coach-suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: conversationId,
              territory: questionContext.territory,
              research_area: questionContext.researchArea,
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
                (s: { question_index: number }) => s.question_index === questionContext.questionIndex
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
              setContent(data.suggestion || data.content || 'Suggestion generated. Try asking a follow-up question for more details.');
            }
          } else {
            const errText = await res.text().catch(() => '');
            console.error('Coach suggestion API error:', res.status, errText);
            setContent('Unable to get a suggestion right now. Try again in a moment.');
          }
        } else {
          if (!questionContext.currentDraft?.trim()) {
            setContent('Write your answer first, then I can challenge your thinking. The debate mode works best when I have something to push back on.');
            setIsLoading(false);
            return;
          }

          const res = await fetch('/api/product-strategy-agent/coach-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: conversationId,
              territory: questionContext.territory,
              research_area: questionContext.researchArea,
              question_index: questionContext.questionIndex,
              draft_answer: questionContext.currentDraft,
            }),
            signal: abortController.signal,
          });

          if (res.ok) {
            const data = await res.json();
            // Store the structured review data for rich rendering
            if (data.summary && (data.challenges || data.enhancements)) {
              setReviewData(data as ReviewData);
              setContent(data.summary); // Use summary as content flag
            } else {
              setContent(data.review || data.content || data.summary || 'Review completed.');
            }
          } else {
            const errText = await res.text().catch(() => '');
            console.error('Coach review API error:', res.status, errText);
            setContent('Unable to get a challenge right now. Try again in a moment.');
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        console.error('Coach drawer network error:', err);
        setContent('Network error. Please check your connection.');
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCoachContent();

    return () => abortController.abort();
  }, [isOpen, mode, questionContext?.territory, questionContext?.researchArea, questionContext?.questionIndex, questionContext?.currentDraft, conversationId, area]);

  // Send chat message (works in all modes as follow-up)
  const handleSendChat = useCallback(async (messageOverride?: string) => {
    const messageText = (messageOverride || chatInput).trim();
    if (!messageText || !conversationId || isLoading) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageText }),
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
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatInput, conversationId, isLoading]);

  // Quick reply click
  const handleQuickReply = useCallback((text: string) => {
    handleSendChat(text);
  }, [handleSendChat]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, content]);

  // Extract plain text from coach content for inserting into the answer
  const getPlainTextContent = useCallback(() => {
    // For debate/review mode: prefer suggestedRevision, then build from enhancements
    if (reviewData) {
      if (reviewData.suggestedRevision) return reviewData.suggestedRevision;
      // Fallback: combine summary + enhancement suggestions
      const parts = [reviewData.summary];
      reviewData.enhancements.forEach(e => {
        parts.push(e.suggestion);
        if (e.example) parts.push(e.example);
      });
      return parts.join('\n\n');
    }
    // For suggestion mode: strip markdown formatting
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

  // Insert action buttons shown below suggestion/debate content
  const renderInsertActions = () => {
    if (!onInsertToAnswer || !content) return null;
    const hasExistingDraft = !!questionContext?.currentDraft?.trim();

    return (
      <div className="flex items-center gap-1.5 px-4 pb-3 mt-1">
        <button
          onClick={() => onInsertToAnswer(getPlainTextContent(), 'replace')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg bg-[#fbbf24] text-[#1a1f3a] hover:bg-[#f59e0b] transition-all shadow-sm"
        >
          <ClipboardPaste className="w-3 h-3" />
          Use This
        </button>
        {hasExistingDraft && (
          <button
            onClick={() => onInsertToAnswer(getPlainTextContent(), 'append')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Plus className="w-3 h-3" />
            Append
          </button>
        )}
      </div>
    );
  };

  // Parse structured content for suggestion mode
  const renderSuggestionContent = () => {
    if (!content) return null;

    // Split into main suggestion and key points
    const keyPointsMatch = content.match(/\*\*Key Points:\*\*\n([\s\S]*?)(?:\n\*\*Sources:|$)/);
    const sourcesMatch = content.match(/\*\*Sources:\*\*\s*(.*)/);
    const mainText = content.split('\n**Key Points:**')[0].trim();

    return (
      <div className="border-l-4 border-[#fbbf24] bg-[#fbbf24]/5 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] text-[#b8860b] bg-[#fbbf24]/15 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Coach Suggestion
          </span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed mb-2">{mainText}</p>
        {keyPointsMatch && (
          <div className="bg-white/80 rounded-xl p-3 mb-2 border border-[#fbbf24]/20">
            <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
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
          <p className="text-[10px] text-slate-500 mt-2">
            <span className="font-semibold">Sources:</span> {sourcesMatch[1]}
          </p>
        )}
      </div>
    );
  };

  const renderDebateContent = () => {
    if (!content) return null;

    // If we have structured review data, render it richly
    if (reviewData) {
      return (
        <div className="border-l-4 border-cyan-400 bg-cyan-50/30 px-4 py-3 space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Challenge Mode
            </span>
          </div>

          {/* Summary */}
          <p className="text-sm text-slate-700 leading-relaxed">{reviewData.summary}</p>

          {/* Strengths */}
          {reviewData.strengths && reviewData.strengths.length > 0 && (
            <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 mb-1.5">Strengths</p>
              <ul className="text-xs text-slate-700 space-y-1">
                {reviewData.strengths.map((s, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-emerald-500 flex-shrink-0">&#10003;</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges */}
          {reviewData.challenges.length > 0 && (
            <div className="bg-white/80 rounded-lg p-2.5 border border-cyan-200/50">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-700 mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Challenges
              </p>
              <div className="space-y-2">
                {reviewData.challenges.map((c, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-slate-800 font-medium leading-relaxed">{c.question}</p>
                    {c.rationale && (
                      <p className="text-slate-500 mt-0.5 italic">{c.rationale}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhancements */}
          {reviewData.enhancements.length > 0 && (
            <div className="bg-white/80 rounded-lg p-2.5 border border-[#fbbf24]/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b8860b] mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Suggestions
              </p>
              <div className="space-y-2">
                {reviewData.enhancements.map((e, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-slate-700 leading-relaxed">{e.suggestion}</p>
                    {e.example && (
                      <p className="text-slate-500 mt-0.5 bg-slate-50 rounded px-2 py-1 border border-slate-100 italic">{e.example}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
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

    // Fallback: plain text rendering
    return (
      <div className="border-l-4 border-cyan-400 bg-cyan-50/50 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[9px] text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
            Challenge Mode
          </span>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>
    );
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-out overflow-hidden
        ${isOpen ? 'max-h-[520px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
      `}
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden" style={{ maxHeight: '520px' }}>
        {/* Navy gradient header */}
        <div
          className="px-4 py-2.5 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(180deg, #1e2440, #151930)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#2d3561] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-[#fbbf24]" />
            </div>
            <span className="text-xs font-semibold text-white">{coachName}</span>
            {contextLabel && (
              <span className="text-[9px] text-slate-400">&middot; {contextLabel}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            aria-label="Minimize coach drawer"
          >
            <ChevronDown className="w-3 h-3" />
            <span>Minimize</span>
          </button>
        </div>

        {/* Content area */}
        <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          {/* Suggestion / Debate content card */}
          {mode !== 'chat' && (
            <>
              {isLoading && !content ? (
                <div className="px-4 py-4 flex items-center gap-2.5">
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

          {/* Chat messages (shown in all modes as follow-up conversation) */}
          <div className="px-4 py-3 space-y-3">
            {mode === 'chat' && chatMessages.length === 0 && !isLoading && (
              <p className="text-xs text-slate-400 text-center py-3">
                Ask your Strategy Coach anything about this question or your research.
              </p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 rounded-md bg-[#2d3561] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#fbbf24]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
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

          {/* Quick reply pills — shown after content loads, before any chat messages */}
          {content && chatMessages.length === 0 && !isLoading && quickReplies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3 ml-7">
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

        {/* Input bar — always visible */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
              placeholder="Ask coach about this question..."
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
    </div>
  );
}
