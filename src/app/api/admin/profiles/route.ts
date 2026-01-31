import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { trackEvent } from "@/lib/analytics/posthog-server";
import type { UserProfileSummary } from "@/types/admin";
import type { PersonalProfileData } from "@/types/database";

async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user.publicMetadata?.role === "frontera:super_admin";
  } catch {
    return false;
  }
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isSuperAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch all completed profiling conversations
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("id, clerk_user_id, clerk_org_id, framework_state, updated_at")
      .eq("agent_type", "profiling")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch profiling conversations:", error);
      return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }

    // Filter to completed profiles
    const completed = (conversations || []).filter((c) => {
      const state = c.framework_state as Record<string, unknown> | null;
      return state?.status === "completed" && state?.profileData;
    });

    // Fetch client (org) data for all unique org IDs
    const orgIds = [...new Set(completed.map((c) => c.clerk_org_id))];
    const { data: clients } = await supabase
      .from("clients")
      .select("clerk_org_id, company_name, industry")
      .in("clerk_org_id", orgIds.length > 0 ? orgIds : ["__none__"]);

    const clientMap = new Map(
      (clients || []).map((c) => [c.clerk_org_id, c])
    );

    // Fetch Clerk user details
    const clerk = await clerkClient();
    const profiles: UserProfileSummary[] = [];

    for (const conv of completed) {
      try {
        const user = await clerk.users.getUser(conv.clerk_user_id);
        const client = clientMap.get(conv.clerk_org_id);
        const state = conv.framework_state as Record<string, unknown>;
        const profileData = state.profileData as PersonalProfileData;

        profiles.push({
          userId: conv.clerk_user_id,
          orgId: conv.clerk_org_id,
          conversationId: conv.id,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.emailAddresses[0]?.emailAddress || "",
          imageUrl: user.imageUrl,
          companyName: client?.company_name || "Unknown",
          industry: client?.industry || null,
          completedAt: (state.completedAt as string) || conv.updated_at,
          role: profileData.role?.title || "Unknown",
          primaryGoal: profileData.objectives?.primaryGoal || "",
        });
      } catch (err) {
        console.error(`Failed to fetch user ${conv.clerk_user_id}:`, err);
      }
    }

    await trackEvent("admin_profiles_viewed", userId, {
      profile_count: profiles.length,
      organizations_count: orgIds.length,
    });

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
