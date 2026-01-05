# Frontera Platform Test Framework Overview

## Test Architecture Summary

Frontera has a **7-phase comprehensive test framework** with 285+ automated tests covering unit, integration, component, E2E, and BDD testing. Here's when each type is written and run:

---

## 1. **Unit Tests** (158 tests)
**Framework:** Vitest + React Testing Library
**Location:** `tests/unit/`

### When to Write
- **Immediately** when creating new business logic functions
- When building stateless utility functions
- When implementing AI agent logic (framework state, prompts, context builders)
- When writing reusable helpers

### Examples
- Framework state management: [framework-state.test.ts](tests/unit/lib/agents/strategy-coach/framework-state.test.ts)
- Client context building: [client-context.test.ts](tests/unit/lib/agents/strategy-coach/client-context.test.ts)
- System prompt generation: [system-prompt.test.ts](tests/unit/lib/agents/strategy-coach/system-prompt.test.ts)

### When to Run
```bash
npm run test:unit        # During development
npm run test:watch       # Continuous feedback while coding
npm run test:ui          # Visual debugging
```

**CI/CD:** Runs automatically on every push and PR (see [ci.yml:38-55](.github/workflows/ci.yml#L38-L55))

### Coverage Requirements
- **90%** threshold for branches, functions, lines, and statements
- Enforced in [vitest.config.mts:27-36](vitest.config.mts#L27-L36)

---

## 2. **Component Tests** (86 tests)
**Framework:** Vitest + React Testing Library + jsdom
**Location:** `tests/unit/components/`

### When to Write
- **Immediately** after creating a new React component
- When adding interactive features (forms, buttons, modals)
- When implementing client-side state management
- Before integrating component into pages

### Examples
- Chat interface: [ChatInterface.test.tsx](tests/unit/components/strategy-coach/ChatInterface.test.tsx)
- Message input: [MessageInput.test.tsx](tests/unit/components/strategy-coach/MessageInput.test.tsx)
- Conversation list: [ConversationList.test.tsx](tests/unit/components/strategy-coach/ConversationList.test.tsx)

### What to Test
- User interactions (clicks, typing, keyboard shortcuts)
- Component rendering with different props
- State changes and side effects
- Accessibility (ARIA labels, keyboard navigation)

### When to Run
```bash
npm run test:unit        # Includes component tests
npm run test:watch       # Watch mode for rapid feedback
```

**CI/CD:** Runs automatically with unit tests in CI pipeline

---

## 3. **Integration Tests** (41 tests)
**Framework:** Vitest with API mocking
**Location:** `tests/integration/api/`

### When to Write
- **After** creating API route handlers
- When implementing authentication logic
- When adding database operations
- Before deploying API changes

### Examples
- Conversation CRUD: [route.test.ts](tests/integration/api/conversations/route.test.ts)
- Message streaming: [messages/route.test.ts](tests/integration/api/conversations/[id]/messages/route.test.ts)
- Conversation updates: [[id]/route.test.ts](tests/integration/api/conversations/[id]/route.test.ts)

### What to Test
- Request/response handling
- Authentication checks (401 for unauthorized)
- Database query logic
- Error handling and validation
- Streaming responses

### When to Run
```bash
npm run test:integration  # During API development
npm run test             # Runs all unit + integration
```

**CI/CD:** Separate job in CI after unit tests (see [ci.yml:57-74](.github/workflows/ci.yml#L57-L74))

---

## 4. **End-to-End Tests** (96 tests = 24 scenarios × 4 browsers)
**Framework:** Playwright
**Location:** `tests/e2e/specs/`
**Browsers:** Chromium, Firefox, WebKit, Mobile Chrome

### When to Write
- **After** feature is complete and deployed to staging
- When implementing critical user journeys
- Before major releases
- When adding new user-facing flows

### Page Object Pattern
Uses Page Object Model (POM) for maintainability:
- [BasePage.ts](tests/e2e/pages/BasePage.ts) - Common utilities
- [StrategyCoachPage.ts](tests/e2e/pages/StrategyCoachPage.ts) - List page
- [ConversationPage.ts](tests/e2e/pages/ConversationPage.ts) - Chat interface

### What to Test
- Complete user workflows (login → navigate → interact → verify)
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility features
- Keyboard navigation

### When to Run
```bash
# Local development (requires running app)
npm run test:e2e         # All browsers
npm run test:e2e:ui      # Interactive mode

# With credentials
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=password npm run test:e2e
```

**CI/CD:**
- Manual trigger via GitHub Actions
- Automatic on `release/**` branches
- Can target specific browsers
- See [e2e.yml](.github/workflows/e2e.yml)

---

## 5. **BDD Tests** (30 scenarios, 171 steps)
**Framework:** Cucumber + Gherkin + Playwright
**Location:** `tests/bdd/features/`

### When to Write
- **During** feature planning (Gherkin describes requirements)
- When stakeholders need readable acceptance criteria
- For documenting user stories
- When testing complex user journeys

### Feature Files Structure
```
tests/bdd/features/strategy-coach/
├── conversations.feature      # 6 scenarios
├── messaging.feature         # 9 scenarios
├── navigation.feature        # 6 scenarios
└── coaching-methodology.feature # 9 scenarios
```

### Example Scenario
```gherkin
@smoke
Scenario: Send a message to the coach
  When I type "What should I focus on for my product strategy?"
  And I click the send button
  Then my message should appear in the chat
  And I should see a streaming indicator
  And I should receive a response from the coach
```

### When to Run
```bash
# Local development
npm run test:bdd

# With specific tags
npm run test:bdd -- --tags "@smoke"
npm run test:bdd -- --tags "@messaging"
```

**CI/CD:**
- Manual trigger with tag filtering
- Automatic on `release/**` branches
- Uploads HTML reports
- See [bdd.yml](.github/workflows/bdd.yml)

---

## Development Workflow: When to Write Each Test

### 📝 **During Feature Planning**
1. **Write BDD scenarios** in Gherkin to document requirements
2. Review with stakeholders for acceptance criteria

### 🔨 **During Implementation**
1. **Write unit tests** for new functions/logic (TDD approach)
2. **Write component tests** for React components
3. Run `npm run test:watch` for continuous feedback

### 🔌 **After API Implementation**
1. **Write integration tests** for API routes
2. Test authentication, database queries, error handling
3. Verify with `npm run test:integration`

### ✅ **Before Feature Complete**
1. **Write E2E tests** for critical user paths
2. Test across browsers with `npm run test:e2e`
3. Implement BDD step definitions for Gherkin scenarios

### 🚀 **Before Deployment**
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage` (must meet 90% threshold)
3. Run E2E on staging environment
4. Run BDD tests for final acceptance

---

## CI/CD Pipeline Flow

### **Every Push/PR** ([ci.yml](.github/workflows/ci.yml))
```
Lint → Unit Tests → Integration Tests → Coverage Check → Build
```

### **Release Branches** (Automatic)
- **E2E Tests** run across all browsers ([e2e.yml](.github/workflows/e2e.yml))
- **BDD Tests** run full acceptance suite ([bdd.yml](.github/workflows/bdd.yml))

### **Manual Triggers**
- E2E with browser selection (chromium/firefox/webkit/all)
- BDD with tag filtering (@smoke, @messaging, etc.)

---

## Test Commands Quick Reference

```bash
# Unit + Integration
npm run test              # Run all Vitest tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:watch        # Watch mode for TDD
npm run test:ui           # Visual test UI
npm run test:coverage     # Generate coverage report

# E2E
npm run test:e2e          # All browsers
npm run test:e2e:ui       # Interactive mode

# BDD
npm run test:bdd          # All scenarios
npm run test:bdd -- --tags "@smoke"  # Specific tags
```

---

## Coverage & Quality Gates

**Enforced Thresholds:**
- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

**Current Status:**
- ✅ 285 passing tests (unit + integration + component)
- ✅ 96 E2E test cases (24 scenarios × 4 browsers)
- ✅ 30 BDD scenarios, 171 step definitions

---

## Best Practices

1. **Write tests alongside code** - Not as an afterthought
2. **Use test:watch** during development for rapid feedback
3. **Mock external dependencies** (Anthropic API, Supabase, Clerk)
4. **Follow the test pyramid** - More unit tests, fewer E2E tests
5. **Use BDD for stakeholder communication** - Readable acceptance criteria
6. **Run full suite before PR** - Ensure all tests pass
7. **Check coverage locally** - Don't wait for CI to catch gaps

---

## Test File Naming Conventions

### Unit Tests
```
tests/unit/lib/agents/strategy-coach/framework-state.test.ts
tests/unit/components/strategy-coach/ChatInterface.test.tsx
```
**Pattern:** Mirror source directory structure with `.test.ts` or `.test.tsx` suffix

### Integration Tests
```
tests/integration/api/conversations/route.test.ts
tests/integration/api/conversations/[id]/messages/route.test.ts
```
**Pattern:** Mirror API route structure with `.test.ts` suffix

### E2E Tests
```
tests/e2e/specs/strategy-coach.spec.ts
tests/e2e/pages/StrategyCoachPage.ts (Page Object)
tests/e2e/fixtures/auth.fixture.ts (Fixtures)
```
**Pattern:** Feature-based specs with Page Objects for reusability

### BDD Tests
```
tests/bdd/features/strategy-coach/messaging.feature
tests/bdd/step-definitions/messaging.steps.ts
tests/bdd/support/world.ts (Custom World)
tests/bdd/support/hooks.ts (Before/After)
```
**Pattern:** Gherkin features with corresponding step definitions

---

## Mock Utilities

All mocks are centralized in `tests/mocks/` for consistency:

```typescript
// Import shared mocks
import {
  mockClerkModule,
  mockSupabaseModule,
  mockAnthropicModule
} from 'tests/mocks';

// Import test data factories
import {
  createMockConversation,
  createMockClient,
  createMockFrameworkState
} from 'tests/mocks/factories';
```

### Available Mocks
- **anthropic.ts** - Anthropic SDK with streaming support
- **supabase.ts** - Supabase query builder
- **clerk.ts** - Clerk auth/user/org mocks
- **posthog.ts** - PostHog analytics
- **factories/** - Test data generators

---

## Writing Your First Test

### Unit Test Example
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'tests/helpers/test-utils';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/route';

const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

describe('GET /api/route', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should return 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null });
    const req = new NextRequest('http://localhost:3000/api/route');
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '../fixtures/auth.fixture';

test('should display page title', async ({ page }) => {
  await page.goto('/dashboard/strategy-coach');
  await expect(page.getByRole('heading', { name: 'Strategy Coach' })).toBeVisible();
});
```

### BDD Feature Example
```gherkin
Feature: User Authentication
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
```

---

## Troubleshooting

### Tests Failing Locally But Passing in CI
- Check Node.js version matches CI (20.x)
- Clear `node_modules` and reinstall: `npm ci`
- Check environment variables in `.env.local`

### E2E Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Ensure app is running: `npm run dev`
- Check `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` are set

### Coverage Below 90%
- Run `npm run test:coverage` to see gaps
- Check `coverage/index.html` for visual report
- Focus on uncovered branches and edge cases

### Mock Not Working
- Ensure mock is imported before the module being tested
- Use `vi.clearAllMocks()` in `beforeEach`
- Check mock implementation matches actual API

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

This framework ensures high code quality, prevents regressions, and provides confidence when shipping new features to production.
