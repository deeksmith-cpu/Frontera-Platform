# AI Evals Quick Start Guide

## TL;DR

Frontera now has **AI evaluation tests** that measure Strategy Coach quality. Run them like any other test.

```bash
npm run test:evals
```

---

## Setup (One-Time)

Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

---

## Commands

```bash
# Run all AI evals
npm run test:evals

# Run quality metrics only
npm run test:evals:quality

# Watch mode (for prompt engineering)
npm run test:evals:watch

# Run specific test file
npx vitest run tests/evals/strategy-coach/quality/relevance.eval.ts
```

---

## What Gets Tested

| Metric | Threshold | Tests |
|--------|-----------|-------|
| **Relevance** | ≥ 80% | Does response address the question? |
| **Hallucination** | ≤ 20% | Fabricated information? |
| **Tone** | ≥ 85% | Confident, warm, not patronizing? |
| **Completeness** | ≥ 75% | Sufficient actionable guidance? |

**Total: 90 evaluation test cases**

---

## Prompt Engineering Workflow

```bash
# 1. Baseline before changes
npm run test:evals:quality

# 2. Edit system prompt
vim src/lib/agents/strategy-coach/system-prompt.ts

# 3. Watch mode for fast feedback
npm run test:evals:watch

# 4. Iterate until scores improve

# 5. Commit with confidence
git commit -m "Improve guidance quality"
```

---

## Example Output

```
✅ DISC-001: Relevance score 0.87 (threshold: 0.80)
   Reasoning: "Response directly addresses market expansion..."
   Confidence: high

❌ RES-015: Hallucination score 0.25 (threshold: 0.20)
   Reasoning: "Mentions 'Four Pillars' but should be three..."
   Confidence: high
```

---

## When to Run

- ✅ **Before** any system prompt changes
- ✅ **After** modifying agent logic
- ✅ **Weekly** to track quality trends
- ❌ **Not needed** for UI/styling changes
- ❌ **Not needed** for database schema changes

---

## Cost

- **Per run (90 tests)**: ~$1-2
- **Monthly (5 runs/week)**: ~$40-80
- **Per test**: ~$0.01

Worth it to prevent quality incidents worth $10K-50K+

---

## Documentation

- **Quick start**: [tests/evals/README.md](tests/evals/README.md)
- **Deep dive**: [AI_EVALS_GUIDE.md](AI_EVALS_GUIDE.md)
- **Full plan**: [AI_EVALS_IMPLEMENTATION_PLAN.md](AI_EVALS_IMPLEMENTATION_PLAN.md)

---

## Troubleshooting

**"ANTHROPIC_API_KEY is not set"**
→ Add key to `.env.local`

**"Test timed out"**
→ Normal (LLM calls take time). Already set to 60s timeout.

**"LLM judge did not return valid JSON"**
→ Retry once (usually transient)

---

## Next Steps

1. Run your first eval: `npm run test:evals:quality`
2. Review the output and scores
3. Start using in your prompt engineering workflow

**Questions?** Read [AI_EVALS_GUIDE.md](AI_EVALS_GUIDE.md)
