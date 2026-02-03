# Frontera Platform: Claude Code Learning Plan v4

**Version:** 4.0
**Date:** February 1, 2026
**Status:** Week 1 Complete. Weeks 2-8 redefined based on actual progress.

---

## Overview

**Mission:** Build an enterprise-grade, demo-ready Frontera coaching platform
**Timeline:** 8 weeks to pilot-ready platform (extended from original 4-week target)
**Effort:** 5-10 hours/week, with flex capacity during weeks 3-4
**Output:** Multi-tenant platform with working Product Strategy Agent, Personal Profiling, Leadership Playbook, and enterprise security foundations

### What Changed Since v3

The v3 plan mapped out 4 weeks of work. In practice, **Week 1 delivered substantially more than planned** — the entire Product Strategy Agent (Discovery, Research, Synthesis), Personal Profiling, Leadership Playbook, Case Studies, Expert Perspectives, Tension Simulator, 6 Coach Personas, PDF export, comprehensive test framework (471 tests), and brand design system were all completed. This v4 plan acknowledges that achievement and redefines Weeks 2-8 around what remains: Strategic Bets phase, expert knowledge ingestion, UX polish, accessibility, enterprise security, and pilot preparation.

---

## Technology Stack (Actual)

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Framework** | Next.js 15 (App Router) | Server + Client components |
| **Language** | TypeScript (strict mode) | Throughout |
| **Styling** | Tailwind CSS v4 | Navy + Gold + Cyan brand system |
| **Authentication** | Clerk v6.36 | Organizations, 2FA, SSO |
| **Database** | Supabase (PostgreSQL) | RLS, JSONB state, service role |
| **AI** | Claude Sonnet 4 (`claude-sonnet-4-20250514`) | Streaming, context-aware |
| **Analytics** | PostHog | Events, funnels, session recording |
| **PDF** | @react-pdf/renderer | Subprocess isolation pattern |
| **Deployment** | Vercel | Auto-deploy from master |
| **Testing** | Vitest + Playwright + Cucumber | 471 tests across 8 phases |
| **CI/CD** | GitHub Actions | 3 workflows (ci, e2e, bdd) |

**Not in use** (changed from v3 plan): Zustand, shadcn/ui, Framer Motion, ReactFlow, Recharts, Mermaid.js. These were planned but not needed — Tailwind CSS and custom components proved sufficient.

---

## WEEK 1: STATUS — COMPLETE

### What Was Planned (from v3)
- Environment setup, landing page, Clerk auth, Supabase schema
- Client onboarding wizard
- Basic chat UI with streaming

### What Was Actually Built

**Foundation (100% complete):**
- Landing page deployed at frontera-platform.vercel.app
- Clerk auth with organizations, 2FA, SSO, team invitations
- Supabase schema: 10+ tables with RLS policies
- Client onboarding wizard (4-step)
- PostHog analytics integration with user identification
- Admin panel (application review, user profiles)
- Team management page

**Product Strategy Agent (100% of MVP complete):**
- Two-panel layout: Coaching Panel (35%) + Canvas Panel (65%)
- Full-width header bar spanning both panels
- Horizontal progress stepper (4 phases)
- **Discovery Phase:** Document upload (PDF/DOCX/CSV), AI Research Assistant, editable company context, progress checklist, phase transition CTA
- **Research Phase:** 3Cs Territory Framework (Company 6 areas, Customer 6 areas, Competitor 6 areas = 18 total), deep-dive views with guided questions, territory sidebar navigation, save/mark as mapped
- **Synthesis Phase:** Playing to Win framework, AI-powered synthesis generation, Strategic Opportunity Map (2x2 matrix), opportunity cards with evidence trails, strategic tensions, debate mode, recommendations panel, PDF export (8-page report)
- **Strategic Bets Phase:** Placeholder only (not implemented)

**Use Cases (UC1-UC5):**
- UC1: Expert Perspectives — expert knowledge integration, citations
- UC3: Case Study Engine — case library with filtering, phase relevance
- UC4: Tension Simulator — debate mode, decision tracking, debate history
- UC5: Leadership Playbook — development themes from 301 transcripts, locked until Research phase

**Personal Profiling:**
- Dedicated profiling agent (agent_type='profiling')
- Interactive coaching intake (5 dimensions)
- Profile summary with AI reflections
- Admin view of all user profiles
- Persona recommendation based on profile

**Coaching System:**
- 6 coach personas (Marcus Chen, Elena Rodriguez, Richard Brooks + 3 style variants)
- Context-aware coaching across all 4 phases
- Streaming responses via ReadableStream
- Suggested follow-ups, proactive coaching messages

