'use client';

import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface ContractSuccessProps {
  onView: () => void;
  onDashboard: () => void;
  onCreateMore: () => void;
}

export function ContractSuccess({ onView, onDashboard, onCreateMore }: ContractSuccessProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={48} className="text-emerald-500" />
      </div>
      <h2 className="text-3xl font-display font-bold text-brand-dark mb-3">{t.newContract.doneTitle}</h2>
      <p className="text-slate-500 text-lg mb-10">{t.newContract.doneSubtitle}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onView}
          className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20"
        >
          {t.newContract.openContract}
        </button>
        <button
          onClick={onDashboard}
          className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
        >
          {t.newContract.toList}
        </button>
        <button onClick={onCreateMore} className="text-brand-blue font-bold px-6 py-4 hover:underline">
          {t.newContract.createMore}
        </button>
      </div>
    </motion.div>
  );
}