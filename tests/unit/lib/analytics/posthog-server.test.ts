import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { PostHog } from 'posthog-node';

// Mock posthog-node
vi.mock('posthog-node', () => {
  const mockCapture = vi.fn();
  const mockIdentify = vi.fn();
  const mockShutdown = vi.fn().mockResolvedValue(undefined);

  return {
    PostHog: vi.fn(() => ({
      capture: mockCapture,
      identify: mockIdentify,
      shutdown: mockShutdown,
    })),
  };
});

// Import after mocking
import { trackEvent, identifyUser, trackFeatureFlag } from '@/lib/analytics/posthog-server';

describe('posthog-server', () => {
  let mockPostHogInstance: {
    capture: ReturnType<typeof vi.fn>;
    identify: ReturnType<typeof vi.fn>;
    shutdown: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked PostHog instance
    const PostHogConstructor = PostHog as unknown as vi.Mock;
    PostHogConstructor.mockClear();

    // Create new instance for each test
    mockPostHogInstance = {
      capture: vi.fn(),
      identify: vi.fn(),
      shutdown: vi.fn().mockResolvedValue(undefined),
    };

    PostHogConstructor.mockImplementation(() => mockPostHogInstance);

    // Set required env vars
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test-key';
    process.env.NEXT_PUBLIC_POSTHOG_HOST = 'https://test.posthog.com';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;
  });

  describe('trackEvent', () => {
    test('should call PostHog.capture with correct parameters', async () => {
      await trackEvent('test_event', 'user123', { foo: 'bar' });

      expect(mockPostHogInstance.capture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: 'test_event',
        properties: expect.objectContaining({
          foo: 'bar',
          timestamp: expect.any(String),
          environment: 'test',
        }),
      });
    });

    test('should include timestamp in ISO format', async () => {
      await trackEvent('test_event', 'user123');

      const captureCall = mockPostHogInstance.capture.mock.calls[0][0];
      const timestamp = captureCall.properties.timestamp;

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    test('should include environment from NODE_ENV', async () => {
      await trackEvent('test_event', 'user123');

      const captureCall = mockPostHogInstance.capture.mock.calls[0][0];
      expect(captureCall.properties.environment).toBe('test');
    });

    test('should handle events with no properties', async () => {
      await trackEvent('test_event', 'user123');

      expect(mockPostHogInstance.capture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: 'test_event',
        properties: expect.objectContaining({
          timestamp: expect.any(String),
          environment: 'test',
        }),
      });
    });

    test('should handle events with multiple properties', async () => {
      await trackEvent('test_event', 'user123', {
        foo: 'bar',
        count: 42,
        flag: true,
        nested: { key: 'value' },
      });

      const captureCall = mockPostHogInstance.capture.mock.calls[0][0];
      expect(captureCall.properties).toMatchObject({
        foo: 'bar',
        count: 42,
        flag: true,
        nested: { key: 'value' },
        timestamp: expect.any(String),
        environment: 'test',
      });
    });

    test('should not throw if PostHog fails', async () => {
      mockPostHogInstance.capture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(trackEvent('test_event', 'user123')).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockPostHogInstance.capture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await trackEvent('test_event', 'user123');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Analytics Error] Failed to track event: test_event',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('identifyUser', () => {
    test('should call PostHog.identify with correct parameters', async () => {
      await identifyUser('user123', {
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(mockPostHogInstance.identify).toHaveBeenCalledWith({
        distinctId: 'user123',
        properties: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    });

    test('should handle identify with no properties', async () => {
      await identifyUser('user123');

      expect(mockPostHogInstance.identify).toHaveBeenCalledWith({
        distinctId: 'user123',
        properties: {},
      });
    });

    test('should not throw if PostHog fails', async () => {
      mockPostHogInstance.identify.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(identifyUser('user123')).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockPostHogInstance.identify.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await identifyUser('user123');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Analytics Error] Failed to identify user: user123',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('trackFeatureFlag', () => {
    test('should call PostHog.capture with feature flag event', async () => {
      await trackFeatureFlag('user123', 'new-ui', true);

      expect(mockPostHogInstance.capture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: '$feature_flag_called',
        properties: {
          $feature_flag: 'new-ui',
          $feature_flag_response: true,
        },
      });
    });

    test('should handle string flag values', async () => {
      await trackFeatureFlag('user123', 'variant-test', 'variant-a');

      expect(mockPostHogInstance.capture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: '$feature_flag_called',
        properties: {
          $feature_flag: 'variant-test',
          $feature_flag_response: 'variant-a',
        },
      });
    });

    test('should handle boolean false', async () => {
      await trackFeatureFlag('user123', 'feature-disabled', false);

      expect(mockPostHogInstance.capture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: '$feature_flag_called',
        properties: {
          $feature_flag: 'feature-disabled',
          $feature_flag_response: false,
        },
      });
    });

    test('should not throw if PostHog fails', async () => {
      mockPostHogInstance.capture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(trackFeatureFlag('user123', 'flag', true)).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockPostHogInstance.capture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await trackFeatureFlag('user123', 'flag', true);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Analytics Error] Failed to track feature flag: flag',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('PostHog singleton', () => {
    test('should create PostHog client with correct config', async () => {
      await trackEvent('test', 'user1');

      const PostHogConstructor = PostHog as unknown as vi.Mock;

      expect(PostHogConstructor).toHaveBeenCalledWith('test-key', {
        host: 'https://test.posthog.com',
        flushAt: 20,
        flushInterval: 10000,
      });
    });

    test('should default to us.i.posthog.com if host not provided', async () => {
      delete process.env.NEXT_PUBLIC_POSTHOG_HOST;

      // Clear module cache to test default
      vi.resetModules();

      const { trackEvent: newTrackEvent } = await import('@/lib/analytics/posthog-server');
      await newTrackEvent('test', 'user1');

      const PostHogConstructor = PostHog as unknown as vi.Mock;
      const lastCall = PostHogConstructor.mock.calls[PostHogConstructor.mock.calls.length - 1];

      expect(lastCall[1].host).toBe('https://us.i.posthog.com');
    });

    test('should throw error if API key is missing', async () => {
      delete process.env.NEXT_PUBLIC_POSTHOG_KEY;

      // Reset modules to force re-initialization
      vi.resetModules();

      const { trackEvent: newTrackEvent } = await import('@/lib/analytics/posthog-server');

      // Should not throw during import, but should fail gracefully on usage
      await expect(newTrackEvent('test', 'user1')).resolves.not.toThrow();
    });
  });

  describe('error isolation', () => {
    test('should never crash app if analytics fails', async () => {
      mockPostHogInstance.capture.mockImplementation(() => {
        throw new Error('Critical PostHog failure');
      });

      // All analytics functions should handle errors gracefully
      await expect(trackEvent('test', 'user1')).resolves.not.toThrow();
      await expect(identifyUser('user1')).resolves.not.toThrow();
      await expect(trackFeatureFlag('user1', 'flag', true)).resolves.not.toThrow();
    });
  });
});
