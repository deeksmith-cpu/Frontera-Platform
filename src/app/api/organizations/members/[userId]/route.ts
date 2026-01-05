import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { trackEvent } from "@/lib/analytics/posthog-server";

// PATCH: Update member role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId, orgId, orgRole } = await auth();
    const { userId: targetUserId } = await params;

    if (!currentUserId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can update roles
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Only admins can update roles" },
        { status: 403 }
      );
    }

    // Prevent changing own role
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    const { role } = await req.json();

    // Validate role
    if (role !== "org:admin" && role !== "org:member") {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    await clerk.organizations.updateOrganizationMembership({
      organizationId: orgId,
      userId: targetUserId,
      role,
    });

    // Track role update
    await trackEvent("team_member_role_updated", currentUserId, {
      org_id: orgId,
      target_user_id: targetUserId,
      new_role: role,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Failed to update role:", err);
    const error = err as { errors?: Array<{ message: string }> };
    const message = error.errors?.[0]?.message || "Failed to update role";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

// DELETE: Remove member from organization
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId, orgId, orgRole } = await auth();
    const { userId: targetUserId } = await params;

    if (!currentUserId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can remove members
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Only admins can remove members" },
        { status: 403 }
      );
    }

    // Prevent removing yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot remove yourself from the organization" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    await clerk.organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId: targetUserId,
    });

    // Track member removal
    await trackEvent("team_member_removed", currentUserId, {
      org_id: orgId,
      removed_user_id: targetUserId,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Failed to remove member:", err);
    const error = err as { errors?: Array<{ message: string }> };
    const message = error.errors?.[0]?.message || "Failed to remove member";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
