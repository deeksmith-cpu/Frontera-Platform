'use client';

import { useContext } from 'react';
import { CoachJourneyContext, type CoachJourneyContextValue } from '@/contexts/CoachJourneyContext';

/**
 * Hook to access the Coach Journey context.
 * Must be used within a <CoachJourneyProvider>.
 */
export function useCoachJourney(): CoachJourneyContextValue {
  const context = useContext(CoachJourneyContext);
  if (!context) {
    throw new Error(
      'useCoachJourney must be used within a <CoachJourneyProvider>. ' +
      'Wrap your component tree with CoachJourneyProvider from @/contexts/CoachJourneyContext.'
    );
  }
  return context;
}
