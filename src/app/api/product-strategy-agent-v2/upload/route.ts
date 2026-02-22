import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { trackEvent } from '@/lib/analytics/posthog-server';
import { extractTextFromFile, extractTextFromUrl } from '@/lib/document-extraction';

// Route segment config for file uploads
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds max

// Initialize Supabase Admin Client
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(url, key);
}

// POST /api/product-strategy-agent-v2/upload
// Handles file uploads and URL imports for Discovery phase
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use raw client to avoid type issues
    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const contentType = req.headers.get('content-type') || '';

    // Handle URL import
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { conversation_id, url } = body;

      if (!conversation_id || !url) {
        return NextResponse.json(
          { error: 'conversation_id and url are required' },
          { status: 400 }
        );
      }

      // Verify conversation belongs to user's org
      const { data: conversation, error: convError } = await rawSupabase
        .from('conversations')
        .select('id, clerk_org_id')
        .eq('id', conversation_id)
        .eq('clerk_org_id', orgId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Fetch and extract text content from the URL
      let extractedContext: Record<string, unknown> = {};
      const extraction = await extractTextFromUrl(url);
      if (extraction) {
        extractedContext = {
          text: extraction.text,
          source: url,
          generated_by: 'user_upload',
          ...(extraction.pageCount ? { page_count: extraction.pageCount } : {}),
        };
        console.log(`[upload] Extracted ${extraction.text.length} chars from URL: ${url}`);
      } else {
        extractedContext = {
          source: url,
          generated_by: 'user_upload',
          extraction_note: 'Content could not be fetched from this URL',
        };
        console.warn(`[upload] Could not extract content from URL: ${url}`);
      }

      // Create uploaded_materials record for URL
      const hostname = (() => { try { return new URL(url).hostname; } catch { return url; } })();
      const { data: material, error: materialError } = await rawSupabase
        .from('uploaded_materials')
        .insert({
          conversation_id,
          filename: hostname,
          file_type: 'url',
          file_url: url,
          file_size: extraction?.text.length || null,
          extracted_context: extractedContext,
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (materialError) {
        console.error('Error creating material record:', materialError);
        return NextResponse.json(
          { error: 'Failed to save URL reference' },
          { status: 500 }
        );
      }

      trackEvent('psa_url_imported', userId, { org_id: orgId, conversation_id, url });
      return NextResponse.json(material);
    }

    // Handle file upload
    if (contentType.includes('multipart/form-data')) {
      let formData;
      try {
        formData = await req.formData();
      } catch (formError) {
        console.error('FormData parsing error:', formError);
        return NextResponse.json(
          { error: 'Failed to parse form data. Please try again with a smaller file.' },
          { status: 400 }
        );
      }

      const file = formData.get('file') as File;
      const conversation_id = formData.get('conversation_id') as string;

      if (!file || !conversation_id) {
        return NextResponse.json(
          { error: 'file and conversation_id are required' },
          { status: 400 }
        );
      }

      // Verify conversation belongs to user's org
      const { data: conversation, error: convError } = await rawSupabase
        .from('conversations')
        .select('id, clerk_org_id')
        .eq('id', conversation_id)
        .eq('clerk_org_id', orgId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Validate file type
      const allowedTypes = [
        // Documents
        'application/pdf',                                                              // .pdf
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',      // .docx
        'application/msword',                                                           // .doc
        'text/plain',                                                                   // .txt
        'text/markdown',                                                                // .md
        'application/rtf',                                                              // .rtf
        'text/rtf',                                                                     // .rtf (alternative)
        // Spreadsheets
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',            // .xlsx
        'application/vnd.ms-excel',                                                     // .xls
        'text/csv',                                                                     // .csv
        // Presentations
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',   // .pptx
        'application/vnd.ms-powerpoint',                                               // .ppt
        // Images
        'image/png',                                                                    // .png
        'image/jpeg',                                                                   // .jpg, .jpeg
      ];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Supported: PDF, Word, Excel, PowerPoint, TXT, CSV, Markdown, RTF, PNG, JPG.' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${conversation_id}/${Date.now()}.${fileExt}`;

      // Read file buffer and extract text content
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      let extractedContext: Record<string, unknown> = {};

      const extraction = await extractTextFromFile(fileBuffer, fileExt || '', file.name);
      if (extraction) {
        extractedContext = {
          text: extraction.text,
          source: file.name,
          generated_by: 'user_upload',
          ...(extraction.pageCount ? { page_count: extraction.pageCount } : {}),
        };
        console.log(`[upload] Extracted ${extraction.text.length} chars from ${file.name}`);
      } else {
        // Images or unsupported formats — store metadata only
        extractedContext = {
          source: file.name,
          generated_by: 'user_upload',
          extraction_note: 'Text extraction not available for this file type',
        };
        console.log(`[upload] No text extraction for ${file.name} (${fileExt})`);
      }

      // Placeholder URL for MVP (Supabase Storage upload can be enabled later)
      const urlData = { publicUrl: `/uploads/${fileName}` };

      // Create uploaded_materials record with extracted content
      const { data: material, error: materialError } = await rawSupabase
        .from('uploaded_materials')
        .insert({
          conversation_id,
          filename: file.name,
          file_type: fileExt || 'unknown',
          file_url: urlData.publicUrl,
          file_size: file.size,
          extracted_context: extractedContext,
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (materialError) {
        console.error('Error creating material record:', materialError);
        return NextResponse.json(
          { error: 'Failed to save file reference' },
          { status: 500 }
        );
      }

      trackEvent('psa_file_uploaded', userId, {
        org_id: orgId,
        conversation_id,
        file_name: file.name,
        file_type: fileExt,
        file_size: file.size,
        extracted_chars: extraction?.text.length || 0,
      });
      return NextResponse.json(material);
    }

    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
