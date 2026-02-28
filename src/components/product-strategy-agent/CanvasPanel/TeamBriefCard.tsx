'use client';

interface TeamBriefContent {
  strategic_context?: string;
  problem_statement?: string;
  success_criteria?: string[] | string;
  guardrails?: { weWill?: string; weWillNot?: string }[] | string;
  key_assumptions?: string[] | string;
  kill_criteria?: string;
  stakeholder_context?: string;
  raw?: string;
}

interface TeamBriefCardProps {
  artefact: {
    id: string;
    title: string;
    content: TeamBriefContent;
    created_at: string;
  };
}

export function TeamBriefCard({ artefact }: TeamBriefCardProps) {
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

      {c.strategic_context && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Strategic Context</span>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">{c.strategic_context}</p>
        </div>
      )}

      {c.problem_statement && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Problem Statement</span>
          <p className="text-sm text-slate-700 mt-1 leading-relaxed">{c.problem_statement}</p>
        </div>
      )}

      {c.success_criteria && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Success Criteria</span>
          {Array.isArray(c.success_criteria) ? (
            <ul className="mt-1 space-y-1">
              {c.success_criteria.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-700 mt-1">{c.success_criteria}</p>
          )}
        </div>
      )}

      {c.guardrails && Array.isArray(c.guardrails) && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Guardrails</span>
          <div className="mt-1 space-y-1.5">
            {c.guardrails.map((g, i) => (
              <div key={i} className="flex gap-3 text-sm">
                {g.weWill && (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium">
                    Will: {g.weWill}
                  </span>
                )}
                {g.weWillNot && (
                  <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">
                    Won&apos;t: {g.weWillNot}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {c.kill_criteria && (
        <div className="border-t border-slate-100 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Kill Criteria</span>
          <p className="text-sm text-slate-700 mt-1">{c.kill_criteria}</p>
        </div>
      )}
    </div>
  );
}
