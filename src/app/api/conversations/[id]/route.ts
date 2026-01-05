import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { FrameworkState } from "@/lib/agents/strategy-coach/framework-state";
import { trackEvent } from "@/lib/analytics/posthog-server";

// Supabase client with service role
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

/**
 * GET /api/conversations/[id]
 * Get a conversation with its messages.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const supabase = getSupabaseAdmin();

    // Fetch conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .eq("clerk_org_id", orgId)
      .single();

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Fetch messages
    const { data: messages, error: msgError } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (msgError) {
      console.error("Failed to fetch messages:", msgError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    const messageCount = messages?.length || 0;
    const frameworkState = conversation.framework_state as FrameworkState | null;

    // Track conversation viewed
    await trackEvent("strategy_coach_conversation_viewed", userId, {
      org_id: orgId,
      conversation_id: id,
      message_count: messageCount,
      is_archived: conversation.status === "archived",
      framework_state_phase: frameworkState?.currentPhase || "discovery",
    });

    // Track conversation resumed if it has messages
    if (messageCount > 0) {
      await trackEvent("strategy_coach_conversation_resumed", userId, {
        org_id: orgId,
        conversation_id: id,
        messages_since_last_visit: messageCount,
      });
    }

    return NextResponse.json({
      conversation,
      messages: messages || [],
    });
  } catch (err) {
    console.error("Error fetching conversation:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/conversations/[id]
 * Update conversation (title, status, framework_state).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { title, status, framework_state, context_summary } = body;

    const supabase = getSupabaseAdmin();

    // Build update object
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;
    if (framework_state !== undefined) updates.framework_state = framework_state;
    if (context_summary !== undefined) updates.context_summary = context_summary;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .eq("clerk_org_id", orgId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update conversation:", error);
      return NextResponse.json(
        { error: "Failed to update conversation" },
        { status: 500 }
      );
    }

    // Get message count for tracking
    const { count: messageCount } = await supabase
      .from("conversation_messages")
      .select("*", { count: "exact", head: true })
      .eq("conversation_id", id);

    // Track conversation updated
    await trackEvent("strategy_coach_conversation_updated", userId, {
      org_id: orgId,
      conversation_id: id,
      updated_fields: Object.keys(updates),
      archived: updates.status === "archived",
    });

    // Track conversation completed if moved to planning and archived
    const newFrameworkState = updates.framework_state as FrameworkState | undefined;
    if (newFrameworkState?.currentPhase === "planning" && updates.status === "archived") {
      const conversationAge = conversation
        ? new Date().getTime() - new Date(conversation.created_at).getTime()
        : 0;
      const durationHours = Math.round(conversationAge / (1000 * 60 * 60) * 10) / 10;

      await trackEvent("strategy_coach_conversation_completed", userId, {
        org_id: orgId,
        conversation_id: id,
        total_messages: messageCount || 0,
        duration_hours: durationHours,
      });
    }

    return NextResponse.json({ conversation });
  } catch (err) {
    console.error("Error updating conversation:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
