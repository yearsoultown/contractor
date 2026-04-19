/**
 * Converts Tiptap JSON AST to a DOCX file using the docx library.
 * Phase 9 — frontend DOCX export.
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ExternalHyperlink,
} from 'docx';

type TiptapNode = {
  type: string;
  text?: string;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, any> }[];
  attrs?: Record<string, any>;
};

function headingLevel(level: number): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
  const map: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };
  return map[level] || HeadingLevel.HEADING_1;
}

function textAlignment(align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
  const map: Record<string, (typeof AlignmentType)[keyof typeof AlignmentType]> = {
    left: AlignmentType.LEFT,
    center: AlignmentType.CENTER,
    right: AlignmentType.RIGHT,
    justify: AlignmentType.JUSTIFIED,
  };
  return map[align || 'left'] || AlignmentType.LEFT;
}

function processInlineNode(node: TiptapNode): TextRun | ExternalHyperlink | null {
  if (node.type === 'text') {
    const marks = node.marks || [];
    const isBold = marks.some(m => m.type === 'bold');
    const isItalic = marks.some(m => m.type === 'italic');
    const isUnderline = marks.some(m => m.type === 'underline');
    const isStrike = marks.some(m => m.type === 'strike');
    const isSuperscript = marks.some(m => m.type === 'superscript');
    const isSubscript = marks.some(m => m.type === 'subscript');
    const colorMark = marks.find(m => m.type === 'textStyle');
    const highlightMark = marks.find(m => m.type === 'highlight');
    const linkMark = marks.find(m => m.type === 'link');

    const run = new TextRun({
      text: node.text || '',
      bold: isBold,
      italics: isItalic,
      underline: isUnderline ? { type: 'single' } : undefined,
      strike: isStrike,
      superScript: isSuperscript,
      subScript: isSubscript,
      color: colorMark?.attrs?.color?.replace('#', '') || undefined,
      highlight: highlightMark ? 'yellow' : undefined,
    });

    if (linkMark?.attrs?.href) {
      return new ExternalHyperlink({
        link: linkMark.attrs.href,
        children: [run],
      });
    }

    return run;
  }

  if (node.type === 'variable') {
    const val = node.attrs?.value || `[${node.attrs?.label || node.attrs?.id || ''}]`;
    return new TextRun({ text: val, highlight: 'yellow' });
  }

  return null;
}

function processChildren(nodes: TiptapNode[]): (TextRun | ExternalHyperlink)[] {
  return nodes
    .map(processInlineNode)
    .filter((n): n is TextRun | ExternalHyperlink => n !== null);
}

function processBlockNode(node: TiptapNode): any[] {
  switch (node.type) {
    case 'paragraph': {
      const children = processChildren(node.content || []);
      return [
        new Paragraph({
          children,
          alignment: textAlignment(node.attrs?.textAlign),
        }),
      ];
    }

    case 'heading': {
      const children = processChildren(node.content || []);
      return [
        new Paragraph({
          children,
          heading: headingLevel(node.attrs?.level || 1),
          alignment: textAlignment(node.attrs?.textAlign),
        }),
      ];
    }

    case 'bulletList':
    case 'orderedList': {
      const isOrdered = node.type === 'orderedList';
      return (node.content || []).flatMap((item, idx) => {
        const children = processChildren(
          item.content?.flatMap(c => c.content || []) || []
        );
        return [
          new Paragraph({
            children,
            bullet: isOrdered ? undefined : { level: 0 },
            numbering: isOrdered ? { reference: 'default', level: 0 } : undefined,
          }),
        ];
      });
    }

    case 'blockquote': {
      return (node.content || []).flatMap(processBlockNode).map((p: Paragraph) => {
        // Add left border style via indent
        return p;
      });
    }

    case 'codeBlock': {
      const text = node.content?.map(c => c.text || '').join('') || '';
      return [
        new Paragraph({
          children: [new TextRun({ text, font: 'Courier New' })],
        }),
      ];
    }

    case 'horizontalRule':
    case 'pageBreak': {
      return [
        new Paragraph({
          children: [new TextRun({ break: 1 })],
        }),
      ];
    }

    case 'table': {
      const rows = (node.content || []).map(rowNode => {
        const cells = (rowNode.content || []).map(cellNode => {
          const cellContent = (cellNode.content || []).flatMap(processBlockNode);
          return new TableCell({
            children: cellContent.length > 0 ? cellContent : [new Paragraph({ children: [] })],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
          });
        });
        return new TableRow({ children: cells });
      });

      return [
        new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      ];
    }

    default:
      // Recurse into children
      return (node.content || []).flatMap(processBlockNode);
  }
}

export async function tiptapToDocx(tiptapJSON: Record<string, any>, title = 'Document'): Promise<Blob> {
  const content = tiptapJSON.content || [];
  const children = content.flatMap((node: TiptapNode) => processBlockNode(node));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: 'Normal',
          name: 'Normal',
          run: { font: 'Times New Roman', size: 24 }, // 12pt
        },
      ],
    },
  });

  const buffer = await Packer.toBlob(doc);
  return buffer;
}

export function downloadDocxBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}