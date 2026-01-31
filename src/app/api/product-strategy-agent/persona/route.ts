import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import type { PersonaId } from '@/lib/agents/strategy-coach/personas';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase configuration');
  }
  return createClient(url, key);
}

const VALID_PERSONAS: (PersonaId | null)[] = ['marcus', 'elena', 'richard', 'growth-architect', 'product-purist', 'scale-navigator', null];

/**
 * GET /api/product-strategy-agent/persona
 * Get the current persona for the organization
 */
export async function GET() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: client, error } = await supabase
      .from('clients')
      .select('coaching_preferences')
      .eq('clerk_org_id', orgId)
      .single();

    if (error) {
      // If no coaching_preferences column exists yet, return null persona
      if (error.message.includes('coaching_preferences')) {
        return NextResponse.json({ persona: null });
      }
      console.error('Error fetching persona:', error);
      return NextResponse.json({ error: 'Failed to fetch persona' }, { status: 500 });
    }

    const coachingPreferences = client?.coaching_preferences as { persona?: PersonaId } | null;

    return NextResponse.json({
      persona: coachingPreferences?.persona || null,
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/product-strategy-agent/persona
 * Update the coaching persona for the organization
 */
export async function PATCH(req: NextRequest) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { persona } = body;

    // Validate persona
    if (!VALID_PERSONAS.includes(persona)) {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Update client coaching preferences
    const { error } = await supabase
      .from('clients')
      .update({
        coaching_preferences: {
          persona: persona,
          selected_at: new Date().toISOString(),
          auto_recommended: false,
        },
      })
      .eq('clerk_org_id', orgId);

    if (error) {
      console.error('Error updating persona:', error);
      return NextResponse.json({ error: 'Failed to update persona' }, { status: 500 });
    }

    return NextResponse.json({ success: true, persona });
  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
