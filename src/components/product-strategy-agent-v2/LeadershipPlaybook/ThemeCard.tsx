'use client';

import { useState } from 'react';

interface PlaybookTheme {
  title: string;
  relevanceExplanation: string;
  expertQuotes: { speaker: string; company: string; quote: string; context: string }[];
  actionablePractices: { title: string; description: string; frequency: string }[];
  recommendedListening: { episodeTitle: string; speaker: string; topic: string }[];
}

interface ThemeCardProps {
  theme: PlaybookTheme;
  index: number;
}

const frequencyColors: Record<string, { bg: string; text: string }> = {
  daily: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  weekly: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  monthly: { bg: 'bg-amber-100', text: 'text-amber-700' },
  quarterly: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

export function ThemeCard({ theme, index }: ThemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-cyan-300">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a1f3a] flex items-center justify-center flex-shrink-0">
              <span className="text-[#fbbf24] font-bold text-sm">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{theme.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{theme.expertQuotes.length} experts · {theme.actionablePractices.length} practices</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-6 pb-6 space-y-6">
          {/* Why This Theme */}
          <div className="mt-4 bg-cyan-50 border border-cyan-200 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-2">Why This Theme</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{theme.relevanceExplanation}</p>
          </div>

          {/* Expert Quotes */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Expert Perspectives</h4>
            <div className="space-y-3">
              {theme.expertQuotes.map((quote, i) => (
                <div key={i} className="bg-[#f4f4f7] rounded-xl p-4">
                  <blockquote className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">{quote.speaker}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{quote.company}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{quote.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Practices */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Actionable Practices</h4>
            <div className="space-y-2">
              {theme.actionablePractices.map((practice, i) => {
                const fc = frequencyColors[practice.frequency] || frequencyColors.weekly;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900">{practice.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fc.bg} ${fc.text}`}>
                          {practice.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{practice.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Listening */}
          {theme.recommendedListening.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommended Listening</h4>
              <div className="space-y-2">
                {theme.recommendedListening.map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{ep.episodeTitle}</p>
                      <p className="text-xs text-slate-500">{ep.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
