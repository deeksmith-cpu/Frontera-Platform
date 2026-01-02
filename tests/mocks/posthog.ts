import { vi } from 'vitest';

// Mock PostHog client
export const createMockPostHogClient = () => ({
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  isFeatureEnabled: vi.fn().mockReturnValue(false),
  getFeatureFlag: vi.fn().mockReturnValue(null),
  reloadFeatureFlags: vi.fn(),
  onFeatureFlags: vi.fn(),
  shutdown: vi.fn(),
});

// Mock the PostHog module
export const mockPostHogModule = () => {
  const mockClient = createMockPostHogClient();

  vi.mock('posthog-js', () => ({
    default: mockClient,
    posthog: mockClient,
  }));

  vi.mock('posthog-node', () => ({
    PostHog: vi.fn().mockImplementation(() => mockClient),
  }));

  return mockClient;
};

// Mock analytics tracking function
export const mockAnalytics = () => {
  vi.mock('@/lib/analytics/strategy-coach', () => ({
    trackServerEvent: vi.fn().mockResolvedValue(undefined),
    trackClientEvent: vi.fn(),
  }));
};

// Reset PostHog mocks
export const resetPostHogMocks = () => {
  vi.resetModules();
};
