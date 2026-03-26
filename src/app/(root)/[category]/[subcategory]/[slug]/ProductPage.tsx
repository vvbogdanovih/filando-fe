'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/common/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import { cn } from '@/common/utils/shad-cn.utils'
import { ProductDetailData } from '../catalog.api'

interface ProductPageProps {
    data: ProductDetailData
    categorySlug: string
    subcategorySlug: string
}

export const ProductPage = ({ data, categorySlug, subcategorySlug }: ProductPageProps) => {
    const { variant, product, siblings } = data
    const images = variant.images
    const [currentIndex, setCurrentIndex] = useState(0)
    const router = useRouter()

    const prev = useCallback(() => setCurrentIndex(i => (i - 1 + images.length) % images.length), [images.length])
    const next = useCallback(() => setCurrentIndex(i => (i + 1) % images.length), [images.length])

    const catalogPath = `/${categorySlug}/${subcategorySlug}`

    return (
        <div className='container mx-auto max-w-7xl px-4 py-8'>
            <nav className='mb-6 flex items-center gap-2 text-sm text-muted-foreground'>
                <Link href={catalogPath} className='hover:text-foreground transition-colors'>
                    {subcategorySlug}
                </Link>
                <span>/</span>
                <span className='text-foreground'>{variant.name}</span>
            </nav>

            <div className='flex flex-col gap-8 lg:flex-row'>
                {/* Image gallery */}
                <div className='flex flex-col gap-3 lg:w-1/2'>
                    <div className='relative aspect-square overflow-hidden rounded-xl bg-muted'>
                        {images.length > 0 ? images.map((img, i) => (
                            <Image
                                key={img}
                                src={img}
                                alt={`${variant.name} ${i + 1}`}
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
                                        alt={`${variant.name} ${i + 1}`}
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
                    <h1 className='text-2xl font-bold'>{variant.name}</h1>

                    {/* Variant switcher */}
                    {siblings.length > 1 && (
                        <div>
                            <p className='mb-2 text-sm text-muted-foreground'>
                                {product.variant_type?.label ?? 'Варіація'}:
                            </p>
                            <Select
                                value={variant.slug}
                                onValueChange={slug => router.push(`${catalogPath}/${slug}`)}
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
                            {product.attributes.map(attr => (
                                <tr key={attr.k} className='border-b border-border/50 last:border-0'>
                                    <td className='py-2 pr-8 text-muted-foreground w-1/2'>{attr.l}</td>
                                    <td className='py-2 font-medium'>{String(attr.v)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
