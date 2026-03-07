'use client';

import { useState, useEffect, useContext } from 'react';
import { FileText, CheckCircle2, AlertCircle, MessageSquare, Lightbulb } from 'lucide-react';
import { CoachJourneyContext } from '@/contexts/CoachJourneyContext';

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

interface DiscoveryPreviewProps {
  conversationId: string | null;
}

export function DiscoveryPreview({ conversationId }: DiscoveryPreviewProps) {
  const journeyContext = useContext(CoachJourneyContext);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchMaterials() {
      try {
        const res = await fetch(
          `/api/product-strategy-agent/materials?conversation_id=${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setMaterials(Array.isArray(data) ? data : []);
        }
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
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-32" />
        <div className="h-16 bg-slate-50 rounded-2xl" />
        <div className="h-16 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const hasMaterials = materials.length > 0;
  const aiGenerated = materials.filter(
    (m) => m.extracted_context?.generated_by === 'ai_research_assistant'
  );
  const uploaded = materials.filter(
    (m) => m.extracted_context?.generated_by !== 'ai_research_assistant'
  );

  return (
    <div className="space-y-3">
      {/* Discovery Checklist */}
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        Discovery Checklist
      </p>

      {/* 1. Company Context - always complete (from onboarding) */}
      <div className="flex items-start gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-700">Company Context</p>
          <p className="text-[10px] text-slate-500">Auto-completed from onboarding</p>
        </div>
      </div>

      {/* 2. Strategic Materials - required */}
      <div className={`flex items-start gap-2 p-2.5 rounded-xl border ${
        hasMaterials
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-amber-50 border-amber-300'
      }`}>
        {hasMaterials ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <p className="text-xs font-semibold text-slate-700">Strategic Materials</p>
          {hasMaterials ? (
            <p className="text-[10px] text-emerald-600 font-medium">
              {materials.length} document{materials.length !== 1 ? 's' : ''} uploaded
            </p>
          ) : (
            <p className="text-[10px] text-amber-600 font-medium">
              Required — upload at least 1 document
            </p>
          )}
        </div>
      </div>

      {/* 3. Coaching Conversations - recommended */}
      <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-700">Coaching Conversations</p>
          <p className="text-[10px] text-slate-500">Recommended for richer insights</p>
        </div>
      </div>

      {/* Tip */}
      <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-cyan-700 leading-relaxed">
            The more strategic context you provide, the better your coaching insights will be.
          </p>
        </div>
      </div>

      {/* Materials list (if any) */}
      {hasMaterials && (
        <>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold pt-2">
            Uploaded Materials
          </p>
          <div className="space-y-1.5">
            {materials.slice(0, 8).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200"
              >
                <FileText className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-slate-700 truncate">{m.filename}</p>
                  {m.extracted_context?.generated_by === 'ai_research_assistant' && (
                    <span className="text-[9px] text-emerald-600 font-medium uppercase tracking-wider">
                      AI Research
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 uppercase flex-shrink-0">
                  {m.file_type}
                </span>
              </div>
            ))}
            {materials.length > 8 && (
              <p className="text-xs text-slate-400 text-center pt-1">
                +{materials.length - 8} more document{materials.length - 8 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </>
      )}

      {/* Phase transition CTA */}
      {hasMaterials && (
        <div className="pt-2">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-3">
            <p className="text-[10px] text-emerald-700 font-semibold mb-0.5">
              Requirements Met
            </p>
            <p className="text-[10px] text-emerald-600">
              {materials.length} document{materials.length !== 1 ? 's' : ''} uploaded. Ready to proceed.
            </p>
          </div>
          <button
            className="w-full py-2.5 rounded-lg bg-[#fbbf24] text-xs font-semibold text-[#1a1f3a] hover:bg-[#f59e0b] shadow-sm transition-colors"
            onClick={() => {
              journeyContext?.handlePhaseTransition('research');
            }}
          >
            Begin Terrain Mapping &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
