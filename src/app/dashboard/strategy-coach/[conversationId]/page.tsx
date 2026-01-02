import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ChatInterface from "@/components/strategy-coach/ChatInterface";
import type { Conversation, ConversationMessage } from "@/types/database";

// Supabase client with service role
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient(url, key);
}

async function getConversationWithMessages(conversationId: string, orgId: string) {
  const supabase = getSupabaseAdmin();

  // Fetch conversation
  const { data: conversationData, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("clerk_org_id", orgId)
    .single();

  if (convError || !conversationData) {
    return null;
  }

  const conversation = conversationData as Conversation;

  // Fetch messages
  const { data: messagesData, error: msgError } = await supabase
    .from("conversation_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("Failed to fetch messages:", msgError);
  }

  const messages = (messagesData || []) as ConversationMessage[];

  return {
    conversation,
    messages,
  };
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
    redirect("/dashboard");
  }

  const { conversationId } = await params;

  const data = await getConversationWithMessages(conversationId, orgId);

  if (!data) {
    notFound();
  }

  const { conversation, messages } = data;

  // Transform messages to the format expected by ChatInterface
  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
    created_at: msg.created_at,
  }));

  return (
    <div className="h-screen flex flex-col">
      <ChatInterface
        conversationId={conversation.id}
        initialMessages={formattedMessages}
        conversationTitle={conversation.title || undefined}
      />
    </div>
  );
}
