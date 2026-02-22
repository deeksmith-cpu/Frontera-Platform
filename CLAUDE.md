# Frontera Platform

Frontera is a B2B SaaS platform that provides AI-powered strategic coaching for enterprise product transformation. It helps organizations bridge the gap between strategic vision and operational execution.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk (with organizations support)
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Analytics**: PostHog
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── conversations/ # Strategy Coach chat API
│   │   ├── product-strategy-agent/ # Product Strategy Agent endpoints
│   │   │   ├── ai-research/  # AI Research Assistant (Claude-powered document discovery)
│   │   │   ├── materials/    # Uploaded materials management
│   │   │   ├── phase/        # Phase transition management
│   │   │   ├── territories/  # Territory insights (Company, Customer, Competitor)
│   │   │   └── upload/       # File and URL upload handler
│   │   ├── admin/        # Admin endpoints
│   │   ├── organizations/ # Org member management
│   │   └── webhooks/     # Clerk webhooks
│   ├── dashboard/        # Authenticated dashboard pages
│   │   ├── product-strategy-agent/ # Product Strategy Agent interface
│   │   ├── team/         # Team management
│   │   └── admin/        # Admin panel
│   ├── onboarding/       # Client onboarding wizard
│   ├── sign-in/          # Clerk sign-in
│   └── sign-up/          # Clerk sign-up
├── components/            # React components
│   └── product-strategy-agent/ # Product Strategy Agent UI components
│       ├── CanvasPanel/   # Right panel - methodology canvas
│       │   ├── DiscoverySection.tsx  # Discovery phase with AI Research Assistant
│       │   ├── ResearchSection.tsx   # Territory mapping (Company, Customer, Competitor)
│       │   ├── CustomerTerritoryDeepDive.tsx  # Customer territory research areas
│       │   └── TerritoryDeepDiveSidebar.tsx   # Territory navigation sidebar
│       └── CoachingPanel/ # Left panel - AI chat interface
├── lib/                   # Shared utilities
│   ├── agents/           # AI agent implementations
│   │   └── strategy-coach/ # Strategy Coach agent
│   └── analytics/        # PostHog tracking
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
│   └── database.ts       # Supabase schema types
└── middleware.ts          # Clerk auth middleware
```

## Key Features

### Strategy Coach (Primary Feature)
AI-powered coaching agent that guides users through product strategy transformation using the "Product Strategy Research Playbook" methodology:

**Methodology**: 4-phase journey - Discovery → Map Your Strategic Terrain → Synthesis → Strategic Bets
- **Discovery**: Context setting with document upload, AI research assistant, and strategic baseline
  - **Minimum Requirement**: At least 1 document outlining company name & performance
  - **AI Research Assistant**: Claude-powered document discovery from websites, news articles, and market reports
  - **Progress Tracking**: Visual checklist showing company context, strategic materials (required), and coaching conversations (recommended)
  - **Phase Transition**: Clear "Ready to Map Your Terrain" CTA appears when minimum requirements are met
- **Map Your Strategic Terrain**: Company, Customer, and Competitor territory mapping with deep-dive research areas
- **Synthesis**: Cross-pillar insight generation and strategic opportunity identification
- **Strategic Bets**: Hypothesis-driven planning with evidence linking

**Design Reference**:
- PRD v2.1: `Background/Product_Strategy_Agent_PRD_v2.1.md`
- Implementation Prompts: `Background/Frontera_Claude_Code_Prompts_v2.md`
- Mockup: `/dashboard/strategy-coach-v2`

Location: `src/lib/agents/strategy-coach/`

### Client Onboarding
Multi-step wizard for new client applications with admin approval workflow.

### Organization Management
Clerk-based multi-tenant architecture with team invitations and role management.

## Environment Variables

Required variables (see `.env.example`):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Anthropic API (Strategy Coach)
ANTHROPIC_API_KEY=

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Database Schema

Key tables in Supabase:

| Table | Purpose |
|-------|---------|
| `clients` | Organization profiles (linked to Clerk org) |
| `client_onboarding` | Onboarding applications |
| `conversations` | Strategy Coach chat sessions with `current_phase` and `framework_state` |
| `conversation_messages` | Individual chat messages |
| `uploaded_materials` | Discovery phase materials (files, URLs, AI-generated docs) |
| `phase_progress` | Phase completion tracking (discovery, research, synthesis, bets) |
| `territory_insights` | 3Cs research responses (company, customer, competitor territories) |
| `synthesis_outputs` | Generated opportunities, insights, and strategic bets |
| `strategic_outputs` | Final strategy documents |

**Key Schema Details:**
- `uploaded_materials.extracted_context`: JSONB field storing document content and metadata
  - For AI-generated documents: `{ text, source, generated_by, topics }`
- `conversations.framework_state`: JSONB field tracking methodology state across phases
- `territory_insights.responses`: JSONB field storing research area question responses

Types defined in `src/types/database.ts`.

## Architecture Decisions

### Authentication Flow
- Clerk handles all auth with organization support
- `clerk_org_id` is the foreign key linking to Supabase data
- Middleware protects `/dashboard/*` routes

### AI Agent Pattern
- Agents in `src/lib/agents/` are stateless functions
- Conversation state stored in `framework_state` JSONB column
- Streaming responses via ReadableStream API

### API Design
- All API routes under `src/app/api/`
- Use Supabase service role for server-side operations
- Clerk `auth()` for user context

## Design Principles

> **Last Updated**: January 29, 2026
> **Based On**: Brand Design Update v1 - Navy + Gold + Cyan

### Visual Identity

Frontera's design system creates a premium, authoritative, and distinctive aesthetic. The deep navy foundation communicates trust and strategic depth, while the gold accent conveys premium quality and forward momentum. Cyan serves as a supporting data/interactive color.

### Color Palette

**Primary Brand Colors:**
- **Frontera Navy** (`#1a1f3a`): Primary brand color, backgrounds, headings, key UI elements
- **Premium Gold** (`#fbbf24`): Primary accent, CTAs, highlights, premium features
- **Deep Blue** (`#2d3561`): Secondary brand, gradients, hover states

**Cyan Scale (Data/Interactive):**
- **Cyan 600** (`#0891b2`): Data visualization accent
- **Cyan 400** (`#22d3ee`): Interactive element highlights
- **Cyan 200** (`#a5f3fc`): Subtle backgrounds, borders
- **Cyan 50** (`#ecfeff`): Tint for panels and cards

**Neutral Colors:**
- **Slate 900** (`text-slate-900`): Primary text, headings
- **Slate 700** (`text-slate-700`): Secondary text, body content
- **Slate 600** (`text-slate-600`): Metadata, labels
- **Slate 500** (`text-slate-500`): Muted text
- **Slate 400** (`text-slate-400`): Placeholder text, timestamps
- **Slate 200** (`border-slate-200`): Standard borders
- **Slate 100** (`border-slate-100`): Subtle dividers
- **Slate 50** (`bg-slate-50`): Subtle backgrounds

**Phase Colors (Strategy Coach - Functional/Semantic):**
- **Emerald** (`emerald-600`, `emerald-50`): Discovery phase indicators
- **Amber** (`amber-600`, `amber-50`): Research/Landscape phase indicators
- **Purple** (`purple-600`, `purple-50`): Synthesis phase indicators
- **Cyan** (`cyan-600`, `cyan-50`): Strategic Bets/Planning phase indicators

**Semantic Colors:**
- **Success**: `#10b981` (emerald-500)
- **Warning**: `#d97706` (amber-600) - deliberately darker than gold to avoid confusion
- **Error**: `#ef4444` (red-500)
- **Info**: `#3b82f6` (blue-500)

**Usage Guidelines:**
- Use solid Gold `#fbbf24` for primary CTAs with dark text (`text-slate-900`)
- Use solid Navy `#1a1f3a` for secondary buttons with white text
- Use Cyan borders (`border-cyan-200/300`) for tertiary buttons and cards
- Use slate for all text and borders (never pure black/gray)
- Use phase colors only for Strategy Coach phase indicators
- Maintain WCAG AA contrast ratios

### Typography

**Font Stack:**
- **Headings/UI**: Plus Jakarta Sans (`--font-jakarta`, loaded via Google Fonts) — geometric, modern, warm
- **Body**: System UI stack (`system-ui, -apple-system, sans-serif`)
- **Data/Metrics Accent**: JetBrains Mono (`font-code` utility) — for phase %, XP, counts, debug text

**Hierarchy:**
- **Headings**: `font-bold` with appropriate text sizes
  - H1: `text-5xl font-bold` (48px, 700 weight)
  - H2: `text-3xl font-bold` (32px, 700 weight)
  - H3: `text-2xl font-semibold` (24px, 600 weight)
- **Body**: `text-base` (16px) with `leading-relaxed` (1.625 line-height)
- **Body Small**: `text-sm` (14px) for secondary content
- **Labels**: `text-xs font-semibold uppercase tracking-wider` (12px, 600 weight)
- **Metadata**: `text-xs text-slate-400` (12px, muted)

**Text Patterns:**
- Use `font-semibold` (600 weight) for emphasis and interactive elements
- Use `font-bold` (700 weight) max for headings - avoid `font-black` (900)
- Use `uppercase tracking-wider` for labels and metadata
- Use `leading-relaxed` for body text

### Border Radius

**Consistent Rounding:**
- **Cards/Tiles**: `rounded-2xl` (16px) - primary content containers
- **Buttons/Inputs**: `rounded-lg` (8px) - interactive elements
- **Badges/Pills**: `rounded-full` - status indicators, tags
- **Avatars**: `rounded-xl` (12px) - user/agent avatars

### Spacing & Layout

**Padding:**
- **Containers**: `p-6` (24px) - standard container padding
- **Large Sections**: `py-5 px-10` (20px vertical, 40px horizontal) - headers
- **Compact Elements**: `py-1.5 px-3` (6px vertical, 12px horizontal) - badges
- **Buttons**: `px-6 py-3` (24px horizontal, 12px vertical) - standard buttons

**Gaps:**
- **Section Spacing**: `gap-6` (24px) - between major sections
- **Element Spacing**: `gap-3` (12px) - between related elements
- **Inline Elements**: `gap-2` or `gap-2.5` (8px/10px) - icons with text
- **Tight Spacing**: `space-y-2` (8px) - stacked text elements

**Layout Patterns:**
- Use flexbox for all layouts (`flex`, `flex-col`)
- Use `flex-shrink-0` for fixed-height headers/footers
- Use `flex-1 min-h-0 overflow-hidden` for scrollable content areas

### Interactive States

**Hover Effects:**
- **Scale**: `hover:scale-105` (5% growth) - primary buttons
- **Scale**: `hover:scale-110` (10% growth) - avatars, icons
- **Shadow**: `hover:shadow-lg` - buttons, cards
- **Background**: `hover:bg-slate-50` - tertiary buttons
- **Border**: `hover:border-cyan-300` - inputs, tertiary buttons
- **Color**: `hover:bg-[#f59e0b]` - gold button hover

**Focus States:**
- **Ring**: `focus:ring-2 focus:ring-[#fbbf24]` - gold focus ring
- **Border**: `focus:border-[#fbbf24]` - gold border on focus
- **Outline**: `focus:outline-none` - remove default browser outline

**Disabled States:**
- **Opacity**: `disabled:opacity-50` or `disabled:opacity-40`
- **Cursor**: `disabled:cursor-not-allowed`

**Transitions:**
- **Duration**: `duration-300` (300ms) - all transitions
- **Properties**: `transition-all` - comprehensive state changes

### Component Patterns

**Avatars (Coach/Brand):**
```tsx
<div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110 bg-[#1a1f3a] shadow-md">
  <Image src="/frontera-logo-F.jpg" alt="Frontera" width={32} height={32} className="w-full h-full object-cover" />
</div>
```

**Primary Buttons (Gold):**
```tsx
<button className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2">
  Primary Action
</button>
```

**Secondary Buttons (Navy):**
```tsx
<button className="inline-flex items-center justify-center rounded-lg bg-[#1a1f3a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d3561] focus:outline-none focus:ring-2 focus:ring-[#1a1f3a] focus:ring-offset-2">
  Secondary Action
</button>
```

**Tertiary Buttons (Cyan border):**
```tsx
<button className="inline-flex items-center justify-center rounded-lg border border-cyan-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2">
  Tertiary
</button>
```

**Text Inputs/Textareas:**
```tsx
<textarea className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400" />
```

**Status Badges:**
```tsx
<div className="inline-flex items-center gap-2 text-xs text-[#1a1f3a] py-1.5 px-3 bg-cyan-50 rounded-full tracking-wide font-semibold">
  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
  <span>Status</span>
</div>
```

**Loading Indicators:**
```tsx
<div className="flex items-center gap-2.5 text-slate-600 text-sm">
  <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
  <span className="text-xs uppercase tracking-wide font-semibold">Loading...</span>
</div>
```

**Content Cards:**
```tsx
<div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
  {/* Card content */}
