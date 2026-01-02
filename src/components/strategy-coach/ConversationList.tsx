"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Conversation } from "@/types/database";

interface ConversationListProps {
  conversations: Conversation[];
}

export default function ConversationList({
  conversations,
}: ConversationListProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewConversation = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Strategy Session",
          agent_type: "strategy_coach",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await response.json();
      router.push(`/dashboard/strategy-coach/${data.conversation.id}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Failed to start a new conversation. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* New conversation button */}
      <button
        onClick={handleNewConversation}
        disabled={isCreating}
        className="w-full bg-[#1e3a8a] text-white rounded-xl px-6 py-4 flex items-center justify-center gap-3 hover:bg-[#1e2a5e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Starting session...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="font-medium">Start New Strategy Session</span>
          </>
        )}
      </button>

      {/* Conversations list */}
      {conversations.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Previous Sessions
          </h3>
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onClick={() =>
                  router.push(`/dashboard/strategy-coach/${conversation.id}`)
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
          <p className="text-slate-600 mb-2">No coaching sessions yet</p>
          <p className="text-sm text-slate-400">
            Start your first strategy session to begin your transformation
            journey.
          </p>
        </div>
      )}
    </div>
  );
}

function ConversationCard({
  conversation,
  onClick,
}: {
  conversation: Conversation;
  onClick: () => void;
}) {
  const frameworkState = conversation.framework_state as {
    currentPhase?: string;
    totalMessageCount?: number;
  } | null;

  const phase = frameworkState?.currentPhase || "discovery";
  const messageCount = frameworkState?.totalMessageCount || 0;

  const phaseLabels: Record<string, string> = {
    discovery: "Discovery",
    research: "Research",
    synthesis: "Synthesis",
    planning: "Planning",
  };

  const phaseColors: Record<string, string> = {
    discovery: "bg-blue-100 text-blue-700",
    research: "bg-amber-100 text-amber-700",
    synthesis: "bg-purple-100 text-purple-700",
    planning: "bg-green-100 text-green-700",
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-slate-200 p-4 text-left hover:border-slate-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 truncate group-hover:text-[#1e3a8a] transition-colors">
            {conversation.title || "Strategy Session"}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {messageCount} messages · Last active{" "}
            {formatRelativeTime(conversation.last_message_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              phaseColors[phase] || phaseColors.discovery
            }`}
          >
            {phaseLabels[phase] || "Discovery"}
          </span>

          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a8a] transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>

      {conversation.context_summary && (
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
          {conversation.context_summary}
        </p>
      )}
    </button>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
