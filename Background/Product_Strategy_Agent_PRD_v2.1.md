# PRODUCT REQUIREMENTS DOCUMENT

# Frontera Strategic Context Module
## Guided Strategy Development with AI-Assisted Coaching

**v2.1 — Based on Strategy Coach v2 Mockup**

---

| Field | Value |
|-------|-------|
| **Version** | 2.1 |
| **Date** | January 2026 |
| **Author** | Derek Smith |
| **Status** | Draft |
| **Design Reference** | Strategy Coach v2 Mockup (localhost:3000/dashboard/strategy-coach-v2) |

---

## 1. Executive Summary

### Design Hypothesis

The Frontera Strategic Context Module is a **guided strategy development platform** that uses a "Strategic Terrain" metaphor to help enterprise leaders navigate their product strategy transformation. The interface combines:

- **Persistent AI Coach sidebar** for contextual guidance and Q&A
- **Scrollable main content** with phased, card-based workflow
- **Progressive disclosure** through "terrain mapping" that unlocks as users complete phases
- **Document upload** to ground strategy in real source materials

### Core Design Principle

> **"Navigate your strategic terrain with an expert guide beside you."**

The coach is always present but never blocking. Users scroll through their strategy journey while the coach provides contextual support.

---

## 2. Interface Architecture

