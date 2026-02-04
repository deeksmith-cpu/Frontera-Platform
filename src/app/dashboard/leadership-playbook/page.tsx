import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import { PlaybookView } from '@/components/product-strategy-agent/LeadershipPlaybook/PlaybookView';
import { LockedState } from '@/components/product-strategy-agent/LeadershipPlaybook/LockedState';
import Link from 'next/link';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase config');
  return createClient(url, key);
}

export default async function LeadershipPlaybookPage() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    redirect('/sign-in');
  }

  // Find the most recent Strategy Coach conversation for this org
  const supabase = getSupabaseAdmin();
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, framework_state')
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'strategy_coach')
    .order('created_at', { ascending: false })
    .limit(1);

  const conversation = conversations?.[0];
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';
  const isLocked = currentPhase === 'discovery';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16 pt-32">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/dashboard" className="hover:text-[#1a1f3a] transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Leadership Playbook</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#1a1f3a] to-[#fbbf24] rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Leadership Playbook</h1>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Personalized leadership development recommendations drawn from 301 conversations with proven product leaders.
          </p>
        </div>

        {isLocked || !conversation ? (
          <LockedState />
        ) : (
          <PlaybookView conversationId={conversation.id} />
        )}
      </div>
    </div>
  );
}
