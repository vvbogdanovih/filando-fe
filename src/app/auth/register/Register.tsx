'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../auth.api'
import { registerSchema, type RegisterValues } from '../auth.schema'
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

export const Register = () => {
	const setUser = useAuthStore(state => state.setUser)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const { mutate: register, isPending } = useMutation({
		mutationFn: (data: RegisterValues) => authApi.register(data),
		onSuccess: data => setUser(data.user)
	})

	const {
		register: registerField,
		handleSubmit,
		formState: { errors, isSubmitting, isValid }
	} = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	})

	const onSubmit = (data: RegisterValues) => {
		register(data)
	}

	return (
		<div className='flex h-screen flex-col items-center justify-center'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-100 p-10 shadow-xl'
			>
				<div className='text-2xl font-bold'>Register</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='name'>Name</Label>
					<Input
						id='name'
						type='text'
						placeholder='John Doe'
						autoComplete='name'
						{...registerField('name')}
						aria-invalid={!!errors.name}
					/>
					{errors.name && (
						<p className='text-destructive text-sm'>{errors.name.message}</p>
					)}
				</div>

				<div className='flex flex-col gap-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						placeholder='email@example.com'
						autoComplete='email'
						{...registerField('email')}
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
							autoComplete='new-password'
							{...registerField('password')}
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

				<div className='flex flex-col gap-2'>
					<Label htmlFor='confirmPassword'>Confirm Password</Label>
					<InputGroup>
						<InputGroupInput
							id='confirmPassword'
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder='••••••••'
							autoComplete='new-password'
							{...registerField('confirmPassword')}
							aria-invalid={!!errors.confirmPassword}
						/>
						<InputGroupAddon align='inline-end'>
							<InputGroupButton
								size='icon-xs'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
							>
								{showConfirmPassword ? <EyeOff /> : <Eye />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
					{errors.confirmPassword && (
						<p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>
					)}
				</div>

				<Button type='submit' disabled={!isValid || isSubmitting || isPending}>
					{isSubmitting || isPending ? 'Loading...' : 'Register'}
				</Button>

				<p className='text-muted-foreground text-center text-sm'>
					Вже маєте аккаунт?{' '}
					<Link
						href={UI_URLS.AUTH.LOGIN}
						className='text-primary font-medium hover:underline'
					>
						Увійти
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
