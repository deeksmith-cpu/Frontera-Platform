import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import type { Database, Client } from '@/types/database';
import type { SynthesisResult, StrategicOpportunity, StrategicTension } from '@/types/synthesis';

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
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function qLabel(q: string): string {
  return q.charAt(0).toUpperCase() + q.slice(1);
}

function qColor(q: string): string {
  switch (q) {
    case 'invest': return C.emerald600;
    case 'explore': return C.cyan600;
    case 'harvest': return C.amber600;
    default: return C.slate500;
  }
}

function qBg(q: string): string {
  switch (q) {
    case 'invest': return C.emerald50;
    case 'explore': return C.cyan50;
    case 'harvest': return C.amber50;
    default: return C.slate100;
  }
}

function impactColor(i: string): { bg: string; text: string; border: string } {
  if (i === 'blocking') return { bg: C.red50, text: C.red500, border: C.red500 };
  if (i === 'significant') return { bg: C.amber50, text: C.amber600, border: C.amber600 };
  return { bg: C.slate50, text: C.slate600, border: C.slate300 };
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
  synthesis: SynthesisResult,
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
  pdf.text('STRATEGIC SYNTHESIS', M, 50, { width: CONTENT_W });

  // Main title
  pdf.fontSize(42).fillColor(C.white).font('Helvetica-Bold');
  pdf.text('Strategic Synthesis', M, 85, { width: CONTENT_W });

  // Company name
  pdf.fontSize(24).fillColor(C.cyan400).font('Helvetica');
  pdf.text(companyName, M, 140, { width: CONTENT_W });

  // Date
  pdf.fontSize(11).fillColor(C.slate400).font('Helvetica');
  pdf.text(dateStr, M, 180, { width: CONTENT_W });

  // Key metrics row
  const metricsY = 220;

  // Opportunities count
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(synthesis.opportunities.length), M, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Opportunities', M, metricsY + 36, { width: 100, align: 'left' });

  // Tensions count
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(synthesis.tensions?.length || 0), M + 120, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Tensions', M + 120, metricsY + 36, { width: 100, align: 'left' });

  // Recommendations count
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(synthesis.recommendations?.length || 0), M + 240, metricsY, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Recommendations', M + 240, metricsY + 36, { width: 100, align: 'left' });

  // Content section (below header)
  let currentY = headerHeight + 30;

  // Executive Summary Section
  currentY = drawSectionHeader(pdf, 'Executive Summary', currentY);

  // Executive summary card
  const summaryText = truncateText(synthesis.executiveSummary || 'No executive summary available.', 400);
  drawCard(pdf, M, currentY, CONTENT_W, 120, C.slate50, C.slate200);
  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(summaryText, M + 16, currentY + 16, { width: CONTENT_W - 32, lineGap: 3 });
  currentY += 135;

  // Methodology badge
  drawCard(pdf, M, currentY, CONTENT_W, 60, C.cyan50, C.cyan200);
  pdf.fontSize(9).fillColor(C.slate500).font('Helvetica-Bold');
  pdf.text('METHODOLOGY', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Playing to Win Framework', M + 16, currentY + 28, { width: CONTENT_W - 32 });
  pdf.fontSize(9).fillColor(C.slate500).font('Helvetica');
  pdf.text('by Roger Martin & A.G. Lafley', M + 16, currentY + 44, { width: CONTENT_W - 32 });
  currentY += 75;

  // Metadata row
  const metaText = `Model: ${synthesis.metadata.modelUsed}  |  Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}  |  Areas analyzed: ${synthesis.metadata.researchAreasCount}`;
  pdf.fontSize(8).fillColor(C.slate400).font('Helvetica');
  pdf.text(metaText, M, currentY, { width: CONTENT_W, align: 'center' });
}

// =============================================================================
// 2×2 Strategic Opportunity Map
// =============================================================================

function renderQuadrantMapPage(pdf: PDFKit.PDFDocument, opportunities: StrategicOpportunity[]) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Strategic Opportunity Map', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Market Attractiveness vs Capability Fit', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  // Draw the quadrant map
  const chartSize = 340;
  const chartX = M + (CONTENT_W - chartSize) / 2;
  const chartY = currentY;
  const half = chartSize / 2;
  const midX = chartX + half;
  const midY = chartY + half;

  // Quadrant background fills
  pdf.rect(chartX, chartY, half, half).fill(qBg('explore'));
  pdf.rect(midX, chartY, half, half).fill(qBg('invest'));
  pdf.rect(chartX, midY, half, half).fill(C.slate100);
  pdf.rect(midX, midY, half, half).fill(qBg('harvest'));

  // Grid lines
  pdf.save();
  pdf.strokeColor(C.slate300).lineWidth(1);
  pdf.rect(chartX, chartY, chartSize, chartSize).stroke();
  pdf.moveTo(midX, chartY).lineTo(midX, chartY + chartSize).stroke();
  pdf.moveTo(chartX, midY).lineTo(chartX + chartSize, midY).stroke();
  pdf.restore();

  // Quadrant labels
  pdf.save();
  pdf.fontSize(9).font('Helvetica-Bold');
  pdf.fillColor(qColor('explore')).text('EXPLORE', chartX + 8, chartY + 8, { width: half - 16, lineBreak: false });
  pdf.fillColor(qColor('invest')).text('INVEST', midX + 8, chartY + 8, { width: half - 16, lineBreak: false });
  pdf.fillColor(C.slate500).text('DIVEST', chartX + 8, midY + 8, { width: half - 16, lineBreak: false });
  pdf.fillColor(qColor('harvest')).text('HARVEST', midX + 8, midY + 8, { width: half - 16, lineBreak: false });
  pdf.restore();

  // Axis labels
  pdf.save();
  pdf.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600);
  pdf.text('CAPABILITY FIT →', chartX, chartY + chartSize + 10, { width: chartSize, align: 'center', lineBreak: false });
  pdf.restore();

  // Plot opportunities as numbered circles
  pdf.save();
  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    const capX = chartX + (opp.scoring.capabilityFit / 10) * chartSize;
    const mktY = chartY + chartSize - (opp.scoring.marketAttractiveness / 10) * chartSize;
    const color = qColor(opp.quadrant);

    pdf.circle(capX, mktY, 14).fill(color);
    pdf.fontSize(10).font('Helvetica-Bold').fillColor(C.white);
    pdf.text(`${i + 1}`, capX - 6, mktY - 5, { width: 12, align: 'center', lineBreak: false });
  }
  pdf.restore();

  // Legend below chart
  currentY = chartY + chartSize + 30;
  pdf.fontSize(9).font('Helvetica-Bold').fillColor(C.slate600);
  pdf.text('OPPORTUNITIES LEGEND', M, currentY, { width: CONTENT_W });
  currentY += 16;

  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    const color = qColor(opp.quadrant);
    const legendY = currentY;

    pdf.save();
    pdf.circle(M + 8, legendY + 5, 8).fill(color);
    pdf.fontSize(9).font('Helvetica-Bold').fillColor(C.white);
    pdf.text(`${i + 1}`, M + 2, legendY + 2, { width: 12, align: 'center', lineBreak: false });
    pdf.restore();

    const shortTitle = truncateText(opp.title, 80);
    pdf.fontSize(9).font('Helvetica').fillColor(C.slate700);
    pdf.text(shortTitle, M + 24, legendY, { width: CONTENT_W - 24, lineBreak: false });
    currentY += 18;
  }
}

