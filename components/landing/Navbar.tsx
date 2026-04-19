'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Lang } from '@/lib/i18n'

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const { t, lang, setLang } = useTranslation()
	const { scrollY } = useScroll()
	const backgroundColor = useTransform(
		scrollY,
		[0, 100],
		['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']
	)
	const backdropFilter = useTransform(
		scrollY,
		[0, 100],
		['blur(0px)', 'blur(16px)']
	)

	const navLinks = [
		{ name: t.nav.features, href: '#features' },
		{ name: t.nav.howItWorks, href: '#how-it-works' },
		{ name: t.nav.cases, href: '#use-cases' }
		// { name: t.nav.pricing, href: '#pricing' },
	]

	return (
		<nav className='fixed top-0 left-0 right-0 z-50 flex flex-col items-center p-4 md:p-6 transition-all duration-300'>
			<motion.div
				style={{ backgroundColor, backdropFilter }}
				className='w-full max-w-6xl rounded-2xl px-5 py-3 md:px-8 md:py-4 flex items-center justify-between border border-transparent hover:border-slate-200/60 transition-all duration-500'
			>
				<motion.div
					whileHover={{ scale: 1.05 }}
					transition={{ type: 'spring', stiffness: 400, damping: 20 }}
					className='flex items-center gap-3 cursor-pointer'
					onClick={() => router.push('/')}
				>
					<motion.div
						whileHover={{ rotate: [0, -10, 10, 0] }}
						transition={{ duration: 0.4 }}
						className='w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-blue/20'
					>
						{t.common.appInitial}
					</motion.div>
					<span className='font-display font-bold text-2xl tracking-tight text-brand-dark'>
						{t.common.appName}
					</span>
				</motion.div>

				<div className='hidden md:flex items-center gap-10'>
					{navLinks.map((item, i) => (
						<motion.div
							key={item.href}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.05 + i * 0.07, duration: 0.4 }}
						>
							<Link
								href={item.href}
								className='text-sm font-medium text-slate-500 hover:text-brand-blue transition-colors relative group'
							>
								{item.name}
								<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-300 group-hover:w-full' />
							</Link>
						</motion.div>
					))}
				</div>

			<div className='flex items-center gap-2 sm:gap-3'>
				{/* Language switcher visible on desktop only — on mobile it lives in the hamburger menu */}
				<div className='hidden md:block'>
					<LanguageSwitcher variant='dark' />
				</div>
				<button
					onClick={() => router.push('/login')}
					className='hidden sm:block text-sm font-semibold text-slate-600 hover:text-brand-dark px-4 py-2 transition-colors'
				>
					{t.nav.login}
				</button>
				<motion.button
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					onClick={() => router.push('/register')}
					className='hidden sm:block bg-brand-dark text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-sm'
				>
					{t.nav.cta}
				</motion.button>
				<button
					className='md:hidden p-2 text-brand-dark'
					onClick={() => setIsOpen(!isOpen)}
				>
					<AnimatePresence mode='wait' initial={false}>
						<motion.div
							key={isOpen ? 'close' : 'open'}
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</motion.div>
					</AnimatePresence>
				</button>
			</div>
			</motion.div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0, y: -8 }}
						animate={{ opacity: 1, height: 'auto', y: 0 }}
						exit={{ opacity: 0, height: 0, y: -8 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className='w-full max-w-6xl overflow-hidden'
					>
						<div className='bg-white/90 backdrop-blur-xl rounded-2xl mt-2 px-6 py-4 flex flex-col gap-3 border border-slate-200/60 shadow-xl'>
							{navLinks.map((item, i) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0, x: -12 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.05, duration: 0.3 }}
								>
									<Link
										href={item.href}
										className='block py-2 text-sm font-semibold text-slate-700 hover:text-brand-blue transition-colors'
										onClick={() => setIsOpen(false)}
									>
										{item.name}
									</Link>
								</motion.div>
							))}

							{/* Language switcher — inline row inside hamburger menu */}
							<div className='border-t border-slate-100 pt-3'>
								<p className='text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2'>{t.common.language}</p>
								<div className='flex gap-2'>
									{(['ru', 'kz', 'en'] as Lang[]).map((code) => {
										const labels: Record<Lang, string> = { ru: 'Русский', kz: 'Қазақша', en: 'English' }
										return (
											<button
												key={code}
												onClick={() => setLang(code)}
												className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
													lang === code
														? 'bg-brand-blue text-white shadow-sm'
														: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
												}`}
											>
												{labels[code]}
											</button>
										)
									})}
								</div>
							</div>

							<div className='border-t border-slate-100 pt-3 flex gap-3'>
								<button
									onClick={() => router.push('/login')}
									className='flex-1 text-sm font-semibold text-slate-600 py-2 text-center hover:text-brand-dark transition-colors'
								>
									{t.nav.login}
								</button>
								<button
									onClick={() => router.push('/register')}
									className='flex-1 bg-brand-dark text-white text-sm font-bold py-2 rounded-xl'
								>
									{t.nav.cta}
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	)
}