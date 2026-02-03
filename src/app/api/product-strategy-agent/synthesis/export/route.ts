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
  gold: '#fbbf24',
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
  emerald50: '#ecfdf5',
  amber600: '#d97706',
  amber50: '#fffbeb',
  red500: '#ef4444',
  red50: '#fef2f2',
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

/** Check remaining space; if insufficient, start a fresh page. */
function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > MAX_Y) {
    doc.addPage();
  }
}

/** Add footers to all buffered pages (call before doc.end). */
function addFootersToAllPages(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    // Skip cover page (page 0)
    if (i === 0) continue;
    doc.save();
    doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
    doc.text('Frontera AI Strategy Coach', M, FOOTER_Y, { width: PAGE_W / 2, lineBreak: false });
    doc.text(`${i}`, M + PAGE_W / 2, FOOTER_Y, { width: PAGE_W / 2, align: 'right', lineBreak: false });
    doc.restore();
  }
}

// =============================================================================
// 2×2 Strategic Opportunity Map
// =============================================================================

function drawQuadrantMap(doc: PDFKit.PDFDocument, opportunities: StrategicOpportunity[]) {
  const chartSize = 340;
  const chartX = M + (PAGE_W - chartSize) / 2; // centered
  const chartY = doc.y;
  const half = chartSize / 2;
  const midX = chartX + half;
  const midY = chartY + half;

  // Quadrant background fills
  doc.rect(chartX, chartY, half, half).fill(qBg('explore'));
  doc.rect(midX, chartY, half, half).fill(qBg('invest'));
  doc.rect(chartX, midY, half, half).fill(qBg('divest'));
  doc.rect(midX, midY, half, half).fill(qBg('harvest'));

  // Grid lines
  doc.save();
  doc.strokeColor(C.slate300).lineWidth(1);
  doc.rect(chartX, chartY, chartSize, chartSize).stroke();
  doc.moveTo(midX, chartY).lineTo(midX, chartY + chartSize).stroke();
  doc.moveTo(chartX, midY).lineTo(chartX + chartSize, midY).stroke();
  doc.restore();

  // Quadrant labels
  doc.save();
  doc.fontSize(9).font('Helvetica-Bold');
  doc.fillColor(qColor('explore')).text('EXPLORE', chartX + 8, chartY + 8, { width: half - 16, lineBreak: false });
  doc.fillColor(qColor('invest')).text('INVEST', midX + 8, chartY + 8, { width: half - 16, lineBreak: false });
  doc.fillColor(qColor('divest')).text('DIVEST', chartX + 8, midY + 8, { width: half - 16, lineBreak: false });
  doc.fillColor(qColor('harvest')).text('HARVEST', midX + 8, midY + 8, { width: half - 16, lineBreak: false });
  doc.restore();

  // Axis labels
  doc.save();
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600);
  doc.text('CAPABILITY FIT →', chartX, chartY + chartSize + 6, { width: chartSize, align: 'center', lineBreak: false });
  doc.text('Low', chartX - 28, midY + half - 14, { width: 24, align: 'right', lineBreak: false });
  doc.text('High', chartX - 28, chartY + 4, { width: 24, align: 'right', lineBreak: false });
  doc.text('Low', chartX + 4, chartY + chartSize + 6, { width: 30, lineBreak: false });
  doc.text('High', chartX + chartSize - 30, chartY + chartSize + 6, { width: 30, align: 'right', lineBreak: false });
  doc.restore();

  // Plot opportunities as numbered circles
  doc.save();
  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    const capX = chartX + (opp.scoring.capabilityFit / 10) * chartSize;
    const mktY = chartY + chartSize - (opp.scoring.marketAttractiveness / 10) * chartSize;
    const color = qColor(opp.quadrant);

    doc.circle(capX, mktY, 12).fill(color);
    doc.fontSize(9).font('Helvetica-Bold').fillColor(C.white);
    doc.text(`${i + 1}`, capX - 6, mktY - 5, { width: 12, align: 'center', lineBreak: false });
  }
  doc.restore();

  // Legend below chart
  doc.y = chartY + chartSize + 24;
  doc.fontSize(8).font('Helvetica').fillColor(C.slate600);
  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    const color = qColor(opp.quadrant);
    const legendY = doc.y;

    doc.save();
    doc.circle(M + 6, legendY + 4, 5).fill(color);
    doc.fontSize(7).font('Helvetica-Bold').fillColor(C.white);
    doc.text(`${i + 1}`, M + 1, legendY + 1, { width: 10, align: 'center', lineBreak: false });
    doc.restore();

    const shortTitle = opp.title.length > 70 ? opp.title.slice(0, 67) + '...' : opp.title;
    doc.fontSize(8).font('Helvetica').fillColor(C.slate700);
    doc.text(shortTitle, M + 18, legendY, { width: PAGE_W - 18, lineBreak: false });
    doc.y = legendY + 14;
  }
}

