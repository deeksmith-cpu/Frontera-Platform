import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from 'tests/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import ChatInterface from '@/components/strategy-coach/ChatInterface';
import { createMockReadableStream } from 'tests/helpers/test-utils';
import type { Message } from '@/components/strategy-coach/MessageList';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).substring(7)),
});

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for opening message request (for tests with empty messages)
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: 'Welcome to your session' }),
    });
  });

  const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
    id: crypto.randomUUID(),
    role: 'user',
    content: 'Test message',
    created_at: new Date().toISOString(),
    ...overrides,
  });

  describe('rendering', () => {
    it('should render with conversation title', async () => {
      const messages = [createMockMessage({ role: 'assistant', content: 'Hello' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
          conversationTitle="My Strategy Session"
        />
      );

      expect(screen.getByText('My Strategy Session')).toBeInTheDocument();
    });

    it('should render default title when not provided', async () => {
      const messages = [createMockMessage({ role: 'assistant', content: 'Hello' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(screen.getByText('Strategy Session')).toBeInTheDocument();
    });

    it('should render message count', () => {
      const messages = [
        createMockMessage({ id: '1' }),
        createMockMessage({ id: '2' }),
      ];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(screen.getByText('2 messages')).toBeInTheDocument();
    });

    it('should render back button', async () => {
      const messages = [createMockMessage({ role: 'assistant', content: 'Hello' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(screen.getByRole('button', { name: /back to conversations/i })).toBeInTheDocument();
    });

    it('should render MessageInput', async () => {
      const messages = [createMockMessage({ role: 'assistant', content: 'Hello' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(screen.getByPlaceholderText(/share your thoughts/i)).toBeInTheDocument();
    });

    it('should render initial messages', () => {
      const messages = [
        createMockMessage({ role: 'assistant', content: 'Welcome message' }),
      ];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(screen.getByText('Welcome message')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate back when clicking back button', async () => {
      const user = userEvent.setup();
      const messages = [createMockMessage({ role: 'assistant', content: 'Hello' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      await user.click(screen.getByRole('button', { name: /back to conversations/i }));

      expect(mockPush).toHaveBeenCalledWith('/dashboard/strategy-coach');
    });
  });

  describe('opening message', () => {
    it('should request opening message when no initial messages', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ content: 'Hello! Welcome to your coaching session.' }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={[]}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/conversations/conv_123/messages',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ message: null }),
          })
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Hello! Welcome to your coaching session.')).toBeInTheDocument();
      });
    });

    it('should not request opening message when initial messages exist', () => {
      const messages = [createMockMessage({ role: 'assistant', content: 'Existing message' })];

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={messages}
        />
      );

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should show error when opening message request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'API Error' }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={[]}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/failed to start the conversation/i)).toBeInTheDocument();
      });
    });
  });

  describe('sending messages', () => {
    it('should send user message and display it optimistically', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      // Mock streaming response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: createMockReadableStream(['Hello ', 'back!']),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Hello world');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // User message should appear immediately
      await waitFor(() => {
        expect(screen.getByText('Hello world')).toBeInTheDocument();
      });
    });

    it('should call API with correct payload', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: createMockReadableStream(['Response']),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'My question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/conversations/conv_123/messages',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ message: 'My question' }),
          })
        );
      });
    });

    it('should show streaming indicator while receiving response', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      // Create a slow stream
      let resolveStream: () => void;
      const streamPromise = new Promise<void>((resolve) => {
        resolveStream = resolve;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: new ReadableStream({
          async pull(controller) {
            await streamPromise;
            controller.close();
          },
        }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Thinking...')).toBeInTheDocument();
      });

      resolveStream!();
    });

    it('should disable input while streaming', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      let resolveStream: () => void;
      const streamPromise = new Promise<void>((resolve) => {
        resolveStream = resolve;
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: new ReadableStream({
          async pull(controller) {
            await streamPromise;
            controller.close();
          },
        }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/share your thoughts/i)).toBeDisabled();
      });

      resolveStream!();
    });

    it('should display assistant response after streaming completes', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: createMockReadableStream(['This is ', 'the response.']),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('This is the response.')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should show error banner on send failure', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Something went wrong' }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      });
    });

    it('should remove optimistic user message on error', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed' }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'This will fail');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });

      // User message should be removed
      expect(screen.queryByText('This will fail')).not.toBeInTheDocument();
    });

    it('should allow dismissing error banner', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Error occurred' }),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Error occurred')).toBeInTheDocument();
      });

      // Find and click dismiss button (the X button in the error banner)
      const errorBanner = screen.getByText('Error occurred').closest('div');
      const dismissButton = errorBanner?.parentElement?.querySelector('button');
      if (dismissButton) {
        await user.click(dismissButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle missing response body', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: null,
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('No response stream')).toBeInTheDocument();
      });
    });
  });

  describe('message count updates', () => {
    it('should update message count after sending message', async () => {
      const user = userEvent.setup();
      const initialMessages = [createMockMessage({ role: 'assistant', content: 'Welcome' })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: createMockReadableStream(['Response']),
      });

      render(
        <ChatInterface
          conversationId="conv_123"
          initialMessages={initialMessages}
        />
      );

      expect(screen.getByText('1 messages')).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/share your thoughts/i);
      await user.type(input, 'Question');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      await waitFor(() => {
        expect(screen.getByText('3 messages')).toBeInTheDocument();
      });
    });
  });
});
