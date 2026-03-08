# Option C vs Option D — Implementation Comparison

> **Date:** March 4, 2026
> **Status:** Technical Analysis — Ready for Decision
> **Companion To:** `Background/UX_Analysis_Strategy_Coach_Enhancement.md`
> **Recommendation:** Option C (Full Mockup-Faithful Redesign) with Artifacts Enhancement Layer

---

## 1. Executive Summary

This document provides a comprehensive implementation comparison of the two advanced redesign options for the Frontera Strategy Coach interface:

- **Option C (Full Mockup-Faithful Redesign):** A persistent three-column layout — JourneySidebar (220px) + Main Content (fluid) + StrategyCanvas (260px) — with a PhaseTabBar spanning the full width below a slimmed header. The coach's current question is pinned above the chat scroll stream, and contextual coaching buttons ("Coach Suggestion", "Coach Debate", "Save Draft") live on the QuestionCard itself rather than in the input bar. Chat becomes a secondary surface beneath the pinned question.

- **Option D (Adaptive Focus Mode):** Three distinct full-screen modes — Orientation (full-width structured content), Focused Work (60/40 question + coach split), and Free Conversation (full-width chat) — connected by animated transitions and breadcrumb navigation. A mode controller state machine orchestrates which mode is active based on user actions.

**Recommendation: Option C.** It delivers 90% of the UX improvement at 50-65% of the effort, aligns with enterprise user expectations for persistent navigation, reuses more existing code, and carries significantly lower implementation and UX risk. The Artifacts Enhancement Layer (interactive StrategyCanvas) can be phased in as a second milestone, giving Option C the screen utilisation advantages of Option D's Focused Work mode without the mode-switching overhead.

---

## 2. Option C — Detailed Implementation Plan

### 2.1 Architecture

```
+--------------------------------------------------------------+
| SlimHeader (56px) — logo, phase badge, XP bar, export        |
+--------------------------------------------------------------+
| PhaseTabBar (44px) — full-width horizontal stepper            |
+-----------+----------------------------------+----------------+
| Journey   | Main Content (fluid)             | Strategy       |
| Sidebar   |                                  | Canvas         |
| (220px)   | +------------------------------+ | (260px)        |
|           | | PinnedQuestionCard (sticky)  | |                |
| - Nav     | +------------------------------+ | - Territory    |
| - Coach   | | Chat MessageStream (scroll)  | |   detail       |
|   profile | |                              | | - Area status  |
| - Terr.   | |                              | | - Synthesis    |
|   progress| |                              | |   readiness    |
| - Achieve | +------------------------------+ | - Artifacts    |
| - Gamif.  | | CoachingInput (fixed bottom) | |                |
+-----------+----------------------------------+----------------+
```

**Key architectural decisions:**
- JourneySidebar absorbs gamification (XPBar, AchievementBadge) and territory progress from the current StrategyHeader and ContextPreviewPanel, freeing the header to be a slim 56px bar.
- PhaseTabBar replaces the three duplicate phase indicators (HorizontalProgressStepper, PhaseProgressBar, StrategyHeader badge) with a single canonical stepper.
- PinnedQuestionCard is extracted from the MessageStream scroll and rendered as a sticky element above the chat. This solves the core UX problem: users never lose the current question when scrolling through coaching conversation.
- StrategyCanvas replaces ContextPreviewPanel with an interactive workspace showing territory detail, research area status, and (in the Artifacts variant) interactive strategy artifacts.

### 2.2 New Components Required

| Component | Responsibility | Estimated Lines | Effort |
|---|---|---|---|
| `JourneySidebar.tsx` | Navy sidebar with nav links, coach profile avatar, territory progress rings, achievement badges, gamification XP display. Collapsible to 48px icon rail on screens <1440px. | 280-350 | 3-4 days |
| `PhaseTabBar.tsx` | Single horizontal phase stepper with clickable phase tabs, locked/visited/current states, phase-specific colours. Replaces three existing indicators. | 120-160 | 1-2 days |
| `StrategyCanvas.tsx` | Right panel with territory detail cards, research area status grid, synthesis readiness meter, and artifact workspace slot. Receives `currentPhase` and renders phase-appropriate content. | 200-260 | 3-4 days |
| `PinnedQuestionCard.tsx` | Sticky card extracted from MessageStream. Displays current question text, territory/area context badge, confidence selector, textarea, and contextual coaching buttons (suggestion, debate, save draft). | 180-220 | 2-3 days |
| `CoachSuggestionPanel.tsx` | Expandable gold-bordered panel that slides below PinnedQuestionCard when user clicks "Coach Suggestion". Fetches and displays AI-generated answer suggestions. | 100-140 | 1-2 days |
| `DebateView.tsx` | Split-view debate interface rendering user position vs coach challenge side-by-side. Replaces inline DebateCard in MessageStream for richer interaction. | 150-200 | 2-3 days |
| `OrientationView.tsx` | Phase welcome/overview screen shown on phase entry. Territory cards with UNMAPPED/IN PROGRESS/MAPPED badges, purpose explanation, single CTA to begin work. Addresses the "energy bottleneck" from UX research. | 160-200 | 2 days |

