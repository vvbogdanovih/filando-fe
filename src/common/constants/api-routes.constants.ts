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
	}
}
