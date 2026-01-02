import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from 'tests/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import ConversationList from '@/components/strategy-coach/ConversationList';
import type { Conversation } from '@/types/database';

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

// Mock alert
global.alert = vi.fn();

describe('ConversationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockConversation = (overrides: Partial<Conversation> = {}): Conversation => ({
    id: crypto.randomUUID(),
    clerk_org_id: 'org_123',
    clerk_user_id: 'user_123',
    title: 'Test Conversation',
    agent_type: 'strategy_coach',
    status: 'active',
    framework_state: {
      currentPhase: 'discovery',
      totalMessageCount: 5,
    },
    context_summary: null,
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...overrides,
  });

  describe('empty state', () => {
    it('should show empty state when no conversations', () => {
      render(<ConversationList conversations={[]} />);

      expect(screen.getByText('No coaching sessions yet')).toBeInTheDocument();
      expect(screen.getByText(/Start your first strategy session/)).toBeInTheDocument();
    });

    it('should still show new session button in empty state', () => {
      render(<ConversationList conversations={[]} />);

      expect(screen.getByRole('button', { name: /start new strategy session/i })).toBeInTheDocument();
    });
  });

  describe('new conversation button', () => {
    it('should render new session button', () => {
      render(<ConversationList conversations={[]} />);

      expect(screen.getByRole('button', { name: /start new strategy session/i })).toBeInTheDocument();
    });

    it('should call API and navigate on successful creation', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversation: { id: 'new_conv_123' } }),
      });

      render(<ConversationList conversations={[]} />);

      await user.click(screen.getByRole('button', { name: /start new strategy session/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'New Strategy Session',
            agent_type: 'strategy_coach',
          }),
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard/strategy-coach/new_conv_123');
      });
    });

    it('should show loading state while creating', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(promise);

      render(<ConversationList conversations={[]} />);

      await user.click(screen.getByRole('button', { name: /start new strategy session/i }));

      await waitFor(() => {
        expect(screen.getByText('Starting session...')).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ conversation: { id: 'new_conv_123' } }),
      });
    });

    it('should disable button while creating', async () => {
      const user = userEvent.setup();
      let resolvePromise: (value: unknown) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValueOnce(promise);

      render(<ConversationList conversations={[]} />);

      await user.click(screen.getByRole('button', { name: /start new strategy session/i }));

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });

      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ conversation: { id: 'new_conv_123' } }),
      });
    });

    it('should show alert on creation failure', async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValueOnce({ ok: false });

      render(<ConversationList conversations={[]} />);

      await user.click(screen.getByRole('button', { name: /start new strategy session/i }));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Failed to start a new conversation. Please try again.');
      });
    });
  });

  describe('conversation list rendering', () => {
    it('should render conversations', () => {
      const conversations = [
        createMockConversation({ id: '1', title: 'First Session' }),
        createMockConversation({ id: '2', title: 'Second Session' }),
      ];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('First Session')).toBeInTheDocument();
      expect(screen.getByText('Second Session')).toBeInTheDocument();
    });

    it('should show previous sessions header when conversations exist', () => {
      const conversations = [createMockConversation()];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('Previous Sessions')).toBeInTheDocument();
    });

    it('should display message count from framework state', () => {
      const conversations = [
        createMockConversation({
          framework_state: { totalMessageCount: 15, currentPhase: 'research' },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText(/15 messages/)).toBeInTheDocument();
    });

    it('should display phase badge', () => {
      const conversations = [
        createMockConversation({
          framework_state: { currentPhase: 'research', totalMessageCount: 5 },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('Research')).toBeInTheDocument();
    });

    it('should display discovery phase by default', () => {
      const conversations = [
        createMockConversation({ framework_state: null }),
      ];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('Discovery')).toBeInTheDocument();
    });

    it('should display context summary when available', () => {
      const conversations = [
        createMockConversation({ context_summary: 'This is a summary of the conversation' }),
      ];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('This is a summary of the conversation')).toBeInTheDocument();
    });

    it('should show fallback title when title is null', () => {
      const conversations = [createMockConversation({ title: null })];

      render(<ConversationList conversations={conversations} />);

      expect(screen.getByText('Strategy Session')).toBeInTheDocument();
    });
  });

  describe('relative time formatting', () => {
    it('should show relative time for messages', () => {
      const conversations = [
        createMockConversation({ last_message_at: new Date().toISOString() }),
      ];

      render(<ConversationList conversations={conversations} />);

      // Should show some relative time text
      expect(screen.getByText(/last active/i)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate to conversation when clicking a card', async () => {
      const user = userEvent.setup();
      const conversations = [createMockConversation({ id: 'conv_abc' })];

      render(<ConversationList conversations={conversations} />);

      await user.click(screen.getByText('Test Conversation'));

      expect(mockPush).toHaveBeenCalledWith('/dashboard/strategy-coach/conv_abc');
    });
  });

  describe('phase colors', () => {
    it('should apply discovery phase color', () => {
      const conversations = [
        createMockConversation({
          framework_state: { currentPhase: 'discovery', totalMessageCount: 0 },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      const badge = screen.getByText('Discovery');
      expect(badge.className).toContain('blue');
    });

    it('should apply research phase color', () => {
      const conversations = [
        createMockConversation({
          framework_state: { currentPhase: 'research', totalMessageCount: 0 },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      const badge = screen.getByText('Research');
      expect(badge.className).toContain('amber');
    });

    it('should apply synthesis phase color', () => {
      const conversations = [
        createMockConversation({
          framework_state: { currentPhase: 'synthesis', totalMessageCount: 0 },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      const badge = screen.getByText('Synthesis');
      expect(badge.className).toContain('purple');
    });

    it('should apply planning phase color', () => {
      const conversations = [
        createMockConversation({
          framework_state: { currentPhase: 'planning', totalMessageCount: 0 },
        }),
      ];

      render(<ConversationList conversations={conversations} />);

      const badge = screen.getByText('Planning');
      expect(badge.className).toContain('green');
    });
  });
});