**Total new code:** ~1,190-1,530 lines across 7 components.

### 2.3 Files to Modify

| File | Change Description | Scope |
|---|---|---|
| `ProductStrategyAgentInterface.tsx` | Complete layout restructuring from 67/33 two-column to three-column with JourneySidebar + Main + StrategyCanvas. Remove `useContextPanelState` width logic. Add responsive sidebar collapse. | **Heavy** — ~60% rewrite |
| `CoachLedPanel.tsx` | Refactor into a secondary chat surface. Remove SessionHeader (moves to SlimHeader). Remove TerritoryNav (moves to JourneySidebar). Wire to PinnedQuestionCard above MessageStream. | **Medium** — ~40% refactor |
| `ContextPreviewPanel.tsx` | **Replaced entirely** by StrategyCanvas. PhaseProgressBar and ContextPreviewContent logic migrates to new components. File becomes deprecated. | **Delete** |
| `StrategyHeader.tsx` | Slim down to 56px. Remove XPBar and AchievementBadge (move to JourneySidebar). Remove phase badge (replaced by PhaseTabBar). Keep logo, export button, settings. | **Medium** — ~50% reduction |
| `CoachJourneyContext.tsx` | Extend with: `pinnedQuestion` state (current QuestionCard data), `canvasMode` state (which artifact/content to show in StrategyCanvas), `sidebarCollapsed` state, `orientationDismissed` per-phase state. | **Medium** — ~80 lines added |
| `MessageStream.tsx` | Remove QuestionCard rendering from scroll stream (moves to PinnedQuestionCard). Add filter to skip current question card type from inline rendering. | **Light** — ~20 lines changed |
| `CardRenderer.tsx` | Add `isPinned` prop to route QuestionCard rendering to PinnedQuestionCard vs inline based on whether it is the current active question. | **Light** — ~15 lines |
| `CoachingInput.tsx` | Simplify — remove smart prompts toggle (suggestions move to PinnedQuestionCard coaching buttons). Keep as pure text input. | **Light** — ~30 lines removed |

### 2.4 Migration Path

**Phase 1 (Week 1-2): Foundation**
1. Create `JourneySidebar.tsx` with navigation, coach profile, territory progress. Wire to existing `CoachJourneyContext`.
2. Create `PhaseTabBar.tsx`. Remove `HorizontalProgressStepper`, `PhaseProgressBar`, and StrategyHeader phase badge.
3. Restructure `ProductStrategyAgentInterface.tsx` to three-column layout with placeholder panels.

**Phase 2 (Week 3-4): Core UX**
4. Create `PinnedQuestionCard.tsx`. Extend `CoachJourneyContext` with `pinnedQuestion` state.
5. Modify `MessageStream.tsx` to exclude current pinned question from scroll.
6. Create `OrientationView.tsx` for phase entry welcome screens.
7. Create `CoachSuggestionPanel.tsx` with gold-border expandable suggestions.

**Phase 3 (Week 5-6): Canvas and Polish**
8. Create `StrategyCanvas.tsx`, migrating content from `ContextPreviewContent.tsx` previews.
9. Create `DebateView.tsx` for rich debate interactions.
10. Responsive behaviour: sidebar collapse at <1440px, canvas collapse at <1200px.
11. Delete deprecated `ContextPreviewPanel.tsx`, `ContextPanel/ContextPanel.tsx`.
12. Animation entrance sequence: header (0ms) -> sidebar (75ms) -> main (150ms) -> canvas (300ms).

**Phase 4 (Week 7-8): Testing and Refinement**
13. Update unit tests for refactored components.
14. E2E test updates for new layout selectors.
15. UAT with existing users for regression validation.

### 2.5 Component Reuse Analysis

