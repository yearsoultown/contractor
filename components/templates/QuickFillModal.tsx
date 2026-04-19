'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2, ChevronRight } from 'lucide-react';
import { Template } from '@/types';
import api from '@/lib/api';

interface QuickFillModalProps {
  template: Template | null;
  onClose: () => void;
}

export default function QuickFillModal({ template, onClose }: QuickFillModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  if (!template) return null;

  // Show only "key" fields (first 4) for quick fill
  const keyFields = template.fields_schema?.fields?.slice(0, 4) || [];

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const res = await api.post('/contracts', {
        template_type: template.type,
        title: `${template.name_ru} - ${formData[keyFields[0]?.name] || 'Untitled'}`,
        form_data: formData,
        used_prefill: false,
      });
      onClose();
      router.push(`/contracts/${res.data.id}/edit`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create document');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{template.name_ru}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Fill key details to get started</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {keyFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.label}...`}
                />
              ) : (
                <input
                  type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${field.label}...`}
                />
              )}
            </div>
          ))}

          {template.fields_schema?.fields?.length > 4 && (
            <p className="text-xs text-gray-400">
              +{template.fields_schema.fields.length - 4} more fields available in the editor
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Create & Open
          </button>
        </div>
      </div>
    </div>
  );
}