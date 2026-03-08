'use client';

interface NarrativePageProps {
  title: string;
  pageNumber: number;
  narrative: string;
  secondaryTitle?: string;
  secondaryNarrative?: string;
}

function renderParagraph(text: string, isFirst: boolean) {
  const trimmed = text.trim();
  const isPullQuote = trimmed.startsWith('"');

  if (isPullQuote) {
    return (
      <blockquote className="border-l-3 border-[#fbbf24] pl-5 italic text-slate-600 my-6 text-lg leading-[1.75]">
        {trimmed}
      </blockquote>
    );
  }

  return (
    <p
      className={`text-[16.5px] text-slate-700 leading-[1.75] mb-5 last:mb-0 ${
        isFirst
          ? 'first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:text-[#1a1f3a] first-letter:leading-none first-letter:mr-2 first-letter:mt-1'
          : 'indent-6'
      }`}
    >
      {trimmed}
    </p>
  );
}

export function NarrativePage({
  title,
  pageNumber,
  narrative,
  secondaryTitle,
  secondaryNarrative,
}: NarrativePageProps) {
  const paragraphs = narrative.split('\n\n').filter(p => p.trim());

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
        {paragraphs.map((paragraph, idx) => (
          <div key={idx}>
            {renderParagraph(paragraph, idx === 0)}
          </div>
        ))}
      </div>

      {/* Optional secondary section */}
      {secondaryTitle && secondaryNarrative && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-[#1a1f3a] mb-4 pb-2 border-b border-slate-200">
            {secondaryTitle}
          </h4>
          {secondaryNarrative.split('\n\n').filter(p => p.trim()).map((paragraph, idx) => (
            <div key={idx}>
              {renderParagraph(paragraph, idx === 0)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
