'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import api from '@/lib/api'
import { trackVisit } from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { AuthResponse } from '@/types'
import { useTranslation } from '@/contexts/LanguageContext'
import { useToast } from '@/contexts/ToastContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { AuthDecorPanel } from '@/components/auth/AuthDecorPanel'

export default function RegisterPage() {
	const router = useRouter()
	const { t } = useTranslation()
	const toast = useToast()
	const [form, setForm] = useState({ email: '', password: '', full_name: '' })
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		trackVisit()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			const res = await api.post<AuthResponse>('/auth/register', form)
			saveAuth(res.data.token, res.data.user)
			toast.success(t.toast.registerSuccess, t.toast.registerSuccessDesc)
			router.push('/dashboard')
		} catch (err: unknown) {
			const errorMessage =
				(err as { response?: { data?: { error?: string } } })?.response?.data
					?.error || t.register.errorDefault
			toast.error(t.toast.registerError, errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-white flex'>
			<AuthDecorPanel
				title={t.register.decorTitle}
				subtitle={t.register.decorSubtitle}
			>
				<div className='grid grid-cols-2 gap-6'>
					{t.register.decorFeatures.map(f => (
						<div key={f} className='flex items-center gap-2'>
							<div className='w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center'>
								<div className='w-2 h-2 rounded-full bg-brand-blue' />
							</div>
							<span className='text-slate-300 text-sm font-medium'>{f}</span>
						</div>
					))}
				</div>
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
						{t.register.title}
					</h1>
					<p className='text-slate-500 mb-10'>
						{t.register.hasAccount}{' '}
						<Link
							href='/login'
							className='text-brand-blue font-semibold hover:underline'
						>
							{t.register.loginLink}
						</Link>
					</p>

					<form onSubmit={handleSubmit} className='space-y-5'>
						<div>
							<label className='block text-sm font-bold text-slate-700 mb-2'>
								{t.register.nameLabel}
							</label>
							<div className='relative'>
								<User
									size={18}
									className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
								/>
								<input
									type='text'
									value={form.full_name}
									onChange={e =>
										setForm({ ...form, full_name: e.target.value })
									}
									placeholder={t.register.namePlaceholder}
									className='w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all'
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-bold text-slate-700 mb-2'>
								{t.register.emailLabel}
							</label>
							<div className='relative'>
								<Mail
									size={18}
									className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
								/>
								<input
									type='email'
									required
									value={form.email}
									onChange={e => setForm({ ...form, email: e.target.value })}
									placeholder={t.register.emailPlaceholder}
									className='w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all'
								/>
							</div>
						</div>
						<div>
							<label className='block text-sm font-bold text-slate-700 mb-2'>
								{t.register.passwordLabel}{' '}
								<span className='text-slate-400 font-normal'>
									{t.register.passwordHint}
								</span>
							</label>
							<div className='relative'>
								<Lock
									size={18}
									className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
								/>
								<input
									type='password'
									required
									minLength={8}
									value={form.password}
									onChange={e => setForm({ ...form, password: e.target.value })}
									placeholder={t.register.passwordPlaceholder}
									className='w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all'
								/>
							</div>
						</div>
						<button
							type='submit'
							disabled={loading}
							className='w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-base hover:bg-blue-700 transition-all shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-60'
						>
							{loading ? t.register.submitting : t.register.submit}
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