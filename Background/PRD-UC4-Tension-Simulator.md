# PRD: Strategic Tension Simulator — Expert Debate Mode

**Version**: 1.0
**Date**: January 31, 2026
**Status**: Draft
**Author**: Frontera Product Team
**Feature Flag**: `tension_simulator`

---

## 1. Overview & Problem Statement

### Problem
When the Synthesis phase surfaces strategic tensions — conflicting evidence pulling a team in different directions — users get a flat list of pros/cons. There's no mechanism to deeply explore the tradeoff space. Teams default to the loudest voice or analysis paralysis because the stakes of each direction aren't made tangible.

### Solution
**Strategic Tension Simulator** introduces a "Debate Mode" that activates when the coach identifies a strategic tension during Synthesis. It presents two opposing expert perspectives drawn from 301 podcast transcripts — each arguing their position with evidence. The user evaluates both sides and makes an informed choice that carries forward into Strategic Bets.

### Value Proposition
Makes strategic tradeoffs visceral and multi-dimensional. Users don't receive one answer — they hear the strongest case for each direction through the lens of proven leaders, then decide with full awareness of what they're choosing and what they're giving up.

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-4.1 | As a strategist, I want to see opposing expert perspectives when I face a strategic tension, so I can understand both sides before deciding. | P0 |
| US-4.2 | As a user, I want to choose which side of a debate aligns with my context, so my choice influences my Strategic Bets. | P0 |
| US-4.3 | As a user, I want my debate choices recorded as part of my strategy's evidence trail, so my team can see why we chose a direction. | P0 |
| US-4.4 | As a user, I want the option to decline Debate Mode and use standard tension resolution instead. | P1 |
| US-4.5 | As a user, I want to see my own research evidence alongside expert positions, so the debate is grounded in my data. | P1 |
| US-4.6 | As a team lead, I want to share debate summaries with my team to facilitate alignment discussions. | P2 |
| US-4.7 | As a user, I want to revisit past debate decisions and potentially reconsider, so I can evolve my thinking. | P2 |

---

## 3. Functional Requirements

### 3.1 Tension-to-Expert Mapping

| ID | Requirement |
|----|------------|
| FR-4.01 | System SHALL maintain a tension map linking common strategic tensions to expert positions from transcripts |
| FR-4.02 | Each tension mapping SHALL include: tension description, two opposing positions, supporting expert quotes, relevant transcript references |
| FR-4.03 | Initial tension map SHALL cover at least 20 common strategic tensions (leveraging the full 301-transcript archive for diverse expert positions) |
| FR-4.04 | Tension map SHALL be extensible — new tensions can be added without code changes |

**Initial Tension Map:**

| Tension | Position A | Position B |
|---------|-----------|-----------|
| Speed vs. Quality | Nan Yu (Linear): "Speed is competence" | Kim Scott: "Slow down to care" |
| PLG vs. Sales-Led | Hila Qu / Elena Verna: "Free products are the best acquisition" | Jen Abel / Pete Kazanjy: "Founder-led sales validates willingness to pay" |
| Focus vs. Expand | Vijay (Mixpanel): "Refocus on core" | Cameron Adams (Canva) / Marc Benioff: "Expand the platform" |
| Build AI vs. Stay Human | Inbal Shani (GitHub) / Scott Wu (Cognition): "AI augments everything" | Conservative positions from multiple speakers |
| Hire External vs. Grow Internal | Claire Hughes Johnson (Stripe): "Bring in experienced leaders" | Cameron Adams (Canva) / Molly Graham: "Homegrown leadership" |
| Move Fast vs. Move Right | Boz (Meta): "120hr weeks, ship now" | Ami Vora (Faire) / Teresa Torres: "Curiosity over ego, think deeply" |
| Freemium vs. Premium | Grant Lee (Gamma): "Profitability from day one" | Hila Qu / Brian Balfour: "Free tier as acquisition funnel" |
| Global vs. Local Focus | Ray Cao (TikTok) / Kevin Aluwi (GoJek): "Adapt to local markets" | Ivan Zhao (Notion) / Tobi Lutke (Shopify): "One product for the world" |
| Founder-Led vs. Professional Management | Brian Chesky (Airbnb): "Founders should stay in details" | Marty Cagan: "Empower product teams" |
| Data-Driven vs. Intuition | Ronny Kohavi: "A/B test everything" | Shreyas Doshi / Stewart Butterfield: "Trust product judgment" |
| Bottom-Up vs. Top-Down Strategy | Richard Rumelt / Roger Martin: "Strategy is a top-down choice" | Teresa Torres / John Cutler: "Continuous discovery from the ground" |
| Radical Transparency vs. Selective Sharing | Kim Scott / Claire Hughes Johnson: "Default to openness" | Ben Horowitz: "Leaders carry the burden" |
| Platform vs. Point Solution | Shishir Mehrotra (Coda) / Marc Benioff: "Build the platform" | Jason Fried (Basecamp): "Do one thing well" |
| Venture-Scale vs. Sustainable Growth | Marc Andreessen: "Go big or go home" | Jason Fried / Tobi Lutke: "Sustainable profitability" |
| Technical Excellence vs. Ship It | Will Larson (Carta): "Invest in engineering excellence" | Guillermo Rauch (Vercel): "Ship, learn, iterate" |
| Category Creation vs. Category Entry | Christopher Lochhead: "Create the category" | April Dunford: "Position within existing categories" |
| Jobs-to-Be-Done vs. Feature Roadmap | Bob Moesta: "Understand the job" | Gibson Biddle: "Feature-driven product strategy" |
| Pricing Power vs. Market Penetration | Madhavan Ramanujam: "Monetize from day one" | Gustaf Alstromer: "Growth first, monetize later" |
| Individual Genius vs. Team Process | Nikita Bier: "Small team, singular vision" | Nicole Forsgren / Camille Fournier: "Engineering process scales" |
| Customer Obsession vs. Vision-Led | Jeff Weinstein / Bill Carr: "Work backwards from the customer" | Scott Belsky / Dylan Field: "Lead with creative vision" |

