'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Compass,
  Map,
  Lightbulb,
  Target,
  Upload,
  Sparkles,
  Building2,
  Users,
  Swords,
  ArrowRight,
  CheckCircle2,
  FileText,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import type { ResearchProgressData } from '@/hooks/useResearchProgress';

interface OrientationViewProps {
  phase: string;
  conversationId: string | null;
  researchProgress: ResearchProgressData | null;
  onDismiss: () => void;
  onBeginTerrainMapping: () => void;
  onTerritoryClick: (territory: string) => void;
  researchReady?: boolean;
  onBeginSynthesis?: () => Promise<void>;
  isTransitioning?: boolean;
}

const TERRITORY_CARDS = [
  {
    id: 'company' as const,
    label: 'Company Territory',
    description: 'Understand your foundations, strategic position, and competitive advantages',
    icon: Building2,
    color: 'indigo',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-300',
    textClass: 'text-indigo-700',
    iconBg: 'bg-indigo-100',
  },
  {
    id: 'customer' as const,
    label: 'Customer Territory',
    description: 'Map customer segments, unmet needs, and market dynamics',
    icon: Users,
    color: 'cyan',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-300',
    textClass: 'text-cyan-700',
    iconBg: 'bg-cyan-100',
  },
  {
    id: 'competitor' as const,
    label: 'Market Context',
    description: 'Assess direct competitors, substitutes, and market forces',
    icon: Swords,
    color: 'purple',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    hoverBorder: 'hover:border-purple-300',
    textClass: 'text-purple-700',
    iconBg: 'bg-purple-100',
  },
];

function getTerritoryStatus(
  researchProgress: ResearchProgressData | null,
  territory: string,
): 'unmapped' | 'in_progress' | 'mapped' {
  if (!researchProgress) return 'unmapped';
  const tp = researchProgress.territories.find((t) => t.territory === territory);
  if (!tp) return 'unmapped';
  if (tp.completedAreas === tp.totalAreas) return 'mapped';
  if (tp.answeredQuestions > 0) return 'in_progress';
  return 'unmapped';
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  unmapped: { label: 'Unmapped', className: 'bg-slate-100 text-slate-500' },
  in_progress: { label: 'In Progress', className: 'bg-amber-50 text-amber-700' },
  mapped: { label: 'Mapped', className: 'bg-emerald-50 text-emerald-700' },
};

// Tailwind-safe color class lookup (avoids dynamic interpolation which gets purged)
const COLOR_CLASSES: Record<string, { bgLight: string; text: string; progressBar: string }> = {
  emerald: { bgLight: 'bg-emerald-50', text: 'text-emerald-600', progressBar: 'bg-emerald-500' },
  amber: { bgLight: 'bg-amber-50', text: 'text-amber-600', progressBar: 'bg-amber-500' },
  purple: { bgLight: 'bg-purple-50', text: 'text-purple-600', progressBar: 'bg-purple-500' },
  cyan: { bgLight: 'bg-cyan-50', text: 'text-cyan-600', progressBar: 'bg-cyan-500' },
  indigo: { bgLight: 'bg-indigo-50', text: 'text-indigo-600', progressBar: 'bg-indigo-500' },
};

// Phase-specific orientation content
const PHASE_ORIENTATION: Record<string, {
  icon: typeof Compass;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}> = {
  discovery: {
    icon: Compass,
    title: 'Welcome to Discovery',
    subtitle: 'Context Setting',
    description: 'Upload strategic documents and explore your company context. The more materials you provide, the more tailored your coaching experience will be.',
    color: 'emerald',
  },
  research: {
    icon: Map,
    title: 'Map Your Strategic Terrain',
    subtitle: '3 Territories × 3 Areas × 4 Questions',
    description: 'Explore Company, Customer, and Market territories through structured research questions. Your Strategy Coach will guide you through each area.',
    color: 'amber',
  },
  synthesis: {
    icon: Lightbulb,
    title: 'Pattern Recognition',
    subtitle: 'Cross-Territory Insights',
    description: 'Your research is being synthesized into strategic opportunities, tensions, and recommendations across all three territories.',
    color: 'purple',
  },
  bets: {
    icon: Target,
    title: 'Strategic Bets',
    subtitle: 'Hypothesis-Driven Planning',
    description: 'Transform insights into testable strategic hypotheses with clear success metrics and kill criteria.',
    color: 'cyan',
  },
};

