# Frontera Coaching Interface Research: Best Practices & Frontier Design

## Executive Summary

This research explores how to evolve Frontera's coaching agents beyond pure text interfaces by blending conversational AI with visual artifacts, mini UIs, and interactive canvases. The key insight from current best practices is that **chat is receding as the primary AI paradigm**—successful products now use task-oriented UIs, visual canvases, and embedded AI that meets users where their work happens.

---

## Part 1: The Five UX Dimensions of AI Interfaces

Based on Vitaly Friedman's framework (Smashing Magazine), every AI experience should be designed across five key areas:

### 1. Input UX: Expressing Intent
**The Problem:** Conversational AI is painfully slow (30-60 seconds per input). Users struggle to articulate intent well.

**Best Practices for Frontera:**
- **Visual intent expression** (like Flora AI's node-based system)
- **Pre-built templates and presets** instead of blank prompts
- **Structured inputs** with forms, sliders, and selection cards
- **Voice input** as an alternative for executives on the go
- **AI-generated pre-prompts** that users can refine

**Frontera Application:**
Instead of asking "What's your competitive landscape?" in a chat, show:
- A visual competitor map where users drag/drop competitors
- Pre-filled industry templates (Financial Services, Insurance, Retail)
- Cards with common competitor types they can select

### 2. Output UX: Displaying Outcomes
**The Problem:** Walls of text overwhelm users. Plain bullets don't drive insights.

**Best Practices for Frontera:**
- **Forced ranking** to highlight top priorities
- **Visual lenses** (like Amelia Wattenberger's style lenses)
- **Data visualizations** contextual to the output type
- **Layered information** users can expand/collapse
- **Maps, matrices, and diagrams** instead of prose

**Frontera Application:**
- Strategic Opportunity Map renders as interactive 2x2 matrix
- North Star metrics displayed as a visual flywheel diagram
- Competitive insights shown on a landscape map
- Key findings with confidence scores and evidence links

### 3. Refinement UX: Tweaking Output
**The Problem:** Fine-tuning AI output requires painful re-prompting.

**Best Practices for Frontera:**
- **Knobs, sliders, and controls** (like Adobe Firefly)
- **Highlighted selection** for contextual edits
- **Bookmarking and presets** for recurring refinements
- **In-place editing** without full regeneration
- **Version history** to compare iterations

**Frontera Application:**
- Click any insight to refine just that section
- Sliders for "Strategic Depth" vs "Practical Focus"
- Toggle views: "Executive Summary" ↔ "Full Detail"
- Side-by-side comparison of strategy versions

### 4. AI Actions: Tasks to Complete
**The Problem:** AI should do work, not just generate text.

**Best Practices for Frontera:**
- **Transformations** between formats (deck → doc → canvas)
- **Integrations** that post to where work happens (Jira, Confluence, Slack)
- **Scheduled actions** for ongoing coaching
- **Export and share** in multiple formats

**Frontera Application:**
- "Generate OKRs from this strategy" button
- "Schedule weekly strategy pulse check" action
- "Export to Confluence" integration
- "Share with leadership team" with formatted deck

### 5. AI Integration: Where Work Happens
**The Problem:** AI locked in dedicated apps gets abandoned. Work happens elsewhere.

**Best Practices for Frontera:**
- **Embed coaching in existing tools** (Slack bot, Teams integration)
- **Browser extension** for contextual coaching
- **API for custom integrations** into client systems
- **Mobile-first** for executives on the go

**Frontera Application:**
- Slack integration: "@frontera What's our progress on North Star?"
- Weekly email digest with coaching nudges
- Embedded widgets for Jira/Linear showing team OKR alignment

---

## Part 2: Three Agentic UX Patterns (Sandhya Hegde Framework)

Modern AI products use three UX modes within a single product:

### 1. Collaborative Mode (Chat)
**When to use:** When users don't know exactly what they want
**Latency:** Must be low (ReACT/CodeACT patterns)
**Example:** Cursor's Chat/Cmd+K

**Frontera Application:**
- Initial strategy exploration conversations
- Q&A sessions during research phases
- Clarifying questions about framework concepts

### 2. Embedded Mode (Inline AI)
**When to use:** When AI augments existing workflows
**Latency:** Near-instant
**Example:** Cursor's Tab complete

**Frontera Application:**
- Auto-suggestions while filling strategic canvases
- Real-time validation of OKR quality
- Contextual tips appearing during framework completion

### 3. Asynchronous Mode (Background Agents)
**When to use:** Complex tasks that take time
**Latency:** Can be minutes to hours
**Example:** Cursor's Cmd+I (parallelized agents)

**Frontera Application:**
- Deep competitive research running in background
- Automated analysis of uploaded documents
- Weekly transformation health reports generated overnight

---

## Part 3: Canvas vs. Artifacts (Claude/ChatGPT Patterns)

### Claude Artifacts Strengths:
- **Live previews** of generated code/visualizations
- **Standalone objects** that can be shared independently
- **Interactive React components** rendered in-place
- **Focus on output** as reusable asset

### ChatGPT Canvas Strengths:
- **In-place editing** (user can directly modify output)
- **Real-time collaboration** between user and AI
- **Contextual suggestions** with inline comments
- **Version control** built in

### Frontera Design Implications:

**For the Strategy Agent:**
- Use **Canvas-style editing** for strategy documents (users need to refine)
- Use **Artifacts-style rendering** for visualizations (2x2 maps, flywheels)

**Hybrid Approach Recommended:**
```
┌─────────────────────────────────────────────────────────────┐
│  CHAT PANEL (30%)        │  ARTIFACT PANEL (70%)           │
│                          │                                  │
│  Conversational flow     │  Live Strategy Canvas            │
│  - Context questions     │  - Interactive diagrams          │
│  - Coaching prompts      │  - Editable frameworks           │
│  - Progress tracking     │  - Real-time previews            │
│                          │                                  │
│  "What market forces     │  ┌───────────────────────────┐  │
│   matter most?"          │  │   STRATEGIC OPP. MAP      │  │
│                          │  │   [Interactive 2x2]       │  │
│  > "Based on your        │  │   • Drag to reposition    │  │
│    financial services    │  │   • Click to expand       │  │
│    context..."           │  │   • Hover for evidence    │  │
│                          │  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 4: Infinite Canvas & Whiteboard Patterns

### Key Innovators:
- **tldraw:** React-based infinite canvas SDK with AI integration
- **Excalidraw:** Hand-drawn-style diagrams with AI generation
- **Miro:** Enterprise collaboration with AI clustering and summarization

### Excalidraw Computer (Frontier Innovation):
- Transforms whiteboard into **computational canvas**
- AI interprets visual diagrams and generates outputs
- Sketches become functional code/workflows
- **Multi-modal AI prototyping** (draw → code → preview)

### Frontera Canvas Opportunities:

**Strategic Flow Canvas (Visual):**
```
┌─────────────────────────────────────────────────────────┐
│                    STRATEGIC FLOW CANVAS                 │
│                                                          │
│    ┌─────────┐      ┌─────────┐      ┌─────────┐       │
│    │ MARKET  │──────▶│CUSTOMER │──────▶│  ORG    │       │
│    │ REALITY │      │INSIGHTS │      │CONTEXT  │       │
│    │  ●●○○   │      │  ●●●○   │      │  ●○○○   │       │
│    └────┬────┘      └────┬────┘      └────┬────┘       │
│         │                │                 │            │
│         └────────────────┼─────────────────┘            │
│                          ▼                              │
│                   ┌───────────┐                         │
│                   │ SYNTHESIS │                         │
│                   │   ●○○○    │                         │
│                   └─────┬─────┘                         │
│                         ▼                              │
│                   ┌───────────┐                         │
│                   │   TEAM    │                         │
│                   │  CONTEXT  │                         │
│                   │   ○○○○    │                         │
│                   └───────────┘                         │
│                                                          │
│  ● Completed  ○ Remaining   Click any node to expand   │
└─────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- Click nodes to expand into detailed view or start agent conversation
- Drag connections to show relationships
- Zoom in/out for executive vs. detailed views
- Real-time progress tracking with color coding
- AI-generated annotations and suggestions

---

## Part 5: Progressive Disclosure for Coaching Flows

### Pattern Types:

**1. Staged Disclosure (Wizard Pattern)**
- Guide users through linear sequence
- One question/task per screen
- Progress bar showing completion
- Good for: Initial onboarding, first-time framework completion

**2. Responsive Enabling**
- Options appear based on previous selections
- Unnecessary controls stay hidden
- Good for: Advanced customization, context-specific features

**3. Expandable Sections**
- Accordions, "read more" links
- Core info visible, details on demand
- Good for: Research outputs, detailed recommendations

### Frontera Application:

**First-Time User Journey:**
```
STAGE 1: Context Setup (5 min)
├── Company basics (name, industry, size)
├── Strategic focus selection (3 options with descriptions)
└── Transformation history (simple checkboxes)

STAGE 2: Quick Assessment (10 min)
├── 5 key questions about current state
├── Visual sliders for maturity assessment
└── Upload existing docs (optional)

STAGE 3: First Coaching Session (15 min)
├── Agent asks contextual follow-ups
├── Generates initial insights
└── Shows preview of full framework

STAGE 4: Deep Dive Available
├── Unlock detailed research pillars
├── Access advanced visualizations
└── Generate comprehensive outputs
```

**Returning User Experience:**
- Skip directly to where they left off
- Show "What's changed" summary
- Offer quick actions based on previous activity

---

## Part 6: Mobile/Tablet Considerations

### Responsive Design Patterns:

**Mobile (Phone):**
- Full-screen chat with collapsible artifact drawer
- Swipe gestures to switch between views
- Voice input as primary interaction mode
- Simplified visualizations (tap to expand)

**Tablet:**
- Side-by-side chat + artifact (50/50 or 30/70 split)
- Touch-friendly canvas interactions
- Stylus support for annotations
- Floating action buttons for common tasks

**Desktop:**
- Full multi-panel experience
- Keyboard shortcuts for power users
- Multiple artifacts open simultaneously
- Drag-and-drop between panels

### Layout Adaptation:
```
MOBILE (< 768px):
┌─────────────────┐
│    ARTIFACT     │  (Swipe to reveal chat)
│                 │
│   Full-screen   │
│   visualization │
│                 │
│   [💬 Chat]     │  (Floating button)
└─────────────────┘

TABLET (768-1024px):
┌─────────┬───────────────┐
│  CHAT   │   ARTIFACT    │
│  (30%)  │    (70%)      │
│         │               │
│ Collapse│  Interactive  │
│ enabled │    Canvas     │
└─────────┴───────────────┘

DESKTOP (> 1024px):
┌───────┬─────────────────┬───────────┐
│ NAV   │    ARTIFACT     │  DETAILS  │
│ (15%) │     (55%)       │   (30%)   │
│       │                 │           │
│ Quick │  Full Canvas    │ Properties│
│ Links │  Experience     │ & Actions │
└───────┴─────────────────┴───────────┘
```

---

## Part 7: Frontier Innovations to Watch

### 1. Multi-Modal AI (Voice + Visual + Text)
- Real-time conversational search (Google experiments)
- Voice commands that update visual canvas
- Draw a sketch → AI interprets → generates strategy

### 2. Computational Canvases
- tldraw Computer: Whiteboard as programming interface
- Excalidraw + AI: Diagrams become executable workflows
- **Frontera opportunity:** Strategy sketch → AI → executable OKRs

### 3. Zero-UI / Ambient AI
- AI that works in background without explicit prompts
- Contextual coaching nudges based on user behavior
- "Quiet AI" that enhances without interrupting

### 4. Semantic Spreadsheets
- AI-powered data grids (Elicit, AnswerGrid)
- Each cell can be an AI agent
- **Frontera opportunity:** Competency framework as semantic grid

### 5. Time-Aware UX
- Support for long-running AI tasks (hours/days)
- Progress visibility and checkpoints
- Interruptible workflows with graceful resume

---

## Part 8: Recommended Frontera Interface Evolution

### Phase 1: Enhanced Chat (Current → v1.5)
**Quick wins:**
- Add side panel for artifacts (Claude-style)
- Implement collapsible reasoning traces
- Show progress indicators during generation
- Add quick action buttons below responses

### Phase 2: Visual Canvases (v2.0)
**New capabilities:**
- Strategic Flow Canvas as interactive diagram
- 2x2 opportunity matrices with drag-drop
- North Star flywheel visualization
- Exportable visual artifacts

### Phase 3: Hybrid Mode (v2.5)
**Integration:**
- Chat + Canvas side-by-side
- Click artifact to refine via chat
- Canvas updates in real-time during conversation
- Mobile-responsive layouts

### Phase 4: Embedded Intelligence (v3.0)
**Beyond the platform:**
- Slack/Teams coaching bot
- Browser extension for in-context help
- Weekly email coaching digests
- API for client system integration

### Phase 5: Computational Canvas (v4.0)
**Frontier features:**
- Draw strategy diagrams → AI interprets
- Connect nodes to build workflows
- Multi-agent orchestration visible on canvas
- Real-time collaboration with team members

---

## Part 9: Key Design Principles Summary

1. **Task-oriented over chat-oriented:** Use UIs that match the task (forms, canvases, matrices) rather than defaulting to chat.

2. **Progressive disclosure:** Start simple, reveal complexity as users need it.

3. **Visual intent expression:** Let users show rather than tell when possible.

4. **Contextual refinement:** Allow editing specific parts without regenerating everything.

5. **Meet users where they work:** Integrate into existing tools, not just a standalone platform.

6. **Responsive to device:** Different layouts and interactions for mobile, tablet, desktop.

7. **Show the work:** Make AI reasoning visible but collapsible.

8. **Enable action:** Output should drive decisions and connect to execution tools.

---

## Part 10: Resources for Deep Dives

### Pattern Libraries:
- [Shape of AI](https://shapeof.ai/) - Emily Campbell's AI UX pattern library
- [AI Design Patterns](https://ai-design-patterns.com/) - Vitaly Friedman's video course
- [Google PAIR Guidebook](https://pair.withgoogle.com/guidebook/patterns)

### Key Articles:
- Luke Wroblewski's [Agent Management Interface Patterns](https://lukew.com/ff/entry.asp?2106)
- Amelia Wattenberger's [Beyond Chatbots](https://wattenberger.com/thoughts/boo-chatbots)
- Maggie Appleton's [LM Sketchbook](https://maggieappleton.com/lm-sketchbook/)

### Tools to Study:
- [Elicit](https://elicit.org) - AI research assistant with semantic tables
- [Flora AI](https://florafauna.ai) - Node-based AI workflows
- [Krea.ai](https://krea.ai) - Visual intent expression
- [tldraw](https://tldraw.com) - Infinite canvas SDK with AI
- [Cursor](https://cursor.sh) - Multi-mode AI coding

---

## Conclusion: Frontera's Differentiation Opportunity

The coaching platform market is still dominated by chat-first interfaces. Frontera has an opportunity to differentiate by:

1. **Being "AI-second"** - Focus on strategic frameworks first, enhance with AI
2. **Visual-first coaching** - Canvases, matrices, and diagrams as primary artifacts
3. **Progressive mastery** - Simple start, expert depth available
4. **Embedded coaching** - Reach executives where they already work
5. **Computational strategy** - Strategy diagrams that become executable plans

The frontier isn't better chat—it's AI that meets executives in their strategic thinking process and helps them visualize, refine, and act on insights through rich, interactive interfaces.
