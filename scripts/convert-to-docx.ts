/**
 * Convert UAT_FEEDBACK_CONSOLIDATED.md to Word document
 * Usage: npx tsx scripts/convert-to-docx.ts
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  CheckBox,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

const inputFile = path.resolve(process.cwd(), 'UAT_FEEDBACK_CONSOLIDATED.md');
const outputFile = path.resolve(process.cwd(), 'UAT_FEEDBACK_CONSOLIDATED.docx');

// Read markdown content
const markdown = fs.readFileSync(inputFile, 'utf-8');

// Parse markdown and create document
function createDocument(): Document {
  const children: (Paragraph | Table)[] = [];

  // Split into lines
  const lines = markdown.split('\n');
  let i = 0;
  let inTable = false;
  let tableRows: string[][] = [];
  let inCodeBlock = false;

  while (i < lines.length) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock && tableRows.length === 0) {
        // End of code block - add empty paragraph
        children.push(new Paragraph({ spacing: { after: 100 } }));
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      // Code block content - add as plain text with monospace feel
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line || ' ',
              font: 'Consolas',
              size: 20,
            }),
          ],
          spacing: { after: 0 },
          indent: { left: 720 },
        })
      );
      i++;
      continue;
    }

    // Handle tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }

      // Skip separator lines
      if (line.includes('---')) {
        i++;
        continue;
      }

      // Parse table row
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());
      tableRows.push(cells);
      i++;
      continue;
    } else if (inTable) {
      // End of table
      inTable = false;
      if (tableRows.length > 0) {
        children.push(createTable(tableRows));
        children.push(new Paragraph({ spacing: { after: 200 } }));
        tableRows = [];
      }
    }

    // Handle headings
    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 250, after: 100 },
        })
      );
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.substring(5),
              bold: true,
              size: 24,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );
      i++;
      continue;
    }

    // Handle horizontal rules
    if (line.startsWith('---')) {
      children.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
          },
          spacing: { before: 200, after: 200 },
        })
      );
      i++;
      continue;
    }

    // Handle checkboxes
    if (line.startsWith('- [ ]') || line.startsWith('- [x]')) {
      const isChecked = line.startsWith('- [x]');
      const text = line.substring(6).trim();
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: isChecked ? '☑ ' : '☐ ', size: 22 }),
            new TextRun({ text, size: 22 }),
          ],
          spacing: { after: 50 },
          indent: { left: 360 },
        })
      );
      i++;
      continue;
    }

    // Handle bullet points
    if (line.startsWith('- ')) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '• ' + line.substring(2), size: 22 })],
          spacing: { after: 50 },
          indent: { left: 360 },
        })
      );
      i++;
      continue;
    }

    // Handle numbered lists
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: numberedMatch[1] + '. ' + numberedMatch[2], size: 22 }),
          ],
          spacing: { after: 50 },
          indent: { left: 360 },
        })
      );
      i++;
      continue;
    }

    // Handle bold text in paragraphs
    if (line.trim()) {
      const runs: TextRun[] = [];
      let remaining = line;

      // Parse bold and regular text
      const boldRegex = /\*\*([^*]+)\*\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
          runs.push(
            new TextRun({
              text: line.substring(lastIndex, match.index),
              size: 22,
            })
          );
        }
        // Add bold text
        runs.push(
          new TextRun({
            text: match[1],
            bold: true,
            size: 22,
          })
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        runs.push(
          new TextRun({
            text: line.substring(lastIndex),
            size: 22,
          })
        );
      }

      if (runs.length === 0) {
        runs.push(new TextRun({ text: line, size: 22 }));
      }

      children.push(
        new Paragraph({
          children: runs,
          spacing: { after: 100 },
        })
      );
    } else {
      // Empty line
      children.push(new Paragraph({ spacing: { after: 100 } }));
    }

    i++;
  }

  // Handle any remaining table
  if (tableRows.length > 0) {
    children.push(createTable(tableRows));
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });
}

function createTable(rows: string[][]): Table {
  const tableRows = rows.map((row, rowIndex) => {
    return new TableRow({
      children: row.map((cell) => {
        return new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cell,
                  bold: rowIndex === 0, // Bold header row
                  size: 20,
                }),
              ],
            }),
          ],
          width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
        });
      }),
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

async function main() {
  console.log('Converting UAT_FEEDBACK_CONSOLIDATED.md to Word document...');
  console.log(`Input: ${inputFile}`);
  console.log(`Output: ${outputFile}`);

  const doc = createDocument();
  const buffer = await Packer.toBuffer(doc);

  fs.writeFileSync(outputFile, buffer);

  console.log('\nConversion complete!');
  console.log(`Word document saved to: ${outputFile}`);
}

main().catch(console.error);
