# AI Evaluation Tests - Phase 8A

This directory contains AI evaluation tests for the Frontera Strategy Coach.

## Overview

Unlike traditional unit/integration tests that validate code behavior, **AI evaluations** measure the quality, accuracy, and effectiveness of LLM outputs—ensuring the Strategy Coach provides excellent coaching experiences.

## Quick Start

```bash
# Run all eval tests
npm run test:evals

# Run specific category
npm run test:evals:quality

# Watch mode for development
npm run test:evals:watch
```

## Test Structure

```
tests/evals/
├── config/                 # Evaluation configuration
│   ├── metrics.config.ts   # Quality thresholds and settings
│   └── baselines.json      # Baseline scores for regression detection
├── fixtures/               # Test data
│   ├── test-conversations.ts  # 50+ test conversation scenarios
│   ├── client-contexts.ts     # Industry/size variations
│   └── adversarial-inputs.ts  # Safety test cases
├── helpers/                # Evaluation utilities
│   ├── eval-utils.ts       # Execute Strategy Coach
│   ├── llm-judge.ts        # LLM-as-a-judge evaluations
│   └── code-grader.ts      # Code-based validation
└── strategy-coach/
    └── quality/            # Quality evaluation tests
        ├── relevance.eval.ts      # Relevance to user input
        ├── hallucination.eval.ts  # Factual accuracy
        ├── tone.eval.ts           # Coaching tone adherence
        └── completeness.eval.ts   # Sufficient guidance
```

## Evaluation Metrics

### Phase 8A: Quality Metrics (Current)

| Metric | Threshold | Type | Description |
|--------|-----------|------|-------------|
| **Relevance** | ≥ 0.80 | LLM-judge | Does response address user's question? |
| **Hallucination** | ≤ 0.20 | LLM-judge + Code | Fabricated information? (lower is better) |
| **Tone Adherence** | ≥ 0.85 | LLM-judge | Confident, warm, non-patronizing? |
| **Completeness** | ≥ 0.75 | LLM-judge | Sufficient actionable guidance? |

### Future Phases

- **Phase 8B:** Context-aware (client context, industry guidance)
- **Phase 8C:** Conversational (turn relevancy, knowledge retention)
- **Phase 8D:** Safety (prompt injection, bias detection)

## How It Works

### Hybrid Evaluation Approach

We use **two complementary grading methods**:

1. **Code-Based Grading** (Fast, Deterministic)
   - Keyword presence
   - Response length
   - Format validation
   - Hallucination detection

2. **LLM-as-a-Judge** (Nuanced, Semantic)
   - Uses Claude to evaluate Claude's outputs
   - Provides chain-of-thought reasoning
   - Scores on 0-1 scale with confidence levels

### Example: Relevance Evaluation

```typescript
// 1. Execute Strategy Coach
const { content } = await executeStrategyCoach(
  'What should I focus on for my product strategy?',
  {
    industry: 'Technology',
    company_size: '50-200',
    strategic_focus: 'Market expansion',
    pain_points: ['Unclear competitive positioning'],
    previous_attempts: 'Hired consultants but recommendations too generic',
  }
);

// 2. LLM-as-a-judge evaluation
const judgment = await judgeResponse(
  'What should I focus on for my product strategy?',
  content,
  context,
  EVALUATION_CRITERIA.relevance
);

// 3. Assert quality threshold
expect(judgment.score).toBeGreaterThanOrEqual(0.80);

// Output:
// {
//   score: 0.87,
//   reasoning: "Response directly addresses market expansion focus...",
//   confidence: "high"
// }
```

## Running Evaluations

### Local Development

```bash
# Run full quality eval suite (~5-10 minutes)
npm run test:evals:quality

# Run specific test file
npx vitest run tests/evals/strategy-coach/quality/relevance.eval.ts

# Watch mode for TDD workflow
npm run test:evals:watch
```

### Interpreting Results

