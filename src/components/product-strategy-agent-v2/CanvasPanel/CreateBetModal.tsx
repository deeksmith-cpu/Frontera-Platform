'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  StrategicBet,
  StrategicThesis,
  CreateBetRequest,
  UpdateBetRequest,
  BetStatus,
  TimeHorizon,
  StrategicRisks,
} from '@/types/bets';
import type { SynthesisResult, EvidenceLink } from '@/types/synthesis';

interface CreateBetModalProps {
  conversationId: string;
  theses: (StrategicThesis & { bets: StrategicBet[] })[];
  synthesis: SynthesisResult | null;
  editingBet?: StrategicBet | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * CreateBetModal
 *
 * Full-featured modal for creating or editing strategic bets with:
 * - Thesis selector (existing or create new)
 * - Opportunity selector
 * - 5-part hypothesis inputs (Job/Belief/Bet/Success/Kill)
 * - 4-dimension scoring sliders (1-10 scale)
 * - Strategic risk assessment (market, positioning, execution, economic)
 * - Kill criteria text + date picker
 * - Time horizon selector
 * - Evidence selector from opportunities
 * - Dependency selector (optional)
 */
export function CreateBetModal({
  conversationId,
  theses,
  synthesis,
  editingBet,
  onClose,
  onSuccess,
}: CreateBetModalProps) {
  const isEditing = !!editingBet;

  // Form state - 5-part hypothesis
  const [jobToBeDone, setJobToBeDone] = useState(editingBet?.jobToBeDone || '');
  const [belief, setBelief] = useState(editingBet?.belief || '');
  const [bet, setBet] = useState(editingBet?.bet || '');
  const [successMetric, setSuccessMetric] = useState(editingBet?.successMetric || '');
  const [killCriteria, setKillCriteria] = useState(editingBet?.killCriteria || '');
  const [killDate, setKillDate] = useState(
    editingBet?.killDate ? new Date(editingBet.killDate).toISOString().split('T')[0] : ''
  );

  // Form state - Metadata
  const [thesisId, setThesisId] = useState<string>(editingBet?.strategicThesisId || '');
  const [opportunityId, setOpportunityId] = useState(editingBet?.opportunityId || '');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon | ''>(editingBet?.timeHorizon || '90d');

  // Form state - 4-dimension scoring (1-10)
  const [expectedImpact, setExpectedImpact] = useState(editingBet?.scoring.expectedImpact || 5);
  const [certaintyOfImpact, setCertaintyOfImpact] = useState(editingBet?.scoring.certaintyOfImpact || 5);
  const [clarityOfLevers, setClarityOfLevers] = useState(editingBet?.scoring.clarityOfLevers || 5);
  const [uniquenessOfLevers, setUniquenessOfLevers] = useState(editingBet?.scoring.uniquenessOfLevers || 5);

  // Form state - Strategic risks
  const [marketRisk, setMarketRisk] = useState(editingBet?.risks.market || '');
  const [positioningRisk, setPositioningRisk] = useState(editingBet?.risks.positioning || '');
  const [executionRisk, setExecutionRisk] = useState(editingBet?.risks.execution || '');
  const [economicRisk, setEconomicRisk] = useState(editingBet?.risks.economic || '');

  // Form state - Evidence selection
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    editingBet?.evidenceLinks.map((e) => e.insightId) || []
  );

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate overall score from 4 dimensions
  const overallScore = Math.round(
    ((expectedImpact + certaintyOfImpact + clarityOfLevers + uniquenessOfLevers) / 40) * 100
  );

  // Get available opportunities from synthesis
  const opportunities = synthesis?.opportunities || [];

  // Get evidence from selected opportunity
  const selectedOpportunity = opportunities.find((o) => o.id === opportunityId);
  const availableEvidence = selectedOpportunity?.evidence || [];

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation
      if (!jobToBeDone.trim()) {
        setError('Job to Be Done is required');
        return;
      }
      if (!belief.trim()) {
        setError('Belief is required');
        return;
      }
      if (!bet.trim()) {
        setError('Bet is required');
        return;
      }
      if (!successMetric.trim()) {
        setError('Success Metric is required');
        return;
      }
      if (!opportunityId) {
        setError('Opportunity selection is required');
        return;
      }

      setIsSaving(true);

