import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ProductStrategyAgentInterface } from '@/components/product-strategy-agent/ProductStrategyAgentInterface';
import { initializeFrameworkState } from '@/lib/agents/strategy-coach/framework-state';

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

  // Load client context for Discovery section
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('clerk_org_id', orgId)
    .single();

  if (clientError) {
    console.log('Client lookup (may be expected if no client exists):', clientError.message);
  }

  // Get or create active strategy_coach conversation for this org
  // Filter by agent_type to avoid accidentally picking up profiling conversations
  const { data: existingConversations, error: fetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('clerk_org_id', orgId)
    .eq('agent_type', 'strategy_coach')
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching conversations:', fetchError);
  }

  let conversation = existingConversations?.[0];

  // If no conversation exists, create one
  if (!conversation) {
    console.log('No existing conversation found, creating new one for org:', orgId);
    const { data: newConversation, error: insertError } = await supabase
      .from('conversations')
      .insert({
        clerk_user_id: userId,
        clerk_org_id: orgId,
        agent_type: 'strategy_coach',
        title: 'New Strategy Session',
        framework_state: initializeFrameworkState(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating conversation:', insertError);
    } else {
      console.log('Created new conversation:', newConversation?.id);
    }

    conversation = newConversation;
  } else {
    console.log('Using existing conversation:', conversation.id);
  }

  return (
    <ProductStrategyAgentInterface
      conversation={conversation}
      userId={userId}
      orgId={orgId}
      clientContext={clientData}
    />
  );
}
