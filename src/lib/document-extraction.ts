/**
 * Document text extraction utility.
 *
 * Extracts readable text content from uploaded files so the Strategy Coach
 * can analyse and reference them in conversations.
 */

import JSZip from 'jszip';

// pdf-parse ships as CJS; import dynamically to avoid bundling issues in Edge runtime
async function parsePdf(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  return pdfParse(buffer);
}

const MAX_TEXT_LENGTH = 50_000; // chars – truncate very large documents

export interface ExtractionResult {
  text: string;
  pageCount?: number;
}

/**
 * Extract text content from an uploaded file buffer.
 *
 * @returns ExtractionResult with extracted text, or null if the file type
 *          doesn't support text extraction (e.g. images).
 */
export async function extractTextFromFile(
  buffer: Buffer,
  fileType: string,
  filename: string,
): Promise<ExtractionResult | null> {
  const ext = fileType.toLowerCase().replace(/^\./, '');

  try {
    switch (ext) {
      // ── Plain text formats ──────────────────────────────────────
      case 'txt':
      case 'md':
      case 'rtf':
      case 'csv':
        return { text: truncate(buffer.toString('utf-8')) };

      // ── PDF ─────────────────────────────────────────────────────
      case 'pdf':
        return await extractPdf(buffer);

      // ── Microsoft Word (.docx) ──────────────────────────────────
      case 'docx':
        return await extractDocx(buffer);

      // ── Microsoft Excel (.xlsx) ─────────────────────────────────
      case 'xlsx':
        return await extractXlsx(buffer);

      // ── Microsoft PowerPoint (.pptx) ────────────────────────────
      case 'pptx':
        return await extractPptx(buffer);

      // ── Legacy Office formats (.doc, .xls, .ppt) ────────────────
      case 'doc':
      case 'xls':
      case 'ppt':
        // Binary OLE formats – best-effort raw text extraction
        return extractLegacyOffice(buffer, filename);

      // ── Images – no text extraction ─────────────────────────────
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'webp':
        return null;

      default:
        // Try reading as UTF-8 text as a fallback
        try {
          const text = buffer.toString('utf-8');
          // If the result contains too many replacement characters it's binary
          const replacementRatio =
            (text.match(/\uFFFD/g)?.length ?? 0) / Math.max(text.length, 1);
          if (replacementRatio > 0.1) return null;
          return { text: truncate(text) };
        } catch {
          return null;
        }
    }
  } catch (error) {
    console.error(`[extractTextFromFile] Failed to extract ${filename}:`, error);
    return null;
  }
}

/**
 * Fetch text content from a URL.
 */
export async function extractTextFromUrl(url: string): Promise<ExtractionResult | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FronteraBot/1.0 (Strategic Research)',
        Accept: 'text/html,application/xhtml+xml,application/pdf,text/plain,*/*',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';

    // PDF served over URL
    if (contentType.includes('application/pdf')) {
      const arrayBuffer = await res.arrayBuffer();
      return await extractPdf(Buffer.from(arrayBuffer));
    }

    // HTML page
    if (contentType.includes('text/html') || contentType.includes('application/xhtml')) {
      const html = await res.text();
      return { text: truncate(stripHtml(html)) };
    }

    // Plain text / JSON / XML
    if (
      contentType.includes('text/') ||
      contentType.includes('application/json') ||
      contentType.includes('application/xml')
    ) {
      const text = await res.text();
      return { text: truncate(text) };
    }

    return null;
  } catch (error) {
    console.error(`[extractTextFromUrl] Failed to fetch ${url}:`, error);
    return null;
  }
}

// ── Private helpers ───────────────────────────────────────────────────────

async function extractPdf(buffer: Buffer): Promise<ExtractionResult> {
  const result = await parsePdf(buffer);
  return {
    text: truncate(result.text),
    pageCount: result.numpages,
  };
}