| Existing Component | Reuse Status |
|---|---|
| `MessageStream.tsx` | **Reused** — minor filter modification |
| `CoachingInput.tsx` | **Reused** — simplified |
| `CardRenderer.tsx` + all card types | **Reused** — minor prop addition |
| `TerritoryNav.tsx` | **Migrated** — logic moves to JourneySidebar |
| `XPBar.tsx`, `AchievementBadge.tsx` | **Migrated** — render location changes |
| `SessionHeader.tsx` | **Partially reused** — persona selector migrates |
| `DiscoverySection.tsx`, `ResearchSection.tsx` | **Reused** — render inside StrategyCanvas |
| `SynthesisSection.tsx`, `BetsSection.tsx` | **Reused** — render inside StrategyCanvas |
| `ContextPreviewPanel.tsx` | **Deleted** — replaced by StrategyCanvas |
| `PhaseProgressBar.tsx` | **Deleted** — replaced by PhaseTabBar |
| `HorizontalProgressStepper.tsx` | **Deleted** — replaced by PhaseTabBar |
| `ResizeDivider.tsx` | **Deleted** — fixed column widths |
| `CoachJourneyContext.tsx` | **Extended** — new state fields |

**Reuse rate: ~70%** of existing component code is preserved or migrated.

### 2.6 Effort Estimate

| Task | Effort |
|---|---|
| JourneySidebar + responsive collapse | 3-4 days |
| PhaseTabBar + phase indicator consolidation | 1-2 days |
| ProductStrategyAgentInterface restructuring | 2-3 days |
| PinnedQuestionCard + context wiring | 2-3 days |
| CoachSuggestionPanel | 1-2 days |
| StrategyCanvas + content migration | 3-4 days |
| OrientationView | 2 days |
| DebateView | 2-3 days |
| StrategyHeader slim-down | 1 day |
| CoachJourneyContext extensions | 1 day |
| MessageStream / CardRenderer modifications | 1 day |
| Responsive breakpoints + animation | 2 days |
| Testing + regression | 3-4 days |
| **Total** | **24-33 days (5-7 weeks)** |

---

## 3. Option D — Detailed Implementation Plan

### 3.1 Architecture

Option D replaces spatial layout with temporal modes. At any point the user is in exactly one of three modes:

```
MODE 1 — ORIENTATION (full-width)
+--------------------------------------------------------------+
| SlimHeader (56px) + Breadcrumb                                |
+--------------------------------------------------------------+
| Full-Width Orientation Content                                |
| +----------------------------------------------------------+ |
| | Phase Welcome + Territory Cards + Progress Overview      | |
| | "Begin Company Territory" CTA                            | |
| +----------------------------------------------------------+ |
| +----------------------------------------------------------+ |
| | MiniCoachBar — "Ask your coach..." (compact input)       | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+

MODE 2 — FOCUSED WORK (60/40 split)
+--------------------------------------------------------------+
| SlimHeader (56px) + Breadcrumb (Research > Company > Q2)     |
+-------------------------------+------------------------------+
| QuestionFocusPanel (60%)      | Coach Panel (40%)            |
| +---------------------------+ | +---------------------------+|
| | Large question display    | | | Contextual coaching chat ||
| | Territory/area context    | | | Coach suggestion          ||
| | Textarea + confidence     | | | Debate challenge          ||
| | "Save Draft" / "Submit"   | | | Smart prompts             ||
| +---------------------------+ | +---------------------------+|
+-------------------------------+------------------------------+

MODE 3 — FREE CONVERSATION (full-width)
+--------------------------------------------------------------+
| SlimHeader (56px) + Breadcrumb + "Back to Questions" link    |
+--------------------------------------------------------------+
| Full-Width Chat Interface                                     |
| +----------------------------------------------------------+ |
| | MessageStream (full-width, max-w-3xl centred)            | |
| +----------------------------------------------------------+ |
| +----------------------------------------------------------+ |
| | CoachingInput (full-width)                               | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+
```

**Mode transitions:**
- Orientation -> Focused Work: User clicks "Begin Territory" or selects a research area
- Focused Work -> Free Conversation: User clicks "Open Chat" or sends an off-topic message
- Free Conversation -> Focused Work: User clicks "Back to Questions" or selects a question from breadcrumb
- Any -> Orientation: User clicks phase/territory in breadcrumb to go back to overview

### 3.2 New Components Required

