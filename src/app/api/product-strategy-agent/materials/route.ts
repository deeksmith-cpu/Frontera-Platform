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

// GET /api/product-strategy-agent/materials?conversation_id=xxx
// Fetches uploaded materials for a conversation
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversation_id = searchParams.get('conversation_id');

    if (!conversation_id) {
      return NextResponse.json(
        { error: 'conversation_id is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

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

    // Fetch uploaded materials
    const { data: materials, error: materialsError } = await supabase
      .from('uploaded_materials')
      .select('*')
      .eq('conversation_id', conversation_id)
      .order('uploaded_at', { ascending: false });

    if (materialsError) {
      console.error('Error fetching materials:', materialsError);
      return NextResponse.json(
        { error: 'Failed to fetch materials' },
        { status: 500 }
      );
    }

    return NextResponse.json(materials || []);
  } catch (error) {
    console.error('Materials fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/product-strategy-agent/materials?id=xxx
// Deletes an uploaded material
export async function DELETE(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get('id');

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material id is required' },
        { status: 400 }
      );
    }

    // Use raw client to avoid type issues with joined queries
    const rawSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, get the material
    const { data: material, error: fetchError } = await rawSupabase
      .from('uploaded_materials')
      .select('id, conversation_id')
      .eq('id', materialId)
      .single();

    if (fetchError || !material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Verify the conversation belongs to user's org
    const { data: conversation, error: convError } = await rawSupabase
      .from('conversations')
      .select('clerk_org_id')
      .eq('id', (material as { conversation_id: string }).conversation_id)
      .single();

    if (convError || !conversation || (conversation as { clerk_org_id: string }).clerk_org_id !== orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the material
    const { error: deleteError } = await rawSupabase
      .from('uploaded_materials')
      .delete()
      .eq('id', materialId);

    if (deleteError) {
      console.error('Error deleting material:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete material' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Material delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
