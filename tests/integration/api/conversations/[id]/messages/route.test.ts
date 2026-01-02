import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/conversations/[id]/messages/route';
import { createMockConversation, createMockMessage, createMockFrameworkState } from 'tests/mocks/factories/conversation.factory';

// Mock dependencies
const mockAuth = vi.fn();
const mockCurrentUser = vi.fn();
const mockSupabaseFrom = vi.fn();
const mockLoadClientContext = vi.fn();
const mockStreamMessage = vi.fn();
const mockGenerateOpeningMessage = vi.fn();
const mockTrackServerEvent = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
  currentUser: () => mockCurrentUser(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
  })),
}));

vi.mock('@/lib/agents/strategy-coach', () => ({
  loadClientContext: (...args: unknown[]) => mockLoadClientContext(...args),
  streamMessage: (...args: unknown[]) => mockStreamMessage(...args),
  messagesToChatHistory: vi.fn((messages) =>
    messages
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }))
  ),
}));

vi.mock('@/lib/agents/strategy-coach/system-prompt', () => ({
  generateOpeningMessage: (...args: unknown[]) => mockGenerateOpeningMessage(...args),
}));

vi.mock('@/lib/analytics/strategy-coach', () => ({
  trackServerEvent: (...args: unknown[]) => mockTrackServerEvent(...args),
}));

// Helper to create mock client context
const createMockClientContext = () => ({
  companyName: 'Test Corp',
  industry: 'Technology',
  companySize: '201-500 employees',
  tier: 'enterprise',
  strategicFocus: 'product_model',
  strategicFocusDescription: 'transforming into a product-centric operating model',
  painPoints: 'Alignment issues',
  previousAttempts: null,
  targetOutcomes: 'Faster delivery',
  additionalContext: null,
  successMetrics: ['outcomes'],
  timelineExpectations: '12 months',
  clerkOrgId: 'org_456',
  clientId: 'client_123',
});

