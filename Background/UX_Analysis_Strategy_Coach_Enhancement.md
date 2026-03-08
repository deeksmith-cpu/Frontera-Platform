# Frontera Strategy Coach — UX Analysis & Enhancement Plan

> **Date:** March 4, 2026
> **Status:** Ready for Review
> **Recommendation:** Option C (Full Mockup-Faithful Redesign) — see companion comparison document

## Context

Analysis comparing the current MVP Strategy Coach implementation (67/33 coach-led split layout) against the UX design mockups (`Background/UX Design/`), the Frontera UX Journey Research, MVP2 PRD design pillars, and 2025-2026 AI UX best practices.

**Reference materials analysed:**
- 2 UX design mockup images (Territory Welcome + Chat Interface)
- `Frontera_UX_Journey_Research.docx` — Platform UX research across 7 categories
- `Product_Strategy_Coach_MVP2_Migration_PRD.md` — MVP2 target state
- `MVP1_Uplift_Design_Options.md` — Three architectural options evaluated
- `MVP2_Aesthetic_Upgrade_Plan.md` — Visual polish plan
- `Strategy_Coach_V2_Card_System_PRD.md` — Card system specification
- Current codebase implementation (all components explored)
- 2025-2026 AI UX research (NN/g, BetterUp, Smashing Magazine, Shape of AI, etc.)

---

## Section 1: Critical Analysis of Current MVP Implementation

### 1.1 What Works Well

**Robust card system.** The `CardRenderer` dispatches `QuestionCard`, `ExplanationCard`, `RequestCard`, `DebateCard`, `ResearchAreaGroup`, and `BetQuestionCard` types with territory-specific styling, confidence ratings, and coach review integration. Significant engineering investment worth preserving.

**Layout-agnostic data model.** The `CoachJourneyContext` (`src/contexts/CoachJourneyContext.tsx`) provides clean data flow with `handleCardAction`, `handleQuestionSubmit`, `handleNavigateToCanvas`, and `handlePhaseTransition`. Can be rewired to different layouts without rewriting business logic.

**Well-executed gamification.** XPBar, AchievementBadge, LevelUpCelebration components with `useGamification` hook align with Duolingo micro-reward patterns from the UX research.

**Mature phase progression.** Both `HorizontalProgressStepper` and `PhaseProgressBar` implement clickable phase navigation with locked/visited/current states and phase-specific colours.

### 1.2 What Doesn't Work (Backed by UX Research)

**Problem 1: Split attention between two panels with overlapping purpose.**
The 67/33 layout forces users to track progress in the RIGHT panel while doing work in the LEFT panel. Violates cognitive load research: *"Every interface element consumes working memory"* (Red Lio Designs, 2025). Context panel at 33% is either too compressed or invisible when collapsed to 48px.

**Problem 2: Three duplicate phase indicators.**
Phase state renders in THREE places simultaneously: HorizontalProgressStepper (mobile only), PhaseProgressBar (right panel), StrategyHeader badge. Visual noise without clarity.

**Problem 3: Territory navigation is visually underweight.**
`TerritoryNav.tsx` renders as compact dropdown buttons (~40px height) for the CORE research phase where users spend 2+ hours. Violates Notion's progressive disclosure: visual weight should match importance.

**Problem 4: Coaching feels like "chatting with an AI" rather than guided strategic work.**
Everything goes into a single scrolling `MessageStream`. QuestionCards sandwiched between chat messages. Users lose current question when scrolling. Unclear whether typing answers a structured question or initiates a side conversation. **This is the fundamental UX problem.**

**Problem 5: No orientation before immersion.**
Research phase auto-sends a welcome message and immediately drops user into Q&A. No welcome screen, no territory overview, no choice of where to start. The UX research identifies this as the *"energy bottleneck."*

**Problem 6: Richest UX exists only on mobile.**
`ResearchSection.tsx` (full territory overview with cards) only renders on mobile. Desktop users get compressed TerritoryNav instead.

**Problem 7: Dual text inputs create confusion.**
`CoachingInput` coexists with `QuestionCard` textarea. Smart prompts default to collapsed.

### 1.3 How Current MVP Diverges from UX Research

| UX Research Finding | Current MVP Status |
|---|---|
| *"Coaching hidden, not integrated with question context"* (Frontera UX Research) | Partially addressed — coaching at 67% but separated from canvas |
| *"Move chat to be embedded in main flow like BetterUp"* (Frontera UX Research) | Not achieved — chat IS the main flow; structured content secondary |
| *"Progressive disclosure reveals complexity only when ready"* (Notion) | Weak — all navigation visible simultaneously |
| *"Micro-reward moments throughout long workflows"* (Duolingo) | Partial — XP exists but no per-territory celebrations |
| *"Winners treat AI as tool that recedes into background"* (NN/g 2026) | Violated — AI chat occupies 67% of viewport |
| *"The future of AI isn't about chat windows"* (SD Times) | Violated — entire interface is a chat window |

