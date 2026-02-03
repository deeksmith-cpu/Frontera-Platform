# Strategic Bets Phase - Build Plan

**Created**: February 3, 2026
**Based On**: Strategic_Bets_Implementation_Plan_v3.docx
**Status**: Ready for Implementation

---

## Overview

This build plan implements the Strategic Bets phase (Phase 4) of the Product Strategy Agent, completing the end-to-end coaching journey: Discovery → Research → Synthesis → **Strategic Bets**.

**Key Features:**
1. Strategic Thesis grouping (coherent strategic choices)
2. 5-part hypothesis format (Job → Belief → Bet → Success → Kill)
3. 4-dimension scoring (Expected Impact, Certainty, Clarity, Uniqueness)
4. AI-generated bet proposals from synthesis
5. Interactive coach validation during editing (US-4)
6. Final bet selection and 6-page Product Strategy Document (US-9)

---

## Build Stages

### Stage 1: Data Foundation ✅
**Goal**: Database schema, TypeScript types, CRUD APIs

**Files to Create:**
1. `supabase/migrations/YYYYMMDDHHMMSS_create_strategic_bets_tables.sql`
2. `src/types/bets.ts`
3. `src/app/api/product-strategy-agent/bets/route.ts` (GET, POST)
4. `src/app/api/product-strategy-agent/bets/[id]/route.ts` (PATCH, DELETE)
5. `src/app/api/product-strategy-agent/bets/theses/route.ts` (POST)

**Files to Modify:**
- `src/types/database.ts` - Add `StrategicThesis` and `StrategicBet` row types

**Tests:**
- Integration tests for all CRUD operations
- Type safety verification

**Acceptance Criteria:**
- `npm run build` passes
- All CRUD endpoints return correct data shapes
- Foreign key constraints work (conversation_id, opportunity_id)

---

### Stage 2: AI Bet Generation ✅
**Goal**: Claude generates bets from synthesis opportunities

**Files to Create:**
1. `src/app/api/product-strategy-agent/bets/generate/route.ts`

**Implementation:**
- Fetch synthesis opportunities for conversation
- Build prompt with PTW framework, JTBD, 4-dimension scoring
- Claude generates 3-5 bets grouped under 1-3 theses
- Parse response, validate structure
- Insert theses and bets into database
- Return grouped structure

**Tests:**
- Integration test: Generate bets from mock synthesis
- Verify 5-part hypothesis format
- Verify thesis grouping
- Verify 4-dimension scoring present
- Verify strategic risks populated
- Verify DHM evaluation included

**Acceptance Criteria:**
- Generated bets follow hypothesis format
- Each bet linked to a thesis
- Scoring values between 1-10
- Kill criteria and date present
- Agent reasoning explains assumption being tested

---

### Stage 3: BetsSection + ThesisGroup + BetCard UI ✅
**Goal**: Display bets grouped by thesis with full details

**Files to Create:**
1. `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx`
2. `src/components/product-strategy-agent/CanvasPanel/ThesisGroup.tsx`
3. `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx`

**Files to Modify:**
- `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` - Wire up BetsSection

**Components:**

**BetsSection:**
- Strategy Hierarchy Banner (Perri: Strategic Intent → Product Initiatives → Options)
- Synthesis Recap (top 3 opportunities)
- Bet Proposals (agent-generated with Accept/Edit/Dismiss)
- Thesis Groups (collapsible, organized)
- Export Panel (quality gate enforced)

**ThesisGroup:**
- Thesis title, description, PTW summary
- Thesis type badge (Offensive/Defensive/Capability)
- DHM badges (Delight/Hard to Copy/Margin-enhancing)
- Nested BetCards
- Portfolio balance indicators

**BetCard:**
- 5-part hypothesis layout
- 4-dimension scoring (radar chart or bars)
- Strategic risks (market, positioning, execution, economic)
- Kill criteria with date (amber if <30 days, red if overdue)
- Evidence trail (territory-colored links)
- Edit/Delete buttons

**Design:**
- Phase color: Cyan (cyan-600, cyan-50)
- Thesis type colors: Gold (offensive), Emerald (defensive), Purple (capability)
- Frontera brand guidelines

**Tests:**
- Component tests for each component
- Rendering with mock data
- Expand/collapse thesis groups
- Evidence links navigation

