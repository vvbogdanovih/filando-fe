'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../auth.api'
import { loginSchema, type LoginValues } from '../auth.schema'
import { FcGoogle } from 'react-icons/fc'
import { useAuthStore } from '@/common/store/useAuthStore'
import { API_BASE_URL, API_URLS, UI_URLS } from '@/common/constants'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput
} from '@/common/components/ui/input-group'

export const Login = () => {
	const setUser = useAuthStore(state => state.setUser)
	const [showPassword, setShowPassword] = useState(false)

	const { mutate: login, isPending } = useMutation({
		mutationFn: (data: LoginValues) => authApi.login(data),
		onSuccess: data => setUser(data.user)
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid }
	} = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: ''
		}
	})

	const onSubmit = (data: LoginValues) => {
		login(data)
	}

	return (
		<div className='flex h-screen flex-col items-center justify-center'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-100 p-10 shadow-xl'
			>
				<div className='text-2xl font-bold'>Login</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						placeholder='email@example.com'
						autoComplete='email'
						{...register('email')}
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p className='text-destructive text-sm'>{errors.email.message}</p>
					)}
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='password'>Password</Label>
					<InputGroup>
						<InputGroupInput
							id='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
							autoComplete='current-password'
							{...register('password')}
							aria-invalid={!!errors.password}
						/>
						<InputGroupAddon align='inline-end'>
							<InputGroupButton
								size='icon-xs'
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? <EyeOff /> : <Eye />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
					{errors.password && (
						<p className='text-destructive text-sm'>{errors.password.message}</p>
					)}
				</div>

				<Button type='submit' disabled={!isValid || isSubmitting || isPending}>
					{isSubmitting || isPending ? 'Loading...' : 'Login'}
				</Button>

				<p className='text-muted-foreground text-center text-sm'>
					Немає аккаунта?{' '}
					<Link
						href={UI_URLS.AUTH.REGISTER}
						className='text-primary font-medium hover:underline'
					>
						Зареєструватися
					</Link>
				</p>

				<div className='border-border border-t pt-8'>
					<Button
						type='button'
						variant='outline'
						className='w-full'
						onClick={() => {
							window.location.href = API_BASE_URL + API_URLS.AUTH.GOOGLE
						}}
					>
						<FcGoogle className='size-5' />
						Увійти через Google
					</Button>
				</div>
			</form>
		</div>
	)
}
