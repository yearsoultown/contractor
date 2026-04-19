'use client'

import { FloatingOrbs } from '@/components/ui/FloatingOrbs'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useTranslation } from '@/contexts/LanguageContext'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { HeroInteractive } from './HeroInteractive'

export function Hero() {
	const router = useRouter()
	const { t } = useTranslation()
	const titleWords1 = t.hero.title1.split(' ')
	const titleWords2 = t.hero.title2.split(' ')
	const prefersReduced = useReducedMotion()

	// On mobile / reduced-motion: animate the whole heading as one unit
	const isMobile = typeof window !== 'undefined'
		? !window.matchMedia('(min-width: 768px)').matches
		: false

	const simplifiedTitle = prefersReduced || isMobile

	return (
		<section className='relative pt-24 md:pt-40 pb-16 md:pb-32 px-4 md:px-6 overflow-hidden bg-white'>
			<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none'>
				{/* Pulsing blur — desktop only (too expensive on mobile GPU) */}
				<motion.div
					animate={simplifiedTitle ? {} : { scale: [1, 1.05, 1], opacity: [0.03, 0.06, 0.03] }}
					transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
					className='absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-brand-blue rounded-full blur-[120px] opacity-[0.04] hidden md:block'
				/>
				<div className='absolute bottom-[5%] right-[-10%] w-[40%] h-[40%] bg-slate-100/50 blur-[100px] rounded-full hidden md:block' />
				<FloatingOrbs />
			</div>

			<div className='max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-center'>
				<div className='lg:col-span-7 text-left'>
					<h1 className='text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tight text-brand-dark mb-5 md:mb-8 leading-[1.05] text-balance'>
						{simplifiedTitle ? (
							// Single fade-in for the whole heading on mobile — no per-word motion divs
							<motion.span
								className='block'
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
							>
								<span className='block'>{t.hero.title1}</span>
								<span className='block text-brand-blue'>{t.hero.title2}</span>
							</motion.span>
						) : (
							<>
								<span className='block'>
									{titleWords1.map((word, i) => (
										<motion.span
											key={`w1-${i}`}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.2 + i * 0.08,
												duration: 0.6,
												ease: [0.16, 1, 0.3, 1]
											}}
											className='inline-block mr-[0.2em] last:mr-0'
										>
											{word}
										</motion.span>
									))}
								</span>
								<span className='block text-brand-blue'>
									{titleWords2.map((word, i) => (
										<motion.span
											key={`w2-${i}`}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.2 + (titleWords1.length + i) * 0.08,
												duration: 0.6,
												ease: [0.16, 1, 0.3, 1]
											}}
											className='inline-block mr-[0.2em] last:mr-0'
										>
											{word}
										</motion.span>
									))}
								</span>
							</>
						)}
					</h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: simplifiedTitle ? 0.2 : 0.5, duration: 0.6 }}
						className='text-base md:text-xl lg:text-2xl text-slate-500 max-w-2xl mb-8 md:mb-12 leading-relaxed font-medium'
					>
						{t.hero.subtitle}
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: simplifiedTitle ? 0.3 : 0.65, duration: 0.6 }}
						className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5'
					>
						<MagneticButton
							onClick={() => router.push('/register')}
							className='w-full sm:w-auto bg-brand-blue text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3'
						>
							{t.hero.createContract}
							<motion.span
								animate={simplifiedTitle ? {} : { x: [0, 4, 0] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: 'easeInOut'
								}}
								className='inline-block'
							>
								<ArrowRight size={22} />
							</motion.span>
						</MagneticButton>
					</motion.div>
				</div>

				<div className='lg:col-span-5 relative'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
						animate={{ opacity: 1, scale: 1, rotate: 0 }}
						transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className='relative z-10'
					>
						<div className='glass-card rounded-[2.5rem] p-2 shadow-2xl overflow-hidden bg-white/40 border-white/60'>
							<div className='rounded-[2rem] overflow-hidden border border-slate-200/60 bg-white relative h-auto min-h-[460px] sm:h-[460px] md:h-[600px] flex flex-col'>
								<HeroInteractive />
							</div>
						</div>
					</motion.div>
					<div className='absolute -bottom-20 -left-20 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10 hidden md:block' />
				</div>
			</div>
		</section>
	)
}