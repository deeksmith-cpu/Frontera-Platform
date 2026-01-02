import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/conversations/route';
import { createMockConversation, createMockFrameworkState } from 'tests/mocks/factories/conversation.factory';

// Mock dependencies
const mockAuth = vi.fn();
const mockSupabaseFrom = vi.fn();
const mockTrackServerEvent = vi.fn();

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
  })),
}));

vi.mock('@/lib/analytics/strategy-coach', () => ({
  trackServerEvent: (...args: unknown[]) => mockTrackServerEvent(...args),
}));

describe('GET /api/conversations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });

    const req = new NextRequest('http://localhost:3000/api/conversations');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('should return 401 when no organization', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: null });

    const req = new NextRequest('http://localhost:3000/api/conversations');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('should return conversations for the organization', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockConversations = [
      createMockConversation({ id: 'conv_1', title: 'Session 1' }),
      createMockConversation({ id: 'conv_2', title: 'Session 2' }),
    ];

    // Create a chainable query builder mock
    const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
    queryBuilder.select = vi.fn(() => queryBuilder);
    queryBuilder.eq = vi.fn(() => queryBuilder);
    queryBuilder.neq = vi.fn(() => queryBuilder);
    queryBuilder.order = vi.fn(() => queryBuilder);
    // Make it thenable for await
    queryBuilder.then = vi.fn((resolve) => resolve({ data: mockConversations, error: null }));

    mockSupabaseFrom.mockReturnValue(queryBuilder);

    const req = new NextRequest('http://localhost:3000/api/conversations');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.conversations).toHaveLength(2);
    expect(data.conversations[0].title).toBe('Session 1');
  });

  it('should filter by agent_type query parameter', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockEq = vi.fn();
    const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
    queryBuilder.select = vi.fn(() => queryBuilder);
    queryBuilder.eq = mockEq.mockImplementation(() => queryBuilder);
    queryBuilder.neq = vi.fn(() => queryBuilder);
    queryBuilder.order = vi.fn(() => queryBuilder);
    queryBuilder.then = vi.fn((resolve) => resolve({ data: [], error: null }));

    mockSupabaseFrom.mockReturnValue(queryBuilder);

    const req = new NextRequest('http://localhost:3000/api/conversations?agent_type=product_coach');
    await GET(req);

    expect(mockEq).toHaveBeenCalledWith('agent_type', 'product_coach');
  });

  it('should filter by status query parameter', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockEq = vi.fn();
    const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
    queryBuilder.select = vi.fn(() => queryBuilder);
    queryBuilder.eq = mockEq.mockImplementation(() => queryBuilder);
    queryBuilder.neq = vi.fn(() => queryBuilder);
    queryBuilder.order = vi.fn(() => queryBuilder);
    queryBuilder.then = vi.fn((resolve) => resolve({ data: [], error: null }));

    mockSupabaseFrom.mockReturnValue(queryBuilder);

    const req = new NextRequest('http://localhost:3000/api/conversations?status=archived');
    await GET(req);

    expect(mockEq).toHaveBeenCalledWith('status', 'archived');
  });

  it('should exclude archived by default when no status filter', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockNeq = vi.fn();
    const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
    queryBuilder.select = vi.fn(() => queryBuilder);
    queryBuilder.eq = vi.fn(() => queryBuilder);
    queryBuilder.neq = mockNeq.mockImplementation(() => queryBuilder);
    queryBuilder.order = vi.fn(() => queryBuilder);
    queryBuilder.then = vi.fn((resolve) => resolve({ data: [], error: null }));

    mockSupabaseFrom.mockReturnValue(queryBuilder);

    const req = new NextRequest('http://localhost:3000/api/conversations');
    await GET(req);

    expect(mockNeq).toHaveBeenCalledWith('status', 'archived');
  });

  it('should return 500 on database error', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
    queryBuilder.select = vi.fn(() => queryBuilder);
    queryBuilder.eq = vi.fn(() => queryBuilder);
    queryBuilder.neq = vi.fn(() => queryBuilder);
    queryBuilder.order = vi.fn(() => queryBuilder);
    queryBuilder.then = vi.fn((resolve) => resolve({ data: null, error: { message: 'DB error' } }));

    mockSupabaseFrom.mockReturnValue(queryBuilder);

    const req = new NextRequest('http://localhost:3000/api/conversations');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to fetch conversations');
  });
});

