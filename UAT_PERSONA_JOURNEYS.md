# Strategy Coach MVP - Persona-Based UAT Journeys

**Version:** 1.0
**Date:** January 25, 2026
**Purpose:** Complete end-to-end strategy journeys using Frontera buyer personas with synthetic data

---

## Overview

This document provides **three complete strategy journeys** using personas from the Frontera Buyer Personas research. Each journey includes:

1. **Persona Profile** - Who they are and their context
2. **Company Synthetic Data** - Pre-populated strategic context
3. **Discovery Phase Script** - What to say to the coach
4. **Research Phase Data** - Complete responses for all 6 research areas
5. **Expected Synthesis Outcomes** - What strategic insights should emerge
6. **Feedback Recording** - Template for capturing observations

Use these journeys to:
- Validate the complete user flow works end-to-end
- Test that AI coaching adapts to different industry contexts
- Verify synthesis quality across different company types
- Identify edge cases and usability issues

---

## Journey 1: Maya Okonkwo - The Ambitious Operator

### Persona Profile

| Attribute | Value |
|-----------|-------|
| **Name** | Maya Okonkwo |
| **Role** | VP of Product |
| **Company** | TechFlow Solutions |
| **Industry** | B2B SaaS |
| **Company Size** | 3,500 employees |
| **Location** | Edinburgh, UK |
| **Reports To** | Chief Product Officer |
| **Team Size** | 85 product managers, designers |

### Background Context
Maya came from a high-growth startup with a successful exit and is now in her first enterprise role. She's experiencing culture shock from startup pace to enterprise bureaucracy. She's accountable for £2.3M consultancy spend that delivered frameworks nobody uses, and must show ROI or risk career stall.

### Primary Goals
- Prove she can operate at enterprise scale
- Accelerate product velocity without sacrificing quality
- Make consultancy investment show actual returns
- Advance to CPO within 24 months

### Pain Points (for coaching context)
- Product managers lack strategic coaching
- Frameworks from consultants not landing with teams
- Strategy gets lost in translation to teams
- Measuring 'busy-ness' not outcomes

---

### Phase 1: Discovery - Conversation Script

**Opening Message Response:**
> "We're a B2B SaaS company that helps mid-market companies automate their procurement workflows. We've grown quickly to 3,500 employees but our product organisation feels stuck. We brought in consultants who gave us great frameworks, but honestly, nobody uses them day-to-day. I need to prove that we can operate at enterprise scale while keeping the product velocity we're known for. The board is watching."

**Follow-up Questions to Ask:**
1. "What metrics should I focus on to show product transformation is working?"
2. "How do I get my PMs to actually use strategic frameworks instead of just building features?"
3. "Our competitors are moving fast - how do I balance velocity with strategic discipline?"

**Coach Should Reference:**
- B2B SaaS industry dynamics
- Product manager capability development
- Framework adoption challenges
- Metrics-driven transformation

---

### Phase 2: Research - Complete Data Set

#### Company Territory

**Research Area: Industry Forces**

| Question | Response |
|----------|----------|
| What industry trends are creating urgency for transformation? | "The procurement SaaS market is consolidating rapidly. Three of our mid-tier competitors were acquired in the last 18 months. AI is disrupting traditional workflow automation - customers now expect intelligent recommendations, not just digitized processes. Procurement teams are being asked to do more with less headcount." |
| What technology trends are shaping your industry? | "AI/ML for spend analysis and supplier risk prediction. API-first architectures enabling deeper ERP integrations. Real-time collaboration tools replacing email-based approval chains. ESG compliance becoming a procurement requirement, not a nice-to-have." |
| What regulatory forces affect your product strategy? | "GDPR compliance for supplier data handling is table stakes. The EU's Digital Services Act is adding new requirements for B2B marketplaces. Supply chain transparency regulations (like the German Supply Chain Act) are creating new feature requirements. SOC 2 Type II is now expected by enterprise buyers." |

**Research Area: Business Model**

