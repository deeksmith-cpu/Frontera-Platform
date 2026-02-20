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
 * GET /api/product-strategy-agent-v2/persona
 * Get the current persona for the organization.
 * If none is set, auto-populate from the user's profiling recommendation.
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
      if (error.message.includes('coaching_preferences')) {
        return NextResponse.json({ persona: null });
      }
      console.error('Error fetching persona:', error);
      return NextResponse.json({ error: 'Failed to fetch persona' }, { status: 500 });
    }

    const coachingPreferences = client?.coaching_preferences as { persona?: PersonaId } | null;
    const existingPersona = coachingPreferences?.persona || null;

    // If a persona is already set, return it
    if (existingPersona) {
      return NextResponse.json({ persona: existingPersona });
    }

    // No persona set — check if the user's profiling has a recommendation
    const { data: profConv } = await supabase
      .from('conversations')
      .select('framework_state')
      .eq('clerk_user_id', userId)
      .eq('clerk_org_id', orgId)
      .eq('agent_type', 'profiling')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (profConv) {
      const fs = profConv.framework_state as Record<string, unknown> | null;
      const profileData = fs?.profileData as Record<string, unknown> | null;
      const coachingApproach = profileData?.coachingApproach as { recommendedPersona?: string } | null;
      const recommended = coachingApproach?.recommendedPersona as PersonaId | undefined;

      if (recommended && VALID_PERSONAS.includes(recommended)) {
        // Auto-set the recommended persona so it persists
        await supabase
          .from('clients')
          .update({
            coaching_preferences: {
              persona: recommended,
              selected_at: new Date().toISOString(),
              auto_recommended: true,
            },
          })
          .eq('clerk_org_id', orgId);

        return NextResponse.json({ persona: recommended });
      }
    }

    return NextResponse.json({ persona: null });
  } catch (error) {
    console.error('Error fetching persona:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/product-strategy-agent-v2/persona
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
