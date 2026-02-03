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
  gold: '#fbbf24',
  cyan200: '#a5f3fc',
  cyan600: '#0891b2',
  slate900: '#0f172a',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
};

// Constants
const M = 60; // margin
const PAGE_W = 595.28 - M * 2; // A4 width minus margins

// POST /api/product-strategy-agent/bets/strategy-document/export
// Export 6-page Product Strategy Draft as PDF
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

    // Fetch strategy document
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

    // Fetch client for company name
    const { data: client } = await supabase
      .from('clients')
      .select('company_name')
      .eq('clerk_org_id', orgId)
      .single();

    const companyName = client?.company_name || 'Your Company';
    const doc: StrategyDocumentContent = strategyDoc.document_content;

    console.log(`Generating Product Strategy PDF for: ${companyName}`);

    // Generate PDF
    const pdfBuffer = await generateStrategyPDF(companyName, doc);

    // Update exported_at timestamp
    await supabase
      .from('strategy_documents')
      .update({ exported_at: new Date().toISOString() })
      .eq('id', strategyDoc.id);

    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    // Return PDF
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
// PDF Generation
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

async function generateStrategyPDF(companyName: string, doc: StrategyDocumentContent): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: M, bottom: M, left: M, right: M },
    bufferPages: true,
  });

  const chunks: Buffer[] = [];
  pdf.on('data', (chunk: Buffer) => chunks.push(chunk));

  // PAGE 1: EXECUTIVE SUMMARY
  renderPage1(pdf, companyName, doc.executiveSummary);

  // PAGE 2: PTW CASCADE
  pdf.addPage();
  renderPage2(pdf, doc.ptwCascade);

  // PAGES 3-4: SELECTED BETS
  pdf.addPage();
  renderPages3and4(pdf, doc.selectedBets);

  // PAGE 5: PORTFOLIO VIEW
  pdf.addPage();
  renderPage5(pdf, doc.portfolioView);

  // PAGE 6: NEXT STEPS
  pdf.addPage();
  renderPage6(pdf, doc.nextSteps);

  pdf.end();
  return new Promise<Buffer>((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
  });
}

