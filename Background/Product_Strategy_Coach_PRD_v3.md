# PRODUCT REQUIREMENTS DOCUMENT

# Frontera Product Strategy Coach v3.0
## Coaching-Central Strategic Platform with Living Strategy System

---

| Field | Value |
|-------|-------|
| **Version** | 3.0 |
| **Date** | February 2026 |
| **Author** | Derek Smith |
| **Status** | Vision & Design Specification |
| **Design Inspiration** | BetterUp Grow Platform, Notion, Duolingo, Cascade, Quantive StrategyAI |
| **Methodology** | Playing to Win Framework (Roger Martin & A.G. Lafley) |
| **Cross-References** | PSC Critical Analysis (Feb 2026), UX Journey Research (Feb 2026), PRD v2.1 (Jan 2026) |

---

## 1. Executive Summary

### 1.1 The Transformation

The Product Strategy Coach v3.0 represents a fundamental redesign of how enterprise leaders experience strategic coaching. Where v2.1 treated coaching as a sidebar companion to a canvas-based workflow, v3.0 makes **coaching the central experience** with strategic artefacts emerging naturally from the conversation.

This transformation is driven by three converging insights:

1. **The Critical Analysis finding** that coaching is "hidden on the left and not integrated with the question context or user journey flow" -- the single most impactful UX problem to solve.
2. **BetterUp's proven model** achieving 95% satisfaction with AI coaching by making the coaching conversation the primary interface, not a secondary feature.
3. **Enterprise research data** showing 49% of product leaders lack time for strategic thinking (Atlassian 2026) and 84% worry their strategy never reaches execution (ProductPlan 2025).

### 1.2 Design Hypothesis

> **"Your AI strategy partner, embedded in every decision moment."**

Leaders don't need another tool to fill in -- they need an intelligent partner who guides them through strategic thinking, generates artefacts from their conversations, and keeps strategy alive long after the initial planning session ends.

The coach is no longer beside you. The coach IS the experience.

### 1.3 Three Design Pillars

| Pillar | Inspiration | Frontera Application |
|--------|-------------|---------------------|
| **Coaching is the product** | BetterUp: Full-width AI chat with session details panel; inline action cards; roleplay buttons within conversation | Invert the layout from 25% coach / 75% canvas to 60% coaching centre / 40% context panel. Every phase is experienced through conversation. The user can still select for AI suggestions, but they will be buttons within the coaching journey |
| **Assessment shapes the journey** | BetterUp: Whole Person Model assessment with archetype classification ("You are a Strategist"), strength/growth scores, personalised coaching path | Strategic Maturity Assessment at onboarding classifying users as Operator, Visionary, Analyst, or Diplomat. Adapts coaching depth, question complexity, and recommended activities. |
| **Personalised daily value** | BetterUp: "Good morning, Jamie" dashboard with curated cards (Insights, AI Coaching topic, Role-play, Resources, Calendar prep) | Strategy Home replaces the generic dashboard with personalised strategic coaching cards, progress tracking, and "start a conversation about..." entry point. |

### 1.4 What Changes from v2.1

| Dimension | v2.1 (Current) | v3.0 (Vision) |
|-----------|----------------|---------------|
| **Layout** | 25% coach sidebar + 75% canvas | 60% coaching centre + 40% context panel |
| **Entry point** | Jump straight into canvas workspace | Personalised Strategy Home with curated daily cards |
| **Discovery** | Passive file upload with minimal coaching | Coach-led interview exploring "why" before "what" |
| **Research** | 36 text questions in 9 areas, uniform format | Coach-guided conversation with micro-synthesis after each territory |
| **Coaching role** | Reactive (responds to input) | Proactive (identifies blind spots, escalates challenges) |
| **Journey end** | Phase 4: Strategic Bets + PDF export | Phase 6: Living Strategy with assumption tracking and review cadences |
| **Outputs** | PDF exports, in-app views | Living artefacts: team briefs, guardrails, stakeholder packs, Strategy on a Page. The evolving artefacts are displayed periodically to engage the user by showing progress |
| **Personalisation** | Industry context only | Strategic Maturity archetype shapes entire experience |
| **Engagement pattern** | One-time strategy session | Ongoing strategic partnership with return triggers |

---

## 2. Target Customer & Personas

### 2.1 Market Context

Frontera serves two company segments with a tiered coaching model:

| Segment | Company Size | Coaching Model | Go-to-Market |
|---------|-------------|----------------|-------------|
| **Growth** | 200-1,000 employees | **AI-only coaching** — fully autonomous AI Strategy Coach guides the entire journey | Self-serve / product-led growth |
| **Enterprise** | 1,000+ employees | **AI + Human coaching** — AI Strategy Coach augmented by human strategic advisors for calibration, facilitation, and stakeholder alignment | Sales-led with land-and-expand for 5,000+ |

Both segments face the same core problem: they lack the budget for top-tier strategy consulting ($200K-$500K per engagement) but face the same strategic complexity. They have established products, existing customers, and organisational inertia that makes strategic change difficult.

**Growth Segment (200-1,000 employees):**
- The AI Strategy Coach is the sole coaching layer — no human advisor in the loop
- Platform delivers the full 6-phase journey autonomously
- Lower price point enables product-led acquisition
- Ideal proving ground for the AI coaching experience before scaling to enterprise

**Enterprise Segment (1,000+ employees):**
- AI Strategy Coach handles the day-to-day coaching, research guidance, and artefact generation
- Human strategic advisors provide high-touch support: leadership calibration sessions, stakeholder facilitation, custom workshop design
- For companies with 5,000+ employees, Frontera uses a **land-and-expand** approach — targeting a single business unit (e.g., a product division, regional team, or specific product line) to prove strategic value, then expanding across the organisation
- Premium pricing reflects the blended AI + human coaching model

The platform serves the intersection of three market pressures:
- **Strategic urgency**: 84% of teams worry their products will fail (Atlassian 2026)
- **Time scarcity**: 49% of product teams lack time for strategic planning
- **Execution gap**: Strategy rarely reaches the people building the product

### 2.2 Primary Persona: The Chief Product Officer (CPO)

> The CPO is the primary author and owner of product strategy. Frontera is built for them first.

| Attribute | Detail |
|-----------|--------|
| **Title** | Chief Product Officer, Chief Technology Officer (product-led), Chief Strategy Officer |
| **Company size** | 200-1,000 (AI-only); 1,000+ (AI + Human coaching); land-and-expand for 5,000+ |
| **Reports to** | CEO / Board |
| **Manages** | VPs of Product, Heads of Strategy, Product Directors |
| **Experience** | 15-25 years, 5-10 years in C-suite or senior leadership |
| **Strategic maturity** | High -- owns the strategic vision but needs a structured process and AI partner to accelerate and validate |

**Goals:**
- Own and articulate the company's product strategy with conviction grounded in evidence
- Align the entire product organisation (VPs, PMs, Engineering) behind a coherent strategic direction
- Communicate strategy upward to the CEO/Board and outward to cross-functional leaders (Sales, Marketing, Finance)
- Ensure strategy is adaptive -- evolving as market signals and competitive dynamics shift
- Build strategic capability across the product leadership team
- Demonstrate measurable strategic impact to the board

**Pain Points:**
- No time for deep strategic work despite it being their primary responsibility (meetings consume 60%+ of their week)
- Strategy dies in the slide deck -- presentations to the board that never translate into changed team behaviour
- Develops strategy in isolation without structured input from the organisation
- No feedback loop -- can't tell if strategic bets are working until quarterly business reviews
- The gap between "strategy formulated" and "strategy executed" is where most value is lost
- Existing tools (Miro, Google Docs, PowerPoint) are general-purpose, not strategy-purpose