| Question | Response |
|----------|----------|
| How do you generate revenue today? | "Primarily subscription SaaS with per-seat pricing for the core platform (£50-150/user/month). Add-on modules for advanced analytics (£20k/year), supplier management (£30k/year), and contract lifecycle management (£40k/year). Professional services for implementation (15% of ARR). We're at £85M ARR with 1,200 customers." |
| What is your competitive moat? | "Deep integrations with major ERPs (SAP, Oracle, NetSuite) that took years to build. A proprietary supplier database with risk scores for 2M+ suppliers. Our workflow engine that handles complex approval matrices. Strong brand recognition in UK mid-market." |
| What are your unit economics? | "Customer acquisition cost is £45k average. Gross margin is 78%. Net revenue retention is 108% - healthy expansion but we've seen some downsell pressure. Payback period is 18 months, which investors say is too long. Logo churn is 8% annually." |

**Research Area: Product Capabilities**

| Question | Response |
|----------|----------|
| What do you do exceptionally well that competitors can't easily replicate? | "Our ERP integration depth is unmatched - we handle edge cases in SAP that others simply can't. Our approval workflow engine can model any organisational hierarchy, no matter how complex. We have 8 years of procurement data that powers our benchmarking features." |
| Where are your product capability gaps? | "Our mobile experience is embarrassingly outdated - the app was built 5 years ago and shows it. Our AI features are bolt-ons, not native to the platform. The user interface feels enterprise-clunky compared to newer entrants. We don't have native e-procurement (punchout) capabilities yet." |
| What product decisions have you made that you now regret? | "We built our own reporting engine instead of integrating with BI tools - it's a maintenance nightmare. We acquired a contract management startup but never properly integrated it - it's still running as a separate product. We over-customised for 3 large customers and now have technical debt." |

---

#### Customer Territory

**Research Area: Segments & Needs**

| Question | Response |
|----------|----------|
| Who are your primary customer segments? | "Segment 1: Mid-market companies (500-5000 employees) with decentralised procurement - our sweet spot. Segment 2: Private equity portfolio companies needing rapid procurement maturity. Segment 3: Growing enterprises outgrowing manual processes. We struggle to compete for true enterprise (10k+ employees)." |
| What jobs are customers trying to accomplish? | "Reduce maverick spend (purchases outside approved processes). Gain visibility into total spend across the organisation. Speed up procurement cycles without losing control. Prove compliance to auditors and regulators. Support strategic sourcing decisions with data." |
| What outcomes do customers measure success by? | "Procurement cycle time reduction (target: 40% faster). Spend under management percentage (target: 85%+). Cost savings captured through better pricing. Compliance audit pass rate. Supplier consolidation metrics." |

**Research Area: Experience Gaps**

| Question | Response |
|----------|----------|
| Where does your current product fall short? | "The learning curve is steep - new users struggle for weeks. Our analytics are backward-looking, not predictive. Mobile approval is clunky - managers often just wait until they're at their desk. Integration setup still requires professional services for most customers." |
| What workarounds do customers use? | "Excel shadow systems for quick analysis. Email chains for urgent approvals when the system is too slow. Manual invoice matching because our three-way match has gaps. Direct supplier calls instead of using our supplier portal." |
| What causes customer churn or dissatisfaction? | "Integration failures during ERP upgrades cause the most pain. Long implementation times (average 14 weeks) frustrate customers before they even start. Support response times for enterprise customers don't match their expectations. Lack of mobile parity is a constant complaint." |

**Research Area: Decision Drivers**

| Question | Response |
|----------|----------|
| What drives customers to choose your product? | "ERP integration depth is the #1 reason. Our supplier database and risk scoring. Referrals from other procurement professionals (strong word of mouth). Our compliance certifications (SOC 2, ISO 27001). UK-based support team for UK customers." |
| What objections do prospects raise? | "'Your pricing is higher than newer alternatives.' 'The UI looks dated compared to Coupa.' 'We're worried about implementation complexity.' 'Do you have AI features like [competitor]?' 'Your mobile app has poor reviews.'" |
| What drives expansion or upsell decisions? | "Successful initial deployment leads to adding more users (seat expansion). Adding new entities or subsidiaries to the platform. Compliance audits revealing gaps that our modules address. New CPO or CFO wanting consolidated visibility. Private equity roll-up requiring standardisation." |

---

### Expected Synthesis Outcomes

