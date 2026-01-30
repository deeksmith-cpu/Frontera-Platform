'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  ChevronDown,
  Building,
  FileText,
  Sparkles,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface ContextAwarenessData {
  materialsCount: number;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  synthesisAvailable: boolean;
  hasOnboardingContext: boolean;
}

interface CoachContextAwarenessProps {
  conversation: Conversation;
}

// Context item component
function ContextItem({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  status: 'complete' | 'pending' | 'partial';
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`flex-shrink-0 ${
        status === 'complete' ? 'text-emerald-600' :
        status === 'partial' ? 'text-amber-600' :
        'text-slate-400'
      }`}>
        {icon}
      </div>
      <span className="text-sm text-slate-700 flex-1">{label}</span>
      <div className="flex-shrink-0">
        {status === 'complete' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : status === 'partial' ? (
          <Circle className="w-4 h-4 text-amber-600" />
        ) : (
          <Circle className="w-4 h-4 text-slate-300" />
        )}
      </div>
    </div>
  );
}

// Territory progress item component
function TerritoryContextItem({
  territory,
  progress,
  color,
}: {
  territory: string;
  progress: TerritoryProgress;
  color: 'indigo' | 'cyan' | 'purple';
}) {
  const percentage = progress.total > 0 ? Math.round((progress.mapped / progress.total) * 100) : 0;

  const colorClasses = {
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600' },
    cyan: { bg: 'bg-cyan-600', text: 'text-cyan-600' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600' },
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-medium ${colorClasses[color].text}`}>
          {territory} Territory
        </span>
        <span className="text-xs text-slate-500">
          {progress.mapped}/{progress.total} areas
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color].bg} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function CoachContextAwareness({ conversation }: CoachContextAwarenessProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<ContextAwarenessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch context awareness data
  useEffect(() => {
    async function fetchContextData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/product-strategy-agent/context-awareness?conversation_id=${conversation.id}`
        );
        if (response.ok) {
          const contextData = await response.json();
          setData(contextData);
        }
      } catch (error) {
        console.error('Error fetching context awareness data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContextData();
  }, [conversation.id]);

  // Calculate summary stats
  const totalAreas = 9; // 3 territories × 3 areas each
  const mappedAreas = data ? (
    data.territoryProgress.company.mapped +
    data.territoryProgress.customer.mapped +
    data.territoryProgress.competitor.mapped
  ) : 0;

  return (
    <div className="border-b border-slate-100 bg-slate-50/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#1a1f3a]" />
          <span className="text-sm font-semibold text-slate-700">What the Coach Knows</span>
        </div>
        <div className="flex items-center gap-2">
          {!isLoading && data && (
            <span className="text-xs text-slate-500">
              {data.materialsCount} doc{data.materialsCount !== 1 ? 's' : ''} · {mappedAreas}/{totalAreas} areas
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-1 animate-fade-in">
          {isLoading ? (
            <div className="py-4 text-center text-sm text-slate-500">
              Loading context...
            </div>
          ) : data ? (
            <>
              {/* Company Profile from Onboarding */}
              <ContextItem
                icon={<Building className="w-4 h-4" />}
                label="Company profile from onboarding"
                status={data.hasOnboardingContext ? 'complete' : 'pending'}
              />

              {/* Documents */}
              <ContextItem
                icon={<FileText className="w-4 h-4" />}
                label={`${data.materialsCount} strategic document${data.materialsCount !== 1 ? 's' : ''} uploaded`}
                status={data.materialsCount > 0 ? 'complete' : 'pending'}
              />

              {/* Divider */}
              <div className="border-t border-slate-100 my-2" />

              {/* Territory Progress */}
              <TerritoryContextItem
                territory="Company"
                progress={data.territoryProgress.company}
                color="indigo"
              />
              <TerritoryContextItem
                territory="Customer"
                progress={data.territoryProgress.customer}
                color="cyan"
              />
              <TerritoryContextItem
                territory="Competitor"
                progress={data.territoryProgress.competitor}
                color="purple"
              />

              {/* Synthesis */}
              {data.synthesisAvailable && (
                <>
                  <div className="border-t border-slate-100 my-2" />
                  <ContextItem
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Strategic synthesis generated"
                    status="complete"
                  />
                </>
              )}
            </>
          ) : (
            <div className="py-4 text-center text-sm text-slate-500">
              Unable to load context data
            </div>
          )}
        </div>
      )}
    </div>
  );
}
