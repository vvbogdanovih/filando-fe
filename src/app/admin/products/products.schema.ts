import { z } from 'zod'

// --- Attribute item ---

export const attributeItemSchema = z.object({
	k: z.string(), // slug key, generated via toSlug(label)
	l: z.string().min(1, 'Назва атрибута є обов\'язковою'),
	v: z.union([z.string(), z.number(), z.boolean()])
})

// --- Variant item (form) ---

export const variantFormItemSchema = z.object({
	v_value: z.string().nullable(),
	sku: z.string().min(1, 'SKU є обов\'язковим'),
	price: z
		.string()
		.min(1, 'Ціна є обов\'язковою')
		.refine(v => !isNaN(Number(v)) && Number(v) >= 0, 'Введіть коректну ціну'),
	stock: z
		.string()
		.min(1, 'Кількість є обов\'язковою')
		.refine(v => !isNaN(Number(v)) && Number(v) >= 0, 'Введіть коректну кількість'),
	images: z.array(z.string()) // public URLs, populated after upload
})

// --- Main product form schema ---

export const productFormSchema = z
	.object({
		name: z.string().min(1, 'Назва продукту є обов\'язковою'),
		vendor_id: z.string().min(1, 'Оберіть вендора'),
		category_id: z.string().min(1, 'Оберіть категорію'),
		subcategory_id: z.string().min(1, 'Оберіть підкатегорію'),
		attributes: z.array(attributeItemSchema),
		has_variants: z.boolean(),
		variant_type_key: z.string().nullable(),
		variants: z.array(variantFormItemSchema).min(1)
	})
	.superRefine((data, ctx) => {
		if (data.has_variants) {
			if (!data.variant_type_key) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['variant_type_key'],
					message: 'Оберіть ознаку варіативності'
				})
			}
			data.variants.forEach((v, i) => {
				if (!v.v_value || v.v_value.trim() === '') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['variants', i, 'v_value'],
						message: 'Значення варіанта є обов\'язковим'
					})
				}
			})
		}
	})

// --- API response schemas ---

export const productVariantResponseSchema = z.object({
	_id: z.string(),
	v_value: z.string().nullable(),
	sku: z.string(),
	price: z.number(),
	stock: z.number(),
	images: z.array(z.string())
})

export const productResponseSchema = z.object({
	_id: z.string(),
	name: z.string(),
	slug: z.string(),
	category_id: z.string(),
	subcategory_id: z.string(),
	description: z
		.object({
			json: z.record(z.string(), z.unknown()),
			html: z.string()
		})
		.nullable(),
	attributes: z.array(attributeItemSchema),
	variant_type: z
		.object({
			key: z.string(),
			label: z.string()
		})
		.nullable(),
	variants: z.array(productVariantResponseSchema),
	createdAt: z.string(),
	updatedAt: z.string()
})

export const validateResponseSchema = z.object({
	errors: z.record(
		z.string(), // variant index as string key
		z.object({
			slug: z.string().optional(),
			sku: z.string().optional()
		})
	)
})

// --- Types ---

export type AttributeItem = z.infer<typeof attributeItemSchema>
export type VariantFormItem = z.infer<typeof variantFormItemSchema>
export type ProductFormValues = z.infer<typeof productFormSchema>
export type Product = z.infer<typeof productResponseSchema>
export type ProductVariant = z.infer<typeof productVariantResponseSchema>
export type ValidateResponse = z.infer<typeof validateResponseSchema>
