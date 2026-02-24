'use client';

import { useState } from 'react';
import {
  Scale,
  MessageSquare,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Quote,
} from 'lucide-react';
import type { DebateIdeaCardData, CardAction, UserPosition } from '@/types/coaching-cards';

interface DebateCardProps {
  data: DebateIdeaCardData;
  onAction?: (action: CardAction) => void;
}

const POSITION_STYLES = {
  a: {
    selected: 'border-[#1a1f3a] bg-[#1a1f3a]/5 ring-2 ring-[#1a1f3a]/20',
    button: 'bg-[#1a1f3a] text-white',
  },
  b: {
    selected: 'border-[#fbbf24] bg-[#fbbf24]/10 ring-2 ring-[#fbbf24]/20',
    button: 'bg-[#fbbf24] text-[#1a1f3a]',
  },
  nuanced: {
    selected: 'border-purple-400 bg-purple-50 ring-2 ring-purple-200',
    button: 'bg-purple-600 text-white',
  },
};

/**
 * DebateCard - Two-column tension exploration
 *
 * Premium design for exploring strategic tensions:
 * - Side-by-side perspective comparison
 * - Position selector with visual feedback
 * - Optional reasoning input
 * - Coach-initiated or user-requested triggers
 */
export function DebateCard({ data, onAction }: DebateCardProps) {
  const [selectedPosition, setSelectedPosition] = useState<UserPosition>(data.userPosition || null);
  const [reasoning, setReasoning] = useState(data.userReasoning || '');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isResolved, setIsResolved] = useState(data.resolved || false);

  const handleSelectPosition = (position: UserPosition) => {
    setSelectedPosition(position);
  };

  const handleConfirm = () => {
    setIsResolved(true);
    onAction?.({
      cardId: data.id,
      action: 'resolve_debate',
      payload: {
        position: selectedPosition,
        reasoning,
        tensionId: data.tensionId,
      },
    });
  };

  if (isResolved) {
    return (
      <div className="debate-card-resolved rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 animate-entrance">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Position Captured</p>
            <p className="text-xs text-emerald-600">{data.title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        debate-card relative overflow-hidden
        rounded-2xl border-2 border-[#1a1f3a]/20
        bg-gradient-to-br from-slate-50 to-white
        animate-entrance
        transition-all duration-300
        hover:shadow-lg hover:shadow-slate-200/50
      `}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a1f3a] flex items-center justify-center shadow-md">
            <Scale className="w-5 h-5 text-[#fbbf24]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#fbbf24] bg-[#1a1f3a] px-2 py-0.5 rounded">
                {data.trigger === 'coach_initiated' ? 'Strategic Tension' : 'Exploring'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1a1f3a] leading-tight">
              {data.title}
            </h3>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="px-5 pb-5 animate-fade-in">
          {/* Context */}
          {data.context && (
            <p className="text-sm text-slate-600 leading-relaxed mb-5 pl-13">
              {data.context}
            </p>
          )}

          {/* Two perspectives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Perspective A */}
            <button
              onClick={() => handleSelectPosition('a')}
              className={`
                relative p-4 rounded-xl border-2 text-left
                transition-all duration-300
                ${selectedPosition === 'a'
                  ? POSITION_STYLES.a.selected
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedPosition === 'a' ? 'bg-[#1a1f3a]' : 'bg-slate-200'}`}>
                  <span className={`text-xs font-bold ${selectedPosition === 'a' ? 'text-white' : 'text-slate-500'}`}>A</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {data.perspectiveA.label}
                </span>
              </div>

              <div className="relative pl-1">
                <Quote className="absolute -left-1 -top-1 w-4 h-4 text-slate-200" />
                <p className="text-sm font-medium text-slate-800 leading-relaxed mb-2">
                  {data.perspectiveA.position}
                </p>
              </div>

              {data.perspectiveA.evidence && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {data.perspectiveA.evidence}
                    </p>
                  </div>
                </div>
              )}

              {selectedPosition === 'a' && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-[#1a1f3a]" />
                </div>
              )}
            </button>

            {/* Perspective B */}
            <button
              onClick={() => handleSelectPosition('b')}
              className={`
                relative p-4 rounded-xl border-2 text-left
                transition-all duration-300
                ${selectedPosition === 'b'
                  ? POSITION_STYLES.b.selected
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedPosition === 'b' ? 'bg-[#fbbf24]' : 'bg-slate-200'}`}>
                  <span className={`text-xs font-bold ${selectedPosition === 'b' ? 'text-[#1a1f3a]' : 'text-slate-500'}`}>B</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {data.perspectiveB.label}
                </span>
              </div>

              <div className="relative pl-1">
                <Quote className="absolute -left-1 -top-1 w-4 h-4 text-slate-200" />
                <p className="text-sm font-medium text-slate-800 leading-relaxed mb-2">
                  {data.perspectiveB.position}
                </p>
              </div>

              {data.perspectiveB.evidence && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {data.perspectiveB.evidence}
                    </p>
                  </div>
                </div>
              )}

              {selectedPosition === 'b' && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-[#fbbf24]" />
                </div>
              )}
            </button>
          </div>

          {/* Nuanced option */}
          <button
            onClick={() => handleSelectPosition('nuanced')}
            className={`
              w-full p-3 rounded-xl border-2 text-left mb-4
              transition-all duration-300
              ${selectedPosition === 'nuanced'
                ? POSITION_STYLES.nuanced.selected
                : 'border-dashed border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className={`w-4 h-4 ${selectedPosition === 'nuanced' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${selectedPosition === 'nuanced' ? 'text-purple-700' : 'text-slate-600'}`}>
                My view is more nuanced...
              </span>
              {selectedPosition === 'nuanced' && (
                <Check className="w-4 h-4 text-purple-600 ml-auto" />
              )}
            </div>
          </button>

          {/* Reasoning input (shown when nuanced selected) */}
          {selectedPosition === 'nuanced' && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Share your reasoning
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain your nuanced perspective..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all"
                rows={3}
              />
            </div>
          )}

          {/* Confirm button */}
          {selectedPosition && (
            <div className="flex justify-end animate-fade-in">
              <button
                onClick={handleConfirm}
                disabled={selectedPosition === 'nuanced' && !reasoning.trim()}
                className={`
                  inline-flex items-center gap-2
                  px-5 py-2.5 rounded-lg
                  text-sm font-semibold
                  shadow-md
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${POSITION_STYLES[selectedPosition]?.button || 'bg-slate-600 text-white'}
                `}
              >
                <Check className="w-4 h-4" />
                Confirm Position
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
