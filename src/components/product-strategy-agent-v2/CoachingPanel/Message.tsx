'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Lightbulb, Check } from 'lucide-react';
import { SuggestedFollowups } from './SuggestedFollowups';
import { EvidenceLinks, FormattedContent, parseEvidenceReferences, EvidenceRef } from './EvidenceLinks';
import { MessageTypeBadge } from './MessageTypeBadge';
import { MessageReactions } from './MessageReactions';
import { FrameworkImage, parseFrameworkMarkers } from './FrameworkImage';
import { stripResearchMarkers } from '@/lib/agents/strategy-coach/research-extractor';
import { classifyMessage } from '@/lib/agents/strategy-coach/message-classifier';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageProps {
  message: MessageType;
  conversationId?: string;
  isLastMessage?: boolean;
  currentPhase?: string;
  onSendFollowup?: (question: string) => void;
  onNavigateToEvidence?: (ref: EvidenceRef) => void;
  onCaptureInsight?: (messageId: string, territory: string, content: string) => void;
  isCaptured?: boolean;
}

// Parse [Insight:territory:summary] markers from coach messages
function parseInsightMarkers(content: string): {
  cleanContent: string;
  insights: Array<{ territory: string; summary: string }>;
} {
  const pattern = /\[Insight:(company|customer|competitor|general):([^\]]+)\]/g;
  const insights: Array<{ territory: string; summary: string }> = [];
  let match;

  while ((match = pattern.exec(content)) !== null) {
    insights.push({ territory: match[1], summary: match[2].trim() });
  }

  const cleanContent = content.replace(pattern, '').trim();
  return { cleanContent, insights };
}

const TERRITORY_OPTIONS = [
  { id: 'company', label: 'Company', color: 'indigo' },
  { id: 'customer', label: 'Customer', color: 'cyan' },
  { id: 'competitor', label: 'Market Context', color: 'purple' },
  { id: 'general', label: 'General', color: 'slate' },
] as const;

const TERRITORY_COLORS: Record<string, string> = {
  company: 'bg-[#1a1f3a]/5 border-[#1a1f3a]/20 text-[#1a1f3a]',
  customer: 'bg-[#fbbf24]/10 border-[#fbbf24]/30 text-[#b45309]',
  competitor: 'bg-cyan-50 border-cyan-200 text-[#0891b2]',
  general: 'bg-slate-50 border-slate-200 text-slate-700',
};

