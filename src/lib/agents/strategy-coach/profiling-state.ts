import type { ProfilingFrameworkState } from '@/types/database';

/**
 * Initialize default profiling framework state for a new profiling conversation.
 */
export function initializeProfilingState(): ProfilingFrameworkState {
  return {
    status: 'in_progress',
    currentDimension: 1,
    dimensionsCompleted: [],
    profileData: null,
    completedAt: null,
  };
}

/**
 * Dimension labels for tracking progress.
 */
export const PROFILING_DIMENSIONS = [
  'role',
  'objectives',
  'leadershipStyle',
  'experience',
  'workingStyle',
] as const;

/** Maximum user messages before forcing profile summary. */
const HARD_CAP_USER_MESSAGES = 12;

/**
 * Advance profiling state based on message count and response content.
 * Uses message-count-based progression (2 exchanges per dimension)
 * with a hard cap to prevent infinite looping.
 */
export function advanceProfilingState(
  current: ProfilingFrameworkState,
  userMessageCount: number,
  responseContainsSummary: boolean
): ProfilingFrameworkState {
  // If response contains the profile summary, mark as completed
  if (responseContainsSummary) {
    return {
      ...current,
      currentDimension: 5,
      dimensionsCompleted: [...PROFILING_DIMENSIONS],
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  }

  // Calculate dimension from message count (~2 user messages per dimension)
  const newDimension = Math.min(5, Math.floor(userMessageCount / 2) + 1);
  const completed = PROFILING_DIMENSIONS.slice(0, Math.max(0, newDimension - 1)) as unknown as string[];

  // Hard cap: force summary after too many messages or all dimensions reached
  if (userMessageCount >= HARD_CAP_USER_MESSAGES || (newDimension >= 5 && userMessageCount >= 8)) {
    return {
      ...current,
      currentDimension: 5,
      dimensionsCompleted: completed,
      status: 'awaiting_summary',
    };
  }

  return {
    ...current,
    currentDimension: newDimension,
    dimensionsCompleted: completed,
  };
}
