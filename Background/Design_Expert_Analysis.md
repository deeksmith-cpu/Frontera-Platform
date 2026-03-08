# Design Expert Analysis: Option C vs Option D

> **Evaluator:** Independent UX Design Expert
> **Date:** March 5, 2026
> **Scope:** Visual design, information architecture, persona fit, AI UX patterns, accessibility, risk
> **Materials Reviewed:** UX Analysis (Sections 1-6), Implementation Comparison, Option C mockup (10 screens), Option D mockup (13 screens), Frontera Design System (CLAUDE.md)

---

## 1. Visual Design Quality Assessment

Both mockups demonstrate high design fidelity and strong adherence to the Frontera brand system. However, there are meaningful differences in execution quality.

### Brand Adherence Scorecard

| Design System Element | Option C | Option D | Notes |
|---|---|---|---|
| **Navy/Gold/Cyan palette** | 9/10 | 9/10 | Both execute the primary palette faithfully. Gold CTAs, navy headers, cyan accents all present. |
| **Plus Jakarta Sans typography** | 9/10 | 8/10 | Option C explicitly loads JetBrains Mono for data elements (`font-code` utility on XP, progress counters). Option D loads Jakarta Sans but omits JetBrains Mono for data typography. |
| **Border radius system** | 9/10 | 9/10 | Both use `rounded-2xl` for cards, `rounded-lg` for buttons, `rounded-full` for badges/pills. Consistent with design system. |
| **Spacing & layout** | 8/10 | 9/10 | Option D's full-width modes use more generous whitespace (`py-10`, `max-w-5xl`). Option C's three-column layout compresses main content on smaller viewports. |
| **Transitions & animation** | 7/10 | 8/10 | Option D includes slide-in-right animation for coach panel, pulse-glow on floating button, and richer entrance patterns. Option C has fade-up and ring-pulse but fewer interactive transitions. |
| **Phase-specific colours** | 10/10 | 10/10 | Both implement emerald (Discovery), amber (Research), purple (Synthesis), cyan (Bets) precisely per spec. |
| **Topographic pattern** | 10/10 | 0/10 | Option C includes the sidebar topographic SVG pattern at low opacity -- a distinctive brand element. Option D omits this entirely. |
| **Header gradient** | 10/10 | 10/10 | Both use the specified navy gradient (`#1e2440` to `#151930`) with gold accent border. |
| **Gold CTA treatment** | 9/10 | 9/10 | Both render gold buttons with `text-slate-900`, hover states, and proper focus rings. |
| **Overall Design System Score** | **91/100** | **82/100** | Option C is more faithful to the complete design system. |

### Key Visual Observations

**Option C strengths:**
- The persistent sidebar with topographic background creates a premium, distinctive atmosphere that reinforces the "strategic terrain" metaphor.
- The JetBrains Mono usage for progress counters (e.g., "0/3", "11%") follows the design system's data accent specification precisely.
- The three-zone colour relationship (navy sidebar, light main, white canvas) creates clear visual hierarchy through background contrast alone.

**Option D strengths:**
- Full-width orientation screens deliver greater visual impact. The three-card Discovery overview (Screen 1) is more visually commanding than Option C's centred single-column orientation.
- The 60/40 split in Focused Work mode (Screen 5) gives the question card significantly more breathing room than Option C's pinned card above chat.
- The celebration overlay (Screen 7) with gradient header, confetti particles, and XP badge is more polished than Option C's equivalent, which is absent from the mockups.

**Option D weaknesses:**
- Missing the topographic sidebar pattern removes a key brand differentiator. The navy header alone does not carry sufficient brand personality.
- The mode label badges ("Orientation Mode", "Focused Work Mode", "Conversation Mode") in the phase tab bar consume horizontal space and introduce a concept (modes) that is not part of the strategic coaching methodology.

---

## 2. Information Architecture Analysis

### Hierarchy Quality

**Option C** implements a classic spatial hierarchy:

```
Level 1: Sidebar (persistent navigation, wayfinding)
Level 2: PhaseTabBar (journey progress)
Level 3: Main Content (current task - orientation, question, or chat)
Level 4: Strategy Canvas (contextual detail, progress tracking)
```