export function Message({
  message,
  conversationId,
  isLastMessage = false,
  currentPhase = 'discovery',
  onSendFollowup,
  onNavigateToEvidence,
  onCaptureInsight,
  isCaptured = false,
}: MessageProps) {
  const isAgent = message.role === 'assistant';
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
  const [showTerritoryPicker, setShowTerritoryPicker] = useState(false);
  const [justCaptured, setJustCaptured] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker on outside click
  useEffect(() => {
    if (!showTerritoryPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowTerritoryPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTerritoryPicker]);

  // Parse evidence references from assistant messages
  const { references } = useMemo(() => {
    if (!isAgent) return { text: message.content, references: [] };
    return parseEvidenceReferences(message.content);
  }, [isAgent, message.content]);

  // Parse insight markers from assistant messages
  const { cleanContent, insights: proposedInsights } = useMemo(() => {
    if (!isAgent) return { cleanContent: message.content, insights: [] };
    return parseInsightMarkers(message.content);
  }, [isAgent, message.content]);

  // Classify message type for badge
  const classification = useMemo(() => {
    if (!isAgent) return null;
    return classifyMessage(cleanContent);
  }, [isAgent, cleanContent]);

  // Parse framework markers from assistant messages
  const { cleanContent: contentAfterFrameworks, frameworkIds } = useMemo(() => {
    if (!isAgent) return { cleanContent: classification?.cleanContent ?? cleanContent, frameworkIds: [] };
    return parseFrameworkMarkers(classification?.cleanContent ?? cleanContent);
  }, [isAgent, classification, cleanContent]);

  // Strip any remaining research markers (safety net for DB-loaded messages)
  const displayContent = isAgent
    ? stripResearchMarkers(contentAfterFrameworks)
    : message.content;

  const metadata = message.metadata as Record<string, unknown> | null;

  // Check if this message captured research
  const hasResearchCapture = !!metadata?.researchCaptured;

  // Show follow-ups for assistant messages that are the last message
  const showFollowups = isAgent && isLastMessage && onSendFollowup;

  // Show evidence links for assistant messages with references
  const showEvidenceLinks = isAgent && references.length > 0;

  const handleCapture = (territory: string) => {
    if (onCaptureInsight) {
      // Use first 300 chars of message as the insight content
      const summary = message.content.replace(/\[Insight:[^\]]+\]/g, '').trim().slice(0, 300);
      onCaptureInsight(message.id, territory, summary);
      setShowTerritoryPicker(false);
      setJustCaptured(true);
    }
  };

  const handleProposedInsightCapture = (territory: string, summary: string) => {
    if (onCaptureInsight) {
      onCaptureInsight(message.id, territory, summary);
      setJustCaptured(true);
    }
  };

  const captured = isCaptured || justCaptured;

  return (
    <div className={`message flex flex-col gap-3 ${isAgent ? 'agent' : 'user'}`}>
      <div className="message-header flex items-center gap-2.5">
        <div className={`message-avatar w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 ${
          isAgent
            ? 'bg-[#1a1f3a] shadow-md'
            : 'bg-gradient-to-br from-slate-100 to-slate-200'
        }`}>
          {isAgent ? (
            <Image
              src="/avatars/marcus.jpg"
              alt="Marcus — Strategy Coach"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-slate-700">U</span>
          )}
        </div>
        <span className="message-role text-xs uppercase tracking-wider text-slate-600 font-semibold">
          {isAgent ? 'Marcus' : 'You'}
        </span>

        {/* Message type badge */}
        {classification && classification.type !== 'general' && (
          <MessageTypeBadge type={classification.type} />
        )}

        {/* Research captured badge */}
        {hasResearchCapture && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Research captured
          </span>
        )}

        {/* Capture Insight button — only on assistant messages */}
        {isAgent && onCaptureInsight && (
          <div className="relative ml-auto" ref={pickerRef}>
            <button
              onClick={() => !captured && setShowTerritoryPicker(!showTerritoryPicker)}
              className={`p-1 rounded-lg transition-all duration-300 ${
                captured
                  ? 'text-[#fbbf24] cursor-default'
                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
              }`}
              title={captured ? 'Insight captured' : 'Capture insight'}
            >
              {captured ? (
                <Check className="w-4 h-4" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
            </button>

            {showTerritoryPicker && (
              <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1 w-44">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider px-3 py-1.5">
                  Save to territory
                </p>
                {TERRITORY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleCapture(opt.id)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      opt.color === 'indigo' ? 'bg-indigo-400' :
                      opt.color === 'cyan' ? 'bg-cyan-400' :
                      opt.color === 'purple' ? 'bg-purple-400' : 'bg-slate-400'
                    }`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <span className={`message-time text-xs text-slate-400 ${isAgent && onCaptureInsight ? '' : 'ml-auto'}`}>
          {timeAgo}
        </span>
      </div>
      <div className={`message-content pl-10 text-sm leading-relaxed whitespace-pre-wrap ${
        isAgent ? 'text-slate-700' : 'text-slate-900'
      }`}>
        {/* Render content with evidence highlighting for assistant messages */}
        {isAgent && references.length > 0 ? (
          <FormattedContent
            content={displayContent}
            references={references}
            onReferenceClick={onNavigateToEvidence}
          />
        ) : (
          displayContent
        )}

        {/* Framework diagrams */}
        {isAgent && frameworkIds.length > 0 && (
          <div className="space-y-2 mt-2">
            {frameworkIds.map(id => (
              <FrameworkImage key={id} frameworkId={id} />
            ))}
          </div>
        )}

        {/* Coach-proposed insights */}
        {isAgent && proposedInsights.length > 0 && !captured && (
          <div className="mt-3 space-y-2">
            {proposedInsights.map((insight, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2.5 rounded-xl border ${TERRITORY_COLORS[insight.territory] || TERRITORY_COLORS.general}`}
              >
                <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">{insight.summary}</p>
                  <button
                    onClick={() => handleProposedInsightCapture(insight.territory, insight.summary)}
                    className="mt-1 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity"
                  >
                    Capture this insight
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evidence links summary for assistant messages */}
        {showEvidenceLinks && (
          <EvidenceLinks
            references={references}
            onNavigate={onNavigateToEvidence}
          />
        )}

        {/* Suggested follow-ups for the last assistant message */}
        {showFollowups && (
          <SuggestedFollowups
            phase={currentPhase}
            messageContent={displayContent}
            onSelect={onSendFollowup}
          />
        )}

        {/* Reactions — only on assistant messages with a saved conversationId */}
        {isAgent && conversationId && (
          <MessageReactions
            messageId={message.id}
            conversationId={conversationId}
            initialLiked={!!metadata?.liked}
            initialBookmarked={!!metadata?.bookmarked}
          />
        )}
      </div>
    </div>
  );
}
