'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProgressRing } from '../ProgressRing';
import { SynthesisCanvasView } from './SynthesisCanvasView';
import { BetsCanvasView } from './BetsCanvasView';
import type { SynthesisResult } from '@/types/synthesis';

interface TerritoryProgress {
  mapped: number;
  total: number;
}

interface LiveCanvasProps {
  currentPhase: string;
  territoryProgress: {
    company: TerritoryProgress;
    customer: TerritoryProgress;
    competitor: TerritoryProgress;
  };
  activeTerritory: string | null;
  conversationId: string | null;
  synthesis?: SynthesisResult | null;
  bets?: {
    theses: Array<{
      id: string;
      title: string;
      description: string;
      ptwWinningAspiration: string;
      ptwWhereToPlay: string;
      ptwHowToWin: string;
      thesisType: 'offensive' | 'defensive' | 'capability';
      bets: Array<{
        id: string;
        bet: string;
        successMetric: string;
        status: string;
        scoring: { overallScore: number };
        priorityLevel: string;
        timeHorizon: string;
      }>;
    }>;
    portfolioSummary: {
      totalBets: number;
      totalTheses: number;
      byThesisType: { offensive: number; defensive: number; capability: number };
      avgScore: number;
    } | null;
  } | null;
  isLoading?: boolean;
}

const TERRITORY_CONFIG = [
  {
    id: 'company' as const,
    label: 'Company',
    color: '#818cf8',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    ringClass: 'ring-indigo-300/50',
    areas: ['Core Capabilities', 'Resource Reality', 'Product Portfolio'],
  },
  {
    id: 'customer' as const,
    label: 'Customer',
    color: '#22d3ee',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    ringClass: 'ring-cyan-300/50',
    areas: ['Segmentation', 'Unmet Needs', 'Market Dynamics'],
  },
  {
    id: 'competitor' as const,
    label: 'Market Context',
    color: '#c084fc',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    ringClass: 'ring-purple-300/50',
    areas: ['Direct Competitors', 'Substitute Threats', 'Market Forces'],
  },
] as const;

