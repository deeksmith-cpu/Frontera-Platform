# Frontera Platform Development Standards

This document defines the standard practices for all feature development on the Frontera Platform.

---

## PostHog Analytics Requirements

All features MUST include comprehensive PostHog analytics for journey tracking, engagement metrics, and product insights.

### Standard Event Categories

Every feature should track events across these categories:

#### 1. Journey Events
Track user progression through the feature:
```typescript
// Pattern: {feature}_{action}
'strategy_coach_conversation_started'
'strategy_coach_conversation_resumed'
'strategy_coach_conversation_completed'
```

#### 2. Engagement Events
Track user interactions:
```typescript
'strategy_coach_message_sent'
'strategy_coach_sidebar_toggled'
'strategy_coach_document_exported'
```

#### 3. Outcome Events
Track key conversions and achievements:
```typescript
'strategic_bet_created'
'strategic_output_generated'
'research_pillar_completed'
```

#### 4. Error Events
Track failures with context:
```typescript
'strategy_coach_error' // with error_type, error_message properties
```

### Standard Properties

All events should include these base properties:

```typescript
interface BaseAnalyticsProperties {
  // User context
  user_id: string;
  org_id: string;

  // Client context
  industry?: string;
  company_size?: string;
  client_tier: 'pilot' | 'standard' | 'enterprise';

  // Session context
  session_id?: string;
  page_path: string;
}
```

### AI/LLM Feature Requirements

Features using AI/LLM must additionally track:

```typescript
interface LLMAnalyticsProperties {
  // Conversation tracking
  conversation_id: string;
  agent_type: string;
  message_count: number;

  // LLM metrics (auto-captured via PostHog AI SDK)
  // - input_tokens
  // - output_tokens
  // - latency_ms
  // - model
  // - cost_usd

  // Feature-specific
  framework_phase?: string;
  context_loaded: boolean;
}
```

### Implementation Pattern

Create a dedicated analytics file for each feature:

```
src/lib/analytics/
├── index.ts              # Shared utilities
├── strategy-coach.ts     # Strategy Coach events
├── team.ts               # Team management events
└── onboarding.ts         # Onboarding events
```

Example implementation:

```typescript
// src/lib/analytics/strategy-coach.ts
import posthog from 'posthog-js';

interface ConversationStartedProps {
  conversationId: string;
  industry: string;
  strategicFocus: string;
  clientTier: string;
}

export function trackConversationStarted(props: ConversationStartedProps) {
  posthog.capture('strategy_coach_conversation_started', {
    conversation_id: props.conversationId,
    agent_type: 'strategy_coach',
    industry: props.industry,
    strategic_focus: props.strategicFocus,
    client_tier: props.clientTier,
    timestamp: new Date().toISOString(),
  });
}

export function trackMessageSent(conversationId: string, messageLength: number) {
  posthog.capture('strategy_coach_message_sent', {
    conversation_id: conversationId,
    message_length: messageLength,
  });
}

export function trackResponseReceived(
  conversationId: string,
  latencyMs: number,
  tokenCount: number
) {
  posthog.capture('strategy_coach_response_received', {
    conversation_id: conversationId,
    latency_ms: latencyMs,
    token_count: tokenCount,
  });
}
```

---

## Code Organization

### Feature Structure

Each major feature should follow this structure:

```
src/
├── app/
│   ├── api/{feature}/           # API routes
│   └── dashboard/{feature}/     # Pages
├── components/{feature}/        # UI components
├── lib/
│   ├── {feature}/               # Business logic
│   └── analytics/{feature}.ts   # Analytics
└── types/{feature}.ts           # Type definitions
```

### Naming Conventions

- **Events**: `{feature}_{action}` in snake_case
- **Components**: PascalCase (e.g., `ChatInterface.tsx`)
- **Functions**: camelCase (e.g., `trackConversationStarted`)
- **Types**: PascalCase with descriptive suffixes (e.g., `ConversationAnalytics`)

---

## Testing Requirements

- Unit tests for business logic
- Integration tests for API routes
- Analytics event verification in tests

---

## Documentation

Each feature should include:
1. API documentation (in route files as comments)
2. Component props documentation
3. Analytics event documentation
4. User journey documentation

---

## Checklist for New Features

- [ ] Feature structure follows standard organization
- [ ] All journey events implemented
- [ ] All engagement events implemented
- [ ] All outcome events implemented
- [ ] Error tracking implemented
- [ ] Analytics properties include required base fields
- [ ] LLM tracking (if applicable) uses PostHog AI SDK
- [ ] Tests include analytics verification
- [ ] Documentation complete
