import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './provider'
import { SITE_DESCRIPTION, SITE_NAME } from '@/common/constants/seo.constants'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: { absolute: SITE_NAME, template: `%s | ${SITE_NAME}` },
	description: SITE_DESCRIPTION
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ua'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center antialiased`}
				suppressHydrationWarning={true}
			>
				<Providers>
					<main className='flex w-full items-center justify-center'>
						<div className='w-full max-w-7xl'>{children}</div>
					</main>
				</Providers>
			</body>
		</html>
	)
}
