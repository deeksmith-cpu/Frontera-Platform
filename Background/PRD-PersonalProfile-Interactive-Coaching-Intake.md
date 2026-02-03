# PRD: Personal Profile — Interactive Coaching Intake

**Version**: 1.0 (Draft)
**Date**: January 31, 2026
**Status**: Draft
**Author**: Frontera Product Team

---

## 1. Overview & Problem Statement

### Problem
Frontera's onboarding captures *organizational* context — company name, industry, strategic focus, pain points — but nothing about the *individual* using the platform. The coaching system knows about the company's transformation challenge but not:
- **Who** is driving it (VP Product? CPO? Founder? Consultant?)
- **Why** they personally need this coaching (new role? board pressure? career growth?)
- **How** they learn and make decisions (data-driven? intuition-led? consensus-builder?)
- **What** they've tried before at a personal level (executive coaching? frameworks? nothing?)

This means the Strategy Coach treats a first-time founder identically to a 20-year CPO. The coaching tone, depth, pacing, and recommendations are the same. This is a missed opportunity to deliver genuinely personalized coaching from the first interaction.

### Solution
**Personal Profile** is an interactive, conversational intake that happens when a user first logs in — before they enter the coaching process. Instead of a static form, the Frontera coach conducts a brief (5-7 minute) structured conversation to understand the user as an individual leader. The resulting profile shapes every subsequent coaching interaction.

### Value Proposition
- **For users**: The platform "gets me" from the start — coaching feels personal, not generic
- **For retention**: Users who feel understood are 3x more likely to complete the coaching journey
- **For quality**: The coach and wider platform can adapt tone, depth, frameworks, and pacing to the individual
- **For differentiation**: No strategy tool personalizes at the individual leader level — this is unique to Frontera

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-P.1 | As a new user, I want the coach to understand my role and context before we start strategy work, so the coaching feels relevant to me personally. | P0 |
| US-P.2 | As a user, I want the profiling conversation to feel natural — not like filling out a form — so I engage honestly. | P0 |
| US-P.3 | As a user, I want to see my profile summarized after the conversation, so I can verify the coach understood me correctly. | P0 |
| US-P.4 | As a user, I want to update my profile as my context changes (e.g., new role, new priorities), so coaching stays relevant. | P1 |
| US-P.5 | As a returning user, I want the coach to reference my profile naturally in conversations, so I feel continuity. | P1 |
| US-P.6 | As a user, I want the profiling to take no more than 5 minutes, so it does not feel like a barrier to getting started. | P0 |
| US-P.7 | As a user, I want to skip or defer the profiling if I'm in a hurry, so I'm not blocked from using the platform. | P1 |
| US-P.8 | As a user, I want my profile to influence which coaching persona is recommended, so the match feels intentional, but also still have the opportunity to switch it later. | P2 |

---

## 3. Functional Requirements

### 3.1 Profiling Conversation Flow

| ID | Requirement |
|----|------------|
| FR-P.01 | System SHALL initiate a profiling conversation when a user first accesses the dashboard after onboarding approval |
| FR-P.02 | Profiling SHALL be conducted as an interactive chat conversation with the Strategy Coach (not a form) |
| FR-P.03 | The coach SHALL follow a structured conversation arc covering 5 profiling dimensions (see 3.2) |
| FR-P.04 | Each dimension SHALL be explored through 1-3 conversational questions, adapting based on user responses |
| FR-P.05 | The coach SHALL acknowledge and reflect back user responses before moving to the next dimension |
| FR-P.06 | Total profiling conversation SHALL target 8-12 exchanges (coach + user) to keep within the 5-7 minute window |
| FR-P.07 | Users SHALL be able to skip profiling with a "Skip for now" option — profile is marked as incomplete |
| FR-P.08 | Users SHALL be able to return to complete or update their profile at any time from the Dashboard |

### 3.2 Profiling Dimensions

The conversation SHALL explore these five dimensions in order:

**Dimension 1: Role & Context**
- Current role and title
- How long in this role
- Organization size / team size they lead
- Reporting structure (who they report to, who reports to them)

*Example opening*: "Before we dive into strategy, I'd like to understand your world. Tell me about your current role — what's your title, and what does a typical week look like for you?"

**Dimension 2: Objectives & Drivers**
- What they're hoping to achieve with Frontera specifically
- What triggered them to seek strategic coaching now
- Key decisions they're facing in the next 90 days
- Personal success criteria (what does "this worked" look like for them?)

