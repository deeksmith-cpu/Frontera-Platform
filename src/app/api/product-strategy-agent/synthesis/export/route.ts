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
  cyan50: '#ecfeff',
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

function impactColor(i: string): string {
  if (i === 'blocking') return C.red500;
  if (i === 'significant') return C.amber600;
  return C.slate500;
}

/** Add a new page if not enough vertical space remains. Returns current pageNum. */
function needPage(doc: PDFKit.PDFDocument, needed: number, pageNum: number): number {
  if (doc.y + needed > MAX_Y) {
    footer(doc, pageNum);
    doc.addPage();
    doc.x = M;
    doc.y = M;
    return pageNum + 1;
  }
  return pageNum;
}

function footer(doc: PDFKit.PDFDocument, n: number) {
  doc.save();
  doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
  doc.text('Frontera AI Strategy Coach', M, FOOTER_Y, { width: PAGE_W / 2, lineBreak: false });
  doc.text(`${n}`, M + PAGE_W / 2, FOOTER_Y, { width: PAGE_W / 2, align: 'right', lineBreak: false });
  doc.restore();
}

function separator(doc: PDFKit.PDFDocument) {
  const y = doc.y;
  doc.save();
  doc.moveTo(M, y).lineTo(M + PAGE_W, y).strokeColor(C.slate200).lineWidth(0.5).stroke();
  doc.restore();
  doc.y = y + 14;
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
  // Top-left: Explore (high market, low capability)
  doc.rect(chartX, chartY, half, half).fill(qBg('explore'));
  // Top-right: Invest (high market, high capability)
  doc.rect(midX, chartY, half, half).fill(qBg('invest'));
  // Bottom-left: Divest (low market, low capability)
  doc.rect(chartX, midY, half, half).fill(qBg('divest'));
  // Bottom-right: Harvest (low market, high capability)
  doc.rect(midX, midY, half, half).fill(qBg('harvest'));

  // Grid lines
  doc.save();
  doc.strokeColor(C.slate300).lineWidth(1);
  // Outer border
  doc.rect(chartX, chartY, chartSize, chartSize).stroke();
  // Center cross
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
  // X axis: Capability Fit
  doc.text('CAPABILITY FIT \u2192', chartX, chartY + chartSize + 6, { width: chartSize, align: 'center', lineBreak: false });
  // Y axis: Market Attractiveness (rotated via positioning)
  doc.text('Low', chartX - 28, midY + half - 14, { width: 24, align: 'right', lineBreak: false });
  doc.text('High', chartX - 28, chartY + 4, { width: 24, align: 'right', lineBreak: false });
  doc.text('Low', chartX + 4, chartY + chartSize + 6, { width: 30, lineBreak: false });
  doc.text('High', chartX + chartSize - 30, chartY + chartSize + 6, { width: 30, align: 'right', lineBreak: false });
  doc.restore();

  // Plot opportunities as numbered circles
  doc.save();
  for (let i = 0; i < opportunities.length; i++) {
    const opp = opportunities[i];
    // Map scores (1-10) to chart coordinates
    const capX = chartX + (opp.scoring.capabilityFit / 10) * chartSize;
    const mktY = chartY + chartSize - (opp.scoring.marketAttractiveness / 10) * chartSize;
    const color = qColor(opp.quadrant);

    // Circle
    doc.circle(capX, mktY, 12).fill(color);
    // Number
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

    // Small colored circle
    doc.save();
    doc.circle(M + 6, legendY + 4, 5).fill(color);
    doc.fontSize(7).font('Helvetica-Bold').fillColor(C.white);
    doc.text(`${i + 1}`, M + 1, legendY + 1, { width: 10, align: 'center', lineBreak: false });
    doc.restore();

    // Label
    const shortTitle = opp.title.length > 70 ? opp.title.slice(0, 67) + '...' : opp.title;
    doc.fontSize(8).font('Helvetica').fillColor(C.slate700);
    doc.text(shortTitle, M + 18, legendY, { width: PAGE_W - 18, lineBreak: false });
    doc.y = legendY + 14;
  }
}

// =============================================================================
// Opportunity Renderer
// =============================================================================

