import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake');
import type { TDocumentDefinitions, Content, StyleDictionary } from 'pdfmake/interfaces';
import type { Database, Client } from '@/types/database';
import type { SynthesisResult, StrategicOpportunity, StrategicTension } from '@/types/synthesis';

// =============================================================================
// Brand Colors
// =============================================================================

const C = {
  navy: '#1a1f3a',
  navyLight: '#2d3561',
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
  purple600: '#9333ea',
  red500: '#ef4444',
};

// =============================================================================
// PDF Document Builder
// =============================================================================

function buildPdfDefinition(
  synthesis: SynthesisResult,
  client: Client | null,
  generatedAt: string,
): TDocumentDefinitions {
  const companyName = client?.company_name || 'Strategic Analysis';
  const dateStr = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const styles: StyleDictionary = {
    h1: { fontSize: 24, bold: true, color: C.slate900, margin: [0, 0, 0, 12] },
    h2: { fontSize: 16, bold: true, color: C.slate900, margin: [0, 0, 0, 10] },
    h3: { fontSize: 12, bold: true, color: C.slate900, margin: [0, 0, 0, 6] },
    body: { fontSize: 10, color: C.slate700, lineHeight: 1.5 },
    bodySmall: { fontSize: 9, color: C.slate600, lineHeight: 1.4 },
    label: { fontSize: 8, bold: true, color: C.slate500 },
    caption: { fontSize: 8, color: C.slate400 },
  };

  const content: Content[] = [];

  // ---- Cover Page ----
  content.push(
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 60, h: 60, r: 8, color: C.navy }],
      margin: [0, 80, 0, 0] as [number, number, number, number],
    },
    {
      text: 'F',
      fontSize: 28,
      bold: true,
      color: C.white,
      absolutePosition: { x: 62, y: 96 },
    },
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 80, h: 3, r: 1, color: C.cyan600 }],
      margin: [0, 30, 0, 20] as [number, number, number, number],
    },
    { text: 'STRATEGIC SYNTHESIS REPORT', style: 'label', margin: [0, 0, 0, 8] as [number, number, number, number] },
    { text: companyName, fontSize: 32, bold: true, color: C.slate900, margin: [0, 0, 0, 16] as [number, number, number, number] },
    {
      canvas: [{ type: 'rect', x: 0, y: 0, w: 80, h: 3, r: 1, color: C.navy }],
      margin: [0, 0, 0, 20] as [number, number, number, number],
    },
  );

  if (client?.industry) {
    content.push({ text: `Industry: ${client.industry}`, style: 'bodySmall', margin: [0, 0, 0, 4] as [number, number, number, number] });
  }
  content.push(
    { text: `Generated: ${dateStr}`, style: 'bodySmall', margin: [0, 0, 0, 30] as [number, number, number, number] },
    {
      table: {
        widths: ['*'],
        body: [[
          {
            stack: [
              { text: 'METHODOLOGY', style: 'label', alignment: 'center' as const, margin: [0, 0, 0, 4] as [number, number, number, number] },
              { text: 'Playing to Win Framework', fontSize: 14, bold: true, color: C.navy, alignment: 'center' as const, margin: [0, 0, 0, 4] as [number, number, number, number] },
              { text: 'by Roger Martin & A.G. Lafley', fontSize: 9, color: C.slate500, alignment: 'center' as const },
            ],
            margin: [0, 8, 0, 8] as [number, number, number, number],
          },
        ]],
      },
      layout: {
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        hLineColor: () => C.slate200,
        vLineColor: () => C.slate200,
        paddingLeft: () => 12,
        paddingRight: () => 12,
        paddingTop: () => 8,
        paddingBottom: () => 8,
      },
      margin: [0, 0, 0, 60] as [number, number, number, number],
    },
    { text: 'Powered by Frontera AI Strategy Coach', style: 'caption', alignment: 'center' as const },
    { text: 'www.frontera.ai', fontSize: 8, color: C.slate300, alignment: 'center' as const, margin: [0, 4, 0, 0] as [number, number, number, number] },
    { text: '', pageBreak: 'after' as const },
  );

  // ---- Executive Summary ----
  if (synthesis.executiveSummary) {
    content.push(
      { text: 'Executive Summary', style: 'h1' },
      { text: synthesis.executiveSummary, style: 'body', margin: [0, 0, 0, 12] as [number, number, number, number] },
      {
        columns: [
          { text: `Model: ${synthesis.metadata.modelUsed}`, style: 'caption' },
          { text: `Territories: ${synthesis.metadata.territoriesIncluded.join(', ')}`, style: 'caption' },
          { text: `Areas analyzed: ${synthesis.metadata.researchAreasCount}`, style: 'caption' },
        ],
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },
    );
  }

  // ---- Strategic Opportunities ----
  if (synthesis.opportunities.length > 0) {
    content.push(
      { text: `Strategic Opportunities (${synthesis.opportunities.length})`, style: 'h1', margin: [0, 10, 0, 12] as [number, number, number, number] },
    );

    for (const opp of synthesis.opportunities) {
      content.push(buildOpportunityCard(opp));
    }
  }

  // ---- Strategic Tensions ----
  if (synthesis.tensions && synthesis.tensions.length > 0) {
    content.push(
      { text: '', pageBreak: 'before' as const },
      { text: `Strategic Tensions (${synthesis.tensions.length})`, style: 'h1' },
    );

    for (const tension of synthesis.tensions) {
      content.push(buildTensionCard(tension));
    }
  }

  // ---- Recommendations ----
  if (synthesis.recommendations && synthesis.recommendations.length > 0) {
    content.push(
      { text: 'Priority Recommendations', style: 'h1', margin: [0, 20, 0, 12] as [number, number, number, number] },
    );
    const recItems = synthesis.recommendations.map((rec, i) => ({
      text: `${i + 1}. ${rec}`,
      style: 'body' as const,
      margin: [0, 0, 0, 6] as [number, number, number, number],
    }));
    content.push(...recItems);
  }

  return {
    content,
    styles,
    defaultStyle: { font: 'Helvetica', fontSize: 10, color: C.slate700 },
    pageSize: 'A4' as const,
    pageMargins: [40, 40, 40, 60] as [number, number, number, number],
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: 'Frontera AI Strategy Coach', style: 'caption', margin: [40, 0, 0, 0] as [number, number, number, number] },
        { text: `${currentPage} / ${pageCount}`, style: 'caption', alignment: 'right' as const, margin: [0, 0, 40, 0] as [number, number, number, number] },
      ],
    }),
  };
}

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

