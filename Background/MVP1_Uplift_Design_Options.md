# MVP1 Uplift: Design Options Paper

**Document Version:** 1.0
**Date:** March 2, 2026
**Author:** Claude Code (with Derek Smith)
**Status:** Draft — Pending Decision
**Scope:** Full 6-phase journey uplift for Product Strategy Agent MVP1

---

## 1. Executive Summary

### The Problem

MVP1's two-panel architecture separates the AI coaching experience (left panel) from the strategy work (right canvas panel). These run as **parallel tracks rather than one coherent journey**. The user must mentally bridge two surfaces, and the coach — Frontera's core differentiator — is sidelined as a chat sidebar rather than driving the strategy development.

The UX Journey Research (Feb 2026) explicitly identifies this:

> *"The current coaching is not obvious to the user, hidden on the left and not integrated with the question context or user journey flow. We need to move to the chat being embedded in the main flow of the journey like BetterUp."*

### What This Paper Covers

Three distinct architectural options for uplifting MVP1, each evaluated across all 6 phases (Discovery → Research → Synthesis → Bets → Activation → Review), with:
- Layout descriptions and wireframes
- Phase-by-phase user experience
- Component impact analysis (what's reused, modified, or replaced)
- Complexity, risk, and trade-off assessment
- Comparative decision matrix

### Design Principles (from UX Research)

| Principle | Source | Implication |
|-----------|--------|-------------|
| Coaching embedded in main flow | BetterUp | Coach should not be a sidebar — it should drive the journey |
| Progressive disclosure | Notion | Reveal complexity only when user is ready |
| Micro-reward moments | Duolingo | Sustain engagement through long workflows |
| Strategy-to-execution bridge | Cascade | Later phases must connect strategy to operational outcomes |
| Always-on strategy | Quantive | Strategy as continuous process, not one-time output |
| Audience-specific views | Productboard | Same data rendered for different stakeholders (future) |
| Progressive UI | Claide Artifacts | Create interactive UI elements within Chat Cards, using Claude's Artefacts capability |
---

## 2. Current State Analysis

### 2.1 Architecture

**Layout:** `ProductStrategyAgentInterface.tsx` orchestrates two layout modes:
- **Modern (default):** 60% CoachingPanel / 40% CanvasPanel, resizable via `ResizeDivider`
- **Classic:** 25% coaching sidebar / 75% canvas
- **Mobile:** Full-width canvas + floating `CoachingPopup`

**Left Panel — CoachingPanel** (`src/components/product-strategy-agent/CoachingPanel/`):
- AI chat with streaming responses via `MessageStream.tsx`
- Embedded card system: `QuestionCard`, `ExplanationCard`, `RequestCard`, `DebateCard`, `WhatsNextCard`, `AnsweredCard`, `CoachReviewPanel`, `ResourceCard`
- Card parsing via `src/lib/utils/card-parser.ts` — extracts `[CARD:type]...[/CARD]` markers from Claude responses
- Smart prompts via `CoachContextAwareness.tsx`
- Persona selection (Marcus, Elena, Richard, etc.)
- Proactive coaching via `useProactiveCoach` hook

**Right Panel — CanvasPanel** (`src/components/product-strategy-agent/CanvasPanel/`):
- `HorizontalProgressStepper` across 6 phases
- Phase-specific sections rendered conditionally
- Research via territory deep-dive components with their own textareas, `InlineCoachBar`, and `FloatingCoachBar`
- Separate coaching implementations on canvas that do NOT share conversation history with the main chat

### 2.2 The Bridging Gap

The panels communicate through:
- `activeResearchContext` — bubbled from canvas textarea focus to CoachingPanel
- `onConversationUpdate` — phase transitions trigger conversation state updates
- `framework_state` JSONB — shared state in Supabase, read independently by both panels

**Critical gaps:**
- `handleCardAction` in CoachingPanel (line 73) → `console.log` only, not wired
- `handleNavigateToCanvas` (line 80) → `console.log` only, not wired
- `InlineCoachBar` and `FloatingCoachBar` on canvas call separate API endpoints — suggestions do NOT appear in the main coaching conversation
- The coach cannot navigate the user to a specific research question on the canvas
- The canvas cannot scroll the chat to a relevant coaching message

### 2.3 What Already Works Well

| Asset | Location | Quality |
|-------|----------|---------|
| Card system (8 types) | `CoachingPanel/cards/` | Production-ready, tested |
| Card parser | `src/lib/utils/card-parser.ts` | Robust with fallbacks |
| Agent with phase-aware prompts | `src/lib/agents/strategy-coach/` | 6 phases, 6 personas |
| Territory research questions | `research-questions.ts` | 9 areas, 27 questions |
| Gamification | `useGamification`, `XPBar`, etc. | XP, levels, achievements |
| Micro-synthesis | `micro-synthesis-prompt.ts` | Auto-generates after territory completion |
| Phase state machine | `framework-state.ts` | 6-phase progression with unlocking |
| WhatsNext progress | `useWhatsNextProgress` hook | Phase readiness calculation |
| All 6 phase sections | `CanvasPanel/*.tsx` | Discovery through Review |
| 35+ API routes | `src/app/api/product-strategy-agent/` | Full CRUD + AI generation |

---

## 3. Design Options

---

### OPTION A: "Coach-Led Journey" (Chat-Centric)

> The AI coach becomes the primary interface, driving the user through each phase via sequenced cards. The canvas becomes a contextual preview panel showing the output of coaching work.

#### Layout

```
+---------------------------------------------------------------+
| StrategyHeader (phase indicator, gamification, controls)       |
+---------------------------------------------------------------+
| [Progress Stepper — phase dots with completion rings]          |
+--------------------------------------------+------------------+
|                                            |                  |
|  COACHING STREAM (65-70%)                  | CONTEXT PREVIEW  |
|                                            | (30-35%)         |
|  Coach: Welcome to your strategy journey   |                  |
|  [ExplanationCard: Discovery overview]     | [Dynamic panel   |
|                                            |  showing:        |
|  Coach: Let's ground your strategy in data |  - Upload area   |
|  [RequestCard: Upload documents]           |  - Territory map |
|                                            |  - Synthesis viz |
|  User: Here's our annual report            |  - Bet cards     |
|  Coach: Great, I see your company is...    |  - Artefacts     |
|                                            |  - Review data]  |
|  [QuestionCard: Company Foundation Q1]     |                  |
|  User: [answers in card]                   |                  |
|  [AnsweredCard: collapsed Q1]              |                  |
|  Coach: Excellent insight. Now let's...    |                  |
|  [QuestionCard: Company Foundation Q2]     |                  |
|                                            |                  |
|  ┌─────────────────────────────────────┐   |                  |
|  │ [WhatsNextCard — sticky above input]│   |                  |
|  │ Company Foundation: 1/3 complete    │   |                  |
|  └─────────────────────────────────────┘   |                  |
+--------------------------------------------+------------------+
| [CoachingInput with smart prompts]                             |
+---------------------------------------------------------------+
```

**Mobile:** Full-width coaching stream; context preview via swipe-right or tab.

#### Phase-by-Phase Experience

**Phase 1 — Discovery:**
- Coach sends ExplanationCard with phase overview and methodology
- RequestCard prompts document upload; CTA opens upload in context preview
- Context preview shows upload area and AI Research Assistant
- Coach responds to each upload with document analysis
- WhatsNextCard transition: "Ready to Map Your Terrain" when 1+ docs uploaded

**Phase 2 — Research (core change):**
- Coach introduces each territory with ExplanationCard showing territory map
- Context preview shows territory overview cards with live progress
- Coach sends QuestionCards **one at a time**, sequenced by territory and area
- User answers within the card (textarea + confidence selector)
- "Ask Coach for Suggestion" button triggers AI-generated starting point
- "Review My Draft" button opens CoachReviewPanel inline with challenges, enhancement ideas, and resource links
- After submit: AnsweredCard collapses; coach acknowledges and sends next QuestionCard
- Context preview auto-updates with territory progress and micro-synthesis when areas complete
- When 4+ areas mapped, WhatsNextCard offers synthesis transition

**Phase 3 — Synthesis:**
- Coach triggers synthesis generation (or user clicks WhatsNextCard CTA)
- Context preview shows StrategicOpportunityMap and OpportunityCards
- Coach walks through each opportunity in chat
- DebateCards for strategic tensions; positions captured in conversation
- Context preview updates with debate outcomes

**Phase 4 — Strategic Bets:**
- Coach proposes bet hypotheses based on synthesis
- QuestionCards used for bet detail collection, which are prepopulated by the coach, but editable by the user (belief/implication/exploration/success)
- Context preview shows BetCards with CoachValidationPanel
- Coach challenges each bet with rigorous questioning

**Phase 5 — Activation:**
- Coach generates artefacts one at a time, explaining each
- Context preview shows TeamBriefCards, OKRCards, GuardrailsCards, StakeholderPack
- User can refine any artefact through chat conversation

**Phase 6 — Review (Living Strategy):**
- Coach initiates review cadence conversations
- Context preview shows AssumptionTracker, SignalLog, StrategyDiff
- Coach sends prompted check-ins for assumption validation and signal assessment

#### Component Impact

**Reused unchanged:**
- All 8 card components (QuestionCard, AnsweredCard, ExplanationCard, RequestCard, DebateCard, CoachReviewPanel, ResourceCard, WhatsNextCard)
- `CardRenderer.tsx`, `card-parser.ts`
- `MessageStream.tsx`, `Message.tsx`, `StreamingMessage.tsx`
- `CoachingInput.tsx`, `SessionHeader.tsx`, `PersonaSelector.tsx`
- All hooks: `useWhatsNextProgress`, `useResearchProgress`, `useQuestionCardState`, `useCoachContext`, `useProactiveCoach`, `useGamification`, `useSectionSummary`
- All agent code: `system-prompt.ts`, `framework-state.ts`, `research-questions.ts`, personas
- Canvas section components reused INSIDE context preview (DiscoverySection for upload area, SynthesisSection for viz, etc.)

**Modified:**
- `ProductStrategyAgentInterface.tsx` — Major rewrite: coaching becomes primary panel, canvas becomes secondary context preview
- `CoachingPanel.tsx` — Expand to primary width; wire `handleCardAction` and `handleNavigateToCanvas` to update context preview
- `CanvasPanel.tsx` → Refactored into `ContextPreviewPanel.tsx` (read-only/interactive phase previews driven by coaching context)
- `StrategyHeader.tsx` — Move stepper into header or sub-header position
- Agent `system-prompt.ts` — Enhanced instructions for one-at-a-time QuestionCard sequencing

**Removed/deprecated:**
- `ContextPanel.tsx`, `ResizeDivider` — replaced by simpler fixed-split context preview
- `InlineCoachBar.tsx`, `FloatingCoachBar.tsx` — replaced by in-chat "Ask Coach" on QuestionCards (already built)
- `TerritoryDeepDiveSidebar.tsx` — navigation driven by coach sequencing
- Deep-dive components (CompanyTerritoryDeepDive, etc.) — replaced by QuestionCard flow in chat; territory summaries shown in context preview

**New components:**
- `ContextPreviewPanel.tsx` — Phase-aware preview panel responding to coaching stream
- `useQuestionSequencer.ts` (hook) — Manages question ordering, determines next question based on territory progress
- `useCanvasActionBridge.ts` (hook) — Wires card actions to context preview operations

#### Complexity: **HIGH** (~4-6 weeks)

#### Pros
1. **True coaching integration** — Coach drives the journey, matching BetterUp model. The "hidden on the left" problem is eliminated.
2. **Single interaction surface** — All user input in one stream; coach always has full context. No split-brain between canvas InlineCoachBar and chat.
3. **Natural conversation flow** — Users get immediate feedback on every answer.
4. **Leverages existing card system fully** — All 8 card types already built and tested.

#### Cons
1. **Loss of non-linear exploration** — Users who want to scan all research areas and fill in any order lose that capability.
2. **Long chat streams** — 27 research questions + coach commentary creates very long conversations. Scroll fatigue risk.
3. **Power user regression** — Users who prefer canvas-first independent work lose their preferred workflow.
4. **Agent reliability** — If Claude fails to emit properly formatted card markers, the question flow breaks.

#### Risks
- **Agent sequencing reliability:** Mitigation: deterministic `useQuestionSequencer` hook that the agent queries, plus fallback "Next Question" button
- **Performance with 100+ messages:** Mitigation: virtualized message list
- **User frustration with linearity:** Mitigation: "Jump to territory" escape hatch in context preview

---

### OPTION B: "Bridged Dual-Panel" (Enhanced Current Architecture)

> Keep the current two-panel layout but wire coaching and canvas bidirectionally so they function as one experience rather than parallel tracks.

#### Layout

```
+---------------------------------------------------------------+
| StrategyHeader (phase, gamification, layout toggle)            |
+---------------------------------------------------------------+
| [HorizontalProgressStepper with per-phase % completion]       |
+----------------------------------+----------------------------+
|                                  |                            |
|  COACHING PANEL (60%)            |  CANVAS PANEL (40%)        |
|                                  |                            |
|  ┌────────────────────────────┐  |  [Phase Section]           |
|  │ Context: You're working on │  |                            |
|  │ Customer Segmentation Q2   │  |  Territory deep-dive       |
|  └────────────────────────────┘  |  with questions + textareas|
|                                  |                            |
|  Recent messages...              |  [InlineCoachBar] ───┐     |
|                                  |                      │     |
|  Coach: Here's my analysis of    |  ┌───────────────────┘     |
|  customer segmentation...        |  │ (routed through chat)   |
|                                  |  │                         |
|  [QuestionCard: Q2] ◄──────────►|  [Same Q2 textarea] ◄────►|
|  (synced with canvas)            |  (synced with chat)        |
|                                  |                            |
|  User types in EITHER panel ─────►  Answer appears in BOTH    |
|                                  |                            |
|  ┌────────────────────────────┐  |  [Territory progress map]  |
|  │ [WhatsNextCard - sticky]   │  |                            |
|  └────────────────────────────┘  |  [Save / Mark as Mapped]   |
|                                  |                            |
+----------------------------------+----------------------------+
| [CoachingInput: "Ask about Q2"] [Discuss with Coach ←]        |
+---------------------------------------------------------------+
```

**Mobile:** Canvas-first with floating coach popup (unchanged from current).

#### The Five Bridges

| Bridge | What it does | Implementation |
|--------|-------------|----------------|
| **1. Answer Sync** | Typing in canvas textarea mirrors in chat QuestionCard and vice versa | `useSharedAnswerState` hook with shared state map keyed by `{territory}:{area}:{questionIndex}` |
| **2. Rich Context Awareness** | Chat banner shows exactly which research area/question user is focused on | Enhanced `CoachContextAwareness.tsx` reading `activeResearchContext` |
| **3. Unified Coach Suggestions** | InlineCoachBar routes suggestions through main chat conversation instead of separate API | Modified `InlineCoachBar.tsx` sends via chat, response appears in conversation history |
| **4. Canvas→Chat Navigation** | "Discuss with Coach" button on each canvas question opens chat with that question in context | `useCrossNavigate` hook with scroll-to and message-send |
| **5. Chat→Canvas Navigation** | QuestionCard CTAs highlight/scroll-to corresponding canvas question; RequestCards open deep-dives | `useCanvasActionHandler` hook interprets card actions |

#### Phase-by-Phase Experience

**Phase 1 — Discovery:**
- Canvas: DiscoverySection **unchanged** (upload area, AI research, progress checklist)
- Chat: Contextual welcome, coach aware of what's on canvas
- **Bridge in action:** When user uploads a document on canvas, chat receives: "I see you uploaded [filename]. Let me analyze that..."
- Coach proactively sends RequestCards if no documents uploaded after first conversation
- WhatsNextCard in chat synced with canvas phase transition CTA

**Phase 2 — Research:**
- Canvas: ResearchSection with territory cards and deep-dives **unchanged layout**
- **Bridge 1 (Answer Sync):** Typing in canvas textarea populates corresponding chat QuestionCard; typing in chat QuestionCard populates canvas textarea. Single source of truth via `useSharedAnswerState`.
- **Bridge 2 (Context):** CoachContextAwareness banner shows "Working on: Customer Territory → Segments & Needs → Q2"
- **Bridge 3 (Unified Suggestions):** InlineCoachBar on canvas sends suggestion request as a message in the main conversation. Suggestion appears in chat history, visible alongside all coaching context.
- **Bridge 4 (Canvas→Chat):** "Discuss with Coach" button on each canvas question scrolls chat to relevant QuestionCard or sends a coaching message about that question.
- **Bridge 5 (Chat→Canvas):** QuestionCard "Submit" button can highlight the completed question on canvas. RequestCards ("Complete Company Foundation") open the corresponding deep-dive.

**Phase 3 — Synthesis:**
- Canvas: SynthesisSection **unchanged** (opportunity map, cards, tensions)
- Chat: Coach discusses opportunities/tensions visible on canvas
- DebateCards in chat linked to TensionCards on canvas — positions sync

**Phase 4 — Strategic Bets:**
- Canvas: BetsSection **unchanged**
- Chat: Coach validates bets with bidirectional linking to canvas BetCards

**Phase 5 — Activation:**
- Canvas: ActivationSection **unchanged**
- Chat: Coach explains each generated artefact, links to canvas view

**Phase 6 — Review:**
- Canvas: ReviewSection **unchanged**
- Chat: Coach initiates review conversations, referencing visible assumption tracker and signal log

#### Component Impact

**Reused unchanged:**
- ALL canvas section components (DiscoverySection, ResearchSection, SynthesisSection, BetsSection, ActivationSection, ReviewSection)
- ALL territory deep-dive components
- `TerritoryDeepDiveSidebar.tsx`
- ALL card components, CardRenderer, card-parser
- `MessageStream.tsx`, `Message.tsx`, `StreamingMessage.tsx`
- `HorizontalProgressStepper.tsx`
- `StrategyHeader.tsx`, `CoachingInput.tsx`, `SessionHeader.tsx`
- All hooks except `useCoachContext` (modified)
- All agent code
- `CoachingPopup.tsx` (mobile)

**Modified:**
- `ProductStrategyAgentInterface.tsx` — Wire bidirectional communication: shared answer state, canvas action handler, cross-navigation
- `CoachingPanel.tsx` — Wire `handleCardAction` (line 73) and `handleNavigateToCanvas` (line 80) to dispatch actions to parent
- `CoachContextAwareness.tsx` — Enhanced to show rich territory/question context
- `InlineCoachBar.tsx` — Route suggestions through main chat conversation
- `FloatingCoachBar.tsx` — Same modification
- `QuestionCard.tsx` — Add "View on Canvas" button
- Territory deep-dive components (all 3) — Add `onOpenInChat` callback per question; sync textarea with shared state
- `useCoachContext.ts` — Enhanced to include canvas viewport state

**New components:**
- `useSharedAnswerState.ts` — Bidirectional sync between canvas and chat answer state
- `useCrossNavigate.ts` — Cross-panel navigation commands
- `useCanvasActionHandler.ts` — Interprets CardAction payloads into canvas operations

**Removed:** None. This option is purely additive.

#### Complexity: **MEDIUM** (~2-3 weeks)

#### Pros
1. **Lowest risk** — Existing layout, components, and workflows preserved. Canvas-first users not disrupted.
2. **Incremental implementation** — Each bridge can be built and shipped independently. Start with Bridge 4+5 (navigation) which are lowest effort.
3. **Preserves power-user workflow** — Canvas deep-dives with sidebar navigation and non-linear exploration fully functional.
4. **Minimal agent changes** — Existing system prompt and card emission continue to work.

#### Cons
1. **Fundamental UX problem persists** — Coaching and strategy work remain spatially separated. "Hidden on the left" is mitigated but not eliminated.
2. **Sync complexity** — Bidirectional state sync introduces race conditions and edge cases (editing same answer in both panels simultaneously).
3. **Cognitive load** — Users must still decide where to work. Dual affordance may confuse new users ("do I type here or there?").
4. **Does not match BetterUp model** — UX research called for "chat embedded in main flow." This keeps chat as a parallel panel, just better connected.

#### Risks
- **Sync bugs:** Mitigation: single source of truth (`useSharedAnswerState`) with last-write-wins and optimistic UI
- **Scope creep:** Mitigation: ship bridges independently, starting with navigation (lowest risk)
- **Mobile gap:** Bridges don't benefit mobile (only one panel visible at a time)

---

### OPTION C: "Unified Strategy Flow" (Single-Panel Radical Redesign)

> Eliminate the dual-panel architecture. Replace with a single scrollable page per phase where coaching, questions, and visualizations are interleaved as content blocks, like a Notion document with embedded AI.

#### Layout

```
+---------------------------------------------------------------+
| StrategyHeader (compact: logo, phase name, gamification)       |
+---------------------------------------------------------------+
| [Phase Tab Bar]                                                |
| Discovery | Research | Synthesis | Bets | Activation | Review  |
+---------------------------------------------------------------+
|                                                               |
|  UNIFIED FLOW (full-width, scrollable)                        |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [CoachBlock] Welcome to your strategy journey.          │  |
|  │ I'm your Strategy Coach — let's build something great.  │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [ExplanationBlock] DISCOVERY PHASE                      │  |
|  │ Establish your strategic baseline with company context   │  |
|  │ and source materials.                                   │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [Section] STRATEGIC MATERIALS                           │  |
|  │ [Upload zone + AI Research Assistant]                    │  |
|  │ [Document cards showing uploaded files]                  │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [CoachBlock] Great — I see 3 documents. Let me          │  |
|  │ analyze them for strategic insights...                   │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [WhatsNextBlock] READY FOR TERRAIN MAPPING              │  |
|  │ ✓ Company context  ✓ 3 documents  ○ Coaching (optional) │  |
|  │                          [Begin Terrain Mapping →]      │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
|  ═══════ RESEARCH PHASE ═══════════════════════════════════   |
|                                                               |
|  ┌─────────────────────────────────────────────────────────┐  |
|  │ [TerritorySection] COMPANY TERRITORY                    │  |
|  │ ┌────────┐ ┌────────┐ ┌────────┐                       │  |
|  │ │Found.  │ │Capab.  │ │Model   │  (3 area progress)    │  |
|  │ │ 0/3    │ │ 0/3    │ │ 0/3    │                       │  |
|  │ └────────┘ └────────┘ └────────┘                       │  |
|  │                                                         │  |
|  │ ── Company Foundation ──                                │  |
|  │ [CoachBlock] Let's start with your company's core...    │  |
|  │                                                         │  |
|  │ [QuestionBlock: Q1]                                     │  |
|  │ ┌──────────────────────────────────────────────────┐    │  |
|  │ │ ❶ What are your company's core products?         │    │  |
|  │ │ [Textarea]                                       │    │  |
|  │ │ Confidence: [Data] [Experience] [Guess]          │    │  |
|  │ │ [Ask Coach] [Review Draft]        [Submit →]     │    │  |
|  │ └──────────────────────────────────────────────────┘    │  |
|  │                                                         │  |
|  │ [QuestionBlock: Q2] (locked until Q1 submitted)         │  |
|  │ [QuestionBlock: Q3]                                     │  |
|  │                                                         │  |
|  │ [MicroSynthesisBlock] (appears when area complete)      │  |
|  └─────────────────────────────────────────────────────────┘  |
|                                                               |
+---------------------------------------------------------------+
| ┌───────────────────────────────────────────────────────────┐ |
| │ [Sticky Coach Input] Ask about this section...    [Send]  │ |
| │                                          [Open Coach ▸]   │ |
| └───────────────────────────────────────────────────────────┘ |
+---------------------------------------------------------------+

                                    ┌──────────────────────┐
                                    │ COACH DRAWER (slides  │
                                    │ from right)           │
                                    │                       │
                                    │ Full conversation     │
                                    │ history for deep      │
                                    │ coaching discussions   │
                                    │                       │
                                    │ Contextually aware    │
                                    │ of which section user │
                                    │ was viewing           │
                                    │                       │
                                    │ [Close ✕]             │
                                    └──────────────────────┘
```

**Mobile:** Same vertical flow; coach drawer becomes bottom sheet.

#### Phase-by-Phase Experience

**Phase 1 — Discovery:**
- Tab shows "Discovery" active
- Vertical flow: CoachBlock (welcome) → ExplanationBlock (methodology) → MaterialsSection (upload + AI research + document cards) → CoachBlock (document analysis) → WhatsNextBlock (checklist + transition CTA)
- Sticky coach input at bottom allows questions — responses appear as CoachBlocks inline
- Phase transition via WhatsNextBlock CTA

**Phase 2 — Research:**
- Tab switches to "Research"
- Three territory sections (Company, Customer, Competitor), each collapsible
- Within each territory: research area sub-sections
- Each area: CoachBlock (introduction) → 3 QuestionBlocks (textarea + confidence + "Ask Coach" + "Review Draft") → CoachFeedbackBlocks → MicroSynthesisBlock (when complete)
- "Ask Coach" opens drawer with context pre-loaded
- Progress bars on territory headers update as questions are answered
- Questions can optionally be sequential (Q2 unlocks after Q1) or all visible

**Phase 3 — Synthesis:**
- Full-width StrategicOpportunityMap, OpportunityBlocks, TensionBlocks with inline debate interface
- CoachBlock introductions before each section
- Coach drawer available for deeper discussion of any tension

**Phase 4 — Strategic Bets:**
- BetCreationBlocks (hypothesis builder forms) with inline CoachValidationBlocks
- BetCardsGrid summary view
- Each bet has "Refine with Coach" → drawer

**Phase 5 — Activation:**
- Tabbed artefact sections as content blocks
- Each artefact has "Refine with Coach" → drawer

**Phase 6 — Review:**
- ReviewTriggersBlock, AssumptionTrackerBlock, SignalLogBlock, StrategyVersionsBlock
- Coach check-in blocks appear at review intervals

#### Component Impact

**Reused (adapted to block form):**
- `QuestionCard.tsx` → adapted into wider `QuestionBlock.tsx`
- `AnsweredCard.tsx` → collapsed state within QuestionBlock
- `ExplanationCard.tsx` → full-width `ExplanationBlock`
- `CoachReviewPanel.tsx` → used inside coach drawer
- `WhatsNextCard.tsx` → full-width `WhatsNextBlock`
- `StrategicOpportunityMap.tsx`, `OpportunityCard.tsx`, `TensionCard.tsx` → full-width blocks
- `BetCard.tsx`, `TeamBriefCard.tsx`, `OKRCard.tsx`, `GuardrailsCard.tsx` → content blocks
- `AssumptionTracker.tsx`, `SignalLog.tsx`, `StrategyDiff.tsx` → full-width blocks
- All agent code, hooks, API routes → core logic reused

**Replaced:**
- `ProductStrategyAgentInterface.tsx` → **complete rewrite** as `UnifiedStrategyFlow.tsx`
- `CoachingPanel.tsx` → replaced by `CoachDrawer.tsx` + `CoachBlock.tsx`
- `CanvasPanel.tsx` → replaced by phase-specific flow renderers
- `ContextPanel.tsx` → eliminated
- `ResizeDivider` → eliminated
- `CoachingPopup.tsx` → replaced by `CoachDrawer.tsx` (responsive)
- `MessageStream.tsx` → replaced by inline CoachBlock rendering
- `HorizontalProgressStepper.tsx` → replaced by `PhaseTabBar.tsx`
- `TerritoryDeepDiveSidebar.tsx` → replaced by in-flow territory sections
- `InlineCoachBar.tsx` / `FloatingCoachBar.tsx` → replaced by "Ask Coach" per QuestionBlock → drawer

**New components:**
- `UnifiedStrategyFlow.tsx` — top-level orchestrator
- `PhaseFlowRenderer.tsx` — renders phase content as vertical block flow
- `CoachBlock.tsx` — inline coaching message in the flow
- `QuestionBlock.tsx` — full-width question form
- `CoachDrawer.tsx` — right-slide panel with conversation history
- `StickyCoachInput.tsx` — fixed bottom bar with section-aware prompts
- `PhaseTabBar.tsx` — horizontal tab navigation
- `TerritoryFlowSection.tsx` — collapsible territory section
- `ResearchAreaFlow.tsx` — renders questions + coach feedback for one area
- `MicroSynthesisBlock.tsx` — inline territory synthesis
- `useFlowPosition.ts` — tracks scroll position for coach context
- `useInlineCoachMessages.ts` — manages insertion of coach responses

#### Complexity: **VERY HIGH** (~6-10 weeks)

#### Pros
1. **Eliminates dual-panel problem entirely** — Coaching and strategy work are the same vertical flow. Fullest implementation of "coaching embedded in main flow."
2. **Progressive disclosure built-in** — One phase at a time, one section at a time. Matches Notion-style recommendation from UX research.
3. **Natural document feel** — Output looks like a strategic document being built, not a software tool. Intuitive for enterprise users.
4. **Best mobile experience** — Single vertical flow works naturally without panels, popups, or responsive breakpoints.

#### Cons
1. **Largest engineering effort** — Every primary interface component rewritten or restructured. 3-4x effort of Option B.
2. **Loss of simultaneous visibility** — Cannot see coaching conversation and canvas output side by side. Coach drawer covers content.
3. **Scroll management complexity** — Research phase: 27 questions + coach commentary + territory sections = very long page. Needs sophisticated scroll tracking.
4. **Migration risk** — Current users face completely new interface. No gradual migration path.

#### Risks
- **Scroll performance:** 5000+ px of content in research phase. Mitigation: collapse completed territories, lazy-load off-screen sections
- **Coach context during scroll:** Sticky input needs to know which section is visible. Mitigation: IntersectionObserver + explicit breadcrumb
- **Inline message ordering:** Where to insert coach responses when user scrolls away. Mitigation: solicited responses inline at question; unsolicited always in drawer
- **Test regression:** 285 existing tests heavily test current component structure. Mitigation: preserve API/agent tests; rewrite component tests

---

## 4. Comparative Decision Matrix

| Dimension | Option A: Coach-Led | Option B: Bridged Dual-Panel | Option C: Unified Flow |
|---|---|---|---|
| **Layout** | Chat 70% + Context 30% | Dual-panel 60/40 (same) | Single scroll + Drawer |
| **Coach integration** | Coach drives everything | Coach advises in parallel (better connected) | Coach embedded in content |
| **Core experience** | Conversational | Tool with coaching support | Document-like guided journey |
| **MVP1 component reuse** | Cards 100%, Canvas 40%, Layout 20% | Everything 90%+ | Agent/API 90%, UI 30% |
| **Engineering effort** | ~4-6 weeks | ~2-3 weeks | ~6-10 weeks |
| **Incremental shipping** | Possible (phase by phase) | Best (bridge by bridge) | Difficult (big bang) |
| **Power user impact** | Negative (loses non-linear nav) | Neutral (all workflows preserved) | Mixed (doc feel good, but workflow changes) |
| **New user experience** | Best (guided, single surface) | Moderate (still two panels to learn) | Good (simple scroll model) |
| **Mobile story** | Natural | Same as today (unchanged) | Best |
| **BetterUp alignment** | High | Low-Medium | Medium-High |
| **Notion alignment** | Low | Low | High |
| **Risk level** | Medium-High | Low-Medium | High |
| **Agent prompt changes** | Significant (sequencing) | Minor (context awareness) | Moderate (block mode) |
| **Data model changes** | None | None | None |
| **API route changes** | None | Minor (InlineCoachBar routing) | None |

---

## 5. Recommendation

### Suggested Approach: Option A with Option B as Foundation

**Phase 1 (Weeks 1-2): Build the bridges from Option B**
- Wire `handleCardAction` and `handleNavigateToCanvas` (the existing stubs)
- Implement `useCrossNavigate` for chat↔canvas navigation
- Route InlineCoachBar through main conversation
- These changes improve MVP1 immediately regardless of which option is ultimately chosen

**Phase 2 (Weeks 3-5): Implement Option A layout transformation**
- Invert the panel hierarchy: coaching becomes primary (70%), canvas becomes context preview (30%)
- Implement `useQuestionSequencer` for coach-driven research flow
- Update agent system prompt for one-at-a-time QuestionCard sequencing
- Build `ContextPreviewPanel` from existing canvas section components

**Phase 3 (Week 6): Polish and user testing**
- Add "Canvas View" toggle that temporarily shows full canvas (for power users who want non-linear exploration)
- Gamification integration for question completion
- Mobile optimization

This phased approach:
- Ships improvements in Week 1-2 (bridges work in current layout)
- Delivers the core vision by Week 5 (coaching at the heart)
- Preserves an escape hatch for power users (canvas toggle)
- Reuses the maximum amount of existing code
- Allows user testing at each phase to validate direction

---

## 6. Open Questions for Decision

1. **Should research questions remain strictly one-at-a-time (guided), or should users be able to see all questions in an area and answer in any order?** The MVP2 plan specifies one-at-a-time, but enterprise users may prefer to see the full picture. The user should be able to answer the questions in each section in any order i.e. the 3 questions for that section, allowing them to click into the question and that card expands

2. **How important is the Coach Review feature (challenges + resource links)?** This was a key MVP2 enhancement but requires new API endpoints and Lenny archive integration. Should it be in scope for the uplift or deferred? It should be in scope.

3. **Should the context preview panel (Option A) be collapsible/hideable, or always visible?** If always visible, it provides constant orientation. If hideable, it maximizes chat space. Collapsible, but not hideable. i.e. you can always see the arrow to expand

4. **What is the acceptable timeline?** Option B alone can ship in 2-3 weeks. Option A needs 4-6 weeks. Option C needs 6-10 weeks.
I want Option A, so the time is irrelevant. I want it designed, architected and built throroughly

---

*End of Document*