Based on this data, synthesis should identify:

**Strategic Opportunities:**
1. **Mobile-First Reimagining** (EXPLORE quadrant) - High market attractiveness, current capability gap
2. **AI-Native Platform** (EXPLORE quadrant) - Market demanding, significant build required
3. **Mid-Market Dominance** (INVEST quadrant) - Strong position, should double down
4. **PE Portfolio Companies** (INVEST quadrant) - Growing segment, good fit

**Strategic Tensions:**
1. "Customers want modern UI/UX BUT switching costs make them stay with current product"
2. "Market demands AI features BUT bolt-on approach creates technical debt"
3. "Need faster implementation BUT deep ERP integrations require time"

**WWHBT Assumptions:**
- "Mid-market customers will pay premium for deeper ERP integration"
- "Mobile-first redesign will reduce support tickets by 30%"
- "AI features can be built on existing data without full platform rewrite"

---

### Feedback Recording Template - Journey 1

```markdown
## Journey 1 Feedback: Maya Okonkwo (B2B SaaS)

**Tester:** _______________
**Date:** _______________
**Duration:** _______________

### Discovery Phase
- [ ] Opening message personalized correctly
- [ ] Coach asked relevant industry questions
- [ ] Tone was appropriate (confident, not patronizing)

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Research Phase
- [ ] Company Territory questions were relevant
- [ ] Customer Territory questions felt customer-centric
- [ ] Progress tracking worked correctly
- [ ] Data saved successfully

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Synthesis Phase
- [ ] Synthesis generated successfully (time: ___ seconds)
- [ ] Referenced specific research inputs
- [ ] Opportunities were strategic (not generic)
- [ ] Tensions identified real conflicts

**Quality Score (1-5):** ___

**Most Valuable Insight:**
_________________________________________________________________

**Missing or Wrong:**
_________________________________________________________________

### Overall Journey
**Completion Status:** [ Complete / Partial / Failed ]
**Would Recommend to Maya Persona:** [ Yes / No / Maybe ]
**Critical Issues Found:**
_________________________________________________________________
```

---

## Journey 2: Tom Aldridge - The Change-Weary Practitioner

### Persona Profile

| Attribute | Value |
|-----------|-------|
| **Name** | Tom Aldridge |
| **Role** | Head of Engineering |
| **Company** | MediCare Systems |
| **Industry** | Healthcare Technology |
| **Company Size** | 6,200 employees |
| **Location** | Bristol, UK |
| **Reports To** | CTO |
| **Team Size** | 320 engineers, architects, engineering managers |

### Background Context
Tom has 20+ years as engineer, last 10 in leadership. He's survived 3 "agile transformations" that were all abandoned within months. He's deeply skeptical of product/process changes but respected by engineers. Seen as a blocker by product leadership but values pragmatism over innovation theater.

### Primary Goals
- Protect his teams from disruptive, failing initiatives
- Deliver technical excellence without flavor-of-the-month distractions
- Improve product-engineering collaboration (but skeptical of 'product thinking')

### Pain Points (for coaching context)
- Constant process changes that don't stick
- Engineers cynical about 'transformation'
- Product-engineering tension from misaligned priorities
- Time wasted on training that doesn't apply

---

### Phase 1: Discovery - Conversation Script

**Opening Message Response:**
> "Look, I'll be straight with you. I've been through three agile transformations that all failed. My engineers are cynical about anything with the word 'transformation' in it. But our CTO insisted we try this, so here I am. We make healthcare software - patient management systems for NHS trusts and private hospitals. Our real problem isn't process - it's that product and engineering aren't speaking the same language. We spend half our time in alignment meetings that don't align anything."

**Follow-up Questions to Ask:**
1. "What's different about this approach? I've seen a lot of frameworks that look good on slides."
2. "How does this help my engineers build better software, not just attend more meetings?"
3. "Our biggest issue is unclear requirements from product. Can you actually fix that?"

**Coach Should:**
- Acknowledge his skepticism directly
- Avoid buzzwords and transformation-speak
- Focus on engineering value, not overhead
- Show how the approach reduces misalignment

---

### Phase 2: Research - Complete Data Set

#### Company Territory