**How v3.0 Serves Them:**
- **Strategy Home** delivers personalised strategic intelligence in 5 minutes (no blank canvas)
- **Coach-led Discovery** replaces "upload your docs" with an engaging C-level interview exploring "why now?" and "what does winning look like?"
- **Micro-synthesis** provides strategic insights after each research territory (not after 2.5 hours)
- **Strategy on a Page** gives them the concise, shareable view they need for board and leadership alignment
- **Phase 5: Strategic Activation** generates the team briefs, guardrails, and OKRs that cascade strategy to their VPs and PMs
- **Stakeholder Communication Pack** with audience-specific views for CEO/Board, CTO, Sales VP
- **Phase 6: Strategy Review** makes strategy a living practice with assumption tracking and review cadences
- **Strategic Maturity Assessment** helps them understand their own strategic strengths and blind spots
- **Executive Insights** (inspired by BetterUp) showing strategic health, bet progress, and organisational alignment

### 2.3 Secondary Persona: The Strategy Leader (VP of Product)

| Attribute | Detail |
|-----------|--------|
| **Title** | VP of Product, Head of Strategy, Senior Director of Product |
| **Company size** | 200+ employees (both segments) |
| **Reports to** | CPO |
| **Team** | Manages 3-8 product managers |
| **Interaction mode** | Deep strategic work -- researching, synthesising, refining bets under CPO direction |

**Goals:**
- Execute the CPO's strategic vision by conducting deep research and analysis
- Develop detailed strategic bets with evidence, metrics, and kill criteria
- Translate high-level strategy into team-level execution plans
- Build strategic thinking capability in their PM team

**Pain Points:**
- Blank-canvas paralysis -- knows research is needed but doesn't know where to start
- 36 open-ended questions feels like a marathon with no visible reward until synthesis
- Needs coaching on HOW to do strategic research, not just WHAT questions to answer
- Caught between CPO's vision and PM team's execution reality

**How v3.0 Serves Them:**
- **Coach-led Research** with methodology hints and micro-synthesis creates a guided, rewarding experience
- **Coaching centre layout** makes the AI coach their strategic thinking partner, not a sidebar afterthought
- **Archetype-adapted coaching** meets them where they are (Operator, Visionary, Analyst, or Diplomat)
- **Debate Mode** helps them navigate strategic tensions with expert perspectives
- **Team Brief Generator** helps them translate bets into briefs their PMs can act on

### 2.4 Tertiary Persona: The Strategy Consumer (Product Manager)

| Attribute | Detail |
|-----------|--------|
| **Title** | Product Manager, Engineering Lead, Design Lead |
| **Interaction mode** | Receiving strategic context, using frameworks daily |
| **Time budget** | 5-10 minutes to absorb strategic context |

**Goals:**
- Understand why their team is working on what they're working on
- Have clear guardrails for daily prioritisation decisions
- Know what success looks like for their specific area
- Feel connected to the bigger strategic picture

**Pain Points:**
- Strategy is a mystery -- they know "what" to build but not "why"
- No decision framework when trade-offs arise ("Should we invest in performance or new features?")
- OKRs feel disconnected from strategy
- Never see the research or evidence behind strategic decisions

**How v3.0 Serves Them:**
- **Team Briefs** generated per strategic bet with problem context, guardrails, and success metrics
- **Decision Framework** document ("When choosing between X and Y, prioritise...")
- **Strategic Guardrails** -- clear "We will / We will not" statements
- **Evidence trail** -- traceable link from their team's OKR back to research insight

### 2.5 Persona Hierarchy & Platform Access

| Persona | Role | Platform Access | Primary Value |
|---------|------|----------------|---------------|
| **CPO** (Primary) | Authors strategy, owns outcomes | Full platform: all 6 phases, Strategy Home, Executive Insights | Strategic clarity, organisational alignment, board-ready outputs |
| **VP Product** (Secondary) | Conducts research, develops bets | Full platform: research-heavy workflow, coaching centre | Guided research, evidence-linked synthesis, team brief generation |
| **Product Manager** (Tertiary) | Consumes strategy, executes daily | Read-only: Team Briefs, Guardrails, Decision Frameworks via shared links | Strategic context for daily decisions, clear success metrics |

---

## 3. UX Outcomes & Success Metrics

### 3.1 Primary Outcome Metrics

| Metric | Current State (v2.1) | Target (v3.0) | Measurement Method |
|--------|---------------------|---------------|-------------------|
| **Time to first strategic insight** | ~2.5 hours (after Research phase) | < 30 minutes (micro-synthesis after first territory) | Time from session start to first AI-generated insight delivery |
| **Research phase completion rate** | Unknown; suspected < 40% | > 70% complete all 9 areas | `territory_insights` records with status = 'mapped' |
| **Strategy-to-execution artefacts** | 0 team briefs, 0 guardrails | 3+ team briefs per strategy | `strategic_artefacts` table count |
| **30-day return engagement** | One-time use pattern | Weekly return (4+ sessions/month) | Session frequency from `conversations` timestamps |
| **Cross-functional reach** | 1 user per strategy session | 3+ stakeholders view/interact | Shared link views + stakeholder input count |
| **Strategic maturity growth** | No baseline | Measurable improvement over 90 days | Delta between initial and 90-day reassessment scores |

### 3.2 Leading Indicator Metrics

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| **Discovery phase completion** | < 15 minutes | Coach-led interview eliminates blank-canvas paralysis |
| **Research session length** | 25-40 min per territory | Focused sessions, not marathon 2.5-hour grind |
| **Micro-synthesis engagement** | > 80% review territorial insights | Progressive gratification sustains energy |
| **Debate Mode participation** | > 50% of users with tensions | Strategic depth indicator |
| **Team Brief generation** | > 60% of strategies produce briefs | Execution bridge indicator |
| **Assumption tracking updates** | Monthly signal log entries | Strategy-as-living-system indicator |
| **Strategy Home return rate** | 3+ visits/week | Daily value delivery indicator |

### 3.3 Qualitative Outcomes

| Outcome | Evidence |
|---------|----------|
| Leaders feel coached, not tool-assisted | Post-session NPS > 75; qualitative feedback |
| Strategy reaches teams, not just slides | Team brief consumption rate; PM survey |
| Strategy adapts to reality | Assumption status changes over time |
| Cross-functional alignment improves | Stakeholder Communication Pack generation + feedback |
| Strategic confidence grows | Self-reported confidence in decision-making |

---

## 4. Design Principles

### Principle 1: Coaching Is the Product

> *"The best coaching happens when you don't notice the interface -- you notice the insight."*

**BetterUp Reference:** Slide 17 shows a full-width chat interface where the AI coach drives the conversation. A side panel shows "Session Details & Insights" with the current challenge summary and skill tags. The conversation IS the experience; everything else supports it.

**Frontera Application:** The coaching conversation occupies 60% of the viewport. Strategic research, synthesis outputs, and artefact previews appear in the 40% context panel -- supporting the conversation, not competing with it. Users never leave the coaching flow to "go do research" -- the coach guides them through it. The coach leading the conversation, is the coach matched to the user in their profiling session. Depending on the journey point, the coach can decide to consult another coach for a specific question or to offer debating view points.

**What This Means in Practice:**
- Every research question is asked BY the coach, not presented as a form
- Artefacts (synthesis, bets, team briefs) appear as inline cards within the conversation
- The context panel updates automatically based on what's being discussed
- Phase transitions happen through coaching milestones, not button clicks

---

### Principle 2: Assessment Shapes the Journey

> *"One size fits all coaching is no coaching at all."*

**BetterUp Reference:** Slides 13 and 15 show the "Whole Person Model" assessment with strength/growth area scores, archetype classification ("You are a Strategist / The Achiever"), and a Likert-scale assessment flow (29/137 Completed with progress bar).

**Frontera Application:** A Strategic Maturity Assessment during onboarding classifies leaders into four archetypes. This shapes coaching depth, question complexity, recommended activities, and phase pacing throughout the entire journey.

**The Four Strategic Archetypes:**

| Archetype | Strength | Growth Area | Coaching Adaptation |
|-----------|----------|-------------|-------------------|
| **The Operator** | Execution discipline, metric-driven | Strategic vision, long-term thinking | Coach emphasises "zoom out" moments, market-level framing, competitive dynamics |
| **The Visionary** | Big-picture thinking, opportunity identification | Execution specificity, kill criteria discipline | Coach demands concrete metrics, test plans, and resource commitments |
| **The Analyst** | Research rigour, data-driven decisions | Speed of action, stakeholder communication | Coach pushes for commitment deadlines, "good enough" thresholds, and communication plans |
| **The Diplomat** | Stakeholder alignment, cross-functional fluency | Decisive prioritisation, willingness to say no | Coach challenges comfort-zone decisions, forces trade-offs, demands guardrails |

