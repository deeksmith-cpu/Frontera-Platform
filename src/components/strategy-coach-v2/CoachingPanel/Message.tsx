'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import type { Database } from '@/types/database';

type MessageType = Database['public']['Tables']['conversation_messages']['Row'];

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isAgent = message.role === 'assistant';
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });

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
        {message.content}
      </div>
    </div>
  );
}
