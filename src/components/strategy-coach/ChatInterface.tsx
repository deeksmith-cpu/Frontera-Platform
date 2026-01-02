"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: Message[];
  conversationTitle?: string;
}

export default function ChatInterface({
  conversationId,
  initialMessages,
  conversationTitle,
}: ChatInterfaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request opening message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      requestOpeningMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOpeningMessage = async () => {
    setIsStreaming(true);
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: null }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get opening message");
      }

      const data = await response.json();
      if (data.content) {
        // New opening message was generated
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.content,
            created_at: new Date().toISOString(),
          },
        ]);
      } else if (data.existingMessages) {
        // Messages already exist - reload the page to fetch them
        window.location.reload();
      }
    } catch (err) {
      console.error("Error getting opening message:", err);
      setError("Failed to start the conversation. Please refresh the page.");
    } finally {
      setIsStreaming(false);
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setIsStreaming(true);
      setStreamingContent("");

      // Optimistically add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch(
          `/api/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to send message");
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response stream");
        }

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }

        // Add the complete assistant message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: fullContent,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent("");
      } catch (err) {
        console.error("Error sending message:", err);
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
        // Remove the optimistic user message on error
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsStreaming(false);
      }
    },
    [conversationId]
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/strategy-coach")}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Back to conversations"
            >
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="font-semibold text-slate-900">
                {conversationTitle || "Strategy Session"}
              </h1>
              <p className="text-xs text-slate-500">
                {messages.length} messages
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            {isStreaming && (
              <span className="flex items-center gap-1.5 text-xs text-[#1e3a8a]">
                <span className="w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse" />
                Thinking...
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto">
          <MessageList
            messages={messages}
            streamingContent={streamingContent}
            isStreaming={isStreaming}
          />
        </div>
      </div>

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        disabled={isStreaming}
        placeholder="Share your thoughts or ask a question..."
      />
    </div>
  );
}
