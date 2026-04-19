'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { AdminContract } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { downloadPDF } from '@/lib/auth';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = ['', 'draft', 'generated', 'failed'] as const;

export function AdminContractsTab() {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchContracts = useCallback(
    (p: number, status: string) => {
      setLoading(true);
      const params: Record<string, string | number> = { page: p, limit: PAGE_SIZE };
      if (status) params.status = status;
      api
        .get<{ contracts: AdminContract[]; total: number }>('/admin/contracts', { params })
        .then((res) => {
          const data = res.data?.contracts ?? [];
          setContracts(data);
          setHasMore(data.length === PAGE_SIZE);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    },
    [],
  );

  useEffect(() => {
    fetchContracts(page, statusFilter);
  }, [page, statusFilter, fetchContracts]);

  const handleStatusChange = (s: string) => {
    setStatusFilter(s);
    setPage(1);
  };

  const statusLabel = (s: string) => {
    if (s === 'generated') return t.status.generated;
    if (s === 'draft') return t.status.draft;
    if (s === 'failed') return t.status.failed;
    return s;
  };

  const statusClass = (s: string) => {
    if (s === 'generated') return 'bg-emerald-50 text-emerald-600';
    if (s === 'draft') return 'bg-amber-50 text-amber-600';
    return 'bg-red-50 text-red-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-display font-bold text-slate-900">{t.admin.contractsTitle}</h2>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === '' ? t.admin.filterByStatus : statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">{t.admin.loading}</div>
        ) : contracts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">—</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colTitle}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colUser}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colTemplate}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colStatus}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colDate}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium max-w-[200px] truncate">{c.title}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs max-w-[120px] truncate" title={c.user_id}>
                    {c.user_id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-4 text-slate-500">{c.template_type || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-semibold', statusClass(c.status))}>
                      {statusLabel(c.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {c.status === 'generated' && (
                      <button
                        onClick={() => downloadPDF(c.id, c.title)}
                        className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-blue/70 text-xs font-medium transition-colors"
                        title={t.admin.downloadPDF}
                      >
                        <Download size={14} />
                        {t.admin.downloadPDF}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-slate-400">
          {t.admin.pageOf} {page}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            {t.admin.prevPage}
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.admin.nextPage}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}