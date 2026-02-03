# PRD: Expert Perspectives — Contextual Podcast Citations

**Version**: 1.0
**Date**: January 31, 2026
**Status**: Draft
**Author**: Frontera Product Team
**Feature Flag**: `expert_perspectives`

---

## 1. Overview & Problem Statement

### Problem
Frontera's Strategy Coach provides methodology-driven coaching, but its guidance is generic — it doesn't reference how real practitioners have navigated similar strategic decisions. Users receive framework-based advice without the grounding of real-world experience.

### Solution
**Expert Perspectives** indexes all 301 podcast transcripts from Lenny's Podcast as expert knowledge. During the Research and Synthesis phases, the coach automatically surfaces relevant expert quotes and perspectives using a new `[Expert:Speaker — Topic]` citation format. An "Expert Sources" panel in the Canvas shows which podcast insights informed each recommendation.

### Value Proposition
Transforms coaching from template-driven methodology into advice grounded in practitioner experience from 301 podcast episodes featuring leaders at Meta, GitHub, Canva, Linear, Notion, TikTok, Shopify, Figma, Superhuman, and hundreds of other companies.

---

## 2. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-1.1 | As a product leader, I want the coach to reference real expert perspectives when I'm exploring research territories, so that I can learn from practitioners who've faced similar challenges. | P0 |
| US-1.2 | As a strategist, I want to see which expert insights informed each strategic opportunity in Synthesis, so that I can evaluate the quality of evidence behind recommendations. | P0 |
| US-1.3 | As a user, I want to browse an Expert Sources panel to see all podcast insights that are relevant to my current strategy, so that I can explore them independently. | P1 |
| US-1.4 | As a user, I want to filter expert perspectives by speaker, company, or topic, so that I can focus on the most relevant expertise. | P1 |
| US-1.5 | As a user, I want to click an expert citation to see the full quote and source context, so that I can understand the original context of the advice. | P1 |
| US-1.6 | As an admin, I want to manage the expert knowledge base (add/remove transcripts), so that the citation library stays current and relevant. | P2 |
| US-1.7 | As a user in Discovery, I want the coach to mention that expert perspectives will become available in Research, so that I'm motivated to progress through the methodology. | P2 |

---

## 3. Functional Requirements

### 3.1 Transcript Ingestion & Indexing

| ID | Requirement |
|----|------------|
| FR-1.01 | System SHALL ingest plain text transcript files and chunk them into segments of 500-1000 tokens |
| FR-1.02 | Each chunk SHALL be tagged with: speaker name, company, topic tags, transcript filename, approximate position |
| FR-1.03 | System SHALL store indexed chunks in a queryable format with metadata for retrieval |
| FR-1.04 | System SHALL support adding new transcripts without reprocessing existing ones |
| FR-1.05 | Initial ingestion SHALL process all 301 transcripts from the Lenny's Podcast archive |

### 3.2 Expert Citation in Coaching

| ID | Requirement |
|----|------------|
| FR-1.06 | During Research phase, the coach SHALL retrieve relevant expert chunks based on the current territory and research area context |
| FR-1.07 | Expert citations SHALL use the format `[Expert:Speaker Name — Topic]` in coach responses |
| FR-1.08 | The coach SHALL weave expert perspectives naturally into guidance, not as standalone quotes |
| FR-1.09 | The coach SHALL cite a maximum of 2-3 expert perspectives per response to avoid overwhelming users |
| FR-1.10 | Expert citations SHALL be clickable in the chat UI, expanding to show the full quote and source |

### 3.3 Synthesis Integration

| ID | Requirement |
|----|------------|
| FR-1.11 | Strategic opportunities in Synthesis SHALL include expert citations in their evidence trails alongside `[Territory:Area]` and `[Doc:filename]` citations |
| FR-1.12 | Each opportunity's evidence trail SHALL distinguish between user research evidence and expert evidence |
| FR-1.13 | Strategic tensions SHALL reference relevant expert perspectives that support each side |

### 3.4 Expert Sources Panel

