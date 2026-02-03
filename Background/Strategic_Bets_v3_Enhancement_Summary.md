# Strategic Bets Implementation Plan v3 - Enhancement Summary

**Date**: February 3, 2026
**Updated File**: `Strategic_Bets_Implementation_Plan_v3_updated.docx`

---

## Executive Summary

Strategic Bets Implementation Plan v3 has been enhanced to be **build-ready** with complete specifications for all new features. The document now includes full details for:

1. **AI Coach Validation** (US-4) - Interactive coaching feedback during bet editing
2. **Product Strategy Document** (US-9) - Final deliverable generation from selected bets
3. **Complete 6-page strategy document structure**
4. **Additional API endpoints, components, and build stages**

**Status**: ✅ Ready for development planning and implementation

---

## Key Differences: v2 → v3

### Problem Statement Enhancement
v3 adds critical missing requirement:
> "There is no final call to action for the client. Once the client has reviewed, edited and/or added to the strategic bets the user should have a final summarized choice where they select at least 3 strategic bets to trigger the generation of the proposed strategy document."

**Impact**: Completes the end-to-end journey with a deliverable product strategy document.

---

### New User Stories

#### US-4: AI Coach Validation (NEW)
**Replaces** v2's "Evidence trails" user story (moved to US-5)

**Description**:
- Product Leaders receive AI coach validation when editing bets
- "Ask the Coach" button appears during editing
- Coach provides critical analysis using company context + Lenny research
- User can **Accept**, **Debate**, or **Reject** coach recommendations

**Implementation Requirements**:
- API: `POST /api/product-strategy-agent/bets/validate`
- Component: `CoachValidationPanel.tsx`
- UX: Three-way choice interaction with debate triggering coaching chat

#### US-9: Final Bet Selection & Strategy Document (NEW)
**Description**:
- Product Leaders select ≥3 bets to include in final Product Strategy Draft
- System generates formatted 6-page strategy document
- Document synthesizes entire coaching journey (discovery → research → synthesis → selected bets)
- Exported as professional PDF

**Implementation Requirements**:
- API: `POST /api/product-strategy-agent/bets/strategy-document/generate`
- API: `POST /api/product-strategy-agent/bets/strategy-document/export`
- Components: `BetSelectionPanel.tsx`, `StrategyDocumentPreview.tsx`
- Data Model: New `strategy_documents` table
- Quality Gate: Minimum 3 bets selected before "Create Strategy" enabled

---

## Section 7: Product Strategy Format (COMPLETE)

### Document Structure (6 Pages)

**Page 1: Executive Summary**
- Company overview (from client context)
- Strategic intent (from discovery baseline)
- Key findings from 3Cs research (from territory insights)
- Top 3 strategic opportunities (from synthesis)
- Recommended bets (selected by user)

**Page 2: Playing to Win Cascade**
- Winning aspiration
- Where to play (selected strategic theses)
- How to win (competitive advantages per thesis)
- Core capabilities needed (from synthesis DHM analysis)
- Management systems required

**Pages 3-4: Selected Strategic Bets (Detail)**
For each selected bet:
- Strategic thesis grouping
- 5-part hypothesis (Job → Belief → Bet → Success → Kill)
- 4-dimension scoring with justification
- Strategic risks (market, positioning, execution, economic)
- Evidence trail with territory-colored links
- Kill criteria and kill date

**Page 5: Portfolio View**
- Strategic coherence analysis
- Portfolio balance (offensive/defensive/capability)
- Sequencing and dependencies
- Resource allocation recommendations
- DHM coverage analysis

**Page 6: Next Steps & Governance**
- Recommended validation timeline
- Governance structure for bet reviews
- Success metric tracking plan
- Kill criteria review schedule
- Recommended next conversation topics

### Data Sources
- **Client context**: `clients` table (industry, size, strategic_focus, pain_points)
- **Discovery baseline**: `uploaded_materials.extracted_context`
- **Territory research**: `territory_insights.responses`
- **Synthesis**: `synthesis_outputs` (opportunities, insights, strategic_bets)
- **Selected bets**: `strategic_bets` where id IN selected_bet_ids
- **Coach interactions**: `conversation_messages` (full context)
- **Lenny research**: `uploaded_materials` where `generated_by = 'ai_research_assistant'`

### Generation Approach
- **API endpoint**: `POST /api/product-strategy-agent/bets/strategy-document/generate`
  - AI generates narrative sections (exec summary, coherence analysis, next steps)
  - Structured sections assembled from database (PTW cascade, bet details, portfolio view)
  - Full document stored in `strategy_documents` table as JSONB
- **Export endpoint**: `POST /api/product-strategy-agent/bets/strategy-document/export`
  - Uses **PDFKit pattern** from CLAUDE.md
  - Brand design: Navy headers, Gold accents, Cyan data cards
  - 6 pages A4, professional layout

---

