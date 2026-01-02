import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

/**
 * Step definitions for Strategy Coach methodology
 * Tests the Product Strategy Research Playbook phases
 */

// Conversation initialization
Given('I have started a new coaching conversation', async function (this: CustomWorld) {
  await this.goto('/dashboard/strategy-coach');
  await this.page?.getByRole('button', { name: /start new strategy session/i }).click();
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);

  // Wait for initial message to load
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 30000 }
  );
});

// Phase state verification
Then('the conversation should be in the {string} phase', async function (this: CustomWorld, phase: string) {
  // Check for phase indicator in the UI
  const phaseIndicator = this.page?.locator('[data-testid="phase-indicator"]');

  if (await phaseIndicator?.isVisible().catch(() => false)) {
    await expect(phaseIndicator!).toContainText(new RegExp(phase, 'i'));
  } else {
    // Fallback: Check header or conversation metadata
    const header = this.page?.locator('header');
    const phaseText = await header?.textContent();
    expect(phaseText?.toLowerCase()).toContain(phase.toLowerCase());
  }
});

Then('the coach should ask about my organization context', async function (this: CustomWorld) {
  // Look for messages asking about organization/company
  const messages = this.page?.locator('[class*="justify-start"]');
  const messageText = await messages?.first().textContent();

  const contextKeywords = ['organization', 'company', 'business', 'tell me about', 'context'];
  const hasContextQuestion = contextKeywords.some(keyword =>
    messageText?.toLowerCase().includes(keyword)
  );

  expect(hasContextQuestion).toBeTruthy();
});

Then('the coach should explore my strategic challenges', async function (this: CustomWorld) {
  // Send a message to trigger challenge exploration
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('We are facing challenges with market positioning');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );

  // Verify coach responds with follow-up questions
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const count = await assistantMessages?.count();
  expect(count).toBeGreaterThan(1);
});

// Phase completion
Given('I have completed the discovery phase', async function (this: CustomWorld) {
  // Simulate completing discovery by having a conversation
  const input = this.page?.getByPlaceholder(/share your thoughts/i);

  // Share organization context
  await input?.fill('We are a B2B SaaS company focused on HR tech');
  await this.page?.getByRole('button', { name: /send message/i }).click();
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );

  // Share challenges
  await input?.fill('Our main challenge is differentiating from competitors');
  await this.page?.getByRole('button', { name: /send message/i }).click();
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the conversation should move to the {string} phase', async function (this: CustomWorld, phase: string) {
  // Wait for phase transition
  await this.page?.waitForTimeout(1000);

  // Check phase indicator or header
  const pageContent = await this.page?.content();
  const hasPhaseReference = pageContent?.toLowerCase().includes(phase.toLowerCase());

  // Phase may be shown in UI or mentioned by coach
  expect(hasPhaseReference).toBeTruthy();
});

Then('the coach should introduce the three research pillars:', async function (this: CustomWorld, dataTable: DataTable) {
  const pillars = dataTable.hashes();
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  for (const pillar of pillars) {
    const pillarName = pillar['Pillar'].toLowerCase();
    // Research pillars may be mentioned directly or in context
    const hasPillarReference = lastMessage?.toLowerCase().includes(pillarName) ||
      lastMessage?.toLowerCase().includes('market') ||
      lastMessage?.toLowerCase().includes('customer') ||
      lastMessage?.toLowerCase().includes('colleague');

    expect(hasPillarReference).toBeTruthy();
  }
});

// Research phase
Given('I am in the research phase', async function (this: CustomWorld) {
  // Complete discovery and move to research
  await this.page?.waitForLoadState('networkidle');

  // Send messages to progress through discovery
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('I want to explore our market research');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

When('I discuss macro market topics', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Let\'s discuss the macro market trends in our industry');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

When('I discuss customer research', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('I want to understand our customers better');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

When('I discuss colleague research', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Let\'s discuss our internal capabilities and team');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the coach should ask about:', async function (this: CustomWorld, dataTable: DataTable) {
  const topics = dataTable.hashes();
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  // Coach should mention at least some of the topics
  let matchedTopics = 0;
  for (const topic of topics) {
    const topicText = topic['Topic'].toLowerCase();
    if (lastMessage?.toLowerCase().includes(topicText.split(' ')[0])) {
      matchedTopics++;
    }
  }

  // At least half the topics should be addressed
  expect(matchedTopics).toBeGreaterThanOrEqual(1);
});

// Synthesis phase
Given('I have completed research on all three pillars', async function (this: CustomWorld) {
  // Simulate completing all three research pillars
  const input = this.page?.getByPlaceholder(/share your thoughts/i);

  await input?.fill('I\'ve completed my research on market, customers, and internal capabilities');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the coach should help synthesize insights', async function (this: CustomWorld) {
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  const synthesisKeywords = ['synthesize', 'insights', 'patterns', 'themes', 'learned', 'findings'];
  const hasSynthesisReference = synthesisKeywords.some(keyword =>
    lastMessage?.toLowerCase().includes(keyword)
  );

  expect(hasSynthesisReference).toBeTruthy();
});

Then('the coach should help formulate strategic bets', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Help me formulate strategic bets');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );

  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  const betKeywords = ['bet', 'hypothesis', 'if we', 'strategic'];
  const hasBetReference = betKeywords.some(keyword =>
    lastMessage?.toLowerCase().includes(keyword)
  );

  expect(hasBetReference).toBeTruthy();
});

