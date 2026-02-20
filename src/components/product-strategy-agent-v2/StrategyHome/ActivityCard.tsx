'use client';

import { useRouter } from 'next/navigation';

interface ActivityCardProps {
  phase: string;
  archetype?: string | null;
  mappedAreas: number;
}

interface Activity {
  title: string;
  description: string;
  timeEstimate: string;
  priority: 'high' | 'medium' | 'low';
}

function getRecommendedActivities(phase: string, mappedAreas: number, archetype?: string | null): Activity[] {
  const activities: Activity[] = [];

  if (phase === 'discovery') {
    activities.push({
      title: 'Upload Strategic Documents',
      description: 'Add annual reports, strategic plans, or market analyses to set context.',
      timeEstimate: '~5 min',
      priority: 'high',
    });
    activities.push({
      title: 'Complete Discovery Conversation',
      description: 'Discuss competitive landscape and strategic urgency with your coach.',
      timeEstimate: '~15 min',
      priority: 'medium',
    });
  } else if (phase === 'research') {
    const unmapped = 9 - mappedAreas;
    if (unmapped > 0) {
      activities.push({
        title: `Map ${unmapped} Remaining Research Areas`,
        description: 'Complete territory mapping across Company, Customer, and Market.',
        timeEstimate: `~${unmapped * 8} min`,
        priority: 'high',
      });
    }
    if (mappedAreas >= 3) {
      activities.push({
        title: 'Review Micro-Synthesis Insights',
        description: 'Explore territorial findings and discuss with your coach.',
        timeEstimate: '~10 min',
        priority: 'medium',
      });
    }
  } else if (phase === 'synthesis') {
    activities.push({
      title: 'Explore Strategic Opportunities',
      description: 'Review synthesised opportunities and tensions.',
      timeEstimate: '~15 min',
      priority: 'high',
    });
  } else if (phase === 'bets') {
    activities.push({
      title: 'Refine Strategic Bets',
      description: 'Add kill criteria, link evidence, and score each bet.',
      timeEstimate: '~20 min',
      priority: 'high',
    });
  }

  // Archetype-specific recommendations
  if (archetype === 'operator') {
    activities.push({
      title: 'Challenge Your Execution Focus',
      description: 'Step back from "how" to explore "why" with strategic reflection.',
      timeEstimate: '~10 min',
      priority: 'low',
    });
  } else if (archetype === 'visionary') {
    activities.push({
      title: 'Ground Your Vision',
      description: 'Add measurable metrics and evidence links to your strategic bets.',
      timeEstimate: '~10 min',
      priority: 'low',
    });
  }

  return activities.slice(0, 3);
}

export function ActivityCard({ phase, archetype, mappedAreas }: ActivityCardProps) {
  const router = useRouter();
  const activities = getRecommendedActivities(phase, mappedAreas, archetype);

  if (activities.length === 0) return null;

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Recommended Activities
      </span>
      <div className="mt-3 space-y-3">
        {activities.map((activity, idx) => (
          <button
            key={idx}
            onClick={() => router.push('/dashboard/product-strategy-agent-v2')}
            className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-[#1a1f3a]">
                  {activity.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{activity.description}</p>
              </div>
              <span className="flex-shrink-0 ml-3 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                {activity.timeEstimate}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