---

### Principle 3: Personalised Daily Value

> *"The platform should feel valuable in 5 minutes, not just after 5 hours."*

**BetterUp Reference:** Slides 1, 11, and 12 show the personalised home dashboard -- "Good morning, Jamie / It's good to see you, Sasha" with curated activity cards (AI Coaching topic, Insights, Role-play exercises, Coaching Plan, Calendar prep). Each card is tagged by category, has a clear description, and offers a single-click CTA.

**Frontera Application:** The Strategy Home replaces the generic feature-card dashboard with personalised strategic coaching cards that deliver value even in a 5-minute visit. Cards adapt based on current phase, time since last session, strategic signals, and assessment archetype.

---

### Principle 4: Progressive Gratification

> *"Show progress early and often. The 'wow moment' should come after 15 minutes, not 2.5 hours."*

**Duolingo Reference:** Streaks, completion percentages, and micro-rewards sustain engagement through long-form learning. Users never go more than a few minutes without visible progress.

**Frontera Application:** Micro-synthesis moments after each completed territory. Real-time confidence meters. Phase completion celebrations. Territorial insight summaries that preview the full synthesis. The research bottleneck is broken by showing strategic value continuously, not just at the end.

---

### Principle 5: Strategy Is Living, Not Static

> *"A strategy document that doesn't change is a strategy that's already obsolete."*

**Quantive / Cascade Reference:** "Always-On Strategy" treats strategic planning as a continuous process with live dashboards, real-time health indicators, and automatic adaptation triggers. Cascade's one-click reporting replaces static PDF exports.

**Frontera Application:** Phase 6 (Strategy Review) introduces assumption tracking, signal logging, strategy versioning, and review cadences tied to kill dates. The PDF export is replaced by a living strategy link that auto-updates. but the user can still download to pdf if they want a shareable copy. Strategic bets have outcome tracking that feeds back into territory research.

---

### Principle 6: Audience-Aware Outputs

> *"The same strategy, rendered for the person reading it."*

**Productboard Reference:** Audience-specific roadmap views -- leadership sees a timeline, engineering sees sprint details, sales sees positioning. Same underlying data, different presentation.

**Frontera Application:** The Stakeholder Communication Pack generates audience-specific views from the same synthesis data. The CPO sees portfolio balance and capability gaps. The CTO sees technical requirements and architecture implications. Sales sees competitive positioning and market opportunity. PMs see team briefs with guardrails and success metrics.

---

### Principle 7: In-Flow-of-Work Delivery

> *"Strategy shouldn't live in a separate tab. It should appear at the moment of decision."*

**BetterUp Reference:** Slides 3 and 7 show coaching embedded in Slack, Teams, and Calendar. The AI coach appears in Teams chat with "Challenge saved and Recommended resources added to your..." inline. Calendar events like "AI Coach: Prep for Career Conversation" are auto-scheduled.

**Frontera Application:** Strategic nudges delivered via Slack/Teams when signals are detected -- kill dates approaching, assumptions invalidated by market events, or team decisions that conflict with strategic guardrails. Calendar-integrated strategy review sessions. Strategy context pushed to Jira/Linear tickets.

---

## 5. Interface Architecture

### 5.1 The Layout Inversion

The single most impactful design change in v3.0 is inverting the coaching-to-canvas ratio.

