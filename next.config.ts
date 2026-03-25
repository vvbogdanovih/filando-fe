import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'filando.s3.eu-north-1.amazonaws.com',
			},
		],
	},
}

export default nextConfig
