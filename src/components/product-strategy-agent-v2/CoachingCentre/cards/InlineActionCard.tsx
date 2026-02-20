'use client';

import { MicroSynthesisCard } from './MicroSynthesisCard';
import { ResearchPromptCard } from './ResearchPromptCard';
import { ArtefactPreviewCard } from './ArtefactPreviewCard';
import { DebateInvitationCard } from './DebateInvitationCard';
import { ArtefactEvolutionCard } from './ArtefactEvolutionCard';
import { SignalAlertCard } from './SignalAlertCard';

export type ActionCardType = 'micro-synthesis' | 'research-prompt' | 'artefact-preview' | 'debate-invitation' | 'artefact-evolution' | 'signal-alert';

export interface ActionCardData {
  type: ActionCardType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>;
}

interface InlineActionCardProps {
  card: ActionCardData;
  onAction?: (action: string, payload?: unknown) => void;
}

export function InlineActionCard({ card, onAction }: InlineActionCardProps) {
  switch (card.type) {
    case 'micro-synthesis':
      return <MicroSynthesisCard data={card.payload} onAction={onAction} />;
    case 'research-prompt':
      return <ResearchPromptCard data={card.payload} onAction={onAction} />;
    case 'artefact-preview':
      return <ArtefactPreviewCard data={card.payload} onAction={onAction} />;
    case 'debate-invitation':
      return <DebateInvitationCard data={card.payload} onAction={onAction} />;
    case 'artefact-evolution':
      return <ArtefactEvolutionCard data={card.payload} onAction={onAction} />;
    case 'signal-alert':
      return <SignalAlertCard data={card.payload} onAction={onAction} />;
    default:
      return null;
  }
}
