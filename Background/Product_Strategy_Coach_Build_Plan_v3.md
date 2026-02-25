# BUILD PLAN: Product Strategy Coach v3.0

## Coaching-Central Strategic Platform with Living Strategy System

---

| Field | Value |
|-------|-------|
| **Based On** | Product Strategy Coach PRD v3.0 (February 2026) |
| **Date** | February 2026 |
| **Status** | Pending Approval |
| **Codebase** | `product-strategy-agent-v2/` (MVP 2.0 as foundation) |
| **Sprint Cadence** | 1-week sprints |

---

## Build Philosophy

Each sprint delivers a **shippable increment** that can be tested with users. The build order follows the PRD's phased roadmap but adds technical specifics: exact files to create/modify, database migrations, API routes, and component architecture.

**Notation:**
- `[NEW]` = New file/component to create
- `[MOD]` = Existing file to modify
- `[MIG]` = Database migration required
- `[API]` = New API route

---

## Sprint 1: Foundation (Week 1)

**Goal:** Reduce friction in the existing v2 journey without layout changes. Quick wins that improve the current experience.

### 1.1 Reduce Research Questions (36 → 27)

| Task | Files | Detail |
|------|-------|--------|
| Audit all 9 research areas and consolidate overlapping questions | `[MOD]` `src/lib/agents/strategy-coach/system-prompt.ts` | Review territory question prompts; merge/remove 9 lower-value questions across Company, Customer, Competitor territories |
| Update territory deep-dive question sets | `[MOD]` `src/components/product-strategy-agent-v2/CanvasPanel/CustomerTerritoryDeepDive.tsx` | Reduce question count per research area |
| Update Company + Competitor territory deep-dives | `[MOD]` Equivalent territory components | Same consolidation |

### 1.2 Add Time Estimates Per Phase

| Task | Files | Detail |
|------|-------|--------|
| Add estimated duration to phase stepper | `[MOD]` `src/components/product-strategy-agent-v2/CanvasPanel/` (phase header components) | Show "~15 min" / "~25 min per territory" / "~10 min" / "~30 min" next to each phase label |

### 1.3 Add Confidence Ratings Per Research Response

| Task | Files | Detail |
|------|-------|--------|
| Add confidence selector to territory question inputs | `[NEW]` `src/components/product-strategy-agent-v2/CanvasPanel/ConfidenceRating.tsx` | Three-option pill selector: "Based on Data" / "Based on Experience" / "This is a Guess" |
| Store confidence in territory_insights responses | `[MOD]` `src/app/api/product-strategy-agent-v2/territories/route.ts` | Extend response JSONB to include `confidence` per answer |
| Display confidence in synthesis evidence trails | `[MOD]` `src/components/product-strategy-agent-v2/CanvasPanel/SynthesisSection.tsx` | Show confidence badges on evidence cards |

### 1.4 Post-Phase Reflection Prompts

| Task | Files | Detail |
|------|-------|--------|
| Add reflection prompt to phase transition | `[MOD]` `src/lib/agents/strategy-coach/system-prompt.ts` | After each phase completion, coach asks: "What surprised you? What assumption changed?" |
| Add kill-date field to strategic bets | `[MOD]` Bets creation UI + API | Date picker for kill date; stored in `framework_state` |

### Sprint 1 Deliverables
- Reduced question count (27 questions across 9 areas)
- Time estimates visible on phase stepper
- Confidence ratings on every research response
- Post-phase reflection prompts from coach
- Kill-date field on strategic bets

---

## Sprint 2-3: Journey Energy (Weeks 2-3)

**Goal:** Break the 2.5-hour silence. Users receive strategic value after every territory completion.

### 2.1 Micro-Synthesis Engine

| Task | Files | Detail |
|------|-------|--------|
| Create micro-synthesis API endpoint | `[API]` `src/app/api/product-strategy-agent-v2/micro-synthesis/route.ts` | POST with `conversation_id` + `territory_type`; calls Claude to generate 3 key findings from one territory's responses |
| Create micro-synthesis prompt template | `[NEW]` `src/lib/agents/strategy-coach/micro-synthesis-prompt.ts` | Prompt that takes territory responses + confidence ratings → generates structured insight summary (3 key findings, confidence level, strategic implications) |
| Store micro-synthesis results | `[MOD]` `conversations.framework_state` | Add `microSynthesisResults.{territory}` to framework_state JSONB |

