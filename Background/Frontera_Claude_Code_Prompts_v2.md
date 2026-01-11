# Frontera Strategy Coach: Updated Claude Code Prompts
## Aligned with PRD v2.1 & Strategy Coach v2 Mockup

**Version**: 2.0  
**Date**: January 2026  
**Purpose**: Updated prompts for building the Frontera Strategy Coach with revised inputs, 3Cs framework, and detailed agent behavior guidance

---

## 1. Overview: Strategy Development Flow

The Strategy Coach follows a 4-phase journey:

```
Discovery          →    3Cs Research       →    Synthesis           →    Strategic Bets
(Context Setting)       (Terrain Mapping)       (Strategy Formation)    (Route Planning)
```

Each phase builds on the previous, with the AI Coach guiding users through structured research while adapting to their context and input style.

---

## 2. Phase 1: Discovery (Context Setting)

### 2.1 Updated Claude Code Prompt

```
"Implement the Discovery phase for Frontera Strategy Coach:

INPUTS TO GATHER:
1. Company Context
   - Organization name and industry
   - Company size and structure
   - Existing product strategy documents (upload)
   - Financial performance summary (revenue, growth, margins)
   - Revenue targets and growth ambitions
   - Executive priorities and transformation mandate
   
2. Strategic Baseline
   - Current product portfolio assessment
   - Existing flywheel or growth engine (if any)
   - Previous transformation attempts (successes/failures)
   - Key metrics currently tracked
   
3. Source Materials Upload
   - Support PDF, DOCX, XLSX, CSV
   - Extract key themes using Claude API
   - Store extracted context for agent reference

UI COMPONENTS:
- Two-column layout: Company Context card + Source Materials upload
- Coach sidebar with welcoming message and first probing question
- Progress indicator showing Discovery phase active
- 'Uploaded Materials' list that populates as files added

COACH BEHAVIOR:
- Welcome user by name (from Clerk auth)
- Explain the methodology briefly
- Ask first probing question: 'What competitive dynamics or market shifts 
  are making product transformation urgent for [Organization] right now?'
- Respond to uploaded documents by summarizing key themes found
- Challenge vague responses with follow-ups
- Extract and store: industry, competitors mentioned, strategic priorities

Auto-save all inputs. Generate Company Context Summary as first artefact."
```

### 2.2 Agent Behavior Guidance: Discovery Phase

| Trigger | Agent Response | Behavior Mode |
|---------|----------------|---------------|
| Session start | Warm welcome, explain journey ahead | Supportive, orientating |
| Document uploaded | Extract themes, ask clarifying questions about content | Analytical, curious |
| User mentions competitor | Note competitor, ask about differentiation | Probing, building context |
| Vague answer (e.g., "We want to grow") | Challenge: "What does growth mean specifically? Revenue? Market share? New segments?" | Challenging, clarifying |
| User seems uncertain | Offer examples from similar industries | Supportive, guiding |
| Rich context provided | Summarize understanding, confirm accuracy | Validating, synthesizing |

---

## 3. Phase 2: 3Cs Research (Terrain Mapping)

### 3.1 Company Territory - Updated Claude Code Prompt