**Acceptance Criteria:**
- All bets display with complete information
- Thesis grouping clear
- DHM badges show correctly
- Kill date warning colors work
- Responsive layout

---

### Stage 4: CreateBetModal + Edit/Delete ✅
**Goal**: Full CRUD operations for bets and theses

**Files to Create:**
1. `src/components/product-strategy-agent/CanvasPanel/CreateBetModal.tsx`

**Files to Modify:**
- `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx` - Wire edit/delete actions
- `src/components/product-strategy-agent/CanvasPanel/ThesisGroup.tsx` - Wire create bet action

**CreateBetModal:**
- Thesis selector dropdown
- 5 hypothesis fields (Job, Belief, Bet, Success Metric, Kill Criteria)
- 4 scoring sliders (1-10 range)
- Strategic risk textareas (4 risks)
- Kill date picker
- Evidence selector (multi-select from synthesis/territory insights)
- Time horizon selector (90d/6m/12m/18m)
- Dependencies selector (multi-select other bets)

**Tests:**
- Component tests
- E2E tests for create/edit/delete flows
- Form validation
- API integration

**Acceptance Criteria:**
- Can create bet from scratch
- Can edit existing bet
- Can delete bet (with confirmation)
- All fields save correctly
- Form validation prevents incomplete bets

---

### Stage 5: Coach Integration + Export ✅
**Goal**: Coach guides bet creation and enforces quality

**Files to Modify:**
1. `src/lib/agents/strategy-coach/system-prompt.ts` - Add Phase 4 coaching behaviors
2. `src/app/api/product-strategy-agent/phase/route.ts` - Add bets phase quality gate

**Coach Behaviors (14 total):**

**Individual Bet Coaching:**
- Propose bets: Suggest generating from synthesis
- Challenge weak evidence: "What research supports this?"
- Demand measurable metrics: "Add number + timeframe"
- Demand kill criteria: "What signal shows failure? By when?"
- Anchor to demand side: "What customer struggling moment?"
- Validate PTW alignment: "Does this test WTP or HTW?"

**Strategic Altitude:**
- Raise altitude: "This sounds like discovery. What market question?"
- Challenge strategic risks: "What's biggest market risk?"
- Validate scoring: "You scored Uniqueness 8/10 - what makes it hard to copy?"

**Portfolio Level:**
- Portfolio balance: "All bets offensive? Where's defensive?"
- Strategic coherence: "Do bets test your WTP+HTW together?"
- Sequencing: "Which bet is prerequisite? If A fails, does C make sense?"
- Optionality: "If only fund two, which preserve optionality?"
- DHM challenge: "Addresses Delight but no moat. How prevent copying?"

**Export Panel:**
- Quality gate: ≥3 bets, ≥1 thesis, all with kill criteria, ≥1 evidence each
- Export button (disabled until gate passed)
- Gate status message

**Tests:**
- AI eval tests for coaching quality
- Manual verification of all 14 behaviors
- Quality gate enforcement

**Acceptance Criteria:**
- Coach provides contextual guidance
- Coach challenges incomplete bets
- Coach raises altitude when user goes too tactical
- Quality gate prevents premature export

---

### Stage 6: Coach Validation (US-4) ✅
**Goal**: Interactive coach feedback during bet editing

**Files to Create:**
1. `src/app/api/product-strategy-agent/bets/validate/route.ts`
2. `src/components/product-strategy-agent/CanvasPanel/CoachValidationPanel.tsx`

**Files to Modify:**
- `src/components/product-strategy-agent/CanvasPanel/CreateBetModal.tsx` - Add "Ask the Coach" button
- `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx` - Add validation trigger on edit

**API: POST /api/product-strategy-agent/bets/validate**
- Input: `{ bet_id, updated_fields, conversation_id }`
- Fetch bet, company context, Lenny research
- Build validation prompt with frameworks
- Claude analyzes edits, provides feedback
- Output: `{ validation, suggested_edits, reasoning }`

**CoachValidationPanel:**
- Shows coach reasoning
- Displays suggested edits (diff view)
- Three-way choice:
  - **Accept**: Apply coach suggestions
  - **Debate**: Open coaching chat with bet context
  - **Reject**: Keep original edits
- Collapsible panel in modal

**Tests:**
- Integration test for validation API
- Component tests for panel
- E2E test for accept/debate/reject flows

