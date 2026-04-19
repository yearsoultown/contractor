'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, ListChecks,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo,
  Table, Image, Link, Minus,
  Superscript, Subscript,
  Highlighter, Type,
  IndentIncrease, IndentDecrease,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useState } from 'react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: (file: File) => Promise<string>;
}

function FBtn({
  onClick, active, disabled, title, children
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={cn(
        'w-7 h-7 rounded flex items-center justify-center transition-all duration-100 text-sm shrink-0',
        active ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-white/80 hover:text-slate-800',
        disabled && 'opacity-25 pointer-events-none'
      )}
    >
      {children}
    </button>
  );
}

/** A bento card that groups related toolbar buttons */
function Group({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg px-1.5 py-1 shrink-0">
      {children}
    </div>
  );
}

function ColorPicker({ label, onColorChange, currentColor }: {
  label: string; onColorChange: (color: string) => void; currentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#10B981',
    '#1D4ED8', '#7C3AED', '#DB2777', '#0D9488', '#D97706',
  ];

  return (
    <div className="relative">
      <button
        onMouseDown={(e) => { e.preventDefault(); setOpen(!open); }}
        title={label}
        className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-white/80 transition-all relative"
      >
        <Type size={13} />
        <div
          className="w-4 h-1 rounded absolute bottom-1"
          style={{ backgroundColor: currentColor || '#000' }}
        />
      </button>
      {open && (
        <div className="absolute top-9 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-2 grid grid-cols-5 gap-1 w-32">
          {colors.map(c => (
            <button
              key={c}
              className="w-5 h-5 rounded cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              onMouseDown={(e) => { e.preventDefault(); onColorChange(c); setOpen(false); }}
            />
          ))}
          <button
            className="col-span-5 text-xs text-gray-500 hover:text-gray-700 mt-1"
            onMouseDown={(e) => { e.preventDefault(); onColorChange(''); setOpen(false); }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

const FONTS = ['Default', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'];

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    setUploading(true);
    try {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL:', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    }
  };

  const handleTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="inline-flex bg-white border border-slate-200 rounded-xl shadow-md px-3 py-2">
      <div className="flex items-center gap-1.5">

        {/* Undo / Redo */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (⌘Z)">
            <Undo size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (⌘⇧Z)">
            <Redo size={13} />
          </FBtn>
        </Group>

        {/* Font family */}
        <Group>
          <select
            className="h-6 text-xs border-0 bg-transparent rounded px-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={editor.getAttributes('textStyle').fontFamily || 'Default'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Default') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(val).run();
              }
            }}
          >
            {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Group>

        {/* Text style */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
            <Bold size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
            <Italic size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
            <UnderlineIcon size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript">
            <Superscript size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript">
            <Subscript size={13} />
          </FBtn>
        </Group>

        {/* Color & highlight */}
        <Group>
          <ColorPicker
            label="Text color"
            currentColor={editor.getAttributes('textStyle').color}
            onColorChange={(color) => {
              if (!color) editor.chain().focus().unsetColor().run();
              else editor.chain().focus().setColor(color).run();
            }}
          />
          <FBtn
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
            active={editor.isActive('highlight')}
            title="Highlight"
          >
            <Highlighter size={13} />
          </FBtn>
        </Group>

        {/* Headings */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
            <Heading1 size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading2 size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
            <Heading3 size={13} />
          </FBtn>
        </Group>

        {/* Lists */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
            <List size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
            <ListOrdered size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task list">
            <ListChecks size={13} />
          </FBtn>
        </Group>

        {/* Alignment */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
            <AlignLeft size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
            <AlignCenter size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
            <AlignRight size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify size={13} />
          </FBtn>
        </Group>

        {/* Indent */}
        <Group>
          <FBtn onClick={() => editor.chain().focus().outdent().run()} title="Outdent">
            <IndentDecrease size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().indent().run()} title="Indent">
            <IndentIncrease size={13} />
          </FBtn>
        </Group>

        {/* Insert */}
        <Group>
          <FBtn onClick={handleTable} active={editor.isActive('table')} title="Insert table">
            <Table size={13} />
          </FBtn>
          <FBtn onClick={handleImageClick} disabled={uploading} title="Insert image">
            <Image size={13} />
          </FBtn>
          <FBtn onClick={handleLink} active={editor.isActive('link')} title="Insert/edit link">
            <Link size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
            <Minus size={13} />
          </FBtn>
          <FBtn onClick={() => editor.chain().focus().insertPageBreak().run()} title="Page break">
            <FileText size={13} />
          </FBtn>
        </Group>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}