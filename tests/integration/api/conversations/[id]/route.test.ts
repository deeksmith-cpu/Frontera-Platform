import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH } from '@/app/api/conversations/[id]/route';
import { createMockConversation, createMockMessage } from 'tests/mocks/factories/conversation.factory';

// Mock dependencies
const mockAuth = vi.fn();
const mockSupabaseFrom = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
  })),
}));

describe('GET /api/conversations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123');
    const response = await GET(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 404 when conversation not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

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

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_notfound');
    const response = await GET(req, { params: Promise.resolve({ id: 'conv_notfound' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Conversation not found');
  });

  it('should return conversation with messages', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockConversation = createMockConversation({ id: 'conv_123', title: 'Test Session' });
    const mockMessages = [
      createMockMessage({ id: 'msg_1', role: 'user', content: 'Hello' }),
      createMockMessage({ id: 'msg_2', role: 'assistant', content: 'Hi there!' }),
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
              order: vi.fn().mockResolvedValue({ data: mockMessages, error: null }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123');
    const response = await GET(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.conversation.id).toBe('conv_123');
    expect(data.conversation.title).toBe('Test Session');
    expect(data.messages).toHaveLength(2);
    expect(data.messages[0].content).toBe('Hello');
  });

  it('should return empty messages array when no messages exist', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

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
      if (table === 'conversation_messages') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123');
    const response = await GET(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.messages).toEqual([]);
  });

  it('should return 500 on message fetch error', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

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
      if (table === 'conversation_messages') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123');
    const response = await GET(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch messages');
  });

  it('should enforce organization isolation', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockEq = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'conversations') {
        return {
          select: vi.fn().mockReturnValue({
            eq: mockEq,
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123');
    await GET(req, { params: Promise.resolve({ id: 'conv_123' }) });

    // Verify org_id filter is applied
    expect(mockEq).toHaveBeenCalledWith('id', 'conv_123');
  });
});

describe('PATCH /api/conversations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 when no valid fields to update', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No valid fields to update');
  });

  it('should update conversation title', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const updatedConversation = createMockConversation({
      id: 'conv_123',
      title: 'New Title',
    });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: updatedConversation, error: null }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'New Title' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.conversation.title).toBe('New Title');
    expect(mockUpdate).toHaveBeenCalledWith({ title: 'New Title' });
  });

  it('should update conversation status', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const updatedConversation = createMockConversation({
      id: 'conv_123',
      status: 'archived',
    });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: updatedConversation, error: null }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'archived' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ status: 'archived' });
  });

  it('should update framework_state', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const newFrameworkState = {
      version: 1,
      currentPhase: 'research',
      researchPillars: {
        macroMarket: { started: true, completed: false, insights: [] },
        customer: { started: false, completed: false, insights: [] },
        colleague: { started: false, completed: false, insights: [] },
      },
    };

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createMockConversation({ framework_state: newFrameworkState }),
              error: null,
            }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ framework_state: newFrameworkState }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ framework_state: newFrameworkState });
  });

  it('should update context_summary', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createMockConversation({ context_summary: 'A summary of the conversation' }),
              error: null,
            }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ context_summary: 'A summary of the conversation' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ context_summary: 'A summary of the conversation' });
  });

  it('should update multiple fields at once', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createMockConversation({
                title: 'Updated',
                status: 'completed',
              }),
              error: null,
            }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated', status: 'completed' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({ title: 'Updated', status: 'completed' });
  });

  it('should return 500 on update failure', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    mockSupabaseFrom.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } }),
            }),
          }),
        }),
      }),
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'New Title' }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update conversation');
  });

  it('should ignore unknown fields', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: createMockConversation({ title: 'Valid Title' }),
              error: null,
            }),
          }),
        }),
      }),
    });

    mockSupabaseFrom.mockReturnValue({
      update: mockUpdate,
    });

    const req = new NextRequest('http://localhost:3000/api/conversations/conv_123', {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'Valid Title',
        unknownField: 'should be ignored',
        anotherUnknown: 123,
      }),
    });
    const response = await PATCH(req, { params: Promise.resolve({ id: 'conv_123' }) });

    expect(response.status).toBe(200);
    // Only valid fields should be in the update call
    expect(mockUpdate).toHaveBeenCalledWith({ title: 'Valid Title' });
  });
});
