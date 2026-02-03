Map your strategic terrain across three critical territories: Company, Customer, and Competitor. Each territory offers deep insights into your strategic context.# Product Strategy Coach - Design Review Supplement
## Mockups, Framework Templates, Adaptive Coaching & User Profiling

**Version:** 1.0
**Date:** January 18, 2026
**Companion Document:** PRODUCT_STRATEGY_COACH_DESIGN_REVIEW.md
**Focus Areas:** Visual mockups, strategy framework integration, adaptive AI coaching, user profiling UX

---

## Table of Contents

1. [UI Mockups for Critical Improvements](#ui-mockups-for-critical-improvements)
2. [Strategy Framework Template Research](#strategy-framework-template-research)
3. [Adaptive Coaching System Design](#adaptive-coaching-system-design)
4. [User Profiling Architecture](#user-profiling-architecture)
5. [Implementation Guidance](#implementation-guidance)

---

## UI Mockups for Critical Improvements

### Mockup 1: AI Streaming Response with Typing Indicator

**Current Problem:** Silent 5-10 second pause creates anxiety, users don't know if system is working.

**Proposed Solution:** Real-time streaming display with typing indicator and "thinking" animations.

```
┌─────────────────────────────────────────────────────────────────┐
│ COACHING PANEL                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 Maya                                          28 seconds ago │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ What competitive dynamics are making transformation       │  │
│  │ urgent for our organization right now?                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  🅵 FRONTERA COACH                                  Replying... │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Based on your financial services context, I see three    │  │
│  │ critical forces at play:                                  │  │
│  │                                                           │  │
│  │ **Market consolidation is accelerating**. Advisers are   │  │
│  │ moving to larger platforms that offer integrated         │  │
│  │ technology and streamlined operations. This creates      │  │
│  │ winner-take-most dynamics where scale...                │  │
│  │ ▌                                 ← [Streaming cursor]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─ Coaching Actions ──────────────────────────────────────┐   │
│  │ ● ● ●  Thinking...                                       │   │
│  │ [⏸ Stop generating]  [🔄 Regenerate later]              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Share your insights or ask a question...                  │ │
│  │                                                          [➤]│ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Elements:**

1. **Typing Indicator Animation:**
   ```
   ● ● ●  Thinking...
   ↓ (animated bounce)
   ● ● ●  Analyzing your research...
   ↓ (animated bounce)
   ● ● ●  Formulating insights...
   ```

2. **Streaming Text Reveal:**
   - Characters append in real-time (10-20 chars/sec)
   - Cursor blink at end of text: `▌`
   - Smooth scrolling as content grows

3. **Control Actions:**
   - **Stop generating**: Halt stream mid-response
   - **Regenerate**: Try different response approach
   - Both disabled until stream completes

**Implementation Notes:**
```tsx
// MessageStream.tsx enhancement
{isStreaming && (
  <div className="assistant-message streaming">
    <div className="avatar">🅵</div>
    <div className="content">
      <div className="header">
        <span className="name">FRONTERA COACH</span>
        <span className="status">
          <AnimatedDots /> Thinking...
        </span>
      </div>
      <div className="message-body">
        {streamingContent}<span className="cursor">▌</span>
      </div>
      <div className="actions">
        <button onClick={handleStopStream}>
          ⏸ Stop generating
        </button>
        <button onClick={handleRegenerate} disabled>
          🔄 Regenerate
        </button>
      </div>
    </div>
  </div>
)}
```

---

### Mockup 2: Territory Deep-Dive Redesign (Sidebar Navigation)

**Current Problem:** Sequential wizard creates anxiety ("How many questions?"), prevents preview.

**Proposed Solution:** Sidebar navigation showing all research areas upfront with progress tracking.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Company Territory Deep Dive                                             [✕]  │
├───────────────┬──────────────────────────────────────────────────────────────┤
│               │                                                              │
│ RESEARCH      │  1  INDUSTRY FORCES                                         │
│ AREAS         │  ────────────────────────────────────────────────────────   │
│               │                                                              │
│ ✓ Industry    │  Understanding market dynamics and competitive forces       │
│   Forces      │                                                              │
│   10 min      │  ┌────────────────────────────────────────────────────────┐ │
│               │  │ 💡 Why we ask                                          │ │
│ ○ Business    │  │ Industry forces reveal where you have structural      │ │
│   Model       │  │ advantages or headwinds. Focus on non-obvious         │ │
│   12 min      │  │ dynamics that insiders recognize but outsiders miss.  │ │
│               │  └────────────────────────────────────────────────────────┘ │
│ ○ Product     │                                                              │
│   Capabilities│  What are the key competitive dynamics in your market?      │
│   15 min      │  ┌────────────────────────────────────────────────────────┐ │
│               │  │ The UK wealth platform market is consolidating. The    │ │
│ ────────────  │  │ top 5 platforms now control 67% of AUA, up from 52%   │ │
│               │  │ three years ago. This creates winner-take-most        │ │
│ Progress      │  │ dynamics driven by:                                    │ │
│ ▓▓▓▓░░░░░░    │  │ • Scale economics in technology investment           │ │
│ 1/3 complete  │  │ • Adviser preference for established platforms        │ │
│               │  │ • Regulatory complexity favoring large players        │ │
│               │  └────────────────────────────────────────────────────────┘ │
│ [🤖 Coach     │  │                                                         │ │
│  Help]        │  │ 247 / 1000 characters            ✓ Saved 12 seconds ago│ │
│               │  └────────────────────────────────────────────────────────┘ │
│               │                                                              │
│               │  What technology trends are shaping your industry?          │
│               │  ┌────────────────────────────────────────────────────────┐ │
│               │  │ [Start typing your response...]                        │ │
│               │  │                                                         │ │
│               │  └────────────────────────────────────────────────────────┘ │
│               │                                                              │
│               │  ▼ See example response                                     │
│               │                                                              │
│               │                                                              │
└───────────────┴──────────────────────────────────────────────────────────────┘
│                                                                              │
│                                    [Save & Continue →]  [Save & Close]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Elements:**

1. **Sidebar Navigation:**
   - ✓ Green checkmark = Complete
   - ○ Gray circle = Not started
   - ● Blue filled = In progress
   - Time estimates reduce anxiety

2. **Progress Indicator:**
   - Visual bar: `▓▓▓▓░░░░░░` (40% complete)
   - Text: "1/3 complete"
   - Updates in real-time as user saves

3. **Contextual Help:**
   - "💡 Why we ask" explainer for each area
   - Collapsible example responses
   - Character count + autosave confirmation

4. **Coach Help Button:**
   - Triggers AI suggestions in sidebar
   - "Based on your industry, consider..."
   - Non-intrusive, user-initiated

**Interaction Flow:**
1. User clicks sidebar nav item → Content area updates
2. User can jump between areas freely
3. Answers auto-save after 1-second typing pause
4. "Save & Continue" advances to next incomplete area
5. "Save & Close" returns to Research canvas

---

### Mockup 3: Strategic Opportunity Map Visualization

**Current Problem:** Synthesis is text-only, hard to scan, doesn't leverage spatial reasoning.

**Proposed Solution:** Interactive 2x2 matrix showing opportunities positioned by attractiveness and fit.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ SYNTHESIS SECTION                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Strategic Synthesis                                                         │
│  Generated from 6 research areas • Last updated 14 minutes ago              │
│                                                                              │
│  ┌─ Strategic Opportunity Map ─────────────────────────────────────────────┐│
│  │                                                                          ││
│  │            HIGH MARKET ATTRACTIVENESS                                   ││
│  │                        ▲                                                ││
│  │                        │                                                ││
│  │    INVEST              │              PRIORITIZE                        ││
│  │                        │                                                ││
│  │                        │        ● Consolidator                          ││
│  │                        │          Service                               ││
│  │                        │          Excellence                            ││
│  │              ● Platform│                                                ││
│  │                Integration                                              ││
│  │                Depth   │                                                ││
│  │                        │                                                ││
│  │─────────────────────────┼──────────────────────────────────────────────││
│  │                        │                                                ││
│  │    MONITOR             │              SELECTIVE                         ││
│  │                        │                                                ││
│  │                        │      ● Retail                                  ││
│  │                        │        Direct                                  ││
│  │  ● Technology          │                                                ││
│  │    Modernization       │                                                ││
│  │                        │                                                ││
│  │                        │                                                ││
│  │                        └────────────────────────────────────────────────││
│  │   LOW                     CAPABILITY FIT                     HIGH       ││
│  │                                                                          ││
│  │  [🎯 Click opportunity to view evidence]                                ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Evidence Trail: Consolidator Service Excellence ──────────────────────┐ │
│  │                                                                          │ │
│  │  WHY THIS MATTERS:                                                       │ │
│  │  Cross-pillar triangulation reveals a high-confidence strategic bet     │ │
│  │                                                                          │ │
│  │  📊 Company Insight [Industry Forces]                                   │ │
│  │  "Scale economics in technology investment favor established players"  │ │
│  │                                                                          │ │
│  │  👥 Customer Insight [Segments & Needs]                                 │ │
│  │  "Advisers prioritize service over price, willing to pay premium"      │ │
│  │                                                                          │ │
│  │  🎯 Competitor Insight [Direct Competitor Mapping]                      │ │
│  │  "Transact and AJ Bell weak at high-touch consolidator support"        │ │
│  │                                                                          │ │
│  │  ✓ CONFIDENCE: HIGH (8/10)                                              │ │
│  │  Supported by evidence across all 3 territories                         │ │
│  │                                                                          │ │
│  │  [Create Strategic Bet from this Opportunity →]                         │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Key Patterns │ Strategic Tensions │ White Space │ Risks │ Recommendations  │
│  ════════════                                                                │
│                                                                              │
│  ▼ Your research revealed three core patterns:                              │
│                                                                              │
│  1. Winner-Take-Most Market Dynamics                                        │
│     Consolidation accelerating (top 5 = 67% share), creating urgency...    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Elements:**

1. **Interactive 2x2 Matrix:**
   - Quadrants: Invest, Prioritize, Selective, Monitor
   - Opportunities plotted as draggable circles
   - Size = market size, Color = confidence level
   - Hover → show summary tooltip
   - Click → expand evidence trail

2. **Evidence Trail Panel:**
   - Shows cross-pillar connections
   - Links back to specific research responses
   - Confidence scoring (1-10 scale)
   - Clear action: "Create Strategic Bet"

3. **Tab Navigation:**
   - Key Patterns (high-level themes)
   - Strategic Tensions (conflicts to resolve)
   - White Space (unmet needs)
   - Risks (what could go wrong)
   - Recommendations (2-3 priority moves)

**Interaction Flow:**
1. Synthesis auto-generates opportunity positions
2. User can drag to adjust positioning
3. Click opportunity → evidence panel slides in
4. User reviews evidence, clicks "Create Bet"
5. Navigates to Strategic Bets phase with pre-filled form

---

### Mockup 4: Adaptive Coaching Preference Selector

**Current Problem:** One-size-fits-all coaching doesn't match user preferences (some want structure, others want freedom).

**Proposed Solution:** User selects coaching style at conversation start, coach adapts behavior.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 🅵 FRONTERA COACH                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Welcome, Maya! I'm your Strategy Coach from Frontera.                      │
│                                                                              │
│  Before we begin, I'd like to understand how you prefer to work:            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ HOW MUCH GUIDANCE DO YOU WANT?                                         │ │
│  │                                                                         │ │
│  │  ○  Highly Structured                                                  │ │
│  │     Step-by-step prompts, templates, examples at each stage           │ │
│  │     ⌚ Time commitment: ~90 minutes total                               │ │
│  │     👤 Best for: First-time strategists, methodical thinkers           │ │
│  │                                                                         │ │
│  │  ●  Balanced Guidance  ← [Selected]                                    │ │
│  │     I'll ask probing questions and offer frameworks when helpful      │ │
│  │     ⌚ Time commitment: ~60 minutes total                               │ │
│  │     👤 Best for: Experienced leaders who want a thinking partner       │ │
│  │                                                                         │ │
│  │  ○  Minimal Guidance                                                   │ │
│  │     You drive, I respond. Templates available but not pushed          │ │
│  │     ⌚ Time commitment: ~45 minutes total                               │ │
│  │     👤 Best for: Strategic veterans who know their approach            │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ WHAT'S YOUR STRATEGIC FOCUS RIGHT NOW?  [Optional]                    │ │
│  │                                                                         │ │
│  │  □  I have a clear strategic question to answer                        │ │
│  │  ✓  I'm exploring opportunities (not sure what to focus on yet)        │ │
│  │  □  I need to validate an existing strategy hypothesis                 │ │
│  │  □  I'm building a business case for transformation                    │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ WOULD YOU LIKE TO USE STRATEGY FRAMEWORKS?  [Optional]                │ │
│  │                                                                         │ │
│  │  □  Business Model Canvas  (visualize value creation)                  │ │
│  │  ✓  Jobs-to-be-Done  (understand customer motivations)                 │ │
│  │  ✓  Play-to-Win  (strategic choices framework)                         │ │
│  │  □  Blue Ocean Strategy  (find uncontested markets)                    │ │
│  │  □  Porter's Five Forces  (competitive structure analysis)             │ │
│  │                                                                         │ │
│  │  ℹ️  I'll weave these frameworks into our conversation naturally        │ │
│  │                                                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  [Skip preferences]                                   [Start Strategy Session]│
└──────────────────────────────────────────────────────────────────────────────┘
```

**Key Design Elements:**

1. **Guidance Level Selector:**
   - 3 levels: Highly Structured, Balanced, Minimal
   - Each shows time commitment (manage expectations)
   - Describes coaching behavior clearly
   - Persona suggestions (help user self-identify)

2. **Strategic Focus (Optional):**
   - Multi-select checkboxes
   - Informs coach's first questions
   - Can skip if unsure

3. **Framework Selection (Optional):**
   - Pre-select based on onboarding context
   - User can opt in/out
   - Coach explains how frameworks will be used

**Coaching Behavior Adaptation:**

| Preference | Coach Opening | Research Questions | Synthesis Style |
|------------|---------------|-------------------|-----------------|
| **Highly Structured** | "Let's start with industry forces. I've prepared 5 specific questions..." | Provides examples with each question | Uses templates (BMC, JTBD) explicitly |
| **Balanced** | "What competitive dynamics are urgent?" | Asks follow-ups when answers are vague | Offers framework lenses, user chooses |
| **Minimal** | "Tell me about your strategic challenge." | Responds to user's lead | Generates synthesis, user refines freely |

---

### Mockup 5: User Profiling - Progressive Disclosure Over Time

**Current Problem:** Asking all profile questions upfront is invasive and overwhelming.

**Proposed Solution:** Learn user preferences gradually through behavior observation and lightweight prompts.

#### Phase 1: Onboarding (Basic Profile)

**Already Captured:**
- Company name, industry, size
- Strategic focus (market expansion, product-led, etc.)
- Pain points, target outcomes

**Total time: 5 minutes** (current onboarding flow)

#### Phase 2: First Conversation (Coaching Style Preference)

**Triggered:** After opening message, before research starts

**Prompt:** (See Mockup 4 above)

**Captures:**
- Guidance level preference
- Strategic focus clarity
- Framework preferences

**Total time: +1-2 minutes**

#### Phase 3: Mid-Research (Implicit Learning)

**Behavioral Signals Tracked:**

```typescript
// User Behavior Patterns
interface UserProfile {
  // Writing style
  avg_response_length: number;        // 50-500 words
  uses_bullet_points: boolean;        // vs. paragraphs
  formality_level: 'casual' | 'professional' | 'academic';

  // Work patterns
  typical_session_duration: number;   // minutes
  sessions_per_week: number;
  time_of_day_preference: 'morning' | 'afternoon' | 'evening';

  // Strategic thinking style
  prefers_data_driven: boolean;       // cites numbers, metrics
  prefers_narrative: boolean;         // tells stories, uses examples
  prefers_frameworks: boolean;        // references models explicitly

  // Research depth
  company_territory_depth: 'light' | 'medium' | 'deep';
  customer_territory_depth: 'light' | 'medium' | 'deep';
  competitor_territory_depth: 'light' | 'medium' | 'deep';

  // Confidence indicators
  expresses_uncertainty: boolean;     // "I'm not sure", "Maybe"
  asks_for_validation: boolean;       // "Does this make sense?"
  challenges_coach: boolean;          // Pushes back on suggestions
}
```

**No Explicit Prompt** - Just observation and machine learning

**Total time: 0 minutes** (passive learning)

#### Phase 4: Post-Synthesis (Explicit Preference Refinement)

**Triggered:** After first synthesis is generated

**Prompt:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ 🅵 FRONTERA COACH                                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Great work completing your research! Before we move to Strategic   │
│  Bets, I'd love to understand your preferences better:              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ I noticed you provided detailed, data-rich responses. Would   │ │
│  │ you like me to:                                                │ │
│  │                                                                │ │
│  │  ○  Match your detail level (data-heavy, comprehensive)        │ │
│  │  ●  Provide executive summaries + option to drill down         │ │
│  │  ○  Keep responses concise (action-oriented)                   │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ When I challenge your thinking, what's most helpful?          │ │
│  │                                                                │ │
│  │  ○  Ask Socratic questions to provoke deeper reflection       │ │
│  │  ●  Point out gaps or contradictions directly                 │ │
│  │  ○  Offer alternative perspectives from other industries      │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [Skip for now]                              [Save Preferences]     │
└──────────────────────────────────────────────────────────────────────┘
```

**Captures:**
- Response detail preference
- Challenge style preference
- Tone preferences (added as conversation continues)

**Total time: +30 seconds** (2 quick selections)

#### Phase 5: Ongoing Refinement (Continuous Learning)

**Periodic Micro-Prompts** (every 3-5 conversations):

**Example 1:**
```
I've adjusted my coaching style based on our work together.
[Review my profile →]
```

**Example 2:**
```
I notice you often reference Jobs-to-be-Done. Should I default
to this lens?  [Yes] [No] [Sometimes]
```

**User Profile Dashboard:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ MY COACHING PREFERENCES                                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Guidance Level:        ● Balanced                                   │
│  Response Detail:       ● Executive summaries + drill-down           │
│  Challenge Style:       ● Direct feedback on gaps                    │
│  Preferred Frameworks:  Jobs-to-be-Done, Play-to-Win                │
│  Work Sessions:         Typically 45-60 min, afternoon preferred     │
│  Writing Style:         Data-driven, professional tone               │
│                                                                      │
│  [Edit Preferences]                                                  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ 💡 COACHING INSIGHTS                                           │ │
│  │                                                                │ │
│  │ Based on 5 strategy sessions, I've learned that you:          │ │
│  │ • Prefer detailed customer insights over high-level summaries │ │
│  │ • Often revisit competitor research after synthesis           │ │
│  │ • Value specific examples from financial services industry    │ │
│  │                                                                │ │
│  │ I've adjusted my coaching to emphasize these areas.           │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [Reset to defaults]                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Total time investment across 5 conversations:** 7-8 minutes (non-intrusive)

---

## Strategy Framework Template Research

### Overview: Integrating Proven Strategy Tools

Frontera's Product Strategy Research methodology (3Cs → Synthesis → Bets) is excellent scaffolding, but can be **enhanced** by weaving in established strategy frameworks that enterprise users already know and trust.

**Key Insight:** Don't replace Frontera's methodology, **augment it** with familiar templates that provide:
1. **Cognitive scaffolding** (fill-in-the-blank reduces blank-page anxiety)
2. **Stakeholder credibility** (executives recognize "Business Model Canvas")
3. **Cross-functional alignment** (shared language for product, sales, engineering)

---

### Framework 1: Business Model Canvas (Alex Osterwalder)

**Origin:** Published in "Business Model Generation" (2010) by Alexander Osterwalder and Yves Pigneur. Used by 5M+ companies worldwide.

**Purpose:** Visualize how a company creates, delivers, and captures value.

**9 Building Blocks:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUSINESS MODEL CANVAS                            │
├─────────────┬─────────────┬───────────────┬───────────┬────────────┤
│             │             │               │           │            │
│  Key        │  Key        │  Value        │ Customer  │ Customer   │
│  Partners   │  Activities │  Propositions │ Relations │ Segments   │
│             │             │               │           │            │
│  Who are    │  What do    │  What value   │ What type │ For whom   │
│  your key   │  we do?     │  do we        │ of        │ are we     │
│  partners?  │             │  deliver?     │ relationship?│ creating  │
│             │             │               │           │ value?     │
│             ├─────────────┤               ├───────────┤            │
│             │             │               │           │            │
│             │  Key        │               │ Channels  │            │
│             │  Resources  │               │           │            │
│             │             │               │ How do we │            │
│             │  What do    │               │ reach     │            │
│             │  we own?    │               │ customers?│            │
│             │             │               │           │            │
├─────────────┴─────────────┴───────────────┴───────────┴────────────┤
│                                                                     │
│  Cost Structure                        Revenue Streams             │
│  What are the most important costs?    For what value are          │
│                                        customers willing to pay?    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Integration with Frontera's 3Cs Research:**

| BMC Block | Frontera Territory | Research Area Mapping |
|-----------|-------------------|----------------------|
| **Customer Segments** | Customer Territory | Segments & Needs |
| **Value Propositions** | Company Territory | Product Capabilities + Customer Territory (Unmet Needs) |
| **Channels** | Customer Territory | Adoption & Switching Dynamics |
| **Customer Relationships** | Customer Territory | Segments & Needs + Decision Drivers |
| **Revenue Streams** | Company Territory | Business Model |
| **Key Resources** | Company Territory | Product Capabilities |
| **Key Activities** | Company Territory | Product Capabilities + Business Model |
| **Key Partners** | Competitor Territory | Indirect & Substitute Threats (ecosystem players) |
| **Cost Structure** | Company Territory | Business Model (unit economics) |

**How Frontera Coach Uses BMC:**

**During Research Phase:**
- After Company Territory complete → "I've started drafting your Business Model Canvas. Let's review the Value Proposition block based on your Product Capabilities research..."
- User sees **partially auto-filled BMC** with data extracted from their research responses
- User can edit, refine, add details

**In Synthesis Phase:**
- Coach highlights **BMC tensions**: "Your Cost Structure is fixed-cost heavy, but your Revenue Streams are transaction-based. This creates margin pressure during low-volume periods."
- Suggests **BMC opportunities**: "Consider a subscription revenue stream to balance your cost structure..."

**Mockup: BMC Integration in Synthesis**
```
┌──────────────────────────────────────────────────────────────────────┐
│ SYNTHESIS SECTION                                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Key Patterns │ Strategic Tensions │ White Space │ [Business Model] │
│                                                    ════════════════  │
│                                                                      │
│  Based on your research, here's your current business model:        │
│                                                                      │
│  ┌─ AUTO-GENERATED BUSINESS MODEL CANVAS ────────────────────────┐  │
│  │                                                                │  │
│  │  Value Proposition: Platform for advisers                     │  │
│  │  ✓ Extracted from Company → Product Capabilities              │  │
│  │                                                                │  │
│  │  "Integrated technology and streamlined operations that       │  │
│  │  enable advisers to focus on client relationships rather      │  │
│  │  than administrative work."                                   │  │
│  │                                                                │  │
│  │  [Edit Value Prop]  [View Full Canvas]                        │  │
│  │                                                                │  │
│  │  ⚠️ TENSION DETECTED:                                          │  │
│  │  Your Customer Segments research mentions "consolidators"     │  │
│  │  as high-priority, but your Value Proposition doesn't         │  │
│  │  explicitly address their unique needs (bulk processing,      │  │
│  │  integration APIs).                                           │  │
│  │                                                                │  │
│  │  [Refine Value Prop for Consolidators]                        │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Export Business Model Canvas as PDF]                              │
└──────────────────────────────────────────────────────────────────────┘
```

**Best Practice (from Osterwalder):**
- BMC is a **living document**, not one-time exercise
- **Hypothesis-driven**: Each block is an assumption to test
- **Iterative refinement**: Update as strategy evolves

**Frontera Enhancement:**
- **Version history**: Track how BMC changes as user progresses through phases
- **Assumption testing**: Link BMC blocks to Strategic Bets (test hypotheses)

---

### Framework 2: Jobs-to-be-Done (Clayton Christensen)

**Origin:** Developed by Clayton Christensen (Harvard Business School) in "Competing Against Luck" (2016).

**Purpose:** Understand customer motivations by focusing on the "job" they're hiring your product to do, not demographics or features.

**JTBD Framework Structure:**
```
When I _____________________ (situation)
I want to _____________________ (motivation)
So I can _____________________ (desired outcome)

Instead of _____________________ (current solution/workaround)
```

**Types of Jobs:**
1. **Functional Job**: Task to accomplish ("process pension transfers")
2. **Emotional Job**: How customer wants to feel ("feel confident in my advice")
3. **Social Job**: How customer wants to be perceived ("be seen as a modern, tech-savvy adviser")

**Integration with Frontera's Customer Territory:**

**Current Research Questions:**
- "What jobs are customers trying to accomplish?"
- "What workarounds do customers use?"

**JTBD-Enhanced Questions:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ CUSTOMER TERRITORY → SEGMENTS & NEEDS                                │
│ Enhanced with Jobs-to-be-Done Framework                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  💼 FUNCTIONAL JOB                                                   │
│  When your customer is in what situation, what task are they        │
│  trying to accomplish?                                               │
│                                                                      │
│  Example: "When an adviser onboards a new client, they want to      │
│  consolidate 3-5 existing pension pots into one platform so they    │
│  can provide holistic advice."                                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ❤️ EMOTIONAL JOB                                                    │
│  How does your customer want to FEEL when using your product?       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  👥 SOCIAL JOB                                                       │
│  How does your customer want to be PERCEIVED by others?             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  🔧 CURRENT WORKAROUNDS                                              │
│  What clunky solutions do customers use today to get this job done? │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ✨ DESIRED OUTCOME                                                  │
│  What does success look like for this job? (measurable if possible) │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Coach Behavior with JTBD:**

**Proactive Prompt:**
```
I notice you're focusing on functional jobs (tasks). Let's dig deeper:

When an adviser chooses a platform, what EMOTIONAL job are they
hiring it for?

Some possibilities:
• Feel confident they won't make compliance errors
• Feel pride in offering modern, digital experience
• Feel relief that admin is handled automatically

What resonates with your market?
```

**Synthesis with JTBD Lens:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ Jobs-to-be-Done Insight Map                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  PRIMARY JOB IDENTIFIED:                                             │
│  "When consolidators onboard large blocks of advisers, they want    │
│  to migrate 500+ client accounts without service disruption, so     │
│  they can demonstrate operational excellence to their board."       │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ OPPORTUNITY:                                                   │ │
│  │                                                                │ │
│  │ Your competitors treat migration as a technical project.      │ │
│  │ You could reframe it as a "service continuity guarantee":     │ │
│  │                                                                │ │
│  │ • White-glove migration team                                  │ │
│  │ • 99.5% SLA with penalty clauses                              │ │
│  │ • Board-ready migration reports                               │ │
│  │                                                                │ │
│  │ This addresses the EMOTIONAL job (feel confident) and         │ │
│  │ SOCIAL job (be seen as operational leader).                   │ │
│  │                                                                │ │
│  │ ✓ Evidence: Customer research Q3, Competitor analysis Q4     │ │
│  │                                                                │ │
│  │ [Create Strategic Bet: Service Continuity Differentiation]    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Best Practice (from Christensen):**
- **Don't ask customers what they want** (they'll describe better features)
- **Observe struggling moments** (when current solutions fail)
- **Hire/fire language**: What did they "hire" your product for? What makes them "fire" it?

---

### Framework 3: Play-to-Win (A.G. Lafley & Roger Martin)

**Origin:** "Playing to Win" (2013) by A.G. Lafley (P&G CEO) and Roger Martin (strategy expert).

**Purpose:** Make explicit strategic choices through five cascading questions.

**The Five Strategy Choices:**
```
1. What is our WINNING ASPIRATION?
   ↓ (Where will we play?)
2. Where will we PLAY?
   ↓ (How will we win?)
3. How will we WIN?
   ↓ (What capabilities must we have?)
4. What CAPABILITIES must we have?
   ↓ (What management systems are required?)
5. What MANAGEMENT SYSTEMS are required?
```

**Play-to-Win Choice Cascade Template:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ PLAY-TO-WIN STRATEGIC CHOICES                                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ WINNING ASPIRATION                                               │
│  What is our guiding purpose? What does winning look like?           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ "Be the UK's #1 platform partner for consolidators by 2028,   │ │
│  │  enabling 40% of all consolidator-managed AUA."                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  2️⃣ WHERE TO PLAY                                                    │
│  Which markets, segments, channels, geographies?                    │
│                                                                      │
│  ✓ Large consolidators (£5B+ AUA)                                   │
│  ✓ UK market                                                         │
│  ✗ Retail direct (not our focus)                                    │
│  ✗ International expansion (not yet)                                │
│                                                                      │
│  3️⃣ HOW TO WIN                                                       │
│  What is our sustainable competitive advantage?                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ "Service excellence at scale through superior integration      │ │
│  │  depth and white-glove migration capabilities."                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  4️⃣ MUST-HAVE CAPABILITIES                                          │
│  What must we be great at? What can we outsource?                   │
│                                                                      │
│  MUST-HAVE:                                                          │
│  • Enterprise-grade API integrations                                │
│  • Dedicated consolidator success teams                             │
│  • Bulk migration technology + project management                   │
│                                                                      │
│  CAN OUTSOURCE:                                                      │
│  • Retail marketing (not our segment)                               │
│                                                                      │
│  5️⃣ ENABLING SYSTEMS                                                │
│  What processes, metrics, incentives reinforce our choices?         │
│                                                                      │
│  • Consolidator NPS as primary success metric                       │
│  • Sales comp tied to multi-year consolidator deals (not ARR)      │
│  • Engineering roadmap prioritizes API features over UI polish      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Integration with Frontera Strategic Bets Phase:**

**Current Bets Format:**
```
We believe [trend]
Which means [opportunity]
So we will explore [hypothesis]
Success looks like [metric]
```

**Play-to-Win Enhanced Bets:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ STRATEGIC BET #1: Consolidator Service Excellence                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🎯 WHERE TO PLAY (Choice #2)                                        │
│  Large UK consolidators (£5B+ AUA) acquiring adviser firms         │
│                                                                      │
│  🏆 HOW TO WIN (Choice #3)                                           │
│  Superior integration depth + white-glove migration vs. competitors │
│                                                                      │
│  💪 MUST-HAVE CAPABILITIES (Choice #4)                               │
│  ✓ Enterprise API team (hire 5 engineers)                           │
│  ✓ Consolidator success function (hire 3 CSMs)                      │
│  ✓ Migration automation tooling (build in 6 months)                 │
│                                                                      │
│  📊 SUCCESS METRICS (Choice #5 alignment)                            │
│  • Close 2 of top 5 UK consolidators by Q4 2026                     │
│  • Consolidator NPS > 70 (vs. industry avg 45)                      │
│  • Migration SLA compliance > 99%                                    │
│                                                                      │
│  🧪 HYPOTHESIS TO TEST                                               │
│  "Consolidators will pay 30% premium for guaranteed migration      │
│  success and dedicated support, creating 40%+ gross margin."        │
│                                                                      │
│  ✓ Evidence: Company (capabilities), Customer (needs), Competitor  │
│                                                                      │
│  [Edit Bet]  [Link to Evidence]  [Export to Jira as Epic]          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Coach Behavior with Play-to-Win:**

**After Synthesis, Before Bets:**
```
Let's use the Play-to-Win framework to make your strategic choices explicit.

Based on your synthesis, I've drafted a strawman choice cascade:

WINNING ASPIRATION: "Be the #1 consolidator platform partner"
WHERE TO PLAY: Large consolidators, UK market
HOW TO WIN: Service excellence at scale

Before we create bets, let's stress-test these choices:

1. Is "consolidators" where you REALLY want to play, or are you
   hedging with retail as well? (Can't win if you don't commit)

2. What are you willing to NOT do? (Strategy is as much about
   what you WON'T do as what you will)

[Review Choice Cascade]
```

**Best Practice (from Lafley & Martin):**
- **Make choices, don't straddle**: "Be the best at everything" isn't a strategy
- **Choices must cascade**: If you choose consolidators (Where), service excellence (How) must follow logically
- **Test with "reverse logic"**: If competitor did opposite, would they also win? (If yes, your choice isn't distinct enough)

---

### Framework 4: Blue Ocean Strategy (W. Chan Kim & Renée Mauborgne)

**Origin:** "Blue Ocean Strategy" (2005) by W. Chan Kim and Renée Mauborgne.

**Purpose:** Find uncontested market space by creating new demand rather than competing in bloody "red oceans."

**Four Actions Framework:**
```
┌───────────────────────────────────────────────────────────────────┐
│ ELIMINATE                  │  RAISE                               │
│ Which factors the industry │  Which factors should be raised     │
│ takes for granted should   │  well above industry standard?      │
│ be eliminated?             │                                      │
├────────────────────────────┼──────────────────────────────────────┤
│ REDUCE                     │  CREATE                              │
│ Which factors should be    │  Which factors should be created    │
│ reduced below industry     │  that the industry has never        │
│ standard?                  │  offered?                            │
└────────────────────────────┴──────────────────────────────────────┘
```

**Strategy Canvas Template:**
```
       HIGH  │
             │                  Competitor A ──────●
             │                                    / \
             │                                   /   \
             │             Competitor B ●───────●     \
             │                         /             \
   OFFERING  │                        /               ●
    LEVEL    │         Us (Blue Ocean) ──────●
             │                   ╱            \     /
             │                  /              \   /
             │                 /                ●─●
       LOW   │                /
             └────────────────────────────────────────────────
               Factor 1  Factor 2  Factor 3  Factor 4  Factor 5
               (Price)   (Features)(Service) (Speed)  (Custom)
```

**Integration with Frontera Competitor Territory:**

**Blue Ocean Enhanced Questions:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ COMPETITOR TERRITORY → BLUE OCEAN ANALYSIS                           │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Looking at your top 3 competitors, what do they ALL compete on?    │
│  (These are industry "red ocean" battlegrounds)                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ • Price (fee compression race to bottom)                       │ │
│  │ • Feature breadth (who has most fund choices)                  │ │
│  │ • UI polish (who has prettiest app)                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Now, which of these factors could you ELIMINATE or REDUCE          │
│  to focus resources elsewhere?                                      │
│                                                                      │
│  💡 Example: "Reduce UI polish investment (consolidators care       │
│  about APIs, not pretty screens)"                                   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  What factors could you RAISE or CREATE that competitors            │
│  currently under-invest in?                                         │
│                                                                      │
│  ✨ Hint: Look at your customer "jobs-to-be-done" that aren't       │
│  being met by current solutions                                     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Your response...]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Synthesis with Blue Ocean Lens:**
```
┌──────────────────────────────────────────────────────────────────────┐
│ Blue Ocean Opportunity: "Service-as-Differentiator"                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Your research suggests a Blue Ocean opportunity:                   │
│                                                                      │
│  ❌ ELIMINATE: Retail direct marketing (competitors waste millions) │
│  ⬇️ REDUCE: Feature breadth (focus > variety)                        │
│  ⬆️ RAISE: Service quality (white-glove migration)                   │
│  ✨ CREATE: Migration SLA with penalty clauses (industry-first)     │
│                                                                      │
│  ┌─ Strategy Canvas Comparison ──────────────────────────────────┐  │
│  │                                                                │  │
│  │  HIGH  │                                                       │  │
│  │        │      Competitors ●─────●───────●                      │  │
│  │        │                  (Price)(Features)(UI)                │  │
│  │ LEVEL  │                                                       │  │
│  │        │  You ●──────────●──────────────────●                 │  │
│  │        │      (Price)    (API)           (Service SLA)         │  │
│  │  LOW   │                                                       │  │
│  │        └───────────────────────────────────────────────────    │  │
│  │         Price  Features  API   Service  Migration              │  │
│  │                          Depth Quality  SLA                    │  │
│  │                                                                │  │
│  │  ✓ You compete on DIFFERENT factors (Blue Ocean)              │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [Create Strategic Bet from Blue Ocean]                             │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Best Practice (from Kim & Mauborgne):**
- **Value innovation, not technology innovation**: Create leap in value for buyers AND reduce costs
- **Focus on non-customers**: Who chooses NOT to use any solution? Why?
- **Strategic sequence**: Utility → Price → Cost → Adoption (test in that order)

---

### Framework Integration Summary

| Framework | Best Used When | Frontera Integration Point | Output Format |
|-----------|---------------|---------------------------|---------------|
| **Business Model Canvas** | User needs to visualize entire business model | Synthesis phase (auto-fill from research) | Interactive canvas |
| **Jobs-to-be-Done** | Deep customer understanding needed | Customer Territory research questions | JTBD statements |
| **Play-to-Win** | Making explicit strategic choices | Strategic Bets phase (choice cascade) | 5-choice template |
| **Blue Ocean Strategy** | Seeking differentiation from competitors | Competitor Territory + Synthesis | Strategy canvas chart |

**User Selection Flow:**
```
At conversation start:

"Would you like to use strategy frameworks in this session?

□ Business Model Canvas (recommended for business model pivots)
□ Jobs-to-be-Done (recommended for customer-centric strategies)
□ Play-to-Win (recommended for focused market plays)
□ Blue Ocean Strategy (recommended for differentiation strategies)
□ Let the coach decide based on my context
□ No frameworks (free-form research)"
```

**Coach Adaptive Behavior:**
- If user selects frameworks → Weave into research questions explicitly
- If user says "Let coach decide" → Introduce framework when pattern emerges
- If user says "No frameworks" → Use methodology insights without naming frameworks

---

## Adaptive Coaching System Design

### Overview: Coaching That Learns and Adapts

**Design Principle:** The Strategy Coach should feel like a **personal thinking partner** who understands your style, not a rigid chatbot following scripts.

**Three Levels of Adaptation:**
1. **Explicit Preferences** (user-configured)
2. **Behavioral Observation** (ML-inferred)
3. **Contextual Adaptation** (real-time)

---

### Level 1: Explicit Preferences (User-Configured)

**Captured At:** Conversation start, editable anytime in profile

**Preference Categories:**

#### 1. Guidance Level

```typescript
type GuidanceLevel = 'structured' | 'balanced' | 'minimal';

const guidanceBehaviors = {
  structured: {
    questionStyle: 'Prescriptive with examples',
    frameworkUsage: 'Explicit templates provided',
    challengeFrequency: 'Moderate (validates understanding)',
    responseLength: 'Detailed explanations',
    proactivePrompts: 'Frequent ("Next, let\'s explore...")',
  },
  balanced: {
    questionStyle: 'Open-ended with follow-ups',
    frameworkUsage: 'Offered when relevant',
    challengeFrequency: 'High (pushes thinking)',
    responseLength: 'Concise with drill-down options',
    proactivePrompts: 'Occasional (when stuck)',
  },
  minimal: {
    questionStyle: 'Socratic questions only',
    frameworkUsage: 'Available on request',
    challengeFrequency: 'Very high (assumes expertise)',
    responseLength: 'Terse (action-oriented)',
    proactivePrompts: 'Rare (user drives)',
  },
};
```

**Example Coaching Difference:**

| Scenario | Structured | Balanced | Minimal |
|----------|-----------|----------|---------|
| **User asks vague question** | "Let me break that down into 3 specific questions: 1) ..." | "Can you be more specific? What aspect of X are you most concerned about?" | "Clarify." |
| **User completes research area** | "Great! You've completed Industry Forces. Next, let's explore Business Model. I've prepared 4 questions..." | "Nice work. Ready to move to Business Model, or want to refine Industry Forces first?" | "Business Model next?" |
| **User response lacks depth** | "That's a start. Let me give you an example from financial services: [detailed example]. Now, can you add more detail?" | "I sense you have more insights here. What data supports this claim?" | "Evidence?" |

#### 2. Framework Preferences

```typescript
interface FrameworkPreferences {
  businessModelCanvas: boolean;
  jobsToBeDone: boolean;
  playToWin: boolean;
  blueOcean: boolean;
  autoSuggest: boolean; // Coach proposes frameworks based on context
}
```

**UI Control:**
```
┌──────────────────────────────────────────────────────────────┐
│ FRAMEWORK PREFERENCES                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Which frameworks should I use with you?                     │
│                                                              │
│  ☑ Business Model Canvas                                     │
│     Auto-fill during synthesis                              │
│                                                              │
│  ☑ Jobs-to-be-Done                                           │
│     Include in Customer Territory questions                 │
│                                                              │
│  ☐ Play-to-Win                                               │
│     Guide Strategic Bets with choice cascade                │
│                                                              │
│  ☐ Blue Ocean Strategy                                       │
│     Highlight differentiation opportunities                 │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  ☑ Let coach suggest frameworks based on my context         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 3. Challenge Style

```typescript
type ChallengeStyle = 'socratic' | 'direct' | 'alternative';

const challengeApproaches = {
  socratic: {
    example: "What assumptions are you making about consolidators? What would invalidate those assumptions?",
    tone: "Probing questions",
  },
  direct: {
    example: "I see a gap here. You claim service is a differentiator, but your research shows consolidators prioritize price. Which is true?",
    tone: "Point out contradictions",
  },
  alternative: {
    example: "In other industries I've seen, platforms win by [alternative approach]. Have you considered that?",
    tone: "Offer cross-industry perspectives",
  },
};
```

#### 4. Response Detail Preference

```typescript
type ResponseDetail = 'concise' | 'balanced' | 'comprehensive';

const responseFormats = {
  concise: {
    format: 'Executive summary (2-3 sentences) + bullet points',
    expandable: true, // "Show more" link
  },
  balanced: {
    format: '2-3 paragraphs with inline evidence links',
    expandable: false,
  },
  comprehensive: {
    format: 'Full analysis (4-6 paragraphs) with examples and evidence',
    expandable: false,
  },
};
```

---

### Level 2: Behavioral Observation (ML-Inferred)

**Goal:** Learn user patterns without explicit questions.

**Observable Signals:**

#### Writing Style Signals

```typescript
interface WritingStyleProfile {
  avgResponseLength: number;           // 50-500 words
  bulletPointRatio: number;            // 0-1 (0 = paragraphs only, 1 = bullets only)
  dataUsageFrequency: number;          // 0-1 (how often user cites numbers)
  formalityScore: number;              // 0-1 (0 = casual, 1 = formal)
  industryJargonDensity: number;       // Technical terms per 100 words

  // Inferred preferences
  prefersBulletPoints: boolean;        // bulletPointRatio > 0.6
  prefersDataDriven: boolean;          // dataUsageFrequency > 0.5
  formalityLevel: 'casual' | 'professional' | 'academic';
}
```

**Coaching Adaptation:**

| Observed Behavior | Coach Adaptation |
|-------------------|------------------|
| **User writes in bullets** | Coach responds in bullet format: "Key insights: • X • Y • Z" |
| **User cites data frequently** | Coach requests quantification: "Can you quantify that?" |
| **User uses academic language** | Coach mirrors formality: "This warrants further investigation" vs. "Let's dig into this" |
| **User writes 300+ word responses** | Coach provides detailed, comprehensive responses |
| **User writes <50 word responses** | Coach provides concise, action-oriented guidance |

#### Work Pattern Signals

```typescript
interface WorkPatternProfile {
  sessionDurations: number[];          // [45, 60, 30, 90] minutes
  sessionsPerWeek: number;             // 2-5
  typicalStartTime: string;            // "14:00" (afternoon worker)
  territoryJumpFrequency: number;      // How often user switches between territories

  // Inferred preferences
  prefersFocusedSessions: boolean;     // sessionDurations consistently 30-45 min
  isWeekendUser: boolean;              // >30% sessions on Sat/Sun
  prefersLinearProgression: boolean;   // territoryJumpFrequency < 0.2
}
```

**Coaching Adaptation:**

| Observed Behavior | Coach Adaptation |
|-------------------|------------------|
| **User does 30-min bursts** | Coach suggests natural break points: "Good stopping point. Pick up here next time?" |
| **User works on weekends** | Coach avoids "urgent" language, more reflective tone |
| **User jumps between territories** | Coach doesn't force linear progression: "Want to explore Customer territory while Company is fresh?" |
| **User works late at night** | Coach tone shifts to supportive: "Making great progress despite the late hour!" |

#### Strategic Thinking Signals

```typescript
interface ThinkingStyleProfile {
  referencesFrameworks: string[];      // ["JTBD", "BMC", "Five Forces"]
  expressesUncertainty: number;        // 0-1 (frequency of "maybe", "not sure")
  asksForValidation: number;           // 0-1 (frequency of "does this make sense?")
  challengesCoach: number;             // 0-1 (pushback frequency)

  // Inferred confidence
  confidenceLevel: 'low' | 'medium' | 'high';
  needsReassurance: boolean;           // expressesUncertainty > 0.4
  independentThinker: boolean;         // challengesCoach > 0.3
}
```

**Coaching Adaptation:**

| Observed Behavior | Coach Adaptation |
|-------------------|------------------|
| **User frequently unsure** | Coach provides more validation: "That's exactly right. This is a common pattern in your industry." |
| **User challenges coach** | Coach encourages debate: "Good pushback. What's your alternative view?" |
| **User references frameworks** | Coach leverages those frameworks: "As you mentioned earlier with JTBD..." |
| **User is confident** | Coach challenges more aggressively: "Are you certain? What would disprove this?" |

**ML Model (Simplified):**
```python
# Pseudo-code for behavioral inference
class UserProfileLearner:
    def analyze_message(self, user_message: str) -> ProfileUpdates:
        # Writing style
        word_count = len(user_message.split())
        has_bullets = '•' in user_message or '-' in user_message
        has_numbers = bool(re.search(r'\d+%|\$\d+|\d+x', user_message))

        # Uncertainty indicators
        uncertainty_phrases = ["not sure", "maybe", "i think", "possibly"]
        uncertainty_score = sum(phrase in user_message.lower()
                               for phrase in uncertainty_phrases)

        # Update profile
        profile.update({
            'avg_response_length': rolling_average(word_count),
            'uses_bullets': has_bullets,
            'cites_data': has_numbers,
            'uncertainty_level': uncertainty_score,
        })

        return profile
```

---

### Level 3: Contextual Adaptation (Real-Time)

**Goal:** Adapt based on current conversation context, not just historical patterns.

**Contextual Signals:**

#### Research Progress Context

```typescript
interface ResearchProgressContext {
  currentPhase: 'discovery' | 'research' | 'synthesis' | 'bets';
  territoriesCompleted: number;         // 0-3 (Company, Customer, Competitor)
  areasCompletedPerTerritory: {
    company: number;                    // 0-6
    customer: number;                   // 0-6
    competitor: number;                 // 0-6
  };
  synthesisGenerated: boolean;
  researchDepth: 'light' | 'medium' | 'deep'; // Based on response length
  timeInCurrentPhase: number;           // minutes
}
```

**Adaptive Coaching Examples:**

| Context | Coach Response |
|---------|---------------|
| **User completes 4/6 research areas** | "You've hit the synthesis threshold! Generate insights now, or complete remaining areas?" |
| **User in research phase for 90+ min** | "You're making thorough progress. Want to save and continue later?" |
| **User's responses are getting shorter** | "I notice your responses are getting more concise. Feeling tired? We can pause." |
| **User completed company but not customer** | "Your company insights are strong. Customer territory might reveal surprising opportunities. Want to explore?" |

#### Emotional State Detection

```typescript
interface EmotionalStateSignals {
  frustrationIndicators: string[];     // ["this is hard", "stuck", "confused"]
  enthusiasmIndicators: string[];      // ["great!", "exactly", "love this"]
  hesitationIndicators: string[];      // ["hmm", "not sure", "maybe"]

  // Inferred state
  currentState: 'frustrated' | 'engaged' | 'hesitant' | 'confident';
}
```

**Coaching Tone Adaptation:**

| Detected State | Coach Response Tone | Example |
|----------------|---------------------|---------|
| **Frustrated** | Empathetic, simplifying | "Let's step back. This question is asking: [simpler version]. No right answer, just your perspective." |
| **Engaged** | Match enthusiasm, go deeper | "Yes! And taking that further—what if consolidators [provocative question]?" |
| **Hesitant** | Reassuring, providing scaffolding | "Uncertainty is normal here. Let me share what other platforms in your situation have found..." |
| **Confident** | Challenge constructively | "You seem sure about this. What evidence might prove you wrong?" |

#### Strategic Context Awareness

```typescript
interface StrategicContextSignals {
  userMentionedCompetitors: string[];  // ["Transact", "AJ Bell"]
  userMentionedSegments: string[];     // ["consolidators", "retail"]
  userMentionedPainPoints: string[];   // ["migration", "integration"]

  // Cross-reference with research
  missingCompetitorAnalysis: string[]; // Mentioned but not analyzed
  contradictions: string[];             // Claims that conflict with earlier responses
}
```

**Proactive Coaching:**

```
Example 1: Missing Analysis
──────────────────────────
User mentions "Transact" in Customer research but hasn't
analyzed them in Competitor territory.

Coach: "I notice you mentioned Transact in your customer research.
Since they seem important, should we add them to your competitor
analysis?"

Example 2: Detected Contradiction
──────────────────────────
User claims "price is key" in Company research but says
"service matters most" in Customer research.

Coach: "I see a tension: you mentioned price competitiveness
in Company territory, but customers seem to value service.
Which drives more decisions in reality?"

Example 3: Pattern Recognition
──────────────────────────
User mentions "integration" 6 times across all research.

Coach: "Integration keeps coming up. This might be your
strategic crux. Want to explore this as a potential
differentiator?"
```

---

### Adaptive Coaching State Machine

**System Architecture:**

```typescript
interface AdaptiveCoachingEngine {
  // Input signals
  userProfile: UserProfile;              // Historical patterns
  currentContext: ResearchProgressContext; // Current session state
  conversationHistory: Message[];        // Recent messages

  // Adaptation layers
  selectGuidanceLevel(): GuidanceLevel;
  selectResponseTone(): ResponseTone;
  selectFrameworkUsage(): FrameworkStrategy;
  detectEmotionalState(): EmotionalState;

  // Output
  generateCoachResponse(userMessage: string): CoachResponse;
}

interface CoachResponse {
  content: string;                       // The actual response text
  tone: ResponseTone;                    // How it's said
  suggestedActions: Action[];            // Next steps offered
  frameworkSuggestions: Framework[];     // Templates offered
  confidenceScore: number;               // How certain coach is (0-1)
}

type ResponseTone =
  | 'supportive'                         // "You're on the right track..."
  | 'challenging'                        // "What evidence supports that?"
  | 'neutral'                            // "Let's explore X..."
  | 'celebratory'                        // "Excellent insight!"
  | 'empathetic';                        // "This part can be tricky..."
```

**Decision Tree for Response Generation:**

```
User sends message
     ↓
Analyze user profile (historical)
     ↓
Analyze current context (session state)
     ↓
Detect emotional state (message sentiment)
     ↓
Select guidance level
     ├─ Structured → Provide template + example
     ├─ Balanced → Ask follow-up + offer framework
     └─ Minimal → Socratic question only
     ↓
Select tone
     ├─ Frustrated user → Empathetic + simplify
     ├─ Confident user → Challenge assumption
     ├─ Hesitant user → Reassure + scaffold
     └─ Engaged user → Match enthusiasm + deepen
     ↓
Check for proactive interventions
     ├─ Missing competitor mentioned? → Suggest adding
     ├─ Contradiction detected? → Highlight tension
     ├─ Pattern emerging? → Call it out
     └─ Milestone reached? → Celebrate + suggest next step
     ↓
Generate response with:
  - Content (answer to question)
  - Suggested actions (next steps)
  - Framework offers (if relevant)
     ↓
Return to user
```

---

### User-Facing Adaptive Features

#### "Coach Help" Button in Research

**Location:** Visible in territory deep-dives, synthesis review

**Behavior:**
```
User clicks "🤖 Coach Help" while answering:
"What are the key competitive dynamics in your market?"

Coach analyzes:
- User's industry (from profile)
- User's guidance preference
- Current response length (if any typed)

Structured guidance:
┌────────────────────────────────────────────────────────────┐
│ 💡 COACH HELP                                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  In financial services, competitive dynamics often involve:│
│                                                            │
│  • Market consolidation (M&A activity)                     │
│  • Regulatory shifts (FCA, Consumer Duty)                  │
│  • Technology disruption (fintech entrants)                │
│  • Scale economics (winner-take-most)                      │
│                                                            │
│  Example response:                                         │
│  "The UK wealth platform market is consolidating rapidly.  │
│   Top 5 platforms now control 67% of AUA (up from 52%      │
│   three years ago). This creates winner-take-most          │
│   dynamics driven by scale economics in technology         │
│   investment and regulatory compliance costs."             │
│                                                            │
│  [Use this example]  [Show more examples]  [Close]         │
│                                                            │
└────────────────────────────────────────────────────────────┘

Minimal guidance:
┌────────────────────────────────────────────────────────────┐
│ 💡 COACH HELP                                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Consider:                                                 │
│  • Who's consolidating? (M&A trends)                       │
│  • What regulatory forces matter? (FCA, etc.)              │
│  • Where is technology disrupting? (fintech)               │
│                                                            │
│  [Close]                                                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### Adaptive Synthesis Format

**User preference: Comprehensive**
```
STRATEGIC SYNTHESIS

Generated from 6 research areas across Company and Customer territories
Last updated: 14 minutes ago

EXECUTIVE SUMMARY

Your research reveals three interconnected strategic patterns that point
toward a focused consolidator strategy. Market consolidation is creating
winner-take-most dynamics (top 5 platforms = 67% share), while advisers
prioritize service excellence over price competitiveness. This creates a
defensible opportunity for platforms that invest in integration depth and
white-glove migration capabilities—areas where incumbents underinvest due
to their retail-focused strategies.

KEY PATTERNS (Detailed Analysis)

1. Winner-Take-Most Market Dynamics

   [4 paragraphs of detailed analysis with evidence citations]

2. Service-as-Differentiator Opportunity

   [4 paragraphs...]

[Total: 1,200 words]
```

**User preference: Concise**
```
STRATEGIC SYNTHESIS

Generated from 6 research areas • 14 min ago

KEY PATTERNS

• Market consolidation = winner-take-most (top 5 = 67% share)
• Advisers value service > price (willing to pay 30% premium)
• Integration depth is table stakes, but white-glove migration is underserved

[▼ Show full analysis]

OPPORTUNITIES

1. Consolidator Service Excellence

   Cross-pillar evidence:
   • Company: Scale economics favor large players ✓
   • Customer: Advisers prioritize service ✓
   • Competitor: Transact/AJ Bell weak at consolidator support ✓

   Confidence: HIGH (8/10)

   [Create Strategic Bet →]

[Total: 300 words + expandable sections]
```

---

## User Profiling Architecture

### Non-Invasive Profile Building

**Guiding Principle:** Build user understanding progressively without overwhelming onboarding.

**Profile Data Structure:**

```typescript
interface UserCoachingProfile {
  // Core identity (from onboarding)
  userId: string;
  organizationId: string;
  role: string;                          // "VP Product", "CPO", "CEO"
  industry: string;                      // "Financial Services"
  companySize: string;                   // "1000-5000"
  strategicFocus: string[];              // ["market-expansion", "product-led"]

  // Coaching preferences (explicit)
  guidanceLevel: 'structured' | 'balanced' | 'minimal';
  responseDetail: 'concise' | 'balanced' | 'comprehensive';
  challengeStyle: 'socratic' | 'direct' | 'alternative';
  frameworkPreferences: {
    businessModelCanvas: boolean;
    jobsToBeDone: boolean;
    playToWin: boolean;
    blueOcean: boolean;
    autoSuggest: boolean;
  };

  // Behavioral patterns (observed)
  writingStyle: {
    avgResponseLength: number;
    bulletPointRatio: number;
    dataUsageFrequency: number;
    formalityScore: number;
    industryJargonDensity: number;
  };

  workPatterns: {
    sessionDurations: number[];          // Last 10 sessions
    sessionsPerWeek: number;
    typicalStartTime: string;            // ISO time
    preferredDayOfWeek: string[];       // ["Tuesday", "Wednesday"]
    territoryJumpFrequency: number;
  };

  strategicThinkingStyle: {
    referencesFrameworks: string[];
    expressesUncertainty: number;
    asksForValidation: number;
    challengesCoach: number;
    confidenceLevel: 'low' | 'medium' | 'high';
  };

  // Engagement history
  conversationsCompleted: number;
  synthesisGenerated: number;
  strategicBetsCreated: number;
  avgResearchDepth: 'light' | 'medium' | 'deep';

  // Meta
  profileVersion: number;                // For ML model updates
  lastUpdated: Date;
  consentToLearning: boolean;            // GDPR compliance
}
```

---

### Data Gathering Timeline

#### Onboarding (Day 1, 5 minutes)

**Already Captured in Frontera:**
- Company name, industry, size
- Strategic focus
- Pain points, target outcomes

**Total burden: 0 minutes** (already doing this)

---

#### First Conversation Start (Day 1, +1-2 minutes)

**New: Coaching Preference Survey**

```
┌──────────────────────────────────────────────────────────────┐
│ Before we begin, help me understand how you prefer to work: │
│                                                              │
│ 1. Guidance level?  ○ Structured  ● Balanced  ○ Minimal     │
│ 2. Strategic focus? ☑ Exploring  ☐ Validating  ☐ Building case│
│ 3. Use frameworks?  ☑ JTBD  ☑ PTW  ☐ BMC  ☐ Blue Ocean      │
│                                                              │
│ [Skip] [Start Session]                                       │
└──────────────────────────────────────────────────────────────┘
```

**User can skip** (defaults to "balanced" guidance)

**Total burden: +1-2 minutes** (one-time)

---

#### During Research (Passive Learning, 0 minutes)

**Automatic Behavioral Observation:**

Every user message is analyzed for:
- Response length (word count)
- Formatting style (bullets vs. paragraphs)
- Data usage (mentions of %, $, metrics)
- Formality (vocabulary analysis)
- Uncertainty markers ("maybe", "I think", "not sure")
- Framework references ("as Jobs-to-be-Done suggests...")

**No user action required**

**Example Profile Update After 3 Responses:**
```json
{
  "writingStyle": {
    "avgResponseLength": 287,
    "bulletPointRatio": 0.67,
    "dataUsageFrequency": 0.8,
    "formalityScore": 0.7,
    "industryJargonDensity": 12.3
  },
  "inferred": {
    "prefersBullets": true,
    "prefersDataDriven": true,
    "formalityLevel": "professional"
  }
}
```

**Coach Adaptation (Automatic):**
- Starts responding in bullet format
- Requests quantification more often
- Mirrors professional tone

**Total burden: 0 minutes** (invisible)

---

#### Post-Synthesis (Day 1, +30 seconds)

**Micro-Survey: Refinement Prompt**

```
┌──────────────────────────────────────────────────────────────┐
│ Quick preference check:                                      │
│                                                              │
│ I noticed you provided detailed, data-rich responses.        │
│ Should I:                                                    │
│                                                              │
│ ○ Match your detail (comprehensive responses)                │
│ ● Provide summaries + drill-down options                     │
│ ○ Keep responses concise (action-oriented)                   │
│                                                              │
│ [Skip] [Save]                                                │
└──────────────────────────────────────────────────────────────┘
```

**Total burden: +30 seconds** (2 clicks, one-time)

---

#### Every 3-5 Conversations (Ongoing, +10 seconds)

**Periodic Micro-Prompts:**

```
Example 1 (after 3rd conversation):
┌──────────────────────────────────────────────────────────────┐
│ I've adjusted my coaching based on our work together.        │
│ [Review my understanding →]  [Dismiss]                       │
└──────────────────────────────────────────────────────────────┘

If user clicks "Review":
┌──────────────────────────────────────────────────────────────┐
│ MY UNDERSTANDING OF YOUR PREFERENCES                         │
│                                                              │
│ ✓ You prefer bullet-point format                            │
│ ✓ You value data-driven insights                            │
│ ✓ You often reference Jobs-to-be-Done framework             │
│ ✓ You typically work in 45-min sessions on afternoons       │
│                                                              │
│ Is this accurate?  [Yes, perfect]  [Some corrections]        │
└──────────────────────────────────────────────────────────────┘

Example 2 (after 5th conversation):
┌──────────────────────────────────────────────────────────────┐
│ I notice you always emphasize customer insights over         │
│ competitive analysis. Should I:                              │
│                                                              │
│ ○ Proactively prompt for more customer depth                 │
│ ● Keep current balance                                       │
│ ○ Encourage more competitor focus                            │
│                                                              │
│ [Save]  [Dismiss]                                            │
└──────────────────────────────────────────────────────────────┘
```

**Total burden: +10 seconds every 3 convos** (optional)

---

### Total User Burden Over 5 Conversations

| Touchpoint | Time | Skippable? |
|------------|------|-----------|
| Onboarding | 0 min (existing) | No |
| First conversation preference | 1-2 min | Yes |
| Passive observation | 0 min | N/A |
| Post-synthesis micro-survey | 30 sec | Yes |
| Periodic refinement (×2) | 20 sec | Yes |
| **TOTAL** | **2.5-3 min over 5 conversations** | **Mostly** |

**Averages to:** ~30 seconds per conversation (negligible friction)

---

### Profile Dashboard (User-Accessible)

**Location:** User menu → "Coaching Preferences"

```
┌──────────────────────────────────────────────────────────────────────┐
│ MY COACHING PROFILE                                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Maya Okonkwo, VP of Product                                         │
│  B2B SaaS, 3,500 employees                                           │
│  Strategic Focus: Market expansion, Team empowerment                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ COACHING PREFERENCES                                           │ │
│  │                                                                │ │
│  │ Guidance Level:     ● Balanced                                 │ │
│  │ Response Detail:    ● Summaries + drill-down                   │ │
│  │ Challenge Style:    ● Direct feedback                          │ │
│  │ Frameworks:         Jobs-to-be-Done, Play-to-Win               │ │
│  │                                                                │ │
│  │ [Edit Preferences]                                             │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ WHAT I'VE LEARNED ABOUT YOU                                   │ │
│  │                                                                │ │
│  │ Based on 5 strategy sessions:                                 │ │
│  │                                                                │ │
│  │ 📝 Writing Style:                                              │ │
│  │    • You prefer bullet points over paragraphs                 │ │
│  │    • You frequently cite data and metrics                     │ │
│  │    • Your responses average 280 words (detailed)              │ │
│  │                                                                │ │
│  │ 🎯 Strategic Focus:                                            │ │
│  │    • You emphasize customer insights heavily                  │ │
│  │    • You often reference Jobs-to-be-Done framework            │ │
│  │    • You challenge assumptions constructively                 │ │
│  │                                                                │ │
│  │ ⏰ Work Patterns:                                               │ │
│  │    • You typically work in 45-60 minute sessions              │ │
│  │    • You prefer afternoons (14:00-17:00)                      │ │
│  │    • You revisit research after synthesis                     │ │
│  │                                                                │ │
│  │ ℹ️  This helps me tailor coaching to your style. I never       │ │
│  │    share this data or use it for purposes other than improving│ │
│  │    your coaching experience.                                  │ │
│  │                                                                │ │
│  │ [✓ Consent to adaptive learning] (Required for personalization)│ │
│  │ [Reset all learned behaviors]                                 │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ENGAGEMENT HISTORY                                             │ │
│  │                                                                │ │
│  │ • 5 strategy conversations completed                           │ │
│  │ • 3 syntheses generated                                        │ │
│  │ • 7 strategic bets created                                     │ │
│  │ • Research depth: Medium-Deep (avg 260 words/response)        │ │
│  │ • Most explored territory: Customer (6/6 areas)               │ │
│  │ • Least explored territory: Competitor (2/6 areas)            │ │
│  │                                                                │ │
│  │ 💡 Insight: Consider deeper competitor analysis in your next   │ │
│  │    session to triangulate strategic opportunities.             │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
1. **Transparency**: User sees exactly what coach has learned
2. **Control**: Can reset behaviors or disable adaptive learning
3. **GDPR Compliance**: Explicit consent for behavioral tracking
4. **Actionable insights**: Coach suggests areas to explore based on history

---

## Implementation Guidance

### Phase 1: MVP Enhancements (Now - Next Sprint)

**Priority 1: AI Streaming Display**
- File: `CoachingPanel.tsx`, `MessageStream.tsx`
- Add real-time streaming state management
- Implement typing indicator animation
- Add stop/regenerate controls
- **Effort:** 4 hours
- **Impact:** Eliminates #1 user complaint

**Priority 2: Territory Modal Redesign**
- Files: `CompanyTerritoryDeepDive.tsx`, `CustomerTerritoryDeepDive.tsx`
- Replace wizard with sidebar navigation
- Add progress tracking within modal
- Implement auto-save with confirmation
- **Effort:** 12 hours
- **Impact:** Reduces abandonment 30%+

**Priority 3: Basic User Profiling**
- New table: `user_coaching_profiles`
- Capture guidance level preference at conversation start
- Store in `user_metadata` JSONB field
- **Effort:** 6 hours
- **Impact:** Enables adaptive coaching foundation

---

### Phase 2: Framework Integration (Q2 2026)

**Jobs-to-be-Done Questions**
- Update `CustomerTerritoryDeepDive.tsx` with JTBD prompts
- Add "💼 Functional / ❤️ Emotional / 👥 Social Job" sections
- Coach system prompt includes JTBD lens
- **Effort:** 8 hours

**Business Model Canvas Auto-Fill**
- New component: `BusinessModelCanvas.tsx`
- Parse research responses to extract BMC blocks
- Display in Synthesis section with edit capability
- **Effort:** 16 hours

**Play-to-Win Choice Cascade**
- New component: `PlayToWinTemplate.tsx`
- Integrate into Strategic Bets phase
- 5-question cascade with validation
- **Effort:** 12 hours

---

### Phase 3: Adaptive Coaching Engine (Q3 2026)

**Behavioral Observation Pipeline**
- New service: `UserBehaviorAnalyzer`
- Analyze messages for writing style, work patterns, strategic thinking
- Update `user_coaching_profiles` asynchronously
- **Effort:** 24 hours

**Dynamic System Prompt Generation**
- Modify `buildSystemPrompt()` in `strategy-coach/index.ts`
- Inject user profile context into prompt
- Adjust tone, detail, challenge style based on profile
- **Effort:** 12 hours

**Profile Dashboard**
- New page: `/dashboard/coaching-preferences`
- Display learned behaviors
- Allow preference editing and reset
- **Effort:** 16 hours

---

### Phase 4: Advanced Visualizations (Q3-Q4 2026)

**Strategic Opportunity Map (2x2 Matrix)**
- Use Recharts or D3.js
- Interactive scatter plot with draggable points
- Click → expand evidence trail
- **Effort:** 20 hours

**Blue Ocean Strategy Canvas**
- Line chart comparing user vs. competitors across factors
- Editable factor weights
- Visual "blue ocean" highlighting
- **Effort:** 16 hours

**JTBD Insight Map**
- Visual hierarchy of jobs (functional → emotional → social)
- Link jobs to opportunities
- **Effort:** 12 hours

---

## Conclusion

This supplement provides the **implementation roadmap** for elevating Frontera's Product Strategy Coach from "functional MVP" to "industry-leading strategic partner."

**Key Additions:**

1. **Visual Mockups** show exactly how critical improvements should look and behave
2. **Framework Integration** leverages proven strategy tools (BMC, JTBD, PTW, Blue Ocean) to provide familiar scaffolding
3. **Adaptive Coaching** creates a personalized experience that learns and evolves with each user
4. **User Profiling** builds understanding progressively without overwhelming onboarding

**Total Development Effort Estimate:**

| Phase | Features | Effort | Timeline |
|-------|----------|--------|----------|
| Phase 1 (MVP) | Streaming, modal redesign, basic profiling | 22 hours | 1 sprint |
| Phase 2 (Frameworks) | JTBD, BMC, PTW integration | 36 hours | 1.5 sprints |
| Phase 3 (Adaptive AI) | Behavioral learning, dynamic prompts | 52 hours | 2 sprints |
| Phase 4 (Viz) | Opportunity maps, strategy canvases | 48 hours | 2 sprints |
| **TOTAL** | **Full vision** | **158 hours** | **~4 months** |

**Recommended Sequencing:**
1. **Now:** Fix critical UX (streaming, modals) + accessibility
2. **Q2:** Add framework templates (JTBD, BMC) + visualizations
3. **Q3:** Implement adaptive coaching engine + profile dashboard
4. **Q4:** Advanced features (Blue Ocean canvas, collaborative editing)

By following this roadmap, Frontera will deliver a coaching experience that is:
- **Intuitive** (UX friction eliminated)
- **Credible** (leverages trusted frameworks)
- **Personal** (adapts to each user's style)
- **Visual** (insights presented spatially)
- **Enterprise-grade** (accessible, secure, compliant)

This positions Frontera as **the** strategic coaching platform for enterprise product leaders.

---

**Document Version:** 1.0
**Created:** January 18, 2026
**Next Update:** Q2 2026 (post-Phase 2 implementation)
**Companion Document:** `PRODUCT_STRATEGY_COACH_DESIGN_REVIEW.md`
