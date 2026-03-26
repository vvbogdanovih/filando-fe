import { notFound } from 'next/navigation'
import { env } from '@/env'
import { ProductPage } from './ProductPage'

interface PageProps {
    params: Promise<{ category: string; subcategory: string; slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { category, subcategory, slug } = await params

    let data
    try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/products/by-slug/${slug}`, {
            cache: 'no-store',
        })
        if (!res.ok) notFound()
        data = await res.json()
    } catch {
        notFound()
    }

    if (!data?.variant) notFound()

    return <ProductPage data={data} categorySlug={category} subcategorySlug={subcategory} />
}
