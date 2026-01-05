import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

/**
 * Get or create singleton PostHog server client
 * This ensures event batching and reduces overhead
 */
export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (!key) {
      throw new Error('NEXT_PUBLIC_POSTHOG_KEY is not set');
    }

    posthogClient = new PostHog(key, {
      host,
      flushAt: 20,        // Batch 20 events before sending
      flushInterval: 10000, // Or flush every 10 seconds
    });

    // Graceful shutdown on process termination
    process.on('SIGTERM', async () => {
      await posthogClient?.shutdown();
    });
  }

  return posthogClient;
}

/**
 * Track a server-side event
 * Fire-and-forget pattern - never blocks API responses
 */
export async function trackEvent(
  eventName: string,
  distinctId: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.capture({
      distinctId,
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to track event: ${eventName}`, error);
    // Never throw - analytics should never crash the app
  }
}

/**
 * Identify a user with properties
 */
export async function identifyUser(
  distinctId: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.identify({
      distinctId,
      properties,
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to identify user: ${distinctId}`, error);
  }
}

/**
 * Track feature flag evaluation
 */
export async function trackFeatureFlag(
  distinctId: string,
  flagKey: string,
  flagValue: boolean | string
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.capture({
      distinctId,
      event: '$feature_flag_called',
      properties: {
        $feature_flag: flagKey,
        $feature_flag_response: flagValue,
      },
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to track feature flag: ${flagKey}`, error);
  }
}
