import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from 'tests/helpers/test-utils';
import MessageList, { Message } from '@/components/strategy-coach/MessageList';

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('MessageList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now for consistent time comparisons
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-02T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createMessage = (overrides: Partial<Message> = {}): Message => ({
    id: crypto.randomUUID(),
    role: 'user',
    content: 'Test message',
    created_at: new Date().toISOString(),
    ...overrides,
  });

  describe('empty state', () => {
    it('should show loading message when no messages and not streaming', () => {
      render(<MessageList messages={[]} />);

      expect(screen.getByText('Starting your coaching session...')).toBeInTheDocument();
    });

    it('should not show loading message when streaming content exists', () => {
      render(<MessageList messages={[]} streamingContent="Hello" />);

      expect(screen.queryByText('Starting your coaching session...')).not.toBeInTheDocument();
    });
  });

  describe('message rendering', () => {
    it('should render user messages', () => {
      const messages = [createMessage({ role: 'user', content: 'Hello from user' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Hello from user')).toBeInTheDocument();
    });

    it('should render assistant messages', () => {
      const messages = [createMessage({ role: 'assistant', content: 'Hello from assistant' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Hello from assistant')).toBeInTheDocument();
    });

    it('should render multiple messages in order', () => {
      const messages = [
        createMessage({ id: '1', role: 'user', content: 'First message' }),
        createMessage({ id: '2', role: 'assistant', content: 'Second message' }),
        createMessage({ id: '3', role: 'user', content: 'Third message' }),
      ];

      render(<MessageList messages={messages} />);

      const messageTexts = screen.getAllByText(/message/i);
      expect(messageTexts).toHaveLength(3);
    });

    it('should style user messages differently from assistant messages', () => {
      const messages = [
        createMessage({ id: '1', role: 'user', content: 'User message' }),
        createMessage({ id: '2', role: 'assistant', content: 'Assistant message' }),
      ];

      render(<MessageList messages={messages} />);

      // User message should be right-aligned with blue background
      const userMessage = screen.getByText('User message').closest('div[class*="justify-end"]');
      expect(userMessage).toBeInTheDocument();

      // Assistant message should be left-aligned
      const assistantMessage = screen.getByText('Assistant message').closest('div[class*="justify-start"]');
      expect(assistantMessage).toBeInTheDocument();
    });
  });

  describe('streaming content', () => {
    it('should display streaming content', () => {
      render(<MessageList messages={[]} streamingContent="Streaming..." />);

      expect(screen.getByText('Streaming...')).toBeInTheDocument();
    });

    it('should show streaming indicator when isStreaming is true', () => {
      render(<MessageList messages={[]} streamingContent="Streaming..." isStreaming />);

      // Look for the animated cursor element
      const streamingIndicator = document.querySelector('.animate-pulse');
      expect(streamingIndicator).toBeInTheDocument();
    });

    it('should render streaming content as assistant message', () => {
      render(<MessageList messages={[]} streamingContent="Streaming response" isStreaming />);

      // Streaming content should be left-aligned like assistant messages
      const streamingMessage = screen.getByText('Streaming response').closest('div[class*="justify-start"]');
      expect(streamingMessage).toBeInTheDocument();
    });

    it('should auto-scroll when streaming content changes', () => {
      const { rerender } = render(<MessageList messages={[]} streamingContent="Part 1" />);

      rerender(<MessageList messages={[]} streamingContent="Part 1 Part 2" />);

      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  describe('markdown formatting', () => {
    it('should render h1 headers', () => {
      const messages = [createMessage({ content: '# Main Title' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Main Title')).toBeInTheDocument();
      expect(screen.getByText('Main Title').tagName).toBe('H2');
    });

    it('should render h2 headers', () => {
      const messages = [createMessage({ content: '## Section Title' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section Title').tagName).toBe('H3');
    });

    it('should render h3 headers', () => {
      const messages = [createMessage({ content: '### Subsection' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Subsection')).toBeInTheDocument();
      expect(screen.getByText('Subsection').tagName).toBe('H4');
    });

    it('should render bold text', () => {
      const messages = [createMessage({ content: 'This is **bold** text' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('bold').tagName).toBe('STRONG');
    });

    it('should render bullet points with dash', () => {
      const messages = [createMessage({ content: '- First item' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('First item').tagName).toBe('LI');
    });

    it('should render bullet points with asterisk', () => {
      const messages = [createMessage({ content: '* Second item' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Second item').tagName).toBe('LI');
    });

    it('should render blockquotes', () => {
      const messages = [createMessage({ content: '> This is a quote' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('This is a quote').tagName).toBe('BLOCKQUOTE');
    });

    it('should render regular paragraphs', () => {
      const messages = [createMessage({ content: 'Regular paragraph text' })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Regular paragraph text').tagName).toBe('P');
    });
  });

  describe('timestamp formatting', () => {
    it('should show "Just now" for very recent messages', () => {
      const messages = [createMessage({ created_at: new Date().toISOString() })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('should show minutes ago for recent messages', () => {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const messages = [createMessage({ created_at: thirtyMinsAgo })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('30m ago')).toBeInTheDocument();
    });

    it('should show hours ago for older messages', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      const messages = [createMessage({ created_at: threeHoursAgo })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('3h ago')).toBeInTheDocument();
    });

    it('should show days ago for messages from previous days', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const messages = [createMessage({ created_at: twoDaysAgo })];

      render(<MessageList messages={messages} />);

      expect(screen.getByText('2d ago')).toBeInTheDocument();
    });

    it('should show date for messages older than a week', () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
      const messages = [createMessage({ created_at: twoWeeksAgo })];

      render(<MessageList messages={messages} />);

      // Should show date format like "19 Dec"
      expect(screen.getByText(/\d{1,2} [A-Za-z]{3}/)).toBeInTheDocument();
    });
  });

  describe('auto-scroll', () => {
    it('should scroll to bottom when messages change', () => {
      const { rerender } = render(<MessageList messages={[]} />);

      const newMessages = [createMessage({ content: 'New message' })];
      rerender(<MessageList messages={newMessages} />);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should scroll to bottom when new message is added', () => {
      const initialMessages = [createMessage({ id: '1', content: 'First' })];
      const { rerender } = render(<MessageList messages={initialMessages} />);

      const updatedMessages = [
        ...initialMessages,
        createMessage({ id: '2', content: 'Second' }),
      ];
      rerender(<MessageList messages={updatedMessages} />);

      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });
});
