'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import api from '@/lib/api';
import { AdminTemplate, FieldSchema } from '@/types';
import { VariableNode } from '@/lib/tiptap/VariableNode';
import { VariablePicker } from '@/components/admin/VariablePicker';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Heading3,
  ArrowLeft, Save, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EDITOR_STYLES = `
  .variable-badge {
    display: inline-block;
    background: #dbeafe;
    color: #1d4ed8;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 0.85em;
    font-weight: 600;
    user-select: all;
    cursor: default;
  }
  .ProseMirror { outline: none; min-height: 400px; }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    color: #94a3b8;
    pointer-events: none;
    float: left;
    height: 0;
  }
`;

export default function TemplateEditorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [template, setTemplate] = useState<AdminTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [fields, setFields] = useState<FieldSchema[]>([]);

  const extensions = [
    StarterKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
    VariableNode,
  ];

  const editor = useEditor({
    extensions,
    content: '',
    editorProps: {
      attributes: { class: 'prose prose-slate max-w-none px-8 py-6 focus:outline-none' },
    },
  });

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login');
      return;
    }
    api.get<AdminTemplate>(`/admin/templates/${id}`)
      .then((res) => {
        const tmpl = res.data;
        setTemplate(tmpl);

        const schemaFields =
          tmpl.fields_schema && 'fields' in tmpl.fields_schema
            ? (tmpl.fields_schema as { fields: FieldSchema[] }).fields
            : [];
        setFields(schemaFields);

        if (editor) {
          if (tmpl.content_json) {
            editor.commands.setContent(tmpl.content_json as object);
          }
        }
      })
      .catch(() => router.push('/admin'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  // Set content once editor is ready and template is loaded
  useEffect(() => {
    if (editor && template?.content_json) {
      editor.commands.setContent(template.content_json as object);
    }
  }, [editor, template]);

  const handleSave = useCallback(async () => {
    if (!editor || !template) return;
    setSaving(true);
    try {
      const contentJSON = editor.getJSON();
      await api.patch(`/admin/templates/${id}`, { content_json: contentJSON });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2000);
    } catch {
      // ignore — toast system not available in this standalone page
    } finally {
      setSaving(false);
    }
  }, [editor, template, id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!template || !editor) return null;

  const ToolbarBtn = ({
    active, onClick, title, children,
  }: { active?: boolean; onClick: () => void; title?: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        'p-1.5 rounded-lg transition-colors',
        active ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <style>{EDITOR_STYLES}</style>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={() => router.push('/admin')}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-slate-900 truncate">{template.name_ru}</h1>
          <p className="text-xs text-slate-400 font-mono">{template.type}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
            savedOk
              ? 'bg-emerald-500 text-white'
              : 'bg-brand-blue text-white hover:bg-blue-600',
          )}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {savedOk ? 'Сохранено' : 'Сохранить'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-1 flex-wrap sticky top-[57px] z-30">
        <ToolbarBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Жирный">
          <Bold size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Курсив">
          <Italic size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Подчёркнутый">
          <UnderlineIcon size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Зачёркнутый">
          <Strikethrough size={15} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Заголовок 1">
          <Heading1 size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Заголовок 2">
          <Heading2 size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Заголовок 3">
          <Heading3 size={15} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Выровнять по левому краю">
          <AlignLeft size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="По центру">
          <AlignCenter size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="По правому краю">
          <AlignRight size={15} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <ToolbarBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Маркированный список">
          <List size={15} />
        </ToolbarBtn>
        <ToolbarBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Нумерованный список">
          <ListOrdered size={15} />
        </ToolbarBtn>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <VariablePicker editor={editor} fields={fields} />
      </div>

      {/* Editor area */}
      <div className="flex-1 max-w-[860px] w-full mx-auto my-6 px-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <EditorContent editor={editor} />
        </div>
        {fields.length > 0 && (
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Доступные переменные</p>
            <div className="flex flex-wrap gap-2">
              {fields.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => editor.commands.insertVariable({ id: f.name, label: f.label })}
                  className="variable-badge text-xs cursor-pointer hover:opacity-80 transition-opacity"
                  title={`Вставить: ${f.name}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}