# PRODUCT REQUIREMENTS DOCUMENT

# Frontera Command Centre
## Unified Strategic Dashboard for Enterprise Product Leaders

---

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Date** | March 2026 |
| **Author** | Derek Smith |
| **Status** | Design Complete — Ready for Development |
| **Design Reference** | `Background/mockups/dashboard-command-centre.html` |
| **Dependencies** | Strategy Coach Agent, Gamification System, Territory Insights, Synthesis Outputs |

---

## 1. Executive Summary

### Problem

Enterprise product leaders using Frontera's Strategy Coach lack a holistic view of their transformation progress. The current interface is session-focused — users enter a coaching conversation and work within it, but have no dashboard showing overall strategy health, team activity, market signals, or cross-cutting insights. Leaders must mentally stitch together progress from multiple coaching sessions, uploaded materials, and research outputs.

### Solution

Command Centre is a unified strategic dashboard that serves as the user's home screen. It provides six integrated views:

1. **Strategy Overview** — At-a-glance health metrics and journey progress
2. **Insights Feed** — Curated daily intelligence (signals, provocations, learning)
3. **Team Workspace** — Collaborative artefact management and team activity
4. **Operating Model** — Board-ready strategy health with assumption and signal tracking
5. **Personal Coaching** — Coaching relationship dashboard with outcomes, themes, and interaction modes

### Design Principle

> **"See everything, act on what matters."**

Command Centre gives leaders the altitude to see their full strategic landscape while providing direct access to resume work at ground level.

---

## 2. Interface Architecture

