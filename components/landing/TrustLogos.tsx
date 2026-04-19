'use client'

import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'

const LOGOS = ['AstanaHub', 'Kaspi.kz', 'Choco', 'Freedom', 'AIFC']

export function TrustLogos() {
  const { t } = useTranslation()

  return (
    <section className="py-20 border-y border-slate-100 bg-slate-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:w-1/3"
        >
          <h3 className="text-2xl font-display font-bold text-brand-dark mb-4 leading-tight">{t.trust.title}</h3>
          <p className="text-slate-400 text-sm font-medium">{t.trust.subtitle}</p>
        </motion.div>

        <div className="md:w-2/3 w-full relative overflow-hidden flex items-center">
          {/* Fades for smooth entry/exit of logos */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-slate-50/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-slate-50/20 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] md:animate-none md:[transform:none!important] md:w-full md:justify-end md:flex-wrap items-center gap-12 md:gap-20">
            {/* Double the logos for seamless infinite scroll on mobile */}
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <motion.div
                key={`${logo}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 0.35, y: 0 }}
                whileHover={{ opacity: 1, scale: 1.08 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "font-display font-bold text-2xl text-slate-400 cursor-pointer grayscale hover:grayscale-0 hover:text-brand-blue transition-colors flex-shrink-0 flex items-center justify-center",
                  // Hide the duplicated logos on desktop where we don't need marquee
                  i >= LOGOS.length ? "md:hidden" : ""
                )}
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}