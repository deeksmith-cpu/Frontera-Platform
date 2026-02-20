/**
 * Proactive Re-engagement Logic
 *
 * Detects inactivity and generates contextual re-engagement prompts
 * for display on Strategy Home coaching topic card.
 */

interface ReengagementContext {
  lastActivityAt: string | null;
  currentPhase: string;
  mappedAreas: number;
  totalAreas: number;
  archetype: string | null;
  betCount: number;
}

interface ReengagementPrompt {
  message: string;
  urgency: 'gentle' | 'moderate' | 'urgent';
  daysSinceActivity: number;
}

/**
 * Generate a re-engagement prompt based on user inactivity.
 * Returns null if no re-engagement is needed.
 */
export function generateReengagementPrompt(
  context: ReengagementContext
): ReengagementPrompt | null {
  if (!context.lastActivityAt) return null;

  const daysSince = Math.floor(
    (Date.now() - new Date(context.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // No re-engagement for recent activity
  if (daysSince < 3) return null;

  const { currentPhase, mappedAreas, totalAreas, archetype, betCount } = context;

  // 3-7 days: gentle nudge
  if (daysSince <= 7) {
    return {
      message: getGentleNudge(currentPhase, mappedAreas, totalAreas),
      urgency: 'gentle',
      daysSinceActivity: daysSince,
    };
  }

  // 7-14 days: moderate reminder
  if (daysSince <= 14) {
    return {
      message: getModerateReminder(currentPhase, mappedAreas, totalAreas, archetype),
      urgency: 'moderate',
      daysSinceActivity: daysSince,
    };
  }

  // 14+ days: urgent re-engagement
  return {
    message: getUrgentReengagement(currentPhase, mappedAreas, betCount),
    urgency: 'urgent',
    daysSinceActivity: daysSince,
  };
}

function getGentleNudge(phase: string, mapped: number, total: number): string {
  if (phase === 'discovery') {
    return "You started your strategy journey recently. Let's continue setting context — even 15 minutes can build meaningful strategic foundation.";
  }
  if (phase === 'research') {
    const remaining = total - mapped;
    return `You have ${remaining} research areas left to explore. Pick up where you left off — each area takes about 8 minutes.`;
  }
  if (phase === 'synthesis') {
    return "Your synthesis insights are waiting. Let's explore the patterns and opportunities that emerged from your research.";
  }
  return "Your strategic bets could use refinement. Let's ensure each has measurable metrics and clear kill criteria.";
}

function getModerateReminder(phase: string, mapped: number, total: number, archetype: string | null): string {
  const archetyeNudge = archetype === 'visionary'
    ? " Your vision needs grounding in structured research."
    : archetype === 'operator'
    ? " Step back from execution to invest in strategic clarity."
    : archetype === 'analyst'
    ? " Your analysis is incomplete — more data will sharpen your decisions."
    : "";

  if (phase === 'research') {
    return `It's been over a week. Your ${mapped > 0 ? mapped + '/' + total + ' mapped territories are waiting' : 'Competitor Territory is still unmapped'} for your attention.${archetyeNudge}`;
  }
  return `Your strategy work has been paused for over a week. Strategic momentum matters — competitors don't pause.${archetyeNudge}`;
}

function getUrgentReengagement(phase: string, mapped: number, betCount: number): string {
  if (betCount > 0) {
    return "Your strategic bets are aging without validation. Market conditions change — let's review whether your assumptions still hold.";
  }
  if (mapped > 0) {
    return "You've invested time mapping strategic terrain, but insights lose value without action. Let's turn your research into strategic bets.";
  }
  return "Your strategy journey has stalled. Even 10 minutes today can restart your strategic momentum. What's blocking progress?";
}
