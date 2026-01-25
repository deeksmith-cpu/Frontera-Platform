# Product Strategy Agent MVP - UAT Test Pack

**Version:** 2.0
**Date:** January 25, 2026
**Testing Period:** MVP Build (Updated for current implementation)
**Aligned to:** Product Requirements Document v2.1 & Frontera Platform Mission

---

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Test Environment Setup](#test-environment-setup)
3. [UAT Test Scenarios](#uat-test-scenarios)
4. [Success Criteria](#success-criteria)
5. [Bug Reporting Template](#bug-reporting-template)

---

## Testing Overview

### Mission Alignment
The Frontera Platform exists to bridge the gap between strategic vision and operational reality. This UAT test pack validates that the Product Strategy Agent MVP:
- Guides users through systematic strategic research
- Provides AI-powered coaching that adapts to context
- Generates actionable strategic insights using the Playing to Win framework
- Enables hypothesis-driven strategic planning

### Test Objectives
1. **Validate Core User Journey** - Discovery → Landscape → Synthesis → Strategic Bets
2. **Verify AI Coaching Quality** - Phase-aware, context-sensitive, actionable guidance
3. **Test Territory Research System** - Structured data capture across Company, Customer, and Market Context territories
4. **Validate Synthesis Generation** - AI-powered PTW-based strategic analysis with structured opportunities
5. **Assess User Experience** - Intuitive navigation, clear progress tracking, responsive design

### Testing Approach
- **Black Box Testing** - Test from user perspective without knowledge of internal implementation
- **Scenario-Based Testing** - Real-world strategic coaching scenarios
- **Acceptance Testing** - Verify features meet PRD requirements
- **Exploratory Testing** - Discover edge cases and usability issues

---

## Test Environment Setup

### Prerequisites
- Access to development environment: http://localhost:3000
- Valid Clerk account with organization
- Approved client onboarding application
- Test data prepared (company context, strategic materials)
- Anthropic API credits available

### Test User Personas

**Persona 1: Maya Okonkwo - The Ambitious Operator**
- Role: VP of Product
- Company: TechFlow Solutions (B2B SaaS, 3,500 employees)
- Goal: Prove enterprise-scale product velocity
- Pain Point: Consultancy frameworks not landing with teams

**Persona 2: Tom Aldridge - The Change-Weary Practitioner**
- Role: Head of Engineering
- Company: MediCare Systems (Healthcare Technology, 6,200 employees)
- Goal: Protect teams from disruptive initiatives
- Pain Point: Product-engineering misalignment

**Persona 3: Richard Thornton - The Board-Appointed Fixer**
- Role: Chief Transformation Officer (Interim)
- Company: Pemberton Financial Group (Financial Services, 8,500 employees)
- Goal: Deliver measurable transformation in 6 months
- Pain Point: Previous £12M transformation failed

---

## UAT Test Scenarios

### PHASE 1: DISCOVERY PHASE TESTING

#### **Scenario 1.1: New Conversation Creation**
**Objective:** Validate users can create a new coaching conversation
**PRD Requirement:** Conversation Management

**Test Steps:**
1. Navigate to `/dashboard/product-strategy-agent`
2. Verify conversation is created automatically or click "New Conversation"
3. Verify conversation is created successfully
4. Confirm you're in the conversation view
5. Verify progress stepper shows "Discovery" phase highlighted

**Expected Results:**
- New conversation appears in conversation list
- Opening message from Strategy Coach is displayed
- Opening message is personalized (includes user name and company name)
- Message references company context from onboarding
- Progress stepper indicates Discovery phase (step 1 of 4)
- Canvas shows "Discovery Section" with upload area and progress checklist

**Success Criteria:**
- Conversation created in < 2 seconds
- Opening message is contextually relevant
- No errors in browser console

---

#### **Scenario 1.2: Upload Strategic Materials**
**Objective:** Validate file upload for strategic context
**PRD Requirement:** Document Upload

**Test Steps:**
1. In Discovery phase, locate file upload area (drag-and-drop or click to upload)
2. Upload a PDF strategic plan document (< 10MB)
3. Verify file processes successfully
4. Upload a URL to a public strategy document
5. Verify URL import completes
6. Attempt to upload invalid file types (.exe, .zip)
7. Click delete icon on an uploaded material
8. Verify deletion confirmation and removal

**Expected Results:**
- PDF uploads successfully, shows processing status
- Processing completes, status changes to "Processed"
- File details displayed (name, size, type, upload date)
- URL import validates and fetches content
- Invalid file types are rejected with clear error message
- Uploaded materials appear in "Strategic Materials" list
- Delete confirmation dialog prevents accidental deletion
- Progress checklist updates to show materials uploaded

**Success Criteria:**
- PDF processing completes in < 30 seconds
- Error messages are user-friendly
- File size limits enforced (10MB)

---

#### **Scenario 1.3: AI Research Assistant**
**Objective:** Validate AI-powered document discovery feature
**PRD Requirement:** AI Research Assistant

**Test Steps:**
1. In Discovery phase, click "AI Research Assistant" button
2. Verify modal opens with topics input and optional websites field
3. Enter topics/keywords related to your company
4. Optionally add website URLs to research
5. Click "Discover Documents"
6. Observe loading state during research
7. Verify generated documents appear in materials list

**Expected Results:**
- Modal opens with clear instructions
- Topics input accepts comma-separated keywords
- Websites field accepts multiple URLs
- Loading spinner shows during generation (30-60 seconds)
- 3-5 synthetic documents generated
- Documents appear in materials list with "AI-generated" indicator
- Documents have relevant content based on topics provided

**Success Criteria:**
- AI Research completes in < 60 seconds
- Generated documents are relevant to topics
- Documents are properly formatted and stored

---

#### **Scenario 1.4: Discovery Phase Coaching**
**Objective:** Validate AI coach provides discovery-phase guidance
**PRD Requirement:** Phase-Aware Coaching

**Test Steps:**
1. Send message: "What should I focus on first?"
2. Observe coaching response
3. Send message: "How does this coaching process work?"
4. Verify coach explains the 4-phase methodology
5. Ask about your uploaded materials
6. Verify coach references your documents

**Expected Results:**
- Coach responds with discovery-focused questions
- Asks about transformation urgency, strategic goals, pain points
- Explains Product Strategy Research methodology when asked
- References uploaded materials in coaching responses
- Tone is confident, guiding, not patronizing
- Responses are concise (2-4 paragraphs) and actionable
- Streaming messages show thinking indicator

**Success Criteria:**
- Responses generated in < 10 seconds
- Coaching feels personalized to your context
- No generic "Great question!" filler phrases

---

#### **Scenario 1.5: Discovery Phase Completion**
**Objective:** Validate phase completion requirements and transition
**PRD Requirement:** Phase Navigation

**Test Steps:**
1. Verify progress checklist shows 3 items:
   - Company Strategic Context (auto-completed from onboarding)
   - Strategic Materials (required - minimum 1 document)
   - Coaching Conversations (recommended)
2. With no materials uploaded, check for amber warning
3. Upload at least 1 material
4. Verify "Ready to Map Your Terrain" banner appears (green)
5. Click "Begin Terrain Mapping →" button
6. Verify phase transitions to Landscape (Research)

**Expected Results:**
- Progress checklist clearly shows requirements
- Amber warning when minimum requirements not met
- Green success banner when requirements met
- Clear CTA to progress to next phase
- Phase transition smooth and immediate
- Progress stepper updates to highlight "Landscape" (step 2)

**Success Criteria:**
- Requirements are enforced (minimum 1 document)
- Visual feedback is clear and encouraging
- Transition completes in < 1 second

---

### PHASE 2: LANDSCAPE (RESEARCH) PHASE TESTING

#### **Scenario 2.1: Territory Overview**
**Objective:** Validate territory cards display correctly
**PRD Requirement:** Territory Research System

**Test Steps:**
1. In Landscape phase, view the territory overview
2. Verify 3 territory cards are displayed:
   - Company Territory (indigo theme)
   - Customer Territory (cyan theme)
   - Market Context (purple theme)
3. Each card shows status badge (Unexplored/In Progress/Mapped)
4. Verify overall progress indicator at bottom

**Expected Results:**
- 3 territory cards displayed in grid layout
- Each card has distinct color theme
- Status badges show "Unexplored" initially
- Overall progress shows "0/9 areas mapped"
- Cards are clickable with hover effects
- Description text explains each territory's purpose

**Success Criteria:**
- Layout is responsive (grid adjusts to screen size)
- Visual hierarchy guides user attention
- Status badges are accurate

---

#### **Scenario 2.2: Company Territory Deep Dive**
**Objective:** Validate Company Territory research data capture
**PRD Requirement:** Territory Research System

**Test Steps:**
1. Click "Company Territory" card
2. Verify sidebar navigation appears with 3 research areas:
   - Industry Forces
   - Business Model
   - Product Capabilities
3. Click "Industry Forces" research area
4. Answer the 3 research questions:
   - "What industry trends are creating urgency for transformation?"
   - "What technology trends are shaping your industry?"
   - "What regulatory forces affect your product strategy?"
5. Click "Save Progress" to save without marking complete
6. Click "Mark as Mapped" to complete the area
7. Verify progress updates to show 1/3 areas mapped (33%)
8. Complete "Business Model" and "Product Capabilities" areas
9. Verify Company Territory shows 100% (3/3 areas mapped)
10. Click "← Back to Territories" to return to overview

**Expected Results:**
- Sidebar shows navigation with research area cards
- Research area cards show status (unexplored/in_progress/mapped)
- Question view displays all 3 questions with text areas
- "Save Progress" saves without completing area
- "Mark as Mapped" saves and marks area complete
- Progress percentage updates after each completion
- Completed areas show checkmark indicator
- Can revisit and edit previous responses
- Back button returns to territory overview

**Success Criteria:**
- Sidebar navigation is intuitive
- Data persists after page refresh
- Progress tracking is accurate

---

#### **Scenario 2.3: Customer Territory Deep Dive**
**Objective:** Validate Customer Territory research data capture
**PRD Requirement:** Territory Research System

**Test Steps:**
1. Click "Customer Territory" card
2. Verify sidebar shows 3 research areas:
   - Segments & Needs
   - Experience Gaps
   - Decision Drivers
3. Complete "Segments & Needs" area:
   - "Who are your primary customer segments?"
   - "What jobs are customers trying to accomplish?"
   - "What outcomes do customers measure success by?"
4. Complete "Experience Gaps" area:
   - "Where does your current product fall short?"
   - "What workarounds do customers use?"
   - "What causes customer churn or dissatisfaction?"
5. Complete "Decision Drivers" area:
   - "What drives customers to choose your product?"
   - "What objections do prospects raise?"
   - "What drives expansion or upsell decisions?"
6. Verify Customer Territory shows 100% completion

**Expected Results:**
- All customer research questions are customer-centric
- Questions encourage Jobs-to-be-Done thinking
- Responses saved successfully
- Progress updates correctly (33%, 67%, 100%)
- Completion triggers visual feedback (green checkmark, "Mapped" badge)

**Success Criteria:**
- Research areas align with Product Strategy Research methodology
- UX is consistent with Company Territory flow
- Data validation prevents empty submissions

---

#### **Scenario 2.4: Market Context Territory Deep Dive**
**Objective:** Validate Market Context research data capture
**PRD Requirement:** Territory Research System

**Test Steps:**
1. Click "Market Context" card
2. Verify sidebar shows 3 research areas:
   - Competitive Landscape
   - Market Dynamics
   - Emerging Threats
3. Complete all 3 research areas with relevant data
4. Verify Market Context shows 100% completion
5. Verify overall progress shows 9/9 areas mapped (100%)

**Expected Results:**
- Market Context uses purple color theme
- All research areas have relevant questions
- Data saves correctly
- Overall progress reflects all 3 territories
- "Ready for Synthesis" indicator appears

**Success Criteria:**
- All 9 research areas function correctly
- Progress tracking is accurate across all territories
- Visual feedback encourages completion

---

#### **Scenario 2.5: Landscape Phase Coaching**
**Objective:** Validate AI coach provides research-specific guidance
**PRD Requirement:** Phase-Aware Coaching

**Test Steps:**
1. With Company Territory at 33% completion, send message: "What should I focus on next?"
2. Verify coach references your completed research
3. Complete both Company and Customer territories (6 areas total)
4. Send message: "I've completed the research. What now?"
5. Verify coach suggests generating synthesis

**Expected Results:**
- Coach is aware of research progress (e.g., "You've mapped Industry Forces...")
- Suggests completing remaining research areas
- References specific insights from your research responses
- After 4+ areas mapped, suggests clicking "Generate Synthesis"
- Coaching tone celebrates progress genuinely

**Success Criteria:**
- Coach demonstrates awareness of completed research
- Suggestions are specific, not generic
- Coaching builds on previous research insights

---

#### **Scenario 2.6: Synthesis Readiness**
**Objective:** Validate synthesis requirements and UI feedback
**PRD Requirement:** Synthesis Foundation

**Test Steps:**
1. With only 2 research areas completed, attempt to generate synthesis
2. Verify error message indicates minimum 4 areas required
3. Complete 2 more areas (total 4)
4. Verify "Generate Synthesis" button is enabled
5. Observe canvas shows synthesis readiness indicator

**Expected Results:**
- Synthesis requires minimum 4 mapped research areas
- Clear error message when attempting synthesis prematurely
- Button state changes when requirement is met
- Canvas shows visual indicator of synthesis readiness
- Overall progress shows research completion status

**Success Criteria:**
- Requirements enforced at API level
- User feedback is clear and actionable
- No confusion about next steps

---

### PHASE 3: SYNTHESIS PHASE TESTING

#### **Scenario 3.1: Generate Strategic Synthesis**
**Objective:** Validate AI-powered synthesis generation
**PRD Requirement:** Synthesis Engine with PTW Framework

**Test Steps:**
1. With 4+ research areas mapped, click "Generate Synthesis" button
2. Observe loading state during generation
3. Verify synthesis generates successfully
4. Verify phase automatically transitions to Synthesis
5. Review generated synthesis content

**Expected Results:**
- Button shows loading spinner with "Generating..." text
- Button is disabled during generation
- Synthesis generation completes in < 60 seconds
- Page automatically navigates to Synthesis phase
- Progress stepper highlights "Synthesis" (step 3)
- Synthesis content is displayed in structured format including:
  - **Executive Summary** (2-3 sentences)
  - **Strategic Opportunity Map** (2x2 visual matrix)
  - **Opportunity Cards** (3-5 opportunities)
  - **Strategic Tensions** (2-3 tensions)
  - **Recommendations** (3 priority actions)

**Success Criteria:**
- Synthesis is coherent and references your research
- Insights are strategic (not superficial summaries)
- No hallucinated facts or generic advice

---

#### **Scenario 3.2: Strategic Opportunity Map (2x2 Matrix)**
**Objective:** Validate visual synthesis presentation
**PRD Requirement:** Synthesis UI Components

**Test Steps:**
1. In Synthesis phase, locate the Strategic Opportunity Map
2. Verify 4 quadrants are displayed:
   - INVEST (top-right: high market attractiveness, high capability fit)
   - EXPLORE (top-left: high market attractiveness, low capability fit)
   - HARVEST (bottom-right: low market attractiveness, high capability fit)
   - DIVEST (bottom-left: low market attractiveness, low capability fit)
3. Verify opportunities are plotted as dots on the matrix
4. Hover over dots to see opportunity name
5. Click dot to navigate to opportunity card

**Expected Results:**
- 2x2 matrix displays correctly with labeled quadrants
- Opportunities positioned based on scores (1-10)
- Hover tooltip shows opportunity title
- Clicking scrolls to corresponding OpportunityCard
- Visual design uses phase-appropriate colors (purple theme)

**Success Criteria:**
- Matrix is readable and informative
- Interaction is smooth and intuitive
- Positions accurately reflect scoring

---

#### **Scenario 3.3: Opportunity Cards**
**Objective:** Validate opportunity detail display
**PRD Requirement:** Synthesis UI Components

**Test Steps:**
1. Locate opportunity cards below the map
2. Verify each card displays:
   - Opportunity title
   - Opportunity type badge (where_to_play, how_to_win, capability_gap)
   - Quadrant badge (INVEST, EXPLORE, HARVEST, DIVEST)
   - Score indicators (Market, Capability, Competitive)
   - Description
3. Click to expand an opportunity card
4. Verify expanded view shows:
   - PTW Details (Winning Aspiration, Where to Play, How to Win, Capabilities, Systems)
   - Evidence Trail (quotes from research with territory attribution)
   - WWHBT Assumptions (testable hypotheses)

**Expected Results:**
- 3-5 opportunity cards displayed
- Cards show clear type and quadrant badges
- Score bars visualize 1-10 scores
- Expanded view shows full PTW framework
- Evidence links to source research with territory color coding
- Assumptions include test methods and risk if false

**Success Criteria:**
- PTW framework alignment is visible
- Evidence is traceable to research
- Assumptions are testable

---

#### **Scenario 3.4: Strategic Tensions**
**Objective:** Validate tension display
**PRD Requirement:** Synthesis UI Components

**Test Steps:**
1. Locate Strategic Tensions section
2. Verify each tension shows:
   - Tension description
   - Impact indicator (blocking/significant/minor)
   - Aligned evidence (supporting one side)
   - Conflicting evidence (supporting opposite)
   - Resolution options with trade-offs
3. Verify recommended resolution is highlighted

**Expected Results:**
- 2-3 tensions displayed
- Impact uses color coding (red=blocking, amber=significant, slate=minor)
- Evidence is shown side-by-side
- Resolution options include trade-offs
- Recommended option is visually highlighted

**Success Criteria:**
- Tensions reflect real conflicts in research
- Resolution options are actionable
- Impact levels are appropriate

---

#### **Scenario 3.5: Synthesis Phase Coaching**
**Objective:** Validate synthesis-phase coaching awareness
**PRD Requirement:** Phase-Aware Coaching

**Test Steps:**
1. In Synthesis phase, send message: "What do you think about the synthesis?"
2. Verify coach references specific synthesis findings
3. Ask: "Which opportunity should I prioritize?"
4. Verify coach helps you evaluate options
5. Ask: "Can you help me formulate a Strategic Bet?"
6. Verify coach guides you through Strategic Bets format

**Expected Results:**
- Coach has access to generated synthesis
- References specific opportunities, tensions, recommendations
- Asks probing questions to deepen understanding
- Helps prioritize based on impact and feasibility
- Teaches Strategic Bets format:
  - "We believe [trend/need]"
  - "Which means [opportunity]"
  - "So we will explore [hypothesis]"
  - "Success looks like [metric]"
- Challenges vague thinking constructively

**Success Criteria:**
- Coach demonstrates synthesis awareness
- Coaching goes beyond summarizing to challenging thinking
- Strategic Bets format is explained clearly

---

### PHASE 4: STRATEGIC BETS TESTING

#### **Scenario 4.1: Navigate to Strategic Bets Phase**
**Objective:** Validate progression to final phase
**PRD Requirement:** Phase Navigation

**Test Steps:**
1. In Synthesis phase, click "Next Phase" test button (or natural progression)
2. Verify phase transitions to Strategic Bets
3. Confirm progress stepper highlights "Strategic Bets" (step 4)
4. Verify canvas shows Strategic Bets section

**Expected Results:**
- Phase transition completes smoothly
- Progress stepper shows step 4 highlighted (cyan theme)
- Canvas displays "Strategic Bets Phase" content
- Content shows framework for bet creation (placeholder for MVP)

**Success Criteria:**
- Navigation works as expected
- Placeholder content is clear about post-MVP features

---

#### **Scenario 4.2: Strategic Bets Coaching**
**Objective:** Validate bets-phase coaching guidance
**PRD Requirement:** Phase-Aware Coaching

**Test Steps:**
1. In Bets phase, send message: "Help me refine my Strategic Bet"
2. Share a draft bet: "We believe customers want faster delivery. So we will explore same-day shipping. Success looks like increased sales."
3. Verify coach challenges the bet to be more specific
4. Follow coach's guidance to improve the bet
5. Verify coach ensures bet follows proper format

**Expected Results:**
- Coach recognizes you're in Strategic Bets phase
- Challenges vague bets ("faster delivery" → what specifically?)
- Ensures proper format is followed
- Pushes for leading indicators (not lagging metrics like "sales")
- Asks about what would invalidate the bet (testability)
- Helps prioritize bets based on impact and feasibility

**Success Criteria:**
- Coach acts as critical thinking partner
- Guidance improves bet quality
- Format is reinforced consistently

---

### CROSS-PHASE TESTING

#### **Scenario 5.1: Conversation Persistence**
**Objective:** Validate conversation state persists across sessions

**Test Steps:**
1. Complete research in Company Territory
2. Refresh the browser page
3. Verify research progress is maintained
4. Send a message to the coach
5. Refresh the page again
6. Verify message history is preserved
7. Log out and log back in
8. Navigate to the same conversation
9. Verify all data persists (phase, research, messages)

**Expected Results:**
- All conversation data persists after refresh
- Current phase is maintained
- Research progress is accurate
- Message history is complete
- Conversation accessible after re-authentication

**Success Criteria:**
- Zero data loss on refresh
- Session continuity maintained

---

#### **Scenario 5.2: Multiple Conversations**
**Objective:** Validate ability to manage multiple strategy sessions

**Test Steps:**
1. Create Conversation A for "Product Strategy 2026"
2. Complete Discovery phase
3. Create Conversation B for "Market Expansion Strategy"
4. Progress Conversation B to Landscape phase
5. Switch back to Conversation A
6. Verify Conversation A is still in Discovery phase
7. Verify coaching context is specific to Conversation A
8. Switch to Conversation B
9. Verify Landscape phase and different context

**Expected Results:**
- Can create multiple conversations
- Each conversation maintains independent state
- Conversation list shows all conversations
- Clicking conversation loads correct phase and context
- Coach context switches appropriately
- No data leakage between conversations

**Success Criteria:**
- Conversation isolation is maintained
- Context switching is seamless

---

### USER EXPERIENCE TESTING

#### **Scenario 6.1: Progress Visualization**
**Objective:** Validate progress stepper provides clear feedback

**Test Steps:**
1. Start in Discovery phase
2. Observe horizontal progress stepper at top
3. Verify Discovery is highlighted with phase color (emerald)
4. Verify other phases are visible but not active
5. Progress through Landscape, Synthesis, Bets phases
6. Verify stepper updates at each transition
7. Verify completed phases show checkmark icon

**Expected Results:**
- 4-step horizontal stepper visible on all phases
- Current phase highlighted with gradient
- "You Are Here" indicator with animated pulse
- Completed phases show checkmark instead of number
- Future phases appear grayed out
- Phase labels: "Discovery", "Landscape", "Synthesis", "Strategic Bets"
- Sublabels: "Context Setting", "Terrain Mapping", "Strategy Formation", "Route Planning"
- Phase colors: Emerald → Amber → Purple → Cyan

**Success Criteria:**
- Progress is always clear
- User never wonders "where am I?"
- Visual hierarchy guides attention

---

#### **Scenario 6.2: Responsive Design**
**Objective:** Validate UI works on different screen sizes

**Test Steps:**
1. Access application on desktop (1920x1080)
2. Verify layout uses full screen effectively
3. Resize browser to tablet size (768px width)
4. Verify layout adapts without breaking
5. Resize to mobile size (375px width)
6. Verify mobile layout is usable (note: mobile optimization is post-MVP)

**Expected Results:**
- Desktop: Two-column layout (coaching panel + canvas)
- Tablet: Layout remains functional
- Mobile: May have limitations (acceptable for MVP)
- No horizontal scrolling required
- Text remains readable at all sizes
- Buttons remain accessible

**Success Criteria:**
- Primary use case (desktop) is optimized
- Tablet experience is acceptable
- Mobile limitations are documented

---

#### **Scenario 6.3: Error Handling**
**Objective:** Validate error states are handled gracefully

**Test Steps:**
1. Attempt to send empty message to coach
2. Verify validation prevents submission
3. Disconnect internet, attempt to send message
4. Verify network error is shown
5. Reconnect and retry
6. Attempt to upload 50MB file (exceeds limit)
7. Verify file size error message
8. In Research area, attempt to save without answering questions
9. Verify validation feedback

**Expected Results:**
- Empty message input is prevented
- Network errors show user-friendly message
- File size limits enforced with clear error
- Form validation provides inline feedback
- Error messages suggest corrective action
- No technical error messages exposed to user
- Errors are logged to console for debugging

**Success Criteria:**
- Users understand what went wrong
- Errors don't block progress permanently
- System recovers gracefully

---

#### **Scenario 6.4: Performance Testing**
**Objective:** Validate application performance meets expectations

**Test Steps:**
1. Measure page load time on initial visit
2. Measure time to render conversation
3. Measure time for coach to respond to message
4. Measure time to generate synthesis
5. Navigate between phases and measure transition time
6. Open DevTools → Network tab, verify no unnecessary API calls

**Expected Results:**
- Initial page load < 3 seconds
- Conversation loads < 1 second
- Coach responses stream in < 10 seconds
- Synthesis generation < 60 seconds
- Phase transitions < 1 second
- No duplicate API requests
- Images and assets load efficiently

**Success Criteria:**
- Application feels responsive
- No noticeable lag or delays
- Streaming responses feel "live"

---

### SECURITY & DATA TESTING

#### **Scenario 7.1: Authentication & Authorization**
**Objective:** Validate proper access controls

**Test Steps:**
1. Attempt to access `/dashboard/product-strategy-agent` without logging in
2. Verify redirect to sign-in page
3. Log in with valid credentials
4. Verify access granted
5. Log out
6. Attempt to access API route directly (e.g., `/api/conversations`)
7. Verify 401 Unauthorized response

**Expected Results:**
- Unauthenticated users redirected to sign-in
- Clerk authentication required for all dashboard routes
- API routes protected with auth checks
- Users can only access their own organization's data
- No data leakage between organizations

**Success Criteria:**
- Zero authentication bypasses
- Authorization enforced consistently

---

#### **Scenario 7.2: Data Privacy**
**Objective:** Validate user data is isolated and secure

**Test Steps:**
1. Create conversation in Organization A
2. Add sensitive research data
3. Log out and log in as user from Organization B
4. Attempt to access Organization A's conversation
5. Verify access is denied
6. Search for Organization A's research data in Organization B's conversations
7. Verify no cross-contamination

**Expected Results:**
- Organizations are completely isolated
- Cannot access other organizations' conversations
- Cannot view other organizations' research data
- Supabase RLS policies enforce data isolation
- No data visible in browser DevTools from other orgs

**Success Criteria:**
- Multi-tenancy is secure
- Data privacy is enforced at database level

---

## Success Criteria

### PHASE 1: DISCOVERY
- [ ] Users can create new conversations in < 2 seconds
- [ ] Opening message is personalized and contextually relevant
- [ ] File upload supports PDF, DOCX, TXT, and URLs
- [ ] Upload processing completes in < 30 seconds
- [ ] AI Research Assistant generates relevant documents
- [ ] Coach provides discovery-focused guidance
- [ ] Progress checklist shows clear requirements (minimum 1 document)
- [ ] Phase transition to Landscape works correctly

### PHASE 2: LANDSCAPE (RESEARCH)
- [ ] All 9 research areas function correctly (3 per territory)
- [ ] Company Territory: Industry Forces, Business Model, Product Capabilities
- [ ] Customer Territory: Segments & Needs, Experience Gaps, Decision Drivers
- [ ] Market Context: Competitive Landscape, Market Dynamics, Emerging Threats
- [ ] Deep-dive sidebar navigation works correctly
- [ ] Progress tracking updates accurately after each area
- [ ] Research data persists across sessions
- [ ] Coach is aware of completed research areas
- [ ] Minimum 4 areas required for synthesis (enforced)

### PHASE 3: SYNTHESIS
- [ ] Synthesis generates in < 60 seconds
- [ ] Executive summary is concise and strategic
- [ ] Strategic Opportunity Map (2x2) displays correctly
- [ ] 3-5 opportunity cards with PTW framework details
- [ ] Opportunity scoring (Market, Capability, Competitive) displayed
- [ ] Evidence trails link to source research
- [ ] 2-3 strategic tensions with resolution options
- [ ] 3 priority recommendations displayed
- [ ] Coach demonstrates awareness of synthesis content
- [ ] No hallucinated facts or generic advice

### PHASE 4: STRATEGIC BETS
- [ ] Phase navigation to Bets works correctly
- [ ] Coach provides Bets-phase guidance
- [ ] Strategic Bets format is taught and reinforced
- [ ] Placeholder content is clear about post-MVP features

### CROSS-CUTTING CONCERNS
- [ ] All conversation data persists across sessions and logins
- [ ] Multiple conversations maintain independent state
- [ ] Progress stepper provides clear visual feedback (4 phases, phase colors)
- [ ] Error messages are user-friendly and actionable
- [ ] Application performance meets targets (page load < 3s, responses < 10s)
- [ ] Authentication and authorization work correctly
- [ ] No data leakage between organizations

---

## Bug Reporting Template

When you encounter an issue during UAT, please document it using this template:

```markdown
### Bug Report #[NUMBER]

**Severity:** [Critical / High / Medium / Low]
**Phase:** [Discovery / Landscape / Synthesis / Bets / Cross-Phase]

**Summary:**
[One-sentence description of the issue]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [etc.]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[Attach screenshots if applicable]

**Browser Console Errors:**
[Copy any errors from browser console]

**Environment:**
- Browser: [Chrome 120 / Firefox 121 / Safari 17]
- OS: [Windows 11 / macOS 14 / Linux]
- Screen Size: [1920x1080 / 1366x768 / etc.]

**Impact:**
[How does this affect the user experience?]

**Suggested Fix:**
[Optional - your thoughts on how to fix]
```

---

## Testing Schedule

### Day 1-2: Discovery Phase Testing
- Scenarios 1.1 - 1.5
- AI Research Assistant validation

### Day 3-4: Landscape Phase Testing
- Scenarios 2.1 - 2.6
- All 3 territories, all 9 research areas

### Day 5: Synthesis Phase Testing
- Scenarios 3.1 - 3.5
- Strategic Opportunity Map validation
- PTW framework alignment check

### Day 6: Strategic Bets & Cross-Phase Testing
- Scenarios 4.1 - 4.2
- Scenarios 5.1 - 5.2

### Day 7: UX & Security Testing
- Scenarios 6.1 - 6.4
- Scenarios 7.1 - 7.2
- Regression testing

---

## Sign-Off

### Tester Sign-Off
**Name:** ___________________________
**Date:** ___________________________
**Scenarios Passed:** _____ / 28
**Critical Bugs Found:** _____
**Overall Assessment:** [ Pass / Fail / Pass with Minor Issues ]

**Comments:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

### Product Owner Sign-Off
**Name:** ___________________________
**Date:** ___________________________
**Approved for Production:** [ Yes / No ]

**Conditions for Approval:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 12, 2026 | Initial UAT Test Pack |
| 2.0 | Jan 25, 2026 | Updated for current implementation: 3-territory system (9 areas), deep-dive sidebar navigation, PTW synthesis with opportunities/tensions, phase terminology ("Landscape"), AI Research Assistant |

---

**End of UAT Test Pack**
