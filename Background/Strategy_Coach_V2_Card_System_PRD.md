# Product Requirements Document: Strategy Coach V2 Rich Card System

**Document Version:** 1.0
**Date:** February 23, 2026
**Author:** Claude Code
**Status:** Draft - Pending Review

---

## 1. Executive Summary

### 1.1 Problem Statement

The Strategy Coach V2 currently displays a basic welcome card (`SessionWelcome`) when new users enter the Discovery phase. While functional, this experience lacks the rich, interactive multimedia cards needed to:
- Guide users through phase transitions with visual clarity
- Prompt specific actions (document uploads, territory mapping)
- Facilitate strategic debates and exploration
- Provide persistent progress visibility

### 1.2 Proposed Solution

Implement a comprehensive **Rich Card System** that enables the AI coach to render structured, interactive cards within the chat conversation. This includes:
- **4 Card Types**: Explanation, Request, Debate, What's Next
- **AI-Generated Cards**: Claude emits card markers that are parsed and rendered
- **Sticky Progress Tracker**: Persistent "What's Next" card showing phase readiness

### 1.3 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Card render reliability | 100% | No parsing errors in production |
| User engagement with cards | >60% click-through | PostHog tracking |
| Phase completion rate | +15% | Pre/post comparison |
| Time to first document upload | -20% | Funnel analysis |

---

## 2. Current State Analysis

### 2.1 What Currently Works

The V2 chat has a welcome experience via `SessionWelcome` component:

**Location:** `src/components/product-strategy-agent-v2/CoachingPanel/SessionWelcome.tsx`

**Current Features:**
- Welcome card with cyan border
- Coach avatar (relevant coach to that user e.g. Marcus)
- Welcome greeting and phase-appropriate subtitle
- Quick Start Checklist (company context, materials status)
- Prompt pills for quick actions
- Mini phase timeline (Discovery → Landscape → Synthesis → Bets)

**Flow:**
1. `CoachingPanel.tsx` passes `welcomeProps` to `MessageStream`
2. `MessageStream.tsx` renders `SessionWelcome` at the top
3. Shows full card when `hasUserEngaged=false`, compact header after first message

### 2.2 Current Gaps

| Gap | Impact | Priority |
|-----|--------|----------|
| No dynamic card generation | AI cannot visually highlight important moments | High |
| No action-oriented cards | Users miss required actions (document upload) | High |
| No debate/exploration UI | Strategic tensions presented as plain text | Medium |
| No persistent progress tracker | Users lose orientation across sessions | High |
| Card components exist in V1 but not integrated | Technical debt, inconsistent UX | Medium |
| No clear direction on next steps for the user | user feels stuck in the chat loop | High |

---

## 3. Requirements

### 3.1 Functional Requirements

#### FR1: Explanation Card
**Purpose:** Guide users through section/phase transitions

| Field | Description | Required |
|-------|-------------|----------|
| `title` | Phase or section name | Yes |
| `body` | Explanatory text (2-3 sentences) | Yes |
| `icon` | Phase-specific icon identifier | No |
| `showPhases` | Display mini phase diagram | No |
| `ctaLabel` | Call-to-action button text | No |

**Trigger Events:**
- Phase transitions (discovery → research → synthesis → bets)
- First message in a new session
- AI-initiated explanations

**Visual Spec:**
```
+----------------------------------------+
| [Icon]  PHASE TITLE                    |
|         Explanatory body text...       |
|                                        |
| [P1] → [P2] → [P3] → [P4]             | (optional)
|                                        |
|                    [CTA Label →]       |
+----------------------------------------+
```
- Border: `border-cyan-200`
- Background: `bg-cyan-50`

---

#### FR2: Request Card
**Purpose:** Prompt specific user actions

| Field | Description | Required |
|-------|-------------|----------|
| `title` | Action name | Yes |
| `body` | Why this action matters | Yes |
| `urgency` | `required` or `optional` | Yes |
| `actionType` | Action identifier (e.g., `upload_materials`) | Yes |
| `progress` | `{ current: number, total: number }` | No |

**Trigger Events:**
- Document upload needed
- Territory mapping required
- Synthesis prerequisites unmet

**Visual Spec:**
```
+----------------------------------------+
| [!] REQUIRED                           |
|     Upload Strategic Materials         |
|                                        |
|     You need at least 1 document...    |
|                                        |
|     [=========>          ] 1/3 docs    |
|                                        |
|     [Upload Materials]                 |
+----------------------------------------+
```
- Required: `border-amber-300 bg-amber-50`
- Optional: `border-cyan-300 bg-cyan-50`

---

#### FR3: Debate Card
**Purpose:** Explore strategic tensions with two perspectives

| Field | Description | Required |
|-------|-------------|----------|
| `title` | Tension/question being explored | Yes |
| `perspectiveA` | `{ label: string, summary: string }` | Yes |
| `perspectiveB` | `{ label: string, summary: string }` | Yes |

