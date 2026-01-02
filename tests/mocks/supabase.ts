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

// Create a chainable query builder mock
export const createMockQueryBuilder = (
  data: unknown = null,
  error: unknown = null
): QueryBuilderMock => {
  const mockResult = { data, error };

  const builder: QueryBuilderMock = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(mockResult),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
  };

  // Make terminal methods return the result
  builder.select.mockImplementation(() => {
    const chainable = { ...builder };
    // Override to return array for non-single queries
    chainable.eq = vi.fn().mockReturnValue({
      ...chainable,
      single: vi.fn().mockResolvedValue(mockResult),
      order: vi.fn().mockResolvedValue({
        data: Array.isArray(data) ? data : [data],
        error
      }),
    });
    return chainable;
  });

  builder.insert.mockImplementation(() => ({
    ...builder,
    select: vi.fn().mockResolvedValue(mockResult),
  }));

  builder.update.mockImplementation(() => ({
    ...builder,
    eq: vi.fn().mockResolvedValue(mockResult),
  }));

  builder.delete.mockImplementation(() => ({
    ...builder,
    eq: vi.fn().mockResolvedValue(mockResult),
  }));

  return builder;
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
