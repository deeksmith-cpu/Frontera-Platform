'use client';

import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { SuggestedFollowups } from './SuggestedFollowups';
import { EvidenceLinks, FormattedContent, parseEvidenceReferences, EvidenceRef } from './EvidenceLinks';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageProps {
  message: MessageType;
  isLastMessage?: boolean;
  currentPhase?: string;
  onSendFollowup?: (question: string) => void;
  onNavigateToEvidence?: (ref: EvidenceRef) => void;
}

export function Message({
  message,
  isLastMessage = false,
  currentPhase = 'discovery',
  onSendFollowup,
  onNavigateToEvidence,
}: MessageProps) {
  const isAgent = message.role === 'assistant';
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });

  // Parse evidence references from assistant messages
  const { references } = useMemo(() => {
    if (!isAgent) return { text: message.content, references: [] };
    return parseEvidenceReferences(message.content);
  }, [isAgent, message.content]);

  // Show follow-ups for assistant messages that are the last message
  const showFollowups = isAgent && isLastMessage && onSendFollowup;

  // Show evidence links for assistant messages with references
  const showEvidenceLinks = isAgent && references.length > 0;

  return (
    <div className={`message flex flex-col gap-3 ${isAgent ? 'agent' : 'user'}`}>
      <div className="message-header flex items-center gap-2.5">
        <div className={`message-avatar w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 ${
          isAgent
            ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 shadow-md'
            : 'bg-gradient-to-br from-slate-100 to-slate-200'
        }`}>
          {isAgent ? (
            <Image
              src="/frontera-logo-F.jpg"
              alt="Frontera"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-slate-700">U</span>
          )}
        </div>
        <span className="message-role text-xs uppercase tracking-wider text-slate-600 font-semibold">
          {isAgent ? 'Frontera Coach' : 'You'}
        </span>
        <span className="message-time text-xs text-slate-400 ml-auto">
          {timeAgo}
        </span>
      </div>
      <div className={`message-content pl-10 text-sm leading-relaxed whitespace-pre-wrap ${
        isAgent ? 'text-slate-700' : 'text-slate-900'
      }`}>
        {/* Render content with evidence highlighting for assistant messages */}
        {isAgent && references.length > 0 ? (
          <FormattedContent
            content={message.content}
            references={references}
            onReferenceClick={onNavigateToEvidence}
          />
        ) : (
          message.content
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
            messageContent={message.content}
            onSelect={onSendFollowup}
          />
        )}
      </div>
    </div>
  );
}
