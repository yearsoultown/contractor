'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import api from '@/lib/api';
import { clearAuth, getUser, isAuthenticated, downloadPDF } from '@/lib/auth';
import { Contract, User } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { ContractsTable } from '@/components/dashboard/ContractsTable';
import { QuickActions } from '@/components/dashboard/QuickActions';

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const prefersReduced = useReducedMotion();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    setUser(getUser());
    // Set client-side only to avoid SSR hydration mismatch
    setGreeting(t.dashboard.greetingTime[getTimeOfDay()]);
  }, [router, t]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchContracts = useCallback(() => {
    setLoading(true);
    const params = debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : '';
    api.get<Contract[]>(`/contracts${params}`)
      .then((res) => setContracts(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    fetchContracts();
  }, [fetchContracts]);

  const handleDelete = async (id: string) => {
    toast.confirm(
      t.toast.deleteConfirmTitle,
      t.toast.deleteConfirmMessage,
      async () => {
        try {
          await api.delete(`/contracts/${id}`);
          setContracts((prev) => prev.filter((c) => c.id !== id));
          toast.success(t.toast.deleteSuccess, t.toast.deleteSuccessDesc);
        } catch (error) {
          toast.error(t.toast.deleteError, t.toast.deleteErrorDesc);
        }
      },
      t.toast.confirmDelete,
      t.toast.confirmCancel
    );
  };

  const stats = {
    total: contracts.length,
    generated: contracts.filter((c) => c.status === 'generated').length,
    draft: contracts.filter((c) => c.status === 'draft').length,
  };

  const fadeUp = (delay: number) => ({
    initial: prefersReduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  return (
    <DashboardShell
      user={user}
      contractCount={stats.total}
      activePage="dashboard"
      search={search}
      onSearchChange={setSearch}
      onNewContract={() => router.push('/contracts/new')}
    >
      <div className="max-w-6xl mx-auto">
        {/* Greeting */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {greeting ?? t.dashboard.greeting}{' '}
              {user?.full_name?.split(' ')[0] || user?.email}
            </h1>
            <p className="text-slate-500">{t.dashboard.greetingSubtitle}</p>
          </div>
        </motion.div>

        {/* Gradient divider */}
        <motion.div
          {...fadeUp(0.08)}
          className="h-px mb-8 rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        {/* Stats */}
        <motion.div {...fadeUp(0.15)}>
          <StatsRow stats={stats} />
        </motion.div>

        {/* Contracts table */}
        <motion.div {...fadeUp(0.25)}>
          <ContractsTable
            contracts={contracts}
            loading={loading}
            search={search}
            onDownload={(id, title) => downloadPDF(id, title)}
            onDelete={handleDelete}
            limit={3}
          />
        </motion.div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.35)}>
          <QuickActions onCreateNew={() => router.push('/contracts/new')} />
        </motion.div>
      </div>
    </DashboardShell>
  );
}