import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions at module level
const mockCapture = vi.fn();
const mockIdentify = vi.fn();
const mockShutdown = vi.fn().mockResolvedValue(undefined);

// Mock posthog-node before any imports
vi.mock('posthog-node', () => {
  return {
    PostHog: class MockPostHog {
      capture = mockCapture;
      identify = mockIdentify;
      shutdown = mockShutdown;
      constructor(_key: string, _options?: Record<string, unknown>) {
        // Constructor receives key and options
      }
    },
  };
});

// Import after mocking
import { trackEvent, identifyUser, trackFeatureFlag } from '@/lib/analytics/posthog-server';

describe('posthog-server', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

      expect(mockCapture).toHaveBeenCalledWith({
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

      const captureCall = mockCapture.mock.calls[0][0];
      const timestamp = captureCall.properties.timestamp;

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    test('should include environment from NODE_ENV', async () => {
      await trackEvent('test_event', 'user123');

      const captureCall = mockCapture.mock.calls[0][0];
      expect(captureCall.properties.environment).toBe('test');
    });

    test('should handle events with no properties', async () => {
      await trackEvent('test_event', 'user123');

      expect(mockCapture).toHaveBeenCalledWith({
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

      const captureCall = mockCapture.mock.calls[0][0];
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
      mockCapture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(trackEvent('test_event', 'user123')).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockCapture.mockImplementationOnce(() => {
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

      expect(mockIdentify).toHaveBeenCalledWith({
        distinctId: 'user123',
        properties: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    });

    test('should handle identify with no properties', async () => {
      await identifyUser('user123');

      expect(mockIdentify).toHaveBeenCalledWith({
        distinctId: 'user123',
        properties: {},
      });
    });

    test('should not throw if PostHog fails', async () => {
      mockIdentify.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(identifyUser('user123')).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockIdentify.mockImplementationOnce(() => {
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

      expect(mockCapture).toHaveBeenCalledWith({
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

      expect(mockCapture).toHaveBeenCalledWith({
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

      expect(mockCapture).toHaveBeenCalledWith({
        distinctId: 'user123',
        event: '$feature_flag_called',
        properties: {
          $feature_flag: 'feature-disabled',
          $feature_flag_response: false,
        },
      });
    });

    test('should not throw if PostHog fails', async () => {
      mockCapture.mockImplementationOnce(() => {
        throw new Error('PostHog error');
      });

      await expect(trackFeatureFlag('user123', 'flag', true)).resolves.not.toThrow();
    });

    test('should log error if PostHog fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockCapture.mockImplementationOnce(() => {
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

  describe('error isolation', () => {
    test('should never crash app if analytics fails', async () => {
      mockCapture.mockImplementation(() => {
        throw new Error('Critical PostHog failure');
      });
      mockIdentify.mockImplementation(() => {
        throw new Error('Critical PostHog failure');
      });

      // All analytics functions should handle errors gracefully
      await expect(trackEvent('test', 'user1')).resolves.not.toThrow();
      await expect(identifyUser('user1')).resolves.not.toThrow();
      await expect(trackFeatureFlag('user1', 'flag', true)).resolves.not.toThrow();
    });
  });
});
