'use client';

import { useState, useRef } from 'react';
import { FieldSchema } from '@/types';

const INPUT_CLASS =
  'w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all';

interface FormFieldProps {
  field: FieldSchema;
  value: string;
  onChange: (value: string) => void;
  suggestion?: string | null;
}

export function FormField({ field, value, onChange, suggestion }: FormFieldProps) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSuggestion = !!suggestion && suggestion !== value;

  const handleFocus = () => {
    if (hasSuggestion) setShowSuggestion(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestion(false), 150);
  };

  const handleAccept = () => {
    if (suggestion) {
      onChange(suggestion);
      setShowSuggestion(false);
    }
  };

  if (field.type === 'textarea') {
    return (
      <textarea
        required={field.required}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT_CLASS}
      />
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type={field.type}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={INPUT_CLASS}
        autoComplete="off"
      />
      {showSuggestion && hasSuggestion && (
        <button
          type="button"
          onMouseDown={handleAccept}
          className="absolute left-0 right-0 top-full mt-1 z-10 flex items-center gap-2 px-4 py-2.5 bg-white border border-brand-blue/30 rounded-xl shadow-lg text-sm text-slate-700 hover:bg-brand-soft-blue transition-colors"
        >
          <span className="text-brand-blue font-medium text-xs uppercase tracking-wide shrink-0">↩</span>
          <span className="truncate">{suggestion}</span>
        </button>
      )}
    </div>
  );
}