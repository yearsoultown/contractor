'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { Shield, Lock, Users } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useEffect, useRef } from 'react'

export function CtaSection() {
	const router = useRouter()
	const { t } = useTranslation()
	const isMobile = useRef(
		typeof window !== 'undefined'
			? !window.matchMedia('(min-width: 768px)').matches
			: false
	)

	return (
		<section className='section-padding'>
			<div className='max-w-7xl mx-auto bg-brand-dark rounded-[2rem] md:rounded-[4rem] p-8 sm:p-16 md:p-24 lg:p-32 text-center text-white relative overflow-hidden'>
				{/* Pulsing rings — desktop only */}
				{!isMobile.current && [1, 2, 3].map(ring => (
					<motion.div
						key={ring}
						className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-blue/15 pointer-events-none'
						animate={{
							width: [`${ring * 12}%`, `${ring * 28}%`],
							height: [`${ring * 12}%`, `${ring * 28}%`],
							opacity: [0.5, 0]
						}}
						transition={{
							duration: 3,
							delay: ring * 0.7,
							repeat: Infinity,
							ease: 'easeOut'
						}}
					/>
				))}
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-blue/[0.03] blur-[150px] rounded-full -z-10' />

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2 className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 md:mb-10 leading-[1.05] tracking-tight'>
						{t.cta.title1} <br className='hidden md:block' /> {t.cta.title2}
					</h2>
					<p className='text-slate-400 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 md:mb-16 leading-relaxed font-medium'>
						{t.cta.subtitle}
					</p>
					<div className='flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6'>
						<MagneticButton
							onClick={() => router.push('/register')}
							className='w-full sm:w-auto bg-brand-blue text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-xl hover:bg-blue-600 transition-all shadow-2xl shadow-brand-blue/30'
						>
							{t.cta.primary}
						</MagneticButton>
						{/*<motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold text-base md:text-xl transition-all"
            >
              {t.cta.secondary}
            </motion.button>*/}
					</div>

					<div className='mt-10 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 opacity-50'>
						{[
							{
								icon: <Shield size={18} className='text-brand-blue' />,
								text: t.cta.badge1
							},
							{
								icon: <Lock size={18} className='text-brand-blue' />,
								text: t.cta.badge2
							},
							{
								icon: <Users size={18} className='text-brand-blue' />,
								text: t.cta.badge3
							}
						].map((b, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className='flex items-center gap-3'
							>
								{b.icon}
								<span className='text-xs font-bold uppercase tracking-widest'>
									{b.text}
								</span>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}