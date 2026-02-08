import { z } from 'zod'
export enum Role {
	USER = 'USER',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN'
}

const roleSchema = z.enum(Role)

export const userSchema = z.object({
	id: z.string(),
	role: roleSchema,
	email: z.string(),
	name: z.string(),
	picture: z.string().nullable()
})
