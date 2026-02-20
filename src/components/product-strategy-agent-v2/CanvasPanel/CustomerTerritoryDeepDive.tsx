'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TerritoryDeepDiveSidebar } from './TerritoryDeepDiveSidebar';
import { SuggestionPanel, SuggestionPanelLoading, SuggestionPanelError } from './SuggestionPanel';
import { InlineCoachBar } from './InlineCoachBar';
import { ConfidenceRating } from './ConfidenceRating';
import { CustomerIcon } from '@/components/icons/TerritoryIcons';
import type { Database } from '@/types/database';
import type { ActiveResearchContext } from '@/types/research-context';

type Conversation = Database['public']['Tables']['conversations']['Row'];
type TerritoryInsight = Database['public']['Tables']['territory_insights']['Row'];

interface QuestionSuggestion {
  question_index: number;
  suggestion: string;
  key_points: string[];
  sources_hint: string;
}

interface CustomerTerritoryDeepDiveProps {
  conversation: Conversation;
  territoryInsights: TerritoryInsight[];
  onBack: () => void;
  onUpdate: (insights: TerritoryInsight[]) => void;
  onResearchContextChange?: (context: ActiveResearchContext) => void;
}

// Customer Territory Research Areas (v3.0: 3 areas × 3 questions = 9 questions)
const RESEARCH_AREAS = [
  {
    id: 'customer_segmentation',
    title: 'Customer Segmentation & Behaviors',
    description: 'Who are your customers, how do they behave, and what drives their decisions?',
    questions: [
      'What are your primary customer segments, and how do they differ in needs, behaviors, and value?',
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
      'What emerging needs or latent desires are customers beginning to express?',
    ],
  },
  {
    id: 'market_dynamics',
    title: 'Market Dynamics & Customer Evolution',
    description: 'How are customer expectations, behaviors, and the competitive landscape changing over time?',
    questions: [
      'How have customer expectations evolved in the past 2-3 years, and what trends are accelerating?',
      'What new alternatives or substitutes are customers considering that didn\'t exist before?',
      'What external forces (technology, regulation, economics, culture) are reshaping customer needs?',
    ],
  },
];

