# Product Strategy Coach
# User Testing Proposal for Pilot Validation

**Version:** 1.0
**Date:** February 2026
**Author:** Frontera Product Team
**Status:** Draft for Review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Testing Objectives](#2-testing-objectives)
3. [Product Overview](#3-product-overview)
4. [Testing Framework](#4-testing-framework)
5. [Maze Test Specifications](#5-maze-test-specifications)
6. [Moderated Session Protocol](#6-moderated-session-protocol)
7. [Question Bank](#7-question-bank)
8. [Expert Review Framework](#8-expert-review-framework)
9. [Participant Recruitment](#9-participant-recruitment)
10. [Test Plan Timeline](#10-test-plan-timeline)
11. [Success Metrics](#11-success-metrics)
12. [Budget Estimate](#12-budget-estimate)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

### Purpose

This proposal outlines a comprehensive user testing strategy for the Product Strategy Coach pilot. The testing programme is designed to validate three critical dimensions:

1. **Experience & Usability** - Can users navigate the interface effectively?
2. **Journey Completion** - Do users progress through all methodology phases?
3. **Coaching Quality & Outputs** - Is the AI coaching valuable? Are strategic outputs actionable?

### Recommended Approach

A **hybrid testing methodology** combining:

- **Maze Platform** for modular, unmoderated usability testing
- **Moderated Think-Aloud Sessions** for full journey evaluation
- **Expert Panel Review** for coaching and output quality assessment

### Key Outcomes

- Identify and prioritise usability friction points
- Validate the coaching methodology resonates with target users
- Assess the perceived value of AI-generated strategic outputs
- Gather actionable insights for pre-launch iteration

---

## 2. Testing Objectives

### Primary Objectives

| Objective | Success Criteria | Measurement Method |
|-----------|------------------|-------------------|
| Validate navigation clarity | >85% task success rate | Maze mission completion |
| Confirm methodology comprehension | >80% understand phase progression | Post-test survey |
| Assess coach interaction value | Trust score >4.0/5.0 | Session interviews |
| Evaluate synthesis output quality | Actionability score >4.0/5.0 | Expert panel review |
| Identify critical friction points | <3 blocking issues | Session observation |

### Secondary Objectives

- Understand mental models users bring to strategy development
- Identify terminology or concepts that cause confusion
- Discover unmet needs not addressed by current design
- Gather feature requests and enhancement ideas
- Validate target persona fit and refine ICP

### Research Questions

**Experience & Usability:**
- How intuitive is the two-panel layout (coach + canvas)?
- Do users understand the relationship between chat coaching and canvas activities?
- Can users locate key actions (upload materials, explore territories, generate synthesis)?
- Is the progress stepper effective at communicating journey state?

**Journey & Methodology:**
- Do users understand the 4-phase methodology without explanation?
- What triggers users to progress from one phase to the next?
- Where do users abandon or express frustration?
- Is the "terrain mapping" metaphor meaningful?

**Coaching Quality:**
- Do users perceive the coach as helpful vs. intrusive?
- Is the coaching personalised enough to feel relevant?
- Do users trust AI-generated strategic guidance?
- What coaching behaviours increase or decrease trust?

**Output Value:**
- Are synthesis outputs immediately understandable?
- Would users share these outputs with stakeholders?
- Do outputs feel generic or specifically tailored?
- What additional outputs would users want?

---

## 3. Product Overview

### Product Description

The Product Strategy Coach is an AI-powered strategic coaching platform that guides enterprise leaders through a structured methodology to develop product transformation strategies. The experience combines:

- **Persistent AI Coach Sidebar** for contextual guidance and Q&A
- **Scrollable Canvas** with phased, card-based workflow
- **Progressive Disclosure** through "terrain mapping" that unlocks as users complete phases
- **Document Upload** to ground strategy in real source materials

### Methodology Phases

| Phase | Name | Purpose | Key Activities |
|-------|------|---------|----------------|
| 1 | Discovery | Context Setting | Upload materials, establish strategic baseline |
| 2 | Research | Terrain Mapping | Explore Company, Customer, Competitor territories |
| 3 | Synthesis | Strategy Formation | Review AI-generated opportunities and insights |
| 4 | Strategic Bets | Route Planning | Define hypothesis-driven strategic bets |

### Key User Interface Components

**Coach Sidebar (Left Panel - 25% width):**
- Session information and phase indicator
- Streaming AI coach conversation
- Context-aware proactive prompts
- Message input with smart suggestions

**Canvas Panel (Right Panel - 75% width):**
- Horizontal progress stepper (4 phases)
- Phase-specific content sections
- Territory cards with status indicators
- Synthesis outputs and strategic opportunity map

### Target Users

**Primary Persona: Strategic Product Leader**
- VP Product, Head of Strategy, Product Director
- Enterprise (500+ employees) or funded scale-up
- Currently leading or planning product transformation
- 5+ years experience in product/strategy roles

---

## 4. Testing Framework

### Testing Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TESTING FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  LAYER 1: MODULAR USABILITY (Maze)                                  │
│  ─────────────────────────────────                                  │
│  • 6 focused tests, 5-10 minutes each                               │
│  • Unmoderated, scalable recruitment                                │
│  • Click tracking, heatmaps, task success metrics                   │
│  • Quantitative data with qualitative follow-up                     │
│                                                                      │
│  LAYER 2: FULL JOURNEY (Moderated Sessions)                         │
│  ─────────────────────────────────────────                          │
│  • 45-60 minute think-aloud sessions                                │
│  • Real context (user's actual company)                             │
│  • Deep observation of coaching interaction                         │
│  • Rich qualitative insights                                        │
│                                                                      │
│  LAYER 3: OUTPUT QUALITY (Expert Review)                            │
│  ───────────────────────────────────────                            │
│  • Panel of 3-5 strategy experts                                    │
│  • Blind review of synthesis outputs                                │
│  • Structured scoring rubric                                        │
│  • Comparative assessment                                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Why This Hybrid Approach?

| Testing Need | Maze Fit | Moderated Fit | Expert Review Fit |
|--------------|----------|---------------|-------------------|
| First-click accuracy | ✅ Excellent | ⚠️ Overkill | ❌ N/A |
| Task completion rates | ✅ Excellent | ✅ Good | ❌ N/A |
| Navigation patterns | ✅ Excellent | ✅ Good | ❌ N/A |
| Emotional response | ⚠️ Limited | ✅ Excellent | ❌ N/A |
| Trust assessment | ⚠️ Limited | ✅ Excellent | ⚠️ Limited |
| Coaching quality | ❌ Poor | ✅ Excellent | ✅ Excellent |
| Output actionability | ⚠️ Limited | ✅ Good | ✅ Excellent |
| Long-form journey | ❌ Poor | ✅ Excellent | ❌ N/A |
| Scale (many users) | ✅ Excellent | ❌ Poor | ❌ N/A |

---

## 5. Maze Test Specifications

### Test Overview

| Test # | Name | Focus Area | Duration | Participants |
|--------|------|------------|----------|--------------|
| 1 | First Impressions | Overall comprehension | 5 min | 15-20 |
| 2 | Discovery Phase | Context setting UX | 8 min | 15-20 |
| 3 | Coach Interaction | AI coaching perception | 6 min | 15-20 |
| 4 | Territory Navigation | Research phase UX | 8 min | 15-20 |
| 5 | Synthesis Review | Output comprehension | 7 min | 15-20 |
| 6 | End-to-End Prototype | Full flow (abbreviated) | 12 min | 10-15 |

---

### Test 1: First Impressions

**Objective:** Assess initial comprehension and emotional response to the interface

**Test Type:** Opinion Test + First-Click Test

**Setup:**
- Show full interface screenshot (coach sidebar + canvas with Discovery phase visible)
- No prior context about the product

#### Block 1: Initial Reaction (30 seconds)

**Screen:** Full interface view

**Question 1.1 - 5-Second Test**
> Look at this screen for 5 seconds. What do you think this product does?

*Type: Open text*
*Purpose: Capture first impressions before cognitive processing*

**Question 1.2 - Emotional Response**
> What's your immediate reaction to this interface?

*Type: Multiple choice (single select)*
- Excited - I want to explore this
- Curious - I'd like to learn more
- Neutral - No strong feeling
- Confused - I'm not sure what I'm looking at
- Overwhelmed - This looks complex

**Question 1.3 - Comprehension Check**
> Based on what you see, what is the main purpose of this tool?

*Type: Multiple choice (single select)*
- A project management dashboard
- An AI-powered strategy coaching tool
- A document collaboration platform
- A customer analytics system
- I'm not sure

#### Block 2: Layout Understanding (60 seconds)

**Question 1.4 - Component Identification**
> What do you think the left sidebar is for?

*Type: Open text*
*Purpose: Validate coach sidebar mental model*

**Question 1.5 - First-Click Test**
> If you wanted to start working on your strategy, where would you click first?

*Type: First-click (heatmap capture)*
*Success zone: Discovery section, coach input, or upload materials button*

**Question 1.6 - Progress Understanding**
> Looking at the top of the main panel, what do the circles represent?

*Type: Multiple choice (single select)*
- Steps in a process I need to complete
- Different features I can access
- My team members
- Notification indicators
- Not sure

#### Block 3: Value Proposition (45 seconds)

**Question 1.7 - Value Clarity**
> How clear is it what value this tool would provide to you?

*Type: Linear scale 1-5*
- 1 = Not at all clear
- 5 = Extremely clear

**Question 1.8 - Relevance**
> How relevant does this tool seem for your work?

*Type: Linear scale 1-5*
- 1 = Not relevant at all
- 5 = Highly relevant

**Question 1.9 - Open Feedback**
> What questions do you have about this interface?

*Type: Open text*

---

### Test 2: Discovery Phase Deep Dive

**Objective:** Validate Discovery phase usability and task completion

**Test Type:** Mission + Survey

**Setup:**
- Interactive Figma prototype of Discovery phase
- Participant given scenario context

#### Scenario Introduction

*Screen: Context card*

> **Scenario:** You're the VP of Product at a mid-sized fintech company. Your CEO has asked you to develop a product strategy for the next 18 months. You've decided to use this AI coaching tool to help structure your thinking.
>
> You've just logged in for the first time.

#### Mission 1: Locate Upload Function

**Task:** Find where you would upload your company's strategic documents.

*Type: Mission with click tracking*
*Success criteria: Click on "Upload Files" button or drag-drop zone*
*Time limit: 30 seconds*

**Follow-up Question 2.1**
> How easy was it to find the upload function?

*Type: Linear scale 1-5*
- 1 = Very difficult
- 5 = Very easy

#### Mission 2: Understand Context Requirements

**Task:** What information does the tool need from you to get started?

*Type: Open text response after viewing Discovery section*

**Follow-up Question 2.2**
> Is it clear what materials you should upload?

*Type: Linear scale 1-5*
- 1 = Not at all clear
- 5 = Completely clear

**Follow-up Question 2.3**
> What documents would you upload if using this for your company?

*Type: Multiple choice (multi-select)*
- Annual report / financial statements
- Strategic plan / roadmap
- Market research reports
- Competitor analysis
- Customer feedback / NPS data
- Product specs / PRDs
- Board presentations
- I wouldn't know what to upload
- Other (please specify)

#### Mission 3: Interact with Coach

**Task:** The AI coach has asked you a question. Respond to it.

*Type: Mission with interaction tracking*
*Show: Coach message asking "What competitive dynamics are making product transformation urgent for your company?"*
*Success criteria: Click on input field or type response*

**Follow-up Question 2.4**
> How would you describe the tone of the AI coach?

*Type: Multiple choice (single select)*
- Professional and authoritative
- Friendly and supportive
- Neutral and factual
- Pushy or demanding
- Robotic and impersonal

**Follow-up Question 2.5**
> Is this question relevant to your situation?

*Type: Linear scale 1-5*
- 1 = Not relevant
- 5 = Highly relevant

#### Mission 4: Understand Progress Requirements

**Task:** What do you need to do to proceed to the next phase?

*Type: Open text*
*Purpose: Validate progress indicator comprehension*

**Follow-up Question 2.6**
> How clear are the requirements to move to the next phase?

*Type: Linear scale 1-5*

#### Block: Discovery Summary Questions

**Question 2.7 - Satisfaction**
> Overall, how satisfied are you with the Discovery phase experience?

*Type: Linear scale 1-5*
- 1 = Very dissatisfied
- 5 = Very satisfied

**Question 2.8 - Friction Points**
> What, if anything, was confusing or frustrating about this phase?

*Type: Open text*

**Question 2.9 - Missing Elements**
> What additional guidance or features would help you in this phase?

*Type: Open text*

---

### Test 3: Coach Interaction Evaluation

**Objective:** Assess perceptions of AI coaching quality and trust

**Test Type:** Video Walkthrough + Opinion Survey

**Setup:**
- 60-second video showing a realistic coach interaction
- Multiple coaching scenarios to evaluate

#### Block 1: Video Observation

*Show: Screen recording of coach interaction including:*
- User asking a question about competitive positioning
- Coach providing contextual response with follow-up question
- User responding
- Coach synthesising and providing insight

**Question 3.1 - Helpfulness**
> How helpful was the coach's response?

*Type: Linear scale 1-5*
- 1 = Not helpful at all
- 5 = Extremely helpful

**Question 3.2 - Relevance**
> How relevant was the coach's guidance to the user's question?

*Type: Linear scale 1-5*

**Question 3.3 - Interaction Style**
> How would you describe the interaction between the user and the coach?

*Type: Multiple choice (single select)*
- Like talking to a knowledgeable consultant
- Like using a sophisticated chatbot
- Like following a guided tutorial
- Like having a conversation with a colleague
- Like receiving automated suggestions

#### Block 2: Coaching Scenarios

*Present 3 different coach response examples*

**Scenario A: Proactive Insight**
> Coach message: "I notice you mentioned 'integration depth' as a customer priority, but your competitor analysis suggests most alternatives struggle with this. This could be a significant 'How to Win' opportunity. Would you like to explore what capabilities you'd need to excel here?"

**Question 3.4 - Value of Proactive Coaching**
> How valuable is it for the coach to proactively identify connections like this?

*Type: Linear scale 1-5*

**Question 3.5 - Trust in Insight**
> How much would you trust this type of insight from an AI coach?

*Type: Linear scale 1-5*
- 1 = Not at all
- 5 = Completely

**Scenario B: Challenge Response**
> Coach message: "You mentioned that 'price is not a key differentiator' for your customers. However, your earlier notes indicated several lost deals due to pricing. Can you help me understand this apparent tension?"

**Question 3.6 - Comfort with Challenges**
> How comfortable are you with the coach challenging your assumptions?

*Type: Linear scale 1-5*

**Question 3.7 - Challenge Perception**
> This type of challenge feels:

*Type: Multiple choice (single select)*
- Helpful - it makes me think more deeply
- Neutral - neither good nor bad
- Uncomfortable - I don't like being challenged by AI
- Annoying - the AI doesn't understand my context

**Scenario C: Synthesis Summary**
> Coach message: "Based on our conversation, I'm seeing three potential strategic directions emerging: (1) Double down on enterprise integration, (2) Expand into mid-market with simplified offering, (3) Build vertical-specific solutions. Which resonates most with your intuition?"

**Question 3.8 - Synthesis Quality**
> How well does this summary capture the kind of output you'd want from a strategy session?

*Type: Linear scale 1-5*

#### Block 3: Overall Coach Assessment

**Question 3.9 - Trust Comparison**
> Compared to a human strategy consultant, how much would you trust this AI coach?

*Type: Linear scale 1-7*
- 1 = Much less trust than a human
- 4 = About the same
- 7 = Much more trust than a human

**Question 3.10 - Ideal Coach Behaviour**
> What behaviours would make you trust the AI coach more?

*Type: Multiple choice (multi-select)*
- Showing its reasoning/sources
- Asking clarifying questions before advising
- Admitting when it doesn't know something
- Providing options rather than single recommendations
- Referencing industry benchmarks or data
- Remembering context from earlier in the session
- Other (please specify)

**Question 3.11 - Open Feedback**
> What would make the AI coaching experience more valuable for you?

*Type: Open text*

---

### Test 4: Territory Navigation (Research Phase)

**Objective:** Validate Research phase navigation and territory exploration UX

**Test Type:** Mission + Heatmap + Survey

**Setup:**
- Interactive prototype of Research phase
- Three territory cards visible (Company, Customer, Competitor)

#### Scenario Introduction

> You've completed the Discovery phase and uploaded your strategic documents. The tool is now asking you to "Map Your Strategic Terrain" by exploring three territories: Company, Customer, and Competitor.

#### Mission 1: Territory Selection

**Task:** You want to start by understanding your customers better. Where would you click?

*Type: First-click test*
*Success zone: Customer territory card*
*Capture: Heatmap of all clicks*

**Question 4.1 - Clarity**
> How clear was it which card to select?

*Type: Linear scale 1-5*

#### Mission 2: Navigate Territory Deep Dive

**Task:** You've clicked on Customer territory. Now find where you would answer questions about customer segments.

*Type: Mission in prototype*
*Success criteria: Navigate to "Segments & Needs" research area*

**Question 4.2 - Navigation Ease**
> How easy was it to find the right section?

*Type: Linear scale 1-5*

#### Mission 3: Complete Research Input

**Task:** Answer the research questions you see for this area.

*Type: Observe interaction with research question inputs*

**Question 4.3 - Question Clarity**
> How clear were the research questions?

*Type: Linear scale 1-5*

**Question 4.4 - Question Relevance**
> How relevant were these questions to developing a product strategy?

*Type: Linear scale 1-5*

**Question 4.5 - Input Format**
> The text input format for answering questions is:

*Type: Multiple choice (single select)*
- Perfect - text input works well
- Acceptable - but I'd prefer other options (e.g., bullets, voice)
- Frustrating - I want a different input method
- Other (please specify)

#### Mission 4: Track Progress

**Task:** How would you know how much of the research phase you've completed?

*Type: Open text*

**Question 4.6 - Progress Visibility**
> How visible is your progress through the research phase?

*Type: Linear scale 1-5*

#### Block: Territory Card Comprehension

**Question 4.7 - Metaphor Understanding**
> The tool uses a "terrain mapping" metaphor with "territories" to explore. How intuitive is this metaphor?

*Type: Linear scale 1-5*
- 1 = Very confusing
- 5 = Very intuitive

**Question 4.8 - Territory Naming**
> The three territories are Company, Customer, and Competitor (the "3Cs"). Are these categories:

*Type: Multiple choice (single select)*
- Exactly right - these are the key areas to explore
- Mostly right - but I'd add or change something
- Somewhat relevant - but missing important areas
- Not how I think about strategy

**Question 4.9 - Missing Categories**
> What other "territories" or areas would you want to explore for product strategy?

*Type: Open text*

#### Block: Research Phase Summary

**Question 4.10 - Overall Experience**
> How would you rate the overall Research phase experience?

*Type: Linear scale 1-5*

**Question 4.11 - Time Expectation**
> How long do you think it would take to complete all three territories?

*Type: Multiple choice (single select)*
- Less than 30 minutes
- 30-60 minutes
- 1-2 hours
- More than 2 hours
- Depends on how much I already know

**Question 4.12 - Willingness to Complete**
> How likely are you to complete all research territories before moving to the next phase?

*Type: Linear scale 1-5*
- 1 = Very unlikely
- 5 = Very likely

**Question 4.13 - Open Feedback**
> What would make the research phase more engaging or easier to complete?

*Type: Open text*

---

### Test 5: Synthesis Output Review

**Objective:** Assess comprehension and perceived value of synthesis outputs

**Test Type:** Comprehension Test + Opinion Survey

**Setup:**
- Static screens showing synthesis outputs
- Strategic Opportunity Map (2x2 matrix)
- Sample opportunity cards with evidence

#### Block 1: Strategic Opportunity Map

*Show: Full 2x2 matrix with 4 plotted opportunities*

**Question 5.1 - 5-Second Comprehension**
> Look at this visualisation for 5 seconds. What does it show?

*Type: Open text*

**Question 5.2 - Quadrant Understanding**
> What does an opportunity in the top-right quadrant (INVEST) mean?

*Type: Multiple choice (single select)*
- High priority - execute immediately
- Interesting but needs more research
- Low priority - deprioritise
- I'm not sure

**Question 5.3 - Visualisation Usefulness**
> How useful is this visualisation for strategic decision-making?

*Type: Linear scale 1-5*

**Question 5.4 - Visualisation Clarity**
> How clear is the meaning of each quadrant?

*Type: Linear scale 1-5*

#### Block 2: Opportunity Card Review

*Show: Detailed opportunity card including:*
- Title: "Enterprise Integration Platform"
- Scores: Market Attractiveness 8/10, Capability Fit 7/10
- Where to Play: "Mid-market consolidators (£5-50bn AUM)"
- How to Win: "Deep platform integration + compliance automation"
- Evidence: 3 linked sources from research
- Assumptions: "What Would Have to Be True"

**Question 5.5 - Card Comprehension**
> Based on this card, what strategic action is being recommended?

*Type: Open text*

**Question 5.6 - Evidence Trail**
> The card shows "Evidence" linking back to your research. How valuable is this feature?

*Type: Linear scale 1-5*
- 1 = Not valuable
- 5 = Extremely valuable

**Question 5.7 - Assumption Clarity**
> The "What Would Have to Be True" section lists assumptions. How useful is this for validating the strategy?

*Type: Linear scale 1-5*

**Question 5.8 - Actionability**
> Could you take action on this strategic opportunity based on the information provided?

*Type: Multiple choice (single select)*
- Yes, I have enough information to act
- Partially, but I need more detail on some areas
- No, I need significantly more information
- I'm not sure what action to take

**Question 5.9 - Missing Information**
> What additional information would you need to act on this opportunity?

*Type: Open text*

#### Block 3: Output Quality Assessment

**Question 5.10 - Personalisation**
> Based on what you see, does this output feel:

*Type: Multiple choice (single select)*
- Highly personalised to the user's specific context
- Somewhat personalised with some generic elements
- Mostly generic advice that could apply to anyone
- Unable to tell from this example

**Question 5.11 - Stakeholder Shareability**
> Would you share this synthesis output with your executive team?

*Type: Linear scale 1-5*
- 1 = Definitely not
- 5 = Definitely yes

**Question 5.12 - Shareability Reasoning**
> Why or why not would you share this with stakeholders?

*Type: Open text*

**Question 5.13 - Comparison to Alternatives**
> Compared to a traditional strategy consulting engagement, this synthesis output is:

*Type: Linear scale 1-7*
- 1 = Much worse
- 4 = About the same
- 7 = Much better

#### Block 4: Synthesis Phase Summary

**Question 5.14 - Value Delivered**
> How much value does this synthesis phase provide?

*Type: Linear scale 1-5*

**Question 5.15 - Trust in AI Synthesis**
> How much do you trust AI-generated strategic synthesis?

*Type: Linear scale 1-5*

**Question 5.16 - Output Preferences**
> What other outputs would you want from the synthesis phase?

*Type: Multiple choice (multi-select)*
- SWOT analysis
- Competitive positioning map
- Risk assessment
- Implementation timeline
- Resource requirements
- Financial projections
- Stakeholder communication plan
- Other (please specify)

**Question 5.17 - Open Feedback**
> What would make the synthesis outputs more valuable for you?

*Type: Open text*

---

### Test 6: End-to-End Prototype Flow

**Objective:** Validate full journey comprehension with abbreviated prototype

**Test Type:** Usability Mission + Post-Test Survey

**Setup:**
- Abbreviated Figma prototype covering all 4 phases
- Simulated data and coach interactions
- 10-12 minute total experience

#### Introduction

> You're about to experience the full Product Strategy Coach journey, from Discovery to Strategic Bets. This is an abbreviated version - in the real product, you'd spend more time in each phase.
>
> Please think aloud as you navigate, sharing what you're thinking and feeling.

#### Phase 1: Discovery (2 min)

**Mission:** Complete the Discovery phase by uploading a document and answering the coach's first question.

*Observe: Navigation path, hesitations, questions*

#### Phase 2: Research (3 min)

**Mission:** Complete at least one territory (Customer) by answering the research questions.

*Observe: Territory selection reasoning, question comprehension, input behaviour*

#### Phase 3: Synthesis (2 min)

**Mission:** Review the generated synthesis and identify the top strategic opportunity.

*Observe: Comprehension of outputs, attention patterns, questions raised*

#### Phase 4: Strategic Bets (2 min)

**Mission:** Create a strategic bet based on the synthesis.

*Observe: Conversion of insights to actionable bets, satisfaction with final output*

#### Post-Flow Survey

**Question 6.1 - Journey Clarity**
> How clear was the journey from start to finish?

*Type: Linear scale 1-5*

**Question 6.2 - Phase Transitions**
> Were the transitions between phases smooth and logical?

*Type: Linear scale 1-5*

**Question 6.3 - Time Investment**
> For the value provided, the time investment in this process is:

*Type: Multiple choice (single select)*
- Worth much more than the time required
- Worth the time required
- Worth somewhat less than the time required
- Not worth the time required

**Question 6.4 - Completion Likelihood**
> If using this for a real strategy project, how likely would you be to complete all four phases?

*Type: Linear scale 1-5*

**Question 6.5 - Overall Satisfaction**
> How satisfied are you with the overall Product Strategy Coach experience?

*Type: Linear scale 1-5*

**Question 6.6 - Net Promoter Score**
> How likely are you to recommend this tool to a colleague?

*Type: Linear scale 0-10 (NPS format)*

**Question 6.7 - Primary Value**
> What is the most valuable aspect of this tool?

*Type: Open text*

**Question 6.8 - Primary Concern**
> What is your biggest concern or hesitation about using this tool?

*Type: Open text*

**Question 6.9 - Improvement Priority**
> If you could change one thing about this experience, what would it be?

*Type: Open text*

**Question 6.10 - Willingness to Pay**
> Would you or your company pay for a tool like this?

*Type: Multiple choice (single select)*
- Yes, definitely
- Yes, probably
- Not sure
- Probably not
- Definitely not

---

## 6. Moderated Session Protocol

### Session Overview

**Duration:** 60 minutes
**Format:** Remote video call with screen sharing
**Recording:** Video + audio (with consent)
**Participants:** 6-8 strategic product leaders

### Pre-Session Preparation

#### Participant Briefing (sent 24 hours before)

> Thank you for participating in our user research session for an AI-powered strategy coaching tool.
>
> **What to expect:**
> - 60-minute video call with screen sharing
> - You'll use a prototype of our product with your real company context
> - We'll ask you to "think aloud" as you navigate
> - There are no right or wrong answers - we're testing the product, not you
>
> **Preparation (optional but helpful):**
> - Have a strategic document ready to upload (annual report, strategy deck, etc.)
> - Think about a real strategic challenge you're currently facing
>
> **Technical requirements:**
> - Stable internet connection
> - Chrome or Firefox browser
> - Microphone and camera enabled

#### Facilitator Preparation

- Test prototype functionality
- Prepare backup scenarios if participant doesn't have real documents
- Review participant background from screening
- Set up recording software
- Prepare observation template

### Session Structure

#### 1. Introduction (5 minutes)

**Facilitator Script:**

> "Thank you for joining today. I'm [name], and I'll be facilitating this session.
>
> We're developing an AI-powered tool to help product leaders develop strategy. Today, I'd like you to use the tool and share your thoughts as you go.
>
> A few things before we start:
> - Please think aloud - share what you're looking at, thinking, and feeling
> - There are no wrong answers. If something is confusing, that's valuable feedback
> - We're testing the product, not you
> - Feel free to be candid - criticism helps us improve
>
> Do you have any questions before we begin?
>
> Great. I'll ask you to share your screen, and we'll get started."

#### 2. Context Setting (5 minutes)

**Questions:**

- "Tell me briefly about your role and company."
- "What strategic challenges are you currently working on?"
- "Have you used any tools or consultants to help with product strategy before?"
- "What did you like or dislike about those experiences?"

**Observation Notes:**
- Current strategy development process
- Pain points with existing approaches
- Expectations for AI-assisted tools

#### 3. First Impressions (5 minutes)

**Task:** Show the landing state (pre-login or first view after login)

**Questions:**

- "What do you think this tool does based on what you see?"
- "What stands out to you?"
- "Where would you start?"

**Observation Notes:**
- Initial comprehension
- Attention patterns
- Emotional response

#### 4. Discovery Phase (10-15 minutes)

**Task:** "Go ahead and start the process. Use your real company context if you're comfortable, or I can provide a scenario."

**During-Task Prompts (if participant goes silent):**
- "What are you looking at?"
- "What do you expect to happen?"
- "Is anything unclear?"

**Post-Task Questions:**
- "How was that experience?"
- "What did the AI coach ask you? How relevant was it?"
- "Is it clear what you need to do next?"

**Observation Notes:**
- Upload flow usability
- Coach interaction quality
- Progress comprehension
- Friction points

#### 5. Research Phase (15-20 minutes)

**Task:** "Now explore the research phase. Complete at least one territory."

**During-Task Prompts:**
- "Why did you choose that territory first?"
- "How are you finding these questions?"
- "Is the AI coach helping or distracting?"

**Post-Task Questions:**
- "How thorough did that feel?"
- "Were the questions the right ones?"
- "What would you add or remove?"
- "How does this compare to how you normally gather strategic input?"

**Observation Notes:**
- Territory selection reasoning
- Question comprehension and relevance
- Input behaviour (length, detail, engagement)
- Coach interaction patterns
- Time spent vs. perceived value

#### 6. Synthesis Phase (10 minutes)

**Task:** "Let's look at what the tool has synthesised from your input."

**Questions:**
- "Walk me through what you see here."
- "What's your reaction to this synthesis?"
- "Does anything surprise you?"
- "Would you share this with your CEO? Why or why not?"
- "What's missing that you'd need?"

**Observation Notes:**
- Comprehension of outputs
- Trust signals
- Perceived actionability
- Gaps identified

#### 7. Debrief Interview (10-15 minutes)

**Overall Experience:**
- "How would you describe this experience in a few words?"
- "What was the most valuable part?"
- "What was the most frustrating part?"

**Coaching Quality:**
- "How did the AI coach compare to working with a human consultant?"
- "Did you trust the coach's guidance? Why or why not?"
- "What would make you trust it more?"

**Output Value:**
- "How actionable were the strategic outputs?"
- "What would you do next with this synthesis?"
- "What outputs are missing that you'd want?"

**Adoption Likelihood:**
- "Would you use this tool for a real strategic project?"
- "What would need to change for you to use it?"
- "What would you be willing to pay for this?"

**Final Thoughts:**
- "Any other feedback or suggestions?"
- "What questions do you have for me?"

### Observation Template

```
SESSION OBSERVATION TEMPLATE
============================

Participant ID: _______________
Date/Time: _______________
Facilitator: _______________

PARTICIPANT PROFILE
-------------------
Role:
Company type:
Strategy experience:
Prior tool experience:

FIRST IMPRESSIONS
-----------------
Initial reaction:
Comprehension level:
Emotional response:

DISCOVERY PHASE
---------------
Time spent:
Upload behaviour:
Coach interaction quality:
Friction points:
Quotes:

RESEARCH PHASE
--------------
Territory selection order:
Question engagement level:
Input quality (depth/detail):
Coach utilisation:
Friction points:
Quotes:

SYNTHESIS PHASE
---------------
Comprehension level:
Trust signals:
Actionability perception:
Gaps identified:
Shareability likelihood:
Quotes:

OVERALL ASSESSMENT
------------------
Primary value perceived:
Primary concern/friction:
Adoption likelihood (1-5):
Willingness to pay:
Key quotes:

RECOMMENDATIONS
---------------
Critical fixes:
Important improvements:
Nice-to-haves:
```

---

## 7. Question Bank

### In-Session Observation Prompts

These questions help facilitators probe during think-aloud sessions:

#### Navigation & Comprehension

| Situation | Prompt |
|-----------|--------|
| Participant pauses | "What are you looking at right now?" |
| Participant seems confused | "What are you expecting to see here?" |
| Participant clicks unexpectedly | "What made you click there?" |
| Participant skips content | "I noticed you scrolled past that - was it not relevant?" |
| Participant reads carefully | "What caught your attention there?" |

#### Emotional Response

| Situation | Prompt |
|-----------|--------|
| Participant sighs/expresses frustration | "What's causing that reaction?" |
| Participant smiles/shows satisfaction | "What do you like about this?" |
| Participant seems hesitant | "What's holding you back from proceeding?" |
| Participant speeds up | "You seem more confident now - what changed?" |

#### Coach Interaction

| Situation | Prompt |
|-----------|--------|
| Participant ignores coach | "I noticed you didn't engage with the coach message - any reason?" |
| Participant responds minimally | "How would you normally answer this kind of question?" |
| Participant responds extensively | "What prompted such a detailed response?" |
| Participant asks coach a question | "What are you hoping to learn from this?" |

#### Output Review

| Situation | Prompt |
|-----------|--------|
| Participant reviewing synthesis | "Walk me through what you're seeing here." |
| Participant seems skeptical | "Something seems to be bothering you - what is it?" |
| Participant nods/agrees | "What resonates with you about this?" |
| Participant wants to edit | "What would you change about this?" |

### Post-Session Interview Questions

#### Section A: Overall Experience

1. "In one sentence, how would you describe this experience?"
2. "On a scale of 1-10, how valuable was this session? Why that number?"
3. "What was the single best moment in your experience?"
4. "What was the single worst moment?"
5. "How does this compare to how you currently develop strategy?"

#### Section B: Usability & Navigation

1. "Was there any point where you felt lost or confused?"
2. "Were there features you were looking for but couldn't find?"
3. "How intuitive was the progression from phase to phase?"
4. "What would you change about the layout or navigation?"
5. "Did the two-panel design (coach + canvas) work for you?"

#### Section C: AI Coaching Quality

1. "How would you rate the AI coach on a scale of 1-10? Why?"
2. "Did the coach feel like a partner, a tool, or something else?"
3. "Were there moments when the coach was particularly helpful?"
4. "Were there moments when the coach was unhelpful or annoying?"
5. "What would make you trust the coach more?"
6. "How does AI coaching compare to working with a human consultant?"
7. "Would you want more or less interaction with the coach?"

#### Section D: Content & Methodology

1. "Did the 4-phase methodology make sense to you?"
2. "Were the research questions the right ones to ask?"
3. "What topics or questions were missing?"
4. "Is 'terrain mapping' a helpful metaphor? What would be better?"
5. "Did you feel the process was too structured, not structured enough, or just right?"

#### Section E: Output Quality

1. "How actionable were the strategic insights generated?"
2. "Would you present this synthesis to your leadership team?"
3. "What additional outputs would you want?"
4. "Did the outputs tell you anything you didn't already know?"
5. "How would you use these outputs in practice?"

#### Section F: Trust & Adoption

1. "Do you trust AI to help with strategic decisions? Why or why not?"
2. "What would make you trust this tool enough to use it for real decisions?"
3. "Would you use this tool independently, or would you want human oversight?"
4. "What concerns would you have about using AI for strategy?"
5. "Who else in your organisation would benefit from this tool?"

#### Section G: Business & Value

1. "How much time did this save compared to traditional approaches?"
2. "Would you pay for a tool like this? How much?"
3. "What would justify the investment to your CFO?"
4. "What would prevent your company from adopting this?"
5. "What competing solutions are you aware of?"

### Post-Session Survey (Sent via Email)

**Quantitative Metrics:**

| Question | Scale | Purpose |
|----------|-------|---------|
| Overall satisfaction | 1-5 | CSAT |
| Likelihood to recommend | 0-10 | NPS |
| Ease of use | 1-5 | SUS component |
| Feature completeness | 1-5 | Gap analysis |
| Trust in AI guidance | 1-5 | Trust metric |
| Likelihood to use for real project | 1-5 | Adoption intent |
| Value vs. time invested | 1-5 | ROI perception |

**System Usability Scale (SUS) - Standard 10 Questions:**

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

*Scale: Strongly Disagree (1) to Strongly Agree (5)*

**Open-Ended Follow-Up:**

1. "After reflecting on the session, what stands out most about the experience?"
2. "Is there anything you wish you had mentioned during the session?"
3. "What would be your #1 feature request?"
4. "Any other thoughts or feedback?"

---

## 8. Expert Review Framework

### Purpose

Evaluate the quality of AI-generated coaching and synthesis outputs through blind expert assessment.

### Panel Composition

**Recommended Panel:**
- 3-5 strategy experts
- Mix of backgrounds: management consulting, corporate strategy, product leadership
- 10+ years experience in strategy development
- No prior exposure to the tool

### Review Materials

**For Each Session Reviewed:**
1. Anonymised client context (industry, size, strategic focus)
2. Complete coach conversation transcript
3. Full synthesis output
4. Strategic opportunity cards with evidence

### Scoring Rubric

#### Dimension 1: Coaching Relevance (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | Coaching completely misses the point; generic or off-topic |
| 2 - Below Average | Some relevant points but largely unhelpful |
| 3 - Adequate | Reasonably relevant but not insightful |
| 4 - Good | Relevant and occasionally insightful |
| 5 - Excellent | Highly relevant, insightful, and well-timed |

**Evaluation Questions:**
- Does the coach respond to what the user actually said?
- Are follow-up questions appropriate and probing?
- Does the coach adapt to the user's industry/context?

#### Dimension 2: Coaching Depth (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | Surface-level only; no depth or probing |
| 2 - Below Average | Occasionally probes but mostly shallow |
| 3 - Adequate | Some depth but misses obvious opportunities |
| 4 - Good | Consistently probes and challenges appropriately |
| 5 - Excellent | Exceptional depth; uncovers insights user hadn't considered |

**Evaluation Questions:**
- Does the coach push beyond surface-level responses?
- Are challenging questions framed constructively?
- Does the coaching reveal new perspectives?

#### Dimension 3: Synthesis Accuracy (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | Major misrepresentations or fabrications |
| 2 - Below Average | Some accuracy issues; misses key points |
| 3 - Adequate | Generally accurate but incomplete |
| 4 - Good | Accurate and comprehensive |
| 5 - Excellent | Highly accurate with nuanced interpretation |

**Evaluation Questions:**
- Does the synthesis accurately reflect the research inputs?
- Are conclusions logically derived from the evidence?
- Are there any fabricated or unsupported claims?

#### Dimension 4: Strategic Actionability (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | Outputs are too vague to act upon |
| 2 - Below Average | Some actionable elements but mostly abstract |
| 3 - Adequate | Actionable but requires significant interpretation |
| 4 - Good | Clear actions with reasonable specificity |
| 5 - Excellent | Highly actionable with clear next steps |

**Evaluation Questions:**
- Could a product leader act on these recommendations?
- Are the "Where to Play" and "How to Win" choices specific enough?
- Are the assumptions testable?

#### Dimension 5: Insight Quality (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | No insights; purely descriptive |
| 2 - Below Average | Obvious insights only |
| 3 - Adequate | Some non-obvious connections |
| 4 - Good | Multiple meaningful insights |
| 5 - Excellent | Breakthrough insights that reframe the problem |

**Evaluation Questions:**
- Does the synthesis reveal non-obvious patterns?
- Are the strategic tensions genuinely insightful?
- Would these insights change how the user thinks about the problem?

#### Dimension 6: Stakeholder Readiness (1-5)

| Score | Description |
|-------|-------------|
| 1 - Poor | Would embarrass the user if shared |
| 2 - Below Average | Needs significant editing before sharing |
| 3 - Adequate | Shareable with caveats |
| 4 - Good | Ready to share with minor polish |
| 5 - Excellent | Could be presented to the board immediately |

**Evaluation Questions:**
- Is the language professional and appropriate?
- Is the formatting clear and well-organised?
- Would a CEO take this seriously?

### Expert Review Template

```
EXPERT REVIEW TEMPLATE
======================

Session ID: _______________
Reviewer: _______________
Date: _______________

CONTEXT SUMMARY
---------------
Industry:
Company size:
Strategic focus:
Research areas completed:

COACHING QUALITY
----------------
Relevance (1-5): ___
Depth (1-5): ___
Comments:


SYNTHESIS QUALITY
-----------------
Accuracy (1-5): ___
Actionability (1-5): ___
Insight Quality (1-5): ___
Stakeholder Readiness (1-5): ___
Comments:


OVERALL ASSESSMENT
------------------
Overall Score (1-5): ___

Strengths:


Weaknesses:


Recommendations:


Comparison to Human Consultant:
[ ] Much worse
[ ] Somewhat worse
[ ] Comparable
[ ] Somewhat better
[ ] Much better

Would you recommend this tool? [ ] Yes [ ] No
Why:

```

### Comparative Assessment

**Side-by-Side Comparison:**

For 3-5 sessions, also create a "gold standard" synthesis manually. Present both (AI and human) to experts without labelling which is which.

**Questions:**
1. "Which synthesis would you prefer to receive?"
2. "Which feels more trustworthy?"
3. "Which is more actionable?"
4. "Can you tell which is AI-generated?"

---

## 9. Participant Recruitment

### Target Profile

**Primary Persona: Strategic Product Leader**

| Attribute | Requirement |
|-----------|-------------|
| Title | VP Product, Head of Strategy, Product Director, Chief Product Officer |
| Company size | 200+ employees (enterprise focus) |
| Experience | 5+ years in product or strategy roles |
| Current context | Actively involved in or planning strategic initiatives |
| Industry | Technology, Financial Services, Healthcare, B2B SaaS (priority) |

### Screening Criteria

**Must-Have:**
- Decision-making authority over product strategy
- Experience developing or contributing to strategic plans
- Comfortable with technology and AI tools

**Nice-to-Have:**
- Prior experience with strategy consulting
- Currently facing a product transformation challenge
- Willing to use real company context in testing

### Screening Questions

1. **Role Confirmation**
   > What is your current job title?
   - VP/Head/Director of Product or Strategy (qualify)
   - Product Manager (qualify if senior)
   - Other (screen out)

2. **Strategic Involvement**
   > In the past 12 months, have you been responsible for developing or significantly contributing to your company's product strategy?
   - Yes, I led the process (ideal)
   - Yes, I was a key contributor (qualify)
   - No, I was not involved (screen out)

3. **Company Size**
   > Approximately how many employees does your company have?
   - 1-49 (screen out unless funded startup)
   - 50-199 (qualify with caution)
   - 200-999 (qualify)
   - 1000+ (ideal)

4. **Industry**
   > What industry is your company in?
   - Technology/Software (ideal)
   - Financial Services (ideal)
   - Healthcare/Life Sciences (ideal)
   - Professional Services (qualify)
   - Other B2B (qualify)
   - Consumer (screen out unless premium)

5. **AI Comfort**
   > How comfortable are you using AI-powered tools in your work?
   - Very comfortable (ideal)
   - Somewhat comfortable (qualify)
   - Neutral (qualify with caution)
   - Uncomfortable (screen out)

6. **Availability**
   > Are you available for a 60-minute video session in the next 2 weeks?
   - Yes (qualify)
   - No (waitlist)

### Recruitment Channels

**For Maze Tests (Unmoderated):**
- Maze Panel (built-in recruitment)
- LinkedIn targeting (Product leaders, Strategy roles)
- User Interviews platform
- Respondent.io

**For Moderated Sessions:**
- Existing network and warm introductions
- LinkedIn outreach to specific profiles
- Industry Slack communities (Product, Strategy)
- User Interviews platform (scheduled sessions)

### Incentives

| Test Type | Duration | Suggested Incentive |
|-----------|----------|---------------------|
| Maze Test (unmoderated) | 5-10 min | $20-30 or prize draw |
| Maze Test (longer) | 10-15 min | $40-50 |
| Moderated Session | 60 min | $150-200 (or equivalent) |
| Expert Panel Review | 30 min per review | $100-150 per review |

### Sample Size Recommendations

| Test Type | Minimum | Recommended | Statistical Notes |
|-----------|---------|-------------|-------------------|
| Maze usability tests | 10 | 15-20 | 85% confidence at n=15 |
| Moderated sessions | 5 | 6-8 | Diminishing returns after 8 |
| Expert reviews | 3 | 5 | For inter-rater reliability |

---

## 10. Test Plan Timeline

### Overview: 6-Week Programme

```
WEEK 1          WEEK 2          WEEK 3          WEEK 4          WEEK 5          WEEK 6
─────────────────────────────────────────────────────────────────────────────────────
   │               │               │               │               │               │
   ▼               ▼               ▼               ▼               ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ PREPARE  │  │   MAZE   │  │   MAZE   │  │ MODERATED│  │  EXPERT  │  │ ANALYSIS │
│          │  │ TESTS    │  │ TESTS    │  │ SESSIONS │  │  REVIEW  │  │ & REPORT │
│ • Recruit│  │ 1-3      │  │ 4-6      │  │ 6-8      │  │ 3-5      │  │          │
│ • Build  │  │          │  │          │  │ sessions │  │ reviews  │  │ Final    │
│   tests  │  │          │  │          │  │          │  │          │  │ report   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### Detailed Schedule

#### Week 1: Preparation

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Finalise test plan and get stakeholder sign-off | Product | Approved test plan |
| Tue | Build Maze tests 1-3 | Design/Research | Test drafts |
| Wed | Build Maze tests 4-6 | Design/Research | Test drafts |
| Thu | QA all Maze tests; recruit Maze participants | Research | Ready-to-launch tests |
| Fri | Recruit moderated session participants | Research | 8+ confirmed participants |

#### Week 2: Maze Tests (Batch 1)

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Launch Maze Test 1: First Impressions | Research | Live test |
| Tue | Launch Maze Test 2: Discovery Phase | Research | Live test |
| Wed | Launch Maze Test 3: Coach Interaction | Research | Live test |
| Thu | Monitor responses; address any issues | Research | Response tracking |
| Fri | Preliminary analysis of Tests 1-3 | Research | Early insights memo |

#### Week 3: Maze Tests (Batch 2)

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Launch Maze Test 4: Territory Navigation | Research | Live test |
| Tue | Launch Maze Test 5: Synthesis Review | Research | Live test |
| Wed | Launch Maze Test 6: End-to-End Flow | Research | Live test |
| Thu | Monitor responses; close Tests 1-3 | Research | Complete data |
| Fri | Analysis of Tests 1-6; prepare session guide | Research | Maze summary report |

#### Week 4: Moderated Sessions

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Sessions 1-2 | Research | Recordings + notes |
| Tue | Sessions 3-4 | Research | Recordings + notes |
| Wed | Sessions 5-6 | Research | Recordings + notes |
| Thu | Sessions 7-8 (if needed) | Research | Recordings + notes |
| Fri | Session synthesis; identify themes | Research | Theme summary |

#### Week 5: Expert Review + Analysis

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Prepare materials for expert review | Research | Review packets |
| Tue | Expert reviews (3-5 reviewers) | External | Completed rubrics |
| Wed | Analyse expert feedback | Research | Expert synthesis |
| Thu | Combine all data sources | Research | Integrated findings |
| Fri | Draft final report | Research | Report draft |

#### Week 6: Reporting + Planning

| Day | Activity | Owner | Deliverable |
|-----|----------|-------|-------------|
| Mon | Complete final report | Research | Final report |
| Tue | Stakeholder presentation | Research/Product | Presentation deck |
| Wed | Prioritisation workshop | Product/Design | Prioritised backlog |
| Thu | Plan iteration sprint | Engineering | Sprint plan |
| Fri | Optional: Validation testing (quick Maze) | Research | Validation results |

---

## 11. Success Metrics

### Quantitative Metrics (Targets)

| Metric | Target | Source | Priority |
|--------|--------|--------|----------|
| Task success rate (first-click) | ≥85% | Maze | P0 |
| Task completion rate | ≥80% | Maze | P0 |
| Time-on-task (Discovery) | <3 min | Maze | P1 |
| Time-on-task (Territory) | <5 min | Maze | P1 |
| System Usability Scale (SUS) | ≥75 | Post-session survey | P0 |
| Net Promoter Score (NPS) | ≥30 | Post-session survey | P0 |
| Coach trust score | ≥4.0/5.0 | Session interviews | P0 |
| Synthesis actionability | ≥4.0/5.0 | Expert review | P0 |
| Journey completion rate | ≥70% | Session observation | P1 |
| Willingness to pay | ≥60% "yes" | Post-session survey | P1 |

### Qualitative Success Criteria

| Criterion | Evidence Required |
|-----------|-------------------|
| Clear value proposition | Users articulate value in their own words |
| Intuitive navigation | <2 "lost" moments per session |
| Coach adds value | Users voluntarily engage with coach |
| Outputs are actionable | Users describe specific next steps |
| Trust is established | Users willing to share outputs externally |

### Risk Thresholds

| Metric | Acceptable | Warning | Critical |
|--------|------------|---------|----------|
| Task success | ≥85% | 70-84% | <70% |
| SUS Score | ≥75 | 60-74 | <60 |
| NPS | ≥30 | 0-29 | <0 |
| Coach trust | ≥4.0 | 3.0-3.9 | <3.0 |
| Abandonment rate | <20% | 20-40% | >40% |

---

## 12. Budget Estimate

### Maze Platform Costs

| Item | Quantity | Unit Cost | Total |
|------|----------|-----------|-------|
| Maze subscription (Pro) | 1 month | $99 | $99 |
| Panel recruitment (per participant) | 100 | $3-5 | $300-500 |
| **Subtotal** | | | **$399-599** |

### Moderated Session Costs

| Item | Quantity | Unit Cost | Total |
|------|----------|-----------|-------|
| Participant incentives | 8 | $150 | $1,200 |
| Recruitment platform (if needed) | 1 | $300 | $300 |
| Video recording/transcription | 8 hours | $50 | $400 |
| **Subtotal** | | | **$1,900** |

### Expert Review Costs

| Item | Quantity | Unit Cost | Total |
|------|----------|-----------|-------|
| Expert reviewer fee | 5 reviewers × 3 reviews | $100 | $1,500 |
| **Subtotal** | | | **$1,500** |

### Internal Costs (Time)

| Role | Hours | Rate (internal) | Value |
|------|-------|-----------------|-------|
| UX Researcher | 60 | £75/hr | £4,500 |
| Product Manager | 20 | £85/hr | £1,700 |
| Designer | 15 | £65/hr | £975 |
| **Subtotal** | | | **£7,175** |

### Total Budget

| Category | Low Estimate | High Estimate |
|----------|--------------|---------------|
| External costs | $3,800 | $5,000 |
| Internal time | £7,175 | £9,000 |
| Contingency (15%) | $570 + £1,076 | $750 + £1,350 |
| **Total** | **$4,370 + £8,251** | **$5,750 + £10,350** |

---

## 13. Appendices

### Appendix A: Consent Form Template

```
PARTICIPANT CONSENT FORM
========================

Study Title: Product Strategy Coach User Testing
Organisation: Frontera
Date: [DATE]

Purpose:
We are conducting research to evaluate and improve our product strategy
coaching tool. Your participation will help us understand how users
interact with the tool and identify areas for improvement.

What to Expect:
• Duration: Approximately [X] minutes
• Activities: Using a prototype, answering questions, sharing feedback
• Recording: This session will be recorded for research purposes

Your Rights:
• Participation is voluntary
• You may withdraw at any time without penalty
• You may skip any question you prefer not to answer
• Your responses will be kept confidential

Data Usage:
• Recordings will be used for internal research only
• Data will be anonymised in any reports
• Recordings will be deleted after 12 months

Compensation:
• You will receive [INCENTIVE] for your participation

By signing below, you confirm that:
• You have read and understood this consent form
• You agree to participate in this research study
• You consent to being recorded

Signature: _______________________
Date: ___________________________
Name (printed): __________________
```

### Appendix B: Session Checklist

```
PRE-SESSION CHECKLIST
=====================

□ Prototype URL confirmed working
□ Recording software tested
□ Consent form sent and signed
□ Participant background reviewed
□ Observation template ready
□ Backup scenarios prepared
□ Calendar invite sent with joining link
□ Incentive payment prepared

DURING-SESSION CHECKLIST
========================

□ Welcome and introductions
□ Confirm consent to record
□ Start recording
□ Context-setting questions
□ First impressions task
□ Discovery phase walkthrough
□ Research phase walkthrough
□ Synthesis review
□ Debrief interview
□ Thank participant
□ Stop recording

POST-SESSION CHECKLIST
======================

□ Complete observation notes within 24 hours
□ Tag key moments in recording
□ Update participant tracker
□ Send thank-you email
□ Process incentive payment
□ Share preliminary insights with team
```

### Appendix C: Analysis Framework

**Affinity Mapping Categories:**

1. Navigation & Wayfinding
2. Coach Interaction Quality
3. Content & Methodology
4. Output Value & Trust
5. Emotional Response
6. Feature Requests
7. Competitive Comparison
8. Adoption Barriers

**Severity Rating Scale:**

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Prevents task completion; causes data loss | Cannot submit research responses |
| High | Significantly impairs experience; workaround difficult | Coach response completely irrelevant |
| Medium | Causes confusion or frustration; workaround exists | Unclear progress indicator |
| Low | Minor annoyance; easily overlooked | Typo in label |

### Appendix D: Report Template Outline

```
USER TESTING REPORT
===================

1. Executive Summary
   - Key findings (3-5 bullet points)
   - Critical issues requiring immediate attention
   - Overall recommendation

2. Methodology
   - Tests conducted
   - Participants
   - Analysis approach

3. Quantitative Results
   - Task success rates
   - Time-on-task metrics
   - Survey scores (SUS, NPS, custom)
   - Statistical significance notes

4. Qualitative Findings
   - Theme 1: [Description + evidence + recommendation]
   - Theme 2: [Description + evidence + recommendation]
   - Theme 3: [Description + evidence + recommendation]
   - ...

5. Expert Review Summary
   - Overall quality scores
   - Key strengths identified
   - Key weaknesses identified

6. Prioritised Recommendations
   - Critical (must fix before launch)
   - High (should fix before launch)
   - Medium (address in next iteration)
   - Low (consider for future)

7. Appendices
   - Raw data
   - Participant quotes
   - Session recordings (links)
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 2026 | Frontera Product Team | Initial draft |

---

*End of Document*