**Research Area: Industry Forces**

| Question | Response |
|----------|----------|
| What industry trends are creating urgency for transformation? | "NHS digitisation agenda (the 10-year plan) is creating massive demand but also massive compliance requirements. COVID accelerated telehealth expectations permanently. Interoperability requirements (FHIR standards) are becoming mandatory. Cybersecurity threats to healthcare data are escalating - we had two attempted breaches last quarter." |
| What technology trends are shaping your industry? | "FHIR-based interoperability is non-negotiable now. Cloud migration for NHS systems is finally happening. AI for clinical decision support is coming but we're years from regulation clarity. Mobile-first patient engagement expectations. Integration with wearables and remote monitoring devices." |
| What regulatory forces affect your product strategy? | "NHS Data Security and Protection Toolkit - annual compliance required. GDPR for patient data. MHRA software as medical device regulations (we have 2 products that qualify). CE marking requirements post-Brexit. Clinical safety standards (DCB 0129/0160)." |

**Research Area: Business Model**

| Question | Response |
|----------|----------|
| How do you generate revenue today? | "Enterprise software licenses to NHS trusts (£200k-2M per trust). Maintenance and support contracts (18% of license value annually). Implementation services (mandatory for new deployments). Training and certification programmes. We're at £120M revenue with 85% from NHS, 15% from private sector." |
| What is your competitive moat? | "We've been in this market for 22 years - we understand NHS procurement better than anyone. Our systems are deployed in 40% of NHS acute trusts. We have established clinical governance frameworks. Strong relationships with NHS Digital and NHSX. Our uptime record (99.97% over 5 years)." |
| What are your unit economics? | "Long sales cycles (18-36 months) but high lifetime value. Gross margin around 65% due to heavy professional services component. Customer retention is 95%+ but growth is slow (NHS budget constraints). Implementation cost is too high - we need to reduce it by 30%." |

**Research Area: Product Capabilities**

| Question | Response |
|----------|----------|
| What do you do exceptionally well that competitors can't easily replicate? | "Deep integration with NHS Spine and PDS (Patient Demographics Service). 22 years of clinical workflow knowledge encoded in our systems. Proven ability to pass stringent NHS security assessments. A team of 40 clinical safety specialists who understand both technology and healthcare." |
| Where are your product capability gaps? | "Our user interface was designed in 2012 and it shows. We're not mobile-friendly - clinicians complain constantly. Our APIs are SOAP-based, not REST - modern interoperability is painful. Cloud deployment is still immature - we're primarily on-premise. Analytics are basic compared to newer entrants." |
| What product decisions have you made that you now regret? | "Building on Oracle database exclusively - we're locked in and it's expensive. Not investing in UX earlier - we're now playing catch-up. Our monolithic architecture makes changes slow and risky. Not building mobile-first when tablets entered clinical settings." |

---

#### Customer Territory

**Research Area: Segments & Needs**

| Question | Response |
|----------|----------|
| Who are your primary customer segments? | "NHS acute trusts (our core - 120+ hospitals). NHS community and mental health trusts (growing segment). Private hospital groups (Nuffield, Spire - faster buying cycles). GP federations (emerging but small contracts). Social care providers (new market we're exploring)." |
| What jobs are customers trying to accomplish? | "Ensure patient safety through accurate, accessible records. Meet regulatory compliance and reporting requirements. Reduce clinician administrative burden. Enable coordinated care across organisations. Support digital transformation initiatives mandated by NHS England." |
| What outcomes do customers measure success by? | "Patient safety incidents related to IT systems (target: zero). System availability during clinical hours. Clinician satisfaction scores. Time to access patient records. Regulatory audit results. Cost per transaction for administrative tasks." |

**Research Area: Experience Gaps**

| Question | Response |
|----------|----------|
| Where does your current product fall short? | "Clinicians find the interface unintuitive - takes 15+ clicks for common tasks. Ward-based tablets can't run our full system properly. Interoperability with GP systems is manual and error-prone. Reporting requires IT department involvement for anything non-standard." |
| What workarounds do customers use? | "Paper-based backup processes during our system downtime. Personal mobile devices for quick communication (shadow IT). Excel extracts for custom reporting. Direct phone calls between organisations instead of digital referrals. Printing patient summaries to carry between wards." |
| What causes customer churn or dissatisfaction? | "Slow responsiveness to feature requests (18-month average). System performance degradation under load. Training requirements for new staff. Upgrade complexity that disrupts clinical operations. Perception that we don't understand modern healthcare delivery." |