### 2.1 Primary Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  TOP NAV — Tab bar with 5 screen selectors                       │
│  [Strategy Overview] [Insights Feed] [Coaching Hub] [Team] [Ops] │
├──────────────┬───────────────────────────────────────────────────┤
│              │                                                    │
│  SIDEBAR     │  MAIN CONTENT AREA                                │
│  (220px)     │  (Scrollable, screen-specific)                    │
│              │                                                    │
│  - Logo      │  Content varies by active tab                     │
│  - Level/XP  │                                                    │
│  - Coach     │                                                    │
│  - Nav tree  │                                                    │
│  - Streak    │                                                    │
│              │                                                    │
└──────────────┴───────────────────────────────────────────────────┘
```

### 2.2 Navigation Structure

**Top Nav:** Horizontal tab bar with numbered screens (1-5). Active tab highlighted in Gold. Navy header gradient background. Screen 5 is Personal Coaching.

**Sidebar (220px fixed):**
- Frontera logo + organisation name
- Level/XP progress bar (gamification)
- Coach profile (avatar, name, role)
- Collapsible nav sections: Strategy, Insights, Coaching, Team, Admin
- "Coming Soon" items shown as locked (greyed out with lock icon)
- Coaching streak counter at bottom

**Nav sections expand/collapse** with chevron animation. Active page highlighted with `bg-white/10` treatment.

---

## 3. Screen Specifications

### 3.1 Strategy Overview (Screen 1 — Default)

**Purpose:** At-a-glance view of strategy health and next actions.

**Row 1 — Metric Cards (4-column grid):**

| Card | Metric | Data Source |
|------|--------|-------------|
| Strategy Health | Score 0-100 with radial chart | Composite: research coverage + assumption validation + bet confidence + freshness |
| Active Bets | Count with confidence dots | `synthesis_outputs` where type = 'bet' |
| Research Coverage | Percentage with progress bar | `territory_insights` completion across 18 research areas |
| Team Alignment | X/Y members active | `user_gamification` recent activity per org |

**Row 2 — Phase Journey + Activity (8:4 split):**

- **Phase Stepper:** Horizontal stepper showing Discovery → Research → Synthesis → Bets → Activate → Review. Completed phases show green checkmark. Current phase shows percentage with pulse animation. Future phases locked with lock icon.
- **Current Phase Card:** Left-bordered card (phase colour) showing phase name, percentage, areas remaining, and "Continue Research" CTA.
- **Recent Activity:** Chronological feed of user actions (completed research, new signals, coaching sessions, validated assumptions, strategy updates).

**Row 3 — Quick Actions (4-column grid):**

| Action | Style | Behaviour |
|--------|-------|-----------|
| Resume Coaching | Gold card | Opens most recent coaching session |
| Log Signal | Cyan-bordered card | Opens signal logging modal |
| Review Assumptions | Amber-bordered card | Navigates to assumption tracker |
| Export Strategy | Navy card | Triggers PDF/Word export |

### 3.2 Insights Feed (Screen 2)

**Purpose:** Personalised daily intelligence feed.

**Layout:** Single column, max-width 4xl, centred.

**Filter Pills:** All | Market | Competitor | Customer | Micro-Learning. Active filter in Gold.

**Card Types:**

| Type | Visual Treatment | Content |
|------|-----------------|---------|
| Daily Provocation | Gold left-border, sparkle icon | AI-generated strategic challenge based on research gaps. CTA: "Reflect with Coach" |
| Market Signal | Cyan left-border, lightning icon | External market event with impact badge (High/Medium/Low). Source and timestamp. |
| Micro-Learning | Navy card (premium), book icon | Short learning module with progress bar. CTA: "Continue" |
| Blind Spot Alert | Amber background, coach avatar | Proactive coach observation about neglected areas. CTA: "Explore this topic" |
| Competitor Intel | Purple left-border, eye icon | Competitive intelligence with source attribution |
| Curated Article | Default card, external link icon | Relevant article with relevance explanation |

**Data Sources:**
- Provocations: Generated by Strategy Coach based on `territory_insights` gaps
- Signals: `strategy_signals` table
- Learning: Future content module (placeholder)
- Blind spots: Generated from `phase_progress` + `territory_insights` staleness
- Competitor: `territory_insights` where territory = 'competitor' + external signals

### 3.3 Coaching Hub (Screen 3)

**Purpose:** Coaching session management and engagement tracking.

**Layout:** Two-column (5:7 split).

**Left Column:**

- **Coach Profile Card:** Navy premium card. Coach avatar (large, rounded-2xl), name, role, expertise tags.
- **Coaching Streak Calendar:** 7-column grid showing 4 weeks. Gold = active day, slate = missed, dashed border = future. Current day highlighted with ring-pulse. Total streak count and personal best.
- **Quick Prompts:** Wrapped pill buttons with pre-built coaching prompts:
  - "Challenge my assumptions"
  - "What am I missing?"
  - "Summarize my progress"
  - "Next priority?"
  - "Competitor deep dive"

**Right Column:**

- **Session Actions:** Two-column grid — "Continue Session" (Gold) and "New Session" (Navy).
- **Recent Sessions:** List of past sessions with phase badge (colour-coded), title, timestamp, and duration. Clickable to resume.
- **Coach Insight Banner:** Cyan-bordered card with coach avatar and proactive recommendation based on research gaps.

**Data Sources:**
- Sessions: `conversations` table for current org
- Streak: `user_gamification.current_streak` + `xp_events` by date
- Coach profile: Configured per organisation

### 3.4 Team Workspace (Screen 4)

**Purpose:** Collaborative strategy artefact management.

**Row 1 — Artefact Cards (4-column grid):**

| Artefact | Status Options | Data Source |
|----------|---------------|-------------|
| Team Brief | Ready / Draft / Pending | `strategic_artefacts` where type = 'team_brief' |
| OKRs | Ready / Draft / Pending | `strategic_artefacts` where type = 'okrs' |
| Guardrails | Active / Draft / Pending | `strategic_artefacts` where type = 'guardrails' |
| Stakeholder Pack | Ready / Draft / Pending | `strategic_artefacts` where type = 'stakeholder_pack' |

Each card: Left colour border (phase-appropriate), status badge, title, description, View/Edit + Share/Export actions.

**Row 2 — Decisions + Activity (6:6 split):**

- **Decision Frameworks:** List of strategic decisions with status (In Progress / Decided). Shows criteria progress. Future: structured decision canvas.
- **Team Activity:** Avatar-led feed showing team member actions with timestamps.

**Row 3 — Shared Documents Table:**

| Column | Content |
|--------|---------|
| Document | Name (semibold) |
| Owner | Team member name |
| Updated | Relative timestamp |
| Status | Badge: Current / Review / Draft |

Source: `strategic_outputs` + `strategic_artefacts` for current org.

**Row 4 — Coming Soon Placeholders:**
Four dashed-border cards (50% opacity) showing locked future features: Product Team Strategy, Team Discovery, Feedback Loops, Team Model Design.

### 3.5 Operating Model (Screen 4)

**Purpose:** Board-ready strategy health view with assumption and signal tracking.

**Row 1 — Executive Summary Banner:**
Navy premium card with radial Strategy Health Score (Gold accent), descriptive summary, and key metrics: Assumptions count, Signals count, Strategy version.

**Row 2 — KPI Cards (4-column grid):**

| Card | Metric | Visualisation |
|------|--------|--------------|
| Assumption Validation | X% validated | Segmented bar (green=valid, red=invalid, grey=untested) with legend |
| Bet Confidence | Per-bet bars | Progress bars with High/Med/Low labels per bet |
| Research Depth | X% mapped | Per-territory mini-bars (Company/Customer/Competitor) |
| Strategy Freshness | Days since update | Freshness indicator (Fresh/Stale threshold: 14 days) |

**Row 3 — Assumption Tracker + Signal Log (8:4 split):**

- **Assumption Tracker Table:**

| Column | Content |
|--------|---------|
| Assumption | Statement text |
| Bet | Linked strategic bet |
| Status | Badge: Validated / Invalidated / Untested |
| Evidence | Source count or type |

Source: `strategy_assumptions` table. "Add assumption" CTA.

- **Signal Log:** Chronological list with impact dot (red=high, amber=medium, grey=low), signal title, impact level, and timestamp.
Source: `strategy_signals` table.

**Row 4 — Board-Ready Export:**
White card with "Export Word" (Navy button) and "Export PDF" (Gold button) CTAs. Version history link.

### 3.6 Personal Coaching (Screen 5)

**Purpose:** A coaching relationship dashboard that surfaces the user's target outcomes, coaching themes, session patterns, and provides direct interaction pathways to each coach persona. This is not session management (which lives in the workspace) — it is a reflective view of the coaching journey.

**Design Principle:**
> "Know where you're going, know who's guiding you."

**Layout:** Three rows with a hero coach card at top.

**Row 1 — Your Coach (full-width hero card):**

Navy premium card with gold decorative blur accent:
- Coach avatar image (96x96, `rounded-2xl`, loaded from `/avatars/coaches/{id}.png`)
- Coach name, title, tagline from persona definition
- Expertise tags as pill badges
- 4 mini stat cards (inline): Sessions count, Avg session length, Most active phase, Insights captured
- "Switch Coach" tertiary CTA (opens persona selector)

| Stat | Data Source |
|------|-------------|
| Sessions | `conversations` count for current user/org |
| Avg Length | `conversation_messages` timestamp ranges |
| Top Phase | Mode of `conversations.current_phase` |
| Insights Captured | Count of `[Insight:...]` markers in messages |

**Row 2 — Target Outcomes + Coaching Themes (6:6 split):**

*Left: Your Target Outcomes*

- White card with cyan-200 border
- Each outcome: title + progress bar
- Progress derived from phase completion, territory mapping, and artefact generation
- "Edit Outcomes" CTA to update goals

| Data Source | Notes |
|-------------|-------|
| `clients.strategic_focus` | Initial goals from onboarding |
| `phase_progress` | Phase-based progress mapping |
| `strategic_artefacts` | Artefact completion for outcome progress |

*Right: Emerging Themes*

- White card with slate border
- Horizontal bar chart showing topic frequency across sessions
- Bars colour-coded by territory (indigo=company, cyan=customer, purple=competitor, slate=general)
- Generated by Claude analysing conversation history topics
- Footer note: "AI-generated from session analysis"

**Row 3 — Next Coaching Topic + Coach Interaction Modes (5:7 split):**

*Left: Next Recommended Topic*

- Amber-50 background with gold left border
- Sparkle icon + "Next Coaching Topic" label
- Topic title (bold) + reasoning paragraph
- "Based on:" attribution line
- Gold primary CTA linking to workspace with context: `/dashboard/product-strategy-agent?context=recommended-topic&topic=competitor-response`

| Data Source | Notes |
|-------------|-------|
| `territory_insights` gaps | Areas with low coverage |
| `strategy_signals` recent | Market events needing response |
| `strategy_assumptions` untested | Assumptions needing validation |

*Right: Interact With Your Coaches*

6 interaction mode cards in a 2x3 grid:

| Mode | Icon | Description | Best Coaches | Workspace Link |
|------|------|-------------|--------------|----------------|
| **Debate** | Swords | Challenge assumptions with a sparring partner | Priya, Hana | `?mode=debate` |
| **Ideate** | Lightbulb | Brainstorm new approaches with creative prompts | Elena, Kofi | `?mode=ideate` |
| **Support** | Handshake | Get guidance on a specific challenge | Elena, Fin | `?mode=support` |
| **Analyse** | Magnifier | Deep-dive into data and evidence | Marcus, Priya | `?mode=analyse` |
| **Review** | Clipboard | Critical review of research or strategy draft | Hana, Marcus | `?mode=review` |
| **Plan** | Target | Map out next steps and priorities | Fin, Kofi | `?mode=plan` |

Each card: White background with territory-appropriate border colour on hover, icon, mode name (bold), 2-line description, "Best:" line showing recommended coach personas, CTA button linking to `/dashboard/product-strategy-agent?mode={mode}`, hover: scale-105 + shadow-lg.

**New API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/product-strategy-agent/dashboard/coaching-themes` | GET | AI-generated theme analysis from session history |
| `/api/product-strategy-agent/dashboard/next-topic` | GET | AI-recommended next coaching topic based on gaps + signals |

