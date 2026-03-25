import Link from 'next/link'
import { Printer } from 'lucide-react'
import { UI_URLS } from '@/common/constants'

export function Footer() {
	return (
		<footer className='border-border bg-background border-t'>
			<div className='container mx-auto max-w-7xl px-4 py-10'>
				<div className='flex flex-col items-start justify-between gap-8 md:flex-row md:items-center'>
					{/* Logo */}
					<Link href={UI_URLS.HOME} className='flex items-center gap-2 transition-opacity hover:opacity-80'>
						<div className='bg-primary flex h-9 w-9 items-center justify-center rounded-lg'>
							<Printer className='text-primary-foreground h-5 w-5' />
						</div>
						<span className='gradient-text text-lg font-bold'>Filando</span>
					</Link>

					{/* Nav */}
					<nav className='flex flex-wrap gap-x-8 gap-y-2'>
						<Link
							href={UI_URLS.HOME}
							className='text-muted-foreground hover:text-primary text-sm transition-colors'
						>
							Головна
						</Link>
						<Link
							href={UI_URLS.CATALOG.FILAMENT}
							className='text-muted-foreground hover:text-primary text-sm transition-colors'
						>
							Філамент
						</Link>
					</nav>
				</div>

				<div className='border-border mt-8 border-t pt-6'>
					<p className='text-muted-foreground text-xs'>
						© {new Date().getFullYear()} Filando. Всі права захищені.
					</p>
				</div>
			</div>
		</footer>
	)
}
