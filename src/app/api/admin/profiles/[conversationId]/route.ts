import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { trackEvent } from "@/lib/analytics/posthog-server";
import type { UserProfileDetail, CoachReflection } from "@/types/admin";
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

const REFLECTION_STALE_DAYS = 30;

function isReflectionFresh(reflection: CoachReflection | null): boolean {
  if (!reflection?.generatedAt) return false;
  const age = Date.now() - new Date(reflection.generatedAt).getTime();
  return age < REFLECTION_STALE_DAYS * 24 * 60 * 60 * 1000;
}

async function generateCoachReflection(profileData: PersonalProfileData): Promise<CoachReflection> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are an expert executive coach reviewing a leadership profile to provide private coaching insights for the Frontera platform team.

# Profile Data
${JSON.stringify(profileData, null, 2)}

# Your Task
Analyze this profile and provide a private coach reflection to help Frontera coaches better understand and support this leader. Return a JSON object with exactly this structure:

{
  "summary": "2-3 sentence high-level assessment of the leader's objectives, drivers, and coaching needs",
  "keyDrivers": ["Primary motivation", "Secondary driver", "Underlying need or challenge"],
  "workingStyleInsights": ["Communication preference insight", "Decision-making style insight", "Feedback receptivity insight"],
  "coachingRecommendations": ["Specific coaching strategy", "Another strategy", "Potential pitfall to avoid"]
}

Focus on what truly motivates this leader, how they prefer to work, and specific approaches that will resonate. Be direct and actionable. This is internal-only.

Return ONLY the JSON object, no other text.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const parsed = JSON.parse(text.trim());

  return {
    summary: parsed.summary,
    keyDrivers: parsed.keyDrivers,
    workingStyleInsights: parsed.workingStyleInsights,
    coachingRecommendations: parsed.coachingRecommendations,
    generatedAt: new Date().toISOString(),
    modelUsed: "claude-sonnet-4-20250514",
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isSuperAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { conversationId } = await params;
    const supabase = getSupabaseAdmin();

    const { data: conversation, error } = await supabase
      .from("conversations")
      .select("id, clerk_user_id, clerk_org_id, framework_state, updated_at")
      .eq("id", conversationId)
      .eq("agent_type", "profiling")
      .single();

    if (error || !conversation) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const state = conversation.framework_state as Record<string, unknown>;
    const profileData = state.profileData as PersonalProfileData;

    if (!profileData) {
      return NextResponse.json({ error: "Profile not completed" }, { status: 404 });
    }

    // Fetch user details from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(conversation.clerk_user_id);

    // Fetch client/org details
    const { data: client } = await supabase
      .from("clients")
      .select("company_name, industry")
      .eq("clerk_org_id", conversation.clerk_org_id)
      .single();

    // Check for cached reflection
    let coachReflection: CoachReflection | null = (state.coachReflection as CoachReflection) || null;
    let cacheHit = true;

    if (!isReflectionFresh(coachReflection)) {
      cacheHit = false;
      try {
        coachReflection = await generateCoachReflection(profileData);

        // Cache in framework_state
        await supabase
          .from("conversations")
          .update({
            framework_state: { ...state, coachReflection },
          })
          .eq("id", conversationId);
      } catch (err) {
        console.error("Failed to generate coach reflection:", err);
        // Don't fail the request — return profile without reflection
        coachReflection = null;
      }
    }

    const profile: UserProfileDetail = {
      userId: conversation.clerk_user_id,
      orgId: conversation.clerk_org_id,
      conversationId: conversation.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.emailAddresses[0]?.emailAddress || "",
      imageUrl: user.imageUrl,
      companyName: client?.company_name || "Unknown",
      industry: client?.industry || null,
      profileData,
      completedAt: (state.completedAt as string) || conversation.updated_at,
      coachReflection,
    };

    await trackEvent("admin_profile_viewed", userId, {
      conversation_id: conversationId,
      cache_hit: cacheHit,
      reflection_available: !!coachReflection,
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
