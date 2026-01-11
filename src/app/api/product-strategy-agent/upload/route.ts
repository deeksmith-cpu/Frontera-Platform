import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

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

    const supabase = getSupabaseAdmin();
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
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('id, clerk_org_id')
        .eq('id', conversation_id)
        .eq('clerk_org_id', orgId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Create uploaded_materials record for URL
      const { data: material, error: materialError } = await supabase
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
      await supabase
        .from('uploaded_materials')
        .update({
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', material.id);

      return NextResponse.json(material);
    }

    // Handle file upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const conversation_id = formData.get('conversation_id') as string;

      if (!file || !conversation_id) {
        return NextResponse.json(
          { error: 'file and conversation_id are required' },
          { status: 400 }
        );
      }

      // Verify conversation belongs to user's org
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('id, clerk_org_id')
        .eq('id', conversation_id)
        .eq('clerk_org_id', orgId)
        .single();

      if (convError || !conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF, DOCX, and TXT are allowed.' },
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

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${conversation_id}/${Date.now()}.${fileExt}`;
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

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('strategy-materials')
        .getPublicUrl(fileName);

      // Create uploaded_materials record
      const { data: material, error: materialError } = await supabase
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
      await supabase
        .from('uploaded_materials')
        .update({
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', material.id);

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
