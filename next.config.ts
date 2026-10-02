import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withBundleAnalyzer from '@next/bundle-analyzer'

const isDev = process.env.NODE_ENV !== 'production'

// Origins the app actually talks to:
//  - cdn.jsdelivr.net: MapLibre GL JS module + stylesheet (dynamically imported)
//  - tiles.openfreemap.org: map style, tiles, sprites and glyphs
//  - *.googleapis.com / *.firebaseio.com / gstatic: Firebase Auth + Firestore
//    (HTTPS + WebSocket channels from NotificationListener)
const CSP = [
	"default-src 'self'",
	// 'unsafe-inline': Next.js hydration bootstrap + the theme-init inline script.
	// 'unsafe-eval': dev-only (Turbopack/HMR); production build does not need it.
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://cdn.jsdelivr.net https://www.gstatic.com https://apis.google.com`,
	"style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
	"img-src 'self' data: blob: https://tiles.openfreemap.org",
	"font-src 'self' data:",
	"connect-src 'self' https://cdn.jsdelivr.net https://tiles.openfreemap.org https://*.googleapis.com https://*.firebaseio.com wss://*.googleapis.com wss://*.firebaseio.com",
	"worker-src 'self' blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
].join('; ')

const securityHeaders = [
	{ key: 'Content-Security-Policy', value: CSP },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
	async headers() {
		return [{ source: '/:path*', headers: securityHeaders }]
	},
}

const withNextIntl = createNextIntlPlugin()
export default withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})(withNextIntl(nextConfig))
