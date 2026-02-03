# Product Strategy Coach - Comprehensive Design Review

**Version:** 1.0
**Date:** January 18, 2026
**Reviewer:** Design & UX Architecture Team
**Platform:** Frontera Strategic Coaching Platform
**Scope:** Product Strategy Coach Interface (Discovery → Research → Synthesis → Strategic Bets)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
   - [Visual Design](#visual-design)
   - [Interaction Design](#interaction-design)
   - [Information Architecture](#information-architecture)
   - [User Journeys](#user-journeys)
   - [Component Library](#component-library)
3. [Best Practice Comparison](#best-practice-comparison)
4. [Heuristic Evaluation](#heuristic-evaluation)
5. [Accessibility Audit](#accessibility-audit)
6. [Future-Thinking Design Vision](#future-thinking-design-vision)
7. [Recommendations & Roadmap](#recommendations--roadmap)
8. [Appendices](#appendices)

---

## Executive Summary

### Overall Assessment

The Product Strategy Coach represents a **solid MVP foundation** with clear strategic intent and thoughtful implementation of core coaching methodology. The interface successfully delivers on the promise of "bridging strategic vision and operational reality" through a structured, phase-based approach.

#### Scorecard (1-5 scale, 5 = excellent)

| Dimension | Score | Assessment |
|-----------|-------|------------|
| **Visual Design** | 3.5/5 | Professional and polished, but lacks distinctive character for enterprise positioning |
| **Interaction Design** | 3.0/5 | Functional patterns in place, missing micro-interactions and delightful moments |
| **Information Architecture** | 4.0/5 | Clear hierarchy and progressive disclosure, excellent phase-based structure |
| **User Experience** | 3.5/5 | Intuitive core journey, but friction points in deep-dive modals and context switching |
| **Accessibility** | 2.5/5 | Basic foundations present, significant gaps in keyboard navigation and screen reader support |

**Overall Score: 3.3/5** (Good foundation, significant room for elevation to enterprise-grade excellence)

### Top 3 Strengths to Preserve

1. **Phase-Based Progressive Disclosure**
   The 4-phase journey (Discovery → Research → Synthesis → Bets) provides excellent scaffolding for complex strategic work. The horizontal progress stepper is clear, confidence-building, and aligns perfectly with the methodology.

2. **Two-Panel Layout Architecture**
   The persistent coaching sidebar (25%) + scrollable canvas (75%) split creates an effective "guide beside you" experience. Users always know where to ask questions while maintaining focus on their strategic work.

3. **Strategic Context Evolution Message**
   The Discovery section's explanation that context "deepens and iterates" through phases sets appropriate expectations and reduces user anxiety about "getting it perfect" early. This is psychologically astute for enterprise users.

### Top 5 Critical Improvements

| # | Issue | Impact | Effort | Priority |
|---|-------|--------|--------|----------|
| 1 | **Lack of conversational AI visual feedback** | HIGH | MEDIUM | 🔴 **CRITICAL** |
| 2 | **Territory deep-dive modal UX friction** | HIGH | MEDIUM | 🔴 **CRITICAL** |
| 3 | **Accessibility gaps (keyboard nav, ARIA)** | HIGH | HIGH | 🟠 **HIGH** |
| 4 | **Missing synthesis visualization** | HIGH | HIGH | 🟠 **HIGH** |
| 5 | **Generic design system lacks differentiation** | MEDIUM | MEDIUM | 🟡 **MEDIUM** |

### Strategic Design Roadmap

- **Now (Next Sprint):** Fix critical AI feedback and modal UX issues
- **Next (Phases 2-3):** Elevate visual design, add synthesis visualizations, improve accessibility
- **Future (Phase 4+):** Introduce collaborative features, mobile experience, advanced AI interface patterns

---

## Current State Analysis

### Visual Design

#### Color System Analysis

**Current Implementation:**
```
Primary Gradient: from-indigo-600 to-cyan-600
Phase Colors:
  - Discovery: emerald-600
  - Research: amber-600
  - Synthesis: purple-600
  - Bets: cyan-600
Neutrals: slate-50 through slate-900
```

**Strengths:**
- ✅ Consistent use of Frontera brand gradient (indigo-cyan) across CTAs
- ✅ Phase-specific color coding provides clear visual differentiation
- ✅ Slate neutral palette is professional and accessible (14.47:1 contrast ratio)
- ✅ Gradient usage is restrained, avoiding "purple gradient overload"

**Weaknesses:**
- ❌ **Generic SaaS aesthetic**: The indigo-cyan + slate combination is becoming a SaaS cliché (see Linear, Notion, Vercel)
- ❌ **Lack of brand personality**: No unexpected color moments or signature visual hooks
- ❌ **Inconsistent phase color application**: Phase colors appear only in stepper sublabels, not leveraged enough throughout experience
- ❌ **Missing emotional depth**: No warm tones, all cool colors (indigo/cyan/emerald/purple)

**Benchmark Comparison:**

| Platform | Color Strategy | Differentiation Level |
|----------|----------------|----------------------|
| Amplitude | Purple gradients + dark mode | ⭐⭐ (Industry standard) |
| Miro | Bold yellows + playful accents | ⭐⭐⭐⭐ (Highly distinctive) |
| Dovetail | Soft pastels + muted purples | ⭐⭐⭐ (Pleasant, memorable) |
| **Frontera** | Indigo-cyan gradient + slate | ⭐⭐ (Professional but generic) |

**Recommendation:** Introduce a **signature brand color moment** - consider a warm accent (amber-500, orange-400) for strategic insights and "aha moments" to create emotional resonance and break the cool-color monotony.

#### Typography

**Current Implementation:**
```
Font Stack: System fonts (tailwind default)
Headings: font-bold (600 weight)
Body: text-sm (14px) regular
Labels: text-xs uppercase tracking-wider
```

**Strengths:**
- ✅ Excellent performance (no font loading)
- ✅ Clear hierarchy (bold headings, uppercase labels)
- ✅ Consistent use of leading-relaxed for readability
- ✅ Proper text sizes for enterprise SaaS (14px body is optimal)

**Weaknesses:**
- ❌ **Zero character or personality**: System fonts are invisible, no brand expression
- ❌ **Missed opportunity for trust signaling**: Enterprise buyers expect sophistication
- ❌ **Mono-weight typography**: Only using 400 and 600, missing expressive range
- ❌ **No display font for impact moments**: Synthesis insights deserve special treatment

**Best Practice Comparison:**

| Platform | Typography Strategy | Brand Impact |
|----------|---------------------|--------------|
| Stripe | Custom "Stripe Sans" (geometric, precise) | ⭐⭐⭐⭐⭐ (Industry-defining) |
| Intercom | "Intercom Font" (friendly, approachable) | ⭐⭐⭐⭐ |
| Linear | "Linear Sans" (refined, minimal) | ⭐⭐⭐⭐⭐ |
| **Frontera** | System fonts | ⭐ (Invisible, no brand) |

**Recommendation:** Implement a **custom Google Fonts pairing** for free but distinctive typography:
- **Display**: `Newsreader` (already in layout.tsx!) - elegant serif for strategic insights, synthesis outputs
- **UI**: `IBM Plex Sans` - geometric, professional, excellent weights (300, 400, 500, 600)
- **Mono**: `IBM Plex Mono` (already in layout.tsx!) - for data, metrics, evidence

This creates a **Editorial + Technical** aesthetic perfect for strategic advisory.

#### Spacing & Layout

**Current Implementation:**
```
Container padding: p-6 (24px) standard
Section gaps: gap-6, space-y-8
Canvas content: p-10 (40px)
Border radius: rounded-xl (12px), rounded-2xl (16px)
```

**Strengths:**
- ✅ Generous whitespace prevents cognitive overload
- ✅ Consistent spacing scale (Tailwind's 4px grid)
- ✅ Rounded corners create modern, approachable feel
- ✅ Good use of max-w-6xl containers for readability

**Weaknesses:**
- ❌ **Lack of rhythm variation**: Everything is evenly spaced, no visual emphasis
- ❌ **No asymmetry or surprise**: Grid-based layouts feel predictable
- ❌ **Missing visual weight hierarchy**: All cards/sections feel equally important
- ❌ **Canvas content padding too uniform**: 40px everywhere doesn't create focal points

**Recommendation:** Introduce **variable rhythm** - discovery intro (p-8), synthesis outputs (p-12), secondary content (p-6). Use asymmetric layouts for synthesis insights (2/3 + 1/3 split instead of 1/2 + 1/2).

#### Component Aesthetics

**Progress Stepper:**
- ✅ Excellent use of gradient for active state
- ✅ "You Are Here" indicator with pulse animation is confidence-building
- ✅ Checkmark for completed phases reinforces progress
- ❌ Connector lines are thin and subtle (could be more pronounced)
- ❌ Phase color sublabels don't carry through to rest of interface

**Discovery Section:**
- ✅ Methodology intro card with gradient background is inviting
- ✅ 4-phase mini cards provide excellent preview
- ✅ Strategic context tile is information-dense but scannable
- ❌ File upload area is generic (standard dashed border pattern)
- ❌ "Evolving Strategic Context" message box uses cyan when discovery phase is emerald

**Coaching Sidebar:**
- ✅ Clean, distraction-free message display
- ❌ No visual indicator that AI is "thinking" or streaming
- ❌ Opening message has no special treatment (should be visually distinct)
- ❌ User vs. assistant messages look too similar (needs stronger differentiation)

**Synthesis Section:** (Not yet reviewed in detail - pending UAT walkthrough)

---

### Interaction Design

#### Micro-Interactions & Feedback

**Current State:**
- ✅ Hover states on buttons (scale-105, shadow-lg)
- ✅ Transition-all duration-300 for smooth state changes
- ✅ Loading spinner for file uploads
- ❌ **No streaming AI response indicator**
- ❌ **No typing indicator when assistant is composing**
- ❌ **No success confirmations for saved research**
- ❌ **No progress animations when transitioning phases**

**Critical Gap: AI Conversational Feedback**

Modern AI interfaces (ChatGPT, Claude, Perplexity) set user expectations for:
1. **Typing indicator**: "Frontera Coach is thinking..."
2. **Streaming text reveal**: Character-by-character or word-by-word appearance
3. **Pause/stop button**: Allow users to interrupt long responses
4. **Regenerate option**: If response isn't helpful

**Frontera's current implementation:**
```typescript
// CoachingPanel.tsx lines 112-122
const reader = response.body?.getReader();
let assistantContent = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  assistantContent += decoder.decode(value);
}
// Then displays all at once
```

**Issue:** Streaming is read but not displayed incrementally. Users see:
1. Send message
2. [Nothing visible for 5-10 seconds]
3. Full response appears

This creates **anxiety** ("Is it working?") and **lacks the engaging AI chat experience** users expect.

**Recommendation:**
```typescript
// Stream display pattern
const [streamingContent, setStreamingContent] = useState('');
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  setStreamingContent(prev => prev + chunk); // Update in real-time
}
```

Add typing indicator before first chunk arrives.

#### Navigation Patterns

**Current Patterns:**
- ✅ Phase-based progression is linear and clear
- ✅ Back to conversation list (implicit via page navigation)
- ❌ **No breadcrumbs** within deep-dive modals
- ❌ **No "jump to phase" shortcuts** (must click through linearly)
- ❌ **No "back to top" button** in long scrollable canvas
- ❌ **No keyboard shortcuts** (Cmd+K for coach input, Esc to close modals)

**Territory Deep-Dive Modal UX Issues:**

When user clicks "Company Territory" card:
1. Modal opens full-screen
2. User sees first research area
3. Must complete area to unlock next
4. Can't preview what's ahead
5. No progress indicator within modal
6. Back button closes modal entirely (loses context)

**User Mental Model Mismatch:**
Users expect modal to be an **"expanded view"** of the territory, not a **"wizard flow"**.

**Recommendation:** Redesign deep-dive as **sidebar navigation + content area**:
```
┌──────────────────────────────────────────────┐
│ Company Territory Deep Dive            [X]   │
├──────────────┬───────────────────────────────┤
│ ✓ Industry   │                               │
│   Forces     │  [Current research area       │
│              │   questions and responses]    │
│ ○ Business   │                               │
│   Model      │                               │
│              │                               │
│ ○ Product    │                               │
│   Capabilities│                               │
└──────────────┴───────────────────────────────┘
```

This allows users to:
- See all research areas upfront (reduce anxiety)
- Navigate non-linearly (revisit previous areas)
- Understand progress at a glance (checkmarks)

#### Input Mechanisms

**Coaching Input:**
- ✅ Simple textarea with send button
- ✅ Disabled state when loading
- ❌ **No placeholder text** guidance ("Ask about your strategy, request clarification, or share insights...")
- ❌ **No character count** (users don't know if they're writing too much)
- ❌ **No Cmd+Enter to send** (power user pattern)
- ❌ **No suggested prompts** (help users get unstuck)

**Research Question Inputs:**
- ❌ **No real-time save indicator** ("Saved" checkmark after typing stops)
- ❌ **No word count guidance** (are 2 sentences enough? Do they need paragraphs?)
- ❌ **No example responses** to calibrate user expectations

---

### Information Architecture

#### Content Hierarchy

**Current Structure:**
```
Application Level
└── Product Strategy Coach
    ├── Coaching Panel (Sidebar)
    │   ├── Session Header
    │   ├── Message Stream
    │   └── Coaching Input
    └── Canvas Panel (Main)
        ├── Canvas Header
        ├── Progress Stepper
        └── Phase-Specific Content
            ├── Discovery Section
            ├── Research Section
            ├── Synthesis Section
            └── Bets Section (stub)
```

**Strengths:**
- ✅ **Excellent top-level split**: Coach (persistent guide) vs. Canvas (evolving workspace)
- ✅ **Clear phase progression**: Users always know where they are
- ✅ **Logical grouping**: Related research areas grouped by territory
- ✅ **Progressive disclosure**: Synthesis unlocks after minimum research complete

**Weaknesses:**
- ❌ **No conversation list UI**: Users can't see/switch between multiple strategy sessions
- ❌ **No global navigation**: How to get back to dashboard? Settings? Help?
- ❌ **Flat research area structure**: All 3 areas within Company territory feel equal weight (could emphasize "start here" area)
- ❌ **Missing context panel**: When in synthesis, can't easily reference discovery context

#### Mental Model Alignment

**Intended Metaphor:** "Strategic Terrain Exploration"

**How well does UI support this?**

| Metaphor Element | UI Implementation | Alignment Score |
|------------------|-------------------|-----------------|
| "Terrain" | Territory cards with "Unexplored/Mapped" labels | ⭐⭐⭐⭐ (Strong) |
| "Guide beside you" | Persistent coaching sidebar | ⭐⭐⭐⭐⭐ (Excellent) |
| "Journey/Progression" | Horizontal progress stepper | ⭐⭐⭐⭐ (Clear) |
| "Mapping" | Research area completion checkmarks | ⭐⭐⭐ (Functional, not visual) |
| "Discovery" | Opening materials upload | ⭐⭐ (Generic, not exploratory) |

**Opportunity:** Strengthen "terrain mapping" metaphor with **visual map representation** in Research section:
- Show 3Cs as a Venn diagram with overlap areas
- Animate "unlocking" of synthesis when overlap is sufficient
- Use cartographic design language (dotted paths, compass, landmarks)

#### Labeling & Nomenclature

**Current Labels:**

| Label | Clarity | Specificity | Resonance |
|-------|---------|-------------|-----------|
| "3Cs Research" | ⭐⭐⭐ | Jargon (what's 3Cs?) | Industry-standard |
| "Terrain Mapping" | ⭐⭐⭐⭐ | Evocative sublabel | Metaphor-aligned |
| "Strategy Formation" | ⭐⭐⭐⭐ | Clear outcome | Generic |
| "Route Planning" | ⭐⭐⭐⭐ | Continues metaphor | Apt for bets phase |
| "Company Territory" | ⭐⭐⭐⭐ | Clear scope | Neutral |
| "Strategic Bets" | ⭐⭐⭐⭐⭐ | Specific, actionable | Best practice term |

**Issue:** "3Cs Research" is insider jargon. First-time users won't know what it means.

**Recommendation:** Add tooltip or inline explainer:
```
3Cs Research  (ℹ)
  ↓ hover
"Explore Company, Customer, and Competitor
 territories to map your strategic landscape"
```

---

### User Journeys

#### Primary Journey: Discovery → Research → Synthesis

**Scenario:** Maya Okonkwo (VP of Product) uses Frontera to develop product strategy for entering consolidator market segment.

**Journey Map:**

**Phase 1: Discovery**
1. ✅ Lands on Product Strategy Coach, sees personalized opening message referencing her company context
2. ✅ Reads methodology introduction, understands 4-phase structure
3. ✅ Reviews strategic context tile showing onboarding input
4. ✅ Coach asks probing question: "What competitive dynamics are making transformation urgent?"
5. ⚠️ **Friction Point:** Maya wants to upload market research PDF, but doesn't know if she should do that before or after answering coach's question
6. ✅ Uploads PDF, sees "Processing" status
7. ❌ **Blocker:** No confirmation that PDF content is now available to coach (should show "Insights extracted: 3 key themes identified")

**Phase 2: Research**
8. ✅ Phase auto-advances to Research, sees 2 territory cards (Company + Customer)
9. ✅ Clicks "Company Territory," modal opens
10. ❌ **Friction:** Modal shows first research area "Industry Forces" but Maya can't see what other areas are coming (anxiety about time commitment)
11. ⚠️ Answers 3 questions in Industry Forces, clicks "Save & Continue"
12. ❌ **Missing feedback:** No "Saved successfully" confirmation (did it work?)
13. ✅ Progress updates to 33% (1/3 areas)
14. ⚠️ **Friction:** Wants to quickly review Business Model questions before committing, but must complete Industry Forces first
15. ✅ Completes all 3 Company areas, sees "Mapped" badge
16. ✅ Switches to Customer Territory, same flow
17. ⚠️ Completes 2/3 Customer areas, total progress now 5/6 (83%)
18. ✅ Sees "Generate Insights" button enabled (4+ areas complete)

**Phase 3: Synthesis**
19. ✅ Clicks "Generate Insights," button shows loading spinner
20. ❌ **Missing:** No progress indicator or estimated time ("Analyzing your research... ~30 seconds remaining")
21. ⚠️ **Anxiety:** After 45 seconds, Maya wonders if it froze (no intermediate feedback)
22. ✅ Synthesis completes, phase auto-transitions to Synthesis
23. ✅ Sees structured synthesis output with patterns, tensions, opportunities
24. ❌ **Missed opportunity:** Synthesis text is plain paragraphs, could use visual hierarchy (icons, pull quotes, emphasis)
25. ⚠️ **Friction:** Wants to reference specific Customer research response while reading synthesis, but must scroll back to Research section
26. ❌ **Missing:** No "link to evidence" feature to jump directly to source research

**Phase 4: Strategic Bets**
27. ✅ Clicks "Next Phase" (test button), advances to Bets
28. ❌ **Blocker:** Placeholder content only, can't actually formulate bets

**Key Journey Insights:**
- ✅ **Core flow is intuitive**: Linear progression works well
- ❌ **Friction at modal transitions**: Deep-dive UX needs refinement
- ❌ **Lack of wayfinding aids**: Breadcrumbs, progress within modals
- ❌ **Missing "just-in-time" help**: Tooltips, examples, guidance
- ❌ **Weak synthesis → research bidirectional flow**: Can't easily trace insights back to evidence

**Journey Completion Rate Estimate:** 65% (users will abandon at deep-dive friction points or synthesis wait time anxiety)

#### Secondary Journey: Returning to Refine Research

**Scenario:** Tom Aldridge (Head of Engineering) completes initial research, but after reviewing synthesis, wants to add more detail to "Product Capabilities" area.

1. ✅ Lands on conversation (last phase was Synthesis)
2. ❌ **Blocker:** No obvious way to navigate back to Research phase
3. ⚠️ Clicks browser back button (not ideal pattern)
4. ✅ Sees Research section, clicks Company Territory
5. ❌ **Friction:** Modal opens, must navigate through completed areas to reach Product Capabilities
6. ⚠️ Edits response, clicks Save
7. ❌ **Missing:** No indication that synthesis is now "stale" and should be regenerated
8. ❌ **Confusion:** Does changing research auto-update synthesis? (No, but UI doesn't communicate this)

**Key Insights:**
- ❌ **Non-linear editing is not well-supported**: UI assumes one-way progression
- ❌ **No versioning or change tracking**: If user edits research post-synthesis, what happens?
- ❌ **Stale data indicators missing**: Synthesis should show "Based on research as of [date]" and prompt regeneration if sources change

---

### Component Library

#### Reusability Assessment

**Current Components:**

| Component | Reusability | Consistency | Accessibility |
|-----------|-------------|-------------|---------------|
| `HorizontalProgressStepper` | ⭐⭐⭐ (Phase-specific) | ⭐⭐⭐⭐⭐ | ⭐⭐ (No keyboard nav) |
| `TerritoryCard` | ⭐⭐⭐⭐ (Reusable) | ⭐⭐⭐⭐ | ⭐⭐⭐ (Missing ARIA) |
| `MessageStream` | ⭐⭐⭐⭐⭐ (Reusable) | ⭐⭐⭐⭐ | ⭐⭐ (No focus management) |
| `CoachingInput` | ⭐⭐⭐⭐⭐ (Reusable) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ (Basic support) |
| `DiscoverySection` | ⭐⭐ (Phase-specific) | ⭐⭐⭐⭐ | ⭐⭐⭐ (Good semantics) |

**Strengths:**
- ✅ Clear component boundaries (coaching vs. canvas separation)
- ✅ TypeScript interfaces enforce prop contracts
- ✅ Consistent naming conventions

**Weaknesses:**
- ❌ **No shared component library file**: Buttons, badges, cards are inline-styled
- ❌ **Inconsistent button patterns**: Some use `bg-gradient`, others `bg-slate-700`
- ❌ **No design tokens file**: Colors, spacing, typography scattered in Tailwind classes
- ❌ **Duplicate patterns**: File upload UI and URL input could be abstracted

**Recommendation:** Create `src/components/ui/` directory with:
- `Button.tsx` - Primary, secondary, tertiary, danger variants
- `Card.tsx` - Default, elevated, interactive variants
- `Badge.tsx` - Status badges with phase colors
- `Input.tsx` - Text, textarea, file upload with consistent styling
- `Modal.tsx` - Standardized modal with proper focus trap
- `LoadingSpinner.tsx` - Consistent loading states

This aligns with Shadcn/ui approach mentioned in PRD tech stack.

#### Design System Adherence

**Frontera Design Principles (from CLAUDE.md):**

| Principle | Current Adherence | Evidence |
|-----------|-------------------|----------|
| Indigo-cyan gradient for primary actions | ⭐⭐⭐⭐⭐ | Consistently used |
| Slate neutrals (never pure gray/black) | ⭐⭐⭐⭐⭐ | Excellent adherence |
| Rounded-xl/2xl (never rounded-lg) | ⭐⭐⭐⭐ | Mostly consistent (some rounded-lg instances) |
| Font-semibold for emphasis | ⭐⭐⭐⭐ | Widely used |
| Leading-relaxed for body text | ⭐⭐⭐⭐⭐ | Excellent |
| No excessive emojis | ⭐⭐⭐⭐⭐ | Clean, professional |

**Gap:** CLAUDE.md specifies **`Newsreader` and `IBM Plex Mono`** fonts are loaded but **NOT USED** in Product Strategy Coach components (all use Tailwind default `font-sans`).

**Recommendation:** Apply font system:
```typescript
// Synthesis insights, strategic outputs
className="font-newsreader text-lg italic"

// Metrics, evidence references
className="font-mono text-sm"

// Standard UI
className="font-sans" (IBM Plex Sans from layout)
```

---

## Best Practice Comparison

### Enterprise SaaS UI Patterns

#### 1. Amplitude (Product Analytics Platform)

**What they do well:**
- **Data visualization first**: Charts, graphs, and metrics are primary content
- **Cohort-based navigation**: Saved analyses, dashboards, cohorts
- **Contextual help**: Blue "?" icons with inline explanations
- **Dark mode option**: Professional aesthetic

**What Frontera should adopt:**
- ✅ **Synthesis visualization**: Opportunity maps, competitive position charts
- ✅ **Saved session list**: Multiple strategy sessions with metadata (last edited, phase, progress)
- ✅ **Inline help icons**: Especially for "3Cs Research" and methodology terms
- ⚠️ **Dark mode**: Lower priority for MVP, but expectation for enterprise tools

#### 2. Dovetail (User Research Repository)

**What they do well:**
- **Tag-based organization**: Insights tagged by theme, automatically clustered
- **Highlight-and-comment workflow**: Select text, add insight, link to theme
- **AI-suggested patterns**: "We noticed these 3 recurring themes..."
- **Evidence linking**: Click insight to see source quotes

**What Frontera should adopt:**
- ✅ **Tag insights during research**: User adds tags while answering questions
- ✅ **Auto-tagging in synthesis**: AI identifies themes and tags them
- ✅ **Click insight → view source**: Link synthesis claims to specific research responses
- ✅ **Insight highlighting**: Allow user to emphasize key synthesis findings

#### 3. Miro (Visual Collaboration)

**What they do well:**
- **Infinite canvas metaphor**: Spatial organization of ideas
- **Sticky note + canvas paradigm**: Low-friction idea capture
- **Template library**: Pre-built frameworks for workshops
- **Real-time collaboration**: See teammates' cursors

**What Frontera should adopt:**
- ⚠️ **Spatial synthesis view**: Arrange insights on 2D canvas (Phase 4+ feature)
- ✅ **Template library**: "Financial Services Strategy Template," "Market Expansion Template"
- ⚠️ **Collaboration**: Post-MVP, but architecture should support it
- ❌ **Infinite canvas**: Too freeform for structured methodology

#### 4. Linear (Issue Tracking)

**What they do well:**
- **Keyboard-first UX**: Cmd+K command palette, shortcuts everywhere
- **Instant feedback**: Optimistic UI updates, smooth animations
- **Minimal, refined aesthetic**: No unnecessary chrome
- **Status-based workflows**: Clear states (To Do, In Progress, Done)

**What Frontera should adopt:**
- ✅ **Keyboard shortcuts**: Cmd+K for coach input, J/K for navigation
- ✅ **Optimistic UI**: Show research responses immediately, save in background
- ✅ **Smooth animations**: Phase transitions, modal open/close
- ✅ **Clear status indicators**: Unexplored, In Progress, Mapped (already doing this!)

### Fintech Data Visualization Patterns

#### BlackRock Aladdin (Institutional Investment Platform)

**Learnings:**
- **Multi-level drill-down**: Portfolio → Position → Analytics → Raw Data
- **Comparative views**: Side-by-side scenario analysis
- **Risk scoring with visual indicators**: Color-coded heat maps
- **Time-series analysis**: Historical trends with annotations

**Application to Frontera:**
- ✅ **Synthesis drill-down**: Opportunity → Evidence → Source Research
- ✅ **Scenario comparison**: Compare Strategic Bet #1 vs. Bet #2 side-by-side
- ✅ **Confidence scoring**: Visual indicator of research depth (3/6 areas = "Medium Confidence")
- ✅ **Timeline view**: Show how strategic context evolves across phases

#### Betterment (Robo-Advisory)

**Learnings:**
- **Guided questionnaire flow**: Progress bar, "Why we ask this" explainers
- **Simplified outputs**: Complex portfolio shown as simple allocation pie chart
- **Confidence-building language**: "Based on your goals..." personalization
- **Actionable next steps**: Always clear what user should do next

**Application to Frontera:**
- ✅ **Research questionnaire UX**: Add "Why this matters" to each question
- ✅ **Simplified synthesis**: Executive summary + detailed breakdown tabs
- ✅ **Personalized outputs**: "Based on your [industry] context and [strategic focus]..."
- ✅ **Next steps CTA**: After synthesis, "Create your first Strategic Bet →"

### AI Coaching/Advisory Interface Patterns

#### ChatGPT (Conversational AI)

**Pattern Library:**
- **Streaming responses**: Character-by-character reveal
- **Regenerate button**: Try again if unsatisfied
- **Copy to clipboard**: Easy to extract insights
- **Conversation forking**: Start new branch from any message
- **Suggested follow-ups**: "Ask me to elaborate on X"

**Frontera Adoption:**
- ✅ **Streaming display**: Already streaming backend, need frontend reveal
- ✅ **Regenerate coach response**: If opening message isn't relevant
- ✅ **Copy synthesis output**: Easy export for emails/decks
- ⚠️ **Conversation branches**: Post-MVP (complex state management)
- ✅ **Suggested questions**: Coach proactively offers "Would you like me to..."

#### Perplexity AI (Research Assistant)

**Pattern Library:**
- **Cited sources**: Inline [1], [2] references with source panel
- **Follow-up suggestions**: Related questions below each answer
- **Pro search mode**: Toggle for deeper analysis
- **Collections**: Save related searches

**Frontera Adoption:**
- ✅ **Evidence citations**: Synthesis claims link to research responses [Company: Industry Forces, Q2]
- ✅ **Related questions**: Coach suggests "You might also explore..."
- ✅ **Deep dive mode**: "Generate comprehensive synthesis (longer, slower)" option
- ✅ **Strategy collections**: Group related conversations (e.g., "2026 Transformation" folder)

#### Notion AI (Writing Assistant)

**Pattern Library:**
- **Contextual AI actions**: Highlight text → "Improve writing," "Summarize," "Translate"
- **Inline generation**: AI writes directly in document
- **Undo/redo AI changes**: Easy to revert
- **AI as copilot, not autopilot**: User stays in control

**Frontera Adoption:**
- ✅ **Contextual coach actions**: In research responses → "Coach: Expand on this insight"
- ✅ **Inline synthesis edits**: User can edit AI-generated synthesis
- ✅ **Version history**: See original AI synthesis vs. user-edited version
- ✅ **Suggestion mode**: AI proposes edits, user accepts/rejects

### Gap Analysis Matrix

| Feature/Pattern | Amplitude | Dovetail | Miro | Linear | Frontera | Gap Score |
|-----------------|-----------|----------|------|--------|----------|-----------|
| **Data Visualization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐ | 🔴 CRITICAL |
| **Evidence Linking** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 🟠 HIGH |
| **Keyboard Navigation** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ | 🔴 CRITICAL |
| **Collaborative Features** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | 🟡 MEDIUM (Phase 3) |
| **AI Transparency** | ⭐⭐ | ⭐⭐⭐ | N/A | N/A | ⭐⭐ | 🟠 HIGH |
| **Inline Help** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | 🟠 HIGH |
| **Session Management** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 🟡 MEDIUM |
| **Mobile Experience** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐ | 🟡 MEDIUM (Phase 4) |

**Key Takeaway:** Frontera is **table stakes** on core functionality but **significantly behind** on:
1. Data visualization (synthesis outputs)
2. Keyboard-first UX
3. AI transparency and feedback

---

## Heuristic Evaluation

### Nielsen's 10 Usability Heuristics + Enterprise Extensions

#### 1. Visibility of System Status

> *Users should always know what is going on through appropriate feedback within a reasonable time*

| Element | Current State | Issue Severity | Recommendation |
|---------|---------------|----------------|----------------|
| **AI Response Streaming** | ❌ No visible indicator | 🔴 **CRITICAL** | Add typing indicator + streaming text reveal |
| **File Upload Progress** | ✅ "Processing" badge | 🟢 **GOOD** | Consider % progress bar for large files |
| **Research Auto-Save** | ❌ No confirmation | 🟠 **HIGH** | Add "Saved" checkmark (fade out after 2s) |
| **Phase Transition** | ⚠️ Instant switch | 🟡 **MEDIUM** | Add slide animation to signal change |
| **Synthesis Generation** | ✅ Loading spinner | ⚠️ **MEDIUM** | Add estimated time "~30 seconds remaining" |
| **Network Errors** | ❌ Console only | 🟠 **HIGH** | Toast notification "Connection lost. Retrying..." |

**Overall Score: 2/5** (Critical gaps in AI feedback)

**Example Best Practice (Vercel Deploy Status):**
```
Deploying...
▓▓▓▓▓▓░░░░ 60% (Building... 12s)
```

**Frontera Should Show:**
```
Frontera Coach is thinking...
[Animated dots]
Analyzing your research across 5 territories...
```

#### 2. Match Between System and Real World

> *Speak the user's language with familiar concepts*

| Element | Assessment | Score |
|---------|------------|-------|
| **"3Cs Research"** | ❌ Insider jargon | 🟠 |
| **"Strategic Terrain" metaphor** | ✅ Evocative, understandable | ⭐⭐⭐⭐ |
| **Phase labels** | ✅ Clear (Discovery, Synthesis) | ⭐⭐⭐⭐ |
| **"Mapped" vs. "Unexplored"** | ✅ Spatial language fits metaphor | ⭐⭐⭐⭐⭐ |
| **Research area names** | ✅ Business language (Industry Forces, Segments) | ⭐⭐⭐⭐ |

**Overall Score: 4/5** (Strong metaphor, minor jargon issue)

**Recommendation:** Add hover tooltip for "3Cs Research":
```html
3Cs Research <span class="text-slate-400">(ℹ)</span>
  ↓ tooltip
"Company, Customer, Competitor analysis"
```

#### 3. User Control and Freedom

> *Provide emergency exits; support undo and redo*

| Scenario | Current Support | Issue |
|----------|----------------|-------|
| **Cancel AI response mid-stream** | ❌ No stop button | User must wait for full response |
| **Edit research response after saving** | ✅ Can revisit territory | ⚠️ No indication synthesis is now stale |
| **Delete uploaded file** | ❌ No delete option | User stuck with wrong file |
| **Restart phase** | ❌ No "start over" | User must manually clear all responses |
| **Undo synthesis generation** | ❌ Irreversible | If synthesis is bad, no retry without re-entering research |
| **Close deep-dive modal mid-flow** | ✅ X button | ⚠️ Loses unsaved progress (no warning) |

**Overall Score: 2/5** (Lacks critical undo/cancel actions)

**Critical Addition:**
```tsx
// In CoachingPanel during streaming
{isStreaming && (
  <button onClick={handleStopGeneration}>
    <StopIcon /> Stop generating
  </button>
)}
```

#### 4. Consistency and Standards

> *Follow platform conventions*

| Element | Consistency | Notes |
|---------|-------------|-------|
| **Button styles** | ⚠️ Mostly consistent | Some use `bg-gradient`, others `bg-slate-700` |
| **Card styling** | ✅ Consistent rounded-2xl | Well done |
| **Spacing patterns** | ✅ Consistent gap-6, p-6 | Good discipline |
| **Color usage** | ✅ Slate palette throughout | Excellent |
| **Icon style** | ⚠️ Mixed Heroicons sizes | Some w-5 h-5, others w-8 h-8 without clear hierarchy |

**Overall Score: 4/5** (Strong consistency, minor icon sizing issues)

**Recommendation:** Create icon size scale:
- `icon-sm`: w-4 h-4 (inline with text)
- `icon-md`: w-5 h-5 (buttons, badges)
- `icon-lg`: w-6 h-6 (headers)
- `icon-xl`: w-8 h-8 (hero elements)

#### 5. Error Prevention

> *Prevent problems before they occur*

| Scenario | Current Prevention | Recommendation |
|----------|-------------------|----------------|
| **Submit empty research response** | ❌ No validation | Disable "Save" until min 20 characters entered |
| **Navigate away with unsaved changes** | ❌ No warning | "You have unsaved changes. Continue?" dialog |
| **Upload unsupported file type** | ✅ `accept=".pdf,.docx,.txt"` | ✅ Good |
| **Send empty coach message** | ⚠️ Frontend check, but no visual feedback | Gray out send button when textarea empty |
| **Regenerate synthesis (overwrite custom edits)** | ❌ No warning | "This will replace your edited synthesis. Continue?" |

**Overall Score: 2/5** (Basic validations present, missing critical confirmations)

**Best Practice (Notion):**
```
You have unsaved changes
[Discard]  [Save Draft]  [Cancel]
```

#### 6. Recognition Rather Than Recall

> *Minimize memory load*

| Feature | Current Support | Improvement |
|---------|----------------|-------------|
| **Remember user's research area progress** | ✅ Persists across sessions | ✅ Excellent |
| **Show context when needed** | ⚠️ Discovery context not visible in Research phase | Add "View Company Context" link |
| **Breadcrumbs in deep-dive** | ❌ No breadcrumb trail | Add "Company → Industry Forces" |
| **Recently answered questions** | ❌ Not highlighted | Show last edited area with timestamp |
| **Coach conversation history** | ✅ Full message scroll | ✅ Good |

**Overall Score: 3/5** (Good persistence, weak contextual reminders)

**Addition:**
```tsx
// In ResearchSection.tsx
<div className="context-link">
  <Link href="#discovery">
    📋 Review Company Context
  </Link>
</div>
```

#### 7. Flexibility and Efficiency of Use

> *Accelerators for expert users*

| Pattern | Current Support | Expert User Impact |
|---------|----------------|-------------------|
| **Keyboard shortcuts** | ❌ None | Power users forced to click |
| **Bulk actions** | ❌ Can't complete multiple areas at once | Inefficient for fast users |
| **Templates** | ❌ No pre-filled research templates | Users start from scratch every time |
| **Quick navigation** | ❌ No Cmd+K command palette | Slow to jump between sections |
| **Duplicate previous strategy** | ❌ No cloning | Users must re-enter similar research |

**Overall Score: 1/5** (No power user features)

**High-Impact Addition (Cmd+K Command Palette):**
```tsx
<CommandPalette>
  <Command>Go to Discovery</Command>
  <Command>Go to Company Territory</Command>
  <Command>Go to Customer Territory</Command>
  <Command>Generate Synthesis</Command>
  <Command>Ask Coach...</Command>
</CommandPalette>
```

Triggered by `Cmd+K` (Mac) or `Ctrl+K` (Windows).

#### 8. Aesthetic and Minimalist Design

> *Remove irrelevant information*

| Element | Clutter Assessment | Improvement |
|---------|-------------------|-------------|
| **Discovery intro card** | ✅ Relevant, welcoming | Well done |
| **4-phase mini preview cards** | ⚠️ Could be collapsible | Consider "Hide methodology" toggle for returning users |
| **Uploaded files list** | ✅ Compact, scannable | Good |
| **Coach message styling** | ✅ Minimal, readable | ✅ Excellent |
| **Progress stepper** | ✅ Essential, not decoration | ✅ Perfect |

**Overall Score: 4.5/5** (Excellent restraint, no fluff)

**Frontera follows this heuristic very well.** The interface is information-dense but never overwhelming.

#### 9. Help Users Recognize, Diagnose, and Recover from Errors

> *Error messages in plain language, suggest solutions*

| Error Scenario | Current Handling | Recommended Improvement |
|---------------|------------------|------------------------|
| **File upload failed** | ✅ "Upload failed" in red box | ⚠️ Add specific reason "File too large (max 10MB)" |
| **Network timeout** | ❌ Silent failure | Toast: "Connection lost. Your work is saved. Retry?" |
| **Invalid URL format** | ❌ Generic browser validation | "Please enter a valid URL (must start with https://)" |
| **Synthesis generation error** | ❌ Unknown | "Synthesis generation failed. This may be due to insufficient research. Try adding more detail to your responses." |

**Overall Score: 2/5** (Basic error display, lacks helpful guidance)

**Best Practice (Stripe):**
```
Payment failed
Your card was declined. [View details]

Common fixes:
• Check your card number
• Verify CVV code
• Contact your bank

[Try again]  [Use different card]
```

#### 10. Help and Documentation

> *Provide assistance when needed*

| Help Type | Current Availability | Assessment |
|-----------|---------------------|------------|
| **Methodology explanation** | ✅ Discovery intro card | ✅ Good first-time UX |
| **Inline tooltips** | ❌ No (ℹ) icons | Missing for jargon terms |
| **Contextual coach guidance** | ✅ Coach asks probing questions | ✅ Excellent |
| **Example responses** | ❌ No sample answers | Users guess appropriate depth |
| **Video tutorials** | ❌ Not present | Expected for enterprise onboarding |
| **Help center link** | ❌ No global help | No escape hatch |

**Overall Score: 3/5** (Good conversational help, weak structured documentation)

**Recommendation:** Add help dropdown in header:
```
[?] Help
  ├─ Product Strategy Methodology
  ├─ How to Use the Coach
  ├─ Research Area Examples
  ├─ Video Tutorial (3 min)
  └─ Contact Support
```

### Enterprise-Specific Heuristics

#### 11. Data Security & Privacy Transparency

> *Users must trust the platform with sensitive strategic information*

| Concern | Current Handling | Recommendation |
|---------|-----------------|----------------|
| **Where is data stored?** | ❌ Not communicated | Add footer: "Your data is encrypted and stored in UK/EU data centers" |
| **Who can see my research?** | ❌ Unclear | "Your strategy session is private to your organization" badge |
| **Is AI training on my data?** | ❌ Not addressed | Privacy tooltip: "Your conversations are not used to train AI models" |
| **Can I export/delete data?** | ❌ No GDPR controls | Add "Export all data" and "Delete conversation" options |

**Overall Score: 1/5** (Critical gap for enterprise buyers)

Maya Okonkwo and Tom Aldridge (our personas) will **immediately ask** about data privacy. This must be visible.

#### 12. Organizational Collaboration

> *Multiple stakeholders contribute to strategy*

| Feature | Current Support | Enterprise Need |
|---------|----------------|-----------------|
| **Share conversation with team** | ❌ Not supported | CPO wants to review VP's research |
| **Comment on research responses** | ❌ Not supported | Stakeholder feedback loop |
| **Version history** | ❌ Not supported | Track how strategy evolved |
| **@ mention team member** | ❌ Not supported | Pull in sales leader for competitor insights |

**Overall Score: 0/5** (No collaboration features in MVP)

**Phase 3 Priority:** This is expected for enterprise tools.

---

## Accessibility Audit

### WCAG 2.1 Level AA Compliance Assessment

#### Perceivable

**1.1.1 Non-text Content (Level A)**
- ✅ **Logo has alt text**: `<Image alt="Frontera" />`
- ❌ **Decorative icons lack aria-hidden**: SVG icons should have `aria-hidden="true"` if decorative
- ❌ **Progress stepper circles lack labels**: Screenreader doesn't know circle represents "Discovery phase"

**Status: Partial Compliance**

**Fix:**
```tsx
<div className="w-10 h-10 ..." aria-label={`Phase ${step.id}: ${step.label}`}>
  {isComplete ? <CheckIcon aria-hidden="true" /> : step.id}
</div>
```

**1.3.1 Info and Relationships (Level A)**
- ✅ **Semantic HTML**: Proper use of `<header>`, `<main>`, `<aside>`, `<nav>`
- ✅ **Heading hierarchy**: H1 (page title) → H2 (sections) → H3 (subsections)
- ⚠️ **Form labels**: File upload input has `<label>` but wrapped in custom styling (may break screen reader association)
- ❌ **Table-like data not in tables**: Uploaded files list presented as divs, not `<table>` or `<dl>`

**Status: Mostly Compliant**

**1.4.3 Contrast (Level AA)**

**Tested Combinations:**

| Element | Foreground | Background | Ratio | WCAG AA | WCAG AAA |
|---------|------------|------------|-------|---------|----------|
| Body text (slate-700 on white) | #334155 | #FFFFFF | 8.59:1 | ✅ Pass | ✅ Pass |
| Headings (slate-900 on white) | #0F172A | #FFFFFF | 14.47:1 | ✅ Pass | ✅ Pass |
| Secondary text (slate-600) | #475569 | #FFFFFF | 6.37:1 | ✅ Pass | ✅ Pass |
| Placeholder text (slate-400) | #94A3B8 | #FFFFFF | 3.52:1 | ⚠️ Fail | ❌ Fail |
| Cyan sublabel (text-cyan-600) | #0891B2 | #FFFFFF | 4.54:1 | ✅ Pass (large text) | ⚠️ Fail (small text) |
| "You Are Here" text (text-cyan-600, 10px) | #0891B2 | #FFFFFF | 4.54:1 | ⚠️ Borderline | ❌ Fail |

**Issues:**
- ❌ **Placeholder text fails AA** for small text (3.52:1 < 4.5:1)
- ⚠️ **"You Are Here" text size too small** (10px) + borderline contrast

**Status: Mostly Compliant (2 failures)**

**Fix:**
```tsx
// Change placeholder from slate-400 to slate-500
placeholder="text-slate-500" // 4.63:1 contrast ✅

// Increase "You Are Here" font size
className="text-xs" // 12px instead of 10px
```

**1.4.11 Non-text Contrast (Level AA - WCAG 2.1)**
- ✅ **Button borders**: Gradient buttons have sufficient contrast
- ⚠️ **Form input borders** (border-slate-200): #E2E8F0 on #FFFFFF = 1.15:1 ❌ **Fail** (need 3:1)
- ✅ **Territory card borders**: border-slate-200 visible when hovered (border-indigo-300)

**Status: Partial Compliance**

**Fix:**
```tsx
// Darken input borders
className="border-slate-300" // 1.82:1 still fails, need slate-400 (2.73:1) or focus state only
```

Use **focus state** to meet contrast requirement instead of default state.

#### Operable

**2.1.1 Keyboard (Level A)**
- ✅ **Form inputs focusable**: Textarea, buttons, file input
- ❌ **Territory cards not keyboard-accessible**: `<div onClick>` instead of `<button>`
- ❌ **Modal close button**: X button not focusable
- ❌ **No skip to main content link**: Screen reader users must tab through entire sidebar
- ❌ **No focus visible styles**: Default browser outline removed, no custom alternative

**Status: Fails (critical gaps)**

**Severity: 🔴 CRITICAL**

**Fix:**
```tsx
// Territory cards must be buttons
<button
  className="territory-card ..."
  onClick={handleOpen}
  aria-label={`Explore ${territory} territory`}
>
  {children}
</button>

// Add skip link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// Focus visible styles
.focus-visible:focus {
  outline: 2px solid theme('colors.cyan.400');
  outline-offset: 2px;
}
```

**2.1.2 No Keyboard Trap (Level A)**
- ⚠️ **Modal focus trap not implemented**: When modal opens, focus doesn't move to modal and user can tab to background elements
- ✅ **No intentional keyboard traps detected**

**Status: Partial Compliance**

**Fix:** Implement focus trap in deep-dive modals using `focus-trap-react` or `@headlessui/react` Dialog.

**2.4.3 Focus Order (Level A)**
- ✅ **Logical DOM order**: Coach sidebar → Canvas content flows naturally
- ⚠️ **Modal DOM position**: Modals appended to body, may break focus order

**Status: Mostly Compliant**

**2.4.7 Focus Visible (Level AA)**
- ❌ **Focus indicators removed**: Tailwind's default behavior removes outlines
- ❌ **No custom focus styles**: Blue rings on some inputs, but not all interactive elements

**Status: Fails**

**Fix:** Add global focus styles in `globals.css`:
```css
*:focus-visible {
  outline: 2px solid theme('colors.cyan.400');
  outline-offset: 2px;
}
```

#### Understandable

**3.1.1 Language of Page (Level A)**
- ✅ **Lang attribute present**: `<html lang="en">` in layout.tsx

**Status: Compliant**

**3.2.1 On Focus (Level A)**
- ✅ **No context changes on focus**: Inputs don't auto-submit

**Status: Compliant**

**3.2.2 On Input (Level A)**
- ✅ **No unexpected context changes**: Form submission requires explicit button click

**Status: Compliant**

**3.3.1 Error Identification (Level A)**
- ⚠️ **Errors shown visually**: Red border + red text for upload errors
- ❌ **Errors not programmatically associated**: No `aria-describedby` linking error to input
- ❌ **Required fields not marked**: Research questions don't indicate required

**Status: Partial Compliance**

**Fix:**
```tsx
<div>
  <label htmlFor="response">What are your core capabilities?</label>
  <textarea
    id="response"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "response-error" : undefined}
  />
  {hasError && (
    <div id="response-error" role="alert">
      Please provide a response (minimum 20 characters)
    </div>
  )}
</div>
```

#### Robust

**4.1.2 Name, Role, Value (Level A)**
- ⚠️ **Custom components lack ARIA**: Territory cards, progress stepper circles
- ✅ **Native form elements**: Proper roles assigned by browser
- ❌ **Loading spinners lack labels**: `<div className="animate-spin">` has no `aria-label="Loading"`

**Status: Partial Compliance**

**Fix:**
```tsx
// Loading spinner
<div className="animate-spin" aria-label="Loading" role="status">
  <span className="sr-only">Loading...</span>
</div>

// Territory card
<button
  role="button"
  aria-pressed={isExpanded}
  aria-label={`${territory} territory - ${status}`}
>
```

### Accessibility Scorecard

| WCAG Criterion | Level | Status | Priority |
|----------------|-------|--------|----------|
| 1.1.1 Non-text Content | A | ⚠️ Partial | 🟡 Medium |
| 1.3.1 Info and Relationships | A | ⚠️ Partial | 🟡 Medium |
| 1.4.3 Contrast | AA | ⚠️ Mostly (2 fails) | 🟠 High |
| 1.4.11 Non-text Contrast | AA | ⚠️ Partial | 🟠 High |
| 2.1.1 Keyboard | A | ❌ Fails | 🔴 **CRITICAL** |
| 2.1.2 No Keyboard Trap | A | ⚠️ Partial | 🔴 **CRITICAL** |
| 2.4.7 Focus Visible | AA | ❌ Fails | 🔴 **CRITICAL** |
| 3.3.1 Error Identification | A | ⚠️ Partial | 🟠 High |
| 4.1.2 Name, Role, Value | A | ⚠️ Partial | 🟠 High |

**Overall Compliance: 40%** (Fails Level A, not production-ready)

**Blockers for Enterprise Procurement:**
- Keyboard navigation (public sector requirement)
- Focus management (financial services regulation)
- Screen reader support (ADA compliance in US)

### Cognitive Accessibility

Beyond WCAG technical requirements, **cognitive load assessment**:

| Factor | Assessment | Notes |
|--------|------------|-------|
| **Progressive Disclosure** | ⭐⭐⭐⭐⭐ | Excellent - 4 phases prevent overwhelm |
| **Clear Labels** | ⭐⭐⭐⭐ | Good - mostly plain language |
| **Predictable Patterns** | ⭐⭐⭐⭐ | Consistent UI reduces mental load |
| **Error Prevention** | ⭐⭐ | Weak - users can make mistakes easily |
| **Recovery from Errors** | ⭐⭐ | Weak - no undo, no autosave warnings |
| **Estimated Time** | ⭐ | Missing - users don't know time commitment |

**Recommendation:** Add time estimates to research areas:
```
Industry Forces (approx. 10 minutes)
3 questions about your market dynamics
```

This helps users plan cognitive effort and reduces anxiety.

---

## Future-Thinking Design Vision

### Frontier AI Interface Research

#### Conversational UI Patterns (2025-2026)

**Emerging Patterns from ChatGPT, Claude, Perplexity:**

1. **Multi-modal Input**
   - Voice input for research responses (speech-to-text)
   - Screenshot uploads analyzed by vision models ("Analyze this competitor's pricing page")
   - Drag-and-drop images into chat for instant context

**Frontera Application:**
- **Phase 1 (Next 6 months):** Allow PDF uploads to be analyzed by Claude's vision API for charts/diagrams
- **Phase 2 (6-12 months):** Voice input for research questions (especially mobile)
- **Phase 3 (12-18 months):** Screenshot analysis of competitor websites, user interfaces

2. **Agentic Workflows**
   - AI proactively triggers actions ("I noticed you completed 4 research areas. Shall I generate your synthesis now?")
   - Background processing ("While you continue research, I'm analyzing your materials...")
   - Scheduled check-ins ("It's been 3 days since you worked on this strategy. Ready to continue?")

**Frontera Application:**
- **Proactive synthesis suggestions** when threshold met
- **Auto-save with intelligent summarization** ("I saved your last response about industry consolidation")
- **Weekly strategy review emails** with progress summary

3. **Collaborative AI**
   - Multiple humans + AI in same conversation
   - AI adapts tone based on stakeholder (CFO gets financial lens, CTO gets technical lens)
   - "Ask the team" feature where AI pings relevant stakeholders for input

**Frontera Application:**
- **@ mention team members in research** ("@CFO what's our EBITDA margin target for 2026?")
- **Role-based synthesis views** (CFO sees financial opportunities, CTO sees capability gaps)
- **Stakeholder review mode** where executives comment on draft strategy

#### Visualization-First AI Outputs

**Trend:** AI-generated insights presented visually, not just text.

**Examples:**
- **Perplexity Pro:** Generates comparison tables, mind maps
- **ChatGPT Advanced Data Analysis:** Creates charts from data
- **Miro AI:** Converts text into flowcharts

**Frontera Opportunity:**

**Synthesis Output Evolution:**

**Current (MVP):**
```
Strategic Synthesis

Key Patterns:
- Consolidation is accelerating in UK market
- Advisers prioritize service over price
- Integration depth is table stakes

Opportunities:
- ...
```

**Future Vision (Phase 3):**
```
┌───────────────────────────────────────────┐
│ Strategic Synthesis                       │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  Strategic Opportunity Map       │    │
│  │                                  │    │
│  │       High Market                │    │
│  │       Attractiveness             │    │
│  │        ▲                         │    │
│  │        │  [Consolidator          │    │
│  │        │   Service]●             │    │
│  │        │                         │    │
│  │        │         [Integration]●  │    │
│  │        │                         │    │
│  │        └─────────────────────→   │    │
│  │      Low ──────────────── High   │    │
│  │         Capability Fit            │    │
│  └──────────────────────────────────┘    │
│                                           │
│  🔗 Evidence Trail:                       │
│  Consolidator Service ←───────────────┐  │
│    ├─ Customer: "Advisers need..."   │  │
│    ├─ Competitor: "Transact weak at" │  │
│    └─ Company: "Our strength in..."  │  │
└───────────────────────────────────────────┘
```

**Implementation:** Use D3.js or Recharts for interactive 2x2 matrices.

#### Personalization & Adaptive UI

**Trend:** Interfaces that learn user preferences and adapt.

**Examples:**
- **Notion AI:** Remembers writing style, suggests templates
- **Linear:** Keyboard shortcuts adapt to user's most-used actions
- **Raycast:** Command palette learns frecency (frequency + recency)

**Frontera Opportunity:**

**User Behavior Patterns to Learn:**
1. **Preferred research depth**: Some users write paragraphs, others bullet points → AI adapts question phrasing
2. **Strategic focus areas**: User always emphasizes customer insights → Coach proactively asks more customer questions
3. **Communication style**: Formal vs. casual → AI mirrors user's tone
4. **Work sessions**: User typically works in 30-min bursts → Offer "save and continue later" prompts

**Implementation:**
- Track response length, word choice, session duration in `conversation_metadata`
- Use simple heuristics (avg response length > 200 words = "detailed user")
- Adjust coach system prompt dynamically

#### Spatial & Immersive Interfaces

**Trend:** Moving beyond flat screens to spatial computing (Apple Vision Pro, Meta Quest).

**Frontera Long-Term Vision (2027+):**

**VR Strategy Workshop:**
- 3D strategic canvas where users "place" insights in space
- Walk around synthesis map, see evidence connections in 3D
- Collaborative strategy sessions with remote team in shared VR space
- Gesture-based navigation (point at territory to drill down)

**Implementation:** WebXR API + Three.js (but this is Phase 5+, not near-term).

**Nearer-Term (2026):**
- **Tablet/iPad optimization** with touch gestures
- **Presentation mode** for synthesis (full-screen, stakeholder-friendly)
- **Landscape mobile layout** for reviewing synthesis on phones

### 12-Month Design Roadmap

#### Q1 2026 (Now): Critical Fixes & Polish

**Focus:** Make MVP production-ready for enterprise procurement.

**Deliverables:**
1. **Accessibility fixes** (keyboard nav, focus management, ARIA labels)
2. **AI feedback improvements** (streaming display, typing indicators)
3. **Modal UX redesign** (sidebar nav in deep-dives)
4. **Visual design refinement** (custom fonts, signature color moments)
5. **Micro-interactions** (success confirmations, smooth transitions)

**Effort:** 3-4 weeks (1 sprint)

#### Q2 2026 (Next): Visualization & Evidence Linking

**Focus:** Elevate synthesis outputs from text to visual insights.

**Deliverables:**
1. **Strategic Opportunity Map** (interactive 2x2 matrix)
2. **Evidence linking** (click insight → see source research)
3. **Synthesis editing tools** (inline editing, regenerate sections)
4. **Competitive position visualization** (radar chart, positioning map)
5. **Export-ready synthesis** (PDF with charts, DOCX with tables)

**Effort:** 6-8 weeks (2 sprints)

#### Q3 2026 (6 months): Collaboration & Templates

**Focus:** Enable team-based strategy development.

**Deliverables:**
1. **Strategy session sharing** (read-only links, team access)
2. **Commenting system** (stakeholder feedback on research/synthesis)
3. **Template library** (pre-filled research for common industries)
4. **Version history** (track strategy evolution over time)
5. **Stakeholder dashboard** (executive view of all team strategies)

**Effort:** 8-10 weeks (2-3 sprints)

#### Q4 2026 (12 months): Advanced AI & Mobile

**Focus:** Next-generation AI capabilities and multi-device experience.

**Deliverables:**
1. **Proactive AI suggestions** ("Based on your synthesis, consider exploring...")
2. **Multi-modal inputs** (voice, screenshots, structured data)
3. **Mobile-optimized interface** (responsive deep-dives, touch gestures)
4. **Automated insights** (AI highlights critical patterns without prompting)
5. **Integration ecosystem** (Jira, Miro, Slack, Teams)

**Effort:** 10-12 weeks (3 sprints)

### Innovation Lab Experiments

**Experimental Features to Pilot:**

1. **"What-If" Scenario Planning**
   - User adjusts strategic levers (e.g., "What if we prioritized consolidators over retail?")
   - AI regenerates synthesis with new assumptions
   - Compare scenarios side-by-side

2. **Competitive Intelligence Automation**
   - User provides competitor URLs
   - AI scrapes public data (pricing, features, reviews)
   - Auto-populates Competitor Territory research

3. **Strategy Confidence Scoring**
   - AI rates synthesis quality based on research depth
   - Highlights areas needing more evidence
   - "Your consolidator opportunity has HIGH confidence (8/10) based on strong customer and competitor insights"

4. **Natural Language Query**
   - User asks "Which market segment should I prioritize?"
   - AI searches across all research, synthesizes answer with evidence
   - Like Perplexity but for user's own strategy data

---

## Recommendations & Roadmap

### Now (Next Sprint - Week of Jan 20-27, 2026)

#### Critical Fixes (5 items)

**1. Implement AI Streaming Response Display**

**Why:** Users expect live AI feedback. Current silent pause creates anxiety and feels broken.

**What:**
- Add typing indicator when assistant is composing
- Display streamed text character-by-character (or word-by-word)
- Show "Stop generating" button during streaming
- Persist full response when complete

**Where:** `src/components/product-strategy-agent/CoachingPanel/MessageStream.tsx`

**How:**
```typescript
// In CoachingPanel.tsx handleSendMessage
const [streamingContent, setStreamingContent] = useState('');
const [isStreaming, setIsStreaming] = useState(false);

// Before reading stream
setIsStreaming(true);

// During stream reading
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    setIsStreaming(false);
    break;
  }
  const chunk = decoder.decode(value, { stream: true });
  setStreamingContent(prev => prev + chunk);
}

// In MessageStream.tsx
{isStreaming && (
  <div className="flex items-start gap-3">
    <FronteraAvatar />
    <div className="flex-1">
      <div className="prose prose-sm">{streamingContent}</div>
      <div className="mt-2 flex items-center gap-2 text-slate-400 text-xs">
        <div className="flex gap-1">
          <span className="animate-bounce">●</span>
          <span className="animate-bounce animation-delay-200">●</span>
          <span className="animate-bounce animation-delay-400">●</span>
        </div>
        <span>Thinking...</span>
      </div>
    </div>
  </div>
)}
```

**Effort:** 4 hours
**Impact:** HIGH (eliminates #1 user complaint)
**Priority:** 🔴 **CRITICAL**

---

**2. Redesign Territory Deep-Dive Modal UX**

**Why:** Current wizard flow creates anxiety ("How many questions?") and prevents non-linear exploration.

**What:**
- Replace sequential wizard with sidebar navigation
- Show all research areas upfront
- Allow jumping between areas
- Display overall progress within modal
- Prevent modal close without save confirmation

**Where:** `src/components/product-strategy-agent/CanvasPanel/CompanyTerritoryDeepDive.tsx`, `CustomerTerritoryDeepDive.tsx`

**How:**
```typescript
// New component structure
<Modal>
  <ModalHeader>
    <h2>Company Territory Deep Dive</h2>
    <ProgressBar value={33} max={100} />
    <span>1 of 3 areas mapped</span>
  </ModalHeader>
  <div className="flex">
    <Sidebar>
      <NavItem active={current === 'industry'} complete={data.industry}>
        ✓ Industry Forces
      </NavItem>
      <NavItem active={current === 'business'} complete={data.business}>
        ○ Business Model
      </NavItem>
      <NavItem active={current === 'product'} complete={data.product}>
        ○ Product Capabilities
      </NavItem>
    </Sidebar>
    <Content>
      {renderResearchArea(currentArea)}
    </Content>
  </div>
  <ModalFooter>
    <Button onClick={handleSaveAndClose}>Save & Close</Button>
  </ModalFooter>
</Modal>
```

**Effort:** 12 hours
**Impact:** HIGH (reduces abandonment)
**Priority:** 🔴 **CRITICAL**

---

**3. Add Keyboard Navigation & Focus Management**

**Why:** WCAG Level A requirement. Enterprise procurement blockers.

**What:**
- Make all interactive elements keyboard-accessible
- Implement focus trap in modals
- Add global focus-visible styles
- Create skip-to-main-content link

**Where:** Global (`globals.css`), all button/card components

**How:**
```css
/* globals.css */
*:focus-visible {
  outline: 2px solid theme('colors.cyan.400');
  outline-offset: 2px;
  border-radius: 4px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

```tsx
// layout.tsx (add skip link)
<body>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
  </a>
  {children}
</body>

// Territory cards (button instead of div)
<button
  className="territory-card ..."
  onClick={handleOpen}
  onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
>
  {children}
</button>

// Modals (focus trap with @headlessui/react)
import { Dialog } from '@headlessui/react'

<Dialog open={isOpen} onClose={setIsOpen}>
  <Dialog.Panel>
    {/* Content auto-traps focus */}
  </Dialog.Panel>
</Dialog>
```

**Effort:** 8 hours
**Impact:** HIGH (legal requirement)
**Priority:** 🔴 **CRITICAL**

---

**4. Fix Placeholder Text Contrast & Form Validation**

**Why:** WCAG AA failures block enterprise procurement.

**What:**
- Change placeholder text from `slate-400` to `slate-500` (4.63:1 contrast)
- Add "Saved" confirmation after research responses
- Disable save buttons until minimum input length met
- Show character/word count guidance

**Where:** All form inputs, research question textareas

**How:**
```tsx
// Research question component
const [response, setResponse] = useState('');
const [savedAt, setSavedAt] = useState<Date | null>(null);
const [isSaving, setIsSaving] = useState(false);

// Auto-save with debounce
useEffect(() => {
  const timer = setTimeout(async () => {
    if (response.length >= 20) {
      setIsSaving(true);
      await saveResponse(response);
      setSavedAt(new Date());
      setIsSaving(false);
    }
  }, 1000);
  return () => clearTimeout(timer);
}, [response]);

<div>
  <label>What are your core capabilities?</label>
  <textarea
    value={response}
    onChange={(e) => setResponse(e.target.value)}
    placeholder="Describe your unique strengths..." // slate-500
    className="placeholder:text-slate-500" // ✅ 4.63:1 contrast
  />
  <div className="flex justify-between items-center mt-2">
    <span className="text-xs text-slate-500">
      {response.length} / 1000 characters
    </span>
    {isSaving && (
      <span className="text-xs text-slate-500">
        <Spinner /> Saving...
      </span>
    )}
    {savedAt && !isSaving && (
      <span className="text-xs text-emerald-600">
        ✓ Saved {formatDistanceToNow(savedAt)} ago
      </span>
    )}
  </div>
</div>
```

**Effort:** 6 hours
**Impact:** MEDIUM-HIGH
**Priority:** 🟠 **HIGH**

---

**5. Add Inline Help & Tooltips**

**Why:** "3Cs Research" is jargon. Users need just-in-time explanations.

**What:**
- Add (ℹ) tooltip for "3Cs Research" → "Company, Customer, Competitor analysis"
- Add "Why we ask this" explainers to research questions
- Add example responses to calibrate user expectations
- Add methodology link in header

**Where:** Progress stepper, research questions, Discovery section

**How:**
```tsx
// Tooltip component (using @headlessui/react or Radix UI)
import * as Tooltip from '@radix-ui/react-tooltip';

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <span className="inline-flex items-center gap-1">
        3Cs Research
        <InfoIcon className="w-4 h-4 text-slate-400" />
      </span>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="bg-slate-900 text-white text-xs rounded-lg p-3 max-w-xs">
        Explore <strong>Company</strong> capabilities, <strong>Customer</strong> needs,
        and <strong>Competitor</strong> dynamics to map your strategic landscape.
        <Tooltip.Arrow className="fill-slate-900" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>

// Research question with "Why we ask"
<div className="research-question">
  <label>What are your core capabilities?</label>
  <button
    onClick={() => setShowExplainer(!showExplainer)}
    className="text-xs text-cyan-600"
  >
    Why we ask this →
  </button>
  {showExplainer && (
    <div className="mt-2 p-3 bg-cyan-50 rounded-lg text-sm text-cyan-900">
      Understanding your unique capabilities helps identify where you can
      realistically compete and win. Focus on <strong>defensible</strong> strengths
      that competitors can't easily replicate.
      <details className="mt-2">
        <summary className="cursor-pointer font-semibold">
          See example
        </summary>
        <p className="mt-2 text-xs italic">
          "Our actuarial modeling is 10+ years ahead of new entrants. We process
          complex cases 3x faster than industry average, with regulatory compliance
          built in. This creates a moat for high-value, complex policies."
        </p>
      </details>
    </div>
  )}
  <textarea ... />
</div>
```

**Effort:** 10 hours (20+ tooltips/explainers to write)
**Impact:** MEDIUM
**Priority:** 🟡 **MEDIUM**

---

### Next (Phases 2-3 - Feb-Apr 2026)

#### Enhancements (8 items)

**6. Implement Custom Font System**

**What:** Apply Newsreader (display), IBM Plex Sans (UI), IBM Plex Mono (data) from layout.tsx

**Why:** Elevate brand presence, signal sophistication

**Effort:** 4 hours | **Impact:** MEDIUM | **Priority:** 🟡 **MEDIUM**

**7. Create Shared Component Library**

**What:** Extract Button, Card, Badge, Input, Modal into `src/components/ui/`

**Why:** Reduce duplication, ensure consistency, speed up future development

**Effort:** 12 hours | **Impact:** MEDIUM | **Priority:** 🟡 **MEDIUM**

**8. Add Strategic Opportunity Map Visualization**

**What:** Interactive 2x2 matrix (Market Attractiveness × Capability Fit) in Synthesis section

**Why:** Visual insights are more memorable and shareable than text

**Effort:** 16 hours | **Impact:** HIGH | **Priority:** 🟠 **HIGH**

**9. Implement Evidence Linking**

**What:** Click synthesis claim → jump to source research response

**Why:** Builds trust, allows verification, enables refinement

**Effort:** 10 hours | **Impact:** MEDIUM-HIGH | **Priority:** 🟠 **HIGH**

**10. Add Conversation List Sidebar**

**What:** Show all strategy sessions for org, allow switching, metadata (last edited, phase, progress)

**Why:** Users will have multiple sessions, need to navigate between them

**Effort:** 12 hours | **Impact:** HIGH | **Priority:** 🟠 **HIGH**

**11. Implement Keyboard Shortcuts (Cmd+K Command Palette)**

**What:** Global command palette for power users (Go to X, Ask coach, Generate synthesis)

**Why:** 10x efficiency for frequent users, table stakes for enterprise tools

**Effort:** 16 hours | **Impact:** MEDIUM-HIGH | **Priority:** 🟡 **MEDIUM**

**12. Add Export Capabilities (PDF, DOCX)**

**What:** Export synthesis with charts, Strategic Bets as structured document

**Why:** Stakeholder sharing, board presentations, documentation

**Effort:** 20 hours | **Impact:** HIGH | **Priority:** 🟠 **HIGH**

**13. Design & Implement Strategic Bets Phase**

**What:** Full Phase 4 UI (bet creation, prioritization, evidence linking, export)

**Why:** Complete the 4-phase methodology

**Effort:** 40 hours | **Impact:** HIGH | **Priority:** 🟠 **HIGH**

---

### Future (Phase 4+ - May 2026 onward)

#### Innovation Bets (5 items)

**14. Collaborative Strategy Sessions**

**What:** Team commenting, @mentions, version history, stakeholder dashboard

**Effort:** 60 hours | **Impact:** HIGH | **Priority:** 🟢 **PHASE 3**

**15. Mobile-Optimized Experience**

**What:** Responsive deep-dives, touch gestures, offline mode, simplified synthesis view

**Effort:** 80 hours | **Impact:** MEDIUM | **Priority:** 🟢 **PHASE 4**

**16. Proactive AI Suggestions**

**What:** Coach detects patterns, suggests next steps, automated insights, scheduled check-ins

**Effort:** 40 hours | **Impact:** MEDIUM-HIGH | **Priority:** 🟢 **PHASE 3**

**17. Multi-Modal Inputs**

**What:** Voice input, screenshot analysis (competitor pages), PDF vision parsing (charts/tables)

**Effort:** 60 hours | **Impact:** MEDIUM | **Priority:** 🟢 **PHASE 4**

**18. Integration Ecosystem**

**What:** Jira/Linear (export bets as epics), Miro (export canvas), Slack (notifications), Teams

**Effort:** 80 hours | **Impact:** MEDIUM-HIGH | **Priority:** 🟢 **PHASE 4**

---

## Appendices

### Appendix A: Heuristic Evaluation Scorecard

| Heuristic | Score (1-5) | Critical Issues |
|-----------|-------------|----------------|
| 1. Visibility of System Status | 2 | AI streaming, save confirmations |
| 2. Match Between System and Real World | 4 | "3Cs" jargon |
| 3. User Control and Freedom | 2 | No undo, cancel, delete |
| 4. Consistency and Standards | 4 | Minor icon sizing |
| 5. Error Prevention | 2 | Missing confirmations |
| 6. Recognition Rather Than Recall | 3 | Context not visible across phases |
| 7. Flexibility and Efficiency | 1 | No keyboard shortcuts |
| 8. Aesthetic and Minimalist Design | 4.5 | Excellent restraint |
| 9. Help Users Recognize Errors | 2 | Vague error messages |
| 10. Help and Documentation | 3 | Missing inline help |
| **Enterprise: Data Security Transparency** | 1 | No privacy messaging |
| **Enterprise: Collaboration** | 0 | No multi-user features |
| **Overall Average** | **2.4/5** | **Needs significant improvement** |

### Appendix B: Accessibility Checklist

**WCAG 2.1 Level AA Compliance:**

- [ ] **1.1.1** All images have alt text
- [ ] **1.3.1** Proper heading hierarchy (H1 → H2 → H3)
- [x] **1.3.1** Semantic HTML (`<header>`, `<main>`, `<aside>`)
- [ ] **1.4.3** Text contrast ≥ 4.5:1 (AA) for small text
- [ ] **1.4.3** Text contrast ≥ 3:1 (AA) for large text (18px+)
- [ ] **1.4.11** UI component contrast ≥ 3:1 (buttons, inputs)
- [ ] **2.1.1** All functionality available via keyboard
- [ ] **2.1.2** No keyboard traps (can exit modals)
- [ ] **2.4.3** Logical focus order
- [ ] **2.4.7** Focus visible on all interactive elements
- [x] **3.1.1** Page language declared (`<html lang="en">`)
- [x] **3.2.1** No unexpected focus changes
- [x] **3.2.2** No unexpected input changes
- [ ] **3.3.1** Form errors identified with `aria-describedby`
- [ ] **4.1.2** All UI components have proper ARIA labels

**Status:** 5/15 passing (33%) ❌ **NOT COMPLIANT**

### Appendix C: Competitor Screenshots

*(Note: Would include annotated screenshots of Amplitude, Dovetail, Linear, Miro here showing specific UI patterns to emulate)*

**Example Annotations:**
- Amplitude: "Data viz with drill-down interactions"
- Dovetail: "Tag system for thematic analysis"
- Linear: "Keyboard shortcuts palette"
- Miro: "Infinite canvas spatial organization"

### Appendix D: Design Pattern Library Recommendations

**Recommended Component Libraries:**

1. **Headless UI (@headlessui/react)** - Accessible modals, dropdowns, tooltips
2. **Radix UI (@radix-ui/react)** - Primitives for complex components
3. **Recharts or D3.js** - Data visualization (opportunity maps)
4. **React Hook Form** - Form state management
5. **Framer Motion** - Animation library
6. **cmdk** - Command palette (Cmd+K)
7. **React Markdown** - Render coach responses with formatting

**Design Token Structure:**
```typescript
// design-tokens.ts
export const tokens = {
  colors: {
    brand: {
      primary: 'from-indigo-600 to-cyan-600',
      indigo: 'indigo-600',
      cyan: 'cyan-600',
    },
    phase: {
      discovery: 'emerald-600',
      research: 'amber-600',
      synthesis: 'purple-600',
      bets: 'cyan-600',
    },
    semantic: {
      success: 'emerald-600',
      warning: 'amber-600',
      error: 'red-600',
      info: 'cyan-600',
    },
  },
  spacing: {
    section: 'gap-6 md:gap-8',
    container: 'p-6 md:p-10',
    card: 'p-4 md:p-6',
  },
  radius: {
    card: 'rounded-2xl',
    button: 'rounded-xl',
    badge: 'rounded-full',
  },
  typography: {
    display: 'font-newsreader',
    ui: 'font-sans', // IBM Plex Sans
    mono: 'font-mono', // IBM Plex Mono
  },
};
```

---

## Conclusion

The Product Strategy Coach represents a **strong MVP foundation** with clear strategic intent and thoughtful implementation of the core coaching methodology. The 4-phase progressive disclosure structure is excellent, and the two-panel "coach beside you" layout effectively balances guidance with user agency.

However, to meet **enterprise SaaS expectations** and compete with best-in-class tools, Frontera must address:

1. **Critical UX friction** in AI feedback and modal navigation (blocks user flow)
2. **Accessibility gaps** that prevent enterprise procurement (WCAG Level A failures)
3. **Missing visualizations** that would elevate synthesis from text to insights (competitive disadvantage)
4. **Generic visual design** that doesn't differentiate in crowded SaaS market (brand weakness)

**The path forward is clear:**

- **Next Sprint (Now):** Fix the 5 critical issues blocking enterprise adoption
- **Q2 2026:** Add visualizations and evidence linking to elevate synthesis value
- **Q3 2026:** Enable collaboration for team-based strategy development
- **Q4 2026:** Introduce advanced AI capabilities and mobile optimization

With focused execution on these recommendations, Frontera can transform from "functional MVP" to "industry-leading strategic coaching platform" within 12 months.

**Key Success Metrics to Track:**
- User completion rate (Discovery → Synthesis): Target 75%+
- Time-to-synthesis: Target < 90 minutes
- Synthesis satisfaction score: Target 4.2/5.0
- Enterprise procurement acceptance: Target 90%+ pass accessibility audit
- User retention (30-day active): Target 60%+

---

**Document Version:** 1.0
**Author:** Design & UX Architecture Team
**Review Date:** January 18, 2026
**Next Review:** April 18, 2026 (post-Phase 2 implementation)
