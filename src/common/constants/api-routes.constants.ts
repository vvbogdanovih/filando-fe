export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9407/api'

export const API_URLS = {
	AUTH: {
		GOOGLE: `/auth/google`,
		LOGIN: `/auth/login`,
		REGISTER: `/auth/register`,
		REFRESH: `/auth/refresh`,
		LOGOUT: `/auth/logout`,
		ME: `/auth/me`
	}
}
