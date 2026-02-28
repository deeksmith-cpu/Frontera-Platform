'use client';

interface StakeholderContent {
  executive_summary?: string;
  key_implications?: string[] | string;
  what_changes?: string[] | string;
  what_stays_same?: string[] | string;
  questions_to_address?: string[] | string;
  raw?: string;
}

interface StakeholderPackViewProps {
  artefact: {
    id: string;
    title: string;
    audience: string | null;
    content: StakeholderContent;
    created_at: string;
  };
}

const AUDIENCE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  cpo_ceo: { label: 'CPO / CEO', color: 'text-purple-700', bg: 'bg-purple-50' },
  cto: { label: 'CTO', color: 'text-cyan-700', bg: 'bg-cyan-50' },
  sales: { label: 'Sales', color: 'text-amber-700', bg: 'bg-amber-50' },
  product_managers: { label: 'Product Managers', color: 'text-emerald-700', bg: 'bg-emerald-50' },
};

function renderList(items: string[] | string | undefined, dotColor: string) {
  if (!items) return null;
  if (typeof items === 'string') return <p className="text-sm text-slate-700 mt-1 leading-relaxed">{items}</p>;
  return (
    <ul className="mt-1 space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-1.5 flex-shrink-0`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StakeholderPackView({ artefact }: StakeholderPackViewProps) {
  const c = artefact.content;
  const audienceInfo = AUDIENCE_LABELS[artefact.audience || ''];

  if (c.raw) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">{artefact.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.raw}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl p-6 space-y-4 transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900">{artefact.title}</h3>
          {audienceInfo && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${audienceInfo.color} ${audienceInfo.bg} px-2 py-0.5 rounded-full`}>
              {audienceInfo.label}
            </span>
          )}
        </div>
        <span suppressHydrationWarning className="text-[10px] text-slate-400">
          {new Date(artefact.created_at).toLocaleDateString()}
        </span>
      </div>

      {c.executive_summary && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Executive Summary</span>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">{c.executive_summary}</p>
        </div>
      )}

      {c.key_implications && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key Implications</span>
          {renderList(c.key_implications, 'bg-[#fbbf24]')}
        </div>
      )}

      {c.what_changes && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">What Changes</span>
          {renderList(c.what_changes, 'bg-amber-500')}
        </div>
      )}

      {c.what_stays_same && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">What Stays the Same</span>
          {renderList(c.what_stays_same, 'bg-emerald-500')}
        </div>
      )}

      {c.questions_to_address && (
        <div className="border-t border-slate-100 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600">Questions to Address</span>
          {renderList(c.questions_to_address, 'bg-purple-500')}
        </div>
      )}
    </div>
  );
}
