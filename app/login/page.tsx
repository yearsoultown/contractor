'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import api from '@/lib/api'
import { trackVisit } from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { AuthResponse } from '@/types'
import { useTranslation } from '@/contexts/LanguageContext'
import { useToast } from '@/contexts/ToastContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AuthDecorPanel } from '@/components/auth/AuthDecorPanel'
// let a: int;
export default function LoginPage() {
	const router = useRouter()
	const { t } = useTranslation()
	const toast = useToast()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		trackVisit()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			const res = await api.post<AuthResponse>('/auth/login', {
				email,
				password
			})
			saveAuth(res.data.token, res.data.user)
			toast.success(t.toast.loginSuccess, t.toast.loginSuccessDesc)
			router.push('/dashboard')
		} catch (err: unknown) {
			const errorMessage =
				(err as { response?: { data?: { error?: string } } })?.response?.data
					?.error || t.login.errorDefault
			toast.error(t.toast.loginError, errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-white flex'>
			<AuthDecorPanel
				title={t.login.decorTitle}
				subtitle={t.login.decorSubtitle}
			>
				<div className='flex -space-x-2'>
					{[1, 2, 3].map(i => (
						<div
							key={i}
							className='w-10 h-10 rounded-full bg-slate-700 border-2 border-brand-dark'
						/>
					))}
				</div>
				<p className='text-slate-400 text-sm font-medium'>
					{t.login.decorUsers}
				</p>
			</AuthDecorPanel>

			<div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
				<div className='w-full max-w-md'>
					<div className='flex items-center justify-between mb-12'>
						<div className='lg:hidden flex items-center gap-3'>
							<div className='w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold'>
								{t.common.appInitial}
							</div>
							<span className='font-display font-bold text-2xl tracking-tight text-brand-dark'>
								{t.common.appName}
							</span>
						</div>
						<div className='lg:hidden ml-auto'>
							<LanguageSwitcher variant='dark' />
						</div>
					</div>

					<h1 className='text-3xl font-display font-bold text-brand-dark mb-2'>
						{t.login.title}
					</h1>
					<p className='text-slate-500 mb-10'>
						{t.login.noAccount}{' '}
						<Link
							href='/register'
							className='text-brand-blue font-semibold hover:underline'
						>
							{t.login.registerLink}
						</Link>
					</p>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label className='block text-sm font-bold text-slate-700 mb-2'>
								{t.login.emailLabel}
							</label>
							<div className='relative'>
								<Mail
									size={18}
									className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
								/>
								<input
									type='email'
									required
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder={t.login.emailPlaceholder}
									className='w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all'
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-bold text-slate-700 mb-2'>
								{t.login.passwordLabel}
							</label>
							<div className='relative'>
								<Lock
									size={18}
									className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
								/>
								<input
									type='password'
									required
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder={t.login.passwordPlaceholder}
									className='w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all'
								/>
							</div>
						</div>
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-60'
						>
							{loading ? t.login.submitting : t.login.submit}
							{!loading && (
								<ArrowRight
									size={20}
									className='group-hover:translate-x-1 transition-transform'
								/>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}