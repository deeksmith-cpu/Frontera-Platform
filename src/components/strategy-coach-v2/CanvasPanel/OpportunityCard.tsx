'use client';

interface OpportunityCardProps {
  title: string;
  description: string;
  type: 'market_opportunity' | 'validated_problem' | 'org_readiness';
  evidenceCount: number;
  confidence: 'low' | 'medium' | 'high';
  score: number;
}

export function OpportunityCard({
  title,
  description,
  type,
  evidenceCount,
  confidence,
  score,
}: OpportunityCardProps) {
  const typeLabels = {
    market_opportunity: 'Market Opportunity',
    validated_problem: 'Validated Problem',
    org_readiness: 'Organizational Readiness',
  };

  return (
    <div className="opportunity-card bg-surface-white border border-border-subtle rounded-md p-6 transition-all hover:border-accent-amber hover:shadow-lg">
      <div className="opportunity-label font-mono text-[11px] uppercase tracking-wider text-accent-amber mb-2 font-medium">
        {typeLabels[type]}
      </div>
      <h4 className="opportunity-title font-display text-xl font-semibold text-primary-ink mb-2 leading-tight">
        {title}
      </h4>
      <p className="opportunity-description text-[15px] leading-relaxed text-secondary-ink mb-4">
        {description}
      </p>
      <div className="opportunity-meta flex gap-6 pt-4 border-t border-surface-fog">
        <div className="meta-item flex flex-col gap-1">
          <div className="meta-label font-mono text-[10px] uppercase tracking-wider text-tertiary-ink">
            Evidence
          </div>
          <div className="meta-value font-display text-lg font-semibold text-primary-ink">
            {evidenceCount} sources
          </div>
        </div>
        <div className="meta-item flex flex-col gap-1">
          <div className="meta-label font-mono text-[10px] uppercase tracking-wider text-tertiary-ink">
            Confidence
          </div>
          <div className="meta-value font-display text-lg font-semibold text-primary-ink capitalize">
            {confidence}
          </div>
        </div>
        <div className="meta-item flex flex-col gap-1">
          <div className="meta-label font-mono text-[10px] uppercase tracking-wider text-tertiary-ink">
            Score
          </div>
          <div className="meta-value font-display text-lg font-semibold text-primary-ink">
            {score}/100
          </div>
        </div>
      </div>
    </div>
  );
}
