'use client';

import { useState } from 'react';
import { CoachingPanel } from './CoachingPanel/CoachingPanel';
import { CanvasPanel } from './CanvasPanel/CanvasPanel';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface StrategyCoachLayoutProps {
  conversations: Conversation[];
  userId: string;
  orgId: string;
}

export function StrategyCoachLayout({ conversations, userId, orgId }: StrategyCoachLayoutProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversations[0]?.id || null
  );

  // For now, show conversation list if no active conversation
  // In full implementation, this would be a proper session selector
  if (!activeConversationId && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-cream">
        <div className="text-center max-w-md">
          <h1 className="text-display-xl font-display font-semibold text-primary-ink mb-4">
            Welcome to Strategy Coach v2
          </h1>
          <p className="text-body-md text-secondary-ink mb-8">
            Start your first strategic context analysis using the 3Cs framework.
          </p>
          <button
            onClick={() => {
              // TODO: Create new conversation
              console.log('Create new conversation');
            }}
            className="px-6 py-3 bg-accent-cardinal text-white font-mono text-xs uppercase tracking-wide rounded hover:bg-accent-cardinal/90 transition-colors"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="strategy-coach-v2 h-screen overflow-hidden">
      <div className="grid grid-cols-[380px_1fr] h-full">
        <CoachingPanel
          conversation={activeConversation}
          userId={userId}
          orgId={orgId}
        />
        <CanvasPanel
          conversation={activeConversation}
          userId={userId}
          orgId={orgId}
        />
      </div>
    </div>
  );
}
