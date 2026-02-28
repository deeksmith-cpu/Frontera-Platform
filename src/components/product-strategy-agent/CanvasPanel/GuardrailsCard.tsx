'use client';

interface GuardrailPair {
  weWill?: string;
  weWillNot?: string;
  rationale?: string;
}

interface GuardrailsContent {
  guardrails?: GuardrailPair[];
  raw?: string;
}

interface GuardrailsCardProps {
  artefact: {
    id: string;
    title: string;
    content: GuardrailsContent;
    created_at: string;
  };
}

export function GuardrailsCard({ artefact }: GuardrailsCardProps) {
  const c = artefact.content;

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
        <h3 className="text-sm font-bold text-slate-900">{artefact.title}</h3>
        <span suppressHydrationWarning className="text-[10px] text-slate-400">
          {new Date(artefact.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="space-y-3">
        {c.guardrails?.map((g, i) => (
          <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-slate-100">
              {/* We Will */}
              <div className="p-3 bg-emerald-50/50">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">We Will</span>
                <p className="text-sm text-slate-900 mt-1 font-medium">{g.weWill}</p>
              </div>
              {/* We Will Not */}
              <div className="p-3 bg-red-50/30">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">We Will Not</span>
                <p className="text-sm text-slate-900 mt-1 font-medium">{g.weWillNot}</p>
              </div>
            </div>
            {g.rationale && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 italic">{g.rationale}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
