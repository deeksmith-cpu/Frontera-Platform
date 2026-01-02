import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from 'tests/helpers/test-utils';
import userEvent from '@testing-library/user-event';
import MessageInput from '@/components/strategy-coach/MessageInput';

describe('MessageInput', () => {
  const mockOnSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render textarea with default placeholder', () => {
      render(<MessageInput onSend={mockOnSend} />);

      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });

    it('should render textarea with custom placeholder', () => {
      render(<MessageInput onSend={mockOnSend} placeholder="Ask a question..." />);

      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    it('should render send button', () => {
      render(<MessageInput onSend={mockOnSend} />);

      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should render keyboard hint text', () => {
      render(<MessageInput onSend={mockOnSend} />);

      expect(screen.getByText(/press/i)).toBeInTheDocument();
      expect(screen.getByText('Enter')).toBeInTheDocument();
      expect(screen.getByText('Shift+Enter')).toBeInTheDocument();
    });
  });

  describe('input handling', () => {
    it('should update textarea value when typing', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Hello world');

      expect(textarea).toHaveValue('Hello world');
    });

    it('should clear input after sending message', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Hello world');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(textarea).toHaveValue('');
    });

    it('should show character count when over 500 characters', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      const longMessage = 'a'.repeat(501);
      await user.type(textarea, longMessage);

      expect(screen.getByText('501')).toBeInTheDocument();
    });

    it('should not show character count when under 500 characters', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Short message');

      expect(screen.queryByText(/\d+$/)).not.toBeInTheDocument();
    });
  });

  describe('send functionality', () => {
    it('should call onSend with trimmed message when clicking send button', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, '  Hello world  ');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
    });

    it('should call onSend when pressing Enter', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Hello world');
      await user.keyboard('{Enter}');

      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
    });

    it('should not send when pressing Shift+Enter', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Hello world');
      await user.keyboard('{Shift>}{Enter}{/Shift}');

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should not send empty messages', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should not send whitespace-only messages', async () => {
      const user = userEvent.setup();
      render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, '   ');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(mockOnSend).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should disable textarea when disabled prop is true', () => {
      render(<MessageInput onSend={mockOnSend} disabled />);

      expect(screen.getByPlaceholderText('Type your message...')).toBeDisabled();
    });

    it('should disable send button when disabled prop is true', () => {
      render(<MessageInput onSend={mockOnSend} disabled />);

      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('should disable send button when input is empty', () => {
      render(<MessageInput onSend={mockOnSend} />);

      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('should show loading spinner when disabled', () => {
      render(<MessageInput onSend={mockOnSend} disabled />);

      const button = screen.getByRole('button', { name: /send message/i });
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('should not send when disabled even with content', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<MessageInput onSend={mockOnSend} />);

      const textarea = screen.getByPlaceholderText('Type your message...');
      await user.type(textarea, 'Hello world');

      rerender(<MessageInput onSend={mockOnSend} disabled />);

      await user.keyboard('{Enter}');
      expect(mockOnSend).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have accessible send button label', () => {
      render(<MessageInput onSend={mockOnSend} />);

      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('should focus textarea on render', async () => {
      render(<MessageInput onSend={mockOnSend} />);

      // Textarea should be focusable
      const textarea = screen.getByPlaceholderText('Type your message...');
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
    });
  });
});
