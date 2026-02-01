import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { trackEvent } from '@/lib/analytics/posthog-server';

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

// POST /api/product-strategy-agent/upload
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

      // Create uploaded_materials record for URL
      const { data: material, error: materialError } = await rawSupabase
        .from('uploaded_materials')
        .insert({
          conversation_id,
          filename: new URL(url).hostname,
          file_type: 'url',
          file_url: url,
          file_size: null,
          extracted_context: {},
          processing_status: 'pending',
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

      // TODO: Trigger background job to fetch and process URL content
      // For now, mark as completed
      await rawSupabase
        .from('uploaded_materials')
        .update({
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', (material as { id: string }).id);

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

      // TODO: Upload to Supabase Storage (requires 'strategy-materials' bucket)
      // For MVP testing, we'll skip actual file upload and just store metadata
      const fileExt = file.name.split('.').pop();
      const fileName = `${conversation_id}/${Date.now()}.${fileExt}`;

      // Temporary: Skip storage upload for MVP testing
      // In production, uncomment the storage upload code below
      /*
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('strategy-materials')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload file to storage' },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from('strategy-materials')
        .getPublicUrl(fileName);
      */

      // Temporary placeholder URL for MVP testing
      const urlData = { publicUrl: `/uploads/${fileName}` };

      // Create uploaded_materials record
      const { data: material, error: materialError } = await rawSupabase
        .from('uploaded_materials')
        .insert({
          conversation_id,
          filename: file.name,
          file_type: fileExt || 'unknown',
          file_url: urlData.publicUrl,
          file_size: file.size,
          extracted_context: {},
          processing_status: 'pending',
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

      // TODO: Trigger background job to extract text and process content
      // For now, mark as completed
      await rawSupabase
        .from('uploaded_materials')
        .update({
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', (material as { id: string }).id);

      trackEvent('psa_file_uploaded', userId, {
        org_id: orgId,
        conversation_id,
        file_name: file.name,
        file_type: fileExt,
        file_size: file.size,
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