**v2.1 Layout (Current):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  CANVAS HEADER                                                        │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                          │
│  COACHING  │  CANVAS PANEL                                            │
│  PANEL     │                                                          │
│            │  Progress Stepper                                        │
│  25%       │  Phase Content (Discovery/Research/Synthesis/Bets)       │
│  width     │                                                          │
│            │  75% width                                               │
│  Hidden    │                                                          │
│  on mobile │  Dominates the experience                                │
│            │                                                          │
└────────────┴─────────────────────────────────────────────────────────┘
```

**v3.0 Layout (New):**
```
┌──────────────────────────────────────────────────────────────────────┐
│  STRATEGY HEADER   [Phase Indicator]  [Strategy Health]  [Settings]   │
├──────────────────────────────────────────┬───────────────────────────┤
│                                          │                           │
│  COACHING CENTRE                         │  CONTEXT PANEL            │
│                                          │                           │
│  60% width                               │  40% width                │
│                                          │                           │
│  ┌────────────────────────────────────┐  │  ┌─────────────────────┐ │
│  │ Coach message with avatar          │  │  │ Phase-specific      │ │
│  │                                    │  │  │ content:            │ │
│  │ "Let's explore your competitive    │  │  │                     │ │
│  │  landscape. Who are your three     │  │  │ • Discovery:        │ │
│  │  most dangerous competitors?"      │  │  │   Company profile,  │ │
│  └────────────────────────────────────┘  │  │   doc upload        │ │
│                                          │  │                     │ │
│  ┌────────────────────────────────────┐  │  │ • Research:         │ │
│  │ User response                      │  │  │   Territory map,    │ │
│  │                                    │  │  │   progress, Q&A     │ │
│  └────────────────────────────────────┘  │  │                     │ │
│                                          │  │ • Synthesis:        │ │
│  ┌────────────────────────────────────┐  │  │   Opportunity map,  │ │
│  │ ╔══════════════════════════════╗   │  │  │   evidence trails   │ │
│  │ ║ INLINE ACTION CARD          ║   │  │  │                     │ │
│  │ ║ Territorial Insight Summary ║   │  │  │ • Bets:             │ │
│  │ ║ Your Company Territory      ║   │  │  │   Bet cards,        │ │
│  │ ║ reveals 3 key findings...   ║   │  │  │   portfolio view    │ │
│  │ ║                             ║   │  │  │                     │ │
│  │ ║ [Explore Details] [Save]    ║   │  │  │ • Activation:       │ │
│  │ ╚══════════════════════════════╝   │  │  │   Team briefs,      │ │
│  └────────────────────────────────────┘  │  │   guardrails        │ │
│                                          │  │                     │ │
│  ┌────────────────────────────────────┐  │  │ • Review:           │ │
│  │ 💬 Type your response...    [Send]│  │  │   Assumption        │ │
│  └────────────────────────────────────┘  │  │   tracker, signals  │ │
│                                          │  └─────────────────────┘ │
└──────────────────────────────────────────┴───────────────────────────┘
```

### 5.2 Responsive Behaviour

| Viewport | Coaching Centre | Context Panel | Behaviour |
|----------|----------------|---------------|-----------|
| Desktop (1280px+) | 60% | 40% | Side-by-side, both panels visible |
| Tablet (768-1279px) | 65% | 35% | Narrower context panel |
| Mobile (< 768px) | 100% | Overlay | Coaching full-width; context panel slides in from right as overlay |

### 5.3 Inline Action Cards

A key innovation inspired by BetterUp's chat interface. Within the coaching conversation, rich interactive cards appear inline:

| Card Type | Trigger | Content | Actions |
|-----------|---------|---------|---------|
| **Micro-Synthesis** | Territory completion | AI-generated territorial insight summary | [Explore Details] [Continue] |
| **Research Prompt** | Coach asks research question | Question text + context from territory | [Answer in Chat] [Open in Panel] |
| **Debate Invitation** | Tension detected in synthesis | Expert positions preview | [Enter Debate Mode] [Skip] |
| **Artefact Preview** | Artefact generated | Summary card of Strategy on a Page, Team Brief, etc. | [View Full] [Export] [Share] |
| **Roleplay Scenario** | Stakeholder communication prep | Scenario setup for practicing strategy pitch | [Start Roleplay] |
| **Signal Alert** | Market event logged or kill date approaching | Signal summary with strategic implication | [Review Impact] [Dismiss] |
| **Calibration Request** | AI scores need leadership validation | Score card with adjustment controls | [Approve] [Adjust] |

### 5.4 Context Panel Behaviour

The context panel is intelligent and phase-aware:

- **Auto-updates** based on the coaching conversation topic
- **Pinnable** -- users can pin a specific view while continuing the conversation
- **Expandable** -- double-click to temporarily expand to 60% for detailed work
- **Collapsible** -- hide entirely for focused coaching mode
- **Navigable** -- tabs at the top for switching between phase views without leaving the conversation

---

## 6. The Strategy Home

### 6.1 Purpose

Replace the current generic feature-card dashboard with a BetterUp-inspired personalised home that delivers strategic value in every visit, even a 5-minute check-in. The Strategy Home is the user's "strategic command centre" -- showing where they are, what needs attention, and what the coach recommends next.

### 6.2 Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER   F Frontera                          [Notifications] [⚙]   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Good morning, Derek 👋                                              │
│  Here's your strategic landscape today.                              │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ 📊 STRATEGY PROGRESS        │  │ 🎯 TODAY'S COACHING TOPIC    │   │
│  │                              │  │                              │   │
│  │  Phase 3: Synthesis          │  │  "Your competitive analysis  │   │
│  │  ████████████░░ 67%          │  │   shows a gap in pricing     │   │
│  │                              │  │   strategy. Let's explore     │   │
│  │  3 territories mapped        │  │   how this affects your       │   │
│  │  2 opportunities identified  │  │   strategic bets."            │   │
│  │                              │  │                              │   │
│  │  [Continue Session →]        │  │  [Chat Now]                  │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ ⚡ STRATEGIC SIGNAL          │  │ 📋 RECOMMENDED ACTIVITY      │   │
│  │                              │  │                              │   │
│  │  Competitor X launched a     │  │  Complete your Customer      │   │
│  │  new pricing tier targeting  │  │  Territory deep-dive         │   │
│  │  your mid-market segment.    │  │                              │   │
│  │                              │  │  ⏱ ~25 min · 4 questions    │   │
│  │  [Review Impact]             │  │                              │   │
│  └─────────────────────────────┘  │  [Start Activity]            │   │
│                                   └─────────────────────────────┘   │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐   │
│  │ 📅 UPCOMING REVIEW          │  │ 💡 MICRO-SYNTHESIS PREVIEW   │   │
│  │                              │  │                              │   │
│  │  Strategic Bet #2 kill date  │  │  Your Company Territory      │   │
│  │  in 12 days                  │  │  reveals: strong brand but   │   │
│  │                              │  │  capability gap in AI/ML.    │   │
│  │  Assumption: "Enterprise     │  │                              │   │
│  │  customers will pay 2x"     │  │  [View Full Insight]         │   │
│  │  Status: Untested            │  │                              │   │
│  │                              │  │                              │   │
│  │  [Prepare Review]            │  │                              │   │
│  └─────────────────────────────┘  └─────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🔮 Start a strategy conversation about...                    │   │
│  │    [___________________________________________________] ➤   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 6.3 Card Types

| Card | Data Source | Appears When | Adapts To |
|------|-----------|-------------|-----------|
| **Strategy Progress** | `conversations.framework_state`, `territory_insights`, `synthesis_outputs` | Always | Current phase, completion percentage |
| **Today's Coaching Topic** | AI-generated based on phase + archetype + gaps | Always | Strategic archetype, identified blind spots, stalled areas |
| **Strategic Signal** | `strategy_signals` table + AI monitoring | Signal logged or market event detected | Industry, competitive landscape, assumption relevance |
| **Recommended Activity** | Phase progress + time since last session | User hasn't engaged in > 3 days | Archetype (Operators get execution tasks; Visionaries get research tasks) |
| **Upcoming Review** | `assumption_register` kill dates | Kill date within 14 days | Bet status, assumption validation state |
| **Micro-Synthesis Preview** | `synthesis_outputs` partial results | Territory completed but full synthesis not yet run | Completed territory data |

---

## 7. Strategic Maturity Assessment

### 7.1 Purpose

Create a personalised coaching journey by assessing each leader's strategic maturity across five dimensions. This directly implements BetterUp's "Whole Person Model" pattern adapted for strategic leadership.

### 7.2 Assessment Flow

**Placement:** After the existing onboarding wizard, before first strategy session.

**Format:** 20 Likert-scale statements rated on a 5-point scale (Strongly Disagree → Strongly Agree), plus 3 situational choice questions.

**Duration:** 8-12 minutes.

**Progress indicator:** "X/23 Completed" with progress bar (matching BetterUp's 29/137 pattern).

### 7.3 Five Assessment Dimensions

| Dimension | What It Measures | Sample Statement |
|-----------|-----------------|------------------|
| **Strategic Vision** | Ability to think long-term, see market trends, articulate a winning aspiration | "I can clearly articulate where my product should be positioned in 3 years" |
| **Research Rigour** | Commitment to evidence-based decisions, data literacy, research methodology | "I regularly validate strategic assumptions with customer data before committing resources" |
| **Execution Discipline** | Ability to translate strategy into action, set metrics, maintain accountability | "My team has clear success metrics for every strategic initiative we pursue" |
| **Stakeholder Alignment** | Cross-functional communication, influence without authority, alignment building | "I regularly align with engineering, sales, and marketing on strategic priorities before making commitments" |
| **Adaptive Capacity** | Willingness to change course, learning orientation, comfort with uncertainty | "When key assumptions are invalidated, I quickly adjust my strategic approach rather than persisting" |

### 7.4 Archetype Classification

Based on assessment scores, users are classified into one of four primary archetypes:

```
                    HIGH STRATEGIC VISION
                           │
              Visionary     │     Diplomat
            (Vision +       │   (Vision +
             Research)      │    Alignment)
                           │
   LOW ────────────────────┼──────────────────── HIGH
   EXECUTION               │              STAKEHOLDER
                           │              ALIGNMENT
              Analyst       │     Operator
            (Research +     │   (Execution +
             Adaptive)      │    Alignment)
                           │
                    LOW STRATEGIC VISION
```

### 7.5 Results Display

Inspired by BetterUp's "You are a Strategist" result card:

```
┌──────────────────────────────────────────┐
│                                          │
│         Your Strategic Profile           │
│                                          │
│      Today you are                       │
│      ╔══════════════════════╗            │
│      ║   The Operator       ║            │
│      ╚══════════════════════╝            │
│                                          │
│   As an Operator, you excel at           │
│   turning plans into action. Your        │
│   teams deliver. Your growth area        │
│   is stepping back from execution        │
│   to see the broader strategic           │
│   landscape.                             │
│                                          │
│   ┌──────────┐  ┌──────────┐            │
│   │ STRENGTH │  │ GROWTH   │            │
│   │          │  │   AREA   │            │
│   │   87     │  │    34    │            │
│   │Execution │  │Strategic │            │
│   │Discipline│  │ Vision   │            │
│   └──────────┘  └──────────┘            │
│                                          │
│   [View Full Report →]                   │
│                                          │
│   [Begin Your Strategy Journey →]        │
│                                          │
└──────────────────────────────────────────┘
```

### 7.6 How Assessment Adapts the Journey

| Journey Element | Operator Adaptation | Visionary Adaptation | Analyst Adaptation | Diplomat Adaptation |
|----------------|--------------------|--------------------|-------------------|-------------------|
| **Discovery coaching** | "Let's zoom out from your roadmap -- what MARKET opportunity are you solving?" | "Great vision -- now let's ground it. What specific evidence supports this direction?" | "I see you've done thorough analysis. What decision does this analysis lead to?" | "You've aligned stakeholders -- but what would YOU prioritise if alignment wasn't a constraint?" |
| **Research depth** | Fewer questions, more strategic framing prompts | Standard questions + evidence demand prompts | Full question set + methodology hints | Standard questions + stakeholder perspective prompts |
| **Synthesis emphasis** | Opportunities + execution implications | Opportunities + evidence strength | Opportunities + confidence ratings | Opportunities + alignment implications |
| **Coaching intensity** | Challenge on strategic abstraction | Challenge on specificity | Challenge on speed to decision | Challenge on decisiveness |
| **Recommended activities** | "Strategic Thinking" exercises | "Evidence Grounding" exercises | "Bias for Action" exercises | "Decisive Leadership" exercises |

---

## 8. Redesigned User Journey

### 8.1 Journey Overview

```
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │          │    │          │    │          │    │          │    │          │    │          │
   │DISCOVERY │───▶│ RESEARCH │───▶│SYNTHESIS │───▶│STRATEGIC │───▶│STRATEGIC │───▶│ STRATEGY │
   │          │    │          │    │          │    │  BETS    │    │ACTIVATION│    │  REVIEW  │
   │ 15 min   │    │ 3x25 min │    │ 10 min   │    │ 30 min   │    │ 20 min   │    │ Ongoing  │
   │          │    │          │    │          │    │          │    │          │    │          │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
       │                │               │               │               │               │
   Strategic        Territorial      Strategy on    Strategic      Team Briefs     Assumption
   Context          Insight          a Page         Bets Doc       OKR Cascade     Tracker
   Summary          Summaries                       Guardrails     Stakeholder     Signal Log
                                                                   Packs           Versions
