import { vi } from 'vitest';

// Mock Anthropic API response
export const mockAnthropicResponse = {
  content: [
    {
      type: 'text' as const,
      text: 'This is a mock AI response for testing.',
    },
  ],
  usage: {
    input_tokens: 100,
    output_tokens: 50,
  },
  stop_reason: 'end_turn',
};

// Create mock streaming events
export function createMockStreamEvents(responseText: string = 'Streaming response.') {
  const words = responseText.split(' ');
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        type: 'message_start',
        message: { usage: { input_tokens: 100 } },
      };
      for (const word of words) {
        yield {
          type: 'content_block_delta',
          delta: { text: word + ' ' },
        };
      }
      yield {
        type: 'message_delta',
        usage: { output_tokens: 50 },
      };
    },
    finalMessage: vi.fn().mockResolvedValue({
      usage: { input_tokens: 100, output_tokens: 50 },
    }),
  };
}

// Create mock Anthropic client
export const createMockAnthropicClient = (customResponse?: string) => ({
  messages: {
    create: vi.fn().mockResolvedValue(mockAnthropicResponse),
    stream: vi.fn().mockReturnValue(createMockStreamEvents(customResponse)),
  },
});

// Mock the entire Anthropic module
export const mockAnthropicModule = (customResponse?: string) => {
  vi.mock('@anthropic-ai/sdk', () => ({
    default: vi.fn().mockImplementation(() => createMockAnthropicClient(customResponse)),
  }));
};

// Reset Anthropic mocks
export const resetAnthropicMocks = () => {
  vi.resetModules();
};

// Helper to configure mock response
export const setMockAnthropicResponse = (response: { text: string; inputTokens?: number; outputTokens?: number }) => {
  return {
    content: [{ type: 'text' as const, text: response.text }],
    usage: {
      input_tokens: response.inputTokens ?? 100,
      output_tokens: response.outputTokens ?? 50,
    },
    stop_reason: 'end_turn',
  };
};
