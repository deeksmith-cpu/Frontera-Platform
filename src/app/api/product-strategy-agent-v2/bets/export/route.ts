import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import type { BetsResponse } from '@/types/bets';

// =============================================================================
// Brand Colors
// =============================================================================

const C = {
  navy: '#1a1f3a',
  navyLight: '#2d3561',
  gold: '#fbbf24',
  goldDark: '#d97706',
  cyan50: '#ecfeff',
  cyan100: '#cffafe',
  cyan200: '#a5f3fc',
  cyan400: '#22d3ee',
  cyan600: '#0891b2',
  emerald50: '#ecfdf5',
  emerald600: '#059669',
  amber50: '#fffbeb',
  amber600: '#d97706',
  purple50: '#faf5ff',
  purple600: '#9333ea',
  red50: '#fef2f2',
  red500: '#ef4444',
  red600: '#dc2626',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  white: '#ffffff',
};

// =============================================================================
// Layout Constants
// =============================================================================

const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const M = 50;          // margin
const CONTENT_W = PAGE_W - M * 2;
const FOOTER_Y = PAGE_H - 40;
const MAX_Y = PAGE_H - 60;

// =============================================================================
// Helpers
// =============================================================================

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getThesisTypeColor(type: string): { bg: string; text: string; border: string } {
  switch (type) {
    case 'offensive': return { bg: C.amber50, text: C.amber600, border: C.amber600 };
    case 'defensive': return { bg: C.emerald50, text: C.emerald600, border: C.emerald600 };
    case 'capability': return { bg: C.purple50, text: C.purple600, border: C.purple600 };
    default: return { bg: C.slate100, text: C.slate600, border: C.slate300 };
  }
}

function getBetStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'draft': return { bg: C.slate100, text: C.slate600 };
    case 'proposed': return { bg: C.cyan50, text: C.cyan600 };
    case 'accepted': return { bg: C.emerald50, text: C.emerald600 };
    case 'prioritized': return { bg: C.amber50, text: C.amber600 };
    default: return { bg: C.slate100, text: C.slate600 };
  }
}

function drawCard(
  pdf: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number,
  bgColor: string,
  borderColor?: string
) {
  pdf.roundedRect(x, y, w, h, 8).fill(bgColor);
  if (borderColor) {
    pdf.roundedRect(x, y, w, h, 8).strokeColor(borderColor).lineWidth(1).stroke();
  }
}

function drawSectionHeader(pdf: PDFKit.PDFDocument, title: string, y: number): number {
  // Gold accent bar
  pdf.rect(M, y, 4, 24).fill(C.gold);

  // Title
  pdf.fontSize(18).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(title.toUpperCase(), M + 16, y + 3, { width: CONTENT_W - 16 });

  return pdf.y + 20;
}

function drawStatBox(
  pdf: PDFKit.PDFDocument,
  x: number,
  y: number,
  w: number,
  value: string | number,
  label: string,
  accentColor: string
) {
  drawCard(pdf, x, y, w, 70, C.white, C.slate200);
  pdf.rect(x, y, w, 4).fill(accentColor);

  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(String(value), x, y + 18, { width: w, align: 'center' });

  pdf.fontSize(9).fillColor(C.slate600).font('Helvetica');
  pdf.text(label.toUpperCase(), x, y + 50, { width: w, align: 'center' });
}

function addFooter(pdf: PDFKit.PDFDocument, pageNum: number) {
  // Gold accent line
  pdf.moveTo(M, FOOTER_Y).lineTo(PAGE_W - M, FOOTER_Y).strokeColor(C.gold).lineWidth(2).stroke();

  // Footer text
  pdf.fontSize(8).fillColor(C.slate500).font('Helvetica');
  pdf.text('Frontera AI Strategy Coach', M, FOOTER_Y + 10, { width: CONTENT_W / 2, align: 'left' });
  pdf.text(`Page ${pageNum}`, M + CONTENT_W / 2, FOOTER_Y + 10, { width: CONTENT_W / 2, align: 'right' });
}

// =============================================================================
// Cover Page
// =============================================================================

