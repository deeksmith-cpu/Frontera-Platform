'use client';

import { useState, useEffect } from 'react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface CompanyTerritoryDeepDiveProps {
  conversation: Conversation;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onUpdate: (insights: TerritoryInsight[]) => void;
}

// Company Territory Research Areas (MVP: 3 areas)
const RESEARCH_AREAS = [
  {
    id: 'core_capabilities',
    title: 'Core Capabilities & Constraints',
    description: 'What are your organization\'s unique strengths, and what fundamental constraints shape your strategic options?',
    questions: [
      'What are your organization\'s core competencies and differentiating capabilities?',
      'What key resources (technical, human, IP) do you control that competitors don\'t?',
      'What structural constraints limit your strategic freedom (legacy systems, contracts, regulations)?',
      'Which capabilities are table stakes vs. truly differentiated in your market?',
    ],
  },
  {
    id: 'resource_reality',
    title: 'Resource Reality',
    description: 'What team, technology, and funding realities will enable or constrain your strategy execution?',
    questions: [
      'What is the current composition and skill distribution of your team?',
      'What technology stack and infrastructure do you have in place?',
      'What funding runway and burn rate define your strategic timeline?',
      'What hiring constraints or talent gaps could impact execution?',
    ],
  },
  {
    id: 'product_portfolio',
    title: 'Product Portfolio & Market Position',
    description: 'How do your current products perform in the market, and what does your portfolio reveal about strategic direction?',
    questions: [
      'What products/services comprise your current portfolio and how do they perform?',
      'Which products are growth drivers vs. legacy offerings?',
      'What is your current market position and competitive standing?',
      'What gaps exist between your current portfolio and market opportunities?',
    ],
  },
];

export function CompanyTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
}: CompanyTerritoryDeepDiveProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Get insights for this territory
  const companyInsights = territoryInsights.filter((t) => t.territory === 'company');

  // Get status for each research area
  const getAreaStatus = (areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    const insight = companyInsights.find((i) => i.research_area === areaId);
    return insight?.status || 'unexplored';
  };

  // Load existing responses when area is selected
  useEffect(() => {
    if (selectedArea) {
      const insight = companyInsights.find((i) => i.research_area === selectedArea);
      if (insight && insight.responses) {
        setResponses(insight.responses as Record<string, string>);
      } else {
        setResponses({});
      }
    }
  }, [selectedArea, companyInsights]);

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSave = async (status: 'in_progress' | 'mapped') => {
    if (!selectedArea) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/product-strategy-agent/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: 'company',
          research_area: selectedArea,
          responses,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      const updatedInsight: TerritoryInsight = await response.json();

      // Update parent state
      const updatedInsights = territoryInsights.filter(
        (i) => !(i.territory === 'company' && i.research_area === selectedArea)
      );
      updatedInsights.push(updatedInsight);
      onUpdate(updatedInsights);

      // If marked as mapped, go back to area selection
      if (status === 'mapped') {
        setSelectedArea(null);
        setResponses({});
      }
    } catch (error) {
      console.error('Error saving responses:', error);
      alert('Failed to save responses. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Research area selection view
  if (!selectedArea) {
    return (
      <div className="company-territory-deep-dive max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Territories
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Company Territory</h1>
              <p className="text-sm text-slate-600">Internal Strategic Context</p>
            </div>
          </div>

          <p className="text-lg text-slate-600 leading-relaxed">
            Explore your organization&apos;s internal landscape across three strategic dimensions.
            Each research area builds a comprehensive view of your company&apos;s strategic position.
          </p>
        </div>

        {/* Research Areas Grid */}
        <div className="grid grid-cols-1 gap-6">
          {RESEARCH_AREAS.map((area, index) => {
            const status = getAreaStatus(area.id);
            const insight = companyInsights.find((i) => i.research_area === area.id);
            const responseCount = insight?.responses
              ? Object.keys(insight.responses as Record<string, string>).length
              : 0;

            return (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className="text-left bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 p-6 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-indigo-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{area.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{area.description}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex-shrink-0 ${
                      status === 'mapped'
                        ? 'bg-indigo-100 text-indigo-700'
                        : status === 'in_progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {status === 'mapped' && '●'}
                    {status === 'in_progress' && '◐'}
                    {status === 'unexplored' && '○'}
                    {status === 'mapped' && 'Mapped'}
                    {status === 'in_progress' && 'In Progress'}
                    {status === 'unexplored' && 'Unexplored'}
                  </span>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-800 transition-all duration-300"
                      style={{
                        width: `${(responseCount / area.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {responseCount}/{area.questions.length}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  {status === 'unexplored' && 'Begin Research →'}
                  {status === 'in_progress' && 'Continue Research →'}
                  {status === 'mapped' && 'Review Responses →'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Research area deep dive (questions view)
  const currentArea = RESEARCH_AREAS.find((a) => a.id === selectedArea);
  if (!currentArea) return null;

  return (
    <div className="company-territory-deep-dive max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => {
            setSelectedArea(null);
            setResponses({});
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Research Areas
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentArea.title}</h2>
        <p className="text-slate-600">{currentArea.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentArea.questions.map((question, index) => (
          <div key={index} className="question-card bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block mb-3">
              <div className="flex items-start gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="font-semibold text-slate-900">{question}</span>
              </div>
              <textarea
                value={responses[index] || ''}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Share your insights here..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => handleSave('in_progress')}
          disabled={isSaving || Object.keys(responses).length === 0}
          className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 rounded-xl font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
        <button
          onClick={() => handleSave('mapped')}
          disabled={isSaving || Object.keys(responses).length < currentArea.questions.length}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
        >
          {isSaving ? 'Saving...' : 'Mark as Mapped'}
        </button>
      </div>

      {Object.keys(responses).length < currentArea.questions.length && (
        <p className="text-sm text-center text-slate-500 mt-4">
          Answer all questions to mark this area as mapped
        </p>
      )}
    </div>
  );
}
