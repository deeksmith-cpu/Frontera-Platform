import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName || "User"}
          </h1>
          <p className="text-slate-600 mt-2">
            Your Frontera dashboard
          </p>
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

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Team</h3>
            <p className="text-sm text-slate-600 mb-4">
              Manage your organization members and permissions.
            </p>
            <span className="inline-block px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Debug info - remove in production */}
        <div className="mt-12 p-4 bg-slate-100 rounded-lg text-sm text-slate-600">
          <p><strong>User ID:</strong> {userId}</p>
          <p><strong>Org ID:</strong> {orgId || "No organization selected"}</p>
        </div>
      </div>
    </div>
  );
}
