'use client';

import { useState, useEffect } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface CustomerTerritoryDeepDiveProps {
  conversation: Conversation;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onUpdate: (insights: TerritoryInsight[]) => void;
}

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: 'customer_segmentation',
    title: 'Customer Segmentation & Behaviors',
    description: 'Who are your customers, how do they behave, and what drives their decisions?',
    questions: [
      'What are your primary customer segments, and how do they differ in needs, behaviors, and value?',
      'How do customers currently discover, evaluate, and purchase solutions in your category?',
      'What decision-making criteria matter most to each segment (price, features, trust, speed, etc.)?',
      'Which customer segments are growing, declining, or emerging in your market?',
    ],
  },
  {
    id: 'unmet_needs',
    title: 'Unmet Needs & Pain Points',
    description: 'What problems do customers face that current solutions fail to address adequately?',
    questions: [
      'What are the most significant pain points customers experience with existing solutions (including yours)?',
      'What jobs-to-be-done are customers hiring products for, and where do current solutions fall short?',
      'What workarounds, hacks, or compromises do customers make to get their jobs done?',
      'What emerging needs or latent desires are customers beginning to express?',
    ],
  },
  {
    id: 'market_dynamics',
    title: 'Market Dynamics & Customer Evolution',
    description: 'How are customer expectations, behaviors, and the competitive landscape changing over time?',
    questions: [
      'How have customer expectations evolved in the past 2-3 years, and what trends are accelerating?',
      'What new alternatives or substitutes are customers considering that didn&apos;t exist before?',
      'How are customer acquisition costs, retention rates, and lifetime value trending in your category?',
      'What external forces (technology, regulation, economics, culture) are reshaping customer needs?',
    ],
  },
];

export function CustomerTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
}: CustomerTerritoryDeepDiveProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load existing responses when area changes
  useEffect(() => {
    if (!selectedArea) {
      setResponses({});
      return;
    }

    const existingInsight = territoryInsights.find(
      (insight) =>
        insight.territory === 'customer' && insight.research_area === selectedArea
    );

    if (existingInsight && existingInsight.responses) {
      const responsesData = existingInsight.responses as Record<string, unknown>;
      setResponses(responsesData as Record<string, string>);
    } else {
      setResponses({});
    }
  }, [selectedArea, territoryInsights]);

  const handleSave = async (status: 'in_progress' | 'mapped') => {
    if (!selectedArea) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/product-strategy-agent/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: 'customer',
          research_area: selectedArea,
          responses,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save territory insight');
      }

      const updatedInsight = (await response.json()) as TerritoryInsight;

      // Update parent component with new insight
      const otherInsights = territoryInsights.filter(
        (i) => !(i.territory === 'customer' && i.research_area === selectedArea)
      );
      onUpdate([...otherInsights, updatedInsight]);

      // If marking as mapped, go back to area selection
      if (status === 'mapped') {
        setSelectedArea(null);
      }
    } catch (error) {
      console.error('Error saving insight:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentArea = RESEARCH_AREAS.find((area) => area.id === selectedArea);

  const getAreaStatus = (areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    const insight = territoryInsights.find(
      (i) => i.territory === 'customer' && i.research_area === areaId
    );
    return insight?.status || 'unexplored';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mapped':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mapped':
        return 'Mapped';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unexplored';
    }
  };

  // Research Area Selection View
  if (!selectedArea) {
    const mappedCount = RESEARCH_AREAS.filter((area) => getAreaStatus(area.id) === 'mapped').length;
    const progressPct = Math.round((mappedCount / RESEARCH_AREAS.length) * 100);

    return (
      <div className="customer-territory-deep-dive p-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Research Overview
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Customer Territory
              </h1>
              <p className="text-lg text-slate-600">
                Understand customer segments, unmet needs, and evolving market dynamics
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Overall Progress</div>
              <div className="text-2xl font-bold text-slate-900">{progressPct}%</div>
              <div className="text-sm text-slate-500">{mappedCount} of {RESEARCH_AREAS.length} areas mapped</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Research Areas */}
        <div className="space-y-4">
          {RESEARCH_AREAS.map((area, index) => {
            const status = getAreaStatus(area.id);
            const statusColor = getStatusColor(status);
            const statusLabel = getStatusLabel(status);

            return (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className="w-full text-left bg-white rounded-xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all duration-200 p-6 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {area.title}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
                <p className="text-slate-600 ml-11">{area.description}</p>
                <div className="mt-4 ml-11 flex items-center gap-2 text-sm text-cyan-600 font-medium">
                  <span>Explore {area.questions.length} Questions</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Question Deep-Dive View
  if (!currentArea) return null;

  const areaStatus = getAreaStatus(currentArea.id);
  const answeredCount = Object.keys(responses).filter((key) => responses[key]?.trim()).length;
  const areaProgressPct = Math.round((answeredCount / currentArea.questions.length) * 100);

  return (
    <div className="customer-territory-questions p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedArea(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Customer Territory
        </button>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {currentArea.title}
            </h1>
            <p className="text-lg text-slate-600">{currentArea.description}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(areaStatus)}`}>
            {getStatusLabel(areaStatus)}
          </span>
        </div>

        {/* Area Progress */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Area Progress</span>
            <span className="text-sm font-bold text-slate-900">{answeredCount} / {currentArea.questions.length} answered</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all duration-500"
              style={{ width: `${areaProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {currentArea.questions.map((question, index) => (
          <div key={index} className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <label className="block mb-3">
              <div className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-slate-900 font-medium leading-relaxed">{question}</span>
              </div>
            </label>
            <textarea
              value={responses[`q${index}`] || ''}
              onChange={(e) => setResponses({ ...responses, [`q${index}`]: e.target.value })}
              placeholder="Share your insights here..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all resize-none"
              rows={4}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <button
          onClick={() => handleSave('in_progress')}
          disabled={isSaving}
          className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
        <button
          onClick={() => handleSave('mapped')}
          disabled={isSaving || answeredCount === 0}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Mark as Mapped'}
        </button>
      </div>
    </div>
  );
}
