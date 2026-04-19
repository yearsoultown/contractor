'use client';

import { EditorContent, Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface PageViewProps {
  editor: Editor | null;
  className?: string;
}

/**
 * Renders the Tiptap editor inside an A4-sized page container.
 * 794px = A4 at 96 DPI. The editor content fills the page with
 * standard document margins (25mm ≈ 95px).
 *
 * Page breaks are rendered via CSS:
 *   .page-break { border-top: 2px dashed #ccc; margin: 40px 0; }
 */
export default function PageView({ editor, className }: PageViewProps) {
  return (
    <div className={cn('flex flex-col items-center bg-gray-200 min-h-screen pt-10 pb-8 px-4', className)}>
      {/* A4 page */}
      <div
        className="w-[794px] bg-white shadow-lg rounded-sm min-h-[1123px] relative"
        style={{
          padding: '95px 95px 95px 95px', // ~25mm margins
        }}
      >
        <style>{`
          /* Page break line in editor */
          .page-break {
            border: none;
            border-top: 2px dashed #9CA3AF;
            margin: 40px -95px;
            position: relative;
          }
          .page-break::before {
            content: "Page break";
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #F9FAFB;
            padding: 0 8px;
            font-size: 11px;
            color: #9CA3AF;
          }

          /* Variable chips */
          .variable-badge {
            display: inline-flex;
            align-items: center;
            border-radius: 4px;
            padding: 1px 6px;
            font-size: 0.875em;
            font-weight: 500;
            cursor: pointer;
            user-select: none;
          }
          .variable-badge--empty {
            background: #DBEAFE;
            color: #1D4ED8;
            border: 1px solid #BFDBFE;
          }
          .variable-badge--filled {
            background: #DCFCE7;
            color: #166534;
            border: 1px solid #BBF7D0;
          }

          /* Table styles */
          .ProseMirror table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }
          .ProseMirror td, .ProseMirror th {
            border: 1px solid #D1D5DB;
            padding: 6px 10px;
            min-width: 40px;
          }
          .ProseMirror th {
            background: #F3F4F6;
            font-weight: 600;
          }
          .ProseMirror .selectedCell {
            background: #EFF6FF;
          }

          /* Task list */
          .ProseMirror ul[data-type="taskList"] {
            list-style: none;
            padding-left: 0;
          }
          .ProseMirror ul[data-type="taskList"] li {
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }
          .ProseMirror ul[data-type="taskList"] li > label {
            margin-top: 3px;
          }

          /* Focus outline */
          .ProseMirror:focus {
            outline: none;
          }

          /* Highlight */
          mark {
            border-radius: 2px;
            padding: 0 2px;
          }
        `}</style>

        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none min-h-[900px]"
        />
      </div>
    </div>
  );
}