function renderCoverPage(
  pdf: PDFKit.PDFDocument,
  companyName: string,
  betsData: BetsResponse,
  dateStr: string
) {
  // Navy header section (top 35% of page)
  const headerHeight = 300;
  pdf.rect(0, 0, PAGE_W, headerHeight).fill(C.navy);

  // Gold accent line at bottom of header
  pdf.rect(0, headerHeight - 4, PAGE_W, 4).fill(C.gold);

  // Decorative circles (subtle branding)
  pdf.circle(PAGE_W - 80, 80, 120).fillOpacity(0.03).fill(C.gold);
  pdf.circle(PAGE_W - 40, 160, 80).fillOpacity(0.05).fill(C.gold);
  pdf.fillOpacity(1);

  // Document type label
  pdf.fontSize(11).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('STRATEGIC BETS PORTFOLIO', M, 50, { width: CONTENT_W });

  // Main title
  pdf.fontSize(42).fillColor(C.white).font('Helvetica-Bold');
  pdf.text('Strategic Bets', M, 85, { width: CONTENT_W });

  // Company name
  pdf.fontSize(24).fillColor(C.cyan400).font('Helvetica');
  pdf.text(companyName, M, 140, { width: CONTENT_W });

  // Date
  pdf.fontSize(11).fillColor(C.slate400).font('Helvetica');
  pdf.text(dateStr, M, 180, { width: CONTENT_W });

  // Key metrics row
  const metricsY = 220;

  // Total Bets
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(betsData.portfolioSummary.totalBets), M, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Total Bets', M, metricsY + 36, { width: 100, align: 'left' });

  // Theses
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(betsData.portfolioSummary.totalTheses), M + 120, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Theses', M + 120, metricsY + 36, { width: 100, align: 'left' });

  // Avg Score
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(betsData.portfolioSummary.avgScore.toFixed(1), M + 240, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Avg Score', M + 240, metricsY + 36, { width: 100, align: 'left' });

  // Content section (below header)
  let currentY = headerHeight + 30;

  // Portfolio Summary Section
  currentY = drawSectionHeader(pdf, 'Portfolio Summary', currentY);

  // Stat boxes row
  const statW = (CONTENT_W - 30) / 4;
  drawStatBox(pdf, M, currentY, statW, betsData.portfolioSummary.totalBets, 'Total Bets', C.navy);
  drawStatBox(pdf, M + statW + 10, currentY, statW, betsData.portfolioSummary.byThesisType.offensive, 'Offensive', C.amber600);
  drawStatBox(pdf, M + (statW + 10) * 2, currentY, statW, betsData.portfolioSummary.byThesisType.defensive, 'Defensive', C.emerald600);
  drawStatBox(pdf, M + (statW + 10) * 3, currentY, statW, betsData.portfolioSummary.byThesisType.capability, 'Capability', C.purple600);
  currentY += 90;

  // Kill dates warning if applicable
  if (betsData.portfolioSummary.killDatesApproaching > 0) {
    drawCard(pdf, M, currentY, CONTENT_W, 55, C.red50, C.red500);
    pdf.fontSize(10).fillColor(C.red600).font('Helvetica-Bold');
    pdf.text('⚠ KILL DATES APPROACHING', M + 16, currentY + 12, { width: CONTENT_W - 32 });
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(`${betsData.portfolioSummary.killDatesApproaching} bets have kill dates within 30 days`, M + 16, currentY + 32, { width: CONTENT_W - 32 });
    currentY += 70;
  }

  // Methodology badge
  drawCard(pdf, M, currentY, CONTENT_W, 55, C.cyan50, C.cyan200);
  pdf.fontSize(9).fillColor(C.slate500).font('Helvetica-Bold');
  pdf.text('METHODOLOGY', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Hypothesis-Driven Strategy with Playing to Win', M + 16, currentY + 28, { width: CONTENT_W - 32 });
}

// =============================================================================
// Portfolio Summary Page
// =============================================================================

function renderPortfolioPage(pdf: PDFKit.PDFDocument, betsData: BetsResponse, pageNum: number) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Portfolio Analysis', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic thesis breakdown and scoring', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  // Thesis type breakdown
  currentY = drawSectionHeader(pdf, 'Thesis Type Distribution', currentY);

  const byType = betsData.portfolioSummary.byThesisType;
  const types = [
    { key: 'offensive', label: 'Offensive Theses', desc: 'Growth and market capture', color: getThesisTypeColor('offensive') },
    { key: 'defensive', label: 'Defensive Theses', desc: 'Protect competitive position', color: getThesisTypeColor('defensive') },
    { key: 'capability', label: 'Capability Building', desc: 'Enable future opportunities', color: getThesisTypeColor('capability') },
  ];

  for (const { key, label, desc, color } of types) {
    const count = byType[key as keyof typeof byType] || 0;

    drawCard(pdf, M, currentY, CONTENT_W, 70, color.bg, color.border);

    // Accent bar
    pdf.rect(M, currentY, 4, 70).fill(color.border);

    // Count circle
    pdf.circle(M + 40, currentY + 35, 20).fill(color.border);
    pdf.fontSize(18).fillColor(C.white).font('Helvetica-Bold');
    pdf.text(String(count), M + 28, currentY + 28, { width: 24, align: 'center' });

    // Label
    pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(label, M + 72, currentY + 18, { width: CONTENT_W - 88 });

    // Description
    pdf.fontSize(10).fillColor(C.slate600).font('Helvetica');
    pdf.text(desc, M + 72, currentY + 38, { width: CONTENT_W - 88 });

    currentY += 85;
  }

  // Average score highlight
  currentY += 10;
  drawCard(pdf, M, currentY, CONTENT_W, 80, C.navy);
  pdf.fontSize(10).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('AVERAGE PORTFOLIO SCORE', M + 16, currentY + 16, { width: CONTENT_W - 32 });
  pdf.fontSize(36).fillColor(C.white).font('Helvetica-Bold');
  pdf.text(`${betsData.portfolioSummary.avgScore.toFixed(1)}`, M + 16, currentY + 34, { width: CONTENT_W - 32 });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('out of 100', M + 80, currentY + 50, { width: CONTENT_W - 96 });
  currentY += 100;

  // Theses overview
  if (betsData.theses.length > 0) {
    currentY = drawSectionHeader(pdf, `Strategic Theses (${betsData.theses.length})`, currentY);

    for (const thesis of betsData.theses) {
      if (currentY + 60 > MAX_Y) break;

      const thesisColor = getThesisTypeColor(thesis.thesisType);
      drawCard(pdf, M, currentY, CONTENT_W, 50, C.white, C.slate200);
      pdf.rect(M, currentY, 4, 50).fill(thesisColor.border);

      // Type badge
      pdf.roundedRect(PAGE_W - M - 80, currentY + 14, 70, 22, 4).fill(thesisColor.bg);
      pdf.fontSize(8).font('Helvetica-Bold').fillColor(thesisColor.text);
      pdf.text(thesis.thesisType.toUpperCase(), PAGE_W - M - 80, currentY + 21, { width: 70, align: 'center', lineBreak: false });

      // Title
      pdf.fontSize(11).fillColor(C.navy).font('Helvetica-Bold');
      pdf.text(truncateText(thesis.title, 50), M + 16, currentY + 12, { width: CONTENT_W - 110 });

      // Bet count
      const betCount = thesis.bets?.length || 0;
      pdf.fontSize(9).fillColor(C.slate500).font('Helvetica');
      pdf.text(`${betCount} bet${betCount !== 1 ? 's' : ''}`, M + 16, currentY + 30, { width: CONTENT_W - 110 });

      currentY += 60;
    }
  }

  addFooter(pdf, pageNum);
}

// =============================================================================
// Thesis & Bets Detail Pages
// =============================================================================

function renderThesisDetailsPages(
  pdf: PDFKit.PDFDocument,
  betsData: BetsResponse,
  startPageNum: number
): number {
  let pageNum = startPageNum;

  for (let thesisIndex = 0; thesisIndex < betsData.theses.length; thesisIndex++) {
    const thesis = betsData.theses[thesisIndex];
    const thesisColor = getThesisTypeColor(thesis.thesisType);
    const bets = thesis.bets || [];

    // Start new page for each thesis
    pdf.addPage();
    let currentY = M;

    // Thesis header
    pdf.fontSize(24).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(`Thesis ${thesisIndex + 1}`, M, currentY, { width: CONTENT_W });
    currentY = pdf.y;

    // Thesis title
    pdf.fontSize(16).fillColor(C.slate700).font('Helvetica');
    pdf.text(truncateText(thesis.title, 70), M, currentY, { width: CONTENT_W });
    currentY = pdf.y + 8;

    // Type badge
    pdf.roundedRect(M, currentY, 90, 24, 4).fill(thesisColor.bg);
    pdf.fontSize(9).font('Helvetica-Bold').fillColor(thesisColor.text);
    pdf.text(thesis.thesisType.toUpperCase(), M, currentY + 7, { width: 90, align: 'center', lineBreak: false });
    currentY += 40;

    // Thesis description
    if (thesis.description) {
      drawCard(pdf, M, currentY, CONTENT_W, 80, C.slate50, C.slate200);
      pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
      pdf.text(truncateText(thesis.description, 300), M + 16, currentY + 16, { width: CONTENT_W - 32, lineGap: 3 });
      currentY += 95;
    }

    // Bets section header
    currentY = drawSectionHeader(pdf, `Bets (${bets.length})`, currentY);

    // Bets for this thesis
    if (bets.length === 0) {
      drawCard(pdf, M, currentY, CONTENT_W, 50, C.slate50, C.slate200);
      pdf.fontSize(10).font('Helvetica-Oblique').fillColor(C.slate500);
      pdf.text('No bets defined for this thesis yet', M, currentY + 18, { width: CONTENT_W, align: 'center' });
      currentY += 65;
    } else {
      for (let betIdx = 0; betIdx < bets.length; betIdx++) {
        const bet = bets[betIdx];

        // Calculate card height
        let cardHeight = 160;
        if (bet.killCriteria) cardHeight += 30;
        if (bet.assumptionBeingTested) cardHeight += 30;

        // Check if we need a new page
        if (currentY + cardHeight > MAX_Y) {
          addFooter(pdf, pageNum++);
          pdf.addPage();
          currentY = M;
        }

        const statusColor = getBetStatusColor(bet.status);

        // Card background
        drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);

        // Colored top bar
        pdf.rect(M, currentY, CONTENT_W, 6).fill(thesisColor.border);

        // Bet number badge
        pdf.circle(M + 24, currentY + 35, 16).fill(C.navy);
        pdf.fontSize(12).fillColor(C.white).font('Helvetica-Bold');
        pdf.text(`${betIdx + 1}`, M + 16, currentY + 29, { width: 16, align: 'center' });

        // Status badge
        pdf.roundedRect(PAGE_W - M - 70, currentY + 14, 60, 22, 4).fill(statusColor.bg);
        pdf.fontSize(8).font('Helvetica-Bold').fillColor(statusColor.text);
        pdf.text(bet.status.toUpperCase(), PAGE_W - M - 70, currentY + 21, { width: 60, align: 'center', lineBreak: false });

        // Score circle
        const score = bet.scoring?.overallScore || 0;
        pdf.circle(PAGE_W - M - 40, currentY + 60, 20).fill(C.navy);
        pdf.fontSize(14).fillColor(C.gold).font('Helvetica-Bold');
        pdf.text(String(score), PAGE_W - M - 52, currentY + 54, { width: 24, align: 'center' });
        pdf.fontSize(7).fillColor(C.slate400).font('Helvetica');
        pdf.text('SCORE', PAGE_W - M - 52, currentY + 82, { width: 24, align: 'center' });

        // Bet title
        let contentY = currentY + 20;
        pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
        pdf.text(truncateText(bet.bet, 60), M + 50, contentY, { width: CONTENT_W - 150 });
        contentY = pdf.y + 12;

        // Job to be done
        pdf.fontSize(8).fillColor(C.cyan600).font('Helvetica-Bold');
        pdf.text('JOB TO BE DONE', M + 16, contentY, { width: 80 });
        pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
        pdf.text(truncateText(bet.jobToBeDone, 70), M + 100, contentY, { width: CONTENT_W - 180 });
        contentY += 18;

        // Belief
        pdf.fontSize(8).fillColor(C.slate500).font('Helvetica-Bold');
        pdf.text('BELIEF', M + 16, contentY, { width: 80 });
        pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
        pdf.text(truncateText(bet.belief, 70), M + 100, contentY, { width: CONTENT_W - 180 });
        contentY += 18;

        // Success metric
        pdf.fontSize(8).fillColor(C.emerald600).font('Helvetica-Bold');
        pdf.text('SUCCESS', M + 16, contentY, { width: 80 });
        pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
        pdf.text(truncateText(bet.successMetric, 70), M + 100, contentY, { width: CONTENT_W - 180 });
        contentY += 18;

        // Kill criteria
        if (bet.killCriteria) {
          pdf.fontSize(8).fillColor(C.red600).font('Helvetica-Bold');
          pdf.text('KILL CRITERIA', M + 16, contentY, { width: 80 });
          pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
          pdf.text(truncateText(bet.killCriteria, 60), M + 100, contentY, { width: CONTENT_W - 180 });
          contentY += 18;
        }

        // Kill date
        if (bet.killDate) {
          const killDateApproaching = new Date(bet.killDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
          pdf.fontSize(8).fillColor(killDateApproaching ? C.red600 : C.slate500).font('Helvetica-Bold');
          pdf.text('KILL DATE', M + 16, contentY, { width: 80 });
          pdf.fontSize(9).fillColor(killDateApproaching ? C.red600 : C.slate700).font(killDateApproaching ? 'Helvetica-Bold' : 'Helvetica');
          pdf.text(formatDate(bet.killDate) + (killDateApproaching ? ' (Approaching!)' : ''), M + 100, contentY, { width: CONTENT_W - 180 });
          contentY += 18;
        }

        // Assumption
        if (bet.assumptionBeingTested) {
          pdf.fontSize(8).fillColor(C.purple600).font('Helvetica-Bold');
          pdf.text('ASSUMPTION', M + 16, contentY, { width: 80 });
          pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
          pdf.text(truncateText(bet.assumptionBeingTested, 70), M + 100, contentY, { width: CONTENT_W - 180 });
        }

        currentY += cardHeight + 16;
      }
    }

    addFooter(pdf, pageNum++);
  }

  return pageNum;
}

// =============================================================================
// PDF Generation
// =============================================================================

async function generatePdf(input: {
  betsData: BetsResponse;
  companyName?: string;
  generatedAt: string;
}): Promise<Buffer> {
  const { betsData, companyName, generatedAt } = input;
  const portfolioName = companyName || 'Strategic Bets Portfolio';
  const dateStr = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
    info: {
      Title: `Strategic Bets - ${portfolioName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 1;

  // PAGE 1: COVER
  renderCoverPage(pdf, portfolioName, betsData, dateStr);
  addFooter(pdf, pageNum++);

  // PAGE 2: PORTFOLIO SUMMARY
  pdf.addPage();
  renderPortfolioPage(pdf, betsData, pageNum++);

  // PAGES 3+: THESIS DETAILS
  if (betsData.theses.length > 0) {
    pageNum = renderThesisDetailsPages(pdf, betsData, pageNum);
  }

  pdf.end();

  return new Promise<Buffer>((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', (err: Error) => reject(err));
  });
}

// =============================================================================
// Supabase Client
// =============================================================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * POST /api/product-strategy-agent-v2/bets/export
 * Generate and download Strategic Bets Portfolio PDF
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch conversation to get company name
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*, client:clients(*)')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Fetch bets data
    const betsResponse = await fetch(
      `${req.nextUrl.origin}/api/product-strategy-agent-v2/bets?conversation_id=${conversation_id}`,
      {
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      }
    );

    if (!betsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bets data' },
        { status: 500 }
      );
    }

    const betsData: BetsResponse = await betsResponse.json();

    // Generate PDF
    const companyName = (conversation.client as { company_name?: string })?.company_name;

    console.log('Generating PDF for bets portfolio...');
    const pdfBuffer = await generatePdf({
      betsData,
      companyName,
      generatedAt: new Date().toISOString(),
    });

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Return PDF as download
    const safeName = companyName?.toLowerCase().replace(/\s+/g, '-') || 'portfolio';
    const filename = `strategic-bets-${safeName}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': uint8Array.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating bets PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
