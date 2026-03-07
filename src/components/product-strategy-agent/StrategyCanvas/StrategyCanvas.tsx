'use client';

import {
  Compass,
  Map,
  Lightbulb,
  Target,
  Rocket,
  RefreshCw,
} from 'lucide-react';
import { DiscoveryPreview } from '../ContextPreviewPanel/previews/DiscoveryPreview';
import { ResearchCanvasView } from '../ContextPreviewPanel/previews/ResearchCanvasView';
import { SynthesisPreview } from '../ContextPreviewPanel/previews/SynthesisPreview';
import { BetsPreview } from '../ContextPreviewPanel/previews/BetsPreview';
import { ActivationPreview } from '../ContextPreviewPanel/previews/ActivationPreview';
import { ReviewPreview } from '../ContextPreviewPanel/previews/ReviewPreview';

interface StrategyCanvasProps {
  conversationId: string | null;
  currentPhase: string;
  onResearchAreaClick?: (territory: string, areaId: string) => void;
  className?: string;
}

const PHASE_CONFIG: Record<string, { title: string; icon: typeof Compass; iconBg: string; iconColor: string }> = {
  discovery: { title: 'Discovery Materials', icon: Compass, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  research: { title: 'Strategic Terrain Map', icon: Map, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  synthesis: { title: 'Pattern Recognition', icon: Lightbulb, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  bets: { title: 'Strategic Bets Portfolio', icon: Target, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  activation: { title: 'Activation Artefacts', icon: Rocket, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  review: { title: 'Living Strategy', icon: RefreshCw, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
};

export function StrategyCanvas({
  conversationId,
  currentPhase,
  className = '',
}: StrategyCanvasProps) {
  const phase = PHASE_CONFIG[currentPhase] || PHASE_CONFIG.discovery;
  const PhaseIcon = phase.icon;

  return (
    <aside
      className={`w-[260px] flex-shrink-0 flex flex-col bg-white border-l border-slate-100 overflow-hidden animate-entrance ${className}`}
    >
      {/* Canvas Header */}
      <div className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 border-t-2 border-t-cyan-200/40 bg-white/80 backdrop-blur-sm">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${phase.iconBg} flex-shrink-0`}>
          <PhaseIcon className={`w-3.5 h-3.5 ${phase.iconColor}`} />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Strategy Canvas
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {phase.title}
          </p>
        </div>
      </div>

      {/* Canvas Content - phase-routed previews */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {currentPhase === 'discovery' && (
          <DiscoveryPreview conversationId={conversationId} />
        )}
        {currentPhase === 'research' && (
          <ResearchCanvasView conversationId={conversationId} />
        )}
        {currentPhase === 'synthesis' && (
          <SynthesisPreview conversationId={conversationId} />
        )}
        {currentPhase === 'bets' && (
          <BetsPreview conversationId={conversationId} />
        )}
        {currentPhase === 'activation' && (
          <ActivationPreview conversationId={conversationId} />
        )}
        {currentPhase === 'review' && (
          <ReviewPreview />
        )}
      </div>
    </aside>
  );
}
