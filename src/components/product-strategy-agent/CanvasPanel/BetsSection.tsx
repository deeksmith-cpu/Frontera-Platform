'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Database } from '@/types/database';
import type { BetsResponse, StrategicBet } from '@/types/bets';
import type { SynthesisResult } from '@/types/synthesis';
import { ThesisGroup } from './ThesisGroup';
import { BetCard } from './BetCard';
import { CreateBetModal } from './CreateBetModal';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface BetsSectionProps {
  conversation: Conversation;
}

export function BetsSection({ conversation }: BetsSectionProps) {
  // Data state
  const [betsData, setBetsData] = useState<BetsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synthesis state (for modal)
  const [synthesis, setSynthesis] = useState<SynthesisResult | null>(null);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // UI state
  const [editingBet, setEditingBet] = useState<StrategicBet | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Fetch bets data
  const fetchBets = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/product-strategy-agent/bets?conversation_id=${conversation.id}`
      );
      if (response.ok) {
        const data: BetsResponse = await response.json();
        setBetsData(data);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to load bets');
      }
    } catch (err) {
      console.error('Error fetching bets:', err);
      setError('Failed to load bets');
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  // Fetch synthesis for modal
  useEffect(() => {
    async function fetchSynthesis() {
      try {
        const response = await fetch(
          `/api/product-strategy-agent/synthesis?conversation_id=${conversation.id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.synthesis) {
            setSynthesis(data.synthesis);
          }
        }
      } catch (err) {
        console.error('Error fetching synthesis:', err);
      }
    }
    fetchSynthesis();
  }, [conversation.id]);

  // Generate bets from synthesis
  const handleGenerateBets = useCallback(async () => {
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/product-strategy-agent/bets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: conversation.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGenerateError(data.error || 'Failed to generate bets');
        return;
      }

      // Refresh bets data
      await fetchBets();
    } catch (err) {
      console.error('Error generating bets:', err);
      setGenerateError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [conversation.id, fetchBets]);
  // Delete a bet
  const handleDeleteBet = useCallback(async (betId: string) => {
    if (!confirm('Are you sure you want to delete this bet?')) return;

    try {
      const response = await fetch('/api/product-strategy-agent/bets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: betId }),
      });

      if (response.ok) {
        await fetchBets();
      }
    } catch (err) {
      console.error('Error deleting bet:', err);
    }
  }, [fetchBets]);

  // Handle edit
  const handleEditBet = useCallback((bet: StrategicBet) => {
    setEditingBet(bet);
    setShowCreateModal(true);
  }, []);

  // Quality gate check
  const qualityGateMet = betsData
    ? betsData.portfolioSummary.totalBets >= 3 &&
      betsData.portfolioSummary.totalTheses >= 1 &&
      betsData.theses.every((t) => t.bets.every((b) => b.killCriteria))
    : false;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1a1f3a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading strategic bets...</p>
        </div>
      </div>
    );
  }

  const hasBets = betsData && betsData.portfolioSummary.totalBets > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">      {/* Strategy Hierarchy Banner */}
      <div className="bg-[#f4f4f7] rounded-2xl border border-slate-200 p-4">
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-slate-400">Strategic Intent</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">Product Initiatives</span>
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-400">Options (Team Level)</span>
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          You are operating at the <strong>Product Initiative</strong> level — strategic bets that test your Where-to-Play and How-to-Win choices.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {/* No bets yet — Generate CTA */}
      {!hasBets && !error && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-cyan-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Generate Strategic Bets</h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Transform your synthesis opportunities into testable strategic bets grouped under coherent strategic theses.
          </p>
          {generateError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">{generateError}</p>
            </div>
          )}
          <button
            onClick={handleGenerateBets}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#fbbf24] text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Generating Strategic Bets...
              </span>
            ) : (
              'Generate from Synthesis'
            )}
          </button>
        </div>
      )}
      {/* Portfolio Summary */}
      {hasBets && betsData && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{betsData.portfolioSummary.totalBets}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Bets</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{betsData.portfolioSummary.totalTheses}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Theses</p>
            </div>
            <div className="bg-white border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-700">{betsData.portfolioSummary.byThesisType.offensive}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Offensive</p>
            </div>
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{betsData.portfolioSummary.byThesisType.defensive}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Defensive</p>
            </div>
            <div className="bg-white border border-purple-200 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{betsData.portfolioSummary.byThesisType.capability}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Capability</p>
            </div>
          </div>
          {/* Kill dates warning */}
          {betsData.portfolioSummary.killDatesApproaching > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-amber-700">
                <strong>{betsData.portfolioSummary.killDatesApproaching}</strong> bet{betsData.portfolioSummary.killDatesApproaching !== 1 ? 's have' : ' has'} kill dates approaching within 30 days.
              </p>
            </div>
          )}

          {/* Thesis Groups */}
          <div className="space-y-6">
            {betsData.theses.map((thesisWithBets) => (
              <ThesisGroup
                key={thesisWithBets.id}
                thesis={thesisWithBets}
                bets={thesisWithBets.bets}
                onEditBet={handleEditBet}
                onDeleteBet={handleDeleteBet}
              />
            ))}
          </div>

          {/* Ungrouped Bets */}
          {betsData.ungroupedBets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Ungrouped Bets ({betsData.ungroupedBets.length})</h3>
              {betsData.ungroupedBets.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={bet}
                  onEdit={handleEditBet}
                  onDelete={handleDeleteBet}
                />
              ))}
            </div>
          )}
          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 bg-[#1a1f3a] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2d3561] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Bet
              </button>
              <button
                onClick={handleGenerateBets}
                disabled={isGenerating}
                className="text-xs sm:text-sm text-slate-500 hover:text-[#1a1f3a] font-medium transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate Bets'}
              </button>
            </div>

            {/* Quality Gate / Export */}
            <div className="flex items-center gap-2">
              {!qualityGateMet && (
                <span className="text-xs text-slate-500">
                  Need ≥3 bets, ≥1 thesis, all with kill criteria to export
                </span>
              )}
              <button
                disabled={!qualityGateMet}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 bg-[#fbbf24] text-slate-900 text-xs sm:text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Strategic Bets
              </button>
            </div>
          </div>
        </>
      )}
      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateBetModal
          conversationId={conversation.id}
          theses={betsData?.theses || []}
          synthesis={synthesis}
          editingBet={editingBet}
          onClose={() => {
            setShowCreateModal(false);
            setEditingBet(null);
          }}
          onSuccess={async () => {
            setShowCreateModal(false);
            setEditingBet(null);
            await fetchBets();
          }}
        />
      )}
    </div>
  );
}