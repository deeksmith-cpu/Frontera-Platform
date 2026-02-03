# PRD: Leadership Playbook Generator — Personal Development from Expert Patterns

**Version**: 1.0
**Date**: January 31, 2026
**Status**: Draft
**Author**: Frontera Product Team
**Feature Flag**: `leadership_playbook`

---

## 1. Overview & Problem Statement

### Problem
Product strategy fails at the point of execution, and execution depends on leadership capability. Frontera excels at strategic analysis but doesn't address the leadership development needed to implement strategy — team alignment, feedback culture, organizational scaling, and career navigation. Users complete their strategy work and still struggle with the human side of execution.

### Solution
**Leadership Playbook Generator** creates personalized leadership development recommendations after the Research phase. It analyzes the user's strategic challenges, coaching history, and organizational context, then maps them to leadership themes from 301 podcast transcripts. The output is a structured, exportable document with expert wisdom, actionable practices, and recommended listening.

### Value Proposition
Extends Frontera from a strategy tool into a leadership development platform. Users discover that their strategic bottleneck is often a leadership capability gap, and get a concrete plan to close it — grounded in advice from 280+ leaders at Meta, Canva, Ancestry, GitHub, Airbnb, Stripe, Shopify, Figma, Spotify, Superhuman, and hundreds more.

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-5.1 | As a product leader, I want a personalized leadership playbook based on my strategic challenges, so I can develop the skills needed to execute my strategy. | P0 |
| US-5.2 | As a user, I want my playbook to include actionable weekly practices, so I can start improving immediately. | P0 |
| US-5.3 | As a user, I want to see expert quotes and context for each leadership theme, so the advice feels grounded and credible. | P0 |
| US-5.4 | As a user, I want to export my playbook as a PDF to share with my team or manager. | P1 |
| US-5.5 | As a user, I want to regenerate my playbook as my strategy evolves, so it stays relevant. | P1 |
| US-5.6 | As a user, I want to see recommended podcast episodes for deeper learning on each theme. | P1 |
| US-5.7 | As a user, I want to understand why the playbook chose specific themes for me, so I trust the personalization. | P2 |
| US-5.8 | As a team lead, I want to share individual playbook sections with team members for their development. | P2 |

---

## 3. Functional Requirements

### 3.1 Playbook Generation

| ID | Requirement |
|----|------------|
| FR-5.01 | System SHALL generate a personalized leadership playbook after the user completes the Research phase |
| FR-5.02 | Playbook generation SHALL analyze: strategic challenges (from onboarding), territory insights, coaching conversation themes, and pain points |
| FR-5.03 | Each playbook SHALL contain 3-5 leadership themes mapped to the user's specific context |
| FR-5.04 | Each theme SHALL include: theme title, why it matters for this user, 2-3 expert quotes with context, 2-3 actionable practices, recommended listening |
| FR-5.05 | Playbook SHALL use Claude to match user context to leadership content from transcripts |
| FR-5.06 | Generation SHALL complete within 30 seconds |

### 3.2 Theme Matching

| ID | Requirement |
|----|------------|
| FR-5.07 | System SHALL maintain a leadership theme library derived from podcast transcripts |
| FR-5.08 | Theme library SHALL cover at least 12 themes: Team Alignment, Feedback Culture, Scaling Organizations, Career Navigation, Product Culture, Decision-Making, Growth Mindset, Founder Leadership, Organizational Design, Executive Presence, Resilience & Failure, Customer Obsession |
| FR-5.09 | Each theme SHALL map to 2-4 relevant podcast speakers with extracted quotes and practices |
| FR-5.10 | Theme matching SHALL prioritize themes most relevant to the user's strategic challenges |

**Theme-to-Expert Mapping (examples):**

| Theme | Primary Experts | Key Content |
|-------|----------------|-------------|
| Team Alignment | Kim Scott, Ami Vora, Claire Hughes Johnson, Carole Robin | Radical Candor, metaphor-based alignment, Stripe operating principles, interpersonal dynamics |
| Scaling Organizations | Boz (Meta), Cameron Adams (Canva), Molly Graham, Tobi Lutke (Shopify), Brian Chesky (Airbnb) | Hypergrowth survival, homegrown leadership, giving away your Legos, founder mode at scale |
| Career Navigation | Deb Liu, Wes Kao, Nikhyl Singhal, Ethan Evans, Julie Zhuo | Building across companies, managing up, career laddering at Big Tech, VP-level leadership |
| Product Culture | Ivan Zhao (Notion), Ray Cao (TikTok), Jason Fried (Basecamp), Marty Cagan, Dylan Field (Figma) | Augmenting intellect, context not control, calm company, empowered teams, design-led culture |
| Feedback & Communication | Kim Scott, Wes Kao, Matt Abrahams, Nancy Duarte, Matthew Dicks | Direct feedback, influence without authority, presentation skills, strategic narrative, storytelling |
| Decision-Making | Ami Vora (Faire), Annie Duke, Richard Rumelt, Roger Martin, Shreyas Doshi | Strategic thinking, probabilistic decisions, good strategy/bad strategy, Playing to Win, LNO framework |
| Growth Mindset | Nan Yu (Linear), Grant Lee (Gamma), Brian Balfour (Reforge), Elena Verna | Speed as competence, profitable scaling, growth loops, PLG mindset |
| Founder Leadership | Jen Abel, Brian Chesky, Jessica Livingston, Alisa Cohn, Jerry Colonna | Founder-led sales, founder mode, early-stage leadership, executive coaching, inner voice |
| Organizational Design | Camille Fournier, Will Larson, Nicole Forsgren, Gergely Orosz | Manager's Path, staff engineering, DORA metrics, engineering org structure |
| Executive Presence | Jeffrey Pfeffer, Graham Weaver, Chip Conley, Matt Mochary | Power dynamics, CEO coaching, modern eldership, high-output management |
| Resilience & Failure | Katie Dill, Paul Adams, Joe Hudson, Jonny Miller | Learning from failure, emotional intelligence, nervous system regulation |
| Customer Obsession | Bob Moesta, Teresa Torres, April Dunford, Phyl Terry | Jobs-to-be-Done, continuous discovery, positioning, customer advisory boards |

