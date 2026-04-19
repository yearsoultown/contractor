'use client'

import { useTranslation } from '@/contexts/LanguageContext'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { DashboardInteractive } from './DashboardInteractive'
import { useRouter } from 'next/navigation'

export function DashboardPreviewSection() {
	const { t } = useTranslation()
	const router = useRouter()

	return (
		<section className='section-padding bg-slate-50/30 overflow-hidden'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid lg:grid-cols-2 gap-16 lg:gap-32 items-center'>
					<div className='relative order-2 lg:order-1'>
						<DashboardInteractive />
						<div className='absolute -top-20 -right-20 w-96 h-96 bg-brand-blue/[0.02] rounded-full blur-3xl -z-10' />
					</div>

					<div className='order-1 lg:order-2'>
						<motion.span
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							className='text-brand-blue font-bold text-sm tracking-widest uppercase mb-6 block'
						>
							{t.preview.label}
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className='text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-8 leading-[1.1] text-brand-dark'
						>
							{t.preview.title}
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className='text-base md:text-xl text-slate-500 mb-8 md:mb-12 leading-relaxed font-medium'
						>
							{t.preview.subtitle}
						</motion.p>

						<div className='grid gap-4 md:gap-6 mb-8 md:mb-12'>
							{t.preview.points.map((item, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: -10 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ delay: i * 0.1 }}
									className='flex items-center gap-3 text-brand-dark font-bold text-base md:text-lg'
								>
									<motion.div
										whileHover={{ scale: 1.2, rotate: 10 }}
										className='w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500'
									>
										<CheckCircle size={18} />
									</motion.div>
									{item}
								</motion.div>
							))}
						</div>

						<motion.button
							onClick={() => router.push('/register')}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full sm:w-auto bg-brand-dark text-white px-6 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95'
						>
							{t.preview.cta}{' '}
							<ChevronRight
								size={22}
								className='w-5 h-5 sm:w-[22px] sm:h-[22px]'
							/>
						</motion.button>
					</div>
				</div>
			</div>
		</section>
	)
}