export interface AchievementDef {
  id: string;
  label: string;
  description: string;
}

/** All possible achievements */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_insight',
    label: 'First Insight',
    description: 'Captured your first strategic insight',
  },
  {
    id: 'territory_explorer',
    label: 'Territory Explorer',
    description: 'Mapped at least one research area in any territory',
  },
  {
    id: 'deep_thinker',
    label: 'Deep Thinker',
    description: 'Completed all research areas in a single territory',
  },
  {
    id: 'synthesis_master',
    label: 'Synthesis Master',
    description: 'Generated a strategic synthesis',
  },
];

/** Check which achievements should be unlocked based on event history */
export function checkAchievements(
  eventType: string,
  existingAchievements: string[],
): string[] {
  const newAchievements: string[] = [];

  // First Insight — captured any insight
  if (
    !existingAchievements.includes('first_insight') &&
    (eventType === 'insight_captured' || eventType === 'research_captured')
  ) {
    newAchievements.push('first_insight');
  }

  // Territory Explorer — mapped an area
  if (
    !existingAchievements.includes('territory_explorer') &&
    eventType === 'area_mapped'
  ) {
    newAchievements.push('territory_explorer');
  }

  // Deep Thinker — completed a full territory (3/3 areas)
  if (
    !existingAchievements.includes('deep_thinker') &&
    eventType === 'territory_complete'
  ) {
    newAchievements.push('deep_thinker');
  }

  // Synthesis Master — generated synthesis
  if (
    !existingAchievements.includes('synthesis_master') &&
    eventType === 'synthesis_generated'
  ) {
    newAchievements.push('synthesis_master');
  }

  return newAchievements;
}
