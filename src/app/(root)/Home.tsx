'use client'

import { useAuthStore } from '@/common/store/useAuthStore'

export const Home = () => {
	const logOut = useAuthStore(state => state.logOut)

	return (
		<div>
			<div>Вітаю, ти дома</div>
			<button onClick={logOut}>Logout (test)</button>
		</div>
	)
}
