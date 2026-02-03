# Frontera Product Strategy Coach - Design Review & Recommendations

> **Review Date:** January 27, 2026
> **Reviewer:** Design Expert Analysis
> **Platform:** https://frontera-platform.vercel.app/dashboard/product-strategy-agent

---

## Executive Summary

The Frontera Product Strategy Coach has a sophisticated backend with rich contextual awareness, but the **frontend fails to surface this intelligence effectively**. The current floating popup architecture positions coaching as secondary to the canvas, when it should be a co-pilot guiding the strategic journey.

**Key Issues Identified:**
1. Chat is not prominent enough (user feedback confirmed)
2. Coaching content doesn't link to user's journey context
3. Rich AI context is invisible to users
4. Streaming responses not displayed in real-time
5. Phase transitions lack coaching guidance

**Primary Recommendation:** Transform from floating popup to persistent side panel layout with contextual awareness features.

---

## Part 1: Current State Assessment

### 1.1 Architecture Overview

```
Current Layout:
┌─────────────────────────────────────────────────────────────────┐
│                     CANVAS (100% width)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              HORIZONTAL PROGRESS STEPPER                │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   PHASE CONTENT                         │   │
│  │   (Discovery / Research / Synthesis / Bets)             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                         [💬]   │
│                                           Floating trigger ↗   │
└─────────────────────────────────────────────────────────────────┘
         ↓ On click
    ╔═══════════════════════════════════╗
    ║    FLOATING COACH POPUP       ║
    ║   (360-600px × 400-800px)     ║
    ║   Draggable & Resizable       ║
    ╚═══════════════════════════════════╝
```

**Key Files:**
- Layout: `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx`
- Popup: `src/components/product-strategy-agent/CoachingPopup.tsx`
- Panel: `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx`
- Trigger: `src/components/product-strategy-agent/CoachTriggerButton.tsx`

### 1.2 Problems with Current Approach

| Issue | Severity | Evidence |
|-------|----------|----------|
| **Coach is visually secondary** | High | Popup can be closed; no persistent presence |
| **No streaming display** | Critical | 5-10s delay before response appears |
| **Context is invisible** | High | System prompt has 10+ context layers users can't see |
| **Phase indicator is static** | Medium | `SessionHeader.tsx` shows hardcoded "Strategic Terrain Mapping" |
| **No smart prompts** | Medium | Empty input with generic placeholder |
| **Phase transitions are abrupt** | Medium | Page reload, no coaching guidance |

### 1.3 What the Coach Knows (But Users Don't See)

The system prompt (`src/lib/agents/strategy-coach/system-prompt.ts`) assembles 10+ context layers:

1. **Client Identity**: Company name, industry, size, tier
2. **Strategic Focus**: Transformation priorities, pain points
3. **Industry Guidance**: Sector-specific coaching adaptations
4. **Transform History**: Previous failed attempts (if any)
5. **Methodology**: Research Playbook, Strategic Flow Canvas
6. **Territory Insights**: Company/Customer/Competitor research (when available)
7. **Synthesis Output**: Opportunities, tensions, recommendations (when available)
8. **Framework State**: Current phase, progress percentages
9. **Session Context**: Message count, last activity
10. **Phase-Specific Guidance**: Tailored coaching for current phase

**The Problem:** None of this rich context is visible to users. They don't know:
- What documents the coach has "read"
- What research informs coach responses
- Why the coach asks certain questions
- How complete their context is

---

## Part 2: Best Practices Analysis

### 2.1 AI Coaching Interface Benchmarks

#### GitHub Copilot Chat (Code Assistant)
- **Pattern:** Persistent side panel in VS Code
- **Strengths:** Always visible, context awareness ("I can see your file..."), slash commands, streaming responses with stop button
- **Frontera Application:** Implement persistent panel, add slash commands (`/summarize`, `/suggest-bet`)

#### BetterUp / CoachHub (Professional Coaching)
- **Pattern:** Session-based coaching with progress tracking
- **Strengths:** Pre-session goals, post-session reflection, progress visualization, memory across sessions
- **Frontera Application:** Add session wrap-up prompts, show insight counts per session