// =============================================================================
// Opportunity Detail Cards
// =============================================================================

function renderOpportunityDetails(pdf: PDFKit.PDFDocument, opportunities: StrategicOpportunity[], startPageNum: number): number {
  let pageNum = startPageNum;
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Strategic Opportunities', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text(`${opportunities.length} opportunities identified`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    const color = qColor(opp.quadrant);
    const bgColor = qBg(opp.quadrant);

    // Calculate card height
    let cardHeight = 160;
    if (opp.ptw) cardHeight += 60;
    if (opp.evidence && opp.evidence.length > 0) cardHeight += 50;

    // Check if we need a new page
    if (currentY + cardHeight > MAX_Y) {
      addFooter(pdf, pageNum++);
      pdf.addPage();
      currentY = M;
    }

    // Card background
    drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);

    // Colored top bar
    pdf.rect(M, currentY, CONTENT_W, 6).fill(color);

    // Number badge
    pdf.circle(M + 24, currentY + 35, 18).fill(C.navy);
    pdf.fontSize(14).fillColor(C.white).font('Helvetica-Bold');
    pdf.text(`${i + 1}`, M + 16, currentY + 29, { width: 16, align: 'center' });

    // Quadrant badge
    pdf.roundedRect(PAGE_W - M - 70, currentY + 14, 60, 22, 4).fill(bgColor);
    pdf.fontSize(8).font('Helvetica-Bold').fillColor(color);
    pdf.text(qLabel(opp.quadrant).toUpperCase(), PAGE_W - M - 70, currentY + 21, { width: 60, align: 'center', lineBreak: false });

    // Title
    pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(truncateText(opp.title, 60), M + 52, currentY + 20, { width: CONTENT_W - 140 });

    // Description
    let contentY = currentY + 55;
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(truncateText(opp.description, 200), M + 16, contentY, { width: CONTENT_W - 32, lineGap: 2 });
    contentY = pdf.y + 12;

    // Scores row
    pdf.fontSize(8).fillColor(C.slate500).font('Helvetica');
    const scoresText = `Market: ${opp.scoring.marketAttractiveness}/10  |  Capability: ${opp.scoring.capabilityFit}/10  |  Advantage: ${opp.scoring.competitiveAdvantage}/10  |  Score: ${opp.scoring.overallScore}`;
    pdf.text(scoresText, M + 16, contentY, { width: CONTENT_W - 32 });
    contentY = pdf.y + 12;

    // PTW section
    if (opp.ptw) {
      drawCard(pdf, M + 16, contentY, CONTENT_W - 32, 50, C.cyan50, C.cyan200);
      pdf.fontSize(8).fillColor(C.slate500).font('Helvetica-Bold');
      pdf.text('PLAYING TO WIN CASCADE', M + 28, contentY + 8, { width: CONTENT_W - 56 });
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`Where: ${truncateText(opp.ptw.whereToPlay, 80)}  |  How: ${truncateText(opp.ptw.howToWin, 80)}`, M + 28, contentY + 22, { width: CONTENT_W - 56, lineGap: 1 });
      contentY += 60;
    }

    // Evidence
    if (opp.evidence && opp.evidence.length > 0) {
      pdf.fontSize(8).fillColor(C.slate500).font('Helvetica-Bold');
      pdf.text('EVIDENCE', M + 16, contentY, { width: CONTENT_W - 32 });
      contentY += 12;

      for (const ev of opp.evidence.slice(0, 2)) {
        const q = truncateText(ev.quote, 90);
        pdf.fontSize(8).fillColor(C.cyan600).font('Helvetica-Bold');
        pdf.text(`${ev.territory} › ${ev.researchArea}`, M + 16, contentY, { width: CONTENT_W - 32 });
        contentY = pdf.y + 2;
        pdf.fontSize(8).fillColor(C.slate500).font('Helvetica-Oblique');
        pdf.text(`"${q}"`, M + 16, contentY, { width: CONTENT_W - 32 });
        contentY = pdf.y + 6;
      }
    }

    currentY += cardHeight + 16;
  }

  addFooter(pdf, pageNum++);
  return pageNum;
}

