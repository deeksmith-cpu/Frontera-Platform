import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { loadUploadedMaterials, formatUploadedMaterialsForPrompt } from "@/lib/agents/strategy-coach/client-context";

/**
 * GET /api/product-strategy-agent-v2/debug-materials?conversation_id=xxx
 *
 * Diagnostic endpoint — returns what the coaching AI system prompt sees
 * for uploaded materials. DELETE THIS AFTER DEBUGGING.
 */
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Check raw materials in database
  const rawSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Allow passing conversation_id or auto-detect (same logic as v2 page — now filtered by agent_type)
  let conversationId = req.nextUrl.searchParams.get("conversation_id");
  if (!conversationId) {
    const { data: convs } = await rawSupabase
      .from("conversations")
      .select("id, agent_type")
      .eq("clerk_org_id", orgId)
      .eq("agent_type", "strategy_coach")
      .order("created_at", { ascending: false })
      .limit(1);
    conversationId = convs?.[0]?.id || null;
    if (!conversationId) {
      return Response.json({ error: "No conversations found for this org" }, { status: 404 });
    }
  }

  const { data: rawMaterials, error: rawError } = await rawSupabase
    .from("uploaded_materials")
    .select("id, conversation_id, filename, file_type, processing_status, extracted_context, uploaded_at")
    .eq("conversation_id", conversationId);

  // 2. Check what loadUploadedMaterials returns (filtered by processing_status=completed)
  const loadedMaterials = await loadUploadedMaterials(conversationId);

  // 3. Check what the formatted prompt section looks like
  const promptSection = loadedMaterials.length > 0
    ? formatUploadedMaterialsForPrompt(loadedMaterials)
    : "(empty — no materials to format)";

  // 4. Check conversation exists and belongs to this org
  const { data: conversation } = await rawSupabase
    .from("conversations")
    .select("id, clerk_org_id, agent_type, created_at, framework_state")
    .eq("id", conversationId)
    .eq("clerk_org_id", orgId)
    .single();

  // 5. List ALL conversations for this org (to detect agent_type mismatches)
  const { data: allConversations } = await rawSupabase
    .from("conversations")
    .select("id, agent_type, created_at, title")
    .eq("clerk_org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10);

  return Response.json({
    conversationId,
    orgId,
    allConversationsForOrg: (allConversations || []).map((c: Record<string, unknown>) => ({
      id: (c.id as string)?.slice(0, 8) + "...",
      agent_type: c.agent_type,
      title: c.title,
      created_at: c.created_at,
    })),
    conversation: conversation ? {
      id: conversation.id,
      agent_type: (conversation as Record<string, unknown>).agent_type,
      created_at: conversation.created_at,
      currentPhase: ((conversation.framework_state as Record<string, unknown>)?.currentPhase) || "unknown",
    } : null,
    rawMaterialsInDB: {
      count: rawMaterials?.length || 0,
      error: rawError?.message || null,
      materials: (rawMaterials || []).map((m: Record<string, unknown>) => ({
        id: m.id,
        filename: m.filename,
        file_type: m.file_type,
        processing_status: m.processing_status,
        has_extracted_text: !!(m.extracted_context as Record<string, unknown>)?.text,
        extracted_context_keys: Object.keys((m.extracted_context as Record<string, unknown>) || {}),
        uploaded_at: m.uploaded_at,
      })),
    },
    loadedForPrompt: {
      count: loadedMaterials.length,
      materials: loadedMaterials.map(m => ({
        filename: m.filename,
        fileType: m.fileType,
        hasText: !!m.text,
        textLength: m.text?.length || 0,
        isAiGenerated: m.isAiGenerated,
        source: m.source,
      })),
    },
    promptSection: promptSection.substring(0, 2000) + (promptSection.length > 2000 ? "\n...(truncated)" : ""),
  });
}
