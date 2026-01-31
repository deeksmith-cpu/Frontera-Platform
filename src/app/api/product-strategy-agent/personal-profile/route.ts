import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import type { PersonalProfileData, ProfilingFrameworkState } from '@/types/database';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

/**
 * GET /api/product-strategy-agent/personal-profile
 * Returns profile status and data for the current user.
 */
export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Find the user's profiling conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, framework_state')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'profiling')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!conversation) {
    return Response.json({
      status: 'not_started',
      conversationId: null,
      profile: null,
    });
  }

  const frameworkState = conversation.framework_state as unknown as ProfilingFrameworkState | null;

  return Response.json({
    status: frameworkState?.status || 'not_started',
    conversationId: conversation.id,
    profile: frameworkState?.profileData || null,
  });
}

/**
 * PATCH /api/product-strategy-agent/personal-profile
 * Save extracted profile data to the profiling conversation's framework_state.
 */
export async function PATCH(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { conversation_id, profileData } = body as {
    conversation_id: string;
    profileData: PersonalProfileData;
  };

  if (!conversation_id || !profileData) {
    return Response.json({ error: 'conversation_id and profileData required' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch current conversation
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('framework_state')
    .eq('id', conversation_id)
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'profiling')
    .single();

  if (fetchError || !conversation) {
    return Response.json({ error: 'Profiling conversation not found' }, { status: 404 });
  }

  const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};

  const updatedState: ProfilingFrameworkState = {
    status: 'completed',
    currentDimension: 5,
    dimensionsCompleted: ['role', 'objectives', 'leadershipStyle', 'experience', 'workingStyle'],
    profileData,
    completedAt: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from('conversations')
    .update({
      framework_state: { ...frameworkState, ...updatedState },
    })
    .eq('id', conversation_id)
    .eq('clerk_user_id', userId);

  if (updateError) {
    return Response.json({ error: 'Failed to save profile' }, { status: 500 });
  }

  return Response.json({ success: true, profile: profileData });
}
