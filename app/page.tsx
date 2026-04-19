'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { TrustLogos } from '@/components/landing/TrustLogos'
import { Features } from '@/components/landing/Features'
import { DashboardPreviewSection } from '@/components/landing/DashboardPreviewSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { UseCases } from '@/components/landing/UseCases'
import { Pricing } from '@/components/landing/Pricing'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/landing/Footer'
import { trackVisit } from '@/lib/api'

export default function LandingPage() {
	const router = useRouter()

	useEffect(() => {
		if (isAuthenticated()) {
			router.push('/dashboard')
			return
		}
		trackVisit()
	}, [router])

	return (
		<main className='min-h-screen bg-white'>
			{/*<ScrollProgress />*/}
			<Navbar />
			<Hero />
			{/*<TrustLogos />*/}
			<Features />
			<DashboardPreviewSection />
			<HowItWorks />
			<UseCases />
			{/*<Pricing />*/}
			<CtaSection />
			<Footer />
		</main>
	)
}