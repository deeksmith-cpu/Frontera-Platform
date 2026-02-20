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
      greeting: "Welcome to your strategy session.",
      subtitle: "Let's build your strategic foundation by gathering context about your organisation.",
      prompts: ['What materials should I upload?', 'Help me think about my strategy'],
    };
  }

  // Research phase
  if (phase === 'research') {
    if (!territory) {
      return {
        greeting: "Ready to map your strategic terrain.",
        subtitle: "Select a territory in the sidebar to begin your research.",
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

    // Completed territory
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
        greeting: "Your strategic synthesis is ready.",
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
      greeting: "Time to define your strategic bets.",
      subtitle: "Based on your analysis, let's prioritise where to play and how to win.",
      prompts: ['Help me prioritise', 'What does the evidence say?'],
    };
  }

  // Fallback
  return {
    greeting: "Welcome to your strategy session.",
    prompts: [],
  };
}

export function SessionWelcome({
  currentPhase,
  activeTerritory,
  territoryProgress,
  synthesisAvailable,
  onSendPrompt,
  hasHistory,
  onShowHistory,
}: SessionWelcomeProps) {
  const { greeting, subtitle, prompts } = getWelcomeContent(
    currentPhase,
    activeTerritory,
    territoryProgress,
    synthesisAvailable,
  );

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

        {/* Prompt pills */}
        {prompts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pl-12">
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
