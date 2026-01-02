import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-clerk-key';
process.env.CLERK_SECRET_KEY = 'test-clerk-secret';

// Mock crypto.randomUUID for consistent test IDs
vi.stubGlobal('crypto', {
  ...crypto,
  randomUUID: () => 'test-uuid-1234-5678-9abc-def012345678',
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
