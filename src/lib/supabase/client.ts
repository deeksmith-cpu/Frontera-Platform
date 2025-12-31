import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Anonymous client for public operations (e.g., lead gen onboarding)
export const supabaseAnon = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authenticated client factory - creates a client with Clerk JWT for RLS
export function createSupabaseClient(clerkToken: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
}
