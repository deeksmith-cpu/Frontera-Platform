'use client';

import Image from 'next/image';

interface SessionWelcomeProps {
  currentPhase: string;
  activeTerritory: 'company' | 'customer' | 'competitor' | null;
  territoryProgress: {
    company: { mapped: number; total: number };
    customer: { mapped: number; total: number };
    competitor: { mapped: number; total: number };
  };
  synthesisAvailable: boolean;
  onSendPrompt: (prompt: string) => void;
  hasHistory: boolean;
  onShowHistory: () => void;
  hasUserEngaged: boolean;
  materialsCount: number;
}

const TERRITORY_LABELS: Record<string, string> = {
  company: 'Company Territory',
  customer: 'Customer Territory',
  competitor: 'Market Context',
};

const TERRITORY_DESCRIPTIONS: Record<string, string> = {
  company: 'your capabilities, resources, and product portfolio',
  customer: 'your customer segments, unmet needs, and market dynamics',
  competitor: 'your competitive landscape, substitute threats, and market forces',
};

const PHASE_LABELS: Record<string, string> = {
  discovery: 'Discovery',
  research: 'Landscape',
  synthesis: 'Synthesis',
  bets: 'Strategic Bets',
  planning: 'Strategic Bets',
};

const PHASE_SUBTITLES: Record<string, string> = {
  discovery: 'Context Setting',
  research: 'Terrain Mapping',
  synthesis: 'Pattern Recognition',
  bets: 'Route Planning',
  planning: 'Route Planning',
};

interface WelcomeContent {
  greeting: string;
  subtitle?: string;
  prompts: string[];
}

function getWelcomeContent(
  phase: string,
  territory: 'company' | 'customer' | 'competitor' | null,
  progress: SessionWelcomeProps['territoryProgress'],
  synthesisAvailable: boolean,
): WelcomeContent {
  // Discovery phase
  if (phase === 'discovery') {
    return {
      greeting: 'Welcome to the Product Strategy Research Playbook',
      subtitle: 'An iterative process to develop your product strategy through structured exploration across three strategic territories.',
      prompts: ['What should I upload?', 'Help me think about my strategy'],
    };
  }

  // Research phase
  if (phase === 'research') {
    if (!territory) {
      return {
        greeting: 'Ready to map your strategic terrain.',
        subtitle: 'Select a territory in the sidebar to begin your research.',
        prompts: [],
      };
    }

    const label = TERRITORY_LABELS[territory] || 'Territory';
    const desc = TERRITORY_DESCRIPTIONS[territory] || '';
    const tp = progress[territory];
    const mapped = tp?.mapped ?? 0;
    const total = tp?.total ?? 3;

    if (mapped === 0) {
      return {
        greeting: `Let's explore your ${label}.`,
        subtitle: `I'll guide you through understanding ${desc}.`,
        prompts: ['Where should we start?', 'What do you need from me?'],
      };
    }

    if (mapped < total) {
      return {
        greeting: `Welcome back to ${label}.`,
        subtitle: `You've mapped ${mapped} of ${total} areas. Let's continue with the remaining areas.`,
        prompts: ['Continue where we left off', 'Review what we\'ve covered'],
      };
    }

    return {
      greeting: `You've completed your ${label} mapping.`,
      subtitle: 'Would you like to review, challenge, or go deeper?',
      prompts: ['Review my findings', 'Challenge my assumptions', 'What did I miss?'],
    };
  }

  // Synthesis phase
  if (phase === 'synthesis') {
    if (synthesisAvailable) {
      return {
        greeting: 'Your strategic synthesis is ready.',
        subtitle: "Let's review the opportunities and themes that emerged from your research.",
        prompts: ['Walk me through the synthesis', 'What surprised you?', 'Debate the priorities'],
      };
    }
    return {
      greeting: "Let's synthesize your research.",
      subtitle: "I'll help identify strategic opportunities and cross-cutting themes across all territories.",
      prompts: ['Start synthesis', 'Show cross-territory themes'],
    };
  }

  // Bets phase
  if (phase === 'bets' || phase === 'planning') {
    return {
      greeting: 'Time to define your strategic bets.',
      subtitle: "Based on your analysis, let's prioritise where to play and how to win.",
      prompts: ['Help me prioritise', 'What does the evidence say?'],
    };
  }

  // Fallback
  return {
    greeting: 'Welcome to your strategy session.',
    prompts: [],
  };
}

/* ── Mini Phase Timeline ─────────────────────────────────────────── */

const PHASES = [
  { id: 'discovery', label: 'Discovery', sub: 'Context Setting', color: 'emerald' },
  { id: 'research', label: 'Landscape', sub: 'Terrain Mapping', color: 'amber' },
  { id: 'synthesis', label: 'Synthesis', sub: 'Patterns', color: 'purple' },
  { id: 'bets', label: 'Strategic Bets', sub: 'Routes', color: 'cyan' },
] as const;