### 3.2 Debate Presentation

| ID | Requirement |
|----|------------|
| FR-4.05 | When a tension is identified during Synthesis, the coach SHALL offer to enter Debate Mode |
| FR-4.06 | Debate Mode SHALL present two expert positions in a structured format with visual distinction (e.g., blue vs. red framing) |
| FR-4.07 | Each position SHALL include: expert name, company, core argument (2-3 sentences), supporting quote from transcript |
| FR-4.08 | Debate SHALL show the user's own research evidence relevant to this tension alongside expert positions |
| FR-4.09 | The coach SHALL provide a neutral framing question after presenting both positions |

### 3.3 User Decision Capture

| ID | Requirement |
|----|------------|
| FR-4.10 | Users SHALL select which position aligns with their context or provide a nuanced "both/neither" response |
| FR-4.11 | User's choice and reasoning SHALL be stored in the conversation and synthesis records |
| FR-4.12 | The chosen direction SHALL influence the framing of subsequent Strategic Bets |
| FR-4.13 | The coach SHALL acknowledge the choice and explain how it shapes the strategy going forward |

### 3.4 Debate History

| ID | Requirement |
|----|------------|
| FR-4.14 | All debate decisions SHALL be viewable in a "Debate History" section within Synthesis |
| FR-4.15 | Each debate record SHALL show: tension, positions, user's choice, reasoning, timestamp |
| FR-4.16 | Users SHALL be able to revisit and update a debate decision |

---

## 4. Technical Requirements

### 4.1 Database Schema Changes

**Update `synthesis_outputs` table — add `debate_decisions` JSONB column:**
```sql
ALTER TABLE synthesis_outputs
ADD COLUMN debate_decisions JSONB DEFAULT '[]';

-- debate_decisions structure:
-- [{
--   tension_id: string,
--   tension_description: string,
--   position_a: { expert, company, argument, quote },
--   position_b: { expert, company, argument, quote },
--   user_choice: 'position_a' | 'position_b' | 'nuanced',
--   user_reasoning: string,
--   user_research_evidence: string[],
--   decided_at: ISO timestamp
-- }]
```

### 4.2 New Files

| File | Purpose |
|------|---------|
| `src/lib/knowledge/tension-map.ts` | Static tension-to-expert position mappings |
| `src/components/product-strategy-agent/CanvasPanel/DebateCard.tsx` | Debate Mode UI component |
| `src/components/product-strategy-agent/CanvasPanel/DebateHistory.tsx` | Past debate decisions view |

### 4.3 Key Files to Modify

| File | Change |
|------|--------|
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add debate mode instructions; include tension map context when in synthesis phase |
| `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx` | Add Debate Mode trigger to TensionCard; add Debate History section |
| `src/components/product-strategy-agent/CoachingPanel/` | Handle debate flow in chat (offer → present → capture choice) |
| `src/app/api/product-strategy-agent/synthesis/route.ts` | Store debate decisions in synthesis_outputs |
| `src/types/database.ts` | Add `DebateDecision` interface |

---

## 5. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-4.01 | Coach offers Debate Mode when a strategic tension is identified in Synthesis |
| AC-4.02 | Two expert positions are displayed with clear visual distinction |
| AC-4.03 | Each position includes expert name, company, argument, and transcript quote |
| AC-4.04 | User's own research evidence is shown alongside expert positions |
| AC-4.05 | User can select a position or provide a nuanced response |
| AC-4.06 | Debate choice is persisted and visible in Debate History |
| AC-4.07 | Debate choice influences Strategic Bets framing |
| AC-4.08 | User can decline Debate Mode and proceed with standard tension resolution |
| AC-4.09 | At least 20 common tensions are mapped to expert positions from the 301-transcript archive |
| AC-4.10 | Feature is gated behind `tension_simulator` feature flag |

---

## 6. Dependencies & Assumptions

### Dependencies
- Synthesis phase tension identification (already implemented)
- Full 301-transcript archive available for quote extraction
- UC1 (Expert Perspectives) transcript ingestion (shared infrastructure)

### Assumptions
- Most strategic tensions can be mapped to binary opposing positions as a starting point
- Expert positions from transcripts represent authentic, defensible viewpoints
- Users value structured debate over unstructured pros/cons lists
- Debate choices are informational, not binding — users can revisit

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Debate Mode acceptance rate | ≥ 50% of offered debates are entered | PostHog |
| Debate completion rate | ≥ 80% of entered debates result in a decision | PostHog |
| Time to tension resolution | 30% faster with Debate Mode vs. without | PostHog A/B |
| User rating of debate helpfulness | ≥ 4.2 / 5.0 | In-app feedback |
| Debate decisions referenced in final strategy | ≥ 60% of debates cited in bets | DB query |

---

## 8. Out of Scope

- Multi-party debates (more than 2 positions)
- Real-time team voting on debate positions
- AI-generated counter-arguments beyond transcript content
- Debate Mode in phases other than Synthesis
- Custom tension creation by users
