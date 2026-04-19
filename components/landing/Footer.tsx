'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Globe, Shield } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export function Footer() {
	const { t } = useTranslation()

	return (
		<footer className='bg-white pt-16 md:pt-32 pb-12 px-6 border-t border-slate-100'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-16 mb-16 md:mb-24'>
					<div className='col-span-2'>
						<div className='flex items-center gap-3 mb-8'>
							<motion.div
								whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
								transition={{ duration: 0.4 }}
								className='w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-blue/20 cursor-pointer'
							>
								{t.common.appInitial}
							</motion.div>
							<span className='font-display font-bold text-2xl tracking-tight text-brand-dark'>
								{t.common.appName}
							</span>
						</div>
						<p className='text-slate-500 text-base font-medium max-w-xs mb-10 leading-relaxed'>
							{t.footer.tagline}
						</p>
						{/*<div className="flex gap-5">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <motion.div
                  key={social}
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: '#0052FF',
                    color: '#ffffff',
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 cursor-pointer shadow-sm"
                >
                  <Globe size={18} />
                </motion.div>
              ))}
            </div>*/}
					</div>

					<div>
						<h4 className='font-bold text-sm mb-8 text-brand-dark uppercase tracking-widest'>
							{t.footer.product}
						</h4>
						<ul className='space-y-5 text-sm text-slate-500 font-medium'>
							{t.footer.productLinks.map(link => (
								<motion.li
									key={link}
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}
								>
									<Link
										href='#'
										className='hover:text-brand-blue transition-colors'
									>
										{link}
									</Link>
								</motion.li>
							))}
						</ul>
					</div>

					<div>
						<h4 className='font-bold text-sm mb-8 text-brand-dark uppercase tracking-widest'>
							{t.footer.company}
						</h4>
						<ul className='space-y-5 text-sm text-slate-500 font-medium'>
							{t.footer.companyLinks.map(link => (
								<motion.li
									key={link}
									whileHover={{ x: 4 }}
									transition={{ duration: 0.2 }}
								>
									<Link
										href='#'
										className='hover:text-brand-blue transition-colors'
									>
										{link}
									</Link>
								</motion.li>
							))}
						</ul>
					</div>

					<div className='col-span-2'>
						<h4 className='font-bold text-sm mb-8 text-brand-dark uppercase tracking-widest'>
							{t.footer.newsletter}
						</h4>
						<p className='text-sm text-slate-500 mb-6 font-medium'>
							{t.footer.newsletterText}
						</p>
						<div className='flex flex-col sm:flex-row gap-3'>
							<input
								type='email'
								placeholder={t.footer.emailPlaceholder}
								className='bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm w-full outline-none focus:border-brand-blue transition-colors'
							/>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.97 }}
								className='bg-brand-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all'
							>
								OK
							</motion.button>
						</div>
					</div>
				</div>

				<div className='flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 gap-8'>
					<p className='text-slate-400 text-xs font-medium'>
						{t.footer.copyright}
					</p>
					<div className='flex items-center gap-6'>
						<LanguageSwitcher variant='dark' />
						{/*<div className='flex items-center gap-2 text-xs text-slate-400 font-medium'>
							<Shield size={14} />
							<span>{t.footer.secureConnection}</span>
						</div>*/}
					</div>
				</div>
			</div>
		</footer>
	)
}