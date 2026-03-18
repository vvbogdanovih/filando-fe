'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Tag, Palette, LogOut, Store } from 'lucide-react'
import { useAuthStore } from '@/common/store/useAuthStore'
import { UI_URLS } from '@/common/constants'
import { Button } from '@/common/components/ui/button'

const navItems = [
	{ label: 'Dashboard', href: UI_URLS.ADMIN.BASE, icon: LayoutDashboard },
	{ label: 'Users', href: UI_URLS.ADMIN.USERS, icon: Users },
	{ label: 'Categories', href: UI_URLS.ADMIN.CATEGORIES, icon: Tag },
	{ label: 'Vendors', href: UI_URLS.ADMIN.VENDORS, icon: Store },
	{ label: 'Style Guide', href: UI_URLS.ADMIN.STYLE_GUIDE, icon: Palette }
]

export const AdminSidebar = () => {
	const pathname = usePathname()
	const router = useRouter()
	const user = useAuthStore(state => state.getUser())
	const logOut = useAuthStore(state => state.logOut)

	const handleLogout = async () => {
		await logOut()
		router.push(UI_URLS.AUTH.LOGIN)
	}

	return (
		<aside className='flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white'>
			<div className='border-b border-gray-200 px-6 py-5'>
				<span className='text-lg font-semibold text-gray-900'>Filando Admin</span>
			</div>

			<nav className='flex-1 px-3 py-4'>
				{navItems.map(({ label, href, icon: Icon }) => {
					const isActive = pathname === href
					return (
						<Link
							key={href}
							href={href}
							className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
								isActive
									? 'bg-gray-100 font-medium text-gray-900'
									: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
							}`}
						>
							<Icon size={16} />
							{label}
						</Link>
					)
				})}
			</nav>

			<div className='border-t border-gray-200 px-4 py-4'>
				<div className='mb-3 px-1'>
					<p className='text-sm font-medium text-gray-900'>{user?.name}</p>
					<p className='text-xs text-gray-500'>{user?.email}</p>
				</div>
				<Button
					onClick={handleLogout}
					className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm'
				>
					<LogOut size={16} /> Logout
				</Button>
			</div>
		</aside>
	)
}