| Component | Responsibility | Estimated Lines | Effort |
|---|---|---|---|
| `ModeController.tsx` | State machine orchestrating mode transitions. Manages `currentMode`, `transitionDirection`, `modeHistory` stack. Exposes `enterMode()`, `goBack()`, `pushMode()`. | 200-250 | 3-4 days |
| `OrientationMode.tsx` | Full-width welcome screen with territory cards, progress overview, phase purpose explanation. Includes MiniCoachBar at bottom. | 250-320 | 3-4 days |
| `FocusedWorkMode.tsx` | 60/40 split with QuestionFocusPanel on left and contextual CoachPanel on right. Manages question navigation within a research area. | 280-350 | 4-5 days |
| `FreeConversationMode.tsx` | Full-width centred chat interface. MessageStream at max-width with generous whitespace. "Back to Questions" persistent link. | 150-200 | 2-3 days |
| `ModeTransition.tsx` | Animated transition wrapper. Handles slide/fade animations between modes. Uses `framer-motion` or CSS animations with `transitionDirection` prop. | 120-160 | 2-3 days |
| `Breadcrumb.tsx` | Contextual breadcrumb navigation replacing sidebar. Shows: Phase > Territory > Area > Question. Each segment is clickable, routing to the appropriate mode. | 100-130 | 1-2 days |
| `MiniCoachBar.tsx` | Compact single-line coach input for Orientation mode. Expands to full chat on focus (transitions to Mode 3). | 80-100 | 1 day |
| `QuestionFocusPanel.tsx` | Large question display for Focused Work mode. Full-height panel with question text, territory/area badge, confidence selector, large textarea, coaching action buttons. | 200-250 | 2-3 days |

**Total new code:** ~1,380-1,760 lines across 8 components.

### 3.3 Mode State Machine Design

```typescript
// ModeController state machine
type Mode = 'orientation' | 'focused_work' | 'free_conversation';

interface ModeState {
  currentMode: Mode;
  previousMode: Mode | null;
  modeHistory: Mode[];                     // Stack for back navigation
  transitionDirection: 'forward' | 'back'; // Animation direction
  orientationContext: {
    phase: string;                         // Which phase overview to show
  };
  focusedWorkContext: {
    territory: string;                     // company | customer | competitor
    researchArea: string;                  // e.g., "company_foundation"
    questionIndex: number;                 // Current question
  } | null;
  freeConversationContext: {
    returnTo: 'orientation' | 'focused_work'; // Where "Back" goes
    returnContext: object;                    // Preserved context for return
  };
}

// Transitions
type ModeAction =
  | { type: 'ENTER_TERRITORY'; territory: string; area: string }
  | { type: 'OPEN_CHAT' }
  | { type: 'BACK_TO_QUESTIONS' }
  | { type: 'BACK_TO_OVERVIEW' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_AREA' };
```

### 3.4 Files to Modify

| File | Change Description | Scope |
|---|---|---|
| `ProductStrategyAgentInterface.tsx` | Replace two-column layout with ModeController wrapper. Render single mode component at a time. Remove ResizeDivider, context panel width logic. | **Heavy** — ~70% rewrite |
| `CoachLedPanel.tsx` | Split into two surfaces: `FocusedWorkMode` coach panel (40%) and `FreeConversationMode` full-width chat. Core message handling logic shared via extracted hook. | **Heavy** — decomposed into 2 components |
| `ContextPreviewPanel.tsx` | **Replaced entirely** — territory detail moves to OrientationMode cards and FocusedWorkMode context badges. | **Delete** |
| `StrategyHeader.tsx` | Slim to 56px. Add Breadcrumb component integration. Remove all gamification (moves to OrientationMode sidebar cards). | **Heavy** — ~60% rewrite |
| `CoachJourneyContext.tsx` | Major extension: add `ModeState`, `modeDispatch`, mode transition handlers, `focusedWorkContext`, breadcrumb data derivation. | **Heavy** — ~150 lines added |
| `MessageStream.tsx` | Add `variant` prop for full-width vs panel rendering. Adjust max-width and padding based on mode. | **Medium** — ~40 lines |
| `CoachingInput.tsx` | Add `variant` prop for compact (MiniCoachBar) vs full-width vs panel modes. | **Medium** — ~50 lines |
| `CardRenderer.tsx` | Route cards differently based on mode context. QuestionCards render in QuestionFocusPanel (Mode 2) not MessageStream. | **Medium** — ~30 lines |

**Additional infrastructure:**
- `framer-motion` dependency (or custom CSS transition system) for mode animations
- `useMessageHandler.ts` extracted hook — shared message sending/streaming logic used by both FocusedWorkMode and FreeConversationMode

### 3.5 Migration Path