| ID | Requirement |
|----|------------|
| FR-1.14 | A new "Expert Sources" tab/panel SHALL be available in the Canvas during Research and Synthesis phases |
| FR-1.15 | The panel SHALL display experts grouped by relevance to the user's current strategy context |
| FR-1.16 | Each expert card SHALL show: name, company/role, relevance summary, number of citations used |
| FR-1.17 | Users SHALL be able to filter experts by: speaker, company, topic, territory relevance |
| FR-1.18 | Clicking an expert card SHALL expand to show all relevant quotes from that speaker |

---

## 4. Technical Requirements

### 4.1 Database Schema

**New table: `expert_knowledge_chunks`**
```sql
CREATE TABLE expert_knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_filename TEXT NOT NULL,
  speaker_name TEXT NOT NULL,
  speaker_company TEXT,
  speaker_role TEXT,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  topic_tags TEXT[] DEFAULT '{}',
  industry_tags TEXT[] DEFAULT '{}',
  phase_relevance TEXT[] DEFAULT '{}',
  territory_relevance TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expert_chunks_speaker ON expert_knowledge_chunks(speaker_name);
CREATE INDEX idx_expert_chunks_topics ON expert_knowledge_chunks USING GIN(topic_tags);
CREATE INDEX idx_expert_chunks_territory ON expert_knowledge_chunks USING GIN(territory_relevance);
```

**New table: `expert_citations`**
```sql
CREATE TABLE expert_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  chunk_id UUID REFERENCES expert_knowledge_chunks(id),
  message_id UUID REFERENCES conversation_messages(id),
  synthesis_output_id UUID,
  citation_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/product-strategy-agent/expert-knowledge` | GET | Retrieve relevant expert chunks for conversation context |
| `/api/product-strategy-agent/expert-knowledge/ingest` | POST | Ingest new transcript file (admin) |
| `/api/product-strategy-agent/expert-citations` | GET | Get all citations for a conversation |

### 4.3 Key Files to Modify

| File | Change |
|------|--------|
| `src/lib/agents/strategy-coach/system-prompt.ts` | Add `## Expert Knowledge` section with retrieved chunks; call new `loadExpertInsights()` |
| `src/lib/agents/strategy-coach/client-context.ts` | Add `loadExpertInsights(conversationId, territory, researchArea)` function |
| `src/components/product-strategy-agent/CanvasPanel/ResearchSection.tsx` | Render expert citations in coach messages |
| `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx` | Add Expert Sources panel; include expert evidence in opportunity trails |
| `src/types/database.ts` | Add `ExpertKnowledgeChunk` and `ExpertCitation` interfaces |

### 4.4 New Files

| File | Purpose |
|------|---------|
| `src/lib/knowledge/expert-index.ts` | Transcript chunking, tagging, and retrieval logic |
| `src/lib/knowledge/expert-retrieval.ts` | Similarity search and relevance ranking |
| `src/app/api/product-strategy-agent/expert-knowledge/route.ts` | API endpoint |
| `src/components/product-strategy-agent/CanvasPanel/ExpertSourcesPanel.tsx` | Expert Sources UI |
| `scripts/ingest-transcripts.ts` | One-time ingestion script |

---

## 5. Acceptance Criteria

| ID | Criteria |
|----|---------|
| AC-1.01 | All 301 transcript files are ingested with speaker metadata and topic tags |
| AC-1.02 | Coach cites relevant experts during Research phase territory exploration |
| AC-1.03 | Citations use `[Expert:Speaker — Topic]` format consistently |
| AC-1.04 | Clicking a citation expands to show full quote and source context |
| AC-1.05 | Synthesis evidence trails include expert citations alongside user research |
| AC-1.06 | Expert Sources panel displays in Canvas during Research and Synthesis phases |
| AC-1.07 | Expert panel supports filtering by speaker, topic, and territory |
| AC-1.08 | Coach limits expert citations to 2-3 per response |
| AC-1.09 | Expert citations are contextually relevant (not random) to the user's research area |
| AC-1.10 | Feature is gated behind `expert_perspectives` feature flag |
| AC-1.11 | No expert citations appear in Discovery or Strategic Bets phases |

