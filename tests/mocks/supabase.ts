import { vi } from 'vitest';

// Type for query builder mock
type QueryBuilderMock = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  is: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  filter: ReturnType<typeof vi.fn>;
};

// Create a chainable query builder mock that supports any query depth
export const createMockQueryBuilder = (
  data: unknown = null,
  error: unknown = null
): QueryBuilderMock => {
  const mockResult = { data, error };
  const arrayResult = { data: Array.isArray(data) ? data : data ? [data] : [], error };

  // Create a recursive chainable object that always has all methods available
  const createChainable = (): QueryBuilderMock => {
    const chainable: QueryBuilderMock = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      neq: vi.fn(),
      single: vi.fn().mockResolvedValue(mockResult),
      order: vi.fn().mockResolvedValue(arrayResult),
      limit: vi.fn(),
      range: vi.fn(),
      match: vi.fn(),
      in: vi.fn(),
      is: vi.fn(),
      or: vi.fn(),
      filter: vi.fn(),
    };

    // Make chainable methods return a new chainable (supports any depth)
    chainable.select.mockImplementation(() => createChainable());
    chainable.eq.mockImplementation(() => createChainable());
    chainable.neq.mockImplementation(() => createChainable());
    chainable.limit.mockImplementation(() => createChainable());
    chainable.range.mockImplementation(() => createChainable());
    chainable.match.mockImplementation(() => createChainable());
    chainable.in.mockImplementation(() => createChainable());
    chainable.is.mockImplementation(() => createChainable());
    chainable.or.mockImplementation(() => createChainable());
    chainable.filter.mockImplementation(() => createChainable());

    // Insert returns object with select that resolves
    chainable.insert.mockImplementation(() => ({
      ...createChainable(),
      select: vi.fn().mockResolvedValue(mockResult),
    }));

    // Update returns object with eq that resolves
    chainable.update.mockImplementation(() => ({
      ...createChainable(),
      eq: vi.fn().mockResolvedValue(mockResult),
    }));

    // Delete returns object with eq that resolves
    chainable.delete.mockImplementation(() => ({
      ...createChainable(),
      eq: vi.fn().mockResolvedValue(mockResult),
    }));

    return chainable;
  };

  return createChainable();
};

// Create mock Supabase client with configurable table data
export const createMockSupabaseClient = (
  tables: Record<string, { data: unknown; error: unknown }> = {}
) => {
  return {
    from: vi.fn((tableName: string) => {
      const tableConfig = tables[tableName] || { data: null, error: null };
      return createMockQueryBuilder(tableConfig.data, tableConfig.error);
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: null, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: null }),
        download: vi.fn().mockResolvedValue({ data: null, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.url' } }),
      }),
    },
  };
};

// Mock the Supabase module
export const mockSupabaseModule = (
  tables?: Record<string, { data: unknown; error: unknown }>
) => {
  const mockClient = createMockSupabaseClient(tables);

  vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockClient),
  }));

  return mockClient;
};

// Helper to create successful query result
export const successResult = <T>(data: T) => ({ data, error: null });

// Helper to create error query result
export const errorResult = (message: string, code?: string) => ({
  data: null,
  error: { message, code: code || 'PGRST116' },
});

// Reset Supabase mocks
export const resetSupabaseMocks = () => {
  vi.resetModules();
};
