import { httpService } from '@/common/services/http.service'
import { API_URLS } from '@/common/constants'

export interface CatalogItem {
    id: string
    name: string
    slug: string
    sku: string
    price: number
    v_value: string | null
    attributes: { k: string; l: string; v: string | number | boolean }[]
    main_image: string | null
}

export interface ProductDetailData {
    variant: {
        id: string
        name: string
        slug: string
        sku: string
        price: number
        stock: number
        images: string[]
        v_value: string | null
        vendor_product_sku: string | null
        status: string
    }
    product: {
        id: string
        name: string
        description: { html: string; json: any } | null
        attributes: { k: string; l: string; v: string | number | boolean }[]
        variant_type: { key: string; label: string } | null
    }
    siblings: { id: string; name: string; slug: string; price: number; v_value: string | null; images: string[] }[]
}

export interface CatalogResponse {
    items: CatalogItem[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
    price_range: { min: number; max: number }
    filter_options: Record<string, string[]>
}

export type CatalogQueryParams = Record<string, string> & { subcategory_id: string }

export const getCatalogProducts = (params: CatalogQueryParams): Promise<CatalogResponse> => {
    return httpService.get<CatalogResponse>(API_URLS.PRODUCTS.CATALOG, { params })
}

export const getVariantBySlug = (slug: string): Promise<ProductDetailData> => {
    return httpService.get<ProductDetailData>(API_URLS.PRODUCTS.BY_SLUG(slug))
}
