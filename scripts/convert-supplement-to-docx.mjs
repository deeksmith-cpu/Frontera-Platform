import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the markdown file
const mdPath = join(__dirname, '..', 'DESIGN_REVIEW_SUPPLEMENT_MOCKUPS_AND_FRAMEWORKS.md');
const mdContent = readFileSync(mdPath, 'utf-8');

// Parse markdown and convert to docx elements
function parseMarkdownToDocx(markdown) {
  const lines = markdown.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBlockContent.join('\n'),
                font: 'Courier New',
                size: 20,
              }),
            ],
            spacing: { before: 200, after: 200 },
            shading: { fill: 'F5F5F5' },
          })
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }

      // Skip separator rows
      if (line.includes('---')) {
        continue;
      }

      const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      // End of table
      if (tableRows.length > 0) {
        const tableElement = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows.map((cells, rowIndex) =>
            new TableRow({
              children: cells.map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: cell,
                            bold: rowIndex === 0,
                            size: 20,
                          }),
                        ],
                      }),
                    ],
                    shading: rowIndex === 0 ? { fill: 'E5E7EB' } : undefined,
                  })
              ),
            })
          ),
        });
        elements.push(tableElement);
        elements.push(new Paragraph({ text: '' })); // Spacing
      }
      inTable = false;
      tableRows = [];
    }

    // Handle headings
    if (line.startsWith('# ')) {
      elements.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        new Paragraph({
          text: line.substring(5),
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 75 },
        })
      );
    }
    // Handle bold + italic patterns
    else if (line.trim().startsWith('**') && line.trim().includes('**:')) {
      // Pattern: **Label**: Value
      const match = line.match(/\*\*(.+?)\*\*:\s*(.+)/);
      if (match) {
        elements.push(
          new Paragraph({
            children: [
              new TextRun({ text: match[1] + ': ', bold: true, size: 22 }),
              new TextRun({ text: match[2], size: 22 }),
            ],
            spacing: { after: 100 },
          })
        );
      } else {
        elements.push(new Paragraph({ text: line.replace(/\*\*/g, ''), spacing: { after: 100 } }));
      }
    }
    // Handle bullet points
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const text = line.trim().substring(2);
      elements.push(
        new Paragraph({
          text: cleanMarkdown(text),
          bullet: { level: 0 },
          spacing: { after: 50 },
        })
      );
    }
    // Handle numbered lists
    else if (line.trim().match(/^\d+\.\s/)) {
      const text = line.trim().replace(/^\d+\.\s/, '');
      elements.push(
        new Paragraph({
          text: cleanMarkdown(text),
          numbering: { reference: 'default-numbering', level: 0 },
          spacing: { after: 50 },
        })
      );
    }
    // Handle checkboxes
    else if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]') || line.trim().startsWith('- [✓]')) {
      const checked = line.includes('[x]') || line.includes('[✓]');
      const text = line.trim().replace(/^- \[.\]\s*/, '');
      elements.push(
        new Paragraph({
          children: [
            new TextRun({ text: checked ? '☑ ' : '☐ ', size: 22 }),
            new TextRun({ text: cleanMarkdown(text), size: 22 }),
          ],
          spacing: { after: 50 },
        })
      );
    }
    // Handle horizontal rules
    else if (line.trim() === '---' || line.trim() === '___') {
      elements.push(
        new Paragraph({
          text: '',
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
          },
          spacing: { before: 200, after: 200 },
        })
      );
    }
    // Regular paragraphs
    else if (line.trim()) {
      elements.push(
        new Paragraph({
          text: cleanMarkdown(line),
          spacing: { after: 100 },
        })
      );
    }
    // Empty lines (spacing)
    else {
      elements.push(new Paragraph({ text: '' }));
    }
  }

  return elements;
}

// Clean markdown formatting from text
function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1')     // Remove italic
    .replace(/`(.+?)`/g, '$1')       // Remove inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/~~(.+?)~~/g, '$1');    // Remove strikethrough
}

// Create document
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'default-numbering',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {},
      children: parseMarkdownToDocx(mdContent),
    },
  ],
});

// Write to file
const outputPath = join(__dirname, '..', 'DESIGN_REVIEW_SUPPLEMENT_MOCKUPS_AND_FRAMEWORKS.docx');

Packer.toBuffer(doc).then((buffer) => {
  writeFileSync(outputPath, buffer);
  console.log('✓ Design Review Supplement document created successfully:', outputPath);
  console.log('✓ You can now open this file in Microsoft Word');
});
