'use client';

import { useState } from 'react';
import type { StrategicTension as SynthesisTension } from '@/types/synthesis';
import type { StrategicTension, ExpertPosition, DebateDecision } from '@/lib/knowledge/tension-map';

interface DebateCardProps {
  synthesyisTension: SynthesisTension;
  expertTension: StrategicTension;
  onDecision: (decision: DebateDecision) => void;
  existingDecision?: DebateDecision;
}

function ExpertPanel({
  position,
  side,
  isSelected,
  onSelect,
}: {
  position: ExpertPosition;
  side: 'A' | 'B';
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colorA = { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700', accent: 'text-indigo-600', ring: 'ring-indigo-400' };
  const colorB = { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700', accent: 'text-rose-600', ring: 'ring-rose-400' };
  const c = side === 'A' ? colorA : colorB;

  return (
    <button
      onClick={onSelect}
      className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
        isSelected
          ? `${c.bg} ${c.border} ring-2 ${c.ring} shadow-md`
          : `bg-white border-slate-200 hover:${c.border} hover:shadow-md`
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${c.accent}`}>{side}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{position.expert}</p>
          <p className="text-xs text-slate-500">{position.company}</p>
        </div>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed mb-3">{position.argument}</p>
      <blockquote className={`text-xs italic ${c.accent} border-l-2 ${c.border} pl-3`}>
        &ldquo;{position.quote}&rdquo;
      </blockquote>
      <p className="text-xs text-slate-400 mt-2">
        Source: {position.transcriptRef.replace('.txt', '')}
      </p>
    </button>
  );
}

export function DebateCard({ expertTension, onDecision, existingDecision }: DebateCardProps) {
  const [selectedSide, setSelectedSide] = useState<'position_a' | 'position_b' | 'nuanced' | null>(
    existingDecision?.userChoice || null
  );
  const [reasoning, setReasoning] = useState(existingDecision?.userReasoning || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecided, setIsDecided] = useState(!!existingDecision);

  const handleSubmit = async () => {
    if (!selectedSide || !reasoning.trim()) return;
    setIsSubmitting(true);

    const decision: DebateDecision = {
      tensionId: expertTension.id,
      tensionTitle: expertTension.title,
      positionA: expertTension.positionA,
      positionB: expertTension.positionB,
      userChoice: selectedSide,
      userReasoning: reasoning.trim(),
      userResearchEvidence: [],
      decidedAt: new Date().toISOString(),
    };

    onDecision(decision);
    setIsDecided(true);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a1f3a] px-6 py-4">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider">Debate Mode</span>
        </div>
        <h3 className="text-lg font-bold text-white">{expertTension.title}</h3>
        <p className="text-sm text-slate-300 mt-1">{expertTension.description}</p>
      </div>

      <div className="p-6">
        {/* Two-column expert positions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ExpertPanel
            position={expertTension.positionA}
            side="A"
            isSelected={selectedSide === 'position_a'}
            onSelect={() => !isDecided && setSelectedSide('position_a')}
          />
          <ExpertPanel
            position={expertTension.positionB}
            side="B"
            isSelected={selectedSide === 'position_b'}
            onSelect={() => !isDecided && setSelectedSide('position_b')}
          />
        </div>

        {/* Nuanced option */}
        {!isDecided && (
          <button
            onClick={() => setSelectedSide('nuanced')}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-300 mb-4 ${
              selectedSide === 'nuanced'
                ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400'
                : 'bg-white border-slate-200 hover:border-purple-300'
            }`}
          >
            <span className="text-sm font-semibold text-slate-700">Nuanced Position</span>
            <span className="text-xs text-slate-500 ml-2">— Elements of both apply to my context</span>
          </button>
        )}

        {/* Neutral question */}
        <div className="bg-[#f4f4f7] rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-slate-700">{expertTension.neutralQuestion}</p>
        </div>

        {/* Reasoning input */}
        {!isDecided && selectedSide && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
              Your Reasoning
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain why this position aligns with your strategic context..."
              className="w-full text-sm p-4 border border-slate-200 rounded-xl bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
              rows={3}
            />
          </div>
        )}

        {/* Submit button */}
        {!isDecided && (
          <button
            onClick={handleSubmit}
            disabled={!selectedSide || !reasoning.trim() || isSubmitting}
            className="w-full py-3 bg-[#fbbf24] text-slate-900 font-semibold rounded-xl hover:bg-[#f59e0b] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving Decision...' : 'Confirm My Position'}
          </button>
        )}

        {/* Decision summary */}
        {isDecided && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-emerald-700">Decision Recorded</span>
            </div>
            <p className="text-sm text-emerald-800">
              <span className="font-medium">Choice:</span>{' '}
              {selectedSide === 'position_a' ? expertTension.positionA.expert :
               selectedSide === 'position_b' ? expertTension.positionB.expert : 'Nuanced Position'}
            </p>
            <p className="text-sm text-emerald-700 mt-1">{reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
}