```

### 8.2 Phase 1: Discovery (Coaching-Led Interview)

**Duration:** ~15 minutes
**Coaching Mode:** Active interview (not passive file upload)
**Archetype Adaptation:** Yes -- question framing adapts to archetype

#### What Changes from v2.1

| v2.1 | v3.0 |
|------|------|
| Passive: Upload files, fill in company context form | Active: Coach leads a structured interview exploring "why" |
| Coach waits for user to engage | Coach asks probing questions from the start |
| Primarily a data-gathering exercise | A strategic context-setting conversation |
| Minimal coaching value in this phase | First coaching insights delivered within 10 minutes |

#### Coaching Centre Experience

The coach leads a 5-question structured interview:

1. **"What's driving this strategy effort right now?"** -- Uncovers urgency, whether transformation is proactive or reactive
2. **"What does winning look like for your organisation in 3 years?"** -- Establishes winning aspiration (PTW)
3. **"What have you tried before, and what happened?"** -- Identifies transformation recovery context
4. **"Who needs to be aligned for this strategy to succeed?"** -- Maps stakeholder landscape
5. **"What's the one thing you're most uncertain about?"** -- Identifies the strategic anxiety to address first

After each answer, the coach synthesises and probes deeper before moving on.

#### Context Panel Content

- **Company Profile** (auto-populated from onboarding, editable)
- **Document Upload** area for supporting materials
- **AI Research Assistant** for synthetic document generation
- **Strategic Context Summary** (builds in real-time as interview progresses)

#### Micro-Gratification Moment

After the 5-question interview (~15 min), the coach delivers the first artefact:

> **Inline Action Card: Strategic Context Summary**
> "Based on our conversation, here's your strategic starting point: [Company] is pursuing [transformation type] driven by [urgency factor]. Your winning aspiration is [aspiration]. Key uncertainty: [uncertainty]. Key stakeholder: [stakeholder].
>
> This gives us a strong foundation. Ready to map your strategic terrain?"

#### Phase Transition

Coach-initiated: "You've established a solid strategic context. I recommend we begin mapping your strategic terrain. Shall we start with your Company Territory, Customer Territory, or Market Territory?"

---

### 8.3 Phase 2: Research (Guided Exploration)

**Duration:** ~25 minutes per territory (3 territories, can be separate sessions)
**Coaching Mode:** Conversational research guidance
**Archetype Adaptation:** Question depth and methodology hints vary

#### What Changes from v2.1

| v2.1 | v3.0 |
|------|------|
| 36 text questions in 9 areas, all textarea format | Coach-led exploration, ~27 questions, varied formats |
| No visible progress reward during research | Micro-synthesis after each territory completion |
| All questions same depth regardless of user | Archetype-adapted question complexity |
| No methodology guidance | Research method hints ("Try: 5 customer interviews, win/loss analysis") |
| No confidence tracking | Confidence rating per response (Fact / Estimate / Guess) |

#### Coaching Centre Experience

The coach guides the user through each territory conversationally:

```
Coach: "Let's explore your Customer Territory. I'd like to understand
       who your most valuable customers are and what they're struggling with.

       Tell me: who are your primary customer segments, and how do you
       currently differentiate between them?"

User:  "We have enterprise and mid-market segments, mostly differentiated
       by deal size and support needs."

Coach: "That's a common segmentation. Let me push you a bit -- beyond
       deal size, what BEHAVIOURAL differences do you see? Do enterprise
       and mid-market customers use your product differently? Have
       different success patterns? Different churn triggers?"

       ╔═══════════════════════════════════════════════╗
       ║  CONFIDENCE CHECK                             ║
       ║  How confident are you in this segmentation?  ║
       ║  [High - Based on data]                       ║
       ║  [Medium - Based on experience]               ║
       ║  [Low - This is a guess]                      ║
       ╚═══════════════════════════════════════════════╝
```

#### Context Panel Content

- **Territory Map** showing all 3 territories with progress indicators
- **Research Area Questions** for the current territory (synced with coaching conversation)
- **Response Capture** -- answers populate both from chat and direct panel input
- **Progress Ring** per territory (0/3 areas → 3/3 areas)
- **Time Estimate** ("~15 minutes remaining for this territory")

#### Micro-Gratification: Territorial Insight Summary

After completing each territory (3 research areas), the coach delivers a territorial insight summary:

> **Inline Action Card: Company Territory Insight Summary**
>
> Your Company Territory reveals three key findings:
> 1. **Capability Strength:** Strong engineering culture but weak go-to-market muscle
> 2. **Strategic Constraint:** Legacy product architecture limits speed to market
> 3. **Hidden Asset:** Customer success team has deep vertical expertise untapped by product
>
> Confidence level: Medium (2 of 3 areas based on experience, 1 on data)
>
> [View Detailed Summary] [Continue to Customer Territory →]

This is the critical journey energy fix -- users now receive strategic value after ~25 minutes instead of waiting 2.5+ hours for full synthesis.

---

### 8.4 Phase 3: Synthesis (Strategic Clarity)

**Duration:** ~10 minutes (AI generation + coach-guided exploration)
**Coaching Mode:** Presenting and challenging strategic insights
**Key Artefact:** Strategy on a Page

#### Coaching Centre Experience

The coach orchestrates the synthesis moment:

```
Coach: "You've mapped all three territories. I've synthesised your research
       across Company, Customer, and Competitor landscapes using the
       Playing to Win framework. Let me walk you through what emerged."

       ╔═══════════════════════════════════════════════╗
       ║  STRATEGY ON A PAGE                           ║
       ║                                               ║
       ║  Winning Aspiration: [Generated]               ║
       ║  Where to Play: [Generated]                    ║
       ║  How to Win: [Generated]                       ║
       ║  Key Capabilities: [Generated]                 ║
       ║  Management Systems: [Generated]               ║
       ║                                               ║
       ║  [View Full] [Export] [Share]                  ║
       ╚═══════════════════════════════════════════════╝

Coach: "Two things stand out. First, your highest-scoring opportunity
       is in [area], which aligns with your Company Territory strength.
       Second, there's a significant tension between [tension A] and
       [tension B].

       Before we proceed -- what surprises you here? What feels right,
       and what feels off?"
```

The "So What?" moment (from Critical Analysis coaching gap #6) is built directly into the conversation:

```
Coach: "Of these opportunities, which one scares you the most?
       That's often where the real strategy is."
```

#### Debate Mode (Enhanced)

Triggered naturally from the coaching conversation when tensions are explored:

```
Coach: "This tension has strong expert perspectives on both sides.
       Would you like to explore an Expert Debate between
       [Expert A] and [Expert B]?

       ╔═══════════════════════════════════════════════╗
       ║  EXPERT DEBATE: [Tension Title]               ║
       ║                                               ║
       ║  Position A: [Expert] argues [position]       ║
       ║  Position B: [Expert] argues [position]       ║
       ║                                               ║
       ║  [Enter Debate Mode] [Skip for Now]           ║
       ╚═══════════════════════════════════════════════╝
