# Strategy Coach V2: Form-Based Question Cards Redesign

## Overview

**Problem**: MVP2 currently uses chat-only research where users answer territory questions through conversation. This creates a "stuck in chat loop" feeling with no structured capture of insights. The form-based deep-dive UI (ResearchSection) exists but is NOT integrated into the V2 layout.

**Solution**: Redesign the chat interface so the Coach asks questions one at a time using **interactive QuestionCards** that contain form-based inputs. Users answer within the card (with AI assistance), then submit. The chat remains available below for questions, insights, and clarifications, the chat inputs should also be considered to update and enhance the quality of the card answers, the coach should ask if the user wants them to update the card based on the coaching conversations in the chat. The Coach should be able to access all data for the company and user including: the chat history, uploads, form inputs, debates etc. when answering questions and coaching the user. The Coach should also be able to produce links to frameworks, publications, blogs and articles which can challenge/ inform the user as part of the question flow. These can be sourced from the Lenny Transcript archive, the product leaders referenced in the Frontera MAster overview and wider seaches using the Anthropic API

**User Preferences** (confirmed Feb 2026):
- ✅ Question flow: One question at a time (guided experience)
- ✅ Answer editing: Always editable (click to expand and update)
- ✅ Progress location: Sticky card above chat input

---

## 1. Core Concept: QuestionCard System

### 1.1 User Experience Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  CHAT PANEL                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Coach Avatar] Let's explore your Company Foundation.           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [ExplanationCard] COMPANY FOUNDATION                        │ │
│  │ Understanding your company's core identity and strategic... │ │
│  │                                    Question 1 of 3          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [QuestionCard - ACTIVE]                                     │ │
│  │                                                             │ │
│  │ ❶ What are your company's core products/services and       │ │
│  │    what customer problems do they solve?                    │ │
│  │                                                             │ │
│  │ ┌─────────────────────────────────────────────────────────┐ │ │
│  │ │ [Textarea - user types answer here]                     │ │ │
│  │ │                                                         │ │ │
│  │ │                                                         │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │ Confidence: [Data ○] [Experience ●] [Guess ○]              │ │
│  │                                                             │ │
│  │ ┌─────────────────────────────────────────────────────────┐ │ │
│  │ │ ✨ Ask Coach for Suggestion                              │ │ │
│  │ └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │                              [Submit Answer] (gold button)  │ │
│  └────────────────────────────────────────────────────────────┘ │
│├─────────────────────────────────────────────────────────────────┤
│  [Chat Input: "Ask a question or share an insight..."]    [➤]  │
└─────────────────────────────────────────────────────────────────┘                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [WhatsNextCard - STICKY]                                    │ │
│  │ COMPANY FOUNDATION  ━━━━━━━━━━━━░░░░░  1/3 questions        │ │
│  │ ✓ Core products  ○ Differentiators  ○ Strategic priorities │ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
```

### 1.2 Card Types

| Card Type | Purpose | State |
|-----------|---------|-------|
| **ExplanationCard** | Introduce research area (existing) | Read-only |
| **QuestionCard** | Active question with form input | Interactive |
| **AnsweredCard** | Submitted answer (collapsed) | Expandable/Editable |
| **WhatsNextCard** | Progress tracker (sticky) | Real-time updates |

### 1.3 Question Flow

1. Coach sends **ExplanationCard** introducing the research area
2. Coach sends **QuestionCard #1** (active, expanded)
3. User types answer in textarea
4. User optionally sets confidence level
5. User optionally clicks "Ask Coach for Suggestion" → InlineCoachBar appears with AI help
6. User optionally clicks "Ask Coach to review draft answer" (the coach then critically assesses the answer offering challenge and ideation to enhance it)
 -> opportunity for user to accept the coach advice
7. User clicks **"Submit Answer"** (gold button)
8. QuestionCard #1 collapses into **AnsweredCard** (shows preview)
9. Coach sends brief acknowledgment + **QuestionCard #2**
10. Repeat for all 3 questions
11. When area complete → Coach sends summary + **WhatsNextCard** updates

---

## 2. Card Component Designs

### 2.1 QuestionCard (NEW - Primary Interactive Card)

```
┌────────────────────────────────────────────────────────────────┐
│ ┌──┐                                                           │
│ │❶│  What are your company's core products/services and        │
│ └──┘  what customer problems do they solve?                    │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                            │ │
│ │  [Textarea - 5 rows, expandable]                          │ │
│ │  placeholder: "Share your insights here..."                │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ How confident are you?                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│ │ 📊 Data  │ │ 💡 Exp.  │ │ 🎯 Guess │   (radio buttons)      │
│ └──────────┘ └──────────┘ └──────────┘                        │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ ✨ Ask Coach for Suggestion                                 │ │ ← Generates starting point
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Review My Draft Answer                                   │ │ ← Critical assessment
│ └────────────────────────────────────────────────────────────┘ │
│                                                                │
│ (When review requested, CoachReviewPanel appears here)         │
│                                                                │
│                                        ┌────────────────────┐  │
│                                        │   Submit Answer    │  │ ← Gold primary button
│                                        └────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Two Coach Assistance Modes:**

