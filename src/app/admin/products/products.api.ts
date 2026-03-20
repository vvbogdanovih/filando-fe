import { httpService } from '@/common/services/http.service'
import { API_URLS } from '@/common/constants'
import { productResponseSchema, validateResponseSchema, type Product } from './products.schema'

// --- Payload types ---

interface CreateProductPayload {
	name: string
	vendor_id: string
	category_id: string
	subcategory_id: string
	description: { json: object; html: string } | null
	attributes: Array<{ k: string; l: string; v: string | number | boolean }>
	variant_type: { key: string; label: string } | null
	variants: Array<{
		v_value: string | null
		sku: string
		price: number
		stock: number
		images: string[]
	}>
}

interface UpdateProductPayload {
	variants: Array<{
		v_value: string | null
		sku: string
		price: number
		stock: number
		images: string[]
	}>
}

interface ValidatePayload {
	variants: Array<{ slug: string; sku: string }>
}

interface PresignFile {
	entityType: string
	entityId: string
	contentType: string
}

interface PresignResponse {
	files: Array<{ uploadUrl: string; publicUrl: string; key: string }>
}

// ---

export const productsApi = {
	create: (data: CreateProductPayload) =>
		httpService.post(API_URLS.PRODUCTS.BASE, data, {
			schema: productResponseSchema,
			skipErrorToast: true
		}),

	update: (id: string, data: UpdateProductPayload) =>
		httpService.patch(API_URLS.PRODUCTS.BY_ID(id), data, {
			schema: productResponseSchema,
			skipErrorToast: true
		}),

	validate: (data: ValidatePayload) =>
		httpService.post(API_URLS.PRODUCTS.VALIDATE, data, {
			schema: validateResponseSchema,
			skipErrorToast: true
		}),

	presignUpload: (payload: { files: PresignFile[] }) =>
		httpService.post<PresignResponse, typeof payload>(API_URLS.UPLOAD.PRESIGN, payload),

	confirmUpload: (keys: string[]) =>
		httpService.post<{ confirmed: string[]; failed: string[] }, { keys: string[] }>(
			API_URLS.UPLOAD.CONFIRM,
			{ keys }
		),

	/**
	 * Upload multiple image files for a product variant.
	 * Returns the list of public URLs in the same order as the input files.
	 */
	uploadImages: async (productId: string, files: File[]): Promise<string[]> => {
		if (files.length === 0) return []

		const presignResponse = await productsApi.presignUpload({
			files: files.map(f => ({
				entityType: 'product',
				entityId: productId,
				contentType: f.type as 'image/jpeg' | 'image/png' | 'image/webp'
			}))
		})

		const keys: string[] = []
		const publicUrls: string[] = []

		await Promise.all(
			presignResponse.files.map(async ({ uploadUrl, publicUrl, key }, i) => {
				const s3Res = await fetch(uploadUrl, {
					method: 'PUT',
					body: files[i],
					headers: { 'Content-Type': files[i].type }
				})
				if (!s3Res.ok) {
					throw new Error(`Помилка завантаження зображення: S3 статус ${s3Res.status}`)
				}
				keys[i] = key
				publicUrls[i] = publicUrl
			})
		)

		await productsApi.confirmUpload(keys)

		return publicUrls
	},

	/**
	 * Full create flow: POST product (with empty images) → upload images → PATCH with URLs.
	 * Returns the final product.
	 */
	createWithImages: async (
		payload: CreateProductPayload,
		variantFiles: File[][]
	): Promise<Product> => {
		// Step 1: create product skeleton (images: [] for all variants)
		const product = await productsApi.create(payload)

		// Step 2: upload images per variant (in parallel)
		const hasAnyImages = variantFiles.some(files => files.length > 0)
		if (!hasAnyImages) return product

		const uploadedUrls = await Promise.all(
			variantFiles.map(files => productsApi.uploadImages(product._id, files))
		)

		// Step 3: PATCH product with image URLs
		const updatedVariants = product.variants.map((v, i) => ({
			v_value: v.v_value,
			sku: v.sku,
			price: v.price,
			stock: v.stock,
			images: uploadedUrls[i] ?? []
		}))

		return productsApi.update(product._id, { variants: updatedVariants })
	}
}
