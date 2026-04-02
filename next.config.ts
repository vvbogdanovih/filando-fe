import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	reactCompiler: true,
	images: {
		// Cap at 1920 so /_next/image never requests 3840px wide sources (OOM on small VPS).
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'filando.s3.eu-north-1.amazonaws.com'
			}
		]
	}
}

export default nextConfig
