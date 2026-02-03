# Strategic Synthesis PDF Export - Implementation Plan

## Overview

Export the Strategic Synthesis to a professionally formatted PDF document using Frontera brand colors, with condensed opportunity layouts, summarized evidence, and a rendered 2x2 strategic map.

**User Selections:**
- Color Scheme: Frontera Brand (indigo/cyan gradients)
- Opportunity Detail: Condensed (2 per page)
- Evidence Quotes: Summarized
- Assumptions Table: Abbreviated
- Map Visualization: Rendered chart image

---

## Technical Architecture

### Recommended Approach: `@react-pdf/renderer`

**Why this library:**
- Full React component model - matches our existing codebase
- Server-side rendering support (API route generation)
- SVG support for the 2x2 matrix chart
- Fine-grained styling control for brand consistency
- No browser dependency (unlike html2canvas/puppeteer)

**Bundle size:** ~500KB (acceptable for server-side only)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SynthesisSection.tsx                                    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  [Export PDF] Button                             │    │    │
│  │  │  - Shows loading state                           │    │    │
│  │  │  - Downloads file on completion                  │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  /api/product-strategy-agent/synthesis/export/route.ts  │    │
│  │  - Authenticates user                                    │    │
│  │  - Fetches synthesis + client context                    │    │
│  │  - Renders PDF using @react-pdf/renderer                 │    │
│  │  - Returns PDF as binary stream                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PDF Components                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  src/lib/pdf/synthesis-report/                          │    │
│  │  ├── SynthesisReportDocument.tsx  (main document)       │    │
│  │  ├── CoverPage.tsx                                       │    │
│  │  ├── ExecutiveSummaryPage.tsx                           │    │
│  │  ├── StrategicMapPage.tsx         (SVG 2x2 matrix)      │    │
│  │  ├── OpportunityPage.tsx          (2 per page)          │    │
│  │  ├── TensionsPage.tsx                                    │    │
│  │  ├── AppendixPage.tsx                                    │    │
│  │  └── styles.ts                    (shared PDF styles)   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1)

#### 1.1 Install Dependencies

```bash
npm install @react-pdf/renderer
```

#### 1.2 Create PDF Styles

**File:** `src/lib/pdf/synthesis-report/styles.ts`

```typescript
import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (optional - for brand consistency)
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

// Frontera brand colors
export const COLORS = {
  indigo: {
    600: '#4f46e5',
    700: '#4338ca',
    900: '#312e81',
  },
  cyan: {
    500: '#06b6d4',
    600: '#0891b2',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    900: '#0f172a',
  },
  emerald: { 500: '#10b981', 600: '#059669' },
  amber: { 500: '#f59e0b', 600: '#d97706' },
  purple: { 600: '#9333ea' },
  red: { 500: '#ef4444' },
};

// Quadrant colors
export const QUADRANT_COLORS = {
  invest: COLORS.emerald[600],
  explore: COLORS.indigo[600],
  harvest: COLORS.amber[600],
  divest: COLORS.slate[500],
};

export const styles = StyleSheet.create({
  // Page layouts
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.slate[900],
  },
  coverPage: {
    padding: 60,
    backgroundColor: COLORS.slate[50],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Typography
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.slate[900],
    marginBottom: 16,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.slate[900],
    marginBottom: 12,
  },
  h3: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.slate[900],
    marginBottom: 8,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.slate[700],
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: COLORS.slate[500],
  },

  // Components
  card: {
    backgroundColor: '#ffffff',
    border: `1 solid ${COLORS.slate[200]}`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 8,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.slate[200],
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.slate[400],
  },
});
```

#### 1.3 Create Main Document Structure

**File:** `src/lib/pdf/synthesis-report/SynthesisReportDocument.tsx`