*Example question*: "What's the single most important decision you're facing in the next quarter? And what's making it hard?"

**Dimension 3: Leadership Style & Preferences**
- How they typically make strategic decisions (data-driven, intuition, consensus, directive)
- How they prefer to receive feedback (direct, Socratic, supportive)
- Communication style preferences (detailed analysis vs. executive summary)
- Comfort with being challenged on assumptions

*Example question*: "When you face a big strategic call, what's your process? Are you the person who wants all the data first, or do you trust your gut and validate after?"

**Dimension 4: Experience & Background**
- Previous experience with strategic frameworks or coaching
- Frameworks they already use or value (OKRs, Jobs-to-be-Done, Playing to Win, etc.)
- Past transformation experiences — what worked, what didn't
- Blind spots they're aware of

*Example question*: "Have you worked with strategic frameworks before — things like OKRs, Playing to Win, or Jobs-to-be-Done? I want to build on what you already know rather than re-explain."

**Dimension 5: Working Style & Engagement**
- Preferred session frequency (daily check-ins vs. weekly deep dives)
- Time availability for coaching engagement
- Whether they'll be using this alone or with a team
- Preferred output format (written documents, visual frameworks, bullet points)

*Example question*: "How do you see yourself using Frontera day to day? Quick check-ins when you hit a decision point, or dedicated weekly strategy sessions?"

### 3.3 Profile Summary & Confirmation

| ID | Requirement |
|----|------------|
| FR-P.09 | After the conversation, the coach SHALL generate a structured profile summary |
| FR-P.10 | The summary SHALL be displayed as a Profile Card on the Dashboard |
| FR-P.11 | Users SHALL be able to edit or correct any aspect of the profile summary |
| FR-P.12 | The profile summary SHALL include a "coaching approach recommendation" explaining how the coach will adapt |

**Profile Summary Structure:**
```
Personal Profile
├── Role: [title] at [company], [tenure]
├── Team: [direct reports] reports, reporting to [role]
├── Objectives: [2-3 bullet summary of goals]
├── Decision Style: [data-driven / intuitive / consensus / directive]
├── Feedback Preference: [direct / Socratic / supportive]
├── Communication: [detailed / executive-summary / visual]
├── Framework Familiarity: [list of known frameworks]
├── Engagement Style: [daily / weekly / ad-hoc]
├── Output Preference: [documents / frameworks / bullets]
└── Coaching Approach: [AI-generated recommendation]
```

### 3.4 Profile Integration with Coaching

| ID | Requirement |
|----|------------|
| FR-P.13 | The profile SHALL be injected into the Strategy Coach system prompt for all subsequent conversations |
| FR-P.14 | The coach SHALL adapt response length, tone, and depth based on profile preferences |
| FR-P.15 | The coach SHALL reference profile context naturally (e.g., "Given your data-driven approach, here's the evidence...") |
| FR-P.16 | Profile data SHALL influence persona recommendation (e.g., data-driven users → Marcus; people-focused → Elena) |
| FR-P.17 | Profile data SHALL be available to the Leadership Playbook (UC5) for theme matching |

### 3.5 Profile Management

| ID | Requirement |
|----|------------|
| FR-P.18 | Dashboard SHALL show a "Personal Profile" card with completion status |
| FR-P.19 | Profile card SHALL show summary when complete, or "Set Up Profile" CTA when incomplete |
| FR-P.20 | Users SHALL access a profile editing view from the Dashboard card |
| FR-P.21 | Profile updates SHALL trigger a notification to the coach context (no conversation restart needed) |

---

## 4. Technical Requirements

### 4.1 Data Model

**Storage approach**: Store in `clients` table as a new `personal_profile` JSONB column, or in a new `user_profiles` table keyed by `clerk_user_id`.