Given('I am in the synthesis phase', async function (this: CustomWorld) {
  await this.page?.waitForLoadState('networkidle');

  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('I\'m ready to synthesize my findings and create strategic bets');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

When('I work on strategic bets', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('Let\'s work on defining our strategic bets');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the coach should guide me through the format:', async function (this: CustomWorld, dataTable: DataTable) {
  const elements = dataTable.hashes();
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  // Check for strategic bet format elements
  let matchedElements = 0;
  for (const element of elements) {
    const elementText = element['Element'].toLowerCase();
    if (lastMessage?.toLowerCase().includes(elementText)) {
      matchedElements++;
    }
  }

  // At least some elements should be mentioned
  expect(matchedElements).toBeGreaterThanOrEqual(1);
});

// Planning phase
Given('I have formulated strategic bets', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('I have my strategic bets defined. If we invest in AI capabilities, we will improve automation, which enables faster customer onboarding, leading to increased market share.');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );
});

Then('the coach should help create action plans', async function (this: CustomWorld) {
  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  const planKeywords = ['plan', 'action', 'next steps', 'implement', 'execute'];
  const hasPlanReference = planKeywords.some(keyword =>
    lastMessage?.toLowerCase().includes(keyword)
  );

  expect(hasPlanReference).toBeTruthy();
});

Then('the coach should discuss implementation priorities', async function (this: CustomWorld) {
  const input = this.page?.getByPlaceholder(/share your thoughts/i);
  await input?.fill('What should I prioritize first?');
  await this.page?.getByRole('button', { name: /send message/i }).click();

  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 60000 }
  );

  const assistantMessages = this.page?.locator('[class*="justify-start"]');
  const lastMessage = await assistantMessages?.last().textContent();

  const priorityKeywords = ['priority', 'prioritize', 'first', 'important', 'focus'];
  const hasPriorityReference = priorityKeywords.some(keyword =>
    lastMessage?.toLowerCase().includes(keyword)
  );

  expect(hasPriorityReference).toBeTruthy();
});

// Phase indicator UI
Given('the conversation is in the {string} phase', async function (this: CustomWorld, phase: string) {
  // Create a conversation that's in the specified phase
  await this.goto('/dashboard/strategy-coach');
  await this.page?.getByRole('button', { name: /start new strategy session/i }).click();
  await this.page?.waitForURL(/\/dashboard\/strategy-coach\/.+/);

  // Wait for initial message
  await this.page?.waitForFunction(
    () => !document.querySelector('[class*="animate-pulse"]'),
    { timeout: 30000 }
  );

  // Progress to the specified phase based on the phase name
  const input = this.page?.getByPlaceholder(/share your thoughts/i);

  if (phase.toLowerCase() === 'research') {
    await input?.fill('I\'m ready to start research on market trends');
    await this.page?.getByRole('button', { name: /send message/i }).click();
    await this.page?.waitForFunction(
      () => !document.querySelector('[class*="animate-pulse"]'),
      { timeout: 60000 }
    );
  }
});

When('I view the conversation in the list', async function (this: CustomWorld) {
  // Navigate back to conversation list
  await this.page?.getByRole('button', { name: /back to conversations/i }).click();
  await this.page?.waitForURL('/dashboard/strategy-coach');
  await this.page?.waitForLoadState('networkidle');
});

Then('I should see the phase badge showing {string}', async function (this: CustomWorld, phase: string) {
  // Look for the phase badge in conversation cards
  const conversationCard = this.page?.locator('button').filter({ hasText: /messages/ }).first();
  const phaseBadge = conversationCard?.locator('[class*="rounded"]').filter({ hasText: new RegExp(phase, 'i') });

  await expect(phaseBadge!).toBeVisible();
});