#### Notion AI (Writing Assistant)
- **Pattern:** Inline contextual assistance
- **Strengths:** Highlight text to get AI actions, inline generation, clear AI vs. user distinction
- **Frontera Application:** In research areas, allow "Coach, help me expand this"

#### Salesforce Einstein / HubSpot AI (Enterprise SaaS)
- **Pattern:** AI assistant integrated into workflow
- **Strengths:** Proactive suggestions based on data, one-click actions, confidence indicators
- **Frontera Application:** "Ready to generate synthesis?" prompts, progress confidence scoring

### 2.2 Key Design Principles for AI Coaching

1. **Presence over Popup**: Coach should be persistently visible, not hidden behind a trigger
2. **Context Transparency**: Show users what the AI "knows" to build trust
3. **Streaming Feedback**: Real-time response display eliminates anxiety
4. **Phase Integration**: Visual coherence between coach and methodology
5. **Proactive Guidance**: Smart suggestions based on user state
6. **Evidence Linking**: Connect coach responses to source materials

---

## Part 3: Layout Options

### Option A: Enhanced Floating Popup (Quick Win)

**Description:** Keep current architecture but add contextual triggers and smart features.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CANVAS (100% width)                         │
│                                                                 │
│           ┌──────────────────────┐                              │
│           │ 💬 Coach has         │  ← Proactive notification    │
│           │ a suggestion         │                              │
│           └──────────────────────┘                              │
│                                                         [💬]    │
└─────────────────────────────────────────────────────────────────┘
```

| Pros | Cons |
|------|------|
| Minimal code changes (1 week) | Coach remains secondary |
| Preserves user mental model | No persistent guidance |
| Full canvas real estate | Context disconnect persists |

**Best For:** Quick improvement while planning larger redesign

---

### Option B: Persistent Side Panel (Recommended)

**Description:** Fixed 35% coaching panel on left, 65% canvas on right.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]  Strategy Coach  [Session: Acme Corp]  [Progress: 45%]  │
├───────────────────────┬─────────────────────────────────────────┤
│                       │                                         │
│   COACHING PANEL      │      CANVAS PANEL                       │
│   (35% width)         │      (65% width)                        │
│                       │                                         │
│  ┌─────────────────┐  │  ┌───────────────────────────────────┐  │
│  │ Phase Badge     │  │  │    HORIZONTAL STEPPER             │  │
│  │ [Discovery ●]   │  │  └───────────────────────────────────┘  │
│  └─────────────────┘  │                                         │
│                       │  ┌───────────────────────────────────┐  │
│  ┌─────────────────┐  │  │                                   │  │
│  │ What I Know     │  │  │      PHASE CONTENT                │  │
│  │ • 3 docs        │  │  │                                   │  │
│  │ • Company: 2/3  │  │  │                                   │  │
│  │ [Expand →]      │  │  │                                   │  │
│  └─────────────────┘  │  └───────────────────────────────────┘  │
│                       │                                         │
│  ┌─────────────────┐  │                                         │
│  │ Messages...     │  │                                         │
│  └─────────────────┘  │                                         │
│                       │                                         │
│  ┌─────────────────┐  │                                         │
│  │ Smart Prompts:  │  │                                         │
│  │ [Prompt] [P2]   │  │                                         │
│  │ [Input...]    ↑ │  │                                         │
│  └─────────────────┘  │                                         │
│  [◀ Collapse]         │                                         │
└───────────────────────┴─────────────────────────────────────────┘
```

| Pros | Cons |
|------|------|
| Coach always visible | Reduces canvas to 65% |
| Reduces context switching | Significant refactoring |
| Matches Copilot/Dovetail patterns | Mobile needs different treatment |
| "Guide beside you" metaphor | |

**Best For:** Default desktop experience for strategic work

---

### Option C: Embedded Contextual Coach (Advanced)

**Description:** Coach assistance embedded within canvas sections with toggleable sidebar.