---

## Section 2: Critical Analysis of UX Mockups

### 2.1 What the Mockups Get Right

**Three-zone layout with persistent sidebar.** Implements Notion progressive disclosure: sidebar = wayfinding, phase tabs = journey progress, main content = current task depth.

**Welcome/orientation before immersion.** Research phase welcome with purpose explanation, territory cards, UNMAPPED badges, single CTA. Addresses energy bottleneck directly.

**Coaching integrated into question context.** Question card as primary element with "Coach Suggestion" (gold), "Coach Debate" (cyan), "Save Draft" buttons. Implements "AI-second" principle.

**Territory progress always visible.** Sidebar shows territory progress without consuming main content space.

### 2.2 Refinement Needed

- Sidebar width on <1440px screens (needs collapsible behaviour)
- Phases beyond Research not designed (pattern is extensible)
- In-flow gamification celebrations should be preserved from current implementation
- Chat scroll vs pinned QuestionCard relationship needs careful UX

### 2.3 Pattern Alignment

| Pattern | Rating |
|---|---|
| BetterUp in-flow coaching | **Strong** |
| Notion progressive disclosure | **Strong** |
| Duolingo micro-rewards | **Partial** |
| Cascade strategy-to-execution | **Strong** |
| NN/g "AI recedes into background" | **Strong** |
| Cognitive load management | **Strong** |

---

## Section 3: AI UX Best Practice Assessment

### Scoring (2025-2026 Patterns)

| Pattern | Current MVP | Mockup Approach |
|---|---|---|
| AI as collaborator (Lyssna 2026) | 6/10 | 8/10 |
| Hybrid chat + structured UI (Claude Artifacts) | 5/10 | 8/10 |
| Progressive disclosure (Honra.io) | 4/10 | 8/10 |
| "AI-second" principle (SD Times) | 3/10 | 7/10 |
| Shape of AI "Action Plan" | 5/10 | 8/10 |
| NN/g 2026 "AI Fatigue" | 4/10 | 8/10 |
| Cognitive load management | 4/10 | 7/10 |
| Persistent context | 6/10 | 7/10 |
| **Totals** | **37/80 (46%)** | **61/80 (76%)** |

### Core Philosophical Issue

MVP2 PRD Pillar 1 (*"Coaching Is the Product"*) was misinterpreted. The intent was coaching should DRIVE the experience — not that chat should DOMINATE the screen. BetterUp achieves "coaching is the product" by embedding coaching in workflow, not by making chat 67% of the screen.

---

## Section 4: Claude Artifacts Pattern — Applicability to Frontera

### 4.1 What Artifacts Is

Claude Artifacts (launched July 2024, major upgrade June 2025) introduced a dual-panel model on claude.ai where AI-generated content appears in a **dedicated workspace panel alongside conversation**. The key UX decisions:

1. **Conversation (left) + Artifact (right).** Chat remains conversational; the artifact panel renders self-contained outputs — documents, interactive React components, diagrams, data visualizations.
2. **Automatic materialisation.** Claude determines when output should become an artifact rather than inline text.
3. **Persistent iteration.** Artifacts persist across turns. Users refine through conversation without copy-paste.
4. **Versioning.** Each modification creates a new version with instant rollback.
5. **Interactive outputs (June 2025).** Artifacts can be AI-powered applications that process user input in real-time.
6. **Inline editing (October 2025).** Targeted text replacements for small changes — 3-4x faster updates.

The fundamental shift: *"An assistant helps you do work in your tools while a collaborator works with you in a shared space — the artifact window"* (Tao An, Medium).

### 4.2 Industry Convergence on This Pattern

All four major AI platforms converged on the same layout by 2025:

| Product | Panel Approach | Strength |
|---|---|---|
| **Claude Artifacts** | Chat + Artifact panel | Code-centric, interactive React components, MCP connectivity |
| **ChatGPT Canvas** | Chat + Editor panel | Writing-centric, paragraph-level inline editing, style sliders |
| **Gemini Canvas** | Chat + Canvas panel | Apps, quizzes, infographics from research |
| **Perplexity Spaces** | Search + Collaborative workspace | Research-centric with citations |

This convergence validates a core UX insight: **chat alone is insufficient for creation; users need a persistent, visible output surface alongside conversational input.**

