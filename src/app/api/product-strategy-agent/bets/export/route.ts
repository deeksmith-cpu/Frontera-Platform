import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import ReactPDF from '@react-pdf/renderer';
import React from 'react';
import type { BetsResponse } from '@/types/bets';

// Supabase client with service role
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * POST /api/product-strategy-agent/bets/export
 * Generate and download Strategic Bets Portfolio PDF
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { conversation_id } = body;

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch conversation to get company name
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*, client:clients(*)')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Fetch bets data
    const betsResponse = await fetch(
      `${req.nextUrl.origin}/api/product-strategy-agent/bets?conversation_id=${conversation_id}`,
      {
        headers: {
          Cookie: req.headers.get('cookie') || '',
        },
      }
    );

    if (!betsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bets data' },
        { status: 500 }
      );
    }

    const betsData: BetsResponse = await betsResponse.json();

    // Dynamically import PDF components to avoid bundling conflicts
    const { BetsReport } = await import('@/lib/pdf/bets-report');

    // Generate PDF
    const companyName = (conversation.client as { company_name?: string })?.company_name;

    const pdfDoc = React.createElement(BetsReport, {
      betsData,
      companyName,
    }) as React.ReactElement;

    const pdfBuffer = await ReactPDF.renderToBuffer(pdfDoc);

    // Return PDF as download
    const filename = `strategic-bets-${companyName?.toLowerCase().replace(/\s+/g, '-') || 'portfolio'}-${new Date().toISOString().split('T')[0]}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': uint8Array.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating bets PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