```
"Implement the Company territory exploration for 3Cs Research:

RESEARCH AREAS (adapted from Macro Market Forces + Company Analysis):

1. Core Capabilities Assessment
   Questions:
   - What does [Organization] do exceptionally well that competitors can't easily replicate?
   - What capabilities are table stakes vs. genuine differentiators?
   - Where do you invest disproportionately? Why?
   
2. Resource Reality Check
   Questions:
   - What are your true constraints? (Budget, talent, tech debt, time)
   - How is engineering capacity currently allocated?
   - What would you stop doing to fund something new?
   
3. Product Portfolio Performance
   Questions:
   - Which products drive most revenue? Most growth? Most profit?
   - What's the 80/20 of your portfolio? (20% products driving 80% value)
   - What products are you maintaining vs. actively investing in?
   
4. Flywheel & Growth Engine
   Questions:
   - What drives organic growth today?
   - How do customers discover you? Why do they stay?
   - What's the compounding effect (if any) in your business model?
   
5. Organizational Readiness
   Questions:
   - How has [Organization] responded to major changes before?
   - What's the decision-making culture? (Consensus? Top-down? Autonomous?)
   - What internal resistance might a strategic shift face?
   
6. Technology & Platform Dynamics
   Questions:
   - What platform dependencies enable or constrain you?
   - What technical debt affects your ability to move fast?
   - What emerging tech could change your competitive position?

COACH BEHAVIOR:
- For each area: Ask 2-3 questions, wait for response, ask 1-2 follow-ups
- Challenge surface-level answers: 'You mentioned "good engineering"—can you be specific?'
- Connect to uploaded documents: 'In your strategy doc, you mentioned X. How does that relate?'
- Track progress with visual indicator (e.g., 3/6 areas explored)
- Allow non-linear navigation (jump between areas)
- Auto-save after each response
- Generate Company Reality Assessment when all areas explored

UI: Territory card expands into scrollable research view with area cards.
Progress shows percentage complete within Company territory."
```

### 3.2 Customer Territory - Updated Claude Code Prompt

```
"Implement the Customer territory exploration for 3Cs Research:

RESEARCH AREAS (adapted from Customer Research + JTBD):

1. Segment Identification & Prioritization
   Questions:
   - Who are your most valuable customer segments today?
   - Which segments are growing fastest? Which are stagnating?
   - If you had to choose ONE segment to focus all resources on, which would it be? Why?
   
2. Jobs-to-be-Done Mapping
   Questions:
   - What are customers really trying to accomplish when they use your product?
   - What functional jobs? Emotional jobs? Social jobs?
   - What workarounds do customers create because your product falls short?
   
3. Unmet Needs Radar
   Questions:
   - What do customers ask for that you can't deliver today?
   - Where is satisfaction lowest despite high importance?
   - What needs are competitors addressing that you're not?
   
   VISUALIZATION: Interactive 2x2 (Importance vs Satisfaction)
   - Agent suggests placement based on responses
   - User can adjust positions
   - Generates 'whitespace' opportunities in high-importance, low-satisfaction quadrant
   
4. Adoption & Switching Dynamics
   Questions:
   - Why do new customers choose you over alternatives?
   - Why do customers leave? What's the #1 reason for churn?
   - What barriers prevent non-customers from switching to you?
   
5. Customer Outcome Framing
   Questions:
   - What measurable outcome defines success for your customers?
   - How does your product save time / reduce risk / increase revenue for them?
   - Can you quantify the value you create?
   
6. Trend & Behavior Shifts
   Questions:
   - How have customer expectations changed in the last 2 years?
   - What external forces (regulation, technology, economy) are shifting customer behavior?
   - What do next-generation customers expect that current customers don't?

COACH BEHAVIOR:
- Use industry-specific language (Financial Services → 'advisers', 'platforms', 'AUA')
- Challenge internal assumptions: 'That's what leadership believes—what does customer data say?'
- Reference uploaded materials if customer data included
- Build segment prioritization matrix as conversation progresses
- Generate Customer Insight Summary when complete"
```

### 3.3 Competitor Territory - Updated Claude Code Prompt

