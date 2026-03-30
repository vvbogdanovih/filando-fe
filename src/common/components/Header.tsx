'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Printer, LayoutDashboard, LogOut, ChevronDown, ShoppingCart } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { UI_URLS, Role } from '@/common/constants'
import { useAuthStore } from '@/common/store/useAuthStore'
import { useCartStore } from '@/common/store/useCartStore'
import { CartSidebar } from '@/common/components/CartSidebar'
import { cn } from '@/common/utils/shad-cn.utils'

const itemCls = cn(
	'flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors',
	'hover:bg-accent focus:bg-accent'
)

export function Header() {
	const user = useAuthStore(s => s.user)
	const logOut = useAuthStore(s => s.logOut)
	const resetServerCart = useCartStore(s => s.resetServerCart)
	const openCart = useCartStore(s => s.openCart)
	const items = useCartStore(s => s.items)
	const guestItems = useCartStore(s => s.guestItems)
	const router = useRouter()
	const isPrivileged = user?.role === Role.ADMIN || user?.role === Role.MODERATOR

	const totalCount = user
		? items.reduce((sum, i) => sum + i.quantity, 0)
		: guestItems.reduce((sum, i) => sum + i.quantity, 0)

	const handleLogout = async () => {
		await logOut()
		resetServerCart()
		router.push(UI_URLS.AUTH.LOGIN)
	}

	return (
		<>
		<header className='border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl'>
				<Link href='/' className='flex items-center gap-2 transition-opacity hover:opacity-80'>
					<div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
						<Printer className='text-primary-foreground h-6 w-6' />
					</div>
					<span className='gradient-text text-xl font-bold'>Filando</span>
				</Link>

				<nav className='hidden items-center gap-6 md:flex'>
					<Link href={UI_URLS.HOME} className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'>
						Головна
					</Link>
					<Link href={UI_URLS.CATALOG.FILAMENT} className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'>
						Матеріали
					</Link>
				</nav>

				<div className='flex items-center gap-2'>
					<div className='relative'>
						<button onClick={openCart} className='flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-card shadow-sm transition-colors hover:border-primary hover:text-primary'>
							<ShoppingCart className='h-4 w-4' />
						</button>
						{totalCount > 0 && (
							<span className='pointer-events-none absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
								{totalCount > 99 ? '99+' : totalCount}
							</span>
						)}
					</div>

					{!user ? (
						<Link
							href={UI_URLS.AUTH.LOGIN}
							className='flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary'
						>
							Увійти
						</Link>
					) : (
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild>
								<button className='flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-2 text-sm shadow-sm transition-colors hover:border-border focus:outline-none'>
									{user.picture ? (
										<img src={user.picture} alt={user.name} className='h-6 w-6 rounded-full object-cover' />
									) : (
										<div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground'>
											{user.name[0].toUpperCase()}
										</div>
									)}
									<span className='font-medium'>{user.name}</span>
									<ChevronDown className='h-3.5 w-3.5 text-muted-foreground' />
								</button>
							</DropdownMenu.Trigger>

							<DropdownMenu.Portal>
								<DropdownMenu.Content
									align='end'
									sideOffset={8}
									className='z-50 min-w-52 rounded-xl border border-border/50 bg-card p-1.5 shadow-lg shadow-black/10 animate-in fade-in-0 zoom-in-95'
								>
									<div className='px-3 py-2 mb-1 border-b border-border/50'>
										<p className='text-sm font-medium'>{user.name}</p>
										<p className='text-xs text-muted-foreground'>{user.email}</p>
										<span className='mt-1 inline-block rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize'>
											{user.role.toLowerCase()}
										</span>
									</div>

									{isPrivileged && (
										<DropdownMenu.Item asChild>
											<Link href={UI_URLS.ADMIN.BASE} className={itemCls}>
												<LayoutDashboard className='h-4 w-4 text-muted-foreground' />
												Панель адміністратора
											</Link>
										</DropdownMenu.Item>
									)}

									<DropdownMenu.Separator className='my-1 h-px bg-border/50' />

									<DropdownMenu.Item asChild>
										<button onClick={handleLogout} className={cn(itemCls, 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 w-full')}>
											<LogOut className='h-4 w-4' />
											Вийти
										</button>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					)}
				</div>
			</div>
		</header>
		<CartSidebar />
		</>
	)
}
