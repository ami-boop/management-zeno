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

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const authHeader = request.headers.get('authorization')
	const hasSession = !!authHeader?.toLowerCase().startsWith('bearer ')

	// if public path, apply internationalization
	if (isPublicPath(pathname)) {
		if (hasSession) {
			return NextResponse.redirect(
				new URL(
					`/${getLocaleFromPath(pathname)}/dashboard`,
					request.nextUrl.origin
				)
			)
		}
		return createMiddleware(routing)(request)
	}

	// if not session cookie, redirect to login
	if (!hasSession) {
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
