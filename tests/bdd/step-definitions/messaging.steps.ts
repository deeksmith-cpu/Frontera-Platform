import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Step definitions for messaging functionality
 */

// Conversation page context
Given('I am on the conversation page', async function (this: CustomWorld) {
  // Assuming we're already in a conversation from previous steps
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);
  await this.page?.waitForLoadState('networkidle');
});

Given('there are {int} messages in the conversation', async function (this: CustomWorld, count: number) {
  // Set up initial message count
  for (let i = 0; i < count; i++) {
    this.addMessage(i % 2 === 0 ? 'assistant' : 'user', `Message ${i + 1}`);
  }
});

Given('there are many messages in the conversation', async function (this: CustomWorld) {
  for (let i = 0; i < 20; i++) {
    this.addMessage(i % 2 === 0 ? 'assistant' : 'user', `Message ${i + 1}`);
  }
});

Given('the input field is empty', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.clear();
});

Given('I have sent some messages', async function (this: CustomWorld) {
  // Send a test message
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Test message for navigation');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  // Wait for response
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

// Input actions
When('I type {string}', async function (this: CustomWorld, text: string) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill(text);
});

When('I click the send button', async function (this: CustomWorld) {
  await this.page?.getByRole('button', { name: /send message/i }).click();
});

When('I press Enter', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.press('Enter');
});

When('I press Shift+Enter', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.press('Shift+Enter');
});

When('I send a message {string}', async function (this: CustomWorld, message: string) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill(message);
  await this.page?.getByRole('button', { name: /send message/i }).click();
});

// Message verification
Then('my message should appear in the chat', async function (this: CustomWorld) {
  // User messages are right-aligned with blue background
  const userMessage = this.page?.locator('[class*="justify-end"]').locator('[class*="bg-\\[#1e3a8a\\]"]');
  await expect(userMessage!.last()).toBeVisible();
});

Then('I should see a streaming indicator', async function (this: CustomWorld) {
  // Check for "Thinking..." text or pulse animation
  const thinking = this.page?.getByText('Thinking...');
  const isVisible = await thinking?.isVisible().catch(() => false);

  if (!isVisible) {
    // Check for pulse animation element
    const pulse = this.page?.locator('[class*="animate-pulse"]');
    await expect(pulse!.first()).toBeVisible();
  }
});

Then('I should receive a response from the coach', async function (this: CustomWorld) {
  // Wait for streaming to complete
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );

  // Check for assistant message
  const assistantMessage = this.page?.locator('[class*="justify-start"]').locator('[class*="bg-white"]');
  await expect(assistantMessage!.last()).toBeVisible();
});

Then('the input should contain both lines', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  const value = await input?.inputValue();
  expect(value).toContain('First line');
  expect(value).toContain('Second line');
});

Then('the message should not be sent', async function (this: CustomWorld) {
  // Input should still have content
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  const value = await input?.inputValue();
  expect(value).toBeTruthy();
});

// Input state verification
Then('the input field should be disabled', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await expect(input!).toBeDisabled();
});

Then('the input field should be enabled', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await expect(input!).toBeEnabled();
});

Then('the send button should show a loading state', async function (this: CustomWorld) {
  const button = this.page?.getByRole('button', { name: /send message/i });
  const spinner = button?.locator('svg.animate-spin');
  await expect(spinner!).toBeVisible();
});

Then('the send button should be ready', async function (this: CustomWorld) {
  const button = this.page?.getByRole('button', { name: /send message/i });
  await expect(button!).toBeEnabled();
});

Then('the send button should be disabled', async function (this: CustomWorld) {
  const button = this.page?.getByRole('button', { name: /send message/i });
  await expect(button!).toBeDisabled();
});

Then('the input field should be empty', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await expect(input!).toHaveValue('');
});

// Response completion
When('the response is complete', async function (this: CustomWorld) {
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
  // Additional wait for UI to settle
  await this.page?.waitForTimeout(500);
});

// Message count
Then('the message count should show {string}', async function (this: CustomWorld, expectedCount: string) {
  const countElement = this.page?.locator('header').getByText(/\d+ messages/);
  await expect(countElement!).toHaveText(expectedCount);
});

// Timestamps
Then('I should see a relative timestamp like {string} or {string}', async function (this: CustomWorld, option1: string, option2: string) {
  // Check for any timestamp format
  const timestamps = this.page?.locator('[class*="text-xs"]').filter({ hasText: /ago|now|yesterday/i });
  const count = await timestamps?.count();
  expect(count).toBeGreaterThan(0);
});

When('I view a message in the chat', async function (this: CustomWorld) {
  // Messages should already be visible
  await this.page?.waitForLoadState('networkidle');
});

// Auto-scroll
When('I receive a new message from the coach', async function (this: CustomWorld) {
  // Send a message and wait for response
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Trigger new message');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the chat should scroll to show the new message', async function (this: CustomWorld) {
  // Verify the bottom of the chat is visible
  const bottomRef = this.page?.locator('[class*="space-y-6"]').last();
  await expect(bottomRef!).toBeInViewport();
});
