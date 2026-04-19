'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { User } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { ChevronDown, ChevronUp, Mail, BookOpen } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    setUser(getUser());
  }, [router]);

  if (!user) return null;

  const faqItems = t.help.faqItems as unknown as { q: string; a: string }[];
  const filtered = faqItems.filter(
    (item) =>
      search === '' ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardShell
      user={user}
      contractCount={0}
      activePage="help"
      search=""
      onSearchChange={() => {}}
      onNewContract={() => {}}
    >
      <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {t.help.pageTitle}
            </h1>
            <p className="text-slate-500">{t.help.pageSubtitle}</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
              placeholder={t.help.searchPlaceholder}
              className="w-full px-5 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition bg-white shadow-sm"
            />
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">{t.help.faqTitle}</h2>
            </div>
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">
                {t.dashboard.table.emptySearch}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 text-sm pr-4">{item.q}</span>
                      {openIndex === i ? (
                        <ChevronUp size={18} className="text-brand-blue shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openIndex === i && (
                      <div className="px-6 pb-5">
                        <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-soft-blue rounded-xl">
                  <Mail size={18} className="text-brand-blue" />
                </div>
                <h3 className="font-bold text-slate-900">{t.help.contactTitle}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{t.help.contactDesc}</p>
              <a
                href={`mailto:${t.help.contactEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition"
              >
                <Mail size={15} />
                {t.help.contactBtn}
              </a>
            </div>

            {/* Docs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-violet-50 rounded-xl">
                  <BookOpen size={18} className="text-violet-600" />
                </div>
                <h3 className="font-bold text-slate-900">{t.help.docsTitle}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{t.help.docsDesc}</p>
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-500 rounded-xl text-sm font-bold cursor-not-allowed opacity-60"
              >
                <BookOpen size={15} />
                {t.help.docsBtn}
              </button>
            </div>
          </div>
      </div>
    </DashboardShell>
  );
}