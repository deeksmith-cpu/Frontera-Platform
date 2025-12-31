import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side authenticated Supabase client
export async function createServerSupabaseClient() {
  const { getToken } = await auth();

  const token = await getToken({ template: "supabase" });

  if (!token) {
    throw new Error("Not authenticated");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

// Get Supabase client - returns authenticated client if available, anon otherwise
export async function getSupabaseClient() {
  try {
    return await createServerSupabaseClient();
  } catch {
    // Return anon client for public routes
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
}
