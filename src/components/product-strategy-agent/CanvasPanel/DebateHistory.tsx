'use client';

import { useState } from 'react';
import type { DebateDecision } from '@/lib/knowledge/tension-map';

interface DebateHistoryProps {
  decisions: DebateDecision[];
  onRevisit?: (tensionId: string) => void;
}

export function DebateHistory({ decisions, onRevisit }: DebateHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (decisions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-bold text-slate-900">Debate History ({decisions.length})</h3>
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => {
          const isExpanded = expandedId === decision.tensionId;
          const choiceLabel =
            decision.userChoice === 'position_a' ? decision.positionA.expert :
            decision.userChoice === 'position_b' ? decision.positionB.expert : 'Nuanced';

          return (
            <div key={decision.tensionId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : decision.tensionId)}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1a1f3a] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{decision.tensionTitle}</p>
                    <p className="text-xs text-slate-500">
                      Chose: <span className="font-semibold text-slate-700">{choiceLabel}</span>
                      {' · '}
                      {new Date(decision.decidedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 p-4 space-y-3">
                  {/* Positions summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-xl border ${decision.userChoice === 'position_a' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Position A</p>
                      <p className="text-sm font-medium text-slate-900">{decision.positionA.expert}</p>
                      <p className="text-xs text-slate-600 mt-1">{decision.positionA.argument.slice(0, 100)}...</p>
                    </div>
                    <div className={`p-3 rounded-xl border ${decision.userChoice === 'position_b' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Position B</p>
                      <p className="text-sm font-medium text-slate-900">{decision.positionB.expert}</p>
                      <p className="text-xs text-slate-600 mt-1">{decision.positionB.argument.slice(0, 100)}...</p>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-[#f4f4f7] rounded-xl p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Reasoning</p>
                    <p className="text-sm text-slate-700">{decision.userReasoning}</p>
                  </div>

                  {/* Revisit button */}
                  {onRevisit && (
                    <button
                      onClick={() => onRevisit(decision.tensionId)}
                      className="text-xs font-semibold text-[#1a1f3a] hover:text-[#fbbf24] transition-colors"
                    >
                      Revisit this debate →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
