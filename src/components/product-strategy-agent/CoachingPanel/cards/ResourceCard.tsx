'use client';

import { BookOpen, Headphones, FileText, Layers, Video } from 'lucide-react';
import type { ResourceLink, ResourceType } from '@/types/coaching-cards';

interface ResourceCardProps {
  resource: ResourceLink;
}

const RESOURCE_ICON: Record<ResourceType, typeof BookOpen> = {
  book: BookOpen,
  podcast: Headphones,
  article: FileText,
  framework: Layers,
  video: Video,
};

const RESOURCE_STYLE: Record<ResourceType, { bg: string; text: string; border: string }> = {
  book: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  podcast: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  article: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  framework: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  video: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

/**
 * ResourceCard — Displays a linked resource (podcast, article, book, framework, video)
 * within the CoachReviewPanel.
 */
export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = RESOURCE_ICON[resource.type] || FileText;
  const style = RESOURCE_STYLE[resource.type] || RESOURCE_STYLE.article;

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-3 transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text}`}>
              {resource.type}
            </span>
            {resource.author && (
              <>
                <span className="text-xs text-slate-300">&middot;</span>
                <span className="text-xs text-slate-500">{resource.author}</span>
              </>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
            {resource.title}
          </p>
          {resource.source && (
            <p className="text-xs text-slate-500 mt-0.5">{resource.source}</p>
          )}
          {resource.relevance && (
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {resource.relevance}
            </p>
          )}
          {resource.keyInsight && (
            <p className="text-xs text-slate-500 mt-1.5 italic leading-relaxed border-l-2 border-slate-200 pl-2">
              &ldquo;{resource.keyInsight}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