</div>
```

**Premium Cards (Navy bg):**
```tsx
<div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg">
  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
  <div className="relative">
    {/* Card content */}
    <button className="mt-4 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#f59e0b]">
      Get Started
    </button>
  </div>
</div>
```

### Image Usage

**Logo Usage:**
- Main header logo: `/frontera-logo-white.jpg` (full horizontal logo, on navy backgrounds)
- Chat avatar logo: `/frontera-logo-F.jpg` (F icon only)
- Always use Next.js `Image` component for optimization
- Apply `w-full h-full object-cover` for proper sizing in containers

**Image Optimization:**
```tsx
import Image from 'next/image';

<Image
  src="/frontera-logo-F.jpg"
  alt="Frontera"
  width={32}
  height={32}
  className="w-full h-full object-cover"
/>
```

### Accessibility

**ARIA Labels:**
- Use semantic HTML (`<header>`, `<main>`, `<aside>`, `<nav>`)
- Add `alt` text to all images
- Use `aria-label` for icon-only buttons

**Keyboard Navigation:**
- Ensure all interactive elements are focusable
- Maintain logical tab order
- Provide visible focus indicators (gold ring)

**Color Contrast:**
- All text meets WCAG AA standards
- Slate-900 on white: 14.47:1 (AAA)
- Slate-700 on white: 8.59:1 (AAA)
- Navy `#1a1f3a` on white: 15.39:1 (AAA)

