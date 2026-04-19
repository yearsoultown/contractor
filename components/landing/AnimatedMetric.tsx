'use client';

import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export function AnimatedMetric() {
  const { t } = useTranslation();
  const { bars, avgTime } = t.animatedMetric;

  return (
    <div className="mt-10 rounded-2xl border border-slate-200/60 shadow-sm p-6 bg-white">
      <div className="flex items-end justify-between mb-5">
        <div>
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl font-bold text-brand-blue leading-none"
          >
            30с
          </motion.p>
          <p className="text-xs text-slate-400 font-medium mt-1.5">{avgTime}</p>
        </div>
        <Zap size={20} className="text-brand-blue mb-1" fill="currentColor" />
      </div>
      <div className="space-y-2.5">
        {bars.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>{item.label}</span>
              <span>{item.w}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.w}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-brand-blue rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}