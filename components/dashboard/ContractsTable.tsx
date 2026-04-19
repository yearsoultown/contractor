'use client';

import { FileText, Download, Trash2, MoreHorizontal, Plus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Contract } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';

interface ContractsTableProps {
  contracts: Contract[];
  loading: boolean;
  search: string;
  onDelete: (id: string) => void;
  onDownload: (id: string, title: string) => void;
  limit?: number;
}

const STATUS_CLASS: Record<string, string> = {
  generated: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  draft: 'bg-slate-50 text-slate-600 border-slate-100',
  failed: 'bg-red-50 text-red-600 border-red-100',
};

const STATUS_DOT: Record<string, string> = {
  generated: 'bg-emerald-500',
  draft: 'bg-slate-400',
  failed: 'bg-red-500',
};

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <tr key={i} className="border-b border-slate-100">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-2 w-16 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-5 w-14 bg-slate-100 rounded animate-pulse ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function ContractsTable({ contracts, loading, search, onDelete, onDownload, limit }: ContractsTableProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const displayedContracts = limit ? contracts.slice(0, limit) : contracts;
  const hasMore = limit ? contracts.length > limit : false;

  const statusLabel = (s: string) => t.status[s as keyof typeof t.status] ?? s;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{t.dashboard.table.title}</h3>
        <button
          onClick={() => router.push('/contracts/new')}
          className="text-brand-blue text-sm font-bold hover:underline flex items-center gap-1"
        >
          <Plus size={14} />
          {t.dashboard.table.create}
        </button>
      </div>

      {loading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {[
                  t.dashboard.table.colName,
                  t.dashboard.table.colDate,
                  t.dashboard.table.colStatus,
                  t.dashboard.table.colActions,
                ].map((col, i) => (
                  <th
                    key={col}
                    className={cn(
                      'px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest',
                      i === 3 && 'text-right',
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SkeletonRows />
            </tbody>
          </table>
        </div>
      ) : contracts.length === 0 ? (
        <div className="p-14 text-center">
          <motion.div
            initial={prefersReduced ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-full bg-brand-soft-blue flex items-center justify-center mx-auto mb-5"
          >
            <motion.div
              animate={prefersReduced ? {} : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FileText size={36} className="text-brand-blue" />
            </motion.div>
          </motion.div>
          <p className="text-slate-700 font-semibold text-base mb-1">
            {search ? t.dashboard.table.emptySearch : t.dashboard.table.empty}
          </p>
          {!search && (
            <>
              <p className="text-slate-400 text-sm mb-6">{t.dashboard.table.emptySubtitle}</p>
              <motion.button
                whileHover={prefersReduced ? {} : { scale: 1.03 }}
                whileTap={prefersReduced ? {} : { scale: 0.97 }}
                onClick={() => router.push('/contracts/new')}
                className="bg-brand-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
              >
                {t.dashboard.table.createFirst}
              </motion.button>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {[
                  t.dashboard.table.colName,
                  t.dashboard.table.colDate,
                  t.dashboard.table.colStatus,
                  t.dashboard.table.colActions,
                ].map((col, i) => (
                  <th
                    key={col}
                    className={cn(
                      'px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest',
                      i === 3 && 'text-right',
                    )}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedContracts.map((contract, i) => (
                <motion.tr
                  key={contract.id}
                  initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/contracts/${contract.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{contract.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{contract.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(contract.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                        STATUS_CLASS[contract.status] || 'bg-slate-50 text-slate-600 border-slate-100',
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', STATUS_DOT[contract.status] || 'bg-slate-400')} />
                      {statusLabel(contract.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {contract.status === 'generated' && (
                        <button
                          onClick={() => onDownload(contract.id, contract.title)}
                          className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-brand-soft-blue rounded-lg transition-all"
                          title={t.common.download}
                        >
                          <Download size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(contract.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title={t.common.delete}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasMore && (
        <div className="border-t border-slate-100 px-6 py-3 flex justify-center">
          <button
            onClick={() => router.push('/contracts')}
            className="text-sm text-brand-blue font-bold hover:underline flex items-center gap-1"
          >
            {t.dashboard.table.showAll}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}