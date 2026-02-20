'use client';

interface Artefact {
  id: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface DecisionFrameworkCardProps {
  decisions: Artefact[];
  onGenerate: () => void;
  generating: boolean;
}

interface FrameworkItem {
  rule: string;
  context: string;
}

interface Framework {
  prioritise: FrameworkItem[];
  consider: FrameworkItem[];
  deprioritise: FrameworkItem[];
}

export function DecisionFrameworkCard({ decisions, onGenerate, generating }: DecisionFrameworkCardProps) {
  if (decisions.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-sm text-slate-500">No decision framework generated yet.</p>
        <p className="text-[11px] text-slate-400">Generate guardrails first, then create a decision framework.</p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Decision Framework'}
        </button>
      </div>
    );
  }

  const latest = decisions[0];
  const framework = (latest.content.framework as Framework) || { prioritise: [], consider: [], deprioritise: [] };

  const sections: { key: keyof Framework; label: string; color: string; bgColor: string }[] = [
    { key: 'prioritise', label: 'Prioritise', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
    { key: 'consider', label: 'Consider', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
    { key: 'deprioritise', label: 'Deprioritise', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Decision Framework
        </span>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors disabled:opacity-50"
        >
          {generating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="space-y-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${section.color}`}>
            {section.label}
          </span>
          {(framework[section.key] || []).map((item, i) => (
            <div key={i} className={`p-3 rounded-xl border ${section.bgColor}`}>
              <p className="text-xs font-semibold text-slate-900">{item.rule}</p>
              {item.context && (
                <p className="text-[11px] text-slate-500 mt-0.5">{item.context}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
