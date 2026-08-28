import { API_URL } from '@/constants'

type ApiGetOptions = {
	params?: Record<string, string | number | undefined>
}

export class ApiError extends Error {
	status: number

	constructor(endpoint: string, status: number) {
		super(`api ${endpoint} failed: ${status}`)
		this.status = status
	}
}

function buildUrl(endpoint: string, params?: Record<string, string | number | undefined>): string {
	const url = new URL(`${API_URL}/${endpoint.replace(/^\/+/, '')}`)
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

function authHeaders(token: string): HeadersInit {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
}

export async function apiGet(
	endpoint: string,
	token: string,
	options?: ApiGetOptions,
): Promise<unknown> {
	const response = await fetch(buildUrl(endpoint, options?.params), {
		headers: authHeaders(token),
		cache: 'no-store',
	})
	if (!response.ok) throw new ApiError(endpoint, response.status)

	// Guard against proxies returning 200 with an empty/malformed body:
	// parse inside a try so a JSON error can never crash the caller — it
	// degrades to null instead (parse* functions then return null).
	try {
		return await response.json()
	} catch {
		return null
	}
}

export async function apiPost<TBody>(
	endpoint: string,
	token: string,
	body: TBody,
): Promise<{ ok: boolean; status: number; data: unknown | null }> {
	const response = await fetch(`${API_URL}/${endpoint.replace(/^\/+/, '')}`, {
		method: 'POST',
		headers: authHeaders(token),
		body: JSON.stringify(body),
		cache: 'no-store',
	})
	let data: unknown = null
	try {
		data = await response.json()
	} catch {
		data = null
	}
	return { ok: response.ok, status: response.status, data }
}
