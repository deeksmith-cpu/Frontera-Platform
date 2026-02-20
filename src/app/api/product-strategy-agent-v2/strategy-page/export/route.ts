import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';

const C = {
  navy: '#1a1f3a',
  gold: '#fbbf24',
  cyan200: '#a5f3fc',
  emerald50: '#ecfdf5',
  emerald600: '#059669',
  indigo50: '#eef2ff',
  indigo600: '#4f46e5',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
  white: '#ffffff',
};

const M = 50;
const CONTENT_W = 595.28 - M * 2;

function getRawSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversation_id } = body;

  if (!conversation_id) {
    return NextResponse.json({ error: 'conversation_id required' }, { status: 400 });
  }

  const supabase = getRawSupabase();

  // Verify conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, title, clerk_org_id')
    .eq('id', conversation_id)
    .eq('clerk_org_id', orgId)
    .single();

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Load synthesis
  const { data: synthesis } = await supabase
    .from('synthesis_outputs')
    .select('*')
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!synthesis) {
    return NextResponse.json({ error: 'No synthesis found' }, { status: 404 });
  }

  type Opp = {
    title: string;
    scoring?: { overallScore?: number };
    ptw?: {
      winningAspiration?: string;
      whereToPlay?: string;
      howToWin?: string;
      capabilitiesRequired?: string[];
      managementSystems?: string[];
    };
  };

  const opportunities = ((synthesis.opportunities as Opp[]) || [])
    .sort((a, b) => (b.scoring?.overallScore || 0) - (a.scoring?.overallScore || 0))
    .slice(0, 5);

  const aspirations = [...new Set(opportunities.map((o) => o.ptw?.winningAspiration).filter(Boolean) as string[])];
  const whereToPlay = [...new Set(opportunities.map((o) => o.ptw?.whereToPlay).filter(Boolean) as string[])];
  const howToWin = [...new Set(opportunities.map((o) => o.ptw?.howToWin).filter(Boolean) as string[])];
  const capabilities = [...new Set(opportunities.flatMap((o) => o.ptw?.capabilitiesRequired || []).filter(Boolean))];
  const managementSystems = [...new Set(opportunities.flatMap((o) => o.ptw?.managementSystems || []).filter(Boolean))];

  // Generate PDF
  const doc = new PDFDocument({ size: 'A4', margins: { top: M, bottom: M, left: M, right: M }, bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));

  let y = M;

  // Title bar
  doc.roundedRect(M, y, CONTENT_W, 50, 6).fill(C.navy);
  doc.fontSize(20).fillColor(C.white).font('Helvetica-Bold');
  doc.text('Strategy on a Page', M + 16, y + 10, { width: CONTENT_W - 32 });
  doc.fontSize(9).fillColor(C.gold).font('Helvetica');
  doc.text('Playing to Win Framework', M + 16, y + 33, { width: CONTENT_W - 32 });
  y += 66;

  // Helper for section
  const drawSection = (title: string, items: string[], bgColor: string, titleColor: string, bulletColor: string) => {
    const itemHeight = items.length > 0 ? items.length * 18 + 10 : 28;
    const sectionHeight = 30 + itemHeight;

    if (y + sectionHeight > 780) {
      doc.addPage();
      y = M;
    }

    doc.roundedRect(M, y, CONTENT_W, sectionHeight, 6).fill(bgColor);

    doc.fontSize(9).fillColor(titleColor).font('Helvetica-Bold');
    doc.text(title.toUpperCase(), M + 14, y + 10, { width: CONTENT_W - 28 });

    if (items.length > 0) {
      let itemY = y + 28;
      doc.fontSize(10).fillColor(C.slate700).font('Helvetica');
      items.forEach((item) => {
        doc.circle(M + 20, itemY + 5, 2.5).fill(bulletColor);
        doc.fillColor(C.slate700);
        doc.text(item, M + 30, itemY, { width: CONTENT_W - 44 });
        itemY = doc.y + 4;
      });
    } else {
      doc.fontSize(10).fillColor(C.slate500).font('Helvetica');
      doc.text('No data available', M + 14, y + 28, { width: CONTENT_W - 28 });
    }

    y += sectionHeight + 10;
  };

  // Winning Aspiration
  drawSection('Winning Aspiration', aspirations, '#fef9c3', '#92400e', C.gold);

  // Where to Play
  drawSection('Where to Play', whereToPlay, C.indigo50, C.indigo600, C.indigo600);

  // How to Win
  drawSection('How to Win', howToWin, C.emerald50, C.emerald600, C.emerald600);

  // Key Capabilities
  drawSection('Key Capabilities Required', capabilities.slice(0, 8), '#ecfeff', '#0e7490', '#0891b2');

  // Management Systems
  drawSection('Management Systems', managementSystems.slice(0, 6), C.slate100, C.slate600, C.slate500);

  // Footer
  if (y + 40 > 780) {
    doc.addPage();
    y = M;
  }
  doc.fontSize(8).fillColor(C.slate500).font('Helvetica');
  doc.text(`Generated by Frontera · ${new Date().toLocaleDateString()}`, M, y + 10, { width: CONTENT_W, align: 'center' });

  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const uint8Array = new Uint8Array(pdfBuffer);
  return new NextResponse(uint8Array, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="strategy-on-a-page-${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}