### 2.1 Primary Layout: Two-Panel Design

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐│
│  │ F Frontera    Navigating to your Product Strategy    [Export] [Share] [Generate]││
│  └─────────────────────────────────────────────────────────────────────────────────┘│
├────────────────────────┬────────────────────────────────────────────────────────────┤
│                        │                                                            │
│  COACH SIDEBAR         │  MAIN CONTENT AREA (Scrollable)                            │
│  (~25% width)          │  (~75% width)                                              │
│                        │                                                            │
│  ┌──────────────────┐  │  ┌──────────────────────────────────────────────────────┐  │
│  │ SESSION INFO     │  │  │  PROGRESS STEPPER                                    │  │
│  │ DISCOVERY PHASE  │  │  │  ●──────○──────○──────○                              │  │
│  │ New Strategy     │  │  │  Discovery  3Cs    Synthesis  Strategic              │  │
│  │ Session          │  │  │  Context    Research Formation Bets                  │  │
│  │                  │  │  │  Setting    Terrain           Route                  │  │
│  │ • 3Cs Analysis   │  │  │            Mapping            Planning               │  │
│  └──────────────────┘  │  │                                                      │  │
│                        │  │  [● You Are Here]                                    │  │
│  ┌──────────────────┐  │  └──────────────────────────────────────────────────────┘  │
│  │ F FRONTERA COACH │  │                                                            │
│  │   28 minutes ago │  │  ┌──────────────────────────────────────────────────────┐  │
│  │                  │  │  │  1  Discovery   CONTEXT SETTING                      │  │
│  │ Welcome, Derek.  │  │  │                                                      │  │
│  │ I'm your         │  │  │  Establish your strategic baseline by providing     │  │
│  │ Strategy Coach   │  │  │  company context and source materials               │  │
│  │ from Frontera,   │  │  │                                                      │  │
│  │ here to guide    │  │  │  ┌─────────────────┐  ┌─────────────────────────┐   │  │
│  │ Organization     │  │  │  │ 📋 Company      │  │ ⬆ Add Source Materials │   │  │
│  │ through your     │  │  │  │    Context      │  │                         │   │  │
│  │ product strategy │  │  │  │                 │  │ Upload documents,       │   │  │
│  │ transformation.  │  │  │  │ Strategic       │  │ reports, or provide     │   │  │
│  │                  │  │  │  │ baseline and    │  │ links to strategic      │   │  │
│  │ Let's explore    │  │  │  │ organizational  │  │ resources               │   │  │
│  │ your strategic   │  │  │  │ details         │  │                         │   │  │
│  │ landscape        │  │  │  │                 │  │ [Upload Files]          │   │  │
│  │ together.        │  │  │  │ Your context    │  │ [Add Link]              │   │  │
│  │                  │  │  │  │ will be         │  │                         │   │  │
│  │ I'll guide you   │  │  │  │ captured during │  │ PDF DOCX XLSX CSV       │   │  │
│  │ through our      │  │  │  │ conversation    │  └─────────────────────────┘   │  │
│  │ Product Strategy │  │  │  └─────────────────┘                                │  │
│  │ Research         │  │  │                                                      │  │
│  │ methodology...   │  │  │  UPLOADED MATERIALS (0)                              │  │
│  │                  │  │  │  No documents uploaded yet.                          │  │
│  │ **What           │  │  └──────────────────────────────────────────────────────┘  │
│  │ competitive      │  │                                                            │
│  │ dynamics or      │  │  ┌──────────────────────────────────────────────────────┐  │
│  │ market shifts    │  │  │  2  3Cs Research   TERRAIN MAPPING                   │  │
│  │ are making       │  │  │                                                      │  │
│  │ product          │  │  │  Map your strategic landscape across Company,        │  │
│  │ transformation   │  │  │  Customer, and Competitor pillars                    │  │
│  │ urgent for       │  │  │                                                      │  │
│  │ Organization     │  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │ right now?**     │  │  │  │UNEXPLORED│  │UNEXPLORED│  │UNEXPLORED│           │  │
│  │                  │  │  │  │          │  │          │  │          │           │  │
│  └──────────────────┘  │  │  │ 🏢       │  │ 👥       │  │ 🎯       │           │  │
│                        │  │  │ Company  │  │ Customer │  │Competitor│           │  │
│  ┌──────────────────┐  │  │  │          │  │          │  │          │           │  │
│  │ Share your       │  │  │  │Internal  │  │Market    │  │Competitive│          │  │
│  │ insights or ask  │  │  │  │capabili- │  │segments &│  │landscape &│          │  │
│  │ a question...    │  │  │  │ties &    │  │unmet     │  │market     │          │  │
│  │                  │  │  │  │org       │  │needs     │  │dynamics   │          │  │
│  │              [➤] │  │  │  │readiness │  │          │  │           │          │  │
│  └──────────────────┘  │  │  │          │  │          │  │           │          │  │
│                        │  │  │Territory │  │Territory │  │Territory  │          │  │
│                        │  │  │Unexplored│  │Unexplored│  │Unexplored │          │  │
│                        │  │  │          │  │          │  │           │          │  │
│                        │  │  │• Click to│  │• Click to│  │• Click to │          │  │
│                        │  │  │  begin   │  │  begin   │  │  begin    │          │  │
│                        │  │  │  explor- │  │  explor- │  │  explor-  │          │  │
│                        │  │  │  ing     │  │  ing     │  │  ing      │          │  │
│                        │  │  └──────────┘  └──────────┘  └──────────┘           │  │
│                        │  └──────────────────────────────────────────────────────┘  │
│                        │                                                            │
│                        │  ┌──────────────────────────────────────────────────────┐  │
│                        │  │  3  Synthesis   COMING NEXT                          │  │
│                        │  │                                                      │  │
│                        │  │  Cross-pillar insights and strategic opportunities   │  │
│                        │  │  will emerge here                                    │  │
│                        │  │                                                      │  │
│                        │  │  ┌────────────────────────────────────────────────┐ │  │
│                        │  │  │ 🔗 Strategic Synthesis Awaits                  │ │  │
│                        │  │  │                                                │ │  │
│                        │  │  │ Once you've mapped your strategic terrain      │ │  │
│                        │  │  │ across Company, Customer, and Competitor       │ │  │
│                        │  │  │ pillars, we'll synthesize cross-pillar         │ │  │
│                        │  │  │ insights to identify strategic opportunities   │ │  │
│                        │  │  │ and validated problems.                        │ │  │
│                        │  │  │                                                │ │  │
│                        │  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │ │  │
│                        │  │  │  │👁 Market│  │✓Validated│ │⬇ Org   │        │ │  │
│                        │  │  │  │Opportun-│  │ Problems │ │Readiness│        │ │  │
│                        │  │  │  │ities    │  │          │ │         │        │ │  │
│                        │  │  │  └─────────┘  └─────────┘  └─────────┘        │ │  │
│                        │  │  │                                                │ │  │
│                        │  │  │ • Complete at least 2 pillars to unlock        │ │  │
│                        │  │  │   synthesis                                    │ │  │
│                        │  │  └────────────────────────────────────────────────┘ │  │
│                        │  └──────────────────────────────────────────────────────┘  │
│                        │                                                            │
└────────────────────────┴────────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

