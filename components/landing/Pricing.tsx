'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/LanguageContext';
import { TiltCard } from '@/components/ui/TiltCard';

const CUSTOM_LABELS = ['Индивидуально', 'Custom', 'Жеке'];

export function Pricing() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section id="pricing" className="section-padding bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-bold tracking-tight text-brand-dark mb-4 md:mb-6">
            {t.pricing.title}
          </h2>
          <p className="text-xl text-slate-500 font-medium">{t.pricing.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 items-center">
          {t.pricing.tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <TiltCard
                className={cn(
                  'p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border flex flex-col transition-all duration-500 relative',
                  tier.popular
                    ? 'border-brand-blue shadow-[0_30px_60px_rgba(0,82,255,0.08)] md:scale-105 z-10 bg-white'
                    : 'border-slate-200 bg-white/50 hover:bg-white hover:border-slate-300',
                )}
              >
                {tier.popular && (
                  <motion.span
                    animate={{
                      boxShadow: [
                        '0 4px 20px rgba(0,82,255,0.2)',
                        '0 4px 30px rgba(0,82,255,0.45)',
                        '0 4px 20px rgba(0,82,255,0.2)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.2em]"
                  >
                    {t.pricing.popular}
                  </motion.span>
                )}

                <div className="mb-6 md:mb-10">
                  <h3 className="text-2xl font-bold mb-3 text-brand-dark">{tier.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mb-5 md:mb-8 leading-relaxed">{tier.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-brand-dark">
                      {CUSTOM_LABELS.includes(tier.price as string) ? '' : '₸'}
                      {tier.price}
                    </span>
                    {!CUSTOM_LABELS.includes(tier.price as string) && (
                      <span className="text-slate-400 font-medium">{t.pricing.perMonth}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8 md:mb-12 flex-1">
                  {tier.features.map((feature, fIdx) => (
                    <motion.div
                      key={fIdx}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + fIdx * 0.06 }}
                      className="flex items-center gap-4 text-sm text-slate-600 font-medium"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500"
                      >
                        <CheckCircle size={14} />
                      </motion.div>
                      {feature}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/register')}
                  className={cn(
                    'w-full py-5 rounded-2xl font-bold text-base transition-all relative overflow-hidden',
                    tier.popular
                      ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-xl shadow-brand-blue/20'
                      : 'bg-slate-100 text-brand-dark hover:bg-slate-200',
                  )}
                >
                  {tier.popular && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                      animate={{ translateX: ['-100%', '200%'] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5 }}
                    />
                  )}
                  {tier.cta}
                </motion.button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}