---

## 4. Data Requirements

### 4.1 New Data Needed

| Data Point | Source | Notes |
|------------|--------|-------|
| Strategy Health Score | Computed | Composite of 4 sub-scores (research, assumptions, bets, freshness) |
| Daily Provocations | AI-generated | Claude generates based on research gaps |
| Coaching Streak Calendar | `xp_events` by date | Need date-level activity tracking |
| Coach Profile | Configuration | Name, avatar, expertise tags per org |
| Decision Frameworks | New table or `strategic_artefacts` subtype | Status, criteria list, decision outcome |
| Curated Articles | Future: external feed or manual curation | Placeholder for v1 |
| Coaching Themes | AI-generated from `conversation_messages` | Claude analyses session history topics |
| Next Topic Recommendation | AI-generated from gaps + signals | Combines `territory_insights` gaps, `strategy_signals`, `strategy_assumptions` |
| Interaction Mode Config | Static configuration | 6 modes: Debate, Ideate, Support, Analyse, Review, Plan |

### 4.2 Existing Data Leveraged

| Table | Used For |
|-------|----------|
| `conversations` | Recent sessions list, phase progress |
| `territory_insights` | Research coverage calculation |
| `phase_progress` | Phase stepper state |
| `synthesis_outputs` | Active bets, bet confidence |
| `strategy_assumptions` | Assumption tracker |
| `strategy_signals` | Signal log, insights feed |
| `strategic_artefacts` | Team workspace artefact cards |
| `strategic_outputs` | Shared documents table |
| `user_gamification` | XP, level, streak |
| `xp_events` | Streak calendar, recent activity |
| `uploaded_materials` | Discovery materials count |