Enterprise tools adopting AI-conversational interfaces with workspace panels show: 38% faster onboarding, 27% higher feature adoption, 3.2x higher NPS (Onething Design, 2026).

### 4.3 Frontera's Strategy Coach IS Already an Artifacts System

The parallels are striking:

| Claude Artifacts | Frontera Strategy Coach |
|---|---|
| Conversation (left panel) | Coaching chat with AI Strategy Coach |
| Artifact (right panel) | Territory maps, synthesis docs, strategic bets |
| User describes intent conversationally | User answers questions, discusses strategy |
| Claude materialises artifact | Coach generates insights, opportunity maps, bets |
| User iterates through conversation | User refines with "Coach Review" and debate |
| Artifact persists across turns | `framework_state` and `territory_insights` persist |
| Versioning / rollback | `strategy_versions` table exists |
| Interactive artifacts | QuestionCards, DebateCards, territory maps |

**The critical insight:** The problem identified in the UX research (*"coaching hidden, not integrated with question context"*) is precisely the problem Artifacts solved — **making the generated output surface a first-class citizen alongside the conversation.**

### 4.4 The "Strategy Artifacts" Model

An Artifacts-inspired approach would treat every coaching interaction as potentially generating or updating a **strategy artifact** — a living document in the workspace panel:

| Phase | Artifact Type | Interaction |
|---|---|---|
| Discovery | Strategic Baseline Document | Grows as documents are uploaded; coach annotates |
| Research | Territory Deep-Dive Card | Interactive — user answers questions within artifact; coach reviews inline |
| Research | Micro-Synthesis Summary | Auto-generated after territory completion |
| Synthesis | Strategic Opportunity Map | Interactive visualisation; coach walks through; user debates and reorders |
| Bets | Strategic Bet Card | Form pre-populated by coach, editable by user, validated through conversation |
| Activation | Strategy Artefacts (Briefs/OKRs) | Documents iteratively refined through conversation |
| Review | Living Strategy Dashboard | Interactive dashboard updated through coach check-ins |

**How it works (Research phase example):**
1. Coach says: *"Let's explore your Customer Territory."*
2. A **Territory Deep-Dive artifact** materialises in the workspace showing questions with text areas and confidence selectors
3. User types directly into the artifact OR discusses with coach in chat
4. "Ask Coach for Suggestion" → suggestion populates the artifact textarea
5. "Review My Draft" → coach provides inline challenges in chat with highlighted passages in artifact
6. Area complete → artifact auto-generates a **Micro-Synthesis artifact**

### 4.5 What This Changes About the Options

The Artifacts insight reframes the workspace panel question. The current right panel is **passive** (read-only previews). The Artifacts model makes it **active** (interactive workspace where strategy work actually happens).

| Dimension | Option C (Sidebar + Unified Main) | Option D (Adaptive Modes) | Artifacts-Inspired |
|---|---|---|---|
| Coach generates workspace content | Partial (cards inline) | Depends on mode | **Yes — coach materialises artifacts** |
| User edits in workspace | Yes (QuestionCards) | Depends on mode | **Yes — artifact panels are interactive** |
| Simultaneous visibility | Limited (single main area) | No (modes are mutually exclusive) | **Yes — chat + artifact side by side** |
| Addresses "hidden coaching" | Yes (coaching inline) | Yes (contextual) | **Yes — coaching drives artifact generation** |
| Addresses "split attention" | Yes (single panel) | Yes (one mode at a time) | **Reframes it — panels serve distinct purposes** |

**Key advantage over Option C:** Simultaneous visibility. User sees coaching conversation AND strategy artifact at the same time. Option C's single main area means switching between orientation and working views.

**Key advantage over Option D:** No mode-switching overhead. The interface adapts naturally (different artifact appears) without explicit mode transitions that risk disorientation.

### 4.6 Persona Fit

| Persona | Why Artifacts Model Fits |
|---|---|
| **CPO** | Produces shareable strategic documents, not chat transcripts. Board-ready outputs. |
| **VP of Product** | Territory maps and bet cards are operational artifacts bridging strategy to execution |
| **Product Manager** | Team briefs and OKRs as living artifacts they can consume and reference |

By March 2026, the "chat + workspace" pattern is 20 months old (Artifacts) to 17 months (Canvas). Frontera's target personas — technology-forward CPOs and VPs — are highly likely to have used at least one. The pattern is no longer novel; it's becoming a standard expectation.

### 4.7 Implications for Options C and D

This Artifacts research should be considered as a **cross-cutting enhancement** applicable to either option:

