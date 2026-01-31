# Frontera Omnichannel Strategy: PRD Executive Summary & Outline Plan

## Executive Summary

Frontera is currently a desktop-optimised B2B SaaS platform (1024px+ viewport) delivering AI-powered strategic coaching. To reach enterprise users wherever they work — in meetings (tablet), commuting (mobile), or at their desk (desktop) — we must evolve into a true omnichannel platform from day one.

**The opportunity:** Enterprise product leaders don't do strategic thinking only at their desk. They review synthesis outputs in taxis, answer research questions between meetings, and discuss territory insights on tablets during workshops. Frontera must meet them in these moments.

**The risk of inaction:** 59% of enterprise users expect "anywhere-anytime" access. Competitors who ship mobile-first coaching will capture attention during the 70% of the day users aren't at a desktop.

---

## Current State Assessment

| Dimension | Desktop | Tablet | Mobile | Grade |
|-----------|---------|--------|--------|-------|
| Layout | Two-panel coach+canvas | Falls back to mobile popup | Floating popup overlay | C+ |
| Navigation | Horizontal stepper | Same as desktop (overflow risk) | Cramped stepper | C |
| Input/Forms | Full textareas | No adaptation | No touch optimisation | D |
| Coaching Chat | Persistent side panel | Hidden behind popup | Hidden behind FAB | C |
| Territory Research | Full deep-dive with sidebar | No tablet layout | Not touch-optimised | D |
| Synthesis/Visualisations | Not yet built | N/A | N/A | F |
| Offline Support | None | None | None | F |
| Touch Gestures | N/A | None | None | F |

**Existing strengths:** The codebase already has a `useMediaQuery` hook with a 1024px breakpoint, Tailwind `md:` responsive classes in ~43 files, and mockup designs for mobile/tablet layouts in `Background/frontera-agent-mockups.md`.

---

## Strategic Approach: Progressive Enhancement with Shared Codebase

### Recommended Technical Architecture

**Phase 1 (Now → 3 months): Responsive Web + PWA**
- Mobile-first responsive redesign of existing Next.js app
- Progressive Web App (installable, offline-capable)
- Three breakpoint tiers: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)

**Phase 2 (3-6 months): Capacitor Native Wrapper**
- Wrap the responsive web app with Capacitor for App Store/Play Store presence
- Add native capabilities: push notifications, biometric auth, haptic feedback
- Single codebase serves web + iOS + Android

**Phase 3 (6-12 months): Evaluate Native Components**
- If usage data justifies, selectively replace performance-critical views with React Native components via Expo
- Keep the web app as primary, native for premium mobile experiences

### Why Not React Native / Expo from Day One?

| Factor | Next.js + Capacitor (Recommended) | Expo / React Native |
|--------|-----------------------------------|---------------------|
| Existing codebase | Reuse 100% of current code | Rewrite from scratch |
| Team skills | Current web team can execute | Requires RN specialists |
| Development cost | 40-60% cheaper than dual-native | Higher initial investment |
| Time to market | 2-3 months for responsive + PWA | 4-6 months for MVP |
| App Store presence | Via Capacitor wrapper | Native |
| Update speed | Instant web deploys | App Store review cycle |
| Performance | Good for business/coaching apps | Near-native animations |
| When to switch | If mobile becomes >40% of usage | Complex gestures/offline needed |

**Verdict:** Frontera's core value is strategic thinking and coaching conversations — these are content-heavy, text-driven interactions that perform well as responsive web. A native app is not justified until mobile usage data proves otherwise. The **Next.js + Capacitor + PWA** path gives us App Store presence, installability, and push notifications without a codebase rewrite.

---

## Omnichannel Design Strategy

### Design Philosophy: Device-Appropriate Experiences

Rather than cramming the desktop experience onto small screens, each device tier gets a purpose-built experience:

| Device | Primary Use Case | Experience Pattern |
|--------|-----------------|-------------------|
| **Mobile** (375-767px) | Review & respond — check progress, answer quick research questions, read coaching insights | Card-based vertical scroll, bottom sheet coach, swipe navigation |
| **Tablet** (768-1023px) | Workshop & collaborate — territory deep-dives in meetings, side-by-side coaching | 30/70 collapsible split, touch-optimised cards, landscape awareness |
| **Desktop** (1024px+) | Deep work — full research sessions, synthesis creation, document upload | Persistent two-panel, hover interactions, keyboard shortcuts |

### Cross-Device Journey Blending

**Scenario 1: "Morning Commute → Office Deep Work"**
- **Mobile (train):** Review overnight coaching suggestions, mark territories to explore
- **Desktop (office):** Pick up exactly where mobile left off, deep-dive into flagged territories
- **Sync:** `framework_state` already persists in Supabase — real-time sync via conversation polling

**Scenario 2: "Workshop Facilitation"**
- **Tablet (meeting room):** Display synthesis 2x2 matrix on screen, tap through opportunity cards
- **Mobile (participants):** Each team member answers research questions on their phones
- **Desktop (post-workshop):** Facilitator reviews all contributions, generates strategic bets

