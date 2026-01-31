/**
 * Coaching Personas for the Strategy Coach
 *
 * Strategic Coaches (original):
 * - Marcus: Market-led, data-driven, competitive focus
 * - Elena: People-centered, capability building, empowering
 * - Richard: Pragmatic, momentum-focused, turnaround specialist
 *
 * Expert Sparring Partners (UC2 — derived from 301 podcast transcripts):
 * - Growth Architect: PLG, funnels, loops, activation, retention
 * - Product Purist: Craft, speed, opinionated design, focus
 * - Scale Navigator: Org design, culture, portfolio management, scaling
 */

export { MARCUS_PERSONA } from './marcus';
export { ELENA_PERSONA } from './elena';
export { RICHARD_PERSONA } from './richard';
export { GROWTH_ARCHITECT_PERSONA } from './growth-architect';
export { PRODUCT_PURIST_PERSONA } from './product-purist';
export { SCALE_NAVIGATOR_PERSONA } from './scale-navigator';

import { MARCUS_PERSONA } from './marcus';
import { ELENA_PERSONA } from './elena';
import { RICHARD_PERSONA } from './richard';
import { GROWTH_ARCHITECT_PERSONA } from './growth-architect';
import { PRODUCT_PURIST_PERSONA } from './product-purist';
import { SCALE_NAVIGATOR_PERSONA } from './scale-navigator';

export type PersonaId = 'marcus' | 'elena' | 'richard' | 'growth-architect' | 'product-purist' | 'scale-navigator';

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
  'growth-architect': GROWTH_ARCHITECT_PERSONA,
  'product-purist': PRODUCT_PURIST_PERSONA,
  'scale-navigator': SCALE_NAVIGATOR_PERSONA,
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
export interface PersonaOption {
  id: PersonaId;
  name: string;
  title: string;
  tagline: string;
  bestFor: readonly string[];
  color: string;
  group: 'strategic-coaches' | 'sparring-partners';
  inspiredBy?: string[];
  expertiseDomain?: string;
}

export const PERSONA_OPTIONS: readonly PersonaOption[] = [
  // Strategic Coaches (original)
  {
    id: 'marcus',
    name: 'Marcus',
    title: 'The Strategic Navigator',
    tagline: "Let's look at the evidence. What does the market actually tell us?",
    bestFor: ['Market-led growth', 'Competitive positioning', 'Go-to-market strategy'],
    color: 'indigo',
    group: 'strategic-coaches',
  },
  {
    id: 'elena',
    name: 'Elena',
    title: 'The Capability Builder',
    tagline: "You already have more capability than you realise. Let's unlock it together.",
    bestFor: ['Team empowerment', 'Capability development', 'Cultural change'],
    color: 'emerald',
    group: 'strategic-coaches',
  },
  {
    id: 'richard',
    name: 'Richard',
    title: 'The Transformation Pragmatist',
    tagline: "You've been here before. This time, let's make it stick.",
    bestFor: ['Turnaround situations', 'Post-failure recovery', 'Milestone-driven progress'],
    color: 'amber',
    group: 'strategic-coaches',
  },
  // Expert Sparring Partners (UC2)
  {
    id: 'growth-architect',
    name: 'Growth Architect',
    title: 'The Growth Architect',
    tagline: "Growth is a system, not a series of hacks. Let's map your loops.",
    bestFor: ['Product-led growth', 'Activation & retention', 'Growth experiments'],
    color: 'cyan',
    group: 'sparring-partners',
    inspiredBy: ['Hila Qu', 'Georgiana Laudi', 'Elena Verna', 'Brian Balfour'],
    expertiseDomain: 'Product-Led Growth',
  },
  {
    id: 'product-purist',
    name: 'Product Purist',
    title: 'The Product Purist',
    tagline: "What is the core job this product does? Strip everything else.",
    bestFor: ['Product craft', 'Speed & focus', 'Opinionated design'],
    color: 'violet',
    group: 'sparring-partners',
    inspiredBy: ['Nan Yu', 'Ivan Zhao', 'Rahul Vohra', 'Jason Fried'],
    expertiseDomain: 'Product Craft & Speed',
  },
  {
    id: 'scale-navigator',
    name: 'Scale Navigator',
    title: 'The Scale Navigator',
    tagline: "What got you here won't get you there. Let's navigate the next stage.",
    bestFor: ['Scaling organizations', 'Org design', 'Portfolio management'],
    color: 'rose',
    group: 'sparring-partners',
    inspiredBy: ['Boz (Andrew Bosworth)', 'Cameron Adams', 'Claire Hughes Johnson', 'Molly Graham'],
    expertiseDomain: 'Scaling Organizations',
  },
] as const;

/**
 * Recommend a coaching persona based on a user's personal profile.
 * Maps decision-making style and working preferences to the best-fit persona.
 */
export function recommendPersonaFromProfile(profile: {
  leadershipStyle: { decisionMaking: string; communicationPreference: string };
  workingStyle: { feedbackPreference: string; preferredPace: string };
  experience: { strategicExperience: string };
}): { personaId: PersonaId; reasoning: string } {
  const dm = profile.leadershipStyle.decisionMaking.toLowerCase();
  const feedback = profile.workingStyle.feedbackPreference.toLowerCase();
  const comm = profile.leadershipStyle.communicationPreference.toLowerCase();

  // Data-driven, analytical leaders → Marcus
  if (dm.includes('data') || dm.includes('analytic') || comm.includes('detailed')) {
    return {
      personaId: 'marcus',
      reasoning: 'Your data-driven decision-making style aligns well with Marcus\'s evidence-based strategic approach.',
    };
  }

  // Consensus builders, people-focused → Elena
  if (dm.includes('consensus') || feedback.includes('supportive') || dm.includes('collaborat')) {
    return {
      personaId: 'elena',
      reasoning: 'Your collaborative leadership style pairs naturally with Elena\'s capability-building approach.',
    };
  }

  // Directive, action-oriented, turnaround → Richard
  if (dm.includes('directive') || dm.includes('intuiti') || feedback.includes('direct')) {
    return {
      personaId: 'richard',
      reasoning: 'Your action-oriented style matches Richard\'s pragmatic, momentum-focused coaching approach.',
    };
  }

  // Default to Marcus as a balanced starting point
  return {
    personaId: 'marcus',
    reasoning: 'Marcus provides a balanced, evidence-based coaching approach as a strong starting point.',
  };
}
