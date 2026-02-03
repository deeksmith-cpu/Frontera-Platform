'use client';

import { useState } from 'react';
import type { StrategicBet } from '@/types/bets';
import type { EvidenceLink } from '@/types/synthesis';
import { getTerritoryDisplay } from '@/lib/synthesis/helpers';

interface BetCardProps {
  bet: StrategicBet;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit?: (bet: StrategicBet) => void;
  onDelete?: (betId: string) => void;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

function getStatusDisplay(status: string) {
  switch (status) {
    case 'draft': return { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600' };
    case 'proposed': return { label: 'Proposed', bg: 'bg-cyan-50', text: 'text-cyan-700' };
    case 'accepted': return { label: 'Accepted', bg: 'bg-emerald-50', text: 'text-emerald-700' };
    case 'prioritized': return { label: 'Prioritized', bg: 'bg-amber-50', text: 'text-amber-700' };
    default: return { label: status, bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}

function getPriorityDisplay(priority: string) {
  switch (priority) {
    case 'high': return { label: 'High Priority', bg: 'bg-red-50', text: 'text-red-700' };
    case 'medium': return { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700' };
    case 'low': return { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-600' };
    default: return { label: priority, bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}

function getKillDateStatus(killDate: string): { label: string; className: string } | null {
  if (!killDate) return null;
  const now = new Date();
  const kill = new Date(killDate);
  const daysUntil = Math.ceil((kill.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return { label: `Overdue by ${Math.abs(daysUntil)}d`, className: 'bg-red-100 text-red-700' };
  if (daysUntil <= 30) return { label: `${daysUntil}d remaining`, className: 'bg-amber-100 text-amber-700' };
  return { label: `${daysUntil}d remaining`, className: 'bg-slate-100 text-slate-600' };
}

export function BetCard({ bet, isExpanded = false, onToggleExpand, onEdit, onDelete }: BetCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showRisks, setShowRisks] = useState(false);

  const statusDisplay = getStatusDisplay(bet.status);
  const priorityDisplay = getPriorityDisplay(bet.priorityLevel);
  const killDateStatus = getKillDateStatus(bet.killDate);

  return (
    <div className={`bg-white border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-cyan-400 shadow-lg' : 'border-slate-200 hover:border-cyan-300 hover:shadow-md'}`}>
      {/* Header - Always visible */}
      <div className="p-5 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Status + Priority badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold py-1 px-2.5 rounded-full ${statusDisplay.bg} ${statusDisplay.text}`}>
                {statusDisplay.label}
              </span>
              <span className={`text-xs font-semibold py-1 px-2.5 rounded-full ${priorityDisplay.bg} ${priorityDisplay.text}`}>
                {priorityDisplay.label}
              </span>
              {bet.agentGenerated && (
                <span className="text-xs font-semibold py-1 px-2.5 rounded-full bg-purple-50 text-purple-700">
                  AI Generated
                </span>
              )}
              {killDateStatus && (
                <span className={`text-xs font-semibold py-1 px-2.5 rounded-full ${killDateStatus.className}`}>
                  {killDateStatus.label}
                </span>
              )}
            </div>

            {/* Bet statement */}
            <h4 className="text-base font-bold text-slate-900 leading-tight">{bet.bet}</h4>

            {/* JTBD */}
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700">Job:</span> {bet.jobToBeDone}
            </p>
          </div>

          {/* Score Circle */}
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-[#1a1f3a] flex items-center justify-center">
              <span className="text-lg font-bold text-white">{bet.scoring.overallScore}</span>
            </div>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="mt-3 flex items-center justify-center">
          <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {/* 5-Part Hypothesis */}
          <div className="py-4 space-y-3">
            <h5 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Strategic Hypothesis</h5>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                <span className="font-semibold text-cyan-800">Belief:</span>
                <p className="text-slate-700 mt-0.5">{bet.belief}</p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                <span className="font-semibold text-cyan-800">Bet:</span>
                <p className="text-slate-700 mt-0.5">{bet.bet}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-semibold text-emerald-800">Success Metric:</span>
                <p className="text-slate-700 mt-0.5">{bet.successMetric}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="font-semibold text-red-800">Kill Criteria:</span>
                <p className="text-slate-700 mt-0.5">{bet.killCriteria || 'Not defined'}</p>
                {bet.killDate && (
                  <p className="text-xs text-red-600 mt-1">Kill date: {new Date(bet.killDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* PTW Connection */}
          {(bet.ptwWhereToPlay || bet.ptwHowToWin) && (
            <div className="border-t border-slate-100 pt-4">
              <h5 className="text-sm font-semibold text-slate-900 mb-2">Playing to Win Alignment</h5>
              <div className="space-y-2 text-sm">
                {bet.ptwWhereToPlay && (
                  <div>
                    <span className="font-semibold text-[#1a1f3a]">Where to Play:</span>
                    <span className="text-slate-600 ml-1">{bet.ptwWhereToPlay}</span>
                  </div>
                )}
                {bet.ptwHowToWin && (
                  <div>
                    <span className="font-semibold text-[#1a1f3a]">How to Win:</span>
                    <span className="text-slate-600 ml-1">{bet.ptwHowToWin}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4-Dimension Scoring */}
          <div className="border-t border-slate-100 pt-4 mt-4">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">Strategic Scoring (Janakiraman 4D)</h5>
            <div className="space-y-3">
              <ScoreBar label="Expected Impact" value={bet.scoring.expectedImpact} color="bg-indigo-500" />
              <ScoreBar label="Certainty of Impact" value={bet.scoring.certaintyOfImpact} color="bg-cyan-500" />
              <ScoreBar label="Clarity of Levers" value={bet.scoring.clarityOfLevers} color="bg-emerald-500" />
              <ScoreBar label="Uniqueness of Levers" value={bet.scoring.uniquenessOfLevers} color="bg-amber-500" />
            </div>
          </div>

          {/* Strategic Risks */}
          <div className="border-t border-slate-100 pt-4 mt-4">
            <button
              onClick={(e) => { e.stopPropagation(); setShowRisks(!showRisks); }}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-slate-900">Strategic Risks</span>
              <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showRisks ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showRisks && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { key: 'market', label: 'Market', color: 'bg-blue-50 border-blue-100' },
                  { key: 'positioning', label: 'Positioning', color: 'bg-purple-50 border-purple-100' },
                  { key: 'execution', label: 'Execution', color: 'bg-amber-50 border-amber-100' },
                  { key: 'economic', label: 'Economic', color: 'bg-emerald-50 border-emerald-100' },
                ].map(({ key, label, color }) => (
                  <div key={key} className={`p-3 rounded-xl border ${color}`}>
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</span>
                    <p className="text-sm text-slate-600 mt-1">{bet.risks[key as keyof typeof bet.risks] || 'Not assessed'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evidence Trail */}
          {bet.evidenceLinks.length > 0 && (
            <div className="border-t border-slate-100 pt-4 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); setShowEvidence(!showEvidence); }}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-900">Supporting Evidence ({bet.evidenceLinks.length})</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showEvidence ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showEvidence && (
                <div className="mt-3 space-y-2">
                  {bet.evidenceLinks.map((ev: EvidenceLink, idx: number) => {
                    const territoryDisplay = getTerritoryDisplay(ev.territory);
                    return (
                      <div key={idx} className={`p-3 rounded-xl border ${territoryDisplay.bgColor} ${territoryDisplay.borderColor}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${territoryDisplay.color}`}>
                            {ev.territory}
                          </span>
                          <span className="text-xs text-slate-400">&bull;</span>
                          <span className="text-xs text-slate-500">{ev.researchArea.replace(/_/g, ' ')}</span>
                        </div>
                        <p className="text-sm text-slate-700 italic">&ldquo;{ev.quote}&rdquo;</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Agent Reasoning */}
          {bet.agentReasoning && (
            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">AI Reasoning</span>
                <p className="text-sm text-slate-700 mt-1">{bet.agentReasoning}</p>
              </div>
            </div>
          )}

          {/* Assumption being tested */}
          {bet.assumptionBeingTested && (
            <div className="border-t border-slate-100 pt-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assumption Being Tested</span>
                <p className="text-sm font-medium text-slate-900 mt-1">{bet.assumptionBeingTested}</p>
              </div>
            </div>
          )}

          {/* Edit/Delete Actions */}
          {(onEdit || onDelete) && (
            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(bet); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(bet.id); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