// =============================================================================
// Tensions Page
// =============================================================================

function renderTensionsPage(pdf: PDFKit.PDFDocument, tensions: StrategicTension[], startPageNum: number): number {
  let pageNum = startPageNum;
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Strategic Tensions', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text(`${tensions.length} tensions identified`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  for (const tension of tensions) {
    const ic = impactColor(tension.impact);

    // Calculate card height
    let cardHeight = 80;
    if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
      cardHeight += tension.resolutionOptions.length * 45;
    }

    // Check if we need a new page
    if (currentY + cardHeight > MAX_Y) {
      addFooter(pdf, pageNum++);
      pdf.addPage();
      currentY = M;
    }

    // Card background
    drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);

    // Impact colored left bar
    pdf.rect(M, currentY, 4, cardHeight).fill(ic.border);

    // Impact badge
    pdf.roundedRect(PAGE_W - M - 80, currentY + 12, 70, 22, 4).fill(ic.bg);
    pdf.fontSize(8).font('Helvetica-Bold').fillColor(ic.text);
    pdf.text(tension.impact.toUpperCase(), PAGE_W - M - 80, currentY + 19, { width: 70, align: 'center', lineBreak: false });

    // Description
    pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(truncateText(tension.description, 80), M + 16, currentY + 16, { width: CONTENT_W - 110 });

    let contentY = currentY + 45;

    // Resolution options
    if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
      pdf.fontSize(8).fillColor(C.slate500).font('Helvetica-Bold');
      pdf.text('RESOLUTION OPTIONS', M + 16, contentY, { width: CONTENT_W - 32 });
      contentY += 14;

      for (let i = 0; i < tension.resolutionOptions.length; i++) {
        const opt = tension.resolutionOptions[i];

        // Number circle
        if (opt.recommended) {
          pdf.circle(M + 26, contentY + 6, 8).fill(C.emerald600);
        } else {
          pdf.circle(M + 26, contentY + 6, 8).fillAndStroke(C.white, C.slate300);
        }
        pdf.fontSize(9).font('Helvetica-Bold').fillColor(opt.recommended ? C.white : C.slate600);
        pdf.text(`${i + 1}`, M + 21, contentY + 2, { width: 10, align: 'center', lineBreak: false });

        // Option text
        pdf.fontSize(9).font(opt.recommended ? 'Helvetica-Bold' : 'Helvetica').fillColor(opt.recommended ? C.emerald600 : C.slate700);
        pdf.text(truncateText(opt.option, 70), M + 42, contentY, { width: CONTENT_W - 80 });
        contentY = pdf.y + 2;

        // Trade-off
        pdf.fontSize(8).fillColor(C.slate500).font('Helvetica');
        pdf.text(`Trade-off: ${truncateText(opt.tradeOff, 80)}`, M + 42, contentY, { width: CONTENT_W - 80 });
        contentY = pdf.y + 10;
      }
    }

    currentY += cardHeight + 16;
  }

  addFooter(pdf, pageNum++);
  return pageNum;
}