```
┌─────────────────────────────────────────────────────────────────┐
│  RESEARCH SECTION                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Question: What are your core capabilities?              │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ [Your response here...]                             │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ 💡 Coach Hint (inline)                              │ │   │
│  │ │ "Consider capabilities competitors can't replicate" │ │   │
│  │ │ [Ask for more help →]                               │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

| Pros | Cons |
|------|------|
| Highest context relevance | Most complex implementation |
| Coach at moment of need | Multiple UI states to manage |
| Full canvas when not chatting | May confuse users |

**Best For:** Power users who want full canvas control

---

## Part 4: Specific Recommendations

### P0 (Critical - This Sprint)

#### 4.1 Implement Streaming Response Display

**Problem:** Responses appear all at once after 5-10 second delay. Users experience anxiety.

**Solution:** Display streamed text character-by-character with typing indicator.

**Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx`
- `src/components/product-strategy-agent/CoachingPanel/MessageStream.tsx`

**Implementation:**
```typescript
// Current: Collects full response before display
let assistantContent = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  assistantContent += decoder.decode(value);
}
// Then shows full response

// Proposed: Real-time streaming display
const [streamingContent, setStreamingContent] = useState('');
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  setStreamingContent(prev => prev + decoder.decode(value)); // Real-time update
}
```

**Effort:** 4-6 hours | **Impact:** Critical

---

#### 4.2 Add Stop Button During Generation

**Problem:** Users cannot stop long responses. ESC shortcut exists in code but not wired.

**Solution:** Add stop button to ThinkingIndicator and streaming message display.

**Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/ThinkingIndicator.tsx`
- `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx`

**Effort:** 2 hours | **Impact:** Critical

---

### P1 (High Priority - Next Sprint)

#### 4.3 Persistent Side Panel Layout

**Problem:** Floating popup positions coach as secondary, optional overlay.

**Solution:** Convert to 35% persistent side panel with collapse toggle.

**Files to Modify:**
- `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx`
- `src/hooks/useCoachPopup.ts` → rename to `useCoachPanel.ts`

**Implementation:**
```tsx
// Current architecture (popup-based)
<div className="h-full flex flex-col">
  <CanvasPanel ... />
</div>
<CoachTriggerButton ... />
<CoachingPopup ... />

// Proposed architecture (persistent panel)
<div className="h-full flex">
  <aside className="w-[35%] flex-shrink-0 border-r border-slate-200 bg-white">
    <CoachingPanel ... />
  </aside>
  <main className="flex-1 overflow-hidden">
    <CanvasPanel ... />
  </main>
</div>
```

**Effort:** 12-16 hours | **Impact:** High

---

#### 4.4 Context Awareness Panel

**Problem:** Users don't know what information the coach has access to.

**Solution:** Collapsible "What I Know" panel showing documents, research progress, synthesis availability.

**New Component:** `src/components/product-strategy-agent/CoachingPanel/CoachContextAwareness.tsx`

**Design:**
```
┌─────────────────────────────────────────────┐
│ 🧠 What the Coach Knows                    │
├─────────────────────────────────────────────┤
│ ✓ Company profile from onboarding          │
│ ✓ 3 strategic documents uploaded            │
│ ✓ Company territory (2/3 areas mapped)      │
│ ○ Customer territory (1/3 areas mapped)     │
│ ○ Competitor territory (not started)        │
│                                             │
│ [Expand to see details →]                   │
└─────────────────────────────────────────────┘
```

**Effort:** 8-10 hours | **Impact:** High

---

#### 4.5 Phase-Aware Visual Integration

**Problem:** `SessionHeader.tsx` shows hardcoded phase text. Colors don't match stepper.

**Solution:** Dynamic phase indicator using phase colors from `HorizontalProgressStepper.tsx`.

**Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/SessionHeader.tsx`

**Implementation:**
```typescript
const phaseConfig = {
  discovery: { color: 'emerald', label: 'Discovery', sublabel: 'Context Setting' },
  research: { color: 'amber', label: 'Landscape', sublabel: 'Terrain Mapping' },
  synthesis: { color: 'purple', label: 'Synthesis', sublabel: 'Pattern Recognition' },
  bets: { color: 'cyan', label: 'Strategic Bets', sublabel: 'Route Planning' },
};
```

**Effort:** 2-4 hours | **Impact:** Medium

---

### P2 (Medium Priority - Sprint 3)

#### 4.6 Smart Contextual Prompts

**Problem:** Empty input with generic placeholder. Users don't know what to ask.

**Solution:** 2-3 contextual prompt chips based on phase and progress.

**Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/CoachingInput.tsx`

**Example Prompts by Phase:**
- Discovery (no docs): "What documents should I upload?", "Help me think through our challenges"
- Research (Company incomplete): "What should I focus on in Company territory?", "Explain core capabilities vs advantages"
- Synthesis: "Walk me through the strategic opportunities", "Challenge this synthesis finding"

**Effort:** 6-8 hours | **Impact:** High

---

#### 4.7 Suggested Follow-ups

**Problem:** After coach response, user faces blank input again.

**Solution:** After each assistant message, show 2-3 relevant follow-up questions.

**Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/Message.tsx`

**Design:**
```
┌─────────────────────────────────────────────┐
│ Coach Message...                            │
├─────────────────────────────────────────────┤
│ Continue exploring:                         │
│ [Tell me more about...] [How does this...] │
└─────────────────────────────────────────────┘
```

**Effort:** 6-8 hours | **Impact:** Medium

---

### P3 (Future - Sprint 4+)

#### 4.8 Evidence-Linked Responses

**Problem:** Coach references research but no clickable links to sources.

**Solution:** Parse coach responses for evidence references, render as clickable links.

**Effort:** 16-24 hours | **Impact:** High (builds trust)

---

#### 4.9 Proactive Coach Triggers

**Problem:** Coach only responds when asked. No proactive guidance.

**Solution:** Trigger coach suggestions based on user state:
- Idle 60s in research question → "Need help?"
- 4+ areas mapped → "Ready for synthesis?"
- Phase transition → Celebratory guidance
- Return after 24h → Resume summary

**Effort:** 8-12 hours | **Impact:** Medium

---

## Part 5: Implementation Roadmap

### Sprint 1 (This Week) - Critical Fixes
| Task | Effort | Owner |
|------|--------|-------|
| Streaming response display | 4-6h | Frontend |
| Stop button during generation | 2h | Frontend |
| **Total** | **6-8h** | |

### Sprint 2 (Next Week) - Layout Transformation
| Task | Effort | Owner |
|------|--------|-------|
| Persistent side panel layout | 12-16h | Frontend |
| Context awareness panel | 8-10h | Frontend |
| Phase-aware visual integration | 2-4h | Frontend |
| **Total** | **22-30h** | |

### Sprint 3 - Smart Interactions
| Task | Effort | Owner |
|------|--------|-------|
| Smart contextual prompts | 6-8h | Frontend |
| Suggested follow-ups | 6-8h | Frontend |
| **Total** | **12-16h** | |

### Sprint 4 - Advanced Features
| Task | Effort | Owner |
|------|--------|-------|
| Evidence-linked responses | 16-24h | Full-stack |
| Proactive coach triggers | 8-12h | Full-stack |
| **Total** | **24-36h** | |

### Sprint 5 - Persona-Based Coaching

| Task | Effort | Owner |
|------|--------|-------|
| Persona selection UI | 4-6h | Frontend |
| Persona-specific system prompts | 8-12h | Full-stack |
| Persona switching & persistence | 4-6h | Full-stack |
| A/B testing framework | 6-8h | Full-stack |
| **Total** | **22-32h** | |

#### 4.10 Coaching Persona System

**Problem:** One-size-fits-all coaching tone may not resonate with all executive personalities and situations.

**Solution:** Allow users to select from distinct coaching personas tailored to their preferences and objectives. Each persona has a unique communication style, expertise focus, and approach to strategic challenges.

**Coaching Personas:**

---

**MARCUS — The Strategic Navigator**

> *"Let's look at the evidence. What does the market actually tell us?"*

Marcus approaches every conversation with competitive intelligence and strategic clarity. He spent his career in high-stakes market strategy, advising Fortune 500 companies on positioning and growth. He doesn't accept assumptions — he challenges them with data. Marcus excels at helping executives see blind spots in competitive analysis, identify market opportunities, and build strategies that win.

| Attribute | Value |
|-----------|-------|
| **Tone** | Direct, analytical, evidence-driven |
| **Best for** | Market-led growth, competitive positioning, TAM analysis, go-to-market strategy |
| **Recommended when** | User's strategic focus is market expansion or competitive differentiation |

---

