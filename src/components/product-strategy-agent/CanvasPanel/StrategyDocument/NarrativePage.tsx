'use client';

import { classifyNarrative, type ClassifiedParagraph } from '@/lib/utils/narrative-parser';

interface NarrativePageProps {
  title: string;
  pageNumber: number;
  narrative: string;
  secondaryTitle?: string;
  secondaryNarrative?: string;
}

function renderClassifiedParagraph(paragraph: ClassifiedParagraph, idx: number) {
  switch (paragraph.type) {
    case 'pull_quote':
      return (
        <blockquote
          key={idx}
          className="border-l-3 border-[#fbbf24] pl-5 italic text-slate-600 my-6 text-lg leading-[1.75]"
        >
          {paragraph.text}
        </blockquote>
      );

    case 'subsection_heading':
      return (
        <h4
          key={idx}
          className="text-xl font-bold text-[#1a1f3a] mt-8 mb-3 pb-2 border-b border-slate-200/60"
        >
          {paragraph.text}
        </h4>
      );

    case 'numbered_item':
      return (
        <div key={idx} className="flex items-start gap-3 mb-4 ml-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1a1f3a] text-[#fbbf24] text-sm font-bold flex items-center justify-center mt-0.5">
            {paragraph.number}
          </span>
          <div>
            <span className="font-bold text-[#1a1f3a] text-[16.5px]">
              {paragraph.title}
              {paragraph.body ? ': ' : ''}
            </span>
            {paragraph.body && (
              <span className="text-slate-700 text-[16.5px] leading-[1.75]">
                {paragraph.body}
              </span>
            )}
          </div>
        </div>
      );

    case 'body':
      return (
        <p
          key={idx}
          className={`text-[16.5px] text-slate-700 leading-[1.75] mb-5 last:mb-0 ${
            paragraph.isFirst
              ? 'first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:text-[#1a1f3a] first-letter:leading-none first-letter:mr-2 first-letter:mt-1'
              : 'indent-6'
          }`}
        >
          {paragraph.text}
        </p>
      );
  }
}

export function NarrativePage({
  title,
  pageNumber,
  narrative,
  secondaryTitle,
  secondaryNarrative,
}: NarrativePageProps) {
  const classified = classifyNarrative(narrative);

  return (
    <section role="article" lang="en" className="max-w-[680px] mx-auto animate-entrance">
      {/* Page number + title */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Page {pageNumber}
        </span>
        <h3 className="text-2xl font-bold text-[#1a1f3a] mt-1 pb-3 border-b-2 border-[#fbbf24]/40">
          {title}
        </h3>
      </div>

      {/* Primary narrative */}
      <div className="prose-section">
        {classified.map((paragraph, idx) => renderClassifiedParagraph(paragraph, idx))}
      </div>

      {/* Optional secondary section */}
      {secondaryTitle && secondaryNarrative && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-[#1a1f3a] mb-4 pb-2 border-b border-slate-200">
            {secondaryTitle}
          </h4>
          {classifyNarrative(secondaryNarrative).map((paragraph, idx) =>
            renderClassifiedParagraph(paragraph, idx)
          )}
        </div>
      )}
    </section>
  );
}