// =============================================================================
// Recommendations Page
// =============================================================================

function renderRecommendationsPage(pdf: PDFKit.PDFDocument, recommendations: string[], pageNum: number) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Priority Recommendations', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic priorities for immediate focus', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  recommendations.forEach((rec, i) => {
    const cardHeight = 70;

    if (currentY + cardHeight > MAX_Y) {
      addFooter(pdf, pageNum);
      pdf.addPage();
      currentY = M;
      pageNum++;
    }

    // Card background
    drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);

    // Gold accent bar
    pdf.rect(M, currentY, 4, cardHeight).fill(C.gold);

    // Number circle
    pdf.circle(M + 30, currentY + cardHeight / 2, 16).fill(C.navy);
    pdf.fontSize(12).font('Helvetica-Bold').fillColor(C.white);
    pdf.text(`${i + 1}`, M + 22, currentY + cardHeight / 2 - 6, { width: 16, align: 'center' });

    // Recommendation text
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(truncateText(rec, 200), M + 56, currentY + 16, { width: CONTENT_W - 72, lineGap: 3 });

    currentY += cardHeight + 12;
  });

  addFooter(pdf, pageNum);
}

// =============================================================================
// PDF Generation
// =============================================================================

async function generatePdf(input: {
  synthesis: SynthesisResult;
  client: Client | null;
  generatedAt: string;
}): Promise<Buffer> {
  const { synthesis, client, generatedAt } = input;
  const companyName = client?.company_name || 'Strategic Analysis';
  const dateStr = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
    info: {
      Title: `Strategic Synthesis - ${companyName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 1;

  // PAGE 1: COVER
  renderCoverPage(pdf, companyName, synthesis, dateStr);
  addFooter(pdf, pageNum++);

  // PAGE 2: QUADRANT MAP
  if (synthesis.opportunities.length > 0) {
    pdf.addPage();
    renderQuadrantMapPage(pdf, synthesis.opportunities);
    addFooter(pdf, pageNum++);

    // PAGES 3+: OPPORTUNITY DETAILS
    pdf.addPage();
    pageNum = renderOpportunityDetails(pdf, synthesis.opportunities, pageNum);
  }

  // TENSIONS PAGE
  if (synthesis.tensions && synthesis.tensions.length > 0) {
    pdf.addPage();
    pageNum = renderTensionsPage(pdf, synthesis.tensions, pageNum);
  }

  // RECOMMENDATIONS PAGE
  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    pdf.addPage();
    renderRecommendationsPage(pdf, synthesis.recommendations, pageNum);
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
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient<Database>(url, key);
}

function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =============================================================================
// GET /api/product-strategy-agent/synthesis/export
// =============================================================================

export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversation_id');
    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id query parameter is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const rawSupabase = getRawSupabase();

    const { data: conversation, error: convError } = await supabase
      .from('conversations').select('id')
      .eq('id', conversationId).eq('clerk_org_id', orgId).single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const { data: synthesisData, error: synthError } = await rawSupabase
      .from('synthesis_outputs').select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false }).limit(1).single();

    if (synthError || !synthesisData) {
      return NextResponse.json(
        { error: 'No synthesis found for this conversation. Please generate synthesis first.' },
        { status: 404 }
      );
    }

    const { data: clientData } = await supabase
      .from('clients').select('*').eq('clerk_org_id', orgId).single();

    const synthesis: SynthesisResult = {
      id: synthesisData.id,
      conversationId: synthesisData.conversation_id,
      executiveSummary: synthesisData.executive_summary || synthesisData.synthesis_content || '',
      opportunities: (synthesisData.opportunities || []) as StrategicOpportunity[],
      tensions: (synthesisData.tensions || []) as StrategicTension[],
      recommendations: synthesisData.recommendations || [],
      metadata: {
        modelUsed: synthesisData.metadata?.model_used || 'unknown',
        territoriesIncluded: (synthesisData.metadata?.territories_included || []) as ('company' | 'customer' | 'competitor')[],
        researchAreasCount: synthesisData.metadata?.research_areas_count || 0,
        generatedAt: synthesisData.metadata?.generated_at || synthesisData.created_at,
        confidenceLevel: synthesisData.metadata?.confidence_level || 'medium',
      },
      userEdited: synthesisData.user_edited || false,
      editedAt: synthesisData.edited_at || undefined,
      createdAt: synthesisData.created_at,
    };

    if (synthesis.opportunities.length === 0) {
      return NextResponse.json(
        { error: 'Synthesis has no opportunities. Please regenerate synthesis.' },
        { status: 400 }
      );
    }

    console.log('Generating PDF for synthesis:', synthesis.id);
    const typedClient = clientData as unknown as Client | null;

    const pdfBuffer = await generatePdf({
      synthesis, client: typedClient, generatedAt: new Date().toISOString(),
    });

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    const cName = typedClient?.company_name || 'Strategy';
    const safeName = cName.replace(/[^a-zA-Z0-9]/g, '-');
    const d = new Date().toISOString().split('T')[0];
    const filename = `Strategic-Synthesis-${safeName}-${d}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
