'use client';

import { useEffect, useState } from 'react';
import { ProgressCard } from './ProgressCard';
import { CoachingTopicCard } from './CoachingTopicCard';
import { SignalCard } from './SignalCard';
import { ActivityCard } from './ActivityCard';
import { ReviewCard } from './ReviewCard';
import { SynthesisPreviewCard } from './SynthesisPreviewCard';
import { CoachEntryBar } from './CoachEntryBar';

interface HomeData {
  conversation: { id: string; currentPhase: string; lastActivity: string | null } | null;
  progress: {
    phase: string;
    percentage: number;
    mappedAreas: number;
    totalAreas: number;
    opportunityCount: number;
    betCount: number;
  };
  assessment: {
    archetype: string;
    overall_maturity: number;
    strengths: string[];
    growth_areas: string[];
  } | null;
  coachingTopic: string;
  latestSignals: Array<{ id: string; title: string; signal_type: string; created_at: string }>;
  upcomingReviews: Array<{ id: string; job_to_be_done: string; kill_date: string | null; status: string }>;
  microSynthesis: Record<string, unknown> | null;
  synthesisPreview: string | null;
}

interface StrategyHomeDashboardProps {
  userName: string;
}

export function StrategyHomeDashboard({ userName }: StrategyHomeDashboardProps) {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const res = await fetch('/api/product-strategy-agent-v2/home');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-600 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-xs uppercase tracking-wide font-semibold">Loading your strategy home...</span>
        </div>
      </div>
    );
  }

  const greeting = getGreeting();
  const phase = data?.progress?.phase || 'discovery';
  const archetype = data?.assessment?.archetype || null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {userName}
          </h1>
          <p className="text-sm text-slate-500">
            {data?.conversation
              ? `Your strategy is in the ${phase} phase.`
              : 'Start your strategic coaching journey.'}
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Row 1: Progress + Coaching Topic */}
          {data?.progress && (
            <ProgressCard
              phase={data.progress.phase}
              percentage={data.progress.percentage}
              mappedAreas={data.progress.mappedAreas}
              totalAreas={data.progress.totalAreas}
              opportunityCount={data.progress.opportunityCount}
              betCount={data.progress.betCount}
            />
          )}
          <CoachingTopicCard
            topic={data?.coachingTopic || 'Start your strategy journey.'}
            archetype={archetype}
          />

          {/* Row 2: Activity + Synthesis Preview */}
          <ActivityCard
            phase={phase}
            archetype={archetype}
            mappedAreas={data?.progress?.mappedAreas || 0}
          />
          <SynthesisPreviewCard
            microSynthesis={data?.microSynthesis as Record<string, { keyFindings: Array<{ title: string; description: string }>; overallConfidence: string; strategicImplication: string }> | null}
            synthesisPreview={data?.synthesisPreview || null}
          />

          {/* Row 3: Signals + Reviews */}
          <SignalCard signals={data?.latestSignals || []} />
          <ReviewCard upcomingReviews={data?.upcomingReviews || []} />
        </div>

        {/* Coach Entry Bar */}
        <div className="pt-4">
          <CoachEntryBar />
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
