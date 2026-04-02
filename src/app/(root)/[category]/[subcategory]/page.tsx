import { Suspense } from 'react'
import { CatalogPage } from './CatalogPage'

interface PageProps {
    params: Promise<{ category: string; subcategory: string }>
}

export default async function CategorySubcategoryPage({ params }: PageProps) {
    const { category, subcategory } = await params

    return (
        <Suspense>
            <CatalogPage categorySlug={category} subcategorySlug={subcategory} />
        </Suspense>
    )
}
