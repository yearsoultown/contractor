'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, FileText, Eye, UploadCloud, Loader2 } from 'lucide-react';
import { Template } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { renderPreview } from '@/lib/preview';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export function TemplateSelector({ templates, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<Template | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const parseRes = await api.post<{html: string}>('/documents/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const html = parseRes.data.html;

      const parsedTitle = file.name.replace(/\.[^/.]+$/, "");
      const createRes = await api.post<{id: string}>('/contracts', {
        template_type: 'blank',
        title: parsedTitle,
        form_data: {},
        used_prefill: false,
      });
      const contractId = createRes.data.id;

      await api.patch(`/contracts/${contractId}/html`, {
        title: parsedTitle,
        rendered_html: html
      });

      toast.success('Документ загружен!', 'Документ успешно конвертирован и готов к редактированию.');
      router.push(`/contracts/${contractId}/edit`);
    } catch (err) {
      toast.error('Ошибка загрузки', 'Не удалось обработать документ.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const previewHtml = useMemo(
    () => (hovered ? renderPreview(hovered.html_body, {}) : ''),
    [hovered],
  );

  const fieldCount = useMemo(
    () => (hovered ? new Set(hovered.html_body.match(/\{\{\.(\w+)\}\}/g) ?? []).size : 0),
    [hovered],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">{t.newContract.selectTitle}</h1>
      <p className="text-slate-500 mb-8">{t.newContract.selectSubtitle}</p>

      <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-8 lg:items-start">
        {/* ── Left column: template list ── */}
        <div className="space-y-3">
          {/* Upload Button */}
          <div className="relative mb-6">
            <input 
              type="file" 
              accept=".docx,.pdf,.pages" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait" 
              onChange={handleFileUpload} 
              disabled={uploading} 
            />
            <div className={`w-full flex items-center gap-4 bg-brand-soft-blue border border-brand-blue/30 rounded-2xl px-6 py-5 transition-all ${uploading ? 'opacity-70' : 'hover:bg-brand-soft-blue/80'}`}>
              <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0">
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
              </div>
              <div className="text-left">
                <div className="font-bold text-brand-dark">Загрузить свой документ</div>
                <div className="text-sm text-slate-500">Поддерживаются форматы DOCX, PDF, Pages</div>
              </div>
            </div>
          </div>

          {templates.length === 0 ? (
            <div className="text-slate-400 text-sm py-8 text-center">{t.newContract.loadingTemplates}</div>
          ) : (
            templates.map((tmpl) => (
              <motion.button
                key={tmpl.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(tmpl)}
                onMouseEnter={() => setHovered(tmpl)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full text-left bg-white border rounded-2xl px-6 py-5 transition-all group ${
                  hovered?.id === tmpl.id
                    ? 'border-brand-blue shadow-lg shadow-brand-blue/10'
                    : 'border-slate-200 hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      hovered?.id === tmpl.id ? 'bg-brand-blue' : 'bg-brand-soft-blue'
                    }`}>
                      <FileText size={20} className={hovered?.id === tmpl.id ? 'text-white' : 'text-brand-blue'} />
                    </div>
                    <div>
                      <div className={`font-bold transition-colors ${
                        hovered?.id === tmpl.id ? 'text-brand-blue' : 'text-slate-900 group-hover:text-brand-blue'
                      }`}>
                        {tmpl.name_ru}
                      </div>
                      {tmpl.name_kz && <div className="text-sm text-slate-400">{tmpl.name_kz}</div>}
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className={`transition-all ${
                      hovered?.id === tmpl.id
                        ? 'text-brand-blue translate-x-1'
                        : 'text-slate-300 group-hover:text-brand-blue group-hover:translate-x-1'
                    }`}
                  />
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* ── Right column: preview panel (lg+ only) ── */}
        <div className="hidden lg:block lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="flex flex-col"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye size={15} className="text-brand-blue" />
                    <span className="text-sm font-bold text-slate-700">{hovered.name_ru}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {fieldCount} {fieldCount === 1 ? 'поле' : fieldCount >= 2 && fieldCount <= 4 ? 'поля' : 'полей'}
                  </span>
                </div>

                {/* iframe preview */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                  <iframe
                    srcDoc={previewHtml}
                    title={`Preview: ${hovered.name_ru}`}
                    className="w-full"
                    style={{ height: '520px' }}
                    sandbox="allow-same-origin"
                  />
                </div>

                <p className="text-xs text-slate-400 text-center mt-3 font-medium">
                  Нажмите на шаблон, чтобы начать заполнение
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center h-[580px] rounded-2xl border-2 border-dashed border-slate-200 text-slate-300"
              >
                <Eye size={36} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">Наведите на шаблон</p>
                <p className="text-xs mt-1 opacity-70">чтобы увидеть предпросмотр</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}