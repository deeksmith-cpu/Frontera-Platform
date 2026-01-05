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

### Phase 7: CI/CD Pipeline (COMPLETED)

| File | Description |
|------|-------------|
| `.github/workflows/ci.yml` | Main CI workflow - lint, unit tests, integration tests, coverage, build |
| `.github/workflows/e2e.yml` | E2E tests - manual trigger or release branches, multi-browser support |
| `.github/workflows/bdd.yml` | BDD tests - manual trigger or release branches, tag filtering |

**CI Workflow (`ci.yml`):**
- Triggers on push to `master` and PRs
- Jobs: Lint → Unit Tests → Integration Tests → Coverage → Build
- Uses Node.js 20 with npm caching
- Uploads coverage report as artifact

**E2E Workflow (`e2e.yml`):**
- Manual trigger with browser selection (chromium/firefox/webkit/all)
- Auto-runs on `release/**` branches
- Runs on PRs with `e2e` label
- Uploads Playwright reports and failure artifacts

**BDD Workflow (`bdd.yml`):**
- Manual trigger with optional Cucumber tags
- Auto-runs on `release/**` branches
- Runs on PRs with `bdd` label
- Starts app, waits for ready, runs tests
- Uploads Cucumber reports and failure screenshots

**Required GitHub Secrets:**
```
# Vercel Integration (pulls all env vars automatically)
VERCEL_TOKEN          # From https://vercel.com/account/tokens
VERCEL_ORG_ID         # From .vercel/project.json or Vercel dashboard
VERCEL_PROJECT_ID     # From .vercel/project.json or Vercel dashboard

# E2E Testing (test-specific, not in Vercel)
E2E_TEST_EMAIL
E2E_TEST_PASSWORD
```

**Local Development:**
```bash
# Pull env vars from Vercel to local
vercel env pull .env.local
```

### Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **E2E Tests**: 96 defined (requires running app)
- **BDD Tests**: 30 scenarios, 171 steps (requires running app)
- **Total Automated**: 285 passing + 96 E2E + 30 BDD scenarios

### Test Framework Complete

All 7 phases of the test framework implementation are now complete:

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation (configs, mocks, helpers) | Complete |
| Phase 2 | Unit Tests (158 tests) | Complete |
| Phase 3 | Integration Tests (41 tests) | Complete |
| Phase 4 | Component Tests (86 tests) | Complete |
| Phase 5 | E2E Tests (96 tests) | Complete |
| Phase 6 | BDD Tests (30 scenarios) | Complete |
| Phase 7 | CI/CD Pipeline (3 workflows) | Complete |
### Phase 8: AI Evaluations (FOUNDATION COMPLETED)

> **Implementation Date**: January 5, 2026
> **Status**: Phase 8A Complete - Quality Metrics Operational

#### Overview

Phase 8 introduces **AI-specific evaluation tests** that measure the quality, accuracy, and effectiveness of the Strategy Coach's LLM outputs. Unlike traditional software tests (Phases 1-7) that validate code behavior, AI evals answer:

- Is the coaching advice **relevant** to the user's question?
- Does the response contain **hallucinated** (fabricated) information?
- Is the **tone** confident and professional without being patronizing?
- Does the response provide **complete, actionable** guidance?

#### Phase 8A: Foundation - Quality Metrics (COMPLETED)

| Component | Status |
|-----------|--------|
| **Configuration** |  |
| `tests/evals/config/metrics.config.ts` | Created - Quality thresholds and eval settings |
| `tests/evals/config/baselines.json` | Created - Baseline scores for regression detection |
| **Test Fixtures** |  |
| `tests/evals/fixtures/test-conversations.ts` | Created - 50 test cases (discovery, research, synthesis, planning) |
| `tests/evals/fixtures/client-contexts.ts` | Created - Industry/size/focus variations |
| `tests/evals/fixtures/adversarial-inputs.ts` | Created - 22 safety test cases |
| **Evaluation Helpers** |  |
| `tests/evals/helpers/eval-utils.ts` | Created - Execute Strategy Coach and capture responses |
| `tests/evals/helpers/llm-judge.ts` | Created - LLM-as-a-judge evaluation engine |
| `tests/evals/helpers/code-grader.ts` | Created - Code-based validation functions |
| **Quality Evaluation Tests** |  |
| `tests/evals/strategy-coach/quality/relevance.eval.ts` | Created - 32 relevance tests |
| `tests/evals/strategy-coach/quality/hallucination.eval.ts` | Created - 10 hallucination detection tests |
| `tests/evals/strategy-coach/quality/tone.eval.ts` | Created - 28 tone adherence tests |
| `tests/evals/strategy-coach/quality/completeness.eval.ts` | Created - 20 completeness tests |
| **Documentation** |  |
| `tests/evals/README.md` | Created - Eval test documentation |
| `AI_EVALS_GUIDE.md` | Created - Comprehensive usage guide |
| `AI_EVALS_IMPLEMENTATION_PLAN.md` | Created - Full Phase 8 roadmap |