**Design System:**
- Navy (#1a1f3a) + Gold (#fbbf24) + Cyan brand palette
- Phase colors: Emerald (Discovery), Amber (Research), Purple (Synthesis), Cyan (Bets)
- Consistent typography, spacing, border radius patterns
- Responsive layouts (mobile, tablet, desktop)

**Testing (471 total):**
- Unit: 158 tests (strategy-coach agent logic)
- Component: 86 tests (React components)
- Integration: 41 tests (API routes)
- E2E: 96 tests (Playwright, multi-browser)
- BDD: 30 scenarios (Cucumber/Gherkin)
- AI Evals: 90 tests (relevance, hallucination, tone, completeness)
- CI/CD: 3 GitHub Actions workflows

**API Routes: 30 endpoints** covering conversations, territories, synthesis, upload, personas, profiling, expert knowledge, case studies, debates, leadership playbook, admin, organizations, auth, webhooks.

### What Remains from Week 1 Scope
- ⚠️ Strategic Bets Phase 4 — placeholder only, needs full implementation
- ⚠️ Expert knowledge data ingestion — 301 Lenny's Podcast transcripts in Background/ folder, schema exists but data not processed
- ⚠️ UC2: Strategy Sparring Partners — PRD exists, not started

---

## WEEK 2: STRATEGIC BETS PHASE & EXPERT KNOWLEDGE (15 hours)

### Day 1-2: Strategic Bets Phase Implementation (6 hours)

#### Learning Module: Strategic Portfolio Management (1 hour)

**Learning Objectives:**
- Understand the distinction between **product strategy** (leadership-level: where to compete, how to win) and **product discovery** (team-level: which solution to build)
- Master six strategic frameworks informing this phase: Martin (PTW cascades + integrated choices), Janakiraman (Strategy Blocks 4-dimension scoring), Cagan (measurable leading indicators), Perri (strategic hierarchy), Biddle (DHM filter), Christensen/Moesta (demand-side JTBD), Duke (kill criteria)
- Learn the 5-part hypothesis format: Job → Belief → Bet → Success → Kill Criteria
- Understand strategic risk categories (market, positioning, execution, economic) vs. solution risks
- Understand Strategic Thesis grouping — bets as integrated sets of choices, not independent items

**Resources:**
- Roger Martin "Playing to Win" — Strategic Choice Cascades, integrated choices
- Chandra Janakiraman "Strategy Blocks" — 4-dimension scoring (impact, certainty, clarity, uniqueness of levers)
- Marty Cagan "Inspired/Empowered" — Measurable leading indicators (NOT solution-level 4-risk model)
- Melissa Perri "Escaping the Build Trap" — Strategic Intent → Product Initiatives → Options hierarchy
- Gibson Biddle — DHM Model (Delight, Hard to copy, Margin-enhancing)
- Clayton Christensen / Bob Moesta — Jobs to Be Done, demand-side anchoring
- Annie Duke "Thinking in Bets" / "Quit" — Kill criteria, pre-committed abandonment conditions
- Frontera Critical Assessment: `Background/Strategic_Bets_Critical_Assessment.docx`
- Frontera Implementation Plan v2: `Background/Strategic_Bets_Implementation_Plan_v2.docx`
- Plan file: `.claude/plans/dazzling-churning-kernighan.md`

**Note:** Teresa Torres "Continuous Discovery Habits" is explicitly **not applied** at this level — it operates at the product team level (Opportunity Solution Trees for solution discovery), not the strategic portfolio level.

**Time-Based Study Path:**
- 0-20 min: Review Playing to Win cascades + Martin's "integrated set of choices" insight
- 20-40 min: Study Janakiraman 4-dimension scoring and Perri strategic hierarchy
- 40-60 min: Review Frontera Critical Assessment and revised implementation plan

#### Applied Task: Build Strategic Bets Phase 4 (5 hours)

**Task Objectives:**
- Build full Strategic Bets UI replacing the placeholder in CanvasPanel (5 stages)
- Implement Strategic Thesis grouping (coherent strategic choices, not flat bet lists)
- Implement 5-part hypothesis format with demand-side JTBD anchoring
- Implement 4-dimension Janakiraman scoring (replacing simple impact/effort)
- Implement strategic risk assessment (market, positioning, execution, economic)
- Implement kill criteria and kill dates (Annie Duke)
- Add DHM filter evaluation (Biddle)
- Connect bets to synthesis opportunities with evidence trails
- Implement 14 coaching behaviors across 3 tiers (individual, altitude, portfolio)

**Key Files to Create:**
- `src/types/bets.ts` — StrategicThesis, StrategicBet, StrategicRisks, StrategicScoring interfaces
- `supabase/migrations/20260202000000_create_strategic_bets.sql` — Both tables
- `src/app/api/product-strategy-agent/bets/route.ts` — Bets CRUD API
- `src/app/api/product-strategy-agent/bets/theses/route.ts` — Thesis creation API
- `src/app/api/product-strategy-agent/bets/generate/route.ts` — AI generation
- `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx` — Main container
- `src/components/product-strategy-agent/CanvasPanel/ThesisGroup.tsx` — Thesis grouping
- `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx` — Bet display card
- `src/components/product-strategy-agent/CanvasPanel/CreateBetModal.tsx` — Bet creation form

**Key Files to Modify:**
- `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` — Replace placeholder (lines 134-144)
- `src/types/database.ts` — Add StrategicThesisRow and StrategicBetRow types
- `src/lib/agents/strategy-coach/system-prompt.ts` — Add Phase 4 strategic coaching (14 behaviors)
- `src/app/api/product-strategy-agent/phase/route.ts` — Bets completion logic

**Data Model — Strategic Thesis (new entity):**
```typescript
interface StrategicThesis {
  id: string;
  conversationId: string;
  title: string;                    // e.g., "Enterprise Healthcare Expansion"
  description: string;              // Strategic narrative connecting the bets
  opportunityId: string;            // Primary synthesis opportunity
  ptwWinningAspiration: string;
  ptwWhereToPlay: string;
  ptwHowToWin: string;
  // DHM filter (Biddle)
  dhmDelight: string;
  dhmHardToCopy: string;
  dhmMarginEnhancing: string;
  thesisType: 'offensive' | 'defensive' | 'capability';
  timeHorizon: '90d' | '6m' | '12m' | '18m';
}
```

**Data Model — Strategic Bet:**
```typescript
interface StrategicBet {
  id: string;
  conversationId: string;
  strategicThesisId: string;        // Groups bets under coherent strategic choice
  // 5-part hypothesis (Christensen demand-side + Duke kill criteria)
  jobToBeDone: string;              // "[Segment] struggling with [context], needs [outcome]"
  belief: string;                   // "We believe [insight] creates an opportunity"
  bet: string;                      // "So we will invest in [initiative] targeting [WTP]"
  successMetric: string;            // "Success looks like [leading indicator + number + timeframe]"
  killCriteria: string;             // "We abandon this bet if [signal] by [date]"
  killDate: string;                 // ISO date — when to evaluate
  // Scoring — Janakiraman 4-dimension (replaces impact/effort)
  scoring: {
    expectedImpact: number;         // 1-10: Scale, frequency, intensity
    certaintyOfImpact: number;      // 1-10: Evidence strength
    clarityOfLevers: number;        // 1-10: Do we know how to execute?
    uniquenessOfLevers: number;     // 1-10: Competitive defensibility
    overallScore: number;           // Calculated: weighted sum (0-100)
  };
  // Strategic risks (NOT solution risks)
  risks: {
    market: string;                 // Does the market exist?
    positioning: string;            // Can we differentiate?
    execution: string;              // Can we build capabilities?
    economic: string;               // Do the economics work?
  };
  // Connections
  opportunityId: string;
  evidenceLinks: EvidenceLink[];
  assumptionBeingTested: string;    // Which WWHBT assumption
  ptwWhereToPlay: string;
  ptwHowToWin: string;
  dependsOn?: string[];             // Prerequisite bet IDs
  // Status
  status: 'draft' | 'proposed' | 'accepted' | 'prioritized';
  confidence: 'low' | 'medium' | 'high';
  timeHorizon: '90d' | '6m' | '12m' | '18m';
  agentGenerated: boolean;
  agentReasoning?: string;
}
```

**Claude Code Prompt:**
```
Build the Strategic Bets phase (Phase 4) for the Product Strategy Agent.
Follow the full implementation plan at .claude/plans/dazzling-churning-kernighan.md

This phase operates at the PRODUCT STRATEGY level — helping leaders make
resource allocation decisions. NOT the product discovery level (team experiments).

Build in 5 stages:

STAGE 1 - Data Foundation:
- Database migration (strategic_theses + strategic_bets tables)
- TypeScript types in src/types/bets.ts
- CRUD API routes for bets and theses

STAGE 2 - AI Bet Generation:
- POST /api/product-strategy-agent/bets/generate
- Generates 3-5 bets grouped under 1-3 strategic theses from synthesis
- 5-part hypothesis format: Job → Belief → Bet → Success → Kill Criteria
- 4-dimension Janakiraman scoring, strategic risks, DHM evaluation
- Each bet includes agentReasoning explaining which assumption is tested

STAGE 3 - UI Components:
- BetsSection.tsx (main container with strategy hierarchy banner)
- ThesisGroup.tsx (collapsible thesis container with DHM badges)
- BetCard.tsx (expandable card with 5-part hypothesis, scoring radar,
  strategic risks, kill date indicator, evidence trail)
- Replace CanvasPanel placeholder (lines 134-144)

STAGE 4 - CreateBetModal + Edit/Delete:
- Thesis selector, 5 hypothesis fields, 4-dimension scoring sliders,
  strategic risk textareas, kill criteria + date, dependency selector

STAGE 5 - Coach Integration + Export:
- 14 coaching behaviors in system-prompt.ts across 3 tiers:
  * Individual: challenge evidence, demand metrics, demand kill criteria,
    anchor to demand side, validate PTW alignment
  * Altitude: raise altitude when user drops to feature level,
    challenge strategic risks, validate scoring rigor
  * Portfolio: balance, coherence, sequencing, optionality, DHM challenge
- Quality gate: ≥3 bets, ≥1 thesis, all with kill criteria

Use Frontera brand design system from CLAUDE.md.
Phase color: Cyan (cyan-600, cyan-50, border-cyan-200).
Reference SynthesisSection.tsx and OpportunityCard.tsx for design patterns.
```

**Time Allocation:**
- 0-60 min: Stage 1 — Database migration, types, CRUD API routes
- 60-150 min: Stage 2 — AI bet generation endpoint
- 150-240 min: Stage 3 — BetsSection, ThesisGroup, BetCard UI
- 240-270 min: Stage 4 — CreateBetModal with edit/delete
- 270-300 min: Stage 5 — Coach integration, quality gate, export

**Success Criteria:**
- [ ] Strategic Bets phase replaces placeholder
- [ ] Bets grouped under Strategic Theses (not flat list)
- [ ] 5-part hypothesis format enforced (Job → Belief → Bet → Success → Kill Criteria)
- [ ] 4-dimension Janakiraman scoring (not simple impact/effort)
- [ ] Strategic risks assessed (market, positioning, execution, economic)
- [ ] Kill criteria and kill date on every bet
- [ ] DHM filter evaluation on theses
- [ ] Evidence trail from research visible
- [ ] AI generates bets grouped by thesis with agent reasoning
- [ ] Coach operates at strategic altitude (14 coaching behaviors)
- [ ] Portfolio-level coaching (balance, coherence, sequencing)
- [ ] Quality gate: ≥3 bets, ≥1 thesis, all with kill criteria before export
- [ ] `npm run build` passes

### Day 3-4: Expert Knowledge Ingestion (5 hours)

#### Learning Module: Document Processing & Embeddings (1 hour)

**Learning Objectives:**
- Understand document chunking strategies for LLMs
- Learn text extraction from various formats
- Master metadata tagging for retrieval
- Understand semantic search patterns

**Resources:**
- Anthropic "Building with Claude" — Context window optimization
- LangChain chunking strategies documentation
- Supabase vector search documentation (pgvector)

**Time-Based Study Path:**
- 0-20 min: Document chunking strategies (size, overlap, semantic boundaries)
- 20-40 min: Metadata extraction and tagging patterns
- 40-60 min: Review existing expert_knowledge_chunks schema

#### Applied Task: Process 301 Podcast Transcripts (4 hours)

**Task Objectives:**
- Build transcript processing pipeline for 301 Lenny's Podcast transcripts
- Chunk transcripts into expert_knowledge_chunks with metadata
- Tag chunks with topics, themes, territories, phases
- Connect to existing Expert Perspectives (UC1) and Case Studies (UC3)
- Enable coaching to reference expert knowledge contextually

**Key Files:**
- `Background/Lenny's Podcast Transcripts Archive/` — 301 transcript files
- Create `scripts/ingest-transcripts.ts` — Processing pipeline
- `src/app/api/product-strategy-agent/expert-knowledge/route.ts` — Existing API
- Database: `expert_knowledge_chunks` table (schema exists)

**Claude Code Prompt:**
```
Build a transcript ingestion pipeline for Frontera's expert knowledge base.

There are 301 podcast transcript files in Background/Lenny's Podcast Transcripts Archive/.

For each transcript:
1. Extract text content
2. Parse metadata: guest name, episode title, date, topics
3. Chunk into 500-800 word segments with 100-word overlap
4. Tag each chunk with:
   - Topics (product strategy, growth, leadership, culture, etc.)
   - Relevant territories (company, customer, competitor)
   - Relevant phases (discovery, research, synthesis, bets)
   - Expert name and credentials
5. Store in Supabase expert_knowledge_chunks table
6. Create cross-references for the case_studies table

The pipeline should be idempotent (safe to re-run).
Use the existing expert_knowledge_chunks schema.
Create a CLI script that can be run with: npx tsx scripts/ingest-transcripts.ts
```

**Time Allocation:**
- 0-45 min: Assess transcript format, design chunking strategy
- 45-120 min: Build processing pipeline
- 120-180 min: Run ingestion, verify data quality
- 180-240 min: Connect to coaching and synthesis (enhance expert-knowledge API)

**Success Criteria:**
- [ ] All 301 transcripts processed
- [ ] Chunks tagged with topics, territories, phases
- [ ] Expert knowledge queryable by topic and phase
- [ ] Coaching references expert insights contextually
- [ ] Case studies extracted from relevant episodes

### Day 5: Integration & Testing (4 hours)

#### Applied Task: Connect Strategic Bets + Expert Knowledge (4 hours)

**Task Objectives:**
- Strategic Bets reference expert perspectives as evidence
- Expert knowledge surfaces during bet formulation
- Coaching suggests relevant expert insights when creating bets
- Write tests for new Strategic Bets components and API

**Claude Code Prompt:**
```
Connect the Strategic Bets phase to expert knowledge:

1. When creating a bet, show relevant expert insights that support
   the hypothesis (query expert_knowledge_chunks by topic relevance)
2. Allow citing expert knowledge as evidence for confidence scoring
3. Update the coaching system prompt to reference expert insights
   when the user is in Phase 4 (Strategic Bets)
4. Write unit tests for the new StrategicBetsSection component
5. Write integration tests for the /api/product-strategy-agent/bets route

Use the test patterns from tests/unit/ and tests/integration/.
```

**Time Allocation:**
- 0-60 min: Expert knowledge integration with bets
- 60-120 min: Coaching prompt updates for Phase 4
- 120-180 min: Write tests (unit + integration)
- 180-240 min: Run full test suite, fix issues

**Success Criteria:**
- [ ] Expert knowledge surfaces during bet creation
- [ ] Evidence linking works across all 4 phases
- [ ] Full methodology journey works end-to-end: Discovery → Research → Synthesis → Bets
- [ ] All existing tests still pass
- [ ] New tests for bets written and passing

---

## WEEK 3: UX POLISH & ACCESSIBILITY (15 hours)

### Day 1-2: AI Streaming Experience (4 hours)

#### Learning Module: AI Conversational UX (1 hour)

**Learning Objectives:**
- Understand AI response feedback patterns (thinking → streaming → complete)
- Master accessible loading states
- Learn from frontier AI UX (ChatGPT, Claude.ai, Perplexity)
- Understand WCAG requirements for dynamic content

**Resources:**
- `DESIGN_REVIEW_COACHING_UX.md` — Streaming mockups and specs
- `MOCKUPS_PRIORITY_1_STREAMING_AND_TERRITORY_NAV.md` — Component architecture
- `frontera-coaching-interface-research.md` — Industry best practices
- WCAG 2.1 "Status Messages" (SC 4.1.3) — Dynamic content accessibility

**Time-Based Study Path:**
- 0-20 min: Review streaming mockups from design review
- 20-40 min: Study ChatGPT/Claude.ai streaming patterns
- 40-60 min: Review WCAG dynamic content requirements

#### Applied Task: Streaming Response Improvements (3 hours)

**Task Objectives:**
- Implement enhanced ThinkingIndicator component (staggered pulse dots)
- Create StreamingMessage component with typing cursor
- Add stop/regenerate actions during streaming
- Implement contextual thinking messages ("Analyzing competitive landscape...")
- Add smooth transitions between states

**Key Files to Modify:**
- `src/components/product-strategy-agent/CoachingPanel/ThinkingIndicator.tsx` — Enhance
- Create or enhance `StreamingMessage.tsx` — Real-time text reveal
- `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx` — Stream handling
- `src/app/globals.css` — Animations

**Claude Code Prompt:**
```
Improve the AI streaming experience in the Coaching Panel.

From the design review mockups (MOCKUPS_PRIORITY_1), implement:

1. ThinkingIndicator with 3 animated dots (staggered pulse, 1.4s cycle)
   - Shows contextual message: "Analyzing your strategic landscape..."
   - Phase-specific messages (Discovery: "Reviewing your materials...",
     Research: "Connecting territory insights...", etc.)

2. StreamingMessage with typing cursor
   - Character-by-character text reveal (not chunk-by-chunk)
   - Blinking cursor at end of streaming text
   - Inline "Stop" button during streaming
   - "Regenerate" option after completion

3. State transitions:
   - User sends → ThinkingIndicator (1-3s)
   - First token → StreamingMessage with cursor
   - Complete → Full message with action buttons
   - Error → Error message with retry

4. Accessibility:
   - aria-live="polite" for streaming content
   - Screen reader announcement on completion
   - Keyboard shortcut: Escape to stop streaming

Use Frontera brand animations (duration-300, emerald/amber/purple phase colors).
Reference existing CoachingPanel.tsx for stream handling patterns.
```

**Time Allocation:**
- 0-45 min: ThinkingIndicator enhancement
- 45-105 min: StreamingMessage with typing cursor
- 105-150 min: Stop/regenerate handlers
- 150-180 min: Accessibility and testing

**Success Criteria:**
- [ ] Thinking dots animate with staggered pulse
- [ ] Text streams character-by-character with cursor
- [ ] Stop button halts streaming
- [ ] Phase-specific thinking messages display
- [ ] Screen readers announce streaming status

### Day 3-4: WCAG Accessibility Compliance (6 hours)

#### Learning Module: Enterprise Accessibility (1 hour)

**Learning Objectives:**
- Understand WCAG Level A and AA requirements
- Learn keyboard navigation patterns for SPAs
- Master focus management in dynamic UIs
- Understand ARIA roles, states, and properties

**Resources:**
- WCAG 2.1 Quick Reference — https://www.w3.org/WAI/WCAG21/quickref/
- MDN Accessibility Guide — Keyboard navigation patterns
- React accessibility documentation
- `PRODUCT_STRATEGY_COACH_DESIGN_REVIEW.md` — Accessibility gap analysis (currently 40% WCAG)

**Time-Based Study Path:**
- 0-20 min: WCAG Level A checklist review
- 20-40 min: Keyboard navigation patterns (tab order, focus traps, skip links)
- 40-60 min: ARIA roles for coaching interface (dialog, navigation, tab panels)

#### Applied Task: WCAG Level A Compliance (5 hours)

**Task Objectives:**
- Add keyboard navigation throughout the Product Strategy Agent
- Implement focus management for panel transitions
- Add ARIA labels to all interactive elements
- Fix contrast issues (placeholder text)
- Add skip navigation link
- Implement visible focus indicators (gold ring)

**Key Files to Modify:**
- `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx` — Focus management
- `src/components/product-strategy-agent/CanvasPanel/*.tsx` — ARIA labels
- `src/components/product-strategy-agent/CoachingPanel/*.tsx` — Keyboard nav
- `src/components/product-strategy-agent/CanvasPanel/HorizontalProgressStepper.tsx` — Tab navigation
- `src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveSidebar.tsx` — Keyboard nav

**Claude Code Prompt:**
```
Implement WCAG Level A accessibility compliance across the Product Strategy Agent.

Current compliance is 40%. Target 85%+. Focus on:

1. KEYBOARD NAVIGATION:
   - Tab through all interactive elements in logical order
   - Enter/Space activates buttons and links
   - Arrow keys navigate within territory cards, phase stepper
   - Escape closes modals/popups, stops streaming
   - Focus trap in modal dialogs (territory deep-dive)
   - Skip navigation link at top of page

2. FOCUS MANAGEMENT:
   - Visible focus ring (gold #fbbf24, 2px ring, offset-2)
   - Focus moves to new content on phase transitions
   - Focus returns to trigger on modal close
   - No focus loss on dynamic content updates

3. ARIA LABELS:
   - role="navigation" on phase stepper
   - role="tablist" on territory tabs
   - aria-label on icon-only buttons (export, share, collapse)
   - aria-current="step" on active phase
   - aria-expanded on collapsible panels
   - aria-live="polite" on dynamic status messages

4. CONTRAST:
   - Fix placeholder text (currently fails AA contrast)
   - Ensure all text meets 4.5:1 ratio (body) or 3:1 (large text)

5. SEMANTIC HTML:
   - <header>, <main>, <aside>, <nav> for page landmarks
   - <h1>-<h6> hierarchy within each panel
   - <button> not <div onClick> for all interactive elements

Reference CLAUDE.md design principles for focus states and colors.
Run lighthouse accessibility audit before and after changes.
```

**Time Allocation:**
- 0-60 min: Keyboard navigation for stepper and territory cards
- 60-120 min: Focus management (modals, panel transitions)
- 120-180 min: ARIA labels across all components
- 180-240 min: Contrast fixes, semantic HTML
- 240-300 min: Lighthouse audit, fix remaining issues

**Success Criteria:**
- [ ] Lighthouse accessibility score > 85
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators on all focusable elements
- [ ] ARIA labels on all icon-only buttons
- [ ] Focus managed correctly on panel/phase transitions
- [ ] No contrast failures in Lighthouse

### Day 5: Component Library & Typography (5 hours)

#### Applied Task: Extract Shared Component Library (3 hours)

**Task Objectives:**
- Extract reusable UI components into `src/components/ui/`
- Create consistent Button, Card, Badge, Input, Modal components
- Document component API with TypeScript props
- Replace ad-hoc styling across codebase

**Key Files to Create:**
- `src/components/ui/Button.tsx` — Primary, Secondary, Tertiary, Ghost variants
- `src/components/ui/Card.tsx` — Default, Premium (navy), Phase-colored
- `src/components/ui/Badge.tsx` — Status, Phase, Count variants
- `src/components/ui/Input.tsx` — Text, Textarea, Search
- `src/components/ui/Modal.tsx` — Dialog with focus trap

**Claude Code Prompt:**
```
Extract a shared component library for Frontera.

Create src/components/ui/ with these components, based on
patterns already used across the codebase (see CLAUDE.md
Design Principles for exact specs):

1. Button - variants: primary (gold), secondary (navy),
   tertiary (cyan border), ghost. Sizes: sm, md, lg.
   States: default, hover, focus, disabled, loading.

2. Card - variants: default (white + cyan border),
   premium (navy bg), phase (phase-colored border).

3. Badge - variants: status (dot + text), phase (colored),
   count (number). Sizes: sm, md.

4. Input - variants: text, textarea, search.
   States: default, focus (gold ring), error (red), disabled.

5. Modal - overlay, focus trap, ESC to close, close button.
   Sizes: sm, md, lg, full.

Each component should:
- Use TypeScript with proper prop types
- Include all states from CLAUDE.md design checklist
- Support className override for customization
- Include aria attributes for accessibility

Export all from src/components/ui/index.ts.
Do NOT refactor existing components to use these yet -
just create the library for new development.
```

**Time Allocation:**
- 0-60 min: Button and Card components
- 60-120 min: Badge, Input components
- 120-180 min: Modal with focus trap

#### Applied Task: Custom Typography System (2 hours)

**Task Objectives:**
- Add Newsreader font for strategic display text
- Add IBM Plex Sans for UI text
- Configure font loading in Next.js
- Apply to key strategic output areas (synthesis, insights, bets)

**Claude Code Prompt:**
```
Add custom fonts to Frontera following the Design Review recommendations:

1. Newsreader (serif) — For strategic display text:
   - Synthesis opportunity titles
   - Strategic bet hypotheses
   - Insight deck headings
   Load via next/font/google

2. IBM Plex Sans (sans-serif) — For professional UI text:
   - Form labels
   - Navigation
   - Data displays
   Load via next/font/google

3. IBM Plex Mono — For data, metrics, evidence citations
   Load via next/font/google

Apply Newsreader ONLY to strategic content areas, not the entire UI.
Keep the current Inter/system font stack for general UI.

Update src/app/layout.tsx with font loading.
Create CSS variables for font families.
```

**Time Allocation:**
- 0-60 min: Font configuration and loading
- 60-120 min: Apply to strategic content areas

**Success Criteria:**
- [ ] Component library created with 5 base components
- [ ] All components have TypeScript props and accessibility
- [ ] Custom fonts loading correctly
- [ ] Strategic content uses Newsreader serif
- [ ] No layout shift from font loading

---

## WEEK 4: ENTERPRISE READINESS & DEMO PREP (20 hours)

### Day 1-2: Security Hardening (5 hours)

#### Learning Module: Application Security (1 hour)

**Learning Objectives:**
- Understand Content Security Policy (CSP) headers
- Learn API rate limiting patterns
- Master input validation with Zod
- Understand OWASP Top 10 for Next.js applications

**Resources:**
- `ENTERPRISE_SECURITY_ARCHITECTURE.md` — Full security roadmap
- OWASP Next.js Security Guide
- Zod documentation — Schema validation
- Vercel Security Headers documentation

**Time-Based Study Path:**
- 0-20 min: Review Enterprise Security Architecture Q1 priorities
- 20-40 min: CSP header configuration for Next.js
- 40-60 min: Zod validation patterns for API routes

#### Applied Task: Q1 Security Implementation (4 hours)

**Task Objectives:**
- Add Content Security Policy headers via Next.js config
- Implement rate limiting on API routes (per-user, per-org)
- Add Zod schema validation to all API request bodies
- Configure Sentry for error tracking
- Add basic prompt injection protection

**Key Files to Modify:**
- `next.config.ts` — Security headers
- Create `src/lib/rate-limit.ts` — Rate limiting utility
- Create `src/lib/validation/` — Zod schemas for each API route
- All API routes under `src/app/api/` — Add validation
- `src/lib/agents/strategy-coach/system-prompt.ts` — Prompt injection guards

**Claude Code Prompt:**
```
Implement Q1 security hardening for Frontera (from ENTERPRISE_SECURITY_ARCHITECTURE.md):

1. CSP HEADERS (next.config.ts):
   - default-src 'self'
   - script-src for Clerk, PostHog, Vercel
   - connect-src for Supabase, Anthropic, Clerk, PostHog
   - img-src for Clerk avatars, Supabase storage
   - style-src 'self' 'unsafe-inline' (Tailwind)

2. RATE LIMITING (src/lib/rate-limit.ts):
   - In-memory store (upgrade to Redis for production later)
   - 60 requests/minute per user for general API
   - 10 requests/minute for AI endpoints (conversations/messages)
   - 5 requests/minute for synthesis generation
   - Return 429 with Retry-After header

3. ZOD VALIDATION:
   - Create schemas for all POST/PATCH request bodies
   - Validate at the start of each API route handler
   - Return 400 with specific validation error messages
   - Create src/lib/validation/schemas.ts with shared schemas

4. PROMPT INJECTION PROTECTION:
   - Add instruction boundary markers in system prompts
   - Validate user messages don't contain system prompt overrides
   - Log suspicious patterns to PostHog

Apply rate limiting to the 3 most critical routes first:
- /api/conversations/[id]/messages (AI streaming)
- /api/product-strategy-agent/synthesis (synthesis generation)
- /api/product-strategy-agent/ai-research (AI research assistant)
```

**Time Allocation:**
- 0-60 min: CSP headers configuration
- 60-120 min: Rate limiting implementation
- 120-180 min: Zod validation schemas
- 180-240 min: Prompt injection protection, testing

**Success Criteria:**
- [ ] CSP headers active on all pages
- [ ] Rate limiting returns 429 on excessive requests
- [ ] All API routes validate input with Zod
- [ ] No regressions in existing functionality
- [ ] Security headers visible in browser DevTools

### Day 3-4: Strategy Sparring Partners (UC2) (6 hours)

#### Learning Module: Multi-Perspective AI Simulation (1 hour)

**Learning Objectives:**
- Understand multi-agent conversation patterns
- Learn stakeholder simulation techniques
- Master perspective-taking in AI systems
- Study debate/dialectic approaches to strategy

**Resources:**
- `Background/PRD-UC2-Strategy-Sparring-Partners.md` — Full specification
- Anthropic "Constitutional AI" — Multi-perspective reasoning
- "The Opposable Mind" by Roger Martin — Integrative thinking

**Time-Based Study Path:**
- 0-20 min: Review UC2 PRD specification
- 20-40 min: Study multi-agent conversation patterns
- 40-60 min: Design sparring partner personas

#### Applied Task: Build Strategy Sparring Partners (5 hours)

**Task Objectives:**
- Create sparring partner simulation using Claude
- Define 3-5 stakeholder perspectives (CEO, CFO, CTO, Customer, Competitor)
- Implement debate-style conversation where AI challenges user's strategic choices
- Connect to synthesis opportunities and strategic bets
- Surface counterarguments grounded in research evidence

**Claude Code Prompt:**
```
Implement Strategy Sparring Partners (UC2) for Frontera.

This feature allows users to stress-test their strategic bets
by debating with AI-simulated stakeholders.

1. CREATE SPARRING PARTNER PERSONAS:
   - CEO perspective: Growth, market share, shareholder value
   - CFO perspective: ROI, cost efficiency, risk management
   - CTO perspective: Technical feasibility, scalability, tech debt
   - Customer perspective: Value proposition, pain points, alternatives
   - Competitor perspective: Competitive response, differentiation

2. SPARRING SESSION FLOW:
   - User selects a strategic bet to challenge
   - Chooses 1-3 sparring partners
   - AI takes each perspective and challenges the bet
   - User defends/refines their hypothesis
   - Session produces: refined bet, identified risks, counterarguments

3. IMPLEMENTATION:
   - New tab in CanvasPanel alongside Phase and Case Library tabs
   - Sparring session as a special conversation type
   - System prompt includes the stakeholder perspective + research context
   - Evidence-linked challenges (references territory insights)

4. DATABASE:
   - Store sparring sessions linked to strategic bets
   - Track challenges raised and user responses
   - Surface unresolved challenges as risks

Reference existing debate mode in SynthesisSection.tsx for patterns.
Use the DebateCard.tsx and DebateHistory.tsx components as inspiration.
```

**Time Allocation:**
- 0-60 min: Persona definitions, system prompts
- 60-150 min: Sparring session UI components
- 150-240 min: AI integration, evidence linking
- 240-300 min: Database storage, session history

**Success Criteria:**
- [ ] 5 sparring partner perspectives defined
- [ ] Users can challenge any strategic bet
- [ ] AI provides evidence-backed counterarguments
- [ ] Sessions produce refined bets with identified risks
- [ ] Sparring history visible in UI

### Day 5-6: Demo Preparation (5 hours)

#### Applied Task: Demo Client Configurations (3 hours)

**Task Objectives:**
- Configure Aberdeen Wealth Management demo client
- Configure Sterling Insurance Group demo client
- Configure Northern Retail Bank demo client
- Pre-populate research data for each
- Generate sample synthesis outputs
- Create demo mode toggle

**Claude Code Prompt:**
```
Create 3 demo-ready Financial Services clients for Frontera:

DEMO 1: Aberdeen Wealth Management
- Context: Failed transformation, need modernization
- Pain: Previous consultancy delivered slides, slow vs. neobanks
- Focus: Balanced
- Pre-populated: Discovery materials, 4/6 Company territories mapped,
  3/6 Customer territories mapped, synthesis with 3 opportunities

DEMO 2: Sterling Insurance Group
- Context: Entering insurtech, need product model
- Pain: Legacy culture, teams lack product thinking
- Focus: Market-Led
- Pre-populated: Discovery complete, all Company territories mapped,
  2/6 Customer mapped (in progress state)

DEMO 3: Northern Retail Bank
- Context: Transformation fatigue, sustainable change
- Pain: 3 failed transformations, team burnout
- Focus: Team-Empowerment
- Pre-populated: Full journey completed through synthesis,
  2 strategic bets created

Create a script: scripts/seed-demo-data.ts
Include a demo mode toggle in the admin panel.
Each client should have a separate Clerk organization.
```

**Time Allocation:**
- 0-60 min: Data model and seeding script
- 60-120 min: Configure 3 demo clients with pre-populated data
- 120-180 min: Demo mode toggle, test switching between clients

#### Applied Task: Demo Script & Materials (2 hours)

**Task Objectives:**
- Write 20-minute demo script
- Create demo flow checklist
- Prepare Q&A responses (10+ questions)
- Test full demo flow end-to-end

**Key Deliverables:**
- `Background/Demo-Script-v1.md` — Complete demo script
- `Background/Demo-QA-Guide.md` — Q&A preparation
- Demo environment tested and working

**Success Criteria:**
- [ ] 3 demo clients configured with pre-populated data
- [ ] Demo mode toggle in admin panel
- [ ] 20-minute demo script written
- [ ] Q&A guide with 10+ anticipated questions
- [ ] Full demo run-through completed successfully

### Day 7: Performance & Polish (4 hours)

#### Applied Task: Performance Optimization (4 hours)

**Task Objectives:**
- Lighthouse performance audit on all key pages
- Optimize bundle size (analyze with `next build --analyze`)
- Lazy load heavy components (PDF renderer, territory deep-dives)
- Optimize images (Next.js Image component)
- Ensure targets: landing <2s, dashboard <3s, agent <3s first response

**Claude Code Prompt:**
```
Perform a performance optimization pass on Frontera:

1. Run Lighthouse on: /, /sign-in, /dashboard,
   /dashboard/product-strategy-agent
   Record scores before changes.

2. BUNDLE ANALYSIS:
   - Add @next/bundle-analyzer
   - Identify large dependencies
   - Dynamic import heavy components

3. LAZY LOADING:
   - Territory deep-dive components (loaded on click)
   - PDF renderer (@react-pdf/renderer - already subprocess)
   - Chart/visualization components
   - Case library (loaded on tab switch)

4. IMAGE OPTIMIZATION:
   - Ensure all images use next/image
   - Add proper width/height/sizes attributes
   - Convert logos to WebP format

5. API OPTIMIZATION:
   - Add response caching headers where appropriate
   - Optimize Supabase queries (add missing indexes)
   - Reduce unnecessary data fetching on initial load

Target scores: Performance >80, Accessibility >85, Best Practices >90
```

**Time Allocation:**
- 0-60 min: Lighthouse audit, identify bottlenecks
- 60-150 min: Bundle optimization, lazy loading
- 150-210 min: Image and API optimization
- 210-240 min: Re-audit, verify improvements

**Success Criteria:**
- [ ] Lighthouse performance > 80 on all pages
- [ ] Landing page loads in < 2s
- [ ] Dashboard loads in < 3s
- [ ] Agent first response < 3s
- [ ] No layout shifts (CLS < 0.1)

---

## WEEKS 5-8: PILOT PROGRAM & SCALE

### Week 5: Mobile & PWA Foundation (10 hours)

**Reference:** `.claude/plans/omnichannel-strategy.md` — Wave 1

**Objectives:**
- Mobile-first responsive refactor of core layouts
- Bottom sheet coaching component (swipe up from FAB)
- Touch-optimized territory cards (44px targets)
- Compact mobile stepper
- Service worker + web manifest for PWA

**Key Tasks:**
1. Responsive ProductStrategyAgentInterface: mobile = coach popup + canvas scroll
2. Touch-friendly territory cards and research area selections
3. Mobile synthesis view (scrollable opportunity cards vs 2x2 matrix)
4. PWA manifest with Frontera branding
5. Offline access to completed synthesis outputs

**Success Criteria:**
- [ ] Lighthouse mobile score > 90
- [ ] All critical flows work on mobile (375px width)
- [ ] PWA installable on iOS and Android
- [ ] Offline synthesis reading works

### Week 6: Feedback & Analytics (10 hours)

**Reference:** PostHog instrumentation from v3 plan (mostly implemented)

**Objectives:**
- Enable PostHog session recording for pilot users
- Build in-app feedback collection (star ratings, thumbs up/down)
- Create pilot success dashboards in PostHog
- Set up automated weekly metrics calculation
- Configure alerting for engagement drops

**Key Tasks:**
1. Session recording with privacy masking
2. Feedback components: AgentFeedbackButton, DocumentQualityFeedback
3. PostHog funnels: Signup → First Output, Research Completion, Document Generation
4. Pilot success dashboard: WAU, time-to-value, completion rates
5. Weekly review process documentation

**Success Criteria:**
- [ ] Session recording enabled for pilot cohort
- [ ] Feedback collection at key moments (post-synthesis, post-export)
- [ ] 4 PostHog dashboards configured
- [ ] Weekly metrics process documented

### Week 7: Pilot Launch Preparation (10 hours)

**Objectives:**
- Recruit 2-3 pilot customers
- Create pilot onboarding materials
- Set up pilot success tracking
- Create customer support playbook
- Final QA pass

**Key Tasks:**
1. Pilot agreement template
2. Onboarding guide for pilot users
3. Support playbook (common issues, escalation paths)
4. Success metrics baseline capture
5. Full regression testing

### Week 8: Pilot Launch & Iteration (10 hours)

**Objectives:**
- Launch pilot with first 2-3 customers
- Daily monitoring of pilot metrics
- Rapid iteration on feedback
- Document learnings
- Plan next phase

**Key Tasks:**
1. Pilot kickoff meetings
2. Monitor PostHog dashboards daily for week 1
3. Address any blocking issues immediately
4. Collect structured feedback (weekly check-ins)
5. Prioritize feedback for next sprint

---

## MONTHS 3-6: ADDITIONAL COACHING MODULES

### Month 3: North Star & OKR Agent (25 hours)

**From Frontera Master Overview:**

**Objectives:**
- Build agent that helps define customer value metrics (North Star)
- Guide OKR creation aligned to North Star
- Create metric trees linking leading/lagging indicators
- Connect to Product Strategy Agent outputs

**Implementation Pattern:**
- New agent type: `north_star_okr`
- New system prompt based on North Star methodology
- Reuse existing conversation infrastructure
- New canvas sections for metric trees and OKR cascades
- Integration: synthesis opportunities → North Star → OKRs

### Month 4: Team Mission, Vision & OKR House Agent (25 hours)

**Objectives:**
- Coach teams to define customer missions
- Create team vision statements aligned to company strategy
- Build team-level OKRs cascading from company OKRs
- Ensure psychological safety in goal-setting

**Implementation Pattern:**
- New agent type: `team_mission`
- Team-level data model (multiple teams per organization)
- Integration: company strategy → team missions → team OKRs
- Shared dashboard showing alignment across teams

### Month 5-6: Competency Framework Agent (30 hours)

**Objectives:**
- Define role competencies for Product, Engineering, Design, Data
- Assess current capability levels
- Create personalized learning paths
- Track skill development over time

**Implementation Pattern:**
- New agent type: `competency`
- Competency matrix data model
- Integration with personal profiling data
- Learning path recommendations from expert knowledge base

### Enterprise Features (ongoing)

**From Master Overview — build as pilot customers request:**
- Jira integration: Link strategic bets to epics
- Confluence integration: Export strategy documents
- Slack integration: Notifications and coaching nudges
- Linear integration: Product roadmap sync
- Team collaboration: Multi-user conversations, comments
- Advanced analytics: Coach effectiveness, time-to-insight

---

## UPDATED LEARNING RESOURCES

### Week 2 Resources (Strategic Bets & Expert Knowledge)
- Roger Martin "Playing to Win" — Strategic choice cascades, integrated choices
- Chandra Janakiraman "Strategy Blocks" — 4-dimension scoring (impact, certainty, clarity, uniqueness)
- Marty Cagan "Inspired/Empowered" — Measurable leading indicators (strategy vs discovery distinction)
- Melissa Perri "Escaping the Build Trap" — Strategic Intent → Product Initiatives → Options
- Gibson Biddle — DHM Model (Delight, Hard to copy, Margin-enhancing)
- Clayton Christensen / Bob Moesta — Jobs to Be Done, demand-side anchoring
- Annie Duke "Thinking in Bets" / "Quit" — Kill criteria, pre-committed abandonment
- Frontera Critical Assessment: `Background/Strategic_Bets_Critical_Assessment.docx`
- Frontera Implementation Plan v2: `Background/Strategic_Bets_Implementation_Plan_v2.docx`
- Anthropic "Building with Claude" — Context window optimization
- Supabase pgvector documentation — Semantic search

### Week 3 Resources (UX & Accessibility)
- WCAG 2.1 Quick Reference — https://www.w3.org/WAI/WCAG21/quickref/
- MDN Accessibility Guide — Keyboard navigation
- "Inclusive Components" by Heydon Pickering — Accessible patterns
- Frontera Design Reviews (in repository root)

### Week 4 Resources (Security & Demo)
- OWASP Top 10 for Next.js
- Zod documentation — Schema validation
- Vercel Security Headers Guide
- Anthropic Safety documentation — Prompt injection

### Weeks 5-8 Resources (Mobile & Pilot)
- Next.js PWA Guide
- Capacitor documentation — Native wrapper
- PostHog session recording documentation
- PostHog funnels and cohorts guide

---

## SUCCESS METRICS

### Technical Readiness (Target: End of Week 4)

**Performance:**
- [ ] Landing page loads < 2s
- [ ] Agent first response < 3s
- [ ] Synthesis generation < 30s
- [ ] PDF export < 10s
- [ ] Lighthouse performance > 80

**Functionality:**
- [ ] All 4 methodology phases work end-to-end
- [ ] 18 research areas across 3 territories functional
- [ ] Synthesis generates evidence-linked opportunities
- [ ] Strategic bets link to synthesis and evidence
- [ ] Expert knowledge surfaces contextually
- [ ] PDF export generates professional reports
- [ ] Demo clients configured and working

**Quality:**
- [ ] 500+ automated tests passing
- [ ] WCAG Level A compliance > 85%
- [ ] No critical security vulnerabilities
- [ ] CSP headers active
- [ ] Rate limiting on AI endpoints
- [ ] Input validation on all API routes

### Business Readiness (Target: End of Week 8)

**Demo Capability:**
- [ ] 20-minute demo runs flawlessly
- [ ] 3 demo clients showcase different scenarios
- [ ] Q&A prepared for 15+ anticipated questions
- [ ] Backup plan for technical failures

**Pilot Capability:**
- [ ] 2-3 pilot customers onboarded
- [ ] Success metrics tracking operational
- [ ] Weekly review process established
- [ ] Support playbook documented
- [ ] Feedback collection active

### Platform Metrics (Pilot Targets)

**North Star:** Weekly Active Executives using platform (target: 80%+)

**Primary:**
- Time to First Value: < 14 days from signup to first strategic output
- Research Completion Rate: > 70% users completing all 3 territories
- Document Generation Success: > 80% users generating insights/PDF
- Engagement Rate: > 85% pilot users active weekly

**Secondary:**
- Agent conversation quality rating: > 4/5
- Document usefulness rating: > 4/5
- Platform NPS: > 50
- Time saved vs consultancy: > 80% reduction

---

## CONFIDENCE BUILDERS

### What You've Already Achieved

In the first phase of development, you built:
- A complete multi-tenant SaaS platform with enterprise auth
- An AI-powered coaching system with 6 personas and context awareness
- A 4-phase strategic methodology engine (3 of 4 phases complete)
- 18 research areas across 3 strategic territories
- AI-powered synthesis with Playing to Win framework
- Professional PDF export with brand design
- Personal profiling with AI reflections
- Leadership playbook from 301 expert conversations
- Case study engine, expert perspectives, tension simulator
- 471 automated tests across 8 testing phases
- CI/CD pipeline with GitHub Actions
- Brand design system (Navy + Gold + Cyan)

This is substantially more than the original v3 plan targeted for Week 4. The foundation is strong. What remains is:
1. Completing the final methodology phase (Strategic Bets)
2. Enterprise polish (accessibility, security, performance)
3. Demo preparation and pilot launch

### The Path Forward

The hardest part — building the core platform from zero — is done. Weeks 2-8 focus on:
- **Depth** (completing Strategic Bets, ingesting expert knowledge)
- **Quality** (accessibility, security, performance)
- **Readiness** (demo prep, pilot launch, feedback loops)

This is refinement and extension of a working system, not building from scratch. The risk profile is fundamentally different — and lower — than Week 1.

---

## WEEKLY REFLECTION QUESTIONS

Ask yourself every Friday:

1. **Progress:** Did I hit my weekly milestone?
2. **Learning:** What new capability did I develop this week?
3. **Blockers:** What slowed me down? Can Claude Code help differently?
4. **Quality:** Would I demo what I built this week to an enterprise CTO?
5. **Business:** How does this week's work move us closer to first pilot revenue?

---

## APPENDIX: KEY FILE LOCATIONS

```
frontera-platform/
├── src/
│   ├── app/                              # Next.js App Router pages
│   │   ├── api/                          # 30 API routes
│   │   │   ├── conversations/            # Chat CRUD + streaming
│   │   │   ├── product-strategy-agent/   # PSA endpoints (15+)
│   │   │   ├── admin/                    # Admin APIs
│   │   │   ├── organizations/            # Team management
│   │   │   └── auth/                     # Custom auth logic
│   │   ├── dashboard/                    # Authenticated pages
│   │   │   ├── product-strategy-agent/   # Main PSA interface
│   │   │   ├── personal-profile/         # Profiling intake
│   │   │   ├── leadership-playbook/      # Leadership dev
│   │   │   ├── team/                     # Team management
│   │   │   └── admin/                    # Admin panel
│   │   ├── sign-in/                      # Clerk sign-in
│   │   └── sign-up/                      # Clerk sign-up
│   ├── components/
│   │   ├── product-strategy-agent/       # PSA components (40+)
│   │   │   ├── CanvasPanel/              # Right panel (20+ components)
│   │   │   ├── CoachingPanel/            # Left panel (15+ components)
│   │   │   └── PersonalProfile/          # Profiling UI
│   │   ├── auth/                         # SignInForm, SignUpForm
│   │   ├── onboarding/                   # 4-step wizard
│   │   └── admin/                        # Admin components
│   ├── lib/
│   │   ├── agents/strategy-coach/        # AI agent (prompts, state, personas)
│   │   ├── pdf/synthesis-report/         # PDF components
│   │   └── analytics/                    # PostHog helpers
│   ├── hooks/                            # Custom React hooks
│   ├── types/                            # TypeScript types
│   └── middleware.ts                     # Clerk auth middleware
├── tests/                                # 471 tests
│   ├── unit/                             # 158 tests
│   ├── integration/                      # 41 tests
│   ├── e2e/                              # 96 tests (Playwright)
│   ├── bdd/                              # 30 scenarios (Cucumber)
│   └── evals/                            # 90 AI evaluation tests
├── supabase/migrations/                  # Database migrations
├── scripts/                              # PDF generation, utilities
├── Background/                           # Strategy docs, PRDs, transcripts
│   ├── Product_Strategy_Agent_PRD_v2.1.md
│   ├── Frontera Master Overview.*
│   ├── Frontera_Buyer_Personas.txt
│   ├── Lenny's Podcast Transcripts Archive/  # 301 transcripts
│   └── Claude Code Learning Plan - v4.md     # THIS DOCUMENT
├── CLAUDE.md                             # Architecture + design system
└── .github/workflows/                    # CI/CD pipelines
```

## APPENDIX: ENVIRONMENT VARIABLES

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Anthropic API
ANTHROPIC_API_KEY=

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=
```

---

**End of Learning Plan v4**

*Previous versions: v3 (December 2025), v2, v1*
*Next review: End of Week 2 (February 14, 2026)*