- **Option C + Artifacts:** The Strategy Canvas right panel becomes an interactive artifact workspace. The sidebar provides navigation, main area provides orientation/chat, and the canvas shows the current living artifact. Three complementary zones.
- **Option D + Artifacts:** In Mode 2 (Focused Work), the right panel IS an artifact panel. The question panel and coach panel could be unified as the chat side, with artifacts on the right. This actually simplifies Mode 2's architecture.

*Sources: Anthropic Help Center, InfoQ, Prototypr, Tao An (Medium), Altar.io, PromptRevolution, Smashing Magazine, Onething Design, Orbix Studio, UX Collective, NN/g, Jakob Nielsen, Harvard Business Review*

---

## Section 5: Enhancement Options

### Option A: Evolutionary Fix (Low effort, 1-2 weeks)
Keep 67/33 layout, add orientation banners, expand TerritoryNav, always-visible smart prompts. **Bandaid — doesn't address core problem.**

### Option B: Sidebar + Unified Main Content (3-5 weeks)
Persistent sidebar + unified main content with orientation/working modes + collapsible strategy canvas. Best balance of impact and feasibility for incremental improvement.

### Option C: Full Mockup-Faithful Redesign (5-8 weeks)
Three-column: Sidebar + Unified Main + Interactive Strategy Canvas. Pinned QuestionCard, contextual coaching buttons, chat filtering, "Add Context" integration. **Most faithful to mockups.** Artifacts-enhanced variant makes the canvas an interactive workspace.

### Option D: Adaptive Focus Mode (8-12 weeks)
Three distinct modes (Orientation, Focused Work, Free Conversation) with animated transitions. **Most innovative.** Artifacts-enhanced variant simplifies Mode 2 by treating the right panel as an artifact workspace.

> **Note:** Detailed implementation plans and high-fidelity HTML mockups for Options C and D are provided in companion documents:
> - `Background/mockups/option-c-mockup.html` — 10 screens (desktop/tablet/mobile)
> - `Background/mockups/option-d-mockup.html` — 13 screens (desktop/tablet/mobile)
> - `Background/Option_C_vs_D_Implementation_Comparison.md` — Full technical comparison

---

## Section 6: Recommendation (Pending Mockup Review)

The initial analysis recommended Option B as a balanced starting point. However, based on Derek's feedback and the Artifacts research, **the decision now sits between Option C and Option D**, with the Artifacts-inspired interactive workspace as a cross-cutting enhancement to whichever is chosen.

The recommendation will be finalised after:
1. Review of high-fidelity HTML mockups for both options
2. Design Expert agent analysis against personas and Frontera mission
3. Side-by-side implementation comparison

### Key Files to Change (Common to Both Options)
- `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx` — Layout restructuring
- `src/components/product-strategy-agent/CoachLedPanel/CoachLedPanel.tsx` — Chat refactoring
- `src/components/product-strategy-agent/ContextPreviewPanel/ContextPreviewPanel.tsx` — Replaced
- `src/components/product-strategy-agent/StrategyHeader.tsx` — Slimmed down
- `src/components/product-strategy-agent/CanvasPanel/ResearchSection.tsx` — Reused content
- `src/contexts/CoachJourneyContext.tsx` — Extended state management

### AI UX Research Sources
- NN/g State of UX 2026: "AI Fatigue" — winners treat AI as background tool
- BetterUp Grow: 95% satisfaction with in-flow coaching
- Smashing Magazine: Design Patterns for AI Interfaces (July 2025)
- Shape of AI: Action Plan, Draft Mode, Gallery patterns
- Honra.io: Progressive Disclosure for AI Agents (3-layer architecture)
- SD Times: "The future of AI isn't chat"
- Lyssna 2026: 73% see "AI as collaborator" as highest-impact trend
- Red Lio Designs: Cognitive Load UX 2025
- Claude Artifacts / ChatGPT Canvas / Gemini Canvas convergence analysis
- Anthropic Help Center, InfoQ, Prototypr, Altar.io, PromptRevolution
- Harvard Business Review: PM role shift toward AI orchestration (Feb 2026)
- Jakob Nielsen: 2026 Predictions — "Conversational UI to Delegative UI"

---

## Companion Documents

| Document | Purpose |
|---|---|
| `Background/mockups/option-c-mockup.html` | High-fidelity HTML mockups — Option C (10 screens, desktop/tablet/mobile) |
| `Background/mockups/option-d-mockup.html` | High-fidelity HTML mockups — Option D (13 screens, desktop/tablet/mobile) |
| `Background/Option_C_vs_D_Implementation_Comparison.md` | Detailed implementation plans + side-by-side technical comparison + B2B complexity analysis |
| `Background/Design_Expert_Analysis.md` | Independent design expert evaluation of both options against personas and Frontera mission |