---

## 5. Strategy Health Score — Calculation

```
Health Score = (Research Weight * Research%) + (Assumptions Weight * Validation%)
            + (Bets Weight * Confidence%) + (Freshness Weight * Freshness%)

Weights: Research 30%, Assumptions 25%, Bets 25%, Freshness 20%

Research% = territory_insights mapped / total research areas
Validation% = validated assumptions / total assumptions
Confidence% = average bet confidence (0-100)
Freshness% = max(0, 100 - (days_since_update * (100/14)))
```

Score displayed as 0-100 with radial progress chart. Colour: Cyan-600.

---

## 6. API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/product-strategy-agent/dashboard/overview` | GET | Strategy health score, metric cards, phase progress |
| `/api/product-strategy-agent/dashboard/insights` | GET | Paginated insights feed with type filter |
| `/api/product-strategy-agent/dashboard/coaching` | GET | Recent sessions, streak data, coach profile |
| `/api/product-strategy-agent/dashboard/team` | GET | Artefacts, team activity, shared documents |
| `/api/product-strategy-agent/dashboard/operating-model` | GET | Assumptions, signals, KPIs, health score |
| `/api/product-strategy-agent/signals` | POST | Log new market signal |
| `/api/product-strategy-agent/assumptions` | POST/PATCH | Create or update assumption status |
| `/api/product-strategy-agent/dashboard/coaching-themes` | GET | AI-generated theme analysis from session history |
| `/api/product-strategy-agent/dashboard/next-topic` | GET | AI-recommended next coaching topic based on gaps + signals |

