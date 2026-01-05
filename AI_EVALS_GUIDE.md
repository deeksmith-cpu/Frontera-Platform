# AI Evaluation Guide for Frontera Platform

## What Are AI Evals?

**AI Evaluations (evals)** are specialized tests that measure the quality, accuracy, and effectiveness of LLM outputs. Unlike traditional software tests that validate code logic, evals answer:

- Is the coaching advice **relevant** to the user's question?
- Does the response contain **hallucinated** (fabricated) information?
- Is the **tone** confident and professional without being patronizing?
- Does the response provide **complete, actionable** guidance?

## Why We Need Evals

The Strategy Coach is Frontera's core product value—its quality directly impacts user satisfaction and retention. Our existing 285+ tests validate that:
- API routes work correctly
- Database queries execute
- UI components render
- User workflows complete

**But they don't measure:**
- Whether the coaching advice is good
- If responses stay grounded in methodology
- Whether the tone is appropriate
- If guidance is actionable and helpful

**Evals fill this gap.**

## Quick Start

```bash
# Run all AI evaluation tests
npm run test:evals

# Run specific category
npm run test:evals:quality

# Watch mode for development
npm run test:evals:watch
```

## How Evals Work

### Hybrid Evaluation Approach

We use **two complementary methods**:

#### 1. Code-Based Grading (Fast & Deterministic)
```typescript
// Example: Check for hallucinated pillar count
expect(response.toLowerCase()).not.toContain('five pillars');
expect(response.toLowerCase()).toContain('three');
```

**Pros:**
- Fast (no API calls)
- Deterministic (same input = same output)
- No cost

**Cons:**
- Limited nuance
- Can't judge semantic quality

#### 2. LLM-as-a-Judge (Nuanced & Semantic)
```typescript
const judgment = await judgeResponse(
  userInput,
  response,
  context,
  EVALUATION_CRITERIA.relevance
);

// Returns:
// {
//   score: 0.87,
//   reasoning: "Response directly addresses the question...",
//   confidence: "high"
// }
```

**Pros:**
- Nuanced quality assessment
- Understands semantic meaning
- Can evaluate tone, relevance, completeness

**Cons:**
- Slower (~2-3s per judgment)
- Costs money (~$0.01 per test)
- Slight variance between runs

### Evaluation Workflow

```
1. Execute Strategy Coach
   └─> Get response for test case

2. Run Evaluations
   ├─> Code-based checks (keywords, length, format)
   └─> LLM-as-a-judge (quality, tone, relevance)

3. Assert Thresholds
   └─> Pass if score ≥ threshold, fail otherwise

4. Log Results
   └─> Score, reasoning, confidence for analysis
```

## Current Metrics (Phase 8A)

| Metric | Threshold | Type | What It Measures |
|--------|-----------|------|------------------|
| **Relevance** | ≥ 0.80 | LLM-judge | Does the response directly address the user's question? |
| **Hallucination** | ≤ 0.20 | Both | Contains fabricated methodology or client details? |
| **Tone Adherence** | ≥ 0.85 | Both | Maintains confident, warm, non-patronizing coaching voice? |
| **Completeness** | ≥ 0.75 | Both | Provides sufficient detail and actionable guidance? |

## Writing Eval Tests

### Example: New Relevance Test

```typescript
// tests/evals/strategy-coach/quality/relevance.eval.ts
import { describe, test, expect } from 'vitest';
import { executeStrategyCoach, createTestContext } from '../../helpers/eval-utils';
import { judgeResponse, EVALUATION_CRITERIA } from '../../helpers/llm-judge';
import { QUALITY_THRESHOLDS } from '../../config/metrics.config';

describe('Relevance Evaluation', () => {
  test('should provide relevant response for market expansion question', async () => {
    // 1. Execute Strategy Coach
    const { content } = await executeStrategyCoach(
      'What competitive forces should I analyze for market expansion?',
      createTestContext({
        industry: 'Technology',
        strategic_focus: 'Market expansion',
      })
    );

    // 2. LLM-as-a-judge evaluation
    const judgment = await judgeResponse(
      'What competitive forces should I analyze for market expansion?',
      content,
      { expectedFocus: 'Macro market research, competitive dynamics' },
      EVALUATION_CRITERIA.relevance
    );

    // 3. Log results
    console.log({
      score: judgment.score,
      reasoning: judgment.reasoning,
      confidence: judgment.confidence,
    });

    // 4. Assert threshold
    expect(judgment.score).toBeGreaterThanOrEqual(QUALITY_THRESHOLDS.relevance);
  }, {
    timeout: 60000,  // 60s for LLM API calls
    retry: 1,         // Retry once if fails (LLM variance)
  });
});
```

## Prompt Engineering Workflow with Evals

### Standard TDD-Like Workflow

```bash
# 1. Run baseline before changes
npm run test:evals:quality

# Note current scores (e.g., Relevance: 0.87, Tone: 0.91)

# 2. Make prompt changes in src/lib/agents/strategy-coach/system-prompt.ts

# 3. Run evals in watch mode
npm run test:evals:watch

# 4. Iterate on prompts until scores improve or maintain

# 5. When satisfied, commit changes
git add src/lib/agents/strategy-coach/system-prompt.ts
git commit -m "Improve market expansion guidance"
```

