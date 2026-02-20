'use client';

import { useRouter } from 'next/navigation';

interface CoachingTopicCardProps {
  topic: string;
  archetype?: string | null;
}

export function CoachingTopicCard({ topic, archetype }: CoachingTopicCardProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden bg-[#1a1f3a] rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#fbbf24]/20 blur-2xl" />
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
            Today&apos;s Coaching Topic
          </span>
          {archetype && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded-full">
              {archetype}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{topic}</p>
        <button
          onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b]"
        >
          Chat Now
        </button>
      </div>
    </div>
  );
}
