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
// PDF Generation with PDFKit
// =============================================================================

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
    margins: { top: 40, bottom: 60, left: 40, right: 40 },
    bufferPages: true,
    info: {
      Title: `Strategic Synthesis - ${companyName}`,
      Author: 'Frontera AI Strategy Coach',
    },
  });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  const pageWidth = 595.28 - 80; // A4 width minus margins

  // =========================================================================
  // Cover Page
  // =========================================================================

  // Logo box
  doc.rect(40, 100, 60, 60).fill(C.navy);
  doc.fontSize(28).font('Helvetica-Bold').fillColor(C.white).text('F', 40, 116, { width: 60, align: 'center' });

  // Cyan accent line
  doc.rect(40, 190, 80, 3).fill(C.cyan600);

  // Title
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500).text('STRATEGIC SYNTHESIS REPORT', 40, 220, { characterSpacing: 2 });

  doc.fontSize(32).font('Helvetica-Bold').fillColor(C.slate900).text(companyName, 40, 250, { width: pageWidth });

  // Navy accent line
  const companyNameHeight = doc.heightOfString(companyName, { width: pageWidth });
  const lineY = 260 + companyNameHeight;
  doc.rect(40, lineY, 80, 3).fill(C.navy);

  // Metadata
  let metaY = lineY + 25;
  if (client?.industry) {
    doc.fontSize(10).font('Helvetica').fillColor(C.slate600).text(`Industry: ${client.industry}`, 40, metaY, { width: pageWidth });
    metaY += 18;
  }
  doc.fontSize(10).font('Helvetica').fillColor(C.slate600).text(`Generated: ${dateStr}`, 40, metaY, { width: pageWidth });

  // Methodology box
  const boxY = metaY + 50;
  doc.roundedRect(40, boxY, pageWidth, 70, 6).strokeColor(C.slate200).stroke();
  doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500).text('METHODOLOGY', 40, boxY + 12, { width: pageWidth, align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold').fillColor(C.navy).text('Playing to Win Framework', 40, boxY + 28, { width: pageWidth, align: 'center' });
  doc.fontSize(9).font('Helvetica').fillColor(C.slate500).text('by Roger Martin & A.G. Lafley', 40, boxY + 48, { width: pageWidth, align: 'center' });

  // Footer
  doc.fontSize(10).font('Helvetica').fillColor(C.slate400).text('Powered by Frontera AI Strategy Coach', 40, 720, { width: pageWidth, align: 'center' });
  doc.fontSize(8).fillColor(C.slate300).text('www.frontera.ai', 40, 736, { width: pageWidth, align: 'center' });

  // =========================================================================
  // Executive Summary
  // =========================================================================

  if (synthesis.executiveSummary) {
    doc.addPage();

    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.slate900).text('Executive Summary', 40, 40);
    doc.moveDown(0.5);

    doc.fontSize(10).font('Helvetica').fillColor(C.slate700).text(synthesis.executiveSummary, {
      width: pageWidth,
      lineGap: 4,
    });

    doc.moveDown(1);
    const meta = [
      `Model: ${synthesis.metadata.modelUsed}`,
      `Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}`,
      `Areas analyzed: ${synthesis.metadata.researchAreasCount}`,
    ].join('  •  ');
    doc.fontSize(8).fillColor(C.slate400).text(meta, { width: pageWidth });
  }

  // =========================================================================
  // Strategic Opportunities
  // =========================================================================

  if (synthesis.opportunities.length > 0) {
    doc.addPage();

    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Opportunities (${synthesis.opportunities.length})`, 40, 40);
    doc.moveDown(1);

    for (const opp of synthesis.opportunities) {
      ensureSpace(doc, 120);

      // Title + quadrant badge
      const qColor = getQuadrantColor(opp.quadrant);
      doc.fontSize(16).font('Helvetica-Bold').fillColor(C.slate900).text(opp.title, { width: pageWidth - 80, continued: false });

      // Quadrant label on right (approximate position)
      const savedY = doc.y;
      doc.fontSize(7).font('Helvetica-Bold').fillColor(qColor)
        .text(getQuadrantLabel(opp.quadrant).toUpperCase(), 40 + pageWidth - 70, savedY - 18, { width: 70, align: 'right' });
      doc.y = savedY;

      // Description
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700).text(opp.description, { width: pageWidth, lineGap: 3 });
      doc.moveDown(0.5);

      // Scores
      const scores = `Market: ${opp.scoring.marketAttractiveness}/10  |  Capability: ${opp.scoring.capabilityFit}/10  |  Advantage: ${opp.scoring.competitiveAdvantage}/10  |  Score: ${opp.scoring.overallScore}`;
      doc.fontSize(9).fillColor(C.slate600).text(scores, { width: pageWidth });
      doc.moveDown(0.5);

      // PTW Cascade
      if (opp.ptw) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500).text('PLAYING TO WIN CASCADE');
        doc.fontSize(9).font('Helvetica').fillColor(C.slate600)
          .text(`Where to Play: ${opp.ptw.whereToPlay}`, { width: pageWidth })
          .text(`How to Win: ${opp.ptw.howToWin}`, { width: pageWidth });
        doc.moveDown(0.3);
      }

      // Evidence (top 3)
      if (opp.evidence && opp.evidence.length > 0) {
        doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate500).text('EVIDENCE');
        for (const ev of opp.evidence.slice(0, 3)) {
          doc.fontSize(8).font('Helvetica-Bold').fillColor(C.slate600)
            .text(`${ev.territory} > ${ev.researchArea}: `, { continued: true })
            .font('Helvetica-Oblique').fillColor(C.slate500)
            .text(`"${ev.quote}"`, { width: pageWidth });
        }
        doc.moveDown(0.3);
      }

      // Separator
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor(C.slate200).lineWidth(0.5).stroke();
      doc.moveDown(0.8);
    }
  }

  // =========================================================================
  // Strategic Tensions
  // =========================================================================

  if (synthesis.tensions && synthesis.tensions.length > 0) {
    doc.addPage();

    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.slate900)
      .text(`Strategic Tensions (${synthesis.tensions.length})`, 40, 40);
    doc.moveDown(1);

    for (const tension of synthesis.tensions) {
      ensureSpace(doc, 80);

      const impactColor = getImpactColor(tension.impact);

      doc.fontSize(12).font('Helvetica-Bold').fillColor(C.slate900).text(tension.description, { width: pageWidth - 80 });
      const tY = doc.y;
      doc.fontSize(7).font('Helvetica-Bold').fillColor(impactColor)
        .text(tension.impact.toUpperCase(), 40 + pageWidth - 70, tY - 14, { width: 70, align: 'right' });
      doc.y = tY;

      // Resolution options
      if (tension.resolutionOptions && tension.resolutionOptions.length > 0) {
        doc.moveDown(0.3);
        for (const opt of tension.resolutionOptions) {
          const bullet = opt.recommended ? '★ ' : '• ';
          const bulletColor = opt.recommended ? C.gold : C.slate400;
          doc.fontSize(9).font('Helvetica').fillColor(bulletColor).text(bullet, { continued: true })
            .fillColor(C.slate700).text(opt.option, { continued: true })
            .fillColor(C.slate400).font('Helvetica-Oblique').text(` — ${opt.tradeOff}`, { width: pageWidth });
        }
      }

      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor(C.slate200).lineWidth(0.5).stroke();
      doc.moveDown(0.8);
    }
  }

  // =========================================================================
  // Recommendations
  // =========================================================================

  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    ensureSpace(doc, 100);

    doc.fontSize(24).font('Helvetica-Bold').fillColor(C.slate900).text('Priority Recommendations');
    doc.moveDown(0.8);

    synthesis.recommendations.forEach((rec, i) => {
      ensureSpace(doc, 30);
      doc.fontSize(10).font('Helvetica').fillColor(C.slate700).text(`${i + 1}. ${rec}`, { width: pageWidth, lineGap: 3 });
      doc.moveDown(0.3);
    });
  }

  // =========================================================================
  // Page Numbers (footer on all pages)
  // =========================================================================

  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).font('Helvetica').fillColor(C.slate400);
    doc.text('Frontera AI Strategy Coach', 40, 800, { width: pageWidth / 2 });
    doc.text(`${i + 1} / ${totalPages}`, 40 + pageWidth / 2, 800, { width: pageWidth / 2, align: 'right' });
  }

  doc.end();

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err: Error) => reject(err));
  });
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > 780) {
    doc.addPage();
  }
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

    const companyName = typedClient?.company_name || 'Strategy';
    const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '-');
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