**Total Phase 8A Tests: 90 evaluation test cases**

#### Evaluation Metrics (Phase 8A)

| Metric | Threshold | Type | Test Count |
|--------|-----------|------|------------|
| **Relevance** | ≥ 0.80 | LLM-judge | 32 tests |
| **Hallucination** | ≤ 0.20 | LLM-judge + Code | 10 tests |
| **Tone Adherence** | ≥ 0.85 | LLM-judge + Code | 28 tests |
| **Completeness** | ≥ 0.75 | LLM-judge + Code | 20 tests |

#### Evaluation Approach

**Hybrid Methodology:**

1. **Code-Based Grading** (Fast, Deterministic, Free)
   - Keyword presence validation
   - Response length checks
   - Format compliance
   - Hallucination detection (fabricated pillar counts, etc.)
   - Patronizing language detection

2. **LLM-as-a-Judge** (Nuanced, Semantic, Accurate)
   - Uses Claude Sonnet 4 to evaluate responses
   - Chain-of-thought reasoning
   - Scores on 0-1 scale with confidence levels
   - ~$0.01-0.02 per test case

#### Running AI Evaluations

```bash
# Run all AI evaluation tests
npm run test:evals

# Run specific category
npm run test:evals:quality

# Watch mode for prompt engineering
npm run test:evals:watch

# Run specific test file
npx vitest run tests/evals/strategy-coach/quality/relevance.eval.ts
```

#### Test Fixtures

**Test Conversation Scenarios (50 cases):**
- Discovery Phase: 15 test cases
- Research Phase: 20 test cases
- Synthesis Phase: 10 test cases
- Planning Phase: 5 test cases

**Client Context Variations (12 variations):**
- Technology: Startup, Growth, Enterprise
- Healthcare: Startup, Mid, Enterprise
- Financial Services: Startup, Mid, Enterprise
- Retail: Startup, Mid, Enterprise

**Adversarial Inputs (22 cases):**
- Prompt Injection: 5 tests
- Off-Topic: 5 tests
- PII Leakage: 3 tests
- Methodology Challenges: 3 tests
- Inappropriate Requests: 3 tests
- Edge Cases: 3 tests

#### Example Eval Test

```typescript
// tests/evals/strategy-coach/quality/relevance.eval.ts
test('should provide relevant response to market expansion question', async () => {
  // 1. Execute Strategy Coach
  const { content } = await executeStrategyCoach(
    'What should I focus on for my product strategy?',
    {
      industry: 'Technology',
      strategic_focus: 'Market expansion',
      pain_points: ['Unclear competitive positioning'],
    }
  );

  // 2. LLM-as-a-judge evaluation
  const judgment = await judgeResponse(
    'What should I focus on for my product strategy?',
    content,
    context,
    EVALUATION_CRITERIA.relevance
  );

  // 3. Assert against threshold
  expect(judgment.score).toBeGreaterThanOrEqual(0.80);

  // Output:
  // {
  //   score: 0.87,
  //   reasoning: "Response directly addresses market expansion focus...",
  //   confidence: "high"
  // }
});
```

#### Use Cases

**Prompt Engineering Workflow:**
1. Run baseline eval before prompt changes
2. Modify system prompt
3. Run evals in watch mode
4. Iterate until scores improve or maintain
5. Commit when quality is validated

