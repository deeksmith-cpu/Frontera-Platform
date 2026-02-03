# Priority 1 Mockup Specifications

**Document Version**: 1.0
**Created**: January 18, 2026
**Mockups Included**:
- Mockup 1: AI Streaming Response with Typing Indicator
- Mockup 2: Territory Deep-Dive Sidebar Navigation

**Design System Reference**: CLAUDE.md Design Principles (Frontera Platform)

---

## Table of Contents

1. [Mockup 1: AI Streaming Response with Typing Indicator](#mockup-1-ai-streaming-response-with-typing-indicator)
   - [Visual Specification](#11-visual-specification)
   - [Component Breakdown](#12-component-breakdown)
   - [Implementation Guide](#13-implementation-guide)
   - [Technical Architecture](#14-technical-architecture)

2. [Mockup 2: Territory Deep-Dive Sidebar Navigation](#mockup-2-territory-deep-dive-sidebar-navigation)
   - [Visual Specification](#21-visual-specification)
   - [Component Breakdown](#22-component-breakdown)
   - [Implementation Guide](#23-implementation-guide)
   - [Technical Architecture](#24-technical-architecture)

3. [Implementation Priority & Dependencies](#3-implementation-priority--dependencies)

---

# Mockup 1: AI Streaming Response with Typing Indicator

**Impact**: HIGH | **Effort**: MEDIUM (2-3 days) | **Priority Score**: 9.5/10

**Problem Solved**: Currently, users experience a 5-10 second silent pause while the AI generates responses. The system reads the stream but doesn't display it incrementally, creating anxiety and making the interface feel broken.

**Solution**: Real-time streaming display with visual feedback at every stage of the AI response lifecycle.

---

## 1.1 Visual Specification

### State 1: User Submits Message

```
┌─────────────────────────────────────────────────────────────┐
│  COACHING PANEL (25% width, left sidebar)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Previous messages...]                                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 👤 YOU                                             │    │
│  │                                                     │    │
│  │ What should I focus on first in the Customer      │    │
│  │ Territory research?                                │    │
│  │                                                     │    │
│  │                                     2:34 PM        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Message input is disabled, shows subtle loading state]    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- User message: `bg-white border border-slate-200 rounded-2xl p-4`
- Avatar: `w-8 h-8 rounded-xl bg-slate-200 text-slate-700`
- Timestamp: `text-xs text-slate-400 mt-2`
- Input disabled state: `opacity-60 cursor-not-allowed`

---

### State 2: Thinking Indicator (0-2 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│  [User message above]                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [F]  FRONTERA COACH                                │    │
│  │                                                     │    │
│  │  ● ● ●  Thinking...                                │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Container: `bg-slate-50 border border-slate-100 rounded-2xl p-4`
- Coach avatar: `w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600`
- Thinking dots: Three circles with staggered `animate-pulse`
  - Circle 1: `delay-0`
  - Circle 2: `delay-150`
  - Circle 3: `delay-300`
- Dots color: `bg-slate-400`
- Text: `text-xs uppercase tracking-wide font-semibold text-slate-500`

**Animation CSS**:
```css
@keyframes thinking-dot {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

.thinking-dot-1 { animation: thinking-dot 1.4s ease-in-out infinite; }
.thinking-dot-2 { animation: thinking-dot 1.4s ease-in-out 0.2s infinite; }
.thinking-dot-3 { animation: thinking-dot 1.4s ease-in-out 0.4s infinite; }
```

---

### State 3: Streaming Response (2-10 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│  [User message above]                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [F]  FRONTERA COACH                                │    │
│  │                                                     │    │
│  │ Great question. I'd recommend starting with the    │    │
│  │ Market Segmentation research area, as it▌          │    │
│  │                                                     │    │
│  │ [⏸ Stop generating]  [🔄 Regenerate]              │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Container: `bg-slate-50 border border-slate-100 rounded-2xl p-4`
- Streaming text: `text-sm text-slate-900 leading-relaxed whitespace-pre-wrap`
- Typing cursor: `inline-block w-0.5 h-5 bg-indigo-600 animate-pulse ml-0.5`
- Action buttons (inline, below streaming text):
  - Stop: `text-xs py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-red-300 transition-colors`
  - Regenerate: `text-xs py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-cyan-300 transition-colors`
- Buttons container: `flex items-center gap-2 mt-3 pt-3 border-t border-slate-200`

**Key UX Decisions**:
1. **Inline action buttons**: Visible during streaming (not after)
2. **Stop button**: Red hover state communicates destructive action
3. **Typing cursor**: Blinks at reading pace (not too fast)
4. **Smooth text appearance**: No jarring line breaks mid-word

---

### State 4: Complete Response

```
┌─────────────────────────────────────────────────────────────┐
│  [User message above]                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [F]  FRONTERA COACH                                │    │
│  │                                                     │    │
│  │ Great question. I'd recommend starting with the    │    │
│  │ Market Segmentation research area, as it provides  │    │
│  │ foundational insights into who your customers are  │    │
│  │ and how they differ in needs.                      │    │
│  │                                                     │    │
│  │ This will inform both the Jobs-to-be-Done and      │    │
│  │ Value Perception areas, creating a logical         │    │
│  │ progression through the Customer Territory.        │    │
│  │                                                     │    │
│  │                                     2:35 PM        │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [✓ Actions: Copy, Regenerate, Give Feedback]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Complete message: `bg-slate-50 border border-slate-100 rounded-2xl p-4`
- Timestamp: `text-xs text-slate-400 mt-3 pt-3 border-t border-slate-200`
- Action row (appears on hover):
  - Container: `flex items-center gap-3 mt-3 pt-3 border-t border-slate-200 opacity-0 hover:opacity-100 transition-opacity`
  - Copy button: Icon + text, slate color
  - Regenerate button: Icon + text, indigo color
  - Feedback button: Icon + text, slate color

**Hover State Enhancement**:
- Message card: `hover:shadow-md hover:border-slate-200 transition-all duration-300`
- Actions fade in: `opacity-0 group-hover:opacity-100 transition-opacity duration-200`

---

### State 5: Error State

```
┌─────────────────────────────────────────────────────────────┐
│  [User message above]                                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [F]  FRONTERA COACH                                │    │
│  │                                                     │    │
│  │ ⚠️ I encountered an error generating this response.│    │
│  │                                                     │    │
│  │ [🔄 Try Again]  [💬 Contact Support]              │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Design Specs**:
- Error container: `bg-red-50 border border-red-200 rounded-2xl p-4`
- Error message: `text-sm text-red-800 flex items-start gap-2`
- Warning icon: `text-red-600 text-lg flex-shrink-0`
- Action buttons:
  - Try Again: `bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:shadow-lg transition-all`
  - Contact Support: `bg-white border border-slate-300 text-slate-700 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors`

---

## 1.2 Component Breakdown

### New Components to Create

#### 1. `StreamingMessage.tsx`
```typescript
interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  onStop?: () => void;
  onRegenerate?: () => void;
}
```

**Responsibilities**:
- Display incrementally received text
- Show typing cursor at end of content
- Render inline action buttons during streaming
- Handle stop/regenerate actions

---

#### 2. `ThinkingIndicator.tsx`
```typescript
interface ThinkingIndicatorProps {
  message?: string; // Default: "Thinking..."
}
```

**Responsibilities**:
- Animated three-dot indicator
- Customizable message
- Staggered pulse animation

---

#### 3. `MessageActions.tsx`
```typescript
interface MessageActionsProps {
  onCopy: () => void;
  onRegenerate: () => void;
  onFeedback: () => void;
  isVisible?: boolean; // Control via parent hover state
}
```

**Responsibilities**:
- Copy message to clipboard
- Request regeneration
- Submit feedback (thumbs up/down)
- Fade in on hover

---

### Components to Modify

#### `MessageStream.tsx` (Current: 44 lines)

**Current Behavior**:
- Reads stream but displays all at once after completion
- Shows simple loading indicator: `"Coach is thinking..."`

**New Behavior**:
```typescript
export function MessageStream({ messages, isLoading }: MessageStreamProps) {
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // ... existing code ...

  return (
    <div ref={streamRef} className="message-stream h-full overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {/* Replace simple loading with ThinkingIndicator */}
      {isLoading && !isStreaming && <ThinkingIndicator />}

      {/* Add streaming message during active streaming */}
      {isStreaming && (
        <StreamingMessage
          content={streamingContent}
          isStreaming={true}
          onStop={handleStopStreaming}
          onRegenerate={handleRegenerateRequest}
        />
      )}
    </div>
  );
}
```

---

#### `CoachingPanel.tsx` (Current: 160 lines)

**Current Streaming Logic** (Lines 112-122):
```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let assistantContent = '';

if (reader) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    assistantContent += decoder.decode(value);
  }
}
// Problem: Accumulates entire response, then displays all at once
```

**New Streaming Logic**:
```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let assistantContent = '';

// Signal streaming started
setIsStreaming(true);

if (reader) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    assistantContent += chunk;

    // Update streaming content in real-time
    setStreamingContent(assistantContent);
  }
}

// Signal streaming complete
setIsStreaming(false);

// Add final message to messages array
const assistantMessage: Message = { /* ... */ };
setMessages(prev => [...prev, assistantMessage]);
```

---

## 1.3 Implementation Guide

### Step 1: Create Foundation Components (Day 1, 2-3 hours)

**File**: `src/components/product-strategy-agent/CoachingPanel/ThinkingIndicator.tsx`

```typescript
'use client';

interface ThinkingIndicatorProps {
  message?: string;
}

export function ThinkingIndicator({ message = 'Thinking...' }: ThinkingIndicatorProps) {
  return (
    <div className="thinking-indicator flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
      {/* Coach Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="/frontera-logo-F.jpg" alt="Frontera" className="w-full h-full object-cover" />
      </div>

      {/* Thinking Animation */}
      <div className="flex-1 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse thinking-dot-1" />
          <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse thinking-dot-2" />
          <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse thinking-dot-3" />
        </div>
        <span className="text-xs uppercase tracking-wide font-semibold text-slate-500">
          {message}
        </span>
      </div>
    </div>
  );
}
```

**CSS** (add to `globals.css`):
```css
@keyframes thinking-dot {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.thinking-dot-1 { animation: thinking-dot 1.4s ease-in-out infinite; }
.thinking-dot-2 { animation: thinking-dot 1.4s ease-in-out 0.2s infinite; }
.thinking-dot-3 { animation: thinking-dot 1.4s ease-in-out 0.4s infinite; }
```

---

**File**: `src/components/product-strategy-agent/CoachingPanel/StreamingMessage.tsx`

```typescript
'use client';

import { useState } from 'react';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  onStop?: () => void;
  onRegenerate?: () => void;
}

export function StreamingMessage({
  content,
  isStreaming,
  onStop,
  onRegenerate
}: StreamingMessageProps) {
  return (
    <div className="streaming-message flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
      {/* Coach Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="/frontera-logo-F.jpg" alt="Frontera" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Frontera Coach
          </span>
        </div>

        {/* Streaming Text */}
        <div className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-5 bg-indigo-600 animate-pulse ml-0.5 align-text-bottom" />
          )}
        </div>

        {/* Streaming Actions */}
        {isStreaming && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            {onStop && (
              <button
                onClick={onStop}
                className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 hover:border-red-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="6" y="6" width="8" height="8" rx="1" />
                </svg>
                Stop generating
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 hover:border-cyan-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Step 2: Update MessageStream Component (Day 1, 1 hour)

**File**: `src/components/product-strategy-agent/CoachingPanel/MessageStream.tsx`

Replace current loading indicator with new components:

```typescript
import { ThinkingIndicator } from './ThinkingIndicator';
import { StreamingMessage } from './StreamingMessage';

// Add to component props interface
interface MessageStreamProps {
  messages: MessageType[];
  isLoading: boolean;
  streamingContent?: string;      // NEW
  isStreaming?: boolean;           // NEW
  onStopStreaming?: () => void;    // NEW
  onRegenerateStream?: () => void; // NEW
}

export function MessageStream({
  messages,
  isLoading,
  streamingContent = '',
  isStreaming = false,
  onStopStreaming,
  onRegenerateStream
}: MessageStreamProps) {
  const streamRef = useRef<HTMLDivElement>(null);

  // Auto-scroll during streaming
  useEffect(() => {
    if (streamRef.current && isStreaming) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [streamingContent, isStreaming]);

  return (
    <div ref={streamRef} className="message-stream h-full overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50">
      {messages.length === 0 && !isLoading && !isStreaming && (
        <div className="text-center text-slate-500 text-sm py-12">
          <p className="mb-2 font-semibold">Welcome to your strategy session.</p>
          <p>Let&apos;s begin by exploring your strategic context.</p>
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {/* Thinking indicator (pre-streaming) */}
      {isLoading && !isStreaming && <ThinkingIndicator />}

      {/* Active streaming */}
      {isStreaming && (
        <StreamingMessage
          content={streamingContent}
          isStreaming={true}
          onStop={onStopStreaming}
          onRegenerate={onRegenerateStream}
        />
      )}
    </div>
  );
}
```

---

### Step 3: Update CoachingPanel Streaming Logic (Day 2, 3-4 hours)

**File**: `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx`

**Add state variables**:
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isStreaming, setIsStreaming] = useState(false);           // NEW
const [streamingContent, setStreamingContent] = useState('');    // NEW
const [streamAbortController, setStreamAbortController] = useState<AbortController | null>(null); // NEW
```

**Update handleSendMessage function**:
```typescript
const handleSendMessage = async (content: string) => {
  if (!content.trim() || isLoading) return;

  setIsLoading(true);

  // Optimistically add user message
  const userMessage: Message = {
    id: `temp-${Date.now()}`,
    conversation_id: conversation.id,
    clerk_org_id: orgId,
    role: 'user',
    content,
    metadata: {},
    token_count: null,
    created_at: new Date().toISOString(),
  };

  setMessages(prev => [...prev, userMessage]);

  try {
    // Create abort controller for stream cancellation
    const abortController = new AbortController();
    setStreamAbortController(abortController);

    // Send message to API
    const response = await fetch(`/api/conversations/${conversation.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
      signal: abortController.signal, // Allow abort
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    // Start streaming
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let assistantContent = '';

    // Signal streaming started
    setIsStreaming(true);
    setIsLoading(false); // No longer "loading", now "streaming"

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantContent += chunk;

        // Update streaming content in real-time
        setStreamingContent(assistantContent);
      }
    }

    // Streaming complete - add final message
    setIsStreaming(false);
    setStreamingContent('');

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      conversation_id: conversation.id,
      clerk_org_id: orgId,
      role: 'assistant',
      content: assistantContent,
      metadata: {},
      token_count: null,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);

  } catch (error: any) {
    console.error('Error sending message:', error);

    // Handle abort separately from errors
    if (error.name === 'AbortError') {
      console.log('Stream was stopped by user');
      // Keep partial content visible
      if (streamingContent) {
        const partialMessage: Message = {
          id: `partial-${Date.now()}`,
          conversation_id: conversation.id,
          clerk_org_id: orgId,
          role: 'assistant',
          content: streamingContent + '\n\n_[Response stopped by user]_',
          metadata: { partial: true },
          token_count: null,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, partialMessage]);
      }
    } else {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    }

    setIsStreaming(false);
    setStreamingContent('');
  } finally {
    setIsLoading(false);
    setStreamAbortController(null);
  }
};

// NEW: Stop streaming handler
const handleStopStreaming = () => {
  if (streamAbortController) {
    streamAbortController.abort();
  }
};

// NEW: Regenerate handler (for future implementation)
const handleRegenerateStream = () => {
  // Cancel current stream
  if (streamAbortController) {
    streamAbortController.abort();
  }
  // TODO: Implement regeneration logic
  console.log('Regenerate requested');
};
```

**Update MessageStream props**:
```typescript
<MessageStream
  messages={messages}
  isLoading={isLoading}
  streamingContent={streamingContent}
  isStreaming={isStreaming}
  onStopStreaming={handleStopStreaming}
  onRegenerateStream={handleRegenerateStream}
/>
```

---

### Step 4: Error Handling & Edge Cases (Day 2-3, 2 hours)

**Add error state**:
```typescript
const [streamError, setStreamError] = useState<string | null>(null);
```

**Create ErrorMessage component**:

**File**: `src/components/product-strategy-agent/CoachingPanel/ErrorMessage.tsx`

```typescript
'use client';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onContactSupport?: () => void;
}

export function ErrorMessage({ message, onRetry, onContactSupport }: ErrorMessageProps) {
  return (
    <div className="error-message flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
      {/* Coach Avatar (dimmed) */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 opacity-50 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img src="/frontera-logo-F.jpg" alt="Frontera" className="w-full h-full object-cover" />
      </div>

      {/* Error Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-800">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>
          {onContactSupport && (
            <button
              onClick={onContactSupport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Update MessageStream to include error display**:
```typescript
{streamError && (
  <ErrorMessage
    message={streamError}
    onRetry={handleRetryLastMessage}
    onContactSupport={() => window.open('mailto:support@frontera.ai', '_blank')}
  />
)}
```

---

### Step 5: Testing Checklist (Day 3, 2 hours)

**Manual Testing**:
- [ ] Thinking indicator appears immediately after sending message
- [ ] Transition from thinking to streaming is smooth (no flicker)
- [ ] Streaming text appears character-by-character in real-time
- [ ] Typing cursor blinks at appropriate speed
- [ ] Stop button aborts stream and preserves partial content
- [ ] Message list auto-scrolls during streaming
- [ ] Final message appears correctly after stream completes
- [ ] Error state displays properly on network failure
- [ ] Retry button works after error
- [ ] Multiple consecutive messages work correctly
- [ ] Fast typing doesn't create multiple streams

**Automated Testing** (Vitest):

**File**: `tests/unit/components/CoachingPanel/StreamingMessage.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StreamingMessage } from '@/components/product-strategy-agent/CoachingPanel/StreamingMessage';

describe('StreamingMessage', () => {
  it('should display streaming content with typing cursor', () => {
    render(
      <StreamingMessage
        content="Hello world"
        isStreaming={true}
      />
    );

    expect(screen.getByText(/Hello world/)).toBeInTheDocument();
    // Cursor should be visible (has animate-pulse class)
    const cursor = document.querySelector('.animate-pulse');
    expect(cursor).toBeInTheDocument();
  });

  it('should show stop and regenerate buttons during streaming', () => {
    const onStop = vi.fn();
    const onRegenerate = vi.fn();

    render(
      <StreamingMessage
        content="Streaming..."
        isStreaming={true}
        onStop={onStop}
        onRegenerate={onRegenerate}
      />
    );

    expect(screen.getByText('Stop generating')).toBeInTheDocument();
    expect(screen.getByText('Regenerate')).toBeInTheDocument();
  });

  it('should call onStop when stop button clicked', () => {
    const onStop = vi.fn();

    render(
      <StreamingMessage
        content="Streaming..."
        isStreaming={true}
        onStop={onStop}
      />
    );

    fireEvent.click(screen.getByText('Stop generating'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('should hide action buttons when not streaming', () => {
    render(
      <StreamingMessage
        content="Complete message"
        isStreaming={false}
      />
    );

    expect(screen.queryByText('Stop generating')).not.toBeInTheDocument();
  });
});
```

---

## 1.4 Technical Architecture

### Data Flow Diagram

```
User Input (CoachingInput)
        ↓
handleSendMessage() triggered
        ↓
    setIsLoading(true)
        ↓
Optimistic user message added to messages[]
        ↓
API call to /api/conversations/{id}/messages
        ↓
Response.body.getReader() initialized
        ↓
  setIsStreaming(true)
  setIsLoading(false)
        ↓
While loop: reader.read()
        ↓
Each chunk decoded and appended
        ↓
setStreamingContent(accumulated) ← Real-time update
        ↓
MessageStream receives streamingContent prop
        ↓
StreamingMessage renders with typing cursor
        ↓
User sees text appear character-by-character
        ↓
[Optional: User clicks Stop]
        ↓
AbortController.abort() called
        ↓
While loop breaks, catch block handles abort
        ↓
Stream complete: setIsStreaming(false)
        ↓
Final message added to messages[]
        ↓
StreamingMessage unmounts
        ↓
Message component renders final state
```

### State Management

**CoachingPanel State**:
```typescript
interface CoachingPanelState {
  messages: Message[];              // Completed messages
  isLoading: boolean;               // Pre-streaming (thinking phase)
  isStreaming: boolean;             // Active streaming
  streamingContent: string;         // Accumulating streamed text
  streamAbortController: AbortController | null; // For cancellation
  streamError: string | null;       // Error state
}
```

**State Transitions**:
1. **Idle** → User sends message → **Loading**
2. **Loading** (thinking indicator) → First chunk arrives → **Streaming**
3. **Streaming** → Stream complete → **Idle** (message added to messages[])
4. **Streaming** → User clicks stop → **Idle** (partial message added)
5. **Streaming** → Error occurs → **Error** (error message displayed)
6. **Error** → User clicks retry → **Loading**

### Performance Considerations

**Optimization 1: Throttled State Updates**

Currently, `setStreamingContent()` is called for every chunk. For very fast streams, this could cause excessive re-renders.

**Solution**: Throttle updates to every 50ms:

```typescript
import { useCallback, useRef } from 'react';

// In CoachingPanel component
const streamingContentRef = useRef('');
const streamingUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

const updateStreamingContent = useCallback((content: string) => {
  streamingContentRef.current = content;

  // Throttle updates to 50ms
  if (!streamingUpdateTimerRef.current) {
    streamingUpdateTimerRef.current = setTimeout(() => {
      setStreamingContent(streamingContentRef.current);
      streamingUpdateTimerRef.current = null;
    }, 50);
  }
}, []);
```

**Optimization 2: Auto-scroll Performance**

Auto-scrolling on every content change can be expensive.

**Solution**: Use `requestAnimationFrame`:

```typescript
useEffect(() => {
  if (streamRef.current && isStreaming) {
    requestAnimationFrame(() => {
      if (streamRef.current) {
        streamRef.current.scrollTop = streamRef.current.scrollHeight;
      }
    });
  }
}, [streamingContent, isStreaming]);
```

---

### Accessibility

**Keyboard Navigation**:
- Stop button: `Tab` → `Enter`/`Space`
- Regenerate button: `Tab` → `Enter`/`Space`
- Screen reader announces: "Coach is thinking" → "Coach is responding" → "Response complete"

**ARIA Labels**:
```typescript
<div
  role="log"
  aria-live="polite"
  aria-label="Strategy Coach conversation"
>
  {/* Messages */}
</div>

<button
  onClick={onStop}
  aria-label="Stop generating response"
>
  Stop generating
</button>
```

**Screen Reader Experience**:
- Thinking indicator: "Coach is thinking"
- During streaming: "Coach is responding" (announced once at start)
- After streaming: "Response complete: [full message text]"

---

## 1.5 Implementation Effort Breakdown

| Task | Estimated Time | Complexity |
|------|----------------|------------|
| Create ThinkingIndicator component | 30 minutes | Low |
| Create StreamingMessage component | 1 hour | Medium |
| Create ErrorMessage component | 30 minutes | Low |
| Update MessageStream component | 1 hour | Medium |
| Update CoachingPanel streaming logic | 3 hours | High |
| Add abort controller & stop functionality | 1 hour | Medium |
| Error handling & edge cases | 2 hours | Medium |
| Testing (manual + automated) | 2 hours | Medium |
| **TOTAL** | **11 hours** | **Medium** |

**Risk Factors**:
- Streaming API behavior may vary across browsers (Safari, Firefox)
- Abort controller support in older browsers
- Performance on slow connections (needs throttling)

**Recommended Timeline**: 2-3 days with buffer for testing and refinement.

---

---

# Mockup 2: Territory Deep-Dive Sidebar Navigation

**Impact**: HIGH | **Effort**: MEDIUM (3-4 days) | **Priority Score**: 9.0/10

**Problem Solved**: Current deep-dive UX uses a full-screen replacement pattern. Users lose context when drilling into research areas, can't see progress across all 3 areas, and experience disorientation navigating back and forth.

**Solution**: Persistent left sidebar navigation showing all research areas, progress indicators, and current position. Content area displays questions for selected research area.

---

## 2.1 Visual Specification

### Full Layout: Territory Deep-Dive View

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  CANVAS PANEL (75% width, main content area)                                       │
├───────────────┬────────────────────────────────────────────────────────────────────┤
│               │                                                                     │
│  SIDEBAR      │  CONTENT AREA                                                      │
│  (25% width)  │  (75% width)                                                       │
│               │                                                                     │
│  ┌─────────┐ │  ┌──────────────────────────────────────────────────────────────┐ │
│  │← Back   │ │  │  [Header: Research Area Title & Description]                 │ │
│  │Territories│ │  └──────────────────────────────────────────────────────────────┘ │
│  └─────────┘ │                                                                     │
│               │  ┌──────────────────────────────────────────────────────────────┐ │
│  COMPANY      │  │  Question 1                                                  │ │
│  TERRITORY    │  │  [Textarea for response]                                     │ │
│               │  └──────────────────────────────────────────────────────────────┘ │
│  ────────────│                                                                     │
│  RESEARCH     │  ┌──────────────────────────────────────────────────────────────┐ │
│  AREAS        │  │  Question 2                                                  │ │
│               │  │  [Textarea for response]                                     │ │
│  ▓ 1. Core   │  └──────────────────────────────────────────────────────────────┘ │
│    Capabilities│                                                                     │
│    ●●●○ 3/4   │  ┌──────────────────────────────────────────────────────────────┐ │
│               │  │  Question 3                                                  │ │
│  ○ 2. Resource│  │  [Textarea for response]                                     │ │
│    Reality    │  └──────────────────────────────────────────────────────────────┘ │
│    ○○○○ 0/4   │                                                                     │
│               │  ┌──────────────────────────────────────────────────────────────┐ │
│  ○ 3. Product │  │  Question 4                                                  │ │
│    Portfolio  │  │  [Textarea for response]                                     │ │
│    ○○○○ 0/4   │  └──────────────────────────────────────────────────────────────┘ │
│               │                                                                     │
│  ────────────│  [Save Progress]  [Mark as Mapped]                                 │
│               │                                                                     │
│  PROGRESS     │                                                                     │
│  ▓▓▓░░░░░░░░  │                                                                     │
│  3/12         │                                                                     │
│  Questions    │                                                                     │
│               │                                                                     │
└───────────────┴────────────────────────────────────────────────────────────────────┘
```

---

### Sidebar Detail: Research Area Navigation

```
┌──────────────────────────┐
│  ← Back to Territories   │ ← Secondary button
├──────────────────────────┤
│                          │
│  COMPANY TERRITORY       │ ← Territory badge
│                          │
├──────────────────────────┤
│  RESEARCH AREAS          │ ← Section label
│                          │
│  ▓ 1. Core Capabilities  │ ← Active area (selected)
│     & Constraints        │
│     ●●●○ 3/4             │ ← Progress dots + count
│                          │
│  ○ 2. Resource Reality   │ ← Unexplored area
│     ○○○○ 0/4             │
│                          │
│  ◐ 3. Product Portfolio  │ ← In-progress area
│     & Market Position    │
│     ●●○○ 2/4             │
│                          │
├──────────────────────────┤
│  OVERALL PROGRESS        │ ← Summary section
│                          │
│  ▓▓▓░░░░░░░░░ 25%       │ ← Progress bar
│                          │
│  3/12 Questions          │
│  1/3 Areas Mapped        │
│                          │
└──────────────────────────┘
```

**Design Specs**:

**Sidebar Container**:
- Width: `w-1/4 min-w-[280px] max-w-[320px]`
- Background: `bg-white`
- Border: `border-r border-slate-200`
- Padding: `p-6`

**Back Button**:
- Style: `text-sm font-semibold text-indigo-600 hover:text-indigo-800`
- Icon: Left arrow, `w-4 h-4`
- Margin: `mb-6`

**Territory Badge**:
- Container: `bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-xl p-3 mb-6`
- Icon: Building icon, `w-6 h-6 text-indigo-600`
- Title: `text-sm font-bold text-slate-900`
- Subtitle: `text-xs text-slate-600`

**Section Label** ("RESEARCH AREAS"):
- Style: `text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3`

**Research Area Item** (Unselected):
- Container: `py-3 px-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all`
- Icon (status): `w-5 h-5 mr-2`
  - Unexplored: `○` (circle outline, `text-slate-400`)
  - In Progress: `◐` (half-filled circle, `text-amber-600`)
  - Mapped: `●` (filled circle, `text-indigo-600`)
- Title: `text-sm font-semibold text-slate-900`
- Progress dots: `flex gap-1 mt-1.5`
  - Filled: `w-2 h-2 rounded-full bg-indigo-600`
  - Empty: `w-2 h-2 rounded-full bg-slate-200`
- Count: `text-xs text-slate-600 ml-2`

**Research Area Item** (Selected/Active):
- Container: `py-3 px-3 rounded-xl bg-indigo-100 border-2 border-indigo-600 shadow-sm`
- Icon: `text-indigo-600` (emphasized)
- Title: `text-sm font-bold text-indigo-900`
- Progress dots: Same as unselected
- Left border accent: `border-l-4 border-indigo-600` (added for emphasis)

**Overall Progress Section**:
- Container: `mt-6 pt-6 border-t border-slate-200`
- Label: `text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3`
- Progress bar:
  - Container: `w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2`
  - Fill: `h-full bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all duration-500`
  - Percentage: `text-xs font-bold text-slate-900 mb-3`
- Stats:
  - Questions: `text-xs text-slate-600`
  - Areas: `text-xs text-slate-600`

---

### Content Area Detail: Question Form

```
┌──────────────────────────────────────────────────────────────┐
│  1. Core Capabilities & Constraints                          │ ← Breadcrumb-style header
│  Internal Strategic Context                                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  What are your organization's unique strengths, and what     │ ← Area description
│  fundamental constraints shape your strategic options?       │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ① What are your organization's core competencies and │   │ ← Question card
│  │    differentiating capabilities?                     │   │
│  │                                                       │   │
│  │ ┌──────────────────────────────────────────────────┐│   │
│  │ │ We have strong capabilities in AI/ML model       ││   │ ← Textarea (auto-expanding)
│  │ │ development and real-time data processing...     ││   │
│  │ │                                                   ││   │
│  │ │                                                   ││   │
│  │ └──────────────────────────────────────────────────┘│   │
│  │                                           ✓ Answered │   │ ← Status indicator
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ ② What key resources (technical, human, IP) do you  │   │
│  │    control that competitors don't?                   │   │
│  │                                                       │   │
│  │ ┌──────────────────────────────────────────────────┐│   │
│  │ │ Share your insights here...                      ││   │ ← Empty textarea
│  │ │                                                   ││   │
│  │ └──────────────────────────────────────────────────┘│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  [Additional questions 3 & 4...]                             │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  [💾 Save Progress]  [✓ Mark as Mapped]                     │ ← Action buttons
│                                                               │
│  Answer all 4 questions to mark this area as mapped         │ ← Helper text
└──────────────────────────────────────────────────────────────┘
```

**Design Specs**:

**Content Area Container**:
- Width: `flex-1` (fills remaining space)
- Background: `bg-slate-50`
- Padding: `p-8`

**Header**:
- Title: `text-2xl font-bold text-slate-900 mb-2`
- Subtitle: `text-sm text-slate-600 mb-6`

**Description**:
- Container: `bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8`
- Text: `text-sm text-slate-700 leading-relaxed`

**Question Card**:
- Container: `bg-white rounded-2xl border border-slate-200 p-6 mb-6 transition-all hover:shadow-md`
- Question number: `inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold mr-2`
- Question text: `text-sm font-semibold text-slate-900 mb-4`
- Textarea:
  - Base: `w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none`
  - Focus: `focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent`
  - Placeholder: `placeholder:text-slate-400`
  - Min height: `min-h-[120px]`
- Status indicator (answered):
  - Container: `flex items-center justify-end gap-1.5 text-xs text-indigo-600 font-semibold mt-2`
  - Checkmark: `w-4 h-4`

**Action Buttons**:
- Container: `sticky bottom-0 bg-slate-50 border-t border-slate-200 py-4 flex items-center gap-4`
- Save Progress: `flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-xl font-semibold hover:bg-slate-300 transition-colors`
- Mark as Mapped: `flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`
- Helper text: `text-sm text-center text-slate-500 mt-3`

---

### State Variations

#### Sidebar: Area Status Indicators

**Unexplored Area**:
```
○ 2. Resource Reality
   ○○○○ 0/4
```
- Icon: `○` (outline circle)
- Color: `text-slate-600`
- Progress dots: All empty (slate-200)

**In Progress Area**:
```
◐ 3. Product Portfolio
   ●●○○ 2/4
```
- Icon: `◐` (half-filled circle)
- Color: `text-amber-600`
- Progress dots: 2 filled (indigo-600), 2 empty (slate-200)

**Mapped Area**:
```
● 1. Core Capabilities
   ●●●● 4/4
```
- Icon: `●` (filled circle)
- Color: `text-indigo-600`
- Progress dots: All filled (indigo-600)
- Additional badge: `✓ Mapped` in small text

---

#### Content Area: Question States

**Unanswered Question**:
- Border: `border-slate-200`
- Textarea: Empty with placeholder
- No status indicator

**Partially Answered Question** (focus state):
- Border: `border-indigo-400 ring-2 ring-indigo-100`
- Textarea: Focused with user typing
- No status indicator yet

**Answered Question**:
- Border: `border-indigo-200`
- Textarea: Contains user response
- Status indicator: `✓ Answered` (indigo-600)
- Background: Subtle indigo tint (`bg-indigo-50/30`)

---

## 2.2 Component Breakdown

### Architecture Overview

**Current Architecture** (Full-Screen Replacement):
```
ResearchSection.tsx
  ├─ TerritoryCard.tsx (x3) ← Territory selection view
  └─ CompanyTerritoryDeepDive.tsx ← REPLACES entire ResearchSection
      ├─ Research Area Selection ← List of 3 areas
      └─ Questions View ← Individual area questions
```

**Problem**: Each navigation step replaces the entire view, losing context.

**New Architecture** (Sidebar Navigation):
```
ResearchSection.tsx
  └─ TerritoryCard.tsx (x3) ← Territory selection (unchanged)

CompanyTerritoryDeepDive.tsx ← SPLIT INTO TWO COMPONENTS
  ├─ TerritoryDeepDiveSidebar.tsx ← NEW: Persistent left sidebar
  │   ├─ Back button
  │   ├─ Territory badge
  │   ├─ Research area navigation (x3)
  │   └─ Overall progress summary
  │
  └─ TerritoryDeepDiveContent.tsx ← NEW: Content area (right)
      ├─ Area header
      ├─ Area description
      ├─ Question cards (x4)
      └─ Action buttons
```

**Benefits**:
- Sidebar persists across all research areas
- Users see progress at all times
- No context loss when switching areas
- Clearer navigation hierarchy

---

### New Components to Create

#### 1. `TerritoryDeepDiveSidebar.tsx`

```typescript
interface TerritoryDeepDiveSidebarProps {
  territory: 'company' | 'customer' | 'competitor';
  researchAreas: ResearchArea[];
  selectedAreaId: string | null;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onSelectArea: (areaId: string) => void;
}

interface ResearchArea {
  id: string;
  title: string;
  questionCount: number;
}
```

**Responsibilities**:
- Display territory badge (icon + name)
- Render navigation list of research areas
- Show status icon for each area (○/◐/●)
- Display progress dots (●●○○ 2/4)
- Highlight currently selected area
- Calculate and display overall progress
- Handle area selection clicks

**Internal Functions**:
```typescript
// Get status for a research area
const getAreaStatus = (areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
  const insight = territoryInsights.find(i => i.research_area === areaId);
  return insight?.status || 'unexplored';
};

// Get answered question count
const getAnsweredCount = (areaId: string): number => {
  const insight = territoryInsights.find(i => i.research_area === areaId);
  if (!insight || !insight.responses) return 0;
  return Object.keys(insight.responses).length;
};

// Calculate overall progress
const getTotalProgress = (): { answered: number; total: number; percentage: number } => {
  const totalQuestions = researchAreas.reduce((sum, area) => sum + area.questionCount, 0);
  const answeredQuestions = researchAreas.reduce((sum, area) =>
    sum + getAnsweredCount(area.id), 0
  );
  return {
    answered: answeredQuestions,
    total: totalQuestions,
    percentage: Math.round((answeredQuestions / totalQuestions) * 100)
  };
};
```

---

#### 2. `TerritoryDeepDiveContent.tsx`

```typescript
interface TerritoryDeepDiveContentProps {
  territory: 'company' | 'customer' | 'competitor';
  researchArea: ResearchArea;
  responses: Record<string, string>;
  onResponseChange: (questionIndex: number, value: string) => void;
  onSaveProgress: () => void;
  onMarkAsMapped: () => void;
  isSaving: boolean;
}

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  questions: string[];
}
```

**Responsibilities**:
- Display research area header and description
- Render question cards with textareas
- Track which questions are answered
- Handle textarea input changes
- Validate completeness for "Mark as Mapped" button
- Show save/map action buttons
- Display helper text for completion requirements

**Internal Functions**:
```typescript
// Check if question is answered
const isQuestionAnswered = (questionIndex: number): boolean => {
  return !!responses[questionIndex]?.trim();
};

// Check if all questions answered
const isAreaComplete = (): boolean => {
  return researchArea.questions.every((_, index) => isQuestionAnswered(index));
};

// Get answered count for this area
const getAnsweredCount = (): number => {
  return researchArea.questions.filter((_, index) => isQuestionAnswered(index)).length;
};
```

---

#### 3. `ResearchAreaNavItem.tsx` (Sub-component)

```typescript
interface ResearchAreaNavItemProps {
  areaNumber: number;
  title: string;
  status: 'unexplored' | 'in_progress' | 'mapped';
  answeredCount: number;
  totalCount: number;
  isSelected: boolean;
  onClick: () => void;
}
```

**Responsibilities**:
- Render area number, title, and status icon
- Display progress dots visualization
- Show answered/total count
- Apply selected state styling
- Handle click to select area

**Visual States**:
- **Unselected + Unexplored**: Gray text, outline icon, gray dots
- **Unselected + In Progress**: Amber icon, mixed dots (filled/empty)
- **Unselected + Mapped**: Indigo icon, all filled dots, checkmark
- **Selected** (any status): Indigo background, border, bold text

---

### Components to Modify

#### `CompanyTerritoryDeepDive.tsx` (Current: 322 lines)

**Current Structure**:
```typescript
if (!selectedArea) {
  // Show research area selection grid
  return <div>...</div>;
}

// Show questions for selected area
return <div>...</div>;
```

**New Structure**:
```typescript
export function CompanyTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
}: CompanyTerritoryDeepDiveProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(
    RESEARCH_AREAS[0].id // Default to first area
  );
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load responses when area changes
  useEffect(() => {
    if (selectedArea) {
      const insight = territoryInsights.find(i => i.research_area === selectedArea);
      setResponses((insight?.responses as Record<string, string>) || {});
    }
  }, [selectedArea, territoryInsights]);

  const currentArea = RESEARCH_AREAS.find(a => a.id === selectedArea);
  if (!currentArea) return null;

  return (
    <div className="territory-deep-dive h-full flex overflow-hidden">
      {/* Left Sidebar - Persistent */}
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={RESEARCH_AREAS}
        selectedAreaId={selectedArea}
        territoryInsights={territoryInsights}
        onBack={onBack}
        onSelectArea={setSelectedArea}
      />

      {/* Right Content - Changes based on selected area */}
      <TerritoryDeepDiveContent
        territory="company"
        researchArea={currentArea}
        responses={responses}
        onResponseChange={handleResponseChange}
        onSaveProgress={() => handleSave('in_progress')}
        onMarkAsMapped={() => handleSave('mapped')}
        isSaving={isSaving}
      />
    </div>
  );
}
```

**Key Changes**:
1. Remove full-screen replacement pattern
2. Default to first research area (no selection screen)
3. Split into sidebar + content layout
4. Persist sidebar across area switches
5. Content area changes when selectedArea changes

---

## 2.3 Implementation Guide

### Step 1: Create Sidebar Component (Day 1, 3 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveSidebar.tsx`

```typescript
'use client';

import type { Database } from '@/types/database';

type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface ResearchArea {
  id: string;
  title: string;
  questionCount: number;
}

interface TerritoryDeepDiveSidebarProps {
  territory: 'company' | 'customer' | 'competitor';
  researchAreas: ResearchArea[];
  selectedAreaId: string | null;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onSelectArea: (areaId: string) => void;
}

// Icon components for territory types
const TERRITORY_ICONS = {
  company: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  customer: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  competitor: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

const TERRITORY_LABELS = {
  company: { title: 'Company Territory', subtitle: 'Internal Strategic Context' },
  customer: { title: 'Customer Territory', subtitle: 'Market & User Insights' },
  competitor: { title: 'Competitor Territory', subtitle: 'Competitive Landscape' },
};

export function TerritoryDeepDiveSidebar({
  territory,
  researchAreas,
  selectedAreaId,
  territoryInsights,
  onBack,
  onSelectArea,
}: TerritoryDeepDiveSidebarProps) {
  // Helper: Get status for a research area
  const getAreaStatus = (areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    const insight = territoryInsights.find(
      i => i.territory === territory && i.research_area === areaId
    );
    return insight?.status || 'unexplored';
  };

  // Helper: Get answered question count
  const getAnsweredCount = (areaId: string): number => {
    const insight = territoryInsights.find(
      i => i.territory === territory && i.research_area === areaId
    );
    if (!insight || !insight.responses) return 0;
    return Object.keys(insight.responses as Record<string, string>).length;
  };

  // Helper: Calculate overall progress
  const getTotalProgress = () => {
    const totalQuestions = researchAreas.reduce((sum, area) => sum + area.questionCount, 0);
    const answeredQuestions = researchAreas.reduce((sum, area) =>
      sum + getAnsweredCount(area.id), 0
    );
    const mapped = territoryInsights.filter(
      i => i.territory === territory && i.status === 'mapped'
    ).length;

    return {
      answered: answeredQuestions,
      total: totalQuestions,
      percentage: Math.round((answeredQuestions / totalQuestions) * 100),
      areasMapped: mapped,
      totalAreas: researchAreas.length,
    };
  };

  const progress = getTotalProgress();
  const labels = TERRITORY_LABELS[territory];

  return (
    <aside className="territory-sidebar w-1/4 min-w-[280px] max-w-[320px] bg-white border-r border-slate-200 p-6 flex flex-col h-full overflow-y-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-6 transition-colors self-start"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Territories
      </button>

      {/* Territory Badge */}
      <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-xl p-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-indigo-600">
            {TERRITORY_ICONS[territory]}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{labels.title}</h3>
            <p className="text-xs text-slate-600">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Research Areas Navigation */}
      <div className="flex-1 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
          Research Areas
        </h4>
        <div className="space-y-2">
          {researchAreas.map((area, index) => {
            const status = getAreaStatus(area.id);
            const answeredCount = getAnsweredCount(area.id);
            const isSelected = selectedAreaId === area.id;

            // Status icon
            let statusIcon = '○'; // unexplored
            let statusColor = 'text-slate-400';
            if (status === 'in_progress') {
              statusIcon = '◐';
              statusColor = 'text-amber-600';
            } else if (status === 'mapped') {
              statusIcon = '●';
              statusColor = 'text-indigo-600';
            }

            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className={`w-full text-left py-3 px-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-indigo-100 border-2 border-indigo-600 shadow-sm'
                    : 'hover:bg-slate-50 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-lg ${statusColor} flex-shrink-0`}>{statusIcon}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-sm ${isSelected ? 'font-bold text-indigo-900' : 'font-semibold text-slate-900'}`}>
                      {index + 1}. {area.title}
                    </h5>
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center gap-2 ml-6">
                  <div className="flex gap-1">
                    {Array.from({ length: area.questionCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < answeredCount ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    {answeredCount}/{area.questionCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
          Overall Progress
        </h4>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs font-bold text-slate-900">{progress.percentage}% Complete</p>
        </div>

        {/* Stats */}
        <div className="space-y-1">
          <p className="text-xs text-slate-600">
            {progress.answered}/{progress.total} Questions Answered
          </p>
          <p className="text-xs text-slate-600">
            {progress.areasMapped}/{progress.totalAreas} Areas Mapped
          </p>
        </div>
      </div>
    </aside>
  );
}
```

---

### Step 2: Create Content Component (Day 1-2, 3 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveContent.tsx`

```typescript
'use client';

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

interface TerritoryDeepDiveContentProps {
  territory: 'company' | 'customer' | 'competitor';
  researchArea: ResearchArea;
  responses: Record<string, string>;
  onResponseChange: (questionIndex: number, value: string) => void;
  onSaveProgress: () => void;
  onMarkAsMapped: () => void;
  isSaving: boolean;
}

export function TerritoryDeepDiveContent({
  territory,
  researchArea,
  responses,
  onResponseChange,
  onSaveProgress,
  onMarkAsMapped,
  isSaving,
}: TerritoryDeepDiveContentProps) {
  // Check if question is answered
  const isQuestionAnswered = (questionIndex: number): boolean => {
    return !!responses[questionIndex]?.trim();
  };

  // Check if all questions answered
  const isAreaComplete = (): boolean => {
    return researchArea.questions.every((_, index) => isQuestionAnswered(index));
  };

  // Get answered count
  const getAnsweredCount = (): number => {
    return researchArea.questions.filter((_, index) => isQuestionAnswered(index)).length;
  };

  const answeredCount = getAnsweredCount();
  const totalCount = researchArea.questions.length;

  return (
    <div className="territory-content flex-1 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{researchArea.title}</h2>
          <p className="text-sm text-slate-600">
            {territory === 'company' && 'Internal Strategic Context'}
            {territory === 'customer' && 'Market & User Insights'}
            {territory === 'competitor' && 'Competitive Landscape'}
          </p>
        </div>

        {/* Description */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-slate-700 leading-relaxed">{researchArea.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {researchArea.questions.map((question, index) => {
            const isAnswered = isQuestionAnswered(index);

            return (
              <div
                key={index}
                className={`question-card bg-white rounded-2xl p-6 transition-all hover:shadow-md ${
                  isAnswered
                    ? 'border-2 border-indigo-200 bg-indigo-50/30'
                    : 'border border-slate-200'
                }`}
              >
                <label className="block">
                  {/* Question Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 flex-1">{question}</span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={responses[index] || ''}
                    onChange={(e) => onResponseChange(index, e.target.value)}
                    placeholder="Share your insights here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder:text-slate-400 transition-all"
                  />

                  {/* Answered Indicator */}
                  {isAnswered && (
                    <div className="flex items-center justify-end gap-1.5 text-xs text-indigo-600 font-semibold mt-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Answered
                    </div>
                  )}
                </label>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 pt-6 mt-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onSaveProgress}
              disabled={isSaving || answeredCount === 0}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-xl font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : '💾 Save Progress'}
            </button>
            <button
              onClick={onMarkAsMapped}
              disabled={isSaving || !isAreaComplete()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {isSaving ? 'Saving...' : '✓ Mark as Mapped'}
            </button>
          </div>

          {/* Helper Text */}
          {!isAreaComplete() && (
            <p className="text-sm text-center text-slate-500 mt-3">
              Answer all {totalCount} questions to mark this area as mapped ({answeredCount}/{totalCount} answered)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Step 3: Refactor CompanyTerritoryDeepDive (Day 2, 2 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/CompanyTerritoryDeepDive.tsx`

Replace entire file with new sidebar + content layout:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { TerritoryDeepDiveSidebar } from './TerritoryDeepDiveSidebar';
import { TerritoryDeepDiveContent } from './TerritoryDeepDiveContent';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface CompanyTerritoryDeepDiveProps {
  conversation: Conversation;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onUpdate: (insights: TerritoryInsight[]) => void;
}

// Company Territory Research Areas (MVP: 3 areas)
const RESEARCH_AREAS = [
  {
    id: 'core_capabilities',
    title: 'Core Capabilities & Constraints',
    description: 'What are your organization\'s unique strengths, and what fundamental constraints shape your strategic options?',
    questionCount: 4,
    questions: [
      'What are your organization\'s core competencies and differentiating capabilities?',
      'What key resources (technical, human, IP) do you control that competitors don\'t?',
      'What structural constraints limit your strategic freedom (legacy systems, contracts, regulations)?',
      'Which capabilities are table stakes vs. truly differentiated in your market?',
    ],
  },
  {
    id: 'resource_reality',
    title: 'Resource Reality',
    description: 'What team, technology, and funding realities will enable or constrain your strategy execution?',
    questionCount: 4,
    questions: [
      'What is the current composition and skill distribution of your team?',
      'What technology stack and infrastructure do you have in place?',
      'What funding runway and burn rate define your strategic timeline?',
      'What hiring constraints or talent gaps could impact execution?',
    ],
  },
  {
    id: 'product_portfolio',
    title: 'Product Portfolio & Market Position',
    description: 'How do your current products perform in the market, and what does your portfolio reveal about strategic direction?',
    questionCount: 4,
    questions: [
      'What products/services comprise your current portfolio and how do they perform?',
      'Which products are growth drivers vs. legacy offerings?',
      'What is your current market position and competitive standing?',
      'What gaps exist between your current portfolio and market opportunities?',
    ],
  },
];

export function CompanyTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
}: CompanyTerritoryDeepDiveProps) {
  // Default to first research area (no selection screen)
  const [selectedArea, setSelectedArea] = useState<string>(RESEARCH_AREAS[0].id);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get insights for this territory
  const companyInsights = territoryInsights.filter((t) => t.territory === 'company');

  // Load existing responses when area changes
  useEffect(() => {
    if (selectedArea) {
      const insight = companyInsights.find((i) => i.research_area === selectedArea);
      if (insight && insight.responses) {
        setResponses(insight.responses as Record<string, string>);
      } else {
        setResponses({});
      }
    }
  }, [selectedArea, companyInsights]);

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSave = async (status: 'in_progress' | 'mapped') => {
    if (!selectedArea) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/product-strategy-agent/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: 'company',
          research_area: selectedArea,
          responses,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      const updatedInsight: TerritoryInsight = await response.json();

      // Update parent state
      const updatedInsights = territoryInsights.filter(
        (i) => !(i.territory === 'company' && i.research_area === selectedArea)
      );
      updatedInsights.push(updatedInsight);
      onUpdate(updatedInsights);

      // Success feedback (could add toast notification here)
      console.log(`Research area ${status === 'mapped' ? 'mapped' : 'saved'} successfully`);

    } catch (error) {
      console.error('Error saving responses:', error);
      alert('Failed to save responses. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentArea = RESEARCH_AREAS.find((a) => a.id === selectedArea);
  if (!currentArea) return null;

  return (
    <div className="company-territory-deep-dive h-full flex overflow-hidden">
      {/* Left Sidebar - Persistent Navigation */}
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={RESEARCH_AREAS.map(area => ({
          id: area.id,
          title: area.title,
          questionCount: area.questionCount,
        }))}
        selectedAreaId={selectedArea}
        territoryInsights={territoryInsights}
        onBack={onBack}
        onSelectArea={setSelectedArea}
      />

      {/* Right Content - Changes based on selected area */}
      <TerritoryDeepDiveContent
        territory="company"
        researchArea={currentArea}
        responses={responses}
        onResponseChange={handleResponseChange}
        onSaveProgress={() => handleSave('in_progress')}
        onMarkAsMapped={() => handleSave('mapped')}
        isSaving={isSaving}
      />
    </div>
  );
}
```

---

### Step 4: Repeat for Customer Territory (Day 2-3, 2 hours)

**File**: `src/components/product-strategy-agent/CanvasPanel/CustomerTerritoryDeepDive.tsx`

Apply same refactor pattern:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { TerritoryDeepDiveSidebar } from './TerritoryDeepDiveSidebar';
import { TerritoryDeepDiveContent } from './TerritoryDeepDiveContent';
import type { Database } from '@/types/database';

// ... (same imports and types as Company)

// Customer Territory Research Areas
const RESEARCH_AREAS = [
  {
    id: 'market_segmentation',
    title: 'Market Segmentation',
    description: 'Who are your customers, and how do they differ in needs, behaviors, and value?',
    questionCount: 4,
    questions: [
      'What distinct customer segments exist in your market?',
      'How do these segments differ in needs, behaviors, and willingness to pay?',
      'Which segments are you currently serving, and which are underserved?',
      'What are the demographics, firmographics, and psychographics of each segment?',
    ],
  },
  {
    id: 'jobs_to_be_done',
    title: 'Jobs-to-be-Done',
    description: 'What functional, emotional, and social jobs are customers hiring your product to accomplish?',
    questionCount: 4,
    questions: [
      'What core functional job are customers trying to get done?',
      'What emotional and social outcomes are customers seeking?',
      'What are the workarounds and compensating behaviors customers use today?',
      'What would make customers "fire" your product and hire an alternative?',
    ],
  },
  {
    id: 'value_perception',
    title: 'Value Perception',
    description: 'How do customers perceive value, and what are they willing to pay for?',
    questionCount: 4,
    questions: [
      'What outcomes do customers value most from your product?',
      'How do customers measure success and ROI?',
      'What alternatives do customers consider, and how do they compare value?',
      'What pricing models and packaging resonate with customer value perception?',
    ],
  },
];

export function CustomerTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
}: CompanyTerritoryDeepDiveProps) { // Reuse same interface
  // ... (exact same logic as CompanyTerritoryDeepDive, just change territory prop to 'customer')

  return (
    <div className="customer-territory-deep-dive h-full flex overflow-hidden">
      <TerritoryDeepDiveSidebar
        territory="customer"
        researchAreas={RESEARCH_AREAS.map(area => ({
          id: area.id,
          title: area.title,
          questionCount: area.questionCount,
        }))}
        selectedAreaId={selectedArea}
        territoryInsights={territoryInsights}
        onBack={onBack}
        onSelectArea={setSelectedArea}
      />

      <TerritoryDeepDiveContent
        territory="customer"
        researchArea={currentArea}
        responses={responses}
        onResponseChange={handleResponseChange}
        onSaveProgress={() => handleSave('in_progress')}
        onMarkAsMapped={() => handleSave('mapped')}
        isSaving={isSaving}
      />
    </div>
  );
}
```

---

### Step 5: Testing & Refinement (Day 3-4, 3 hours)

**Manual Testing Checklist**:

**Navigation**:
- [ ] Clicking research area in sidebar switches content area
- [ ] Selected area is highlighted in sidebar
- [ ] Progress dots update when answers are added
- [ ] Back button returns to territory overview
- [ ] Deep-link to specific area works (via URL params - future)

**Progress Tracking**:
- [ ] Answered questions show checkmark indicator
- [ ] Progress dots fill as questions answered
- [ ] Overall progress bar updates correctly
- [ ] Area status changes: unexplored → in_progress → mapped
- [ ] Stats (X/Y questions, X/Y areas) are accurate

**Data Persistence**:
- [ ] Switching areas doesn't lose unsaved changes (warn user)
- [ ] Save Progress saves current area responses
- [ ] Mark as Mapped only enabled when all questions answered
- [ ] Saved responses reload when returning to area
- [ ] Multiple save operations don't duplicate data

**Responsive Design**:
- [ ] Sidebar maintains min-width (280px) on narrow screens
- [ ] Content area scrolls independently of sidebar
- [ ] Layout works at 1024px, 1280px, 1440px, 1920px widths
- [ ] Touch targets are at least 44x44px (mobile accessibility)

**Accessibility**:
- [ ] Keyboard navigation: Tab through areas, Enter to select
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces selected area
- [ ] Progress updates announced to screen reader
- [ ] Color contrast meets WCAG AA (4.5:1 for text)

---

**Automated Testing** (Vitest):

**File**: `tests/unit/components/CanvasPanel/TerritoryDeepDiveSidebar.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerritoryDeepDiveSidebar } from '@/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveSidebar';

const mockResearchAreas = [
  { id: 'area1', title: 'Area 1', questionCount: 4 },
  { id: 'area2', title: 'Area 2', questionCount: 4 },
  { id: 'area3', title: 'Area 3', questionCount: 4 },
];

const mockTerritoryInsights = [
  {
    id: '1',
    territory: 'company',
    research_area: 'area1',
    status: 'mapped',
    responses: { '0': 'Answer 1', '1': 'Answer 2', '2': 'Answer 3', '3': 'Answer 4' },
  },
  {
    id: '2',
    territory: 'company',
    research_area: 'area2',
    status: 'in_progress',
    responses: { '0': 'Partial answer' },
  },
];

describe('TerritoryDeepDiveSidebar', () => {
  it('should render all research areas', () => {
    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={vi.fn()}
        onSelectArea={vi.fn()}
      />
    );

    expect(screen.getByText('1. Area 1')).toBeInTheDocument();
    expect(screen.getByText('2. Area 2')).toBeInTheDocument();
    expect(screen.getByText('3. Area 3')).toBeInTheDocument();
  });

  it('should highlight selected area', () => {
    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={vi.fn()}
        onSelectArea={vi.fn()}
      />
    );

    const selectedArea = screen.getByText('1. Area 1').closest('button');
    expect(selectedArea).toHaveClass('bg-indigo-100');
    expect(selectedArea).toHaveClass('border-indigo-600');
  });

  it('should show correct progress for each area', () => {
    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={vi.fn()}
        onSelectArea={vi.fn()}
      />
    );

    expect(screen.getByText('4/4')).toBeInTheDocument(); // Area 1 complete
    expect(screen.getByText('1/4')).toBeInTheDocument(); // Area 2 in progress
    expect(screen.getByText('0/4')).toBeInTheDocument(); // Area 3 unexplored
  });

  it('should call onSelectArea when area clicked', () => {
    const onSelectArea = vi.fn();

    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={vi.fn()}
        onSelectArea={onSelectArea}
      />
    );

    fireEvent.click(screen.getByText('2. Area 2'));
    expect(onSelectArea).toHaveBeenCalledWith('area2');
  });

  it('should calculate overall progress correctly', () => {
    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={vi.fn()}
        onSelectArea={vi.fn()}
      />
    );

    // 4 + 1 + 0 = 5 answered out of 12 total = 42%
    expect(screen.getByText('42% Complete')).toBeInTheDocument();
    expect(screen.getByText('5/12 Questions Answered')).toBeInTheDocument();
    expect(screen.getByText('1/3 Areas Mapped')).toBeInTheDocument();
  });

  it('should call onBack when back button clicked', () => {
    const onBack = vi.fn();

    render(
      <TerritoryDeepDiveSidebar
        territory="company"
        researchAreas={mockResearchAreas}
        selectedAreaId="area1"
        territoryInsights={mockTerritoryInsights}
        onBack={onBack}
        onSelectArea={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Back to Territories'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
```

---

## 2.4 Technical Architecture

### Layout Structure

```
CompanyTerritoryDeepDive (root container)
  ├─ TerritoryDeepDiveSidebar (25% width, fixed, scrollable)
  │   ├─ Back button
  │   ├─ Territory badge
  │   ├─ Research area navigation list
  │   │   └─ ResearchAreaNavItem (x3)
  │   │       ├─ Status icon (○/◐/●)
  │   │       ├─ Area title
  │   │       └─ Progress dots + count
  │   └─ Overall progress summary
  │       ├─ Progress bar
  │       └─ Stats (questions, areas)
  │
  └─ TerritoryDeepDiveContent (75% width, scrollable)
      ├─ Header (area title + subtitle)
      ├─ Description card
      ├─ Question cards (x4)
      │   ├─ Question number + text
      │   ├─ Textarea (auto-expanding)
      │   └─ Answered indicator (✓)
      └─ Action buttons (sticky footer)
          ├─ Save Progress
          └─ Mark as Mapped
```

### State Management

**CompanyTerritoryDeepDive State**:
```typescript
interface TerritoryDeepDiveState {
  selectedArea: string;                    // Currently selected research area ID
  responses: Record<string, string>;       // Question index → answer text
  isSaving: boolean;                       // Save operation in progress
}
```

**Data Flow**:
1. User selects research area in sidebar
   - `onSelectArea(areaId)` called
   - `setSelectedArea(areaId)` updates state
   - `useEffect` loads existing responses for new area

2. User types answer in textarea
   - `onResponseChange(questionIndex, value)` called
   - `setResponses({ ...prev, [questionIndex]: value })` updates state
   - Content component re-renders with new responses

3. User clicks "Save Progress" or "Mark as Mapped"
   - `handleSave(status)` called
   - API POST to `/api/product-strategy-agent/territories`
   - On success: `onUpdate(newInsights)` propagates to parent
   - Parent updates `territoryInsights` array
   - Sidebar re-renders with updated progress

### Performance Considerations

**Optimization 1: Debounced Auto-Save**

Currently, users must click "Save Progress" to persist responses. This creates risk of data loss.

**Solution**: Auto-save after 3 seconds of inactivity:

```typescript
import { useDebounce } from '@/hooks/useDebounce';

// In CompanyTerritoryDeepDive
const debouncedResponses = useDebounce(responses, 3000);

useEffect(() => {
  if (Object.keys(debouncedResponses).length > 0) {
    handleSave('in_progress'); // Auto-save as in_progress
  }
}, [debouncedResponses]);
```

**Optimization 2: Virtualized Question List**

For research areas with >10 questions, rendering all cards at once could be slow.

**Solution**: Use `react-window` or `react-virtuoso` for virtual scrolling:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={researchArea.questions.length}
  itemSize={200} // Approximate card height
>
  {({ index, style }) => (
    <div style={style}>
      <QuestionCard
        question={researchArea.questions[index]}
        response={responses[index]}
        onChange={(value) => onResponseChange(index, value)}
      />
    </div>
  )}
</FixedSizeList>
```

---

### Accessibility

**Keyboard Navigation**:

**Sidebar**:
- `Tab` cycles through: Back button → Research areas (1, 2, 3)
- `Enter`/`Space` selects research area
- `Shift+Tab` reverses direction

**Content**:
- `Tab` cycles through: Textareas (Q1-Q4) → Save button → Map button
- `Enter` in textarea creates new line (not submit)
- `Ctrl+Enter` in textarea triggers auto-save

**ARIA Labels**:

```typescript
// Sidebar
<nav aria-label="Research area navigation">
  <button
    aria-current={isSelected ? 'page' : undefined}
    aria-label={`${area.title}, ${answeredCount} of ${questionCount} questions answered`}
  >
    {area.title}
  </button>
</nav>

// Progress
<div
  role="status"
  aria-live="polite"
  aria-label={`Overall progress: ${percentage} percent complete, ${answered} of ${total} questions answered`}
>
  {/* Progress bar */}
</div>

// Content area
<form
  aria-label={`${researchArea.title} questions`}
>
  {researchArea.questions.map((q, i) => (
    <div key={i}>
      <label htmlFor={`question-${i}`}>
        {q}
      </label>
      <textarea
        id={`question-${i}`}
        aria-describedby={`question-${i}-hint`}
        aria-required={true}
      />
      <span id={`question-${i}-hint`} className="sr-only">
        Enter your response. This field is required to mark the area as mapped.
      </span>
    </div>
  ))}
</form>
```

**Screen Reader Experience**:
1. Enters territory deep-dive: "Entering Company Territory research view"
2. Focus on first research area: "Core Capabilities & Constraints, 3 of 4 questions answered, in progress"
3. Selects area: "Loaded Core Capabilities questions"
4. Focus on textarea: "Question 1: What are your organization's core competencies and differentiating capabilities? Enter your response."
5. Types answer: (no announcement)
6. Saves progress: "Progress saved"
7. All questions answered: "All questions answered. You can now mark this area as mapped."

---

## 2.5 Implementation Effort Breakdown

| Task | Estimated Time | Complexity |
|------|----------------|------------|
| Create TerritoryDeepDiveSidebar component | 3 hours | Medium |
| Create TerritoryDeepDiveContent component | 3 hours | Medium |
| Refactor CompanyTerritoryDeepDive | 2 hours | Medium |
| Refactor CustomerTerritoryDeepDive | 2 hours | Low (copy pattern) |
| Add auto-save functionality | 1 hour | Medium |
| Responsive design adjustments | 1 hour | Low |
| Testing (manual + automated) | 3 hours | Medium |
| Accessibility audit & fixes | 2 hours | Medium |
| **TOTAL** | **17 hours** | **Medium** |

**Risk Factors**:
- Sidebar width may need adjustment on different screen sizes
- Auto-save could cause conflicts if multiple users edit same conversation
- Progress calculation logic must handle edge cases (partial saves, corrupt data)

**Recommended Timeline**: 3-4 days with buffer for refinement and UAT feedback.

---

---

# 3. Implementation Priority & Dependencies

## 3.1 Implementation Order

**Recommended Sequence**:

1. **Mockup 1 (AI Streaming)** - Days 1-3
   - Reason: Higher priority score (9.5 vs 9.0), simpler implementation, no dependencies
   - Impact: Immediate improvement to perceived responsiveness
   - Can be developed in parallel with Mockup 2

2. **Mockup 2 (Territory Navigation)** - Days 2-5
   - Reason: More complex refactor, benefits from Mockup 1 testing learnings
   - Impact: Reduces disorientation, improves research completion rates
   - Can start sidebar work on Day 2 (parallel with streaming testing)

**Parallel Development Strategy**:

| Day | Developer A | Developer B |
|-----|-------------|-------------|
| Day 1 | Mockup 1: Create ThinkingIndicator, StreamingMessage | Mockup 2: Create TerritoryDeepDiveSidebar |
| Day 2 | Mockup 1: Update CoachingPanel streaming logic | Mockup 2: Create TerritoryDeepDiveContent |
| Day 3 | Mockup 1: Error handling, testing | Mockup 2: Refactor Company/CustomerTerritoryDeepDive |
| Day 4 | Support Mockup 2 testing | Mockup 2: Testing, accessibility audit |
| Day 5 | Code review, integration testing | Mockup 2: Refinements based on feedback |

**Total Timeline**: 5 days with 2 developers working in parallel

---

## 3.2 Dependencies

### Mockup 1 Dependencies

**External Dependencies**:
- None (uses existing API streaming endpoint)

**Internal Dependencies**:
- `MessageStream.tsx` - must be updated to accept new props
- `CoachingPanel.tsx` - must implement new streaming logic
- `Message.tsx` - existing component (no changes needed)

**Data Dependencies**:
- API: `/api/conversations/{id}/messages` (already supports streaming)
- No database schema changes required

**CSS Dependencies**:
- New keyframe animations for thinking dots
- Typing cursor animation (uses Tailwind `animate-pulse`)

---

### Mockup 2 Dependencies

**External Dependencies**:
- None

**Internal Dependencies**:
- `ResearchSection.tsx` - calls `CompanyTerritoryDeepDive` (no interface changes)
- `territory_insights` table - existing schema (no changes)

**Data Dependencies**:
- API: `/api/product-strategy-agent/territories` (GET/POST - already exists)
- Database: `territory_insights` table (status, responses, research_area columns)

**Shared Components**:
- Both `CompanyTerritoryDeepDive` and `CustomerTerritoryDeepDive` use:
  - `TerritoryDeepDiveSidebar.tsx` (shared component)
  - `TerritoryDeepDiveContent.tsx` (shared component)

---

## 3.3 Testing Strategy

### Mockup 1 Testing

**Unit Tests** (Vitest):
- `ThinkingIndicator.test.tsx` - animation behavior
- `StreamingMessage.test.tsx` - content display, cursor, actions
- `ErrorMessage.test.tsx` - error states, retry logic
- `MessageStream.test.tsx` - updated streaming integration

**Integration Tests**:
- `CoachingPanel` streaming flow (user input → API → stream → display)
- Abort controller functionality
- Error recovery

**E2E Tests** (Playwright):
- User sends message, sees thinking indicator
- Thinking transitions to streaming
- Text appears character-by-character
- Stop button aborts stream
- Error displays on network failure

---

### Mockup 2 Testing

**Unit Tests** (Vitest):
- `TerritoryDeepDiveSidebar.test.tsx` - navigation, progress calculation
- `TerritoryDeepDiveContent.test.tsx` - question rendering, validation
- `CompanyTerritoryDeepDive.test.tsx` - state management, save logic

**Integration Tests**:
- Switching research areas loads correct responses
- Save Progress persists data correctly
- Mark as Mapped only works when complete
- Overall progress updates across areas

**E2E Tests** (Playwright):
- User navigates from territory card → deep-dive
- User switches between research areas
- User answers questions, saves progress
- Progress indicators update in real-time
- Back button returns to territory overview

---

## 3.4 Rollout Plan

### Phase 1: Internal Testing (Days 6-7)

**Participants**: Frontera team members

**Focus**:
- Verify both mockups work in production environment
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on different screen sizes (1024px, 1280px, 1440px, 1920px)
- Collect initial feedback on usability

**Success Criteria**:
- No critical bugs blocking usage
- Streaming appears smooth on all browsers
- Territory navigation is intuitive
- No data loss issues

---

### Phase 2: Beta Testing with UAT Personas (Days 8-10)

**Participants**:
- Maya Okonkwo persona - test strategic PM workflow
- Tom Aldridge persona - test engineering leader workflow

**Focus**:
- Complete full research journey (Discovery → Research)
- Test with realistic data (from UAT test pack)
- Measure time to complete research areas
- Identify friction points and confusion

**Success Criteria**:
- Users complete at least 1 territory deep-dive
- Average time per research area < 15 minutes
- No users lost or confused in navigation
- Positive feedback on streaming responsiveness

---

### Phase 3: Production Rollout (Day 11+)

**Strategy**: Gradual rollout with feature flag

**Week 1**: 20% of users
- Monitor error rates, performance metrics
- Collect feedback via in-app survey
- Hotfix any critical issues

**Week 2**: 50% of users
- Analyze completion rates vs. old design
- A/B test: measure time to complete research
- Refine based on feedback

**Week 3**: 100% of users
- Full rollout
- Deprecate old components
- Document learnings

**Rollback Plan**:
- Feature flag allows instant revert to old design
- Database schema unchanged (no rollback needed)

---

## 3.5 Success Metrics

### Mockup 1: AI Streaming

**Quantitative Metrics**:
- **Perceived Response Time**: Reduce "silent pause" perception from 10s to <2s
- **User Anxiety**: Track "Stop generating" button clicks (should be <5% of messages)
- **Completion Rate**: % of users who wait for full response (target: >95%)
- **Error Rate**: Streaming failures < 1% of messages

**Qualitative Metrics**:
- User feedback: "Feels more responsive"
- Support tickets related to "coach not responding" (should decrease)

---

### Mockup 2: Territory Navigation

**Quantitative Metrics**:
- **Orientation**: Time to find specific research area (target: <10s)
- **Completion Rate**: % of users who map all 3 research areas (target: >60%, up from ~40%)
- **Navigation Efficiency**: Clicks to switch research areas (target: 1 click, down from 3)
- **Data Loss**: Unsaved responses lost due to navigation (target: <2%)

**Qualitative Metrics**:
- User feedback: "Easier to track progress"
- Reduced confusion in UAT feedback
- Support tickets related to "lost research data" (should decrease)

---

## 3.6 Known Limitations & Future Enhancements

### Mockup 1 Limitations

**Current Scope**:
- ✅ Real-time streaming display
- ✅ Stop generation functionality
- ✅ Error handling with retry
- ❌ Regenerate button (placeholder only)
- ❌ Message actions (copy, feedback) - shown but not implemented

**Future Enhancements**:
1. **Regenerate Message**: Allow users to request alternative response
2. **Message Feedback**: Thumbs up/down with reason (quality training data)
3. **Copy to Clipboard**: One-click copy for sharing responses
4. **Message History**: View/restore previous versions of regenerated messages
5. **Streaming Speed Control**: User preference for slower/faster streaming

---

### Mockup 2 Limitations

**Current Scope**:
- ✅ Sidebar navigation for Company + Customer territories
- ✅ Progress tracking across research areas
- ✅ Auto-save on area switch (with confirmation)
- ❌ Competitor Territory deep-dive (MVP deferred)
- ❌ Deep-link to specific research area via URL
- ❌ Bulk export of all responses

**Future Enhancements**:
1. **URL-Based Deep-Linking**: `/research/company/core-capabilities` direct links
2. **Collapsible Sidebar**: On narrow screens (<1280px), sidebar collapses to icon bar
3. **Progress Visualization**: Circular progress chart showing overall completion
4. **Bulk Actions**: "Mark all areas as mapped" when criteria met
5. **Competitor Territory**: Implement same pattern for 3rd territory
6. **Cross-Territory Insights**: Show connections between Company and Customer research

---

## 3.7 Risk Mitigation

### Technical Risks

**Risk 1: Streaming Performance on Slow Connections**

**Mitigation**:
- Implement throttled state updates (50ms batching)
- Add connection speed detection
- Fallback to "loading" indicator if streaming fails to start within 5s

**Risk 2: Browser Compatibility (Safari ReadableStream)**

**Mitigation**:
- Test on Safari 15+ (ReadableStream support added in Safari 14.1)
- Polyfill for older browsers
- Graceful degradation to non-streaming display

**Risk 3: Data Loss on Unsaved Changes**

**Mitigation**:
- Implement auto-save every 3 seconds (debounced)
- Show "Unsaved changes" warning when switching areas
- Use `beforeunload` event to warn on page close

---

### UX Risks

**Risk 1: Sidebar Feels Cramped on Smaller Screens**

**Mitigation**:
- Set min-width: 280px (tested on 1024px screens)
- On <1024px screens, hide sidebar behind hamburger menu
- Ensure content area still usable at narrow widths

**Risk 2: Users Don't Discover Auto-Save**

**Mitigation**:
- Show subtle "Auto-saved" toast notification after first auto-save
- Include tooltip on "Save Progress" button: "Changes auto-save every 3 seconds"
- Log analytics to verify save functionality is discovered

**Risk 3: Progress Dots Too Subtle**

**Mitigation**:
- A/B test: dots vs. progress bar in sidebar
- Ensure color contrast meets WCAG AA (indigo-600 vs. slate-200)
- Add tooltip on hover showing "3 of 4 questions answered"

---

---

# Appendix: Design System Reference

## Color Palette

| Color | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Indigo 600 | `#4F46E5` | `indigo-600` | Primary brand, active states |
| Cyan 600 | `#06B6D4` | `cyan-600` | Secondary brand, accents |
| Slate 900 | `#0F172A` | `slate-900` | Primary text |
| Slate 700 | `#334155` | `slate-700` | Secondary text |
| Slate 600 | `#475569` | `slate-600` | Metadata, labels |
| Slate 400 | `#94A3B8` | `slate-400` | Placeholder, muted |
| Slate 200 | `#E2E8F0` | `slate-200` | Borders |
| Slate 100 | `#F1F5F9` | `slate-100` | Subtle dividers |
| Slate 50 | `#F8FAFC` | `slate-50` | Backgrounds |
| Amber 600 | `#D97706` | `amber-600` | In-progress states |
| Red 600 | `#DC2626` | `red-600` | Errors, destructive actions |

## Typography

| Element | Class | Size | Weight |
|---------|-------|------|--------|
| H1 | `text-2xl font-bold` | 24px | 600 |
| H2 | `text-xl font-bold` | 20px | 600 |
| H3 | `text-lg font-bold` | 18px | 600 |
| Body | `text-sm` | 14px | 400 |
| Label | `text-xs font-semibold uppercase tracking-wider` | 12px | 600 |
| Metadata | `text-xs text-slate-400` | 12px | 400 |

## Spacing Scale

| Name | Class | Value |
|------|-------|-------|
| Tight | `gap-2` | 8px |
| Default | `gap-3` | 12px |
| Relaxed | `gap-6` | 24px |
| Section | `p-6` | 24px (padding) |
| Page | `p-8` | 32px (padding) |

## Border Radius

| Element | Class | Value |
|---------|-------|-------|
| Buttons | `rounded-xl` | 12px |
| Cards | `rounded-2xl` | 16px |
| Badges | `rounded-full` | 9999px |

---

# Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 18, 2026 | Claude Code | Initial mockup specifications for Priority 1 (Streaming + Territory Nav) |

---

**End of Document**
