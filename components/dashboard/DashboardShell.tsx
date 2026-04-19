'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

type ActivePage = 'dashboard' | 'contracts' | 'team' | 'settings' | 'help' | 'admin';

interface DashboardShellProps {
  user: User | null;
  contractCount: number;
  activePage: ActivePage;
  search: string;
  onSearchChange: (v: string) => void;
  onNewContract: () => void;
  children: React.ReactNode;
}

export function DashboardShell({
  user,
  contractCount,
  activePage,
  search,
  onSearchChange,
  onNewContract,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        contractCount={contractCount}
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          search={search}
          onSearchChange={onSearchChange}
          onNewContract={onNewContract}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}