**Recommended: New `user_profiles` table** (profiles are per-user, not per-org):
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  clerk_org_id TEXT NOT NULL,
  profile_data JSONB NOT NULL DEFAULT '{}',
  profile_status TEXT NOT NULL DEFAULT 'incomplete', -- 'incomplete' | 'complete' | 'skipped'
  conversation_id UUID REFERENCES conversations(id), -- the profiling conversation
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- profile_data structure:
-- {
--   role: { title, tenure, teamSize, reportsTo },
--   objectives: { primaryGoal, trigger, keyDecisions, successCriteria },
--   leadershipStyle: { decisionStyle, feedbackPreference, communicationStyle, challengeComfort },
--   experience: { frameworkFamiliarity, pastTransformations, knownBlindSpots },
--   workingStyle: { sessionFrequency, timeAvailability, soloOrTeam, outputPreference },
--   coachingApproach: { summary, recommendedPersona, adaptations }
-- }
```

### 4.2 New Files

| File | Purpose |
|------|---------|
| `src/app/dashboard/personal-profile/page.tsx` | Profile dashboard page (view + edit) |
| `src/app/api/product-strategy-agent/personal-profile/route.ts` | GET/POST/PATCH profile data |
| `src/components/product-strategy-agent/PersonalProfile/ProfileCard.tsx` | Dashboard card (summary or CTA) |
| `src/components/product-strategy-agent/PersonalProfile/ProfileConversation.tsx` | Interactive profiling chat UI |
| `src/components/product-strategy-agent/PersonalProfile/ProfileSummary.tsx` | Structured profile display |
| `src/components/product-strategy-agent/PersonalProfile/ProfileEditor.tsx` | Edit individual profile fields |
| `src/lib/agents/strategy-coach/profiling-prompt.ts` | System prompt for profiling conversation |

### 4.3 Files to Modify

| File | Change |
|------|--------|
| `src/app/dashboard/page.tsx` | Add Personal Profile card |
| `src/lib/agents/strategy-coach/client-context.ts` | Add `loadPersonalProfile()`, include in `ClientContext` |
| `src/lib/agents/strategy-coach/system-prompt.ts` | Inject personal profile into all coaching prompts |
| `src/lib/agents/strategy-coach/personas/index.ts` | Add profile-based persona recommendation logic |
| `src/types/database.ts` | Add `UserProfile`, `PersonalProfileData` interfaces |

### 4.4 Profiling Conversation Architecture

The profiling conversation uses the same streaming chat infrastructure as the Strategy Coach but with a specialized system prompt:

```
┌─────────────────────────────────────────┐
│  User lands on Dashboard (first time)   │
│  → Profile card shows "Set Up Profile"  │
└──────────────┬──────────────────────────┘
               │ Click
┌──────────────▼──────────────────────────┐
│  /dashboard/personal-profile            │
│  → ProfileConversation component        │
│  → Uses profiling-prompt.ts             │
│  → 8-12 exchange structured chat        │
└──────────────┬──────────────────────────┘
               │ Conversation complete
┌──────────────▼──────────────────────────┐
│  Coach generates profile summary        │
│  → Parsed into structured profile_data  │
│  → Saved to user_profiles table         │
│  → ProfileSummary shown for review      │
└──────────────┬──────────────────────────┘
               │ User confirms
