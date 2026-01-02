import { test as base, Page } from '@playwright/test';
import { StrategyCoachPage } from '../pages/StrategyCoachPage';
import { ConversationPage } from '../pages/ConversationPage';

/**
 * Authentication state type
 */
export type AuthState = {
  authenticated: boolean;
  userId?: string;
  orgId?: string;
};

/**
 * Extended test fixtures with page objects and auth
 */
export type TestFixtures = {
  strategyCoachPage: StrategyCoachPage;
  conversationPage: ConversationPage;
  authenticatedPage: Page;
};

/**
 * Create authenticated session
 *
 * Note: In a real implementation, this would:
 * 1. Use Clerk's testing tokens
 * 2. Set cookies/local storage for auth state
 * 3. Or use a test user with real credentials
 *
 * For now, we provide a mock implementation that can be extended.
 */
async function setupAuthentication(page: Page): Promise<void> {
  // Check if we have test credentials
  const testEmail = process.env.E2E_TEST_EMAIL;
  const testPassword = process.env.E2E_TEST_PASSWORD;

  if (testEmail && testPassword) {
    // Real authentication flow
    await page.goto('/sign-in');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/dashboard/**');
  } else {
    // For development/CI without real auth, we skip auth
    // This requires the app to be running in a test mode
    // that bypasses authentication
    console.log('No E2E credentials provided - tests may fail if auth is required');
  }
}

/**
 * Extended Playwright test with custom fixtures
 */
export const test = base.extend<TestFixtures>({
  // Page with authentication setup
  authenticatedPage: async ({ page }, use) => {
    await setupAuthentication(page);
    await use(page);
  },

  // Strategy Coach page object
  strategyCoachPage: async ({ page }, use) => {
    await setupAuthentication(page);
    const strategyCoachPage = new StrategyCoachPage(page);
    await use(strategyCoachPage);
  },

  // Conversation page object
  conversationPage: async ({ page }, use) => {
    await setupAuthentication(page);
    const conversationPage = new ConversationPage(page);
    await use(conversationPage);
  },
});

export { expect } from '@playwright/test';
