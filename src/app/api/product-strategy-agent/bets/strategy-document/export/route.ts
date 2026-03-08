import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key);
}

// Brand colors
const C = {
  navy: '#1a1f3a',
  navyLight: '#2d3561',
  gold: '#fbbf24',
  goldDark: '#d97706',
  cyan50: '#ecfeff',
  cyan200: '#a5f3fc',
  cyan400: '#22d3ee',
  cyan600: '#0891b2',
  emerald50: '#ecfdf5',
  emerald600: '#059669',
  amber50: '#fffbeb',
  amber600: '#d97706',
  purple50: '#faf5ff',
  purple600: '#9333ea',
  red600: '#dc2626',
  slate50: '#f8fafc',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  white: '#ffffff',
};

const M = 50;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - M * 2;

// =============================================================================
// New narrative document type
// =============================================================================
interface NarrativeDocumentContent {
  productVision: { narrative: string; stateOfBusiness: string };
  marketInsights: { narrative: string };
  strategicChoices: { narrative: string };
  roadmap: { narrative: string };
  operatingModel: { narrative: string };
  executionPlan: { narrative: string };
  appendix: {
    selectedBets: Array<{
      id: string;
      thesisTitle: string;
      thesisType: string;
      hypothesis: { job: string; belief: string; bet: string; success: string; kill: { criteria: string; date: string } };
      scoring: { expectedImpact: number; certaintyOfImpact: number; clarityOfLevers: number; uniquenessOfLevers: number; overallScore: number };
      risks: Record<string, string>;
      evidence: Array<{ territory?: string; quote?: string }>;
    }>;
    portfolioBalance: { offensive: number; defensive: number; capability: number };
    dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
    ptwCascade: { winningAspiration: string; whereToPlay: string[]; howToWin: string[]; capabilities: string[]; managementSystems: string[] };
  };
}

// Legacy type for backward compat
interface LegacyDocumentContent {
  executiveSummary: {
    companyOverview: string; strategicIntent: string; keyFindings: string[];
    topOpportunities: string[]; recommendedBets: string;
  };
  ptwCascade: { winningAspiration: string; whereToPlay: string[]; howToWin: string[]; capabilities: string[]; managementSystems: string[] };
  selectedBets: Array<{
    id: string; thesisTitle: string; thesisType: string;
    hypothesis: { job: string; belief: string; bet: string; success: string; kill: { criteria: string; date: string } };
    scoring: { expectedImpact: number; certaintyOfImpact: number; clarityOfLevers: number; uniquenessOfLevers: number; overallScore: number };
    risks: Record<string, string>; evidence: Array<{ territory: string; quote: string }>;
  }>;
  portfolioView: {
    coherenceAnalysis: string; balance: { offensive: number; defensive: number; capability: number };
    sequencing: Array<{ betId: string; dependsOn: string[] }>; resourceAllocation: Array<{ allocation: string; betCount: number }>;
    dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
  };
  nextSteps: { validationTimeline: string; governance: string; trackingPlan: string; killCriteriaReview: string; nextTopics: string[] };
}

function isNarrativeDoc(doc: unknown): doc is NarrativeDocumentContent {
  return typeof doc === 'object' && doc !== null && 'productVision' in doc;
}