┌──────────────▼──────────────────────────┐
│  Profile marked 'complete'              │
│  → Injected into all future prompts     │
│  → Persona recommendation generated     │
│  → User redirected to coaching flow     │
└─────────────────────────────────────────┘
```

### 4.5 Profiling System Prompt Design

The profiling prompt must:
1. Follow the 5-dimension structure but feel conversational
2. Adapt follow-up questions based on responses (e.g., if user says "I'm a founder", ask founder-specific questions)
3. Keep exchanges concise — coach questions should be 1-3 sentences
4. Build rapport — acknowledge what the user shares before asking the next question
5. End with a structured summary using a parseable format (JSON block or structured markers)

**Output format** (appended to final coach message):
```
[PROFILE_SUMMARY]
{
  "role": { "title": "...", "tenure": "...", ... },
  "objectives": { ... },
  "leadershipStyle": { ... },
  "experience": { ... },
  "workingStyle": { ... },
  "coachingApproach": { "summary": "...", "recommendedPersona": "marcus|elena|richard|...", "adaptations": ["..."] }
}
[/PROFILE_SUMMARY]
```

The client-side component parses this marker to extract structured data and save it.

---

## 5. UX Design

### 5.1 Dashboard Card States

**Incomplete Profile:**
```
┌────────────────────────────────────────┐
│  📋  Personal Profile                  │
│                                        │
│  Help your coach understand you better │
│  with a quick 5-minute conversation.   │
│                                        │
│  [Set Up My Profile]  (Gold CTA)       │
│                                        │
│  ○ Not yet started                     │
└────────────────────────────────────────┘
```

**Complete Profile:**
```
┌────────────────────────────────────────┐
│  📋  Personal Profile                  │
│                                        │
│  VP Product · Data-driven leader       │
│  Weekly deep-dive sessions             │
│                                        │
│  Persona: Marcus (Strategic Navigator) │
│                                        │
│  [View Profile]      [Edit]            │
│  ● Profile complete                    │
└────────────────────────────────────────┘
```

### 5.2 Profiling Conversation UI

The profiling conversation uses the same chat UI as the CoachingPanel but:
- Full-page layout (not side panel)
- Progress indicator showing which dimension is being explored (1 of 5)
- "Skip for now" link in the header
- Larger, more welcoming opening message
- Profile summary card appears inline after the conversation completes

### 5.3 Profile Summary View

After completion, the profile page shows:
- Structured profile card with all 5 dimensions
- "Coaching Approach" callout explaining how the coach will adapt
- Recommended persona with explanation
- Edit buttons per section
- "Redo Profile Conversation" option to start fresh

---

## 6. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-P.01 | New users see "Personal Profile" card on Dashboard after first login |
| AC-P.02 | Clicking "Set Up My Profile" starts an interactive coaching conversation |
| AC-P.03 | Profiling conversation covers all 5 dimensions in a natural flow |
| AC-P.04 | Conversation completes within 8-12 exchanges (target 5-7 minutes) |
| AC-P.05 | Profile summary is generated and displayed after conversation |
| AC-P.06 | User can confirm, edit, or redo their profile |
| AC-P.07 | Profile data is persisted and survives page refreshes |
| AC-P.08 | Subsequent coaching conversations reference profile data naturally |
| AC-P.09 | Coach adapts response length, tone, and depth based on profile preferences |
| AC-P.10 | Users can skip profiling and access the platform without it |
| AC-P.11 | Skipped users see a persistent reminder to complete their profile |
| AC-P.12 | Profile can be updated at any time from the Dashboard |
| AC-P.13 | Persona recommendation is generated based on profile data |

---

## 7. Relationship to Existing Features

### What Already Exists (Onboarding)
The onboarding wizard captures *organizational* context:
- Company name, industry, size
- Strategic focus (strategy-to-execution, product model, team empowerment)
- Pain points, previous attempts, additional context
- Success metrics, target outcomes, timeline

### What Personal Profile Adds (Individual)
- **Role context**: Title, tenure, team size, reporting structure
- **Personal objectives**: Why *this person* needs coaching right now
- **Leadership style**: Decision-making approach, feedback preferences, communication style
- **Framework familiarity**: What they already know — so the coach doesn't over-explain
- **Engagement preferences**: Session frequency, output format, solo vs. team usage

### Integration Points
- **System Prompt**: Personal profile injected alongside client context → coach knows both the company and the person
- **Persona Selection**: Profile-driven recommendation (data-driven → Marcus, people-focused → Elena, etc.)
- **Leadership Playbook (UC5)**: Profile feeds into theme matching for more accurate recommendations
- **Proactive Coach**: Profile informs when/how to proactively engage (daily users vs. weekly users)

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile completion rate | >= 70% of new users complete the profile | PostHog |
| Conversation duration | Median 5-7 minutes | PostHog (timestamps) |
| Profile skip rate | <= 20% skip without returning | PostHog |
| Coaching satisfaction lift | >= 15% improvement in coaching helpfulness ratings for profiled users vs. non-profiled | In-app feedback |
| Persona recommendation acceptance | >= 60% of users accept the recommended persona | PostHog |
| Profile update rate | >= 10% update at least once within 30 days | PostHog |

---

## 9. Out of Scope (v1)

- Team-wide profiling (profiling other team members)
- Psychometric assessments (MBTI, DISC, etc.)
- Integration with LinkedIn or other external profile sources
- Multi-language profiling conversations
- Profile sharing between organizations
- AI-generated profile from existing coaching conversations (could be a v2 enhancement)
- Profile-based content recommendations beyond persona matching

---

## 10. Open Questions

1. **Should profiling be mandatory or optional?** Current recommendation: strongly encouraged but skippable. A persistent reminder nudges users to complete it.

2. **Should the profile conversation create a separate conversation record, or be a special mode within the existing coaching flow?** Recommendation: separate conversation with `agent_type: 'profiling'` to keep it distinct.

3. **How should profile data interact with onboarding data?** Recommendation: profile supplements onboarding — onboarding is about the company, profile is about the person. Both feed into the system prompt.

4. **Should profile data influence the Discovery phase questions?** Recommendation: yes — if the profile reveals the user is a first-time founder, Discovery questions should adapt accordingly.

5. **Should there be a "team profile" for organizations where multiple users access the platform?** Recommendation: defer to v2. Each user gets their own profile.
