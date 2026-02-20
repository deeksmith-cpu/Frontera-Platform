/**
 * Research Extractor
 *
 * Parses [ResearchCapture:...] and [AreaComplete:...] markers from
 * Strategy Coach assistant messages. Returns clean content for display
 * and structured captures for saving to territory_insights.
 */

export interface ResearchCapture {
  territory: 'company' | 'customer' | 'competitor';
  areaId: string;
  questionIndex: number;
  answer: string;
}

export interface AreaCompletion {
  territory: 'company' | 'customer' | 'competitor';
  areaId: string;
}

export interface ExtractionResult {
  /** Message content with all markers stripped */
  cleanContent: string;
  /** Extracted research captures */
  captures: ResearchCapture[];
  /** Completed research areas */
  areaCompletions: AreaCompletion[];
  /** Whether any captures or completions were found */
  hasExtractions: boolean;
}

// [ResearchCapture:territory:area_id:questionIndex:answer text]
const CAPTURE_REGEX = /\[ResearchCapture:(\w+):(\w+):(\d+):([^\]]+)\]/g;

// [AreaComplete:territory:area_id]
const AREA_COMPLETE_REGEX = /\[AreaComplete:(\w+):(\w+)\]/g;

const VALID_TERRITORIES = new Set(['company', 'customer', 'competitor']);

/**
 * Extract research captures and area completions from assistant message content.
 */
export function extractResearchMarkers(content: string): ExtractionResult {
  const captures: ResearchCapture[] = [];
  const areaCompletions: AreaCompletion[] = [];

  // Extract captures
  let match: RegExpExecArray | null;
  const captureRegex = new RegExp(CAPTURE_REGEX.source, 'g');
  while ((match = captureRegex.exec(content)) !== null) {
    const [, territory, areaId, indexStr, answer] = match;
    if (VALID_TERRITORIES.has(territory)) {
      captures.push({
        territory: territory as ResearchCapture['territory'],
        areaId,
        questionIndex: parseInt(indexStr, 10),
        answer: answer.trim(),
      });
    }
  }

  // Extract area completions
  const completeRegex = new RegExp(AREA_COMPLETE_REGEX.source, 'g');
  while ((match = completeRegex.exec(content)) !== null) {
    const [, territory, areaId] = match;
    if (VALID_TERRITORIES.has(territory)) {
      areaCompletions.push({
        territory: territory as AreaCompletion['territory'],
        areaId,
      });
    }
  }

  // Strip all markers from display content
  const cleanContent = content
    .replace(new RegExp(CAPTURE_REGEX.source, 'g'), '')
    .replace(new RegExp(AREA_COMPLETE_REGEX.source, 'g'), '')
    .replace(/\n{3,}/g, '\n\n') // Collapse excess newlines from removed markers
    .trim();

  return {
    cleanContent,
    captures,
    areaCompletions,
    hasExtractions: captures.length > 0 || areaCompletions.length > 0,
  };
}

/**
 * Strip research markers from content for display purposes only.
 * Lighter-weight than full extraction when you don't need the parsed data.
 */
export function stripResearchMarkers(content: string): string {
  return content
    .replace(new RegExp(CAPTURE_REGEX.source, 'g'), '')
    .replace(new RegExp(AREA_COMPLETE_REGEX.source, 'g'), '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
