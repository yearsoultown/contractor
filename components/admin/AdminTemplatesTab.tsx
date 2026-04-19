'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { AdminTemplate } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { TemplateEditorModal } from './TemplateEditorModal';
import { Plus, Pencil, Trash2, LayoutTemplate } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AdminTemplatesTab() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);

  const fetchTemplates = useCallback(() => {
    setLoading(true);
    api.get<AdminTemplate[]>('/admin/templates')
      .then((res) => setTemplates(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleToggleActive = async (tpl: AdminTemplate) => {
    const next = !tpl.is_active;
    try {
      await api.put(`/admin/templates/${tpl.id}`, { is_active: next });
      setTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, is_active: next } : t)),
      );
      toast.success(t.admin.toggleSuccess);
    } catch {
      toast.error(t.admin.toggleError);
    }
  };

  const handleDelete = (tpl: AdminTemplate) => {
    toast.confirm(
      t.admin.deleteConfirmTitle,
      t.admin.deleteConfirmMessage,
      async () => {
        try {
          await api.delete(`/admin/templates/${tpl.id}`);
          setTemplates((prev) => prev.filter((t) => t.id !== tpl.id));
          toast.success(t.admin.deleteSuccess);
        } catch {
          toast.error(t.admin.deleteError);
        }
      },
      t.admin.confirmDelete,
      t.admin.confirmCancel,
    );
  };

  const openCreate = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const openEdit = (tpl: AdminTemplate) => {
    setEditingTemplate(tpl);
    setEditorOpen(true);
  };

  const handleSaved = () => {
    setEditorOpen(false);
    fetchTemplates();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-slate-900">{t.admin.templatesTitle}</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-xl hover:bg-brand-blue/90 transition-colors"
        >
          <Plus size={16} />
          {t.admin.createTemplate}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">{t.admin.loading}</div>
        ) : templates.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">—</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colType}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colNameRu}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colVersion}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colActive}</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">{t.admin.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <tr key={tpl.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{tpl.type}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{tpl.name_ru}</td>
                  <td className="px-6 py-4 text-slate-400">v{tpl.version}</td>
                  <td className="px-6 py-4">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleActive(tpl)}
                      title={tpl.is_active ? t.admin.statusActive : t.admin.statusInactive}
                      className={cn(
                        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none',
                        tpl.is_active ? 'bg-emerald-500' : 'bg-slate-200',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
                          tpl.is_active ? 'translate-x-4' : 'translate-x-1',
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(tpl)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-blue text-xs font-medium transition-colors"
                      >
                        <Pencil size={13} />
                        {t.admin.editTemplate}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/templates/${tpl.id}/editor`)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-violet-600 text-xs font-medium transition-colors"
                      >
                        <LayoutTemplate size={13} />
                        WYSIWYG
                      </button>
                      <button
                        onClick={() => handleDelete(tpl)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
                      >
                        <Trash2 size={13} />
                        {t.admin.deleteTemplate}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editorOpen && (
        <TemplateEditorModal
          template={editingTemplate}
          onClose={() => setEditorOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}