This is a four-level hierarchy where all levels are simultaneously visible. Users build spatial memory: "navigation is left, work is centre, context is right." The hierarchy is consistent across all phases and states.

**Option D** implements a temporal hierarchy:

```
Level 1: Header + Phase Tabs (persistent across all modes)
Level 2: Mode (Orientation OR Focused Work OR Free Conversation)
Level 3: Content within mode (territory cards, question card, chat stream)
```

This is a three-level hierarchy, but Level 2 changes meaning based on the active mode. The hierarchy is simpler within each mode but requires users to understand which mode they are in and how to transition between them.

| IA Dimension | Option C | Option D |
|---|---|---|
| **Hierarchy depth** | 4 levels, all visible | 3 levels, mode-dependent |
| **Spatial consistency** | High -- zones never move | Low -- entire content area changes |
| **Progressive disclosure** | Sidebar > Overview > Question > Detail | Mode 1 > Mode 2 > Mode 3 |
| **Wayfinding** | Sidebar always shows position | Breadcrumb provides path, but requires reading |
| **Cognitive load per screen** | Moderate (three panels) | Low (one focus area) |
| **Context recovery** | Instant -- all panels visible | Requires mode navigation |

### Navigation Clarity

Option C provides two redundant navigation paths (sidebar journey list and PhaseTabBar), which is appropriate redundancy for enterprise tools. Users who prefer vertical scanning use the sidebar; users who prefer horizontal scanning use the tab bar. Both are always available.

Option D relies on breadcrumbs as the primary navigation mechanism for returning to overview states. Breadcrumbs work well for forward navigation ("Research > Company > Foundation > Q1") but create cognitive overhead for lateral navigation. If a user in Company Territory Q3 wants to jump to Customer Territory, they must: (1) click "Research" in breadcrumb, (2) wait for Orientation mode to load, (3) click Customer Territory card. In Option C, this is a single click on the sidebar territory item.

### Verdict on Information Architecture

Option C's spatial consistency gives it a significant advantage for repeated use over multi-hour strategy sessions. Option D's reduced per-screen cognitive load benefits first-time users but becomes overhead for experienced users who must navigate between modes.

**IA Rating: Option C 8/10, Option D 7/10**

---

## 3. Persona Fit Analysis

### Persona 1: CPO/CTO (Strategic Decision Maker)

*Age 50-55, C-suite, time-poor, needs board-ready outputs, values efficiency*

| Dimension | Option C | Option D |
|---|---|---|
| Time-to-value | **8/10** -- All panels visible on load; can assess progress at a glance | **6/10** -- Orientation mode shows overview but not active work; must click into a territory to see coaching |
| Executive summary access | **8/10** -- Strategy Canvas shows synthesis readiness, territory progress permanently | **7/10** -- Progress visible in Orientation mode, hidden in Focused Work |
| Perceived complexity | **7/10** -- Three panels may feel dense initially | **8/10** -- One thing at a time feels simpler |
| Delegation readiness | **7/10** -- Can screenshot the full interface to share with team | **6/10** -- Must navigate to Orientation mode to capture a summary view |
| **Persona 1 Total** | **30/40** | **27/40** |

The CPO who drops into the tool between meetings benefits from Option C's "everything at a glance" pattern. They can see current question progress, territory completion status, and synthesis readiness without navigating. Option D requires them to be in the right mode to see the information they need.

### Persona 2: VP of Product (Strategy Translator)

*Age 35-45, bridges strategy and execution, values frameworks and territory mapping*

| Dimension | Option C | Option D |
|---|---|---|
| Framework visibility | **9/10** -- Territory progress always in sidebar; question context always in canvas | **7/10** -- Framework structure visible in Orientation, partially hidden in Focused Work |
| Cross-territory navigation | **9/10** -- Sidebar enables instant territory switching | **6/10** -- Must return to Orientation mode to switch territories |
| Coaching integration | **8/10** -- Coach chat below pinned question, suggestion panel inline | **9/10** -- Dedicated 40% coach panel in Focused Work mode provides richer coaching surface |
| Working session flow | **8/10** -- Steady state: answer question, scroll to coach, submit, next question | **8/10** -- Focused Work mode creates excellent flow for deep question work |
| **Persona 2 Total** | **34/40** | **30/40** |

