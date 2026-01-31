'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeCard } from './ThemeCard';
import { LockedState } from './LockedState';

interface PlaybookTheme {
  title: string;
  relevanceExplanation: string;
  expertQuotes: { speaker: string; company: string; quote: string; context: string }[];
  actionablePractices: { title: string; description: string; frequency: string }[];
  recommendedListening: { episodeTitle: string; speaker: string; topic: string }[];
}

interface Playbook {
  themes: PlaybookTheme[];
  generatedAt: string;
  generationContext: {
    industry: string | null;
    painPoints: string | null;
    strategicFocus: string | null;
    phase: string;
  };
}

interface PlaybookViewProps {
  conversationId: string;
}

export function PlaybookView({ conversationId }: PlaybookViewProps) {
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing playbook
  useEffect(() => {
    async function fetchPlaybook() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/leadership-playbook?conversation_id=${conversationId}`
        );
        if (response.ok) {
          const data = await response.json();
          setPlaybook(data.playbook || null);
        }
      } catch (err) {
        console.error('Error fetching playbook:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaybook();
  }, [conversationId]);

  // Generate playbook
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/leadership-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversationId }),
      });

      if (response.status === 403) {
        setIsLocked(true);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate playbook');
      }

      const data = await response.json();
      if (data.success && data.playbook) {
        setPlaybook(data.playbook);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate playbook');
    } finally {
      setIsGenerating(false);
    }
  }, [conversationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading playbook...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return <LockedState />;
  }

  if (!playbook) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#f4f4f7] rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-[#1a1f3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Generate Your Leadership Playbook</h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-8 leading-relaxed">
          Get personalized leadership development recommendations based on your strategic challenges,
          drawn from insights of 280+ leaders across Meta, Canva, Stripe, Airbnb, and more.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 max-w-md mx-auto">
            {error}
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-8 py-3 bg-[#fbbf24] text-slate-900 font-semibold rounded-xl hover:bg-[#f59e0b] hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Generating Playbook...
            </span>
          ) : (
            'Generate My Playbook'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Leadership Playbook</h2>
          <p className="text-sm text-slate-600">
            {playbook.themes.length} leadership themes personalized to your strategic context
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Generated {new Date(playbook.generatedAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-sm text-slate-500 hover:text-[#1a1f3a] font-medium transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {/* Why These Themes */}
      {playbook.generationContext && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-cyan-800 mb-2">Why These Themes?</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            These themes were selected based on
            {playbook.generationContext.industry && ` your ${playbook.generationContext.industry} industry context,`}
            {playbook.generationContext.painPoints && ` your strategic challenges,`}
            {playbook.generationContext.strategicFocus && ` your focus on ${playbook.generationContext.strategicFocus.replace(/_/g, ' ')},`}
            {' '}and insights from 301 leadership conversations with proven product leaders.
          </p>
        </div>
      )}

      {/* Theme Cards */}
      <div className="space-y-4">
        {playbook.themes.map((theme, i) => (
          <ThemeCard key={i} theme={theme} index={i} />
        ))}
      </div>
    </div>
  );
}