---

## 6. Dependencies & Assumptions

### Dependencies
- Supabase `pgvector` extension for embedding-based retrieval (or keyword-based fallback)
- Anthropic API for generating topic tags during ingestion
- Existing evidence linking infrastructure in system prompt and UI

### Assumptions
- Transcripts are available as plain text files in the archive directory
- Expert knowledge is supplementary — it enhances but never replaces user's own research
- 301 transcripts provide sufficient coverage for common strategic topics
- No licensing restrictions on using transcript content for AI-assisted coaching

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Expert citation relevance score (LLM-judge) | ≥ 0.80 | AI eval test suite |
| User engagement with Expert Sources panel | ≥ 30% of sessions click at least 1 citation | PostHog tracking |
| Coach response quality improvement | ≥ 10% increase in completeness eval scores | AI eval comparison |
| Time in Research phase | No increase (citations should accelerate, not slow down) | PostHog timing |
| User satisfaction (NPS impact) | ≥ +5 point lift for users with feature enabled | Survey |

---

## 8. Out of Scope

- Audio playback of podcast segments
- Real-time transcript ingestion from podcast RSS feeds
- User-uploaded podcast transcripts (admin-only for v1)
- Expert perspective weighting based on recency
- Multi-language transcript support
- Embedding fine-tuning on strategic coaching domain

---

## Appendix: Full Transcript Archive (301 Episodes)

The complete archive includes 301 podcast transcripts. Below are speakers organized by category.

### Founders & CEOs
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Amjad Masad | CEO, Replit | Amjad Masad.txt |
| Andrew Wilkinson | Tiny Capital | Andrew Wilkinson.txt |
| Ben Horowitz | Andreessen Horowitz | Ben Horowitz.txt |
| Bret Taylor | CEO, Sierra AI / ex-Salesforce | Bret Taylor.txt |
| Brian Chesky | CEO, Airbnb | Brian Chesky.txt |
| Cameron Adams | CPO/Co-founder, Canva | Cam Adams.txt |
| Dalton Caldwell | Y Combinator | Dalton Caldwell.txt |
| Dharmesh Shah | CTO/Co-founder, HubSpot | Dharmesh Shah.txt |
| Drew Houston | CEO, Dropbox | Drew Houston.txt |
| Dylan Field | CEO, Figma | Dylan Field.txt, Dylan Field 2.0.txt |
| Eoghan McCabe | CEO, Intercom | Eoghan McCabe.txt |
| Eric Ries | Author, The Lean Startup | Eric Ries.txt |
| Eric Simons | CEO, StackBlitz | Eric Simons.txt |
| Grant Lee | CEO, Gamma | Grant Lee.txt |
| Guillermo Rauch | CEO, Vercel | Guillermo Rauch.txt |
| Howie Liu | CEO, Airtable | Howie Liu.txt |
| Ivan Zhao | CEO, Notion | Ivan Zhao.txt |
| Jason Cohen | Founder, WP Engine | Jason Cohen.txt |
| Jason Fried | CEO, 37signals/Basecamp | Jason Fried.txt |
| Jessica Livingston | Co-founder, Y Combinator | Jessica Livingston.txt |
| Josh Miller | CEO, The Browser Company | Josh Miller.txt |
| Karri Saarinen | CEO, Linear | Karri Saarinen.txt |
| Laura Modi | CEO, Bobbie | Laura Modi.txt |
| Marc Andreessen | a16z | Marc Andreessen.txt |
| Marc Benioff | CEO, Salesforce | Marc Benioff.txt |
| Matt Mullenweg | CEO, Automattic/WordPress | Matt Mullenweg.txt |
| Melanie Perkins | CEO, Canva | Melanie Perkins.txt |
| Mike Krieger | Co-founder, Instagram | Mike Krieger.txt |
| Rahul Vohra | CEO, Superhuman | Rahul Vohra.txt |
| Ryan Hoover | Founder, Product Hunt | Ryan Hoover.txt |
| Scott Wu | CEO, Cognition (Devin) | Scott Wu.txt |
| Seth Godin | Author, Marketing legend | Seth Godin.txt |
| Stewart Butterfield | CEO, Slack | Stewart Butterfield.txt |
| Tobi Lutke | CEO, Shopify | Tobi Lutke.txt |
| Uri Levine | Co-founder, Waze | Uri Levine.txt, Uri Levine 2.0.txt |

