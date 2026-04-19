'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, RotateCcw, GitCompare } from 'lucide-react';
import { diffWords } from 'diff';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { ContractDetail, ContractVersionDetail } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

interface VersionPanel {
  label: string;
  versionNumber: number | 'current';
  renderedHtml: string;
  createdAt: string;
}

function buildDiffHtml(oldHtml: string, newHtml: string): string {
  const parts = diffWords(oldHtml, newHtml);
  return parts
    .map((part) => {
      if (part.added) {
        return `<ins style="background:#dcfce7;border-radius:2px;text-decoration:none;padding:0 1px">${part.value}</ins>`;
      }
      if (part.removed) {
        return `<del style="background:#fee2e2;border-radius:2px;text-decoration:none;padding:0 1px">${part.value}</del>`;
      }
      return part.value;
    })
    .join('');
}

function cleanHtml(html: string): string {
  return html.replace(
    /body\s*\{([^}]*)\}/g,
    (_, props) => `body{${props.replace(/margin:[^;]+;?/gi, 'margin:0;')}}`,
  );
}

// Which panel is active in side-by-side mode on mobile
type SideTab = 0 | 1;

function DiffPageContent() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { success: toastSuccess, error: toastError } = useToast();

  const v1Param = searchParams.get('v1');
  const v2Param = searchParams.get('v2');

  const [panelA, setPanelA] = useState<VersionPanel | null>(null);
  const [panelB, setPanelB] = useState<VersionPanel | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [diffHtml, setDiffHtml] = useState('');
  const [mode, setMode] = useState<'diff' | 'side'>('diff');
  const [sideTab, setSideTab] = useState<SideTab>(0);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (!v1Param || !v2Param) { router.push(`/contracts/${id}`); return; }

    const fetchA = api.get<ContractVersionDetail>(`/contracts/${id}/versions/${v1Param}`);
    const fetchB = v2Param === 'current'
      ? api.get<ContractDetail>(`/contracts/${id}`)
      : api.get<ContractVersionDetail>(`/contracts/${id}/versions/${v2Param}`);

    Promise.all([fetchA, fetchB])
      .then(([resA, resB]) => {
        const a: VersionPanel = {
          label: 'Старая',
          versionNumber: Number(v1Param),
          renderedHtml: (resA.data as ContractVersionDetail).rendered_html,
          createdAt: resA.data.created_at,
        };
        const bData = resB.data;
        const b: VersionPanel = v2Param === 'current'
          ? {
              label: 'Текущая',
              versionNumber: 'current',
              renderedHtml: (bData as ContractDetail).rendered_html,
              createdAt: (bData as ContractDetail).created_at,
            }
          : {
              label: 'Новая',
              versionNumber: Number(v2Param),
              renderedHtml: (bData as ContractVersionDetail).rendered_html,
              createdAt: bData.created_at,
            };

        setPanelA(a);
        setPanelB(b);
        setDiffHtml(buildDiffHtml(a.renderedHtml, b.renderedHtml));
      })
      .catch(() => router.push(`/contracts/${id}`))
      .finally(() => setLoading(false));
  }, [id, v1Param, v2Param, router]);

  async function handleRestore(vnum: number | 'current') {
    if (vnum === 'current') return;
    setRestoring(true);
    try {
      await api.post(`/contracts/${id}/versions/${vnum}/restore`);
      toastSuccess(`Версия ${vnum} восстановлена`, 'Договор возвращён к выбранной версии');
      router.push(`/contracts/${id}`);
    } catch {
      toastError('Ошибка восстановления');
    } finally {
      setRestoring(false);
    }
  }

  const panels = panelA && panelB ? ([panelA, panelB] as const) : null;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">

          {/* Row 1: back + version label */}
          <div className="h-12 flex items-center gap-3">
            <button
              onClick={() => router.push(`/contracts/${id}`)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium shrink-0"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Назад к договору</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <GitCompare size={15} className="text-slate-400 shrink-0" />
              {!loading && panelA && panelB && (
                <span className="text-sm font-bold text-slate-800 truncate">
                  v{panelA.versionNumber}&nbsp;→&nbsp;
                  {panelB.versionNumber === 'current' ? 'Текущая' : `v${panelB.versionNumber}`}
                </span>
              )}
            </div>

            {/* Mode switcher — visible on sm+ in row 1, hidden on mobile (shown in row 2) */}
            <div className="ml-auto hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
              <button
                onClick={() => setMode('diff')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  mode === 'diff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                Inline diff
              </button>
              <button
                onClick={() => setMode('side')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  mode === 'side' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                )}
              >
                Side-by-side
              </button>
            </div>
          </div>

          {/* Row 2: mode switcher on mobile only */}
          <div className="sm:hidden flex border-t border-slate-100">
            <button
              onClick={() => setMode('diff')}
              className={cn(
                'flex-1 py-2.5 text-xs font-bold transition-all border-b-2',
                mode === 'diff'
                  ? 'text-brand-blue border-brand-blue'
                  : 'text-slate-500 border-transparent',
              )}
            >
              Inline diff
            </button>
            <button
              onClick={() => setMode('side')}
              className={cn(
                'flex-1 py-2.5 text-xs font-bold transition-all border-b-2',
                mode === 'side'
                  ? 'text-brand-blue border-brand-blue'
                  : 'text-slate-500 border-transparent',
              )}
            >
              Side-by-side
            </button>
          </div>

        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      {/* pt accounts for: row1 (48px) + optional row2 on mobile (41px) */}
      <div className="pt-[89px] sm:pt-12">
        {loading ? (
          <div className="flex items-center justify-center py-32 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : !panels ? null : (
          <>
            {/* ── Version meta cards ──────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 pt-5 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {panels.map((panel, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span
                      className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
                        i === 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600',
                      )}
                    >
                      {panel.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {panel.versionNumber === 'current' ? 'Текущая версия' : `Версия ${panel.versionNumber}`}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(panel.createdAt).toLocaleString('ru-RU', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {panel.versionNumber !== 'current' && (
                    <button
                      onClick={() => handleRestore(panel.versionNumber)}
                      disabled={restoring}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 shrink-0"
                    >
                      {restoring
                        ? <Loader2 size={12} className="animate-spin" />
                        : <RotateCcw size={12} />}
                      Восстановить
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ── Diff content ────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-10">
              {mode === 'diff' ? (
                <div
                  className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm px-4 py-6 sm:p-10 prose prose-slate max-w-none text-sm leading-relaxed overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(diffHtml) }}
                />
              ) : (
                <>
                  {/* Mobile: tab switcher for side-by-side panels */}
                  <div className="sm:hidden flex bg-white border border-slate-200 rounded-2xl mb-3 overflow-hidden">
                    {panels.map((panel, i) => (
                      <button
                        key={i}
                        onClick={() => setSideTab(i as SideTab)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2',
                          sideTab === i
                            ? i === 0
                              ? 'text-red-600 border-red-400 bg-red-50/40'
                              : 'text-emerald-600 border-emerald-400 bg-emerald-50/40'
                            : 'text-slate-500 border-transparent',
                        )}
                      >
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            i === 0 ? 'bg-red-400' : 'bg-emerald-400',
                          )}
                        />
                        {panel.versionNumber === 'current' ? 'Текущая' : `Версия ${panel.versionNumber}`}
                        <span className="text-[10px] opacity-60">({panel.label.toLowerCase()})</span>
                      </button>
                    ))}
                  </div>

                  {/* Desktop: true two-column grid */}
                  <div className="hidden sm:grid grid-cols-2 gap-4">
                    {panels.map((panel, i) => (
                      <div key={i}>
                        <div className={cn(
                          'text-xs font-bold mb-2 px-1',
                          i === 0 ? 'text-red-500' : 'text-emerald-500',
                        )}>
                          {panel.versionNumber === 'current' ? 'Текущая' : `Версия ${panel.versionNumber}`}{' '}
                          ({panel.label.toLowerCase()})
                        </div>
                        <div
                          className={cn(
                            'bg-white border rounded-3xl shadow-sm p-8 prose prose-slate max-w-none text-sm leading-relaxed overflow-x-auto',
                            i === 0 ? 'border-red-100' : 'border-emerald-100',
                          )}
                          dangerouslySetInnerHTML={{ __html: cleanHtml(panel.renderedHtml) }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Mobile: single panel driven by sideTab */}
                  <div className="sm:hidden">
                    {panels.map((panel, i) => (
                      <div key={i} className={i === sideTab ? 'block' : 'hidden'}>
                        <div
                          className={cn(
                            'bg-white border rounded-2xl shadow-sm px-4 py-6 prose prose-slate max-w-none text-sm leading-relaxed overflow-x-auto',
                            i === 0 ? 'border-red-100' : 'border-emerald-100',
                          )}
                          dangerouslySetInnerHTML={{ __html: cleanHtml(panel.renderedHtml) }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VersionDiffPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    }>
      <DiffPageContent />
    </Suspense>
  );
}