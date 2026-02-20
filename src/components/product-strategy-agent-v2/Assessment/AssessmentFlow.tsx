'use client';

import { useState, useCallback } from 'react';
import { LikertQuestion } from './LikertQuestion';
import { SituationalChoice } from './SituationalChoice';
import { AssessmentResults } from './AssessmentResults';
import {
  LIKERT_QUESTIONS,
  SITUATIONAL_QUESTIONS,
  TOTAL_QUESTIONS,
} from '@/lib/assessment/questions';
import type { AssessmentScoreResult } from '@/lib/assessment/scoring';

type AssessmentPhase = 'intro' | 'likert' | 'situational' | 'submitting' | 'results';

export function AssessmentFlow() {
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentLikertIdx, setCurrentLikertIdx] = useState(0);
  const [currentSituationalIdx, setCurrentSituationalIdx] = useState(0);
  const [likertResponses, setLikertResponses] = useState<Record<string, number>>({});
  const [situationalResponses, setSituationalResponses] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const answeredCount =
    Object.keys(likertResponses).length + Object.keys(situationalResponses).length;
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const handleLikertAnswer = useCallback(
    (value: number) => {
      const q = LIKERT_QUESTIONS[currentLikertIdx];
      setLikertResponses((prev) => ({ ...prev, [q.id]: value }));

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentLikertIdx < LIKERT_QUESTIONS.length - 1) {
          setCurrentLikertIdx((prev) => prev + 1);
        } else {
          setPhase('situational');
        }
      }, 300);
    },
    [currentLikertIdx]
  );

  const handleSituationalAnswer = useCallback(
    (optionId: string) => {
      const q = SITUATIONAL_QUESTIONS[currentSituationalIdx];
      setSituationalResponses((prev) => ({ ...prev, [q.id]: optionId }));

      setTimeout(() => {
        if (currentSituationalIdx < SITUATIONAL_QUESTIONS.length - 1) {
          setCurrentSituationalIdx((prev) => prev + 1);
        } else {
          // All done — submit
          submitAssessment(likertResponses, {
            ...situationalResponses,
            [q.id]: optionId,
          });
        }
      }, 300);
    },
    [currentSituationalIdx, likertResponses, situationalResponses]
  );

  const submitAssessment = async (
    likert: Record<string, number>,
    situational: Record<string, string>
  ) => {
    setPhase('submitting');
    setError(null);

    try {
      const res = await fetch('/api/product-strategy-agent-v2/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likertResponses: likert,
          situationalResponses: situational,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save assessment');
      }

      const data = await res.json();
      setResult(data.result);
      setPhase('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('situational');
    }
  };

  const handleBack = () => {
    if (phase === 'situational') {
      if (currentSituationalIdx > 0) {
        setCurrentSituationalIdx((prev) => prev - 1);
      } else {
        setPhase('likert');
        setCurrentLikertIdx(LIKERT_QUESTIONS.length - 1);
      }
    } else if (phase === 'likert') {
      if (currentLikertIdx > 0) {
        setCurrentLikertIdx((prev) => prev - 1);
      } else {
        setPhase('intro');
      }
    }
  };

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-[#1a1f3a] p-8 text-white shadow-lg">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#fbbf24]/20 blur-2xl" />
            <div className="relative space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
                Strategic Maturity Assessment
              </span>
              <h1 className="text-2xl font-bold">Discover Your Strategic Archetype</h1>
              <p className="text-slate-300 leading-relaxed text-sm">
                Answer 23 questions to understand your strategic strengths and growth areas.
                Your results will personalise your entire coaching experience.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>20 rating questions</span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span>3 scenarios</span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span>~8 minutes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('likert')}
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#fbbf24] px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
          >
            Start Assessment
          </button>

          <a
            href="/dashboard/product-strategy-agent-v2"
            className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip for now — assess later
          </a>
        </div>
      </div>
    );
  }

  // Submitting state
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-3 h-3 rounded-full bg-[#fbbf24] animate-pulse mx-auto" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-600">
            Analysing your strategic profile...
          </span>
        </div>
      </div>
    );
  }

  // Results
  if (phase === 'results' && result) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <AssessmentResults result={result} />
        </div>
      </div>
    );
  }

  // Questions
  const isLikert = phase === 'likert';
  const currentQ = isLikert ? LIKERT_QUESTIONS[currentLikertIdx] : null;
  const currentSit = !isLikert ? SITUATIONAL_QUESTIONS[currentSituationalIdx] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Progress bar */}
      <div className="flex-shrink-0 bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">
              {answeredCount}/{TOTAL_QUESTIONS} completed
            </span>
            <span className="text-xs font-semibold text-[#1a1f3a]">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#fbbf24] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLikert && currentQ && (
            <LikertQuestion
              questionNumber={currentLikertIdx + 1}
              totalQuestions={LIKERT_QUESTIONS.length}
              questionText={currentQ.text}
              value={likertResponses[currentQ.id] ?? null}
              onChange={handleLikertAnswer}
            />
          )}

          {!isLikert && currentSit && (
            <SituationalChoice
              questionNumber={currentSituationalIdx + 1}
              totalQuestions={SITUATIONAL_QUESTIONS.length}
              scenario={currentSit.scenario}
              options={currentSit.options.map((o) => ({ id: o.id, text: o.text }))}
              selectedId={situationalResponses[currentSit.id] ?? null}
              onChange={handleSituationalAnswer}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-6 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium"
          >
            Back
          </button>
          <span className="text-[11px] text-slate-400">
            {isLikert ? 'Rating Questions' : 'Situational Scenarios'}
          </span>
        </div>
      </div>
    </div>
  );
}