### Product Management & Strategy
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Annie Pearl | CPO, Calendly | Annie Pearl.txt |
| April Dunford | Positioning expert | April Dunford.txt, April Dunford 2.0.txt |
| Brandon Chu | VP Product, Shopify | Brandon Chu.txt |
| Casey Winters | CPO, Eventbrite | Casey Winters.txt, Casey Winters_.txt |
| Christian Idiodi | SVPG Partner | Christian Idiodi.txt |
| Christina Wodtke | Author, Radical Focus | Christina Wodtke.txt |
| Geoffrey Moore | Author, Crossing the Chasm | Geoffrey Moore.txt |
| Gibson Biddle | Ex-VP Product, Netflix | Gibson Biddle.txt |
| Hamilton Helmer | Author, 7 Powers | Hamilton Helmer.txt |
| Hilary Gridley | VP Product, Figma | Hilary Gridley.txt |
| Inbal Shani | CPO, GitHub | Inbal S.txt |
| Itamar Gilad | Product coach | Itamar Gilad.txt |
| Jackie Bavaro | Ex-PM, Asana/Google | Jackie Bavaro.txt |
| Jag Duggal | CPO, Nubank | Jag Duggal.txt |
| Janna Bastow | CEO, ProdPad | Janna Bastow.txt |
| Ken Norton | Ex-Google PM | Ken Norton.txt |
| Lane Shackleton | CPO, Coda | Lane Shackleton.txt |
| Maggie Crowley | VP Product, Toast | Maggie Crowley.txt |
| Marty Cagan | SVPG, Inspired/Empowered | Marty Cagan.txt, Marty Cagan 2.0.txt |
| Melissa Perri | Product consultant | Melissa.txt, Melissa Perri.txt, Melissa Perri + Denise Tilles.txt |
| Nan Yu | Head of Product, Linear | Nan Yu.txt |
| Nikhyl Singhal | VP Product, Meta | Nikhyl Singhal.txt |
| Noah Weiss | CPO, Slack | Noah Weiss.txt |
| Paige Costello | Head of Product AI, Asana | Paige Costello.txt |
| Peter Deng | VP Product, Uber/Meta | Peter Deng.txt |
| Petra Wille | Product leadership coach | Petra Wille.txt |
| Ravi Mehta | Ex-CPO, Tinder | Ravi Mehta.txt |
| Richard Rumelt | Strategy professor, Good Strategy Bad Strategy | Richard Rumelt.txt |
| Roger Martin | Strategy professor, Playing to Win | Roger Martin.txt |
| Ryan Singer | Shape Up methodology, ex-Basecamp | Ryan Singer.txt |
| Sachin Monga | VP Product, Meta | Sachin Monga.txt |
| Shaun Clowes | CPO, Atlassian | Shaun Clowes.txt |
| Shishir Mehrotra | CEO, Coda | Shishir Mehrotra.txt |
| Shreyas Doshi | Ex-PM, Stripe/Twitter | Shreyas Doshi.txt, Shreyas Doshi Live.txt |
| Teresa Torres | Author, Continuous Discovery Habits | Teresa Torres.txt |
| Vijay Iyengar | Head of Product, Mixpanel | Vijay.txt |

