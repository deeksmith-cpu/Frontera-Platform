'use client';

import { useState } from 'react';
import { DiscoverySection } from './DiscoverySection';
import { PillarCard } from './PillarCard';
import { SynthesisSection } from './SynthesisSection';
import { SynthesisTeaser } from './SynthesisTeaser';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ThreeCsCanvasProps {
  conversation: Conversation;
  userId: string;
  orgId: string;
}

// Define pillar state type
interface PillarState {
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  insights: Array<{
    id: string;
    content: string;
    category: string;
  }>;
}

export function ThreeCsCanvas({ conversation, userId, orgId }: ThreeCsCanvasProps) {
  const [activePillar, setActivePillar] = useState<'company' | 'customer' | 'competitor' | null>(null);

  // Extract pillar states from framework_state
  const frameworkState = (conversation.framework_state as any) || {};
  const pillars = frameworkState.pillars || {
    company: { status: 'pending', progress: 0, insights: [] },
    customer: { status: 'pending', progress: 0, insights: [] },
    competitor: { status: 'pending', progress: 0, insights: [] },
  };

  const companyPillar: PillarState = pillars.company || { status: 'pending', progress: 0, insights: [] };
  const customerPillar: PillarState = pillars.customer || { status: 'pending', progress: 0, insights: [] };
  const competitorPillar: PillarState = pillars.competitor || { status: 'pending', progress: 0, insights: [] };

  const handlePillarClick = (pillarName: 'company' | 'customer' | 'competitor') => {
    setActivePillar(pillarName);
    // TODO: Notify coaching panel to focus on this pillar
  };

  // Check if synthesis should be shown (2+ pillars complete)
  const completedCount = [companyPillar, customerPillar, competitorPillar].filter(
    p => p.status === 'completed'
  ).length;
  const showSynthesis = completedCount >= 2;

  return (
    <div className="canvas-3cs max-w-6xl mx-auto">
      {/* Section 1: Discovery */}
      <DiscoverySection conversation={conversation} />

      {/* Section 2: 3Cs Research */}
      <section className="research-section mb-16">
        <div className="section-header mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-cyan-600 font-bold text-sm">
              2
            </div>
            <h3 className="text-3xl font-bold text-slate-900">3Cs Research</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-500 bg-teal-50 px-3 py-1.5 rounded-full">
              Terrain Mapping
            </span>
          </div>
          <p className="text-base text-slate-500 ml-[52px] leading-relaxed">
            Map your strategic landscape across Company, Customer, and Competitor pillars
          </p>
        </div>

        {/* 3Cs Pillar Diagram */}
        <div className="canvas-3cs-diagram grid grid-cols-3 gap-6 relative">
        {/* Connection line overlay */}
        <div className="absolute top-1/2 left-[33.33%] right-[33.33%] h-0.5 bg-gradient-to-r from-border-subtle via-accent-teal to-border-subtle -translate-y-1/2 z-0" />

        <PillarCard
          pillar="company"
          icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="8" y="6" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M12 10H20M12 14H20M12 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><rect x="14" y="22" width="4" height="4" fill="currentColor" /></svg>}
          title="Company"
          subtitle="Internal capabilities & organizational readiness"
          status={companyPillar.status}
          progress={companyPillar.progress}
          insights={companyPillar.insights}
          isActive={activePillar === 'company'}
          onClick={() => handlePillarClick('company')}
        />

        <PillarCard
          pillar="customer"
          icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="2" /><path d="M8 26C8 21 11.5 18 16 18C20.5 18 24 21 24 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="24" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /><circle cx="8" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" /></svg>}
          title="Customer"
          subtitle="Market segments & unmet needs"
          status={customerPillar.status}
          progress={customerPillar.progress}
          insights={customerPillar.insights}
          isActive={activePillar === 'customer'}
          onClick={() => handlePillarClick('customer')}
        />

        <PillarCard
          pillar="competitor"
          icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="2" /><path d="M16 4V28M4 10L28 22M28 10L4 22" stroke="currentColor" strokeWidth="1.5" opacity="0.3" /><circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.2" /></svg>}
          title="Competitor"
          subtitle="Competitive landscape & market dynamics"
          status={competitorPillar.status}
          progress={competitorPillar.progress}
          insights={competitorPillar.insights}
          isActive={activePillar === 'competitor'}
          onClick={() => handlePillarClick('competitor')}
        />
        </div>
      </section>

      {/* Section 3: Synthesis */}
      {showSynthesis ? (
        <SynthesisSection
          conversation={conversation}
          completedPillars={completedCount}
        />
      ) : (
        <SynthesisTeaser />
      )}
    </div>
  );
}