**Phase 1 (Week 1-3): State Machine Foundation**
1. Design and implement `ModeController.tsx` with state machine reducer.
2. Extend `CoachJourneyContext.tsx` with mode state, dispatch, and transition logic.
3. Create `Breadcrumb.tsx` with clickable segments.
4. Create `ModeTransition.tsx` animation wrapper.
5. Restructure `ProductStrategyAgentInterface.tsx` to render modes via ModeController.

**Phase 2 (Week 4-6): Mode Implementation**
6. Create `OrientationMode.tsx` with territory cards and MiniCoachBar.
7. Extract `useMessageHandler.ts` hook from CoachLedPanel.
8. Create `FocusedWorkMode.tsx` with QuestionFocusPanel + Coach split.
9. Create `FreeConversationMode.tsx` with full-width chat.
10. Create `QuestionFocusPanel.tsx` with large question display.

**Phase 3 (Week 7-9): Transitions and Polish**
11. Implement and tune mode transition animations (slide, fade, cross-fade).
12. Wire breadcrumb navigation to mode transitions.
13. Handle edge cases: mid-stream mode switch, unsaved question answers, mode history depth.
14. Responsive: modes adapt to mobile (orientation stays full-width, focused work stacks vertically, free conversation stays full-width).

**Phase 4 (Week 10-12): Testing and Refinement**
15. State machine unit tests (all transition paths, edge cases, invalid transitions).
16. Animation performance testing (jank, GPU acceleration).
17. Accessibility audit: focus management on mode transitions, screen reader announcements.
18. E2E tests for each mode and transition path.
19. UAT with existing users — mode comprehension validation.

### 3.6 Component Reuse Analysis

| Existing Component | Reuse Status |
|---|---|
| `MessageStream.tsx` | **Reused** — with `variant` prop for width modes |
| `CoachingInput.tsx` | **Reused** — with `variant` prop for compact/full |
| `CardRenderer.tsx` + card types | **Partially reused** — QuestionCard routing changes |
| `TerritoryNav.tsx` | **Replaced** — territory selection moves to OrientationMode cards |
| `XPBar.tsx`, `AchievementBadge.tsx` | **Migrated** — render in OrientationMode |
| `SessionHeader.tsx` | **Partially reused** — persona selector migrates to settings |
| `DiscoverySection.tsx`, `ResearchSection.tsx` | **Decomposed** — content distributed across modes |
| `CoachLedPanel.tsx` | **Decomposed** — split into FocusedWorkMode + FreeConversationMode |
| `ContextPreviewPanel.tsx` | **Deleted** |
| `PhaseProgressBar.tsx` | **Deleted** — replaced by Breadcrumb + OrientationMode |
| `CoachJourneyContext.tsx` | **Heavily extended** |

**Reuse rate: ~45%** of existing component code is preserved. Most components are decomposed or replaced.

### 3.7 Effort Estimate

| Task | Effort |
|---|---|
| ModeController state machine | 3-4 days |
| CoachJourneyContext mode extensions | 2-3 days |
| Breadcrumb navigation | 1-2 days |
| ModeTransition animations | 2-3 days |
| ProductStrategyAgentInterface restructuring | 3-4 days |
| OrientationMode + MiniCoachBar | 3-4 days |
| useMessageHandler extraction | 2 days |
| FocusedWorkMode + QuestionFocusPanel | 4-5 days |
| FreeConversationMode | 2-3 days |
| StrategyHeader + Breadcrumb integration | 2 days |
| MessageStream / CoachingInput variants | 2 days |
| Transition tuning + edge cases | 3-4 days |
| Responsive mode adaptation | 2-3 days |
| State machine unit tests | 2-3 days |
| E2E + accessibility testing | 3-4 days |
| UAT + mode comprehension validation | 2-3 days |
| **Total** | **38-51 days (8-11 weeks)** |

---

## 4. Side-by-Side Comparison