**Quality Assurance:**
- Automated regression detection (scores can't drop >10%)
- Catch hallucinations before production
- Ensure tone consistency
- Validate completeness of responses

**Production Monitoring (Future - Phase 8D):**
- Sample 5% of live conversations
- Real-time quality metrics
- Alerts on degradation
- Trend analysis

#### Future Phases

| Phase | Description | Test Count | Status |
|-------|-------------|------------|--------|
| Phase 8A | Foundation (quality metrics) | 90 tests | ✅ Complete |
| Phase 8B | Context-aware evaluations | 85 tests | 📋 Planned |
| Phase 8C | Conversational quality | 30 tests | 📋 Planned |
| Phase 8D | Safety & production | 45 tests | 📋 Planned |
| **Total** | **Full AI Eval Suite** | **250 tests** | **36% Complete** |

**Phase 8B - Context-Aware Evals** (Planned):
- Client context utilization (30 tests)
- Industry-specific guidance accuracy (40 tests)
- Framework state progression validation (15 tests)

**Phase 8C - Conversational Quality** (Planned):
- Multi-turn conversation coherence (15 tests)
- Knowledge retention across turns (10 tests)
- End-to-end conversation completeness (5 tests)

**Phase 8D - Safety & Production** (Planned):
- Prompt injection resistance (15 tests)
- Bias detection (20 tests)
- CI/CD integration
- Production monitoring setup (5% conversation sampling)

#### Documentation

- **[tests/evals/README.md](tests/evals/README.md)** - Quick start and overview
- **[AI_EVALS_GUIDE.md](AI_EVALS_GUIDE.md)** - Comprehensive usage guide
- **[AI_EVALS_IMPLEMENTATION_PLAN.md](AI_EVALS_IMPLEMENTATION_PLAN.md)** - Full Phase 8 roadmap (60+ pages)

#### Cost Considerations

**Development:**
- Per eval run (90 tests): ~$1-2
- Monthly (5 runs/week): ~$40-80

**Production Monitoring (Phase 8D):**
- 5% sampling at 1000 conversations/day: ~$150/month
- Total estimated: ~$200-300/month for full eval framework

#### Integration with Existing Tests

```
Frontera Test Suite (Total: 375+ tests)

Traditional Software Tests:
├── Unit Tests (158)          - Code logic validation
├── Component Tests (86)      - React component validation
├── Integration Tests (41)    - API contract validation
├── E2E Tests (96)            - User workflow validation
└── BDD Tests (30 scenarios)  - Acceptance criteria validation

AI-Specific Tests:
└── Eval Tests (90)           - AI output quality validation ⭐ NEW
    ├── Relevance (32)
    ├── Hallucination (10)
    ├── Tone (28)
    └── Completeness (20)
```

### Updated Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **E2E Tests**: 96 defined (requires running app)
- **BDD Tests**: 30 scenarios, 171 steps (requires running app)
- **AI Evals**: 90 evaluation tests (requires ANTHROPIC_API_KEY)
- **Total Automated**: 375+ tests across all phases

### Test Framework Status

**8 phases of comprehensive testing:**

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation (configs, mocks, helpers) | ✅ Complete |
| Phase 2 | Unit Tests (158 tests) | ✅ Complete |
| Phase 3 | Integration Tests (41 tests) | ✅ Complete |
| Phase 4 | Component Tests (86 tests) | ✅ Complete |
| Phase 5 | E2E Tests (96 tests) | ✅ Complete |
| Phase 6 | BDD Tests (30 scenarios) | ✅ Complete |
| Phase 7 | CI/CD Pipeline (3 workflows) | ✅ Complete |
| **Phase 8A** | **AI Evals - Quality (90 tests)** | **✅ Complete** |
| Phase 8B | AI Evals - Context (85 tests) | 📋 Planned |
| Phase 8C | AI Evals - Conversational (30 tests) | 📋 Planned |
| Phase 8D | AI Evals - Production (45 tests) | 📋 Planned |

---

**Phase 8A Milestone Achieved**: January 5, 2026

Frontera now has a production-ready AI evaluation framework for ensuring Strategy Coach quality. Phase 8B-D will expand coverage to context-awareness, conversational quality, and production monitoring.
