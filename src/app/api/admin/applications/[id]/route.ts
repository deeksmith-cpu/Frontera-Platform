import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { trackEvent } from "@/lib/analytics/posthog-server";

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

// Use service role for admin operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 48);
}

// GET: Get single application details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isSuperAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("client_onboarding")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application: data });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update application status (approve/reject)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isSuperAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status, review_notes } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("client_onboarding")
      .update({
        status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_notes: review_notes || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update application:", error);
      return NextResponse.json(
        { error: "Failed to update application" },
        { status: 500 }
      );
    }

    // Track application approval/rejection
    const eventName = status === "approved"
      ? "admin_application_approved"
      : "admin_application_rejected";

    await trackEvent(eventName, userId, {
      application_id: id,
      company_name: data.company_name,
      industry: data.industry,
      company_size: data.company_size,
      has_review_notes: !!review_notes,
    });

    return NextResponse.json({ success: true, application: data });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Provision the approved application (create org + send invite)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isSuperAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for invitation" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Get the application
    const { data: application, error: fetchError } = await supabase
      .from("client_onboarding")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "approved") {
      return NextResponse.json(
        { error: "Application must be approved before provisioning" },
        { status: 400 }
      );
    }

    if (application.provisioned_org_id) {
      return NextResponse.json(
        { error: "Application has already been provisioned" },
        { status: 400 }
      );
    }

    const clerk = await clerkClient();

    // 1. Create the organization in Clerk
    let organization;
    try {
      organization = await clerk.organizations.createOrganization({
        name: application.company_name,
        publicMetadata: {
          onboarding_id: application.id,
          industry: application.industry,
          company_size: application.company_size,
        },
      });
    } catch (err: unknown) {
      console.error("Failed to create organization:", err);
      const error = err as { errors?: Array<{ message: string }> };
      return NextResponse.json(
        { error: error.errors?.[0]?.message || "Failed to create organization" },
        { status: 400 }
      );
    }

    // 2. Add the super admin as a member of the org (required to send invitations)
    try {
      await clerk.organizations.createOrganizationMembership({
        organizationId: organization.id,
        userId: userId,
        role: "org:admin",
      });
    } catch (err: unknown) {
      console.error("Failed to add admin to organization:", err);
      // Continue anyway - the invite might still work
    }

    // 3. Create invitation for the applicant
    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                    "http://localhost:3000";

    let invitation;
    try {
      invitation = await clerk.organizations.createOrganizationInvitation({
        organizationId: organization.id,
        emailAddress: email,
        role: "org:admin",
        inviterUserId: userId,
        redirectUrl: `${baseUrl}/sign-up`,
      });
    } catch (err: unknown) {
      console.error("Failed to send invitation:", err);
      // Rollback: delete the organization
      await clerk.organizations.deleteOrganization(organization.id);
      const error = err as { errors?: Array<{ message: string }> };
      return NextResponse.json(
        { error: error.errors?.[0]?.message || "Failed to send invitation" },
        { status: 400 }
      );
    }

    // 4. Update the application record
    const { error: updateError } = await supabase
      .from("client_onboarding")
      .update({
        status: "provisioned",
        provisioned_org_id: organization.id,
        invitation_status: "sent",
        invitation_sent_at: new Date().toISOString(),
        invitation_email: email,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Failed to update application:", updateError);
      // Don't rollback - org and invite were created successfully
    }

    // 5. Create the client record in Supabase (linking to onboarding)
    const { error: clientError } = await supabase.from("clients").insert({
      clerk_org_id: organization.id,
      company_name: application.company_name,
      slug: generateSlug(application.company_name),
      industry: application.industry,
      company_size: application.company_size,
      strategic_focus: application.strategic_focus,
      pain_points: application.pain_points,
      target_outcomes: application.target_outcomes,
      tier: "pilot",
      onboarding_id: application.id,
    });

    if (clientError) {
      console.error("Failed to create client record:", clientError);
      // Don't fail - the webhook might create it anyway
    }

    // Track application provisioned
    await trackEvent("admin_application_provisioned", userId, {
      application_id: id,
      organization_id: organization.id,
      invitation_id: invitation.id,
      invitation_email: email,
      company_name: application.company_name,
      industry: application.industry,
    });

    return NextResponse.json({
      success: true,
      organizationId: organization.id,
      invitationId: invitation.id,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