### 3.3 Playbook UI

| ID | Requirement |
|----|------------|
| FR-5.11 | Leadership Playbook SHALL be accessible from a new Dashboard page at `/dashboard/leadership-playbook` |
| FR-5.12 | Playbook page SHALL show a locked state before Research phase completion |
| FR-5.13 | Each theme SHALL be displayed as an expandable card with sections for quotes, practices, and listening |
| FR-5.14 | Users SHALL be able to regenerate the playbook with updated context |
| FR-5.15 | Page SHALL include a "Why These Themes?" explanation section showing the mapping logic |

### 3.4 PDF Export

| ID | Requirement |
|----|------------|
| FR-5.16 | Users SHALL export the playbook as a branded PDF |
| FR-5.17 | PDF SHALL use Frontera brand design (navy, gold, cyan palette) |
| FR-5.18 | PDF SHALL include: cover page, table of contents, all themes with quotes and practices |
| FR-5.19 | PDF generation SHALL use the existing subprocess isolation pattern |

---

## 4. Technical Requirements

### 4.1 Database Schema

**New table: `leadership_playbooks`**
```sql
CREATE TABLE leadership_playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  clerk_org_id TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  themes JSONB NOT NULL DEFAULT '[]',
  generation_context JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- themes structure:
-- [{
--   title: string,
--   relevance_explanation: string,
--   expert_quotes: [{ speaker, company, quote, context }],
--   actionable_practices: [{ title, description, frequency }],
--   recommended_listening: [{ episode_title, speaker, topic }]
-- }]
```

### 4.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/product-strategy-agent/leadership-playbook` | GET | Get existing playbook for conversation |
| `/api/product-strategy-agent/leadership-playbook` | POST | Generate new playbook |
| `/api/product-strategy-agent/leadership-playbook/export` | POST | Generate PDF export |

### 4.3 New Files

| File | Purpose |
|------|---------|
| `src/app/dashboard/leadership-playbook/page.tsx` | Dashboard page |
| `src/app/api/product-strategy-agent/leadership-playbook/route.ts` | API endpoint |
| `src/components/product-strategy-agent/LeadershipPlaybook/PlaybookView.tsx` | Main playbook display |
| `src/components/product-strategy-agent/LeadershipPlaybook/ThemeCard.tsx` | Individual theme card |
| `src/components/product-strategy-agent/LeadershipPlaybook/LockedState.tsx` | Pre-Research locked state |
| `src/lib/pdf/leadership-playbook/document.tsx` | PDF layout components |
| `src/lib/pdf/leadership-playbook/styles.ts` | PDF brand styles |
| `src/lib/knowledge/leadership-themes.ts` | Theme library with expert mappings |

### 4.4 Key Files to Modify

| File | Change |
|------|--------|
| `src/app/dashboard/page.tsx` | Add Leadership Playbook card/link |
| `src/lib/agents/strategy-coach/client-context.ts` | Add `loadPlaybookContext()` for generation input |
| `src/types/database.ts` | Add `LeadershipPlaybook` and `LeadershipTheme` interfaces |
| `scripts/generate-pdf.mjs` | Add leadership playbook PDF generation handler |

---

## 5. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-5.01 | Playbook page shows locked state before Research phase is complete |
| AC-5.02 | Playbook generates within 30 seconds after user triggers generation |
| AC-5.03 | Playbook contains 3-5 leadership themes personalized to user's context |
| AC-5.04 | Each theme includes expert quotes with speaker attribution |
| AC-5.05 | Each theme includes 2-3 actionable practices with clear frequency |
| AC-5.06 | Each theme includes recommended listening references |
| AC-5.07 | "Why These Themes?" section explains the personalization logic |
| AC-5.08 | PDF export generates branded document with all playbook content |
| AC-5.09 | User can regenerate playbook and see updated themes |
| AC-5.10 | Feature is gated behind `leadership_playbook` feature flag |
| AC-5.11 | Playbook is accessible from the Dashboard navigation |

---

## 6. Dependencies & Assumptions

### Dependencies
- Research phase completion (territory insights must exist)
- Anthropic API for playbook generation
- Existing PDF subprocess infrastructure (`scripts/generate-pdf.mjs`)
- `@react-pdf/renderer` for PDF components

### Assumptions
- 301 transcripts provide extensive leadership content for 12+ themes
- Users value leadership development as part of strategic coaching
- 3-5 themes is the right scope — enough to be useful, not overwhelming
- Weekly practices are achievable for busy product leaders

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Playbook generation rate | ≥ 50% of users who complete Research generate a playbook | PostHog |
| PDF export rate | ≥ 30% of generated playbooks are exported | PostHog |
| Playbook regeneration rate | ≥ 15% regenerate at least once (indicates ongoing engagement) | PostHog |
| Practice adoption (self-reported) | ≥ 40% report trying at least 1 practice | Follow-up survey |
| Feature contribution to retention | ≥ 10% lift in 30-day retention for playbook users | PostHog cohort |

---

## 8. Out of Scope

- Team-wide playbook generation (1 playbook per user per conversation)
- Integration with external learning management systems (LMS)
- Progress tracking on individual practices
- Peer feedback on leadership development
- Custom theme creation by users
- Real-time coaching on leadership themes (separate from strategy coaching)
- Playbook sharing between organizations
