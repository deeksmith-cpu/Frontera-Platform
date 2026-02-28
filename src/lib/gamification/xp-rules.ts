/** XP amounts awarded per action */
export const XP_RULES: Record<string, number> = {
  // Discovery
  document_uploaded: 15,
  ai_research: 20,

  // Research
  research_captured: 10,     // Answer a research question
  area_mapped: 50,           // Complete a research area (3 questions)
  territory_complete: 150,   // Complete a territory (3 areas)

  // Synthesis
  micro_synthesis: 75,       // Generate micro-synthesis
  synthesis_generated: 200,  // Generate full synthesis

  // Bets
  bet_created: 50,
  kill_criteria_added: 25,

  // Activation
  team_brief_generated: 75,

  // Review
  signal_logged: 30,
  assumption_validated: 40,

  // Legacy (keep for backward compatibility)
  message_sent: 5,
  insight_captured: 15,
  framework_requested: 10,
} as const;

export type XPEventType = keyof typeof XP_RULES;

/** Get XP amount for an event type, returns 0 for unknown types */
export function getXPAmount(eventType: string): number {
  return XP_RULES[eventType] || 0;
}