The VP of Product is the power user who spends 2+ hours in the Research phase. They benefit most from Option C's persistent navigation because they frequently switch between territories and research areas. However, Option D's Focused Work mode provides a superior deep-work experience for individual questions -- the 60/40 split gives the question more visual weight and the coach panel more conversational space.

### Persona 3: Product Manager (Execution Champion)

*Age 28-35, team-level, consumes strategy artifacts, values actionable briefs*

| Dimension | Option C | Option D |
|---|---|---|
| Learning curve | **8/10** -- Familiar three-panel pattern (Slack, Jira, Notion) | **7/10** -- Mode concept requires explanation; "what mode am I in?" |
| Artifact access | **8/10** -- Strategy Canvas provides persistent artifact preview | **7/10** -- Artifacts visible in some modes, not others |
| Gamification engagement | **9/10** -- XP, levels, achievements always visible in sidebar | **7/10** -- Gamification in header only; no persistent sidebar display |
| Onboarding simplicity | **8/10** -- Orientation view provides guided start; layout then becomes static | **8/10** -- Orientation mode is excellent for onboarding; guided flow |
| **Persona 3 Total** | **33/40** | **29/40** |

The PM benefits from the gamification visibility in Option C's sidebar. The always-present XP bar, achievement badges, and territory progress dots create the Duolingo-style engagement loop that the UX research identified as important.

### Persona Fit Summary

| Persona | Option C | Option D | Delta |
|---|---|---|---|
| CPO/CTO | 30/40 | 27/40 | +3 |
| VP of Product | 34/40 | 30/40 | +4 |
| Product Manager | 33/40 | 29/40 | +4 |
| **Total** | **97/120** | **86/120** | **+11** |

Option C has a meaningful advantage across all three personas, with the largest gap for the VP of Product (the primary power user) and the Product Manager (the most frequent daily user).

---

## 4. Frontera Mission Alignment

Frontera's mission: *"Bridge the gap between strategic vision and operational execution through AI-powered coaching."*

### Assessment Criteria

**Does strategy feel alive, not static?**

- **Option C (8/10):** The Strategy Canvas updates in real-time as questions are answered. Synthesis readiness percentage, territory progress dots, and research area status badges create a living dashboard feel. The canvas physically changes as users progress, reinforcing that their work is accumulating toward a strategic output.
- **Option D (7/10):** The Orientation mode shows progress bars and territory cards that update, but this information is only visible when the user is in Orientation mode. In Focused Work mode, the strategic context narrows to the current question. The strategy feels alive in one mode but dormant in another.

**Does AI position as collaborator, not chatbot?**

- **Option C (7/10):** The pinned QuestionCard with "Coach Suggestion" and "Coach Debate" buttons positions coaching as an on-demand resource integrated into the work surface. The collapsed chat section below reinforces that AI is secondary to the user's own thinking. However, the coach chat area is visually compressed beneath the pinned card and may feel like a subordinate afterthought.
- **Option D (8/10):** The 60/40 Focused Work split gives the coach a dedicated, full-height panel alongside the question. This physically elevates the coaching relationship -- the coach is not hidden beneath the question but standing alongside it. The sliding panel animation with the coach context label ("Coach -- Company Foundation") makes the coaching presence feel intentional and contextual.

**Do outputs drive execution, not just insight?**

- **Option C (8/10):** The Strategy Canvas panel can serve as a persistent artifact workspace. The Synthesis and Bets screens show structured outputs (Strategy on a Page framework, bet cards with kill criteria). The persistent canvas panel creates a natural home for execution-ready artifacts.
- **Option D (8/10):** The Bets overview screen (Screen 9) with the Effort vs Impact matrix visualization is excellent for execution prioritization. The Synthesis screen (Screen 8) shows a fully formed "Playing to Win" framework with evidence linkage. Both options handle later phases well.

**Does it support the full strategic lifecycle?**

