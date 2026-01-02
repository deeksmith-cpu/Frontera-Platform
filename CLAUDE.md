# Frontera Platform

Frontera is a B2B SaaS platform that provides AI-powered strategic coaching for enterprise product transformation. It helps organizations bridge the gap between strategic vision and operational execution.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk (with organizations support)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Analytics**: PostHog
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── conversations/ # Strategy Coach chat API
│   │   ├── admin/        # Admin endpoints
│   │   ├── organizations/ # Org member management
│   │   └── webhooks/     # Clerk webhooks
│   ├── dashboard/        # Authenticated dashboard pages
│   │   ├── strategy-coach/ # AI coaching interface
│   │   ├── team/         # Team management
│   │   └── admin/        # Admin panel
│   ├── onboarding/       # Client onboarding wizard
│   ├── sign-in/          # Clerk sign-in
│   └── sign-up/          # Clerk sign-up
├── components/            # React components
│   └── strategy-coach/   # Chat interface components
├── lib/                   # Shared utilities
│   ├── agents/           # AI agent implementations
│   │   └── strategy-coach/ # Strategy Coach agent
│   └── analytics/        # PostHog tracking
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
│   └── database.ts       # Supabase schema types
└── middleware.ts          # Clerk auth middleware
```

## Key Features

### Strategy Coach (Primary Feature)
AI-powered coaching agent that guides users through product strategy transformation using the "Product Strategy Research Playbook" methodology:
- **Three Research Pillars**: Macro Market, Customer, Colleague
- **Strategic Flow Canvas**: Structured strategy development
- **Strategic Bets**: Hypothesis-driven planning format

Location: `src/lib/agents/strategy-coach/`

### Client Onboarding
Multi-step wizard for new client applications with admin approval workflow.

### Organization Management
Clerk-based multi-tenant architecture with team invitations and role management.

## Environment Variables

Required variables (see `.env.example`):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Anthropic API (Strategy Coach)
ANTHROPIC_API_KEY=

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Database Schema

Key tables in Supabase:

| Table | Purpose |
|-------|---------|
| `clients` | Organization profiles (linked to Clerk org) |
| `client_onboarding` | Onboarding applications |
| `conversations` | Strategy Coach chat sessions |
| `conversation_messages` | Individual chat messages |
| `strategic_outputs` | Generated strategy documents |

Types defined in `src/types/database.ts`.

## Architecture Decisions

### Authentication Flow
- Clerk handles all auth with organization support
- `clerk_org_id` is the foreign key linking to Supabase data
- Middleware protects `/dashboard/*` routes

### AI Agent Pattern
- Agents in `src/lib/agents/` are stateless functions
- Conversation state stored in `framework_state` JSONB column
- Streaming responses via ReadableStream API

### API Design
- All API routes under `src/app/api/`
- Use Supabase service role for server-side operations
- Clerk `auth()` for user context

## Coding Conventions

- Use TypeScript strict mode
- Prefer server components; use `"use client"` only when needed
- Tailwind for all styling (no CSS modules)
- API routes return JSON with `{ error: string }` on failure
- Use Clerk's `auth()` and `currentUser()` for authentication

## Important Patterns

### Supabase Admin Client
```typescript
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}
```

### Protected API Route
```typescript
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}
```

### Streaming AI Response
```typescript
const { stream, getUsage } = await streamMessage(context, state, history, message);
return new Response(stream, {
  headers: { "Content-Type": "text/plain; charset=utf-8" }
});
```

## Testing

### Test Framework Stack
- **Unit/Integration**: Vitest with React Testing Library
- **E2E**: Playwright (multi-browser)
- **BDD**: Cucumber with Gherkin syntax
- **Coverage Target**: 90%+

### Test Commands

```bash
npm run test           # Run all unit/integration tests
npm run test:unit      # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch     # Watch mode
npm run test:ui        # Vitest UI
npm run test:coverage  # Generate coverage report
npm run test:e2e       # Run Playwright E2E tests
npm run test:e2e:ui    # Playwright UI mode
npm run test:bdd       # Run Cucumber BDD tests
```

### Test Directory Structure

```
tests/
├── unit/                    # Unit tests (mirror src/ structure)
│   ├── lib/                 # Library unit tests
│   └── components/          # Component unit tests
├── integration/             # API route integration tests
│   └── api/                 # API endpoint tests
├── e2e/                     # Playwright E2E tests
│   ├── pages/               # Page Object Models
│   ├── fixtures/            # Test fixtures
│   └── specs/               # Test specifications
├── bdd/                     # Cucumber BDD tests
│   ├── features/            # Gherkin .feature files
│   │   └── strategy-coach/  # Feature-specific scenarios
│   ├── step-definitions/    # Step implementation
│   └── support/             # World class and hooks
├── mocks/                   # Shared mock utilities
│   ├── anthropic.ts         # Anthropic SDK mock
│   ├── supabase.ts          # Supabase mock
│   ├── clerk.ts             # Clerk mock
│   └── factories/           # Test data factories
└── helpers/                 # Test utilities
```

### Mock Utilities

Import mocks from `tests/mocks`:

```typescript
import { mockClerkModule, mockSupabaseModule, mockAnthropicModule } from 'tests/mocks';
import { createMockConversation, createMockClient } from 'tests/mocks/factories';
```

### Writing Tests

**Unit test pattern:**
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

**BDD feature file:**
```gherkin
Feature: Strategy Coach Conversation
  Scenario: Starting a new conversation
    Given I am logged in as an organization admin
    When I click "New Conversation"
    Then I should see a personalized welcome message
```

## Deployment

Deployed to Vercel with automatic deployments on push to `master`.

Environment variables must be configured in Vercel project settings.

---

## Test Framework Implementation Status

> **Last Updated**: January 2, 2026
> **Status**: Framework operational on Windows ARM64

### Phase 1: Foundation (COMPLETED)

| File | Status |
|------|--------|
| `vitest.config.mts` | Created - ESM config with 90% coverage thresholds |
| `playwright.config.ts` | Created - Multi-browser E2E config |
| `cucumber.mjs` | Created - BDD/Gherkin configuration |
| `tests/mocks/anthropic.ts` | Created - Anthropic SDK mock with streaming |
| `tests/mocks/supabase.ts` | Created - Supabase query builder mock |
| `tests/mocks/clerk.ts` | Created - Clerk auth/user/org mocks |
| `tests/mocks/posthog.ts` | Created - PostHog analytics mock |
| `tests/mocks/factories/conversation.factory.ts` | Created - Test data factories |
| `tests/mocks/factories/client.factory.ts` | Created - Client test data |
| `tests/mocks/index.ts` | Created - Mock exports |
| `tests/helpers/setup.ts` | Created - Vitest setup with jest-dom |
| `tests/helpers/test-utils.tsx` | Created - React Testing Library wrapper |
| `package.json` | Updated - Test scripts and ARM64 native binary support |

### Phase 2: Unit Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/unit/lib/agents/strategy-coach/framework-state.test.ts` | Passing - 60 tests |
| `tests/unit/lib/agents/strategy-coach/client-context.test.ts` | Passing - 30 tests |
| `tests/unit/lib/agents/strategy-coach/system-prompt.test.ts` | Passing - 49 tests |
| `tests/unit/lib/agents/strategy-coach/index.test.ts` | Passing - 19 tests |

**Total: 158 passing unit tests**

### Phase 3: Integration Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/integration/api/conversations/route.test.ts` | Passing - 15 tests (GET/POST) |
| `tests/integration/api/conversations/[id]/route.test.ts` | Passing - 15 tests (GET/PATCH) |
| `tests/integration/api/conversations/[id]/messages/route.test.ts` | Passing - 11 tests (streaming) |

**Total: 41 passing integration tests**

### Phase 4: Component Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/unit/components/strategy-coach/MessageInput.test.tsx` | Passing - 20 tests |
| `tests/unit/components/strategy-coach/MessageList.test.tsx` | Passing - 25 tests |
| `tests/unit/components/strategy-coach/ConversationList.test.tsx` | Passing - 20 tests |
| `tests/unit/components/strategy-coach/ChatInterface.test.tsx` | Passing - 21 tests |

**Total: 86 passing component tests**

### Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **Total**: 285 passing tests

### Phase 5: E2E Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/e2e/pages/BasePage.ts` | Created - Base page object with common utilities |
| `tests/e2e/pages/StrategyCoachPage.ts` | Created - Strategy Coach list page POM |
| `tests/e2e/pages/ConversationPage.ts` | Created - Conversation page POM |
| `tests/e2e/fixtures/auth.fixture.ts` | Created - Authentication fixtures |
| `tests/e2e/specs/strategy-coach.spec.ts` | Created - 24 test cases |

**Total: 96 E2E tests (24 tests x 4 browsers: Chromium, Firefox, WebKit, Mobile Chrome)**

**Test Categories:**
- Page Layout (4 tests)
- Empty State (1 test)
- Conversation List (2 tests)
- Navigation (4 tests)
- Opening Message (1 test)
- Message Input (3 tests)
- Message Display (3 tests)
- Keyboard Shortcuts (2 tests)
- Accessibility (2 tests)

**Running E2E Tests:**
```bash
# Requires app running and E2E credentials
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=password npm run test:e2e
```

### Phase 6: BDD Tests (COMPLETED)

| File | Status |
|------|--------|
| `cucumber.mjs` | Updated - TSX loader configuration |
| `tests/bdd/support/world.ts` | Created - Custom World class with Playwright |
| `tests/bdd/support/hooks.ts` | Created - Before/After hooks with screenshots |
| `tests/bdd/step-definitions/common.steps.ts` | Created - Auth and navigation steps |
| `tests/bdd/step-definitions/conversations.steps.ts` | Created - Conversation management steps |
| `tests/bdd/step-definitions/messaging.steps.ts` | Created - Messaging functionality steps |
| `tests/bdd/step-definitions/methodology.steps.ts` | Created - Coaching methodology steps |

**Feature Files:**
| File | Scenarios |
|------|-----------|
| `conversations.feature` | 6 scenarios |
| `messaging.feature` | 9 scenarios |
| `navigation.feature` | 6 scenarios |
| `coaching-methodology.feature` | 9 scenarios |

**Total: 30 scenarios, 171 steps**

**Running BDD Tests:**
```bash
# Requires app running and E2E credentials
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=password npm run test:bdd
```

### Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **E2E Tests**: 96 defined (requires running app)
- **BDD Tests**: 30 scenarios, 171 steps (requires running app)
- **Total Automated**: 285 passing + 96 E2E + 30 BDD scenarios

### Pending Phases

- **Phase 7**: CI/CD pipeline

### Next Steps

1. Set up CI/CD pipeline for test automation
2. Configure GitHub Actions for test execution
