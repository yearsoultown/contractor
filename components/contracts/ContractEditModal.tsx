'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ArrowRight, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '@/lib/api';
import { ContractDetail, Template } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { FormField } from './FormField';
import { ContractPreview } from './ContractPreview';
import { cn } from '@/lib/utils';

interface ContractEditModalProps {
  contract: ContractDetail;
  onClose: () => void;
  onSuccess: (updated: ContractDetail & { version_saved?: number }) => void;
}

type Tab = 'form' | 'preview';

export function ContractEditModal({ contract, onClose, onSuccess }: ContractEditModalProps) {
  const { t } = useTranslation();
  const [template, setTemplate] = useState<Template | null>(null);
  const [title, setTitle] = useState(contract.title);
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(contract.form_data).map(([k, v]) => [k, String(v ?? '')]),
    ),
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('form');

  useEffect(() => {
    api
      .get<Template>(`/templates/${contract.template_type}`)
      .then((res) => setTemplate(res.data))
      .finally(() => setFetching(false));
  }, [contract.template_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.put<ContractDetail & { version_saved?: number }>(`/contracts/${contract.id}`, {
        title,
        form_data: formData,
      });
      onSuccess(res.data);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
          'Ошибка обновления',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-start justify-center sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-6xl sm:my-8 bg-slate-50 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-brand-dark">Редактировать договор</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Измените данные и пересоздайте PDF</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mobile tab switcher — only shown on small screens */}
          <div className="lg:hidden flex border-b border-slate-200 bg-white">
            {(['form', 'preview'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all border-b-2',
                  activeTab === tab
                    ? 'text-brand-blue border-brand-blue'
                    : 'text-slate-500 border-transparent hover:text-slate-700',
                )}
              >
                {tab === 'form' ? <FileText size={15} /> : <Eye size={15} />}
                {tab === 'form' ? 'Форма' : 'Предпросмотр'}
              </button>
            ))}
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-24 text-slate-400">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : (
            /* Desktop: 2-col grid. Mobile: single-col driven by active tab */
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: form */}
              <div
                className={cn(
                  'p-5 sm:p-8 lg:border-r border-slate-200 overflow-y-auto',
                  'max-h-[70vh] lg:max-h-[75vh]',
                  // On mobile, hide the inactive tab panel
                  activeTab === 'preview' ? 'hidden lg:block' : 'block',
                )}
              >
                {error && (
                  <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl font-medium">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t.newContract.titleLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all bg-white"
                    />
                  </div>

                  {template?.fields_schema?.fields?.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">{t.newContract.required}</span>
                        )}
                      </label>
                      <FormField
                        field={field}
                        value={formData[field.name] || ''}
                        onChange={(v) => setFormData((p) => ({ ...p, [field.name]: v }))}
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Пересоздаём PDF...
                      </>
                    ) : (
                      <>
                        Сохранить и пересоздать PDF
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right: live preview */}
              <div
                className={cn(
                  'p-5 sm:p-8 bg-slate-50/50 overflow-y-auto',
                  'max-h-[70vh] lg:max-h-[75vh]',
                  activeTab === 'form' ? 'hidden lg:block' : 'block',
                )}
              >
                {template && (
                  <ContractPreview htmlBody={template.html_body} formData={formData} />
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}