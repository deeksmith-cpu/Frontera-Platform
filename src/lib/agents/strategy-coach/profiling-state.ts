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
