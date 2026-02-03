# PRD: Case Study Engine — Interactive Strategy Playbooks

**Version**: 1.0
**Date**: January 31, 2026
**Status**: Draft
**Author**: Frontera Product Team
**Feature Flag**: `case_study_engine`

---

## 1. Overview & Problem Statement

### Problem
Strategy frameworks are abstract. Users struggle to translate methodology-driven coaching into concrete action because they lack reference points — real examples of how similar companies navigated similar decisions. The coach gives advice but can't point to "here's what someone in your position actually did."

### Solution
**Case Study Engine** extracts ~40 structured case studies from 301 Lenny's Podcast transcripts. Each follows a consistent structure: **Context → Decision Point → What They Did → Outcome → Lessons**. Cases are tagged and filterable. The coach proactively suggests relevant cases during sessions, and a browsable "Case Library" in the Canvas lets users explore independently.

### Value Proposition
Bridges abstract strategy frameworks and real-world execution stories. With 400-600 case studies extracted from 301 podcast episodes, users learn from practitioners who faced similar decisions at companies like Airbnb, Shopify, Figma, Notion, TikTok, Stripe, Canva, Linear, Superhuman, Spotify, and hundreds more.

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-3.1 | As a product leader, I want the coach to suggest relevant case studies when I face a strategic decision, so I can learn from similar situations. | P0 |
| US-3.2 | As a user, I want to browse a Case Library filtered by industry, company stage, and challenge type, so I can find relevant examples. | P0 |
| US-3.3 | As a user, I want to read structured case studies with clear context, decision, action, outcome, and lessons sections. | P0 |
| US-3.4 | As a strategist, I want case studies cited in my Synthesis evidence trails, so my strategy references real-world precedent. | P1 |
| US-3.5 | As a user, I want to see which cases are most relevant to my current coaching phase, so I can focus my reading. | P1 |
| US-3.6 | As a user, I want to read the full transcript excerpt behind a case study for deeper context. | P1 |
| US-3.7 | As a user, I want to search cases by keyword, so I can find specific topics quickly. | P2 |
| US-3.8 | As an admin, I want to review and curate case studies before they're available to users. | P2 |

---

## 3. Functional Requirements

### 3.1 Case Study Extraction

| ID | Requirement |
|----|------------|
| FR-3.01 | System SHALL extract structured case studies from transcripts using Claude |
| FR-3.02 | Each case study SHALL have: context, decision_point, action_taken, outcome, lessons_learned |
| FR-3.03 | Each case study SHALL be tagged with: industry, company_stage, challenge_type, phase_relevance |
| FR-3.04 | Initial extraction SHALL produce 400-600 case studies from 301 transcripts (average 1-2 per transcript) |
| FR-3.05 | Each case study SHALL reference the source transcript and approximate location |

### 3.2 Case Library UI

| ID | Requirement |
|----|------------|
| FR-3.06 | A "Case Library" tab SHALL be available in the Canvas panel during all coaching phases |
| FR-3.07 | Cases SHALL be displayed as cards with: title, speaker, company, challenge type, and relevance score |
| FR-3.08 | Users SHALL filter cases by: industry, company stage, challenge type, speaker, phase relevance |
| FR-3.09 | Users SHALL search cases by keyword |
| FR-3.10 | Clicking a case card SHALL expand to show the full structured case study |
| FR-3.11 | Each expanded case SHALL have a "View Full Excerpt" link to the source transcript passage |
| FR-3.12 | Cases SHALL be sorted by relevance to the user's current context (industry, challenges, phase) |

### 3.3 Coach Integration

| ID | Requirement |
|----|------------|
| FR-3.13 | The coach SHALL proactively suggest relevant case studies when the user faces a strategic decision |
| FR-3.14 | Coach suggestions SHALL use the format: "Your situation mirrors [Case Title]. Want to explore how [Speaker] at [Company] handled this?" |
| FR-3.15 | The coach SHALL suggest cases a maximum of once per 5 messages to avoid being pushy |
| FR-3.16 | When a user requests to explore a case, the coach SHALL present the full case structure and facilitate discussion |

### 3.4 Evidence Linking

| ID | Requirement |
|----|------------|
| FR-3.17 | Case studies SHALL be citable in Synthesis evidence trails using format `[Case:Title — Speaker]` |
| FR-3.18 | Synthesis generation SHALL consider relevant cases when identifying opportunities |

---

## 4. Technical Requirements

### 4.1 Database Schema

**New table: `case_studies`**
```sql
CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_transcript TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  speaker_company TEXT NOT NULL,
  speaker_role TEXT,
  context TEXT NOT NULL,
  decision_point TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  outcome TEXT NOT NULL,
  lessons_learned TEXT NOT NULL,
  full_excerpt TEXT,
  topic_tags TEXT[] DEFAULT '{}',
  industry_tags TEXT[] DEFAULT '{}',
  company_stage_tags TEXT[] DEFAULT '{}',
  challenge_type_tags TEXT[] DEFAULT '{}',
  phase_relevance TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_studies_speaker ON case_studies(speaker_name);
CREATE INDEX idx_case_studies_industry ON case_studies USING GIN(industry_tags);
CREATE INDEX idx_case_studies_challenge ON case_studies USING GIN(challenge_type_tags);
CREATE INDEX idx_case_studies_phase ON case_studies USING GIN(phase_relevance);
```

