import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  Header,
  Footer,
  TabStopType,
  TabStopPosition,
  Tab,
} from 'docx';
import { classifyNarrative } from '@/lib/utils/narrative-parser';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key);
}

// Brand colors (hex without #)
const NAVY = '1A1F3A';
const GOLD = 'FBBF24';
const SLATE_500 = '64748B';
const SLATE_600 = '475569';
const SLATE_700 = '334155';
const WHITE = 'FFFFFF';
const CYAN_600 = '0891B2';
const EMERALD_600 = '059669';
const AMBER_600 = 'D97706';
const PURPLE_600 = '9333EA';
const RED_600 = 'DC2626';
const SLATE_200 = 'E2E8F0';

// =============================================================================
// Document types (matching PDF export)
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

    if (!isNarrativeDoc(docContent)) {
      return NextResponse.json({ error: 'Word export is only available for narrative format documents' }, { status: 400 });
    }

    const docxBuffer = await generateNarrativeDocx(companyName, docContent);

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(-2);
    const filename = `${companyName} - Product Strategy - ${dd}-${mm}-${yy}.docx`;

    const uint8Array = new Uint8Array(docxBuffer);
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('POST /api/product-strategy-agent/bets/strategy-document/export-docx:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// Narrative paragraph rendering
// =============================================================================

function renderNarrativeParagraphs(narrative: string): Paragraph[] {
  const classified = classifyNarrative(narrative);
  const paragraphs: Paragraph[] = [];

  for (const para of classified) {
    switch (para.type) {
      case 'pull_quote':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: para.text, italics: true, color: SLATE_600, font: 'Calibri', size: 23 }),
            ],
            indent: { left: 720, right: 720 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 8 },
            },
            spacing: { before: 200, after: 200 },
          })
        );
        break;

      case 'subsection_heading':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: para.text, bold: true, color: NAVY, font: 'Calibri', size: 28 }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 360, after: 120 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: SLATE_200, space: 4 },
            },
          })
        );
        break;

      case 'numbered_item': {
        const children: TextRun[] = [
          new TextRun({ text: `${para.number}. `, bold: true, color: NAVY, font: 'Calibri', size: 23 }),
          new TextRun({ text: para.title, bold: true, color: NAVY, font: 'Calibri', size: 23 }),
        ];
        if (para.body) {
          children.push(
            new TextRun({ text: ': ', color: SLATE_700, font: 'Calibri', size: 23 }),
            new TextRun({ text: para.body, color: SLATE_700, font: 'Calibri', size: 23 }),
          );
        }
        paragraphs.push(
          new Paragraph({
            children,
            spacing: { before: 120, after: 120 },
            indent: { left: 360 },
          })
        );
        break;
      }

      case 'body':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: para.text, color: SLATE_700, font: 'Calibri', size: 23 }),
            ],
            spacing: { before: 120, after: 120 },
            indent: para.isFirst ? {} : { firstLine: 360 },
          })
        );
        break;
    }
  }

  return paragraphs;
}

// =============================================================================
// DOCX generation
// =============================================================================

