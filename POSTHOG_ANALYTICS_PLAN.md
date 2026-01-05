# PostHog Analytics Integration Plan

## Executive Summary

This document outlines the plan to integrate comprehensive PostHog analytics tracking across the Frontera Platform, with initial focus on the Strategy Coach API endpoints and subsequent expansion to platform-wide tracking.

## Current State Analysis

### What's Working ✅

**Client-Side Analytics:**
- PostHog client SDK (`posthog-js`) fully operational
- Tracking implemented in `src/lib/analytics/posthog.ts`
- Events: page views, user identification, feature flags

### What Needs Improvement ⚠️

**Server-Side Analytics:**

1. **Inefficient PostHog Client Management**
   - Location: `src/lib/analytics/strategy-coach.ts`
   - Issue: Creates new PostHog client instance for every API call
   - Impact: Unnecessary overhead, no event batching, resource waste

2. **PostHog AI SDK Not Used**
   - Package installed: `@posthog/ai@7.3.0` in `package.json`
   - Status: ❌ Not integrated anywhere
   - Opportunity: Automatic LLM call tracking, token usage, latency monitoring

3. **Limited Event Tracking**
   - Currently tracked: Only 3 events
     - `strategy_coach_conversation_started`
     - `strategy_coach_message_sent`
     - `strategy_coach_canvas_updated`
   - Defined but unused: 13 additional functions in `strategy-coach.ts`
   - Gap: No tracking for conversation lifecycle, admin actions, webhooks, onboarding

4. **Missing Observability**
   - No tracking of:
     - API errors and failures
     - Response times and performance
     - User journey through methodology phases
     - Framework state transitions
     - LLM token usage and costs

## Recommended Architecture

### 1. Singleton PostHog Server Client

Create a centralized PostHog client for server-side tracking to enable batching and reduce overhead.

**New file:** `src/lib/analytics/posthog-server.ts`

```typescript
import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!posthogClient) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (!key) {
      throw new Error('NEXT_PUBLIC_POSTHOG_KEY is not set');
    }

    posthogClient = new PostHog(key, {
      host,
      flushAt: 20,        // Batch 20 events before sending
      flushInterval: 10000, // Or flush every 10 seconds
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      await posthogClient?.shutdown();
    });
  }

  return posthogClient;
}

/**
 * Track a server-side event
 */
export async function trackEvent(
  eventName: string,
  distinctId: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.capture({
      distinctId,
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to track event: ${eventName}`, error);
    // Never throw - analytics should never crash the app
  }
}

/**
 * Identify a user with properties
 */