const PHASE_ORDER = ['discovery', 'research', 'synthesis', 'bets'];

function MiniPhaseTimeline({ currentPhase }: { currentPhase: string }) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase === 'planning' ? 'bets' : currentPhase);

  return (
    <div className="flex items-center gap-1 mt-4 pl-12">
      {PHASES.map((phase, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isFuture = index > currentIndex;

        // Color classes based on phase
        const dotColor = isActive
          ? `bg-${phase.color}-500`
          : isCompleted
            ? `bg-${phase.color}-400`
            : 'bg-slate-300';

        return (
          <div key={phase.id} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor} ${isActive ? 'ring-2 ring-offset-1 ring-emerald-300' : ''}`}>
                  {isCompleted && (
                    <svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-[10px] font-semibold whitespace-nowrap ${
                  isActive ? 'text-slate-800' : isCompleted ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {phase.label}
                </span>
              </div>
              {/* Subtitle - only show on active phase */}
              {isActive && (
                <span className="text-[9px] text-slate-400 mt-0.5 ml-3.5">{phase.sub}</span>
              )}
            </div>
            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div className={`w-4 h-px mx-1 flex-shrink-0 ${
                isFuture ? 'bg-slate-200' : 'bg-slate-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Quick Start Checklist (Discovery only) ──────────────────────── */

function QuickStartChecklist({ materialsCount }: { materialsCount: number }) {
  const hasMaterials = materialsCount > 0;

  return (
    <div className="mt-3 pl-12 space-y-1.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Quick start</p>

      {/* Company context — always done */}
      <div className="flex items-center gap-2 text-xs">
        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-slate-500">Company context loaded from onboarding</span>
      </div>

      {/* Materials — dynamic */}
      <div className="flex items-center gap-2 text-xs">
        {hasMaterials ? (
          <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-bold text-amber-600">!</span>
          </div>
        )}
        <span className={hasMaterials ? 'text-slate-500' : 'text-slate-700 font-medium'}>
          {hasMaterials
            ? `${materialsCount} document${materialsCount !== 1 ? 's' : ''} uploaded`
            : 'Upload strategic materials (at least 1 document)'}
        </span>
      </div>

      {/* Canvas pointer — only when no materials */}
      {!hasMaterials && (
        <p className="text-[11px] text-slate-400 pl-6">
          Use the Strategy Canvas panel to upload documents
        </p>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */

export function SessionWelcome({
  currentPhase,
  activeTerritory,
  territoryProgress,
  synthesisAvailable,
  onSendPrompt,
  hasHistory,
  onShowHistory,
  hasUserEngaged,
  materialsCount,
}: SessionWelcomeProps) {
  const { greeting, subtitle, prompts } = getWelcomeContent(
    currentPhase,
    activeTerritory,
    territoryProgress,
    synthesisAvailable,
  );

  const isDiscovery = currentPhase === 'discovery';
  const phaseLabel = PHASE_LABELS[currentPhase] || 'Discovery';
  const phaseSub = PHASE_SUBTITLES[currentPhase] || '';

  // Compact mode: user has engaged this session
  if (hasUserEngaged) {
    return (
      <div className="space-y-2">
        {hasHistory && (
          <button
            onClick={onShowHistory}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mx-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View earlier messages
          </button>
        )}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-100 rounded-xl">
          <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1f3a]">
            <Image
              src="/avatars/marcus.jpg"
              alt="Marcus"
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-semibold text-slate-700">Marcus</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-[11px] text-slate-500">{phaseLabel}{phaseSub ? ` — ${phaseSub}` : ''}</span>
        </div>
      </div>
    );
  }

  // Full mode: orientation for the user
  return (
    <div className="space-y-3">
      {/* View earlier messages link */}
      {hasHistory && (
        <button
          onClick={onShowHistory}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mx-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View earlier messages
        </button>
      )}

      {/* Welcome card */}
      <div className="bg-white border border-cyan-200 rounded-2xl p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          {/* Marcus avatar */}
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-slate-100 transition-transform duration-300 hover:scale-110 bg-[#1a1f3a] shadow-md">
            <Image
              src="/avatars/marcus.jpg"
              alt="Marcus"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Greeting text */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 leading-snug">{greeting}</p>
            {subtitle && (
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Quick start checklist — Discovery only */}
        {isDiscovery && <QuickStartChecklist materialsCount={materialsCount} />}

        {/* Prompt pills */}
        {prompts.length > 0 && (
          <div className={`flex flex-wrap gap-2 pl-12 ${isDiscovery ? 'mt-4 pt-3 border-t border-slate-100' : 'mt-4'}`}>
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSendPrompt(prompt)}
                className="inline-flex items-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-cyan-50 hover:border-cyan-300 hover:text-slate-900 transition-all duration-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
