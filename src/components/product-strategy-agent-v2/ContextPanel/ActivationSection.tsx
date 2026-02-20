'use client';

import { useState, useEffect, useCallback } from 'react';
import { TeamBriefCard } from './TeamBriefCard';
import { GuardrailsCard } from './GuardrailsCard';
import { OKRCascadeCard } from './OKRCascadeCard';
import { DecisionFrameworkCard } from './DecisionFrameworkCard';
import { StakeholderPackViewer } from './StakeholderPackViewer';
import { EvidenceSummaryCard } from './EvidenceSummaryCard';
import { AssumptionTracker } from './AssumptionTracker';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ActivationSectionProps {
  conversation: Conversation;
}

interface Artefact {
  id: string;
  artefact_type: string;
  title: string;
  content: Record<string, unknown>;
  audience: string | null;
  share_token: string | null;
  created_at: string;
}

type ActivationTab = 'briefs' | 'guardrails' | 'okrs' | 'decisions' | 'stakeholders' | 'evidence' | 'assumptions';

const TABS: { id: ActivationTab; label: string }[] = [
  { id: 'briefs', label: 'Team Briefs' },
  { id: 'guardrails', label: 'Guardrails' },
  { id: 'okrs', label: 'OKRs' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'assumptions', label: 'Assumptions' },
];

export function ActivationSection({ conversation }: ActivationSectionProps) {
  const [activeTab, setActiveTab] = useState<ActivationTab>('briefs');
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    loadArtefacts();
  }, [conversation.id]);

  async function loadArtefacts() {
    try {
      const res = await fetch('/api/product-strategy-agent-v2/activation');
      if (res.ok) {
        const data = await res.json();
        setArtefacts(data.artefacts || []);
      }
    } catch (err) {
      console.error('Failed to load artefacts:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = useCallback(
    async (type: string, betId?: string, audience?: string) => {
      setGenerating(type);
      try {
        const res = await fetch('/api/product-strategy-agent-v2/activation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            conversationId: conversation.id,
            betId,
            audience,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setArtefacts((prev) => [data.artefact, ...prev]);
        }
      } catch (err) {
        console.error('Failed to generate artefact:', err);
      } finally {
        setGenerating(null);
      }
    },
    [conversation.id]
  );

  const briefs = artefacts.filter((a) => a.artefact_type === 'team_brief');
  const guardrails = artefacts.filter((a) => a.artefact_type === 'guardrails');
  const okrs = artefacts.filter((a) => a.artefact_type === 'okr_cascade');
  const decisions = artefacts.filter((a) => a.artefact_type === 'decision_framework');
  const stakeholders = artefacts.filter((a) => a.artefact_type === 'stakeholder_pack');

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-600 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-xs uppercase tracking-wide font-semibold">Loading activation artefacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border-b border-slate-100 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1a1f3a] text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {activeTab === 'briefs' && (
          <TeamBriefCard
            briefs={briefs}
            onGenerate={() => handleGenerate('team_brief')}
            generating={generating === 'team_brief'}
          />
        )}
        {activeTab === 'guardrails' && (
          <GuardrailsCard
            guardrails={guardrails}
            onGenerate={() => handleGenerate('guardrails')}
            generating={generating === 'guardrails'}
          />
        )}
        {activeTab === 'okrs' && (
          <OKRCascadeCard
            okrs={okrs}
            onGenerate={() => handleGenerate('okr_cascade')}
            generating={generating === 'okr_cascade'}
          />
        )}
        {activeTab === 'decisions' && (
          <DecisionFrameworkCard
            decisions={decisions}
            onGenerate={() => handleGenerate('decision_framework')}
            generating={generating === 'decision_framework'}
          />
        )}
        {activeTab === 'stakeholders' && (
          <StakeholderPackViewer
            packs={stakeholders}
            onGenerate={(audience) => handleGenerate('stakeholder_pack', undefined, audience)}
            generating={generating === 'stakeholder_pack'}
          />
        )}
        {activeTab === 'evidence' && (
          <EvidenceSummaryCard conversationId={conversation.id} />
        )}
        {activeTab === 'assumptions' && (
          <AssumptionTracker conversationId={conversation.id} />
        )}
      </div>
    </div>
  );
}