async function generateNarrativeDocx(companyName: string, doc: NarrativeDocumentContent): Promise<Buffer> {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const defaultFooter = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: 'Frontera Product Strategy Coach', color: SLATE_500, font: 'Calibri', size: 16 }),
          new TextRun({ children: [new Tab()], font: 'Calibri' }),
          new TextRun({ text: 'CONFIDENTIAL', color: SLATE_500, font: 'Calibri', size: 16 }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: {
          top: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 4 },
        },
      }),
    ],
  });

  // Cover page section
  const coverChildren: Paragraph[] = [
    // Spacer
    new Paragraph({ spacing: { before: 1200 } }),
    // Label
    new Paragraph({
      children: [
        new TextRun({ text: 'PRODUCT STRATEGY 6-PAGER', bold: true, color: GOLD, font: 'Calibri', size: 22 }),
      ],
      spacing: { after: 200 },
    }),
    // Title
    new Paragraph({
      children: [
        new TextRun({ text: 'Product Strategy', bold: true, color: NAVY, font: 'Calibri', size: 56 }),
      ],
      spacing: { after: 120 },
    }),
    // Company name
    new Paragraph({
      children: [
        new TextRun({ text: companyName, color: CYAN_600, font: 'Calibri', size: 36 }),
      ],
      spacing: { after: 120 },
    }),
    // Date
    new Paragraph({
      children: [
        new TextRun({ text: dateStr, color: SLATE_500, font: 'Calibri', size: 22 }),
      ],
      spacing: { after: 400 },
    }),
    // Bet count
    new Paragraph({
      children: [
        new TextRun({ text: `${doc.appendix.selectedBets.length} `, bold: true, color: GOLD, font: 'Calibri', size: 44 }),
        new TextRun({ text: 'Strategic Bets', color: SLATE_500, font: 'Calibri', size: 22 }),
      ],
      spacing: { after: 600 },
    }),
    // Table of contents label
    new Paragraph({
      children: [
        new TextRun({ text: 'TABLE OF CONTENTS', bold: true, color: NAVY, font: 'Calibri', size: 24 }),
      ],
      spacing: { after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: SLATE_200, space: 4 },
      },
    }),
  ];

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
    coverChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${label}    `, color: SLATE_500, font: 'Calibri', size: 21 }),
          new TextRun({ text: item, color: SLATE_700, font: 'Calibri', size: 21 }),
        ],
        spacing: { before: 60, after: 60 },
      })
    );
  });

  // Build narrative page sections
  const pages: { title: string; pageNum: number; narrative: string; secondaryTitle?: string; secondaryNarrative?: string }[] = [
    { title: 'Product Vision & Strategic Context', pageNum: 1, narrative: doc.productVision.narrative, secondaryTitle: 'State of the Business', secondaryNarrative: doc.productVision.stateOfBusiness },
    { title: 'Market Trends, Customer Problems & Opportunities', pageNum: 2, narrative: doc.marketInsights.narrative },
    { title: 'Where We Play & How We Win', pageNum: 3, narrative: doc.strategicChoices.narrative },
    { title: 'Product Strategy & Roadmap Themes', pageNum: 4, narrative: doc.roadmap.narrative },
    { title: 'Operating Model & Capability Build', pageNum: 5, narrative: doc.operatingModel.narrative },
    { title: 'Strategic Priorities & Execution', pageNum: 6, narrative: doc.executionPlan.narrative },
  ];

  // Build all content as a single section with page breaks
  const allChildren: (Paragraph | Table)[] = [...coverChildren];

  // Narrative pages
  for (const page of pages) {
    // Page break before each narrative page
    allChildren.push(
      new Paragraph({ children: [new TextRun({ children: [new PageBreak()] })] }),
      // Page number label
      new Paragraph({
        children: [
          new TextRun({ text: `PAGE ${page.pageNum}`, color: SLATE_500, font: 'Calibri', size: 18 }),
        ],
        spacing: { after: 80 },
      }),
      // Section title (H1)
      new Paragraph({
        children: [
          new TextRun({ text: page.title, bold: true, color: NAVY, font: 'Calibri', size: 36 }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD, space: 6 },
        },
      }),
      // Spacer
      new Paragraph({ spacing: { after: 120 } }),
      // Narrative content
      ...renderNarrativeParagraphs(page.narrative),
    );

    // Secondary section
    if (page.secondaryTitle && page.secondaryNarrative) {
      allChildren.push(
        new Paragraph({ spacing: { before: 360 } }),
        new Paragraph({
          children: [
            new TextRun({ text: page.secondaryTitle, bold: true, color: NAVY, font: 'Calibri', size: 28 }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 80 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: SLATE_200, space: 4 },
          },
        }),
        ...renderNarrativeParagraphs(page.secondaryNarrative),
      );
    }
  }

  // Appendix section
  const appendixChildren: (Paragraph | Table)[] = [
    new Paragraph({
      children: [
        new TextRun({ text: 'APPENDIX', color: SLATE_500, font: 'Calibri', size: 18 }),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Supporting Data', bold: true, color: NAVY, font: 'Calibri', size: 36 }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD, space: 6 },
      },
    }),
    new Paragraph({ spacing: { after: 200 } }),

    // Playing to Win Cascade
    new Paragraph({
      children: [
        new TextRun({ text: 'Playing to Win Cascade', bold: true, color: NAVY, font: 'Calibri', size: 28 }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 },
    }),

    // Winning Aspiration
    new Paragraph({
      children: [
        new TextRun({ text: 'WINNING ASPIRATION', bold: true, color: GOLD, font: 'Calibri', size: 18 }),
      ],
      shading: { type: ShadingType.SOLID, color: NAVY },
      spacing: { after: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: doc.appendix.ptwCascade.winningAspiration, color: WHITE, font: 'Calibri', size: 21 }),
      ],
      shading: { type: ShadingType.SOLID, color: NAVY },
      spacing: { after: 200 },
    }),

    // Where to Play
    new Paragraph({
      children: [
        new TextRun({ text: 'WHERE TO PLAY', bold: true, color: CYAN_600, font: 'Calibri', size: 18 }),
      ],
      spacing: { before: 200, after: 80 },
    }),
    ...doc.appendix.ptwCascade.whereToPlay.map(wtp =>
      new Paragraph({
        children: [new TextRun({ text: `• ${wtp}`, color: SLATE_700, font: 'Calibri', size: 21 })],
        indent: { left: 360 },
        spacing: { after: 60 },
      })
    ),

    // How to Win
    new Paragraph({
      children: [
        new TextRun({ text: 'HOW TO WIN', bold: true, color: EMERALD_600, font: 'Calibri', size: 18 }),
      ],
      spacing: { before: 200, after: 80 },
    }),
    ...doc.appendix.ptwCascade.howToWin.map(htw =>
      new Paragraph({
        children: [new TextRun({ text: `• ${htw}`, color: SLATE_700, font: 'Calibri', size: 21 })],
        indent: { left: 360 },
        spacing: { after: 60 },
      })
    ),

    // Portfolio Balance & DHM
    new Paragraph({ children: [new TextRun({ break: 1 })] }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Portfolio Balance & DHM Coverage', bold: true, color: NAVY, font: 'Calibri', size: 28 }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 200 },
    }),
  ];

  // Portfolio + DHM table
  const statsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: ['Offensive', 'Defensive', 'Capability', 'Delight', 'Hard to Copy', 'Margin+'].map(label =>
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: label.toUpperCase(), bold: true, color: SLATE_600, font: 'Calibri', size: 16 })],
              alignment: AlignmentType.CENTER,
            })],
            width: { size: 16.66, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.SOLID, color: 'F8FAFC' },
          })
        ),
      }),
      new TableRow({
        children: [
          doc.appendix.portfolioBalance.offensive,
          doc.appendix.portfolioBalance.defensive,
          doc.appendix.portfolioBalance.capability,
          doc.appendix.dhmCoverage.delight,
          doc.appendix.dhmCoverage.hardToCopy,
          doc.appendix.dhmCoverage.marginEnhancing,
        ].map(value =>
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: String(value), bold: true, color: NAVY, font: 'Calibri', size: 32 })],
              alignment: AlignmentType.CENTER,
            })],
            width: { size: 16.66, type: WidthType.PERCENTAGE },
          })
        ),
      }),
    ],
  });

  appendixChildren.push(statsTable);

  // Bet Details
  appendixChildren.push(
    new Paragraph({ children: [new TextRun({ break: 1 })] }),
    new Paragraph({
      children: [
        new TextRun({ text: `Strategic Bets (${doc.appendix.selectedBets.length})`, bold: true, color: NAVY, font: 'Calibri', size: 28 }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    }),
  );

  const typeColors: Record<string, string> = {
    offensive: AMBER_600,
    defensive: EMERALD_600,
    capability: PURPLE_600,
  };

  doc.appendix.selectedBets.forEach((bet, idx) => {
    const accentColor = typeColors[bet.thesisType] || AMBER_600;

    appendixChildren.push(
      // Bet title
      new Paragraph({
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, color: NAVY, font: 'Calibri', size: 24 }),
          new TextRun({ text: bet.thesisTitle, bold: true, color: NAVY, font: 'Calibri', size: 24 }),
          new TextRun({ text: `  (${bet.thesisType})`, color: accentColor, font: 'Calibri', size: 20 }),
          new TextRun({ text: `  Score: ${bet.scoring.overallScore}`, bold: true, color: GOLD, font: 'Calibri', size: 20 }),
        ],
        spacing: { before: 300, after: 120 },
        border: {
          top: { style: BorderStyle.SINGLE, size: 3, color: accentColor, space: 4 },
        },
      }),
    );

    const hypothesisParts: { label: string; value: string; color: string }[] = [
      { label: 'JOB', value: bet.hypothesis.job, color: CYAN_600 },
      { label: 'BELIEF', value: bet.hypothesis.belief, color: SLATE_600 },
      { label: 'BET', value: bet.hypothesis.bet, color: NAVY },
      { label: 'SUCCESS', value: bet.hypothesis.success, color: EMERALD_600 },
      { label: 'KILL', value: `${bet.hypothesis.kill.criteria} by ${bet.hypothesis.kill.date}`, color: RED_600 },
    ];

    hypothesisParts.forEach(part => {
      appendixChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${part.label}: `, bold: true, color: part.color, font: 'Calibri', size: 19 }),
            new TextRun({ text: part.value, color: SLATE_700, font: 'Calibri', size: 19 }),
          ],
          indent: { left: 360 },
          spacing: { after: 40 },
        })
      );
    });
  });

  // Appendix page break + children
  allChildren.push(
    new Paragraph({ children: [new TextRun({ children: [new PageBreak()] })] }),
    ...appendixChildren,
  );

  const document = new Document({
    creator: 'Frontera Product Strategy Coach',
    title: `Product Strategy - ${companyName}`,
    description: 'Product Strategy 6-Pager generated by Frontera',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 23, color: SLATE_700 },
        },
        heading1: {
          run: { font: 'Calibri', size: 36, bold: true, color: NAVY },
        },
        heading2: {
          run: { font: 'Calibri', size: 28, bold: true, color: NAVY },
        },
        heading3: {
          run: { font: 'Calibri', size: 28, bold: true, color: NAVY },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: companyName, bold: true, color: NAVY, font: 'Calibri', size: 18 }),
                new TextRun({ children: [new Tab()], font: 'Calibri' }),
                new TextRun({ text: 'Product Strategy', color: SLATE_500, font: 'Calibri', size: 18 }),
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: {
                bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 4 },
              },
            }),
          ],
        }),
      },
      footers: { default: defaultFooter },
      children: allChildren,
    }],
  });

  const buffer = await Packer.toBuffer(document);
  return Buffer.from(buffer);
}
