import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/common/components/ui/button'
import { UI_URLS } from '@/common/constants'

export const Products = () => {
	return (
		<div className='flex h-full flex-col'>
			<div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
				<h1 className='text-lg font-semibold text-gray-900'>Продукти</h1>
				<Button asChild size='sm'>
					<Link href={UI_URLS.ADMIN.CREATE_PRODUCT}>
						<PlusIcon className='size-4' />
						Новий продукт
					</Link>
				</Button>
			</div>

			<div className='flex flex-1 items-center justify-center'>
				<p className='text-sm text-gray-400'>Список продуктів буде тут</p>
			</div>
		</div>
	)
}
