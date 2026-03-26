import { env } from '@/env'

export const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL

export const API_URLS = {
	AUTH: {
		GOOGLE: `/auth/google`, // GET  — redirects to Google OAuth consent screen
		LOGIN: `/auth/login`, // POST — { email, password } → { message, user }
		REGISTER: `/auth/register`, // POST — { name, email, password } → { message, user }
		REFRESH: `/auth/refresh`, // POST — refreshes access token via HttpOnly cookie
		LOGOUT: `/auth/logout`, // POST — clears the session cookie server-side
		ME: `/auth/me` // GET  — returns current user from active cookie session
	},
	CATEGORIES: {
		WITH_SUBCATEGORIES: `/categories/with-subcategories`, // GET  — full list with embedded subcategory trees
		BASE: `/categories`, // POST — create category
		BY_ID: (id: string) => `/categories/${id}`, // GET/PATCH/DELETE
		BY_SLUG: (slug: string) => `/categories/slug/${slug}`, // GET — resolve slug to category doc
		SUBCATEGORIES: (catId: string) => `/categories/${catId}/subcategories`, // GET/POST
		SUBCATEGORY_BY_ID: (catId: string, subId: string) =>
			`/categories/${catId}/subcategories/${subId}` // GET/PATCH/DELETE
	},
	VENDORS: {
		BASE: `/vendors`, // GET (list all) / POST (create)
		BY_ID: (id: string) => `/vendors/${id}`, // GET / PATCH / DELETE
		CHECK_AVAILABILITY: `/vendors/check-availability` // GET ?slug=...
	},
	UPLOAD: {
		PRESIGN: `/upload/presign`, // POST — get presigned S3 URL
		CONFIRM: `/upload/confirm` // POST — confirm upload
	},
	PRODUCTS: {
		BASE: `/products`, // GET (list) / POST (create)
		CATALOG: `/products/catalog`, // GET — paginated, filtered catalog for a subcategory
		BY_SLUG: (slug: string) => `/products/by-slug/${slug}`, // GET — variant detail + product + siblings
		BY_ID: (id: string) => `/products/${id}`, // GET / PATCH / DELETE
		VALIDATE: `/products/validate`, // POST — check slug + SKU uniqueness before create
		VARIANTS: (id: string) => `/products/${id}/variants`, // GET (list) / POST (add variant)
		VARIANT_BY_ID: (id: string, variantId: string) => `/products/${id}/variants/${variantId}`, // GET / PATCH / DELETE
		VARIANT_IMAGES: (id: string, variantId: string) => `/products/${id}/variants/${variantId}/images` // PATCH — set variant images
	}
}
