'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp, ArrowLeft, Filter, X } from 'lucide-react';
import type { Database } from '@/types/database';

type Conversation = Database['public']['Tables']['conversations']['Row'];

interface CaseStudyItem {
  id: string;
  title: string;
  speakerName: string;
  speakerCompany: string;
  speakerRole: string;
  context: string;
  decisionPoint: string;
  actionTaken: string;
  outcome: string;
  lessonsLearned: string;
  fullExcerpt?: string;
  topicTags: string[];
  industryTags: string[];
  companyStageTags: string[];
  challengeTypeTags: string[];
  phaseRelevance: string[];
  relevanceScore?: number;
}

interface FilterOptions {
  industries: string[];
  stages: string[];
  challenges: string[];
}

interface CaseLibraryProps {
  conversation: Conversation;
}

export function CaseLibrary({ conversation }: CaseLibraryProps) {
  const [cases, setCases] = useState<CaseStudyItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseStudyItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ industries: [], stages: [], challenges: [] });
  const [activeFilters, setActiveFilters] = useState<{
    industry?: string;
    stage?: string;
    challenge?: string;
  }>({});
  const [displayCount, setDisplayCount] = useState(6);

  // Get current phase from framework_state
  const frameworkState = conversation?.framework_state as Record<string, unknown> | null;
  const currentPhase = (frameworkState?.currentPhase as string) || 'discovery';

  // Fetch filter options on mount
  useEffect(() => {
    fetch('/api/product-strategy-agent/case-studies?mode=filters')
      .then(r => r.json())
      .then(data => setFilterOptions(data))
      .catch(() => {});
  }, []);

  // Fetch cases
  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '40' });

      if (searchQuery) params.set('search', searchQuery);
      if (activeFilters.industry) params.set('industry', activeFilters.industry);
      if (activeFilters.stage) params.set('stage', activeFilters.stage);
      if (activeFilters.challenge) params.set('challenge', activeFilters.challenge);

      // If no filters or search, use relevant mode for personalized ranking
      const hasFilters = searchQuery || activeFilters.industry || activeFilters.stage || activeFilters.challenge;
      if (!hasFilters) {
        params.set('mode', 'relevant');
        params.set('user_phase', currentPhase);
      }

      const response = await fetch(`/api/product-strategy-agent/case-studies?${params}`);
      const data = await response.json();
      setCases(data.cases || []);
      setTotal(data.total || 0);
    } catch {
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeFilters, currentPhase]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(6);
  }, [searchQuery, activeFilters]);

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || activeFilters.industry || activeFilters.stage || activeFilters.challenge;

  // Detail view
  if (selectedCase) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedCase(null)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Library
        </button>

        <div className="bg-white border border-cyan-200 rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{selectedCase.title}</h3>
            <p className="text-sm text-slate-600 mt-1">
              {selectedCase.speakerName}, {selectedCase.speakerRole} at {selectedCase.speakerCompany}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectedCase.challengeTypeTags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-medium">
                {tag}
              </span>
            ))}
            {selectedCase.companyStageTags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* 5-section structure */}
          <div className="space-y-4">
            <CaseSection title="Context" color="slate" content={selectedCase.context} />
            <CaseSection title="Decision Point" color="amber" content={selectedCase.decisionPoint} />
            <CaseSection title="What They Did" color="cyan" content={selectedCase.actionTaken} />
            <CaseSection title="Outcome" color="emerald" content={selectedCase.outcome} />
            <CaseSection title="Lessons Learned" color="indigo" content={selectedCase.lessonsLearned} />
          </div>

          {selectedCase.fullExcerpt && (
            <details className="group">
              <summary className="text-sm text-cyan-600 hover:text-cyan-700 cursor-pointer font-medium">
                View Full Excerpt
              </summary>
              <div className="mt-3 p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                  Source: {selectedCase.speakerName}
                </p>
                {selectedCase.fullExcerpt}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-bold text-slate-900">Case Library</h3>
          <span className="text-xs text-slate-400 font-medium">{total} cases</span>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Real-world strategy decisions from proven leaders. Explore how companies like yours navigated similar challenges.
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search cases by keyword..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 transition-all focus:outline-none focus:border-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
        />
      </div>

      {/* Filters toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors duration-300"
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors duration-300"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-3 gap-2">
          <FilterSelect
            label="Industry"
            value={activeFilters.industry}
            options={filterOptions.industries}
            onChange={v => setActiveFilters(f => ({ ...f, industry: v || undefined }))}
          />
          <FilterSelect
            label="Stage"
            value={activeFilters.stage}
            options={filterOptions.stages}
            onChange={v => setActiveFilters(f => ({ ...f, stage: v || undefined }))}
          />
          <FilterSelect
            label="Challenge"
            value={activeFilters.challenge}
            options={filterOptions.challenges}
            onChange={v => setActiveFilters(f => ({ ...f, challenge: v || undefined }))}
          />
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center gap-2.5 text-slate-600 text-sm py-8 justify-center">
          <div className="w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse" />
          <span className="text-xs uppercase tracking-wide font-semibold">Loading cases...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No case studies match your filters</p>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search or clearing filters</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cases.slice(0, displayCount).map(cs => (
              <CaseCard key={cs.id} caseStudy={cs} onClick={() => setSelectedCase(cs)} />
            ))}
          </div>

          {displayCount < cases.length && (
            <button
              onClick={() => setDisplayCount(d => d + 6)}
              className="w-full py-2.5 text-sm font-semibold text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-all duration-300"
            >
              Show more ({cases.length - displayCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function CaseCard({ caseStudy, onClick }: { caseStudy: CaseStudyItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-cyan-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:border-cyan-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{caseStudy.title}</h4>
          <p className="text-xs text-slate-500">
            {caseStudy.speakerName} · {caseStudy.speakerCompany}
          </p>
        </div>
        {caseStudy.relevanceScore !== undefined && caseStudy.relevanceScore > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#fbbf24]/20 text-[#1a1f3a] font-semibold flex-shrink-0">
            {caseStudy.relevanceScore}pt
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{caseStudy.context}</p>

      <div className="flex flex-wrap gap-1 mt-2">
        {caseStudy.challengeTypeTags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
            {tag}
          </span>
        ))}
        {caseStudy.companyStageTags.slice(0, 1).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

function CaseSection({ title, color, content }: { title: string; color: string; content: string }) {
  const colorMap: Record<string, string> = {
    slate: 'border-l-slate-300 bg-slate-50',
    amber: 'border-l-amber-400 bg-amber-50',
    cyan: 'border-l-cyan-400 bg-cyan-50',
    emerald: 'border-l-emerald-400 bg-emerald-50',
    indigo: 'border-l-indigo-400 bg-indigo-50',
  };

  return (
    <div className={`border-l-4 rounded-r-xl p-4 ${colorMap[color] || colorMap.slate}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/20"
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
