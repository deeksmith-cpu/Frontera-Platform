import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Strategy Coach conversation page
 * Route: /dashboard/strategy-coach/[conversationId]
 */
export class ConversationPage extends BasePage {
  // Locators
  readonly conversationTitle: Locator;
  readonly messageCount: Locator;
  readonly backButton: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly messageList: Locator;
  readonly userMessages: Locator;
  readonly assistantMessages: Locator;
  readonly streamingIndicator: Locator;
  readonly errorBanner: Locator;
  readonly errorDismissButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header elements
    this.conversationTitle = page.locator('header h1');
    this.messageCount = page.locator('header').getByText(/\d+ messages/);
    this.backButton = page.getByRole('button', { name: /back to conversations/i });

    // Input elements
    this.messageInput = page.getByPlaceholder(/share your thoughts/i);
    this.sendButton = page.getByRole('button', { name: /send message/i });

    // Message list
    this.messageList = page.locator('[class*="space-y-6"]');
    this.userMessages = page.locator('[class*="justify-end"]').locator('[class*="bg-\\[#1e3a8a\\]"]');
    this.assistantMessages = page.locator('[class*="justify-start"]').locator('[class*="bg-white"]');

    // Status indicators
    this.streamingIndicator = page.getByText('Thinking...');
    this.errorBanner = page.locator('[class*="bg-red-50"]');
    this.errorDismissButton = this.errorBanner.getByRole('button');
  }

  /**
   * Navigate to a specific conversation
   */
  async navigate(conversationId: string) {
    await this.goto(`/dashboard/strategy-coach/${conversationId}`);
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded() {
    await expect(this.messageInput).toBeVisible();
    await expect(this.sendButton).toBeVisible();
  }

  /**
   * Wait for opening message
   */
  async waitForOpeningMessage(timeout = 30000) {
    // Wait for streaming to complete
    await this.page.waitForFunction(
      () => !document.querySelector('[class*="animate-pulse"]'),
      { timeout }
    );
    // Wait for at least one assistant message
    await expect(this.assistantMessages.first()).toBeVisible({ timeout });
  }

  /**
   * Send a message
   */
  async sendMessage(message: string) {
    await this.messageInput.fill(message);
    await this.sendButton.click();
  }

  /**
   * Wait for response to complete
   */
  async waitForResponse(timeout = 60000) {
    // Wait for streaming indicator to disappear
    await this.streamingIndicator.waitFor({ state: 'hidden', timeout });
    // Additional wait for message to be fully rendered
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all messages
   */
  async getMessages(): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    // Get user messages
    const userCount = await this.userMessages.count();
    for (let i = 0; i < userCount; i++) {
      const content = await this.userMessages.nth(i).textContent();
      if (content) messages.push({ role: 'user', content: content.trim() });
    }

    // Get assistant messages
    const assistantCount = await this.assistantMessages.count();
    for (let i = 0; i < assistantCount; i++) {
      const content = await this.assistantMessages.nth(i).textContent();
      if (content) messages.push({ role: 'assistant', content: content.trim() });
    }

    return messages;
  }

  /**
   * Get message count from header
   */
  async getMessageCount(): Promise<number> {
    const text = await this.messageCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Check if streaming is in progress
   */
  async isStreaming(): Promise<boolean> {
    return this.streamingIndicator.isVisible();
  }

  /**
   * Check if input is disabled
   */
  async isInputDisabled(): Promise<boolean> {
    return this.messageInput.isDisabled();
  }

  /**
   * Go back to conversation list
   */
  async goBack() {
    await this.backButton.click();
    await this.page.waitForURL('/dashboard/strategy-coach');
  }

  /**
   * Check if error is displayed
   */
  async hasError(): Promise<boolean> {
    return this.errorBanner.isVisible();
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.hasError()) {
      return this.errorBanner.locator('p').textContent();
    }
    return null;
  }

  /**
   * Dismiss error
   */
  async dismissError() {
    await this.errorDismissButton.click();
  }

  /**
   * Get conversation title
   */
  async getTitle(): Promise<string | null> {
    return this.conversationTitle.textContent();
  }

  /**
   * Type in input without sending
   */
  async typeMessage(message: string) {
    await this.messageInput.fill(message);
  }

  /**
   * Clear input
   */
  async clearInput() {
    await this.messageInput.clear();
  }

  /**
   * Press Enter to send
   */
  async pressEnterToSend() {
    await this.messageInput.press('Enter');
  }

  /**
   * Press Shift+Enter for new line
   */
  async pressShiftEnter() {
    await this.messageInput.press('Shift+Enter');
  }
}