**Trigger Events:**
- Coach identifies a strategic tradeoff
- User asks "Should I focus on X or Y?"
- Synthesis phase tension exploration

**Visual Spec:**
```
+----------------------------------------+
| [Debate] Exploring: Growth vs Profit   |
|                                        |
| +----------------+ +----------------+  |
| | Perspective A  | | Perspective B  |  |
| | "Focus on..."  | | "Prioritize..." |  |
| +----------------+ +----------------+  |
|                                        |
| [Select A] [Select B] [Nuanced View]   |
+----------------------------------------+
```
- Border: `border-[#1a1f3a]/20`
- Background: `bg-slate-50`

---

#### FR4: What's Next Card (Sticky)
**Purpose:** Persistent progress tracker showing phase readiness

| Field | Description | Required |
|-------|-------------|----------|
| `milestone` | Next phase/milestone name | Yes |
| `checklist` | Array of `{ label, completed, required }` | Yes |
| `readyToAdvance` | Boolean - all required items complete | Yes |

**Behavior:**
- Fixed position below message scroll, above input
- Updates in real-time as user completes actions
- Color transitions: amber (not ready) → emerald (ready)

**Visual Spec:**
```
+----------------------------------------+
| WHAT'S NEXT: Map Your Terrain          |
|                                        |
| [✓] Company context provided           |
| [!] Upload 1+ documents (required)     |
| [ ] Coaching conversations (optional)  |
|                                        |
| [===========>         ] 45% ready      |
|                                        |
|          [Begin Terrain Mapping]       |
+----------------------------------------+
```
- Not ready: `border-amber-300 bg-amber-50`
- Ready: `border-emerald-300 bg-emerald-50`

---

### 3.2 Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **Performance** | Cards render within 50ms of message completion |
| **Accessibility** | WCAG AA compliant, keyboard navigable |
| **Mobile** | Cards stack vertically, CTAs remain tappable (min 44px) |
| **Animation** | `animate-entrance` on mount (300ms fade-up) |
| **Error Handling** | Malformed card markers render as plain text fallback |

---

## 4. Technical Design

### 4.1 Card Marker Format

The AI coach emits cards using inline markers that are parsed client-side:

```
[CARD:explanation]
{"title": "Welcome to Discovery", "body": "...", "icon": "compass"}
[/CARD]

[CARD:request]
{"title": "Upload Materials", "body": "...", "urgency": "required", "actionType": "upload_materials"}
[/CARD]

[CARD:debate]
{"title": "Growth vs Profitability", "perspectiveA": {...}, "perspectiveB": {...}}
[/CARD]
```

### 4.2 Architecture

#### New Files to Create

```
src/
├── types/
│   └── coaching-cards.ts           # TypeScript interfaces
├── lib/
│   └── utils/
│       └── card-parser.ts          # Parse [CARD:type]...[/CARD]
├── hooks/
│   └── useWhatsNextProgress.ts     # Calculate progress data
└── components/product-strategy-agent-v2/
    └── CoachingPanel/
        └── cards/
            ├── index.ts            # Exports
            ├── CardRenderer.tsx    # Type dispatcher
            ├── ExplanationCard.tsx
            ├── RequestCard.tsx
            ├── DebateCard.tsx
            └── WhatsNextCard.tsx
```

#### Files to Modify

| File | Changes |
|------|---------|
| `MessageStream.tsx` | Parse cards from messages, render CardRenderer |
| `Message.tsx` | Integrate card parsing into content rendering |
| `CoachingPanel.tsx` | Add sticky WhatsNextCard, handle card actions |
| `system-prompt.ts` | Add card generation instructions for AI |

### 4.3 Type Definitions

```typescript
// src/types/coaching-cards.ts

export type CardType = 'explanation' | 'request' | 'debate' | 'whats-next';

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
  progress?: {
    current: number;
    total: number;
  };
}

export interface DebateCardData {
  title: string;
  perspectiveA: {
    label: string;
    summary: string;
  };
  perspectiveB: {
    label: string;
    summary: string;
  };
}

export interface WhatsNextCardData {
  milestone: string;
  checklist: Array<{
    label: string;
    completed: boolean;
    required: boolean;
  }>;
  readyToAdvance: boolean;
}

export interface ParsedCard {
  type: CardType;
  data: ExplanationCardData | RequestCardData | DebateCardData | WhatsNextCardData;
}

export interface CardParseResult {
  cleanContent: string;  // Message content with card markers removed
  cards: ParsedCard[];   // Extracted cards
}
```

---

## 5. Implementation Plan

### Phase 1: Foundation
**Scope:** Types and parser infrastructure

| Task | File | Description |
|------|------|-------------|
| 1.1 | `src/types/coaching-cards.ts` | Create TypeScript interfaces |
| 1.2 | `src/lib/utils/card-parser.ts` | Implement `parseCards(content: string): CardParseResult` |
| 1.3 | Unit tests | Test parser with various card formats |

### Phase 2: Card Components
**Scope:** Visual card implementations

