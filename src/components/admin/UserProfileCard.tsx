"use client";

import type { UserProfileSummary } from "@/types/admin";

interface UserProfileCardProps {
  profile: UserProfileSummary;
  onView: () => void;
}

export default function UserProfileCard({ profile, onView }: UserProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={onView}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.imageUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate">
              {profile.role} · {profile.companyName}
            </p>
            {profile.primaryGoal && (
              <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                Goal: {profile.primaryGoal}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
            Profile Complete
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Completed {formatDate(profile.completedAt)}
        </span>
        <svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </div>
  );
}