**ELENA — The Capability Builder**

> *"You already have more capability than you realise. Let's unlock it together."*

Elena believes transformation happens through people, not frameworks. Her background spans organisational psychology and product leadership, where she built high-performing teams from struggling groups. She asks thoughtful questions, celebrates progress, and creates psychological safety. Elena helps leaders build sustainable capability that outlasts any engagement.

| Attribute | Value |
|-----------|-------|
| **Tone** | Warm, empowering, reflective |
| **Best for** | Team empowerment, capability development, cultural change, skills maturity |
| **Recommended when** | User's strategic focus is team empowerment or organizational transformation |

---

**RICHARD — The Transformation Pragmatist**

> *"You've been here before. This time, let's make it stick."*

Richard understands transformation fatigue because he's lived it. With experience turning around failed initiatives, he balances empathy with directness. He focuses on quick wins that build momentum while connecting to long-term outcomes. Richard helps executives recover confidence and deliver results under board pressure.

| Attribute | Value |
|-----------|-------|
| **Tone** | Pragmatic, empathetic, momentum-focused |
| **Best for** | Turnaround situations, post-failure recovery, balanced transformation, milestone-driven progress |
| **Recommended when** | User has indicated previous failed transformation attempts |

---

**Implementation Approach:**

1. **Persona Selection UI**: Add persona picker in coaching panel header or onboarding flow
2. **System Prompt Injection**: Prepend persona-specific instructions to system prompt
3. **Auto-Recommendation**: Based on client context (strategic focus, pain points, previous attempts), suggest optimal persona
4. **A/B Testing**: Track engagement and satisfaction metrics per persona to validate effectiveness

**Files to Modify:**
- `src/lib/agents/strategy-coach/system-prompt.ts` - Add persona prompt sections
- `src/components/product-strategy-agent/CoachingPanel/SessionHeader.tsx` - Add persona selector
- `src/types/database.ts` - Add persona preference to conversation/client schema

**Effort:** 22-32 hours | **Impact:** High (personalization increases engagement)

---

## Part 6: Success Metrics

### Engagement Metrics
- **Coach interaction rate**: Target 80%+ of sessions (currently estimated ~40%)
- **Messages per session**: Target 8+ (measure baseline first)
- **Time to first message**: Target <30s after opening

### Journey Completion Metrics
- **Research phase completion**: Target 70%+ complete all 9 areas
- **Synthesis generation rate**: Target 60%+ of users who complete research
- **Strategic bets created**: Target 3+ bets per completed journey

### User Satisfaction
- **Post-session feedback**: "Was the coach helpful?" rating
- **Feature usage**: Smart prompts clicked, follow-ups selected
- **Return rate**: Users returning to continue journey

---

## Appendix: Critical File References

| File | Purpose | Modification Priority |
|------|---------|----------------------|
| `ProductStrategyAgentInterface.tsx` | Main layout | P1 - Side panel |
| `CoachingPanel.tsx` | Core coaching component | P0 - Streaming |
| `CoachingPopup.tsx` | Popup wrapper | P1 - Remove/replace |
| `SessionHeader.tsx` | Phase indicator | P1 - Dynamic colors |
| `CoachingInput.tsx` | Message input | P2 - Smart prompts |
| `Message.tsx` | Message display | P2 - Follow-ups |
| `ThinkingIndicator.tsx` | Loading state | P0 - Stop button |
| `MessageStream.tsx` | Message container | P0 - Streaming |
| `HorizontalProgressStepper.tsx` | Phase navigation | Reference for colors |
| `system-prompt.ts` | AI context | Reference for awareness panel |

---

## Conclusion

The Frontera Product Strategy Coach has exceptional backend intelligence that is currently hidden from users. By implementing the recommended changes - starting with streaming responses (P0), then persistent side panel layout (P1), and contextual features (P2) - the platform can transform from "AI assistant in a popup" to "strategic co-pilot guiding the journey."

**Recommended Approach:** Option B (Persistent Side Panel) with elements of Option C (embedded hints) for the research phase.

**Next Steps:**
1. Implement P0 streaming fixes immediately
2. Design mockups for persistent side panel layout
3. User test with 3-5 customers before full implementation
4. Iterate based on feedback
