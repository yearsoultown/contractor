'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, getUser } from '@/lib/auth';
import { User } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import { AdminContractsTab } from '@/components/admin/AdminContractsTab';
import { AdminTemplatesTab } from '@/components/admin/AdminTemplatesTab';
import { AdminFunnelTab } from '@/components/admin/AdminFunnelTab';
import { Users, FileText, LayoutTemplate, ShieldAlert, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'users' | 'contracts' | 'templates' | 'funnel';

export default function AdminPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    setUser(getUser());
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">{t.admin.loading}</div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'users', label: t.admin.tabUsers, icon: Users },
    { id: 'contracts', label: t.admin.tabContracts, icon: FileText },
    { id: 'templates', label: t.admin.tabTemplates, icon: LayoutTemplate },
    { id: 'funnel', label: t.admin.tabFunnel ?? 'Воронка', icon: TrendingUp },
  ];

  return (
    <DashboardShell
      user={user}
      contractCount={0}
      activePage="admin"
      search=""
      onSearchChange={() => {}}
      onNewContract={() => {}}
    >
      {/* Admin header */}
      <div className="-mx-4 md:-mx-10 -mt-4 md:-mt-10 mb-6 bg-white border-b border-slate-200 px-4 md:px-10 pt-8 pb-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">
              {t.admin.pageTitle}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === id
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300',
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'contracts' && <AdminContractsTab />}
        {activeTab === 'templates' && <AdminTemplatesTab />}
        {activeTab === 'funnel' && <AdminFunnelTab />}
      </div>
    </DashboardShell>
  );
}