```

#### Context Panel Content

- **Strategic Opportunity Map** (2x2 matrix)
- **Opportunity Cards** with evidence trails
- **Tension Cards** with debate buttons
- **Strategy on a Page** pinned view

---

### 8.5 Phase 4: Strategic Bets (Commitment)

**Duration:** ~30 minutes
**Coaching Mode:** Challenging with escalating intensity
**Key Enhancement:** Leadership Calibration step

#### Coaching Escalation

The coach's challenge intensity increases in this phase (addressing Critical Analysis gap: "No challenge escalation"):

```
Coach (early): "Good start on this bet. Could you add a more
               specific success metric?"

Coach (mid):   "This bet has vague timing. When exactly would you
               expect to see results? Be specific -- month, quarter?"

Coach (late):  "I need to push back here. This bet has no kill
               criteria, vague metrics, and no evidence link.
               I cannot recommend your team invest resources
               without addressing these gaps. Let's fix this now."
```

#### Leadership Calibration

After AI generates opportunity scores, an inline card requests calibration:

> **Inline Action Card: Leadership Calibration**
>
> The AI scored your opportunities based on research evidence. Your judgment matters too. Review and adjust any scores where your experience differs from the AI's assessment.
>
> | Opportunity | AI Score | Your Score | Rationale |
> |-------------|----------|------------|-----------|
> | [Opp 1]     | 8.2      | [____]     | [____]    |
> | [Opp 2]     | 6.7      | [____]     | [____]    |
>
> [Approve AI Scores] [Submit Adjusted Scores]

#### Key Artefacts Generated

- **Strategic Bets Document** (existing, enhanced with calibration rationale)
- **Strategic Guardrails** (NEW) -- "We will / We will not" statements derived from synthesis tensions
- **Effort vs. Impact Plot** (NEW) -- interactive scatter visualisation of all bets

---

### 8.6 Phase 5: Strategic Activation (NEW)

**Duration:** ~20 minutes
**Coaching Mode:** Execution bridge facilitation
**Purpose:** Bridge the #1 gap identified in the Critical Analysis -- strategy disconnected from execution

> *"This is where strategy stops being a document and starts being organisational behaviour."*

#### 5a. Team Brief Generator

For each strategic bet, the coach generates an audience-appropriate team brief:

```
Coach: "Your strategic bets are solid. Now let's make sure they reach
       your teams in a way they can act on. I'll generate a Team Brief
       for each bet.

       ╔═══════════════════════════════════════════════════╗
       ║  TEAM BRIEF: [Bet Title]                          ║
       ║                                                    ║
       ║  CONTEXT: Why this matters                         ║
       ║  [Generated narrative linking research to bet]     ║
       ║                                                    ║
       ║  PROBLEM TO SOLVE: What we need to figure out      ║
       ║  [Generated from bet hypothesis]                   ║
       ║                                                    ║
       ║  GUARDRAILS: What we will NOT do                   ║
       ║  [Generated from synthesis tensions]               ║
       ║                                                    ║
       ║  SUCCESS METRICS: How we'll know it's working      ║
       ║  [From bet success criteria]                       ║
       ║                                                    ║
       ║  KILL CRITERIA: When we stop                       ║
       ║  [From bet kill criteria]                          ║
       ║                                                    ║
       ║  [Edit] [Export] [Share with Team]                 ║
       ╚═══════════════════════════════════════════════════╝
```

#### 5b. OKR Cascade Proposals

```
Coach: "Based on your strategic bets, here are proposed OKRs
       that cascade strategy to team-level objectives.

       ╔═══════════════════════════════════════════════════╗
       ║  OKR PROPOSAL: Q2 2026                            ║
       ║                                                    ║
       ║  OBJECTIVE: [Derived from bet]                     ║
       ║                                                    ║
       ║  KR1: [Measurable result from success metrics]     ║
       ║  KR2: [Measurable result from success metrics]     ║
       ║  KR3: [Leading indicator from research]            ║
       ║                                                    ║
       ║  LINKED BET: [Bet title]                           ║
       ║  EVIDENCE: [Research territory reference]          ║
       ║                                                    ║
       ║  [Approve] [Adjust] [Push to Jira/Linear]         ║
       ╚═══════════════════════════════════════════════════╝
```

#### 5c. Decision Framework

```
Coach: "For daily prioritisation, here's a decision framework
       derived from your strategy.

       When your team faces a trade-off:
       ✅ PRIORITISE: [Derived from winning strategy]
       ⚠️ CONSIDER: [Derived from capability analysis]
       ❌ DEPRIORITISE: [Derived from guardrails]

       Example: When choosing between speed-to-market and technical
       robustness, prioritise speed-to-market for Bet #1 (market
       window opportunity) and robustness for Bet #3 (enterprise
       reliability requirement)."
