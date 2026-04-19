'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Users, Settings, AlertCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { clearAuth, isAdmin } from '@/lib/auth';
import { useTranslation } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SidebarItem } from './SidebarItem';

type ActivePage = 'dashboard' | 'contracts' | 'team' | 'settings' | 'help' | 'admin';

interface SidebarProps {
  user: User | null;
  contractCount: number;
  activePage?: ActivePage;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ user, contractCount, activePage, isOpen = false, onClose }: SidebarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [admin, setAdmin] = useState(false);
  useEffect(() => { setAdmin(isAdmin()); }, []);

  const handleNav = (path: string) => {
    onClose?.();
    router.push(path);
  };

  return (
    <aside
      className={[
        'w-72 bg-white border-r border-slate-200 flex flex-col p-6 z-50 transition-transform duration-300',
        // Mobile: fixed overlay drawer, toggled by isOpen
        'fixed inset-y-0 left-0 md:relative md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold">{t.common.appInitial}</div>
        <span className="font-display font-bold text-xl tracking-tight">{t.common.appName}</span>
      </div>

      <div className="space-y-1 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">
          {t.dashboard.mainMenu}
        </p>
        <SidebarItem
          icon={LayoutDashboard}
          label={t.dashboard.panel}
          active={activePage === 'dashboard'}
          onClick={() => handleNav('/dashboard')}
        />
        <SidebarItem
          icon={FileText}
          label={t.dashboard.myContracts}
          active={activePage === 'contracts'}
          badge={contractCount > 0 ? String(contractCount) : undefined}
          onClick={() => handleNav('/contracts')}
        />
        <SidebarItem
          icon={Users}
          label={t.dashboard.team}
          active={activePage === 'team'}
          onClick={() => handleNav('/team')}
        />
        {admin && (
          <>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">
              {t.admin.pageTitle}
            </p>
            <SidebarItem
              icon={ShieldCheck}
              label={t.admin.pageTitle}
              active={activePage === 'admin'}
              onClick={() => handleNav('/admin')}
            />
          </>
        )}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-10 mb-4">
          {t.dashboard.settingsGroup}
        </p>
        <SidebarItem
          icon={Settings}
          label={t.dashboard.settings}
          active={activePage === 'settings'}
          onClick={() => handleNav('/settings')}
        />
        <SidebarItem
          icon={AlertCircle}
          label={t.dashboard.help}
          active={activePage === 'help'}
          onClick={() => handleNav('/help')}
        />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
        <div className="px-2">
          <LanguageSwitcher variant="dark" direction="up" />
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-slate-500 truncate">
              {user?.role === 'admin' ? t.dashboard.adminRole : t.dashboard.tariffStart}
            </p>
          </div>
          <button
            onClick={() => { clearAuth(); router.push('/login'); }}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}