### Background Atmosphere

**Gradient Recipes:**
- **Main canvas**: `background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #ecfeff 100%)` (slate with hint of cyan)
- **Navy surfaces** (header, sidebar): `background: linear-gradient(180deg, #1e2440 0%, #151930 100%)`
- **Canvas header**: `bg-white/80 backdrop-blur-sm` for frosted glass effect

**Decorative Elements:**
- Sidebar: Topographic contour-line SVG pattern at 3% opacity (terrain mapping metaphor)
- Header: Gold accent bottom border `border-b-2 border-[#fbbf24]/30`
- Canvas header: Cyan top accent `border-t-2 border-t-cyan-200/40`

### Card Surface Treatment

**Standard cards:** `rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300`
**Featured/data cards:** Add `shadow-cyan-100/50` for subtle cyan shadow tint
**Active cards:** Add `ring-2` with territory-appropriate ring colour

### Animation Guidelines

**Entrance Animations (page load):**
- `.animate-entrance` — fade up (0.5s ease-out)
- `.animate-entrance-left` — slide from left (0.5s ease-out)
- `.animate-entrance-down` — slide from top (0.4s ease-out)
- Stagger with `.animate-delay-{0|75|100|150|200|300|400|500}`

**Orchestrated load sequence:**
1. Header slides down (0ms)
2. Sidebar slides from left (75ms)
3. Centre panel fades up (150ms)
4. Canvas panel fades up (300ms)
5. Canvas cards stagger (200ms, 300ms)

**Micro-interactions:**
- `.animate-ring-pulse` — radiating ring on active phase dots (replaces `animate-pulse`)
- `.active\:animate-spring` — button spring effect on click
- `animate-pulse` — loading states only
- `hover:scale-105` / `hover:scale-110` — interactive feedback
- `transition-all duration-300` — state changes

**Avoid:**
- Excessive motion (causes accessibility issues)
- Animations longer than 500ms (except orchestrated entrance)
- Layout-shifting animations

### Design Checklist

When creating new components, ensure:

- [ ] Colors use slate palette for text (not gray/black)
- [ ] Primary CTAs use Gold (`bg-[#fbbf24] text-slate-900`)
- [ ] Secondary actions use Navy (`bg-[#1a1f3a] text-white`)
- [ ] Tertiary actions use Cyan border (`border-cyan-300`)
- [ ] Border radius is `rounded-lg`, `rounded-2xl`, or `rounded-full`
- [ ] Hover states include scale and/or shadow effects
- [ ] Focus states use gold ring (`focus:ring-[#fbbf24]`)
- [ ] Disabled states reduce opacity and prevent interaction
- [ ] All transitions use `duration-300`
- [ ] Typography uses Plus Jakarta Sans for headings/UI, system fonts for body, JetBrains Mono (`font-code`) for data
- [ ] Labels use `uppercase tracking-wider`
- [ ] Spacing uses consistent gap/padding values
- [ ] Images use Next.js Image component
- [ ] Semantic HTML is used
- [ ] WCAG AA contrast is maintained
- [ ] Phase colors are only used for Strategy Coach phase indicators

