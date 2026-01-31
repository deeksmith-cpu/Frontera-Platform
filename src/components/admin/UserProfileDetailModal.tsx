"use client";

import { useState, useEffect } from "react";
import type { UserProfileDetail } from "@/types/admin";

interface UserProfileDetailModalProps {
  conversationId: string;
  onClose: () => void;
}

interface ProfileSectionProps {
  title: string;
  icon: React.ReactNode;
  data: Record<string, unknown>;
  fields: Array<{
    label: string;
    key: string;
    array?: boolean;
  }>;
}

function ProfileSection({ title, icon, data, fields }: ProfileSectionProps) {
  return (
    <section className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#1a1f3a] flex items-center justify-center text-white">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {fields.map((field) => {
          const value = data[field.key];
          if (!value) return null;
          return (
            <div key={field.key}>
              <p className="text-xs text-slate-500 font-medium mb-1">{field.label}</p>
              {field.array && Array.isArray(value) ? (
                <ul className="space-y-1">
                  {value.map((item, i) => (
                    <li key={i} className="text-sm text-slate-900 flex items-start gap-2">
                      <span className="text-cyan-600 mt-0.5">•</span>
                      <span>{String(item)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-900 leading-relaxed">{String(value)}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function UserProfileDetailModal({ conversationId, onClose }: UserProfileDetailModalProps) {
  const [profile, setProfile] = useState<UserProfileDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/profiles/${conversationId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setProfile(data.profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [conversationId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Icons as inline SVGs
  const briefcaseIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
  const targetIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  const usersIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
  const academicIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  );
  const boltIcon = (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
              <span className="text-xs uppercase tracking-wide font-semibold">Loading profile...</span>
            </div>
          ) : profile ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.imageUrl}
                alt={profile.firstName}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm text-slate-500">
                  {profile.companyName}{profile.industry ? ` · ${profile.industry}` : ""}
                </p>
              </div>
            </div>
          ) : null}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#1a1f3a] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {profile && (
            <div className="space-y-6">
              {/* Coach Reflection — Full-width Premium Navy Card */}
              <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    <h3 className="text-lg font-bold">Coach Reflection</h3>
                  </div>

                  {profile.coachReflection ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm leading-relaxed text-slate-200 mb-4">
                          {profile.coachReflection.summary}
                        </p>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                          Key Drivers
                        </h4>
                        <ul className="space-y-1.5">
                          {profile.coachReflection.keyDrivers.map((d, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-[#fbbf24] mt-0.5">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                          Working Style Insights
                        </h4>
                        <ul className="space-y-1.5">
                          {profile.coachReflection.workingStyleInsights.map((w, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-[#fbbf24] mt-0.5">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">
                          Coaching Recommendations
                        </h4>
                        <ul className="space-y-1.5">
                          {profile.coachReflection.coachingRecommendations.map((r, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-[#fbbf24] mt-0.5">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-slate-400 pt-3 mt-4 border-t border-white/10">
                          Generated {formatDate(profile.coachReflection.generatedAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
                      <span>Generating reflection...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Dimension Tiles — 3 columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <ProfileSection
                    title="Role"
                    icon={briefcaseIcon}
                    data={profile.profileData.role as unknown as Record<string, unknown>}
                    fields={[
                      { label: "Title", key: "title" },
                      { label: "Department", key: "department" },
                      { label: "Years in Role", key: "yearsInRole" },
                      { label: "Team Size", key: "teamSize" },
                      { label: "Reports To", key: "reportingTo" },
                    ]}
                  />
                  <ProfileSection
                    title="Objectives"
                    icon={targetIcon}
                    data={profile.profileData.objectives as unknown as Record<string, unknown>}
                    fields={[
                      { label: "Primary Goal", key: "primaryGoal" },
                      { label: "Secondary Goals", key: "secondaryGoals", array: true },
                      { label: "Time Horizon", key: "timeHorizon" },
                      { label: "Success Metrics", key: "successMetrics", array: true },
                    ]}
                  />
                </div>

                <div className="space-y-6">
                  <ProfileSection
                    title="Leadership Style"
                    icon={usersIcon}
                    data={profile.profileData.leadershipStyle as unknown as Record<string, unknown>}
                    fields={[
                      { label: "Self-Described", key: "selfDescribed" },
                      { label: "Decision Making", key: "decisionMaking" },
                      { label: "Communication", key: "communicationPreference" },
                      { label: "Conflict Approach", key: "conflictApproach" },
                    ]}
                  />
                  <ProfileSection
                    title="Experience"
                    icon={academicIcon}
                    data={profile.profileData.experience as unknown as Record<string, unknown>}
                    fields={[
                      { label: "Industry Background", key: "industryBackground" },
                      { label: "Strategic Experience", key: "strategicExperience" },
                      { label: "Biggest Challenge", key: "biggestChallenge" },
                      { label: "Prior Coaching", key: "priorCoaching" },
                    ]}
                  />
                </div>

                <ProfileSection
                  title="Working Style"
                  icon={boltIcon}
                  data={profile.profileData.workingStyle as unknown as Record<string, unknown>}
                  fields={[
                    { label: "Preferred Pace", key: "preferredPace" },
                    { label: "Detail vs Big Picture", key: "detailVsBigPicture" },
                    { label: "Feedback Preference", key: "feedbackPreference" },
                    { label: "Learning Style", key: "learningStyle" },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
