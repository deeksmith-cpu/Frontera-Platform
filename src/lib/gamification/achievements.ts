export interface AchievementDef {
  id: string;
  label: string;
  description: string;
}

/** All possible achievements */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_steps',
    label: 'First Steps',
    description: 'Completed the Discovery phase',
  },
  {
    id: 'territory_pioneer',
    label: 'Territory Pioneer',
    description: 'Completed your first territory',
  },
  {
    id: 'full_cartographer',
    label: 'Full Cartographer',
    description: 'Completed all 3 territories',
  },
  {
    id: 'synthesis_seeker',
    label: 'Synthesis Seeker',
    description: 'Generated your first strategic synthesis',
  },
  {
    id: 'bold_strategist',
    label: 'Bold Strategist',
    description: 'Created 3 or more strategic bets',
  },
  {
    id: 'execution_bridge',
    label: 'Execution Bridge',
    description: 'Generated your first team brief',
  },
  {
    id: 'living_strategist',
    label: 'Living Strategist',
    description: 'Logged your first market signal',
  },
  // Legacy aliases
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
  metadata?: Record<string, unknown>,
): string[] {
  const newAchievements: string[] = [];

  // First Steps — completed discovery (triggered by document upload or ai research)
  if (
    !existingAchievements.includes('first_steps') &&
    (eventType === 'document_uploaded' || eventType === 'ai_research')
  ) {
    newAchievements.push('first_steps');
  }

  // Territory Pioneer — completed a territory
  if (
    !existingAchievements.includes('territory_pioneer') &&
    eventType === 'territory_complete'
  ) {
    newAchievements.push('territory_pioneer');
  }

  // Full Cartographer — completed all 3 territories (metadata.territoriesCompleted >= 3)
  if (
    !existingAchievements.includes('full_cartographer') &&
    eventType === 'territory_complete' &&
    metadata?.territoriesCompleted &&
    (metadata.territoriesCompleted as number) >= 3
  ) {
    newAchievements.push('full_cartographer');
  }

  // Synthesis Seeker — generated synthesis
  if (
    !existingAchievements.includes('synthesis_seeker') &&
    (eventType === 'synthesis_generated' || eventType === 'micro_synthesis')
  ) {
    newAchievements.push('synthesis_seeker');
  }

  // Bold Strategist — created 3+ bets (metadata.betCount >= 3)
  if (
    !existingAchievements.includes('bold_strategist') &&
    eventType === 'bet_created' &&
    metadata?.betCount &&
    (metadata.betCount as number) >= 3
  ) {
    newAchievements.push('bold_strategist');
  }

  // Execution Bridge — generated first team brief
  if (
    !existingAchievements.includes('execution_bridge') &&
    eventType === 'team_brief_generated'
  ) {
    newAchievements.push('execution_bridge');
  }

  // Living Strategist — logged first signal
  if (
    !existingAchievements.includes('living_strategist') &&
    eventType === 'signal_logged'
  ) {
    newAchievements.push('living_strategist');
  }

  // Legacy: First Insight
  if (
    !existingAchievements.includes('first_insight') &&
    (eventType === 'insight_captured' || eventType === 'research_captured')
  ) {
    newAchievements.push('first_insight');
  }

  // Legacy: Territory Explorer
  if (
    !existingAchievements.includes('territory_explorer') &&
    eventType === 'area_mapped'
  ) {
    newAchievements.push('territory_explorer');
  }

  // Legacy: Deep Thinker
  if (
    !existingAchievements.includes('deep_thinker') &&
    eventType === 'territory_complete'
  ) {
    newAchievements.push('deep_thinker');
  }

  // Legacy: Synthesis Master
  if (
    !existingAchievements.includes('synthesis_master') &&
    eventType === 'synthesis_generated'
  ) {
    newAchievements.push('synthesis_master');
  }

  return newAchievements;
}
