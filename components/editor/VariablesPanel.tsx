'use client';

import { Editor } from '@tiptap/react';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, X, ChevronsRight } from 'lucide-react';

interface Variable {
  id: string;
  label: string;
  value: string;
}

interface VariablesPanelProps {
  editor: Editor | null;
  open: boolean;
  onClose: () => void;
}

function extractVariables(editor: Editor): Variable[] {
  const vars: Map<string, Variable> = new Map();
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'variable') {
      const { id, label, value } = node.attrs;
      if (!vars.has(id)) {
        vars.set(id, { id, label: label || id, value: value || '' });
      }
    }
  });
  return Array.from(vars.values());
}

export default function VariablesPanel({ editor, open, onClose }: VariablesPanelProps) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor || !open) return;
    const vars = extractVariables(editor);
    setVariables(vars);
    const initial: Record<string, string> = {};
    vars.forEach(v => { initial[v.id] = v.value; });
    setValues(initial);
  }, [editor, open]);

  const handleChange = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const handleApply = (id: string) => {
    if (!editor) return;
    const val = values[id] ?? '';
    editor.chain().focus().setVariableValue(id, val).run();
    setVariables(prev => prev.map(v => v.id === id ? { ...v, value: val } : v));
  };

  const handleApplyAll = () => {
    if (!editor) return;
    Object.entries(values).forEach(([id, val]) => {
      editor.chain().setVariableValue(id, val).run();
    });
    setVariables(prev => prev.map(v => ({ ...v, value: values[v.id] ?? '' })));
  };

  const filled = variables.filter(v => !!(values[v.id] ?? v.value)).length;
  const total = variables.length;
  const progress = total > 0 ? Math.round((filled / total) * 100) : 0;

  if (!open) return null;

  return (
    <div
      className="fixed z-[18] flex flex-col w-64 rounded-2xl bg-white border border-slate-200/80 shadow-2xl shadow-slate-300/30 overflow-hidden"
      style={{
        top: 212,
        // Position to the right of the centered A4 page (794px wide, so half = 397px from center)
        left: 'calc(50% + 414px)',
        maxHeight: 'calc(100vh - 228px)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-3.5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">Variables</span>
            {total > 0 && (
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full tabular-nums">
                {filled}/{total}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: progress === 100 ? '#22c55e' : '#3b82f6',
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {progress === 100 ? '✓ All filled' : `${progress}% complete`}
            </p>
          </div>
        )}
      </div>

      {/* Variable list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1.5">
        {variables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <ChevronsRight className="w-7 h-7 text-slate-200 mb-2" />
            <p className="text-xs text-slate-400">No variables in this document</p>
          </div>
        ) : (
          variables.map(variable => {
            const val = values[variable.id] ?? '';
            const isFilled = !!val;
            return (
              <div
                key={variable.id}
                className={`rounded-xl border px-3 py-2.5 transition-colors ${
                  isFilled
                    ? 'border-green-100 bg-green-50/60'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isFilled ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-300 shrink-0" />
                  )}
                  <span className="text-[11px] font-medium text-slate-700 truncate">
                    {variable.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => handleChange(variable.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApply(variable.id)}
                    placeholder="Enter value…"
                    className="flex-1 min-w-0 px-2 py-1 text-[11px] bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                  />
                  <button
                    onClick={() => handleApply(variable.id)}
                    className="px-2 py-1 text-[11px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                  >
                    Set
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {variables.length > 0 && (
        <div className="p-2.5 border-t border-slate-100">
          <button
            onClick={handleApplyAll}
            className="w-full py-1.5 text-xs font-semibold rounded-xl transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            Apply All
          </button>
          {filled < total && (
            <p className="text-[10px] text-amber-500 mt-1.5 text-center">
              {total - filled} unfilled variable{total - filled !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}