```typescript
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import type { SynthesisResult } from '@/types/synthesis';
import type { Client } from '@/types/database';
import { styles } from './styles';
import { CoverPage } from './CoverPage';
import { ExecutiveSummaryPage } from './ExecutiveSummaryPage';
import { StrategicMapPage } from './StrategicMapPage';
import { OpportunityPages } from './OpportunityPages';
import { TensionsPage } from './TensionsPage';
import { AppendixPage } from './AppendixPage';

interface SynthesisReportProps {
  synthesis: SynthesisResult;
  client: Client | null;
  generatedAt: Date;
}

export function SynthesisReportDocument({
  synthesis,
  client,
  generatedAt,
}: SynthesisReportProps) {
  return (
    <Document
      title={`Strategic Synthesis - ${client?.company_name || 'Report'}`}
      author="Frontera AI Strategy Coach"
      subject="Playing to Win Strategic Analysis"
      creator="Frontera Platform"
    >
      <CoverPage client={client} generatedAt={generatedAt} />
      <ExecutiveSummaryPage
        synthesis={synthesis}
        client={client}
      />
      <StrategicMapPage opportunities={synthesis.opportunities} />
      <OpportunityPages opportunities={synthesis.opportunities} />
      {synthesis.tensions.length > 0 && (
        <TensionsPage tensions={synthesis.tensions} />
      )}
      <AppendixPage synthesis={synthesis} />
    </Document>
  );
}
```

---

### Phase 2: Page Components (Days 2-3)

#### 2.1 Cover Page

**File:** `src/lib/pdf/synthesis-report/CoverPage.tsx`

- Frontera logo (embedded or base64)
- "STRATEGIC SYNTHESIS REPORT" title
- Company name prominent
- Industry and date
- "Playing to Win Framework" methodology badge
- Frontera branding footer

#### 2.2 Executive Summary Page

**File:** `src/lib/pdf/synthesis-report/ExecutiveSummaryPage.tsx`

- Executive summary text block
- Key metrics row (opportunities count, tensions count, territories)
- Priority recommendations (numbered list)
- Confidence level indicator

#### 2.3 Strategic Map Page (SVG Chart)

**File:** `src/lib/pdf/synthesis-report/StrategicMapPage.tsx`

Uses `@react-pdf/renderer` SVG support to render the 2x2 matrix:

```typescript
import { Svg, Rect, Circle, Text as SvgText, Line, G } from '@react-pdf/renderer';

// Render opportunities as positioned circles on the 2x2 grid
// X-axis: Capability Fit (1-10)
// Y-axis: Market Attractiveness (1-10)
```

- Quadrant backgrounds with labels (INVEST, EXPLORE, HARVEST, DIVEST)
- Opportunity dots positioned by scores
- Legend for opportunity types
- Quadrant summary counts

#### 2.4 Opportunity Pages (Condensed - 2 per page)

**File:** `src/lib/pdf/synthesis-report/OpportunityPages.tsx`

Each opportunity card includes:
- Title + quadrant badge + confidence indicator
- Description (2-3 sentences)
- Scoring bars (3 metrics + overall)
- PTW Summary (collapsed format):
  ```
  Aspiration: {text}
  Where to Play: {text}
  How to Win: {text}
  ```
- Capabilities: bullet list (max 3)
- Evidence: 1-2 summarized quotes with territory tags
- Assumptions: abbreviated table (category + assumption only)

Layout: 2 opportunities per page with divider line

#### 2.5 Tensions Page

**File:** `src/lib/pdf/synthesis-report/TensionsPage.tsx`

- Tension description with impact badge
- Two-column layout: Aligned vs Conflicting evidence
- Recommended resolution highlighted
- Trade-off note

#### 2.6 Appendix Page

**File:** `src/lib/pdf/synthesis-report/AppendixPage.tsx`

- Research coverage summary
- Methodology explanation
- Scoring guidelines
- Disclaimer
- Generated timestamp + report ID
- Frontera footer

---

### Phase 3: API Endpoint (Day 4)

#### 3.1 Create Export API Route