```
"Implement the Competitor territory exploration for 3Cs Research:

RESEARCH AREAS (adapted from Competitive Landscape + PTW):

1. Direct Competitor Mapping
   Questions:
   - Who are your top 3-5 direct competitors? (Same customer, same need)
   - What does each do better than you? What do you do better than them?
   - How do they position themselves? What's their 'story'?
   
   INDUSTRY TEMPLATE (Financial Services example):
   Pre-populate: Nucleus, Quilter, Transact, AJ Bell, Fidelity
   Agent asks: 'I've included common UK platform competitors. Add, remove, or adjust?'
   
2. Indirect & Substitute Threats
   Questions:
   - What alternatives do customers consider beyond direct competitors?
   - What 'non-consumption' competes for the same budget/attention?
   - If your category didn't exist, how would customers solve this problem?
   
3. Disruptor & Entrant Watch
   Questions:
   - Which fintechs/startups could disrupt your market?
   - What would a well-funded new entrant do differently?
   - Who from adjacent markets might expand into your space?
   
4. Competitor Vulnerabilities
   Questions:
   - Where are competitors weakest? (Service, tech, pricing, speed)
   - What do their customers complain about?
   - What strategic moves have competitors made that backfired?
   
5. Macro Market Forces
   Questions:
   - What regulatory changes could reshape competition?
   - How are economic conditions affecting competitive dynamics?
   - What technology shifts could change who wins?
   
6. Play-to-Win Scenario Mapping
   Questions:
   - If you were to 'win' in this market, what would that look like in 3 years?
   - What strategic 'move' would competitors most fear from you?
   - What capabilities would you need to build/acquire to win?
   
   VISUALIZATION: Competitive Position Map (2x2)
   - X-axis: Market Reach, Y-axis: Capability Depth
   - Plot self vs. competitors
   - Identify strategic 'white space'

COACH BEHAVIOR:
- Use industry templates to speed up competitor identification
- Challenge overconfidence: 'You say you're better at X—what's the evidence?'
- Push for specificity on vulnerabilities
- Connect to earlier Company analysis: 'Given your constraints, which competitor vulnerability can you realistically exploit?'
- Generate Competitive Landscape Map when complete"
```

---

## 4. Phase 3: Synthesis (Strategy Formation)

### 4.1 Updated Claude Code Prompt

```
"Implement the Synthesis phase for Frontera Strategy Coach:

UNLOCK CONDITION: Complete at least 2 of 3 territory pillars

SYNTHESIS ENGINE:

1. Forced Triangulation
   Automatically generate connections:
   
   Company + Customer → 'What We Can Deliver'
   - Match capabilities to customer needs
   - Identify gaps between what customers want and what we can provide
   - Surface capability investments needed
   
   Customer + Competitor → 'Where Customers Are Underserved'
   - Cross-reference unmet needs with competitor weaknesses
   - Identify 'whitespace' opportunities
   - Prioritize by segment value
   
   Company + Competitor → 'Where We Can Win'
   - Match our strengths to competitor vulnerabilities
   - Identify sustainable advantage opportunities
   - Reality-check against our constraints

2. Strategic Opportunity Map Generation
   2x2 Matrix:
   - X-axis: Market Attractiveness (segment size, growth, unmet needs)
   - Y-axis: Capability Fit (our ability to deliver, competitive advantage)
   
   Plot opportunities from triangulation
   Agent suggests quadrant placement; user can adjust
   
3. Strategic Crux Definition
   Agent synthesizes and proposes:
   'Based on your research, the central strategic question appears to be:
   [CRUX STATEMENT]
   
   Example: "To win with consolidators, [Organization] must outpace competitors 
   in service reliability, integration depth, and flexible commercial design—
   all underpinned by platform modernization."'
   
   User can edit/refine the crux

OUTPUT CARDS:
- Market Opportunities (eye icon)
- Validated Problems (checkmark icon)
- Org Readiness Assessment (download icon)

COACH BEHAVIOR:
- Proactively highlight connections user may not have seen
- Challenge the crux: 'Is this really the central question, or is there something deeper?'
- Push for specificity: 'When you say "win", what does that mean in measurable terms?'
- Generate Strategic Context Canvas as primary artefact"
```

---

## 5. Phase 4: Strategic Bets (Route Planning)

### 5.1 Updated Claude Code Prompt

