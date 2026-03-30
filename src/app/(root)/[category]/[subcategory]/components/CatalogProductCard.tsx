'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { CatalogItem } from '../catalog.api'
import { useCartStore } from '@/common/store/useCartStore'
import { cn } from '@/common/utils/shad-cn.utils'

interface CatalogProductCardProps {
    item: CatalogItem
    href: string
}

export const CatalogProductCard = ({ item, href }: CatalogProductCardProps) => {
    const addItem = useCartStore(s => s.addItem)
    const openCart = useCartStore(s => s.openCart)
    const inAuthCart = useCartStore(s => s.items.some(i => i.variant_id === item.id))
    const inGuestCart = useCartStore(s => s.guestItems.some(i => i.variant_id === item.id))
    const isInCart = inAuthCart || inGuestCart
    const [isAdding, setIsAdding] = useState(false)

    const isOutOfStock = item.stock === 0

    const handleCartButton = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isInCart) {
            openCart()
            return
        }

        if (isAdding || isOutOfStock) return
        setIsAdding(true)
        try {
            await addItem(item.id, 1, { name: item.name, price: item.price, thumbnail: item.main_image, slug: item.slug })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Не вдалося додати до кошика')
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className='card-hover bg-card rounded-xl overflow-hidden border border-border/50 shadow-lg shadow-black/10 flex flex-col'>
            <Link href={href} className='block flex-1'>
                <div className='p-3 pb-0'>
                    <div className='relative aspect-square bg-muted rounded-lg overflow-hidden'>
                        {item.main_image ? (
                            <Image
                                src={item.main_image}
                                alt={item.name}
                                fill
                                className='object-cover'
                                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                            />
                        ) : (
                            <div className='w-full h-full flex items-center justify-center'>
                                <span className='text-muted-foreground text-xs'>Немає фото</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='p-3 space-y-1'>
                    <p className='text-sm font-medium leading-tight line-clamp-2'>{item.name}</p>
                    <p className='text-muted-foreground text-xs'>Арт. {item.sku}</p>
                    <p className='text-primary font-bold text-lg'>
                        {item.price.toLocaleString('uk-UA')} ₴
                    </p>
                </div>
            </Link>
            <div className='px-3 pb-3'>
                <button
                    onClick={handleCartButton}
                    disabled={isAdding || isOutOfStock}
                    className={cn(
                        'w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isOutOfStock
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : isInCart
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 disabled:opacity-60'
                    )}
                >
                    {isAdding ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : isOutOfStock ? (
                        'Немає в наявності'
                    ) : isInCart ? (
                        <>
                            <Check className='h-4 w-4' />
                            В кошику
                        </>
                    ) : (
                        <>
                            <ShoppingCart className='h-4 w-4' />
                            В кошик
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