## UX Patterns

### Discovery Phase Completion Requirements
The Discovery phase implements progressive disclosure with clear completion criteria:

**Visual Progress Checklist** ([DiscoverySection.tsx:233-328](src/components/product-strategy-agent/CanvasPanel/DiscoverySection.tsx#L233-L328)):
1. ✅ **Company Strategic Context** - Auto-completed from onboarding
2. ⚠️ **Strategic Materials** - REQUIRED (minimum 1 document)
   - Amber highlight with "!" indicator when empty
   - Green checkmark when documents uploaded
   - Shows document count: "X documents uploaded"
3. 💬 **Coaching Conversations** - Recommended (optional)

**Encouragement without Blocking**:
- Users CAN proceed with minimum requirements (1 document)
- Prominent messaging encourages additional context for better insights
- "The more context, the better insights" guidance panel

**Phase Transition CTA** ([DiscoverySection.tsx:383-461](src/components/product-strategy-agent/CanvasPanel/DiscoverySection.tsx#L383-L461)):
- **Requirements Met**: Green success banner with "Begin Terrain Mapping →" button
- **Requirements Not Met**: Amber warning banner with:
  - Clear explanation of minimum requirement
  - Recommended document types (annual report, strategic plan, etc.)
  - Link to AI Research Assistant as alternative

### Territory Deep-Dive Navigation
Research phase uses sidebar navigation pattern for multi-area exploration:

**Sidebar Pattern** ([TerritoryDeepDiveSidebar.tsx](src/components/product-strategy-agent/CanvasPanel/TerritoryDeepDiveSidebar.tsx)):
- 25% width fixed sidebar
- Territory-specific color schemes (indigo=company, cyan=customer, purple=competitor)
- Progress tracking with visual indicators
- Back to overview navigation
- Research area cards with status badges (unexplored/in_progress/mapped)

**Deep-Dive Views** ([CustomerTerritoryDeepDive.tsx](src/components/product-strategy-agent/CanvasPanel/CustomerTerritoryDeepDive.tsx)):
- Two-level navigation: Territory → Research Area → Questions
- Area selection view shows progress percentage
- Question view with textarea inputs for each question
- "Save Progress" vs "Mark as Mapped" dual action buttons
- Response persistence across navigation

## Coding Conventions

- Use TypeScript strict mode
- Prefer server components; use `"use client"` only when needed
- Tailwind for all styling (no CSS modules)
- Follow design principles above for all UI components
- API routes return JSON with `{ error: string }` on failure
- Use Clerk's `auth()` and `currentUser()` for authentication

## Important Patterns

### Supabase Admin Client
```typescript
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}
```

### Protected API Route
```typescript
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... handler logic
}
```

### Streaming AI Response
```typescript
const { stream, getUsage } = await streamMessage(context, state, history, message);
return new Response(stream, {
  headers: { "Content-Type": "text/plain; charset=utf-8" }
});
```

### AI Research Assistant Pattern
The AI Research Assistant generates synthetic strategic documents using Claude:

```typescript
// 1. Call Claude to generate documents
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  messages: [{ role: 'user', content: researchPrompt }],
});

// 2. Parse response into structured documents
const discoveredDocs = parseResearchResponse(responseText);

// 3. Store in uploaded_materials with proper schema
await supabase.from('uploaded_materials').insert({
  conversation_id,
  filename: doc.filename,
  file_type: 'txt',
  file_url: doc.source_url || null,
  file_size: doc.content.length,
  extracted_context: {
    text: doc.content,
    source: doc.source_url || 'AI-generated research',
    generated_by: 'ai_research_assistant',
    topics: topics,
  },
  processing_status: 'completed',
  processed_at: new Date().toISOString(),
});
```

**Key Implementation Details:**
- Location: `src/app/api/product-strategy-agent/ai-research/route.ts`
- Uses Claude Sonnet 4 to generate 3-5 synthetic documents (200-400 words each)
- Prompt includes optional website list and required topics/keywords
- Response parsing with fallback handling for malformed outputs
- Documents stored in `uploaded_materials.extracted_context` as JSONB
- UI: Modal in `DiscoverySection.tsx` with topics input and optional websites list

### PDF Generation Pattern

PDF exports use **PDFKit** for React 19 compatibility and direct server-side generation.

**Why PDFKit?** `@react-pdf/renderer` v4 uses internal React APIs that break with React 19 in Next.js 15. PDFKit provides a stable, battle-tested solution with full control over layout.

**Architecture:**
- **API Routes**: `src/app/api/product-strategy-agent/{feature}/export/route.ts` - PDF generation endpoints
- **Direct Generation**: In-memory PDFKit document creation (no subprocess needed)
- **Brand Colors**: Navy `#1a1f3a`, Gold `#fbbf24`, Cyan scale for accents

**Core Pattern:**

```typescript
import PDFDocument from 'pdfkit';

async function generatePdf(input: { data: YourDataType }): Promise<Buffer> {
  // 1. Initialize document with A4 size and margins
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 60, right: 60 },
    bufferPages: true, // Enable multi-page support
  });

  // 2. Collect buffer chunks
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  // 3. Brand colors
  const NAVY = '#1a1f3a';
  const GOLD = '#fbbf24';
  const CYAN_200 = '#a5f3fc';
  const CYAN_600 = '#0891b2';

  // 4. Draw content using doc.y for position tracking
  let currentY = 100;

  // Title
  doc.fontSize(24).fillColor(NAVY).font('Helvetica-Bold');
  doc.text('Report Title', 60, currentY, { width: 475 });
  currentY = doc.y + 20; // Use actual end position, don't estimate!

  // Card-based layout
  const cardX = 60;
  const cardWidth = 475;
  const cardHeight = 120; // Estimate background height

  // Draw card background
  doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 8)
     .fill(CYAN_200);

  // Draw card content with explicit Y tracking
  let contentY = currentY + 14;
  doc.fontSize(14).fillColor(NAVY).font('Helvetica-Bold');
  doc.text('Card Title', cardX + 16, contentY, { width: cardWidth - 32 });
  contentY = doc.y + 8; // Track actual position after text

  doc.fontSize(10).fillColor('#475569').font('Helvetica');
  doc.text('Card description text here...', cardX + 16, contentY, {
    width: cardWidth - 32,
    lineGap: 2,
  });
  contentY = doc.y + 8;

  // Move past card
  currentY = currentY + cardHeight + 16;
  doc.y = currentY;

  // 5. Finalize and return buffer
  doc.end();
  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}

// 6. API route handler
export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Fetch and sanitize data
  const data = await fetchYourData(body.conversation_id);

  // Generate PDF
  const pdfBuffer = await generatePdf({ data });

  // Return as downloadable file
  const uint8Array = new Uint8Array(pdfBuffer);
  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}
```

**Critical Layout Rules:**

1. **Never estimate text heights** - Always use `doc.y` after drawing text
   ```typescript
   // ❌ BAD - Estimates are always wrong
   const titleLines = Math.ceil(title.length / 60);
   currentY += titleLines * 14;

   // ✅ GOOD - Use actual position
   doc.text(title, x, currentY, options);
   currentY = doc.y + spacing;
   ```

2. **Card backgrounds** - Estimate reasonable height, draw content, then move past
   ```typescript
   const cardHeight = 120; // Reasonable estimate
   doc.roundedRect(x, y, width, cardHeight, 8).fill(color);

   // Draw content inside
   let contentY = y + 14;
   doc.text('Title', x + 16, contentY, { width: width - 32 });
   contentY = doc.y + 8; // Track actual Y

   // Move past entire card
   doc.y = y + cardHeight + spacing;
   ```

3. **Page breaks** - PDFKit handles automatically when `bufferPages: true`

4. **Font hierarchy**:
   - Headings: `Helvetica-Bold` at 18-24pt
   - Subheadings: `Helvetica-Bold` at 12-14pt
   - Body: `Helvetica` at 10pt
   - Labels: `Helvetica` at 9pt, uppercase

**Client-side download pattern:**

```typescript
// In React component
const handleExportPDF = async () => {
  const response = await fetch('/api/your-feature/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId }),
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
```

**Current implementations:**
- Strategic Synthesis PDF ([src/app/api/product-strategy-agent/synthesis/export/route.ts](src/app/api/product-strategy-agent/synthesis/export/route.ts))
- Strategic Bets PDF ([src/app/api/product-strategy-agent/bets/export/route.ts](src/app/api/product-strategy-agent/bets/export/route.ts))

## Testing

### Test Framework Stack
- **Unit/Integration**: Vitest with React Testing Library
- **E2E**: Playwright (multi-browser)
- **BDD**: Cucumber with Gherkin syntax
- **Coverage Target**: 90%+

### Test Commands

```bash
npm run test           # Run all unit/integration tests
npm run test:unit      # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch     # Watch mode
npm run test:ui        # Vitest UI
npm run test:coverage  # Generate coverage report
npm run test:e2e       # Run Playwright E2E tests
npm run test:e2e:ui    # Playwright UI mode
npm run test:bdd       # Run Cucumber BDD tests
```

### Test Directory Structure

```
tests/
├── unit/                    # Unit tests (mirror src/ structure)
│   ├── lib/                 # Library unit tests
│   └── components/          # Component unit tests
├── integration/             # API route integration tests
│   └── api/                 # API endpoint tests
├── e2e/                     # Playwright E2E tests
│   ├── pages/               # Page Object Models
│   ├── fixtures/            # Test fixtures
│   └── specs/               # Test specifications
├── bdd/                     # Cucumber BDD tests
│   ├── features/            # Gherkin .feature files
│   │   └── strategy-coach/  # Feature-specific scenarios
│   ├── step-definitions/    # Step implementation
│   └── support/             # World class and hooks
├── mocks/                   # Shared mock utilities
│   ├── anthropic.ts         # Anthropic SDK mock
│   ├── supabase.ts          # Supabase mock
│   ├── clerk.ts             # Clerk mock
│   └── factories/           # Test data factories
└── helpers/                 # Test utilities
```

### Mock Utilities

Import mocks from `tests/mocks`:

```typescript
import { mockClerkModule, mockSupabaseModule, mockAnthropicModule } from 'tests/mocks';
import { createMockConversation, createMockClient } from 'tests/mocks/factories';
```

### Writing Tests

**Unit test pattern:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from 'tests/helpers/test-utils';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**BDD feature file:**
```gherkin
Feature: Strategy Coach Conversation
  Scenario: Starting a new conversation
    Given I am logged in as an organization admin
    When I click "New Conversation"
    Then I should see a personalized welcome message
```

## Deployment

Deployed to Vercel with automatic deployments on push to `master`.

Environment variables must be configured in Vercel project settings.

---

## Test Framework Implementation Status

> **Last Updated**: January 2, 2026
> **Status**: Framework operational on Windows ARM64

### Phase 1: Foundation (COMPLETED)

| File | Status |
|------|--------|
| `vitest.config.mts` | Created - ESM config with 90% coverage thresholds |
| `playwright.config.ts` | Created - Multi-browser E2E config |
| `cucumber.mjs` | Created - BDD/Gherkin configuration |
| `tests/mocks/anthropic.ts` | Created - Anthropic SDK mock with streaming |
| `tests/mocks/supabase.ts` | Created - Supabase query builder mock |
| `tests/mocks/clerk.ts` | Created - Clerk auth/user/org mocks |
| `tests/mocks/posthog.ts` | Created - PostHog analytics mock |
| `tests/mocks/factories/conversation.factory.ts` | Created - Test data factories |
| `tests/mocks/factories/client.factory.ts` | Created - Client test data |
| `tests/mocks/index.ts` | Created - Mock exports |
| `tests/helpers/setup.ts` | Created - Vitest setup with jest-dom |
| `tests/helpers/test-utils.tsx` | Created - React Testing Library wrapper |
| `package.json` | Updated - Test scripts and ARM64 native binary support |

### Phase 2: Unit Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/unit/lib/agents/strategy-coach/framework-state.test.ts` | Passing - 60 tests |
| `tests/unit/lib/agents/strategy-coach/client-context.test.ts` | Passing - 30 tests |
| `tests/unit/lib/agents/strategy-coach/system-prompt.test.ts` | Passing - 49 tests |
| `tests/unit/lib/agents/strategy-coach/index.test.ts` | Passing - 19 tests |

**Total: 158 passing unit tests**

### Phase 3: Integration Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/integration/api/conversations/route.test.ts` | Passing - 15 tests (GET/POST) |
| `tests/integration/api/conversations/[id]/route.test.ts` | Passing - 15 tests (GET/PATCH) |
| `tests/integration/api/conversations/[id]/messages/route.test.ts` | Passing - 11 tests (streaming) |

**Total: 41 passing integration tests**

### Phase 4: Component Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/unit/components/strategy-coach/MessageInput.test.tsx` | Passing - 20 tests |
| `tests/unit/components/strategy-coach/MessageList.test.tsx` | Passing - 25 tests |
| `tests/unit/components/strategy-coach/ConversationList.test.tsx` | Passing - 20 tests |
| `tests/unit/components/strategy-coach/ChatInterface.test.tsx` | Passing - 21 tests |

**Total: 86 passing component tests**

### Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **Total**: 285 passing tests

### Phase 5: E2E Tests (COMPLETED)

| File | Status |
|------|--------|
| `tests/e2e/pages/BasePage.ts` | Created - Base page object with common utilities |
| `tests/e2e/pages/StrategyCoachPage.ts` | Created - Strategy Coach list page POM |
| `tests/e2e/pages/ConversationPage.ts` | Created - Conversation page POM |
| `tests/e2e/fixtures/auth.fixture.ts` | Created - Authentication fixtures |
| `tests/e2e/specs/strategy-coach.spec.ts` | Created - 24 test cases |

**Total: 96 E2E tests (24 tests x 4 browsers: Chromium, Firefox, WebKit, Mobile Chrome)**

**Test Categories:**
- Page Layout (4 tests)
- Empty State (1 test)
- Conversation List (2 tests)
- Navigation (4 tests)
- Opening Message (1 test)
- Message Input (3 tests)
- Message Display (3 tests)
- Keyboard Shortcuts (2 tests)
- Accessibility (2 tests)

**Running E2E Tests:**
```bash
# Requires app running and E2E credentials
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=password npm run test:e2e
```

### Phase 6: BDD Tests (COMPLETED)

| File | Status |
|------|--------|
| `cucumber.mjs` | Updated - TSX loader configuration |
| `tests/bdd/support/world.ts` | Created - Custom World class with Playwright |
| `tests/bdd/support/hooks.ts` | Created - Before/After hooks with screenshots |
| `tests/bdd/step-definitions/common.steps.ts` | Created - Auth and navigation steps |
| `tests/bdd/step-definitions/conversations.steps.ts` | Created - Conversation management steps |
| `tests/bdd/step-definitions/messaging.steps.ts` | Created - Messaging functionality steps |
| `tests/bdd/step-definitions/methodology.steps.ts` | Created - Coaching methodology steps |

**Feature Files:**
| File | Scenarios |
|------|-----------|
| `conversations.feature` | 6 scenarios |
| `messaging.feature` | 9 scenarios |
| `navigation.feature` | 6 scenarios |
| `coaching-methodology.feature` | 9 scenarios |

**Total: 30 scenarios, 171 steps**

**Running BDD Tests:**
```bash
# Requires app running and E2E credentials
E2E_TEST_EMAIL=test@example.com E2E_TEST_PASSWORD=password npm run test:bdd
```

### Phase 7: CI/CD Pipeline (COMPLETED)

| File | Description |
|------|-------------|
| `.github/workflows/ci.yml` | Main CI workflow - lint, unit tests, integration tests, coverage, build |
| `.github/workflows/e2e.yml` | E2E tests - manual trigger or release branches, multi-browser support |
| `.github/workflows/bdd.yml` | BDD tests - manual trigger or release branches, tag filtering |

**CI Workflow (`ci.yml`):**
- Triggers on push to `master` and PRs
- Jobs: Lint → Unit Tests → Integration Tests → Coverage → Build
- Uses Node.js 20 with npm caching
- Uploads coverage report as artifact

**E2E Workflow (`e2e.yml`):**
- Manual trigger with browser selection (chromium/firefox/webkit/all)
- Auto-runs on `release/**` branches
- Runs on PRs with `e2e` label
- Uploads Playwright reports and failure artifacts

**BDD Workflow (`bdd.yml`):**
- Manual trigger with optional Cucumber tags
- Auto-runs on `release/**` branches
- Runs on PRs with `bdd` label
- Starts app, waits for ready, runs tests
- Uploads Cucumber reports and failure screenshots

**Required GitHub Secrets:**
```
# Vercel Integration (pulls all env vars automatically)
VERCEL_TOKEN          # From https://vercel.com/account/tokens
VERCEL_ORG_ID         # From .vercel/project.json or Vercel dashboard
VERCEL_PROJECT_ID     # From .vercel/project.json or Vercel dashboard

# E2E Testing (test-specific, not in Vercel)
E2E_TEST_EMAIL
E2E_TEST_PASSWORD
```

**Local Development:**
```bash
# Pull env vars from Vercel to local
vercel env pull .env.local
```

### Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **E2E Tests**: 96 defined (requires running app)
- **BDD Tests**: 30 scenarios, 171 steps (requires running app)
- **Total Automated**: 285 passing + 96 E2E + 30 BDD scenarios

### Test Framework Complete

All 7 phases of the test framework implementation are now complete:

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation (configs, mocks, helpers) | Complete |
| Phase 2 | Unit Tests (158 tests) | Complete |
| Phase 3 | Integration Tests (41 tests) | Complete |
| Phase 4 | Component Tests (86 tests) | Complete |
| Phase 5 | E2E Tests (96 tests) | Complete |
| Phase 6 | BDD Tests (30 scenarios) | Complete |
| Phase 7 | CI/CD Pipeline (3 workflows) | Complete |
### Phase 8: AI Evaluations (FOUNDATION COMPLETED)

> **Implementation Date**: January 5, 2026
> **Status**: Phase 8A Complete - Quality Metrics Operational

#### Overview

Phase 8 introduces **AI-specific evaluation tests** that measure the quality, accuracy, and effectiveness of the Strategy Coach's LLM outputs. Unlike traditional software tests (Phases 1-7) that validate code behavior, AI evals answer:

- Is the coaching advice **relevant** to the user's question?
- Does the response contain **hallucinated** (fabricated) information?
- Is the **tone** confident and professional without being patronizing?
- Does the response provide **complete, actionable** guidance?

#### Phase 8A: Foundation - Quality Metrics (COMPLETED)

| Component | Status |
|-----------|--------|
| **Configuration** |  |
| `tests/evals/config/metrics.config.ts` | Created - Quality thresholds and eval settings |
| `tests/evals/config/baselines.json` | Created - Baseline scores for regression detection |
| **Test Fixtures** |  |
| `tests/evals/fixtures/test-conversations.ts` | Created - 50 test cases (discovery, research, synthesis, planning) |
| `tests/evals/fixtures/client-contexts.ts` | Created - Industry/size/focus variations |
| `tests/evals/fixtures/adversarial-inputs.ts` | Created - 22 safety test cases |
| **Evaluation Helpers** |  |
| `tests/evals/helpers/eval-utils.ts` | Created - Execute Strategy Coach and capture responses |
| `tests/evals/helpers/llm-judge.ts` | Created - LLM-as-a-judge evaluation engine |
| `tests/evals/helpers/code-grader.ts` | Created - Code-based validation functions |
| **Quality Evaluation Tests** |  |
| `tests/evals/strategy-coach/quality/relevance.eval.ts` | Created - 32 relevance tests |
| `tests/evals/strategy-coach/quality/hallucination.eval.ts` | Created - 10 hallucination detection tests |
| `tests/evals/strategy-coach/quality/tone.eval.ts` | Created - 28 tone adherence tests |
| `tests/evals/strategy-coach/quality/completeness.eval.ts` | Created - 20 completeness tests |
| **Documentation** |  |
| `tests/evals/README.md` | Created - Eval test documentation |
| `AI_EVALS_GUIDE.md` | Created - Comprehensive usage guide |
| `AI_EVALS_IMPLEMENTATION_PLAN.md` | Created - Full Phase 8 roadmap |

**Total Phase 8A Tests: 90 evaluation test cases**

#### Evaluation Metrics (Phase 8A)

| Metric | Threshold | Type | Test Count |
|--------|-----------|------|------------|
| **Relevance** | ≥ 0.80 | LLM-judge | 32 tests |
| **Hallucination** | ≤ 0.20 | LLM-judge + Code | 10 tests |
| **Tone Adherence** | ≥ 0.85 | LLM-judge + Code | 28 tests |
| **Completeness** | ≥ 0.75 | LLM-judge + Code | 20 tests |

#### Evaluation Approach

**Hybrid Methodology:**

1. **Code-Based Grading** (Fast, Deterministic, Free)
   - Keyword presence validation
   - Response length checks
   - Format compliance
   - Hallucination detection (fabricated pillar counts, etc.)
   - Patronizing language detection

2. **LLM-as-a-Judge** (Nuanced, Semantic, Accurate)
   - Uses Claude Sonnet 4 to evaluate responses
   - Chain-of-thought reasoning
   - Scores on 0-1 scale with confidence levels
   - ~$0.01-0.02 per test case

#### Running AI Evaluations

```bash
# Run all AI evaluation tests
npm run test:evals

# Run specific category
npm run test:evals:quality

# Watch mode for prompt engineering
npm run test:evals:watch

# Run specific test file
npx vitest run tests/evals/strategy-coach/quality/relevance.eval.ts
```

#### Test Fixtures

**Test Conversation Scenarios (50 cases):**
- Discovery Phase: 15 test cases
- Research Phase: 20 test cases
- Synthesis Phase: 10 test cases
- Planning Phase: 5 test cases

**Client Context Variations (12 variations):**
- Technology: Startup, Growth, Enterprise
- Healthcare: Startup, Mid, Enterprise
- Financial Services: Startup, Mid, Enterprise
- Retail: Startup, Mid, Enterprise

**Adversarial Inputs (22 cases):**
- Prompt Injection: 5 tests
- Off-Topic: 5 tests
- PII Leakage: 3 tests
- Methodology Challenges: 3 tests
- Inappropriate Requests: 3 tests
- Edge Cases: 3 tests

#### Example Eval Test

```typescript
// tests/evals/strategy-coach/quality/relevance.eval.ts
test('should provide relevant response to market expansion question', async () => {
  // 1. Execute Strategy Coach
  const { content } = await executeStrategyCoach(
    'What should I focus on for my product strategy?',
    {
      industry: 'Technology',
      strategic_focus: 'Market expansion',
      pain_points: ['Unclear competitive positioning'],
    }
  );

  // 2. LLM-as-a-judge evaluation
  const judgment = await judgeResponse(
    'What should I focus on for my product strategy?',
    content,
    context,
    EVALUATION_CRITERIA.relevance
  );

  // 3. Assert against threshold
  expect(judgment.score).toBeGreaterThanOrEqual(0.80);

  // Output:
  // {
  //   score: 0.87,
  //   reasoning: "Response directly addresses market expansion focus...",
  //   confidence: "high"
  // }
});
```

#### Use Cases

**Prompt Engineering Workflow:**
1. Run baseline eval before prompt changes
2. Modify system prompt
3. Run evals in watch mode
4. Iterate until scores improve or maintain
5. Commit when quality is validated

**Quality Assurance:**
- Automated regression detection (scores can't drop >10%)
- Catch hallucinations before production
- Ensure tone consistency
- Validate completeness of responses

**Production Monitoring (Future - Phase 8D):**
- Sample 5% of live conversations
- Real-time quality metrics
- Alerts on degradation
- Trend analysis

#### Future Phases

| Phase | Description | Test Count | Status |
|-------|-------------|------------|--------|
| Phase 8A | Foundation (quality metrics) | 90 tests | ✅ Complete |
| Phase 8B | Context-aware evaluations | 85 tests | 📋 Planned |
| Phase 8C | Conversational quality | 30 tests | 📋 Planned |
| Phase 8D | Safety & production | 45 tests | 📋 Planned |
| **Total** | **Full AI Eval Suite** | **250 tests** | **36% Complete** |

**Phase 8B - Context-Aware Evals** (Planned):
- Client context utilization (30 tests)
- Industry-specific guidance accuracy (40 tests)
- Framework state progression validation (15 tests)

**Phase 8C - Conversational Quality** (Planned):
- Multi-turn conversation coherence (15 tests)
- Knowledge retention across turns (10 tests)
- End-to-end conversation completeness (5 tests)

**Phase 8D - Safety & Production** (Planned):
- Prompt injection resistance (15 tests)
- Bias detection (20 tests)
- CI/CD integration
- Production monitoring setup (5% conversation sampling)

#### Documentation

- **[tests/evals/README.md](tests/evals/README.md)** - Quick start and overview
- **[AI_EVALS_GUIDE.md](AI_EVALS_GUIDE.md)** - Comprehensive usage guide
- **[AI_EVALS_IMPLEMENTATION_PLAN.md](AI_EVALS_IMPLEMENTATION_PLAN.md)** - Full Phase 8 roadmap (60+ pages)

#### Cost Considerations

**Development:**
- Per eval run (90 tests): ~$1-2
- Monthly (5 runs/week): ~$40-80

**Production Monitoring (Phase 8D):**
- 5% sampling at 1000 conversations/day: ~$150/month
- Total estimated: ~$200-300/month for full eval framework

#### Integration with Existing Tests

```
Frontera Test Suite (Total: 375+ tests)

Traditional Software Tests:
├── Unit Tests (158)          - Code logic validation
├── Component Tests (86)      - React component validation
├── Integration Tests (41)    - API contract validation
├── E2E Tests (96)            - User workflow validation
└── BDD Tests (30 scenarios)  - Acceptance criteria validation

AI-Specific Tests:
└── Eval Tests (90)           - AI output quality validation ⭐ NEW
    ├── Relevance (32)
    ├── Hallucination (10)
    ├── Tone (28)
    └── Completeness (20)
```

### Updated Combined Test Summary

- **Unit Tests (lib)**: 158 passing
- **Component Tests**: 86 passing
- **Integration Tests**: 41 passing
- **E2E Tests**: 96 defined (requires running app)
- **BDD Tests**: 30 scenarios, 171 steps (requires running app)
- **AI Evals**: 90 evaluation tests (requires ANTHROPIC_API_KEY)
- **Total Automated**: 375+ tests across all phases

### Test Framework Status

**8 phases of comprehensive testing:**

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation (configs, mocks, helpers) | ✅ Complete |
| Phase 2 | Unit Tests (158 tests) | ✅ Complete |
| Phase 3 | Integration Tests (41 tests) | ✅ Complete |
| Phase 4 | Component Tests (86 tests) | ✅ Complete |
| Phase 5 | E2E Tests (96 tests) | ✅ Complete |
| Phase 6 | BDD Tests (30 scenarios) | ✅ Complete |
| Phase 7 | CI/CD Pipeline (3 workflows) | ✅ Complete |
| **Phase 8A** | **AI Evals - Quality (90 tests)** | **✅ Complete** |
| Phase 8B | AI Evals - Context (85 tests) | 📋 Planned |
| Phase 8C | AI Evals - Conversational (30 tests) | 📋 Planned |
| Phase 8D | AI Evals - Production (45 tests) | 📋 Planned |

---

**Phase 8A Milestone Achieved**: January 5, 2026

Frontera now has a production-ready AI evaluation framework for ensuring Strategy Coach quality. Phase 8B-D will expand coverage to context-awareness, conversational quality, and production monitoring.