describe('POST /api/conversations/[id]/messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
  });

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });
    mockCurrentUser.mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 when conversation not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
    mockCurrentUser.mockResolvedValue({ firstName: 'Test' });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
              }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_notfound/messages', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'conv_notfound' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Conversation not found');
  });

  it('should return 500 when client context cannot be loaded', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
    mockCurrentUser.mockResolvedValue({ firstName: 'Test' });
    mockLoadClientContext.mockResolvedValue(null);

    const mockConversation = createMockConversation({ id: 'conv_123' });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
              }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' }),
    });
    const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to load client context');
  });

  describe('Opening message (empty message request)', () => {
    it('should generate opening message for new conversation', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Alice' });
      mockLoadClientContext.mockResolvedValue(createMockClientContext());
      mockGenerateOpeningMessage.mockReturnValue('Welcome, Alice! This is your opening message.');

      const mockConversation = createMockConversation({ id: 'conv_123' });
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
            update: mockUpdate,
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
            insert: mockInsert,
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '' }),
      });
      const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe('Welcome, Alice! This is your opening message.');
      expect(mockGenerateOpeningMessage).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        'Alice',
        false
      );
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'assistant',
          content: 'Welcome, Alice! This is your opening message.',
          metadata: { type: 'opening' },
        })
      );
    });

    it('should return existing messages info when conversation already has messages', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Alice' });
      mockLoadClientContext.mockResolvedValue(createMockClientContext());

      const mockConversation = createMockConversation({ id: 'conv_123' });
      const existingMessages = [
        createMockMessage({ id: 'msg_1', role: 'assistant', content: 'Previous opening' }),
      ];

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: existingMessages, error: null }),
              }),
            }),
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: null }),
      });
      const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBeNull();
      expect(data.existingMessages).toBe(1);
      expect(data.message).toBe('Conversation already has messages');
    });

    it('should handle whitespace-only message as empty', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Bob' });
      mockLoadClientContext.mockResolvedValue(createMockClientContext());
      mockGenerateOpeningMessage.mockReturnValue('Welcome, Bob!');

      const mockConversation = createMockConversation({ id: 'conv_123' });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '   ' }),
      });
      const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe('Welcome, Bob!');
    });
  });

  describe('User message with streaming response', () => {
    it('should save user message and stream AI response', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Charlie' });
      mockLoadClientContext.mockResolvedValue(createMockClientContext());

      const mockConversation = createMockConversation({ id: 'conv_123' });
      const mockUserMessageInsert = vi.fn().mockResolvedValue({ error: null });
      const mockAssistantMessageInsert = vi.fn().mockResolvedValue({ error: null });

      // Create a mock readable stream
      const encoder = new TextEncoder();
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('Hello '));
          controller.enqueue(encoder.encode('World!'));
          controller.close();
        },
      });

      mockStreamMessage.mockResolvedValue({
        stream: mockReadableStream,
        getUsage: vi.fn().mockResolvedValue({ inputTokens: 100, outputTokens: 50 }),
      });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
            insert: mockUserMessageInsert,
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'What are the market trends?' }),
      });
      const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

      // Verify user message was saved
      expect(mockUserMessageInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
          content: 'What are the market trends?',
        })
      );

      // Read the stream
      const reader = response.body!.getReader();
      const chunks: string[] = [];
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(decoder.decode(value));
      }

      expect(chunks.join('')).toBe('Hello World!');
    });

    it('should call streamMessage with correct parameters', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Diana' });

      const clientContext = createMockClientContext();
      mockLoadClientContext.mockResolvedValue(clientContext);

      const frameworkState = createMockFrameworkState();
      const mockConversation = createMockConversation({
        id: 'conv_123',
        framework_state: frameworkState,
      });

      const existingMessages = [
        createMockMessage({ role: 'user', content: 'Previous question' }),
        createMockMessage({ role: 'assistant', content: 'Previous answer' }),
      ];

      const encoder = new TextEncoder();
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('Response'));
          controller.close();
        },
      });

      mockStreamMessage.mockResolvedValue({
        stream: mockReadableStream,
        getUsage: vi.fn().mockResolvedValue({ inputTokens: 50, outputTokens: 25 }),
      });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: existingMessages, error: null }),
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'New question' }),
      });
      await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });

      expect(mockStreamMessage).toHaveBeenCalledWith(
        clientContext,
        frameworkState,
        expect.arrayContaining([
          { role: 'user', content: 'Previous question' },
          { role: 'assistant', content: 'Previous answer' },
        ]),
        'New question',
        'Diana'
      );
    });

    it('should use undefined for userName when user has no firstName', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: null });
      mockLoadClientContext.mockResolvedValue(createMockClientContext());

      const mockConversation = createMockConversation({ id: 'conv_123' });

      const encoder = new TextEncoder();
      const mockReadableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('Hi'));
          controller.close();
        },
      });

      mockStreamMessage.mockResolvedValue({
        stream: mockReadableStream,
        getUsage: vi.fn().mockResolvedValue({ inputTokens: 10, outputTokens: 5 }),
      });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          };
        }
        if (table === 'conversation_messages') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });
      await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });

      expect(mockStreamMessage).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Array),
        'Hello',
        undefined
      );
    });
  });

  describe('Error handling', () => {
    it('should return 500 on unexpected error', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockRejectedValue(new Error('Unexpected error'));

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });
      const response = await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to process message');
    });

    it('should track error events on failure', async () => {
      mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });
      mockCurrentUser.mockResolvedValue({ firstName: 'Test' });
      mockLoadClientContext.mockRejectedValue(new Error('Context load failed'));

      const mockConversation = createMockConversation({ id: 'conv_123' });

      mockSupabaseFrom.mockImplementation((table: string) => {
        if (table === 'conversations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
                }),
              }),
            }),
          };
        }
        return {};
      });

      const req = new NextRequest('http://localhost:3000/api/conversations/conv_123/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });
      await POST(req, { params: Promise.resolve({ id: 'conv_123' }) });

      expect(mockTrackServerEvent).toHaveBeenCalledWith(
        'strategy_coach_llm_error',
        'user_123',
        expect.objectContaining({
          error_type: 'Error',
          error_message: 'Context load failed',
        })
      );
    });
  });
});
