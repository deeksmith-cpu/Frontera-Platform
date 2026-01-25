import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, convertInchesToTwip } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the markdown file
const markdownPath = path.join(__dirname, '..', 'ENTERPRISE_SECURITY_ARCHITECTURE.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

// Parse markdown and convert to docx elements
function parseMarkdownToDocx(markdown) {
  const lines = markdown.split('\n');
  const docElements = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeText = codeBlockContent.join('\n');
        docElements.push(
          new Paragraph({
            text: codeText,
            spacing: { before: 200, after: 200 },
            style: 'CodeBlock',
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

    // Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
        // Skip the separator line
        i++;
        continue;
      } else {
        const cells = line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
        tableRows.push(cells);
        continue;
      }
    } else if (inTable) {
      // End table
      docElements.push(createTable(tableHeaders, tableRows));
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    // Headings
    if (line.startsWith('# ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
    } else if (line.startsWith('## ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        })
      );
    } else if (line.startsWith('### ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (line.startsWith('#### ')) {
      docElements.push(
        new Paragraph({
          text: line.substring(5),
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 75 },
        })
      );
    } else if (line.startsWith('---')) {
      // Horizontal rule - page break
      docElements.push(
        new Paragraph({
          text: '',
          spacing: { before: 200, after: 200 },
          border: {
            bottom: {
              color: 'CCCCCC',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
    } else if (line.trim() === '') {
      // Empty line
      docElements.push(new Paragraph({ text: '' }));
    } else {
      // Regular paragraph - parse inline formatting
      docElements.push(parseParagraph(line));
    }
  }

  // Close any open table
  if (inTable) {
    docElements.push(createTable(tableHeaders, tableRows));
  }

  return docElements;
}

function parseParagraph(text) {
  const runs = [];
  let currentText = '';
  let isBold = false;
  let isItalic = false;
  let isCode = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    const prevChar = text[i - 1];

    // Bold **text**
    if (char === '*' && nextChar === '*' && !isCode) {
      if (currentText) {
        runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
        currentText = '';
      }
      isBold = !isBold;
      i++; // Skip next *
      continue;
    }

    // Italic *text* (but not part of **)
    if (char === '*' && nextChar !== '*' && prevChar !== '*' && !isCode) {
      if (currentText) {
        runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
        currentText = '';
      }
      isItalic = !isItalic;
      continue;
    }

    // Inline code `text`
    if (char === '`' && !isBold && !isItalic) {
      if (currentText) {
        runs.push(new TextRun({ text: currentText, bold: isBold, italics: isItalic }));
        currentText = '';
      }
      isCode = !isCode;
      continue;
    }

    currentText += char;
  }

  if (currentText) {
    runs.push(new TextRun({
      text: currentText,
      bold: isBold,
      italics: isItalic,
      font: isCode ? 'Courier New' : undefined,
    }));
  }

  // Check if it's a list item
  if (text.trim().startsWith('- ') || text.trim().startsWith('* ')) {
    return new Paragraph({
      children: runs,
      bullet: { level: 0 },
      spacing: { before: 50, after: 50 },
    });
  } else if (/^\d+\.\s/.test(text.trim())) {
    return new Paragraph({
      children: runs,
      numbering: { reference: 'default-numbering', level: 0 },
      spacing: { before: 50, after: 50 },
    });
  }

  return new Paragraph({
    children: runs,
    spacing: { before: 100, after: 100 },
  });
}

function createTable(headers, rows) {
  const tableRows = [
    // Header row
    new TableRow({
      children: headers.map(
        (header) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: header, bold: true })],
              }),
            ],
            shading: { fill: 'E5E7EB' },
          })
      ),
      tableHeader: true,
    }),
    // Data rows
    ...rows.map(
      (row) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                children: [new Paragraph({ text: cell })],
              })
          ),
        })
    ),
  ];

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    margins: {
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
}

// Create document
const doc = new Document({
  creator: 'Frontera Platform',
  title: 'Enterprise Security & Architecture Overview',
  description: 'Comprehensive security and architecture documentation for enterprise clients',
  styles: {
    paragraphStyles: [
      {
        id: 'CodeBlock',
        name: 'Code Block',
        basedOn: 'Normal',
        run: {
          font: 'Courier New',
          size: 20,
        },
        paragraph: {
          spacing: { before: 200, after: 200 },
          indent: { left: convertInchesToTwip(0.5) },
        },
      },
    ],
  },
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
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: parseMarkdownToDocx(markdownContent),
    },
  ],
});

// Generate Word document
const outputPath = path.join(__dirname, '..', 'ENTERPRISE_SECURITY_ARCHITECTURE.docx');

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log('✅ Word document generated successfully!');
  console.log(`📄 Location: ${outputPath}`);
  console.log(`📊 Size: ${(buffer.length / 1024).toFixed(2)} KB`);
});