```
"Implement the Strategic Bets phase for Frontera Strategy Coach:

BET HYPOTHESIS FORMAT:
Each strategic bet follows the structure:
- We believe: [Trend/insight from research]
- Which means: [Opportunity/problem space]
- So we will explore: [Hypothesis/initiative direction]
- Success looks like: [Leading indicator metric]
- Confidence: [High/Medium/Low] with evidence links

AGENT-GENERATED BETS:
Based on synthesis, agent proposes 3-5 strategic bets
User can edit, add, or remove bets

BET CATEGORIES (guide generation):
1. 'Play to Win' bets - Bold moves to change competitive position
2. 'Defend & Extend' bets - Protect current strengths while extending
3. 'Capability Building' bets - Investments in future readiness
4. 'Customer Expansion' bets - Grow within existing or new segments

VALIDATION LINKS:
Each bet links back to supporting evidence:
- Company insight that enables this
- Customer need this addresses
- Competitor vulnerability this exploits

PRIORITIZATION SUPPORT:
Agent helps prioritize using:
- Impact vs. Effort matrix
- Risk assessment
- Alignment to strategic crux

OUTPUT:
- Strategic Bets Document
- Complete Strategic Context Canvas
- Key Insights Deck (10 slides, auto-generated)
- Export options: PDF, DOCX

COACH BEHAVIOR:
- Challenge bets that don't connect to research evidence
- Highlight bets that may conflict with each other
- Push for measurable success criteria
- Ask: 'If this bet fails, what will you have learned?'"
```

---

## 6. Agent Behavior Framework

### 6.1 Behavior Modes

The Frontera Coach adapts its behavior based on user input style and strategic context:

| Mode | When to Use | Characteristics | Example Prompts |
|------|-------------|-----------------|-----------------|
| **Structured & Incremental** | User prefers methodical progress, risk-averse, first-time strategy work | Step-by-step guidance, validate each section, offer templates | "Let's work through this systematically. First, let's establish your core capabilities..." |
| **Radical Innovation** | User signals desire for disruption, mentions "transform", "disrupt", "new market" | Challenge conventions, push for bold thinking, highlight disruptor examples | "What would a competitor with no legacy constraints do here?" |
| **Mixed/Balanced** | Default mode, most enterprise contexts | Balance structure with provocation, adapt based on responses | "That's a solid foundation. Now let's stress-test it—what would break this strategy?" |
| **Adaptive to User** | When user behavior is unclear or inconsistent | Mirror user's pace and depth, ask preference questions | "Would you like to go deeper on this, or shall we move to the next area?" |

### 6.2 Behavior Selection Logic

```javascript
// Pseudocode for agent behavior selection
function selectBehaviorMode(context) {
  const { 
    userResponses, 
    industryContext, 
    transformationHistory, 
    strategicFocus 
  } = context;
  
  // Check for explicit signals
  if (userResponses.includes('disrupt') || userResponses.includes('transform radically')) {
    return 'RADICAL_INNOVATION';
  }
  
  // Check for risk-averse signals
  if (transformationHistory.includes('failed') || userResponses.includes('careful')) {
    return 'STRUCTURED_INCREMENTAL';
  }
  
  // Check strategic focus from onboarding
  if (strategicFocus === 'market-led') {
    return 'RADICAL_INNOVATION';
  } else if (strategicFocus === 'team-empowerment') {
    return 'STRUCTURED_INCREMENTAL';
  }
  
  // Default
  return 'MIXED_BALANCED';
}
```

### 6.3 When Agent Probes for More Information

| Situation | Agent Action | Example |
|-----------|--------------|---------|
| **Surface-level response** | Ask for specifics | "You mentioned 'good service.' Can you quantify that? What do customers actually say?" |
| **Assertion without evidence** | Request evidence | "That's an interesting claim. What data supports it?" |
| **Contradiction detected** | Highlight and explore | "Earlier you said X, but now you're saying Y. Help me understand the nuance." |
| **Gap in coverage** | Prompt for missing area | "We haven't discussed [area]. Is that intentional, or should we explore it?" |
| **Confidence mismatch** | Calibrate | "You seem very confident here. On a scale of 1-10, how certain are you? What would change your mind?" |
| **External trend missed** | Introduce consideration | "In your industry, I've seen [trend] affecting similar companies. Is that relevant here?" |

