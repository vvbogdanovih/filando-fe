import { z } from 'zod'

export const createOrderResponseSchema = z.object({
	order_number: z.coerce.number()
})

export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>
