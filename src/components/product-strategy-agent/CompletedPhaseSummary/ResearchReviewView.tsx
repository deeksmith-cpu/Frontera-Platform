'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Users,
  Swords,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Save,
  Loader2,
} from 'lucide-react';
import { TERRITORY_RESEARCH } from '@/lib/agents/strategy-coach/research-questions';
import type { Territory } from '@/types/coaching-cards';

interface TerritoryInsight {
  territory: string;
  research_area: string;
  responses: Record<string, string>;
  confidence: Record<string, string>;
  status: string;
}

interface ResearchReviewViewProps {
  conversationId: string;
}

const TERRITORY_CONFIG: Record<string, {
  icon: typeof Building2;
  color: string;
  bg: string;
  border: string;
  iconBg: string;
  accent: string;
}> = {
  company: {
    icon: Building2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    accent: 'indigo',
  },
  customer: {
    icon: Users,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    accent: 'cyan',
  },
  competitor: {
    icon: Swords,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100',
    accent: 'purple',
  },
};

export function ResearchReviewView({ conversationId }: ResearchReviewViewProps) {
  const [insights, setInsights] = useState<TerritoryInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedAreas, setSavedAreas] = useState<Set<string>>(new Set());

  // Fetch all territory insights
  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent-v2/territories?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setInsights(Array.isArray(data) ? data : []);
        }
      } catch {
        // Silently handle
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInsights();
    return () => { cancelled = true; };
  }, [conversationId]);

  const toggleArea = useCallback((areaKey: string) => {
    setExpandedArea(prev => prev === areaKey ? null : areaKey);
  }, []);

  const getInsight = useCallback((territory: string, areaId: string): TerritoryInsight | undefined => {
    return insights.find(i => i.territory === territory && i.research_area === areaId);
  }, [insights]);

  const getAnswer = useCallback((territory: string, areaId: string, questionIndex: number): string => {
    const areaKey = `${territory}/${areaId}`;
    // Check edited answers first
    if (editedAnswers[areaKey]?.[String(questionIndex)] !== undefined) {
      return editedAnswers[areaKey][String(questionIndex)];
    }
    // Fall back to stored insight
    const insight = getInsight(territory, areaId);
    return insight?.responses?.[String(questionIndex)] || '';
  }, [editedAnswers, getInsight]);

  const handleAnswerChange = useCallback((territory: string, areaId: string, questionIndex: number, value: string) => {
    const areaKey = `${territory}/${areaId}`;
    setEditedAnswers(prev => ({
      ...prev,
      [areaKey]: {
        ...prev[areaKey],
        [String(questionIndex)]: value,
      },
    }));
    // Clear saved indicator when editing
    setSavedAreas(prev => {
      const next = new Set(prev);
      next.delete(areaKey);
      return next;
    });
  }, []);

  const handleSave = useCallback(async (territory: string, areaId: string, totalQuestions: number) => {
    const areaKey = `${territory}/${areaId}`;
    setSaving(areaKey);

    try {
      // Merge edited answers with existing
      const insight = getInsight(territory, areaId);
      const existingResponses = insight?.responses || {};
      const existingConfidence = insight?.confidence || {};
      const edits = editedAnswers[areaKey] || {};

      const mergedResponses: Record<string, string> = { ...existingResponses, ...edits };

      // Determine status
      const answeredCount = Object.values(mergedResponses).filter(v => v.trim()).length;
      let status: string;
      if (answeredCount >= totalQuestions) {
        status = 'mapped';
      } else if (answeredCount > 0) {
        status = 'in_progress';
      } else {
        status = 'unexplored';
      }

      const res = await fetch('/api/product-strategy-agent-v2/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          territory,
          research_area: areaId,
          responses: mergedResponses,
          confidence: existingConfidence,
          status,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        // Update local insights
        setInsights(prev => {
          const idx = prev.findIndex(i => i.territory === territory && i.research_area === areaId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = saved;
            return next;
          }
          return [...prev, saved];
        });
        // Clear edits for this area
        setEditedAnswers(prev => {
          const next = { ...prev };
          delete next[areaKey];
          return next;
        });
        // Show saved indicator
        setSavedAreas(prev => new Set(prev).add(areaKey));
        setTimeout(() => {
          setSavedAreas(prev => {
            const next = new Set(prev);
            next.delete(areaKey);
            return next;
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to save research:', err);
    } finally {
      setSaving(null);
    }
  }, [conversationId, editedAnswers, getInsight]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="space-y-3">
          <div className="h-16 bg-slate-50 rounded-2xl" />
          <div className="h-16 bg-slate-50 rounded-2xl" />
          <div className="h-16 bg-slate-50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6 animate-entrance">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Research Review</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Review and edit your territory mapping responses. Expand any research area to see your answers and make changes.
        </p>
      </div>

      {TERRITORY_RESEARCH.map(territory => {
        const config = TERRITORY_CONFIG[territory.territory];
        const Icon = config.icon;

        // Calculate territory progress
        let territoryAnswered = 0;
        let territoryTotal = 0;
        for (const area of territory.areas) {
          territoryTotal += area.questions.length;
          const insight = getInsight(territory.territory, area.id);
          if (insight?.responses) {
            territoryAnswered += Object.values(insight.responses).filter(v => v?.trim()).length;
          }
        }
        const territoryPct = territoryTotal > 0 ? Math.round((territoryAnswered / territoryTotal) * 100) : 0;

        return (
          <div key={territory.territory} className={`bg-white border ${config.border} rounded-2xl shadow-sm overflow-hidden`}>
            {/* Territory header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900">{territory.label}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {territoryAnswered} of {territoryTotal} questions answered
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      territoryPct === 100 ? 'bg-emerald-500' : config.color.replace('text-', 'bg-')
                    }`}
                    style={{ width: `${territoryPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 font-[family-name:var(--font-code)]">
                  {territoryPct}%
                </span>
              </div>
            </div>

            {/* Research areas */}
            <div className="divide-y divide-slate-50">
              {territory.areas.map(area => {
                const areaKey = `${territory.territory}/${area.id}`;
                const isExpanded = expandedArea === areaKey;
                const insight = getInsight(territory.territory, area.id);
                const answeredCount = insight?.responses
                  ? Object.values(insight.responses).filter(v => v?.trim()).length
                  : 0;
                const isMapped = insight?.status === 'mapped';
                const hasEdits = !!editedAnswers[areaKey] && Object.keys(editedAnswers[areaKey]).length > 0;
                const isSaving = saving === areaKey;
                const justSaved = savedAreas.has(areaKey);

                return (
                  <div key={area.id}>
                    {/* Area header */}
                    <button
                      onClick={() => toggleArea(areaKey)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-slate-800">{area.title}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{area.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Mini progress dots */}
                        <div className="flex items-center gap-1">
                          {area.questions.map((_, qi) => {
                            const hasAnswer = !!(insight?.responses?.[String(qi)]?.trim());
                            return (
                              <div
                                key={qi}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  hasAnswer ? 'bg-emerald-500' : 'bg-slate-200'
                                }`}
                              />
                            );
                          })}
                        </div>
                        {isMapped ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : answeredCount > 0 ? (
                          <span className="text-[10px] font-bold text-slate-400 font-[family-name:var(--font-code)]">
                            {answeredCount}/{area.questions.length}
                          </span>
                        ) : (
                          <Circle className="w-4 h-4 text-slate-200" />
                        )}
                      </div>
                    </button>

                    {/* Expanded: show questions & editable answers */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 space-y-4 animate-entrance">
                        {area.questions.map(question => {
                          const answer = getAnswer(territory.territory, area.id, question.index);
                          const hasAnswer = answer.trim().length > 0;

                          return (
                            <div key={question.index} className="space-y-1.5">
                              <div className="flex items-start gap-2">
                                <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5 font-[family-name:var(--font-code)] ${
                                  hasAnswer
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-400'
                                }`}>
                                  Q{question.index + 1}
                                </span>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                  {question.text}
                                </p>
                              </div>
                              <div className="ml-7">
                                <textarea
                                  value={answer}
                                  onChange={(e) => handleAnswerChange(territory.territory, area.id, question.index, e.target.value)}
                                  placeholder="Enter your answer..."
                                  rows={answer.length > 200 ? 4 : 3}
                                  className="w-full text-sm p-3 border border-slate-200 rounded-lg bg-white text-slate-900 resize-none transition-all leading-relaxed focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
                                />
                              </div>
                            </div>
                          );
                        })}

                        {/* Save button for this area */}
                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                          {justSaved && (
                            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Saved
                            </span>
                          )}
                          <button
                            onClick={() => handleSave(territory.territory, area.id, area.questions.length)}
                            disabled={isSaving || (!hasEdits && !justSaved)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