      try {
        // Build evidence links from selected IDs
        const evidenceLinks: EvidenceLink[] = availableEvidence.filter((e) =>
          selectedEvidenceIds.includes(e.insightId)
        );

        // Build strategic risks object
        const risks: StrategicRisks = {
          market: marketRisk,
          positioning: positioningRisk,
          execution: executionRisk,
          economic: economicRisk,
        };

        if (isEditing && editingBet) {
          // Update existing bet
          const updateData: UpdateBetRequest = {
            id: editingBet.id,
            job_to_be_done: jobToBeDone,
            belief,
            bet,
            success_metric: successMetric,
            kill_criteria: killCriteria || null,
            kill_date: killDate || null,
            strategic_thesis_id: thesisId || null,
            opportunity_id: opportunityId,
            time_horizon: timeHorizon || null,
            expected_impact: expectedImpact,
            certainty_of_impact: certaintyOfImpact,
            clarity_of_levers: clarityOfLevers,
            uniqueness_of_levers: uniquenessOfLevers,
            evidence_links: evidenceLinks,
            risks,
          };

          const response = await fetch('/api/product-strategy-agent-v2/bets', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to update bet');
          }
        } else {
          // Create new bet
          const createData: CreateBetRequest = {
            conversation_id: conversationId,
            strategic_thesis_id: thesisId || '',
            job_to_be_done: jobToBeDone,
            belief,
            bet,
            success_metric: successMetric,
            kill_criteria: killCriteria || undefined,
            kill_date: killDate || undefined,
            opportunity_id: opportunityId,
            evidence_links: evidenceLinks,
            expected_impact: expectedImpact,
            certainty_of_impact: certaintyOfImpact,
            clarity_of_levers: clarityOfLevers,
            uniqueness_of_levers: uniquenessOfLevers,
            time_horizon: timeHorizon || undefined,
            risks,
          };

          const response = await fetch('/api/product-strategy-agent-v2/bets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createData),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to create bet');
          }
        }

