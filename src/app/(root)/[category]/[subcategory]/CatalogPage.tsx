'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Subcategory } from '@/app/admin/categories/categories.schema'
import { getCatalogProducts } from './catalog.api'
import { FilterSidebar } from './components/FilterSidebar'
import { ProductGrid } from './components/ProductGrid'
import { Pagination } from './components/Pagination'

interface CatalogPageProps {
    subcategory: Subcategory
}

export const CatalogPage = ({ subcategory }: CatalogPageProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const params = Object.fromEntries(searchParams.entries())

    const { data, isLoading } = useQuery({
        queryKey: ['catalog', subcategory._id, params],
        queryFn: () => getCatalogProducts({ subcategory_id: subcategory._id, ...params }),
    })

    const updateParams = (changes: Record<string, string | null>) => {
        const next = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') {
                next.delete(key)
            } else {
                next.set(key, value)
            }
        }
        next.delete('page')
        router.replace(`?${next.toString()}`)
    }

    const setPage = (page: number) => {
        const next = new URLSearchParams(searchParams.toString())
        next.set('page', String(page))
        router.replace(`?${next.toString()}`)
    }

    return (
        <div className='container mx-auto max-w-7xl px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>{subcategory.name}</h1>
            <div className='flex gap-8'>
                <aside className='w-64 shrink-0'>
                    <FilterSidebar
                        requiredAttributes={subcategory.required_attributes}
                        priceRange={data?.price_range ?? { min: 0, max: 0 }}
                        filterOptions={data?.filter_options ?? {}}
                        searchParams={params}
                        onParamsChange={updateParams}
                    />
                </aside>
                <main className='flex-1 min-w-0'>
                    <ProductGrid items={data?.items ?? []} isLoading={isLoading} />
                    {data && data.pagination.totalPages > 1 && (
                        <Pagination pagination={data.pagination} onPageChange={setPage} />
                    )}
                </main>
            </div>
        </div>
    )
}