export function OrientationView({
  phase,
  conversationId,
  researchProgress,
  onDismiss,
  onBeginTerrainMapping,
  onTerritoryClick,
  researchReady = false,
  onBeginSynthesis,
  isTransitioning = false,
}: OrientationViewProps) {
  const [materialsCount, setMaterialsCount] = useState(0);

  // Fetch materials count for discovery phase
  useEffect(() => {
    if (phase !== 'discovery' || !conversationId) return;
    let cancelled = false;
    async function fetchMaterials() {
      try {
        const res = await fetch(`/api/product-strategy-agent-v2/materials?conversation_id=${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setMaterialsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch { /* ignore */ }
    }
    fetchMaterials();
    return () => { cancelled = true; };
  }, [phase, conversationId]);

  const orientation = PHASE_ORIENTATION[phase];
  if (!orientation) return null;

  const Icon = orientation.icon;
  const colors = COLOR_CLASSES[orientation.color] || COLOR_CLASSES.emerald;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 animate-entrance">
        {/* Phase welcome banner */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bgLight} mb-4 shadow-sm`}>
            <Icon className={`w-8 h-8 ${colors.text}`} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{orientation.title}</h1>
          <p className="text-sm text-slate-500 font-medium">{orientation.subtitle}</p>
          <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
            {orientation.description}
          </p>
        </div>

        {/* Phase-specific content */}
        {phase === 'discovery' && (
          <DiscoveryOrientation
            materialsCount={materialsCount}
            conversationId={conversationId}
            onBeginTerrainMapping={onBeginTerrainMapping}
            onDismiss={onDismiss}
          />
        )}

        {phase === 'research' && (
          <ResearchOrientation
            researchProgress={researchProgress}
            onTerritoryClick={onTerritoryClick}
            onDismiss={onDismiss}
            researchReady={researchReady}
            onBeginSynthesis={onBeginSynthesis}
            isTransitioning={isTransitioning}
          />
        )}

        {(phase === 'synthesis' || phase === 'bets') && (
          <div className="text-center">
            <button
              onClick={onDismiss}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 transition-colors hover:bg-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Discovery sub-view with inline upload and AI research
function DiscoveryOrientation({
  materialsCount: initialMaterialsCount,
  conversationId,
  onBeginTerrainMapping,
  onDismiss,
}: {
  materialsCount: number;
  conversationId: string | null;
  onBeginTerrainMapping: () => void;
  onDismiss: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [materialsCount, setMaterialsCount] = useState(initialMaterialsCount);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showAIResearch, setShowAIResearch] = useState(false);
  const [aiTopics, setAiTopics] = useState('');
  const [aiWebsites, setAiWebsites] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);

  // Sync initial count
  useEffect(() => {
    setMaterialsCount(initialMaterialsCount);
  }, [initialMaterialsCount]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !conversationId) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversation_id', conversationId);

      const response = await fetch('/api/product-strategy-agent-v2/upload', {
        method: 'POST',
        body: formData,
        // Prevent Next.js from intercepting FormData as a Server Action
        headers: { 'x-api-route': '1' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setMaterialsCount(prev => prev + 1);
      setUploadSuccess(`"${file.name}" uploaded successfully`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [conversationId]);

  const handleAIResearch = useCallback(async () => {
    if (!conversationId || !aiTopics.trim()) return;

    setIsResearching(true);
    setResearchResult(null);

    try {
      const response = await fetch('/api/product-strategy-agent-v2/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          topics: aiTopics,
          websites: aiWebsites || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Research failed');
      }

      const data = await response.json();
      const docCount = data.documents?.length || data.count || 0;
      setMaterialsCount(prev => prev + docCount);
      setResearchResult(`Found ${docCount} document${docCount !== 1 ? 's' : ''}. Materials added to your discovery context.`);
      setAiTopics('');
      setAiWebsites('');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'AI Research failed');
    } finally {
      setIsResearching(false);
    }
  }, [conversationId, aiTopics, aiWebsites]);

  return (
    <div className="space-y-6">
      {/* Progress checklist */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Discovery Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-emerald-50/50 rounded-lg px-3 py-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-sm text-slate-700">Company strategic context</span>
            <span className="text-xs text-emerald-600 font-medium ml-auto">Complete</span>
          </div>
          <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${materialsCount > 0 ? 'bg-emerald-50/50' : 'bg-amber-50/50 border border-amber-200'}`}>
            {materialsCount > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-amber-500">!</span>
              </div>
            )}
            <span className="text-sm text-slate-700">Strategic materials</span>
            <span className={`text-xs font-semibold ml-auto ${materialsCount > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {materialsCount > 0 ? `${materialsCount} document${materialsCount > 1 ? 's' : ''}` : 'Required'}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
            <span className="text-sm text-slate-500">Coaching conversations</span>
            <span className="text-xs text-slate-400 font-medium ml-auto">Recommended</span>
          </div>
        </div>
      </div>

      {/* Guidance note */}
      <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl px-4 py-3">
        <p className="text-xs text-cyan-800 leading-relaxed">
          <span className="font-semibold">Tip:</span> The more context you provide, the better your coaching insights will be. Upload annual reports, strategic plans, or let our AI Research Assistant find relevant materials.
        </p>
      </div>

      {/* Error / Success feedback */}
      {uploadError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <span className="text-xs text-red-700">{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
        </div>
      )}
      {uploadSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 animate-entrance">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-emerald-700">{uploadSuccess}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="discovery-file-upload"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !conversationId}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-cyan-300 bg-white text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-cyan-50 hover:border-cyan-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-cyan-600" />
          )}
          {isUploading ? 'Uploading...' : 'Upload Materials'}
        </button>
        <button
          onClick={() => setShowAIResearch(!showAIResearch)}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 hover:shadow-md ${
            showAIResearch
              ? 'border-[#fbbf24] bg-[#fbbf24]/10 text-[#1a1f3a]'
              : 'border-cyan-300 bg-white text-slate-700 hover:bg-cyan-50 hover:border-cyan-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
          AI Research
        </button>
      </div>

      {/* AI Research inline panel */}
      {showAIResearch && (
        <div className="bg-white border border-[#fbbf24]/30 rounded-2xl p-5 shadow-sm animate-entrance">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#1a1f3a] flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-[#fbbf24]" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">AI Research Assistant</h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Describe what you need research on and optionally provide websites to search.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Topics &amp; Keywords</label>
              <input
                type="text"
                value={aiTopics}
                onChange={(e) => setAiTopics(e.target.value)}
                placeholder="e.g. wealth management market trends, competitor analysis..."
                className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Websites (optional)</label>
              <input
                type="text"
                value={aiWebsites}
                onChange={(e) => setAiWebsites(e.target.value)}
                placeholder="e.g. company.com, industryreport.com"
                className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-[#fbbf24] focus:ring-1 focus:ring-[#fbbf24]/20 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleAIResearch}
              disabled={isResearching || !aiTopics.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1f3a] text-xs font-semibold text-white transition-all hover:bg-[#2d3561] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                  Find Documents
                </>
              )}
            </button>
          </div>
          {researchResult && (
            <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 animate-entrance">
              <FileText className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="text-xs text-emerald-700">{researchResult}</span>
            </div>
          )}
        </div>
      )}

      {materialsCount >= 1 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-emerald-700 font-medium mb-3">You have enough context to begin terrain mapping.</p>
          <button
            onClick={onBeginTerrainMapping}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
          >
            Begin Terrain Mapping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onDismiss}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          Skip to coaching chat
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Research sub-view with territory cards
function ResearchOrientation({
  researchProgress,
  onTerritoryClick,
  onDismiss,
  researchReady = false,
  onBeginSynthesis,
  isTransitioning = false,
}: {
  researchProgress: ResearchProgressData | null;
  onTerritoryClick: (territory: string) => void;
  onDismiss: () => void;
  researchReady?: boolean;
  onBeginSynthesis?: () => Promise<void>;
  isTransitioning?: boolean;
}) {
  return (
    <div className="space-y-3">
      {/* Research Complete — Synthesis CTA */}
      {researchReady && onBeginSynthesis && (
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-5 animate-entrance">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900">All Territories Mapped</h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Your strategic terrain is complete. Move to synthesis to discover cross-territory patterns and opportunities.
              </p>
              <button
                onClick={() => void onBeginSynthesis()}
                disabled={isTransitioning}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fbbf24] text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransitioning ? 'Transitioning...' : 'Begin Pattern Recognition'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Territory cards */}
      {TERRITORY_CARDS.map((card) => {
        const status = getTerritoryStatus(researchProgress, card.id);
        const badge = STATUS_BADGES[status];
        const tp = researchProgress?.territories.find((t) => t.territory === card.id);
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            onClick={() => onTerritoryClick(card.id)}
            className={`w-full text-left bg-white border ${card.borderClass} ${card.hoverBorder} rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${card.textClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-slate-900">{card.label}</h3>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
                {tp && tp.answeredQuestions > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${(COLOR_CLASSES[card.color] || COLOR_CLASSES.emerald).progressBar}`}
                        style={{ width: `${(tp.answeredQuestions / tp.totalQuestions) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-[family-name:var(--font-code)]">
                      {tp.answeredQuestions}/{tp.totalQuestions}
                    </span>
                  </div>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0 mt-1" />
            </div>
          </button>
        );
      })}

      {/* Skip to chat */}
      <div className="text-center pt-2">
        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip to coaching chat →
        </button>
      </div>
    </div>
  );
}
