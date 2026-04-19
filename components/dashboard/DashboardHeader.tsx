'use client';

import { Bell, Menu, Plus, Search } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface DashboardHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  onNewContract: () => void;
  onMenuToggle: () => void;
}

export function DashboardHeader({ search, onSearchChange, onNewContract, onMenuToggle }: DashboardHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-10">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Search — desktop only */}
      <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.dashboard.searchPlaceholder}
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <Bell size={20} />
        </button>
        <button
          onClick={onNewContract}
          className="bg-brand-blue text-white px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-brand-blue/10"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">{t.dashboard.newContract}</span>
        </button>
      </div>
    </header>
  );
}