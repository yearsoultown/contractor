'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface PageHeaderProps {
  title: string;
  backLabel: string;
  onBack: () => void;
  children?: React.ReactNode;
}

export function PageHeader({ title, backLabel, onBack, children }: PageHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the overflow menu when the user clicks outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div id="page-header-strip" className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-slate-200 px-4 md:px-8 py-3 md:py-4 flex items-center gap-3">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium shrink-0"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">{backLabel}</span>
      </button>

      <div className="h-4 w-px bg-slate-200 shrink-0" />

      {/* Logo + title */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-6 h-6 bg-brand-blue rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0">
          C
        </div>
        <span className="font-display font-bold text-slate-900 truncate text-sm md:text-base">{title}</span>
      </div>

      {/* Desktop: action buttons + language switcher */}
      <div className="ml-auto hidden md:flex items-center gap-3">
        {children}
        <LanguageSwitcher variant="dark" />
      </div>

      {/* Mobile: language switcher + overflow menu */}
      <div className="ml-auto flex md:hidden items-center gap-2">
        <LanguageSwitcher variant="dark" />

        {children && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Действия"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-2 flex flex-col gap-1 min-w-[200px] z-30 animate-scaleIn origin-top-right"
                onClick={() => setMenuOpen(false)}
              >
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}