'use client';

import { useState } from 'react';
import { X, Link2, Copy, Check, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/lib/api';

interface ShareLink {
  share_id: string;
  token: string;
  expires_at: string;
}

interface ShareModalProps {
  contractId: string;
  contractTitle: string;
  onClose: () => void;
  onCreated?: (share: ShareLink) => void;
}

const EXPIRY_OPTIONS = [
  { label: '7 дней', days: 7 },
  { label: '30 дней', days: 30 },
  { label: '90 дней', days: 90 },
];

export function ShareModal({ contractId, contractTitle, onClose, onCreated }: ShareModalProps) {
  const [expiryDays, setExpiryDays] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [share, setShare] = useState<ShareLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(false);

  const shareUrl = share
    ? `${window.location.origin}/share/${share.token}`
    : '';

  async function handleGenerate() {
    setGenerating(true);
    setError('');
    try {
      const res = await api.post<ShareLink>(`/contracts/${contractId}/share`, {
        expiry_days: expiryDays,
      });
      setShare(res.data);
      onCreated?.(res.data);
    } catch {
      setError('Не удалось создать ссылку. Попробуйте ещё раз.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRevoke() {
    if (!share) return;
    setRevoking(true);
    try {
      await api.delete(`/contracts/${contractId}/share/${share.share_id}`);
      setShare(null);
    } catch {
      setError('Не удалось отозвать ссылку.');
    } finally {
      setRevoking(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
        onClick={onClose}
      >
        <motion.div
          key="sheet"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-0 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          <div className="px-6 sm:px-8 pt-5 sm:pt-8 pb-[max(24px,env(safe-area-inset-bottom))]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Link2 size={20} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Поделиться договором</h2>
                  <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-[220px]">{contractTitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {!share ? (
              <>
                {/* Expiry selector */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-700 mb-3">Срок действия ссылки</p>
                  <div className="flex gap-2">
                    {EXPIRY_OPTIONS.map((opt) => (
                      <button
                        key={opt.days}
                        onClick={() => setExpiryDays(opt.days)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                          expiryDays === opt.days
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5">
                  Любой, кто получит ссылку, сможет просмотреть и скачать PDF без входа в систему.
                </p>

                {error && (
                  <p className="text-sm text-red-500 mb-4 bg-red-50 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Создание ссылки...
                    </>
                  ) : (
                    <>
                      <Link2 size={16} />
                      Создать ссылку
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Generated link */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Ссылка для доступа</p>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="flex-1 text-sm text-slate-600 truncate font-mono min-w-0">{shareUrl}</span>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-500 min-h-[36px]"
                    >
                      {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5">
                  Действительна до{' '}
                  <span className="font-medium text-slate-600">
                    {new Date(share.expires_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </p>

                {error && (
                  <p className="text-sm text-red-500 mb-4 bg-red-50 rounded-xl px-4 py-3">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleRevoke}
                    disabled={revoking}
                    className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-60"
                  >
                    {revoking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Отозвать
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Скопировано!' : 'Скопировать ссылку'}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}