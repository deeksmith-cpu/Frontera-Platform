'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SynthesisResult } from '@/types/synthesis';

interface TerritoryInsight {
  id: string;
  conversation_id: string;
  territory: 'company' | 'customer' | 'competitor';
  research_area: string;
  responses: Record<string, unknown>;
  confidence: Record<string, string> | null;
  status: 'unexplored' | 'in_progress' | 'mapped';
  updated_at: string;
  created_at: string;
}

interface BetsData {
  theses: Array<{
    id: string;
    title: string;
    description: string;
    opportunityId: string;
    ptwWinningAspiration: string;
    ptwWhereToPlay: string;
    ptwHowToWin: string;
    dhmDelight: string;
    dhmHardToCopy: string;
    dhmMarginEnhancing: string;
    thesisType: 'offensive' | 'defensive' | 'capability';
    bets: Array<{
      id: string;
      jobToBeDone: string;
      belief: string;
      bet: string;
      successMetric: string;
      killCriteria: string;
      killDate: string;
      status: string;
      scoring: {
        expectedImpact: number;
        certaintyOfImpact: number;
        clarityOfLevers: number;
        uniquenessOfLevers: number;
        overallScore: number;
      };
      priorityLevel: string;
      timeHorizon: string;
    }>;
  }>;
  portfolioSummary: {
    totalBets: number;
    totalTheses: number;
    byThesisType: { offensive: number; defensive: number; capability: number };
    avgScore: number;
  };
}

export interface LiveCanvasData {
  territoryInsights: TerritoryInsight[];
  synthesis: SynthesisResult | null;
  bets: BetsData | null;
  isLoading: boolean;
  error: string | null;
}

const POLL_INTERVAL = 15_000;

export function useLiveCanvasData(conversationId: string | null): LiveCanvasData & { refresh: () => void } {
  const [territoryInsights, setTerritoryInsights] = useState<TerritoryInsight[]>([]);
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);
  const [bets, setBets] = useState<BetsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!conversationId) return;

    try {
      const [territoriesRes, synthesisRes, betsRes] = await Promise.allSettled([
        fetch(`/api/product-strategy-agent-v2/territories?conversation_id=${conversationId}`),
        fetch(`/api/product-strategy-agent-v2/synthesis?conversation_id=${conversationId}`),
        fetch(`/api/product-strategy-agent-v2/bets?conversation_id=${conversationId}`),
      ]);

      // Territory insights
      if (territoriesRes.status === 'fulfilled' && territoriesRes.value.ok) {
        const data = await territoriesRes.value.json();
        setTerritoryInsights(Array.isArray(data) ? data : []);
      }

      // Synthesis
      if (synthesisRes.status === 'fulfilled' && synthesisRes.value.ok) {
        const data = await synthesisRes.value.json();
        setSynthesis(data.synthesis || null);
      }

      // Bets
      if (betsRes.status === 'fulfilled' && betsRes.value.ok) {
        const data = await betsRes.value.json();
        if (data.success) {
          setBets({
            theses: data.theses || [],
            portfolioSummary: data.portfolioSummary || null,
          });
        }
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch live canvas data:', err);
      setError('Failed to load canvas data');
    }
  }, [conversationId]);

  // Initial fetch + polling
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;

    const doInitialFetch = async () => {
      await fetchData();
      if (!cancelled) setIsLoading(false);
    };

    doInitialFetch();

    // Poll for updates
    intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [conversationId, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { territoryInsights, synthesis, bets, isLoading, error, refresh };
}
