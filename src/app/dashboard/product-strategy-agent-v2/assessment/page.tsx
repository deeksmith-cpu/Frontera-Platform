import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AssessmentFlow } from '@/components/product-strategy-agent-v2/Assessment/AssessmentFlow';

export default async function AssessmentPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <AssessmentFlow />;
}
