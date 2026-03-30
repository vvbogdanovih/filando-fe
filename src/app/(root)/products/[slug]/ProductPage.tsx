'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Loader2, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge } from '@/common/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import { cn } from '@/common/utils/shad-cn.utils'
import { useCartStore } from '@/common/store/useCartStore'
import { ProductDetailData } from '@/app/(root)/[category]/[subcategory]/catalog.api'

interface ProductPageProps {
    data: ProductDetailData
}

export const ProductPage = ({ data }: ProductPageProps) => {
    const { variant, product, siblings, category_slug, subcategory_slug } = data
    const images = variant.images
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const router = useRouter()
    const addItem = useCartStore(s => s.addItem)
    const openCart = useCartStore(s => s.openCart)
    const inAuthCart = useCartStore(s => s.items.some(i => i.variant_id === variant.id))
    const inGuestCart = useCartStore(s => s.guestItems.some(i => i.variant_id === variant.id))
    const isInCart = inAuthCart || inGuestCart

    const prev = useCallback(() => setCurrentIndex(i => (i - 1 + images.length) % images.length), [images.length])
    const next = useCallback(() => setCurrentIndex(i => (i + 1) % images.length), [images.length])

    const catalogPath = `/${category_slug}/${subcategory_slug}`
    const displayName = variant.v_value ? `${product.name} — ${variant.v_value}` : variant.name
    const isOutOfStock = variant.stock === 0
    const isLowStock = variant.stock > 0 && variant.stock <= 5

    const handleAddToCart = async () => {
        if (isInCart) {
            openCart()
            return
        }
        setIsAdding(true)
        setAddError(null)
        try {
            await addItem(variant.id, quantity, {
                name: displayName,
                price: variant.price,
                thumbnail: variant.images[0] ?? null,
                slug: variant.slug,
            })
        } catch (err) {
            setAddError(err instanceof Error ? err.message : 'Не вдалося додати до кошика')
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className='container mx-auto max-w-7xl px-4 py-8'>
            <nav className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'>
                <Link href={catalogPath} className='hover:text-foreground transition-colors'>
                    {subcategory_slug}
                </Link>
                <span>/</span>
                <span className='text-foreground'>{displayName}</span>
            </nav>

            <div className='flex flex-col gap-8 lg:flex-row'>
                {/* Image gallery */}
                <div className='flex flex-col gap-3 lg:w-1/2'>
                    <div className='relative aspect-square overflow-hidden rounded-xl bg-muted'>
                        {images.length > 0 ? images.map((img, i) => (
                            <Image
                                key={img}
                                src={img}
                                alt={`${displayName} ${i + 1}`}
                                fill
                                className={cn('object-cover transition-opacity duration-300', i === currentIndex ? 'opacity-100' : 'opacity-0')}
                                sizes='(max-width: 1024px) 100vw, 50vw'
                                priority={i === 0}
                            />
                        )) : (
                            <div className='flex h-full w-full items-center justify-center'>
                                <span className='text-muted-foreground text-sm'>Немає фото</span>
                            </div>
                        )}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className='absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60'
                                    aria-label='Попереднє фото'
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={next}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60'
                                    aria-label='Наступне фото'
                                >
                                    ›
                                </button>
                                <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5'>
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentIndex(i)}
                                            className={cn(
                                                'h-1.5 rounded-full transition-all',
                                                i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                                            )}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className='flex gap-2 overflow-x-auto'>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={cn(
                                        'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                                        i === currentIndex
                                            ? 'border-primary'
                                            : 'border-border hover:border-muted-foreground'
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`${displayName} ${i + 1}`}
                                        fill
                                        className='object-cover'
                                        sizes='64px'
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className='flex flex-col gap-5 lg:w-1/2'>
                    <h1 className='text-2xl font-bold'>{displayName}</h1>

                    {/* Variant switcher */}
                    {siblings.length > 1 && (
                        <div>
                            <p className='mb-2 text-sm text-muted-foreground'>
                                {product.variant_type?.label ?? 'Варіація'}:
                            </p>
                            <Select
                                value={variant.slug}
                                onValueChange={slug => router.push(`/products/${slug}`)}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {siblings.map(s => (
                                        <SelectItem key={s.id} value={s.slug}>
                                            {s.v_value ?? s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <Badge
                        className={cn(
                            'w-fit',
                            variant.stock > 0
                                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                : 'border-border bg-muted text-muted-foreground'
                        )}
                        variant='outline'
                    >
                        {variant.stock > 0 ? 'В наявності' : 'Немає в наявності'}
                    </Badge>

                    <div>
                        <p className='text-3xl font-bold text-primary'>
                            {variant.price.toLocaleString('uk-UA')} ₴
                        </p>
                        <span className='text-sm text-muted-foreground'>Арт. {variant.sku}</span>
                    </div>

                    {/* Add to cart */}
                    <div className='flex flex-col gap-3'>
                        {isLowStock && (
                            <p className='text-sm text-amber-400'>Залишилось лише {variant.stock} шт.</p>
                        )}
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center rounded-lg border border-border'>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1 || isOutOfStock}
                                    className='flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40'
                                    aria-label='Зменшити кількість'
                                >
                                    <Minus className='h-3.5 w-3.5' />
                                </button>
                                <span className='w-10 text-center text-sm font-medium'>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(variant.stock, q + 1))}
                                    disabled={quantity >= variant.stock || isOutOfStock}
                                    className='flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40'
                                    aria-label='Збільшити кількість'
                                >
                                    <Plus className='h-3.5 w-3.5' />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isAdding}
                                className={cn(
                                    'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                                    isOutOfStock
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                        : isInCart
                                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                          : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60'
                                )}
                            >
                                {isAdding ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : isInCart ? (
                                    <Check className='h-4 w-4' />
                                ) : (
                                    <ShoppingCart className='h-4 w-4' />
                                )}
                                {isOutOfStock ? 'Немає в наявності' : isInCart ? 'В кошику' : 'Додати в кошик'}
                            </button>
                        </div>
                        {addError && (
                            <p className='text-sm text-destructive'>{addError}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            {product.description?.html && (
                <div className='mt-8 rounded-xl border border-border/50 bg-card p-6 shadow-lg shadow-black/10'>
                    <div
                        className='description'
                        dangerouslySetInnerHTML={{ __html: product.description.html }}
                    />
                </div>
            )}

            {/* Attributes */}
            {product.attributes.length > 0 && (
                <div className='mt-6 rounded-xl border border-border/50 bg-card p-4 shadow-lg shadow-black/10'>
                    <table className='w-full text-sm'>
                        <tbody>
                            {product.attributes.map(attr => {
                                const isVariantAttr = product.variant_type?.key === attr.k
                                const displayValue = isVariantAttr && variant.v_value
                                    ? variant.v_value
                                    : String(attr.v)
                                return (
                                    <tr key={attr.k} className='border-b border-border/50 last:border-0'>
                                        <td className='py-2 pr-8 text-muted-foreground w-1/2'>{attr.l}</td>
                                        <td className='py-2 font-medium'>{displayValue}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
