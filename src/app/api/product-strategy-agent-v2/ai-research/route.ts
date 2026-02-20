import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { trackEvent } from '@/lib/analytics/posthog-server';

/**
 * AI Research Assistant API Endpoint
 *
 * POST /api/product-strategy-agent-v2/ai-research
 *
 * Uses Claude AI to search for and discover supporting documents from:
 * - Specific websites provided by user
 * - Relevant news articles
 * - Market reports and reviews
 *
 * Request Body:
 * {
 *   conversation_id: string;
 *   websites?: string[];  // Optional specific websites to search
 *   topics: string;       // Required keywords/topics to search for
 * }
 *
 * Response:
 * UploadedMaterial[] - Array of discovered and processed documents
 */

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(url, key);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const { conversation_id, websites = [], topics } = await req.json();

    if (!conversation_id) {
      return Response.json({ error: 'conversation_id is required' }, { status: 400 });
    }

    if (!topics || !topics.trim()) {
      return Response.json({ error: 'topics is required' }, { status: 400 });
    }

    // 3. Verify conversation ownership
    const supabase = getSupabaseAdmin();
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .eq('clerk_org_id', orgId)
      .single();

    if (convError || !conversation) {
      return Response.json({ error: 'Conversation not found or unauthorized' }, { status: 404 });
    }

    // 4. Use Claude AI to research and generate synthetic documents
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const researchPrompt = buildResearchPrompt(topics, websites);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: researchPrompt,
        },
      ],
    });

    // 5. Parse AI response to extract discovered documents
    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    const discoveredDocs = parseResearchResponse(responseText);

    // 6. Store discovered documents as uploaded_materials
    // Note: Using raw Supabase client to avoid type mismatch with generated types
    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const uploadedMaterials = await Promise.all(
      discoveredDocs.map(async (doc) => {
        const { data, error } = await rawSupabase
          .from('uploaded_materials')
          .insert({
            conversation_id,
            filename: doc.filename,
            file_type: 'txt',
            file_url: doc.source_url || null,
            file_size: doc.content.length,
            extracted_context: {
              text: doc.content,
              source: doc.source_url || 'AI-generated research',
              generated_by: 'ai_research_assistant',
              topics: topics,
            },
            processing_status: 'completed',
            processed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting material:', error);
          throw error;
        }

        return data;
      })
    );

    trackEvent('psa_ai_research_completed', userId, {
      org_id: orgId,
      conversation_id,
      topics,
      websites_count: websites.length,
      documents_generated: uploadedMaterials.length,
    });
    return Response.json(uploadedMaterials);
  } catch (error) {
    console.error('AI Research error:', error);
    return Response.json(
      { error: 'Internal server error during AI research' },
      { status: 500 }
    );
  }
}

function buildResearchPrompt(topics: string, websites: string[]): string {
  const websiteSection =
    websites.length > 0
      ? `\n\nFocus your research on these specific websites:\n${websites.map((w) => `- ${w}`).join('\n')}`
      : '\n\nSearch broadly across relevant public sources.';

  return `You are an AI Research Assistant helping a product strategy consultant gather strategic materials.

**Research Topics:**
${topics}
${websiteSection}

**Your Task:**
Based on your training data knowledge, generate 3-5 synthetic strategic documents that would be relevant to these topics. These should be realistic, informative summaries that a consultant might find from web research.

For each document, provide:
1. A descriptive filename (e.g., "saas-market-trends-2024.txt")
2. The source (real or plausible website/publication)
3. 200-400 words of strategic content covering key insights, trends, data points, or frameworks

**Format your response as:**

DOCUMENT 1
Filename: [filename]
Source: [source URL or publication name]
Content:
[document content here]

---

DOCUMENT 2
[repeat format]

---

Generate practical, actionable strategic insights that would help inform product strategy decisions.`;
}

interface DiscoveredDocument {
  filename: string;
  content: string;
  source_url?: string;
}

function parseResearchResponse(responseText: string): DiscoveredDocument[] {
  const documents: DiscoveredDocument[] = [];

  // Split by document separator
  const docSections = responseText.split('---').filter((s) => s.trim());

  for (const section of docSections) {
    const lines = section.trim().split('\n');

    let filename = '';
    let source = '';
    let content = '';
    let inContent = false;

    for (const line of lines) {
      if (line.startsWith('Filename:')) {
        filename = line.replace('Filename:', '').trim();
      } else if (line.startsWith('Source:')) {
        source = line.replace('Source:', '').trim();
      } else if (line.startsWith('Content:')) {
        inContent = true;
      } else if (inContent) {
        content += line + '\n';
      }
    }

    if (filename && content) {
      documents.push({
        filename: filename.endsWith('.txt') ? filename : `${filename}.txt`,
        content: content.trim(),
        source_url: source.startsWith('http') ? source : undefined,
      });
    }
  }

  // Fallback: if parsing failed, create one document from entire response
  if (documents.length === 0 && responseText.trim()) {
    documents.push({
      filename: 'ai-research-findings.txt',
      content: responseText.trim(),
      source_url: undefined,
    });
  }

  return documents;
}