## Updated API Endpoints

### New Endpoints (3 added)

**1. POST /api/product-strategy-agent/bets/validate**
- Coach validates and provides feedback on edited bet
- Request: `{ bet_id, updated_fields, conversation_id }`
- Response: `{ validation, suggested_edits, reasoning }`

**2. POST /api/product-strategy-agent/bets/strategy-document/generate**
- Generate Product Strategy Draft from selected bets
- Request: `{ conversation_id, selected_bet_ids[] }`
- Response: `{ document_id, document_content (JSONB) }`

**3. POST /api/product-strategy-agent/bets/strategy-document/export**
- Export Product Strategy Draft as 6-page PDF
- Request: `{ document_id or conversation_id }`
- Response: PDF buffer (`application/pdf`)

### Existing Endpoints (from v2)
- GET `/api/product-strategy-agent/bets` - Retrieve theses + bets
- POST `/api/product-strategy-agent/bets/theses` - Create thesis
- POST `/api/product-strategy-agent/bets` - Create bet
- PATCH `/api/product-strategy-agent/bets` - Update bet
- DELETE `/api/product-strategy-agent/bets` - Delete bet
- POST `/api/product-strategy-agent/bets/generate` - AI generates bets from synthesis

---

## Updated Component Architecture

### New Components (4 added)

**1. CoachValidationPanel.tsx**
- Interactive coach feedback during bet editing
- Shows coach reasoning and suggested edits
- Three-way choice: Accept | Debate | Reject
- Debate opens coaching chat with bet context

**2. BetSelectionControls (inline in BetCard)**
- Checkbox for selecting bets for strategy document
- Visual indication of selected state

**3. BetSelectionPanel (inline in BetsSection)**
- Summary of selected bets count
- Quality gate enforcement (≥3 bets required)
- "Create Product Strategy" CTA (enabled when gate passed)
- Shows selected bet titles

**4. StrategyDocumentPreview.tsx**
- Preview generated 6-page strategy document before export
- Scrollable multi-page view
- Edit/regenerate option
- Export to PDF button

### Existing Components (from v2)
- `BetsSection.tsx` - Main container
- `StrategyHierarchyBanner` - Perri hierarchy position
- `SynthesisRecap` - Top 3 opportunities
- `BetProposals` - Agent proposals
- `ThesisGroup.tsx` - Thesis container
- `BetCard.tsx` - Bet details card
- `CreateBetModal.tsx` - Bet creation/editing form
- `BetsExportPanel` - Export functionality

---

## Updated Staged Build & Test Plan

### New Stages (2 added)

**Stage 6: Coach Validation (US-4)**
- **Create**: `bets/validate/route.ts`, `CoachValidationPanel.tsx`
- **Modify**: `CreateBetModal.tsx`, `BetCard.tsx` — add "Ask the Coach" button on edit
- **Test**:
  - Component tests for validation panel
  - Integration test for validation API
- **Verify**:
  - Coach provides constructive feedback using company context + Lenny research
  - User can accept/reject/debate coach recommendations
  - Debate opens coaching chat with bet context

**Stage 7: Bet Selection + Strategy Document (US-9)**
- **Create**:
  - `BetSelectionControls` (inline)
  - `BetSelectionPanel.tsx`
  - `StrategyDocumentPreview.tsx`
  - `strategy-document/generate/route.ts`
  - `strategy-document/export/route.ts`
  - Migration for `strategy_documents` table
- **Modify**:
  - `BetCard.tsx` — add selection checkbox
  - `BetsSection.tsx` — add selection panel with quality gate
- **Test**:
  - Component tests for selection UI and preview
  - Integration tests for document generation and export
- **Verify**:
  - Selection flow requires ≥3 bets before "Create Strategy" enabled
  - Generated document includes all 6 pages with correct content
  - PDF export follows PDFKit pattern with Frontera branding
  - Document uses full context (client, discovery, territories, synthesis, selected bets, coach history)

### Existing Stages (from v2)
- Stage 1: Data Foundation
- Stage 2: AI Bet Generation
- Stage 3: BetsSection + ThesisGroup + BetCard UI
- Stage 4: CreateBetModal + Edit/Delete
- Stage 5: Coach Integration + Export

---

## Updated Files Summary

**New Files: 20** (was 12)
- +2 API routes (`bets/validate`, `strategy-document/generate`, `strategy-document/export` = 3 files)
- +3 components (`CoachValidationPanel`, `BetSelectionPanel`, `StrategyDocumentPreview`)
- +1 migration (`strategy_documents` table)

**Modified Files: 7** (was 4)
- +3 components (`CreateBetModal`, `BetCard`, `BetsSection` — for selection + validation)

---

## Updated Verification Section

### New Manual Tests (18 added)

