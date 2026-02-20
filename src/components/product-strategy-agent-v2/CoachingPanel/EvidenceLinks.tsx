'use client';

import { useMemo } from 'react';
import { Link2, Map, FileText, Sparkles } from 'lucide-react';

export interface EvidenceRef {
  type: 'Territory' | 'Doc' | 'Synthesis';
  value: string;
  original: string;
}

interface EvidenceLinksProps {
  references: EvidenceRef[];
  onNavigate?: (ref: EvidenceRef) => void;
}

// Parse evidence references from message content
export function parseEvidenceReferences(content: string): {
  text: string;
  references: EvidenceRef[];
} {
  const pattern = /\[(Territory|Doc|Synthesis):([^\]]+)\]/g;
  const references: EvidenceRef[] = [];

  let match;
  while ((match = pattern.exec(content)) !== null) {
    references.push({
      type: match[1] as 'Territory' | 'Doc' | 'Synthesis',
      value: match[2].trim(),
      original: match[0],
    });
  }

  return { text: content, references };
}

// Get unique references (deduplicated)
function getUniqueRefs(references: EvidenceRef[]): EvidenceRef[] {
  const seen = new Set<string>();
  return references.filter(ref => {
    if (seen.has(ref.original)) return false;
    seen.add(ref.original);
    return true;
  });
}

// Get icon for evidence type
function getEvidenceIcon(type: EvidenceRef['type']) {
  switch (type) {
    case 'Territory':
      return <Map className="w-3 h-3" />;
    case 'Doc':
      return <FileText className="w-3 h-3" />;
    case 'Synthesis':
      return <Sparkles className="w-3 h-3" />;
    default:
      return <Link2 className="w-3 h-3" />;
  }
}

// Get label for evidence type
function getEvidenceLabel(ref: EvidenceRef): string {
  switch (ref.type) {
    case 'Territory':
      return ref.value; // e.g., "Customer:Segmentation" -> "Segmentation"
    case 'Doc':
      return ref.value.length > 25 ? ref.value.substring(0, 22) + '...' : ref.value;
    case 'Synthesis':
      return ref.value;
    default:
      return ref.value;
  }
}

export function EvidenceLinks({ references, onNavigate }: EvidenceLinksProps) {
  const uniqueRefs = useMemo(() => getUniqueRefs(references), [references]);

  if (uniqueRefs.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-1.5 mb-2">
        <Link2 className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-400">Evidence sources</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueRefs.map((ref, i) => (
          <button
            key={i}
            onClick={() => onNavigate?.(ref)}
            disabled={!onNavigate}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 text-[#1a1f3a] rounded hover:bg-slate-200 transition-colors disabled:cursor-default"
          >
            {getEvidenceIcon(ref.type)}
            <span>{getEvidenceLabel(ref)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Component to render message content with inline evidence highlighting
export function FormattedContent({
  content,
  references,
  onReferenceClick,
}: {
  content: string;
  references: EvidenceRef[];
  onReferenceClick?: (ref: EvidenceRef) => void;
}) {
  // If no references, just return the content
  if (references.length === 0) {
    return <>{content}</>;
  }

  // Replace evidence references with styled spans
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  const pattern = /\[(Territory|Doc|Synthesis):([^\]]+)\]/g;

  let match;
  let keyIndex = 0;
  while ((match = pattern.exec(content)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add the evidence reference as a styled element
    const ref: EvidenceRef = {
      type: match[1] as 'Territory' | 'Doc' | 'Synthesis',
      value: match[2].trim(),
      original: match[0],
    };

    parts.push(
      <span
        key={keyIndex++}
        className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-slate-100 text-[#1a1f3a] rounded text-xs font-medium cursor-pointer hover:bg-slate-200 transition-colors"
        onClick={() => onReferenceClick?.(ref)}
      >
        {getEvidenceIcon(ref.type)}
        {ref.value}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <>{parts}</>;
}
