/**
 * Shared paragraph classification for narrative strategy documents.
 * Used by both the UI renderer (NarrativePage.tsx) and PDF generator (export/route.ts).
 */

export type ClassifiedParagraph =
  | { type: 'pull_quote'; text: string }
  | { type: 'subsection_heading'; text: string }
  | { type: 'numbered_item'; number: number; title: string; body: string }
  | { type: 'body'; text: string; isFirst: boolean };

/**
 * Classify a paragraph by its formatting intent.
 *
 * Detection order (first match wins):
 * 1. Pull quote — starts with "
 * 2. Subsection heading — short single line, no trailing period, title-like
 * 3. Numbered item — starts with digit + period/paren (e.g. "1. Title: body...")
 * 4. Body — everything else
 */
export function classifyParagraph(text: string, index: number, isAfterHeading: boolean): ClassifiedParagraph {
  const trimmed = text.trim();

  // 1. Pull quote
  if (trimmed.startsWith('"')) {
    return { type: 'pull_quote', text: trimmed };
  }

  // 2. Subsection heading — short, no trailing sentence punctuation, no multi-sentence content
  if (isSubsectionHeading(trimmed)) {
    return { type: 'subsection_heading', text: trimmed };
  }

  // 3. Numbered item — "1. Title: body..." or "1) Title: body..."
  const numberedMatch = trimmed.match(/^(\d+)[.)]\s+([\s\S]+)/);
  if (numberedMatch) {
    const num = parseInt(numberedMatch[1], 10);
    const rest = numberedMatch[2];

    // Split on first ": " or ". " to separate title from body
    const splitMatch = rest.match(/^([^:.]+(?:\.[A-Z])?[^:.]*?)(?::\s|\.(?:\s|$))([\s\S]*)/);
    if (splitMatch) {
      return {
        type: 'numbered_item',
        number: num,
        title: splitMatch[1].trim(),
        body: splitMatch[2].trim(),
      };
    }

    // No clear title/body split — treat entire text as title
    return {
      type: 'numbered_item',
      number: num,
      title: rest.trim(),
      body: '',
    };
  }

  // 4. Body text
  return { type: 'body', text: trimmed, isFirst: index === 0 || isAfterHeading };
}

function isSubsectionHeading(text: string): boolean {
  // Must be short
  if (text.length > 80) return false;

  // Must be a single line (no internal newlines)
  if (text.includes('\n')) return false;

  // Must NOT end with sentence-ending punctuation (period after a word, not after abbreviation)
  if (/[.!?]$/.test(text)) return false;

  // Must NOT contain multiple sentences (period + space + uppercase letter)
  if (/\.\s+[A-Z]/.test(text)) return false;

  // Must NOT start with a digit (that's a numbered item)
  if (/^\d/.test(text)) return false;

  // Should have at least 2 characters
  if (text.length < 2) return false;

  // Must look title-like: typically 2-8 words, mostly capitalized or title case
  const words = text.split(/\s+/);
  if (words.length > 10) return false;

  return true;
}

/**
 * Classify all paragraphs in a narrative string.
 * Splits on double newlines and classifies each.
 */
export function classifyNarrative(narrative: string): ClassifiedParagraph[] {
  const paragraphs = narrative.split('\n\n').filter(p => p.trim());
  const result: ClassifiedParagraph[] = [];

  let wasHeading = false;

  for (let i = 0; i < paragraphs.length; i++) {
    const classified = classifyParagraph(paragraphs[i], i, wasHeading);
    result.push(classified);
    wasHeading = classified.type === 'subsection_heading';
  }

  return result;
}
