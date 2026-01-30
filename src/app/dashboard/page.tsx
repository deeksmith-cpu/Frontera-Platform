import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

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
          {/* Strategy Coach - Featured Card */}
          <Link
            href="/dashboard/strategy-coach"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-[#fbbf24] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fbbf24]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#1a1f3a] to-[#fbbf24] rounded-xl shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    />
                  </svg>
                </div>
                <svg
                  className="w-6 h-6 text-slate-400 group-hover:text-[#1a1f3a] group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Strategy Coach</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                AI-powered guidance for your product strategy transformation journey.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Active & Ready</span>
              </div>
            </div>
          </Link>

          {/* Product Strategy Agent - Functional MVP */}
          <Link
            href="/dashboard/product-strategy-agent"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#1a1f3a] hover:border-[#fbbf24] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fbbf24]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#1a1f3a] to-[#fbbf24] rounded-xl shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-[#1a1f3a] to-[#fbbf24] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  MVP
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Product Strategy Agent</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Guided 4-phase strategy development with AI coaching, 3Cs research, and strategic synthesis.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Active Development</span>
              </div>
            </div>
          </Link>

          {/* Strategy Coach v2 - Design Mockup Reference */}
          <Link
            href="/dashboard/strategy-coach-v2"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#C73E1D] hover:border-[#D97917] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C73E1D]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#C73E1D] to-[#D97917] rounded-xl shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  </svg>
                </div>
                <span className="px-3 py-1 bg-[#C73E1D] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Mockup
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Strategy Coach v2 Mockup</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Design reference for visual 3Cs canvas interface with interactive strategic framework.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-semibold text-amber-700">Design Reference</span>
              </div>
            </div>
          </Link>

          {/* Documents - Coming Soon Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-md border border-slate-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Documents</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                View and manage your strategic outputs, frameworks, and insights.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Coming Soon
              </div>
            </div>
          </div>

          {/* Team Management Card */}
          <Link
            href="/dashboard/team"
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-[#fbbf24] hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a1f3a]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-[#fbbf24] to-[#1a1f3a] rounded-xl shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <svg
                  className="w-6 h-6 text-slate-400 group-hover:text-[#1a1f3a] group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Team</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Manage your organization members, roles, and permissions.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Active & Ready</span>
              </div>
            </div>
          </Link>

          {/* Admin Panel - Only visible to Frontera super admins */}
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="group relative overflow-hidden bg-gradient-to-br from-[#1a1f3a] to-[#2d3561] rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-[#1a1f3a] hover:border-[#fbbf24] hover:-translate-y-1 lg:col-span-2"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <svg
                    className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Admin Panel</h3>
                <p className="text-white/90 leading-relaxed mb-6 text-lg">
                  Review client applications, manage provisioning, and oversee the Frontera platform.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#1a1f3a] rounded-full font-bold text-sm shadow-lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Frontera Administrator
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
