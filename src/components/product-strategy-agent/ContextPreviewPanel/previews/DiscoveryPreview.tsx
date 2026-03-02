'use client';

import { useState, useEffect } from 'react';
import { FileText, Building2 } from 'lucide-react';

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

  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No materials uploaded yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Upload documents in the coaching panel to get started
        </p>
      </div>
    );
  }

  const aiGenerated = materials.filter(
    (m) => m.extracted_context?.generated_by === 'ai_research_assistant'
  );
  const uploaded = materials.filter(
    (m) => m.extracted_context?.generated_by !== 'ai_research_assistant'
  );

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Discovery Materials
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-code">
            {materials.length}
          </span>
          <span className="text-sm text-slate-500">
            document{materials.length !== 1 ? 's' : ''} collected
          </span>
        </div>
        {aiGenerated.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">
            {aiGenerated.length} from AI Research, {uploaded.length} uploaded
          </p>
        )}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {materials.slice(0, 8).map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-100"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700 truncate">{m.filename}</p>
              {m.extracted_context?.generated_by === 'ai_research_assistant' && (
                <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                  AI Research
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 uppercase flex-shrink-0">
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
    </div>
  );
}
