import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { Conversation } from "@/types/database";
import { initializeFrameworkState } from "@/lib/agents/strategy-coach/framework-state";
import { trackEvent } from "@/lib/analytics/posthog-server";

// Supabase client with service role for server operations
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

/**
 * GET /api/conversations
 * List all conversations for the current user's organization.
 * Optionally filter by agent_type.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized - must be signed in with an organization" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const agentType = searchParams.get("agent_type") || "strategy_coach";
    const status = searchParams.get("status"); // active, archived, completed

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("conversations")
      .select("*")
      .eq("clerk_org_id", orgId)
      .eq("agent_type", agentType)
      .order("last_message_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    } else {
      // Default: show active and completed, not archived
      query = query.neq("status", "archived");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch conversations:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    // Track conversation list viewed
    await trackEvent("strategy_coach_conversations_listed", userId, {
      org_id: orgId,
      conversation_count: data?.length || 0,
      has_archived: data?.some((c) => c.status === "archived") || false,
      agent_type: agentType,
    });

    return NextResponse.json({ conversations: data });
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new conversation.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized - must be signed in with an organization" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, agent_type = "strategy_coach" } = body;

    const supabase = getSupabaseAdmin();

    // Ensure client record exists (may not exist if org was created before webhook was set up)
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("clerk_org_id", orgId)
      .single();

    if (!existingClient) {
      // Create a basic client record for this organization
      const { error: clientError } = await supabase.from("clients").insert({
        clerk_org_id: orgId,
        company_name: "Organization",
        slug: orgId.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        tier: "pilot",
      });

      if (clientError) {
        console.error("Failed to create client record:", clientError);
        return NextResponse.json(
          { error: "Failed to initialize organization" },
          { status: 500 }
        );
      }
    }

    // Initialize framework state for strategy coach
    const frameworkState =
      agent_type === "strategy_coach" ? initializeFrameworkState() : {};

    // Create the conversation
    const { data: conversationData, error } = await supabase
      .from("conversations")
      .insert({
        clerk_org_id: orgId,
        clerk_user_id: userId,
        title: title || "New Strategy Session",
        agent_type,
        framework_state: frameworkState,
        status: "active",
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !conversationData) {
      console.error("Failed to create conversation:", error);
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: 500 }
      );
    }

    const conversation = conversationData as Conversation;

    // Load client context for enhanced tracking
    const { data: clientData } = await supabase
      .from("clients")
      .select("industry, company_size, strategic_focus, pain_points, previous_attempts")
      .eq("clerk_org_id", orgId)
      .single();

    // Track conversation started with enhanced context
    await trackEvent("strategy_coach_conversation_started", userId, {
      org_id: orgId,
      conversation_id: conversation.id,
      agent_type,
      client_industry: clientData?.industry || "unknown",
      client_company_size: clientData?.company_size || "unknown",
      strategic_focus: clientData?.strategic_focus || "unknown",
      has_pain_points: clientData?.pain_points && clientData.pain_points.length > 0,
      has_previous_attempts: !!clientData?.previous_attempts,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err) {
    console.error("Error creating conversation:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
