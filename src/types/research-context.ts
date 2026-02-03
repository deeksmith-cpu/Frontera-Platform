/**
 * Real-time context about user's current position in research phase.
 * Used to give the Strategy Coach awareness of exactly what the user is working on.
 */
export interface ActiveResearchContext {
  // Which territory is selected (null if overview)
  territory: 'company' | 'customer' | 'competitor' | null;

  // Which research area within territory
  researchAreaId: string | null;
  researchAreaTitle: string | null;

  // Which question index (0-3) user is focused on
  focusedQuestionIndex: number | null;
  currentQuestion: string | null;

  // Draft response (unsaved)
  draftResponse: string | null;

  // All responses for this area (saved + unsaved)
  currentResponses: Record<number, string>;

  // Timestamp of last update
  updatedAt: number;
}
