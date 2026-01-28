/**
 * Coaching Personas for the Strategy Coach
 *
 * Each persona provides a distinct coaching style tailored to different user needs:
 * - Marcus: Market-led, data-driven, competitive focus
 * - Elena: People-centered, capability building, empowering
 * - Richard: Pragmatic, momentum-focused, turnaround specialist
 */

export { MARCUS_PERSONA } from './marcus';
export { ELENA_PERSONA } from './elena';
export { RICHARD_PERSONA } from './richard';

import { MARCUS_PERSONA } from './marcus';
import { ELENA_PERSONA } from './elena';
import { RICHARD_PERSONA } from './richard';

export type PersonaId = 'marcus' | 'elena' | 'richard';

export interface Persona {
  name: string;
  title: string;
  tagline: string;
  identity: string;
  tone: string;
  phaseAdaptations: {
    discovery: string;
    research: string;
    synthesis: string;
    bets: string;
  };
}

export const PERSONAS: Record<PersonaId, Persona> = {
  marcus: MARCUS_PERSONA,
  elena: ELENA_PERSONA,
  richard: RICHARD_PERSONA,
};

/**
 * Get a persona by ID
 */
export function getPersona(personaId: PersonaId | undefined): Persona | null {
  if (!personaId) return null;
  return PERSONAS[personaId] ?? null;
}

/**
 * Get persona-specific system prompt section
 */
export function getPersonaSection(personaId: PersonaId | undefined): string {
  const persona = getPersona(personaId);
  if (!persona) return '';

  return `
## YOUR COACHING PERSONA

${persona.identity}

### Communication Style
${persona.tone}
`;
}

/**
 * Get persona-specific phase guidance
 */
export function getPersonaPhaseGuidance(
  personaId: PersonaId | undefined,
  phase: string
): string {
  const persona = getPersona(personaId);
  if (!persona) return '';

  const phaseKey = phase as keyof Persona['phaseAdaptations'];
  return persona.phaseAdaptations[phaseKey] || '';
}

/**
 * Persona options for UI selection
 */
export const PERSONA_OPTIONS = [
  {
    id: 'marcus' as PersonaId,
    name: 'Marcus',
    title: 'The Strategic Navigator',
    tagline: "Let's look at the evidence. What does the market actually tell us?",
    bestFor: ['Market-led growth', 'Competitive positioning', 'Go-to-market strategy'],
    color: 'indigo',
  },
  {
    id: 'elena' as PersonaId,
    name: 'Elena',
    title: 'The Capability Builder',
    tagline: "You already have more capability than you realise. Let's unlock it together.",
    bestFor: ['Team empowerment', 'Capability development', 'Cultural change'],
    color: 'emerald',
  },
  {
    id: 'richard' as PersonaId,
    name: 'Richard',
    title: 'The Transformation Pragmatist',
    tagline: "You've been here before. This time, let's make it stick.",
    bestFor: ['Turnaround situations', 'Post-failure recovery', 'Milestone-driven progress'],
    color: 'amber',
  },
] as const;
