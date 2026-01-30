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
  slate50: '#f8fafc',
  white: '#ffffff',
  emerald600: '#059669',
  amber600: '#d97706',
  red500: '#ef4444',
};

// =============================================================================
// Helpers
// =============================================================================

const PAGE_WIDTH = 515.28; // A4 (595.28) minus 40+40 margins
const MARGIN = 40;
const FOOTER_Y = 790;
const CONTENT_BOTTOM = 760; // stop content before footer area

function getQuadrantLabel(q: string): string {
  return q.charAt(0).toUpperCase() + q.slice(1);
}

function getQuadrantColor(q: string): string {
  switch (q) {
    case 'invest': return C.emerald600;
    case 'explore': return C.cyan600;
    case 'harvest': return C.amber600;
    case 'divest': return C.slate500;
    default: return C.slate500;
  }
}

function getImpactColor(impact: string): string {
  switch (impact) {
    case 'blocking': return C.red500;
    case 'significant': return C.amber600;
    default: return C.slate500;
  }
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > CONTENT_BOTTOM) {
    doc.addPage();
    doc.y = MARGIN;
  }
}

function drawFooter(doc: PDFKit.PDFDocument, pageNum: number) {
  doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
  doc.text('Frontera AI Strategy Coach', MARGIN, FOOTER_Y, { width: PAGE_WIDTH / 2 });
  doc.text(`${pageNum}`, MARGIN + PAGE_WIDTH / 2, FOOTER_Y, { width: PAGE_WIDTH / 2, align: 'right' });
}