1. **"Ask Coach for Suggestion"** (existing InlineCoachBar)
   - Generates a starting point/suggestion for empty or sparse answers
   - User can apply suggestion to their answer

2. **"Review My Draft Answer"** (NEW - CoachReviewPanel)
   - Coach critically assesses the user's draft
   - Offers challenges: "Have you considered...?", "What about...?"
   - Provides ideation to enhance the answer
   - Links to relevant resources (Lenny, articles, frameworks)
   - User can accept/apply coach recommendations

**Styling:**
- Border: `border-2 border-cyan-200`
- Background: `bg-white`
- Border radius: `rounded-2xl`
- Shadow: `shadow-sm hover:shadow-md`
- Question number badge: `w-8 h-8 bg-cyan-50 text-[#0891b2] rounded-lg font-bold`
- Review button: `border-2 border-[#1a1f3a]/20 text-[#1a1f3a]` (navy accent)

**States:**
- **Active**: Full form visible, submit button enabled when text entered
- **Loading**: Submit button shows spinner while saving
- **Reviewing**: CoachReviewPanel visible with coach feedback
- **Disabled**: When another question is active (shouldn't happen in 1-at-a-time flow)

### 2.2 CoachReviewPanel (NEW - Critical Assessment)

When user clicks "Review My Draft Answer", this panel appears:

```
┌────────────────────────────────────────────────────────────────┐
│ 🔍 COACH REVIEW                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ Your answer covers the basics well. Here are some areas to     │
│ strengthen:                                                    │
│                                                                │
│ ⚡ CHALLENGES                                                   │
│ • Have you considered how your solution differs from           │
│   competitors' approaches to the same problem?                 │
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
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📄 April Dunford: "Obviously Awesome"                     │   │
│ │    → Framework for articulating product positioning      │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                │
│ ┌────────────────────┐  ┌────────────────────────────────────┐ │
│ │  Apply Suggestions │  │  Continue Without Changes          │ │
│ └────────────────────┘  └────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Styling:**
- Border: `border-2 border-[#1a1f3a]/30`
- Background: `bg-slate-50`
- Challenge icons: Navy accent
- Resource cards: `bg-white border border-slate-200 rounded-lg p-3`
- "Apply Suggestions" button: Gold primary

**Resource Sources:**
- Lenny's Podcast transcripts (from archive)
- Product leaders from Frontera Master overview
- Anthropic API web search for current articles/frameworks

### 2.4 AnsweredCard (Collapsed Submitted Answer)

```
┌────────────────────────────────────────────────────────────────┐
│ ✓ Question 1: Core products/services                           │
│                                                                │
│ "We provide enterprise SaaS solutions for supply chain         │
│ optimization, solving inventory visibility and demand..."      │ ← truncated preview
│                                                                │
│ Confidence: 💡 Experience                    [Edit Answer →]   │
└────────────────────────────────────────────────────────────────┘
```

**Styling:**
- Border: `border border-emerald-200`
- Background: `bg-emerald-50/50`
- Checkmark: `text-emerald-600`
- Edit button: `text-cyan-600 hover:text-cyan-700`

**Behavior:**
- Click "Edit Answer" → expands back to full QuestionCard with prefilled values
- Shows "Update Answer" button instead of "Submit Answer"
- Can collapse without changes via "Cancel" link
- **Coach can suggest updates** based on chat conversations (user accepts/declines)

### 2.5 WhatsNextCard (Sticky Progress Tracker)

```
┌────────────────────────────────────────────────────────────────┐
│ COMPANY FOUNDATION                              1/3 complete   │
│                                                                │
│ ━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░░  33%            │
│                                                                │
│ ✓ Core products  ○ Differentiators  ○ Strategic priorities    │
│                                                                │
│                                   [Continue to Question 2 →]   │ ← appears after submit
└────────────────────────────────────────────────────────────────┘
```

**When research area complete:**
```
┌────────────────────────────────────────────────────────────────┐
│ ✓ COMPANY FOUNDATION COMPLETE                   3/3 ✓         │
│                                                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  100%        │
│                                                                │
│ Great work! You've mapped your company foundation.             │
│                                                                │
│                        [Start Customer Research →]             │ ← Gold button
└────────────────────────────────────────────────────────────────┘
```

**Styling:**
- In progress: `border-amber-300 bg-amber-50`
- Complete: `border-emerald-300 bg-emerald-50`
- Position: Fixed above chat input, full width of chat panel
- Progress bar: `bg-amber-200` track, `bg-amber-500` fill (or emerald when complete)

### 2.6 ExplanationCard (Existing - Minor Updates)

Keep existing design, add research area context:
```
┌────────────────────────────────────────────────────────────────┐
│ ┌────┐                                                         │
│ │ 🏢 │  COMPANY FOUNDATION                                     │
│ └────┘  Research Area 1 of 3                                   │
│                                                                │
│ Understanding your company's core identity, strategic          │
│ priorities, and competitive advantages helps us build a        │
│ strong foundation for your product strategy.                   │
│                                                                │
│ You'll answer 3 questions. Take your time - the coach is       │
│ here to help if you get stuck.                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Architecture

### 3.1 New Card Marker Format

The AI coach will emit QuestionCards using markers:

```
[CARD:question]
{
  "territory": "company",
  "research_area": "company_foundation",
  "question_index": 0,
  "question": "What are your company's core products/services and what customer problems do they solve?",
  "total_questions": 3
}
[/CARD]
```

**Answered questions are NOT sent as cards** - they're saved to `territory_insights` and rendered from state.

### 3.2 Coach Context Access (Enhanced)

The Coach has access to ALL user/company data when providing suggestions, reviews, and coaching:

**Data Sources Available to Coach:**
| Source | Location | Usage |
|--------|----------|-------|
| Chat history | `conversation_messages` table | Understand discussion context, offer to update cards based on insights |
| Uploaded materials | `uploaded_materials` table | Reference company docs, strategy materials |
| Form inputs (cards) | `territory_insights` table | All answered questions across territories |
| Company context | `clients` table | Company name, industry, size, focus areas |
| Framework state | `conversations.framework_state` | Current phase, progress, completed areas |
| Debates/tensions | Future: `debates` table | Strategic tensions explored |

**Context Assembly for Coach API:**
```typescript
interface CoachContext {
  // Company info
  companyName: string;
  industry: string;
  strategicFocus: string[];

  // Conversation context
  recentMessages: Message[];  // Last 10-20 messages
  currentPhase: string;

  // Research context
  allTerritoryInsights: TerritoryInsight[];  // All answered questions
  currentQuestion: QuestionCardData;
  draftAnswer: string;

  // Materials
  uploadedMaterials: { filename: string; extractedContext: string }[];
}
```

### 3.3 Resource Linking System

Coach can provide relevant resources from multiple sources:

**1. Lenny's Podcast Archive**
- Pre-indexed transcripts stored in Supabase or vector DB
- Semantic search for relevant episodes/quotes
- Format: Episode title, guest, key insight, timestamp

**2. Frontera Master Product Leaders**
- Curated list of frameworks and thought leaders
- Books, articles, methodologies (April Dunford, Marty Cagan, etc.)
- Direct links to resources

**3. Anthropic API Web Search**
- Real-time search for current articles, blog posts
- Industry-specific publications
- Recent case studies and examples

**Resource Card Format:**
```typescript
interface ResourceLink {
  type: 'podcast' | 'book' | 'article' | 'framework';
  title: string;
  author?: string;
  source: string;
  url?: string;
  relevance: string;  // Why this is relevant to the question
}
```

### 3.4 Files to Create

```
src/components/product-strategy-agent-v2/CoachingPanel/cards/
├── QuestionCard.tsx          # NEW - Interactive form card with review button
├── AnsweredCard.tsx          # NEW - Collapsed submitted answer
├── CoachReviewPanel.tsx      # NEW - Critical assessment with resources
├── ResourceCard.tsx          # NEW - Display linked resource (podcast/article/book)
├── WhatsNextCard.tsx         # UPDATE - Progress tracker (sticky)
└── index.ts                  # UPDATE - Add exports

src/hooks/
├── useQuestionCardState.ts   # NEW - Manage active question, answers, saving
├── useResearchProgress.ts    # NEW - Track progress for WhatsNextCard
└── useCoachContext.ts        # NEW - Assemble full context for coach API

src/lib/
├── resources/
│   ├── lenny-archive.ts      # NEW - Search Lenny podcast transcripts
│   ├── product-leaders.ts    # NEW - Curated frameworks/leaders list
│   └── web-search.ts         # NEW - Anthropic API web search wrapper
```

### 3.5 Files to Modify

| File | Changes |
|------|---------|
| `CoachingPanel/CoachingPanel.tsx` | Add sticky WhatsNextCard, handle question submissions, pass coach context |
| `CoachingPanel/MessageStream.tsx` | Render QuestionCard/AnsweredCard, handle card updates from chat |
| `CoachingPanel/cards/CardRenderer.tsx` | Add `question` type handling |
| `lib/agents/strategy-coach-v2/system-prompt.ts` | Add QuestionCard + review instructions, resource linking |
| `lib/utils/card-parser.ts` | Ensure `question` type is parsed |
| `types/coaching-cards.ts` | Add QuestionCardData, AnsweredCardData, ResourceLink types |
| `api/product-strategy-agent-v2/coach-suggestion/route.ts` | Enhance with full context access |

### 3.6 New API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/product-strategy-agent-v2/coach-review` | Critical assessment of draft answer |
| `GET /api/product-strategy-agent-v2/resources` | Search relevant resources for a question |
| `POST /api/product-strategy-agent-v2/card-update` | Update card answer from chat suggestion |

### 3.7 Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  AI Coach       │────▶│  MessageStream   │────▶│  QuestionCard       │
│  emits [CARD]   │     │  parses markers  │     │  renders form       │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                                          │
                                                          ▼ user submits
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  territory_     │◀────│  POST /api/      │◀────│  handleSubmit()     │
│  insights       │     │  territories     │     │  in QuestionCard    │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                                          │
                                                          ▼ on success
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  AnsweredCard   │◀────│  MessageStream   │◀────│  state update       │
│  (collapsed)    │     │  re-renders      │     │  triggers refresh   │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                                                          │
                                                          ▼ coach continues
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Next question  │────▶│  WhatsNextCard   │◀────│  useResearchProgress│
│  or area intro  │     │  updates         │     │  recalculates       │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
```

---

## 4. Implementation Sequence

### Step 1: Types and Hook Foundation (Day 1)

**Create types:**
```typescript
// src/types/coaching-cards.ts - ADD these types
interface QuestionCardData {
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  question_index: number;
  question: string;
  total_questions: number;
}

interface AnsweredCardData {
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  question_index: number;
  question: string;
  answer: string;
  confidence: 'data' | 'experience' | 'guess' | null;
}
```

**Create hooks:**
```typescript
// src/hooks/useQuestionCardState.ts
// Manages: active question, answer drafts, saving state, edit mode

// src/hooks/useResearchProgress.ts
// Calculates: current area, questions answered, % complete
// Sources: territory_insights table + framework_state fallback
```

### Step 2: QuestionCard Component (Day 1-2)

**Create:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/QuestionCard.tsx`

**Features:**
- Question number badge with territory color
- Textarea with placeholder and auto-resize
- ConfidenceRating component (reuse from deep-dive)
- InlineCoachBar integration (reuse from deep-dive)
- **"Review My Draft Answer" button** (NEW)
- "Submit Answer" gold button
- Loading state during save
- Success animation on submit

**Props:**
```typescript
interface QuestionCardProps {
  data: QuestionCardData;
  conversationId: string;
  coachContext: CoachContext;  // Full context for coach API
  onSubmit: (answer: string, confidence: string | null) => Promise<void>;
  onReviewRequest: (draftAnswer: string) => Promise<CoachReview>;  // NEW
  existingAnswer?: string;  // For edit mode
  existingConfidence?: string;
}
```

### Step 2.5: CoachReviewPanel Component (Day 2)

**Create:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/CoachReviewPanel.tsx`

**Features:**
- Display coach's critical assessment
- Challenges section (questions to consider)
- Enhancement ideas section
- Resource links (ResourceCard components)
- "Apply Suggestions" and "Continue Without Changes" buttons

**Create:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/ResourceCard.tsx`

**Features:**
- Icon based on type (podcast, book, article, framework)
- Title and author
- Source and relevance description
- Click to open external link

### Step 3: AnsweredCard Component (Day 2)

**Create:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/AnsweredCard.tsx`

**Features:**
- Collapsed view with checkmark, question preview, answer preview
- "Edit Answer" button expands to QuestionCard
- Smooth expand/collapse animation
- Update mode shows "Update Answer" + "Cancel"

**Props:**
```typescript
interface AnsweredCardProps {
  data: AnsweredCardData;
  conversationId: string;
  onUpdate: (answer: string, confidence: string | null) => Promise<void>;
}
```

### Step 4: WhatsNextCard Updates (Day 2-3)

**Update:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/WhatsNextCard.tsx`

**New features:**
- Show current research area name
- Progress bar (questions completed / total)
- Question checklist with status icons
- "Continue to Question X" or "Start Next Area" CTA
- Sticky positioning above chat input

**Integration:**
- Add to CoachingPanel layout below MessageStream, above CoachingInput
- Wire to useResearchProgress hook

### Step 5: MessageStream Integration (Day 3)

**Modify:** `src/components/product-strategy-agent-v2/CoachingPanel/MessageStream.tsx`

**Changes:**
1. Import QuestionCard, AnsweredCard
2. Track answered questions in state (from territory_insights)
3. When rendering `[CARD:question]`:
   - If question already answered → render AnsweredCard
   - If question not answered → render QuestionCard
4. Pass onSubmit handler that:
   - POSTs to `/api/product-strategy-agent-v2/territories`
   - Updates local state
   - Triggers coach to send next question

### Step 5.5: Coach Context Hook (Day 3)

**Create:** `src/hooks/useCoachContext.ts`

**Features:**
- Assembles full context from all data sources
- Recent chat messages (last 10-20)
- All territory insights (answered questions)
- Uploaded materials summaries
- Company/client info
- Memoized to avoid unnecessary recalculation

### Step 5.6: Resource System (Day 3-4)

**Create resource utilities:**

1. `src/lib/resources/lenny-archive.ts`
   - Index of Lenny podcast transcripts
   - Semantic search function
   - Returns relevant episodes with quotes

2. `src/lib/resources/product-leaders.ts`
   - Curated list: April Dunford, Marty Cagan, Gibson Biddle, etc.
   - Frameworks: Jobs-to-be-Done, Positioning, etc.
   - Direct links to books/articles

3. `src/lib/resources/web-search.ts`
   - Wrapper around Anthropic's web search capability
   - Filters for relevant industry content
   - Returns formatted ResourceLink objects

### Step 6: System Prompt Updates (Day 4)

**Modify:** `src/lib/agents/strategy-coach-v2/system-prompt.ts`

**Add instructions:**
```
When the user is in the Research phase, ask questions one at a time using QuestionCards:

1. First, send an ExplanationCard introducing the research area
2. Then, send a QuestionCard for the first question
3. WAIT for the user to submit their answer
4. After they submit, acknowledge briefly and send the next QuestionCard
5. After all 3 questions are answered, summarize and introduce the next area

QuestionCard format:
[CARD:question]
{"territory": "company", "research_area": "company_foundation", "question_index": 0, "question": "...", "total_questions": 3}
[/CARD]

IMPORTANT: Only send ONE QuestionCard at a time. Wait for submission before sending the next.

## Draft Review Mode

When reviewing a user's draft answer, you have access to:
- Full chat history and conversation context
- All uploaded materials and extracted content
- All previously answered questions across territories
- Company profile and strategic focus areas

Provide:
1. CHALLENGES: 2-3 thought-provoking questions that test their thinking
2. ENHANCEMENT IDEAS: Specific suggestions to strengthen the answer
3. RELEVANT RESOURCES: Links to Lenny podcast episodes, product frameworks, or articles

Be constructively critical - push them to think deeper while being supportive.

## Chat-to-Card Updates

When users share valuable insights in chat that relate to answered questions:
- Offer to update the relevant card answer
- Ask: "I noticed your insight about [X] could strengthen your answer to [question]. Would you like me to incorporate it?"
- On acceptance, update the card answer via the card-update API
```

### Step 7: CardRenderer & Parser Updates (Day 4)

**Modify:** `src/components/product-strategy-agent-v2/CoachingPanel/cards/CardRenderer.tsx`

**Add case:**
```typescript
case 'question':
  return <QuestionCard data={card.data as QuestionCardData} {...handlers} />;
```

**Modify:** `src/lib/utils/card-parser.ts`

**Ensure `question` type is recognized in CARD_TYPE_REGEX**

### Step 8: Polish & Testing (Day 4-5)

- Add `animate-entrance` to QuestionCard and AnsweredCard
- Test mobile responsiveness (cards should stack nicely)
- Accessibility: ARIA labels on form elements, keyboard navigation
- Test edit flow: expand → edit → update → collapse
- Test coach flow: question → answer → next question → area complete

---

## 5. Key Design Decisions

### Color Scheme

| Element | Colors |
|---------|--------|
| QuestionCard (active) | `border-cyan-200 bg-white` |
| AnsweredCard (collapsed) | `border-emerald-200 bg-emerald-50/50` |
| Question badge (company) | `bg-indigo-50 text-indigo-600` |
| Question badge (customer) | `bg-amber-50 text-amber-700` |
| Question badge (competitor) | `bg-cyan-50 text-cyan-600` |
| Submit button | `bg-[#fbbf24] text-slate-900` (gold) |
| WhatsNext (in progress) | `border-amber-300 bg-amber-50` |
| WhatsNext (complete) | `border-emerald-300 bg-emerald-50` |

### Animation

- QuestionCard entrance: `animate-entrance` (fade up)
- AnsweredCard expand/collapse: `transition-all duration-300`
- Submit success: Brief checkmark flash + collapse
- WhatsNext progress bar: `transition-[width] duration-500`

### Reusable Components (from deep-dive)

These components already exist and should be reused:
- `ConfidenceRating.tsx` - Data/Experience/Guess selector
- `InlineCoachBar.tsx` - AI suggestion button and panel
- `SuggestionPanel.tsx` - Displays AI suggestion with apply button

---

## 6. Success Criteria

### Core Card System
1. ✓ QuestionCards render in chat when coach sends `[CARD:question]`
2. ✓ User can type answer, set confidence, get AI suggestions
3. ✓ Submit saves to `territory_insights` and collapses to AnsweredCard
4. ✓ AnsweredCard can be expanded and edited
5. ✓ WhatsNextCard shows accurate progress above chat input
6. ✓ Coach sends one question at a time, waits for submission

### Draft Review Feature (NEW)
7. ✓ "Review My Draft Answer" button triggers CoachReviewPanel
8. ✓ Coach provides challenges, enhancement ideas, and resource links
9. ✓ User can apply suggestions or continue without changes
10. ✓ Resources link to Lenny podcasts, product frameworks, articles

### Context-Aware Coaching (NEW)
11. ✓ Coach has access to full context (chat, uploads, all answers)
12. ✓ Coach offers to update cards based on chat insights
13. ✓ User can accept/decline card updates from chat

### Design & Accessibility
14. ✓ All styles match Frontera design system
15. ✓ Mobile responsive (cards adapt to narrow screens)
16. ✓ Keyboard accessible (Tab through form, Enter to submit)

---

## 7. Critical Files Summary

### Files to Create
| File | Purpose |
|------|---------|
| `cards/QuestionCard.tsx` | Interactive form card with review button |
| `cards/AnsweredCard.tsx` | Collapsed submitted answer |
| `cards/CoachReviewPanel.tsx` | Critical assessment display |
| `cards/ResourceCard.tsx` | Resource link display |
| `hooks/useQuestionCardState.ts` | Form state management |
| `hooks/useResearchProgress.ts` | Progress calculation |
| `hooks/useCoachContext.ts` | Assemble full coach context |
| `lib/resources/lenny-archive.ts` | Lenny podcast search |
| `lib/resources/product-leaders.ts` | Curated frameworks list |
| `lib/resources/web-search.ts` | Web search wrapper |
| `api/.../coach-review/route.ts` | Review draft answer endpoint |
| `api/.../resources/route.ts` | Resource search endpoint |
| `api/.../card-update/route.ts` | Update card from chat |

### Files to Modify
| File | Changes |
|------|---------|
| `CoachingPanel.tsx` | Add sticky WhatsNextCard, pass context |
| `MessageStream.tsx` | Render QuestionCard/AnsweredCard, card updates |
| `cards/CardRenderer.tsx` | Add `question` case |
| `cards/WhatsNextCard.tsx` | Update for research progress |
| `types/coaching-cards.ts` | Add new card types, ResourceLink |
| `lib/utils/card-parser.ts` | Ensure `question` type parsed |
| `system-prompt.ts` | Add review + resource + context instructions |
| `coach-suggestion/route.ts` | Enhance with full context |

### Existing Components to Reuse
| Component | Location |
|-----------|----------|
| `ConfidenceRating` | `CanvasPanel/ConfidenceRating.tsx` |
| `InlineCoachBar` | `CanvasPanel/InlineCoachBar.tsx` |
| `SuggestionPanel` | `CanvasPanel/SuggestionPanel.tsx` |

---

## 8. Out of Scope (Future Enhancements)

- Achievement/gamification system (defer to post-MVP)
- Section summary in CanvasPanel (defer)
- DebateCard interactive debates (defer)
- Multi-question batch submission (user chose 1-at-a-time)
- Vector DB for Lenny transcripts (start with simple keyword search)
- Real-time collaborative editing

---

## Ready for Implementation

This redesign transforms MVP2 from chat-only research to a **guided, context-aware coaching experience**:

### Core Features
1. **QuestionCards** - Interactive forms within chat for structured answer capture
2. **AnsweredCards** - Editable collapsed answers for review and revision
3. **Sticky WhatsNextCard** - Always-visible progress tracker above input
4. **One-at-a-time flow** - Focused, guided experience through research

### Enhanced Coaching (Your Additions)
5. **Draft Review** - Coach critically assesses answers with challenges and enhancement ideas
6. **Resource Linking** - Links to Lenny podcasts, product frameworks, and relevant articles
7. **Full Context Access** - Coach has access to all chat, uploads, and previous answers
8. **Chat-to-Card Updates** - Coach can suggest updating cards based on chat insights

### Resource Sources
- Lenny's Podcast transcript archive
- Product leaders from Frontera Master overview (April Dunford, Marty Cagan, etc.)
- Anthropic API web search for current articles

All designs follow the Frontera design system and reuse existing deep-dive components.
