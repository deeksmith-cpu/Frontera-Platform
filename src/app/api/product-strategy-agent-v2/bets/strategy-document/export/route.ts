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
  red600: '#dc2626',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  white: '#ffffff',
};

// Constants
const M = 50; // margin
const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const CONTENT_W = PAGE_W - M * 2;

// POST /api/product-strategy-agent-v2/bets/strategy-document/export
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id, document_id } = body;

    if (!conversation_id && !document_id) {
      return NextResponse.json(
        { error: 'Either conversation_id or document_id is required' },
        { status: 400 }
      );
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
    const doc: StrategyDocumentContent = strategyDoc.document_content;

    const pdfBuffer = await generateStrategyPDF(companyName, doc);

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
    console.error('POST /api/product-strategy-agent-v2/bets/strategy-document/export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// Types
// =============================================================================

interface StrategyDocumentContent {
  executiveSummary: {
    companyOverview: string;
    strategicIntent: string;
    keyFindings: string[];
    topOpportunities: string[];
    recommendedBets: string;
  };
  ptwCascade: {
    winningAspiration: string;
    whereToPlay: string[];
    howToWin: string[];
    capabilities: string[];
    managementSystems: string[];
  };
  selectedBets: Array<{
    id: string;
    thesisTitle: string;
    thesisType: string;
    hypothesis: {
      job: string;
      belief: string;
      bet: string;
      success: string;
      kill: { criteria: string; date: string };
    };
    scoring: {
      expectedImpact: number;
      certaintyOfImpact: number;
      clarityOfLevers: number;
      uniquenessOfLevers: number;
      overallScore: number;
    };
    risks: Record<string, string>;
    evidence: Array<{ territory: string; quote: string }>;
  }>;
  portfolioView: {
    coherenceAnalysis: string;
    balance: { offensive: number; defensive: number; capability: number };
    sequencing: Array<{ betId: string; dependsOn: string[] }>;
    resourceAllocation: Array<{ allocation: string; betCount: number }>;
    dhmCoverage: { delight: number; hardToCopy: number; marginEnhancing: number };
  };
  nextSteps: {
    validationTimeline: string;
    governance: string;
    trackingPlan: string;
    killCriteriaReview: string;
    nextTopics: string[];
  };
}

// =============================================================================
// PDF Generation
// =============================================================================

async function generateStrategyPDF(companyName: string, doc: StrategyDocumentContent): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 1;

  // PAGE 1: COVER / EXECUTIVE SUMMARY
  renderCoverPage(pdf, companyName, doc.executiveSummary, doc.selectedBets.length);
  addFooter(pdf, pageNum++);

  // PAGE 2: PTW CASCADE
  pdf.addPage();
  renderPTWCascade(pdf, doc.ptwCascade);
  addFooter(pdf, pageNum++);

  // PAGES 3+: STRATEGIC BETS
  pdf.addPage();
  pageNum = renderStrategicBets(pdf, doc.selectedBets, pageNum);

  // PAGE: PORTFOLIO VIEW
  pdf.addPage();
  renderPortfolioView(pdf, doc.portfolioView, doc.selectedBets.length);
  addFooter(pdf, pageNum++);

  // PAGE: NEXT STEPS
  pdf.addPage();
  renderNextSteps(pdf, doc.nextSteps);
  addFooter(pdf, pageNum++);

  pdf.end();
  return new Promise<Buffer>((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });
}

// =============================================================================
// Helper Functions
// =============================================================================

function addFooter(pdf: PDFKit.PDFDocument, pageNum: number) {
  // Gold accent line
  pdf.moveTo(M, PAGE_H - 40).lineTo(PAGE_W - M, PAGE_H - 40).strokeColor(C.gold).lineWidth(2).stroke();

  // Footer text
  pdf.fontSize(8).fillColor(C.slate500).font('Helvetica');
  pdf.text('Frontera Product Strategy Coach', M, PAGE_H - 30, { width: CONTENT_W / 2, align: 'left' });
  pdf.text(`Page ${pageNum}`, M + CONTENT_W / 2, PAGE_H - 30, { width: CONTENT_W / 2, align: 'right' });
}

function drawSectionHeader(pdf: PDFKit.PDFDocument, title: string, y: number, icon?: string): number {
  // Gold accent bar
  pdf.rect(M, y, 4, 24).fill(C.gold);

  // Title
  pdf.fontSize(18).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(title.toUpperCase(), M + 16, y + 3, { width: CONTENT_W - 16 });

  return pdf.y + 20;
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

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
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
  // Box
  drawCard(pdf, x, y, w, 70, C.white, C.slate200);

  // Accent top bar
  pdf.rect(x, y, w, 4).fill(accentColor);

  // Value
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text(String(value), x, y + 18, { width: w, align: 'center' });

  // Label
  pdf.fontSize(9).fillColor(C.slate600).font('Helvetica');
  pdf.text(label.toUpperCase(), x, y + 50, { width: w, align: 'center' });
}

// =============================================================================
// Page Renderers
// =============================================================================

function renderCoverPage(
  pdf: PDFKit.PDFDocument,
  companyName: string,
  summary: StrategyDocumentContent['executiveSummary'],
  betCount: number
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
  pdf.text('PRODUCT STRATEGY DRAFT', M, 50, { width: CONTENT_W });

  // Main title
  pdf.fontSize(42).fillColor(C.white).font('Helvetica-Bold');
  pdf.text('Product Strategy', M, 85, { width: CONTENT_W });

  // Company name
  pdf.fontSize(24).fillColor(C.cyan400).font('Helvetica');
  pdf.text(companyName, M, 140, { width: CONTENT_W });

  // Date
  pdf.fontSize(11).fillColor(C.slate400).font('Helvetica');
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(dateStr, M, 180, { width: CONTENT_W });

  // Key metrics row
  const metricsY = 220;
  const metricW = 100;
  const metricGap = 20;

  // Bets count
  pdf.fontSize(32).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text(String(betCount), M, metricsY, { width: metricW, align: 'left' });
  pdf.fontSize(10).fillColor(C.slate400).font('Helvetica');
  pdf.text('Strategic Bets', M, metricsY + 36, { width: metricW, align: 'left' });

  // Content section (below header)
  let currentY = headerHeight + 30;

  // Executive Summary Section
  currentY = drawSectionHeader(pdf, 'Executive Summary', currentY);

  // Company Overview card - truncate to fit
  const overviewText = truncateText(summary.companyOverview, 180);
  drawCard(pdf, M, currentY, CONTENT_W, 75, C.slate50, C.slate200);
  pdf.fontSize(10).fillColor(C.slate600).font('Helvetica-Bold');
  pdf.text('COMPANY OVERVIEW', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
  pdf.text(overviewText, M + 16, currentY + 28, { width: CONTENT_W - 32, lineGap: 2 });
  currentY += 88;

  // Strategic Intent card - truncate to fit
  const intentText = truncateText(summary.strategicIntent, 150);
  drawCard(pdf, M, currentY, CONTENT_W, 65, C.cyan50, C.cyan200);
  pdf.fontSize(10).fillColor(C.cyan600).font('Helvetica-Bold');
  pdf.text('STRATEGIC INTENT', M + 16, currentY + 12, { width: CONTENT_W - 32 });
  pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
  pdf.text(intentText, M + 16, currentY + 28, { width: CONTENT_W - 32, lineGap: 2 });
  currentY += 78;

  // Two-column layout for findings and opportunities
  const colW = (CONTENT_W - 16) / 2;
  const cardHeight = 155;
  const maxItemChars = 90; // Max chars per item

  // Key Findings
  drawCard(pdf, M, currentY, colW, cardHeight, C.white, C.slate200);
  pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('KEY FINDINGS', M + 12, currentY + 12, { width: colW - 24 });

  let findingY = currentY + 30;
  const maxFindingY = currentY + cardHeight - 12;
  summary.keyFindings.slice(0, 3).forEach((finding, i) => {
    if (findingY < maxFindingY) {
      const truncatedFinding = truncateText(finding, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`${i + 1}. ${truncatedFinding}`, M + 12, findingY, { width: colW - 24, lineGap: 1 });
      findingY = Math.min(pdf.y + 6, maxFindingY);
    }
  });

  // Top Opportunities
  drawCard(pdf, M + colW + 16, currentY, colW, cardHeight, C.white, C.slate200);
  pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('TOP OPPORTUNITIES', M + colW + 28, currentY + 12, { width: colW - 24 });

  let oppY = currentY + 30;
  const maxOppY = currentY + cardHeight - 12;
  summary.topOpportunities.slice(0, 3).forEach((opp, i) => {
    if (oppY < maxOppY) {
      const truncatedOpp = truncateText(opp, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`${i + 1}. ${truncatedOpp}`, M + colW + 28, oppY, { width: colW - 24, lineGap: 1 });
      oppY = Math.min(pdf.y + 6, maxOppY);
    }
  });
}

function renderPTWCascade(pdf: PDFKit.PDFDocument, cascade: StrategyDocumentContent['ptwCascade']) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Playing to Win', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic Choices Cascade', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  // Winning Aspiration (hero card) - truncate to prevent overflow
  const aspirationText = truncateText(cascade.winningAspiration, 250);
  drawCard(pdf, M, currentY, CONTENT_W, 100, C.navy);
  pdf.fontSize(10).fillColor(C.gold).font('Helvetica-Bold');
  pdf.text('WINNING ASPIRATION', M + 20, currentY + 14, { width: CONTENT_W - 40 });
  pdf.fontSize(11).fillColor(C.white).font('Helvetica');
  pdf.text(aspirationText, M + 20, currentY + 32, { width: CONTENT_W - 40, lineGap: 2 });
  currentY += 115;

  // Two-column layout - calculate column width
  const colW = (CONTENT_W - 16) / 2;
  const maxItemChars = 80; // Max characters per bullet item

  // Where to Play / How to Win row
  const wtpHeight = 200;

  // Where to Play card
  drawCard(pdf, M, currentY, colW, wtpHeight, C.cyan50, C.cyan200);
  pdf.fontSize(10).fillColor(C.cyan600).font('Helvetica-Bold');
  pdf.text('WHERE TO PLAY', M + 14, currentY + 12, { width: colW - 28 });

  let itemY = currentY + 32;
  const maxY1 = currentY + wtpHeight - 14; // Leave padding at bottom
  cascade.whereToPlay.slice(0, 4).forEach((wtp) => {
    if (itemY < maxY1) {
      const truncatedWtp = truncateText(wtp, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncatedWtp}`, M + 14, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, maxY1);
    }
  });

  // How to Win card
  drawCard(pdf, M + colW + 16, currentY, colW, wtpHeight, C.emerald50, C.emerald600);
  pdf.fontSize(10).fillColor(C.emerald600).font('Helvetica-Bold');
  pdf.text('HOW TO WIN', M + colW + 30, currentY + 12, { width: colW - 28 });

  itemY = currentY + 32;
  cascade.howToWin.slice(0, 4).forEach((htw) => {
    if (itemY < maxY1) {
      const truncatedHtw = truncateText(htw, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncatedHtw}`, M + colW + 30, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, maxY1);
    }
  });

  currentY += wtpHeight + 14;

  // Capabilities / Management Systems row
  const capHeight = 180;
  const maxY2 = currentY + capHeight - 14;

  // Capabilities card
  drawCard(pdf, M, currentY, colW, capHeight, C.amber50, C.amber600);
  pdf.fontSize(10).fillColor(C.amber600).font('Helvetica-Bold');
  pdf.text('CORE CAPABILITIES', M + 14, currentY + 12, { width: colW - 28 });

  itemY = currentY + 32;
  cascade.capabilities.slice(0, 4).forEach((cap) => {
    if (itemY < maxY2) {
      const truncatedCap = truncateText(cap, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncatedCap}`, M + 14, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, maxY2);
    }
  });

  // Management Systems card
  drawCard(pdf, M + colW + 16, currentY, colW, capHeight, C.purple50, C.purple600);
  pdf.fontSize(10).fillColor(C.purple600).font('Helvetica-Bold');
  pdf.text('MANAGEMENT SYSTEMS', M + colW + 30, currentY + 12, { width: colW - 28 });

  itemY = currentY + 32;
  cascade.managementSystems.slice(0, 4).forEach((sys) => {
    if (itemY < maxY2) {
      const truncatedSys = truncateText(sys, maxItemChars);
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(`• ${truncatedSys}`, M + colW + 30, itemY, { width: colW - 28, lineGap: 1 });
      itemY = Math.min(pdf.y + 8, maxY2);
    }
  });
}

function renderStrategicBets(
  pdf: PDFKit.PDFDocument,
  bets: StrategyDocumentContent['selectedBets'],
  startPageNum: number
): number {
  let pageNum = startPageNum;
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Strategic Bets', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text(`${bets.length} bets selected for validation`, M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 25;

  bets.forEach((bet, idx) => {
    const cardHeight = 220;

    // Check if we need a new page
    if (currentY + cardHeight > PAGE_H - 60) {
      addFooter(pdf, pageNum++);
      pdf.addPage();
      currentY = M;
    }

    // Bet card
    const thesisColors: Record<string, { bg: string; border: string; accent: string }> = {
      offensive: { bg: C.amber50, border: C.amber600, accent: C.amber600 },
      defensive: { bg: C.emerald50, border: C.emerald600, accent: C.emerald600 },
      capability: { bg: C.purple50, border: C.purple600, accent: C.purple600 },
    };
    const colors = thesisColors[bet.thesisType] || thesisColors.offensive;

    drawCard(pdf, M, currentY, CONTENT_W, cardHeight, C.white, C.slate200);

    // Accent bar at top
    pdf.rect(M, currentY, CONTENT_W, 6).fill(colors.accent);

    // Bet number badge
    pdf.circle(M + 24, currentY + 30, 16).fill(C.navy);
    pdf.fontSize(14).fillColor(C.white).font('Helvetica-Bold');
    pdf.text(String(idx + 1), M + 16, currentY + 24, { width: 16, align: 'center' });

    // Thesis title and type
    pdf.fontSize(14).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(bet.thesisTitle, M + 50, currentY + 20, { width: CONTENT_W - 140 });

    // Type badge
    pdf.fontSize(8).fillColor(colors.accent).font('Helvetica-Bold');
    const typeLabel = bet.thesisType.toUpperCase();
    pdf.roundedRect(PAGE_W - M - 80, currentY + 16, 65, 20, 10).fill(colors.bg);
    pdf.text(typeLabel, PAGE_W - M - 78, currentY + 22, { width: 61, align: 'center' });

    // Score circle
    pdf.circle(PAGE_W - M - 45, currentY + 60, 22).fill(C.navy);
    pdf.fontSize(16).fillColor(C.gold).font('Helvetica-Bold');
    pdf.text(String(bet.scoring.overallScore), PAGE_W - M - 60, currentY + 53, { width: 30, align: 'center' });
    pdf.fontSize(7).fillColor(C.slate400).font('Helvetica');
    pdf.text('SCORE', PAGE_W - M - 60, currentY + 85, { width: 30, align: 'center' });

    // Hypothesis content
    let contentY = currentY + 50;
    const labelW = 55;
    const valueW = CONTENT_W - 130;

    const hypothesisParts = [
      { label: 'JOB', value: bet.hypothesis.job, color: C.cyan600 },
      { label: 'BELIEF', value: bet.hypothesis.belief, color: C.slate600 },
      { label: 'BET', value: bet.hypothesis.bet, color: C.navy },
      { label: 'SUCCESS', value: bet.hypothesis.success, color: C.emerald600 },
      { label: 'KILL', value: `${bet.hypothesis.kill.criteria} by ${bet.hypothesis.kill.date}`, color: C.red600 },
    ];

    hypothesisParts.forEach((part) => {
      pdf.fontSize(8).fillColor(part.color).font('Helvetica-Bold');
      pdf.text(part.label, M + 16, contentY, { width: labelW });
      pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
      pdf.text(part.value, M + 16 + labelW, contentY, { width: valueW, lineGap: 1 });
      contentY = Math.max(pdf.y + 6, contentY + 28);
    });

    currentY += cardHeight + 16;
  });

  addFooter(pdf, pageNum++);
  return pageNum;
}

function renderPortfolioView(
  pdf: PDFKit.PDFDocument,
  portfolio: StrategyDocumentContent['portfolioView'],
  totalBets: number
) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Portfolio View', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Strategic coherence and balance analysis', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  // Stat boxes row
  const statW = (CONTENT_W - 30) / 4;
  drawStatBox(pdf, M, currentY, statW, totalBets, 'Total Bets', C.navy);
  drawStatBox(pdf, M + statW + 10, currentY, statW, portfolio.balance.offensive, 'Offensive', C.amber600);
  drawStatBox(pdf, M + (statW + 10) * 2, currentY, statW, portfolio.balance.defensive, 'Defensive', C.emerald600);
  drawStatBox(pdf, M + (statW + 10) * 3, currentY, statW, portfolio.balance.capability, 'Capability', C.purple600);
  currentY += 90;

  // Coherence Analysis
  currentY = drawSectionHeader(pdf, 'Strategic Coherence', currentY);
  drawCard(pdf, M, currentY, CONTENT_W, 100, C.slate50, C.slate200);
  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(portfolio.coherenceAnalysis, M + 16, currentY + 16, { width: CONTENT_W - 32, lineGap: 3 });
  currentY += 120;

  // DHM Coverage
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
  currentY += 95;

  // Resource Allocation
  currentY = drawSectionHeader(pdf, 'Resource Allocation', currentY);

  portfolio.resourceAllocation.forEach((alloc) => {
    drawCard(pdf, M, currentY, CONTENT_W, 35, C.white, C.slate200);
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica-Bold');
    pdf.text(alloc.allocation, M + 16, currentY + 12, { width: CONTENT_W / 2 });
    pdf.fontSize(10).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(`${alloc.betCount} bets`, M + CONTENT_W / 2, currentY + 12, { width: CONTENT_W / 2 - 16, align: 'right' });
    currentY += 42;
  });
}

function renderNextSteps(pdf: PDFKit.PDFDocument, nextSteps: StrategyDocumentContent['nextSteps']) {
  let currentY = M;

  // Page title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Next Steps', M, currentY, { width: CONTENT_W });
  currentY = pdf.y;
  pdf.fontSize(14).fillColor(C.slate500).font('Helvetica');
  pdf.text('Governance and validation roadmap', M, currentY, { width: CONTENT_W });
  currentY = pdf.y + 30;

  // Info cards
  const cards = [
    { title: 'VALIDATION TIMELINE', content: nextSteps.validationTimeline, color: C.cyan600, bg: C.cyan50 },
    { title: 'GOVERNANCE STRUCTURE', content: nextSteps.governance, color: C.purple600, bg: C.purple50 },
    { title: 'SUCCESS METRIC TRACKING', content: nextSteps.trackingPlan, color: C.emerald600, bg: C.emerald50 },
    { title: 'KILL CRITERIA REVIEW', content: nextSteps.killCriteriaReview, color: C.red600, bg: C.red50 },
  ];

  cards.forEach((card) => {
    drawCard(pdf, M, currentY, CONTENT_W, 85, card.bg, card.color);
    pdf.fontSize(10).fillColor(card.color).font('Helvetica-Bold');
    pdf.text(card.title, M + 16, currentY + 14, { width: CONTENT_W - 32 });
    pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
    pdf.text(card.content, M + 16, currentY + 32, { width: CONTENT_W - 32, lineGap: 2 });
    currentY += 100;
  });

  // Next conversation topics
  if (currentY + 150 > PAGE_H - 60) {
    currentY = PAGE_H - 200;
  }
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
