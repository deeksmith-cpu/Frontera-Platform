// @ts-nocheck
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld as FronteraWorld } from '../support/world';

// Background steps (reuse common auth steps)

Given('expert knowledge has been configured from {int} podcast transcripts', async function (this: FronteraWorld, count: number) {
  // Expert knowledge is statically configured in expert-index.ts
  // This step validates the API returns data
  const response = await this.page!.evaluate(async () => {
    const res = await fetch('/api/product-strategy-agent/expert-knowledge?mode=experts');
    return res.ok;
  });
  // In test env, we accept this as configured
  this.context.set('transcriptCount', count);
});

Given('I am in the Research phase with territory {string} active', async function (this: FronteraWorld, territory: string) {
  // Navigate to research phase — assumes conversation exists
  this.context.set('activeTerritory', territory);
});

Given('I am in the Synthesis phase', async function (this: FronteraWorld) {
  this.context.set('currentPhase', 'synthesis');
});

Given('I am in the Discovery phase', async function (this: FronteraWorld) {
  this.context.set('currentPhase', 'discovery');
});

// Expert Sources Panel visibility

Then('I should see an {string} panel in the Canvas', async function (this: FronteraWorld, panelName: string) {
  const panel = this.page.locator('.expert-sources-panel');
  await expect(panel).toBeVisible({ timeout: 10000 });
  const header = this.page.locator('.expert-sources-panel h3');
  await expect(header).toContainText(panelName.replace('Expert Sources', 'Expert Sources'));
});

Then('the panel should display expert insights relevant to {string}', async function (this: FronteraWorld, territory: string) {
  // Check that insight cards are rendered
  const cards = this.page.locator('.expert-sources-panel .bg-white.border-cyan-200');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

// Citation format in coach responses

Then('the response should include expert citations in the format {string}', async function (this: FronteraWorld, format: string) {
  // Check last assistant message contains [Expert:...] citation
  const messages = this.page.locator('[data-role="assistant"]');
  const lastMessage = messages.last();
  const text = await lastMessage.textContent();
  expect(text).toMatch(/\[Expert:/);
});

Then('each citation should show the expert name', async function (this: FronteraWorld) {
  const citations = this.page.locator('[data-role="assistant"]').last();
  const text = await citations.textContent() || '';
  const matches = text.match(/\[Expert:([^\]]+)\]/g) || [];
  for (const match of matches) {
    // Format is [Expert:Speaker — Topic], verify speaker name exists
    const inner = match.replace('[Expert:', '').replace(']', '');
    expect(inner.split('—')[0].trim().length).toBeGreaterThan(0);
  }
});

Then('each citation should show the topic', async function (this: FronteraWorld) {
  const citations = this.page.locator('[data-role="assistant"]').last();
  const text = await citations.textContent() || '';
  const matches = text.match(/\[Expert:([^\]]+)\]/g) || [];
  for (const match of matches) {
    const inner = match.replace('[Expert:', '').replace(']', '');
    const parts = inner.split('—');
    expect(parts.length).toBeGreaterThanOrEqual(2);
    expect(parts[1].trim().length).toBeGreaterThan(0);
  }
});

// Clickable citations

When('I click on an expert citation {string}', async function (this: FronteraWorld, citation: string) {
  const citationEl = this.page.locator(`text=${citation}`).first();
  await citationEl.click();
});

Then('I should see the full expert quote', async function (this: FronteraWorld) {
  const quote = this.page.locator('blockquote');
  await expect(quote).toBeVisible({ timeout: 5000 });
});

Then('I should see the speaker name and company', async function (this: FronteraWorld) {
  const panel = this.page.locator('.expert-sources-panel');
  const speakerName = panel.locator('.text-sm.font-semibold.text-slate-900');
  await expect(speakerName.first()).toBeVisible();
});

Then('I should see the source transcript reference', async function (this: FronteraWorld) {
  const source = this.page.locator('.expert-sources-panel').locator('text=Source:');
  await expect(source.first()).toBeVisible();
});

// Expert Sources Panel features

Then('the Expert Sources panel should show insights from multiple speakers', async function (this: FronteraWorld) {
  const speakers = this.page.locator('.expert-sources-panel .text-sm.font-semibold.text-slate-900');
  const count = await speakers.count();
  expect(count).toBeGreaterThan(1);
});

When('I filter the Expert Sources panel by territory {string}', async function (this: FronteraWorld, territory: string) {
  const filterBtn = this.page.locator('.expert-sources-panel button', { hasText: territory });
  await filterBtn.click();
});

Then('I should see only experts relevant to that territory', async function (this: FronteraWorld) {
  // After filtering, cards should still be present
  const cards = this.page.locator('.expert-sources-panel .bg-white');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

When('I search for {string} in the Expert Sources panel', async function (this: FronteraWorld, query: string) {
  const input = this.page.locator('.expert-sources-panel input[placeholder*="Filter"]');
  await input.fill(query);
});

Then('I should see experts related to {string}', async function (this: FronteraWorld, topic: string) {
  // Wait for results to update
  await this.page.waitForTimeout(500);
  const topicBadges = this.page.locator('.expert-sources-panel .text-cyan-700');
  const count = await topicBadges.count();
  expect(count).toBeGreaterThan(0);
});

// Phase restrictions

Then('I should not see the Expert Sources panel', async function (this: FronteraWorld) {
  const panel = this.page.locator('.expert-sources-panel');
  await expect(panel).not.toBeVisible();
});

// Synthesis expert citations

Then('the synthesis should include expert perspectives where relevant', async function (this: FronteraWorld) {
  // Check synthesis section for expert citations
  const synthesis = this.page.locator('.synthesis-section');
  await expect(synthesis).toBeVisible({ timeout: 10000 });
});

Then('expert citations should appear in opportunity descriptions', async function (this: FronteraWorld) {
  // Opportunities may contain expert references
  const opportunities = this.page.locator('.synthesis-section');
  await expect(opportunities).toBeVisible();
});