| Dimension | Option C | Option D |
|---|---|---|
| **Layout approach** | Persistent 3-column (sidebar + main + canvas) | Adaptive modes (one mode visible at a time) |
| **Navigation model** | Sidebar nav + PhaseTabBar | Breadcrumbs + mode switches triggered by actions |
| **Information density** | High — all three zones visible simultaneously | Low per mode — maximised focus on one task |
| **Learning curve** | Low — familiar 3-panel pattern (Notion, Slack, Jira) | Medium — users must learn mode concept and transitions |
| **Cognitive load** | Moderate — three panels to track, but each has clear purpose | Low within each mode, but elevated by mode awareness overhead |
| **Screen utilisation** | Good — 220px + 260px fixed panels leave ~60% for main content on 1440px | Excellent per mode — Orientation and Free Chat use full width |
| **The "where am I?" problem** | Minimal — sidebar always shows position | Risk of disorientation during mode transitions |
| **Question visibility** | Pinned above chat — always visible | Dominant in Mode 2, invisible in Mode 3 |
| **Chat accessibility** | Always available below pinned question | Requires mode switch from Orientation/Focused Work |
| **Simultaneous visibility** | Question + chat + canvas all visible | Only question + chat visible in Mode 2; never all three |
| **Mobile adaptation** | Collapse sidebar to icon rail, collapse canvas; main content fills width | Simplify modes — all three modes render as full-width stacked views |
| **Component reuse** | ~70% of existing code preserved | ~45% of existing code preserved |
| **New components** | 7 new components (~1,350 lines) | 8 new components (~1,570 lines) |
| **State complexity** | Medium — extends existing context with 3-4 new fields | High — full state machine with mode history, transitions, contexts |
| **Testing complexity** | Medium — standard component + integration tests | High — state machine paths, animation timing, transition edge cases |
| **Accessibility (a11y)** | Standard 3-panel a11y with landmark regions | Mode transition a11y concerns: focus management, live regions, announcements |
| **Enterprise user expectation** | Matches — Notion, Salesforce, HubSpot, Jira all use persistent multi-panel | Novel — may confuse enterprise users expecting consistent spatial layout |
| **AI UX alignment** | 76/80 (from analysis) | 78/80 (from analysis) |
| **Animation complexity** | Low — entrance sequence only | High — inter-mode transitions, cross-fades, slide animations |
| **Risk level** | Medium — well-understood pattern | High — novel pattern, mode comprehension risk, animation jank risk |
| **Rollback difficulty** | Low — can revert to 2-column by removing sidebar/canvas | High — mode decomposition is difficult to undo without full rebuild |
| **Effort** | 24-33 days (5-7 weeks) | 38-51 days (8-11 weeks) |
| **Dependencies added** | None | `framer-motion` or custom animation system |

---

## 5. B2B Enterprise Complexity Analysis

### 5.1 Why Option D May Be Too Complex for B2B

**Enterprise users prioritise predictability over innovation.** Frontera's target personas — CPOs, VPs of Product, and Senior PMs — use enterprise tools 8+ hours per day. They have deep muscle memory for persistent-layout applications: Salesforce (sidebar + list + detail), Jira (sidebar + board/list + detail), Notion (sidebar + page), HubSpot (nav + workspace). These tools share one trait: **spatial consistency**. The sidebar is always there. The workspace is always in the same place. Users build spatial memory of where things are.

**Mode-switching introduces "where am I?" confusion.** When a user enters Focused Work mode and then opens Free Conversation, the question they were answering disappears. To return, they must understand the mode hierarchy and consciously navigate back. Nielsen Norman Group's 2025 research on AI interface patterns warns: *"Mode-based interfaces increase error rates by 15-23% compared to persistent-panel layouts because users forget which mode they are in."*

**Multi-mode interfaces have higher training costs.** Enterprise software purchases include onboarding budgets. Frontera's Strategy Coach already has a 4-phase methodology with 9 research areas across 3 territories. Adding a 3-mode layer on top of this creates a 4 x 3 x 3 complexity matrix. Option C's persistent layout means users learn the spatial arrangement once and never think about it again.

**The "two-click rule" for enterprise.** Enterprise users expect any piece of information to be reachable within two clicks. In Option C, the current question is always visible (zero clicks). In Option D, if you are in Free Conversation mode and want to see your current question, you must: (1) click "Back to Questions" and (2) wait for the mode transition animation. That is two actions plus a cognitive context switch.

**Enterprise procurement evaluators test for "discoverability."** When a VP of Product evaluates Frontera against competitors, they will open the tool and look for strategic coaching content. In Option C, territory progress, the current question, chat, and the strategy canvas are all visible on first load. In Option D, the Orientation mode shows overview cards but no active work surface — the evaluator must click into a territory to see the coaching experience.

### 5.2 Counter-Arguments for Option D

**Modern enterprise tools DO use adaptive interfaces.** Figma switches between design mode, prototype mode, and dev mode — though these are clearly labelled tabs, not implicit transitions. Linear uses a focus mode for individual issues that replaces the list view. GitHub's pull request page is effectively a mode switch from the code view. These tools succeed because the mode boundaries are explicit, visually obvious, and instantly reversible.

