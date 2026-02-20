'use client';

interface Artefact {
  id: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface TeamBriefCardProps {
  briefs: Artefact[];
  onGenerate: () => void;
  generating: boolean;
}

export function TeamBriefCard({ briefs, onGenerate, generating }: TeamBriefCardProps) {
  const handleExport = async (artefactId: string) => {
    const res = await fetch('/api/product-strategy-agent-v2/activation/team-briefs/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artefactId }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-brief-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (briefs.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-sm text-slate-500">No team briefs generated yet.</p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate Team Brief'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Team Briefs ({briefs.length})
        </span>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors disabled:opacity-50"
        >
          {generating ? 'Generating...' : '+ Generate New'}
        </button>
      </div>

      {briefs.map((brief) => {
        const content = brief.content;
        return (
          <div key={brief.id} className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">{brief.title}</h3>

            {typeof content.strategicContext === 'string' && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Context</span>
                <p className="text-xs text-slate-600 mt-0.5">{content.strategicContext}</p>
              </div>
            )}

            {typeof content.problemStatement === 'string' && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Problem</span>
                <p className="text-xs text-slate-600 mt-0.5">{content.problemStatement}</p>
              </div>
            )}

            {Array.isArray(content.successCriteria) && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Success Criteria</span>
                <ul className="mt-1 space-y-0.5">
                  {(content.successCriteria as string[]).map((c, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleExport(brief.id)}
                className="text-[11px] font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