describe('POST /api/conversations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null, orgId: null });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Session' }),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('should create conversation when client exists', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockConversation = createMockConversation({
      id: 'conv_new',
      title: 'My Strategy Session',
    });

    // Mock client exists check
    const mockClientSelect = vi.fn().mockReturnThis();
    const mockClientEq = vi.fn().mockReturnThis();
    const mockClientSingle = vi.fn().mockResolvedValue({
      data: { id: 'client_123' },
      error: null,
    });

    // Mock conversation insert
    const mockInsert = vi.fn().mockReturnThis();
    const mockInsertSelect = vi.fn().mockReturnThis();
    const mockInsertSingle = vi.fn().mockResolvedValue({
      data: mockConversation,
      error: null,
    });

    let callCount = 0;
    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: mockClientSelect,
          eq: mockClientEq,
          single: mockClientSingle,
        };
      }
      if (table === 'conversations') {
        return {
          insert: mockInsert,
          select: mockInsertSelect,
          single: mockInsertSingle,
        };
      }
      return {};
    });

    // Override for chaining
    mockClientSelect.mockReturnValue({ eq: mockClientEq });
    mockClientEq.mockReturnValue({ single: mockClientSingle });
    mockInsert.mockReturnValue({ select: mockInsertSelect });
    mockInsertSelect.mockReturnValue({ single: mockInsertSingle });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title: 'My Strategy Session' }),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.conversation).toBeDefined();
    expect(data.conversation.title).toBe('My Strategy Session');
  });

  it('should create client record if it does not exist', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockConversation = createMockConversation({ id: 'conv_new' });

    // Track insert calls
    const clientInsertFn = vi.fn().mockResolvedValue({ error: null });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
          insert: clientInsertFn,
        };
      }
      if (table === 'conversations') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    await POST(req);

    expect(clientInsertFn).toHaveBeenCalled();
    const insertArg = clientInsertFn.mock.calls[0][0];
    expect(insertArg.clerk_org_id).toBe('org_456');
    expect(insertArg.tier).toBe('pilot');
  });

  it('should use default title when not provided', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const insertFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: createMockConversation(),
          error: null,
        }),
      }),
    });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'client_1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'conversations') {
        return { insert: insertFn };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    await POST(req);

    expect(insertFn).toHaveBeenCalled();
    const insertArg = insertFn.mock.calls[0][0];
    expect(insertArg.title).toBe('New Strategy Session');
  });

  it('should initialize framework state for strategy_coach', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const insertFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: createMockConversation(),
          error: null,
        }),
      }),
    });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'client_1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'conversations') {
        return { insert: insertFn };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ agent_type: 'strategy_coach' }),
    });
    await POST(req);

    const insertArg = insertFn.mock.calls[0][0];
    expect(insertArg.framework_state).toBeDefined();
    expect(insertArg.framework_state.version).toBe(1);
    expect(insertArg.framework_state.currentPhase).toBe('discovery');
  });

  it('should use empty framework state for non-strategy_coach agents', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const insertFn = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: createMockConversation({ agent_type: 'product_coach' }),
          error: null,
        }),
      }),
    });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'client_1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'conversations') {
        return { insert: insertFn };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ agent_type: 'product_coach' }),
    });
    await POST(req);

    const insertArg = insertFn.mock.calls[0][0];
    expect(insertArg.framework_state).toEqual({});
  });

  it('should track analytics on conversation creation', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    const mockConversation = createMockConversation({ id: 'conv_tracked' });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'client_1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'conversations') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockConversation, error: null }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    await POST(req);

    expect(mockTrackServerEvent).toHaveBeenCalledWith(
      'strategy_coach_conversation_started',
      'user_123',
      expect.objectContaining({
        conversation_id: 'conv_tracked',
        org_id: 'org_456',
      })
    );
  });

  it('should return 500 on conversation creation failure', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123', orgId: 'org_456' });

    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'client_1' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'conversations') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
            }),
          }),
        };
      }
      return {};
    });

    const req = new NextRequest('http://localhost:3000/api/conversations', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Failed to create conversation');
  });
});