### Growth & Marketing
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Adam Fishman | Ex-VP Growth, Patreon | Adam Fishman.txt |
| Adam Grenier | Growth advisor | Adam Grenier.txt |
| Bangaly Kaba | Ex-Head of Growth, Instagram | Bangaly Kaba.txt |
| Brian Balfour | CEO, Reforge | Brian Balfour.txt |
| Carilu Dietrich | CMO advisor, ex-Atlassian | Carilu Dietrich.txt |
| Elena Verna | Growth advisor | Elena Verna 2.0.txt, Elena Verna 3.0.txt, Elena Verna 4.0.txt |
| Emily Kramer | Co-founder, MKT1 | Emily Kramer.txt |
| Fareed Mosavat | Ex-Slack, growth | Fareed Mosavat.txt |
| Georgiana Laudi | Founder, Forget The Funnel | Gia Laudi.txt |
| Gina Gotthilf | Co-founder, Latitud | Gina Gotthilf.txt |
| Gustaf Alstromer | YC Partner, ex-Airbnb Growth | Gustaf Alstromer.txt |
| Hila Qu | PLG Expert | Hila Qu.txt |
| Lulu Cheng Meservey | Head of Comms, Substack | Lulu Cheng Meservey.txt |
| Madhavan Ramanujam | Monetization expert | Madhavan Ramanujam.txt, Madhavan Ramanujam 2.0.txt |
| Nilan Peiris | CPO, Wise | Nilan Peiris.txt |
| Patrick Campbell | CEO, ProfitWell | Patrick Campbell.txt |
| Sean Ellis | Author, Hacking Growth | Sean Ellis.txt |
| Yuriy Timen | Ex-VP Growth, Grammarly | Yuriy Timen.txt |

### AI & Technology
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Anton Osika | CEO, Lovable/GPT Engineer | Anton Osika.txt |
| Benjamin Mann | Co-founder, Anthropic | Benjamin Mann.txt |
| Chip Huyen | AI/ML author | Chip Huyen.txt |
| Dan Shipper | CEO, Every / AI writer | Dan Shipper.txt |
| Dr. Fei Fei Li | Stanford AI, ex-Google | Dr. Fei Fei Li.txt |
| Hamel Husain & Shreya Shankar | AI engineering | Hamel Husain & Shreya Shankar.txt |
| Karina Nguyen | AI researcher | Karina Nguyen.txt |
| Logan Kilpatrick | OpenAI DevRel | Logan Kilpatrick.txt |
| Michael Truell | CEO, Cursor | Michael Truell.txt |
| Nick Turley | OpenAI | Nick Turley.txt |
| Sam Schillace | Microsoft, ex-Google Docs | Sam Schillace.txt |
| Sander Schulhoff | Prompt engineering | Sander Schulhoff.txt, Sander Schulhoff 2.0.txt |
| Scott Wu | CEO, Cognition (Devin) | Scott Wu.txt |
| Varun Mohan | CEO, Codeium | Varun Mohan.txt |

### Leadership & Management
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Alisa Cohn | Executive coach | Alisa Cohn.txt |
| Ami Vora | CPO, Faire | Ami Vora.txt |
| Andrew Bosworth (Boz) | CTO, Meta | Boz.txt |
| Annie Duke | Decision-making expert | Annie Duke.txt |
| Bill Carr | Ex-Amazon VP | Bill Carr.txt |
| Camille Fournier | Author, The Manager's Path | Camille Fournier.txt |
| Carole Robin | Stanford GSB, Interpersonal Dynamics | Carole Robin.txt |
| Chip Conley | Modern Elder Academy | Chip Conley.txt |
| Claire Hughes Johnson | Ex-Stripe COO | Claire Hughes Johnson.txt |
| Deb Liu | CEO, Ancestry | Deb Liu.txt |
| Graham Weaver | Stanford GSB | Graham Weaver.txt |
| Jeffrey Pfeffer | Stanford, Power | Jeffrey Pfeffer.txt |
| Jerry Colonna | CEO coach, Reboot | Jerry Colonna.txt |
| Joe Hudson | Emotional intelligence coach | Joe Hudson.txt |
| Julie Zhuo | Ex-VP Design, Meta | Julie Zhuo.txt, Julie Zhuo 2.0.txt |
| Kim Scott | Author, Radical Candor | Kim Scott.txt |
| Matt Mochary | CEO coach | Matt Mochary.txt |
| Molly Graham | Ex-Google/Facebook/Quip | Molly Graham.txt |
| Naomi Gleit | VP, Meta | Naomi Gleit.txt |
| Nir Eyal | Author, Hooked/Indistractable | Nir Eyal.txt |
| Wes Kao | Co-founder, Maven | Wes Kao.txt, Wes Kao 2.0.txt |
| Will Larson | CTO, Carta | Will Larson.txt |

