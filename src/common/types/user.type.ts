import { z } from 'zod'
import { Role } from '@/common/constants'

const roleSchema = z.nativeEnum(Role)

export const userSchema = z.object({
	id: z.string(),
	role: roleSchema,
	email: z.string(),
	name: z.string(),
	picture: z.string().nullable()
})

export type User = z.infer<typeof userSchema>
