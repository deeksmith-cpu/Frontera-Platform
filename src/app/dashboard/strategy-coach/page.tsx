import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Header from "@/components/Header";
import ConversationList from "@/components/strategy-coach/ConversationList";
import type { Database, Conversation } from "@/types/database";

// Supabase client with service role
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase config");
  return createClient<Database>(url, key);
}

async function getConversations(orgId: string): Promise<Conversation[]> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("clerk_org_id", orgId)
    .eq("agent_type", "strategy_coach")
    .neq("status", "archived")
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch conversations:", error);
    return [];
  }

  return data || [];
}

export default async function StrategyCoachPage() {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
    redirect("/dashboard");
  }

  const conversations = await getConversations(orgId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-12 pt-24">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link
                href="/dashboard"
                className="hover:text-[#1e3a8a] transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li className="text-slate-900 font-medium">Strategy Coach</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Strategy Coach</h1>
          </div>
          <p className="text-slate-600">
            Get AI-powered guidance on your product strategy transformation.
            Your coach will help you develop strategic insights, research your
            market, and create actionable plans.
          </p>
        </div>

        {/* Methodology Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">
            Your Coaching Journey
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-sm">1</span>
              </div>
              <p className="text-xs font-medium text-slate-700">Discovery</p>
              <p className="text-xs text-slate-500">Understand context</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-700 font-semibold text-sm">2</span>
              </div>
              <p className="text-xs font-medium text-slate-700">Research</p>
              <p className="text-xs text-slate-500">Explore pillars</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-semibold text-sm">3</span>
              </div>
              <p className="text-xs font-medium text-slate-700">Synthesis</p>
              <p className="text-xs text-slate-500">Strategic bets</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold text-sm">4</span>
              </div>
              <p className="text-xs font-medium text-slate-700">Planning</p>
              <p className="text-xs text-slate-500">Action plans</p>
            </div>
          </div>
        </div>

        {/* Conversations */}
        <ConversationList conversations={conversations} />
      </div>
    </div>
  );
}