**Research Area: Decision Drivers**

| Question | Response |
|----------|----------|
| What drives customers to choose your product? | "Proven track record with NHS. Compliance certifications already in place. Existing integrations with their other systems. Reference sites they can visit. Our clinical safety team that competitors lack. Understanding of NHS procurement process." |
| What objections do prospects raise? | "'Your system looks dated - our clinicians expect modern apps.' 'Can you really go cloud-native?' 'Your implementation timelines are too long.' 'Newer vendors promise AI features.' 'Your mobile story is weak.'" |
| What drives expansion or upsell decisions? | "NHS trust mergers creating need for consolidated systems. New service lines (community, mental health) needing coverage. Regulatory requirements for new capabilities. Digital transformation funding becoming available. New CIO with modernisation mandate." |

---

### Expected Synthesis Outcomes

Based on this data, synthesis should identify:

**Strategic Opportunities:**
1. **UX Modernisation Programme** (EXPLORE quadrant) - Critical gap, significant investment
2. **Mobile-First Clinical Apps** (EXPLORE quadrant) - High demand, capability gap
3. **Cloud-Native Architecture** (EXPLORE quadrant) - Market requirement, major rebuild
4. **NHS Trust Consolidation** (INVEST quadrant) - Strong position, capitalize

**Strategic Tensions:**
1. "Customers need modern UX BUT can't afford disruption to clinical workflows"
2. "Market demands cloud BUT NHS security requirements favour on-premise"
3. "Need faster delivery BUT regulatory compliance requires thoroughness"

**WWHBT Assumptions:**
- "Clinicians will adopt new mobile apps if training investment is made"
- "Cloud migration can be achieved without compromising NHS security compliance"
- "UX modernisation can happen incrementally without full platform rewrite"

---

### Feedback Recording Template - Journey 2

```markdown
## Journey 2 Feedback: Tom Aldridge (Healthcare)

**Tester:** _______________
**Date:** _______________
**Duration:** _______________

### Discovery Phase
- [ ] Coach handled skepticism appropriately
- [ ] Avoided buzzwords and jargon
- [ ] Focused on practical engineering value

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Research Phase
- [ ] Healthcare-specific context was understood
- [ ] Regulatory complexity was acknowledged
- [ ] NHS-specific terminology was handled

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Synthesis Phase
- [ ] Synthesis addressed engineering concerns
- [ ] Opportunities were realistic given constraints
- [ ] Regulatory considerations were factored in

**Quality Score (1-5):** ___

**Most Valuable Insight:**
_________________________________________________________________

**Missing or Wrong:**
_________________________________________________________________

### Overall Journey
**Completion Status:** [ Complete / Partial / Failed ]
**Would Recommend to Tom Persona:** [ Yes / No / Maybe ]
**Critical Issues Found:**
_________________________________________________________________
```

---

## Journey 3: Richard Thornton - The Board-Appointed Fixer

### Persona Profile

| Attribute | Value |
|-----------|-------|
| **Name** | Richard Thornton |
| **Role** | Chief Transformation Officer (Interim) |
| **Company** | Pemberton Financial Group |
| **Industry** | Financial Services |
| **Company Size** | 8,500 employees |
| **Location** | London, UK |
| **Reports To** | Board of Directors |
| **Time in Role** | 4 months |

### Background Context
Richard was brought in after a £12M failed transformation. He has board-level mandate and must deliver visible results in 6 months. He has 20+ years of turnaround experience and doesn't have time for slow processes. His reputation is on the line.

### Primary Goals
- Deliver measurable transformation outcomes in 6 months
- Stop the bleeding from previous failed initiative
- Build credible strategic roadmap for board
- Identify quick wins while building long-term capability

### Pain Points (for coaching context)
- Previous transformation was all vision, no execution
- Organisation has transformation fatigue
- Board wants evidence of progress, not more PowerPoints
- Competitors are gaining ground while we're distracted

