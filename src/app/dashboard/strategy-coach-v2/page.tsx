import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { StrategyCoachLayout } from '@/components/strategy-coach-v2/StrategyCoachLayout';
import type { Database } from '@/types/database';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient<Database>(url, key);
}

export default async function StrategyCoachV2Page() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  if (!orgId) {
    redirect('/dashboard');
  }

  const supabase = getSupabaseAdmin();

  // Fetch active strategy_coach conversations for this org
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'strategy_coach')
    .in('status', ['active', 'completed'])
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Failed to load strategy sessions. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <StrategyCoachLayout
        conversations={conversations || []}
        userId={userId}
        orgId={orgId}
      />
    </div>
  );
}
