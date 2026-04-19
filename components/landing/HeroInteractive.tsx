'use client'

import { CheckCircle, FileText, Sparkles, Zap } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/contexts/LanguageContext'

export function HeroInteractive() {
  const { t } = useTranslation()
  const fields = t.heroInteractive.fields
  const [step, setStep] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const prefersReduced = useReducedMotion()

  // Detect mobile once on mount
  const isMobile = useRef(
    typeof window !== 'undefined'
      ? !window.matchMedia('(min-width: 768px)').matches
      : false
  )

  // Slower cycle on mobile to reduce layout/paint pressure
  const interval = isMobile.current ? 2800 : 1800

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % (fields.length + 2)
        if (next === fields.length + 1) setShowNotif(true)
        if (next === 0) setShowNotif(false)
        return next
      })
    }, interval)
    return () => clearInterval(timer)
  }, [fields.length, interval])

  const currentStep = step % (fields.length + 1)

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/60 flex flex-col overflow-hidden h-full relative">
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-3 right-3 z-20 bg-white border border-slate-200 shadow-lg rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={13} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-dark leading-none mb-0.5">{t.heroInteractive.notifTitle}</p>
              <p className="text-[9px] text-slate-400 font-medium">{t.heroInteractive.notifFile}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-brand-soft-blue border-b border-brand-blue/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-blue flex items-center justify-center">
          <FileText size={15} className="text-white w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] sm:text-xs font-bold text-brand-dark">{t.heroInteractive.title}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{t.heroInteractive.subtitle}</p>
        </div>
      </div>

      <div className="px-4 py-2 sm:px-6 sm:py-3 bg-slate-50/60 border-b border-slate-100">
        <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-400 font-bold mb-2">
          <span>{t.heroInteractive.progress}</span>
          <span>{Math.round((Math.min(currentStep, fields.length) / fields.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-blue rounded-full"
            animate={{ width: `${(Math.min(currentStep, fields.length) / fields.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-5 space-y-2 sm:space-y-3 overflow-hidden">
        {fields.map((field, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          return (
            <motion.div
              key={i}
              animate={{
                borderColor: isActive ? '#0052FF' : isDone ? '#10b981' : '#f1f5f9',
                backgroundColor: isActive
                  ? 'rgba(0,82,255,0.03)'
                  : isDone
                    ? 'rgba(16,185,129,0.03)'
                    : '#fafafa',
              }}
              transition={{ duration: 0.3 }}
              className="p-3 sm:p-4 rounded-xl border-2"
            >
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{field.label}</p>
              {isDone ? (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm font-bold text-brand-dark">{field.value}</p>
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle size={14} className="text-emerald-500" />
                  </motion.div>
                </motion.div>
              ) : isActive ? (
                <motion.p
                  key={`active-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-bold text-brand-dark flex items-center gap-1"
                >
                  {field.value}
                  {/* Blinking cursor — skip on mobile/reduced-motion */}
                  {!isMobile.current && !prefersReduced && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-brand-blue ml-0.5"
                    />
                  )}
                </motion.p>
              ) : (
                <div className="h-4 w-24 bg-slate-200 rounded-md" />
              )}
            </motion.div>
          )
        })}

        {/* AI status pulse — skip infinite animation on mobile */}
        <div className={`p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 ${!isMobile.current ? '' : ''}`}>
          {!isMobile.current ? (
            <motion.div
              className="contents"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Sparkles size={14} className="text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-emerald-700 font-semibold">{t.heroInteractive.aiCheck}</p>
            </motion.div>
          ) : (
            <>
              <Sparkles size={14} className="text-emerald-500 flex-shrink-0" />
              <p className="text-[11px] text-emerald-700 font-semibold">{t.heroInteractive.aiCheck}</p>
            </>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-5 border-t border-slate-100">
        <button
          className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {/* Shimmer sweep — desktop only */}
          {!isMobile.current && !prefersReduced && (
            <motion.span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
              animate={{ translateX: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            />
          )}
          <Zap size={15} fill="currentColor" />
          {t.heroInteractive.generateBtn}
        </button>
      </div>
    </div>
  )
}