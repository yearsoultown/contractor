'use client';

import { Document } from '@/types';
import { FileText, Clock, MoreVertical, Trash2, FolderOpen, Edit } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentGridProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
}

export default function DocumentGrid({ documents, onDelete, onMove }: DocumentGridProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const sourceLabel = (source: Document['source']) => {
    if (source === 'template') return 'Template';
    if (source === 'upload') return 'Uploaded';
    return 'Blank';
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">No documents yet</p>
        <p className="text-sm mt-1">Create a new document to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group relative cursor-pointer"
          onClick={() => router.push(`/contracts/${doc.id}/edit`)}
        >
          {/* Thumbnail */}
          <div className="aspect-[3/4] bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col">
            {doc.thumbnail_path ? (
              <img
                src={doc.thumbnail_path}
                alt={doc.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <FileText className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Info */}
          <div className="mt-2 px-1">
            <p className="text-sm font-medium text-gray-800 truncate">{doc.title}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">
                {formatDate(doc.last_opened_at || doc.updated_at)}
              </p>
            </div>
            <span className="inline-block mt-1 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
              {sourceLabel(doc.source)}
            </span>
          </div>

          {/* Context menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1 rounded bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(openMenu === doc.id ? null : doc.id);
              }}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {openMenu === doc.id && (
              <div
                className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setOpenMenu(null);
                    router.push(`/contracts/${doc.id}/edit`);
                  }}
                >
                  <Edit className="w-4 h-4" /> Open
                </button>
                {onMove && (
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setOpenMenu(null);
                      onMove(doc.id);
                    }}
                  >
                    <FolderOpen className="w-4 h-4" /> Move
                  </button>
                )}
                {onDelete && (
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setOpenMenu(null);
                      onDelete(doc.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}