### 2.2 Territorial Insight Summary Card

| Task | Files | Detail |
|------|-------|--------|
| Create insight summary display component | `[NEW]` `src/components/product-strategy-agent-v2/CanvasPanel/TerritorialInsightSummary.tsx` | Card showing 3 key findings, confidence level, "View Details" / "Continue" CTAs. Uses Frontera card design (navy header, gold accent) |
| Trigger micro-synthesis on territory completion | `[MOD]` Territory deep-dive components | When all 3 areas in a territory are marked "mapped", auto-trigger micro-synthesis API |
| Display insight summary in canvas panel | `[MOD]` `src/components/product-strategy-agent-v2/CanvasPanel/ResearchSection.tsx` | Show territorial insight summary card after territory completion |

### 2.3 Progress Indicators

| Task | Files | Detail |
|------|-------|--------|
| Add Duolingo-style progress rings | `[NEW]` `src/components/product-strategy-agent-v2/ProgressRing.tsx` | Circular progress indicator with percentage. Territory-specific colours (indigo/cyan/purple) |
| Add overall journey progress bar | `[MOD]` Phase stepper component | Linear progress showing overall completion across all phases |
| Add territory completion celebrations | `[MOD]` Territory components | Subtle animation + gold checkmark when territory complete |

### 2.4 Strategy on a Page Generator (from Synthesis)

| Task | Files | Detail |
|------|-------|--------|
| Enhance synthesis to generate Strategy on a Page | `[MOD]` `src/lib/synthesis/cross-pillar.ts` | Add Playing-to-Win framework output: Winning Aspiration, Where to Play, How to Win, Capabilities, Management Systems |
| Create Strategy on a Page display component | `[NEW]` `src/components/product-strategy-agent-v2/CanvasPanel/StrategyOnAPage.tsx` | Premium card layout showing the 5 PTW elements. Export + Share CTAs |
| Add Strategy on a Page PDF export | `[API]` `src/app/api/product-strategy-agent-v2/strategy-page/export/route.ts` | PDFKit export following existing PDF pattern |

### Sprint 2-3 Deliverables
- Micro-synthesis generates after each territory (~25 min, not 2.5 hours)
- Territorial Insight Summary cards with 3 key findings
- Progress rings per territory + overall journey bar
- Strategy on a Page generated at synthesis
- Strategy on a Page PDF export

---

## Sprint 4-5: Layout Inversion (Weeks 4-5)

**Goal:** The single biggest design change — coaching becomes 60% of the viewport. Canvas becomes a supporting context panel.

### 4.1 New Coaching Centre Component

| Task | Files | Detail |
|------|-------|--------|
| Create coaching centre layout | `[NEW]` `src/components/product-strategy-agent-v2/CoachingCentre/CoachingCentre.tsx` | 60% width panel with chat messages, inline action cards, input area. Full-height scrollable conversation |
| Create inline action card system | `[NEW]` `src/components/product-strategy-agent-v2/CoachingCentre/InlineActionCard.tsx` | Rich card component rendered within chat flow. Variants: micro-synthesis, research-prompt, debate-invitation, artefact-preview, calibration, signal-alert |
| Migrate chat logic from CoachingPanel | `[MOD]` Existing `CoachingPanel/` components | Move message rendering, input, streaming logic into new CoachingCentre |

### 4.2 Context Panel (Former Canvas)

| Task | Files | Detail |
|------|-------|--------|
| Create context panel wrapper | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/ContextPanel.tsx` | 40% width panel. Phase-aware tab navigation at top. Collapsible, expandable, pinnable |
| Restructure phase sections as context views | `[MOD]` All `CanvasPanel/` section components | Existing Discovery, Research, Synthesis, Bets sections become context panel views (narrower layout, supporting role) |
| Add phase-aware auto-switching | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/useContextPanelState.ts` | Hook that switches context panel content based on coaching conversation topic |

