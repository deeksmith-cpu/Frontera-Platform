'use client';

import { useState, useEffect } from 'react';
import { FileText, Upload, Sparkles, Building2, MessageSquare, ArrowRight } from 'lucide-react';

interface Material {
  id: string;
  filename: string;
  file_type: string;
  processing_status: string;
  extracted_context: {
    text?: string;
    source?: string;
    generated_by?: string;
    topics?: string[];
  } | null;
}

interface DiscoverySummaryProps {
  conversationId: string;
  onDrillIn: () => void;
}

export function DiscoverySummary({ conversationId, onDrillIn }: DiscoverySummaryProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMaterials() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/materials?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMaterials(Array.isArray(data) ? data : []);
      } catch {
        // Silently handle fetch errors
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMaterials();
    return () => { cancelled = true; };
  }, [conversationId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-4 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
          <div className="h-24 bg-slate-50 rounded-2xl" />
        </div>
        <div className="h-40 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const aiGenerated = materials.filter(m => m.extracted_context?.generated_by === 'ai_research_assistant');
  const uploaded = materials.filter(m => m.extracted_context?.generated_by !== 'ai_research_assistant');

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-5 animate-entrance">
      {/* Summary stats */}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Discovery Summary
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Total documents */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {materials.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Total collected</p>
        </div>

        {/* Uploaded */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uploaded</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {uploaded.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Manual uploads</p>
        </div>

        {/* AI-generated */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Research</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-code)]">
            {aiGenerated.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">AI-generated docs</p>
        </div>
      </div>

      {/* Company Context */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Company Strategic Context</span>
          <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 uppercase tracking-wider">
            Complete
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Company context was auto-completed from onboarding data and enriched during the discovery coaching sessions.
        </p>
      </div>

      {/* Document List */}
      {materials.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-800">Collected Documents</span>
            <button
              onClick={onDrillIn}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#fbbf24] text-xs font-semibold text-slate-900 transition-all duration-300 hover:bg-[#f59e0b] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:ring-offset-2"
            >
              Review Discovery
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Uploaded documents */}
          {uploaded.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Uploaded ({uploaded.length})
              </p>
              <div className="space-y-1.5">
                {uploaded.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                    <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate flex-1">{m.filename}</span>
                    <span className="text-[9px] text-slate-400 uppercase flex-shrink-0">{m.file_type}</span>
                  </div>
                ))}
                {uploaded.length > 5 && (
                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    +{uploaded.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* AI-generated documents */}
          {aiGenerated.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                AI Research ({aiGenerated.length})
              </p>
              <div className="space-y-1.5">
                {aiGenerated.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-purple-50/50 border border-purple-100">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="text-xs text-slate-700 truncate flex-1">{m.filename}</span>
                    <span className="text-[9px] text-purple-500 uppercase flex-shrink-0">AI</span>
                  </div>
                ))}
                {aiGenerated.length > 5 && (
                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    +{aiGenerated.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Coaching note */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Coaching conversations from the Discovery phase helped shape the strategic context
            that informed your terrain mapping and synthesis.
          </p>
        </div>
      </div>
    </div>
  );
}
