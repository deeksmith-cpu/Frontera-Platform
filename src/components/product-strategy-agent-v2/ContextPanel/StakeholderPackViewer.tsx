'use client';

import { useState } from 'react';

interface Artefact {
  id: string;
  title: string;
  content: Record<string, unknown>;
  audience: string | null;
  created_at: string;
}

interface StakeholderPackViewerProps {
  packs: Artefact[];
  onGenerate: (audience: string) => void;
  generating: boolean;
}

const AUDIENCES = [
  { id: 'cpo_ceo', label: 'CPO/CEO' },
  { id: 'cto', label: 'CTO/Engineering' },
  { id: 'sales', label: 'Sales & CS' },
  { id: 'product_managers', label: 'Product Managers' },
];

export function StakeholderPackViewer({ packs, onGenerate, generating }: StakeholderPackViewerProps) {
  const [selectedAudience, setSelectedAudience] = useState<string | null>(
    packs.length > 0 ? packs[0].audience : null
  );

  const selectedPack = packs.find((p) => p.audience === selectedAudience);

  return (
    <div className="space-y-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Stakeholder Communication Packs
      </span>

      {/* Audience tabs */}
      <div className="flex flex-wrap gap-2">
        {AUDIENCES.map((aud) => {
          const exists = packs.some((p) => p.audience === aud.id);
          return (
            <button
              key={aud.id}
              onClick={() => {
                if (exists) {
                  setSelectedAudience(aud.id);
                } else {
                  onGenerate(aud.id);
                }
              }}
              disabled={generating}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                selectedAudience === aud.id
                  ? 'bg-[#1a1f3a] text-white'
                  : exists
                  ? 'bg-white border border-cyan-200 text-slate-700 hover:bg-cyan-50'
                  : 'bg-white border border-dashed border-slate-300 text-slate-400 hover:border-[#fbbf24] hover:text-slate-600'
              } ${generating ? 'opacity-50' : ''}`}
            >
              {exists ? aud.label : `+ ${aud.label}`}
            </button>
          );
        })}
      </div>

      {generating && (
        <div className="flex items-center gap-2.5 text-slate-600 text-sm py-4">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-xs uppercase tracking-wide font-semibold">Generating stakeholder brief...</span>
        </div>
      )}

      {/* Selected pack content */}
      {selectedPack && (
        <div className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {(selectedPack.content.audienceLabel as string) || selectedPack.audience}
            </h3>
          </div>

          {typeof selectedPack.content.executiveSummary === 'string' && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Executive Summary</span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{selectedPack.content.executiveSummary}</p>
            </div>
          )}

          {Array.isArray(selectedPack.content.keyImplications) && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key Implications</span>
              <ul className="mt-1 space-y-1">
                {(selectedPack.content.keyImplications as string[]).map((imp, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 flex-shrink-0" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(selectedPack.content.whatChanges) && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">What Changes</span>
              <ul className="mt-1 space-y-1">
                {(selectedPack.content.whatChanges as string[]).map((change, i) => (
                  <li key={i} className="text-xs text-slate-600">→ {change}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(selectedPack.content.questionsToAddress) && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Questions to Address</span>
              <ul className="mt-1 space-y-1">
                {(selectedPack.content.questionsToAddress as string[]).map((q, i) => (
                  <li key={i} className="text-xs text-slate-600">? {q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!selectedPack && !generating && (
        <p className="text-sm text-slate-500 text-center py-4">
          Select an audience above to generate or view a stakeholder brief.
        </p>
      )}
    </div>
  );
}
