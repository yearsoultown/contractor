'use client'

import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { ChevronRight, Languages, Lock, Shield, Users, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { AnimatedMetric } from './AnimatedMetric'

const ICONS = [
  <Zap className="text-brand-blue" />,
  <Shield className="text-emerald-500" />,
  <Languages className="text-indigo-500" />,
  <Users className="text-brand-blue" />,
  <Lock className="text-slate-700" />,
]

const CARD_CLASSES = [
  'md:col-span-2 md:row-span-2 bg-brand-soft-blue/40 border-brand-blue/5',
  'md:col-span-2 bg-slate-50/50',
  'md:col-span-1 bg-slate-50/50',
  'md:col-span-1 bg-slate-50/50',
  'md:col-span-2 bg-slate-50/50',
]

export function Features() {
  const { t } = useTranslation()

  return (
    <section id="features" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-display font-bold tracking-tight text-brand-dark mb-3 md:mb-6">
              {t.features.sectionTitle}
            </h2>
            <p className="text-base sm:text-xl text-slate-500 font-medium">{t.features.sectionSubtitle}</p>
          </motion.div>
          <div className="flex-shrink-0">
            <motion.button whileHover={{ x: 4 }} className="text-brand-blue font-bold flex items-center gap-2">
              {t.features.allFeatures} <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {t.features.items.map((feature, idx) => (
            <SpotlightCard
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}
              className={cn(
                'p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col justify-between transition-all duration-500',
                CARD_CLASSES[idx],
              )}
            >
              <div>
                <motion.div
                  whileHover={{ scale: 1.12, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 md:mb-8"
                >
                  {ICONS[idx]}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-brand-dark">{feature.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{feature.description}</p>
              </div>
              {idx === 0 && <AnimatedMetric />}
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}