### Engineering & Technical
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Austin Hay | Growth engineering | Austin Hay.txt |
| Dhanji R. Prasanna | Engineering leadership | Dhanji R. Prasanna.txt |
| Elizabeth Stone | CTO, Netflix | Elizabeth Stone.txt |
| Farhan Thawar | VP Eng, Shopify | Farhan Thawar.txt |
| Gergely Orosz | The Pragmatic Engineer | Gergely.txt |
| Gustav Söderström | CPO/CTO, Spotify | Gustav Söderström.txt |
| Nicole Forsgren | DORA metrics, DevEx | Nicole Forsgren.txt, Nicole Forsgren 2.0.txt |
| Ronny Kohavi | A/B testing expert | Ronny Kohavi.txt |
| Ryan J. Salva | GitHub, DevEx | Ryan J. Salva.txt |

### Design & UX
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Bob Baxley | Design leadership | Bob Baxley.txt |
| Jessica Hische | Designer/lettering | Jessica Hische.txt |
| Katie Dill | CDO, Stripe | Katie Dill.txt |
| Scott Belsky | CPO, Adobe | Scott Belsky.txt |
| Yuhki Yamashita | CPO, Figma | Yuhki Yamashata.txt |

### Sales & Go-to-Market
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Andy Raskin | Strategic narrative | Andy Raskin_.txt |
| Arielle Jackson | Messaging/positioning | Arielle Jackson.txt |
| Jen Abel | Founder-led sales | Jen Abel.txt, Jen Abel 2.0.txt |
| Matt Dixon | Author, The Challenger Sale | Matt Dixon.txt |
| Pete Kazanjy | Founder, Atrium/Modern Sales | Pete Kazanjy.txt |
| Sahil Mansuri | CEO, Bravado | Sahil Mansuri.txt |

### International & Marketplace
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Ebi Atawodi | GM, Uber | Ebi Atawodi.txt |
| Kevin Aluwi | CEO, GoJek | Kevin Aluwi.txt |
| Kunal Shah | CEO, CRED | Kunal Shah.txt |
| Ray Cao | Head of Monetization, TikTok | Ray Cao.txt |

### Career & Communication
| Speaker | Company/Role | Filename |
|---------|-------------|----------|
| Ethan Evans | Ex-Amazon VP | Ethan Evans 2.0.txt |
| Gergely Orosz | The Pragmatic Engineer | Gergely.txt |
| Matt Abrahams | Stanford, Communication | Matt Abrahams.txt |
| Matthew Dicks | Storytelling | Matthew Dicks.txt |
| Nancy Duarte | Presentation design | Nancy Duarte.txt |
| Paul Millerd | Author, The Pathless Path | Paul Millerd.txt |
| Tristan de Montebello | Speaking coach | Tristan de Montebello.txt |

### Additional Speakers (100+)
The archive includes 100+ additional speakers covering topics such as customer research (Bob Moesta, Phyl Terry), product analytics (Ramesh Johari, Sri Batchu, Edwin Chen), hiring & org design (Oji Udezue, Judd Antin, Megan Cook), marketplace strategy (Archie Abrams, Sanchan Saxena), pricing (Madhavan Ramanujam), investor perspectives (Sarah Tavel, Sam Lessin, Mike Maples Jr.), and many more. See the full file listing for the complete archive.

**Total: 301 transcript files covering 280+ unique speakers/episodes**