function renderPage1(
  pdf: PDFKit.PDFDocument,
  companyName: string,
  summary: StrategyDocumentContent['executiveSummary']
) {
  let currentY = M;

  // Title
  pdf.fontSize(28).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Product Strategy', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(14).fillColor(C.slate600).font('Helvetica');
  pdf.text(companyName, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 30;

  // Company Overview
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('COMPANY OVERVIEW', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(summary.companyOverview, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Strategic Intent
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('STRATEGIC INTENT', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(summary.strategicIntent, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Key Findings
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('KEY FINDINGS FROM 3CS RESEARCH', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  summary.keyFindings.forEach(finding => {
    pdf.text(`• ${finding}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
  currentY += 14;

  // Top Opportunities
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('TOP STRATEGIC OPPORTUNITIES', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  summary.topOpportunities.forEach(opp => {
    pdf.text(`• ${opp}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
  currentY += 14;

  // Recommended Bets
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('RECOMMENDED BETS', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(summary.recommendedBets, M, currentY, { width: PAGE_W, lineGap: 2 });
}

function renderPage2(pdf: PDFKit.PDFDocument, cascade: StrategyDocumentContent['ptwCascade']) {
  let currentY = M;

  // Title
  pdf.fontSize(20).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Playing to Win Cascade', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 30;

  // Winning Aspiration
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('WINNING ASPIRATION', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(cascade.winningAspiration, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Where to Play
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('WHERE TO PLAY', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  cascade.whereToPlay.forEach(wtp => {
    pdf.text(`• ${wtp}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
  currentY += 14;

  // How to Win
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('HOW TO WIN', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  cascade.howToWin.forEach(htw => {
    pdf.text(`• ${htw}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
  currentY += 14;

  // Capabilities
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('CORE CAPABILITIES REQUIRED', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  cascade.capabilities.slice(0, 5).forEach(cap => {
    pdf.text(`• ${cap}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
  currentY += 14;

  // Management Systems
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('MANAGEMENT SYSTEMS', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  cascade.managementSystems.forEach(sys => {
    pdf.text(`• ${sys}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });
}

function renderPages3and4(pdf: PDFKit.PDFDocument, bets: StrategyDocumentContent['selectedBets']) {
  let currentY = M;

  // Title
  pdf.fontSize(20).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Selected Strategic Bets', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 30;

  bets.forEach((bet, idx) => {
    // Check if we need a new page
    if (currentY > 700) {
      pdf.addPage();
      currentY = M;
    }

    // Bet card
    const cardHeight = 180;
    pdf.roundedRect(M, currentY, PAGE_W, cardHeight, 8).fillAndStroke(C.cyan200, C.cyan600);

    let contentY = currentY + 12;

    // Title
    pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
    pdf.text(`Bet ${idx + 1}: ${bet.thesisTitle}`, M + 12, contentY, { width: PAGE_W - 24 });
    contentY = pdf.y + 8;

    // 5-part hypothesis
    pdf.fontSize(9).fillColor(C.slate700).font('Helvetica');
    pdf.text(`Job: ${bet.hypothesis.job}`, M + 12, contentY, { width: PAGE_W - 24, lineGap: 1 });
    contentY = pdf.y + 4;

    pdf.text(`Belief: ${bet.hypothesis.belief}`, M + 12, contentY, { width: PAGE_W - 24, lineGap: 1 });
    contentY = pdf.y + 4;

    pdf.text(`Bet: ${bet.hypothesis.bet}`, M + 12, contentY, { width: PAGE_W - 24, lineGap: 1 });
    contentY = pdf.y + 4;

    pdf.text(`Success: ${bet.hypothesis.success}`, M + 12, contentY, { width: PAGE_W - 24, lineGap: 1 });
    contentY = pdf.y + 4;

    pdf.text(`Kill: ${bet.hypothesis.kill.criteria} by ${bet.hypothesis.kill.date}`, M + 12, contentY, {
      width: PAGE_W - 24,
      lineGap: 1,
    });

    currentY += cardHeight + 16;
  });
}

function renderPage5(pdf: PDFKit.PDFDocument, portfolio: StrategyDocumentContent['portfolioView']) {
  let currentY = M;

  // Title
  pdf.fontSize(20).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Portfolio View', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 30;

  // Coherence Analysis
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('STRATEGIC COHERENCE', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(portfolio.coherenceAnalysis, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Balance
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('PORTFOLIO BALANCE', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(`• Offensive Bets: ${portfolio.balance.offensive}`, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 6;
  pdf.text(`• Defensive Bets: ${portfolio.balance.defensive}`, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 6;
  pdf.text(`• Capability Bets: ${portfolio.balance.capability}`, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 20;

  // DHM Coverage
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('DHM COVERAGE', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(`• Delight: ${portfolio.dhmCoverage.delight} bets`, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 6;
  pdf.text(`• Hard to Copy: ${portfolio.dhmCoverage.hardToCopy} bets`, M, currentY, { width: PAGE_W });
  currentY = pdf.y + 6;
  pdf.text(`• Margin Enhancing: ${portfolio.dhmCoverage.marginEnhancing} bets`, M, currentY, { width: PAGE_W });
}

function renderPage6(pdf: PDFKit.PDFDocument, nextSteps: StrategyDocumentContent['nextSteps']) {
  let currentY = M;

  // Title
  pdf.fontSize(20).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('Next Steps & Governance', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 30;

  // Validation Timeline
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('VALIDATION TIMELINE', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(nextSteps.validationTimeline, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Governance
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('GOVERNANCE STRUCTURE', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(nextSteps.governance, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Tracking Plan
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('SUCCESS METRIC TRACKING', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(nextSteps.trackingPlan, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Kill Criteria Review
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('KILL CRITERIA REVIEW PROCESS', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  pdf.text(nextSteps.killCriteriaReview, M, currentY, { width: PAGE_W, lineGap: 2 });
  currentY = pdf.y + 20;

  // Next Topics
  pdf.fontSize(12).fillColor(C.navy).font('Helvetica-Bold');
  pdf.text('RECOMMENDED NEXT CONVERSATION TOPICS', M, currentY, { width: PAGE_W });
  currentY = pdf.y + 8;

  pdf.fontSize(10).fillColor(C.slate700).font('Helvetica');
  nextSteps.nextTopics.forEach(topic => {
    pdf.text(`• ${topic}`, M, currentY, { width: PAGE_W, lineGap: 2 });
    currentY = pdf.y + 6;
  });

  // Footer
  currentY = 750;
  pdf.fontSize(9).fillColor(C.slate400).font('Helvetica');
  pdf.text('Generated with Frontera Product Strategy Coach', M, currentY, { width: PAGE_W, align: 'center' });
}
