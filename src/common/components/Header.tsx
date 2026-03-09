'use client'

import Link from 'next/link'
import { Printer } from 'lucide-react'

export function Header() {
	return (
		<header className='sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4'>
				<Link
					href='/'
					className='flex items-center gap-2 transition-opacity hover:opacity-80'
				>
					<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
						<Printer className='h-6 w-6 text-primary-foreground' />
					</div>
					<span className='text-xl font-bold'>
						<span className='gradient-text'>Filando</span>
						<span className='text-foreground'> Style Guide</span>
					</span>
				</Link>

				<nav className='hidden items-center gap-6 md:flex'>
					<Link
						href='/'
						className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
					>
						Головна
					</Link>
					<Link
						href='/style-guide'
						className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
					>
						Style Guide
					</Link>
				</nav>
			</div>
		</header>
	)
}