Eval output shows:
- ✅ **Pass**: Score meets threshold
- ❌ **Fail**: Score below threshold
- **Score**: 0-1 for each metric
- **Reasoning**: LLM judge's explanation
- **Confidence**: Judge's certainty

Example output:
```
✅ DISC-001: Relevance score 0.89 (threshold: 0.80)
   Reasoning: "Response directly addresses market expansion focus with relevant macro market guidance..."
   Confidence: high

❌ RES-015: Hallucination score 0.25 (threshold: 0.20)
   Reasoning: "Response mentions 'Four Pillars' but methodology has three..."
   Confidence: high
```

### Environment Variables

```bash
# Required for LLM-as-a-judge evaluations
ANTHROPIC_API_KEY=your_api_key_here
```

## Test Coverage

### Phase 8A (Current Implementation)

| Category | Test Count | Status |
|----------|------------|--------|
| Relevance | 32 tests | ✅ |
| Hallucination | 10 tests | ✅ |
| Tone | 28 tests | ✅ |
| Completeness | 20 tests | ✅ |
| **Total** | **90 tests** | **✅** |

**Test Distribution:**
- 30 relevance evaluations (diverse scenarios)
- 10 hallucination detection tests
- 28 tone adherence tests (20 LLM-judge + 8 code-based)
- 20 completeness evaluations
- 2 additional edge case tests

## Cost Considerations

**Eval API Usage:**
- Per test: ~2 API calls (1 execution + 1 judge)
- Avg tokens: ~500 per call
- **Cost**: ~$0.01-0.02 per test
- **Full suite (90 tests)**: ~$1-2 per run

**Optimization Tips:**
- Run full suite infrequently (before PRs)
- Use watch mode with specific files during development
- Code-based grading is free—use when sufficient

## Best Practices

### 1. **Run Evals Before Prompt Changes**

Always establish a baseline before modifying system prompts or agent logic:

```bash
# Before changes
npm run test:evals:quality  # Note current scores

# Make prompt changes

# After changes
npm run test:evals:quality  # Compare scores
```

### 2. **Understand Failures**

When a test fails, **review the reasoning**—not just the score:

```typescript
if (judgment.score < threshold) {
  console.log('Why it failed:', judgment.reasoning);
  console.log('Actual response:', content);
}
```

### 3. **LLM Judging Has Variance**

- LLM-as-a-judge can vary slightly between runs
- If a test barely fails (e.g., 0.78 vs 0.80 threshold), run 2-3 times
- Consistent failures indicate real quality issues

### 4. **Add Test Cases for Edge Cases**

When you discover a quality issue in production:

1. Create a test case in `fixtures/test-conversations.ts`
2. Run eval to confirm it fails
3. Fix the prompt/agent
4. Verify eval now passes
5. Commit both fix and test case

## Troubleshooting

### "LLM judge did not return valid JSON"

- Rare LLM response formatting issue
- **Fix**: Retry the test (use `retry: 1` option)

### "Test timed out after 60000ms"

- Anthropic API latency
- **Fix**: Increase timeout or check API status

### "ANTHROPIC_API_KEY is not set"

- Missing environment variable
- **Fix**: Add to `.env.local` or export in shell

### "All tests failing"

- Check if Strategy Coach is accessible
- Verify imports resolve correctly
- Ensure `streamMessage` function exists in agent

## Next Steps (Future Phases)

- **Phase 8B** (Week 3): Context-aware evaluations
  - Client context utilization
  - Industry-specific guidance accuracy
  - Framework state progression

- **Phase 8C** (Week 4): Conversational quality
  - Multi-turn coherence
  - Knowledge retention
  - Conversation completeness

- **Phase 8D** (Week 5): Safety & production readiness
  - Prompt injection resistance
  - Bias detection
  - Production monitoring setup

---

**Questions?** See [AI_EVALS_IMPLEMENTATION_PLAN.md](../../AI_EVALS_IMPLEMENTATION_PLAN.md) for full details.