### 4.3 Interface Shell

| Task | Files | Detail |
|------|-------|--------|
| Rebuild main interface layout | `[MOD]` `src/components/product-strategy-agent-v2/ProductStrategyAgentInterface.tsx` | Replace 25/75 split with 60/40 coaching-centre/context-panel. Strategy header with phase indicator, strategy health, settings |
| Add responsive breakpoints | Same file | Desktop 60/40; Tablet 65/35; Mobile: coaching full-width, context as overlay |
| Context panel collapse/expand controls | `[NEW]` Context panel UI | Double-click expand to 60%; collapse button; pin toggle |

### 4.4 Inline Action Card Types (Initial Set)

| Task | Files | Detail |
|------|-------|--------|
| Micro-synthesis card (in chat) | `[NEW]` `src/components/product-strategy-agent-v2/CoachingCentre/cards/MicroSynthesisCard.tsx` | Shows 3 key findings inline. "Explore Details" opens context panel; "Continue" progresses |
| Research prompt card | `[NEW]` `...cards/ResearchPromptCard.tsx` | Question text + context. "Answer in Chat" / "Open in Panel" |
| Artefact preview card | `[NEW]` `...cards/ArtefactPreviewCard.tsx` | Summary of generated artefact. "View Full" / "Export" / "Share" |
| Debate invitation card | `[NEW]` `...cards/DebateInvitationCard.tsx` | Expert positions preview. "Enter Debate Mode" / "Skip" |

### Sprint 4-5 Deliverables
- 60/40 coaching-centre/context-panel layout
- Coaching centre with full chat + inline action cards
- Context panel with phase-aware content switching
- Responsive design (desktop, tablet, mobile)
- 4 inline action card types working in chat
- Phase transitions driven by coaching milestones

---

## Sprint 5-6: Strategic Maturity Assessment (Weeks 5-6)

**Goal:** Personalise the entire coaching journey based on the user's strategic archetype.

### 5.1 Assessment Database

| Task | Files | Detail |
|------|-------|--------|
| Create strategic_assessments table | `[MIG]` Supabase migration | Table per PRD Section 12.1: responses JSONB, dimension_scores, archetype, strength/growth |
| Create assessment API routes | `[API]` `src/app/api/product-strategy-agent-v2/assessment/route.ts` | POST to save assessment; GET to retrieve; scoring algorithm in handler |

### 5.2 Assessment Flow UI

| Task | Files | Detail |
|------|-------|--------|
| Create assessment page | `[NEW]` `src/app/dashboard/product-strategy-agent-v2/assessment/page.tsx` | Triggered after onboarding, before first strategy session |
| Create Likert question component | `[NEW]` `src/components/product-strategy-agent-v2/Assessment/LikertQuestion.tsx` | 5-point scale (Strongly Disagree → Strongly Agree). Progress bar "X/23 Completed" |
| Create situational choice component | `[NEW]` `...Assessment/SituationalChoice.tsx` | Multi-choice scenario questions (3 questions) |
| Create assessment results page | `[NEW]` `...Assessment/AssessmentResults.tsx` | Archetype card ("Today you are The Operator"), strength/growth scores, radar chart, "Begin Your Strategy Journey" CTA |

### 5.3 Archetype Classification Algorithm

| Task | Files | Detail |
|------|-------|--------|
| Scoring + classification logic | `[NEW]` `src/lib/assessment/scoring.ts` | Map 20 Likert + 3 situational → 5 dimension scores → archetype. Quadrant model per PRD Section 7.4 |
| Dimension definitions + question bank | `[NEW]` `src/lib/assessment/questions.ts` | 23 questions across Strategic Vision, Research Rigour, Execution Discipline, Stakeholder Alignment, Adaptive Capacity |

### 5.4 Coaching Adaptation Hooks