**Scenario 3: "Executive Review"**
- **Mobile (between meetings):** CEO reads AI-generated executive summary, approves strategic bet
- **Desktop (analyst):** Product team refines bet based on CEO feedback
- **Sync:** Push notifications alert users when new insights are ready

### Key UX Patterns by Device

#### Mobile Patterns
```
┌─────────────────────┐
│ ◀ Strategy Coach    │  ← Simplified header
├─────────────────────┤
│  ● ─ ● ─ ○ ─ ○     │  ← Compact horizontal stepper
│  Disc  Land  Syn Bet│
├─────────────────────┤
│                     │
│   [Phase Content]   │  ← Full-width scrollable
│   Card-based layout │
│   Vertical stacking │
│                     │
├─────────────────────┤
│  💬 Ask your coach  │  ← Bottom sheet (swipe up)
└─────────────────────┘
```

#### Tablet Patterns
```
┌──────────────────────────────────┐
│  Frontera    Strategy Coach  [≡] │
├──────────┬───────────────────────┤
│          │                       │
│  Coach   │   Canvas Content      │
│  Panel   │   Territory Cards     │
│  (30%)   │   Research Areas      │
│          │   (70%)               │
│ [Collapse│                       │
│  ◀ ]     │                       │
├──────────┴───────────────────────┤
│  Phase: Discovery ● ─ ○ ─ ○ ─ ○ │
└──────────────────────────────────┘
```

---

## PRD Outline: Frontera Omnichannel Platform

### 1. Introduction & Vision
- 1.1 Product vision: Strategic coaching accessible anywhere
- 1.2 Omnichannel definition for Frontera
- 1.3 Success metrics (mobile engagement, cross-device sessions, PWA installs)

### 2. User Research & Personas
- 2.1 Device usage patterns for enterprise product leaders
- 2.2 Mobile persona: "On-the-go reviewer" (VP checking insights between meetings)
- 2.3 Tablet persona: "Workshop facilitator" (Director leading strategy sessions)
- 2.4 Desktop persona: "Deep work strategist" (existing Maya/Tom personas)
- 2.5 Cross-device journey maps

### 3. Technical Architecture
- 3.1 Responsive web foundation (mobile-first Tailwind refactor)
- 3.2 PWA implementation (service worker, manifest, offline caching)
- 3.3 Capacitor native wrapper (push notifications, biometric auth)
- 3.4 Breakpoint strategy: 375px / 768px / 1024px / 1440px
- 3.5 Performance budgets per device tier
- 3.6 Future path to React Native (decision criteria and trigger points)

### 4. Design System Extensions
- 4.1 Touch target minimums (44px for all interactive elements)
- 4.2 Mobile typography scale
- 4.3 Responsive spacing tokens
- 4.4 Bottom sheet component pattern
- 4.5 Swipe gesture vocabulary
- 4.6 Adaptive colour considerations (Navy on small screens)
- 4.7 Mobile-specific component variants

### 5. Feature Adaptations by Phase

#### 5.1 Dashboard
- Mobile: Vertical card stack, simplified metrics
- Tablet: 2-column grid, touch-friendly tiles
- Desktop: Current 3-column grid (no change)

#### 5.2 Discovery Phase
- Mobile: Collapsible sections, camera-based document upload, voice input for research
- Tablet: Side-by-side document viewer + upload panel
- Desktop: Current layout (enhanced)

#### 5.3 Research / Landscape Phase
- Mobile: Territory cards as full-width swipeable carousel, research questions as focused single-question views
- Tablet: Territory sidebar collapses to tab bar, research areas as touch-friendly cards
- Desktop: Current sidebar + content layout

#### 5.4 Synthesis Phase
- Mobile: Simplified opportunity cards (no 2x2 matrix), swipeable insight feed
- Tablet: Touch-friendly 2x2 matrix with tap-to-expand
- Desktop: Full interactive matrix with hover details

#### 5.5 Strategic Bets Phase
- Mobile: Bet cards with swipe-to-approve/reject
- Tablet: Kanban-style board with drag-and-drop
- Desktop: Full bet builder with evidence linking

#### 5.6 Coaching Chat
- Mobile: Bottom sheet (swipe up from FAB), full-screen when expanded
- Tablet: Collapsible 30% side panel
- Desktop: Persistent 35% side panel (current)

### 6. Cross-Device Sync & Continuity
- 6.1 Real-time state sync via Supabase (already in place)
- 6.2 Push notifications for coaching nudges (Capacitor)
- 6.3 "Continue on desktop" prompts for complex tasks
- 6.4 Session handoff patterns

### 7. Offline & Performance
- 7.1 Service worker caching strategy (read-only offline access)
- 7.2 Optimistic UI for research question responses
- 7.3 Image/PDF lazy loading on mobile
- 7.4 Bundle size targets per device tier

### 8. Accessibility & Inclusivity
- 8.1 Touch target compliance (WCAG 2.2 Target Size)
- 8.2 Screen reader optimisations for mobile
- 8.3 Reduced motion preferences
- 8.4 Landscape/portrait orientation handling