export function CustomerTerritoryDeepDive({
  conversation,
  territoryInsights,
  onBack,
  onUpdate,
  onResearchContextChange,
}: CustomerTerritoryDeepDiveProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<QuestionSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState<number | null>(null);
  const [confidenceRatings, setConfidenceRatings] = useState<Record<string, 'data' | 'experience' | 'guess'>>({});

  // Handle inline coach bar suggestion apply
  const handleInlineBarApply = useCallback((questionIndex: number, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: (prev[questionIndex] || '') + text,
    }));
  }, []);

  // Get insights for this territory - memoized to prevent infinite re-renders
  const customerInsights = useMemo(
    () => territoryInsights.filter((t) => t.territory === 'customer'),
    [territoryInsights]
  );

  // Get status for each research area
  const getAreaStatus = (areaId: string): 'unexplored' | 'in_progress' | 'mapped' => {
    const insight = customerInsights.find((i) => i.research_area === areaId);
    return insight?.status || 'unexplored';
  };

  // Load existing responses when area is selected and clear suggestions
  useEffect(() => {
    if (selectedArea) {
      const insight = customerInsights.find((i) => i.research_area === selectedArea);
      if (insight && insight.responses) {
        setResponses(insight.responses as Record<string, string>);
      } else {
        setResponses({});
      }
      if (insight && insight.confidence) {
        setConfidenceRatings(insight.confidence as Record<string, 'data' | 'experience' | 'guess'>);
      } else {
        setConfidenceRatings({});
      }
      // Clear suggestions when area changes
      setSuggestions([]);
      setSuggestionError(false);
    }
  }, [selectedArea, customerInsights]);

  // Propagate research context changes to parent
  useEffect(() => {
    if (selectedArea && onResearchContextChange) {
      const currentArea = RESEARCH_AREAS.find((a) => a.id === selectedArea);
      onResearchContextChange({
        territory: 'customer',
        researchAreaId: selectedArea,
        researchAreaTitle: currentArea?.title || null,
        focusedQuestionIndex,
        currentQuestion: focusedQuestionIndex !== null
          ? currentArea?.questions[focusedQuestionIndex] || null
          : null,
        draftResponse: focusedQuestionIndex !== null
          ? responses[focusedQuestionIndex] || null
          : null,
        currentResponses: responses,
        updatedAt: Date.now(),
      });
    }
  }, [selectedArea, focusedQuestionIndex, responses, onResearchContextChange]);

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleGetSuggestions = async () => {
    if (!selectedArea) return;

    const currentArea = RESEARCH_AREAS.find((a) => a.id === selectedArea);
    if (!currentArea) return;

    setIsLoadingSuggestions(true);
    setSuggestionError(false);
    setSuggestions([]);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/coach-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: 'customer',
          research_area: selectedArea,
          research_area_title: currentArea.title,
          questions: currentArea.questions,
          existing_responses: responses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestionError(true);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleApplySuggestion = (questionIndex: number, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: (prev[questionIndex] || '') + text,
    }));
  };

  const handleSave = async (status: 'in_progress' | 'mapped') => {
    if (!selectedArea) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversation.id,
          territory: 'customer',
          research_area: selectedArea,
          responses,
          confidence: confidenceRatings,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      const updatedInsight: TerritoryInsight = await response.json();

      // Update parent state
      const updatedInsights = territoryInsights.filter(
        (i) => !(i.territory === 'customer' && i.research_area === selectedArea)
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

  // Prepare research areas for sidebar
  const sidebarAreas = RESEARCH_AREAS.map((area) => ({
    id: area.id,
    title: area.title,
    status: getAreaStatus(area.id),
  }));

  // Auto-select first unexplored area if none selected
  useEffect(() => {
    if (!selectedArea && sidebarAreas.length > 0) {
      const firstUnexplored = sidebarAreas.find((a) => a.status === 'unexplored');
      const firstInProgress = sidebarAreas.find((a) => a.status === 'in_progress');
      const defaultArea = firstUnexplored || firstInProgress || sidebarAreas[0];
      setSelectedArea(defaultArea.id);
    }
  }, [selectedArea, sidebarAreas]);

  if (!selectedArea) {
    return <div>Loading...</div>;
  }

  // Research area deep dive with sidebar layout
  const currentArea = RESEARCH_AREAS.find((a) => a.id === selectedArea);
  if (!currentArea) return null;

  return (
    <div className="customer-territory-deep-dive flex flex-col md:flex-row h-full">
      {/* Sidebar (25% width) */}
      <TerritoryDeepDiveSidebar
        territory="customer"
        territoryTitle="Customer Territory"
        researchAreas={sidebarAreas}
        activeAreaId={selectedArea}
        onSelectArea={setSelectedArea}
        onBack={onBack}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content (75% width) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Area Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg">
                <CustomerIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{currentArea.title}</h2>
                <p className="text-sm text-slate-600 uppercase tracking-wider font-semibold">Research Area</p>
              </div>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{currentArea.description}</p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentArea.questions.map((question, index) => {
              const questionSuggestion = suggestions.find((s) => s.question_index === index);

              return (
                <div key={index} className="question-card bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <label className="block">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#fbbf24]/10 text-[#b45309] rounded-lg text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-base text-slate-900">{question}</span>
                    </div>
                    <textarea
                      value={responses[index] || ''}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                      onFocus={() => setFocusedQuestionIndex(index)}
                      placeholder="Share your insights here..."
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 focus:border-[#fbbf24] transition-all"
                    />
                  </label>

                  {/* Confidence Rating */}
                  <ConfidenceRating
                    value={confidenceRatings[index] || null}
                    onChange={(level) =>
                      setConfidenceRatings((prev) => ({ ...prev, [index]: level }))
                    }
                  />

                  {/* Inline Coach Bar - persistent below textarea */}
                  <InlineCoachBar
                    conversationId={conversation.id}
                    territory="customer"
                    researchArea={selectedArea || ''}
                    researchAreaTitle={currentArea?.title || ''}
                    question={question}
                    questionIndex={index}
                    existingResponse={responses[index] || ''}
                    onApplySuggestion={handleInlineBarApply}
                  />

                  {/* Suggestion Panel for this question */}
                  {isLoadingSuggestions && index === 0 && <SuggestionPanelLoading />}
                  {suggestionError && index === 0 && <SuggestionPanelError onRetry={handleGetSuggestions} />}
                  {questionSuggestion && (
                    <SuggestionPanel
                      suggestion={questionSuggestion}
                      onApply={(text) => handleApplySuggestion(index, text)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Spacer for fixed bottom bar */}
          <div className="h-36" />
        </div>
      </div>

      {/* Action Buttons - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 md:left-[25%] right-0 z-30 flex justify-center bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-2">
        <div className="w-full max-w-4xl px-4 md:px-8 pb-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-3 sm:p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Coach Suggestion Button - for all questions at once */}
            <button
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 bg-gradient-to-r from-[#fbbf24]/10 to-[#fbbf24]/20 border-2 border-[#fbbf24]/30 text-[#b45309] rounded-xl text-xs sm:text-sm font-bold hover:border-[#fbbf24]/50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoadingSuggestions ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
                  <span>Generating All...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">&#10024;</span>
                  <span>Suggest All Questions</span>
                </>
              )}
            </button>

            {/* Save Progress Button */}
            <button
              onClick={() => handleSave('in_progress')}
              disabled={isSaving || Object.keys(responses).length === 0}
              className="flex-1 px-3 py-1.5 sm:px-4 bg-slate-200 text-slate-900 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>

            {/* Mark as Mapped Button */}
            <button
              onClick={() => handleSave('mapped')}
              disabled={isSaving || Object.keys(responses).length < currentArea.questions.length}
              className="flex-1 px-3 py-1.5 sm:px-4 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-lg"
            >
              {isSaving ? 'Saving...' : 'Mark as Mapped'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
