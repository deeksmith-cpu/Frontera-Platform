import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import {
  createCoachingSession,
  sendMessage,
  streamMessage,
  messagesToChatHistory,
  estimateTokenCount,
  type ChatMessage,
  type StrategyCoachConfig,
} from '@/lib/agents/strategy-coach';
import type { ConversationMessage } from '@/types/database';

// Mock the client-context module
vi.mock('@/lib/agents/strategy-coach/client-context', async () => {
  const actual = await vi.importActual('@/lib/agents/strategy-coach/client-context');
  return {
    ...actual,
    loadClientContext: vi.fn(),
  };
});

// Mock Anthropic with a proper class
const mockCreate = vi.fn();
const mockStream = vi.fn();

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = {
        create: mockCreate,
        stream: mockStream,
      };
    },
  };
});

import { loadClientContext } from '@/lib/agents/strategy-coach/client-context';
import type { ClientContext } from '@/lib/agents/strategy-coach/client-context';

describe('Strategy Coach Index', () => {
  // Helper to create a valid ClientContext
  const createTestContext = (overrides: Partial<ClientContext> = {}): ClientContext => ({
    companyName: 'Acme Corp',
    industry: 'Technology',
    companySize: '201-500 employees',
    tier: 'enterprise',
    strategicFocus: 'product_model',
    strategicFocusDescription: 'transforming into a product-centric operating model',
    painPoints: 'Struggling to align product teams with business strategy',
    previousAttempts: null,
    targetOutcomes: 'Achieve 40% faster time-to-market',
    additionalContext: null,
    successMetrics: ['metrics_evidence'],
    timelineExpectations: '12-18 months',
    clerkOrgId: 'org_test123',
    clientId: 'client_abc',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  describe('messagesToChatHistory', () => {
    it('should convert database messages to chat format', () => {
      const dbMessages: ConversationMessage[] = [
        {
          id: 'msg_1',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'user',
          content: 'Hello',
          metadata: {},
          token_count: 10,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'msg_2',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'assistant',
          content: 'Hi there!',
          metadata: {},
          token_count: 15,
          created_at: '2024-01-01T00:00:01Z',
        },
      ];

      const result = messagesToChatHistory(dbMessages);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ role: 'user', content: 'Hello' });
      expect(result[1]).toEqual({ role: 'assistant', content: 'Hi there!' });
    });

    it('should filter out system messages', () => {
      const dbMessages: ConversationMessage[] = [
        {
          id: 'msg_1',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'system',
          content: 'System initialization',
          metadata: {},
          token_count: 5,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'msg_2',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'user',
          content: 'User message',
          metadata: {},
          token_count: 10,
          created_at: '2024-01-01T00:00:01Z',
        },
      ];

      const result = messagesToChatHistory(dbMessages);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ role: 'user', content: 'User message' });
    });

    it('should return empty array for empty input', () => {
      const result = messagesToChatHistory([]);
      expect(result).toEqual([]);
    });

    it('should return empty array when only system messages', () => {
      const dbMessages: ConversationMessage[] = [
        {
          id: 'msg_1',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'system',
          content: 'System only',
          metadata: {},
          token_count: 5,
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      const result = messagesToChatHistory(dbMessages);
      expect(result).toEqual([]);
    });
  });

  describe('estimateTokenCount', () => {
    it('should estimate approximately 4 characters per token', () => {
      const text = 'Hello world!'; // 12 characters
      const estimate = estimateTokenCount(text);

      // 12 / 4 = 3
      expect(estimate).toBe(3);
    });

    it('should round up for partial tokens', () => {
      const text = 'Hi'; // 2 characters -> 0.5 tokens -> rounds up to 1
      const estimate = estimateTokenCount(text);

      expect(estimate).toBe(1);
    });

    it('should return 0 for empty string', () => {
      const estimate = estimateTokenCount('');
      expect(estimate).toBe(0);
    });

    it('should handle longer text correctly', () => {
      const text = 'A'.repeat(100); // 100 characters
      const estimate = estimateTokenCount(text);

      expect(estimate).toBe(25);
    });

    it('should handle text with spaces and punctuation', () => {
      const text = 'Hello, how are you today?'; // 25 characters
      const estimate = estimateTokenCount(text);

      // 25 / 4 = 6.25 -> rounds up to 7
      expect(estimate).toBe(7);
    });
  });

  describe('createCoachingSession', () => {
    it('should throw error when client context cannot be loaded', async () => {
      vi.mocked(loadClientContext).mockResolvedValue(null);

      const config: StrategyCoachConfig = {
        clerkOrgId: 'org_invalid',
        clerkUserId: 'user_123',
      };

      await expect(createCoachingSession(config)).rejects.toThrow(
        'Failed to load client context for organization'
      );
    });

    it('should return context, framework state, and opening message', async () => {
      const mockContext = createTestContext();
      vi.mocked(loadClientContext).mockResolvedValue(mockContext);

      const config: StrategyCoachConfig = {
        clerkOrgId: 'org_test',
        clerkUserId: 'user_123',
        userName: 'Alice',
      };

      const result = await createCoachingSession(config);

      expect(result.context).toEqual(mockContext);
      expect(result.frameworkState).toBeDefined();
      expect(result.frameworkState.version).toBe(1);
      expect(result.frameworkState.currentPhase).toBe('discovery');
      expect(result.openingMessage).toContain('Welcome, Alice');
      expect(result.openingMessage).toContain('Acme Corp');
    });

    it('should use existing framework state when provided', async () => {
      const mockContext = createTestContext();
      vi.mocked(loadClientContext).mockResolvedValue(mockContext);

      const existingState = {
        version: 1,
        currentPhase: 'research' as const,
        researchPillars: {
          macroMarket: { started: true, completed: true, insights: ['insight1'] },
          customer: { started: true, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 3,
        totalMessageCount: 15,
        lastActivityAt: '2024-01-01T00:00:00Z',
      };

      const config: StrategyCoachConfig = {
        clerkOrgId: 'org_test',
        clerkUserId: 'user_123',
        frameworkState: existingState,
      };

      const result = await createCoachingSession(config);

      expect(result.frameworkState).toEqual(existingState);
      expect(result.frameworkState.currentPhase).toBe('research');
      expect(result.frameworkState.sessionCount).toBe(3);
    });

    it('should generate resume message when existing messages provided', async () => {
      const mockContext = createTestContext();
      vi.mocked(loadClientContext).mockResolvedValue(mockContext);

      const existingMessages: ConversationMessage[] = [
        {
          id: 'msg_1',
          conversation_id: 'conv_1',
          clerk_org_id: 'org_1',
          role: 'user',
          content: 'Previous message',
          metadata: {},
          token_count: 10,
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      const existingState = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 2,
        totalMessageCount: 5,
        lastActivityAt: '2024-01-01T00:00:00Z',
      };

      const config: StrategyCoachConfig = {
        clerkOrgId: 'org_test',
        clerkUserId: 'user_123',
        userName: 'Bob',
        existingMessages,
        frameworkState: existingState,
      };

      const result = await createCoachingSession(config);

      expect(result.openingMessage).toContain('Welcome back, Bob');
    });
  });

  describe('sendMessage', () => {
    it('should throw error when ANTHROPIC_API_KEY is not set', async () => {
      delete process.env.ANTHROPIC_API_KEY;

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      await expect(sendMessage(context, state, [], 'Hello')).rejects.toThrow(
        'ANTHROPIC_API_KEY environment variable is not set'
      );
    });

    it('should call Anthropic API with correct parameters', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Response from Claude' }],
        usage: { input_tokens: 100, output_tokens: 50 },
        stop_reason: 'end_turn',
      };

      mockCreate.mockResolvedValue(mockResponse);

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      const history: ChatMessage[] = [
        { role: 'user', content: 'Previous question' },
        { role: 'assistant', content: 'Previous answer' },
      ];

      const result = await sendMessage(context, state, history, 'New question', 'TestUser');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [
            { role: 'user', content: 'Previous question' },
            { role: 'assistant', content: 'Previous answer' },
            { role: 'user', content: 'New question' },
          ],
        })
      );

      expect(result.content).toBe('Response from Claude');
      expect(result.inputTokens).toBe(100);
      expect(result.outputTokens).toBe(50);
      expect(result.stopReason).toBe('end_turn');
    });

    it('should handle empty conversation history', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'First response' }],
        usage: { input_tokens: 50, output_tokens: 30 },
        stop_reason: 'end_turn',
      };

      mockCreate.mockResolvedValue(mockResponse);

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      const result = await sendMessage(context, state, [], 'First message');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: [{ role: 'user', content: 'First message' }],
        })
      );

      expect(result.content).toBe('First response');
    });

    it('should concatenate multiple text blocks in response', async () => {
      const mockResponse = {
        content: [
          { type: 'text', text: 'Part 1. ' },
          { type: 'text', text: 'Part 2.' },
        ],
        usage: { input_tokens: 50, output_tokens: 30 },
        stop_reason: 'end_turn',
      };

      mockCreate.mockResolvedValue(mockResponse);

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      const result = await sendMessage(context, state, [], 'Question');

      expect(result.content).toBe('Part 1. Part 2.');
    });
  });

  describe('streamMessage', () => {
    it('should return a ReadableStream and getUsage function', async () => {
      // Create a mock async iterator for the stream
      const mockEvents = [
        { type: 'message_start', message: { usage: { input_tokens: 100 } } },
        { type: 'content_block_delta', delta: { text: 'Hello' } },
        { type: 'content_block_delta', delta: { text: ' World' } },
        { type: 'message_delta', usage: { output_tokens: 50 } },
      ];

      let eventIndex = 0;
      const mockAsyncIterator = {
        [Symbol.asyncIterator]: () => ({
          next: () => {
            if (eventIndex < mockEvents.length) {
              return Promise.resolve({ value: mockEvents[eventIndex++], done: false });
            }
            return Promise.resolve({ value: undefined, done: true });
          },
        }),
        finalMessage: vi.fn().mockResolvedValue({
          usage: { input_tokens: 100, output_tokens: 50 },
        }),
      };

      mockStream.mockResolvedValue(mockAsyncIterator);

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      const result = await streamMessage(context, state, [], 'Hello');

      expect(result.stream).toBeInstanceOf(ReadableStream);
      expect(typeof result.getUsage).toBe('function');

      // Read from the stream
      const reader = result.stream.getReader();
      const chunks: string[] = [];
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(decoder.decode(value));
      }

      expect(chunks.join('')).toBe('Hello World');
    });

    it('should call Anthropic stream with correct parameters', async () => {
      const mockAsyncIterator = {
        [Symbol.asyncIterator]: () => ({
          next: () => Promise.resolve({ done: true, value: undefined }),
        }),
        finalMessage: vi.fn().mockResolvedValue({
          usage: { input_tokens: 100, output_tokens: 50 },
        }),
      };

      mockStream.mockResolvedValue(mockAsyncIterator);

      const context = createTestContext();
      const state = {
        version: 1,
        currentPhase: 'discovery' as const,
        researchPillars: {
          macroMarket: { started: false, completed: false, insights: [] },
          customer: { started: false, completed: false, insights: [] },
          colleague: { started: false, completed: false, insights: [] },
        },
        canvasProgress: {
          marketReality: false,
          customerInsights: false,
          organizationalContext: false,
          strategicSynthesis: false,
          teamContext: false,
        },
        strategicBets: [],
        keyInsights: [],
        sessionCount: 1,
        totalMessageCount: 0,
        lastActivityAt: new Date().toISOString(),
      };

      const history: ChatMessage[] = [{ role: 'user', content: 'Previous' }];

      await streamMessage(context, state, history, 'New message');

      expect(mockStream).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [
            { role: 'user', content: 'Previous' },
            { role: 'user', content: 'New message' },
          ],
        })
      );
    });
  });
});