// =============================================================================
// POST handler
// =============================================================================
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, document_id } = body;

    if (!conversation_id && !document_id) {
      return NextResponse.json({ error: 'Either conversation_id or document_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    let query = supabase.from('strategy_documents').select('*');
    if (document_id) {
      query = query.eq('id', document_id);
    } else {
      query = query.eq('conversation_id', conversation_id).order('created_at', { ascending: false }).limit(1);
    }

    const { data: strategyDoc, error: docError } = await query.single();
    if (docError || !strategyDoc) {
      return NextResponse.json({ error: 'Strategy document not found' }, { status: 404 });
    }

    const { data: client } = await supabase
      .from('clients')
      .select('company_name')
      .eq('clerk_org_id', orgId)
      .single();

    const companyName = client?.company_name || 'Your Company';
    const docContent = strategyDoc.document_content;

    const pdfBuffer = isNarrativeDoc(docContent)
      ? await generateNarrativePDF(companyName, docContent)
      : await generateLegacyPDF(companyName, docContent as LegacyDocumentContent);

    await supabase
      .from('strategy_documents')
      .update({ exported_at: new Date().toISOString() })
      .eq('id', strategyDoc.id);

    const uint8Array = new Uint8Array(pdfBuffer);
    const filename = `product-strategy-${companyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('POST /api/product-strategy-agent/bets/strategy-document/export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// Helpers
// =============================================================================

function addFooter(pdf: PDFKit.PDFDocument, pageNum: number, totalPages?: number) {
  pdf.moveTo(M, PAGE_H - 40).lineTo(PAGE_W - M, PAGE_H - 40).strokeColor(C.gold).lineWidth(2).stroke();
  pdf.fontSize(8).fillColor(C.slate500).font('Helvetica');
  pdf.text('Frontera Product Strategy Coach', M, PAGE_H - 30, { width: CONTENT_W / 2, align: 'left' });
  const pageLabel = totalPages ? `Page ${pageNum} of ${totalPages}` : `Page ${pageNum}`;
  pdf.text(pageLabel, M + CONTENT_W / 2, PAGE_H - 30, { width: CONTENT_W / 2, align: 'right' });
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// =============================================================================
// Narrative PDF Generation (new format)
// =============================================================================

function renderNarrativeCover(pdf: PDFKit.PDFDocument, companyName: string, betCount: number) {
  // Navy header (top 40%)
  const headerHeight = 340;
  pdf.rect(0, 0, PAGE_W, headerHeight).fill(C.navy);
  pdf.rect(0, headerHeight - 4, PAGE_W, 4).fill(C.gold);

  // Decorative circles
  pdf.circle(PAGE_W - 80, 80, 120).fillOpacity(0.03).fill(C.gold);
  pdf.circle(PAGE_W - 40, 160, 80).fillOpacity(0.05).fill(C.gold);
  pdf.fillOpacity(1);

  // Labels
  pdf.fontSize(11).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('PRODUCT STRATEGY 6-PAGER', M, 60, { width: CONTENT_W });

  pdf.fontSize(42).fillColor(C.white).font('Helvetica-Bold');
  pdf.text('Product Strategy', M, 95, { width: CONTENT_W });

  pdf.fontSize(24).fillColor(C.cyan400).font('Helvetica');
  pdf.text(companyName, M, 155, { width: CONTENT_W });

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.fontSize(11).fillColor(C.slate400).font('Helvetica');
  pdf.text(dateStr, M, 195, { width: CONTENT_W });

  // Key metrics
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(betCount), M, 240, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Strategic Bets', M, 276, { width: 100, align: 'left' });

  // Table of contents below header
  let currentY = headerHeight + 40;
  pdf.fontSize(16).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('TABLE OF CONTENTS', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 16;

  const tocItems = [
    'Product Vision & Strategic Context',
    'Market Trends, Customer Problems & Opportunities',
    'Where We Play & How We Win',
    'Product Strategy & Roadmap Themes',
    'Operating Model & Capability Build',
    'Strategic Priorities & Execution',
    'Appendix — Supporting Data',
  ];

  tocItems.forEach((item, i) => {
    const label = i < 6 ? `Page ${i + 1}` : 'Appendix';
    pdf.fontSize(11).fillColor(C.slate700).font('Helvetica');
    pdf.text(`${label}`, M, currentY, { width: 60 });
    pdf.text(item, M + 70, currentY, { width: CONTENT_W - 70 });
    currentY = pdf.y + 8;
  });
}

function renderNarrativePage(
  pdf: PDFKit.PDFDocument,
  title: string,
  pageNumber: number,
  narrative: string,
  secondaryTitle?: string,
  secondaryNarrative?: string
) {
  let currentY = M;

  // Page number badge
  pdf.fontSize(9).fillColor(C.slate400).font('Helvetica');
  pdf.text(`PAGE ${pageNumber}`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 4;

  // Title with gold underline
  pdf.fontSize(22).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(title, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 6;
  pdf.moveTo(M, currentY).lineTo(M + 120, currentY).strokeColor(C.gold).lineWidth(3).stroke();
  currentY += 16;

  // Primary narrative
  currentY = renderProse(pdf, narrative, currentY);

  // Secondary section
  if (secondaryTitle && secondaryNarrative) {
    currentY += 12;

    // Check if we need a new page
    if (currentY > PAGE_H - 200) {
      return; // Let it overflow to auto-page — PDFKit handles this with bufferPages
    }

    pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(secondaryTitle, M, currentY, { width: CONTENT_W });
    currentY = pdf.y + 4;
    pdf.moveTo(M, currentY).lineTo(M + 60, currentY).strokeColor(C.slate200).lineWidth(1).stroke();
    currentY += 10;

    renderProse(pdf, secondaryNarrative, currentY);
  }
}

function renderProse(pdf: PDFKit.PDFDocument, text: string, startY: number): number {
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  let currentY = startY;
  paragraphs.forEach((para, idx) => {
    const trimmed = para.trim();
    const isPullQuote = trimmed.startsWith('"');

    if (isPullQuote) {
      // Pull quote: gold left rule, italic, indented both sides
      const quoteX = M + 20;
      const quoteW = CONTENT_W - 40;
      pdf.moveTo(M + 10, currentY).lineTo(M + 10, currentY + 40).strokeColor(C.gold).lineWidth(3).stroke();
      pdf.fontSize(11.5).fillColor(C.slate600).font('Helvetica-Oblique');
      pdf.text(trimmed, quoteX, currentY, {
        width: quoteW,
        lineGap: 5,
        align: 'left',
      });
      currentY = pdf.y + 14;
    } else if (idx === 0) {
      // Drop cap: first character rendered large
      const firstChar = trimmed.charAt(0);
      const restOfText = trimmed.substring(1);

      // Render drop cap character
      pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
      pdf.text(firstChar, M, currentY - 2, { width: 22, continued: false });
      const dropCapBottom = pdf.y;

      // Render rest of first paragraph alongside and below drop cap
      pdf.fontSize(11.5).fillColor(C.slate700).font('Helvetica');
      pdf.text(restOfText, M + 24, currentY + 4, {
        width: CONTENT_W - 24,
        lineGap: 5,
        align: 'left',
        indent: 0,
      });
      currentY = Math.max(pdf.y, dropCapBottom) + 14;
    } else {
      // Standard paragraph with text indent
      pdf.fontSize(11.5).fillColor(C.slate700).font('Helvetica');
      pdf.text(trimmed, M, currentY, {
        width: CONTENT_W,
        lineGap: 5,
        align: 'left',
        indent: 20,
      });
      currentY = pdf.y + 14;
    }
  });

  return currentY;
}

function renderAppendixPages(pdf: PDFKit.PDFDocument, appendix: NarrativeDocumentContent['appendix'], startPage: number): number {
  let pageNum = startPage;
  let currentY = M;

  // Title
  pdf.fontSize(9).fillColor(C.slate400).font('Helvetica');
  pdf.text('APPENDIX', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 4;
  pdf.fontSize(22).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Supporting Data', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 6;
  pdf.moveTo(M, currentY).lineTo(M + 80, currentY).strokeColor(C.gold).lineWidth(3).stroke();
  currentY += 20;

  // PTW Cascade
  pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Playing to Win Cascade', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 10;

  // Winning aspiration card
  const aspText = truncateText(appendix.ptwCascade.winningAspiration, 300);
  pdf.roundedRect(M, currentY, CONTENT_W, 60, 6).fill(C.navy);
  pdf.fontSize(8).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('WINNING ASPIRATION', M + 14, currentY + 10, { width: CONTENT_W - 28 });
  pdf.fontSize(10).fillColor(C.white).font('Helvetica');
  pdf.text(aspText, M + 14, currentY + 24, { width: CONTENT_W - 28, lineGap: 2 });
  currentY += 72;

  // WTP + HTW side by side
  const colW = (CONTENT_W - 12) / 2;
  const colH = 120;

  pdf.roundedRect(M, currentY, colW, colH, 6).fill(C.cyan50);
  pdf.roundedRect(M, currentY, colW, colH, 6).strokeColor(C.cyan200).lineWidth(1).stroke();
  pdf.fontSize(8).fillColor(C.cyan600).font('Helvetica-Bold');
  pdf.text('WHERE TO PLAY', M + 10, currentY + 10, { width: colW - 20 });
  let itemY = currentY + 26;
  appendix.ptwCascade.whereToPlay.slice(0, 4).forEach(wtp => {
    if (itemY < currentY + colH - 10) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncateText(wtp, 80)}`, M + 10, itemY, { width: colW - 20 });
      itemY = pdf.y + 4;
    }
  });

  pdf.roundedRect(M + colW + 12, currentY, colW, colH, 6).fill(C.emerald50);
  pdf.roundedRect(M + colW + 12, currentY, colW, colH, 6).strokeColor(C.emerald600).lineWidth(1).stroke();
  pdf.fontSize(8).fillColor(C.emerald600).font('Helvetica-Bold');
  pdf.text('HOW TO WIN', M + colW + 22, currentY + 10, { width: colW - 20 });
  itemY = currentY + 26;
  appendix.ptwCascade.howToWin.slice(0, 4).forEach(htw => {
    if (itemY < currentY + colH - 10) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncateText(htw, 80)}`, M + colW + 22, itemY, { width: colW - 20 });
      itemY = pdf.y + 4;
    }
  });
  currentY += colH + 16;

  // Portfolio Balance + DHM row
  pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Portfolio Balance & DHM Coverage', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 10;

  const statW = (CONTENT_W - 25) / 6;
  const stats = [
    { value: appendix.portfolioBalance.offensive, label: 'Offensive', color: C.amber600 },
    { value: appendix.portfolioBalance.defensive, label: 'Defensive', color: C.emerald600 },
    { value: appendix.portfolioBalance.capability, label: 'Capability', color: C.purple600 },
    { value: appendix.dhmCoverage.delight, label: 'Delight', color: C.cyan600 },
    { value: appendix.dhmCoverage.hardToCopy, label: 'Hard to Copy', color: C.amber600 },
    { value: appendix.dhmCoverage.marginEnhancing, label: 'Margin+', color: C.emerald600 },
  ];

  stats.forEach((stat, i) => {
    const x = M + i * (statW + 5);
    pdf.roundedRect(x, currentY, statW, 55, 6).fill(C.white);
    pdf.roundedRect(x, currentY, statW, 55, 6).strokeColor(C.slate200).lineWidth(1).stroke();
    pdf.rect(x, currentY, statW, 3).fill(stat.color);
    pdf.fontSize(20).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(String(stat.value), x, currentY + 12, { width: statW, align: 'center' });
    pdf.fontSize(7).fillColor(C.slate500).font('Helvetica');
    pdf.text(stat.label.toUpperCase(), x, currentY + 38, { width: statW, align: 'center' });
  });
  currentY += 75;

  addFooter(pdf, pageNum++);

  // Bet detail pages
  pdf.addPage();
  currentY = M;

  pdf.fontSize(9).fillColor(C.slate400).font('Helvetica');
  pdf.text('APPENDIX — BET DETAILS', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 4;
  pdf.fontSize(18).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(`Strategic Bets (${appendix.selectedBets.length})`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 16;

  appendix.selectedBets.forEach((bet, idx) => {
    const cardH = 180;

    if (currentY + cardH > PAGE_H - 60) {
      addFooter(pdf, pageNum++);
      pdf.addPage();
      currentY = M;
    }

    const typeColors: Record<string, { accent: string; bg: string }> = {
      offensive: { accent: C.amber600, bg: C.amber50 },
      defensive: { accent: C.emerald600, bg: C.emerald50 },
      capability: { accent: C.purple600, bg: C.purple50 },
    };
    const colors = typeColors[bet.thesisType] || typeColors.offensive;

    pdf.roundedRect(M, currentY, CONTENT_W, cardH, 8).fill(C.white);
    pdf.roundedRect(M, currentY, CONTENT_W, cardH, 8).strokeColor(C.slate200).lineWidth(1).stroke();
    pdf.rect(M, currentY, CONTENT_W, 5).fill(colors.accent);

    // Badge + title
    pdf.circle(M + 22, currentY + 26, 14).fill(C.navy);
    pdf.fontSize(12).fillColor(C.white).font('Helvetica-Bold');
    pdf.text(String(idx + 1), M + 15, currentY + 21, { width: 14, align: 'center' });

    pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(bet.thesisTitle, M + 44, currentY + 18, { width: CONTENT_W - 110 });

    // Score
    pdf.circle(PAGE_W - M - 35, currentY + 30, 18).fill(C.navy);
    pdf.fontSize(14).fillColor(C.gold).font('Helvetica-Bold');
    pdf.text(String(bet.scoring.overallScore), PAGE_W - M - 48, currentY + 24, { width: 26, align: 'center' });

    // Hypothesis
    let contentY = currentY + 46;
    const parts = [
      { label: 'JOB', value: bet.hypothesis.job, color: C.cyan600 },
      { label: 'BELIEF', value: bet.hypothesis.belief, color: C.slate600 },
      { label: 'BET', value: bet.hypothesis.bet, color: C.navy },
      { label: 'SUCCESS', value: bet.hypothesis.success, color: C.emerald600 },
      { label: 'KILL', value: `${bet.hypothesis.kill.criteria} by ${bet.hypothesis.kill.date}`, color: C.red600 },
    ];

    parts.forEach(part => {
      pdf.fontSize(7).fillColor(part.color).font('Helvetica-Bold');
      pdf.text(part.label, M + 14, contentY, { width: 50 });
      pdf.fontSize(8).fillColor(C.slate700).font('Helvetica');
      pdf.text(truncateText(part.value, 120), M + 64, contentY, { width: CONTENT_W - 90, lineGap: 1 });
      contentY = Math.max(pdf.y + 4, contentY + 24);
    });

    currentY += cardH + 12;
  });

  addFooter(pdf, pageNum++);
  return pageNum;
}

async function generateNarrativePDF(companyName: string, doc: NarrativeDocumentContent): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 1;

  // Cover page
  renderNarrativeCover(pdf, companyName, doc.appendix.selectedBets.length);
  addFooter(pdf, pageNum++);

  // Page 1: Vision & Context
  pdf.addPage();
  renderNarrativePage(pdf, 'Product Vision & Strategic Context', 1, doc.productVision.narrative, 'State of the Business', doc.productVision.stateOfBusiness);
  addFooter(pdf, pageNum++);

  // Page 2: Market Insights
  pdf.addPage();
  renderNarrativePage(pdf, 'Market Trends, Customer Problems & Opportunities', 2, doc.marketInsights.narrative);
  addFooter(pdf, pageNum++);

  // Page 3: Strategic Choices
  pdf.addPage();
  renderNarrativePage(pdf, 'Where We Play & How We Win', 3, doc.strategicChoices.narrative);
  addFooter(pdf, pageNum++);

  // Page 4: Roadmap
  pdf.addPage();
  renderNarrativePage(pdf, 'Product Strategy & Roadmap Themes', 4, doc.roadmap.narrative);
  addFooter(pdf, pageNum++);

  // Page 5: Operating Model
  pdf.addPage();
  renderNarrativePage(pdf, 'Operating Model & Capability Build', 5, doc.operatingModel.narrative);
  addFooter(pdf, pageNum++);

  // Page 6: Execution
  pdf.addPage();
  renderNarrativePage(pdf, 'Strategic Priorities & Execution', 6, doc.executionPlan.narrative);
  addFooter(pdf, pageNum++);

  // Appendix pages
  pdf.addPage();
  renderAppendixPages(pdf, doc.appendix, pageNum);

  pdf.end();
  return new Promise<Buffer>((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });
}

// =============================================================================
// Legacy PDF Generation (old card-based format — kept for backward compat)
// =============================================================================

function drawCard(pdf: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, bgColor: string, borderColor?: string) {
  pdf.roundedRect(x, y, w, h, 8).fill(bgColor);
  if (borderColor) {
    pdf.roundedRect(x, y, w, h, 8).strokeColor(borderColor).lineWidth(1).stroke();
  }
}

function drawStatBox(pdf: PDFKit.PDFDocument, x: number, y: number, w: number, value: string | number, label: string, accentColor: string) {
  drawCard(pdf, x, y, w, 70, C.white, C.slate200);
  pdf.rect(x, y, w, 4).fill(accentColor);
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(String(value), x, y + 18, { width: w, align: 'center' });
  pdf.fontSize(9).fillColor(C.slate600).font('Helvetica');
  pdf.text(label.toUpperCase(), x, y + 50, { width: w, align: 'center' });
}

function drawSectionHeader(pdf: PDFKit.PDFDocument, title: string, y: number): number {
  pdf.rect(M, y, 4, 24).fill(C.gold);
  pdf.fontSize(18).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(title.toUpperCase(), M + 16, y + 3, { width: CONTENT_W - 16 });
  return pdf.y + 20;
}

async function generateLegacyPDF(companyName: string, doc: LegacyDocumentContent): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 1;

  // Cover
  renderLegacyCover(pdf, companyName, doc.executiveSummary, doc.selectedBets.length);
  addFooter(pdf, pageNum++);

  // PTW
  pdf.addPage();
  renderLegacyPTW(pdf, doc.ptwCascade);
  addFooter(pdf, pageNum++);

  // Bets
  pdf.addPage();
  pageNum = renderLegacyBets(pdf, doc.selectedBets, pageNum);

  // Portfolio
  pdf.addPage();
  renderLegacyPortfolio(pdf, doc.portfolioView, doc.selectedBets.length);
  addFooter(pdf, pageNum++);

  // Next steps
  pdf.addPage();
  renderLegacyNextSteps(pdf, doc.nextSteps);
  addFooter(pdf, pageNum++);

  pdf.end();
  return new Promise<Buffer>((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });
}

function renderLegacyCover(pdf: PDFKit.PDFDocument, companyName: string, summary: LegacyDocumentContent['executiveSummary'], betCount: number) {
  const headerHeight = 300;
  pdf.rect(0, 0, PAGE_W, headerHeight).fill(C.navy);
  pdf.rect(0, headerHeight - 4, PAGE_W, 4).fill(C.gold);
  pdf.circle(PAGE_W - 80, 80, 120).fillOpacity(0.03).fill(C.gold);
  pdf.circle(PAGE_W - 40, 160, 80).fillOpacity(0.05).fill(C.gold);
  pdf.fillOpacity(1);

  pdf.fontSize(11).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('PRODUCT STRATEGY DRAFT', M, 50, { width: CONTENT_W });
  pdf.fontSize(42).fillColor(C.white).font('Helvetica-Bold');
  pdf.text('Product Strategy', M, 85, { width: CONTENT_W });
  pdf.fontSize(24).fillColor(C.cyan400).font('Helvetica');
  pdf.text(companyName, M, 140, { width: CONTENT_W });
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.fontSize(11).fillColor(C.slate400).font('Helvetica');
  pdf.text(dateStr, M, 180, { width: CONTENT_W });
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(betCount), M, 220, { width: 100, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Strategic Bets', M, 256, { width: 100, align: 'left' });

  let currentY = headerHeight + 30;
  currentY = drawSectionHeader(pdf, 'Executive Summary', currentY);

  drawCard(pdf, M, currentY, CONTENT_W, 75, C.slate50, C.slate200);
  pdf.fontSize(10).fillColor(C.slate600).font('Helvetica-Bold');
  pdf.text('COMPANY OVERVIEW', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
  pdf.text(truncateText(summary.companyOverview, 180), M + 16, currentY + 28, { width: CONTENT_W - 32, lineGap: 2 });
  currentY += 88;

  drawCard(pdf, M, currentY, CONTENT_W, 65, C.cyan50, C.cyan200);
  pdf.fontSize(10).fillColor(C.cyan600).font('Helvetica-Bold');
  pdf.text('STRATEGIC INTENT', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
  pdf.text(truncateText(summary.strategicIntent, 150), M + 16, currentY + 28, { width: CONTENT_W - 32, lineGap: 2 });
  currentY += 78;

  const colW = (CONTENT_W - 16) / 2;
  const cardHeight = 155;

  drawCard(pdf, M, currentY, colW, cardHeight, C.white, C.slate200);
  pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('KEY FINDINGS', M + 12, currentY + 12, { width: colW - 24 });
  let findingY = currentY + 30;
  summary.keyFindings.slice(0, 3).forEach((finding, i) => {
    if (findingY < currentY + cardHeight - 12) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`${i + 1}. ${truncateText(finding, 90)}`, M + 12, findingY, { width: colW - 24, lineGap: 1 });
      findingY = Math.min(pdf.y + 6, currentY + cardHeight - 12);
    }
  });

  drawCard(pdf, M + colW + 16, currentY, colW, cardHeight, C.white, C.slate200);
  pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('TOP OPPORTUNITIES', M + colW + 28, currentY + 12, { width: colW - 24 });
  let oppY = currentY + 30;
  summary.topOpportunities.slice(0, 3).forEach((opp, i) => {
    if (oppY < currentY + cardHeight - 12) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`${i + 1}. ${truncateText(opp, 90)}`, M + colW + 28, oppY, { width: colW - 24, lineGap: 1 });
      oppY = Math.min(pdf.y + 6, currentY + cardHeight - 12);
    }
  });
}

function renderLegacyPTW(pdf: PDFKit.PDFDocument, cascade: LegacyDocumentContent['ptwCascade']) {
  let currentY = M;
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Playing to Win', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic Choices Cascade', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  drawCard(pdf, M, currentY, CONTENT_W, 100, C.navy);
  pdf.fontSize(10).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('WINNING ASPIRATION', M + 20, currentY + 14, { width: CONTENT_W - 40 });
  pdf.fontSize(11).fillColor(C.white).font('Helvetica');
  pdf.text(truncateText(cascade.winningAspiration, 250), M + 20, currentY + 32, { width: CONTENT_W - 40, lineGap: 2 });
  currentY += 115;

  const colW = (CONTENT_W - 16) / 2;
  const wtpHeight = 200;

  drawCard(pdf, M, currentY, colW, wtpHeight, C.cyan50, C.cyan200);
  pdf.fontSize(10).fillColor(C.cyan600).font('Helvetica-Bold');
  pdf.text('WHERE TO PLAY', M + 14, currentY + 12, { width: colW - 28 });
  let itemY = currentY + 32;
  cascade.whereToPlay.slice(0, 4).forEach(wtp => {
    if (itemY < currentY + wtpHeight - 14) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncateText(wtp, 80)}`, M + 14, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, currentY + wtpHeight - 14);
    }
  });

  drawCard(pdf, M + colW + 16, currentY, colW, wtpHeight, C.emerald50, C.emerald600);
  pdf.fontSize(10).fillColor(C.emerald600).font('Helvetica-Bold');
  pdf.text('HOW TO WIN', M + colW + 30, currentY + 12, { width: colW - 28 });
  itemY = currentY + 32;
  cascade.howToWin.slice(0, 4).forEach(htw => {
    if (itemY < currentY + wtpHeight - 14) {
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncateText(htw, 80)}`, M + colW + 30, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, currentY + wtpHeight - 14);
    }
  });
}

function renderLegacyBets(pdf: PDFKit.PDFDocument, bets: LegacyDocumentContent['selectedBets'], startPageNum: number): number {
  let pageNum = startPageNum;
  let currentY = M;

  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Strategic Bets', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text(`${bets.length} bets selected for validation`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  bets.forEach((bet, idx) => {
    const cardHeight = 220;
    if (currentY + cardHeight > PAGE_H - 60) {
      addFooter(pdf, pageNum++);
      pdf.addPage();
      currentY = M;
    }

    const thesisColors: Record<string, { bg: string; accent: string }> = {
      offensive: { bg: C.amber50, accent: C.amber600 },
      defensive: { bg: C.emerald50, accent: C.emerald600 },
      capability: { bg: C.purple50, accent: C.purple600 },
    };
    const colors = thesisColors[bet.thesisType] || thesisColors.offensive;

    drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);
    pdf.rect(M, currentY, CONTENT_W, 6).fill(colors.accent);

    pdf.circle(M + 24, currentY + 30, 16).fill(C.navy);
    pdf.fontSize(14).fillColor(C.white).font('Helvetica-Bold');
    pdf.text(String(idx + 1), M + 16, currentY + 24, { width: 16, align: 'center' });

    pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(bet.thesisTitle, M + 50, currentY + 20, { width: CONTENT_W - 140 });

    pdf.circle(PAGE_W - M - 45, currentY + 60, 22).fill(C.navy);
    pdf.fontSize(16).fillColor(C.gold).font('Helvetica-Bold');
    pdf.text(String(bet.scoring.overallScore), PAGE_W - M - 60, currentY + 53, { width: 30, align: 'center' });

    let contentY = currentY + 50;
    const parts = [
      { label: 'JOB', value: bet.hypothesis.job, color: C.cyan600 },
      { label: 'BELIEF', value: bet.hypothesis.belief, color: C.slate600 },
      { label: 'BET', value: bet.hypothesis.bet, color: C.navy },
      { label: 'SUCCESS', value: bet.hypothesis.success, color: C.emerald600 },
      { label: 'KILL', value: `${bet.hypothesis.kill.criteria} by ${bet.hypothesis.kill.date}`, color: C.red600 },
    ];
    parts.forEach(part => {
      pdf.fontSize(8).fillColor(part.color).font('Helvetica-Bold');
      pdf.text(part.label, M + 16, contentY, { width: 55 });
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(part.value, M + 71, contentY, { width: CONTENT_W - 130, lineGap: 1 });
      contentY = Math.max(pdf.y + 6, contentY + 28);
    });

    currentY += cardHeight + 16;
  });

  addFooter(pdf, pageNum++);
  return pageNum;
}

function renderLegacyPortfolio(pdf: PDFKit.PDFDocument, portfolio: LegacyDocumentContent['portfolioView'], totalBets: number) {
  let currentY = M;
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Portfolio View', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic coherence and balance analysis', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  const statW = (CONTENT_W - 30) / 4;
  drawStatBox(pdf, M, currentY, statW, totalBets, 'Total Bets', C.navy);
  drawStatBox(pdf, M + statW + 10, currentY, statW, portfolio.balance.offensive, 'Offensive', C.amber600);
  drawStatBox(pdf, M + (statW + 10) * 2, currentY, statW, portfolio.balance.defensive, 'Defensive', C.emerald600);
  drawStatBox(pdf, M + (statW + 10) * 3, currentY, statW, portfolio.balance.capability, 'Capability', C.purple600);
  currentY += 90;

  currentY = drawSectionHeader(pdf, 'Strategic Coherence', currentY);
  drawCard(pdf, M, currentY, CONTENT_W, 100, C.slate50, C.slate200);
  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(portfolio.coherenceAnalysis, M + 16, currentY + 16, { width: CONTENT_W - 32, lineGap: 3 });
  currentY += 120;

  currentY = drawSectionHeader(pdf, 'DHM Coverage', currentY);
  const dhmW = (CONTENT_W - 20) / 3;
  const dhmItems = [
    { label: 'Delight', value: portfolio.dhmCoverage.delight, color: C.cyan600, bg: C.cyan50 },
    { label: 'Hard to Copy', value: portfolio.dhmCoverage.hardToCopy, color: C.amber600, bg: C.amber50 },
    { label: 'Margin Enhancing', value: portfolio.dhmCoverage.marginEnhancing, color: C.emerald600, bg: C.emerald50 },
  ];
  dhmItems.forEach((item, i) => {
    const x = M + i * (dhmW + 10);
    drawCard(pdf, x, currentY, dhmW, 70, item.bg, item.color);
    pdf.fontSize(24).fillColor(item.color).font('Helvetica-Bold');
    pdf.text(String(item.value), x, currentY + 14, { width: dhmW, align: 'center' });
    pdf.fontSize(9).fillColor(C.slate600).font('Helvetica');
    pdf.text(item.label.toUpperCase(), x, currentY + 48, { width: dhmW, align: 'center' });
  });
}

function renderLegacyNextSteps(pdf: PDFKit.PDFDocument, nextSteps: LegacyDocumentContent['nextSteps']) {
  let currentY = M;
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Next Steps', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Governance and validation roadmap', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  const cards = [
    { title: 'VALIDATION TIMELINE', content: nextSteps.validationTimeline, color: C.cyan600, bg: C.cyan50 },
    { title: 'GOVERNANCE STRUCTURE', content: nextSteps.governance, color: C.purple600, bg: C.purple50 },
    { title: 'SUCCESS METRIC TRACKING', content: nextSteps.trackingPlan, color: C.emerald600, bg: C.emerald50 },
    { title: 'KILL CRITERIA REVIEW', content: nextSteps.killCriteriaReview, color: C.red600, bg: '#fef2f2' },
  ];

  cards.forEach(card => {
    drawCard(pdf, M, currentY, CONTENT_W, 85, card.bg, card.color);
    pdf.fontSize(10).fillColor(card.color).font('Helvetica-Bold');
    pdf.text(card.title, M + 16, currentY + 14, { width: CONTENT_W - 32 });
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(card.content, M + 16, currentY + 32, { width: CONTENT_W - 32, lineGap: 2 });
    currentY += 100;
  });

  currentY = drawSectionHeader(pdf, 'Recommended Next Conversations', currentY);
  nextSteps.nextTopics.forEach((topic, i) => {
    drawCard(pdf, M, currentY, CONTENT_W, 30, C.white, C.slate200);
    pdf.circle(M + 20, currentY + 15, 10).fill(C.gold);
    pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(String(i + 1), M + 15, currentY + 11, { width: 10, align: 'center' });
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(topic, M + 40, currentY + 10, { width: CONTENT_W - 56 });
    currentY += 38;
  });
}
