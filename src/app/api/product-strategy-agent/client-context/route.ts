import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

const ALLOWED_FIELDS = [
  'company_name',
  'industry',
  'company_size',
  'strategic_focus',
  'pain_points',
  'target_outcomes',
] as const;

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('clerk_org_id', orgId)
    .single();

  if (error || !data) {
    return Response.json({ error: 'Client not found' }, { status: 404 });
  }

  return Response.json(data);
}

export async function PATCH(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Only allow updating specific fields
  const updates: Record<string, string> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // Validate company_name is non-empty if provided
  if ('company_name' in updates && !updates.company_name?.trim()) {
    return Response.json({ error: 'Company name cannot be empty' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('clerk_org_id', orgId)
    .select()
    .single();

  if (error) {
    return Response.json({ error: 'Failed to update client context' }, { status: 500 });
  }

  return Response.json(data);
}
