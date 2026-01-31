import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import AdminTabs from "@/components/admin/AdminTabs";

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

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is super admin
  if (!(await isSuperAdmin(userId))) {
    redirect("/dashboard?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12 pt-24">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/dashboard"
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li className="text-slate-400">/</li>
            <li className="text-slate-900 font-medium">Admin Panel</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#1a1f3a] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
              </div>
              <p className="text-slate-600">
                Manage applications and view user profiles
              </p>
            </div>
            <Link
              href="/dashboard/admin/landing-comparison"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              Compare Landing Pages
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <AdminTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