---

### Phase 1: Discovery - Conversation Script

**Opening Message Response:**
> "I've been brought in to fix a £12M mess. The previous transformation was heavy on consultants and light on results. We're a wealth management and insurance group - old business, new competitors eating our lunch. I have 6 months to show the board this transformation is different. I don't need more frameworks - I need to understand where we're actually losing and what we can realistically fix. Be direct with me."

**Follow-up Questions to Ask:**
1. "What can we actually achieve in 6 months? Not aspirational - realistic."
2. "Where are wealth managers typically weakest in their digital transformation?"
3. "I need to prioritise ruthlessly. What's the framework for making those calls?"

**Coach Should:**
- Match his pace and directness
- Focus on outcomes, not process
- Provide time-bounded recommendations
- Challenge unrealistic expectations professionally

---

### Phase 2: Research - Complete Data Set

#### Company Territory

**Research Area: Industry Forces**

| Question | Response |
|----------|----------|
| What industry trends are creating urgency for transformation? | "Robo-advisors are commoditising basic wealth management - we've lost 15% of clients with <£100k portfolios. Consumer Duty regulations are forcing transparency in fees and outcomes. ESG investing expectations are transforming product requirements. Intergenerational wealth transfer means our client base is aging out." |
| What technology trends are shaping your industry? | "APIs enabling embedded finance - our competitors are appearing inside everyday apps. AI for portfolio optimisation and client service. Real-time data feeds replacing batch processing. Digital onboarding expectations - clients expect account opening in minutes, not weeks. Open Banking creating new data requirements." |
| What regulatory forces affect your product strategy? | "Consumer Duty (July 2023) requirements for demonstrating value. Senior Managers & Certification Regime accountability. GDPR and data portability requirements. FCA focus on operational resilience (PS21/3). Anti-money laundering requirements becoming more complex." |

**Research Area: Business Model**

| Question | Response |
|----------|----------|
| How do you generate revenue today? | "Advisory fees (percentage of AUM) for wealth management - 0.75-1.25% annually. Insurance premiums and commissions. Platform fees for our investment platform. Financial planning fees (fixed). We manage £45bn AUM across 180,000 clients. Revenue is £420M, but flat for 3 years." |
| What is your competitive moat? | "Trusted brand with 80-year history. Deep relationships with high-net-worth clients. Proprietary investment research team. Wide product range across wealth and insurance. Network of 400+ advisors with client relationships. Regulatory licenses and approvals already in place." |
| What are your unit economics? | "Cost-to-income ratio is 78% - we need to get to 65% to compete. Client acquisition cost has doubled in 5 years. Average advisor productivity is declining (fewer new clients per advisor). Technology spend is 12% of revenue but mostly maintenance. Advisor attrition is 18% - we're losing good people." |

**Research Area: Product Capabilities**

| Question | Response |
|----------|----------|
| What do you do exceptionally well that competitors can't easily replicate? | "Complex estate planning and trust services - we handle situations others can't. Integrated wealth-insurance advice (rare in UK market). Long-standing relationships with institutional investment managers. Tax planning expertise for high-net-worth clients. Understanding of UK regulatory landscape." |
| Where are your product capability gaps? | "Our client portal was built in 2015 and looks it. No mobile app - clients must use responsive web. Portfolio analytics are basic compared to fintechs. Client onboarding takes 3 weeks average. No self-service options for simple transactions. Reporting is inflexible and slow." |
| What product decisions have you made that you now regret? | "Outsourcing our technology platform to a vendor who went stagnant. Not building in-house digital capability earlier. Acquiring a robo-advisor startup but not integrating it. Over-customising our CRM system, making upgrades impossible. Underinvesting in data quality for 20 years." |

---

#### Customer Territory

**Research Area: Segments & Needs**

