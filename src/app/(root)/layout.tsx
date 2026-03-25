import { ReactNode } from 'react'
import { Header } from '@/common/components/Header'
import { Footer } from '@/common/components/Footer'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<Header />
			<div className='flex-1'>{children}</div>
			<Footer />
		</div>
	)
}
