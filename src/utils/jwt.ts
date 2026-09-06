/**
 * JWT token helpers.
 */

/** Extract exp claim as epoch milliseconds, or null on parse failure. */
export function decodeJwtExpMs(idToken: string): number | null {
	try {
		const payload = idToken.split('.')[1]
		const parsed = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: unknown }
		return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null
	} catch {
		return null
	}
}