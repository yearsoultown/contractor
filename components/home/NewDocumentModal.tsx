'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Upload, LayoutTemplate, X } from 'lucide-react';
import { createBlankDocument } from '@/lib/api';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
}

export default function NewDocumentModal({ isOpen, onClose, folderId }: NewDocumentModalProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('Untitled document');
  const [view, setView] = useState<'menu' | 'blank'>('menu');

  if (!isOpen) return null;

  const handleCreateBlank = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await createBlankDocument(title.trim(), folderId);
      onClose();
      router.push(`/contracts/${res.data.id}/edit`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {view === 'blank' ? 'New blank document' : 'Create new document'}
          </h2>
          <button
            onClick={() => { setView('menu'); onClose(); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {view === 'menu' ? (
          <div className="p-6 grid grid-cols-3 gap-4">
            {/* Blank doc */}
            <button
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              onClick={() => setView('blank')}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Blank</span>
            </button>

            {/* Upload */}
            <button
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group"
              onClick={() => router.push('/contracts/new?source=upload')}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Upload</span>
            </button>

            {/* Templates */}
            <button
              className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
              onClick={() => router.push('/contracts/new')}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <LayoutTemplate className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Templates</span>
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBlank()}
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setView('menu')}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateBlank}
                disabled={creating || !title.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}