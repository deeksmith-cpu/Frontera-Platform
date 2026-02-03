import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import type { BetsResponse, StrategicThesis, StrategicBet } from '@/types/bets';

// =============================================================================
// Brand Colors
// =============================================================================

const C = {
  navy: '#1a1f3a',
  gold: '#fbbf24',
  goldHover: '#f59e0b',
  cyan600: '#0891b2',
  cyan400: '#22d3ee',
  cyan200: '#a5f3fc',
  cyan50: '#ecfeff',
  slate900: '#0f172a',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  emerald600: '#059669',
  emerald500: '#10b981',
  emerald50: '#ecfdf5',
  amber600: '#d97706',
  amber500: '#f59e0b',
  amber50: '#fffbeb',
  purple600: '#9333ea',
  purple50: '#faf5ff',
  red500: '#ef4444',
};

// =============================================================================
// Layout Constants
// =============================================================================

const PAGE_W = 515.28; // A4 width minus 40+40 margins
const M = 40;          // margin
const FOOTER_Y = 790;
const MAX_Y = 755;     // content must stop here

// =============================================================================
// Helpers
// =============================================================================

function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getThesisTypeColor(type: string): { bg: string; text: string } {
  switch (type) {
    case 'offensive': return { bg: C.emerald50, text: C.emerald600 };
    case 'defensive': return { bg: C.amber50, text: C.amber600 };
    case 'capability': return { bg: C.purple50, text: C.purple600 };
    default: return { bg: C.slate100, text: C.slate600 };
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

/** Check remaining space; if insufficient, start a fresh page. */
function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > MAX_Y) {
    doc.addPage();
  }
}