### Interpreting Results

**Example Output:**
```
✅ DISC-001: Relevance score 0.89 (threshold: 0.80)
   Reasoning: "Response directly addresses market expansion with relevant macro market guidance and specific competitive dynamics questions."
   Confidence: high

❌ RES-015: Hallucination score 0.25 (threshold: 0.20)
   Reasoning: "Response mentions 'Four Pillars' but the Product Strategy Research Playbook has three pillars: Macro Market, Customer, Colleague."
   Confidence: high
```

**What to do:**
- ✅ **Pass**: Quality meets expectations—keep this behavior
- ❌ **Fail**: Quality issue detected—fix prompt or agent logic
- **Review reasoning**: Understand WHY it passed/failed
- **Check confidence**: High confidence = trust the score; Low = rerun

## Best Practices

### 1. Run Evals Before Every Prompt Change

**Always** establish a baseline before modifying prompts:

```bash
# BEFORE touching system-prompt.ts
npm run test:evals:quality  # Note scores

# AFTER changes
npm run test:evals:quality  # Compare delta
```

### 2. Review Reasoning, Not Just Scores

Don't just look at pass/fail—**understand why**:

```typescript
// Bad: Only check score
expect(judgment.score).toBeGreaterThanOrEqual(0.80);

// Good: Log reasoning for learning
console.log('Score:', judgment.score);
console.log('Why:', judgment.reasoning);
console.log('Confidence:', judgment.confidence);
```

### 3. Add Test Cases for Production Issues

When you discover a quality issue:

1. **Create test case** in `tests/evals/fixtures/test-conversations.ts`
2. **Run eval** to confirm it fails
3. **Fix prompt** in `system-prompt.ts`
4. **Verify eval passes**
5. **Commit** both fix and test case

### 4. Use Watch Mode for Rapid Iteration

```bash
# Run specific file in watch mode
npx vitest watch tests/evals/strategy-coach/quality/relevance.eval.ts

# Make changes to prompts
# Tests auto-rerun
# See immediate feedback
```

### 5. Understand LLM Judge Variance

- LLM-as-a-judge can vary slightly (±0.02-0.05) between runs
- If barely fails (e.g., 0.78 vs 0.80), run 2-3 times
- Consistent failures = real issue
- Consider threshold adjustments if tests are too flaky

## Troubleshooting

### "LLM judge did not return valid JSON"

**Cause:** LLM response wasn't parseable JSON

**Fix:** Retry (usually transient)

```typescript
test('my test', async () => {
  // ...
}, { retry: 1 });  // Auto-retry once
```

### "Test timed out after 60000ms"

**Cause:** Anthropic API latency

**Fix:** Increase timeout or check API status

```typescript
test('my test', async () => {
  // ...
}, { timeout: 120000 });  // 2 minutes
```

### "ANTHROPIC_API_KEY is not set"

**Cause:** Missing environment variable

**Fix:** Add to `.env.local`

```bash
ANTHROPIC_API_KEY=sk-ant-api...
```

### "Evals pass locally but fail in CI"

**Possible causes:**
- API key not configured in GitHub Secrets
- Different model behavior (check model version in config)
- Network issues

**Fix:** Check GitHub Actions logs for error details

## Cost Management

### Eval Costs

- **Per test**: ~$0.01-0.02 (2 API calls)
- **Full suite (90 tests)**: ~$1-2
- **Per month** (5 runs/week): ~$40-80

### Optimization Tips

1. **Use code-based grading when possible** (free)
2. **Run full suite infrequently** (before PRs, not every commit)
3. **Use watch mode** with specific files during development
4. **Sample in production** (5% of conversations, not 100%)

## FAQ

**Q: How long do evals take?**
A: ~5-10 minutes for full quality suite (90 tests with LLM judging)

**Q: Do evals replace manual review?**
A: No—evals complement human judgment, they don't replace it

**Q: Can I skip evals if unit tests pass?**
A: No—unit tests validate code, evals validate AI output quality

**Q: What if evals are too slow for TDD?**
A: Use watch mode with specific files, or run code-based checks only during dev

**Q: How do I know if a threshold is too strict/loose?**
A: Run baseline, check pass rate. Aim for 90-95% pass rate—adjust thresholds if needed

**Q: Should I run evals for every code change?**
A: Only for changes to Strategy Coach (prompts, agent logic). Not needed for UI or API changes.

---

## Next Steps

- **Phase 8B** (Context-aware evals): Industry guidance, client context utilization
- **Phase 8C** (Conversational quality): Multi-turn coherence, knowledge retention
- **Phase 8D** (Production monitoring): Live quality sampling, alerting

See [AI_EVALS_IMPLEMENTATION_PLAN.md](AI_EVALS_IMPLEMENTATION_PLAN.md) for full roadmap.