// =============================================================================
// Opportunity Renderer (Card-based with proper Y tracking)
// =============================================================================

function renderOpportunity(doc: PDFKit.PDFDocument, opp: StrategicOpportunity, index: number) {
  const color = qColor(opp.quadrant);
  const bgColor = qBg(opp.quadrant);
  const label = qLabel(opp.quadrant).toUpperCase();

  const startY = doc.y;
  let currentY = startY + 14; // top padding

  // We'll track content height, then draw card background

  // Title with number (save position for later)
  const titleY = currentY;
  const titleText = `${index}. ${opp.title}`;

  // Description
  const descY = titleY + 22; // space for title

  // Calculate total height needed
  let estimatedHeight = 14; // top padding
  estimatedHeight += 30; // title + spacing
  estimatedHeight += 50; // description estimate
  estimatedHeight += 20; // scores
  if (opp.ptw) estimatedHeight += 65;
  if (opp.evidence && opp.evidence.length > 0) estimatedHeight += 60;
  estimatedHeight += 14; // bottom padding

  // Draw card background
  doc.roundedRect(M, startY, PAGE_W, estimatedHeight, 8).fillAndStroke(C.white, C.slate200);

  // Colored top bar
  doc.save();
  doc.rect(M, startY, PAGE_W, 4).fill(color);
  doc.restore();

  // Quadrant badge (top-right)
  doc.save();
  doc.roundedRect(M + PAGE_W - 70, startY + 10, 62, 18, 4).fill(bgColor);
  doc.fontSize(7).font('Helvetica-Bold').fillColor(color)
    .text(label, M + PAGE_W - 70, startY + 15, { width: 62, align: 'center', lineBreak: false });
  doc.restore();

  // Now draw content and track actual positions
  currentY = startY + 14;

  // Title
  doc.fontSize(12).font('Helvetica-Bold').fillColor(C.slate900);
  doc.text(titleText, M + 12, currentY, { width: PAGE_W - 90, lineBreak: true });
  currentY = doc.y + 8;

  // Description
  doc.fontSize(10).font('Helvetica').fillColor(C.slate700);
  doc.text(opp.description, M + 12, currentY, { width: PAGE_W - 24, lineGap: 2 });
  currentY = doc.y + 8;

  // Scores
  doc.fontSize(8).font('Helvetica').fillColor(C.slate600);
  doc.text(`Market: ${opp.scoring.marketAttractiveness}/10  |  Capability: ${opp.scoring.capabilityFit}/10  |  Advantage: ${opp.scoring.competitiveAdvantage}/10  |  Score: ${opp.scoring.overallScore}`, M + 12, currentY, { width: PAGE_W - 24, lineBreak: false });
  currentY += 11 + 8;

  // PTW section in colored box
  if (opp.ptw) {
    const ptwY = currentY;

    // Calculate PTW box height
    const ptwHeight = 60;
    doc.roundedRect(M + 12, ptwY, PAGE_W - 24, ptwHeight, 6).fillAndStroke(C.cyan50, C.cyan200);

    doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500);
    doc.text('PLAYING TO WIN CASCADE', M + 20, ptwY + 8, { width: PAGE_W - 40, lineBreak: false });

    doc.fontSize(9).font('Helvetica').fillColor(C.slate700);
    doc.text(`Where to Play: ${opp.ptw.whereToPlay}`, M + 20, ptwY + 18, { width: PAGE_W - 40, lineBreak: true });

    const wtp_end = doc.y;
    doc.fontSize(9).font('Helvetica').fillColor(C.slate700);
    doc.text(`How to Win: ${opp.ptw.howToWin}`, M + 20, wtp_end + 2, { width: PAGE_W - 40, lineBreak: true });

    currentY = ptwY + ptwHeight + 8;
  }

  // Evidence
  if (opp.evidence && opp.evidence.length > 0) {
    doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500);
    doc.text('EVIDENCE', M + 12, currentY, { width: PAGE_W - 24, lineBreak: false });
    currentY += 10;

    for (const ev of opp.evidence.slice(0, 2)) {
      const q = ev.quote.length > 80 ? ev.quote.slice(0, 77) + '...' : ev.quote;

      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600);
      doc.text(`${ev.territory} › ${ev.researchArea}`, M + 16, currentY, { width: PAGE_W - 32, lineBreak: false });
      currentY += 10;

      doc.fontSize(8).font('Helvetica-Oblique').fillColor(C.slate500);
      doc.text(`"${q}"`, M + 16, currentY, { width: PAGE_W - 32, lineBreak: true });
      currentY = doc.y + 4;
    }
    currentY += 4;
  }

  // Calculate actual card height and redraw if needed
  const actualHeight = currentY - startY + 14;

  // If actual height differs significantly from estimate, we'd need to redraw
  // For now, just move doc.y past the card
  doc.y = startY + Math.max(estimatedHeight, actualHeight) + 16;
}