**US-4: Coach Validation**
1. Edit bet → Ask the Coach → verify coach provides contextual feedback
2. Coach validation → Accept edit → verify bet updated with coach suggestions
3. Coach validation → Debate → verify coaching chat opens with bet context
4. Coach validation → Reject → verify original edits preserved

**US-9: Strategy Document**
5. Select <3 bets → verify "Create Strategy" disabled with quality gate message
6. Select ≥3 bets → verify "Create Strategy" enabled
7. Create Strategy → verify 6-page document generated with all sections
8. Page 1 → verify exec summary (company overview, 3Cs, top opportunities, selected bets)
9. Page 2 → verify PTW cascade (winning aspiration, WTP, HTW, capabilities)
10. Pages 3-4 → verify selected bet details (5-part hypothesis, scoring, risks, evidence)
11. Page 5 → verify portfolio view (coherence, balance, sequencing, DHM)
12. Page 6 → verify next steps (validation timeline, governance, tracking)
13. Export Strategy PDF → verify Frontera branding (navy, gold, cyan)
14. Export Strategy PDF → verify all context included (client, discovery, territories, synthesis, bets, coach)

---

## Data Model Additions

### New Table: `strategy_documents`

```sql
CREATE TABLE strategy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  selected_bet_ids uuid[] NOT NULL,
  document_content jsonb NOT NULL, -- Full 6-page structure
  generated_at timestamptz NOT NULL DEFAULT now(),
  exported_at timestamptz, -- NULL until PDF exported
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_strategy_documents_conversation ON strategy_documents(conversation_id);
```

**document_content JSONB structure:**
```json
{
  "executiveSummary": { "companyOverview": "...", "strategicIntent": "...", "keyFindings": [], "topOpportunities": [], "recommendedBets": [] },
  "ptwCascade": { "winningAspiration": "...", "whereToPlay": [], "howToWin": [], "capabilities": [], "managementSystems": [] },
  "selectedBets": [ /* bet detail objects */ ],
  "portfolioView": { "coherenceAnalysis": "...", "balance": {}, "sequencing": [], "resourceAllocation": [], "dhmCoverage": {} },
  "nextSteps": { "validationTimeline": "...", "governance": "...", "trackingPlan": "...", "killCriteriaReview": "...", "nextTopics": [] }
}
```

---

## Technology Stack Updates

**PDF Generation**: PDFKit (React 19 compatible)
- Pattern documented in [CLAUDE.md](../CLAUDE.md#L548-L660)
- Brand colors: Navy `#1a1f3a`, Gold `#fbbf24`, Cyan scale
- Card-based layouts with proper Y-coordinate tracking
- 6 pages A4, professional layout

---

## Implementation Readiness Checklist

### Specification Completeness
- [x] Problem statement clear
- [x] All user stories defined (US-1 through US-9)
- [x] Quality gates specified
- [x] Success metrics defined
- [x] Data model complete
- [x] API endpoints specified
- [x] Component architecture detailed
- [x] Coach behavior documented
- [x] **Product Strategy Format structure defined** ✨ NEW
- [x] Staged build plan complete (7 stages)
- [x] Verification steps comprehensive

### Technical Architecture
- [x] Database schema defined
- [x] API contracts specified
- [x] Component hierarchy clear
- [x] PDF generation approach documented (PDFKit)
- [x] Data sources identified
- [x] Quality gates enforced

### Development Guidance
- [x] Build stages sequenced logically
- [x] Test strategy per stage
- [x] Verification criteria clear
- [x] File manifest provided

---

## Next Steps

1. **Review Enhanced v3**
   - File: `Background/Strategic_Bets_Implementation_Plan_v3_updated.docx`
   - Close the original `Strategic_Bets_Implementation_Plan_v3.docx` in Word
   - Replace original with `_updated.docx` version

2. **Create Build Plan**
   - Use v3 as specification source
   - Plan implementation sprints (suggested: 7 stages = 7 sprints)
   - Prioritize stages based on dependencies

3. **Begin Development**
   - Start with Stage 1 (Data Foundation)
   - Test incrementally after each stage
   - Verify quality gates before proceeding

---

## Summary of Enhancements

| Enhancement | Impact | Complexity | Value |
|-------------|--------|------------|-------|
| Product Strategy Format (Section 7) | High - Completes deliverable | Medium | Critical |
| Coach Validation (US-4) | High - Interactive coaching | Medium | High |
| Strategy Document (US-9) | High - Final output | High | Critical |
| 3 New API Endpoints | Medium - Infrastructure | Medium | Enabler |
| 4 New Components | Medium - UI richness | Medium | Enabler |
| 2 New Build Stages | Low - Execution plan | Low | Planning |
| 18 New Verification Steps | Medium - Quality assurance | Low | Quality |

**Overall Impact**: v3 is now a **complete, build-ready specification** for the Strategic Bets phase with a clear end-to-end journey and final deliverable.

---

**Status**: ✅ Ready for Build Plan Creation and Implementation
