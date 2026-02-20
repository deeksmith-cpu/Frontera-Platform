import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { StrategyHomeDashboard } from '@/components/product-strategy-agent-v2/StrategyHome/StrategyHomeDashboard';

export default async function StrategyHomePage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  if (!orgId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Organization Required</h2>
          <p className="text-slate-600">Please select an organization to access Strategy Home.</p>
        </div>
      </div>
    );
  }

  const user = await currentUser();
  const userName = user?.firstName || 'there';

  return <StrategyHomeDashboard userName={userName} />;
}