**Modes reduce cognitive load within each view.** There is strong evidence that showing only the relevant information for the current task improves focus. Option D's Focused Work mode eliminates the sidebar and canvas distractions, giving the user a clean 60/40 split between question and coaching. For the 2+ hours users spend in the research phase, this focused environment could improve answer quality.

**If transitions are smooth and reversible, disorientation is minimal.** With proper breadcrumb navigation, animated transitions that show spatial relationship between modes (e.g., Focused Work slides in from the right of Orientation), and a persistent "Back" affordance, the disorientation risk can be mitigated. The key is ensuring transitions take <300ms and the breadcrumb always shows the full context path.

### 5.3 Verdict

The counter-arguments have merit in consumer and design-tool contexts, but Frontera is a **strategic coaching platform for enterprise product leaders**. These users are:

1. **Time-constrained** — they need to see progress at a glance, not navigate between modes
2. **Context-switching frequently** — they may leave and return to Frontera between meetings; persistent layout means instant reorientation
3. **Evaluating the tool for team purchase** — first impressions must show the full coaching experience, not a welcome screen
4. **Accustomed to information-dense dashboards** — they manage Jira boards, Amplitude dashboards, and OKR trackers daily

Option D's UX superiority (78/80 vs 76/80 on AI patterns) is a 2.5% advantage that does not justify the 60-90% increase in implementation effort, the enterprise UX risk, and the testing complexity. The persistent three-column layout of Option C is the safer, faster, and more appropriate choice for Frontera's B2B context.

---

## 6. Artifacts Enhancement Layer

The Claude Artifacts "Strategy Artifacts" model (detailed in Section 4 of the main UX Analysis) is a **cross-cutting enhancement** applicable to both options. Here is how it integrates with each:

### 6.1 Option C + Artifacts

The StrategyCanvas right panel (260px) becomes an **interactive artifact workspace**:

```
+-----------+----------------------------------+------------------+
| Journey   | Main Content                     | StrategyCanvas   |
| Sidebar   |                                  | (Artifact Panel) |
|           | PinnedQuestionCard               |                  |
|           | +------------------------------+ | +---------------+|
|           | | Chat MessageStream           | | | ACTIVE        ||
|           | |                              | | | ARTIFACT      ||
|           | | Coach says: "Let me review   | | |               ||
|           | | your customer segment..."    | | | Territory     ||
|           | |                              | | | Deep-Dive     ||
|           | |                              | | | Card          ||
|           | +------------------------------+ | |               ||
|           | CoachingInput                    | | | [interactive] ||
+-----------+----------------------------------+------------------+
```

**Integration pattern:**
- When the coach generates or references a strategic artifact (territory card, synthesis summary, bet card), it materialises in the StrategyCanvas.
- User can edit artifact content directly in the canvas while discussing with the coach in chat.
- Artifacts persist across conversation turns — the canvas shows the "current working artifact."
- Version history accessible via canvas header controls.

**Implementation impact:** Adds ~2 weeks to Option C. The StrategyCanvas already renders phase-specific content; the Artifacts enhancement makes that content interactive and editable rather than read-only.

### 6.2 Option D + Artifacts

In Mode 2 (Focused Work), the right 40% panel becomes an artifact workspace:

```
+-------------------------------+------------------------------+
| QuestionFocusPanel (60%)      | Artifact Panel (40%)         |
| Current question + textarea   | Interactive territory card   |
|                               | with coach annotations       |
+-------------------------------+------------------------------+
```

**Integration pattern:**
- Mode 2 naturally has a two-panel layout. The right panel can render either coaching chat OR an active artifact.
- A toggle or tab allows switching between "Coach" and "Artifact" views in the right panel.
- This actually simplifies Mode 2's architecture — instead of a dedicated coach panel, it becomes a flexible workspace panel.

**Implementation impact:** Adds ~2-3 weeks to Option D (on top of the already longer timeline). The artifact panel replaces the coach panel in some contexts, requiring additional routing logic.

### 6.3 Which Option Benefits More?

**Option C benefits more from the Artifacts enhancement.** The persistent three-column layout means the artifact workspace is always visible alongside conversation. This matches the Claude Artifacts / ChatGPT Canvas model precisely: chat on the left, artifact on the right, always simultaneously visible. Users can discuss strategy in chat while seeing and editing the artifact in the canvas.

Option D's mode-based approach means artifacts are only visible in Mode 2, and even then, they compete with the coaching chat for the right panel. Users cannot see an artifact while in Free Conversation mode. This undermines the core Artifacts insight: **persistent simultaneous visibility of conversation and workspace**.