### 6.4 Agent Tone Guidelines

| Context | Tone | Avoid |
|---------|------|-------|
| Welcome/onboarding | Warm, professional, orientating | Overly casual, jargon-heavy |
| Gathering information | Curious, attentive, validating | Interrogating, rushing |
| Challenging assumptions | Respectful, firm, evidence-based | Dismissive, aggressive |
| Synthesis/insight delivery | Confident, clear, actionable | Hedging, vague |
| User frustration | Empathetic, solution-oriented | Defensive, robotic |
| Strategic recommendations | Bold but humble, open to refinement | Prescriptive, closed |

---

## 7. Research Area Reference

### 7.1 Complete Research Areas by Territory

**Company Territory (6 areas)**
1. Core Capabilities Assessment
2. Resource Reality Check
3. Product Portfolio Performance
4. Flywheel & Growth Engine
5. Organizational Readiness
6. Technology & Platform Dynamics

**Customer Territory (6 areas)**
1. Segment Identification & Prioritization
2. Jobs-to-be-Done Mapping
3. Unmet Needs Radar (with visualization)
4. Adoption & Switching Dynamics
5. Customer Outcome Framing
6. Trend & Behavior Shifts

**Competitor Territory (6 areas)**
1. Direct Competitor Mapping
2. Indirect & Substitute Threats
3. Disruptor & Entrant Watch
4. Competitor Vulnerabilities
5. Macro Market Forces
6. Play-to-Win Scenario Mapping (with visualization)

---

## 8. Output Artefacts

| Phase | Artefact | Format | Auto-generated? |
|-------|----------|--------|-----------------|
| Discovery | Company Context Summary | JSON/Display | Yes |
| Company Territory | Company Reality Assessment | JSON/Display | Yes, after all areas |
| Customer Territory | Customer Insight Summary | JSON/Display | Yes, after all areas |
| Customer Territory | Unmet Needs Radar | Interactive 2x2 | Yes, from responses |
| Competitor Territory | Competitive Landscape Map | Interactive 2x2 | Yes, from responses |
| Synthesis | Strategic Opportunity Map | Interactive 2x2 | Yes, from triangulation |
| Synthesis | Strategic Crux Statement | Text | Yes, editable |
| Strategic Bets | Strategic Bets Document | Structured cards | Yes, editable |
| Final | Strategic Context Canvas | PDF/DOCX | Yes, compiled |
| Final | Key Insights Deck | PDF (10 slides) | Yes, compiled |

---

## 9. Success Criteria for Implementation

### Per-Phase Quality Gates

| Phase | Quality Gate | How to Measure |
|-------|-------------|----------------|
| Discovery | Company context captured with ≥3 uploaded materials | File count + extracted context JSON |
| Company | All 6 research areas explored with substantive responses | Response length + agent follow-ups completed |
| Customer | Unmet Needs Radar populated with ≥5 needs | Need count + position data |
| Competitor | ≥3 competitors mapped with strengths/weaknesses | Competitor profile completeness |
| Synthesis | Triangulation connects ≥3 cross-pillar insights | Link count between territories |
| Strategic Bets | ≥3 bets with evidence links to research | Bet count + evidence link validation |

### Agent Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Challenge Rate | ≥20% of responses get follow-up challenge | Count challenges / total responses |
| Connection Rate | ≥50% of synthesis insights link to ≥2 territories | Connection link validation |
| Adaptation Rate | Behavior mode aligns with user signals | Manual review sample |
| Evidence Grounding | ≥80% of bets have explicit evidence links | Link validation |

---

*Document Version: 2.0*  
*Aligned with: PRD v2.1, Strategy Coach v2 Mockup*  
*Last Updated: January 2026*