function drawSeparator(doc: PDFKit.PDFDocument) {
  doc.moveTo(MARGIN, doc.y).lineTo(MARGIN + PAGE_WIDTH, doc.y).strokeColor(C.slate200).lineWidth(0.5).stroke();
  doc.y += 12;
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGIN, bottom: 50, left: MARGIN, right: MARGIN },
    info: {
      Title: `Strategic Synthesis - ${companyName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  let pageNum = 0;

  // =========================================================================
  // Cover Page (no footer)
  // =========================================================================

  // Logo box
  doc.rect(MARGIN, 100, 60, 60).fill(C.navy);
  doc.fontSize(28).font('Helvetica-Bold').fillColor(C.white).text('F', MARGIN, 116, { width: 60, align: 'center' });

  // Cyan accent line
  doc.rect(MARGIN, 190, 80, 3).fill(C.cyan600);

  // Title label
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('STRATEGIC SYNTHESIS REPORT', MARGIN, 220, { width: PAGE_WIDTH, characterSpacing: 2 });

  // Company name
  doc.fontSize(32).font('Helvetica-Bold').fillColor(C.slate900)
    .text(companyName, MARGIN, 250, { width: PAGE_WIDTH });

  // Navy accent line
  const nameBottom = doc.y + 10;
  doc.rect(MARGIN, nameBottom, 80, 3).fill(C.navy);

  // Metadata
  let metaY = nameBottom + 25;
  if (client?.industry) {
    doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
      .text(`Industry: ${client.industry}`, MARGIN, metaY, { width: PAGE_WIDTH });
    metaY += 18;
  }
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600)
    .text(`Generated: ${dateStr}`, MARGIN, metaY, { width: PAGE_WIDTH });

  // Methodology box
  const boxY = metaY + 50;
  doc.roundedRect(MARGIN, boxY, PAGE_WIDTH, 70, 6).strokeColor(C.slate200).stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
    .text('METHODOLOGY', MARGIN, boxY + 12, { width: PAGE_WIDTH, align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy)
    .text('Playing to Win Framework', MARGIN, boxY + 28, { width: PAGE_WIDTH, align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor(C.slate500)
    .text('by Roger Martin & A.G. Lafley', MARGIN, boxY + 48, { width: PAGE_WIDTH, align: 'center' });

  // Cover footer
  doc.fontSize(10).font('Helvetica').fillColor(C.slate400)
    .text('Powered by Frontera AI Strategy Coach', MARGIN, 720, { width: PAGE_WIDTH, align: 'center' });
  doc.fontSize(8).fillColor(C.slate300)
    .text('www.frontera.ai', MARGIN, 736, { width: PAGE_WIDTH, align: 'center' });

  // =========================================================================
  // Executive Summary
  // =========================================================================

  if (synthesis.executiveSummary) {
    doc.addPage();
    pageNum++;
    doc.y = MARGIN;

    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Executive Summary', MARGIN, MARGIN, { width: PAGE_WIDTH });
    doc.moveDown(0.8);

    doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
      .text(synthesis.executiveSummary, { width: PAGE_WIDTH, lineGap: 4 });

    doc.moveDown(1.5);
    const meta = [
      `Model: ${synthesis.metadata.modelUsed}`,
      `Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}`,
      `Areas analyzed: ${synthesis.metadata.researchAreasCount}`,
    ].join('   |   ');
    doc.fontSize(8).fillColor(C.slate400).text(meta, { width: PAGE_WIDTH });

    drawFooter(doc, pageNum);
  }

  // =========================================================================
  // Strategic Opportunities
  // =========================================================================

  if (synthesis.opportunities.length > 0) {
    doc.addPage();
    pageNum++;
    doc.y = MARGIN;

    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Opportunities (${synthesis.opportunities.length})`, MARGIN, MARGIN, { width: PAGE_WIDTH });
    doc.moveDown(1);

    for (const opp of synthesis.opportunities) {
      renderOpportunity(doc, opp);

      // Check if we need a new page for next opportunity
      if (doc.y > CONTENT_BOTTOM - 40) {
        drawFooter(doc, pageNum);
        doc.addPage();
        pageNum++;
        doc.y = MARGIN;
      }
    }

    drawFooter(doc, pageNum);
  }

  // =========================================================================
  // Strategic Tensions
  // =========================================================================

  if (synthesis.tensions && synthesis.tensions.length > 0) {
    doc.addPage();
    pageNum++;
    doc.y = MARGIN;

    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Tensions (${synthesis.tensions.length})`, MARGIN, MARGIN, { width: PAGE_WIDTH });
    doc.moveDown(1);

    for (const tension of synthesis.tensions) {
      renderTension(doc, tension);

      if (doc.y > CONTENT_BOTTOM - 40) {
        drawFooter(doc, pageNum);
        doc.addPage();
        pageNum++;
        doc.y = MARGIN;
      }
    }

    drawFooter(doc, pageNum);
  }

  // =========================================================================
  // Recommendations
  // =========================================================================

  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    doc.addPage();
    pageNum++;
    doc.y = MARGIN;

    doc.fontSize(22).font('Helvetica-Bold').fillColor(C.slate900)
      .text('Priority Recommendations', MARGIN, MARGIN, { width: PAGE_WIDTH });
    doc.moveDown(1);

    synthesis.recommendations.forEach((rec, i) => {
      ensureSpace(doc, 40);
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
        .text(`${i + 1}. ${rec}`, MARGIN, doc.y, { width: PAGE_WIDTH, lineGap: 3 });
      doc.moveDown(0.6);
    });

    drawFooter(doc, pageNum);
  }

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));
  });
}

// =============================================================================
// Opportunity Renderer
// =============================================================================

function renderOpportunity(doc: PDFKit.PDFDocument, opp: StrategicOpportunity) {
  ensureSpace(doc, 140);

  const qColor = getQuadrantColor(opp.quadrant);
  const qLabel = getQuadrantLabel(opp.quadrant).toUpperCase();

  // Title line with inline quadrant badge
  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.slate900)
    .text(opp.title, MARGIN, doc.y, { width: PAGE_WIDTH, continued: false });

  // Quadrant badge on its own line
  doc.fontSize(8).font('Helvetica-Bold').fillColor(qColor)
    .text(qLabel, MARGIN, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.3);

  // Description
  doc.fontSize(10).font('Helvetica').fillColor(C.slate700)
    .text(opp.description, MARGIN, doc.y, { width: PAGE_WIDTH, lineGap: 3 });
  doc.moveDown(0.5);

  // Scores on one line
  const scores = `Market: ${opp.scoring.marketAttractiveness}/10   |   Capability: ${opp.scoring.capabilityFit}/10   |   Advantage: ${opp.scoring.competitiveAdvantage}/10   |   Score: ${opp.scoring.overallScore}`;
  doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
    .text(scores, MARGIN, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.5);

  // PTW Cascade
  if (opp.ptw) {
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
      .text('PLAYING TO WIN CASCADE', MARGIN, doc.y, { width: PAGE_WIDTH });
    doc.moveDown(0.2);
    doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
      .text(`Where to Play: ${opp.ptw.whereToPlay}`, MARGIN, doc.y, { width: PAGE_WIDTH });
    doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
      .text(`How to Win: ${opp.ptw.howToWin}`, MARGIN, doc.y, { width: PAGE_WIDTH });
    doc.moveDown(0.4);
  }

  // Evidence (top 3, truncated quotes)
  if (opp.evidence && opp.evidence.length > 0) {
    doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500)
      .text('EVIDENCE', MARGIN, doc.y, { width: PAGE_WIDTH });
    doc.moveDown(0.2);

    for (const ev of opp.evidence.slice(0, 3)) {
      const quote = ev.quote.length > 120 ? ev.quote.slice(0, 120) + '...' : ev.quote;
      doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600)
        .text(`${ev.territory} > ${ev.researchArea}`, MARGIN + 8, doc.y, { width: PAGE_WIDTH - 8 });
      doc.fontSize(8).font('Helvetica-Oblique').fillColor(C.slate500)
        .text(`"${quote}"`, MARGIN + 8, doc.y, { width: PAGE_WIDTH - 8 });
      doc.moveDown(0.2);
    }
  }

  // Separator
  doc.moveDown(0.5);
  drawSeparator(doc);
}

// =============================================================================
// Tension Renderer
// =============================================================================

function renderTension(doc: PDFKit.PDFDocument, tension: StrategicTension) {
  ensureSpace(doc, 100);

  const impactColor = getImpactColor(tension.impact);

  // Description
  doc.fontSize(12).font('Helvetica-Bold').fillColor(C.slate900)
    .text(tension.description, MARGIN, doc.y, { width: PAGE_WIDTH });

  // Impact badge on its own line
  doc.fontSize(8).font('Helvetica-Bold').fillColor(impactColor)
    .text(tension.impact.toUpperCase(), MARGIN, doc.y, { width: PAGE_WIDTH });
  doc.moveDown(0.4);

  // Resolution options
  if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
    for (const opt of tension.resolutionOptions) {
      const bullet = opt.recommended ? '\u2605 ' : '\u2022 ';
      const bulletColor = opt.recommended ? C.gold : C.slate400;
      const line = `${bullet}${opt.option} \u2014 ${opt.tradeOff}`;

      doc.fontSize(9).font('Helvetica').fillColor(bulletColor)
        .text(bullet, MARGIN, doc.y, { continued: true, width: PAGE_WIDTH })
        .fillColor(C.slate700).font('Helvetica')
        .text(opt.option, { continued: true })
        .fillColor(C.slate400).font('Helvetica-Oblique')
        .text(` \u2014 ${opt.tradeOff}`, { continued: false, width: PAGE_WIDTH });
      doc.moveDown(0.2);
    }
  }

  doc.moveDown(0.5);
  drawSeparator(doc);
}

// =============================================================================
// Supabase Client
// =============================================================================

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

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
      return NextResponse.json(
        { error: 'conversation_id query parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const rawSupabase = getRawSupabase();

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const { data: synthesisData, error: synthError } = await rawSupabase
      .from('synthesis_outputs')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (synthError || !synthesisData) {
      return NextResponse.json(
        { error: 'No synthesis found for this conversation. Please generate synthesis first.' },
        { status: 404 }
      );
    }

    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('clerk_org_id', orgId)
      .single();

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
      synthesis,
      client: typedClient,
      generatedAt: new Date().toISOString(),
    });

    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    const pdfBytes = new Uint8Array(pdfBuffer);

    const cName = typedClient?.company_name || 'Strategy';
    const sanitizedCompanyName = cName.replace(/[^a-zA-Z0-9]/g, '-');
    const dateStrFile = new Date().toISOString().split('T')[0];
    const filename = `Strategic-Synthesis-${sanitizedCompanyName}-${dateStrFile}.pdf`;

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
