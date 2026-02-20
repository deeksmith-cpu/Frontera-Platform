import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent-v2/share/[token]
 * Public endpoint - serves artefact content by share_token. No auth required.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return Response.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: artefact, error } = await supabase
    .from('strategic_artefacts')
    .select('id, artefact_type, title, content, audience, created_at, updated_at')
    .eq('share_token', token)
    .single();

  if (error || !artefact) {
    return Response.json({ error: 'Artefact not found or link expired' }, { status: 404 });
  }

  return Response.json({ artefact });
}
