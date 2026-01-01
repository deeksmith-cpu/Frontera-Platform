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
      <div className="max-w-7xl mx-auto px-6 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName || "User"}
          </h1>
          {orgName && (
            <p className="text-slate-600 mt-2">
              <span className="font-medium text-slate-700">{orgName}</span>
              <span className="mx-2">·</span>
              <span className="text-slate-500">{formattedRole}</span>
            </p>
          )}
          {!orgName && (
            <p className="text-slate-600 mt-2">
              Your Frontera dashboard
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Strategy Coach</h3>
            <p className="text-sm text-slate-600 mb-4">
              Get AI-powered guidance on your product strategy transformation.
            </p>
            <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Documents</h3>
            <p className="text-sm text-slate-600 mb-4">
              View and manage your strategic outputs and documents.
            </p>
            <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
              Coming Soon
            </span>
          </div>

          <Link
            href="/dashboard/team"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Team</h3>
              <svg
                className="w-5 h-5 text-slate-400 group-hover:text-[#1e3a8a] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Manage your organization members and permissions.
            </p>
            <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
              Active
            </span>
          </Link>

          {/* Admin Panel - Only visible to Frontera super admins */}
          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className="bg-gradient-to-br from-[#1e3a8a] to-[#1e2a5e] rounded-xl shadow-sm border border-[#1e3a8a] p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">Admin Panel</h3>
                <svg
                  className="w-5 h-5 text-white/60 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Review applications and manage client provisioning.
              </p>
              <span className="inline-block px-3 py-1 text-xs font-medium text-[#1e3a8a] bg-white rounded-full">
                Frontera Admin
              </span>
            </Link>
          )}
        </div>

        {/* Debug info - only shown in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-slate-100 rounded-lg text-sm text-slate-600">
            <p><strong>User ID:</strong> {userId}</p>
            <p><strong>Org ID:</strong> {orgId || "No organization selected"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
