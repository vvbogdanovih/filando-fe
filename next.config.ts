import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
	reactCompiler: true,
	images: {
		// `deviceSizes` only caps the *output* width; Sharp still downloads/decodes the full S3
		// object per request, which can OOM a 1–2 GB VPS. Serve remote URLs as-is (browser → S3).
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'filando.s3.eu-north-1.amazonaws.com'
			}
		]
	}
}

export default nextConfig
