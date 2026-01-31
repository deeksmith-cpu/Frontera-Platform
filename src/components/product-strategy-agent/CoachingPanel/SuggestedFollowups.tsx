'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SuggestedFollowupsProps {
  phase: string;
  messageContent: string;
  onSelect: (question: string) => void;
}

// Generate follow-up suggestions based on message content and phase
function generateFollowups(phase: string, content: string): string[] {
  const followups: string[] = [];
  const lowerContent = content.toLowerCase();

  // Content-based follow-ups
  if (lowerContent.includes('capability') || lowerContent.includes('competenc')) {
    followups.push("How does this capability compare to competitors?");
  }
  if (lowerContent.includes('customer') || lowerContent.includes('segment')) {
    followups.push("Tell me more about this customer segment");
  }
  if (lowerContent.includes('opportunity') || lowerContent.includes('growth')) {
    followups.push("What evidence supports this opportunity?");
  }
  if (lowerContent.includes('risk') || lowerContent.includes('challenge') || lowerContent.includes('threat')) {
    followups.push("How might we mitigate this risk?");
  }
  if (lowerContent.includes('bet') || lowerContent.includes('hypothesis')) {
    followups.push("What would success look like for this bet?");
  }
  if (lowerContent.includes('market') || lowerContent.includes('industry')) {
    followups.push("What market trends should I watch?");
  }
  if (lowerContent.includes('team') || lowerContent.includes('organization')) {
    followups.push("What capabilities does my team need?");
  }
  if (lowerContent.includes('strength') || lowerContent.includes('advantage')) {
    followups.push("How can we leverage this further?");
  }
  if (lowerContent.includes('weakness') || lowerContent.includes('gap')) {
    followups.push("What are our options to address this?");
  }

  // Phase-specific default prompts if we have few content-based ones
  if (followups.length < 2) {
    switch (phase) {
      case 'discovery':
        followups.push("What else should I share about our context?");
        break;
      case 'research':
        followups.push("What other areas should I explore?");
        followups.push("How does this connect to other territories?");
        break;
      case 'synthesis':
        followups.push("Are there other patterns I should consider?");
        followups.push("What tensions might I be missing?");
        break;
      case 'bets':
      case 'planning':
        followups.push("How should I sequence these initiatives?");
        followups.push("What dependencies should I consider?");
        break;
      default:
        followups.push("Can you elaborate on that?");
    }
  }

  // Return unique follow-ups, max 2
  return [...new Set(followups)].slice(0, 2);
}

export function SuggestedFollowups({ phase, messageContent, onSelect }: SuggestedFollowupsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const followups = useMemo(
    () => generateFollowups(phase, messageContent),
    [phase, messageContent]
  );

  if (followups.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-100">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 mb-2 group"
      >
        <MessageCircle className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
          Continue exploring ({followups.length})
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-400" />
        )}
      </button>
      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {followups.map((followup, i) => (
            <button
              key={i}
              onClick={() => onSelect(followup)}
              className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors text-left hover:border-slate-300 border border-slate-200"
            >
              {followup}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