| Task | Files | Detail |
|------|-------|--------|
| Inject archetype into system prompt | `[MOD]` `src/lib/agents/strategy-coach/system-prompt.ts` | Load archetype from framework_state; inject coaching style instructions per PRD Section 7.6 |
| Store archetype in framework_state | `[MOD]` Conversation creation | When starting a new conversation, load user's archetype from `strategic_assessments` into `framework_state` |

### Sprint 5-6 Deliverables
- 23-question Strategic Maturity Assessment
- 4 archetype classifications (Operator, Visionary, Analyst, Diplomat)
- Results display with strength/growth scores
- Archetype-adapted coaching prompts throughout journey
- Assessment skippable with "Assess Later" option

---

## Sprint 6-7: Strategy Home (Weeks 6-7)

**Goal:** Replace the generic dashboard with a BetterUp-inspired personalised Strategy Home.

### 6.1 Strategy Home Page

| Task | Files | Detail |
|------|-------|--------|
| Create Strategy Home page | `[NEW]` `src/app/dashboard/product-strategy-agent-v2/home/page.tsx` | Replaces the conversation list as the primary entry point |
| Personalised greeting + strategic context | Server component | "Good morning, [Name]" with strategic context summary |
| Card grid layout | Responsive 2-column grid | 6 card types per PRD Section 6.3 |

### 6.2 Strategy Home Card Components

| Task | Files | Detail |
|------|-------|--------|
| Strategy Progress card | `[NEW]` `src/components/product-strategy-agent-v2/StrategyHome/ProgressCard.tsx` | Phase, percentage, territory count, opportunities count. "Continue Session" CTA |
| Today's Coaching Topic card | `[NEW]` `...StrategyHome/CoachingTopicCard.tsx` | AI-generated based on phase + archetype + gaps. "Chat Now" CTA |
| Strategic Signal card | `[NEW]` `...StrategyHome/SignalCard.tsx` | Latest market signal with "Review Impact" CTA |
| Recommended Activity card | `[NEW]` `...StrategyHome/ActivityCard.tsx` | Time estimate + question count. Archetype-adapted recommendations |
| Upcoming Review card | `[NEW]` `...StrategyHome/ReviewCard.tsx` | Kill date proximity + assumption status |
| Micro-Synthesis Preview card | `[NEW]` `...StrategyHome/SynthesisPreviewCard.tsx` | Latest territorial insight. "View Full Insight" CTA |

### 6.3 Always-Available Coach Entry

| Task | Files | Detail |
|------|-------|--------|
| Coach entry bar | `[NEW]` `...StrategyHome/CoachEntryBar.tsx` | "Start a strategy conversation about..." text input at bottom of Strategy Home. Opens coaching centre with context |

### 6.4 Strategy Home Data API

| Task | Files | Detail |
|------|-------|--------|
| Strategy Home data endpoint | `[API]` `src/app/api/product-strategy-agent-v2/home/route.ts` | Aggregates: latest conversation state, latest micro-synthesis, assessment archetype, pending signals, upcoming reviews. Single API call for the home page |

### Sprint 6-7 Deliverables
- Personalised Strategy Home replacing generic dashboard
- 6 contextual card types adapting to phase + archetype
- Always-available coach entry bar
- Single API endpoint for home page data

---

## Sprint 7-8: Coaching Enhancements (Weeks 7-8)

**Goal:** Deepen the AI coaching quality with proactive, adaptive, and challenging behaviours.

### 7.1 System Prompt Enhancements

| Task | Files | Detail |
|------|-------|--------|
| Blind spot detection | `[MOD]` `src/lib/agents/strategy-coach/system-prompt.ts` | Track which research areas have been covered; prompt coach to flag gaps ("I notice you haven't mentioned retention...") |
| Challenge escalation rules | Same file | Discovery: gentle probing → Research: medium challenge → Bets: demanding. Phase-specific intensity instructions |
| Methodology hints | Same file | Research-phase-specific: "Try segmenting by job-to-be-done..." / "Consider 5 customer interviews..." |
| "So What?" forcing | Same file | Post-synthesis: "Of these opportunities, which one scares you the most?" |
| Archetype-adapted prompts | Same file | Per PRD Section 7.6: Operators get "zoom out"; Visionaries get "ground it"; etc. |

