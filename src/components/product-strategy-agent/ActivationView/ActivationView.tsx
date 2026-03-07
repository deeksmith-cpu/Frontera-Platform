'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ActivationSection } from '../CanvasPanel/ActivationSection';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface ActivationViewProps {
  conversation: Conversation;
  onPhaseTransition: (phase: string) => Promise<void>;
}

export function ActivationView({ conversation, onPhaseTransition }: ActivationViewProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinueToReview = useCallback(async () => {
    setIsTransitioning(true);
    setError(null);
    try {
      await onPhaseTransition('review');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsTransitioning(false);
    }
  }, [onPhaseTransition]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="animate-entrance">
        <ActivationSection conversation={conversation} />

        {/* Phase transition CTA */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Artefacts Ready?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 max-w-md mx-auto leading-relaxed">
              Once your activation artefacts are generated and reviewed,
              move to Living Strategy to track assumptions, signals, and strategy evolution.
            </p>

            {error && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 max-w-lg mx-auto text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">{error}</p>
              </div>
            )}

            <button
              onClick={handleContinueToReview}
              disabled={isTransitioning}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransitioning ? 'Transitioning...' : 'Continue to Living Strategy'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