function buildOpportunityCard(opp: StrategicOpportunity): Content {
  const qColor = getQuadrantColor(opp.quadrant);

  const evidenceItems: Content[] = opp.evidence.slice(0, 3).map((ev) => ({
    text: [
      { text: `${ev.territory} > ${ev.researchArea}: `, bold: true, fontSize: 8, color: C.slate600 },
      { text: `"${ev.quote}"`, fontSize: 8, color: C.slate500, italics: true },
    ],
    margin: [8, 0, 0, 3] as [number, number, number, number],
  }));

  return {
    stack: [
      {
        columns: [
          { text: opp.title, style: 'h2', width: '*' },
          {
            text: getQuadrantLabel(opp.quadrant).toUpperCase(),
            fontSize: 7,
            bold: true,
            color: qColor,
            alignment: 'right' as const,
            margin: [0, 4, 0, 0] as [number, number, number, number],
          },
        ],
      },
      { text: opp.description, style: 'body', margin: [0, 0, 0, 8] as [number, number, number, number] },
      {
        columns: [
          { text: `Market: ${opp.scoring.marketAttractiveness}/10`, style: 'bodySmall' },
          { text: `Capability: ${opp.scoring.capabilityFit}/10`, style: 'bodySmall' },
          { text: `Advantage: ${opp.scoring.competitiveAdvantage}/10`, style: 'bodySmall' },
          { text: `Score: ${opp.scoring.overallScore}`, style: 'bodySmall', bold: true },
        ],
        margin: [0, 0, 0, 8] as [number, number, number, number],
      },
      ...(opp.ptw ? [
        { text: 'Playing to Win Cascade', style: 'label' as const, margin: [0, 0, 0, 4] as [number, number, number, number] },
        { text: `Where to Play: ${opp.ptw.whereToPlay}`, style: 'bodySmall' as const, margin: [0, 0, 0, 2] as [number, number, number, number] },
        { text: `How to Win: ${opp.ptw.howToWin}`, style: 'bodySmall' as const, margin: [0, 0, 0, 6] as [number, number, number, number] },
      ] as Content[] : []),
      ...(evidenceItems.length > 0 ? [
        { text: 'Evidence', style: 'label' as const, margin: [0, 0, 0, 4] as [number, number, number, number] } as Content,
        ...evidenceItems,
      ] : []),
    ],
    margin: [0, 0, 0, 16] as [number, number, number, number],
  };
}

function buildTensionCard(tension: StrategicTension): Content {
  const impactColor = tension.impact === 'blocking' ? C.red500
    : tension.impact === 'significant' ? C.amber600 : C.slate500;

  return {
    stack: [
      {
        columns: [
          { text: tension.description, style: 'h3', width: '*' },
          {
            text: tension.impact.toUpperCase(),
            fontSize: 7,
            bold: true,
            color: impactColor,
            alignment: 'right' as const,
            margin: [0, 2, 0, 0] as [number, number, number, number],
          },
        ],
      },
      ...(tension.resolutionOptions || []).map((opt) => ({
        text: [
          { text: opt.recommended ? '★ ' : '• ', color: opt.recommended ? C.gold : C.slate400 },
          { text: opt.option, style: 'bodySmall' as const },
          { text: ` — ${opt.tradeOff}`, fontSize: 8, color: C.slate400, italics: true },
        ],
        margin: [0, 0, 0, 3] as [number, number, number, number],
      }) as Content),
    ],
    margin: [0, 0, 0, 14] as [number, number, number, number],
  };
}

// =============================================================================
// PDF Generation
// =============================================================================

async function generatePdf(input: {
  synthesis: SynthesisResult;
  client: Client | null;
  generatedAt: string;
}): Promise<Buffer> {
  const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique',
    },
  };

  const printer = new PdfPrinter(fonts);
  const docDefinition = buildPdfDefinition(input.synthesis, input.client, input.generatedAt);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', (err: Error) => reject(err));
    pdfDoc.end();
  });
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
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Strategic-Synthesis-${sanitizedCompanyName}-${dateStr}.pdf`;

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
