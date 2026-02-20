/** Level thresholds — XP required to reach each level */
interface LevelThreshold {
  level: number;
  xpRequired: number;
  title: string;
}

const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xpRequired: 0, title: 'Strategist Apprentice' },
  { level: 2, xpRequired: 100, title: 'Insight Seeker' },
  { level: 3, xpRequired: 250, title: 'Territory Scout' },
  { level: 4, xpRequired: 500, title: 'Pattern Finder' },
  { level: 5, xpRequired: 1000, title: 'Strategy Architect' },
  { level: 6, xpRequired: 2000, title: 'Master Strategist' },
];

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressInLevel: number; // 0-100 percentage
}

/** Calculate level info from total XP */
export function getLevelInfo(totalXP: number): LevelInfo {
  let currentLevel = LEVEL_THRESHOLDS[0];

  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXP >= threshold.xpRequired) {
      currentLevel = threshold;
    } else {
      break;
    }
  }

  const currentIdx = LEVEL_THRESHOLDS.findIndex(t => t.level === currentLevel.level);
  const nextLevel = LEVEL_THRESHOLDS[currentIdx + 1];

  const xpForCurrentLevel = currentLevel.xpRequired;
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired : currentLevel.xpRequired;
  const xpInLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel,
    progressInLevel: xpNeeded > 0 ? Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100) : 100,
  };
}

/** Check if awarding XP causes a level up */
export function checkLevelUp(currentXP: number, xpToAdd: number): { levelsGained: number; newLevel: number } | null {
  const before = getLevelInfo(currentXP);
  const after = getLevelInfo(currentXP + xpToAdd);

  if (after.level > before.level) {
    return { levelsGained: after.level - before.level, newLevel: after.level };
  }
  return null;
}
