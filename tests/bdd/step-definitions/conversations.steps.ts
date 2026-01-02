import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Step definitions for conversation management
 */

// Conversation state
Given('I have no previous conversations', async function (this: CustomWorld) {
  this.conversations = [];
  // In a real test, this would clear the database or mock the API
});

Given('I have the following conversations:', async function (this: CustomWorld, dataTable: DataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    this.addConversation({
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      title: row['Title'],
      phase: row['Phase'].toLowerCase(),
      messages: parseInt(row['Messages'], 10),
    });
  }
  // In a real test, this would seed the database or mock the API
});

Given('I have a conversation titled {string}', async function (this: CustomWorld, title: string) {
  const id = `conv_${Date.now()}`;
  this.addConversation({ id, title, phase: 'discovery', messages: 5 });
  this.setConversation(id, title);
});

Given('I have an active coaching conversation', async function (this: CustomWorld) {
  const id = `conv_${Date.now()}`;
  this.setConversation(id, 'Active Session');
  this.addConversation({ id, title: 'Active Session', phase: 'discovery', messages: 1 });
});

Given('I am in a coaching conversation', async function (this: CustomWorld) {
  // Create and navigate to a conversation
  await this.goto('/dashboard/strategy-coach');
  await this.page?.getByRole('button', { name: /start new strategy session/i }).click();
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);
});

// Navigation actions
When('I click the {string} button', async function (this: CustomWorld, buttonText: string) {
  await this.page?.getByRole('button', { name: new RegExp(buttonText, 'i') }).click();
});

When('I click on the conversation {string}', async function (this: CustomWorld, title: string) {
  await this.page?.getByRole('button', { name: new RegExp(title, 'i') }).click();
});

When('I click the back button', async function (this: CustomWorld) {
  await this.page?.getByRole('button', { name: /back to conversations/i }).click();
});

When('I navigate to Strategy Coach', async function (this: CustomWorld) {
  await this.goto('/dashboard/strategy-coach');
});

When('I try to access the Strategy Coach page', async function (this: CustomWorld) {
  await this.goto('/dashboard/strategy-coach');
});

When('I navigate back to the conversation list', async function (this: CustomWorld) {
  await this.page?.getByRole('button', { name: /back to conversations/i }).click();
  await this.page?.waitForURL('/dashboard/strategy-coach');
});

When('I open the same conversation', async function (this: CustomWorld) {
  const title = this.currentConversation?.title || 'Active Session';
  await this.page?.getByRole('button', { name: new RegExp(title, 'i') }).click();
});

When('I click {string} in the breadcrumb', async function (this: CustomWorld, linkText: string) {
  await this.page?.locator('nav ol').getByText(linkText).click();
});

// Page content verification
Then('I should see the coaching journey with {int} phases', async function (this: CustomWorld, count: number) {
  const journey = this.page?.getByText('Your Coaching Journey');
  await expect(journey!).toBeVisible();

  const phases = this.page?.locator('[class*="grid-cols-4"]').locator('[class*="text-center"]');
  await expect(phases!).toHaveCount(count);
});

Then('I should see the following phases:', async function (this: CustomWorld, dataTable: DataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await expect(this.page!.getByText(row['Phase'], { exact: true })).toBeVisible();
  }
});

Then('I should see the empty state message {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page!.getByText(message)).toBeVisible();
});

Then('I should see {string} heading', async function (this: CustomWorld, heading: string) {
  await expect(this.page!.getByText(heading)).toBeVisible();
});

Then('I should see {int} conversation cards', async function (this: CustomWorld, count: number) {
  // Wait for cards to load
  await this.page?.waitForTimeout(500);
  const cards = this.page?.locator('button').filter({ hasText: /messages/ });
  await expect(cards!).toHaveCount(count);
});

Then('I should see conversation {string} with phase {string}', async function (this: CustomWorld, title: string, phase: string) {
  const card = this.page?.getByRole('button', { name: new RegExp(title, 'i') });
  await expect(card!).toBeVisible();
  await expect(card!.getByText(phase)).toBeVisible();
});

// Conversation page verification
Then('I should be redirected to a new conversation page', async function (this: CustomWorld) {
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);
});

Then('I should be redirected to that conversation page', async function (this: CustomWorld) {
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);
});

Then('I should see the chat interface', async function (this: CustomWorld) {
  await expect(this.page!.getByPlaceholder(/share your thoughts/i)).toBeVisible();
  await expect(this.page!.getByRole('button', { name: /send message/i })).toBeVisible();
});

Then('I should receive an opening message from the coach', async function (this: CustomWorld) {
  // Wait for opening message to appear
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 30000 }
  );

  // Check for assistant message
  const assistantMessage = this.page?.locator('[class*="justify-start"]').locator('[class*="bg-white"]');
  await expect(assistantMessage!.first()).toBeVisible();
});

Then('I should see the conversation title {string}', async function (this: CustomWorld, title: string) {
  const header = this.page?.locator('header h1');
  await expect(header!).toHaveText(title);
});

Then('I should see the previous messages', async function (this: CustomWorld) {
  // Verify messages are displayed
  const messageList = this.page?.locator('[class*="space-y-6"]');
  await expect(messageList!).toBeVisible();
});

Then('I should see my previous conversations', async function (this: CustomWorld) {
  await expect(this.page!.getByText('Previous Sessions')).toBeVisible();
});

Then('I should see all my previous messages', async function (this: CustomWorld) {
  // Verify at least some messages are visible
  const messageContainer = this.page?.locator('[class*="space-y-6"]');
  await expect(messageContainer!).toBeVisible();
});