// =============================================================================
// Tension Renderer (Card-based with proper Y tracking)
// =============================================================================

function renderTension(doc: PDFKit.PDFDocument, tension: StrategicTension) {
  const ic = impactColor(tension.impact);

  const startY = doc.y;
  let currentY = startY;

  // Estimate height
  let estimatedHeight = 14; // top padding
  estimatedHeight += 40; // description
  estimatedHeight += 12;
  if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
    estimatedHeight += 10; // label
    estimatedHeight += tension.resolutionOptions.length * 40; // options
  }
  estimatedHeight += 14; // bottom padding

  // Draw card with impact-colored left border
  doc.roundedRect(M, startY, PAGE_W, estimatedHeight, 8).fillAndStroke(C.white, C.slate200);
  doc.save();
  doc.rect(M, startY, 4, estimatedHeight).fill(ic.border);
  doc.restore();

  // Impact badge (top-right)
  doc.save();
  doc.roundedRect(M + PAGE_W - 70, startY + 10, 62, 18, 4).fill(ic.bg);
  doc.fontSize(7).font('Helvetica-Bold').fillColor(ic.text);
  doc.text(tension.impact.toUpperCase(), M + PAGE_W - 70, startY + 15, { width: 62, align: 'center', lineBreak: false });
  doc.restore();

  // Draw content
  currentY = startY + 14;

  // Description
  doc.fontSize(11).font('Helvetica-Bold').fillColor(C.slate900);
  doc.text(tension.description, M + 16, currentY, { width: PAGE_W - 90, lineBreak: true });
  currentY = doc.y + 12;

  // Resolution options
  if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
    doc.fontSize(7).font('Helvetica-Bold').fillColor(C.slate500);
    doc.text('RESOLUTION OPTIONS', M + 16, currentY, { width: PAGE_W - 32, lineBreak: false });
    currentY += 10;

    for (let i = 0; i < tension.resolutionOptions.length; i++) {
      const opt = tension.resolutionOptions[i];

      // Number circle
      doc.save();
      if (opt.recommended) {
        doc.circle(M + 22, currentY + 5, 7).fill(C.emerald600);
        doc.fontSize(8).font('Helvetica-Bold').fillColor(C.white);
        doc.text(`${i + 1}`, M + 18, currentY + 2, { width: 8, align: 'center', lineBreak: false });
      } else {
        doc.circle(M + 22, currentY + 5, 7).fillAndStroke(C.white, C.slate300);
        doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600);
        doc.text(`${i + 1}`, M + 18, currentY + 2, { width: 8, align: 'center', lineBreak: false });
      }
      doc.restore();

      // Option text
      const prefix = opt.recommended ? '[Recommended] ' : '';
      doc.fontSize(9).font(opt.recommended ? 'Helvetica-Bold' : 'Helvetica').fillColor(opt.recommended ? C.emerald600 : C.slate700);
      doc.text(`${prefix}${opt.option}`, M + 34, currentY, { width: PAGE_W - 48, lineBreak: true });
      currentY = doc.y + 2;

      // Trade-off
      doc.fontSize(8).font('Helvetica').fillColor(C.slate600);
      doc.text(`Trade-off: ${opt.tradeOff}`, M + 34, currentY, { width: PAGE_W - 48, lineBreak: true });
      currentY = doc.y + 8;
    }
  }

  // Move past card
  const actualHeight = currentY - startY + 14;
  doc.y = startY + Math.max(estimatedHeight, actualHeight) + 16;
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

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: M, bottom: 0, left: M, right: M },
    autoFirstPage: true,
    bufferPages: true,
    info: {
      Title: `Strategic Synthesis - ${companyName}`,
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

  // Cyan accent line
  doc.rect(M, 190, 80, 3).fill(C.cyan600);

  // Report type label
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('STRATEGIC SYNTHESIS REPORT', M, 220, { width: PAGE_W, characterSpacing: 2 });

  // Company name
  doc.fontSize(32).font('Helvetica-Bold').fillColor(C.slate900)
    .text(companyName, M, 250, { width: PAGE_W });

  // Navy accent line
  const nb = doc.y + 10;
  doc.rect(M, nb, 80, 3).fill(C.navy);

  // Metadata
  let my = nb + 25;
  if (client?.industry) {
    doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
      .text(`Industry: ${client.industry}`, M, my, { width: PAGE_W });
    my += 18;
  }
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text(`Generated: ${dateStr}`, M, my, { width: PAGE_W });

  // Methodology box
  const bx = my + 50;
  doc.roundedRect(M, bx, PAGE_W, 70, 8).fillAndStroke(C.slate50, C.slate200);

  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('METHODOLOGY', M, bx + 12, { width: PAGE_W, align: 'center' });

  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy)
    .text('Playing to Win Framework', M, bx + 28, { width: PAGE_W, align: 'center' });

  doc.fontSize(9).font('Helvetica').fillColor(C.slate500)
    .text('by Roger Martin & A.G. Lafley', M, bx + 48, { width: PAGE_W, align: 'center' });

  // Footer
  doc.fontSize(10).font('Helvetica').fillColor(C.slate400)
    .text('Powered by Frontera AI Strategy Coach', M, 720, { width: PAGE_W, align: 'center' });
  doc.fontSize(8).fillColor(C.slate300)
    .text('www.frontera.ai', M, 736, { width: PAGE_W, align: 'center' });

  // ======================= EXECUTIVE SUMMARY =======================

  if (synthesis.executiveSummary) {
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Executive Summary', M, M, { width: PAGE_W });
    doc.moveDown(1);

    // Summary in a subtle box - use actual text height
    const summaryStartY = doc.y;

    // Draw text first to get actual height
    doc.fontSize(10).font('Helvetica').fillColor(C.slate700);
    doc.text(synthesis.executiveSummary, M + 16, summaryStartY + 16, { width: PAGE_W - 32, lineGap: 4 });

    const summaryEndY = doc.y;
    const summaryHeight = summaryEndY - summaryStartY + 32; // add padding

    // Draw box behind text (will overlap, but that's OK for subtle bg)
    doc.save();
    doc.roundedRect(M, summaryStartY, PAGE_W, summaryHeight, 8).stroke(C.slate200);
    doc.restore();

    doc.y = summaryEndY + 16;

    // Metadata bar
    doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
    doc.text(`Model: ${synthesis.metadata.modelUsed}   |   Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}   |   Areas analyzed: ${synthesis.metadata.researchAreasCount}`, M, doc.y, { width: PAGE_W });
  }

  // ======================= 2×2 OPPORTUNITY MAP =======================

  if (synthesis.opportunities.length > 0) {
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Strategic Opportunity Map', M, M, { width: PAGE_W });
    doc.moveDown(0.5);

    doc.fontSize(9).font('Helvetica').fillColor(C.slate600);
    doc.text('Opportunities plotted by Market Attractiveness (vertical) and Capability Fit (horizontal)', M, doc.y, { width: PAGE_W });
    doc.moveDown(1);

    drawQuadrantMap(doc, synthesis.opportunities);

    // ======================= OPPORTUNITY DETAILS =======================

    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Opportunities — Detail`, M, M, { width: PAGE_W });
    doc.moveDown(1);

    for (let i = 0; i < synthesis.opportunities.length; i++) {
      ensureSpace(doc, 200);
      renderOpportunity(doc, synthesis.opportunities[i], i + 1);
    }
  }

  // ======================= TENSIONS =======================

  if (synthesis.tensions && synthesis.tensions.length > 0) {
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Tensions (${synthesis.tensions.length})`, M, M, { width: PAGE_W });
    doc.moveDown(1);

    for (const t of synthesis.tensions) {
      ensureSpace(doc, 150);
      renderTension(doc, t);
    }
  }

  // ======================= RECOMMENDATIONS =======================

  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    doc.addPage();
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Priority Recommendations', M, M, { width: PAGE_W });
    doc.moveDown(1);

    synthesis.recommendations.forEach((rec, i) => {
      ensureSpace(doc, 60);

      const recY = doc.y;

      // Draw text first to get height
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700);
      doc.text(rec, M + 40, recY + 15, { width: PAGE_W - 50, lineGap: 3 });

      const recEndY = doc.y;
      const recHeight = Math.max(50, recEndY - recY + 20);

      // Draw card background (overlaps text but that's OK)
      doc.save();
      doc.roundedRect(M, recY, PAGE_W, recHeight, 6).fillAndStroke(C.white, C.slate200);
      doc.restore();

      // Number circle on top
      doc.save();
      doc.circle(M + 20, recY + 25, 12).fill(C.navy);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(C.white);
      doc.text(`${i + 1}`, M + 14, recY + 19, { width: 12, align: 'center', lineBreak: false });
      doc.restore();

      // Redraw text on top of card
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700);
      doc.text(rec, M + 40, recY + 15, { width: PAGE_W - 50, lineGap: 3 });

      doc.y = recY + recHeight + 12;
    });
  }

  // Add footers to all pages (except cover) now that all content is laid out
  addFootersToAllPages(doc);

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
