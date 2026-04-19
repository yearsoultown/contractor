'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { AdminTemplate } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateEditorModalProps {
  template: AdminTemplate | null; // null = create mode
  onClose: () => void;
  onSaved: () => void;
}

function renderPreview(html: string, schemaJson: string): string {
  // Replace {{.FieldName}} placeholders with placeholder text for visual feedback
  let preview = html;
  try {
    const schema = JSON.parse(schemaJson);
    const fields: { name: string; label: string }[] = schema?.fields ?? [];
    for (const field of fields) {
      const re = new RegExp(`\\{\\{\\s*\\.${field.name}\\s*\\}\\}`, 'g');
      preview = preview.replace(re, `[${field.label || field.name}]`);
    }
  } catch {
    // fallback: replace any remaining {{.X}} tokens generically
  }
  // Replace any remaining Go template tags
  preview = preview.replace(/\{\{[^}]+\}\}/g, '[…]');
  return preview;
}

export function TemplateEditorModal({ template, onClose, onSaved }: TemplateEditorModalProps) {
  const { t } = useTranslation();
  const toast = useToast();

  const [type, setType] = useState(template?.type ?? '');
  const [nameRu, setNameRu] = useState(template?.name_ru ?? '');
  const [nameKz, setNameKz] = useState(template?.name_kz ?? '');
  const [htmlBody, setHtmlBody] = useState(template?.html_body ?? '');
  const [schemaJson, setSchemaJson] = useState(
    template?.fields_schema
      ? JSON.stringify(template.fields_schema, null, 2)
      : '{\n  "fields": []\n}',
  );
  const [schemaError, setSchemaError] = useState('');
  const [saving, setSaving] = useState(false);

  // Validate JSON schema on change
  useEffect(() => {
    if (!schemaJson.trim()) { setSchemaError(''); return; }
    try {
      JSON.parse(schemaJson);
      setSchemaError('');
    } catch {
      setSchemaError(t.admin.schemaParseError);
    }
  }, [schemaJson, t.admin.schemaParseError]);

  const handleSave = async () => {
    if (schemaError) return;
    let parsedSchema: unknown;
    try {
      parsedSchema = JSON.parse(schemaJson);
    } catch {
      setSchemaError(t.admin.schemaParseError);
      return;
    }

    setSaving(true);
    try {
      if (template) {
        // Edit mode
        await api.put(`/admin/templates/${template.id}`, {
          name_ru: nameRu,
          name_kz: nameKz,
          html_body: htmlBody,
          fields_schema: parsedSchema,
        });
        toast.success(t.admin.updateSuccess);
      } else {
        // Create mode
        await api.post('/admin/templates', {
          type,
          name_ru: nameRu,
          name_kz: nameKz,
          html_body: htmlBody,
          fields_schema: parsedSchema,
        });
        toast.success(t.admin.createSuccess);
      }
      onSaved();
    } catch {
      toast.error(t.admin.saveError);
    } finally {
      setSaving(false);
    }
  };

  const isCreate = !template;
  const previewHtml = renderPreview(htmlBody, schemaJson);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h2 className="text-lg font-display font-bold text-slate-900">
            {isCreate ? t.admin.editorCreateTitle : t.admin.editorEditTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: split pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left pane: editor fields */}
          <div className="w-1/2 overflow-y-auto px-8 py-6 border-r border-slate-100 space-y-5">
            {isCreate && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t.admin.fieldType} <span className="text-red-500">*</span>
                </label>
                <input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder={t.admin.fieldTypePlaceholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t.admin.fieldNameRu} <span className="text-red-500">*</span>
                </label>
                <input
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  placeholder={t.admin.fieldNameRuPlaceholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t.admin.fieldNameKz}
                </label>
                <input
                  value={nameKz}
                  onChange={(e) => setNameKz(e.target.value)}
                  placeholder={t.admin.fieldNameKzPlaceholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.admin.fieldHtmlBody} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={htmlBody}
                onChange={(e) => setHtmlBody(e.target.value)}
                placeholder={t.admin.fieldHtmlBodyPlaceholder}
                rows={12}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t.admin.fieldSchema} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={schemaJson}
                onChange={(e) => setSchemaJson(e.target.value)}
                placeholder={t.admin.fieldSchemaPlaceholder}
                rows={8}
                className={cn(
                  'w-full border rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 resize-y',
                  schemaError
                    ? 'border-red-300 focus:ring-red-300/30'
                    : 'border-slate-200 focus:ring-brand-blue/30',
                )}
              />
              {schemaError && (
                <p className="mt-1 text-xs text-red-500">{schemaError}</p>
              )}
            </div>
          </div>

          {/* Right pane: live preview */}
          <div className="w-1/2 overflow-y-auto px-8 py-6 bg-slate-50 flex flex-col">
            <p className="text-xs font-semibold text-slate-600 mb-3">{t.admin.previewTitle}</p>
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-auto p-4">
              {htmlBody ? (
                <div
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-sm">
                  —
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t.admin.cancelBtn}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!schemaError || !nameRu || !htmlBody || (isCreate && !type)}
            className="px-5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? t.admin.saving : t.admin.saveBtn}
          </button>
        </div>
      </div>
    </div>
  );
}