**Acceptance Criteria:**
- Coach provides constructive feedback
- Suggestions use company context + Lenny research
- Accept applies edits correctly
- Debate opens chat with bet context pre-loaded
- Reject preserves user edits

---

### Stage 7: Bet Selection + Strategy Document (US-9) ✅
**Goal**: Final deliverable - 6-page Product Strategy Draft

**Files to Create:**
1. `supabase/migrations/YYYYMMDDHHMMSS_create_strategy_documents.sql`
2. `src/components/product-strategy-agent/CanvasPanel/BetSelectionPanel.tsx`
3. `src/components/product-strategy-agent/CanvasPanel/StrategyDocumentPreview.tsx`
4. `src/app/api/product-strategy-agent/bets/strategy-document/generate/route.ts`
5. `src/app/api/product-strategy-agent/bets/strategy-document/export/route.ts`

**Files to Modify:**
- `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx` - Add selection checkbox
- `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx` - Add selection panel

**Database:**
```sql
CREATE TABLE strategy_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  selected_bet_ids uuid[] NOT NULL,
  document_content jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  exported_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**BetSelectionPanel:**
- Shows count of selected bets
- Quality gate: Minimum 3 bets required
- "Create Product Strategy" CTA (disabled until gate passed)
- Selected bet titles list

**API: POST .../strategy-document/generate**
- Fetch selected bets, synthesis, territories, client context, conversation
- Claude generates narrative sections:
  - Executive summary
  - Strategic coherence analysis
  - Next steps & governance
- Assemble structured sections from data:
  - PTW cascade
  - Bet details (5-part hypothesis, scoring, risks, evidence)
  - Portfolio view (balance, sequencing, DHM)
- Store in `strategy_documents.document_content` as JSONB
- Return `document_id`

**API: POST .../strategy-document/export**
- Fetch document from database
- Generate 6-page PDF using PDFKit pattern:
  - **Page 1**: Executive Summary
    - Company overview, strategic intent, 3Cs findings, top opportunities, selected bets
  - **Page 2**: PTW Cascade
    - Winning aspiration, WTP, HTW, capabilities, management systems
  - **Pages 3-4**: Selected Bet Details
    - Each bet: thesis, 5-part hypothesis, 4D scoring, risks, evidence, kill criteria
  - **Page 5**: Portfolio View
    - Coherence, balance, sequencing, resource allocation, DHM coverage
  - **Page 6**: Next Steps
    - Validation timeline, governance, tracking, kill criteria review, topics
- Brand colors: Navy headers, Gold accents, Cyan cards
- Return PDF buffer

**StrategyDocumentPreview:**
- Multi-page scrollable view
- Show all 6 pages
- "Edit" button (regenerate)
- "Export PDF" button

**Tests:**
- Integration tests for generate and export APIs
- Component tests for selection and preview
- E2E test for full flow (select → create → preview → export)
- PDF quality verification

**Acceptance Criteria:**
- Selection requires ≥3 bets
- Document includes all 6 pages
- All context sources included (client, discovery, territories, synthesis, bets, coach)
- PDF follows Frontera brand guidelines
- Export downloads correctly

---

## Verification Checklist

### Build Verification
- [ ] `npm run build` passes clean after each stage
- [ ] `npm run test` - all existing tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings

### Integration Tests
- [ ] Thesis CRUD operations
- [ ] Bets CRUD operations
- [ ] Generate bets from synthesis
- [ ] Coach validation API
- [ ] Strategy document generation
- [ ] Strategy document export

### Component Tests
- [ ] BetsSection renders
- [ ] ThesisGroup expand/collapse
- [ ] BetCard displays all fields
- [ ] CreateBetModal form validation
- [ ] CoachValidationPanel three-way choice
- [ ] BetSelectionPanel quality gate
- [ ] StrategyDocumentPreview navigation

### Manual E2E Verification
- [ ] Full journey: Discovery → Research → Synthesis → **Bets**
- [ ] Generate bets - verify thesis grouping, 5-part hypothesis, scoring, risks, kill criteria
- [ ] Create bet manually with all fields
- [ ] Edit bet → Ask the Coach → verify feedback
- [ ] Coach validation → Accept → bet updated
- [ ] Coach validation → Debate → chat opens
- [ ] Coach validation → Reject → edits preserved
- [ ] Select <3 bets → Create Strategy disabled
- [ ] Select ≥3 bets → Create Strategy enabled
- [ ] Create Strategy → verify 6 pages
- [ ] Page 1: Exec summary complete
- [ ] Page 2: PTW cascade complete
- [ ] Pages 3-4: Bet details complete
- [ ] Page 5: Portfolio view complete
- [ ] Page 6: Next steps complete
- [ ] Export PDF → Frontera branding correct
- [ ] Export PDF → all context included
- [ ] Quality gate enforcement (export button)

### Coach Behavior Verification
- [ ] Strategic altitude coaching (not discovery level)
- [ ] Portfolio-level coaching (balance, coherence, sequencing)
- [ ] Raises altitude when user drops to feature-level
- [ ] Challenges weak evidence
- [ ] Demands measurable metrics
- [ ] Demands kill criteria
- [ ] DHM challenge when moat missing

---

## Files Summary

### New Files (20 total)

**Migrations (2):**
1. `YYYYMMDDHHMMSS_create_strategic_bets_tables.sql`
2. `YYYYMMDDHHMMSS_create_strategy_documents.sql`

**Types (1):**
3. `src/types/bets.ts`

**API Routes (8):**
4. `src/app/api/product-strategy-agent/bets/route.ts`
5. `src/app/api/product-strategy-agent/bets/[id]/route.ts`
6. `src/app/api/product-strategy-agent/bets/theses/route.ts`
7. `src/app/api/product-strategy-agent/bets/generate/route.ts`
8. `src/app/api/product-strategy-agent/bets/validate/route.ts`
9. `src/app/api/product-strategy-agent/bets/strategy-document/generate/route.ts`
10. `src/app/api/product-strategy-agent/bets/strategy-document/export/route.ts`
11. `src/app/api/product-strategy-agent/bets/export/route.ts` (portfolio PDF)

**Components (9):**
12. `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx`
13. `src/components/product-strategy-agent/CanvasPanel/ThesisGroup.tsx`
14. `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx`
15. `src/components/product-strategy-agent/CanvasPanel/CreateBetModal.tsx`
16. `src/components/product-strategy-agent/CanvasPanel/CoachValidationPanel.tsx`
17. `src/components/product-strategy-agent/CanvasPanel/BetSelectionPanel.tsx`
18. `src/components/product-strategy-agent/CanvasPanel/StrategyDocumentPreview.tsx`

**Tests (2):**
19. `tests/integration/api/bets/route.test.ts`
20. `tests/unit/components/product-strategy-agent/BetsSection.test.tsx`

### Modified Files (7)
1. `src/types/database.ts` - Add row types
2. `src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx` - Wire BetsSection
3. `src/lib/agents/strategy-coach/system-prompt.ts` - Add Phase 4 coaching
4. `src/app/api/product-strategy-agent/phase/route.ts` - Add quality gate
5. `src/components/product-strategy-agent/CanvasPanel/BetCard.tsx` - Add selection + validation
6. `src/components/product-strategy-agent/CanvasPanel/BetsSection.tsx` - Add selection panel
7. `src/components/product-strategy-agent/CanvasPanel/CreateBetModal.tsx` - Add coach validation

---

## Timeline Estimate

- **Stage 1**: 2-3 hours (database, types, APIs)
- **Stage 2**: 2-3 hours (AI generation)
- **Stage 3**: 3-4 hours (UI components)
- **Stage 4**: 2-3 hours (CRUD modal)
- **Stage 5**: 2-3 hours (coach integration)
- **Stage 6**: 2-3 hours (validation feature)
- **Stage 7**: 4-5 hours (strategy document)
- **Testing**: 2-3 hours (comprehensive verification)

**Total**: 19-27 hours of development

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI generation quality varies | Extensive prompt engineering, validation, examples |
| Complex UI state management | Break into small components, clear data flow |
| PDF generation layout issues | Use proven PDFKit pattern, explicit Y tracking |
| Coach validation usefulness | Iterate on prompt, user testing, feedback loop |
| Database migration conflicts | Sequential migrations, test rollback |

---

## Success Criteria

1. ✅ All 7 stages complete
2. ✅ All tests pass
3. ✅ Quality gates enforced
4. ✅ Coach provides valuable feedback
5. ✅ 6-page strategy document exports correctly
6. ✅ Full journey Discovery → Bets → Strategy works end-to-end

---

**Status**: Ready to Begin Implementation
