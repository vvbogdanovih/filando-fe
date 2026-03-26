import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { env } from '@/env'
import { categorySchema } from '@/app/admin/categories/categories.schema'
import { CatalogPage } from './CatalogPage'

interface PageProps {
    params: Promise<{ category: string; subcategory: string }>
}

export default async function CategorySubcategoryPage({ params }: PageProps) {
    const { category, subcategory } = await params

    let categoryData
    try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/categories/slug/${category}`, {
            cache: 'no-store',
        })
        if (!res.ok) notFound()
        categoryData = await res.json()
    } catch {
        notFound()
    }

    const parsed = categorySchema.safeParse(categoryData)
    if (!parsed.success) notFound()

    const sub = parsed.data.subcategories.find(s => s.slug === subcategory)
    if (!sub) notFound()

    return (
        <Suspense>
            <CatalogPage subcategory={sub} categorySlug={category} subcategorySlug={subcategory} />
        </Suspense>
    )
}
