import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { trackEvent } from "@/lib/analytics/posthog-server";

// GET: List all organization members
export async function GET() {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerk = await clerkClient();
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    // Format response with user details
    const members = await Promise.all(
      memberships.data.map(async (membership) => {
        const user = await clerk.users.getUser(membership.publicUserData!.userId!);
        return {
          id: membership.id,
          odId: orgId,
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

    // Track member list viewed
    await trackEvent("team_members_listed", userId, {
      org_id: orgId,
      member_count: members.length,
    });

    return NextResponse.json({ members });
  } catch (err) {
    console.error("Failed to list members:", err);
    return NextResponse.json(
      { error: "Failed to list members" },
      { status: 500 }
    );
  }
}

// POST: Invite new member
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only admins can invite
    if (orgRole !== "org:admin") {
      return NextResponse.json(
        { error: "Only admins can invite members" },
        { status: 403 }
      );
    }

    const { email, role = "org:member" } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "org:admin" && role !== "org:member") {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    const invitation = await clerk.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role,
      inviterUserId: userId,
    });

    // Track member invitation
    await trackEvent("team_member_invited", userId, {
      org_id: orgId,
      invitation_email: email,
      role: role,
      invitation_id: invitation.id,
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.emailAddress,
        role: invitation.role,
        status: invitation.status,
      },
    });
  } catch (err: unknown) {
    console.error("Failed to invite member:", err);
    const error = err as { errors?: Array<{ message: string }> };
    const message = error.errors?.[0]?.message || "Failed to send invitation";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
