'use client';

import { Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onCreateNew: () => void;
}

export function QuickActions({ onCreateNew }: QuickActionsProps) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        onClick={onCreateNew}
        whileHover={prefersReduced ? {} : { scale: 1.02 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-br from-brand-dark to-brand-dark/90 p-8 rounded-3xl text-white relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/5 blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <h3 className="text-xl font-bold mb-2">{t.dashboard.quickActions.createTitle}</h3>
        <p className="text-white/80 text-sm mb-6 max-w-xs">{t.dashboard.quickActions.createDesc}</p>
        <button className="bg-white text-brand-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <Zap size={16} fill="currentColor" className="text-brand-blue" />
          {t.dashboard.quickActions.createBtn}
        </button>
      </motion.div>

      <motion.div
        whileHover={prefersReduced ? {} : { y: -2 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm"
      >
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t.dashboard.quickActions.templatesTitle}</h3>
          <p className="text-slate-500 text-sm mb-6">{t.dashboard.quickActions.templatesDesc}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {t.dashboard.quickActions.templateNames.map((name, i) => (
              <motion.span
                key={name}
                initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg"
              >
                {name}
              </motion.span>
            ))}
          </div>
          <button onClick={onCreateNew} className="text-brand-blue font-bold text-sm hover:underline">
            {t.dashboard.quickActions.templatesBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}