- **Option C (8/10):** All phases are represented in the mockups (Discovery through Bets). The sidebar and PhaseTabBar provide clear lifecycle navigation. The Strategy Canvas adapts content per phase.
- **Option D (8/10):** All phases are represented across 13 screens. The phase pills provide lifecycle navigation. The mode concept extends naturally across phases.

### Mission Alignment Summary

| Dimension | Option C | Option D |
|---|---|---|
| Strategy feels alive | 8/10 | 7/10 |
| AI as collaborator | 7/10 | 8/10 |
| Outputs drive execution | 8/10 | 8/10 |
| Full lifecycle support | 8/10 | 8/10 |
| **Total** | **31/40** | **31/40** |

Both options align equally well with Frontera's mission. Option C's advantage in "strategy feels alive" (persistent canvas) is offset by Option D's advantage in "AI as collaborator" (dedicated coach panel with equal visual weight).

---

## 5. AI UX Pattern Evaluation

### Against 2025-2026 Best Practices

| Pattern | Option C | Option D | Analysis |
|---|---|---|---|
| **"AI-second" principle** | **8/10** | **8/10** | Both place user work first. Option C pins the question above AI chat. Option D puts the question panel at 60% with coach at 40%. Neither makes AI the primary surface. |
| **Claude Artifacts pattern (chat + workspace)** | **8/10** | **7/10** | Option C's three-column layout (sidebar + main + canvas) maps directly to the Artifacts model where chat and workspace coexist visually. Option D's mode-switching means chat and workspace are never visible simultaneously. |
| **Progressive disclosure (3-layer)** | **8/10** | **8/10** | Option C: sidebar overview > orientation view > question + canvas. Option D: Orientation mode > Focused Work mode > coaching interaction. Both implement three layers effectively. |
| **NN/g "AI recedes into background"** | **8/10** | **7/10** | Option C's collapsible coach chat beneath the pinned question literally recedes the AI when not needed. Option D's floating "Ask Coach for Help" button in Screen 4 is a good receding pattern, but the 40% coach panel in Screen 5 gives AI more visual weight than the user's answer area. |
| **Cognitive load management** | **7/10** | **9/10** | This is Option D's strongest advantage. Each mode shows only what is relevant. Orientation mode is a clean overview. Focused Work mode is question + coach. Free Conversation is pure chat. Option C's simultaneous three-panel display creates higher baseline cognitive load. |
| **Persistent context** | **9/10** | **6/10** | Option C's sidebar and canvas provide persistent context across all interactions. Option D loses context when switching between modes -- territory progress, synthesis readiness, and achievement status are not visible in Focused Work mode. |
| **Interactive workspace (Artifacts-inspired)** | **8/10** | **7/10** | Option C's Strategy Canvas is architecturally ready to become an interactive artifact workspace. Option D's coach panel in Focused Work mode could also serve this role, but it then competes with coaching functionality for the same 40% panel space. |
| **Total** | **56/70 (80%)** | **52/70 (74%)** | |

### Critical AI UX Insight

The convergence of Claude Artifacts, ChatGPT Canvas, and Gemini Canvas validates the "simultaneous visibility" pattern: users want to see their work and the AI's contributions at the same time. Option C's three-column layout naturally supports this. Option D's mode-switching fundamentally prevents it -- you cannot see an artifact and have a coaching conversation simultaneously.

This is not an academic distinction. During a synthesis phase, a user might want to see the "Strategy on a Page" artifact in the canvas while discussing a tension with the coach in chat. Option C enables this. Option D requires choosing between viewing the artifact (Orientation/Focused Work mode) and discussing it (Free Conversation mode).

---

## 6. Mobile/Responsive Strategy

### Option C Responsive Approach (Screens 9-10)

Option C's tablet mockup (Screen 9) is absent from the files reviewed, but the responsive strategy is implied by the architecture:

- **>1440px:** Full three-column (220px + fluid + 260px)
- **1200-1440px:** Sidebar collapses to 48px icon rail; canvas remains
- **768-1200px (tablet):** Sidebar hidden; canvas hidden; main content full-width with bottom navigation
- **<768px (mobile):** Full-width single column with stacked sections