function renderOpportunity(doc: PDFKit.PDFDocument, opp: StrategicOpportunity, index: number) {
  const color = qColor(opp.quadrant);
  const label = qLabel(opp.quadrant).toUpperCase();

  // Title with number
  doc.fontSize(13).font('Helvetica-Bold').fillColor(C.slate900);
  doc.text(`${index}. ${opp.title}`, M, doc.y, { width: PAGE_W });

  // Quadrant badge
  doc.fontSize(8).font('Helvetica-Bold').fillColor(color);
  doc.text(label, M, doc.y, { width: PAGE_W, lineBreak: false });
  doc.moveDown(0.4);

  // Description
  doc.fontSize(10).font('Helvetica').fillColor(C.slate700);
  doc.text(opp.description, M, doc.y, { width: PAGE_W, lineGap: 3 });
  doc.moveDown(0.5);

  // Scores
  doc.fontSize(9).font('Helvetica').fillColor(C.slate600);
  doc.text(
    `Market: ${opp.scoring.marketAttractiveness}/10  |  Capability: ${opp.scoring.capabilityFit}/10  |  Advantage: ${opp.scoring.competitiveAdvantage}/10  |  Score: ${opp.scoring.overallScore}`,
    M, doc.y, { width: PAGE_W }
  );
  doc.moveDown(0.5);

  // PTW
  if (opp.ptw) {
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500);
    doc.text('PLAYING TO WIN CASCADE', M, doc.y, { width: PAGE_W });
    doc.moveDown(0.15);
    doc.fontSize(9).font('Helvetica').fillColor(C.slate600);
    doc.text(`Where to Play: ${opp.ptw.whereToPlay}`, M, doc.y, { width: PAGE_W });
    doc.text(`How to Win: ${opp.ptw.howToWin}`, M, doc.y, { width: PAGE_W });
    doc.moveDown(0.4);
  }

  // Evidence (top 2, truncated)
  if (opp.evidence && opp.evidence.length > 0) {
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500);
    doc.text('EVIDENCE', M, doc.y, { width: PAGE_W });
    doc.moveDown(0.15);
    for (const ev of opp.evidence.slice(0, 2)) {
      const q = ev.quote.length > 100 ? ev.quote.slice(0, 97) + '...' : ev.quote;
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600);
      doc.text(`${ev.territory} > ${ev.researchArea}`, M + 8, doc.y, { width: PAGE_W - 8 });
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(C.slate500);
      doc.text(`"${q}"`, M + 8, doc.y, { width: PAGE_W - 8 });
      doc.moveDown(0.15);
    }
  }

  doc.moveDown(0.4);
  separator(doc);
}

// =============================================================================
// Tension Renderer
// =============================================================================

