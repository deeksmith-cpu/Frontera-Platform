/**
 * Review Cadence Logic for Living Strategy (Phase 6)
 *
 * Determines when strategy reviews should be triggered based on:
 * 1. Kill dates reached on strategic bets
 * 2. Assumption invalidation
 * 3. Monthly check-in (30 days)
 * 4. Quarterly deep review (90 days)
 */

export interface ReviewTrigger {
  type: 'kill_date' | 'assumption_invalidated' | 'monthly' | 'quarterly';
  urgency: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  dueDate: string;
  relatedId?: string;
}

interface ReviewContext {
  lastReviewDate?: string;
  strategySetDate?: string;
  bets: Array<{
    id: string;
    bet: string;
    kill_date?: string;
    status?: string;
  }>;
  assumptions: Array<{
    id: string;
    assumption_text: string;
    status: string;
    updated_at: string;
  }>;
}

/**
 * Calculate all pending review triggers.
 */
export function calculateReviewTriggers(context: ReviewContext): ReviewTrigger[] {
  const triggers: ReviewTrigger[] = [];
  const now = new Date();

  // 1. Kill date triggers
  for (const bet of context.bets) {
    if (!bet.kill_date || bet.status === 'killed' || bet.status === 'validated') continue;

    const killDate = new Date(bet.kill_date);
    const daysUntilKill = Math.ceil((killDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilKill <= 0) {
      triggers.push({
        type: 'kill_date',
        urgency: 'high',
        title: `Kill Date Reached`,
        description: `The kill date for "${bet.bet.substring(0, 60)}..." has passed. Review evidence and decide: continue, pivot, or kill.`,
        dueDate: bet.kill_date,
        relatedId: bet.id,
      });
    } else if (daysUntilKill <= 7) {
      triggers.push({
        type: 'kill_date',
        urgency: 'medium',
        title: `Kill Date Approaching`,
        description: `"${bet.bet.substring(0, 60)}..." kill date is in ${daysUntilKill} day${daysUntilKill === 1 ? '' : 's'}. Start gathering evidence.`,
        dueDate: bet.kill_date,
        relatedId: bet.id,
      });
    }
  }

  // 2. Assumption invalidation triggers
  const recentlyInvalidated = context.assumptions.filter((a) => {
    if (a.status !== 'invalidated') return false;
    const updatedAt = new Date(a.updated_at);
    const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate <= 7; // Invalidated within the past week
  });

  for (const assumption of recentlyInvalidated) {
    triggers.push({
      type: 'assumption_invalidated',
      urgency: 'high',
      title: `Assumption Invalidated`,
      description: `"${assumption.assumption_text.substring(0, 80)}..." has been invalidated. Review affected bets and strategy.`,
      dueDate: assumption.updated_at,
      relatedId: assumption.id,
    });
  }

  // 3. Monthly check-in (30 days since last review)
  if (context.lastReviewDate) {
    const lastReview = new Date(context.lastReviewDate);
    const daysSinceReview = (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceReview >= 30) {
      const dueDate = new Date(lastReview.getTime() + 30 * 24 * 60 * 60 * 1000);
      triggers.push({
        type: 'monthly',
        urgency: daysSinceReview >= 45 ? 'medium' : 'low',
        title: `Monthly Review Due`,
        description: `It's been ${Math.floor(daysSinceReview)} days since your last strategy review. Time to check assumptions and signals.`,
        dueDate: dueDate.toISOString(),
      });
    }
  }

  // 4. Quarterly deep review (90 days since strategy was set)
  if (context.strategySetDate) {
    const strategyDate = new Date(context.strategySetDate);
    const daysSinceStrategy = (now.getTime() - strategyDate.getTime()) / (1000 * 60 * 60 * 24);
    const quartersPassed = Math.floor(daysSinceStrategy / 90);

    if (quartersPassed >= 1) {
      const lastQuarterDate = new Date(strategyDate.getTime() + quartersPassed * 90 * 24 * 60 * 60 * 1000);
      const daysSinceQuarter = (now.getTime() - lastQuarterDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceQuarter <= 14) {
        triggers.push({
          type: 'quarterly',
          urgency: 'medium',
          title: `Quarterly Deep Review`,
          description: `Quarter ${quartersPassed} since strategy was set. Time for a comprehensive review of all bets, assumptions, and market signals.`,
          dueDate: lastQuarterDate.toISOString(),
        });
      }
    }
  }

  // Sort by urgency (high first) then by due date
  const urgencyOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  triggers.sort((a, b) => {
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgDiff !== 0) return urgDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return triggers;
}

/**
 * Get the next scheduled review date.
 */
export function getNextReviewDate(context: ReviewContext): { date: string; reason: string } | null {
  const triggers = calculateReviewTriggers(context);
  if (triggers.length === 0) {
    // Default: suggest review in 30 days from now
    if (context.lastReviewDate) {
      const nextMonth = new Date(new Date(context.lastReviewDate).getTime() + 30 * 24 * 60 * 60 * 1000);
      return { date: nextMonth.toISOString(), reason: 'Monthly check-in' };
    }
    return null;
  }

  return { date: triggers[0].dueDate, reason: triggers[0].title };
}

/**
 * Generate a review mode prompt for the coaching system.
 */
export function generateReviewModePrompt(triggers: ReviewTrigger[]): string {
  if (triggers.length === 0) {
    return `REVIEW MODE: The user has entered a strategy review session. Guide them through:
1. Review each strategic bet's progress
2. Check assumption status (validated/invalidated/untested)
3. Discuss any new market signals
4. Recommend adjustments if needed
5. Create a version snapshot at the end`;
  }

  const triggerSummary = triggers
    .map((t) => `- [${t.urgency.toUpperCase()}] ${t.title}: ${t.description}`)
    .join('\n');

  return `REVIEW MODE TRIGGERED. The following events require strategic review:

${triggerSummary}

Guide the user through this review:
1. Address each trigger, starting with the highest urgency
2. For kill dates: Review evidence gathered and recommend continue/pivot/kill
3. For invalidated assumptions: Identify affected bets and discuss alternatives
4. For periodic reviews: Check overall assumption health and signal landscape
5. Recommend specific strategy adjustments based on findings
6. At the end of review, create a strategy version snapshot

Be direct about what needs attention. Ask pointed questions. Don't let important signals go unaddressed.`;
}
