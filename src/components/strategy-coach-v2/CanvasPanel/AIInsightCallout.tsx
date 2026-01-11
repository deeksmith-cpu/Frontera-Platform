'use client';

interface AIInsightCalloutProps {
  message: string;
}

export function AIInsightCallout({ message }: AIInsightCalloutProps) {
  return (
    <div className="ai-insight mt-10 p-6 bg-gradient-to-br from-accent-cardinal/4 to-accent-amber/2 border-l-[3px] border-accent-cardinal rounded">
      <div className="ai-insight-header flex items-center gap-2 mb-4">
        <div className="ai-icon w-8 h-8 bg-gradient-to-br from-accent-cardinal to-accent-amber rounded-full flex items-center justify-center text-white text-sm font-semibold">
          AI
        </div>
        <div className="ai-insight-label font-mono text-[11px] uppercase tracking-wider text-accent-cardinal font-medium">
          Strategic Insight
        </div>
      </div>
      <div className="ai-insight-content text-base leading-relaxed text-secondary-ink italic">
        {message}
      </div>
    </div>
  );
}
