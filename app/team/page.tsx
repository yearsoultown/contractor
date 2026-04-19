'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from '@/lib/auth';
import type { User } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Users, GitBranch, CheckSquare, Bell } from 'lucide-react';

export default function TeamPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    setUser(getUser());
  }, [router]);

  if (!user) return null;

  const features = [
    { icon: Users, title: t.team.feature1Title, desc: t.team.feature1Desc, color: 'bg-blue-50 text-brand-blue' },
    { icon: GitBranch, title: t.team.feature2Title, desc: t.team.feature2Desc, color: 'bg-violet-50 text-violet-600' },
    { icon: CheckSquare, title: t.team.feature3Title, desc: t.team.feature3Desc, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <DashboardShell
      user={user}
      contractCount={0}
      activePage="team"
      search=""
      onSearchChange={() => {}}
      onNewContract={() => {}}
    >
      <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-soft-blue text-brand-blue text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <Bell size={12} />
              {t.team.comingSoon}
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-3">
              {t.team.pageTitle}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t.team.comingSoonDesc}
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 mb-10">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4 shadow-sm">
                <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notify form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            {submitted ? (
              <div className="py-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckSquare size={24} className="text-emerald-500" />
                </div>
                <p className="font-bold text-slate-900">{t.team.notifySuccess}</p>
              </div>
            ) : (
              <>
                <p className="text-slate-500 mb-4 text-sm">{t.team.pageSubtitle}</p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.team.notifyPlaceholder}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition"
                  />
                  <button
                    onClick={() => email && setSubmitted(true)}
                    className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    {t.team.notifyBtn}
                  </button>
                </div>
              </>
            )}
          </div>
      </div>
    </DashboardShell>
  );
}