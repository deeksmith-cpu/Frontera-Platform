/** XP amounts awarded per action */
export const XP_RULES: Record<string, number> = {
  message_sent: 5,
  research_captured: 25,
  area_mapped: 50,
  territory_complete: 100,
  synthesis_generated: 150,
  bet_created: 75,
  insight_captured: 15,
  framework_requested: 10,
} as const;

export type XPEventType = keyof typeof XP_RULES;

/** Get XP amount for an event type, returns 0 for unknown types */
export function getXPAmount(eventType: string): number {
  return XP_RULES[eventType] || 0;
}