---

## 7. Component Architecture

```
src/components/product-strategy-agent/CommandCentre/
├── CommandCentre.tsx          # Main container with tab state
├── TopNav.tsx                 # Horizontal tab bar
├── Sidebar.tsx                # Collapsible nav sidebar
├── StrategyOverview/
│   ├── MetricCards.tsx        # 4 KPI cards
│   ├── PhaseJourney.tsx       # Stepper + current phase card
│   ├── RecentActivity.tsx     # Activity feed
│   └── QuickActions.tsx       # Action buttons
├── InsightsFeed/
│   ├── InsightsFeed.tsx       # Feed container with filters
│   ├── ProvocationCard.tsx    # Daily provocation
│   ├── SignalCard.tsx         # Market signal
│   ├── LearningCard.tsx       # Micro-learning
│   ├── BlindSpotCard.tsx      # Coach blind spot alert
│   └── CompetitorCard.tsx     # Competitor intel
├── CoachingHub/
│   ├── CoachProfile.tsx       # Coach card
│   ├── StreakCalendar.tsx      # Calendar grid
│   ├── QuickPrompts.tsx       # Prompt pill buttons
│   ├── SessionActions.tsx     # Continue/New buttons
│   └── RecentSessions.tsx     # Session list
├── TeamWorkspace/
│   ├── ArtefactCards.tsx      # 4 artefact cards
│   ├── DecisionFrameworks.tsx # Decision list
│   ├── TeamActivity.tsx       # Activity feed
│   └── SharedDocuments.tsx    # Document table
├── OperatingModel/
│   ├── HealthBanner.tsx        # Executive summary
│   ├── KPICards.tsx            # 4 KPI metric cards
│   ├── AssumptionTracker.tsx   # Assumption table
│   ├── SignalLog.tsx           # Signal list
│   └── BoardExport.tsx        # Export actions
└── PersonalCoaching/
    ├── CoachHero.tsx           # Coach profile hero card
    ├── TargetOutcomes.tsx      # Outcome progress bars
    ├── EmergingThemes.tsx      # AI-generated theme bars
    ├── NextTopic.tsx           # Recommended next session
    └── InteractionModes.tsx    # 2x3 interaction mode grid
```

---

## 8. Implementation Priority

### Phase 1 — Core Dashboard (Recommended Start)
- Sidebar + Top Nav + tab switching
- Strategy Overview (all rows)
- Personal Coaching (coach hero, target outcomes, interaction modes)

### Phase 2 — Intelligence Layer
- Insights Feed (signals, blind spots from existing data)
- Operating Model (assumption tracker, signal log, health score)

### Phase 3 — Collaboration
- Team Workspace (artefact cards, team activity, shared docs)
- Decision Frameworks

### Phase 4 — Engagement & Polish
- Streak calendar + gamification sidebar
- Daily provocations (AI-generated)
- Micro-learning cards
- Coming Soon placeholders for future features

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Usage | 60%+ of users visit Command Centre daily | Analytics: page views |
| Session Resume Rate | 40%+ of sessions started via "Continue" | Analytics: session origin |
| Signal Logging | 3+ signals logged per user per week | `strategy_signals` count |
| Assumption Validation | 80%+ of assumptions tested within 30 days | `strategy_assumptions` status changes |
| Strategy Freshness | Average < 7 days between updates | `strategy_versions` timestamps |
| Coaching Streak | Average streak > 5 days | `user_gamification.current_streak` |

---

## 10. Design Reference

The complete interactive mockup is available at:
`Background/mockups/dashboard-command-centre.html`

This mockup implements all five screens with working tab navigation, sidebar collapse, and representative data. It follows the Frontera Design System (Navy + Gold + Cyan palette, Plus Jakarta Sans typography, Tailwind CSS).