### 7.2 Coach Personality & Multi-Coach System

| Task | Files | Detail |
|------|-------|--------|
| Coach profile matching | `[NEW]` `src/lib/agents/strategy-coach/coach-profiles.ts` | Define 3-4 coach personas (e.g., "The Challenger", "The Strategist", "The Analyst"). Matched to user archetype during assessment |
| Coach consultation behaviour | `[MOD]` System prompt | Coach can "consult" another coach personality for specific questions. Announced in chat: "Let me bring in a different perspective on this..." |
| Coach avatar + identity | `[MOD]` Chat message rendering | Display matched coach name + avatar. Switch avatar when consulting another coach |

### 7.3 Proactive Re-engagement

| Task | Files | Detail |
|------|-------|--------|
| Inactivity detection | `[NEW]` `src/lib/agents/strategy-coach/re-engagement.ts` | Check last session date; generate re-engagement prompt for Strategy Home card |
| Coach-initiated messages | `[MOD]` Strategy Home coaching topic card | "It's been 2 weeks. Your Competitor Territory is still unmapped..." |

### Sprint 7-8 Deliverables
- Blind spot detection in coaching
- Challenge escalation through phases
- Methodology research hints
- "So What?" moment after synthesis
- Coach personality matching to archetype
- Multi-coach consultation behaviour
- Proactive re-engagement prompts

---

## Sprint 8-10: Strategic Activation — Phase 5 (Weeks 8-10)

**Goal:** Build the strategy-to-execution bridge. The single biggest gap identified in the Critical Analysis.

### 8.1 Phase 5 Infrastructure

| Task | Files | Detail |
|------|-------|--------|
| Create strategic_artefacts table | `[MIG]` Supabase migration | Table per PRD Section 12.1: artefact_type, content JSONB, audience, share_token, is_living |
| Create activation API routes | `[API]` `src/app/api/product-strategy-agent-v2/activation/route.ts` | CRUD for team briefs, guardrails, OKRs, decision frameworks |
| Add Phase 5 to phase progression | `[MOD]` `src/app/api/product-strategy-agent-v2/phase/route.ts` | Extend phase transitions to include 'activation' |
| Add Phase 5 context panel | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/ActivationSection.tsx` | Display team briefs, OKRs, guardrails, stakeholder packs |

### 8.2 Team Brief Generator

| Task | Files | Detail |
|------|-------|--------|
| Team brief generation prompt | `[NEW]` `src/lib/agents/strategy-coach/team-brief-prompt.ts` | Per-bet prompt: takes bet details, research evidence, synthesis → generates context, problem, guardrails, metrics, kill criteria |
| Team brief API endpoint | `[API]` `src/app/api/product-strategy-agent-v2/activation/team-briefs/route.ts` | POST generates brief from Claude; stored in strategic_artefacts |
| Team brief display component | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/TeamBriefCard.tsx` | Structured card with sections. Edit, Export, Share CTAs |
| Team brief PDF export | `[API]` `src/app/api/product-strategy-agent-v2/activation/team-briefs/export/route.ts` | PDFKit export following existing pattern |

### 8.3 Strategic Guardrails Generator

| Task | Files | Detail |
|------|-------|--------|
| Guardrails generation prompt | `[NEW]` `src/lib/agents/strategy-coach/guardrails-prompt.ts` | Takes synthesis tensions + bet decisions → generates "We Will / We Will Not" statements |
| Guardrails display component | `[NEW]` `...ContextPanel/GuardrailsCard.tsx` | Two-column "We Will" / "We Will Not" layout |
| Guardrails as inline coaching card | Coach delivers guardrails in chat | Inline action card with guardrails preview |

### 8.4 OKR Cascade

| Task | Files | Detail |
|------|-------|--------|
| OKR generation prompt | `[NEW]` `src/lib/agents/strategy-coach/okr-prompt.ts` | Takes bets + success metrics → generates Objective + 3 Key Results per bet |
| OKR display component | `[NEW]` `...ContextPanel/OKRCascadeCard.tsx` | Structured OKR cards with linked bet reference |

