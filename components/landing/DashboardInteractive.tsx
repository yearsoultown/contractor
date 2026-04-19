'use client';

import { motion } from 'motion/react';
import { FileText, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';
import { useTranslation } from '@/contexts/LanguageContext';

export function DashboardInteractive() {
  const { t } = useTranslation();
  const d = t.dashboardInteractive;

  const stat47 = useCountUp(47);
  const stat100 = useCountUp(100);

  const stats = [
    { v: stat47.count.toString(), ref: stat47.ref, l: d.statContracts },
    { v: '30с', ref: null as React.RefObject<HTMLDivElement> | null, l: d.statAvgTime },
    { v: stat100.count + '%', ref: stat100.ref, l: d.statCompliance },
  ];

  return (
    <div className="rounded-[2rem] md:rounded-[3rem] border border-slate-200/60 shadow-2xl overflow-hidden bg-white h-[420px] md:h-[500px] lg:h-[650px] flex flex-col">
      <div className="px-4 md:px-7 py-4 md:py-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.4 }} className="w-3 h-3 rounded-full bg-red-400 cursor-pointer" />
          <motion.div whileHover={{ scale: 1.4 }} className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer" />
          <motion.div whileHover={{ scale: 1.4 }} className="w-3 h-3 rounded-full bg-emerald-400 cursor-pointer" />
        </div>
        <p className="text-xs font-bold text-slate-400">{d.windowTitle}</p>
        <div className="w-10 md:w-14" />
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3 px-4 md:px-7 py-3 md:py-5 border-b border-slate-50">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            ref={s.ref ?? undefined}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="text-center p-2 md:p-3 rounded-2xl bg-slate-50 hover:bg-brand-soft-blue/40 transition-colors cursor-default"
          >
            <p className="text-lg md:text-2xl font-bold text-brand-dark">{s.v}</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-medium mt-0.5">{s.l}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 overflow-hidden px-4 md:px-7 py-3 md:py-4 space-y-1 md:space-y-2">
        {d.contracts.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
          >
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-brand-soft-blue/60 flex items-center justify-center flex-shrink-0"
            >
              <FileText size={14} className="text-brand-blue" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-bold text-brand-dark truncate">{c.name}</p>
              <p className="text-[10px] md:text-[11px] text-slate-400">{c.date}</p>
            </div>
            <div
              className={cn(
                'text-[9px] md:text-[10px] font-bold px-2 md:px-2.5 py-1 rounded-full flex items-center gap-1 md:gap-1.5 flex-shrink-0',
                i < 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-brand-blue',
              )}
            >
              {i === 2 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block"
                />
              )}
              {i < 2 ? d.statusDone : d.statusLive}
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-blue transition-colors flex-shrink-0" />
          </motion.div>
        ))}
      </div>

      <div className="px-4 md:px-7 py-3 md:py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{d.lastUpdated}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[10px] md:text-[11px] font-bold text-brand-blue flex items-center gap-1"
        >
          {d.createNew} <ArrowRight size={11} />
        </motion.button>
      </div>
    </div>
  );
}