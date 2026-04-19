'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Download, FileText, Loader2, AlertCircle, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SharedContract {
  title: string;
  template_type: string;
  rendered_html: string;
  expires_at: string;
  has_pdf: boolean;
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'expired' | 'notfound' | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/share/${token}`)
      .then(async (res) => {
        if (res.status === 410) { setError('expired'); return; }
        if (!res.ok) { setError('notfound'); return; }
        setData(await res.json());
      })
      .catch(() => setError('notfound'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/share/${token}/pdf`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data?.title || 'contract'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
          {error === 'expired' ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-amber-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Ссылка устарела</h1>
              <p className="text-sm text-slate-500">Срок действия этой ссылки истёк. Попросите владельца создать новую.</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Договор не найден</h1>
              <p className="text-sm text-slate-500">Эта ссылка недействительна или была отозвана.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm truncate max-w-[200px]">
              {data?.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">
              Действительна до{' '}
              {data &&
                new Date(data.expires_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
            </span>
            {data?.has_pdf && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Download size={14} />
                )}
                Скачать PDF
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Contract body */}
      <style>{`body { margin: 0 !important; }`}</style>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {data?.rendered_html && (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.rendered_html }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-10">
        <p className="text-xs text-slate-400">
          Создано с помощью{' '}
          <a href="/" className="text-blue-600 hover:underline font-medium">
            AIDOGOVOR
          </a>
        </p>
      </div>
    </div>
  );
}