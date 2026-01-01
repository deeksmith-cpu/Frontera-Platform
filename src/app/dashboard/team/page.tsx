import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import MemberList from "@/components/team/MemberList";
import type { OrganizationMember } from "@/types/auth";

export default async function TeamPage() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
    redirect("/dashboard?error=no-org");
  }

  const clerk = await clerkClient();

  // Get organization details
  let orgName = "Your Organization";
  try {
    const org = await clerk.organizations.getOrganization({ organizationId: orgId });
    orgName = org.name;
  } catch {
    // Use default name
  }

  // Get organization members
  let members: OrganizationMember[] = [];
  try {
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    members = await Promise.all(
      memberships.data.map(async (membership) => {
        const user = await clerk.users.getUser(membership.publicUserData!.userId!);
        return {
          id: membership.id,
          odId: orgId,
          odName: orgName,
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          imageUrl: user.imageUrl,
          role: membership.role,
          createdAt: membership.createdAt,
        };
      })
    );
  } catch (err) {
    console.error("Failed to fetch members:", err);
  }

  const isAdmin = orgRole === "org:admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24">
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
            <li className="text-slate-900 font-medium">Team</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-2">
            Manage members and roles for{" "}
            <span className="font-medium text-slate-900">{orgName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <MemberList
              members={members}
              isAdmin={isAdmin}
              currentUserId={userId}
            />
          </div>
        </div>

        {/* Admin info box */}
        {!isAdmin && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-slate-400 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <div>
                <p className="text-sm text-slate-600">
                  You have <span className="font-medium">member</span> access.
                  Contact an admin to invite new members or change roles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