```

#### 5d. Stakeholder Communication Pack

Generated with audience-specific views:

| Audience | View | Content Emphasis |
|----------|------|-----------------|
| **CPO/CEO** | Strategic Overview | Portfolio balance, market positioning, resource implications, 90-day milestones |
| **CTO** | Capability Requirements | Technical capabilities needed, architecture implications, build-vs-buy decisions |
| **VP Sales** | Market Positioning | Competitive differentiation, customer segment targeting, pricing implications |
| **Product Managers** | Team Brief | Problem context, guardrails, success metrics, decision framework |

---

### 8.7 Phase 6: Strategy Review (NEW -- Living Strategy)

**Duration:** Ongoing (monthly review cadence)
**Coaching Mode:** Proactive review prompts
**Purpose:** Make strategy adaptive, not static (addressing Critical Analysis gap #2)

> *"A strategy that doesn't change is a strategy that's already obsolete."*

#### 6a. Assumption Tracker Dashboard

```
┌──────────────────────────────────────────────────────────────────┐
│  ASSUMPTION TRACKER                                               │
│                                                                   │
│  ████████░░░░░░░░ 35% Validated                                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ✅ VALIDATED (3)                                             │ │
│  │   "Enterprise customers will pay premium for AI features"   │ │
│  │   Evidence: Q1 sales data shows 2.3x ARPU for AI tier      │ │
│  │                                                             │ │
│  │ ❌ INVALIDATED (1)                                          │ │
│  │   "Competitors won't enter mid-market for 12 months"        │ │
│  │   Signal: Competitor X launched mid-market tier (Feb 14)     │ │
│  │   ⚠️ STRATEGIC IMPACT: Affects Bet #2 -- review needed     │ │
│  │                                                             │ │
│  │ ❓ UNTESTED (5)                                              │ │
│  │   "Customer churn is driven by missing features, not price" │ │
│  │   Next test: Win/loss analysis Q2                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  [Log New Signal] [Schedule Review] [Compare to Last Month]      │
└──────────────────────────────────────────────────────────────────┘
```

#### 6b. Signal Log

Users record market events that may affect strategy:

| Signal Type | Example | Triggered Action |
|------------|---------|-----------------|
| **Competitor move** | "Competitor X launched new pricing tier" | Flag affected assumptions; suggest strategy review |
| **Customer signal** | "Lost 3 enterprise deals citing missing feature" | Update Customer Territory confidence; flag affected bets |
| **Market shift** | "Regulatory change in target market" | Prompt full strategy review; update all territories |
| **Internal change** | "Key engineering hire enables new capability" | Update Company Territory; surface new opportunities |

#### 6c. Strategy Versioning

- **Auto-snapshot** strategy state at each phase completion
- **Diff view** comparing current strategy to any previous version
- **Change narrative** explaining what changed and why
- **Timeline view** showing strategic evolution over time

#### 6d. Review Cadence

| Trigger | Review Type | Duration | Output |
|---------|-----------|----------|--------|
| **Kill date reached** | Bet review | 15 min | Updated bet status (continue/pivot/kill) |
| **Assumption invalidated** | Targeted review | 30 min | Updated synthesis + affected bets |
| **Monthly cadence** | Health check | 15 min | Updated assumption tracker + signal review |
| **Quarterly cadence** | Full strategy review | 60 min | New strategy version with diff |

---

## 9. Coaching Enhancements

### 9.1 Enhanced Coaching Capabilities

| Capability | Description | Implementation |
|-----------|-------------|---------------|
| **Blind Spot Detection** | Coach identifies what user HASN'T mentioned | Track research coverage; flag gaps ("I notice you haven't mentioned customer retention. Is churn a non-issue, or a blind spot?") |
| **Challenge Escalation** | Coaching intensity increases through journey | Discovery: gentle probing → Bets: demanding ("I cannot recommend proceeding without kill criteria") |
| **Archetype Adaptation** | Coaching style matches strategic maturity | Operators get strategic framing; Visionaries get execution grounding; Analysts get bias-for-action; Diplomats get decisiveness |
| **Methodology Hints** | Guide HOW to answer research questions | "Try segmenting by: job-to-be-done, willingness to pay, acquisition channel" |
| **"So What?" Forcing** | Push for commitment after synthesis | "Of these opportunities, which one scares you the most? That's often where the real strategy is." |
| **Portfolio-Level Thinking** | Examine bets collectively | Balance, coherence, sequencing, optionality analysis across all bets |
| **Post-Phase Reflection** | Learning moments after each phase | "What surprised you? What assumption changed? What will you do differently?" |
| **Proactive Re-engagement** | Coach initiates contact after inactivity | "It's been 2 weeks since our last session. Your Competitor Territory is still unmapped -- ready to continue?" |

### 9.2 Inline Action Cards in Chat

Inspired by BetterUp's chat interface where interactive elements appear within the conversation flow:

- **Roleplay buttons** for practicing stakeholder communication ("Experience Roleplay" pattern from BetterUp)
- **Quick-capture forms** for research responses without leaving chat
- **Artefact preview cards** showing generated outputs inline
- **Debate invitations** with expert position previews
- **Calibration controls** for score adjustments
- **Signal alerts** for strategic events requiring attention

---

## 10. Artefact Suite

### 10.1 Complete Artefact Inventory

| Artefact | Format | Audience | Generated When | Shareable |
|----------|--------|----------|---------------|-----------|
| **Strategic Context Summary** | Inline card → PDF | CPO | End of Discovery | Yes |
| **Territorial Insight Summary** (x3) | Inline card → PDF | CPO | After each territory | Yes |
| **Research Evidence Summary** | Report → PDF | CPO + Team | After all territories | Yes |
| **Strategy on a Page** | Interactive view → PDF → Link | All personas | After Synthesis | Yes (living link) |
| **Strategic Opportunity Map** | Interactive 2x2 → PDF | CPO + VP Product | After Synthesis | Yes |
| **Strategic Bets Document** | Interactive cards → PDF | CPO + VP Product | After Bets phase | Yes |
| **Strategic Guardrails** | Document → PDF → Link | All personas | After Bets phase | Yes (living link) |
| **Team Briefs** (per bet) | Document → PDF → Link | PM | After Activation | Yes (living link) |
| **OKR Cascade** | Structured data → PDF | CPO + PM | After Activation | Yes |
| **Decision Framework** | Document → Link | PM | After Activation | Yes (living link) |
| **Stakeholder Communication Pack** | Multi-view → PDF per audience | VP Product, cross-functional | After Activation | Yes |
| **Assumption Register** | Dashboard → PDF | CPO | Phase 6 (ongoing) | Yes |
| **Strategic Impact Summary** | Dashboard → PDF | VP Product (board reporting) | Quarterly review | Yes |
| **Strategy Version History** | Interactive diff view | CPO | Auto-captured | No (internal) |

### 10.2 Living vs. Static Artefacts

A key distinction in v3.0:

- **Living artefacts** (shareable links that auto-update): Strategy on a Page, Strategic Guardrails, Team Briefs, Decision Framework
- **Point-in-time artefacts** (PDF snapshots): Research Evidence Summary, Strategic Bets Document, Stakeholder Communication Pack
- **Continuous artefacts** (always updating): Assumption Register, Strategic Impact Summary, Strategy Version History

---

## 11. Phased Implementation Roadmap

### 11.1 Sprint Plan

| Phase | Sprints | Duration | Focus | Key Deliverables | Dependencies |
|-------|---------|----------|-------|-------------------|-------------|
| **Foundation** | 1 | 1 week | Reduce friction in existing journey | Reduce questions 36→27; add time estimates per phase; add confidence ratings per response; add post-phase reflection prompts; kill-date notification triggers | None |
| **Journey Energy** | 2-3 | 2 weeks | Progressive gratification | Micro-synthesis after each territory (territorial insight summaries); Duolingo-style progress indicators with completion %s; Strategy on a Page generator from synthesis | Foundation |
| **Layout Inversion** | 4-5 | 2 weeks | Coaching-central redesign | New 60/40 layout in v2 codebase; coaching centre component; context panel with phase-aware content; inline action cards in chat | Foundation |
| **Assessment** | 5-6 | 2 weeks | Strategic Maturity | Assessment flow in onboarding; 23-question instrument; archetype classification algorithm; results display with radar chart; coaching adaptation hooks | Layout Inversion |
| **Strategy Home** | 6-7 | 2 weeks | Personalised dashboard | BetterUp-style Strategy Home; 6 contextual card types; always-available coach entry; personalised greeting and recommendations | Assessment, Layout Inversion |
| **Coaching Enhancement** | 7-8 | 2 weeks | Deepen coaching quality | Blind spot detection; challenge escalation; methodology hints; "So What?" moment; archetype-adapted prompts | Assessment |
| **Strategic Activation** | 8-10 | 3 weeks | Phase 5 | Team Brief Generator; OKR cascade proposals; Decision Framework output; Stakeholder Communication Pack with audience views | Coaching Enhancement |
| **Artefact Suite** | 10-11 | 2 weeks | Enhanced outputs | Strategic Guardrails generator; Assumption Register; Research Evidence Summary; living artefact links (not just PDF) | Strategic Activation |
| **Living Strategy** | 11-13 | 3 weeks | Phase 6 | Assumption tracking dashboard; Signal Log; strategy versioning with diff view; review cadences tied to kill dates; outcome tracking | Artefact Suite |
| **Collaboration** | 14-15 | 2 weeks | Multi-user | Stakeholder input mode; team commenting on synthesis; shared strategy views with role-based access | Living Strategy |
| **Integrations** | 16+ | Ongoing | Ecosystem | Slack/Teams nudges; Jira/Linear push; calendar-integrated review sessions; strategy context in workflow tools | Collaboration |

### 11.2 Value Delivery Timeline

```
Week 1 ──── Foundation ────────── Quick wins reduce friction
              │
Week 2-3 ─── Journey Energy ──── First micro-synthesis; users see value in 25 min
              │
Week 4-5 ─── Layout Inversion ── Coaching becomes central experience
              │
Week 5-7 ─── Assessment + Home ── Personalised daily value; archetype coaching
              │
Week 7-8 ─── Coaching Quality ─── Proactive, adaptive coaching with escalation
              │
Week 8-10 ── Phase 5 ──────────── Strategy reaches teams (execution bridge)
              │
Week 10-11 ─ Artefact Suite ───── Living strategy artefacts replace static PDFs
              │
Week 11-13 ─ Phase 6 ──────────── Strategy becomes adaptive, continuous practice
              │
Week 14-15 ─ Collaboration ────── Multi-stakeholder strategic development
              │
Week 16+ ──── Integrations ────── Strategy embedded in daily workflow tools
```

---

## 12. Data Model Changes

### 12.1 New Tables

```sql
-- Strategic Maturity Assessment results
CREATE TABLE strategic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  assessment_version INTEGER DEFAULT 1,
  responses JSONB NOT NULL,           -- {question_id: score} pairs
  dimension_scores JSONB NOT NULL,    -- {vision: 72, rigour: 85, ...}
  archetype TEXT NOT NULL,            -- 'operator' | 'visionary' | 'analyst' | 'diplomat'
  archetype_description TEXT,
  strength_dimension TEXT,
  growth_dimension TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  reassessed_at TIMESTAMPTZ          -- For 90-day reassessment
);

