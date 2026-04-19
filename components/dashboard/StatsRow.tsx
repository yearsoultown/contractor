'use client';

import { FileText, Clock, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';

interface Stats {
  total: number;
  draft: number;
  generated: number;
}

export function StatsRow({ stats }: { stats: Stats }) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const items = [
    {
      label: t.dashboard.stats.total,
      value: stats.total,
      sub: t.dashboard.stats.totalSub,
      icon: <FileText className="text-brand-blue" />,
      bg: 'bg-brand-soft-blue',
    },
    {
      label: t.dashboard.stats.draft,
      value: stats.draft,
      sub: t.dashboard.stats.draftSub,
      icon: <Clock className="text-amber-500" />,
      bg: 'bg-amber-50',
    },
    {
      label: t.dashboard.stats.generated,
      value: stats.generated,
      sub: t.dashboard.stats.generatedSub,
      icon: <CheckCircle2 className="text-emerald-500" />,
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {items.map((stat, i) => (
        <motion.div
          key={i}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={prefersReduced ? {} : { y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm cursor-default"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}
            >
              {stat.icon}
            </motion.div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.dashboard.stats.statLabel}
            </span>
          </div>
          <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs font-medium text-slate-400">{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}