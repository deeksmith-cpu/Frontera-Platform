'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ActivationDashboard } from './ActivationDashboard';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

type ArtefactType = 'team_brief' | 'guardrails' | 'okr_cascade' | 'decision_framework' | 'stakeholder_pack';

interface Artefact {
  id: string;
  title: string;
  artefact_type: ArtefactType;
  content: Record<string, unknown>;
  audience: string | null;
  created_at: string;
  source_bet_id: string | null;
}

interface ActivationViewProps {
  conversation: Conversation;
  onPhaseTransition: (phase: string) => Promise<void>;
}

export function ActivationView({ conversation, onPhaseTransition }: ActivationViewProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  // Load artefacts
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/product-strategy-agent/activation');
        if (res.ok) {
          const data = await res.json();
          setArtefacts(data.artefacts || []);
        }
      } catch (err) {
        console.error('Failed to load artefacts:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Generate an artefact
  const handleGenerate = useCallback(
    async (type: ArtefactType, betId?: string, audience?: string) => {
      const label = type === 'stakeholder_pack' ? `${type}_${audience}` : type;
      setGenerating(label);
      try {
        const res = await fetch('/api/product-strategy-agent/activation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            conversationId: conversation.id,
            betId,
            audience,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.artefact) {
            setArtefacts((prev) => [data.artefact, ...prev]);
          }
        } else {
          const err = await res.json();
          console.error('Generate failed:', err.error);
        }
      } catch (err) {
        console.error('Generate error:', err);
      } finally {
        setGenerating(null);
      }
    },
    [conversation.id]
  );

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-slate-600 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-xs uppercase tracking-wide font-semibold">Loading activation artefacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="animate-entrance">
        <ActivationDashboard
          conversationId={conversation.id}
          artefacts={artefacts}
          generating={generating}
          onGenerate={handleGenerate}
        />

        {/* Phase transition CTA */}
        <div className="max-w-4xl mx-auto px-6 pb-8">
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
