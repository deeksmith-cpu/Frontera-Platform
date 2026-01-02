import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

/**
 * Global setup before all tests
 */
BeforeAll(async function () {
  console.log('Starting BDD test suite...');
});

/**
 * Global teardown after all tests
 */
AfterAll(async function () {
  console.log('BDD test suite completed.');
});

/**
 * Setup before each scenario
 */
Before(async function (this: CustomWorld) {
  await this.init();
});

/**
 * Cleanup after each scenario
 */
After(async function (this: CustomWorld, scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();
    await this.screenshot(`failed-${scenarioName}-${Date.now()}`);
  }

  await this.cleanup();
});

/**
 * Tag-based hooks
 */

// Setup for smoke tests
Before({ tags: '@smoke' }, async function (this: CustomWorld) {
  console.log('Running smoke test...');
});

// Setup for authentication tests
Before({ tags: '@authentication' }, async function (this: CustomWorld) {
  // Clear any existing auth state
  this.currentUser = null;
});

// Setup for methodology tests
Before({ tags: '@methodology' }, async function (this: CustomWorld) {
  // Initialize with a fresh conversation state
  this.messages = [];
  this.currentConversation = null;
});