### 8.5 Decision Framework

| Task | Files | Detail |
|------|-------|--------|
| Decision framework generation | `[NEW]` `src/lib/agents/strategy-coach/decision-framework-prompt.ts` | Takes strategy + guardrails → generates "When choosing X vs Y, prioritise..." rules |
| Decision framework display | `[NEW]` `...ContextPanel/DecisionFrameworkCard.tsx` | Prioritise / Consider / Deprioritise layout |

### 8.6 Stakeholder Communication Pack

| Task | Files | Detail |
|------|-------|--------|
| Multi-audience generation prompt | `[NEW]` `src/lib/agents/strategy-coach/stakeholder-pack-prompt.ts` | Takes full strategy → generates CPO/CEO, CTO, Sales, PM views |
| Audience switcher component | `[NEW]` `...ContextPanel/StakeholderPackViewer.tsx` | Tab-based audience selector showing different content emphasis per role |
| Per-audience PDF export | `[API]` Export route with audience parameter | Different PDF layouts per audience |

### Sprint 8-10 Deliverables
- Phase 5 fully functional with phase transition from Bets → Activation
- Team Brief Generator (per bet, with edit/export/share)
- Strategic Guardrails ("We Will / We Will Not")
- OKR Cascade proposals
- Decision Framework
- Stakeholder Communication Pack with audience-specific views
- All artefacts stored in `strategic_artefacts` table

---

## Sprint 10-11: Artefact Suite Enhancement (Weeks 10-11)

**Goal:** Living artefacts with shareable links, plus enhanced existing artefacts.

### 10.1 Living Artefact Links

| Task | Files | Detail |
|------|-------|--------|
| Shareable link system | `[NEW]` `src/app/api/product-strategy-agent-v2/share/[token]/route.ts` | Public GET endpoint serving artefact content by share_token. No auth required for shared links |
| Share token generation | `[MOD]` strategic_artefacts creation | Generate UUID share_token on artefact creation |
| Shared artefact viewer page | `[NEW]` `src/app/share/[token]/page.tsx` | Public page rendering artefact content. Read-only, branded, no login required |
| Auto-update for living artefacts | `[MOD]` Artefact API | When source data changes and `is_living = true`, regenerate content |

### 10.2 Progressive Artefact Display

| Task | Files | Detail |
|------|-------|--------|
| Artefact evolution timeline | `[NEW]` `src/components/product-strategy-agent-v2/CoachingCentre/cards/ArtefactEvolutionCard.tsx` | Shows how Strategy on a Page / Guardrails have evolved since last session. Inline card displayed periodically |
| Coach triggers artefact display | `[MOD]` System prompt | Coach periodically surfaces updated artefacts: "Your Strategy on a Page has evolved since last session. Here's what changed..." |

### 10.3 Enhanced Existing Artefacts

