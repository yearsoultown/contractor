'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { LayoutDashboard, MousePointer2, FileText, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { MagneticButton } from '@/components/ui/MagneticButton';

const ICONS = [
  <LayoutDashboard size={20} />,
  <MousePointer2 size={20} />,
  <FileText size={20} />,
];

export function HowItWorks() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      className="section-padding bg-brand-dark text-white rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] mx-3 md:mx-6 my-10 md:my-16 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 blur-[120px] -z-10" />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Left: heading + CTA */}
          <div className="relative">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brand-blue font-bold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6 block"
            >
              {t.howItWorks.label}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6 leading-[1.1]"
            >
              {t.howItWorks.title1} <br />
              {t.howItWorks.title2}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm md:text-xl mb-7 md:mb-12 leading-relaxed max-w-lg"
            >
              {t.howItWorks.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 md:gap-6"
            >
              <MagneticButton
                onClick={() => router.push('/register')}
                className="bg-brand-blue text-white px-7 md:px-10 py-3.5 md:py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 md:gap-3 shadow-lg shadow-brand-blue/20 text-sm md:text-base"
              >
                {t.howItWorks.cta}
                <ArrowRight size={18} />
              </MagneticButton>
              <div className="flex -space-x-3">
                {['А', 'Б', 'С'].map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    whileHover={{ zIndex: 10, scale: 1.15, y: -4 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-brand-dark bg-slate-700 flex items-center justify-center text-white font-bold text-xs md:text-sm relative"
                  >
                    {letter}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.64 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-brand-dark bg-brand-blue flex items-center justify-center text-[9px] md:text-[10px] font-bold"
                >
                  {t.howItWorks.users}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right: steps */}
          <div className="relative">
            {/* Vertical connector line — desktop only */}
            <div className="absolute left-5 top-6 bottom-6 w-px hidden md:block bg-slate-800 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-brand-blue"
                style={{ originY: 0 }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>

            <div className="space-y-4 md:space-y-12">
              {t.howItWorks.steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex gap-4 md:gap-8 group"
                >
                  {/* Icon — acts as line anchor on desktop, stands alone on mobile */}
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      backgroundColor: '#0052FF',
                      borderColor: '#0052FF',
                      color: '#ffffff',
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-brand-blue z-10"
                  >
                    {ICONS[idx]}
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pb-4 md:pb-0 border-b border-slate-800 md:border-none last:border-none">
                    <div className="flex items-center gap-3 mb-1.5 md:mb-3">
                      <span className="text-slate-600 font-mono text-xs font-bold tracking-widest">
                        {step.number}
                      </span>
                      <h3 className="text-base md:text-2xl font-bold text-white leading-snug">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm md:text-lg leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}