| Question | Response |
|----------|----------|
| Who are your primary customer segments? | "Mass affluent (£100k-500k investable) - 65% of client base, lowest margin. High net worth (£500k-5M) - 30% of clients, our sweet spot. Ultra-high net worth (£5M+) - 5% of clients, highest margin, most demanding. Business owners seeking exit planning. Retirees managing decumulation." |
| What jobs are customers trying to accomplish? | "Grow wealth while managing risk appropriately. Plan for retirement with confidence. Pass wealth to next generation efficiently. Protect assets from various risks (insurance). Navigate complex financial decisions with expert guidance. Understand and control their overall financial picture." |
| What outcomes do customers measure success by? | "Portfolio performance vs benchmarks. Confidence in financial security. Quality of advice when needed. Ease of managing their finances. Responsiveness when they have questions. Fees relative to value received." |

**Research Area: Experience Gaps**

| Question | Response |
|----------|----------|
| Where does your current product fall short? | "Clients can't see consolidated view of all their accounts. Simple requests require phone calls to advisors. Onboarding documentation is painful - multiple forms, wet signatures. Performance reporting is quarterly, not real-time. No integration with external accounts for full picture." |
| What workarounds do customers use? | "Personal spreadsheets to track their full portfolio. Direct calls to fund managers bypassing us. Using competitor apps just to get better portfolio views. Email chains for document exchange. Personal reminders for renewal dates we don't track for them." |
| What causes customer churn or dissatisfaction? | "Feeling like they're not getting value for fees paid. Poor digital experience compared to retail banks. Advisor turnover (losing 'their' advisor). Slow response times for queries. Lack of proactive communication. Competitors offering lower fees with similar service." |

**Research Area: Decision Drivers**

| Question | Response |
|----------|----------|
| What drives customers to choose your product? | "Referrals from existing clients (60% of new clients). Brand trust and longevity. Quality of individual advisor relationship. Integrated wealth-insurance proposition. Perception of expertise for complex situations. Local presence and accessibility." |
| What objections do prospects raise? | "'Your fees are higher than digital alternatives.' 'I've heard your technology is dated.' 'Can I manage simple things myself online?' 'How do I know I'm getting personal attention with 180k clients?' 'Your competitor has a better app.'" |
| What drives expansion or upsell decisions? | "Life events (inheritance, business sale, retirement). Consolidation of accounts from multiple providers. Next generation becoming clients. New financial needs (insurance, mortgage). Positive experience leading to trust with more assets. Tax or estate planning complexity increasing." |

---

### Expected Synthesis Outcomes

Based on this data, synthesis should identify:

**Strategic Opportunities:**
1. **Client Portal Modernisation** (INVEST quadrant) - Achievable in 6 months, high impact
2. **Digital Onboarding** (INVEST quadrant) - Clear ROI, competitive necessity
3. **Self-Service for Simple Transactions** (INVEST quadrant) - Reduces costs, improves satisfaction
4. **Wealth-Insurance Integration** (HARVEST quadrant) - Existing strength, don't over-invest
5. **Next-Gen Client Acquisition** (EXPLORE quadrant) - Important but longer term

**Strategic Tensions:**
1. "Need modern digital experience BUT high-touch service is brand differentiator"
2. "Must reduce costs BUT client relationships require human advisors"
3. "6-month timeline BUT meaningful change takes longer"

**WWHBT Assumptions:**
- "Clients will adopt digital self-service for simple transactions"
- "Advisor time freed by automation will convert to higher-value activities"
- "Modern portal will reduce churn among mass-affluent segment"

**6-Month Quick Wins (should recommend):**
1. Client portal refresh (visible improvement)
2. Digital document signing for onboarding
3. Real-time portfolio view (no wet signatures)
4. Automated appointment scheduling

---

### Feedback Recording Template - Journey 3

```markdown
## Journey 3 Feedback: Richard Thornton (Financial Services)

**Tester:** _______________
**Date:** _______________
**Duration:** _______________

### Discovery Phase
- [ ] Coach matched his direct, urgent tone
- [ ] Avoided fluffy transformation language
- [ ] Focused on time-bounded outcomes

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Research Phase
- [ ] Financial services context was understood
- [ ] Regulatory complexity was acknowledged
- [ ] Urgency was reflected in guidance

**Observations:**
_________________________________________________________________
_________________________________________________________________

### Synthesis Phase
- [ ] Synthesis provided actionable 6-month priorities
- [ ] Quick wins were identified
- [ ] Longer-term items were appropriately deferred

**Quality Score (1-5):** ___

**Most Valuable Insight:**
_________________________________________________________________

**Missing or Wrong:**
_________________________________________________________________

### Overall Journey
**Completion Status:** [ Complete / Partial / Failed ]
**Would Recommend to Richard Persona:** [ Yes / No / Maybe ]
**Critical Issues Found:**
_________________________________________________________________
```

