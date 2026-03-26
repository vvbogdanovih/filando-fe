import { CatalogItem } from '../catalog.api'
import { CatalogProductCard } from './CatalogProductCard'

interface ProductGridProps {
    items: CatalogItem[]
    isLoading: boolean
    basePath: string
}

const SkeletonCard = () => (
    <div className='bg-card rounded-xl overflow-hidden border border-border/50 animate-pulse'>
        <div className='aspect-square bg-muted' />
        <div className='p-3 space-y-2'>
            <div className='h-4 bg-muted rounded w-3/4' />
            <div className='h-4 bg-muted rounded w-1/3' />
        </div>
    </div>
)

export const ProductGrid = ({ items, isLoading, basePath }: ProductGridProps) => {
    if (isLoading) {
        return (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className='flex items-center justify-center py-24'>
                <p className='text-muted-foreground'>Товарів не знайдено</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {items.map(item => (
                <CatalogProductCard key={item.id} item={item} href={`${basePath}/${item.slug}`} />
            ))}
        </div>
    )
}
