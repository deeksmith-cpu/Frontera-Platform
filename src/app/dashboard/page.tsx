import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@supabase/supabase-js";
import { ProfileCard } from "@/components/product-strategy-agent/PersonalProfile/ProfileCard";
import type { PersonalProfileData, ProfilingFrameworkState } from "@/types/database";

// Check if user is a Frontera super admin
async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user.publicMetadata?.role === "frontera:super_admin";
  } catch {
    return false;
  }
}

export default async function DashboardPage() {
  const { userId, orgId, orgRole } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is super admin
  const isAdmin = await isSuperAdmin(userId);

  // Get organization details if user is in an org
  let orgName = null;
  if (orgId) {
    try {
      const clerk = await clerkClient();
      const org = await clerk.organizations.getOrganization({ organizationId: orgId });
      orgName = org.name;
    } catch {
      orgName = null;
    }
  }

  // Format role for display
  const displayRole = orgRole?.replace("org:", "").replace("_", " ") || "Member";
  const formattedRole = displayRole.charAt(0).toUpperCase() + displayRole.slice(1);

  // Fetch personal profile status
  let profileStatus: 'not_started' | 'in_progress' | 'completed' = 'not_started';
  let profileData: PersonalProfileData | null = null;
  if (orgId) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
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
        const fs = profConv.framework_state as unknown as ProfilingFrameworkState | null;
        profileStatus = (fs?.status as 'not_started' | 'in_progress' | 'completed') || 'in_progress';
        profileData = fs?.profileData || null;
      }
    } catch {
      // Profile not found — leave as not_started
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a]/5 via-transparent to-[#fbbf24]/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 pt-32">
          <div className="relative">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Welcome back, {user?.firstName || "User"}
            </h1>
            {orgName && (
              <div className="flex items-center gap-3 text-lg">
                <span className="font-semibold text-[#1a1f3a]">{orgName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-slate-600">{formattedRole}</span>
              </div>
            )}
            {!orgName && (
              <p className="text-lg text-slate-600">
                Your strategic transformation command center
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Strategy Coach */}
          <Link href="/dashboard/strategy-coach" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Strategy Coach</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  AI-powered guidance for your product strategy transformation journey.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
                  Start Coaching
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Personal Profile Card */}
          <ProfileCard status={profileStatus} profile={profileData} />

          {/* Product Strategy Agent */}
          <Link href="/dashboard/product-strategy-agent" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">Product Strategy Agent</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[#fbbf24] text-slate-900 text-xs font-bold rounded-full uppercase tracking-wide">MVP</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Guided 4-phase strategy development with AI coaching, 3Cs research, and strategic synthesis.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
                  Open Agent
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Leadership Playbook */}
          <Link href="/dashboard/leadership-playbook" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Leadership Playbook</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Personalized leadership development from 301 expert conversations.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
                  Open Playbook
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Documents - Coming Soon */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a]/60 p-6 text-white shadow-lg">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#fbbf24]/60" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white/60">Documents</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                View and manage your strategic outputs, frameworks, and insights.
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-slate-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Coming Soon
              </div>
            </div>
          </div>

          {/* Team */}
          <Link href="/dashboard/team" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">Team</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Manage your organization members, roles, and permissions.
                </p>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
                  Manage Team
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Admin Panel - Only visible to Frontera super admins */}
          {isAdmin && (
            <Link href="/dashboard/admin" className="block lg:col-span-2">
              <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
                <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[#fbbf24]/10 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Admin Panel</h3>
                      <span className="text-xs text-[#fbbf24]">Frontera Administrator</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    Review client applications, manage provisioning, and oversee the Frontera platform.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
                    Open Admin
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Debug info - only shown in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200 text-sm text-slate-600">
            <p className="font-mono"><strong>User ID:</strong> {userId}</p>
            <p className="font-mono"><strong>Org ID:</strong> {orgId || "No organization selected"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