The three-column layout degrades predictably. Each column can be independently collapsed without restructuring the remaining layout.

### Option D Responsive Approach (Screens 10-13)

Option D's tablet and mobile mockups are explicitly designed and included:

- **Tablet (Screen 10):** Territory overview in a 2+1 card grid. Clean, spacious layout within a 768px container.
- **Tablet Question (Screen 11):** Full-width question card with compressed breadcrumb. Coach accessible via bottom bar.
- **Mobile (Screen 12-13):** Full-width stacked cards. Breadcrumb simplified. Mini coach bar at bottom.

Option D's mode-based architecture actually advantages responsive design: since each mode is already a single-focus view, adapting to smaller screens means removing less chrome. Orientation mode is already full-width. Focused Work mode can stack the question and coach panels vertically on mobile. Free Conversation mode is already full-width.

### Responsive Verdict

| Viewport | Option C | Option D |
|---|---|---|
| Desktop (1440px+) | **9/10** -- All three zones visible | **8/10** -- Full-width modes with generous spacing |
| Laptop (1200-1440px) | **7/10** -- Sidebar must collapse; content gets tight | **9/10** -- Full-width modes unaffected by viewport |
| Tablet (768-1200px) | **6/10** -- Two of three columns must hide | **9/10** -- Modes already full-width; naturally adapts |
| Mobile (<768px) | **6/10** -- Major restructuring required | **8/10** -- Modes stack naturally |
| **Total** | **28/40** | **34/40** |

Option D has a meaningful advantage in responsive design. The mode-based architecture is inherently mobile-friendly because each mode is already a single-focus full-width view. Option C's three-column layout is optimized for desktop and degrades less gracefully.

---

## 7. Accessibility and Enterprise Readiness

### WCAG Compliance Assessment

| Criteria | Option C | Option D |
|---|---|---|
| **Colour contrast** | **Pass** -- Navy on white (15.39:1), slate text tiers all meet AA | **Pass** -- Same palette adherence |
| **Keyboard navigation** | **Good** -- Three landmark regions (aside, main, aside) provide clear tab order | **Challenging** -- Mode transitions require focus management; floating coach button needs keyboard accessibility |
| **Screen reader** | **Good** -- Persistent layout means screen readers can build a consistent mental model | **Complex** -- Mode changes require ARIA live region announcements; breadcrumb must announce mode context |
| **Focus management** | **Standard** -- Focus stays within the same layout structure | **Critical concern** -- Mode transitions must programmatically move focus to the new content area; failure creates disorientation for screen reader users |
| **Reduced motion** | **Minor** -- Fade-up entrances, ring-pulse (easily disabled) | **Major** -- Mode transition animations are core to the interaction model; disabling them could create jarring jumps |

### Enterprise Readiness

| Factor | Option C | Option D |
|---|---|---|
| **Onboarding complexity** | **Low** -- "Here are three panels: navigation, workspace, context" | **Medium** -- "There are three modes you'll move between..." |
| **Admin/SSO integration** | **Equal** -- Both share the same header with user avatar | **Equal** |
| **Multi-user scenarios** | **Slight advantage** -- Canvas could show team member activity | **Neutral** -- No team visibility in any mode |
| **Procurement demo** | **Strong** -- Full coaching experience visible on first load | **Weak** -- Evaluator sees Orientation mode first, which looks like a static dashboard rather than an AI coaching tool |
| **Training materials needed** | **Minimal** -- Standard three-panel layout | **Moderate** -- Must explain mode concept and transitions |

### Accessibility and Enterprise Rating

| Dimension | Option C | Option D |
|---|---|---|
| WCAG compliance | 8/10 | 6/10 |
| Enterprise readiness | 9/10 | 7/10 |
| **Total** | **17/20** | **13/20** |

---

## 8. Risk Assessment

### Implementation Risks

