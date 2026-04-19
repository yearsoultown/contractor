'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { FieldSchema } from '@/types';
import { Variable, ChevronDown } from 'lucide-react';

interface VariablePickerProps {
  editor: Editor;
  fields: FieldSchema[];
}

export function VariablePicker({ editor, fields }: VariablePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function insert(field: FieldSchema) {
    editor.commands.insertVariable({ id: field.name, label: field.label });
    editor.commands.focus();
    setOpen(false);
  }

  if (fields.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Variable size={13} />
        Переменная
        <ChevronDown size={12} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[220px] py-1 max-h-64 overflow-y-auto">
          {fields.map((field) => (
            <button
              key={field.name}
              type="button"
              onClick={() => insert(field)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
            >
              <span className="text-sm text-slate-800">{field.label}</span>
              <span className="text-xs font-mono text-slate-400 shrink-0">{field.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}