#### Header Bar
| Element | Description |
|---------|-------------|
| Frontera Logo | Brand mark with "F" icon |
| Page Title | "Navigating to your Product Strategy" |
| Export Button | Export current work |
| Share Button | Share with stakeholders |
| Generate Insights Button | Primary CTA (teal) - triggers AI synthesis |

#### Coach Sidebar (Fixed Position)
| Element | Description |
|---------|-------------|
| Session Info | "SESSION · DISCOVERY PHASE", "New Strategy Session", "3Cs Analysis" link |
| Coach Header | "FRONTERA COACH" with timestamp |
| Welcome Message | Personalized greeting with user name and organization |
| Methodology Context | Explains the approach |
| Proactive Question | Bold question to prompt user thinking |
| Input Field | "Share your insights or ask a question..." with send button |

#### Progress Stepper (Horizontal)
| Phase | Label | Sublabel | Status States |
|-------|-------|----------|---------------|
| 1 | Discovery | Context Setting | Active (filled circle), "You Are Here" badge |
| 2 | 3Cs Research | Terrain Mapping | Inactive (outline circle) |
| 3 | Synthesis | Strategy Formation | Inactive |
| 4 | Strategic Bets | Route Planning | Inactive |

#### Phase Cards
| Phase | Title | Subtitle | Content |
|-------|-------|----------|---------|
| 1 - Discovery | Discovery | CONTEXT SETTING | Company Context card + Source Materials upload |
| 2 - 3Cs Research | 3Cs Research | TERRAIN MAPPING | Three equal territory cards (Company/Customer/Competitor) |
| 3 - Synthesis | Synthesis | COMING NEXT | Strategic Synthesis preview with outcome cards |
| 4 - Strategic Bets | Strategic Bets | ROUTE PLANNING | (Not shown in mockup - future phase) |

---

## 3. User Journey & Phases

### Phase 1: Discovery (Context Setting)

**Goal**: Establish strategic baseline with company context and source materials

**Components**:

```
┌─────────────────────────────────────────────────────────────────┐
│  1  Discovery   CONTEXT SETTING                                  │
│                                                                  │
│  Establish your strategic baseline by providing company          │
│  context and source materials                                    │
│                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────────────┐ │
│  │ 📋 Company Context     │  │ ⬆ Add Source Materials        │ │
│  │                        │  │                                │ │
│  │ Strategic baseline and │  │ Upload documents, reports, or  │ │
│  │ organizational details │  │ provide links to strategic     │ │
│  │                        │  │ resources                      │ │
│  │ Your strategic context │  │                                │ │
│  │ will be captured and   │  │ ┌────────────────────────────┐│ │
│  │ developed during your  │  │ │    [Upload Files]          ││ │
│  │ conversation with the  │  │ └────────────────────────────┘│ │
│  │ Strategy Coach         │  │ ┌────────────────────────────┐│ │
│  │                        │  │ │    [◇ Add Link]            ││ │
│  └────────────────────────┘  │ └────────────────────────────┘│ │
│                              │                                │ │
│                              │  PDF  DOCX  XLSX  CSV          │ │
│                              └────────────────────────────────┘ │
│                                                                  │
│  UPLOADED MATERIALS (0)                                          │
│  No documents uploaded yet. Source materials will appear here    │
│  once added.                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**User Actions**:
- Upload strategic documents (PDF, DOCX, XLSX, CSV)
- Add links to external resources
- Engage with coach to establish context through conversation
- View uploaded materials list

**Coach Behavior**:
- Welcomes user by name
- Explains methodology
- Asks probing question about urgency/drivers for transformation
- Responds to document uploads with relevant follow-up questions

---

### Phase 2: 3Cs Research (Terrain Mapping)

**Goal**: Map strategic landscape across Company, Customer, and Competitor pillars

**Components**:

```
┌─────────────────────────────────────────────────────────────────┐
│  2  3Cs Research   TERRAIN MAPPING                               │
│                                                                  │
│  Map your strategic landscape across Company, Customer, and      │
│  Competitor pillars                                              │
│                                                                  │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │    UNEXPLORED    │ │    UNEXPLORED    │ │    UNEXPLORED    │ │
│  │                  │ │                  │ │                  │ │
│  │     🏢           │ │     👥           │ │     🎯           │ │
│  │                  │ │                  │ │                  │ │
│  │    Company       │ │    Customer      │ │   Competitor     │ │
│  │                  │ │                  │ │                  │ │
│  │ Internal         │ │ Market segments  │ │ Competitive      │ │
│  │ capabilities &   │ │ & unmet needs    │ │ landscape &      │ │
│  │ organizational   │ │                  │ │ market dynamics  │ │
│  │ readiness        │ │                  │ │                  │ │
│  │                  │ │                  │ │                  │ │
│  │ ─────────────────│ │ ─────────────────│ │ ─────────────────│ │
│  │ Territory        │ │ Territory        │ │ Territory        │ │
│  │ Unexplored       │ │ Unexplored       │ │ Unexplored       │ │
│  │                  │ │                  │ │                  │ │
│  │ • Click to begin │ │ • Click to begin │ │ • Click to begin │ │
│  │   exploring      │ │   exploring      │ │   exploring      │ │
│  │   company        │ │   customer       │ │   competitor     │ │
│  │   territory      │ │   territory      │ │   territory      │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Territory Card States**:
| State | Visual | Description |
|-------|--------|-------------|
| UNEXPLORED | Gray badge, outline card | Not started |
| IN PROGRESS | Blue badge, partial fill | Active exploration |
| MAPPED | Green badge, filled card | Complete |

