'use client';

import { useState, useEffect } from 'react';
import { Rocket, FileCheck, CheckCircle2 } from 'lucide-react';

interface Artefact {
  id: string;
  artefact_type: string;
  title: string;
  audience: string | null;
  is_living: boolean;
  created_at: string;
}

interface ActivationPreviewProps {
  conversationId: string | null;
}

const ARTEFACT_LABELS: Record<string, string> = {
  team_brief: 'Team Brief',
  guardrails: 'Strategic Guardrails',
  okr_cascade: 'OKR Cascade',
  decision_framework: 'Decision Framework',
  stakeholder_pack: 'Stakeholder Pack',
  evidence_summary: 'Evidence Summary',
};

const ARTEFACT_ORDER = [
  'team_brief',
  'guardrails',
  'okr_cascade',
  'decision_framework',
  'stakeholder_pack',
  'evidence_summary',
];

export function ActivationPreview({ conversationId }: ActivationPreviewProps) {
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchArtefacts() {
      try {
        const res = await fetch('/api/product-strategy-agent/activation');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.artefacts) {
          // Filter to only artefacts for this conversation
          const filtered = (data.artefacts as Artefact[]).filter((a) =>
            // The activation API returns all org artefacts; check if conversation_id matches
            // Since the API doesn't return conversation_id in the data, we show all
            a.id
          );
          setArtefacts(filtered);
        }
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchArtefacts();
    return () => { cancelled = true; };
  }, [conversationId]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-28" />
        <div className="h-12 bg-slate-50 rounded-2xl" />
        <div className="h-12 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  if (artefacts.length === 0) {
    return (
      <div className="text-center py-8">
        <Rocket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No artefacts generated yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Generate activation artefacts from your strategic bets
        </p>
      </div>
    );
  }

  // Group by type for checklist display
  const generatedTypes = new Set(artefacts.map((a) => a.artefact_type));

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileCheck className="w-4 h-4 text-cyan-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Activation Artefacts
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-code">
            {artefacts.length}
          </span>
          <span className="text-sm text-slate-500">
            artefact{artefacts.length !== 1 ? 's' : ''} generated
          </span>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5">
        {ARTEFACT_ORDER.map((type) => {
          const isGenerated = generatedTypes.has(type);
          const matchingArtefacts = artefacts.filter((a) => a.artefact_type === type);

          return (
            <div
              key={type}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300 ${
                isGenerated
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-slate-50/50 border-slate-100'
              }`}
            >
              {isGenerated ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${isGenerated ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                  {ARTEFACT_LABELS[type] || type}
                </span>
                {matchingArtefacts.length > 1 && (
                  <span className="text-[10px] text-slate-400 ml-1.5">
                    ({matchingArtefacts.length})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