### 4.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/product-strategy-agent/case-studies` | GET | List/filter case studies (supports query params: industry, stage, challenge, speaker, phase, search) |
| `/api/product-strategy-agent/case-studies/[id]` | GET | Get single case study with full excerpt |
| `/api/product-strategy-agent/case-studies/relevant` | GET | Get cases relevant to a conversation's context |

### 4.3 Key Files to Create

| File | Purpose |
|------|---------|
| `scripts/extract-case-studies.ts` | One-time Claude-powered extraction from transcripts |
| `src/app/api/product-strategy-agent/case-studies/route.ts` | Case study API |
| `src/components/product-strategy-agent/CanvasPanel/CaseLibrary.tsx` | Case Library UI component |
| `src/components/product-strategy-agent/CanvasPanel/CaseStudyCard.tsx` | Individual case card |
| `src/types/database.ts` | Add `CaseStudy` interface |

### 4.4 Key Files to Modify

| File | Change |
|------|--------|
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add case study retrieval and suggestion logic |
| `src/lib/agents/strategy-coach/client-context.ts` | Add `loadRelevantCases()` for system prompt context |
| `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx` | Case citations in evidence trails |

---

## 5. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-3.01 | 400-600 case studies extracted from 301 transcripts with complete structure |
| AC-3.02 | Case Library is browsable and filterable in the Canvas panel |
| AC-3.03 | Coach proactively suggests relevant cases during coaching sessions |
| AC-3.04 | Case suggestions are contextually relevant to the user's industry and challenge |
| AC-3.05 | Full case study view shows all 5 sections (context, decision, action, outcome, lessons) |
| AC-3.06 | Cases appear in Synthesis evidence trails with `[Case:Title — Speaker]` format |
| AC-3.07 | Filtering by industry, stage, and challenge type returns accurate results |
| AC-3.08 | Search by keyword returns relevant cases |
| AC-3.09 | Feature is gated behind `case_study_engine` feature flag |
| AC-3.10 | Coach case suggestions are limited to once per 5 messages maximum |

---

## 6. Dependencies & Assumptions

### Dependencies
- Anthropic API for case study extraction during ingestion
- UC1 (Expert Perspectives) transcript ingestion pipeline can be shared
- Existing evidence linking infrastructure

### Assumptions
- Claude can reliably extract structured case studies from conversational transcripts
- 1-2 case studies per transcript is a reasonable average yield (~400-600 total from 301 transcripts)
- Case studies are evergreen and don't require frequent updates
- Extraction can be batched (e.g., 20-30 transcripts per batch) to manage API costs

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Case study exploration rate | ≥ 40% of sessions browse at least 1 case | PostHog |
| Case relevance rating (user feedback) | ≥ 4.0 / 5.0 | In-app rating |
| Coach case suggestion acceptance rate | ≥ 25% of suggestions explored | PostHog |
| Cases cited in final strategy outputs | ≥ 1 case cited per synthesis | DB query |

---

## 8. Out of Scope

- User-submitted case studies
- Case study discussion forums
- Video/audio playback of source segments
- Case study comparison view (side-by-side)
- External case study sources beyond podcast transcripts

---

## Appendix: Sample Case Studies

### Case 1: Mixpanel's Portfolio Refocus
- **Speaker**: Vijay Iyengar, Head of Product, Mixpanel
- **Context**: Mixpanel had expanded into multiple product lines while their core analytics product was losing market share to competitors.
- **Decision Point**: Continue diversifying or refocus on the core product?
- **Action**: Killed adjacent product initiatives, redirected entire engineering team to core analytics, invested in design-driven rebuild.
- **Outcome**: Core product quality improved significantly, churn decreased, competitive position stabilized.
- **Lessons**: Expansion without core strength is a trap. When your core is suffering, adding products amplifies the problem rather than solving it.

### Case 2: Notion's 3-Year Pivot
- **Speaker**: Ivan Zhao, CEO, Notion
- **Context**: Notion spent 3-4 years without clear product-market fit, rebuilding the product multiple times while running out of money.
- **Decision Point**: Shut down or keep iterating on the vision of augmenting human intellect?
- **Action**: Persisted with the horizontal tool-for-thought vision, moved the team to Japan to reduce costs, rebuilt the product from scratch with a focus on flexibility.
- **Outcome**: Eventually found PMF, grew to millions of users and billions in valuation.
- **Lessons**: Long-term vision requires financial discipline. Sometimes the market needs to catch up to the product. Conviction must be balanced with adaptability.

### Case 3: Gamma's Profitable AI Growth
- **Speaker**: Grant Lee, CEO, Gamma
- **Context**: Gamma launched as an AI-powered presentation tool in a market dominated by established players, with limited funding.
- **Decision Point**: Pursue VC-funded growth or build profitably from day one?
- **Action**: Focused on onboarding magic (immediate value in first session), used micro-influencer distribution instead of paid acquisition, maintained profitability.
- **Outcome**: Grew rapidly with sustainable unit economics, avoided the "AI wrapper" stigma.
- **Lessons**: Profitability is a strategic advantage, not a constraint. Onboarding experience is the highest-leverage investment for PLG companies.