**User Actions**:
- Click territory card to begin exploration
- Each territory opens into a detailed research workflow
- Progress tracked per territory
- Can explore in any order

**Coach Behavior**:
- Suggests which territory to explore first based on context
- Provides industry-specific prompts for each territory
- Challenges surface-level responses
- Tracks progress across territories

---

### Phase 3: Synthesis (Strategy Formation)

**Goal**: Cross-pillar insights and strategic opportunity identification

**Components**:

```
┌─────────────────────────────────────────────────────────────────┐
│  3  Synthesis   COMING NEXT                                      │
│                                                                  │
│  Cross-pillar insights and strategic opportunities will          │
│  emerge here                                                     │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🔗 Strategic Synthesis Awaits                             │  │
│  │                                                           │  │
│  │ Once you've mapped your strategic terrain across          │  │
│  │ Company, Customer, and Competitor pillars, we'll          │  │
│  │ synthesize cross-pillar insights to identify strategic    │  │
│  │ opportunities and validated problems.                     │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │ 👁          │  │ ✓          │  │ ⬇          │       │  │
│  │  │ Market      │  │ Validated   │  │ Org         │       │  │
│  │  │ Opportun-   │  │ Problems    │  │ Readiness   │       │  │
│  │  │ ities       │  │             │  │             │       │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │  │
│  │                                                           │  │
│  │ • Complete at least 2 pillars to unlock synthesis         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Unlock Condition**: Complete at least 2 of 3 territory pillars

**Synthesis Outputs**:
| Output | Description | Source |
|--------|-------------|--------|
| Market Opportunities | Macro + Customer triangulation | Where are customers underserved? |
| Validated Problems | Customer + Competitor triangulation | What problems are worth solving? |
| Org Readiness | Company + Competitor triangulation | Where can we realistically win? |

**User Actions**:
- Review auto-generated synthesis (after unlock)
- Refine and edit AI-proposed insights
- Generate Strategic Opportunity Map
- Define Strategic Crux

---

### Phase 4: Strategic Bets (Route Planning)

**Goal**: Define strategic bets and hypotheses based on synthesis

*(Not shown in mockup - to be designed)*

**Expected Components**:
- Strategic Bet cards with hypothesis format
- Confidence ratings
- Evidence linking back to research
- Export to Strategic Context Canvas

---

## 4. Coach Sidebar Specification

### 4.1 Sidebar Layout

```
┌──────────────────────────────────────┐
│ SESSION · DISCOVERY PHASE            │
│ New Strategy Session                 │
│                                      │
│ • 3Cs Analysis                       │
├──────────────────────────────────────┤
│                                      │
│ F  FRONTERA COACH        28 min ago  │
│                                      │
│ Welcome, Derek. I'm your Strategy    │
│ Coach from Frontera, here to guide   │
│ Organization through your product    │
│ strategy transformation.             │
│                                      │
│ Let's explore your strategic         │
│ landscape together.                  │
│                                      │
│ I'll guide you through our Product   │
│ Strategy Research methodology,       │
│ starting with understanding the      │
│ market forces shaping your           │
│ transformation.                      │
│                                      │
│ **What competitive dynamics or       │
│ market shifts are making product     │
│ transformation urgent for            │
│ Organization right now?**            │
│                                      │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │ Share your insights or ask a   │   │
│ │ question...                    │ ➤ │
│ └────────────────────────────────┘   │
│                                      │
│ N                                    │
└──────────────────────────────────────┘
```

### 4.2 Coach Behavior by Phase

| Phase | Coach Role | Proactive Prompt |
|-------|------------|------------------|
| Discovery | Welcome, explain methodology | "What competitive dynamics or market shifts are making product transformation urgent?" |
| 3Cs - Company | Guide internal assessment | "What do you do exceptionally well that competitors can't easily replicate?" |
| 3Cs - Customer | Explore segments & needs | "Which customer segments are most underserved by current solutions?" |
| 3Cs - Competitor | Map competitive landscape | "Who are you really competing against for customer mindshare?" |
| Synthesis | Facilitate triangulation | "I notice a connection between your customer needs and competitor gap—let me synthesize this..." |
| Strategic Bets | Challenge & validate | "This bet assumes significant capability investment. How confident are you in that constraint assessment?" |

### 4.3 Coach Input States

| State | Behavior |
|-------|----------|
| Empty | Placeholder text: "Share your insights or ask a question..." |
| Typing | User input with character count |
| Sending | Brief loading state |
| Response | Coach message appears in sidebar conversation |

---

## 5. Functional Requirements

### 5.1 Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FR-001 | **Two-Panel Layout** | Fixed coach sidebar + scrollable main content | P0 - Must |
| FR-002 | **Progress Stepper** | Horizontal 4-phase navigation with status indicators | P0 - Must |
| FR-003 | **Phase Cards** | Numbered phases with title, subtitle, and content sections | P0 - Must |
| FR-004 | **Territory Cards** | Three-column 3C cards with UNEXPLORED/IN PROGRESS/MAPPED states | P0 - Must |
| FR-005 | **Document Upload** | Support PDF, DOCX, XLSX, CSV with drag-and-drop | P0 - Must |
| FR-006 | **Link Addition** | Add external resource links | P1 - Should |
| FR-007 | **Coach Sidebar** | Persistent AI coach with conversation history | P0 - Must |
| FR-008 | **Coach Input** | Text input for user questions/insights | P0 - Must |
| FR-009 | **Synthesis Lock** | Unlock after 2+ pillars complete | P0 - Must |
| FR-010 | **Synthesis Outputs** | Market Opportunities, Validated Problems, Org Readiness cards | P0 - Must |
| FR-011 | **Export** | Export current work state | P1 - Should |
| FR-012 | **Share** | Share read-only link with stakeholders | P2 - Nice |
| FR-013 | **Generate Insights** | Primary CTA to trigger AI synthesis | P0 - Must |

### 5.2 Territory Exploration Requirements

When user clicks a territory card, they enter detailed exploration mode:

| Requirement | Description |
|-------------|-------------|
| Deep-dive view | Expanded view with structured input fields for that pillar |
| Progress indicator | Shows completion % within territory |
| Coach context | Sidebar coach adapts prompts to current territory |
| Back navigation | Return to main journey view |
| Auto-save | Progress saves automatically |

---

## 6. Data Model

```
sessions
├── id (uuid)
├── client_id (uuid, FK)
├── user_id (text)
├── name (text) // "New Strategy Session"
├── current_phase (enum: discovery, research, synthesis, bets)
├── created_at (timestamp)
└── updated_at (timestamp)