function renderTension(doc: PDFKit.PDFDocument, tension: StrategicTension) {
  const ic = impactColor(tension.impact);

  // Description
  doc.fontSize(11).font('Helvetica-Bold').fillColor(C.slate900);
  doc.text(tension.description, M, doc.y, { width: PAGE_W });

  // Impact
  doc.fontSize(8).font('Helvetica-Bold').fillColor(ic);
  doc.text(tension.impact.toUpperCase(), M, doc.y, { width: PAGE_W, lineBreak: false });
  doc.moveDown(0.4);

  // Resolution options — avoid continued:true which causes blank pages
  if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
    for (const opt of tension.resolutionOptions) {
      const prefix = opt.recommended ? '[Recommended] ' : '';
      const line = `${prefix}${opt.option} — ${opt.tradeOff}`;
      doc.fontSize(9).font('Helvetica').fillColor(C.slate700);
      doc.text(line, M + 10, doc.y, { width: PAGE_W - 10 });
      doc.moveDown(0.15);
    }
  }

  doc.moveDown(0.4);
  separator(doc);
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
    margins: { top: M, bottom: 50, left: M, right: M },
    autoFirstPage: true,
    info: {
      Title: `Strategic Synthesis - ${companyName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pg = 0;

  // ======================= COVER PAGE =======================

  doc.rect(M, 100, 60, 60).fill(C.navy);
  doc.fontSize(28).font('Helvetica-Bold').fillColor(C.white)
    .text('F', M, 116, { width: 60, align: 'center' });

  doc.rect(M, 190, 80, 3).fill(C.cyan600);

  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('STRATEGIC SYNTHESIS REPORT', M, 220, { width: PAGE_W, characterSpacing: 2 });

  doc.fontSize(32).font('Helvetica-Bold').fillColor(C.slate900)
    .text(companyName, M, 250, { width: PAGE_W });

  const nb = doc.y + 10;
  doc.rect(M, nb, 80, 3).fill(C.navy);

  let my = nb + 25;
  if (client?.industry) {
    doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
      .text(`Industry: ${client.industry}`, M, my, { width: PAGE_W });
    my += 18;
  }
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text(`Generated: ${dateStr}`, M, my, { width: PAGE_W });

  const bx = my + 50;
  doc.roundedRect(M, bx, PAGE_W, 70, 6).strokeColor(C.slate200).stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('METHODOLOGY', M, bx + 12, { width: PAGE_W, align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy)
    .text('Playing to Win Framework', M, bx + 28, { width: PAGE_W, align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor(C.slate500)
    .text('by Roger Martin & A.G. Lafley', M, bx + 48, { width: PAGE_W, align: 'center' });

  doc.fontSize(10).font('Helvetica').fillColor(C.slate400)
    .text('Powered by Frontera AI Strategy Coach', M, 720, { width: PAGE_W, align: 'center' });
  doc.fontSize(8).fillColor(C.slate300)
    .text('www.frontera.ai', M, 736, { width: PAGE_W, align: 'center' });

  // ======================= EXECUTIVE SUMMARY =======================

  if (synthesis.executiveSummary) {
    doc.addPage(); pg++;
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Executive Summary', M, M, { width: PAGE_W });
    doc.moveDown(0.8);
    doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
      .text(synthesis.executiveSummary, { width: PAGE_W, lineGap: 4 });
    doc.moveDown(1.5);
    doc.fontSize(8).fillColor(C.slate400).text(
      `Model: ${synthesis.metadata.modelUsed}   |   Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}   |   Areas analyzed: ${synthesis.metadata.researchAreasCount}`,
      { width: PAGE_W }
    );
    footer(doc, pg);
  }

  // ======================= 2×2 OPPORTUNITY MAP =======================

  if (synthesis.opportunities.length > 0) {
    doc.addPage(); pg++;
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Strategic Opportunity Map', M, M, { width: PAGE_W });
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
      .text('Opportunities plotted by Market Attractiveness (vertical) and Capability Fit (horizontal)', M, doc.y, { width: PAGE_W });
    doc.moveDown(1);

    drawQuadrantMap(doc, synthesis.opportunities);
    footer(doc, pg);

    // ======================= OPPORTUNITY DETAILS =======================

    doc.addPage(); pg++;
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Opportunities — Detail`, M, M, { width: PAGE_W });
    doc.moveDown(0.8);

    for (let i = 0; i < synthesis.opportunities.length; i++) {
      pg = needPage(doc, 160, pg);
      renderOpportunity(doc, synthesis.opportunities[i], i + 1);
    }
    footer(doc, pg);
  }

  // ======================= TENSIONS =======================

  if (synthesis.tensions && synthesis.tensions.length > 0) {
    doc.addPage(); pg++;
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Tensions (${synthesis.tensions.length})`, M, M, { width: PAGE_W });
    doc.moveDown(0.8);

    for (const t of synthesis.tensions) {
      pg = needPage(doc, 100, pg);
      renderTension(doc, t);
    }
    footer(doc, pg);
  }

  // ======================= RECOMMENDATIONS =======================

  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    doc.addPage(); pg++;
    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Priority Recommendations', M, M, { width: PAGE_W });
    doc.moveDown(0.8);

    synthesis.recommendations.forEach((rec, i) => {
      pg = needPage(doc, 40, pg);
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
        .text(`${i + 1}. ${rec}`, M, doc.y, { width: PAGE_W, lineGap: 3 });
      doc.moveDown(0.6);
    });
    footer(doc, pg);
  }

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