| Task | File | Description |
|------|------|-------------|
| 2.1 | `cards/ExplanationCard.tsx` | Cyan phase intro card |
| 2.2 | `cards/RequestCard.tsx` | Amber/cyan action card |
| 2.3 | `cards/DebateCard.tsx` | Two-column debate card |
| 2.4 | `cards/CardRenderer.tsx` | Type dispatcher component |
| 2.5 | `cards/index.ts` | Export barrel |

### Phase 3: Chat Integration
**Scope:** Connect cards to message stream

| Task | File | Description |
|------|------|-------------|
| 3.1 | `Message.tsx` | Parse content, render cards inline |
| 3.2 | `MessageStream.tsx` | Handle card action callbacks |
| 3.3 | Card action handlers | Implement `actionType` behaviors |

### Phase 4: Sticky WhatsNextCard
**Scope:** Persistent progress tracker

| Task | File | Description |
|------|------|-------------|
| 4.1 | `cards/WhatsNextCard.tsx` | Sticky progress card |
| 4.2 | `useWhatsNextProgress.ts` | Calculate checklist from context |
| 4.3 | `CoachingPanel.tsx` | Position sticky card in layout |

### Phase 5: AI Integration
**Scope:** Enable Claude to generate cards

| Task | File | Description |
|------|------|-------------|
| 5.1 | `system-prompt.ts` | Add card generation instructions |
| 5.2 | Card trigger definitions | Document when to emit each card type |
| 5.3 | Testing | Validate AI generates valid card markers |

### Phase 6: Polish
**Scope:** Animations, accessibility, mobile

| Task | Description |
|------|-------------|
| 6.1 | Add `animate-entrance` to all cards |
| 6.2 | Mobile responsive adjustments |
| 6.3 | ARIA labels, keyboard navigation |
| 6.4 | Error handling for malformed cards |

---

## 6. Design Specifications

### 6.1 Color Scheme

| Element | Background | Border |
|---------|------------|--------|
| Explanation Card | `bg-cyan-50` | `border-cyan-200` |
| Request (Required) | `bg-amber-50` | `border-amber-300` |
| Request (Optional) | `bg-cyan-50` | `border-cyan-300` |
| Debate Card | `bg-slate-50` | `border-[#1a1f3a]/20` |
| What's Next (Not Ready) | `bg-amber-50` | `border-amber-300` |
| What's Next (Ready) | `bg-emerald-50` | `border-emerald-300` |

### 6.2 Typography

- **Card Title:** `text-sm font-bold text-slate-900`
- **Card Body:** `text-sm text-slate-600 leading-relaxed`
- **Labels:** `text-xs font-semibold uppercase tracking-wider`
- **CTA Buttons:** `text-sm font-semibold`

### 6.3 Animation Classes

- Card entrance: `animate-entrance` (fade-up, 300ms)
- Progress bar: `transition-all duration-500`
- What's Next color transition: `transition-colors duration-300`

---

## 7. Dependencies

### 7.1 Existing Infrastructure

| Dependency | Location | Usage |
|------------|----------|-------|
| `MessageStream.tsx` | V2 CoachingPanel | Container for cards |
| `Message.tsx` | V2 CoachingPanel | Content parsing |
| `smartPromptsContext` | CoachingPanel state | Progress data source |
| `context-awareness` API | `/api/product-strategy-agent-v2/` | Territory/materials counts |

### 7.2 Design System

| Dependency | Location |
|------------|----------|
| Tailwind CSS v4 | Project-wide |
| Plus Jakarta Sans | Typography |
| Animation utilities | `globals.css` |

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI generates malformed card JSON | Cards fail to render | Fallback to plain text, error logging |
| Cards bloat chat UI | Visual clutter | Limit to 1 card per message, collapsible |
| What's Next constantly visible | Annoyance | Dismissible, remembers state |
| Mobile card overflow | Unreadable cards | Stack columns, reduce padding |
| Performance with many cards | Slow scrolling | Virtualize message list if >100 |

---

## 9. Open Questions

1. **Card persistence:** Should cards be re-rendered from AI response each time, or cached in message metadata?

2. **Action handlers:** Should card CTAs dispatch to existing handlers (e.g., open upload modal) or have dedicated routes?

3. **Debate card outcomes:** How do we track which perspective the user selected? Store in `framework_state`?

4. **What's Next visibility:** Always visible, or only in Discovery/Research phases?

---

## 10. Appendix

### A. SessionWelcome Integration

The existing `SessionWelcome` component should remain as a complement to the card system:
- Provides static welcome content when no AI message exists
- Cards enhance AI-generated messages with structured content

### B. V1 Card Components Reference

V1 has card components in `src/components/product-strategy-agent/CoachingPanel/cards/`:
- `ExplanationCard.tsx`
- `RequestCard.tsx`
- `DebateCard.tsx`
- `CardRenderer.tsx`
- `card-parser.ts`

These can serve as reference but should be reimplemented for V2 with updated design system.

---

**End of Document**
