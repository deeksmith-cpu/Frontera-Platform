"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserProfileSummary } from "@/types/admin";
import UserProfileCard from "./UserProfileCard";
import UserProfileDetailModal from "./UserProfileDetailModal";

export default function UserProfileList() {
  const [profiles, setProfiles] = useState<UserProfileSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/profiles");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch profiles");
      setProfiles(data.profiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profiles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
          <button onClick={fetchProfiles} className="ml-3 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && !error && profiles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No profiles yet</h3>
          <p className="text-slate-600 text-sm">
            No users have completed their personal profile intake yet.
          </p>
        </div>
      )}

      {!isLoading && !error && profiles.length > 0 && (
        <>
          <p className="text-sm text-slate-500">
            {profiles.length} completed profile{profiles.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <UserProfileCard
                key={profile.conversationId}
                profile={profile}
                onView={() => setSelectedConversationId(profile.conversationId)}
              />
            ))}
          </div>
        </>
      )}

      {selectedConversationId && (
        <UserProfileDetailModal
          conversationId={selectedConversationId}
          onClose={() => setSelectedConversationId(null)}
        />
      )}
    </div>
  );
}
