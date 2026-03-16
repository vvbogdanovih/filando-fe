import { ReactNode } from 'react'
import { PrivateRoute } from '@/common/components/guards/PrivateRoute'
import { Role } from '@/common/constants'
import { UI_URLS } from '@/common/constants'
import { AdminSidebar } from './_components/AdminSidebar'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<PrivateRoute allowedRoles={[Role.ADMIN]} redirectTo={UI_URLS.HOME}>
			<div className='bg-muted flex h-screen w-full'>
				<AdminSidebar />
				<div className='flex-1 overflow-auto'>{children}</div>
			</div>
		</PrivateRoute>
	)
}
