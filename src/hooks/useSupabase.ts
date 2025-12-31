"use client";

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createSupabaseClient, supabaseAnon } from "@/lib/supabase/client";

export function useSupabase() {
  const { getToken, isSignedIn } = useAuth();

  const getClient = useMemo(() => {
    return async () => {
      if (!isSignedIn) {
        return supabaseAnon;
      }

      const token = await getToken({ template: "supabase" });

      if (!token) {
        return supabaseAnon;
      }

      return createSupabaseClient(token);
    };
  }, [getToken, isSignedIn]);

  return { getClient, isSignedIn };
}