        onSuccess();
      } catch (err) {
        console.error('Error saving bet:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsSaving(false);
      }
    },
    [
      conversationId,
      jobToBeDone,
      belief,
      bet,
      successMetric,
      killCriteria,
      killDate,
      thesisId,
      opportunityId,
      timeHorizon,
      expectedImpact,
      certaintyOfImpact,
      clarityOfLevers,
      uniquenessOfLevers,
      marketRisk,
      positioningRisk,
      executionRisk,
      economicRisk,
      selectedEvidenceIds,
      availableEvidence,
      isEditing,
      editingBet,
      onSuccess,
    ]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Strategic Bet' : 'Create Strategic Bet'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Define a testable strategic hypothesis with measurable outcomes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Thesis & Opportunity Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Thesis Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Strategic Thesis (Optional)
                </label>
                <select
                  value={thesisId}
                  onChange={(e) => setThesisId(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all"
                >
                  <option value="">-- Ungrouped Bet --</option>
                  {theses.map((thesis) => (
                    <option key={thesis.id} value={thesis.id}>
                      {thesis.title} ({thesis.thesisType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Opportunity Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Linked Opportunity <span className="text-red-500">*</span>
                </label>
                <select
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all"
                >
                  <option value="">-- Select Opportunity --</option>
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} (Score: {opp.scoring.overallScore})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5-Part Hypothesis */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-cyan-900 uppercase tracking-wider">
                5-Part Strategic Hypothesis
              </h3>

              {/* Job to Be Done */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Job to Be Done <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={jobToBeDone}
                  onChange={(e) => setJobToBeDone(e.target.value)}
                  required
                  rows={2}
                  placeholder="[Customer segment] struggling with [context], needs [outcome]"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Belief */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Belief <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={belief}
                  onChange={(e) => setBelief(e.target.value)}
                  required
                  rows={2}
                  placeholder="We believe [insight from research] creates an opportunity to..."
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Bet */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Bet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bet}
                  onChange={(e) => setBet(e.target.value)}
                  required
                  rows={2}
                  placeholder="So we will invest in [strategic initiative] targeting [where to play]..."
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Success Metric */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Success Metric <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={successMetric}
                  onChange={(e) => setSuccessMetric(e.target.value)}
                  required
                  rows={2}
                  placeholder="Success looks like [leading indicator with number + timeframe]"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Kill Criteria & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Kill Criteria
                  </label>
                  <textarea
                    value={killCriteria}
                    onChange={(e) => setKillCriteria(e.target.value)}
                    rows={2}
                    placeholder="We abandon this bet if [signal] by [date]..."
                    className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Kill Date
                  </label>
                  <input
                    type="date"
                    value={killDate}
                    onChange={(e) => setKillDate(e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">When to evaluate kill criteria</p>
                </div>
              </div>

              {/* Time Horizon */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Time Horizon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['90d', '6m', '12m', '18m'] as const).map((horizon) => (
                    <button
                      key={horizon}
                      type="button"
                      onClick={() => setTimeHorizon(horizon)}
                      className={`
                        px-4 py-2 text-sm font-semibold rounded-lg transition-all
                        ${
                          timeHorizon === horizon
                            ? 'bg-cyan-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-300'
                        }
                      `}
                    >
                      {horizon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Dimension Scoring (Janakiraman) */}
            <div className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Strategic Scoring (Janakiraman Model)
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-600">{overallScore}%</div>
                  <div className="text-xs text-slate-500">Overall Score</div>
                </div>
              </div>

              {/* Expected Impact */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Expected Impact
                  </label>
                  <span className="text-sm font-bold text-slate-900">{expectedImpact}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expectedImpact}
                  onChange={(e) => setExpectedImpact(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Scale, frequency, and intensity of the problem being addressed
                </p>
              </div>

              {/* Certainty of Impact */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Certainty of Impact
                  </label>
                  <span className="text-sm font-bold text-slate-900">{certaintyOfImpact}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={certaintyOfImpact}
                  onChange={(e) => setCertaintyOfImpact(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  How confident are we based on evidence strength?
                </p>
              </div>

              {/* Clarity of Levers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Clarity of Levers
                  </label>
                  <span className="text-sm font-bold text-slate-900">{clarityOfLevers}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={clarityOfLevers}
                  onChange={(e) => setClarityOfLevers(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <p className="text-xs text-slate-500 mt-1">Do we know how to execute this?</p>
              </div>

              {/* Uniqueness of Levers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Uniqueness of Levers
                  </label>
                  <span className="text-sm font-bold text-slate-900">{uniquenessOfLevers}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={uniquenessOfLevers}
                  onChange={(e) => setUniquenessOfLevers(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Competitive defensibility - hard to copy?
                </p>
              </div>
            </div>

            {/* Strategic Risks */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Strategic Risks
              </h3>

              {/* Market Risk */}
              <div>
                <label className="block text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
                  Market Risk
                </label>
                <textarea
                  value={marketRisk}
                  onChange={(e) => setMarketRisk(e.target.value)}
                  rows={2}
                  placeholder="Does the market exist and is it large enough?"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Positioning Risk */}
              <div>
                <label className="block text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
                  Positioning Risk
                </label>
                <textarea
                  value={positioningRisk}
                  onChange={(e) => setPositioningRisk(e.target.value)}
                  rows={2}
                  placeholder="Can we differentiate sustainably?"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Execution Risk */}
              <div>
                <label className="block text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">
                  Execution Risk
                </label>
                <textarea
                  value={executionRisk}
                  onChange={(e) => setExecutionRisk(e.target.value)}
                  rows={2}
                  placeholder="Can we build the required capabilities?"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Economic Risk */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Economic Risk
                </label>
                <textarea
                  value={economicRisk}
                  onChange={(e) => setEconomicRisk(e.target.value)}
                  rows={2}
                  placeholder="Do the unit economics work at scale?"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Evidence Selection */}
            {availableEvidence.length > 0 && (
              <div className="bg-white border border-cyan-200 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Link Evidence ({selectedEvidenceIds.length} selected)
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableEvidence.map((evidence) => (
                    <label
                      key={evidence.insightId}
                      className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50/50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvidenceIds.includes(evidence.insightId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvidenceIds([...selectedEvidenceIds, evidence.insightId]);
                          } else {
                            setSelectedEvidenceIds(
                              selectedEvidenceIds.filter((id) => id !== evidence.insightId)
                            );
                          }
                        }}
                        className="mt-1 w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-cyan-700 uppercase tracking-wider mb-1">
                          {evidence.territory} • {evidence.researchArea.replace(/_/g, ' ')}
                        </div>
                        <p className="text-xs text-slate-700 italic">&ldquo;{evidence.quote}&rdquo;</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-3 text-sm font-semibold text-slate-900 bg-[#fbbf24] rounded-lg hover:bg-[#f59e0b] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              <>{isEditing ? 'Update Bet' : 'Create Bet'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBetModal;
