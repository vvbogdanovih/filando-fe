'use client'

import Link from 'next/link'
import { Printer } from 'lucide-react'
import { UI_URLS } from '@/common/constants'

export function Header() {
	return (
		<header className='border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg '>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl'>
				<Link
					href='/'
					className='flex items-center gap-2 transition-opacity hover:opacity-80'
				>
					<div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
						<Printer className='text-primary-foreground h-6 w-6' />
					</div>
					<span className='gradient-text text-xl font-bold'>Filando</span>
				</Link>

				<nav className='hidden items-center gap-6 md:flex'>
					<Link
						href={UI_URLS.HOME}
						className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'
					>
						Головна
					</Link>
					<Link
						href={UI_URLS.CATALOG.FILAMENT}
						className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'
					>
						Матеріали
					</Link>
				</nav>
			</div>
		</header>
	)
}