export async function identifyUser(
  distinctId: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.identify({
      distinctId,
      properties,
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to identify user: ${distinctId}`, error);
  }
}

/**
 * Track feature flag evaluation
 */
export async function trackFeatureFlag(
  distinctId: string,
  flagKey: string,
  flagValue: boolean | string
): Promise<void> {
  try {
    const posthog = getPostHogServer();
    posthog.capture({
      distinctId,
      event: '$feature_flag_called',
      properties: {
        $feature_flag: flagKey,
        $feature_flag_response: flagValue,
      },
    });
  } catch (error) {
    console.error(`[Analytics Error] Failed to track feature flag: ${flagKey}`, error);
  }
}
```

### 2. PostHog AI SDK Integration

Wrap the Anthropic client to automatically track all LLM interactions.

**Modify:** `src/lib/agents/strategy-coach/index.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { PostHogAI } from '@posthog/ai';
import { getPostHogServer } from '@/lib/analytics/posthog-server';

/**
 * Get Anthropic client wrapped with PostHog AI observability
 */
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  // Create base Anthropic client
  const baseClient = new Anthropic({ apiKey });

  // Wrap with PostHog AI SDK for automatic tracking
  const posthog = getPostHogServer();
  const wrappedClient = PostHogAI.wrapAnthropic(baseClient, {
    posthog,
    tags: {
      agent_type: 'strategy_coach',
      model: 'claude-sonnet-4-20250514',
      environment: process.env.NODE_ENV,
    },
  });

  return wrappedClient as unknown as Anthropic;
}

// Use wrapped client in streamMessage function
export async function streamMessage(
  context: ClientContext,
  state: FrameworkState,
  history: Message[],
  message: string
): Promise<{ stream: ReadableStream; getUsage: () => Usage }> {
  const client = getAnthropicClient(); // Now tracked by PostHog AI
  // ... rest of implementation
}
```

**What PostHog AI SDK Tracks Automatically:**
- Event: `ai_request` for every LLM call
- Properties:
  - `provider`: "anthropic"
  - `model`: "claude-sonnet-4-20250514"
  - `input_tokens`: token count
  - `output_tokens`: token count
  - `total_tokens`: total token count
  - `latency_ms`: response time
  - `cost_usd`: estimated cost
  - Custom tags: `agent_type`, `environment`

### 3. Event Naming Convention

**Pattern:** `{feature}_{object}_{action}`

**Examples:**
- `strategy_coach_conversation_started`
- `strategy_coach_message_sent`
- `admin_application_approved`
- `team_member_invited`

**Standard Properties:**
- `user_id`: Clerk user ID
- `org_id`: Clerk organization ID
- `timestamp`: ISO 8601 timestamp
- `environment`: "development" | "production"
- Feature-specific properties

## Implementation Plan

### Phase 1: Strategy Coach API Analytics (Week 1)

#### 1.1 Core Infrastructure

**Task:** Create singleton PostHog server client

- [ ] Create `src/lib/analytics/posthog-server.ts`
- [ ] Implement `getPostHogServer()`, `trackEvent()`, `identifyUser()`, `trackFeatureFlag()`
- [ ] Add graceful shutdown on SIGTERM

**Task:** Integrate PostHog AI SDK with Anthropic

- [ ] Modify `src/lib/agents/strategy-coach/index.ts`
- [ ] Create `getAnthropicClient()` wrapper function
- [ ] Update `streamMessage()` to use wrapped client
- [ ] Test automatic `ai_request` event tracking

#### 1.2 Conversation Management Events

**File:** `src/app/api/conversations/route.ts`

**Events to track:**

1. **Conversation List Viewed**
```typescript
// GET endpoint - after successful retrieval
await trackEvent('strategy_coach_conversations_listed', userId, {
  org_id: orgId,
  conversation_count: conversations.length,
  has_archived: conversations.some((c) => c.archived),
});
```

2. **Conversation Started** (Enhanced)
```typescript
// POST endpoint - after conversation creation
await trackEvent('strategy_coach_conversation_started', userId, {
  org_id: orgId,
  conversation_id: conversation.id,
  client_industry: clientData.industry,
  client_company_size: clientData.company_size,
  strategic_focus: clientData.strategic_focus,
  has_pain_points: clientData.pain_points && clientData.pain_points.length > 0,
  has_previous_attempts: !!clientData.previous_attempts,
});
```

**File:** `src/app/api/conversations/[id]/route.ts`

**Events to track:**

3. **Conversation Viewed**
```typescript
// GET endpoint - after successful retrieval
await trackEvent('strategy_coach_conversation_viewed', userId, {
  org_id: orgId,
  conversation_id: id,
  message_count: conversation.conversation_messages?.length || 0,
  is_archived: conversation.archived,
  framework_state_phase: conversation.framework_state?.currentPhase,
});
```

4. **Conversation Resumed**
```typescript
// GET endpoint - if conversation has messages (not first view)
if (messageCount > 0) {
  await trackEvent('strategy_coach_conversation_resumed', userId, {
    org_id: orgId,
    conversation_id: id,
    messages_since_last_visit: messageCount, // Could track last_viewed_at in future
  });
}
```

5. **Conversation Updated**
```typescript
// PATCH endpoint - after successful update
await trackEvent('strategy_coach_conversation_updated', userId, {
  org_id: orgId,
  conversation_id: id,
  updated_fields: Object.keys(updates),
  archived: updates.archived,
});
```

6. **Conversation Completed**
```typescript
// PATCH endpoint - if framework state reaches 'planning' and user marks complete
if (updates.framework_state?.currentPhase === 'planning' && updates.archived) {
  await trackEvent('strategy_coach_conversation_completed', userId, {
    org_id: orgId,
    conversation_id: id,
    total_messages: messageCount,
    duration_hours: calculateDuration(conversation.created_at, new Date()),
  });
}
```

#### 1.3 Messaging Events

**File:** `src/app/api/conversations/[id]/messages/route.ts`

**Events to track:**

7. **Message Sent** (Enhanced)
```typescript
// POST endpoint - after message saved to database
await trackEvent('strategy_coach_message_sent', userId, {
  org_id: orgId,
  conversation_id: conversationId,
  message_id: userMessage.id,
  message_length: message.length,
  framework_phase: conversation.framework_state?.currentPhase,
  pillar_context: conversation.framework_state?.currentPillar,
});
```

8. **Message Received**
```typescript
// POST endpoint - after AI response streaming completes
await trackEvent('strategy_coach_message_received', userId, {
  org_id: orgId,
  conversation_id: conversationId,
  message_id: assistantMessage.id,
  response_length: fullResponse.length,
  streaming_duration_ms: streamDuration,
  framework_phase: updatedState.currentPhase,
  phase_changed: updatedState.currentPhase !== conversation.framework_state?.currentPhase,
});
```

9. **Streaming Error**
```typescript
// POST endpoint - if streaming fails
await trackEvent('strategy_coach_streaming_error', userId, {
  org_id: orgId,
  conversation_id: conversationId,
  error_type: error.name,
  error_message: error.message,
  framework_phase: conversation.framework_state?.currentPhase,
});
```

#### 1.4 Framework State Transitions

**File:** `src/app/api/conversations/[id]/messages/route.ts`

10. **Phase Transitioned**
```typescript
// POST endpoint - after framework state update, if phase changed
if (updatedState.currentPhase !== previousPhase) {
  await trackEvent('strategy_coach_phase_transitioned', userId, {
    org_id: orgId,
    conversation_id: conversationId,
    from_phase: previousPhase,
    to_phase: updatedState.currentPhase,
    message_count_in_phase: messageCountSincePhaseStart,
  });
}
```

11. **Pillar Activated**
```typescript
// POST endpoint - after framework state update, if pillar changed
if (updatedState.currentPillar !== previousPillar) {
  await trackEvent('strategy_coach_pillar_activated', userId, {
    org_id: orgId,
    conversation_id: conversationId,
    pillar: updatedState.currentPillar,
    progress: updatedState.researchProgress?.[updatedState.currentPillar] || 0,
  });
}
```

#### 1.5 Strategic Outputs

**File:** `src/app/api/conversations/[id]/messages/route.ts`

12. **Canvas Updated**
```typescript
// POST endpoint - if strategic flow canvas was updated
if (updatedState.strategicFlowCanvas) {
  await trackEvent('strategy_coach_canvas_updated', userId, {
    org_id: orgId,
    conversation_id: conversationId,
    canvas_sections_filled: Object.keys(updatedState.strategicFlowCanvas).filter(
      (k) => updatedState.strategicFlowCanvas[k]
    ).length,
    total_canvas_sections: 6,
  });
}
```

13. **Strategic Bet Created**
```typescript
// POST endpoint - if strategic bet was added
if (updatedState.strategicBets && updatedState.strategicBets.length > previousBetCount) {
  await trackEvent('strategy_coach_bet_created', userId, {
    org_id: orgId,
    conversation_id: conversationId,
    bet_count: updatedState.strategicBets.length,
    bet_name: updatedState.strategicBets[updatedState.strategicBets.length - 1].name,
  });
}
```

#### 1.6 Error Tracking

**All API endpoints:**

14. **API Error**
```typescript
// Wrap all endpoints with error tracking
try {
  // ... endpoint logic
} catch (error) {
  await trackEvent('strategy_coach_api_error', userId || 'unknown', {
    org_id: orgId || 'unknown',
    endpoint: req.url,
    method: req.method,
    error_type: error.name,
    error_message: error.message,
    status_code: 500,
  });
  throw error;
}
```

#### 1.7 Cleanup

- [ ] Delete `src/lib/analytics/strategy-coach.ts` (outdated implementation)
- [ ] Remove unused tracking function imports from API routes
- [ ] Update any existing tracking calls to use new `trackEvent()` function

### Phase 2: Platform-Wide API Analytics (Week 2)

#### 2.1 Admin Application Management

**File:** `src/app/api/admin/applications/route.ts`

**Events:**
- `admin_applications_viewed` - Admin views pending applications
- `admin_application_approved` - Application approved
- `admin_application_rejected` - Application rejected

**File:** `src/app/api/admin/applications/[id]/approve/route.ts`

**Additional properties:**
- Application ID, industry, company size, approval/rejection reason

#### 2.2 Organization Member Management

**File:** `src/app/api/organizations/[orgId]/members/route.ts`

**Events:**
- `team_members_listed` - Member list viewed
- `team_member_invited` - Invitation sent
- `team_member_role_updated` - Role changed
- `team_member_removed` - Member removed from org

**Properties:**
- Member ID, role, invitation email, org size

#### 2.3 Webhooks

**File:** `src/app/api/webhooks/clerk/route.ts`

**Events:**
- `webhook_received` - Clerk webhook processed
- `webhook_user_created` - User account created
- `webhook_org_created` - Organization created
- `webhook_org_membership_created` - User joined org

**Properties:**
- Webhook type, event type, processing duration, success/failure

### Phase 3: Advanced Analytics (Week 3)

#### 3.1 Session Correlation

Add `session_id` to all events to track user journeys:

```typescript
import { v4 as uuidv4 } from 'uuid';

export async function trackEvent(
  eventName: string,
  distinctId: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  // Get or create session ID (from cookie or generate)
  const sessionId = getOrCreateSessionId();

  const posthog = getPostHogServer();
  posthog.capture({
    distinctId,
    event: eventName,
    properties: {
      ...properties,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
  });
}
```

#### 3.2 User Journey Funnels

Define funnels in PostHog dashboard:

**Onboarding Funnel:**
1. `user_signed_up`
2. `client_onboarding_started`
3. `client_onboarding_submitted`
4. `admin_application_approved`
5. `strategy_coach_conversation_started`

**Strategy Coach Engagement Funnel:**
1. `strategy_coach_conversation_started`
2. `strategy_coach_phase_transitioned` (discovery → research)
3. `strategy_coach_pillar_activated` (all 3 pillars)
4. `strategy_coach_phase_transitioned` (research → synthesis)
5. `strategy_coach_canvas_updated`
6. `strategy_coach_bet_created`
7. `strategy_coach_conversation_completed`

#### 3.3 Cost Analysis Dashboard

Use automatic `ai_request` events from PostHog AI SDK:

**Metrics to track:**
- Total tokens per conversation
- Average tokens per message
- Estimated cost per conversation
- Daily/weekly/monthly LLM spend
- Cost per organization
- Cost per strategic bet created

**PostHog Insights:**
- Trend: `ai_request` event count over time
- Sum: `total_tokens` property sum
- Formula: `total_tokens * $0.000003` (Claude Sonnet 4 pricing)

#### 3.4 Performance Monitoring

**Metrics:**
- API response times (track in all endpoints)
- LLM latency (automatic from PostHog AI SDK)
- Database query durations
- Streaming chunk delivery times

**Alerts:**
- LLM latency > 10s (95th percentile)
- API error rate > 1%
- Token usage spike > 2x average

## Event Schema Reference

### Strategy Coach Events (14 total)

| Event Name | Trigger | Key Properties |
|------------|---------|----------------|
| `strategy_coach_conversations_listed` | User views conversation list | `conversation_count`, `has_archived` |
| `strategy_coach_conversation_started` | New conversation created | `conversation_id`, `client_industry`, `strategic_focus` |
| `strategy_coach_conversation_viewed` | Conversation opened | `conversation_id`, `message_count`, `framework_state_phase` |
| `strategy_coach_conversation_resumed` | Return to existing conversation | `conversation_id`, `messages_since_last_visit` |
| `strategy_coach_conversation_updated` | Conversation metadata changed | `conversation_id`, `updated_fields`, `archived` |
| `strategy_coach_conversation_completed` | Conversation archived in planning phase | `conversation_id`, `total_messages`, `duration_hours` |
| `strategy_coach_message_sent` | User sends message | `message_id`, `message_length`, `framework_phase` |
| `strategy_coach_message_received` | AI response received | `message_id`, `response_length`, `streaming_duration_ms`, `phase_changed` |
| `strategy_coach_streaming_error` | Streaming fails | `error_type`, `error_message`, `framework_phase` |
| `strategy_coach_phase_transitioned` | Methodology phase changes | `from_phase`, `to_phase`, `message_count_in_phase` |
| `strategy_coach_pillar_activated` | Research pillar changes | `pillar`, `progress` |
| `strategy_coach_canvas_updated` | Strategic Flow Canvas modified | `canvas_sections_filled`, `total_canvas_sections` |
| `strategy_coach_bet_created` | Strategic Bet added | `bet_count`, `bet_name` |
| `strategy_coach_api_error` | Any API error occurs | `endpoint`, `error_type`, `status_code` |

**Plus:** Automatic `ai_request` events from PostHog AI SDK for every LLM call.

## Testing Strategy

### 1. Local Development Testing

```bash
# Start app with PostHog enabled
npm run dev

# Trigger events manually:
# 1. Create new conversation
# 2. Send messages
# 3. Update framework state
# 4. Archive conversation

# Check PostHog dashboard (Live Events tab)
# Verify events appear with correct properties
```

### 2. Unit Tests for Analytics Functions

**File:** `tests/unit/lib/analytics/posthog-server.test.ts`

```typescript
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { trackEvent, identifyUser } from '@/lib/analytics/posthog-server';

vi.mock('posthog-node', () => ({
  PostHog: vi.fn(() => ({
    capture: vi.fn(),
    identify: vi.fn(),
    shutdown: vi.fn(),
  })),
}));

describe('posthog-server', () => {
  test('trackEvent should call PostHog.capture with correct params', async () => {
    await trackEvent('test_event', 'user123', { foo: 'bar' });

    // Verify PostHog.capture was called
    expect(mockCapture).toHaveBeenCalledWith({
      distinctId: 'user123',
      event: 'test_event',
      properties: expect.objectContaining({
        foo: 'bar',
        timestamp: expect.any(String),
        environment: 'test',
      }),
    });
  });

  test('trackEvent should not throw if PostHog fails', async () => {
    mockCapture.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      trackEvent('test_event', 'user123')
    ).resolves.not.toThrow();
  });
});
```

### 3. Integration Tests for API Tracking

**File:** `tests/integration/api/conversations/route.test.ts`

Add assertions for analytics tracking:

```typescript
test('POST /api/conversations should track conversation_started event', async () => {
  const mockTrackEvent = vi.fn();
  vi.mock('@/lib/analytics/posthog-server', () => ({
    trackEvent: mockTrackEvent,
  }));

  const response = await POST(mockRequest);

  expect(mockTrackEvent).toHaveBeenCalledWith(
    'strategy_coach_conversation_started',
    expect.any(String),
    expect.objectContaining({
      conversation_id: expect.any(String),
      client_industry: 'Technology',
    })
  );
});
```

### 4. E2E Verification

After deployment, verify events in PostHog production environment:

- [ ] All 14 Strategy Coach events appear
- [ ] `ai_request` events tracked automatically
- [ ] Event properties are correct
- [ ] No analytics errors in logs

## Rollout Plan

### Week 1: Strategy Coach Analytics
- Days 1-2: Infrastructure (singleton client, PostHog AI SDK)
- Days 3-4: Conversation and messaging events
- Day 5: Testing and bug fixes

### Week 2: Platform-Wide Analytics
- Days 1-2: Admin and team management events
- Days 3-4: Webhook tracking
- Day 5: Testing and verification

### Week 3: Advanced Analytics
- Days 1-2: Session correlation and funnels
- Days 3-4: Dashboards and alerts
- Day 5: Documentation and team training

## Success Metrics

After full implementation, we should be able to answer:

1. **Engagement:**
   - How many conversations are started per week?
   - What % of conversations are completed (reach planning phase)?
   - Average messages per conversation?

2. **User Journey:**
   - How long does it take to move through methodology phases?
   - Which research pillars are most/least used?
   - Drop-off points in the coaching flow?

3. **Quality:**
   - Average LLM response time?
   - Error rate by endpoint?
   - Strategic outputs created per conversation?

4. **Cost:**
   - Total LLM spend per month?
   - Cost per conversation?
   - Token efficiency trends?

## Dependencies

**Environment Variables:**
- `NEXT_PUBLIC_POSTHOG_KEY` (already set)
- `NEXT_PUBLIC_POSTHOG_HOST` (already set)

**Packages:**
- `posthog-node` (already installed)
- `@posthog/ai` (already installed)
- `@anthropic-ai/sdk` (already installed)

**No new dependencies required!**

## Documentation Updates

After implementation:

- [ ] Update [CLAUDE.md](CLAUDE.md) with analytics architecture section
- [ ] Create `docs/analytics/POSTHOG_EVENTS.md` with complete event catalog
- [ ] Add PostHog dashboard configuration guide
- [ ] Update onboarding docs for new team members

## Questions & Considerations

1. **Data Privacy:**
   - Should we track user message content? (Currently: No, only metadata)
   - PII in event properties? (Currently: Only user/org IDs from Clerk)
   - GDPR compliance? (PostHog has built-in data residency options)

2. **Cost:**
   - PostHog pricing: Free up to 1M events/month, then $0.00045/event
   - Estimated events: ~50K/month (10 conversations/day × 30 days × 14 events + ai_request)
   - Expected cost: $0 (well under free tier)

3. **Performance:**
   - Fire-and-forget pattern ensures no blocking
   - Batching reduces network calls
   - Error isolation prevents analytics from crashing app

---

**Next Steps:** Begin Phase 1 implementation by creating `src/lib/analytics/posthog-server.ts` and integrating PostHog AI SDK with the Anthropic client.
