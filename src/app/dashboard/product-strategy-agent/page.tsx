import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ProductStrategyAgentInterface } from '@/components/product-strategy-agent/ProductStrategyAgentInterface';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, key);
}

export default async function ProductStrategyAgentPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  if (!orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Organization Required</h2>
          <p className="text-slate-600">Please select an organization to access Product Strategy Agent.</p>
        </div>
      </div>
    );
  }

  const supabase = getSupabaseAdmin();

  // Get or create active conversation for this org
  const { data: existingConversations } = await supabase
    .from('conversations')
    .select('*')
    .eq('clerk_org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(1);

  let conversation = existingConversations?.[0];

  // If no conversation exists, create one
  if (!conversation) {
    const { data: newConversation } = await supabase
      .from('conversations')
      .insert({
        clerk_org_id: orgId,
        title: 'New Strategy Session',
        framework_state: {
          currentPhase: 'discovery',
          pillars: {
            company: { status: 'pending', progress: 0, insights: [] },
            customer: { status: 'pending', progress: 0, insights: [] },
            competitor: { status: 'pending', progress: 0, insights: [] },
          },
        },
      })
      .select()
      .single();

    conversation = newConversation;
  }

  return (
    <ProductStrategyAgentInterface
      conversation={conversation}
      userId={userId}
      orgId={orgId}
    />
  );
}
