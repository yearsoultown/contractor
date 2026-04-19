'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AdminUser } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminUsersTab() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ users: AdminUser[]; total: number }>('/admin/users')
      .then((res) => setUsers(res.data?.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900">{t.admin.usersTitle}</h2>
        <span className="text-sm text-slate-400">{users.length} {t.admin.colRole.toLowerCase()}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">{t.admin.loading}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">—</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colEmail}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colName}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colRole}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colStatus}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colJoined}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">{u.email}</td>
                  <td className="px-6 py-4 text-slate-600">{u.full_name || '—'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                        u.role === 'admin'
                          ? 'bg-brand-blue/10 text-brand-blue'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {u.role === 'admin' ? (
                        <ShieldCheck size={11} />
                      ) : (
                        <UserIcon size={11} />
                      )}
                      {u.role === 'admin' ? t.admin.roleAdmin : t.admin.roleUser}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full text-xs font-semibold',
                        u.is_active
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-500',
                      )}
                    >
                      {u.is_active ? t.admin.statusActive : t.admin.statusInactive}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}