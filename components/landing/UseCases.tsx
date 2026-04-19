'use client';

import { motion } from 'motion/react';
import { Zap, LayoutDashboard, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const ICONS = [
  <Zap className="text-brand-blue" />,
  <LayoutDashboard className="text-emerald-500" />,
  <Users className="text-indigo-500" />,
  <Shield className="text-slate-700" />,
];

const COLORS = ['bg-blue-50', 'bg-emerald-50', 'bg-indigo-50', 'bg-slate-100'];

export function UseCases() {
  const { t } = useTranslation();

  return (
    <section id="use-cases" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-bold tracking-tight text-brand-dark mb-4 md:mb-6">
            {t.useCases.title}
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{t.useCases.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.useCases.items.map((item, idx) => (
            <SpotlightCard
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className={cn('w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-5 md:mb-8', COLORS[idx])}
              >
                {ICONS[idx]}
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-brand-dark">{item.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed font-medium">{item.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}