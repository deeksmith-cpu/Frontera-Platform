'use client';

import type { StrategyDocumentContent } from '@/types/bets';

interface AppendixPageProps {
  appendix: StrategyDocumentContent['appendix'];
}

export function AppendixPage({ appendix }: AppendixPageProps) {
  const totalBets = appendix.selectedBets.length;

  return (
    <article className="max-w-[680px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Appendix
        </span>
        <h3 className="text-2xl font-bold text-[#1a1f3a] mt-1 pb-3 border-b-2 border-[#fbbf24]/40">
          Supporting Data
        </h3>
      </div>

      {/* Portfolio Balance */}
      <section className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Portfolio Balance
        </h4>
        <div className="flex gap-3">
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{appendix.portfolioBalance.offensive}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Offensive</div>
          </div>
          <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{appendix.portfolioBalance.defensive}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Defensive</div>
          </div>
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{appendix.portfolioBalance.capability}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Capability</div>
          </div>
        </div>
      </section>

      {/* DHM Coverage */}
      <section className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          DHM Coverage
        </h4>
        <div className="flex gap-3">
          <div className="flex-1 bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-cyan-600">{appendix.dhmCoverage.delight}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Delight</div>
          </div>
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{appendix.dhmCoverage.hardToCopy}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Hard to Copy</div>
          </div>
          <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{appendix.dhmCoverage.marginEnhancing}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Margin Enhancing</div>
          </div>
        </div>
      </section>

      {/* PTW Cascade */}
      <section className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Playing to Win Cascade
        </h4>
        <div className="bg-[#1a1f3a] rounded-xl p-4 mb-3">
          <div className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-1">
            Winning Aspiration
          </div>
          <p className="text-sm text-white leading-relaxed">{appendix.ptwCascade.winningAspiration}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-2">Where to Play</div>
            <ul className="space-y-1">
              {appendix.ptwCascade.whereToPlay.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                  <span className="text-cyan-400 mt-0.5">•</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">How to Win</div>
            <ul className="space-y-1">
              {appendix.ptwCascade.howToWin.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">•</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bet Scoring Table */}
      <section className="mb-8">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Bet Scoring Details ({totalBets} bets)
        </h4>
        <div className="space-y-3">
          {appendix.selectedBets.map((bet, idx) => {
            const typeColors: Record<string, string> = {
              offensive: 'border-amber-300 bg-amber-50',
              defensive: 'border-emerald-300 bg-emerald-50',
              capability: 'border-purple-300 bg-purple-50',
            };
            return (
              <div
                key={bet.id || idx}
                className={`border rounded-xl p-4 ${typeColors[bet.thesisType] || 'border-slate-200 bg-slate-50'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Bet {idx + 1} — {bet.thesisType}
                    </span>
                    <h5 className="text-sm font-bold text-[#1a1f3a]">{bet.thesisTitle}</h5>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1f3a] text-[#fbbf24] text-sm font-bold flex-shrink-0">
                    {bet.scoring.overallScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 mb-3">
                  <div>Impact: <span className="font-semibold text-slate-800">{bet.scoring.expectedImpact}/10</span></div>
                  <div>Certainty: <span className="font-semibold text-slate-800">{bet.scoring.certaintyOfImpact}/10</span></div>
                  <div>Clarity: <span className="font-semibold text-slate-800">{bet.scoring.clarityOfLevers}/10</span></div>
                  <div>Uniqueness: <span className="font-semibold text-slate-800">{bet.scoring.uniquenessOfLevers}/10</span></div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div><span className="font-semibold text-cyan-700">Job:</span> {bet.hypothesis.job}</div>
                  <div><span className="font-semibold text-slate-600">Belief:</span> {bet.hypothesis.belief}</div>
                  <div><span className="font-semibold text-[#1a1f3a]">Bet:</span> {bet.hypothesis.bet}</div>
                  <div><span className="font-semibold text-emerald-700">Success:</span> {bet.hypothesis.success}</div>
                  <div><span className="font-semibold text-red-600">Kill:</span> {bet.hypothesis.kill.criteria} by {bet.hypothesis.kill.date}</div>
                </div>

                {bet.evidence && bet.evidence.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Evidence</div>
                    {bet.evidence.slice(0, 3).map((ev, i) => (
                      <div key={i} className="text-xs text-slate-500 italic">
                        &ldquo;{typeof ev === 'object' && 'quote' in ev ? ev.quote : String(ev)}&rdquo;
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
