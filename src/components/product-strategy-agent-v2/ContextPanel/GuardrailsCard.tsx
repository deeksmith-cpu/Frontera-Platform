'use client';

interface Artefact {
  id: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface GuardrailsCardProps {
  guardrails: Artefact[];
  onGenerate: () => void;
  generating: boolean;
}

export function GuardrailsCard({ guardrails, onGenerate, generating }: GuardrailsCardProps) {
  if (guardrails.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-sm text-slate-500">No strategic guardrails generated yet.</p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Guardrails'}
        </button>
      </div>
    );
  }

  const latest = guardrails[0];
  const items = (latest.content.guardrails as Array<{ weWill: string; weWillNot: string; rationale?: string }>) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Strategic Guardrails
        </span>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors disabled:opacity-50"
        >
          {generating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {items.map((item, i) => (
        <div key={i} className="bg-white border border-cyan-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-4 bg-emerald-50/50 border-r border-cyan-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">We Will</span>
              <p className="text-xs text-slate-700 mt-1">{item.weWill}</p>
            </div>
            <div className="p-4 bg-red-50/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">We Will Not</span>
              <p className="text-xs text-slate-700 mt-1">{item.weWillNot}</p>
            </div>
          </div>
          {item.rationale && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 italic">{item.rationale}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
