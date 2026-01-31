'use client';

import type { PersonalProfileData } from '@/types/database';

interface ProfileSummaryProps {
  profile: PersonalProfileData;
  onRedo: () => void;
}

const DIMENSION_CONFIG = [
  {
    key: 'role' as const,
    label: 'Role & Context',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    fields: (p: PersonalProfileData) => [
      { label: 'Title', value: p.role.title },
      { label: 'Department', value: p.role.department },
      { label: 'Time in role', value: p.role.yearsInRole },
      { label: 'Team size', value: p.role.teamSize },
    ],
  },
  {
    key: 'objectives' as const,
    label: 'Objectives & Drivers',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    fields: (p: PersonalProfileData) => [
      { label: 'Primary goal', value: p.objectives.primaryGoal },
      { label: 'Time horizon', value: p.objectives.timeHorizon },
      { label: 'Success metrics', value: p.objectives.successMetrics.join(', ') },
    ],
  },
  {
    key: 'leadershipStyle' as const,
    label: 'Leadership Style',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    fields: (p: PersonalProfileData) => [
      { label: 'Decision-making', value: p.leadershipStyle.decisionMaking },
      { label: 'Communication', value: p.leadershipStyle.communicationPreference },
      { label: 'Conflict approach', value: p.leadershipStyle.conflictApproach },
    ],
  },
  {
    key: 'experience' as const,
    label: 'Experience & Background',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    fields: (p: PersonalProfileData) => [
      { label: 'Strategic experience', value: p.experience.strategicExperience },
      { label: 'Biggest challenge', value: p.experience.biggestChallenge },
      { label: 'Prior coaching', value: p.experience.priorCoaching },
    ],
  },
  {
    key: 'workingStyle' as const,
    label: 'Working Style',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fields: (p: PersonalProfileData) => [
      { label: 'Preferred pace', value: p.workingStyle.preferredPace },
      { label: 'Detail vs big picture', value: p.workingStyle.detailVsBigPicture },
      { label: 'Feedback preference', value: p.workingStyle.feedbackPreference },
      { label: 'Learning style', value: p.workingStyle.learningStyle },
    ],
  },
];

export function ProfileSummary({ profile, onRedo }: ProfileSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Profile</h2>
          <p className="text-sm text-slate-500 mt-1">How the coach understands you</p>
        </div>
        <button
          onClick={onRedo}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Redo Conversation
        </button>
      </div>

      {/* Coaching Approach Callout */}
      {profile.coachingApproach && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#fbbf24] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Recommended Coaching Approach</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold capitalize">{profile.coachingApproach.recommendedPersona}</span> — {profile.coachingApproach.reasoning}
          </p>
          <p className="text-xs text-slate-500 mt-2">You can switch your coaching persona anytime from the conversation settings.</p>
        </div>
      )}

      {/* Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIMENSION_CONFIG.map(dim => (
          <div key={dim.key} className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#1a1f3a] flex items-center justify-center text-[#fbbf24]">
                {dim.icon}
              </div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{dim.label}</h3>
            </div>
            <div className="space-y-2">
              {dim.fields(profile).filter(f => f.value).map((field, i) => (
                <div key={i}>
                  <span className="text-xs font-semibold text-slate-400">{field.label}</span>
                  <p className="text-sm text-slate-700">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