| Risk | Option C | Option D |
|---|---|---|
| **Timeline overrun** | **Medium** -- Well-understood three-panel pattern; 70% code reuse reduces unknowns | **High** -- State machine complexity, animation tuning, and edge cases (mid-stream mode switches, unsaved data) create schedule risk |
| **Performance** | **Low** -- Three panels render simultaneously but DOM is standard | **Medium** -- Mode transition animations, framer-motion dependency, and potential layout thrash during transitions |
| **Regression** | **Low** -- Incremental restructuring; existing tests remain largely valid | **High** -- Decomposing CoachLedPanel into two mode-specific components invalidates existing component tests |
| **Dependency risk** | **None** -- No new dependencies | **Medium** -- framer-motion or custom animation system required |

### UX Risks

| Risk | Option C | Option D |
|---|---|---|
| **Information overload** | **Medium** -- Three panels may overwhelm new users initially | **Low** -- Clean single-focus modes |
| **Mode disorientation** | **None** -- Layout is static | **High** -- "Which mode am I in?" confusion, especially when returning to the tool after absence |
| **Lost work** | **Low** -- Current question always pinned and visible | **Medium** -- If user switches from Focused Work to Orientation without saving, unsaved answer state must be preserved |
| **Navigation dead ends** | **Low** -- Sidebar and tab bar provide multiple escape routes | **Medium** -- If breadcrumb fails or user does not understand it, they may feel trapped in a mode |
| **Feature discoverability** | **Medium** -- Canvas content may go unnoticed if user focuses on main panel | **High** -- Users may not discover that clicking "Ask Coach for Help" opens a split panel; the mode transition is not self-evident |

### Performance Risks

| Risk | Option C | Option D |
|---|---|---|
| **DOM complexity** | **Moderate** -- All three panels rendered simultaneously | **Lower per mode** -- Only one mode rendered at a time, but mode transition requires mounting/unmounting |
| **Animation jank** | **Low** -- Only entrance animations | **Medium-High** -- Slide, fade, cross-fade transitions between modes; must maintain 60fps |
| **Memory usage** | **Stable** -- Consistent panel structure | **Variable** -- Mode history stack, preserved contexts for return navigation |

### Risk Summary

| Category | Option C | Option D |
|---|---|---|
| Implementation risk | Low-Medium | High |
| UX risk | Low-Medium | Medium-High |
| Performance risk | Low | Medium |
| **Overall risk** | **Low-Medium** | **Medium-High** |

---

## 9. Verdict and Recommendation

### Quantitative Scoring Summary

| Dimension | Weight | Option C | Option D |
|---|---|---|---|
| Visual design quality | 15% | 91/100 | 82/100 |
| Information architecture | 15% | 80/100 | 70/100 |
| Persona fit (all three) | 20% | 81/100 (97/120) | 72/100 (86/120) |
| Mission alignment | 10% | 78/100 (31/40) | 78/100 (31/40) |
| AI UX patterns | 15% | 80/100 (56/70) | 74/100 (52/70) |
| Mobile/responsive | 10% | 70/100 (28/40) | 85/100 (34/40) |
| Accessibility & enterprise | 10% | 85/100 (17/20) | 65/100 (13/20) |
| Risk profile | 5% | 80/100 | 45/100 |
| **Weighted Total** | 100% | **80.6/100** | **73.0/100** |

### Recommendation: Option C

Option C is the recommended approach. It scores higher across six of eight evaluation dimensions, with Option D only outperforming in mobile/responsive design and cognitive load management within individual screens.

### Key Trade-offs Acknowledged

This recommendation comes with an honest assessment of what is sacrificed:

1. **Deep focus quality:** Option D's Focused Work mode (60/40 split) provides a genuinely superior environment for answering individual questions. The coach panel has more conversational space, the question card has more visual weight, and distractions are eliminated. Option C's pinned question card above a compressed chat area is functional but less immersive.

2. **Responsive elegance:** Option D's mode architecture is inherently mobile-friendly. Option C requires more engineering effort to degrade gracefully on tablets and phones. This is a real cost.

3. **Cognitive load:** New users may find Option C's three simultaneous panels initially overwhelming. Option D's one-thing-at-a-time approach has genuine onboarding advantages for the first 15 minutes of use.

### Improvements to Strengthen Option C

To address the identified weaknesses, I recommend the following enhancements to Option C:

