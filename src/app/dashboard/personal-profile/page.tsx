import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { PersonalProfilePage } from './PersonalProfilePage';
import { initializeProfilingState } from '@/lib/agents/strategy-coach/profiling-state';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

export default async function PersonalProfileRoute() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) redirect('/sign-in');

  const user = await currentUser();
  const supabase = getSupabaseAdmin();

  // Find or create profiling conversation
  let { data: conversation } = await supabase
    .from('conversations')
    .select('id, framework_state')
    .eq('clerk_user_id', userId)
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'profiling')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!conversation) {
    // Create a new profiling conversation
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        clerk_org_id: orgId,
        clerk_user_id: userId,
        title: 'Personal Profile',
        agent_type: 'profiling',
        framework_state: initializeProfilingState(),
        status: 'active',
        last_message_at: new Date().toISOString(),
      })
      .select('id, framework_state')
      .single();

    if (error || !newConv) {
      console.error('Profiling conversation insert error:', error);
      throw new Error(`Failed to create profiling conversation: ${error?.message || 'unknown'}`);
    }
    conversation = newConv;
  }

  const frameworkState = conversation.framework_state as Record<string, unknown> | null;
  const status = (frameworkState?.status as string) || 'in_progress';
  const profileData = frameworkState?.profileData || null;

  return (
    <PersonalProfilePage
      conversationId={conversation.id}
      status={status}
      profileData={profileData}
      userName={user?.firstName || undefined}
    />
  );
}