/** Add footers to all buffered pages (call before doc.end). */
function addFootersToAllPages(doc: PDFKit.PDFDocument, companyName?: string) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    // Skip cover page (page 0)
    if (i === 0) continue;
    doc.save();
    doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
    doc.text(companyName || 'Strategic Bets Portfolio', M, FOOTER_Y, { width: PAGE_W / 2, lineBreak: false });
    doc.text(`${i}`, M + PAGE_W / 2, FOOTER_Y, { width: PAGE_W / 2, align: 'right', lineBreak: false });
    doc.restore();
  }
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

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: M, bottom: 0, left: M, right: M },
    autoFirstPage: true,
    bufferPages: true,
    info: {
      Title: `Strategic Bets - ${portfolioName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  // ======================= COVER PAGE =======================

  // Frontera logo box
  doc.rect(M, 100, 60, 60).fill(C.navy);
  doc.fontSize(28).font('Helvetica-Bold').fillColor(C.white)
    .text('F', M, 116, { width: 60, align: 'center' });

  // Gold accent line
  doc.rect(M, 190, 80, 3).fill(C.gold);

  // Report type label
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('STRATEGIC BETS PORTFOLIO', M, 220, { width: PAGE_W, characterSpacing: 2 });

  // Company name
  doc.fontSize(32).font('Helvetica-Bold').fillColor(C.slate900)
    .text(portfolioName, M, 250, { width: PAGE_W });

  // Navy accent line
  const nb = doc.y + 10;
  doc.rect(M, nb, 80, 3).fill(C.navy);

  // Stats box
  const statsY = nb + 40;
  doc.roundedRect(M, statsY, PAGE_W, 100, 8).fillAndStroke(C.cyan50, C.cyan200);

  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('PORTFOLIO OVERVIEW', M, statsY + 16, { width: PAGE_W, align: 'center' });

  // Stats grid
  const statBoxW = PAGE_W / 2 - 20;
  const col1X = M + 20;
  const col2X = M + PAGE_W / 2 + 10;
  const statY = statsY + 40;

  // Total Bets
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text('Total Bets', col1X, statY, { width: statBoxW, lineBreak: false });
  doc.fontSize(20).font('Helvetica-Bold').fillColor(C.navy)
    .text(betsData.portfolioSummary.totalBets.toString(), col1X, statY + 16, { width: statBoxW, lineBreak: false });

  // Total Theses
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text('Strategic Theses', col2X, statY, { width: statBoxW, lineBreak: false });
  doc.fontSize(20).font('Helvetica-Bold').fillColor(C.navy)
    .text(betsData.portfolioSummary.totalTheses.toString(), col2X, statY + 16, { width: statBoxW, lineBreak: false });

  // Generated date
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text(`Generated: ${dateStr}`, M, statsY + 82, { width: PAGE_W, align: 'center' });

  // Footer
  doc.fontSize(10).font('Helvetica').fillColor(C.slate400)
    .text('Powered by Frontera AI Strategy Coach', M, 720, { width: PAGE_W, align: 'center' });
  doc.fontSize(8).fillColor(C.slate300)
    .text('www.frontera.ai', M, 736, { width: PAGE_W, align: 'center' });

  // ======================= PORTFOLIO SUMMARY =======================

  doc.addPage();
  doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
    .text('Portfolio Summary', M, M, { width: PAGE_W });
  doc.moveDown(1);

  // Breakdown by thesis type
  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.slate700)
    .text('Strategic Thesis Breakdown', M, doc.y, { width: PAGE_W });
  doc.moveDown(0.8);

  const byType = betsData.portfolioSummary.byThesisType;
  const types = [
    { key: 'offensive', label: 'Offensive Theses', color: getThesisTypeColor('offensive') },
    { key: 'defensive', label: 'Defensive Theses', color: getThesisTypeColor('defensive') },
    { key: 'capability', label: 'Capability Building', color: getThesisTypeColor('capability') },
  ];

  for (const { key, label, color } of types) {
    const count = byType[key as keyof typeof byType] || 0;
    ensureSpace(doc, 70);

    const cardY = doc.y;

    // Card background
    doc.roundedRect(M, cardY, PAGE_W, 56, 6).fillAndStroke(color.bg, C.slate200);

    // Label
    doc.fontSize(9).font('Helvetica-Bold').fillColor(color.text)
      .text(label.toUpperCase(), M + 16, cardY + 14, { width: PAGE_W - 32, lineBreak: false });

    // Count
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(count.toString(), M + 16, cardY + 30, { width: PAGE_W - 32, lineBreak: false });

    doc.y = cardY + 68;
  }

  // Kill dates approaching warning
  if (betsData.portfolioSummary.killDatesApproaching > 0) {
    ensureSpace(doc, 70);
    const warnY = doc.y;

    doc.roundedRect(M, warnY, PAGE_W, 56, 6).fillAndStroke(C.amber50, C.amber500);

    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.amber600)
      .text('KILL DATES APPROACHING', M + 16, warnY + 14, { width: PAGE_W - 32, lineBreak: false });

    doc.fontSize(16).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`${betsData.portfolioSummary.killDatesApproaching} bets within 30 days`, M + 16, warnY + 32, { width: PAGE_W - 32 });

    doc.y = warnY + 68;
  }

  // Average score
  doc.moveDown(1.2);
  doc.fontSize(12).font('Helvetica-Bold').fillColor(C.slate700)
    .text(`Average Portfolio Score: ${betsData.portfolioSummary.avgScore.toFixed(1)}/10`, M, doc.y, { width: PAGE_W });

  // ======================= THESIS & BET DETAILS =======================

  for (let thesisIndex = 0; thesisIndex < betsData.theses.length; thesisIndex++) {
    const thesis = betsData.theses[thesisIndex];
    const thesisColor = getThesisTypeColor(thesis.thesisType);
    const bets = thesis.bets || [];

    // Start new page for each thesis
    doc.addPage();

    // Thesis header
    doc.fontSize(18).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Thesis ${thesisIndex + 1}: ${truncate(thesis.title, 60)}`, M, M, { width: PAGE_W });
    doc.moveDown(0.4);

    // Thesis type badge
    doc.fontSize(8).font('Helvetica-Bold').fillColor(thesisColor.text)
      .text(thesis.thesisType.toUpperCase(), M, doc.y, { width: PAGE_W, lineBreak: false });
    doc.moveDown(0.6);

    // Thesis description
    if (thesis.description) {
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
        .text(thesis.description, M, doc.y, { width: PAGE_W, lineGap: 3 });
      doc.moveDown(0.8);
    }

    // Divider
    doc.save();
    const divY = doc.y;
    doc.moveTo(M, divY).lineTo(M + PAGE_W, divY).strokeColor(C.slate200).lineWidth(1).stroke();
    doc.restore();
    doc.y = divY + 16;

    // Bets for this thesis
    if (bets.length === 0) {
      const emptyY = doc.y;
      doc.roundedRect(M, emptyY, PAGE_W, 40, 6).fill(C.slate50);
      doc.fontSize(10).font('Helvetica-Oblique').fillColor(C.slate500)
        .text('No bets defined for this thesis yet', M, emptyY + 14, { width: PAGE_W, align: 'center' });
      doc.y = emptyY + 50;
    } else {
      for (const bet of bets) {
        // Calculate approximate height needed
        let estimatedHeight = 100;
        if (bet.killCriteria) estimatedHeight += 30;
        if (bet.killDate) estimatedHeight += 20;
        if (bet.evidenceLinks && bet.evidenceLinks.length > 0) estimatedHeight += 30;
        if (bet.assumptionBeingTested) estimatedHeight += 30;

        ensureSpace(doc, estimatedHeight);

        const statusColor = getBetStatusColor(bet.status);
        const betCardY = doc.y;
        let currentY = betCardY;

        // Calculate card height by rendering content in memory
        const startY = currentY;

        // Bet header section
        currentY += 14; // top padding

        // Bet title (can wrap, estimate 2 lines max)
        const titleLines = Math.ceil(bet.bet.length / 70);
        currentY += Math.min(titleLines, 2) * 14;
        currentY += 8; // spacing after title

        // Kill criteria
        if (bet.killCriteria) {
          currentY += 10; // label
          const criteriaLines = Math.ceil(bet.killCriteria.length / 90);
          currentY += Math.min(criteriaLines, 2) * 11;
          currentY += 8;
        }

        // Kill date
        if (bet.killDate) {
          currentY += 11;
          currentY += 8;
        }

        // Evidence
        if (bet.evidenceLinks && bet.evidenceLinks.length > 0) {
          currentY += 10; // label
          currentY += Math.min(bet.evidenceLinks.length, 2) * 11;
          if (bet.evidenceLinks.length > 2) currentY += 11;
          currentY += 8;
        }

        // Assumption
        if (bet.assumptionBeingTested) {
          currentY += 10; // label
          const assumptionLines = Math.ceil(bet.assumptionBeingTested.length / 90);
          currentY += Math.min(assumptionLines, 2) * 11;
        }

        currentY += 14; // bottom padding

        const cardHeight = currentY - startY;

        // Draw card background
        doc.roundedRect(M, betCardY, PAGE_W, cardHeight, 8).fillAndStroke(C.white, C.slate200);

        // Draw colored top bar
        doc.save();
        doc.rect(M, betCardY, PAGE_W, 4).fill(thesisColor.text);
        doc.restore();

        // Now draw actual content
        currentY = betCardY + 14;

        // Bet title
        doc.fontSize(11).font('Helvetica-Bold').fillColor(C.slate900)
          .text(truncate(bet.bet, 80), M + 12, currentY, { width: PAGE_W - 90, lineBreak: true });

        // Status badge (top-right corner)
        doc.save();
        doc.roundedRect(M + PAGE_W - 70, betCardY + 10, 62, 18, 4).fill(statusColor.bg);
        doc.fontSize(7).font('Helvetica-Bold').fillColor(statusColor.text)
          .text(bet.status.toUpperCase(), M + PAGE_W - 70, betCardY + 15, { width: 62, align: 'center', lineBreak: false });
        doc.restore();

        currentY += Math.min(Math.ceil(bet.bet.length / 70), 2) * 14 + 8;

        // Kill criteria
        if (bet.killCriteria) {
          doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500)
            .text('KILL CRITERIA', M + 12, currentY, { width: PAGE_W - 24, lineBreak: false });
          currentY += 10;

          doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
            .text(truncate(bet.killCriteria, 150), M + 12, currentY, { width: PAGE_W - 24, lineBreak: true });
          currentY += Math.min(Math.ceil(bet.killCriteria.length / 90), 2) * 11 + 8;
        }

        // Kill date
        if (bet.killDate) {
          const killDateApproaching = new Date(bet.killDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

          doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500)
            .text('KILL DATE: ', M + 12, currentY, { continued: true, lineBreak: false });

          doc.fontSize(9).font(killDateApproaching ? 'Helvetica-Bold' : 'Helvetica')
            .fillColor(killDateApproaching ? C.amber600 : C.slate600)
            .text(formatDate(bet.killDate) + (killDateApproaching ? ' (Approaching)' : ''), { lineBreak: false });

          currentY += 11 + 8;
        }

        // Evidence links
        if (bet.evidenceLinks && bet.evidenceLinks.length > 0) {
          doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500)
            .text(`EVIDENCE (${bet.evidenceLinks.length})`, M + 12, currentY, { width: PAGE_W - 24, lineBreak: false });
          currentY += 10;

          for (let i = 0; i < Math.min(2, bet.evidenceLinks.length); i++) {
            doc.save();
            doc.circle(M + 16, currentY + 4, 2).fill(C.cyan600);
            doc.restore();

            doc.fontSize(8).font('Helvetica').fillColor(C.slate600)
              .text('Linked to opportunity evidence', M + 24, currentY, { width: PAGE_W - 36, lineBreak: false });
            currentY += 11;
          }

          if (bet.evidenceLinks.length > 2) {
            doc.fontSize(8).font('Helvetica-Oblique').fillColor(C.slate500)
              .text(`+${bet.evidenceLinks.length - 2} more`, M + 24, currentY, { width: PAGE_W - 36, lineBreak: false });
            currentY += 11;
          }
          currentY += 8;
        }

        // Assumption being tested
        if (bet.assumptionBeingTested) {
          doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500)
            .text('ASSUMPTION BEING TESTED', M + 12, currentY, { width: PAGE_W - 24, lineBreak: false });
          currentY += 10;

          doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
            .text(truncate(bet.assumptionBeingTested, 150), M + 12, currentY, { width: PAGE_W - 24, lineBreak: true });
          currentY += Math.min(Math.ceil(bet.assumptionBeingTested.length / 90), 2) * 11;
        }

        // Move doc.y past the card
        doc.y = betCardY + cardHeight + 16;
      }
    }
  }

  // Add footers to all pages (except cover) now that all content is laid out
  addFootersToAllPages(doc, companyName);

  // Flush buffered pages before ending
  doc.flushPages();
  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));
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
 * POST /api/product-strategy-agent/bets/export
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
      `${req.nextUrl.origin}/api/product-strategy-agent/bets?conversation_id=${conversation_id}`,
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