phase_progress
├── id (uuid)
├── session_id (uuid, FK)
├── phase (enum: discovery, company, customer, competitor, synthesis, bets)
├── status (enum: not_started, in_progress, complete)
├── progress_pct (integer) // 0-100
├── started_at (timestamp)
└── completed_at (timestamp)

uploaded_materials
├── id (uuid)
├── session_id (uuid, FK)
├── filename (text)
├── file_type (enum: pdf, docx, xlsx, csv, link)
├── file_url (text) // storage URL or external link
├── extracted_context (jsonb) // AI-extracted insights
└── uploaded_at (timestamp)

coach_conversations
├── id (uuid)
├── session_id (uuid, FK)
├── phase (enum)
├── territory (enum, nullable) // company, customer, competitor
├── messages (jsonb[]) // array of {role, content, timestamp}
└── updated_at (timestamp)

territory_insights
├── id (uuid)
├── session_id (uuid, FK)
├── territory (enum: company, customer, competitor)
├── field_responses (jsonb) // structured research inputs
├── ai_insights (jsonb) // AI-generated insights
├── confidence (enum: high, medium, low)
└── updated_at (timestamp)

synthesis_outputs
├── id (uuid)
├── session_id (uuid, FK)
├── market_opportunities (jsonb)
├── validated_problems (jsonb)
├── org_readiness (jsonb)
├── strategic_crux (text)
├── generated_at (timestamp)
└── user_edited (boolean)
```

---

## 7. UI States & Transitions

### 7.1 Progress Stepper States

| State | Visual |
|-------|--------|
| Not Started | Gray outline circle |
| Current | Filled teal circle with "You Are Here" badge |
| Complete | Filled teal circle with checkmark |
| Locked | Gray outline with lock icon |

### 7.2 Territory Card States

| State | Badge | Card Style | CTA |
|-------|-------|------------|-----|
| UNEXPLORED | Gray badge | Light gray border | "Click to begin exploring" |
| IN PROGRESS | Blue badge | Blue border, partial fill | "Continue exploration" |
| MAPPED | Green badge | Green border, complete | "Review territory" |

### 7.3 Synthesis Lock States

| Condition | State |
|-----------|-------|
| 0-1 pillars complete | Locked, gray, shows unlock message |
| 2+ pillars complete | Unlocked, active, can generate synthesis |

---

## 8. Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| UI Components | Shadcn/ui (cards, buttons, badges, inputs) |
| State Management | XState (workflow orchestration) |
| File Upload | Uploadthing or Supabase Storage |
| Authentication | Clerk |
| Database | Supabase PostgreSQL |
| AI | Claude API (Anthropic) |
| Analytics | PostHog |
| Deployment | Vercel |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Session Completion | 70%+ reach synthesis phase | Database: sessions reaching synthesis |
| Territory Completion | 80%+ complete at least 2 territories | phase_progress status tracking |
| Coach Engagement | 60%+ interact with coach | coach_conversations message count |
| Document Upload Rate | 50%+ upload at least 1 document | uploaded_materials count |
| Time to Synthesis | < 2 weeks from session start | timestamp difference |
| User Satisfaction | 4.0+ out of 5.0 | Post-session survey |

---

## 10. Timeline

| Week | Deliverables |
|------|--------------|
| Week 1 | Two-panel layout, progress stepper, phase cards, coach sidebar shell |
| Week 2 | Territory cards, document upload, coach conversation integration |
| Week 3 | Territory exploration views, synthesis lock/unlock, AI integration |
| Week 4 | Export/share, polish, demo configurations, testing |

---

## 11. Appendix: Design Language

### Color Palette
| Use | Color |
|-----|-------|
| Primary (buttons, stepper active) | Teal #06B6D4 |
| Brand | Deep Indigo #1E3A8A |
| Status badges | Gray (inactive), Blue (in progress), Green (complete) |
| Background | White #FFFFFF, Light gray #F9FAFB |
| Text | Dark gray #111827, Medium gray #6B7280 |

### Typography
| Element | Style |
|---------|-------|
| Phase titles | 24px bold |
| Phase subtitles | 12px uppercase, colored (teal/orange) |
| Card titles | 18px semibold |
| Body text | 14px regular |
| Coach messages | 14px regular |

### Iconography
| Element | Icon Style |
|---------|------------|
| Company | Building icon |
| Customer | People/users icon |
| Competitor | Target icon |
| Upload | Upload arrow icon |
| Synthesis | Link/connection icon |
| Opportunities | Eye icon |
| Problems | Checkmark icon |
| Readiness | Download arrow icon |

---

*Document Version: 2.1*  
*Based on: Strategy Coach v2 Mockup*  
*Last Updated: January 2026*
