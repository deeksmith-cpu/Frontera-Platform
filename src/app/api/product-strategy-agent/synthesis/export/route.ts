import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import type { Database, Client } from '@/types/database';
import type { SynthesisResult, StrategicOpportunity, StrategicTension } from '@/types/synthesis';

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
// Generate and download PDF export of synthesis
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

    // Verify conversation belongs to user's org
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch synthesis data
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

    // Fetch client context
    const { data: clientData } = await supabase
      .from('clients')
      .select('*')
      .eq('clerk_org_id', orgId)
      .single();

    // Transform database row to SynthesisResult
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

    // Validate we have opportunities to export
    if (synthesis.opportunities.length === 0) {
      return NextResponse.json(
        { error: 'Synthesis has no opportunities. Please regenerate synthesis.' },
        { status: 400 }
      );
    }

    // Generate PDF - with detailed logging for debugging
    console.log('Generating PDF for synthesis:', synthesis.id);
    console.log('Opportunities count:', synthesis.opportunities.length);
    console.log('Tensions count:', synthesis.tensions.length);
    console.log('Recommendations count:', synthesis.recommendations?.length || 0);

    // Validate and sanitize data - ensure all values are proper strings
    const sanitizedSynthesis: SynthesisResult = {
      ...synthesis,
      executiveSummary: String(synthesis.executiveSummary || ''),
      recommendations: (synthesis.recommendations || []).map(r =>
        typeof r === 'string' ? r : (typeof r === 'object' ? JSON.stringify(r) : String(r))
      ),
      opportunities: synthesis.opportunities.map(opp => ({
        ...opp,
        id: String(opp.id || ''),
        title: String(opp.title || ''),
        description: String(opp.description || ''),
        opportunityType: String(opp.opportunityType || 'where_to_play') as 'where_to_play' | 'how_to_win' | 'capability_gap',
        quadrant: String(opp.quadrant || 'explore') as 'invest' | 'explore' | 'harvest' | 'divest',
        confidence: String(opp.confidence || 'medium') as 'low' | 'medium' | 'high',
        scoring: {
          marketAttractiveness: Number(opp.scoring?.marketAttractiveness) || 5,
          capabilityFit: Number(opp.scoring?.capabilityFit) || 5,
          competitiveAdvantage: Number(opp.scoring?.competitiveAdvantage) || 5,
          overallScore: Number(opp.scoring?.overallScore) || 50,
        },
        ptw: {
          winningAspiration: String(opp.ptw?.winningAspiration || ''),
          whereToPlay: String(opp.ptw?.whereToPlay || ''),
          howToWin: String(opp.ptw?.howToWin || ''),
          capabilitiesRequired: (opp.ptw?.capabilitiesRequired || []).map(c => String(c)),
          managementSystems: (opp.ptw?.managementSystems || []).map(m => String(m)),
        },
        evidence: (opp.evidence || []).map(ev => ({
          territory: String(ev.territory || 'company') as 'company' | 'customer' | 'competitor',
          researchArea: String(ev.researchArea || ''),
          question: String(ev.question || ''),
          quote: String(ev.quote || ''),
          insightId: String(ev.insightId || ''),
        })),
        assumptions: (opp.assumptions || []).map(a => ({
          category: String(a.category || 'customer') as 'customer' | 'company' | 'competitor' | 'economics',
          assumption: String(a.assumption || ''),
          testMethod: String(a.testMethod || ''),
          riskIfFalse: String(a.riskIfFalse || ''),
        })),
      })),
      tensions: synthesis.tensions.map(t => ({
        ...t,
        id: String(t.id || ''),
        description: String(t.description || ''),
        impact: String(t.impact || 'significant') as 'blocking' | 'significant' | 'minor',
        alignedEvidence: (t.alignedEvidence || []).map(e => ({
          insight: String(e.insight || ''),
          source: String(e.source || ''),
        })),
        conflictingEvidence: (t.conflictingEvidence || []).map(e => ({
          insight: String(e.insight || ''),
          source: String(e.source || ''),
        })),
        resolutionOptions: (t.resolutionOptions || []).map(r => ({
          option: String(r.option || ''),
          tradeOff: String(r.tradeOff || ''),
          recommended: Boolean(r.recommended),
        })),
      })),
    };

    // Cast client data for type compatibility
    const typedClient = clientData as unknown as Client | null;

    // Dynamic import to avoid module loading issues
    const { renderToBuffer } = await import('@react-pdf/renderer');
    const { SynthesisReportDocument } = await import('@/lib/pdf/synthesis-report');

    // Create the document element - using type assertion for react-pdf compatibility
    const documentElement = React.createElement(SynthesisReportDocument, {
      synthesis: sanitizedSynthesis,
      client: typedClient,
      generatedAt: new Date(),
    });

    const pdfBuffer = await renderToBuffer(
      documentElement as unknown as React.ReactElement
    );

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const pdfBytes = new Uint8Array(pdfBuffer);

    // Generate filename
    const companyName = typedClient?.company_name || 'Strategy';
    const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '-');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Strategic-Synthesis-${sanitizedCompanyName}-${dateStr}.pdf`;

    console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');

    // Return PDF with appropriate headers
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