---

## 7. Recommendation

### Option C is the recommended path.

The reasoning spans five dimensions:

**1. Enterprise audience alignment.** Frontera serves CPOs, VPs of Product, and Senior PMs at enterprise organisations. These users expect persistent, spatially consistent interfaces. Option C's three-column layout matches the mental model they have built across Notion, Salesforce, Jira, and other enterprise tools. Option D's mode-switching, while elegant, introduces a novel interaction pattern that requires learning and creates reorientation overhead.

**2. Technical feasibility and codebase fit.** The current codebase (`ProductStrategyAgentInterface.tsx`, `CoachLedPanel.tsx`, `CoachJourneyContext.tsx`) is structured around a two-panel layout with a shared context provider. Option C extends this to three panels by adding a sidebar and replacing the context preview panel — an incremental structural change. Option D requires decomposing `CoachLedPanel.tsx` into two separate mode components, building a state machine, and adding animation infrastructure — a fundamental architectural change.

**3. Risk/reward ratio.** Option C delivers 76/80 on AI UX patterns (95% of Option D's 78/80) at 5-7 weeks vs 8-11 weeks. The 2-point UX improvement of Option D does not justify the 60-90% additional effort, the mode-comprehension UX risk, the transition animation complexity, or the testing burden of a full state machine.

**4. Time to market.** Frontera is in active UAT (as evidenced by the `Background/UAT/` screenshots). Getting the UX upgrade to users faster generates feedback faster. Option C can ship an MVP (sidebar + pinned question + slimmed header) in 3-4 weeks, with the StrategyCanvas and OrientationView following in weeks 5-7. Option D has no meaningful intermediate milestone — the mode system is all-or-nothing.

**5. Phased evolution path.** Option C naturally evolves into the Artifacts Enhancement Layer: the StrategyCanvas becomes an interactive artifact workspace. This phased approach (Option C in weeks 1-7, Artifacts layer in weeks 8-10) delivers a best-in-class AI coaching interface that rivals Claude Artifacts and ChatGPT Canvas in UX quality, with the added advantage of Frontera's domain-specific structure (territories, phases, synthesis).

### Recommended Implementation Timeline

| Milestone | Scope | Duration |
|---|---|---|
| **M1: Foundation** | JourneySidebar, PhaseTabBar, layout restructure | Weeks 1-2 |
| **M2: Core UX** | PinnedQuestionCard, OrientationView, MessageStream filter | Weeks 3-4 |
| **M3: Canvas** | StrategyCanvas, DebateView, responsive breakpoints | Weeks 5-6 |
| **M4: Polish** | Animations, testing, regression, UAT | Week 7 |
| **M5: Artifacts** (optional) | Interactive canvas, artifact materialisation, versioning | Weeks 8-10 |

This timeline delivers the full Option C redesign in 7 weeks, with the Artifacts enhancement as an optional 3-week follow-on that elevates the experience further.

---

## Appendix: Key File Paths

| File | Role |
|---|---|
| `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx` | Top-level layout orchestrator |
| `src/components/product-strategy-agent/CoachLedPanel/CoachLedPanel.tsx` | Primary coaching chat panel |
| `src/components/product-strategy-agent/ContextPreviewPanel/ContextPreviewPanel.tsx` | Current right panel (to be replaced) |
| `src/components/product-strategy-agent/ContextPreviewPanel/ContextPreviewContent.tsx` | Phase-specific content router |
| `src/components/product-strategy-agent/StrategyHeader.tsx` | Top header with gamification |
| `src/contexts/CoachJourneyContext.tsx` | Journey state management provider |
| `src/components/product-strategy-agent/CoachLedPanel/TerritoryNav.tsx` | Territory picker in coaching panel |
| `src/components/product-strategy-agent/CoachingPanel/MessageStream.tsx` | Chat message rendering |
| `src/components/product-strategy-agent/CoachingPanel/CoachingInput.tsx` | Chat text input |
| `src/components/product-strategy-agent/CoachingPanel/cards/CardRenderer.tsx` | Card type dispatcher |
| `src/components/product-strategy-agent/CoachingPanel/cards/QuestionCard.tsx` | Question card component |
| `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` | Mobile canvas (full-width) |
| `src/components/product-strategy-agent/Gamification/XPBar.tsx` | XP progress bar |
| `src/components/product-strategy-agent/Gamification/AchievementBadge.tsx` | Achievement display |
