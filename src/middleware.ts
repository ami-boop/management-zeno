import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/']

function isPublicPath(pathname: string): boolean {
	const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')

	return PUBLIC_PATHS.some(publicPath => {
		if (publicPath === '/') {
			return cleanPath === '/' || cleanPath === ''
		}
		return cleanPath === publicPath || cleanPath.startsWith(publicPath + '/')
	})
}

function getLocaleFromPath(pathname: string): string {
	const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
	return match ? match[1] : 'en'
}

function getRoleFromAuthHeader(authHeader: string): string | null {
	try {
		const token = authHeader.slice(7).trim()
		const [, payload] = token.split('.')
		if (!payload) return null
		const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
		const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
		const decoded = JSON.parse(atob(padded)) as { role?: unknown }
		return typeof decoded.role === 'string' ? decoded.role : null
	} catch {
		return null
	}
}

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const authHeader = request.headers.get('authorization')
	const hasSession = !!authHeader?.toLowerCase().startsWith('bearer ')
	const role = hasSession && authHeader ? getRoleFromAuthHeader(authHeader) : null

	// if public path, apply internationalization
	if (isPublicPath(pathname)) {
		if (hasSession && role === 'admin') {
			return NextResponse.redirect(
				new URL(
					`/${getLocaleFromPath(pathname)}/dashboard`,
					request.nextUrl.origin
				)
			)
		}
		// A signed-in non-admin (e.g. a parent session from zeno sharing this
		// origin) must be able to reach the login form to switch accounts.
		return createMiddleware(routing)(request)
	}

	// if no bearer token, redirect to login
	if (!hasSession) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		return NextResponse.redirect(loginUrl)
	}

	// Same-origin collision with zeno (dev): a non-admin token reaches the
	// admin app and every API call would 403. Bounce to login instead.
	if (role !== 'admin') {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		return NextResponse.redirect(loginUrl)
	}

	// Просто проверяем наличие cookie, валидацию делаем на стороне сервера при необходимости
	// Это ускоряет навигацию в 10+ раз
	return createMiddleware(routing)(request)
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
	],
}
