# PRODUCT REQUIREMENTS DOCUMENT

# Frontera Product Strategy Coach — MVP2 Migration PRD
## Single Source of Truth for Incremental Migration from MVP1 to MVP2

---

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Date** | February 27, 2026 |
| **Author** | Derek Smith |
| **Status** | Active — Migration Reference |
| **Based On** | PRD v2.1, PRD v3.0, UX Journey Research, Card System PRD, QuestionCards Plan, Build Plan v3, Aesthetic Upgrade Plan |
| **Methodology** | Playing to Win Framework (Roger Martin & A.G. Lafley) |

---

## Table of Contents

- [PART 1: MVP2 Target State PRD](#part-1-mvp2-target-state-prd)
  - [1. Executive Summary](#1-executive-summary)
  - [2. Vision & Design Pillars](#2-vision--design-pillars)
  - [3. Target Personas](#3-target-personas)
  - [4. Target User Journey (6 Phases)](#4-target-user-journey-6-phases)
  - [5. Card System Specification](#5-card-system-specification)
  - [6. Coach Review System](#6-coach-review-system)
  - [7. Strategic Maturity Assessment](#7-strategic-maturity-assessment)
  - [8. Activation Artefacts (Phase 5)](#8-activation-artefacts-phase-5)
  - [9. Living Strategy (Phase 6)](#9-living-strategy-phase-6)
  - [10. Gamification System](#10-gamification-system)
  - [11. Strategy Home Dashboard](#11-strategy-home-dashboard)
  - [12. Artefact Suite](#12-artefact-suite)
  - [13. Data Model (Target)](#13-data-model-target)
  - [14. Success Metrics](#14-success-metrics)
- [PART 2: Current State & Architectural Context](#part-2-current-state--architectural-context)
  - [15. What's Working in MVP1 (Post 9-Fix)](#15-whats-working-in-mvp1-post-9-fix)
  - [16. What's Broken or Dormant in V2 Codebase](#16-whats-broken-or-dormant-in-v2-codebase)
  - [17. Root Causes Identified & Resolved](#17-root-causes-identified--resolved)
  - [18. Key Architectural Decision: Rebuild, Don't Import V2](#18-key-architectural-decision-rebuild-dont-import-v2)
- [PART 3: Incremental Migration Plan (13 Phases)](#part-3-incremental-migration-plan-13-phases)
  - [19. Migration Philosophy](#19-migration-philosophy)
  - [20. Phase Dependency Graph](#20-phase-dependency-graph)
  - [21. Phase 0: Foundation Hardening](#21-phase-0-foundation-hardening)
  - [22. Phase 1: Card System Foundation](#22-phase-1-card-system-foundation)
  - [23. Phase 2: QuestionCard Research Flow](#23-phase-2-questioncard-research-flow)
  - [24. Phase 3: Coach Review System](#24-phase-3-coach-review-system)
  - [25. Phase 4: Micro-Synthesis & Journey Energy](#25-phase-4-micro-synthesis--journey-energy)
  - [26. Phase 5: Strategic Assessment](#26-phase-5-strategic-assessment)
  - [27. Phase 6: Coaching Enhancements](#27-phase-6-coaching-enhancements)
  - [28. Phase 7: Layout Evolution](#28-phase-7-layout-evolution)
  - [29. Phase 8: Strategy Home](#29-phase-8-strategy-home)
  - [30. Phase 9: Activation Artefacts (Phase 5 of Journey)](#30-phase-9-activation-artefacts-phase-5-of-journey)
  - [31. Phase 10: Living Strategy (Phase 6 of Journey)](#31-phase-10-living-strategy-phase-6-of-journey)
  - [32. Phase 11: Gamification](#32-phase-11-gamification)
  - [33. Phase 12: Aesthetic Polish](#33-phase-12-aesthetic-polish)
  - [34. Verification Strategy](#34-verification-strategy)

---

# PART 1: MVP2 Target State PRD

---

## 1. Executive Summary

### 1.1 The Transformation

MVP2 represents a fundamental evolution of how enterprise leaders experience strategic coaching. Where MVP1 treats coaching as a sidebar companion to a canvas-based workflow, MVP2 makes **coaching the central experience** with strategic artefacts emerging naturally from conversation.

Three converging insights drive this transformation:

1. **Coaching is hidden** — in MVP1 the coach occupies 25% of the screen and isn't integrated with research question context or user journey flow. This is the single most impactful UX problem to solve.
2. **BetterUp's proven model** — 95% satisfaction with AI coaching by making conversation the primary interface, not a secondary feature.
3. **Enterprise reality** — 49% of product leaders lack time for strategic thinking (Atlassian 2026), 84% worry their strategy never reaches execution (ProductPlan 2025).

### 1.2 Design Hypothesis

> **"Your AI strategy partner, embedded in every decision moment."**

Leaders don't need another tool to fill in — they need an intelligent partner who guides them through strategic thinking, generates artefacts from their conversations, and keeps strategy alive long after the initial planning session ends.

### 1.3 What Changes from MVP1 to MVP2

| Dimension | MVP1 (Current) | MVP2 (Target) |
|-----------|----------------|---------------|
| **Layout** | 25% coach sidebar + 75% canvas | 60% coaching centre + 40% context panel |
| **Entry point** | Jump straight into canvas workspace | Personalised Strategy Home with curated daily cards |
| **Discovery** | Passive file upload with minimal coaching | Coach-led interview exploring "why" before "what" |
| **Research** | 36 text questions in 9 areas, textarea format | Coach-guided QuestionCards with review system, one at a time |
| **Coaching role** | Reactive (responds to input) | Proactive (identifies blind spots, escalates challenges) |
| **Journey end** | Phase 4: Strategic Bets + PDF export | Phase 6: Living Strategy with assumption tracking |
| **Outputs** | PDF exports, in-app views | Living artefacts: team briefs, guardrails, OKR cascades, Strategy on a Page |
| **Personalisation** | Industry context only | Strategic Maturity archetype shapes entire experience |
| **Engagement** | One-time strategy session | Ongoing strategic partnership with return triggers |
| **Research feedback** | No insight until synthesis (2.5+ hours) | Micro-synthesis after each territory (~25 min) |

---

## 2. Vision & Design Pillars

### Pillar 1: Coaching Is the Product

> *"The best coaching happens when you don't notice the interface — you notice the insight."*

The coaching conversation occupies 60% of the viewport. Strategic research, synthesis outputs, and artefact previews appear in the 40% context panel — supporting the conversation, not competing with it. Users never leave the coaching flow to "go do research" — the coach guides them through it.

**In practice:**
- Every research question is asked BY the coach via QuestionCards, not presented as a bare form
- Artefacts (synthesis, bets, team briefs) appear as inline cards within the conversation
- The context panel updates automatically based on what's being discussed
- Phase transitions happen through coaching milestones, not button clicks

### Pillar 2: Assessment Shapes the Journey

> *"One size fits all coaching is no coaching at all."*

A Strategic Maturity Assessment during onboarding classifies leaders into four archetypes (Operator, Visionary, Analyst, Diplomat). This shapes coaching depth, question complexity, recommended activities, and phase pacing throughout the entire journey.

### Pillar 3: Personalised Daily Value

> *"The platform should feel valuable in 5 minutes, not just after 5 hours."*

Strategy Home replaces the generic dashboard with personalised strategic coaching cards that deliver value even in a 5-minute visit. Cards adapt based on current phase, time since last session, strategic signals, and assessment archetype.

### Pillar 4: Progressive Gratification

> *"Show progress early and often. The 'wow moment' should come after 15 minutes, not 2.5 hours."*

Micro-synthesis moments after each completed territory. Real-time confidence meters. Phase completion celebrations. Territorial insight summaries that preview the full synthesis. The research bottleneck is broken by showing strategic value continuously.

### Pillar 5: Strategy Is Living, Not Static

> *"A strategy document that doesn't change is a strategy that's already obsolete."*

Phase 6 introduces assumption tracking, signal logging, strategy versioning, and review cadences tied to kill dates. Strategic bets have outcome tracking that feeds back into territory research.

### Pillar 6: Audience-Aware Outputs

> *"The same strategy, rendered for the person reading it."*

The Stakeholder Communication Pack generates audience-specific views from the same synthesis data. The CPO sees portfolio balance. The CTO sees technical requirements. Sales sees competitive positioning. PMs see team briefs with guardrails.

---

## 3. Target Personas

### 3.1 Primary: Chief Product Officer (CPO)

| Attribute | Detail |
|-----------|--------|
| **Title** | CPO, CTO (product-led), Chief Strategy Officer |
| **Company size** | 200–1,000 (AI-only); 1,000+ (AI + Human coaching) |
| **Reports to** | CEO / Board |
| **Experience** | 15–25 years, 5–10 in C-suite |
| **Strategic maturity** | High — owns the vision but needs structured process + AI partner |

**How MVP2 serves them:**
- Strategy Home delivers personalised strategic intelligence in 5 minutes
- Coach-led Discovery replaces "upload your docs" with C-level interview
- Micro-synthesis provides insights after each territory (not after 2.5 hours)
- Phase 5 generates team briefs, guardrails, OKRs that cascade to VPs/PMs
- Phase 6 makes strategy a living practice with assumption tracking

### 3.2 Secondary: VP of Product / Head of Strategy

Deep strategic work — researching, synthesising, refining bets under CPO direction.

**How MVP2 serves them:**
- QuestionCard system with coach review makes research guided and rewarding
- Archetype-adapted coaching meets them where they are
- Debate Mode helps navigate strategic tensions with expert perspectives
- Team Brief Generator translates bets into briefs their PMs can act on

### 3.3 Tertiary: Product Manager (Strategy Consumer)

Receives strategic context, uses frameworks daily. 5–10 minutes to absorb context.

**How MVP2 serves them:**
- Team Briefs per strategic bet with problem context, guardrails, metrics
- Decision Framework: "When choosing between X and Y, prioritise..."
- Strategic Guardrails: clear "We will / We will not" statements
- Evidence trail from their team's OKR back to research insight

---

## 4. Target User Journey (6 Phases)

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│          │    │          │    │          │    │          │    │          │    │          │
│DISCOVERY │───▶│ RESEARCH │───▶│SYNTHESIS │───▶│STRATEGIC │───▶│STRATEGIC │───▶│ STRATEGY │
│          │    │          │    │          │    │  BETS    │    │ACTIVATION│    │  REVIEW  │
│ ~15 min  │    │ 3×25 min │    │ ~10 min  │    │ ~30 min  │    │ ~20 min  │    │ Ongoing  │
│          │    │          │    │          │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │                │               │               │               │               │
 Strategic        Territorial      Strategy on     Strategic      Team Briefs     Assumption
 Context          Insight          a Page          Bets Doc       OKR Cascade     Tracker
 Summary          Summaries                        Guardrails     Stakeholder     Signal Log
                                                                  Packs           Versions
```

### Phase 1: Discovery (Coach-Led Interview, ~15 min)

**What changes from MVP1:** Passive file upload becomes an active coach-led 5-question interview exploring "why" before "what."

**Coach-led interview questions:**
1. **"What's driving this strategy effort right now?"** — Uncovers urgency
2. **"What does winning look like for your organisation in 3 years?"** — Establishes winning aspiration (PTW)
3. **"What have you tried before, and what happened?"** — Transformation recovery context
4. **"Who needs to be aligned for this strategy to succeed?"** — Stakeholder landscape
5. **"What's the one thing you're most uncertain about?"** — Strategic anxiety to address first

**Context Panel:** Company Profile (editable), Document Upload, AI Research Assistant, Strategic Context Summary (builds in real-time).

**Micro-Gratification:** After interview, coach delivers first artefact — Strategic Context Summary inline card.

**Phase Transition:** Coach-initiated: "You've established a solid strategic context. Shall we start mapping your strategic terrain?"

### Phase 2: Research (Guided Exploration, ~25 min per territory)

**What changes from MVP1:** 36 textarea questions become coach-guided QuestionCards with AI review, one question at a time, confidence ratings, and micro-synthesis after each territory.

**Three territories, each with 3 research areas:**
- **Company:** Foundation, Strategic Position, Competitive Advantages
- **Customer:** Segmentation, Unmet Needs, Market Dynamics
- **Market Context:** Direct Competitors, Substitute Threats, Market Forces

**Key innovations:**
- QuestionCards with "Ask Coach for Suggestion" and "Review My Draft Answer"
- Confidence rating per answer (Data / Experience / Guess)
- Coach delivers Territorial Insight Summary after each territory completion
- Methodology hints: "Try: 5 customer interviews, win/loss analysis"

### Phase 3: Synthesis (Strategic Clarity, ~10 min)

**Playing to Win framework applied:**

| PTW Choice | Description | Research Input |
|------------|-------------|----------------|
| **Winning Aspiration** | What does winning look like? | Company Context + Strategic Goals |
| **Where to Play** | Which markets, segments, channels? | Customer + Competitor triangulation |
| **How to Win** | What's our competitive advantage? | Company + Customer triangulation |
| **Capabilities Required** | What must we build/acquire? | Company + Competitor triangulation |
| **Management Systems** | How do we measure success? | All three territories |

**Outputs:** Strategy on a Page, Strategic Opportunity Map (2×2 matrix), Evidence-Linked Opportunity Cards, Strategic Tensions & Trade-offs, WWHBT (What Would Have to Be True) assumptions.

**Debate Mode:** Triggered when tensions are explored — expert positions on both sides, user chooses or takes nuanced view.

### Phase 4: Strategic Bets (Commitment, ~30 min)

**Key enhancement:** Challenge escalation — coach intensity increases through this phase.

- Early: "Good start. Could you add a more specific success metric?"
- Mid: "This bet has vague timing. When exactly would you expect results?"
- Late: "I need to push back. This bet has no kill criteria. Let's fix this now."

**Leadership Calibration:** Inline card where user adjusts AI-generated scores with rationale.

**Outputs:** Strategic Bets Document, Strategic Guardrails ("We will / We will not"), Effort vs. Impact Plot.

### Phase 5: Strategic Activation (NEW, ~20 min)

Bridges the #1 gap — strategy disconnected from execution.

**5a. Team Brief Generator** — Per bet: Context, Problem to Solve, Guardrails, Success Metrics, Kill Criteria.
**5b. OKR Cascade Proposals** — Objectives derived from bets, KRs from success metrics.
**5c. Decision Framework** — "When choosing between X and Y, prioritise..." rules derived from strategy.
**5d. Stakeholder Communication Pack** — Audience-specific views (CPO/CEO, CTO, VP Sales, PMs).

### Phase 6: Strategy Review (NEW, Ongoing)

Makes strategy adaptive, not static.

**6a. Assumption Tracker** — WWHBT assumptions with status (untested → testing → validated/invalidated).
**6b. Signal Log** — Market events: competitor moves, customer signals, market shifts, internal changes.
**6c. Strategy Versioning** — Auto-snapshot at each phase, diff view, change narrative.
**6d. Review Cadence** — Kill date reviews (15 min), assumption invalidation (30 min), monthly health check (15 min), quarterly full review (60 min).

---

## 5. Card System Specification

### 5.1 Card Types

| Card Type | Purpose | State | Trigger |
|-----------|---------|-------|---------|
| **ExplanationCard** | Phase/section introduction | Read-only | Phase transitions, first message, AI-initiated |
| **RequestCard** | Prompt specific user action | Interactive | Document upload needed, territory mapping required |
| **QuestionCard** | Active research question with form | Interactive | Coach asks research questions one at a time |
| **AnsweredCard** | Submitted answer (collapsed) | Expandable/Editable | After QuestionCard submission |
| **DebateCard** | Explore strategic tensions | Interactive | Coach identifies tradeoff, synthesis tensions |
| **WhatsNextCard** | Persistent progress tracker (sticky) | Real-time | Always visible below chat, above input |

### 5.2 Card Marker Format

AI coach emits cards using inline markers parsed client-side:

```
[CARD:explanation]
{"title": "Welcome to Discovery", "body": "...", "icon": "compass"}
[/CARD]

[CARD:request]
{"title": "Upload Materials", "body": "...", "urgency": "required", "actionType": "upload_materials"}
[/CARD]

[CARD:question]
{
  "territory": "company",
  "research_area": "company_foundation",
  "question_index": 0,
  "question": "What are your company's core products/services?",
  "total_questions": 3
}
[/CARD]

[CARD:debate]
{"title": "Growth vs Profitability", "perspectiveA": {...}, "perspectiveB": {...}}
[/CARD]
```

### 5.3 Card Type Definitions

```typescript
export type CardType = 'explanation' | 'request' | 'question' | 'debate' | 'whats-next';

export interface ExplanationCardData {
  title: string;
  body: string;
  icon?: 'compass' | 'map' | 'lightbulb' | 'target';
  showPhases?: boolean;
  ctaLabel?: string;
}

export interface RequestCardData {
  title: string;
  body: string;
  urgency: 'required' | 'optional';
  actionType: 'upload_materials' | 'begin_research' | 'complete_territory' | 'start_synthesis';
  progress?: { current: number; total: number };
}

export interface QuestionCardData {
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  question_index: number;
  question: string;
  total_questions: number;
}

export interface DebateCardData {
  title: string;
  perspectiveA: { label: string; summary: string };
  perspectiveB: { label: string; summary: string };
}

export interface WhatsNextCardData {
  milestone: string;
  checklist: Array<{ label: string; completed: boolean; required: boolean }>;
  readyToAdvance: boolean;
}
```

### 5.4 Card Visual Specifications

| Card | Background | Border | Animation |
|------|-----------|--------|-----------|
| ExplanationCard | `bg-cyan-50` | `border-cyan-200` | `animate-entrance` |
| RequestCard (required) | `bg-amber-50` | `border-amber-300` | `animate-entrance` |
| RequestCard (optional) | `bg-cyan-50` | `border-cyan-300` | `animate-entrance` |
| QuestionCard | `bg-white` | `border-2 border-cyan-200` | `animate-entrance` |
| AnsweredCard | `bg-emerald-50/50` | `border-emerald-200` | fade collapse |
| DebateCard | `bg-slate-50` | `border-[#1a1f3a]/20` | `animate-entrance` |
| WhatsNextCard (not ready) | `bg-amber-50` | `border-amber-300` | `transition-colors` |
| WhatsNextCard (ready) | `bg-emerald-50` | `border-emerald-300` | `transition-colors` |

---

## 6. Coach Review System

### 6.1 Two Coach Assistance Modes

**Mode 1: "Ask Coach for Suggestion"**
- Generates a starting point for empty or sparse answers
- User can apply suggestion to their textarea
- Uses existing InlineCoachBar pattern

**Mode 2: "Review My Draft Answer" (NEW)**
- Coach critically assesses the user's draft answer
- Returns structured feedback:
  - **Challenges:** "Have you considered...?", "What about...?"
  - **Enhancement Ideas:** Concrete improvements to strengthen the answer
  - **Relevant Resources:** Links to frameworks, publications, podcasts
- User can "Apply Suggestions" or "Continue Without Changes"

### 6.2 CoachReviewPanel Specification

```
┌────────────────────────────────────────────────────────────────┐
│ 🔍 COACH REVIEW                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Your answer covers the basics well. Areas to strengthen:       │
│                                                                │
│ ⚡ CHALLENGES                                                   │
│ • Have you considered how your solution differs from           │
│   competitors' approaches?                                     │
│ • What specific metrics demonstrate customer value?            │
│                                                                │
│ 💡 ENHANCEMENT IDEAS                                            │
│ • Add concrete customer pain points with examples              │
│ • Quantify the impact where possible                           │
│                                                                │
│ 📚 RELEVANT RESOURCES                                           │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🎙️ Lenny's Podcast: "Finding Product-Market Fit"         │   │
│ │    → How Figma identified their core value proposition   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌────────────────────┐  ┌────────────────────────────────────┐ │
│ │  Apply Suggestions │  │  Continue Without Changes          │ │
│ └────────────────────┘  └────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 Resource Sources

| Source | Description | Implementation |
|--------|-------------|----------------|
| **Lenny's Podcast Archive** | Pre-indexed transcripts, semantic search | `src/lib/resources/lenny-archive.ts` |
| **Frontera Master Product Leaders** | Curated frameworks (Dunford, Cagan, etc.) | `src/lib/resources/product-leaders.ts` |
| **Anthropic API Web Search** | Real-time articles, case studies | `src/lib/resources/web-search.ts` |

### 6.4 Coach Context for Review

The coach has access to ALL user/company data when providing reviews:

| Data Source | Table | Usage |
|-------------|-------|-------|
| Chat history | `conversation_messages` | Understand discussion context |
| Uploaded materials | `uploaded_materials` | Reference company docs |
| Form inputs (cards) | `territory_insights` | All answered questions |
| Company context | `clients` | Company name, industry, focus |
| Framework state | `conversations.framework_state` | Current phase, progress |

---

## 7. Strategic Maturity Assessment

### 7.1 Purpose

Personalise the coaching journey by assessing strategic maturity across five dimensions. Implements BetterUp's "Whole Person Model" adapted for strategic leadership.

### 7.2 Assessment Flow

- **Placement:** After onboarding wizard, before first strategy session
- **Format:** 20 Likert-scale statements (5-point) + 3 situational choice questions
- **Duration:** 8–12 minutes
- **Skippable:** "Assess Later" option always available

### 7.3 Five Dimensions

| Dimension | Measures | Sample Statement |
|-----------|---------|------------------|
| **Strategic Vision** | Long-term thinking, market trends | "I can clearly articulate where my product should be positioned in 3 years" |
| **Research Rigour** | Evidence-based decisions, data literacy | "I regularly validate assumptions with customer data" |
| **Execution Discipline** | Strategy-to-action translation, metrics | "My team has clear success metrics for every initiative" |
| **Stakeholder Alignment** | Cross-functional communication, influence | "I align with engineering, sales, and marketing before committing" |
| **Adaptive Capacity** | Willingness to pivot, learning orientation | "When assumptions are invalidated, I quickly adjust" |

### 7.4 Four Archetypes

```
                HIGH STRATEGIC VISION
                       │
          Visionary     │     Diplomat
        (Vision +       │   (Vision +
         Research)      │    Alignment)
                       │
LOW ──────────────────┼──────────────────── HIGH
EXECUTION             │              STAKEHOLDER
                       │              ALIGNMENT
          Analyst       │     Operator
        (Research +     │   (Execution +
         Adaptive)      │    Alignment)
                       │
                LOW STRATEGIC VISION
```

### 7.5 Coaching Adaptation by Archetype

| Journey Element | Operator | Visionary | Analyst | Diplomat |
|----------------|----------|-----------|---------|----------|
| **Discovery** | "Zoom out from your roadmap — what MARKET opportunity?" | "Great vision — let's ground it with evidence" | "Thorough analysis — what DECISION does it lead to?" | "You've aligned everyone — what would YOU prioritise?" |
| **Research depth** | Fewer Qs, more framing | Standard + evidence demands | Full set + methodology hints | Standard + stakeholder prompts |
| **Synthesis** | Opps + execution implications | Opps + evidence strength | Opps + confidence ratings | Opps + alignment implications |
| **Coaching intensity** | Challenge on abstraction | Challenge on specificity | Challenge on speed | Challenge on decisiveness |
| **Activities** | "Strategic Thinking" exercises | "Evidence Grounding" | "Bias for Action" | "Decisive Leadership" |

---

## 8. Activation Artefacts (Phase 5)

### 8.1 Team Brief Generator

Per strategic bet, generates:

| Section | Content | Source |
|---------|---------|--------|
| **Context** | Why this matters — narrative linking research to bet | Research + Synthesis |
| **Problem to Solve** | What we need to figure out | Bet hypothesis |
| **Guardrails** | What we will NOT do | Synthesis tensions |
| **Success Metrics** | How we'll know it's working | Bet success criteria |
| **Kill Criteria** | When we stop | Bet kill criteria |

### 8.2 OKR Cascade

```
OBJECTIVE: [Derived from strategic bet]

KR1: [Measurable result from success metrics]
KR2: [Measurable result from success metrics]
KR3: [Leading indicator from research]

LINKED BET: [Bet title]
EVIDENCE: [Research territory reference]
```
### OKR Writing/ Creation best practice
OBJECTIVE: Product best practice guidance to Claude on how to generate and write OKRs as part of the product strategy process

Here's best-practice guidance for writing OKRs for a Product Strategy and Product team, drawing on Jeff Gothelf's principles:
1. Separate Strategic from Operational Goals
OKRs should target significant improvements, not business-as-usual work. Keep operational tasks in a separate backlog [2] .
2. Write Outcome-Based Objectives
Objectives should be qualitative, inspiring, and customer-centric — not output-focused. Ask: "What meaningful change do we want to create for our customers or business?" [1]
3. Define Measurable Key Results
Key Results must be quantitative signals of progress toward the Objective. Avoid shipping features as KRs; instead, measure behaviour changes (e.g., retention rate, activation %) [3]
4. Build Metric Literacy
Teams must deeply understand which metrics matter and why. Gothelf warns that poor metric understanding is the #1 reason OKRs fail [3]
5. Connect OKRs to Product Discovery (Lean UX)
OKRs should drive hypothesis-driven experimentation. Frame work as: "We believe [action] will move [KR metric] because [assumption]" [6]
Wodtke's Golden Rule: One Objective, three Key Results per cycle — focus beats volume.

🌐 Sources

jeffgothelf.com - What is an OKR? Objectives, key results and how to use them
jeffgothelf.com - Should we use OKRs for everything?
jeffgothelf.com - You suck at OKRs. Here's why.
linkedin.com - 4 OKRs for Trust, Decision-Making, and Alignment
emergeagency.com - The Ultimate Guide to Implementing OKRs for Digital Product...
jeffgothelf.com - Connecting Lean UX, Sense & Respond, and OKRs

Building on the previous OKR guidance, Jeff Gothelf's "Who Does What By How Much" framework (co-authored with Josh Seiden) is a powerful formula for writing precise, outcome-driven Key Results [3].
The Formula:

[Who] does [What] by [How Much]

Applied to Product team OKRs:
ElementGuidanceExampleWhoThe specific user or customer segmentNew users, enterprise customersWhatThe behaviour or action you want to changecomplete onboarding, upgrade planBy How MuchThe measurable targetincreases by 20%, from 30% → 50%
Full Example KR:

"New users who complete onboarding within 7 days increases from 30% to 50%"

This formula forces teams to:

Be customer-centric (not output-focused)
Define measurable outcomes, not shipped features
Build accountability into each Key Result [3]

OKRs can also apply this formula to internal team health and personal well-being goals, not just product metrics [1].

### 8.3 Decision Framework

"When your team faces a trade-off:"
- ✅ **PRIORITISE:** [Derived from winning strategy]
- ⚠️ **CONSIDER:** [Derived from capability analysis]
- ❌ **DEPRIORITISE:** [Derived from guardrails]

### 8.4 Stakeholder Communication Pack

| Audience | Content Emphasis |
|----------|-----------------|
| **CPO/CEO** | Portfolio balance, market positioning, resource implications, 90-day milestones |
| **CTO** | Technical capabilities needed, architecture implications, build-vs-buy |
| **VP Sales** | Competitive differentiation, customer targeting, pricing implications |
| **Product Managers** | Problem context, guardrails, success metrics, decision framework |

---

## 9. Living Strategy (Phase 6)

### 9.1 Assumption Tracker

Each WWHBT assumption from synthesis/bets is tracked:

| Status | Meaning | Trigger |
|--------|---------|---------|
| `untested` | No evidence yet | Default |
| `testing` | Validation in progress | User marks as testing |
| `validated` | Evidence supports it | User logs evidence |
| `invalidated` | Evidence contradicts it | User/signal logs counter-evidence |

### 9.2 Signal Log

| Signal Type | Example | Triggered Action |
|------------|---------|-----------------|
| **Competitor move** | "Competitor X launched new pricing" | Flag affected assumptions, suggest review |
| **Customer signal** | "Lost 3 enterprise deals on missing feature" | Update Customer Territory confidence |
| **Market shift** | "Regulatory change in target market" | Prompt full strategy review |
| **Internal change** | "Key hire enables new capability" | Update Company Territory, surface opportunities |

### 9.3 Strategy Versioning

- Auto-snapshot at each phase completion
- Diff view comparing any two versions
- AI-generated change narrative
- Timeline view of strategic evolution

### 9.4 Review Cadences

| Trigger | Type | Duration | Output |
|---------|------|----------|--------|
| Kill date reached | Bet review | 15 min | Updated status (continue/pivot/kill) |
| Assumption invalidated | Targeted review | 30 min | Updated synthesis + affected bets |
| Monthly | Health check | 15 min | Updated assumption tracker |
| Quarterly | Full review | 60 min | New strategy version with diff |

---

## 10. Gamification System

### 10.1 XP System

Actions earn experience points to sustain engagement:

| Action | XP | Category |
|--------|-----|----------|
| Answer a research question | 10 | Research |
| Complete a research area (3 questions) | 50 | Research |
| Complete a territory (3 areas) | 150 | Research |
| Upload a document | 15 | Discovery |
| Use AI Research Assistant | 20 | Discovery |
| Generate micro-synthesis | 75 | Synthesis |
| Generate full synthesis | 200 | Synthesis |
| Create a strategic bet | 50 | Bets |
| Add kill criteria to a bet | 25 | Bets |
| Generate team brief | 75 | Activation |
| Log a signal | 30 | Review |
| Validate an assumption | 40 | Review |

### 10.2 Levels

| Level | Title | XP Required |
|-------|-------|-------------|
| 1 | Strategy Novice | 0 |
| 2 | Terrain Scout | 100 |
| 3 | Research Explorer | 300 |
| 4 | Insight Hunter | 600 |
| 5 | Strategy Architect | 1,000 |
| 6 | Strategic Leader | 1,500 |
| 7 | Strategy Master | 2,500 |

### 10.3 Achievement Badges

| Badge | Trigger | Icon |
|-------|---------|------|
| First Steps | Complete Discovery phase | 🏔️ |
| Territory Pioneer | Complete first territory | 🗺️ |
| Full Cartographer | Complete all 3 territories | 🌍 |
| Synthesis Seeker | Generate first synthesis | 💡 |
| Bold Strategist | Create 3+ strategic bets | 🎯 |
| Execution Bridge | Generate first team brief | 🌉 |
| Living Strategist | Log first signal | 📡 |

### 10.4 Implementation

- XP rules: `src/lib/gamification/xp-rules.ts`
- Achievement definitions: `src/lib/gamification/achievements.ts`
- Level definitions: `src/lib/gamification/levels.ts`
- UI: XP bar in left sidebar, achievement badges, level-up celebrations

---

## 11. Strategy Home Dashboard

### 11.1 Purpose

Replace the generic dashboard with a BetterUp-inspired personalised home that delivers strategic value in every visit.

### 11.2 Card Types

| Card | Data Source | Appears When | Adapts To |
|------|-----------|-------------|-----------|
| **Strategy Progress** | `framework_state`, `territory_insights` | Always | Current phase, completion % |
| **Today's Coaching Topic** | AI-generated | Always | Archetype, blind spots, stalled areas |
| **Strategic Signal** | `strategy_signals` table | Signal logged | Industry, competitive landscape |
| **Recommended Activity** | Phase progress + inactivity | >3 days inactive | Archetype-adapted recommendations |
| **Upcoming Review** | `assumption_register` kill dates | Kill date within 14 days | Bet status, assumption state |
| **Micro-Synthesis Preview** | `synthesis_outputs` partial | Territory completed | Completed territory data |

### 11.3 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Good morning, Derek                                                  │
│  Here's your strategic landscape today.                              │
│                                                                       │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ 📊 STRATEGY PROGRESS        │  │ 🎯 TODAY'S COACHING TOPIC    │   │
│  │  Phase 3: Synthesis          │  │  "Your competitive analysis  │   │
│  │  ████████████░░ 67%          │  │   shows a pricing gap..."   │   │
│  │  [Continue Session →]        │  │  [Chat Now]                  │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ ⚡ STRATEGIC SIGNAL          │  │ 📋 RECOMMENDED ACTIVITY      │   │
│  │  Competitor launched new     │  │  Complete Customer Territory  │   │
│  │  pricing tier...             │  │  ⏱ ~25 min · 4 questions    │   │
│  │  [Review Impact]             │  │  [Start Activity]            │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🔮 Start a strategy conversation about...                    │   │
│  │    [___________________________________________________] ➤   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 12. Artefact Suite

### 12.1 Complete Inventory

| Artefact | Format | Audience | Generated When | Living? |
|----------|--------|----------|---------------|---------|
| Strategic Context Summary | Inline card → PDF | CPO | End of Discovery | No |
| Territorial Insight Summary (×3) | Inline card → PDF | CPO | After each territory | No |
| Research Evidence Summary | Report → PDF | CPO + Team | After all territories | No |
| Strategy on a Page | Interactive → PDF → Link | All | After Synthesis | Yes |
| Strategic Opportunity Map | Interactive 2×2 → PDF | CPO + VP | After Synthesis | No |
| Strategic Bets Document | Cards → PDF | CPO + VP | After Bets | No |
| Strategic Guardrails | Document → PDF → Link | All | After Bets | Yes |
| Team Briefs (per bet) | Document → PDF → Link | PM | After Activation | Yes |
| OKR Cascade | Structured → PDF | CPO + PM | After Activation | No |
| Decision Framework | Document → Link | PM | After Activation | Yes |
| Stakeholder Pack | Multi-view → PDF | Cross-functional | After Activation | No |
| Assumption Register | Dashboard → PDF | CPO | Phase 6 (ongoing) | Yes |
| Strategy Version History | Interactive diff | CPO | Auto-captured | No |

### 12.2 Living vs Static

- **Living artefacts** (auto-update via shareable links): Strategy on a Page, Guardrails, Team Briefs, Decision Framework, Assumption Register
- **Point-in-time artefacts** (PDF snapshots): Evidence Summary, Bets Document, Stakeholder Pack
- **Continuous artefacts** (always updating): Assumption Register, Strategy Version History

---

## 13. Data Model (Target)

### 13.1 New Tables Required

```sql
-- Strategic Maturity Assessment
CREATE TABLE strategic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  assessment_version INTEGER DEFAULT 1,
  responses JSONB NOT NULL,
  dimension_scores JSONB NOT NULL,
  archetype TEXT NOT NULL,  -- 'operator' | 'visionary' | 'analyst' | 'diplomat'
  strength_dimension TEXT,
  growth_dimension TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  reassessed_at TIMESTAMPTZ
);

-- Trackable assumptions
CREATE TABLE assumption_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  assumption_text TEXT NOT NULL,
  source_type TEXT,       -- 'wwhbt' | 'synthesis' | 'bet' | 'manual'
  source_id TEXT,
  status TEXT DEFAULT 'untested',
  confidence TEXT DEFAULT 'medium',
  evidence TEXT,
  test_method TEXT,
  review_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated artefacts
CREATE TABLE strategic_artefacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  artefact_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  audience TEXT,
  linked_bet_id TEXT,
  share_token TEXT UNIQUE,
  is_living BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market signals
CREATE TABLE strategy_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  strategic_impact TEXT,
  affected_assumptions UUID[],
  affected_bets TEXT[],
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategy version snapshots
CREATE TABLE strategy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  trigger TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 13.2 Extended framework_state (v3)

```json
{
  "version": 3,
  "currentPhase": "discovery|research|synthesis|bets|activation|review",
  "highestPhaseReached": "...",
  "archetype": "operator|visionary|analyst|diplomat",
  "archetypeScores": { "vision": 72, "rigour": 85, "execution": 91, "alignment": 65, "adaptive": 48 },
  "microSynthesisResults": {
    "company": { "generated": true, "summary": "...", "keyFindings": [] },
    "customer": { "generated": false },
    "competitor": { "generated": false }
  },
  "strategyOnAPage": { "generated": true, "version": 2 },
  "activationOutputs": {
    "teamBriefs": [],
    "guardrails": [],
    "okrCascade": [],
    "decisionFramework": { "generated": true }
  },
  "reviewCadence": {
    "lastReview": "2026-03-15",
    "nextReview": "2026-04-15",
    "reviewsCompleted": 2
  },
  "gamification": {
    "xp": 850,
    "level": 4,
    "achievements": ["first_steps", "territory_pioneer"]
  }
}
```

---

## 14. Success Metrics

### 14.1 Primary Outcomes

| Metric | MVP1 Baseline | MVP2 Target | Measurement |
|--------|--------------|-------------|-------------|
| Time to first strategic insight | ~2.5 hours | < 30 minutes | Time to first micro-synthesis |
| Research phase completion rate | Suspected < 40% | > 70% | `territory_insights` with status='mapped' |
| Strategy-to-execution artefacts | 0 team briefs | 3+ per strategy | `strategic_artefacts` count |
| 30-day return engagement | One-time use | 4+ sessions/month | Session frequency |
| Cross-functional reach | 1 user | 3+ stakeholders | Shared link views |

### 14.2 Leading Indicators

| Metric | Target |
|--------|--------|
| Discovery completion | < 15 minutes |
| Research session length | 25–40 min per territory |
| Micro-synthesis engagement | > 80% review territorial insights |
| Debate Mode participation | > 50% of users with tensions |
| Team Brief generation | > 60% of strategies produce briefs |
| Signal logging | Monthly entries from > 40% of users |

---

# PART 2: Current State & Architectural Context

---

## 15. What's Working in MVP1 (Post 9-Fix)

After the 9-fix stabilisation work (commit `29e1bbd`), MVP1 at `/dashboard/product-strategy-agent` is **stable and functional**:

### 15.1 Stable Components

| Component | Status | Location |
|-----------|--------|----------|
| **CoachingPanel** | Stable — streaming, abort, persona selection, research context | `src/components/product-strategy-agent/CoachingPanel/` |
| **CanvasPanel** | Stable — phase routing, progress stepper, swipe gestures | `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` |
| **DiscoverySection** | Stable — file upload, AI research, progress checklist, phase transition | `src/components/product-strategy-agent/CanvasPanel/DiscoverySection.tsx` |
| **ResearchSection** | Stable — 3 territory cards, deep-dive navigation, question forms | `src/components/product-strategy-agent/CanvasPanel/ResearchSection.tsx` |
| **Territory Deep-Dives** | Stable — Company, Customer, Competitor with sidebar navigation | `src/components/product-strategy-agent/CanvasPanel/*TerritoryDeepDive.tsx` |
| **SynthesisSection** | Stable — PTW generation, opportunity map, tensions, evidence trails | `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx` |
| **BetsSection** | Stable — thesis groups, bet cards, creation modal, validation, debate | `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx` |
| **PDF Exports** | Stable — synthesis and bets PDFs via PDFKit | `src/app/api/product-strategy-agent/synthesis/export/` and `bets/export/` |
| **Research Questions** | Stable — single source of truth, 36 questions, 9 areas | `src/lib/agents/strategy-coach/research-questions.ts` |
| **Framework State** | Stable — phase tracking, research progress from territory_insights | `src/lib/agents/strategy-coach/framework-state.ts` |
| **System Prompt** | Stable — dynamic, phase-aware, research context injection | `src/lib/agents/strategy-coach/system-prompt.ts` |

### 15.2 Stable API Routes

| Route | Methods | Status |
|-------|---------|--------|
| `/api/conversations/` | GET, POST | Stable |
| `/api/conversations/[id]/messages` | GET, POST (streaming) | Stable |
| `/api/product-strategy-agent/upload` | POST | Stable |
| `/api/product-strategy-agent/ai-research` | POST | Stable |
| `/api/product-strategy-agent/materials` | GET, DELETE | Stable |
| `/api/product-strategy-agent/territories` | GET, POST | Stable |
| `/api/product-strategy-agent/synthesis` | GET, POST | Stable |
| `/api/product-strategy-agent/synthesis/export` | POST | Stable |
| `/api/product-strategy-agent/bets` | GET, POST, PATCH, DELETE | Stable |
| `/api/product-strategy-agent/bets/generate` | POST | Stable |
| `/api/product-strategy-agent/bets/validate` | POST | Stable |
| `/api/product-strategy-agent/bets/export` | POST | Stable |
| `/api/product-strategy-agent/bets/theses` | GET, POST, PATCH, DELETE | Stable |
| `/api/product-strategy-agent/phase` | GET, POST | Stable |
| `/api/product-strategy-agent/client-context` | GET, PATCH | Stable |
| `/api/product-strategy-agent/persona` | GET, PATCH | Stable |

### 15.3 Stable Shared Libraries

| Library | Status | Key Exports |
|---------|--------|-------------|
| `src/lib/agents/strategy-coach/` | Stable | `streamMessage`, `sendMessage`, framework state management, system prompt, research questions, personas |
| `src/lib/synthesis/` | Stable | `parseClaudeSynthesisResponse`, `matchEvidenceToInsights` |
| `src/lib/knowledge/` | Stable | Case studies, expert knowledge, tension mapping |
| `src/lib/assessment/` | Partially built | Questions and scoring logic exist |
| `src/lib/gamification/` | Partially built | XP rules, achievements, levels defined |
| `src/types/database.ts` | Stable | All Supabase schema types |

---

## 16. What's Broken or Dormant in V2 Codebase

A complete parallel component tree exists at `src/components/product-strategy-agent-v2/` with ~40+ files. This V2 codebase was the original target for the redesign but has **critical issues**:

### 16.1 V2-Specific Components (Dormant)

| Directory | Contents | Status |
|-----------|----------|--------|
| `Assessment/` | AssessmentFlow, AssessmentResults, LikertQuestion, SituationalChoice | Built but untested in production |
| `LeftSidebar/` | LeftSidebar, PhaseIndicator, TerritoryNav, XPBar, CoachProfile, AchievementBadges | Built but layout broken |
| `ContextPanel/` | Right-side context panel with activation outputs | Partially built |
| `LiveCanvas/` | LiveCanvas, SynthesisCanvasView, BetsCanvasView | Built but data flow issues |
| `StrategyHome/` | Home dashboard with progress cards, signals | Built but API mismatches |
| `CoachingCentre/cards/` | ArtefactEvolutionCard, DebateInvitationCard, MicroSynthesisCard, ResearchPromptCard, SignalAlertCard, InlineActionCard | Built but not integrated |

### 16.2 V2 Pages (Live but Unreliable)

| Page | Path | Issue |
|------|------|-------|
| `product-strategy-agent-v2/page.tsx` | `/dashboard/product-strategy-agent-v2` | Import errors, layout breaks |
| `product-strategy-agent-v2/home/page.tsx` | `/dashboard/product-strategy-agent-v2/home` | API mismatches |
| `product-strategy-agent-v2/assessment/page.tsx` | `/dashboard/product-strategy-agent-v2/assessment` | Works in isolation |

### 16.3 Key V2 Insight

V2 shares the **same API routes and data layer** as MVP1 — same `strategy_coach` conversations, same territory insights, same bets tables. V2 is a **UI redesign/expansion**, not a separate backend. The V2 code can be referenced for design patterns but should **not be imported directly** into MVP1.

---

## 17. Root Causes Identified & Resolved

The 9-fix stabilisation work identified and resolved 10 systemic root causes that inform the migration approach:

### 17.1 The 10 Root Causes

| # | Root Cause | Impact | Resolution |
|---|-----------|--------|------------|
| 1 | **Inconsistent research IDs** | Territory deep-dives used wrong area IDs, causing data loss | Unified all IDs to match `research-questions.ts` single source of truth |
| 2 | **Dead framework_state fields** | `researchPillars` and `canvasProgress` were legacy, not driven by UI | Added `calculateResearchProgressFromInsights` to derive progress from `territory_insights` table directly |
| 3 | **Phase transition fragility** | Phase API was "TEMPORARY for MVP testing" with insufficient validation | Hardened phase validation, ensured `highestPhaseReached` tracks correctly |
| 4 | **V2 import contamination** | Importing V2 components into MVP1 caused cascading errors | Strict rule: never cross-import between MVP1 and V2 component trees |
| 5 | **SSR hydration mismatches** | `useMediaQuery` used `window.matchMedia` on server | Reverted to `useState(false)` for SSR safety |
| 6 | **Missing error boundaries** | React error #130 crashed entire page | Added `AgentErrorBoundary` wrapper |
| 7 | **Stale state on conversation load** | `framework_state` in DB out of sync with UI state | Added state reconciliation on conversation fetch |
| 8 | **System prompt bloat** | Prompt grew too large with all context injected simultaneously | Added phase-aware context filtering — only load relevant data |
| 9 | **Research context threading** | `activeResearchContext` not properly passed between panels | Added bidirectional context prop through `ProductStrategyAgentInterface` |
| 10 | **QuestionCard 500 errors** | API route failed silently on malformed requests | Added detailed error logging and input validation |

### 17.2 Lessons for Migration

These root causes inform three critical migration principles:

1. **Single source of truth**: Always derive state from the database, never from parallel in-memory models
2. **Incremental, not big-bang**: Each phase must be independently deployable and testable
3. **Never import V2 directly**: Rebuild features fresh in the MVP1 codebase, referencing V2 for design inspiration only

---

## 18. Key Architectural Decision: Rebuild, Don't Import V2

### 18.1 Why Not Just Switch to V2?

The V2 codebase (`src/components/product-strategy-agent-v2/`) was built as a parallel tree before MVP1 was stabilised. It has:

- **Broken import chains** — references components that don't exist or have different APIs
- **Layout assumptions** — built for a 3-panel layout that doesn't match the current stable 2-panel
- **Untested data flow** — V2 components assume API responses in formats that don't match current routes
- **No error boundaries** — doesn't include the stability fixes from the 9-fix work

### 18.2 The Migration Strategy

Instead of switching to V2, we **incrementally evolve MVP1** toward the MVP2 target:

```
MVP1 (Stable)  ──▶  Add Card System  ──▶  Add QuestionCards  ──▶  Add Review
     │                                                                │
     │              ──▶  Add Micro-Synthesis  ──▶  Add Assessment     │
     │                                                                │
     └──▶  Evolve Layout  ──▶  Add Strategy Home  ──▶  Add Activation ──▶  MVP2
```

**At each phase:**
1. MVP1 remains functional — no breaking changes
2. New features are added to the existing component tree
3. V2 code is referenced for design patterns and specifications
4. Each phase is independently testable and deployable

### 18.3 What We Take from V2

| Take | Don't Take |
|------|-----------|
| Card type definitions and designs | Component implementations |
| Assessment question bank and scoring logic | Assessment UI components |
| XP/achievement/level definitions | Gamification UI components |
| Layout specifications and wireframes | Layout component implementations |
| Strategy Home card type definitions | Strategy Home page implementations |
| Activation artefact prompts | Activation UI components |

---

# PART 3: Incremental Migration Plan (13 Phases)

---

## 19. Migration Philosophy

### 19.1 Principles

1. **MVP1 never breaks** — every phase leaves the production app functional
2. **Each phase is deployable** — can ship after any phase and have a better product
3. **Database first, UI second** — ensure data model supports features before building UI
4. **Shared library, separate UI** — the `src/lib/` layer is shared; components are rebuilt
5. **Test at each boundary** — unit tests for lib, integration tests for API routes, manual QA for UI

### 19.2 Scope Estimates

| Effort | Meaning |
|--------|---------|
| **S** (Small) | 1–2 days, few files |
| **M** (Medium) | 3–5 days, moderate complexity |
| **L** (Large) | 1–2 weeks, significant feature |
| **XL** (Extra Large) | 2–3 weeks, major feature area |

---

## 20. Phase Dependency Graph

```
Phase 0: Foundation Hardening
    │
    ├──▶ Phase 1: Card System Foundation
    │        │
    │        ├──▶ Phase 2: QuestionCard Research Flow
    │        │        │
    │        │        └──▶ Phase 3: Coach Review System
    │        │
    │        └──▶ Phase 4: Micro-Synthesis & Journey Energy
    │
    ├──▶ Phase 5: Strategic Assessment (independent of cards)
    │        │
    │        └──▶ Phase 6: Coaching Enhancements (needs assessment)
    │
    ├──▶ Phase 7: Layout Evolution (can start after Phase 2)
    │        │
    │        └──▶ Phase 8: Strategy Home (needs layout + assessment)
    │
    ├──▶ Phase 9: Activation Artefacts (needs Phase 4 + existing bets)
    │        │
    │        └──▶ Phase 10: Living Strategy (needs activation)
    │
    ├──▶ Phase 11: Gamification (independent, can start anytime after Phase 0)
    │
    └──▶ Phase 12: Aesthetic Polish (final pass, after all features)
```

**Critical path:** 0 → 1 → 2 → 3 (Card system must be solid before QuestionCards, which must work before Coach Review)

**Parallelisable:** Phase 5 (Assessment) can run in parallel with Phases 1–4. Phase 11 (Gamification) is independent.

---

## 21. Phase 0: Foundation Hardening

**Scope:** S (1–2 days)
**Dependencies:** None
**Goal:** Ensure MVP1 is rock-solid before adding features.

### 21.1 Tasks

| Task | Files | Description |
|------|-------|-------------|
| Verify all 285 tests pass | `npm run test` | Run full test suite, fix any failures |
| Verify production build | `npm run build` | Ensure zero build errors |
| Audit error boundaries | `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx` | Confirm `AgentErrorBoundary` catches all component errors |
| Verify research ID consistency | `src/lib/agents/strategy-coach/research-questions.ts` | Confirm all 36 questions have correct area IDs matching territory deep-dives |
| Verify framework_state hydration | `src/lib/agents/strategy-coach/framework-state.ts` | Confirm `calculateResearchProgressFromInsights` works for all edge cases |
| Add TypeScript strict checks | `tsconfig.json` | Verify `strict: true` is enabled, fix any new errors |

### 21.2 Verification

- [ ] `npm run test` — all 285 tests pass
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] Manual: complete Discovery → Research → Synthesis → Bets flow end-to-end
- [ ] Manual: verify territory deep-dive saves persist correctly

---

## 22. Phase 1: Card System Foundation

**Scope:** M (3–5 days)
**Dependencies:** Phase 0
**Goal:** Establish the card parser, type definitions, and base card components in the MVP1 component tree.

### 22.1 Files to Create

| File | Description |
|------|-------------|
| `src/types/coaching-cards.ts` | TypeScript interfaces for all card types (ExplanationCard, RequestCard, DebateCard, WhatsNextCard) |
| `src/lib/utils/card-parser.ts` | Parse `[CARD:type]...[/CARD]` markers from AI message content, return `{ cleanContent, cards[] }` |
| `src/components/product-strategy-agent/CoachingPanel/cards/CardRenderer.tsx` | Type dispatcher — receives `ParsedCard`, renders appropriate card component |
| `src/components/product-strategy-agent/CoachingPanel/cards/ExplanationCard.tsx` | Phase/section introduction card (cyan theme) |
| `src/components/product-strategy-agent/CoachingPanel/cards/RequestCard.tsx` | Action prompt card (amber for required, cyan for optional) |
| `src/components/product-strategy-agent/CoachingPanel/cards/DebateCard.tsx` | Two-perspective strategic tension card |
| `src/components/product-strategy-agent/CoachingPanel/cards/WhatsNextCard.tsx` | Sticky progress tracker card |
| `src/components/product-strategy-agent/CoachingPanel/cards/index.ts` | Barrel exports |
| `src/hooks/useWhatsNextProgress.ts` | Calculate progress checklist from context-awareness data |

### 22.2 Files to Modify

| File | Changes |
|------|---------|
| `src/components/product-strategy-agent/CoachingPanel/Message.tsx` | Parse message content through `card-parser.ts`, render cards via `CardRenderer` |
| `src/components/product-strategy-agent/CoachingPanel/MessageStream.tsx` | Handle card action callbacks (e.g., "Upload Materials" click) |
| `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx` | Add sticky WhatsNextCard positioned below message scroll, above input |
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add card generation instructions: when to emit each card type, marker format |

### 22.3 System Prompt Additions

Add to the system prompt instructions for emitting card markers:

```
CARD GENERATION RULES:
- Emit [CARD:explanation] at phase transitions and when introducing new concepts
- Emit [CARD:request] when a user action is needed (document upload, territory mapping)
- Emit [CARD:debate] when identifying strategic tensions with two valid perspectives
- Never emit more than 1 card per message
- Card JSON must be valid — if unsure, use plain text instead
```

### 22.4 Verification

- [ ] Unit tests for `card-parser.ts` — parses all card types, handles malformed input gracefully
- [ ] ExplanationCard renders with cyan theme, optional phase diagram, optional CTA
- [ ] RequestCard renders with amber (required) or cyan (optional) theme, progress bar
- [ ] DebateCard renders two perspectives with selection buttons
- [ ] WhatsNextCard renders sticky above input, updates in real-time
- [ ] Cards appear correctly in streaming messages (no flicker during stream)
- [ ] Malformed card markers fall back to plain text display

---

## 23. Phase 2: QuestionCard Research Flow

**Scope:** L (1–2 weeks)
**Dependencies:** Phase 1
**Goal:** Replace the canvas-only textarea research with coach-driven QuestionCards in the chat, one question at a time.

### 23.1 Files to Create

| File | Description |
|------|-------------|
| `src/components/product-strategy-agent/CoachingPanel/cards/QuestionCard.tsx` | Interactive form card: question text, textarea, confidence selector, "Ask Coach" button, "Review Draft" button, "Submit Answer" gold button |
| `src/components/product-strategy-agent/CoachingPanel/cards/AnsweredCard.tsx` | Collapsed submitted answer: checkmark, truncated preview, confidence badge, "Edit Answer" link |
| `src/hooks/useQuestionCardState.ts` | Manage active question, draft answers, saving state, territory progress |

### 23.2 Files to Modify

| File | Changes |
|------|---------|
| `src/types/coaching-cards.ts` | Add `QuestionCardData` and `AnsweredCardData` interfaces |
| `src/lib/utils/card-parser.ts` | Add `'question'` type parsing |
| `src/components/product-strategy-agent/CoachingPanel/cards/CardRenderer.tsx` | Add QuestionCard and AnsweredCard rendering |
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add QuestionCard emission rules — one question at a time, territory/area/index metadata |
| `src/app/api/product-strategy-agent/territories/route.ts` | Ensure POST handles single-question saves (partial territory updates) |

### 23.3 QuestionCard UX Flow

1. Coach sends ExplanationCard introducing research area ("Company Foundation, 3 questions")
2. Coach sends QuestionCard #1 (active, expanded)
3. User types answer in textarea
4. User optionally sets confidence (Data / Experience / Guess)
5. User optionally clicks "Ask Coach for Suggestion"
6. User clicks "Submit Answer" (gold button)
7. QuestionCard #1 collapses into AnsweredCard
8. Coach sends acknowledgment + QuestionCard #2
9. Repeat for all questions in area
10. When area complete → Coach sends summary + WhatsNextCard updates

### 23.4 Data Flow

```
QuestionCard submit
  → POST /api/product-strategy-agent/territories
    → Upsert territory_insights row (partial — single question in responses JSONB)
    → Return updated territory status
  → Update WhatsNextCard progress
  → Coach receives confirmation via next message context
```

### 23.5 Backward Compatibility

The canvas-panel ResearchSection and territory deep-dives remain functional. Users can still use the canvas to view and edit their research. The QuestionCard system writes to the same `territory_insights` table, so data flows both directions.

### 23.6 Verification

- [ ] QuestionCard renders with textarea, confidence selector, submit button
- [ ] Submitting saves to `territory_insights` with correct territory/area/question
- [ ] AnsweredCard shows collapsed preview, can expand to edit
- [ ] WhatsNextCard updates progress after each submission
- [ ] Coach correctly emits one question at a time in sequence
- [ ] Canvas deep-dives reflect answers submitted via QuestionCards
- [ ] QuestionCards reflect answers entered via canvas deep-dives

---

## 24. Phase 3: Coach Review System

**Scope:** M (3–5 days)
**Dependencies:** Phase 2
**Goal:** Add "Review My Draft Answer" capability to QuestionCards with structured coach feedback.

### 24.1 Files to Create

| File | Description |
|------|-------------|
| `src/components/product-strategy-agent/CoachingPanel/cards/CoachReviewPanel.tsx` | Structured review: Challenges, Enhancement Ideas, Resources. "Apply Suggestions" / "Continue" buttons |
| `src/components/product-strategy-agent/CoachingPanel/cards/ResourceCard.tsx` | Display linked resource (podcast, article, book, framework) |
| `src/app/api/product-strategy-agent/coach-review/route.ts` | POST — takes draft answer + question context, calls Claude for structured review |
| `src/lib/resources/product-leaders.ts` | Curated frameworks and thought leaders list |

### 24.2 Files to Modify

| File | Changes |
|------|---------|
| `src/components/product-strategy-agent/CoachingPanel/cards/QuestionCard.tsx` | Add "Review My Draft" button, toggle CoachReviewPanel visibility |
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add review prompt template — structured challenges, ideas, resources |

### 24.3 Review API Specification

```typescript
// POST /api/product-strategy-agent/coach-review
// Request:
{
  conversation_id: string;
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  question_index: number;
  question_text: string;
  draft_answer: string;
  confidence: 'data' | 'experience' | 'guess';
}

// Response:
{
  challenges: string[];
  enhancement_ideas: string[];
  resources: Array<{
    type: 'podcast' | 'book' | 'article' | 'framework';
    title: string;
    author?: string;
    source: string;
    relevance: string;
  }>;
  suggested_revision?: string;
}
```

### 24.4 Verification

- [ ] "Review My Draft" button appears on QuestionCard when text is entered
- [ ] CoachReviewPanel shows challenges, ideas, and resources
- [ ] "Apply Suggestions" updates the textarea with suggested revision
- [ ] "Continue Without Changes" dismisses the review panel
- [ ] Resources display with correct formatting and icons
- [ ] Review works during streaming (doesn't break message flow)

---

## 25. Phase 4: Micro-Synthesis & Journey Energy

**Scope:** M (3–5 days)
**Dependencies:** Phase 1 (card system)
**Goal:** Break the 2.5-hour silence — deliver strategic insights after each territory completion.

### 25.1 Files to Create

| File | Description |
|------|-------------|
| `src/app/api/product-strategy-agent/micro-synthesis/route.ts` | POST — generates 3 key findings from one territory's responses |
| `src/components/product-strategy-agent/CanvasPanel/TerritorialInsightSummary.tsx` | Card showing 3 key findings, confidence level, "Continue" CTA |

### 25.2 Files to Modify

| File | Changes |
|------|---------|
| `src/lib/agents/strategy-coach/micro-synthesis-prompt.ts` | Already exists — verify prompt quality, add confidence aggregation |
| `src/lib/agents/strategy-coach/framework-state.ts` | Ensure `microSynthesisResults` field is properly typed and updated |
| `src/components/product-strategy-agent/CanvasPanel/ResearchSection.tsx` | Display TerritorialInsightSummary after territory completion |
| `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx` | Coach delivers micro-synthesis inline when territory completes |

### 25.3 Micro-Synthesis Trigger

When all 3 research areas in a territory are marked `mapped` (via canvas deep-dive) or have all questions answered (via QuestionCards):

1. Auto-call `POST /api/product-strategy-agent/micro-synthesis` with `{ conversation_id, territory }`
2. Claude generates 3 key findings + confidence level + strategic implications
3. Store in `conversations.framework_state.microSynthesisResults.{territory}`
4. Display as TerritorialInsightSummary in canvas + inline card in chat

### 25.4 Verification

- [ ] Micro-synthesis triggers automatically when territory is fully mapped
- [ ] 3 key findings are relevant and evidence-based
- [ ] Insight summary appears in both canvas and chat
- [ ] `framework_state.microSynthesisResults` is correctly updated
- [ ] User receives strategic value within ~25 minutes (not 2.5 hours)

---

## 26. Phase 5: Strategic Assessment

**Scope:** L (1–2 weeks)
**Dependencies:** Phase 0 (independent of card system)
**Goal:** Implement the Strategic Maturity Assessment to personalise coaching.

### 26.1 Database Migration

```sql
CREATE TABLE strategic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  assessment_version INTEGER DEFAULT 1,
  responses JSONB NOT NULL,
  dimension_scores JSONB NOT NULL,
  archetype TEXT NOT NULL,
  strength_dimension TEXT,
  growth_dimension TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  reassessed_at TIMESTAMPTZ
);
```

### 26.2 Files to Create/Modify

| File | Description |
|------|-------------|
| `src/app/dashboard/product-strategy-agent/assessment/page.tsx` | Assessment page — Likert questions + situational choices |
| `src/components/product-strategy-agent/Assessment/AssessmentFlow.tsx` | Step-through assessment UI with progress bar |
| `src/components/product-strategy-agent/Assessment/LikertQuestion.tsx` | 5-point scale question component |
| `src/components/product-strategy-agent/Assessment/SituationalChoice.tsx` | Multi-choice scenario component |
| `src/components/product-strategy-agent/Assessment/AssessmentResults.tsx` | Archetype reveal card with scores |
| `src/app/api/product-strategy-agent/assessment/route.ts` | POST to save, GET to retrieve assessment |
| `src/lib/assessment/scoring.ts` | Already exists — verify classification algorithm |
| `src/lib/assessment/questions.ts` | Already exists — verify 23 questions are correct |

### 26.3 Files to Modify

| File | Changes |
|------|---------|
| `src/lib/agents/strategy-coach/system-prompt.ts` | Inject archetype into system prompt when available |
| `src/lib/agents/strategy-coach/framework-state.ts` | Add `archetype` and `archetypeScores` to framework_state |
| `src/app/dashboard/product-strategy-agent/page.tsx` | Check for assessment, redirect if needed (or show "Assess" CTA) |

### 26.4 Assessment is Optional

Critical: Assessment must be skippable. The "Assess Later" option is always available. If skipped:
- Coach uses a "balanced" default coaching style
- Assessment CTA appears on Strategy Home
- No archetype-specific adaptations until assessment is completed

### 26.5 Verification

- [ ] 23 questions render correctly with progress bar
- [ ] Scoring produces one of 4 archetypes (Operator, Visionary, Analyst, Diplomat)
- [ ] Results page shows archetype card, strength/growth scores
- [ ] Archetype is injected into system prompt
- [ ] "Assess Later" option works — coaching proceeds without assessment
- [ ] Coach style visibly adapts based on archetype (test all 4)

---

## 27. Phase 6: Coaching Enhancements

**Scope:** M (3–5 days)
**Dependencies:** Phase 5 (needs archetype)
**Goal:** Deepen AI coaching quality with proactive, adaptive, and challenging behaviours.

### 27.1 System Prompt Enhancements

All changes in `src/lib/agents/strategy-coach/system-prompt.ts`:

| Enhancement | Description |
|-------------|-------------|
| **Blind Spot Detection** | Track research coverage; flag gaps: "I notice you haven't mentioned retention..." |
| **Challenge Escalation** | Discovery: gentle → Research: medium → Bets: demanding. Phase-specific intensity |
| **Methodology Hints** | "Try: 5 customer interviews, win/loss analysis, competitor feature comparison" |
| **"So What?" Forcing** | Post-synthesis: "Of these opportunities, which one scares you the most?" |
| **Archetype Adaptation** | Operators → "zoom out"; Visionaries → "ground it"; Analysts → "decide"; Diplomats → "commit" |
| **Post-Phase Reflection** | After each phase: "What surprised you? What assumption changed?" |

### 27.2 Files to Modify

| File | Changes |
|------|---------|
| `src/lib/agents/strategy-coach/system-prompt.ts` | All 6 enhancements above — phase-aware prompt sections |
| `src/lib/agents/strategy-coach/re-engagement.ts` | Already exists — verify re-engagement logic triggers correctly |
| `src/lib/agents/strategy-coach/personas/` | Ensure 6 personas align with archetype coaching adaptations |

### 27.3 Verification

- [ ] Coach identifies blind spots in research coverage
- [ ] Challenge intensity visibly increases Discovery → Research → Bets
- [ ] Methodology hints appear during research questions
- [ ] "So What?" moment occurs after synthesis presentation
- [ ] Archetype-specific coaching is perceptibly different across all 4 types
- [ ] Post-phase reflection prompts appear at each transition

---

## 28. Phase 7: Layout Evolution

**Scope:** XL (2–3 weeks)
**Dependencies:** Phase 2 (QuestionCards working in current layout)
**Goal:** Evolve from 25/75 coach/canvas to 60/40 coaching-centre/context-panel.

### 28.1 Approach: Gradual, Not Big-Bang

Rather than replacing the entire layout at once, evolve incrementally:

**Step 1:** Make coach panel resizable (25% → user can drag to 60%)
**Step 2:** Add context panel mode to canvas (canvas becomes supporting)
**Step 3:** Default to 60/40 for new users, offer "Classic View" toggle

### 28.2 Files to Create

| File | Description |
|------|-------------|
| `src/components/product-strategy-agent/ContextPanel/ContextPanel.tsx` | 40% width wrapper — phase-aware tab navigation, collapsible, expandable, pinnable |
| `src/components/product-strategy-agent/ContextPanel/useContextPanelState.ts` | Hook for panel state, auto-switching based on coaching topic |
| `src/components/product-strategy-agent/StrategyHeader.tsx` | New header with phase indicator, strategy health badge, settings |

### 28.3 Files to Modify

| File | Changes |
|------|---------|
| `src/components/product-strategy-agent/ProductStrategyAgentInterface.tsx` | New layout shell: 60/40 split, resizable divider, responsive breakpoints |
| `src/components/product-strategy-agent/CoachingPanel/CoachingPanel.tsx` | Expand from sidebar to coaching centre (full-height, 60% width) |
| `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` | Transform into context panel content provider |
| All CanvasPanel section components | Adapt to narrower 40% width, supporting role |

### 28.4 Responsive Breakpoints

| Viewport | Coaching Centre | Context Panel |
|----------|----------------|---------------|
| Desktop (1280px+) | 60% | 40% |
| Tablet (768–1279px) | 65% | 35% |
| Mobile (< 768px) | 100% | Overlay (slide from right) |

### 28.5 Verification

- [ ] 60/40 layout renders correctly on desktop
- [ ] Context panel updates based on coaching conversation topic
- [ ] Context panel is collapsible, expandable, pinnable
- [ ] Responsive breakpoints work correctly
- [ ] All existing canvas functionality works in 40% width
- [ ] "Classic View" toggle reverts to 25/75 layout
- [ ] No regression in QuestionCard or card system functionality

---

## 29. Phase 8: Strategy Home

**Scope:** L (1–2 weeks)
**Dependencies:** Phase 7 (layout) + Phase 5 (assessment)
**Goal:** Replace generic dashboard entry with personalised Strategy Home.

### 29.1 Files to Create

| File | Description |
|------|-------------|
| `src/app/dashboard/product-strategy-agent/home/page.tsx` | Strategy Home page — server component |
| `src/components/product-strategy-agent/StrategyHome/ProgressCard.tsx` | Phase, percentage, territory count |
| `src/components/product-strategy-agent/StrategyHome/CoachingTopicCard.tsx` | AI-generated daily coaching topic |
| `src/components/product-strategy-agent/StrategyHome/SignalCard.tsx` | Latest market signal (placeholder until Phase 10) |
| `src/components/product-strategy-agent/StrategyHome/ActivityCard.tsx` | Recommended activity with time estimate |
| `src/components/product-strategy-agent/StrategyHome/ReviewCard.tsx` | Upcoming review (placeholder until Phase 10) |
| `src/components/product-strategy-agent/StrategyHome/CoachEntryBar.tsx` | "Start a conversation about..." input |
| `src/app/api/product-strategy-agent/home/route.ts` | Aggregated home data: conversation state, assessment, progress |

### 29.2 Files to Modify

| File | Changes |
|------|---------|
| `src/app/dashboard/product-strategy-agent/page.tsx` | Route to Strategy Home (or direct to coaching if active session) |

### 29.3 Verification

- [ ] Strategy Home shows personalised greeting
- [ ] Progress card reflects actual phase and completion
- [ ] Coaching topic adapts to archetype and current phase
- [ ] "Continue Session" links to active coaching session
- [ ] Coach entry bar opens coaching centre with context
- [ ] Responsive layout works on all breakpoints

---

## 30. Phase 9: Activation Artefacts (Phase 5 of Journey)

**Scope:** XL (2–3 weeks)
**Dependencies:** Phase 4 (micro-synthesis) + existing bets implementation
**Goal:** Build the strategy-to-execution bridge with team briefs, OKRs, guardrails, and stakeholder packs.

### 30.1 Database Migration

```sql
CREATE TABLE strategic_artefacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  artefact_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  audience TEXT,
  linked_bet_id TEXT,
  share_token TEXT UNIQUE,
  is_living BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 30.2 Files to Create

| File | Description |
|------|-------------|
| `src/app/api/product-strategy-agent/activation/route.ts` | CRUD for artefacts (team briefs, guardrails, OKRs, decision frameworks) |
| `src/app/api/product-strategy-agent/activation/generate/route.ts` | POST — Claude generates artefact from synthesis + bets data |
| `src/app/api/product-strategy-agent/activation/export/route.ts` | PDF export via PDFKit |
| `src/components/product-strategy-agent/CanvasPanel/ActivationSection.tsx` | Phase 5 UI — tabs for Team Briefs, OKRs, Guardrails, Stakeholder Packs |
| `src/components/product-strategy-agent/CanvasPanel/TeamBriefCard.tsx` | Individual team brief display |
| `src/components/product-strategy-agent/CanvasPanel/OKRCard.tsx` | OKR cascade display |
| `src/components/product-strategy-agent/CanvasPanel/GuardrailsCard.tsx` | "We will / We will not" display |
| `src/components/product-strategy-agent/CanvasPanel/StakeholderPackView.tsx` | Audience-specific views |

### 30.3 Prompt Files (Already Exist)

These prompts already exist in `src/lib/agents/strategy-coach/` and need verification:

| File | Purpose |
|------|---------|
| `team-brief-prompt.ts` | Team brief generation from bet data |
| `okr-prompt.ts` | OKR cascade generation |
| `decision-framework-prompt.ts` | Decision framework generation |
| `guardrails-prompt.ts` | Strategic guardrails generation |
| `stakeholder-pack-prompt.ts` | Stakeholder communication pack |

### 30.4 Phase Transition

Add `'activation'` to the phase progression:
- Phase API must support `bets → activation` transition
- Require: 1+ thesis, 3+ bets with kill criteria (existing quality gate)
- Update `HorizontalProgressStepper` to show 5 phases (Discovery, Research, Synthesis, Bets, Activation)

### 30.5 Verification

- [ ] Team briefs generate correctly from bet data
- [ ] OKR cascades link to bets and research evidence
- [ ] Guardrails derive from synthesis tensions
- [ ] Stakeholder pack renders audience-specific views
- [ ] PDF export works for all artefact types
- [ ] Phase 5 accessible from stepper after bets quality gate
- [ ] Artefacts persist in `strategic_artefacts` table

---

## 31. Phase 10: Living Strategy (Phase 6 of Journey)

**Scope:** XL (2–3 weeks)
**Dependencies:** Phase 9 (activation artefacts)
**Goal:** Make strategy adaptive with assumption tracking, signal logging, versioning, and review cadences.

### 31.1 Database Migrations

```sql
CREATE TABLE assumption_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  assumption_text TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  status TEXT DEFAULT 'untested',
  confidence TEXT DEFAULT 'medium',
  evidence TEXT,
  test_method TEXT,
  review_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategy_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  strategic_impact TEXT,
  affected_assumptions UUID[],
  affected_bets TEXT[],
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE strategy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  trigger TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 31.2 Files to Create

| File | Description |
|------|-------------|
| `src/app/api/product-strategy-agent/assumptions/route.ts` | CRUD for assumption register |
| `src/app/api/product-strategy-agent/signals/route.ts` | CRUD for strategy signals |
| `src/app/api/product-strategy-agent/versions/route.ts` | GET versions, POST snapshot |
| `src/components/product-strategy-agent/CanvasPanel/ReviewSection.tsx` | Phase 6 UI — assumption tracker, signal log, version history |
| `src/components/product-strategy-agent/CanvasPanel/AssumptionTracker.tsx` | Dashboard: validated/invalidated/untested with evidence |
| `src/components/product-strategy-agent/CanvasPanel/SignalLog.tsx` | Signal entry form + signal list |
| `src/components/product-strategy-agent/CanvasPanel/StrategyDiff.tsx` | Version comparison view |

### 31.3 Auto-Population

When synthesis is generated, automatically extract WWHBT assumptions into `assumption_register`:
- Parse `assumptions` field from each synthesis opportunity
- Create one `assumption_register` row per assumption
- Set `source_type: 'synthesis'`, `source_id: synthesis_output_id`
- Set `review_date` based on related bet kill dates

### 31.4 Phase Transition

Add `'review'` as the final phase:
- Accessible after activation artefacts are generated
- Update stepper to show 6 phases
- Review phase is "ongoing" — no completion criteria

### 31.5 Verification

- [ ] Assumptions auto-populate from synthesis
- [ ] Signal log accepts and displays market signals
- [ ] Assumption status transitions (untested → testing → validated/invalidated)
- [ ] Version snapshots capture at phase completion
- [ ] Diff view shows changes between versions
- [ ] Review cadence prompts appear based on kill dates
- [ ] Phase 6 accessible from stepper

---

## 32. Phase 11: Gamification

**Scope:** M (3–5 days)
**Dependencies:** Phase 0 (independent — can run in parallel)
**Goal:** Add XP, levels, and achievement badges to sustain engagement.

### 32.1 Files to Create

| File | Description |
|------|-------------|
| `src/components/product-strategy-agent/Gamification/XPBar.tsx` | XP progress bar with level indicator |
| `src/components/product-strategy-agent/Gamification/AchievementBadge.tsx` | Individual badge display |
| `src/components/product-strategy-agent/Gamification/LevelUpCelebration.tsx` | Level-up animation overlay |
| `src/components/product-strategy-agent/Gamification/XPNotification.tsx` | "+50 XP" toast notification |
| `src/hooks/useGamification.ts` | Track XP, level, achievements from framework_state |

### 32.2 Files to Modify

| File | Changes |
|------|---------|
| `src/lib/gamification/xp-rules.ts` | Already exists — verify XP values are balanced |
| `src/lib/gamification/achievements.ts` | Already exists — verify achievement triggers |
| `src/lib/gamification/levels.ts` | Already exists — verify level thresholds |
| `src/lib/agents/strategy-coach/framework-state.ts` | Add `gamification` field to framework_state |
| Various action points | Trigger XP awards: territory save, synthesis generate, bet create, etc. |

### 32.3 Integration Points

XP is awarded at these action points:

| Action Point | File | XP |
|-------------|------|-----|
| Submit QuestionCard answer | `QuestionCard.tsx` → territories API | +10 |
| Complete research area | Territory deep-dive → territories API | +50 |
| Complete territory | ResearchSection progress check | +150 |
| Upload document | Upload API route | +15 |
| AI Research Assistant | AI research API route | +20 |
| Generate micro-synthesis | Micro-synthesis API route | +75 |
| Generate full synthesis | Synthesis API route | +200 |
| Create strategic bet | Bets API route | +50 |
| Add kill criteria | Bets PATCH route | +25 |

### 32.4 Verification

- [ ] XP bar displays current XP and level
- [ ] XP notifications appear on award
- [ ] Level-up celebration triggers at threshold
- [ ] Achievement badges unlock at correct triggers
- [ ] `framework_state.gamification` persists correctly
- [ ] XP values are balanced (full journey ≈ Level 5–6)

---

## 33. Phase 12: Aesthetic Polish

**Scope:** M (3–5 days)
**Dependencies:** All previous phases (final pass)
**Goal:** Elevate the UI from competent to distinctive using the Aesthetic Upgrade Plan.

### 33.1 Implementation (from MVP2_Aesthetic_Upgrade_Plan.md)

| Step | Description | Files |
|------|-------------|-------|
| **1. Typography** | Plus Jakarta Sans for headings, JetBrains Mono for data/metrics | `src/app/layout.tsx`, `CLAUDE.md` |
| **2. Backgrounds** | Subtle gradients: slate→cyan canvas, navy depth sidebar, topographic SVG pattern | `ProductStrategyAgentInterface.tsx`, sidebar |
| **3. Card Depth** | `shadow-sm hover:shadow-md`, colored top edges, subtle glows | All card components |
| **4. Entrance Animations** | Orchestrated page load: header (0ms) → sidebar (75ms) → centre (150ms) → canvas (300ms) | `globals.css`, various components |
| **5. Micro-interactions** | Ring-pulse on phase dots, spring on buttons, emerald flash on upload | Various components |
| **6. Decorative Elements** | Sidebar topographic SVG, gold accent borders, phase transition shimmer | Sidebar, header, stepper |
| **7. CLAUDE.md** | Document new standards | `CLAUDE.md` |

### 33.2 Key CSS Additions

```css
/* Entrance animations */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-entrance { animation: fadeSlideUp 0.5s ease-out forwards; opacity: 0; }
.animate-entrance-left { animation: fadeSlideLeft 0.5s ease-out forwards; opacity: 0; }
.animate-entrance-down { animation: fadeSlideDown 0.4s ease-out forwards; opacity: 0; }

/* Stagger delays */
.animate-delay-75 { animation-delay: 75ms; }
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-150 { animation-delay: 150ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }

/* Phase dot ring pulse (replaces animate-pulse) */
@keyframes ringPulse {
  0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
}
.animate-ring-pulse { animation: ringPulse 2s ease-out infinite; }
```

### 33.3 Verification

- [ ] Headings render in Plus Jakarta Sans
- [ ] Data/metrics render in JetBrains Mono
- [ ] Page load has orchestrated entrance sequence (~500ms total)
- [ ] Canvas has subtle gradient background
- [ ] Sidebar has depth gradient + topographic pattern
- [ ] Cards have shadow depth and hover effects
- [ ] Phase dots use ring-pulse instead of animate-pulse
- [ ] WCAG AA contrast maintained with new styles
- [ ] `npm run build` passes
- [ ] No TypeScript errors

---

## 34. Verification Strategy

### 34.1 Per-Phase Verification

Every phase must pass before proceeding:

1. **`npm run test`** — all existing tests pass (no regressions)
2. **`npm run build`** — zero build errors
3. **`npm run lint`** — zero new warnings
4. **Manual QA** — complete the relevant user flow end-to-end
5. **Cross-browser** — verify in Chrome and Safari minimum

### 34.2 Integration Verification (After All Phases)

| Test | Description |
|------|-------------|
| Full journey walkthrough | Discovery → Research (via QuestionCards) → Synthesis → Bets → Activation → Review |
| Layout responsiveness | Desktop, tablet, mobile breakpoints |
| Data consistency | QuestionCard answers sync with canvas deep-dives |
| Assessment → coaching | Complete assessment, verify archetype-adapted coaching |
| Micro-synthesis trigger | Complete a territory, verify insight summary appears |
| Artefact generation | Generate team brief, OKR, guardrails from bets |
| Living strategy | Log signal, track assumption, view version diff |
| Gamification | Verify XP accumulates, levels up, badges unlock |
| PDF exports | All export routes produce valid PDFs |
| Error recovery | Error boundary catches component failures |

### 34.3 Regression Guards

- **285 existing tests** must continue to pass throughout migration
- **No V2 imports** — grep for `product-strategy-agent-v2` in MVP1 component imports
- **No dead code** — each phase should not leave orphaned components
- **Database backward compatibility** — new tables don't affect existing queries

---

## Document References

| Document | Location | Purpose |
|----------|----------|---------|
| PRD v2.1 | `Background/Product_Strategy_Agent_PRD_v2.1.md` | Original MVP2 PRD — interface architecture, phase specs |
| PRD v3.0 | `Background/Product_Strategy_Coach_PRD_v3.md` | Vision PRD — 6-phase journey, assessment, activation, living strategy |
| UX Journey Research | `Background/frontera-coaching-interface-research.md` | Best practices for AI coaching interfaces |
| Card System PRD | `Background/Strategy_Coach_V2_Card_System_PRD.md` | Card types, markers, visual specs |
| QuestionCards Plan | `Background/MVP2_QuestionCards_Plan.md` | QuestionCard UX flow, review system, resource linking |
| Build Plan v3 | `Background/Product_Strategy_Coach_Build_Plan_v3.md` | Sprint-level build plan with file specifics |
| Aesthetic Upgrade | `Background/MVP2_Aesthetic_Upgrade_Plan.md` | Typography, animations, visual polish |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 27, 2026 | Derek Smith | Initial MVP2 Migration PRD — consolidating all reference documents into single source of truth |

---

*This document is the single source of truth for all MVP2 migration work. All 13 phases should reference this document for specifications, file paths, and verification criteria.*
