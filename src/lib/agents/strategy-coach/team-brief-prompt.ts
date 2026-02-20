/**
 * Team Brief Generation Prompt
 *
 * Takes a strategic bet + research evidence + synthesis → generates
 * structured team brief for execution teams.
 */

export interface TeamBriefInput {
  bet: {
    job_to_be_done: string;
    belief: string;
    bet: string;
    success_metric: string;
    kill_criteria: string | null;
    kill_date: string | null;
    evidence_links: Array<Record<string, unknown>>;
  };
  thesis?: {
    title: string;
    description: string;
    ptw_winning_aspiration: string | null;
    ptw_where_to_play: string | null;
    ptw_how_to_win: string | null;
  };
  synthesisContext?: string;
  companyName: string;
}

export function buildTeamBriefPrompt(input: TeamBriefInput): string {
  const { bet, thesis, synthesisContext, companyName } = input;

  return `You are a strategic planning expert generating a Team Brief for ${companyName}.

## Context
${thesis ? `**Strategic Thesis:** ${thesis.title}
${thesis.description}
${thesis.ptw_where_to_play ? `**Where to Play:** ${thesis.ptw_where_to_play}` : ''}
${thesis.ptw_how_to_win ? `**How to Win:** ${thesis.ptw_how_to_win}` : ''}` : ''}

## Strategic Bet
**Job to Be Done:** ${bet.job_to_be_done}
**Belief:** ${bet.belief}
**Bet:** ${bet.bet}
**Success Metric:** ${bet.success_metric}
${bet.kill_criteria ? `**Kill Criteria:** ${bet.kill_criteria}` : ''}
${bet.kill_date ? `**Kill Date:** ${bet.kill_date}` : ''}

${synthesisContext ? `## Synthesis Context\n${synthesisContext}` : ''}

## Generate a Team Brief with these sections:

1. **Strategic Context** (2-3 sentences): Why this bet matters for ${companyName}. Connect to the broader strategy.
2. **Problem Statement** (2-3 sentences): What customer/market problem this addresses. Use JTBD framing.
3. **Success Criteria**: 3-5 measurable leading indicators with specific numbers and timeframes.
4. **Strategic Guardrails**: 3-4 "We Will / We Will Not" statements guiding execution.
5. **Key Assumptions**: 2-3 assumptions being tested by this bet.
6. **Kill Criteria**: When and why to abandon this bet.
7. **Stakeholder Context**: Who needs to know, who needs to approve, who needs to execute.

Return as JSON with this structure:
{
  "title": "Brief title",
  "strategicContext": "...",
  "problemStatement": "...",
  "successCriteria": ["...", "..."],
  "guardrails": { "weWill": ["..."], "weWillNot": ["..."] },
  "keyAssumptions": ["..."],
  "killCriteria": "...",
  "stakeholders": { "inform": ["..."], "approve": ["..."], "execute": ["..."] }
}`;
}
