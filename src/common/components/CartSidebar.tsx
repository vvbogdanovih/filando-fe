'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Minus, Plus, Trash2, Package } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useAuthStore } from '@/common/store/useAuthStore'
import { useCartStore } from '@/common/store/useCartStore'
import { UI_URLS } from '@/common/constants'
import { cn } from '@/common/utils/shad-cn.utils'

export function CartSidebar() {
	const isOpen = useCartStore(s => s.isOpen)
	const closeCart = useCartStore(s => s.closeCart)
	const items = useCartStore(s => s.items)
	const guestItems = useCartStore(s => s.guestItems)
	const updateQuantity = useCartStore(s => s.updateQuantity)
	const removeItem = useCartStore(s => s.removeItem)
	const removeGuestItem = useCartStore(s => s.removeGuestItem)
	const setGuestItemQuantity = useCartStore(s => s.setGuestItemQuantity)
	const user = useAuthStore(s => s.user)

	const isAuth = !!user

	const displayItems = isAuth
		? items.map(i => ({
				variant_id: i.variant_id,
				quantity: i.quantity,
				name: i.variant.name,
				price: i.variant.price,
				thumbnail: i.variant.thumbnail,
				stock: i.variant.stock,
				slug: i.variant.slug,
		  }))
		: guestItems.map(i => ({
				variant_id: i.variant_id,
				quantity: i.quantity,
				name: i._meta?.name ?? i.variant_id,
				price: i._meta?.price ?? 0,
				thumbnail: i._meta?.thumbnail ?? null,
				stock: undefined as number | undefined,
				slug: i._meta?.slug ?? null,
		  }))

	const total = displayItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
	const isEmpty = displayItems.length === 0

	const handleDecrease = (variantId: string, current: number) => {
		if (current <= 1) return
		if (isAuth) {
			updateQuantity(variantId, current - 1)
		} else {
			setGuestItemQuantity(variantId, current - 1)
		}
	}

	const handleIncrease = (variantId: string, current: number, stock?: number) => {
		if (stock !== undefined && current >= stock) return
		if (isAuth) {
			updateQuantity(variantId, current + 1)
		} else {
			setGuestItemQuantity(variantId, current + 1)
		}
	}

	const handleRemove = (variantId: string) => {
		if (isAuth) {
			removeItem(variantId)
		} else {
			removeGuestItem(variantId)
		}
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={open => !open && closeCart()}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300' />
				<Dialog.Content
					aria-describedby={undefined}
					className={cn(
						'fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl outline-none',
						'data-[state=open]:animate-in data-[state=closed]:animate-out',
						'data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
						'duration-300'
					)}
				>
					{/* Header */}
					<div className='flex items-center justify-between border-b border-border/50 px-5 py-4'>
						<Dialog.Title className='flex items-center gap-2 text-base font-semibold'>
							<ShoppingCart className='h-4 w-4 text-primary' />
							Кошик
							{!isEmpty && (
								<span className='text-sm font-normal text-muted-foreground'>
									({displayItems.length})
								</span>
							)}
						</Dialog.Title>
						<Dialog.Close className='flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'>
							<X className='h-4 w-4' />
							<span className='sr-only'>Закрити</span>
						</Dialog.Close>
					</div>

					{/* Body */}
					{isEmpty ? (
						<div className='flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
								<ShoppingCart className='h-7 w-7 text-muted-foreground' />
							</div>
							<div>
								<p className='font-semibold'>Кошик порожній</p>
								<p className='mt-1 text-sm text-muted-foreground'>
									Додайте товари, щоб почати покупки
								</p>
							</div>
							<Dialog.Close asChild>
								<Link
									href={UI_URLS.CATALOG.FILAMENT}
									className='mt-2 rounded-lg border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20'
								>
									Перейти до каталогу
								</Link>
							</Dialog.Close>
						</div>
					) : (
						<div className='flex-1 space-y-2 overflow-y-auto px-4 py-3'>
							{displayItems.map(item => (
								<div
									key={item.variant_id}
									className='flex gap-3 rounded-xl border border-border/50 bg-card p-3'
								>
									{/* Thumbnail + name — clickable, opens in new tab */}
									<Link
										href={item.slug ? `/products/${item.slug}` : '#'}
										target='_blank'
										rel='noopener noreferrer'
										className='group flex shrink-0'
									>
										<div className='relative h-16 w-16 overflow-hidden rounded-lg bg-muted transition-opacity group-hover:opacity-80'>
											{item.thumbnail ? (
												<Image
													src={item.thumbnail}
													alt={item.name}
													fill
													className='object-cover'
													sizes='64px'
												/>
											) : (
												<div className='flex h-full w-full items-center justify-center'>
													<Package className='h-5 w-5 text-muted-foreground' />
												</div>
											)}
										</div>
									</Link>

									{/* Info */}
									<div className='flex min-w-0 flex-1 flex-col gap-1.5'>
										<Link
											href={item.slug ? `/products/${item.slug}` : '#'}
											target='_blank'
											rel='noopener noreferrer'
											className='line-clamp-2 text-sm font-medium leading-tight hover:text-primary transition-colors'
										>
											{item.name}
										</Link>
										<p className='text-sm font-bold text-primary'>
											{item.price.toLocaleString('uk-UA')} ₴
										</p>
										<div className='flex items-center justify-between'>
											{/* Quantity controls */}
											<div className='flex items-center rounded-md border border-border'>
												<button
													onClick={() => handleDecrease(item.variant_id, item.quantity)}
													disabled={item.quantity <= 1}
													className='flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40'
													aria-label='Зменшити'
												>
													<Minus className='h-3 w-3' />
												</button>
												<span className='w-7 text-center text-xs font-medium'>
													{item.quantity}
												</span>
												<button
													onClick={() =>
														handleIncrease(item.variant_id, item.quantity, item.stock)
													}
													disabled={
														item.stock !== undefined && item.quantity >= item.stock
													}
													className='flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40'
													aria-label='Збільшити'
												>
													<Plus className='h-3 w-3' />
												</button>
											</div>
											{/* Remove */}
											<button
												onClick={() => handleRemove(item.variant_id)}
												className='flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive'
												aria-label='Видалити'
											>
												<Trash2 className='h-3.5 w-3.5' />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Footer */}
					{!isEmpty && (
						<div className='space-y-3 border-t border-border/50 px-5 py-4'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>Разом</span>
								<span className='text-xl font-bold text-primary'>
									{total.toLocaleString('uk-UA')} ₴
								</span>
							</div>
							<button
								disabled
								className='w-full cursor-not-allowed rounded-xl bg-primary/30 px-4 py-3 text-sm font-semibold text-primary-foreground/50'
							>
								Перейти до оформлення
							</button>
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
