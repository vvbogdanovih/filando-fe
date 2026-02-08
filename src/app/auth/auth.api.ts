import { API_URLS } from '@/common/constants'
import { httpService } from '@/common/services/http.service'
import { authResponseSchema, LoginValues, RegisterValues } from './auth.schema'

export const authApi = {
	login: async (data: LoginValues) => {
		return await httpService.post(API_URLS.AUTH.LOGIN, data, {
			schema: authResponseSchema
		})
	},
	register: async (data: RegisterValues) => {
		return await httpService.post(API_URLS.AUTH.REGISTER, data, {
			schema: authResponseSchema
		})
	},
	getMe: async () => {
		return await httpService.get(API_URLS.AUTH.ME, {
			schema: authResponseSchema
		})
	}
}
