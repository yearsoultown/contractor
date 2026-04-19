'use client';

import { useMemo } from 'react';
import { FileText } from 'lucide-react';
import { renderPreview } from '@/lib/preview';

interface ContractPreviewProps {
  htmlBody: string;
  formData: Record<string, string>;
}

export function ContractPreview({ htmlBody, formData }: ContractPreviewProps) {
  const previewHtml = useMemo(
    () => renderPreview(htmlBody, formData),
    [htmlBody, formData],
  );

  const filled = Object.values(formData).filter(Boolean).length;
  const total = (htmlBody.match(/\{\{\.(\w+)\}\}/g) ?? []).length;
  const unique = new Set(htmlBody.match(/\{\{\.(\w+)\}\}/g) ?? []).size;
  const percent = unique > 0 ? Math.round((filled / unique) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-brand-blue" />
          <span className="text-sm font-bold text-slate-700">Предпросмотр договора</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-400">{percent}%</span>
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <iframe
          srcDoc={previewHtml}
          title="Contract preview"
          className="w-full h-full"
          style={{ minHeight: '600px' }}
          sandbox="allow-same-origin"
        />
      </div>

      <p className="text-xs text-slate-400 text-center mt-3 font-medium">
        Заполните поля слева — документ обновляется в реальном времени
      </p>
    </div>
  );
}