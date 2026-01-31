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
        <div className="rounded-2xl border border-[#1a1f3a]/20 bg-[#ecfeff] p-6 transition-all duration-300 hover:shadow-lg hover:border-[#1a1f3a]/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2d3561] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1f3a]">Personal Profile</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Complete
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Your coaching profile is personalized to your goals and leadership style.
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg bg-[#1a1f3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d3561] transition-colors">
            View Profile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  // Not started or in progress
  return (
    <Link href="/dashboard/personal-profile" className="block">
      <div className="rounded-2xl border border-[#1a1f3a]/20 bg-[#ecfeff] p-6 transition-all duration-300 hover:shadow-lg hover:border-[#1a1f3a]/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#2d3561] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1a1f3a]">Personal Profile</h3>
            {status === 'in_progress' && (
              <span className="text-xs text-[#fbbf24] font-semibold">In progress</span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Help your coach understand your role, goals, and leadership style for personalized guidance.
        </p>
        <div className="inline-flex items-center gap-2 rounded-lg bg-[#1a1f3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d3561] transition-colors">
          {status === 'in_progress' ? 'Continue Profile' : 'Set Up Profile'}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
