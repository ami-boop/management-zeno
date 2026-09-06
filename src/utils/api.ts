import { API_URL } from '@/constants'

/** Build a full API URL with optional query params. */
export function buildApiUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
	const url = new URL(`${API_URL}/${endpoint.replace(/^\/+/, '')}`)
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

/** Standard auth headers for API requests. */
export function authHeaders(token: string): HeadersInit {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
}