'use client';

import { useState, useCallback } from 'react';
import { X, Sparkles, RotateCcw, Plus, Trash2 } from 'lucide-react';
import type { StrategicOpportunity, WWHBTAssumption } from '@/types/synthesis';
import { calculateQuadrant, calculateOverallScore, determineConfidence } from '@/lib/synthesis/helpers';
import { v4 as uuidv4 } from 'uuid';

interface OpportunityEditModalProps {
  mode: 'create' | 'edit';
  opportunity?: StrategicOpportunity;
  originalOpportunity?: StrategicOpportunity;
  onSave: (opportunity: StrategicOpportunity) => void;
  onClose: () => void;
  onAskCoach: (opportunity: StrategicOpportunity) => void;
}

export function OpportunityEditModal({
  mode,
  opportunity,
  originalOpportunity,
  onSave,
  onClose,
  onAskCoach,
}: OpportunityEditModalProps) {
  // Form state
  const [title, setTitle] = useState(opportunity?.title || '');
  const [description, setDescription] = useState(opportunity?.description || '');
  const [marketAttractiveness, setMarketAttractiveness] = useState(opportunity?.scoring.marketAttractiveness || 5);
  const [capabilityFit, setCapabilityFit] = useState(opportunity?.scoring.capabilityFit || 5);
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState(opportunity?.scoring.competitiveAdvantage || 5);
  const [whereToPlay, setWhereToPlay] = useState(opportunity?.ptw.whereToPlay || '');
  const [howToWin, setHowToWin] = useState(opportunity?.ptw.howToWin || '');
  const [winningAspiration, setWinningAspiration] = useState(opportunity?.ptw.winningAspiration || '');
  const [capabilitiesRequired, setCapabilitiesRequired] = useState<string[]>(
    opportunity?.ptw.capabilitiesRequired || ['']
  );
  const [managementSystems, setManagementSystems] = useState<string[]>(
    opportunity?.ptw.managementSystems || ['']
  );
  const [assumptions, setAssumptions] = useState<WWHBTAssumption[]>(
    opportunity?.assumptions || [{ category: 'customer', assumption: '', testMethod: '', riskIfFalse: '' }]
  );

  // Derived scores
  const overallScore = calculateOverallScore(marketAttractiveness, capabilityFit, competitiveAdvantage);
  const quadrant = calculateQuadrant(marketAttractiveness, capabilityFit);

  const handleRevert = useCallback(() => {
    if (!originalOpportunity) return;
    setTitle(originalOpportunity.title);
    setDescription(originalOpportunity.description);
    setMarketAttractiveness(originalOpportunity.scoring.marketAttractiveness);
    setCapabilityFit(originalOpportunity.scoring.capabilityFit);
    setCompetitiveAdvantage(originalOpportunity.scoring.competitiveAdvantage);
    setWhereToPlay(originalOpportunity.ptw.whereToPlay);
    setHowToWin(originalOpportunity.ptw.howToWin);
    setWinningAspiration(originalOpportunity.ptw.winningAspiration);
    setCapabilitiesRequired(originalOpportunity.ptw.capabilitiesRequired.length > 0 ? originalOpportunity.ptw.capabilitiesRequired : ['']);
    setManagementSystems(originalOpportunity.ptw.managementSystems.length > 0 ? originalOpportunity.ptw.managementSystems : ['']);
    setAssumptions(originalOpportunity.assumptions.length > 0 ? originalOpportunity.assumptions : [{ category: 'customer', assumption: '', testMethod: '', riskIfFalse: '' }]);
  }, [originalOpportunity]);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !description.trim()) return;

    const filteredCapabilities = capabilitiesRequired.filter(c => c.trim());
    const filteredSystems = managementSystems.filter(s => s.trim());
    const filteredAssumptions = assumptions.filter(a => a.assumption.trim());
    const evidence = opportunity?.evidence || [];

    const result: StrategicOpportunity = {
      id: opportunity?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      opportunityType: 'paired_strategy',
      scoring: {
        marketAttractiveness,
        capabilityFit,
        competitiveAdvantage,
        overallScore,
      },
      quadrant,
      confidence: determineConfidence(evidence.length, filteredAssumptions.length),
      ptw: {
        winningAspiration: winningAspiration.trim(),
        whereToPlay: whereToPlay.trim(),
        howToWin: howToWin.trim(),
        capabilitiesRequired: filteredCapabilities,
        managementSystems: filteredSystems,
      },
      evidence,
      assumptions: filteredAssumptions,
    };

    onSave(result);
  }, [title, description, marketAttractiveness, capabilityFit, competitiveAdvantage, overallScore, quadrant, whereToPlay, howToWin, winningAspiration, capabilitiesRequired, managementSystems, assumptions, opportunity, onSave]);

  const buildCurrentDraft = useCallback((): StrategicOpportunity => {
    return {
      id: opportunity?.id || '',
      title,
      description,
      scoring: { marketAttractiveness, capabilityFit, competitiveAdvantage, overallScore },
      quadrant,
      confidence: 'medium',
      ptw: { winningAspiration, whereToPlay, howToWin, capabilitiesRequired: capabilitiesRequired.filter(c => c.trim()), managementSystems: managementSystems.filter(s => s.trim()) },
      evidence: opportunity?.evidence || [],
      assumptions: assumptions.filter(a => a.assumption.trim()),
    };
  }, [title, description, marketAttractiveness, capabilityFit, competitiveAdvantage, overallScore, quadrant, winningAspiration, whereToPlay, howToWin, capabilitiesRequired, managementSystems, assumptions, opportunity]);

  const quadrantLabels: Record<string, { label: string; color: string }> = {
    invest: { label: 'INVEST', color: 'text-emerald-700 bg-emerald-100' },
    explore: { label: 'EXPLORE', color: 'text-blue-700 bg-blue-100' },
    harvest: { label: 'HARVEST', color: 'text-amber-700 bg-amber-100' },
    divest: { label: 'DIVEST', color: 'text-slate-600 bg-slate-100' },
  };

  const qd = quadrantLabels[quadrant] || quadrantLabels.invest;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'edit' ? 'Edit Strategic Hypothesis' : 'Add Strategic Hypothesis'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Define a Playing to Win strategic hypothesis with coherent WTP + HTW pairing
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          <div className="space-y-6">
            {/* Title & Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="[Value Proposition] for [Target Segment]"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Explain the paired WTP+HTW strategy and why this combination creates competitive advantage"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Scoring Sliders */}
            <div className="bg-white border border-cyan-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Opportunity Scoring
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold py-1 px-2.5 rounded-full ${qd.color}`}>
                    {qd.label}
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-600">{overallScore}</div>
                    <div className="text-xs text-slate-500">Overall</div>
                  </div>
                </div>
              </div>

              {[
                { label: 'Market Attractiveness', value: marketAttractiveness, setter: setMarketAttractiveness, accent: 'accent-indigo-600', desc: 'Market size, growth, unmet needs' },
                { label: 'Capability Fit', value: capabilityFit, setter: setCapabilityFit, accent: 'accent-cyan-600', desc: "Company's ability to execute" },
                { label: 'Competitive Advantage', value: competitiveAdvantage, setter: setCompetitiveAdvantage, accent: 'accent-emerald-600', desc: 'Differentiation potential' },
              ].map(({ label, value, setter, accent, desc }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
                    <span className="text-sm font-bold text-slate-900">{value}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => setter(parseInt(e.target.value))}
                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${accent}`}
                  />
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>

            {/* PTW Fields */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider">
                Playing to Win Cascade
              </h3>

              <div>
                <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  Where to Play <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={whereToPlay}
                  onChange={(e) => setWhereToPlay(e.target.value)}
                  rows={2}
                  placeholder="Specific market segment, customer type, geography, or channel"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-700 uppercase tracking-wider mb-2">
                  How to Win <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={howToWin}
                  onChange={(e) => setHowToWin(e.target.value)}
                  rows={2}
                  placeholder="The competitive advantage that makes sense GIVEN the Where to Play choice"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Winning Aspiration
                </label>
                <textarea
                  value={winningAspiration}
                  onChange={(e) => setWinningAspiration(e.target.value)}
                  rows={2}
                  placeholder="What winning looks like for this paired strategy"
                  className="w-full text-sm p-4 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                />
              </div>

              {/* Capabilities Required - editable list */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Capabilities Required
                </label>
                <div className="space-y-2">
                  {capabilitiesRequired.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cap}
                        onChange={(e) => {
                          const updated = [...capabilitiesRequired];
                          updated[idx] = e.target.value;
                          setCapabilitiesRequired(updated);
                        }}
                        placeholder="Required capability"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                      />
                      {capabilitiesRequired.length > 1 && (
                        <button
                          onClick={() => setCapabilitiesRequired(capabilitiesRequired.filter((_, i) => i !== idx))}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setCapabilitiesRequired([...capabilitiesRequired, ''])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add capability
                  </button>
                </div>
              </div>

              {/* Management Systems - editable list */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Management Systems
                </label>
                <div className="space-y-2">
                  {managementSystems.map((sys, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sys}
                        onChange={(e) => {
                          const updated = [...managementSystems];
                          updated[idx] = e.target.value;
                          setManagementSystems(updated);
                        }}
                        placeholder="Metric or system"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                      />
                      {managementSystems.length > 1 && (
                        <button
                          onClick={() => setManagementSystems(managementSystems.filter((_, i) => i !== idx))}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setManagementSystems([...managementSystems, ''])}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add system
                  </button>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                What Would Have to Be True (WWHBT)
              </h3>
              {assumptions.map((assumption, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <select
                      value={assumption.category}
                      onChange={(e) => {
                        const updated = [...assumptions];
                        updated[idx] = { ...updated[idx], category: e.target.value as WWHBTAssumption['category'] };
                        setAssumptions(updated);
                      }}
                      className="text-xs font-semibold text-slate-600 uppercase tracking-wider bg-transparent border-none focus:outline-none cursor-pointer"
                    >
                      <option value="customer">Customer</option>
                      <option value="company">Company</option>
                      <option value="competitor">Competitor</option>
                      <option value="economics">Economics</option>
                    </select>
                    {assumptions.length > 1 && (
                      <button
                        onClick={() => setAssumptions(assumptions.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={assumption.assumption}
                    onChange={(e) => {
                      const updated = [...assumptions];
                      updated[idx] = { ...updated[idx], assumption: e.target.value };
                      setAssumptions(updated);
                    }}
                    placeholder="A testable hypothesis"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={assumption.testMethod}
                      onChange={(e) => {
                        const updated = [...assumptions];
                        updated[idx] = { ...updated[idx], testMethod: e.target.value };
                        setAssumptions(updated);
                      }}
                      placeholder="How to validate"
                      className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                    />
                    <input
                      type="text"
                      value={assumption.riskIfFalse}
                      onChange={(e) => {
                        const updated = [...assumptions];
                        updated[idx] = { ...updated[idx], riskIfFalse: e.target.value };
                        setAssumptions(updated);
                      }}
                      placeholder="Risk if wrong"
                      className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setAssumptions([...assumptions, { category: 'customer', assumption: '', testMethod: '', riskIfFalse: '' }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add assumption
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskCoach(buildCurrentDraft())}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#1a1f3a] bg-white border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Ask the Coach
            </button>
            {mode === 'edit' && originalOpportunity && (
              <button
                onClick={handleRevert}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Revert to Original
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              className="px-6 py-2.5 text-sm font-semibold text-slate-900 bg-[#fbbf24] rounded-lg hover:bg-[#f59e0b] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'edit' ? 'Save Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityEditModal;