---

## Consolidated Feedback Summary

After completing all three journeys, use this template to summarize findings:

```markdown
# UAT Consolidated Feedback Report

**Date:** _______________
**Tester(s):** _______________
**Environment:** localhost:3000 / staging / production

## Summary Statistics

| Metric | Journey 1 (Maya) | Journey 2 (Tom) | Journey 3 (Richard) | Average |
|--------|------------------|-----------------|---------------------|---------|
| Completion Time | ___ min | ___ min | ___ min | ___ min |
| Synthesis Quality (1-5) | ___ | ___ | ___ | ___ |
| Coach Relevance (1-5) | ___ | ___ | ___ | ___ |
| Would Recommend | Y/N/M | Y/N/M | Y/N/M | - |
| Critical Bugs | ___ | ___ | ___ | ___ |

## Cross-Journey Observations

### What Worked Well Across All Journeys
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

### What Needs Improvement Across All Journeys
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

### Industry-Specific Observations
- **B2B SaaS (Maya):** ____________________________________________
- **Healthcare (Tom):** ____________________________________________
- **Financial Services (Richard):** ________________________________

## Critical Issues (Must Fix)

| Issue | Journey | Severity | Description |
|-------|---------|----------|-------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Enhancement Suggestions (Nice to Have)

| Suggestion | Journey | Impact | Effort |
|------------|---------|--------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## AI Coaching Quality Assessment

### Relevance to Industry Context
- [ ] Coach demonstrated understanding of industry
- [ ] Terminology was appropriate
- [ ] Examples were relevant

### Tone and Style
- [ ] Matched persona communication preferences
- [ ] Avoided generic advice
- [ ] Challenged appropriately without being patronizing

### Strategic Depth
- [ ] Insights were non-obvious
- [ ] Recommendations were actionable
- [ ] Trade-offs were acknowledged

## Final Recommendation

**Overall UAT Status:** [ PASS / PASS WITH ISSUES / FAIL ]

**Readiness for Production:** [ Ready / Ready with fixes / Not ready ]

**Priority Actions Before Launch:**
1. _________________________________________________________________
2. _________________________________________________________________
3. _________________________________________________________________

---

**Reviewer:** _______________
**Date:** _______________
**Signature:** _______________
```

---

## Appendix A: Test Data Quick Reference

### Journey 1: Maya Okonkwo (TechFlow Solutions)
- Industry: B2B SaaS
- Product: Procurement workflow automation
- ARR: £85M
- Employees: 3,500
- Key Theme: Product velocity + framework adoption

### Journey 2: Tom Aldridge (MediCare Systems)
- Industry: Healthcare Technology
- Product: NHS patient management systems
- Revenue: £120M
- Employees: 6,200
- Key Theme: Engineering pragmatism + skepticism

### Journey 3: Richard Thornton (Pemberton Financial Group)
- Industry: Financial Services
- Product: Wealth management + insurance
- AUM: £45bn
- Employees: 8,500
- Key Theme: Urgent turnaround + 6-month delivery

---

## Appendix B: Expected AI Behaviors

### Discovery Phase Coach Should:
- Personalize greeting with name and company
- Ask about transformation urgency
- Acknowledge industry-specific challenges
- Explain methodology briefly when asked
- Match persona's communication style

### Research Phase Coach Should:
- Reference completed research areas
- Suggest which territory to explore next
- Challenge surface-level responses
- Celebrate progress genuinely (not excessively)
- Guide toward synthesis when ready

### Synthesis Phase Coach Should:
- Reference specific synthesis findings
- Help prioritize opportunities
- Challenge assumptions
- Guide toward Strategic Bets format
- Acknowledge trade-offs and tensions

---

**Document Version:** 1.0
**Created:** January 25, 2026
**Author:** Frontera Platform Team