**File:** `src/app/api/product-strategy-agent/synthesis/export/route.ts`

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { SynthesisReportDocument } from '@/lib/pdf/synthesis-report/SynthesisReportDocument';
// ... database clients

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');

    // Fetch synthesis data
    const synthesis = await fetchSynthesis(conversationId, orgId);
    if (!synthesis) {
      return NextResponse.json({ error: 'Synthesis not found' }, { status: 404 });
    }

    // Fetch client context
    const client = await fetchClient(orgId);

    // Render PDF
    const pdfBuffer = await renderToBuffer(
      <SynthesisReportDocument
        synthesis={synthesis}
        client={client}
        generatedAt={new Date()}
      />
    );

    // Return PDF with appropriate headers
    const filename = `Strategic-Synthesis-${client?.company_name || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

---

### Phase 4: UI Integration (Day 5)

#### 4.1 Add Export Button to SynthesisSection

**File:** `src/components/product-strategy-agent/CanvasPanel/SynthesisSection.tsx`

Add button after synthesis results are displayed:

```tsx
const [isExporting, setIsExporting] = useState(false);

const handleExportPDF = async () => {
  setIsExporting(true);
  try {
    const response = await fetch(
      `/api/product-strategy-agent/synthesis/export?conversation_id=${conversation.id}`
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Strategic-Synthesis-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.error('Export error:', error);
    // Show error toast
  } finally {
    setIsExporting(false);
  }
};

// In render, after the Regenerate button:
<button
  onClick={handleExportPDF}
  disabled={isExporting}
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
>
  {isExporting ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Generating PDF...
    </>
  ) : (
    <>
      <DownloadIcon className="w-4 h-4" />
      Export PDF
    </>
  )}
</button>
```

---

## File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/lib/pdf/synthesis-report/styles.ts` | Shared PDF styles and brand colors |
| `src/lib/pdf/synthesis-report/SynthesisReportDocument.tsx` | Main document wrapper |
| `src/lib/pdf/synthesis-report/CoverPage.tsx` | Cover page component |
| `src/lib/pdf/synthesis-report/ExecutiveSummaryPage.tsx` | Executive summary page |
| `src/lib/pdf/synthesis-report/StrategicMapPage.tsx` | 2x2 matrix SVG chart |
| `src/lib/pdf/synthesis-report/OpportunityPages.tsx` | Condensed opportunity cards |
| `src/lib/pdf/synthesis-report/TensionsPage.tsx` | Strategic tensions page |
| `src/lib/pdf/synthesis-report/AppendixPage.tsx` | Methodology appendix |
| `src/lib/pdf/synthesis-report/index.ts` | Module exports |
| `src/app/api/product-strategy-agent/synthesis/export/route.ts` | PDF generation API |

### Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `@react-pdf/renderer` dependency |
| `src/components/.../SynthesisSection.tsx` | Add Export PDF button |

---

## Estimated Page Count

| Section | Pages |
|---------|-------|
| Cover | 1 |
| Executive Summary | 1 |
| Strategic Map | 1 |
| Opportunities (5 @ 2/page) | 3 |
| Tensions (2-3) | 1 |
| Appendix | 1 |
| **Total** | **~8 pages** |

---

## Testing Checklist

- [ ] PDF generates without errors
- [ ] All synthesis data renders correctly
- [ ] 2x2 matrix positions opportunities accurately
- [ ] Fonts render properly
- [ ] Colors match Frontera brand
- [ ] Download works in Chrome, Firefox, Safari
- [ ] Large synthesis (10+ opportunities) doesn't break layout
- [ ] Empty states handled (no tensions, missing data)
- [ ] Filename includes company name and date

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| SVG rendering issues | Fallback to simple table representation |
| Long text overflow | Truncation with ellipsis + "See full report" |
| Memory on large PDFs | Stream response instead of buffer |
| Font licensing | Use Helvetica (built-in to PDF) |

---

## Future Enhancements (Post-MVP)

1. **Custom branding** - Allow client logo upload
2. **Export options modal** - Choose sections to include
3. **Email delivery** - Send PDF to stakeholders
4. **Version history** - Track exported versions
5. **Watermark** - "CONFIDENTIAL" or "DRAFT" options