function TerritoryMapView({
  territoryProgress,
  activeTerritory,
}: {
  territoryProgress: LiveCanvasProps['territoryProgress'];
  activeTerritory: string | null;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Terrain</h3>
      </div>

      {TERRITORY_CONFIG.map((territory) => {
        const progress = territoryProgress[territory.id];
        const percentage = progress.total > 0 ? Math.round((progress.mapped / progress.total) * 100) : 0;
        const isActive = activeTerritory === territory.id;

        return (
          <div
            key={territory.id}
            className={`rounded-2xl border p-4 transition-all duration-300 ${
              isActive
                ? `${territory.bgColor} ${territory.borderColor} shadow-md ring-2 ${territory.ringClass}`
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-semibold ${isActive ? territory.textColor : 'text-slate-700'}`}>
                {territory.label}
              </h4>
              <ProgressRing
                percentage={percentage}
                size={28}
                strokeWidth={2.5}
                color={territory.color}
              />
            </div>

            <div className="space-y-1.5">
              {territory.areas.map((area, index) => {
                const isMapped = index < progress.mapped;
                return (
                  <div
                    key={area}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-500 ${
                      isMapped
                        ? `${territory.bgColor} ${territory.textColor} font-medium`
                        : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isMapped ? 'bg-current' : 'bg-slate-300'
                    }`} />
                    <span className="truncate">{area}</span>
                    {isMapped && (
                      <svg className="w-3 h-3 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
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

/* ── File type icons ─────────────────────────────────────────── */

const FILE_TYPE_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  pdf: { icon: 'PDF', color: 'text-red-600', bg: 'bg-red-50' },
  docx: { icon: 'DOC', color: 'text-blue-600', bg: 'bg-blue-50' },
  doc: { icon: 'DOC', color: 'text-blue-600', bg: 'bg-blue-50' },
  txt: { icon: 'TXT', color: 'text-slate-600', bg: 'bg-slate-100' },
  url: { icon: 'URL', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  csv: { icon: 'CSV', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  xlsx: { icon: 'XLS', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  pptx: { icon: 'PPT', color: 'text-amber-600', bg: 'bg-amber-50' },
};

function getFileConfig(fileType: string) {
  return FILE_TYPE_CONFIG[fileType.toLowerCase()] || { icon: 'FILE', color: 'text-slate-500', bg: 'bg-slate-50' };
}

/* ── Material type from API ─────────────────────────────────── */

interface Material {
  id: string;
  filename: string;
  file_type: string;
  file_size: number | null;
  processing_status: string;
  uploaded_at: string;
  extracted_context: Record<string, unknown>;
}

/* ── Documents Card ─────────────────────────────────────────── */

function DocumentsCard({ materials, isLoading }: { materials: Material[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Materials</h4>
        </div>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-8 rounded-lg bg-slate-50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Materials</h4>
        </div>
        <div className="text-center py-4">
          <p className="text-xs text-slate-400">No documents uploaded yet</p>
          <p className="text-[11px] text-slate-400 mt-1">Use the chat toolbar to add materials</p>
        </div>
      </div>
    );
  }

  // Count by type
  const typeCounts: Record<string, number> = {};
  for (const m of materials) {
    const isAiGenerated = m.extracted_context?.generated_by === 'ai_research_assistant';
    const label = isAiGenerated ? 'AI Research' : m.file_type.toUpperCase();
    typeCounts[label] = (typeCounts[label] || 0) + 1;
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategic Materials</h4>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {materials.length}
        </span>
      </div>

      {/* Type breakdown pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.entries(typeCounts).map(([type, count]) => (
          <span key={type} className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 rounded-full px-2 py-0.5">
            {count} {type}
          </span>
        ))}
      </div>

      {/* File list */}
      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {materials.map((m) => {
          const isAiGenerated = m.extracted_context?.generated_by === 'ai_research_assistant';
          const config = isAiGenerated
            ? { icon: 'AI', color: 'text-purple-600', bg: 'bg-purple-50' }
            : getFileConfig(m.file_type);

          return (
            <div key={m.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors group">
              <span className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${config.bg} ${config.color}`}>
                {config.icon}
              </span>
              <span className="text-xs text-slate-700 truncate flex-1" title={m.filename}>
                {m.filename}
              </span>
              {m.processing_status === 'completed' ? (
                <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : m.processing_status === 'pending' || m.processing_status === 'processing' ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              ) : (
                <svg className="w-3 h-3 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Emerging Insights Card ─────────────────────────────────── */

function EmergingInsightsCard({ materials, isLoading }: { materials: Material[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm shadow-cyan-100/50 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emerging Insights</h4>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 rounded bg-slate-50 animate-pulse" style={{ width: `${85 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  // Extract insights from materials with content
  const topics: string[] = [];
  const sources: string[] = [];
  let totalContentLength = 0;

  for (const m of materials) {
    const ctx = m.extracted_context;
    if (!ctx) continue;

    // AI Research docs have topics
    if (ctx.topics && typeof ctx.topics === 'string') {
      for (const t of ctx.topics.split(',')) {
        const trimmed = t.trim();
        if (trimmed && !topics.includes(trimmed)) {
          topics.push(trimmed);
        }
      }
    }

    // Track content depth
    if (ctx.text && typeof ctx.text === 'string') {
      totalContentLength += (ctx.text as string).length;
    }

    // Track sources
    if (ctx.source && typeof ctx.source === 'string' && ctx.source !== 'AI-generated research') {
      const domain = (() => {
        try { return new URL(ctx.source as string).hostname.replace('www.', ''); } catch { return null; }
      })();
      if (domain && !sources.includes(domain)) {
        sources.push(domain);
      }
    }
  }

  const hasContent = materials.length > 0;
  const aiDocCount = materials.filter(m => m.extracted_context?.generated_by === 'ai_research_assistant').length;
  const uploadedCount = materials.length - aiDocCount;

  if (!hasContent) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emerging Insights</h4>
        </div>
        <p className="text-xs text-slate-400 text-center py-3">
          Insights will appear here as you add strategic materials.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm shadow-cyan-100/50 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emerging Insights</h4>
      </div>

      {/* Summary stats */}
      <div className="flex gap-3 mb-3">
        {uploadedCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{uploadedCount} uploaded</span>
          </div>
        )}
        {aiDocCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{aiDocCount} AI-researched</span>
          </div>
        )}
      </div>

      {/* Topics from AI research */}
      {topics.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Key Topics</p>
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 8).map((topic) => (
              <span key={topic} className="inline-flex items-center text-[10px] font-medium text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-full px-2 py-0.5">
                {topic}
              </span>
            ))}
            {topics.length > 8 && (
              <span className="text-[10px] text-slate-400">+{topics.length - 8} more</span>
            )}
          </div>
        </div>
      )}

      {/* External sources */}
      {sources.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Sources</p>
          <div className="space-y-1">
            {sources.slice(0, 4).map((source) => (
              <div key={source} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                <span className="truncate">{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context depth indicator */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Context Depth</span>
          <span className="text-[10px] font-semibold text-slate-500">
            {totalContentLength > 10000 ? 'Rich' : totalContentLength > 3000 ? 'Good' : materials.length > 0 ? 'Building' : 'None'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, (totalContentLength / 15000) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Discovery View (Documents + Insights) ──────────────────── */

function DiscoveryView({ conversationId }: { conversationId: string | null }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMaterials = useCallback(async () => {
    if (!conversationId) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/product-strategy-agent-v2/materials?conversation_id=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data);
      }
    } catch (err) {
      console.error('Error fetching materials for canvas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Initial fetch + poll every 10s for updates from chat toolbar uploads
  useEffect(() => {
    fetchMaterials();
    const interval = setInterval(fetchMaterials, 10000);
    return () => clearInterval(interval);
  }, [fetchMaterials]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Discovery</h3>
      </div>

      <div className="animate-entrance animate-delay-200">
        <DocumentsCard materials={materials} isLoading={isLoading} />
      </div>
      <div className="animate-entrance animate-delay-300">
        <EmergingInsightsCard materials={materials} isLoading={isLoading} />
      </div>
    </div>
  );
}

export function LiveCanvas({
  currentPhase,
  territoryProgress,
  activeTerritory,
  conversationId,
  synthesis,
  bets,
  isLoading,
}: LiveCanvasProps) {
  return (
    <aside className="h-full border-l border-slate-200 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 60%, #ecfeff 100%)' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm border-t-2 border-t-cyan-200/40">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Strategy Canvas</h2>
          {isLoading && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        {currentPhase === 'discovery' && <DiscoveryView conversationId={conversationId} />}

        {currentPhase === 'research' && (
          <TerritoryMapView
            territoryProgress={territoryProgress}
            activeTerritory={activeTerritory}
          />
        )}

        {currentPhase === 'synthesis' && (
          <SynthesisCanvasView
            opportunities={synthesis?.opportunities || []}
          />
        )}

        {(currentPhase === 'bets' || currentPhase === 'planning' || currentPhase === 'activation' || currentPhase === 'review') && (
          <BetsCanvasView
            theses={bets?.theses || []}
            portfolioSummary={bets?.portfolioSummary || null}
          />
        )}
      </div>
    </aside>
  );
}
