'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import { Lang } from '@/lib/i18n';

const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'kz', label: 'Қазақша', short: 'ҚЗ' },
  { code: 'en', label: 'English', short: 'EN' },
];

interface Props {
  /** 'light' = for dark backgrounds (dashboard), 'dark' = for white backgrounds (landing) */
  variant?: 'light' | 'dark';
  /** 'down' = dropdown opens below (default), 'up' = opens above */
  direction?: 'down' | 'up';
}

export default function LanguageSwitcher({ variant = 'dark', direction = 'down' }: Props) {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
          isDark
            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        )}
      >
        <Languages size={15} />
        <span>{current.short}</span>
        <ChevronDown size={13} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className={cn(
          'absolute left-0 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-black/8 overflow-hidden z-50 min-w-[140px]',
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        )}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={cn(
                'w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between transition-colors',
                l.code === lang
                  ? 'bg-brand-soft-blue text-brand-blue font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span>{l.label}</span>
              <span className="text-[10px] font-bold text-slate-400 ml-3">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}