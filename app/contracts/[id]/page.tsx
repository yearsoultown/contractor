'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Download, Loader2, Pencil, Share2, Link2, Copy, Check,
  Trash2, Plus, History, GitCompare,
} from 'lucide-react';
import api from '@/lib/api';
import { isAuthenticated, downloadPDF, downloadDOCX } from '@/lib/auth';
import { ContractDetail, ContractVersion } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/contracts/PageHeader';
import { ShareModal } from '@/components/contracts/ShareModal';
import { ContractToolbar, ToolbarItem } from '@/components/contracts/ContractToolbar';
import { AIAnalysisPanel } from '@/components/contracts/AIAnalysisPanel';
import { ShieldCheck } from 'lucide-react';
import type { AnalysisResult } from '@/types/ai_analysis';

interface ShareLink {
  share_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

const statusMap: Record<string, { label: string; className: string }> = {
  generated: { label: 'Создан',   className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  draft:     { label: 'Черновик', className: 'bg-slate-50 text-slate-600 border-slate-100' },
  failed:    { label: 'Ошибка',   className: 'bg-red-50 text-red-600 border-red-100' },
};

export default function ContractDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [contract, setContract]   = useState<ContractDetail | null>(null);
  const [loading, setLoading]     = useState(true);
  const [sharing, setSharing]     = useState(false);
  const [shares, setShares]       = useState<ShareLink[]>([]);
  const [versions, setVersions]   = useState<ContractVersion[]>([]);
  const [copiedId, setCopiedId]   = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // AI Analysis State
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Dynamic top padding: measured from the actual fixed strips
  const [contentTop, setContentTop] = useState(170);

  useEffect(() => {
    function measureOffset() {
      // header strip height + toolbar strip height + 32px breathing room
      const header  = document.getElementById('page-header-strip');
      const toolbar = document.getElementById('toolbar-strip');
      if (header && toolbar) {
        const h = header.getBoundingClientRect().height;
        const tw = toolbar.getBoundingClientRect().height;
        setContentTop(h + tw + 32);
      }
    }
    measureOffset();
    window.addEventListener('resize', measureOffset);
    return () => window.removeEventListener('resize', measureOffset);
  }, []);

  const fetchShares = useCallback(() => {
    api.get<ShareLink[]>(`/contracts/${id}/share`).then((res) => setShares(res.data ?? []));
  }, [id]);

  const fetchVersions = useCallback(() => {
    api.get<ContractVersion[]>(`/contracts/${id}/versions`).then((res) => setVersions(res.data ?? []));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    api
      .get<ContractDetail>(`/contracts/${id}`)
      .then((res) => {
        setContract(res.data);
        if (res.data.status === 'generated') {
          fetchShares();
          fetchVersions();
        }
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, router, fetchShares, fetchVersions]);

  async function handleCopy(share: ShareLink) {
    const url = `${window.location.origin}/share/${share.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(share.share_id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleRevoke(share: ShareLink) {
    setRevokingId(share.share_id);
    try {
      await api.delete(`/contracts/${id}/share/${share.share_id}`);
      setShares((prev) => prev.filter((s) => s.share_id !== share.share_id));
    } finally {
      setRevokingId(null);
    }
  }

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const handleAnalyze = async () => {
    if (!contract || isAnalyzing) return;

    setAnalysisError(null);
    setAnalysis(null);
    setIsAnalyzing(true);
    try {
      const res = await api.post<AnalysisResult>(`/contracts/${id}/analyze`);
      setAnalysis(res.data);
    } catch (err) {
      console.error('AI Analysis failed:', err);
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Unknown error';
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ─── Drawer: Version history ──────────────────────────────────────────────
  const versionsDrawer = (
    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
      {versions.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-2">Нет сохранённых версий</p>
      ) : (
        versions.map((v, i) => {
          const isLatest     = i === 0;
          const compareTarget = isLatest ? null : versions[i - 1];
          return (
            <div
              key={v.version_number}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-slate-500">{v.version_number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-700">Версия {v.version_number}</span>
                <span className="text-xs text-slate-400 ml-2">
                  {new Date(v.created_at).toLocaleString('ru-RU', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <button
                onClick={() =>
                  router.push(
                    isLatest
                      ? `/contracts/${id}/versions/diff?v1=${v.version_number}&v2=current`
                      : `/contracts/${id}/versions/diff?v1=${v.version_number}&v2=${compareTarget!.version_number}`,
                  )
                }
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50 shrink-0 min-h-[32px]"
              >
                <GitCompare size={13} />
                <span className="hidden sm:inline">
                  {isLatest ? 'Сравнить с текущим' : `Сравнить с v${compareTarget!.version_number}`}
                </span>
              </button>
            </div>
          );
        })
      )}
    </div>
  );

  // ─── Drawer: Shared links ─────────────────────────────────────────────────
  const sharesDrawer = (
    <div>
      {shares.length === 0 ? (
        <div className="text-center py-3">
          <p className="text-sm text-slate-400 mb-3">
            Нет активных ссылок. Создайте ссылку, чтобы поделиться договором без входа в систему.
          </p>
          <button
            onClick={() => setSharing(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus size={13} />
            Создать ссылку
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setSharing(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus size={13} />
              Новая ссылка
            </button>
          </div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {shares.map((share) => {
            const expired = isExpired(share.expires_at);
            const url = `${window.location.origin}/share/${share.token}`;
            return (
              <div
                key={share.share_id}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2.5',
                  expired ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-slate-50 border-slate-200',
                )}
              >
                <span className="flex-1 text-xs font-mono text-slate-500 truncate min-w-0">{url}</span>
                <span className={cn('text-xs whitespace-nowrap shrink-0', expired ? 'text-red-400' : 'text-slate-400')}>
                  {expired ? 'Истекла ' : 'До '}
                  {new Date(share.expires_at).toLocaleDateString('ru-RU', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
                {!expired && (
                  <button
                    onClick={() => handleCopy(share)}
                    className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors shrink-0 min-h-[32px]"
                    title="Скопировать ссылку"
                  >
                    {copiedId === share.share_id
                      ? <Check size={14} className="text-emerald-500" />
                      : <Copy size={14} />}
                  </button>
                )}
                <button
                  onClick={() => handleRevoke(share)}
                  disabled={revokingId === share.share_id}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-40 min-h-[32px]"
                  title="Отозвать ссылку"
                >
                  {revokingId === share.share_id
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />}
                </button>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );

  // ─── Toolbar items config ─────────────────────────────────────────────────
  const toolbarItems: ToolbarItem[] = [
    ...(versions.length > 0 ? [{
      id:      'versions',
      icon:    History,
      label:   'История',
      badge:   versions.length,
      content: versionsDrawer,
    }] : []),
    ...(contract?.status === 'generated' ? [{
      id:      'sharing',
      icon:    Link2,
      label:   'Доступ',
      badge:   shares.length,
      content: sharesDrawer,
    }] : []),
    {
      id: 'ai-analysis',
      icon: ShieldCheck,
      label: t.aiAnalysis.title,
      panelWidth: 520,
      content: (
        <AIAnalysisPanel
          analysis={analysis}
          loading={isAnalyzing}
          onAnalyze={handleAnalyze}
          error={analysisError}
        />
      ),
    },
  ];

  // ─── Status badge ─────────────────────────────────────────────────────────
  const statusBadge = contract ? (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0',
        statusMap[contract.status]?.className || 'bg-slate-50 text-slate-600 border-slate-100',
      )}
    >
      {statusMap[contract.status]?.label || contract.status}
    </span>
  ) : null;

  const formattedDate = contract
    ? new Date(contract.created_at).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navigation header */}
      <PageHeader
        onBack={() => router.push('/dashboard')}
        backLabel={t.contractDetail.back}
        title={t.contractDetail.pageTitle}
      >
        {contract && (
          <button
            onClick={() => router.push(`/contracts/${id}/edit`)}
            className="w-full md:w-auto flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <Pencil size={15} />
            Редактировать
          </button>
        )}
        {contract?.status === 'generated' && (
          <button
            onClick={() => setSharing(true)}
            className="w-full md:w-auto flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <Share2 size={15} />
            Поделиться
          </button>
        )}
        {contract?.status === 'generated' && (
          <button
            onClick={() => downloadDOCX(contract.id, contract.title)}
            className="w-full md:w-auto flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <Download size={15} />
            DOCX
          </button>
        )}
        {contract?.status === 'generated' && (
          <button
            onClick={() => downloadPDF(contract.id, contract.title)}
            className="w-full md:w-auto bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-brand-blue/10"
          >
            <Download size={16} />
            {t.contractDetail.downloadPDF}
          </button>
        )}
      </PageHeader>

      {/* Toolbar strip + drawers */}
      {contract && (
        <ContractToolbar
          title={contract.title}
          statusBadge={statusBadge}
          date={formattedDate}
          items={toolbarItems}
        />
      )}

      {/* Main content — document only */}
      <div
        className="max-w-[794px] mx-auto px-2 sm:px-4 pb-10"
        style={{ paddingTop: contentTop }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : !contract ? null : (
          <>
            {contract.rendered_html && (
              <div
                className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm px-4 py-6 sm:p-10 prose prose-slate max-w-none text-sm leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={{
                  __html: contract.rendered_html.replace(
                    /body\s*\{([^}]*)\}/g,
                    (_, props) => `body{${props.replace(/margin:[^;]+;?/gi, 'margin:0;')}}`,
                  ),
                }}
              />
            )}
          </>
        )}
      </div>

      {sharing && contract && (
        <ShareModal
          contractId={contract.id}
          contractTitle={contract.title}
          onClose={() => setSharing(false)}
          onCreated={(share) => setShares((prev) => [share as ShareLink, ...prev])}
        />
      )}
    </div>
  );
}