### 9. Analytics & Measurement
- 9.1 Device-specific engagement tracking (PostHog)
- 9.2 Cross-device session attribution
- 9.3 Mobile vs desktop completion rates by phase
- 9.4 PWA install and retention metrics
- 9.5 Decision triggers for native app investment

### 10. Implementation Roadmap

#### Wave 1: Responsive Foundation (Weeks 1-4)
- Mobile-first Tailwind refactor of core layouts
- Bottom sheet coaching component
- Touch-optimised territory cards
- Compact mobile stepper
- Responsive dashboard tiles

#### Wave 2: PWA & Polish (Weeks 5-8)
- Service worker + web manifest
- Offline read access to synthesis outputs
- Push notification infrastructure (Capacitor prep)
- Tablet-specific layouts (30/70 split)
- Swipe gesture navigation

#### Wave 3: Native Wrapper (Weeks 9-12)
- Capacitor iOS + Android builds
- Push notifications
- Biometric authentication
- App Store submission
- Voice input for research responses

#### Wave 4: Cross-Device Intelligence (Weeks 13-16)
- "Continue on desktop" smart prompts
- Device-aware coaching (shorter responses on mobile)
- Mobile-optimised synthesis views
- Performance optimisation pass

### 11. Success Criteria
- 30%+ of active users access Frontera on mobile/tablet within 3 months
- PWA install rate >15% of mobile web visitors
- Cross-device session rate >20% (users active on 2+ devices)
- Mobile task completion rate within 80% of desktop rate
- Lighthouse mobile score >90

### 12. Risks & Mitigations
- **Risk:** Mobile coaching quality — long AI responses poor on small screens
  - **Mitigation:** Device-aware response formatting (bullet points, shorter paragraphs)
- **Risk:** Touch interaction complexity for territory deep-dives
  - **Mitigation:** Simplified single-question-per-screen flow on mobile
- **Risk:** App Store rejection for Capacitor wrapper
  - **Mitigation:** Add sufficient native functionality (push, biometric) to justify app status

---

## Industry Benchmarks Referenced

### Education Platforms (Coursera, Duolingo)
- Bite-sized content chunks for mobile (5-min sessions)
- Progress sync across devices (start on phone, continue on laptop)
- Gamification elements (streaks, badges) drive mobile engagement
- Offline download for content consumption

### Fitness Platforms (Peloton, MyFitnessPal)
- Quick-action mobile experiences (log workout, check plan)
- Rich media on tablet (video coaching, form analysis)
- Push notifications as engagement drivers
- Widget/glanceable data on mobile home screen

### Fintech Platforms (Robinhood, Revolut)
- Transaction start on one device, complete on another
- Biometric auth for seamless mobile access
- Simplified mobile dashboards vs. detailed desktop analytics
- Real-time push notifications for time-sensitive actions

### AI Coaching Platforms (BetterUp, CoachHub)
- Video coaching on all devices
- Micro-learning content optimised for mobile
- Reflection prompts via push notifications
- Session notes sync across devices

---

## Key Decision: Native App Timeline

**Build a native app when:**
1. Mobile users exceed 40% of total active users
2. Users request offline deep-work capabilities
3. Competitor launches native coaching app
4. Push notification engagement justifies native investment

**Until then:** PWA + Capacitor wrapper provides 90% of native capabilities at 40% of the cost.

---

## Sources & References

- [Fintech Design Guide 2026 - Eleken](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Omnichannel Communication Strategy 2026 - MHC](https://www.mhcautomation.com/blog/omnichannel-communication-strategy/)
- [Omnichannel Banking Strategy - Fresh Consulting](https://www.freshconsulting.com/insights/blog/omnichannel-banking-strategy-a-guide-to-integrated-banking-cx/)
- [Next.js + Capacitor vs Expo - NextNative](https://nextnative.dev/comparisons/nextjs-vs-expo)
- [PWA vs Native App Decision Guide 2025 - CIS](https://www.cisin.com/coffee-break/pros-and-cons-of-pwas-and-native-apps-to-make-the-right-choice.html)
- [PWA vs Native App - NextNative](https://nextnative.dev/comparisons/pwa-vs-native-app)
- [The New UI for Enterprise AI - Microsoft Design](https://microsoft.design/articles/the-new-ui-for-enterprise-ai/)
- [Enterprise UX Design Patterns - Onething Design](https://www.onething.design/post/top-7-enterprise-ux-design-patterns)
- [Omnichannel Strategy in UX - Aguayo](https://aguayo.co/en/blog-aguayo-user-experience/omnichannel-strategy-ux-context/)
- [Omnichannel Trends 2025 - Contentful](https://www.contentful.com/blog/omnichannel-trends/)
- Internal: `Background/frontera-agent-mockups.md` (mobile/tablet mockups)
- Internal: `Background/frontera-coaching-interface-research.md` (UX research)
- Internal: `Background/Product_Strategy_Agent_PRD_v2.1.md` (current PRD)
- Internal: `DESIGN_REVIEW_COACHING_UX.md` (design review feedback)
