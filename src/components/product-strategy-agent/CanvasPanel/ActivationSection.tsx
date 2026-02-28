'use client';

import { useCallback, useEffect, useState } from 'react';
import { TeamBriefCard } from './TeamBriefCard';
import { OKRCard } from './OKRCard';
import { GuardrailsCard } from './GuardrailsCard';
import { StakeholderPackView } from './StakeholderPackView';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ActivationSectionProps {
  conversation: Conversation;
}

type ArtefactType = 'team_brief' | 'guardrails' | 'okr_cascade' | 'decision_framework' | 'stakeholder_pack';
type TabId = 'team_briefs' | 'okrs' | 'guardrails' | 'stakeholder';

interface Artefact {
  id: string;
  title: string;
  artefact_type: ArtefactType;
  content: Record<string, unknown>;
  audience: string | null;
  created_at: string;
  source_bet_id: string | null;
}

const TABS: { id: TabId; label: string; types: ArtefactType[] }[] = [
  { id: 'team_briefs', label: 'Team Briefs', types: ['team_brief'] },
  { id: 'okrs', label: 'OKRs', types: ['okr_cascade'] },
  { id: 'guardrails', label: 'Guardrails', types: ['guardrails', 'decision_framework'] },
  { id: 'stakeholder', label: 'Stakeholder Packs', types: ['stakeholder_pack'] },
];

const STAKEHOLDER_AUDIENCES = [
  { value: 'cpo_ceo', label: 'CPO / CEO' },
  { value: 'cto', label: 'CTO' },
  { value: 'sales', label: 'Sales' },
  { value: 'product_managers', label: 'Product Managers' },
];

export function ActivationSection({ conversation }: ActivationSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>('team_briefs');
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  // Load existing artefacts
  useEffect(() => {
    async function loadArtefacts() {
      try {
        const res = await fetch('/api/product-strategy-agent/activation');
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
    loadArtefacts();
  }, []);

  // Generate an artefact
  const generateArtefact = useCallback(async (type: ArtefactType, betId?: string, audience?: string) => {
    const label = type === 'stakeholder_pack' ? `${type}_${audience}` : type;
    setGenerating(label);
    try {
      const res = await fetch('/api/product-strategy-agent/activation', {
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
        if (data.artefact) {
          setArtefacts((prev) => [data.artefact, ...prev]);
        }
      } else {
        const err = await res.json();
        console.error('Generate failed:', err.error);
      }
    } catch (err) {
      console.error('Generate error:', err);
    } finally {
      setGenerating(null);
    }
  }, [conversation.id]);

  // Filter artefacts for the active tab
  const currentTab = TABS.find((t) => t.id === activeTab)!;
  const filteredArtefacts = artefacts.filter((a) => currentTab.types.includes(a.artefact_type));

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 text-slate-600 text-sm py-12 justify-center">
        <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
        <span className="text-xs uppercase tracking-wide font-semibold">Loading activation artefacts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Activation Artefacts</h2>
        <p className="text-sm text-slate-500 mt-1">
          Bridge strategy to execution with team briefs, OKRs, guardrails, and stakeholder packs.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {TABS.map((tab) => {
          const count = artefacts.filter((a) => tab.types.includes(a.artefact_type)).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold transition-all duration-300 border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#fbbf24] text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* Generate Buttons */}
        {activeTab === 'team_briefs' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generateArtefact('team_brief')}
              disabled={!!generating}
              className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === 'team_brief' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                  Generating...
                </>
              ) : (
                'Generate Team Brief'
              )}
            </button>
          </div>
        )}

        {activeTab === 'okrs' && (
          <button
            onClick={() => generateArtefact('okr_cascade')}
            disabled={!!generating}
            className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating === 'okr_cascade' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                Generating...
              </>
            ) : (
              'Generate OKR Cascade'
            )}
          </button>
        )}

        {activeTab === 'guardrails' && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => generateArtefact('guardrails')}
              disabled={!!generating}
              className="inline-flex items-center gap-2 rounded-lg bg-[#fbbf24] px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === 'guardrails' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse" />
                  Generating...
                </>
              ) : (
                'Generate Guardrails'
              )}
            </button>
            <button
              onClick={() => generateArtefact('decision_framework')}
              disabled={!!generating}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating === 'decision_framework' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                  Generating...
                </>
              ) : (
                'Generate Decision Framework'
              )}
            </button>
          </div>
        )}

        {activeTab === 'stakeholder' && (
          <div className="flex flex-wrap gap-2">
            {STAKEHOLDER_AUDIENCES.map((aud) => (
              <button
                key={aud.value}
                onClick={() => generateArtefact('stakeholder_pack', undefined, aud.value)}
                disabled={!!generating}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating === `stakeholder_pack_${aud.value}` ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  aud.label
                )}
              </button>
            ))}
          </div>
        )}

        {/* Artefact List */}
        {filteredArtefacts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-500">
              No {currentTab.label.toLowerCase()} generated yet. Click above to generate.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArtefacts.map((artefact) => {
              if (artefact.artefact_type === 'team_brief') {
                return <TeamBriefCard key={artefact.id} artefact={artefact} />;
              }
              if (artefact.artefact_type === 'okr_cascade') {
                return <OKRCard key={artefact.id} artefact={artefact} />;
              }
              if (artefact.artefact_type === 'guardrails' || artefact.artefact_type === 'decision_framework') {
                return <GuardrailsCard key={artefact.id} artefact={artefact} />;
              }
              if (artefact.artefact_type === 'stakeholder_pack') {
                return <StakeholderPackView key={artefact.id} artefact={artefact} />;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
