import { Suspense } from 'react'
import { ProductPage } from './ProductPage'

interface PageProps {
	params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
	const { slug } = await params

	return (
		<Suspense>
			<ProductPage slug={slug} />
		</Suspense>
	)
}
