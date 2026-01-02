import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

/**
 * Custom World class for Cucumber tests
 * Provides shared state and utilities across step definitions
 */
export class CustomWorld extends World {
  browser: Browser | null = null;
  context: BrowserContext | null = null;
  page: Page | null = null;

  // Test state
  currentUser: { userId: string; orgId: string } | null = null;
  currentConversation: { id: string; title: string } | null = null;
  conversations: Array<{ id: string; title: string; phase: string; messages: number }> = [];
  messages: Array<{ role: string; content: string }> = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  /**
   * Initialize browser and page
   */
  async init() {
    this.browser = await chromium.launch({
      headless: process.env.HEADLESS !== 'false',
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  /**
   * Cleanup browser resources
   */
  async cleanup() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  /**
   * Navigate to a URL
   */
  async goto(path: string) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page?.goto(`${baseUrl}${path}`);
  }

  /**
   * Set authenticated user state
   */
  setUser(userId: string, orgId: string) {
    this.currentUser = { userId, orgId };
  }

  /**
   * Set current conversation
   */
  setConversation(id: string, title: string) {
    this.currentConversation = { id, title };
  }

  /**
   * Add a conversation to the list
   */
  addConversation(conversation: { id: string; title: string; phase: string; messages: number }) {
    this.conversations.push(conversation);
  }

  /**
   * Add a message to the current conversation
   */
  addMessage(role: string, content: string) {
    this.messages.push({ role, content });
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string) {
    return this.page?.locator(`[data-testid="${testId}"]`);
  }

  /**
   * Get element by role
   */
  getByRole(role: string, options?: { name?: string | RegExp }) {
    return this.page?.getByRole(role as any, options);
  }

  /**
   * Get element by text
   */
  getByText(text: string | RegExp) {
    return this.page?.getByText(text);
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(urlPattern: string | RegExp) {
    await this.page?.waitForURL(urlPattern);
  }

  /**
   * Take a screenshot for debugging
   */
  async screenshot(name: string) {
    await this.page?.screenshot({ path: `screenshots/${name}.png` });
  }
}

setWorldConstructor(CustomWorld);