| Task | Files | Detail |
|------|-------|--------|
| Research Evidence Summary | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/EvidenceSummaryCard.tsx` | Generated after all territories complete. Structured by territory with confidence ratings |
| Assumption Register (initial) | `[MIG]` + `[API]` + `[NEW]` component | Create `assumption_register` table; API routes; display component. Extracted from WWHBT analysis in synthesis |

### Sprint 10-11 Deliverables
- Shareable living artefact links (public, no login)
- Auto-updating living artefacts
- Progressive artefact evolution display in coaching
- Research Evidence Summary
- Assumption Register (initial version)
- PDF download alongside every living link

---

## Sprint 11-13: Living Strategy — Phase 6 (Weeks 11-13)

**Goal:** Strategy becomes an ongoing practice, not a one-time exercise.

### 11.1 Phase 6 Infrastructure

| Task | Files | Detail |
|------|-------|--------|
| Create strategy_signals table | `[MIG]` Supabase migration | Per PRD Section 12.1 |
| Create strategy_versions table | `[MIG]` Supabase migration | Per PRD Section 12.1 |
| Add Phase 6 to phase progression | `[MOD]` Phase API | Extend transitions to include 'review' |
| Phase 6 context panel | `[NEW]` `src/components/product-strategy-agent-v2/ContextPanel/StrategyReviewSection.tsx` | Assumption tracker, signal log, version history |

### 11.2 Assumption Tracker Dashboard

| Task | Files | Detail |
|------|-------|--------|
| Assumption tracker display | `[NEW]` `...ContextPanel/AssumptionTracker.tsx` | Grouped by status: Validated / Invalidated / Untested. Progress bar. Evidence display |
| Assumption status updates | `[API]` `src/app/api/product-strategy-agent-v2/assumptions/route.ts` | PATCH to update status, add evidence |
| Link assumptions to signals | Logic in signal creation | When logging a signal, prompt to link affected assumptions |

### 11.3 Signal Log

| Task | Files | Detail |
|------|-------|--------|
| Signal logging UI | `[NEW]` `...ContextPanel/SignalLog.tsx` | Form: signal type (competitor/customer/market/internal), title, description. Shows timeline of logged signals |
| Signal API | `[API]` `src/app/api/product-strategy-agent-v2/signals/route.ts` | CRUD for signals; AI impact assessment on creation |
| Signal → Assumption linking | `[MOD]` Signal creation flow | Prompt to flag which assumptions are affected |
| Signal alert coaching card | `[NEW]` `...CoachingCentre/cards/SignalAlertCard.tsx` | Inline card when signal has strategic impact |

### 11.4 Strategy Versioning

| Task | Files | Detail |
|------|-------|--------|
| Auto-snapshot on phase completion | `[MOD]` Phase transition API | Snapshot framework_state + synthesis + bets → strategy_versions |
| Version diff view | `[NEW]` `...ContextPanel/StrategyDiff.tsx` | Side-by-side comparison of any two strategy versions |
| Change narrative generation | `[MOD]` Version creation | Claude generates "What changed and why" summary |

### 11.5 Review Cadences

| Task | Files | Detail |
|------|-------|--------|
| Review scheduling | `[NEW]` `src/lib/agents/strategy-coach/review-cadence.ts` | Logic for triggering reviews: kill date reached, assumption invalidated, monthly, quarterly |
| Review prompts in Strategy Home | `[MOD]` Upcoming Review card | Show next review with context |
| Review coaching mode | `[MOD]` System prompt | Coach enters review mode: "It's been a month since your strategy was set. Let's check your assumptions..." |

### Sprint 11-13 Deliverables
- Phase 6 fully functional
- Assumption Tracker dashboard with status management
- Signal Log with AI impact assessment
- Strategy versioning with diff view
- Automated review cadences (kill date, monthly, quarterly)
- Outcome tracking feeding back into territory research

---

## Sprint 14-15: Collaboration (Weeks 14-15)

**Goal:** Strategy becomes a multi-stakeholder activity.

### Tasks
- Stakeholder input mode (invite team members to provide input on specific questions)
- Team commenting on synthesis outputs
- Shared strategy views with role-based access (CPO sees everything; PMs see team briefs only)
- Notification when shared artefacts are updated

---

## Sprint 16+: Integrations (Ongoing)

**Goal:** Strategy embedded in daily workflow tools.

### Tasks
- Slack/Teams nudge integration (strategic signals, review reminders, inactivity prompts)
- Jira/Linear integration (push OKRs, team briefs as ticket context)
- Calendar integration (auto-schedule strategy review sessions)
- Strategy context in workflow tools

---

## Database Migration Summary

| Sprint | Migration | Tables |
|--------|-----------|--------|
| Sprint 5-6 | `create_strategic_assessments` | `strategic_assessments` |
| Sprint 8-10 | `create_strategic_artefacts` | `strategic_artefacts` |
| Sprint 10-11 | `create_assumption_register` | `assumption_register` |
| Sprint 11-13 | `create_strategy_signals` | `strategy_signals` |
| Sprint 11-13 | `create_strategy_versions` | `strategy_versions` |

---

## New API Routes Summary

| Sprint | Route | Method | Purpose |
|--------|-------|--------|---------|
| 2-3 | `/api/product-strategy-agent-v2/micro-synthesis` | POST | Generate territorial insight summary |
| 2-3 | `/api/product-strategy-agent-v2/strategy-page/export` | POST | Strategy on a Page PDF |
| 5-6 | `/api/product-strategy-agent-v2/assessment` | GET/POST | Strategic Maturity Assessment |
| 6-7 | `/api/product-strategy-agent-v2/home` | GET | Strategy Home aggregated data |
| 8-10 | `/api/product-strategy-agent-v2/activation` | CRUD | Activation artefacts |
| 8-10 | `/api/product-strategy-agent-v2/activation/team-briefs` | POST/GET | Team Brief Generator |
| 8-10 | `/api/product-strategy-agent-v2/activation/team-briefs/export` | POST | Team Brief PDF |
| 10-11 | `/api/product-strategy-agent-v2/share/[token]` | GET | Public shared artefact |
| 10-11 | `/api/product-strategy-agent-v2/assumptions` | CRUD | Assumption Register |
| 11-13 | `/api/product-strategy-agent-v2/signals` | CRUD | Strategy Signals |
| 11-13 | `/api/product-strategy-agent-v2/versions` | GET/POST | Strategy Versioning |

---

## New Component Summary

| Sprint | Component | Type |
|--------|-----------|------|
| 1 | `ConfidenceRating.tsx` | UI element |
| 2-3 | `TerritorialInsightSummary.tsx` | Canvas card |
| 2-3 | `ProgressRing.tsx` | UI element |
| 2-3 | `StrategyOnAPage.tsx` | Canvas section |
| 4-5 | `CoachingCentre/CoachingCentre.tsx` | Layout (major) |
| 4-5 | `CoachingCentre/InlineActionCard.tsx` | Card system |
| 4-5 | `CoachingCentre/cards/*.tsx` | 4+ card types |
| 4-5 | `ContextPanel/ContextPanel.tsx` | Layout (major) |
| 5-6 | `Assessment/LikertQuestion.tsx` | Form component |
| 5-6 | `Assessment/SituationalChoice.tsx` | Form component |
| 5-6 | `Assessment/AssessmentResults.tsx` | Results page |
| 6-7 | `StrategyHome/*.tsx` | 6 card types + entry bar |
| 8-10 | `ContextPanel/ActivationSection.tsx` | Phase section |
| 8-10 | `ContextPanel/TeamBriefCard.tsx` | Artefact card |
| 8-10 | `ContextPanel/GuardrailsCard.tsx` | Artefact card |
| 8-10 | `ContextPanel/OKRCascadeCard.tsx` | Artefact card |
| 8-10 | `ContextPanel/DecisionFrameworkCard.tsx` | Artefact card |
| 8-10 | `ContextPanel/StakeholderPackViewer.tsx` | Multi-view |
| 10-11 | `ArtefactEvolutionCard.tsx` | Inline card |
| 11-13 | `ContextPanel/AssumptionTracker.tsx` | Dashboard |
| 11-13 | `ContextPanel/SignalLog.tsx` | Form + timeline |
| 11-13 | `ContextPanel/StrategyDiff.tsx` | Diff viewer |

---

## Risk Checkpoints

| After Sprint | Checkpoint | Gate |
|-------------|-----------|------|
| Sprint 1 | User test: Does reducing to 27 questions lose signal? | Validate question quality before proceeding |
| Sprint 3 | User test: Are micro-synthesis insights meaningful? | Quality gate on AI output before building layout |
| Sprint 5 | User test: Does 60/40 layout feel better than 25/75? | A/B test with existing users; offer "Classic View" toggle |
| Sprint 6 | User test: Does assessment feel valuable, not burdensome? | Completion rate > 90%; time < 12 min |
| Sprint 10 | User test: Are team briefs actionable for PMs? | PM feedback on brief quality and usefulness |
| Sprint 13 | User test: Do users return for Phase 6 reviews? | 30-day return engagement metrics |

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | February 2026 | Initial build plan based on PRD v3.0 |
