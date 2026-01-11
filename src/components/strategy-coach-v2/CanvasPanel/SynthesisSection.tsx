'use client';

import { OpportunityCard } from './OpportunityCard';
import { AIInsightCallout } from './AIInsightCallout';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface SynthesisSectionProps {
  conversation: Conversation;
  completedPillars: number;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'market_opportunity' | 'validated_problem' | 'org_readiness';
  evidenceCount: number;
  confidence: 'low' | 'medium' | 'high';
  score: number;
}

export function SynthesisSection({ conversation, completedPillars }: SynthesisSectionProps) {
  // Extract synthesis from framework_state
  const frameworkState = (conversation.framework_state as Record<string, unknown>) || {};
  const synthesis = (frameworkState.synthesis as { opportunities: Opportunity[] }) || { opportunities: [] };

  // Mock opportunities for demo (in production these come from AI synthesis)
  const mockOpportunities: Opportunity[] = synthesis.opportunities.length > 0 ? synthesis.opportunities : [
    {
      id: 'opp1',
      title: 'Consolidator Platform Suite',
      description: 'Leverage tax-wrapper expertise and integration depth to build scalable operations platform for PE-backed consolidators. Your existing partnerships create moat.',
      type: 'market_opportunity',
      evidenceCount: 12,
      confidence: 'high',
      score: 87,
    },
    {
      id: 'opp2',
      title: 'Bulk Migration Capability',
      description: 'Consolidators cite migration complexity as #1 barrier. Your integration partnerships position you to solve this better than platform-only competitors.',
      type: 'validated_problem',
      evidenceCount: 8,
      confidence: 'medium',
      score: 73,
    },
  ];

  return (
    <div className="synthesis-section mt-16 pt-16 border-t-2 border-border-subtle">
      {/* Header */}
      <div className="synthesis-header mb-10">
        <div className="synthesis-label font-mono text-[11px] uppercase tracking-[0.1em] text-tertiary-ink mb-2 font-medium">
          Cross-Pillar Synthesis
        </div>
        <h3 className="synthesis-title font-display text-4xl font-semibold leading-tight text-primary-ink mb-4">
          Strategic Opportunities
        </h3>
        <p className="synthesis-description text-[17px] leading-relaxed text-secondary-ink max-w-3xl">
          Based on your {completedPillars === 3 ? 'complete 3Cs analysis' : `analysis of ${completedPillars} pillars`}, these opportunities represent validated whitespace where your capabilities align with market needs.
        </p>
      </div>

      {/* Opportunity Grid */}
      <div className="opportunity-grid grid grid-cols-2 gap-6">
        {mockOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            title={opportunity.title}
            description={opportunity.description}
            type={opportunity.type}
            evidenceCount={opportunity.evidenceCount}
            confidence={opportunity.confidence}
            score={opportunity.score}
          />
        ))}
      </div>

      {/* AI Insight */}
      {completedPillars < 3 && (
        <AIInsightCallout
          message="Once you complete the Competitor pillar, I'll analyze whether Nucleus, Quilter, and Transact have vulnerabilities in consolidator servicing that you can exploit. Your integration moat is defensible, but we need to validate their pricing rigidity creates an opening."
        />
      )}
    </div>
  );
}
