import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Common step definitions used across features
 */

// Authentication steps
Given('I am logged in as an organization member', async function (this: CustomWorld) {
  // Set up authenticated user state
  this.setUser('user_123', 'org_456');

  // In a real implementation, this would:
  // 1. Use Clerk's testing tokens
  // 2. Set cookies/session for auth
  // For now, we assume the app handles auth or is in test mode

  const testEmail = process.env.E2E_TEST_EMAIL;
  const testPassword = process.env.E2E_TEST_PASSWORD;

  if (testEmail && testPassword) {
    await this.goto('/sign-in');
    await this.page?.getByLabel(/email/i).fill(testEmail);
    await this.page?.getByLabel(/password/i).fill(testPassword);
    await this.page?.getByRole('button', { name: /sign in/i }).click();
    await this.page?.waitForURL('/dashboard/**');
  }
});

Given('I am not logged in', async function (this: CustomWorld) {
  this.currentUser = null;
  // Clear any auth cookies/storage
  await this.context?.clearCookies();
});

Given('I am logged in without an organization', async function (this: CustomWorld) {
  this.setUser('user_123', '');
});

// Navigation steps
Given('I am on the dashboard', async function (this: CustomWorld) {
  await this.goto('/dashboard');
});

Given('I am on the Strategy Coach page', async function (this: CustomWorld) {
  await this.goto('/dashboard/strategy-coach');
  await this.page?.waitForLoadState('networkidle');
});

Then('I should be on the Strategy Coach page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/dashboard\/strategy-coach$/);
});

Then('I should be on the dashboard page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/dashboard$/);
});

Then('I should be redirected to the sign-in page', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/sign-in/);
});

Then('I should be redirected to the dashboard', async function (this: CustomWorld) {
  await expect(this.page!).toHaveURL(/\/dashboard$/);
});

// Page element verification
Then('I should see the page title {string}', async function (this: CustomWorld, title: string) {
  const heading = this.page?.getByRole('heading', { name: title });
  await expect(heading!).toBeVisible();
});

Then('I should see the {string} button', async function (this: CustomWorld, buttonText: string) {
  const button = this.page?.getByRole('button', { name: new RegExp(buttonText, 'i') });
  await expect(button!).toBeVisible();
});

// Breadcrumb navigation
Then('I should see the breadcrumb showing {string}', async function (this: CustomWorld, path: string) {
  const parts = path.split(' > ');
  for (const part of parts) {
    await expect(this.page!.getByText(part)).toBeVisible();
  }
});
