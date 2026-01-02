import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Strategy Coach list page
 * Route: /dashboard/strategy-coach
 */
export class StrategyCoachPage extends BasePage {
  // Locators
  readonly pageTitle: Locator;
  readonly breadcrumb: Locator;
  readonly newSessionButton: Locator;
  readonly conversationList: Locator;
  readonly conversationCards: Locator;
  readonly emptyState: Locator;
  readonly coachingJourney: Locator;
  readonly phaseSteps: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageTitle = page.getByRole('heading', { name: 'Strategy Coach' });
    this.breadcrumb = page.locator('nav ol');
    this.newSessionButton = page.getByRole('button', { name: /start new strategy session/i });
    this.conversationList = page.locator('[class*="space-y"]').filter({ has: page.getByText('Previous Sessions') });
    this.conversationCards = page.locator('button').filter({ hasText: /Strategy Session|messages/ });
    this.emptyState = page.getByText('No coaching sessions yet');
    this.coachingJourney = page.getByText('Your Coaching Journey');
    this.phaseSteps = page.locator('[class*="grid-cols-4"]').locator('div[class*="text-center"]');
  }

  /**
   * Navigate to Strategy Coach page
   */
  async navigate() {
    await this.goto('/dashboard/strategy-coach');
    await this.waitForPageLoad();
  }

  /**
   * Verify page is loaded
   */
  async verifyPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.coachingJourney).toBeVisible();
  }

  /**
   * Start a new strategy session
   */
  async startNewSession() {
    await this.newSessionButton.click();
    // Wait for navigation to conversation page
    await this.page.waitForURL(/\/dashboard\/strategy-coach\/.+/);
  }

  /**
   * Check if empty state is shown
   */
  async hasEmptyState(): Promise<boolean> {
    return this.emptyState.isVisible();
  }

  /**
   * Get number of conversation cards
   */
  async getConversationCount(): Promise<number> {
    return this.conversationCards.count();
  }

  /**
   * Click on a conversation by title
   */
  async openConversation(title: string) {
    const card = this.page.getByRole('button', { name: new RegExp(title, 'i') });
    await card.click();
    await this.page.waitForURL(/\/dashboard\/strategy-coach\/.+/);
  }

  /**
   * Get all conversation titles
   */
  async getConversationTitles(): Promise<string[]> {
    const cards = this.conversationCards;
    const count = await cards.count();
    const titles: string[] = [];

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = await card.locator('h4').textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  /**
   * Verify coaching journey phases are displayed
   */
  async verifyCoachingJourneyPhases() {
    const phases = ['Discovery', 'Research', 'Synthesis', 'Planning'];
    for (const phase of phases) {
      await expect(this.page.getByText(phase, { exact: true })).toBeVisible();
    }
  }

  /**
   * Get phase badge text for a conversation
   */
  async getConversationPhase(conversationIndex: number): Promise<string | null> {
    const card = this.conversationCards.nth(conversationIndex);
    const badge = card.locator('[class*="rounded-full"]');
    return badge.textContent();
  }
}