async function extractDocx(buffer: Buffer): Promise<ExtractionResult | null> {
  const zip = await JSZip.loadAsync(buffer);
  const docXml = await zip.file('word/document.xml')?.async('string');
  if (!docXml) return null;

  // Extract text from <w:t> tags
  const textParts: string[] = [];
  const tagRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  let match;
  while ((match = tagRegex.exec(docXml)) !== null) {
    textParts.push(match[1]);
  }

  // Reconstruct paragraphs by detecting <w:p> boundaries
  const paragraphs: string[] = [];
  const paraRegex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  while ((match = paraRegex.exec(docXml)) !== null) {
    const paraText: string[] = [];
    const innerTagRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let innerMatch;
    while ((innerMatch = innerTagRegex.exec(match[0])) !== null) {
      paraText.push(innerMatch[1]);
    }
    if (paraText.length > 0) {
      paragraphs.push(paraText.join(''));
    }
  }

  const text = paragraphs.length > 0 ? paragraphs.join('\n') : textParts.join(' ');
  if (!text.trim()) return null;
  return { text: truncate(text) };
}

async function extractXlsx(buffer: Buffer): Promise<ExtractionResult | null> {
  const zip = await JSZip.loadAsync(buffer);

  // Read shared strings (most cell text lives here)
  const sharedStringsXml = await zip.file('xl/sharedStrings.xml')?.async('string');
  if (!sharedStringsXml) return null;

  const strings: string[] = [];
  const regex = /<t[^>]*>([\s\S]*?)<\/t>/g;
  let match;
  while ((match = regex.exec(sharedStringsXml)) !== null) {
    strings.push(match[1]);
  }

  const text = strings.join('\t');
  if (!text.trim()) return null;
  return { text: truncate(text) };
}

async function extractPptx(buffer: Buffer): Promise<ExtractionResult | null> {
  const zip = await JSZip.loadAsync(buffer);
  const slideTexts: string[] = [];

  // Iterate slide XML files
  const slideFiles = Object.keys(zip.files)
    .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort();

  for (const slideFile of slideFiles) {
    const xml = await zip.file(slideFile)?.async('string');
    if (!xml) continue;

    const texts: string[] = [];
    const regex = /<a:t>([\s\S]*?)<\/a:t>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      texts.push(match[1]);
    }
    if (texts.length > 0) {
      slideTexts.push(texts.join(' '));
    }
  }

  const text = slideTexts.join('\n\n');
  if (!text.trim()) return null;
  return { text: truncate(text), pageCount: slideTexts.length };
}

function extractLegacyOffice(buffer: Buffer, filename: string): ExtractionResult | null {
  // Best-effort: extract printable ASCII/UTF-8 runs from binary OLE files
  const raw = buffer.toString('utf-8');
  // Find runs of printable characters (at least 20 chars long)
  const runs = raw.match(/[\x20-\x7E\u00A0-\uFFFF]{20,}/g);
  if (!runs || runs.length === 0) return null;

  const text = runs.join('\n');
  if (text.length < 50) return null; // too little content to be useful
  return { text: truncate(text) };
}

function stripHtml(html: string): string {
  // Remove script and style blocks
  let clean = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  clean = clean.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove HTML tags
  clean = clean.replace(/<[^>]+>/g, ' ');
  // Decode common entities
  clean = clean.replace(/&amp;/g, '&');
  clean = clean.replace(/&lt;/g, '<');
  clean = clean.replace(/&gt;/g, '>');
  clean = clean.replace(/&quot;/g, '"');
  clean = clean.replace(/&#39;/g, "'");
  clean = clean.replace(/&nbsp;/g, ' ');
  // Collapse whitespace
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean;
}

function truncate(text: string): string {
  if (text.length <= MAX_TEXT_LENGTH) return text;
  return text.slice(0, MAX_TEXT_LENGTH) + '\n\n[Document truncated — showing first 50,000 characters]';
}