-- Trackable strategic assumptions
CREATE TABLE assumption_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  assumption_text TEXT NOT NULL,
  source_type TEXT,                   -- 'wwhbt' | 'synthesis' | 'bet' | 'manual'
  source_id TEXT,                     -- Reference to originating artefact
  status TEXT DEFAULT 'untested',     -- 'untested' | 'testing' | 'validated' | 'invalidated'
  confidence TEXT DEFAULT 'medium',   -- 'high' | 'medium' | 'low'
  evidence TEXT,                      -- Evidence for status change
  test_method TEXT,                   -- How this assumption will be tested
  review_date DATE,                   -- When to review this assumption
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated strategic artefacts
CREATE TABLE strategic_artefacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  artefact_type TEXT NOT NULL,        -- 'team_brief' | 'guardrails' | 'okr_cascade' |
                                      -- 'decision_framework' | 'stakeholder_pack' |
                                      -- 'strategy_on_a_page' | 'evidence_summary' |
                                      -- 'impact_summary'
  title TEXT NOT NULL,
  content JSONB NOT NULL,             -- Structured artefact content
  audience TEXT,                      -- 'all' | 'cpo' | 'cto' | 'sales' | 'pm'
  linked_bet_id TEXT,                 -- For bet-specific artefacts (team briefs)
  share_token TEXT UNIQUE,            -- For shareable living links
  is_living BOOLEAN DEFAULT FALSE,    -- Auto-updates with strategy changes
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market signals and events
CREATE TABLE strategy_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  signal_type TEXT NOT NULL,          -- 'competitor' | 'customer' | 'market' | 'internal'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  strategic_impact TEXT,              -- AI-assessed impact on strategy
  affected_assumptions UUID[],        -- Links to assumption_register
  affected_bets TEXT[],               -- Links to strategic bet IDs
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strategy version snapshots
CREATE TABLE strategy_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,            -- Complete strategy state at time of snapshot
  change_summary TEXT,                -- AI-generated narrative of what changed
  trigger TEXT,                       -- 'phase_completion' | 'manual' | 'review' | 'signal'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 12.2 Extended Existing Fields

```sql
-- Extended framework_state (conversations.framework_state JSONB)
{
  "version": 3,
  "currentPhase": "discovery" | "research" | "synthesis" | "bets" | "activation" | "review",
  "highestPhaseReached": "...",
  "archetype": "operator" | "visionary" | "analyst" | "diplomat",
  "archetypeScores": { "vision": 72, "rigour": 85, "execution": 91, "alignment": 65, "adaptive": 48 },
  "microSynthesisResults": {
    "company": { "generated": true, "summary": "...", "keyFindings": [...] },
    "customer": { "generated": true, "summary": "...", "keyFindings": [...] },
    "competitor": { "generated": false }
  },
  "strategyOnAPage": { "generated": true, "version": 2 },
  "activationOutputs": {
    "teamBriefs": [...],
    "guardrails": [...],
    "okrCascade": [...],
    "decisionFramework": { "generated": true }
  },
  "reviewCadence": {
    "lastReview": "2026-03-15",
    "nextReview": "2026-04-15",
    "reviewsCompleted": 2
  }
}
```

---

## 13. Technical Considerations

### 13.1 Architecture Approach

- **Build on v2 codebase** (`product-strategy-agent-v2/`) as the foundation
- **Shared lib layer** remains common: `src/lib/agents/strategy-coach/`, `src/lib/synthesis/`, `src/lib/knowledge/`, `src/types/`
- **New components** for coaching-central layout, assessment flow, strategy home, inline action cards
- **New API routes** for assessment, activation artefacts, signals, versions, shared links
- **Extended agent system prompt** to inject archetype, coaching mode, and micro-synthesis capabilities

### 13.2 Key Component Changes

| Component | Change |
|-----------|--------|
| `ProductStrategyAgentInterface.tsx` | Invert from 25/75 to 60/40; coaching centre becomes primary |
| `CoachingPanel/` | Transform from sidebar to full coaching centre with inline cards |
| `CanvasPanel/` | Transform into context panel with phase-aware content |
| `DiscoverySection.tsx` | Simplify to context panel role; interview logic moves to coaching |
| `ResearchSection.tsx` | Becomes territory progress + question panel; coaching drives exploration |
| `SynthesisSection.tsx` | Becomes opportunity map + evidence display; coach presents synthesis |
| New: `StrategyHome.tsx` | Personalised dashboard with contextual cards |
| New: `AssessmentFlow.tsx` | Onboarding assessment with Likert scales and results |
| New: `InlineActionCard.tsx` | Rich interactive cards rendered within chat messages |
| New: `ActivationSection.tsx` | Team briefs, OKRs, guardrails, stakeholder packs |
| New: `StrategyReviewSection.tsx` | Assumption tracker, signal log, versioning |

### 13.3 AI Agent Extensions

The strategy coach agent (`src/lib/agents/strategy-coach/system-prompt.ts`) needs:

- **Archetype injection**: Coaching style instructions based on assessment results
- **Phase-aware coaching prompts**: Different coaching behaviour per phase
- **Micro-synthesis generation**: Ability to generate territorial insights mid-journey
- **Blind spot detection logic**: Track what research areas have been covered and flag gaps
- **Challenge escalation rules**: Intensity increases through phases
- **Artefact generation prompts**: Templates for team briefs, guardrails, OKRs, etc.
- **Review mode**: Prompts for assumption review, signal impact assessment

### 13.4 Performance Considerations

- **Micro-synthesis** adds 1 additional Claude API call per territory completion (~3 extra calls per strategy)
- **Living artefact links** require real-time data fetching (consider caching with 5-min TTL)
- **Assessment scoring** should be computed client-side (no API call needed)
- **Strategy versioning** snapshots are JSONB inserts, low cost

---

## 14. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Layout inversion disorients existing users | Medium | Medium | Offer "Classic View" toggle for transition period; gradual rollout via v2 |
| Assessment feels like a barrier to starting | Medium | High | Make assessment skippable with "Assess Later" option; show immediate value preview |
| Coaching-central layout feels chatbot-like | Low | High | Rich inline cards + context panel prevent it feeling like "just a chatbot"; premium visual design |
| Micro-synthesis quality insufficient | Medium | Medium | Use existing synthesis pipeline with reduced scope; iterate prompt quality |
| Phase 5/6 scope creep | High | Medium | Strict MVP scoping per sprint; user testing between sprints |
| Integration complexity (Slack/Teams/Jira) | High | Low | Defer to Sprint 16+; focus on core platform first |

---

## 15. Success Criteria

### 15.1 Launch Criteria (per sprint)

| Sprint | Ship When |
|--------|-----------|
| Foundation | All quick wins deployed; no increase in error rates |
| Journey Energy | Micro-synthesis generates meaningful insights for >80% of test users |
| Layout Inversion | Task completion time does not increase; user satisfaction does not decrease |
| Assessment | >90% of users complete assessment; archetype distribution is roughly balanced |
| Strategy Home | Return visit rate increases by >25% |
| Phase 5 | >60% of strategies generate at least 1 team brief |
| Phase 6 | >40% of users log at least 1 signal within 30 days |

### 15.2 Overall v3.0 Success

The transformation is successful when:
1. **Time to value drops from hours to minutes** (micro-synthesis within 25 min)
2. **Strategy reaches teams** (team briefs generated and shared)
3. **Users return** (weekly engagement, not one-time use)
4. **Strategy adapts** (assumptions tracked, signals logged, versions created)
5. **Multiple stakeholders engaged** (shared artefacts viewed by 3+ people)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0 | February 2026 | Derek Smith | Initial v3.0 vision PRD based on UX Journey Research, BetterUp Design analysis, and PSC Critical Analysis |

---

*Cross-referenced with:*
- *Product Strategy Coach Critical Analysis (February 2026)*
- *Frontera UX Journey Research (February 2026)*
- *Product Strategy Agent PRD v2.1 (January 2026)*
- *BetterUp Design Reference (BetterUp Grow Platform, Fall 2025)*
