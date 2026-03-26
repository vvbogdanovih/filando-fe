import Image from 'next/image'
import Link from 'next/link'
import { CatalogItem } from '../catalog.api'

interface CatalogProductCardProps {
    item: CatalogItem
    href: string
}

export const CatalogProductCard = ({ item, href }: CatalogProductCardProps) => {
    return (
        <Link href={href} className='card-hover bg-card rounded-xl overflow-hidden border border-border/50 block shadow-lg shadow-black/10'>
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
            <div className='p-3 space-y-2'>
                <p className='text-sm font-medium leading-tight line-clamp-2'>{item.name}</p>
                <p className='text-muted-foreground text-xs'>Арт. {item.sku}</p>
                <p className='text-primary font-bold text-lg'>
                    {item.price.toLocaleString('uk-UA')} ₴
                </p>
            </div>
        </Link>
    )
}
