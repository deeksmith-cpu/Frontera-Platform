'use client';

import { useState } from 'react';
import type { StrategicThesis, StrategicBet } from '@/types/bets';
import { BetCard } from './BetCard';

interface ThesisGroupProps {
  thesis: StrategicThesis;
  bets: StrategicBet[];
  onEditBet?: (bet: StrategicBet) => void;
  onDeleteBet?: (betId: string) => void;
}

function getThesisTypeDisplay(type: string) {
  switch (type) {
    case 'offensive': return { label: 'Offensive', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'defensive': return { label: 'Defensive', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'capability': return { label: 'Capability', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    default: return { label: type, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
  }
}

function getTimeHorizonLabel(horizon: string) {
  switch (horizon) {
    case '90d': return '90 Days';
    case '6m': return '6 Months';
    case '12m': return '12 Months';
    case '18m': return '18 Months';
    default: return horizon;
  }
}

export function ThesisGroup({ thesis, bets, onEditBet, onDeleteBet }: ThesisGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedBetId, setExpandedBetId] = useState<string | null>(null);
  const [showDHM, setShowDHM] = useState(false);
  const [showPTW, setShowPTW] = useState(false);

  const typeDisplay = getThesisTypeDisplay(thesis.thesisType);
  const avgScore = bets.length > 0
    ? Math.round(bets.reduce((sum, b) => sum + b.scoring.overallScore, 0) / bets.length)
    : 0;

  return (
    <div className={`rounded-2xl border-2 ${typeDisplay.border} overflow-hidden transition-all duration-300`}>
      {/* Thesis Header */}
      <div
        className={`${typeDisplay.bg} p-5 cursor-pointer`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold py-1 px-2.5 rounded-full ${typeDisplay.bg} ${typeDisplay.text} border ${typeDisplay.border}`}>
                {typeDisplay.label}
              </span>
              <span className="text-xs font-semibold py-1 px-2.5 rounded-full bg-slate-100 text-slate-600">
                {getTimeHorizonLabel(thesis.timeHorizon)}
              </span>
              <span className="text-xs font-semibold py-1 px-2.5 rounded-full bg-cyan-50 text-cyan-700">
                {bets.length} bet{bets.length !== 1 ? 's' : ''}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{thesis.title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{thesis.description}</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Average Score */}
            <div className="w-12 h-12 rounded-full bg-[#1a1f3a] flex items-center justify-center">
              <span className="text-sm font-bold text-white">{avgScore}</span>
            </div>
            {/* Collapse indicator */}
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* DHM Badges */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); setShowDHM(!showDHM); }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
          >
            DHM Filter
          </button>
          <span className={`text-xs py-0.5 px-2 rounded-full ${thesis.dhmDelight ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {thesis.dhmDelight ? '✓' : '—'} Delight
          </span>
          <span className={`text-xs py-0.5 px-2 rounded-full ${thesis.dhmHardToCopy ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {thesis.dhmHardToCopy ? '✓' : '—'} Hard to Copy
          </span>
          <span className={`text-xs py-0.5 px-2 rounded-full ${thesis.dhmMarginEnhancing ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {thesis.dhmMarginEnhancing ? '✓' : '—'} Margin
          </span>
        </div>

        {/* DHM Details (collapsible) */}
        {showDHM && (
          <div className="mt-3 space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
            {thesis.dhmDelight && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="font-semibold text-emerald-700">Delight:</span>
                <span className="text-slate-600 ml-1">{thesis.dhmDelight}</span>
              </div>
            )}
            {thesis.dhmHardToCopy && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="font-semibold text-emerald-700">Hard to Copy:</span>
                <span className="text-slate-600 ml-1">{thesis.dhmHardToCopy}</span>
              </div>
            )}
            {thesis.dhmMarginEnhancing && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="font-semibold text-emerald-700">Margin Enhancing:</span>
                <span className="text-slate-600 ml-1">{thesis.dhmMarginEnhancing}</span>
              </div>
            )}
          </div>
        )}

        {/* PTW Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowPTW(!showPTW); }}
          className="mt-2 text-xs font-semibold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
        >
          {showPTW ? 'Hide' : 'Show'} PTW Cascade
        </button>
        {showPTW && (
          <div className="mt-2 space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 bg-white/60 rounded-lg">
              <span className="font-semibold text-[#1a1f3a]">Winning Aspiration:</span>
              <span className="text-slate-600 ml-1">{thesis.ptwWinningAspiration || 'Not defined'}</span>
            </div>
            <div className="p-2 bg-white/60 rounded-lg">
              <span className="font-semibold text-[#1a1f3a]">Where to Play:</span>
              <span className="text-slate-600 ml-1">{thesis.ptwWhereToPlay || 'Not defined'}</span>
            </div>
            <div className="p-2 bg-white/60 rounded-lg">
              <span className="font-semibold text-[#1a1f3a]">How to Win:</span>
              <span className="text-slate-600 ml-1">{thesis.ptwHowToWin || 'Not defined'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bets List */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 bg-white">
          {bets.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 italic">No bets under this thesis yet</p>
          ) : (
            bets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                isExpanded={expandedBetId === bet.id}
                onToggleExpand={() => setExpandedBetId(expandedBetId === bet.id ? null : bet.id)}
                onEdit={onEditBet}
                onDelete={onDeleteBet}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