**1. Enhance the coach interaction within the main panel.**
The collapsed "Ask Your Coach" section beneath the pinned question card is too visually subordinate. Instead, implement a slide-up coach drawer (300-350px height) that expands when the user clicks "Coach Suggestion" or "Coach Debate." This drawer should overlay the chat stream, not push it down, preserving the pinned question's position while giving coaching interactions more visual space. This borrows Option D's coaching emphasis without requiring full mode switching.

**2. Add a "Focus Mode" toggle to the main panel.**
Allow users to temporarily hide the sidebar and canvas with a single toggle, expanding the main content to full width. This gives power users the deep-focus benefit of Option D when they want it, without making it the default. The toggle should be easily reversible (keyboard shortcut, persistent button in header). This is a much simpler implementation than a full mode state machine.

**3. Invest in responsive breakpoints.**
The three-column layout needs explicit engineering attention for tablet viewports. At 1024px, the canvas should collapse to a bottom drawer (slide-up panel). At 768px, the sidebar should become a hamburger menu and the canvas a separate tab/screen. These are well-understood responsive patterns that do not require new architecture.

**4. Add celebration moments.**
Option D's area completion celebration (Screen 7) is absent from Option C's mockups. Implement a modal celebration overlay with XP animation, micro-synthesis preview, and "Continue to next area" CTA. These moments are critical for the Duolingo-style engagement loop and should not be omitted.

**5. Strengthen the Strategy Canvas interactivity.**
The canvas panel should evolve from a read-only status display to an interactive artifact workspace (as described in the Artifacts Enhancement Layer analysis). This is already planned as a future milestone but should be prioritized earlier, as it directly addresses the "strategy feels alive" dimension.

### Phased Evolution Roadmap

| Phase | Duration | Deliverable | Key Benefit |
|---|---|---|---|
| **Phase 1: Foundation** | Weeks 1-2 | JourneySidebar, PhaseTabBar, three-column layout | Persistent navigation, single phase indicator |
| **Phase 2: Core UX** | Weeks 3-4 | PinnedQuestionCard, OrientationView, coach slide-up drawer | Solve the "where is my question?" problem |
| **Phase 3: Canvas** | Weeks 5-6 | StrategyCanvas, celebration overlays, responsive breakpoints | Living strategy feel, tablet support |
| **Phase 4: Polish** | Week 7 | Focus mode toggle, entrance animations, testing | Deep-focus option, brand polish |
| **Phase 5: Artifacts** | Weeks 8-10 | Interactive canvas, artifact materialisation, coach-canvas integration | Claude Artifacts-level AI workspace |

This roadmap delivers meaningful UX improvements at every phase. Phase 1-2 can be shipped as an incremental improvement. Phase 3-4 completes the full redesign. Phase 5 elevates the experience to best-in-class AI coaching UX.

### Final Assessment

Option C's three-column persistent layout is the right architectural choice for a B2B strategic coaching platform serving enterprise product leaders. It matches the mental models these users have built across years of using Notion, Salesforce, Jira, and similar tools. It provides persistent wayfinding, simultaneous visibility of work and context, and a natural home for interactive strategy artifacts.

Option D is a more innovative design that would be appropriate for a consumer productivity tool or a mobile-first application. Its cognitive load management is genuinely superior, and its responsive architecture is more elegant. However, innovation in layout architecture is not what Frontera's users need. They need a reliable, information-dense, spatially consistent workspace where strategic thinking happens over multi-hour sessions. Option C delivers this.

The 7.6-point gap in weighted scoring (80.6 vs 73.0) is meaningful but not decisive. What is decisive is the risk profile: Option C delivers 90% of the UX improvement at 55% of the effort, with significantly lower implementation risk, lower UX risk (no mode disorientation), and a natural evolution path to the Artifacts-inspired interactive workspace.

**Recommendation: Proceed with Option C, incorporating the five enhancements identified above, delivered in the five-phase roadmap.**

---

*This analysis was conducted independently against the provided materials and Frontera design system documentation. No prior involvement in the design process or access to user research data beyond what is cited in the UX Analysis document.*
