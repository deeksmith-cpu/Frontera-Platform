'use client';

import Link from 'next/link';
import type { PersonalProfileData } from '@/types/database';

interface ProfileCardProps {
  status: 'not_started' | 'in_progress' | 'completed';
  profile: PersonalProfileData | null;
}

export function ProfileCard({ status, profile }: ProfileCardProps) {
  if (status === 'completed' && profile) {
    return (
      <Link href="/dashboard/personal-profile" className="block">
        <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1a1f3a] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Profile</h3>
                <p className="text-xs text-slate-500">{profile.role.title}{profile.role.department ? ` · ${profile.role.department}` : ''}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Complete
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Style</span>
              <p className="text-slate-700 capitalize">{profile.leadershipStyle.decisionMaking}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pace</span>
              <p className="text-slate-700 capitalize">{profile.workingStyle.preferredPace}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Not started or in progress
  return (
    <Link href="/dashboard/personal-profile" className="block">
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Personal Profile</h3>
              {status === 'in_progress' && (
                <span className="text-xs text-[#fbbf24]">In progress</span>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Help your coach understand your role, goals, and leadership style for personalized guidance.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-[#f59e0b] transition-colors">
            {status === 'in_progress' ? 'Continue Profile' : 'Set Up Profile'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
