import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login']

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

async function validateSessionCookie(sessionCookie: string): Promise<boolean> {
	try {
		const response = await fetch(
			'https://verifysessioncookie-ag7er5qhga-ew.a.run.app',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: `sessionCookie=${sessionCookie}`,
				},
			}
		)

		return response.ok
	} catch (_e) {
		return false
	}
}

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const sessionCookie = request.cookies.get('managementSessionCookie')?.value

	// if public path, apply internationalization
	if (isPublicPath(pathname)) {
		if (sessionCookie) {
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
	if (!sessionCookie) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		return NextResponse.redirect(loginUrl)
	}

	// if invalid session cookie, redirect to login
	const isValidCookie = await validateSessionCookie(sessionCookie)

	if (!isValidCookie) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		const response = NextResponse.redirect(loginUrl)

		// clear invalid session cookie
		response.cookies.delete('managementSessionCookie')
		return response
	}

	// if all checks passed, apply internationalization
	return createMiddleware(routing)(request)
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
	],
}
